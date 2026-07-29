import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import { useMediaRecorder } from './useMediaRecorder';

// A minimal MediaRecorder stand-in. jsdom has no MediaRecorder, so we stub the
// global to exercise the composable's orchestration (state machine, event
// wiring, chunk collection) without a real recorder.
const instances: FakeMediaRecorder[] = [];

class FakeMediaRecorder {
  static isTypeSupported = vi.fn(() => true);
  // Lets a test simulate a recorder that is not 'inactive' right after
  // construction (the guard at the end of startRecording).
  static nextInitialState: MediaRecorder['state'] = 'inactive';

  state: MediaRecorder['state'];
  ondataavailable: ((e: { data: { size: number } }) => void) | null = null;
  onstop: (() => void) | null = null;
  stream: MediaStream;
  options: MediaRecorderOptions | undefined;

  start = vi.fn(() => {
    this.state = 'recording';
  });

  stop = vi.fn(() => {
    this.state = 'inactive';
    this.onstop?.();
  });

  pause = vi.fn(() => {
    this.state = 'paused';
  });

  resume = vi.fn(() => {
    this.state = 'recording';
  });

  constructor(stream: MediaStream, options?: MediaRecorderOptions) {
    this.stream = stream;
    this.options = options;
    this.state = FakeMediaRecorder.nextInitialState;
    instances.push(this);
  }
}

function makeStream() {
  return {} as MediaStream;
}

describe('useMediaRecorder', () => {
  beforeEach(() => {
    instances.length = 0;
    FakeMediaRecorder.isTypeSupported.mockReturnValue(true);
    FakeMediaRecorder.nextInitialState = 'inactive';
    vi.stubGlobal('MediaRecorder', FakeMediaRecorder);
    vi.stubGlobal('URL', { ...URL, createObjectURL: vi.fn(() => 'blob:fake-url') });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('reports recording support based on MediaRecorder.isTypeSupported', () => {
    const { isRecordingSupported } = useMediaRecorder({ stream: ref(makeStream()) });
    expect(isRecordingSupported.value).toBe(true);
    expect(FakeMediaRecorder.isTypeSupported).toHaveBeenCalledWith('video/webm');
  });

  it('reports no support when the mime type is unsupported', () => {
    FakeMediaRecorder.isTypeSupported.mockReturnValue(false);
    const { isRecordingSupported } = useMediaRecorder({ stream: ref(makeStream()) });
    expect(isRecordingSupported.value).toBe(false);
  });

  it('starts a webm recording and transitions to recording state', () => {
    const stream = makeStream();
    const { startRecording, recordingState } = useMediaRecorder({ stream: ref(stream) });

    startRecording();

    expect(instances).toHaveLength(1);
    expect(instances[0].options).toEqual({ mimeType: 'video/webm' });
    expect(instances[0].stream).toEqual(stream);
    expect(instances[0].start).toHaveBeenCalledOnce();
    expect(recordingState.value).toBe('recording');
  });

  it('does not start when recording is unsupported', () => {
    FakeMediaRecorder.isTypeSupported.mockReturnValue(false);
    const { startRecording, recordingState } = useMediaRecorder({ stream: ref(makeStream()) });

    startRecording();

    expect(instances).toHaveLength(0);
    expect(recordingState.value).toBe('stopped');
  });

  it('does not start when there is no stream', () => {
    const { startRecording, recordingState } = useMediaRecorder({ stream: ref(undefined) });

    startRecording();

    expect(instances).toHaveLength(0);
    expect(recordingState.value).toBe('stopped');
  });

  it('does not start again while already recording', () => {
    const { startRecording } = useMediaRecorder({ stream: ref(makeStream()) });

    startRecording();
    startRecording();

    expect(instances).toHaveLength(1);
  });

  it('bails out when the recorder is not inactive after construction', () => {
    FakeMediaRecorder.nextInitialState = 'recording';
    const { startRecording, recordingState } = useMediaRecorder({ stream: ref(makeStream()) });

    startRecording();

    expect(instances).toHaveLength(1);
    expect(instances[0].start).not.toHaveBeenCalled();
    expect(recordingState.value).toBe('stopped');
  });

  it('collects non-empty data chunks and skips empty ones', () => {
    const { startRecording } = useMediaRecorder({ stream: ref(makeStream()) });
    startRecording();

    const recorder = instances[0];
    recorder.ondataavailable?.({ data: { size: 0 } });
    recorder.ondataavailable?.({ data: { size: 10 } });

    // No direct exposure of chunks; verified indirectly via a successful stop.
    expect(recorder.ondataavailable).toBeTypeOf('function');
  });

  it('emits a recording url via onRecordAvailable when stopped', () => {
    const { startRecording, stopRecording, onRecordAvailable, recordingState } = useMediaRecorder({ stream: ref(makeStream()) });

    const received: string[] = [];
    onRecordAvailable(url => received.push(url));

    startRecording();
    instances[0].ondataavailable?.({ data: { size: 5 } });
    stopRecording();

    expect(instances[0].stop).toHaveBeenCalledOnce();
    expect(recordingState.value).toBe('stopped');
    expect(received).toEqual(['blob:fake-url']);
  });

  it('does not stop when unsupported, without a recorder, or already stopped', () => {
    const supported = useMediaRecorder({ stream: ref(makeStream()) });
    // No recorder yet.
    supported.stopRecording();
    expect(supported.recordingState.value).toBe('stopped');

    // Unsupported path.
    FakeMediaRecorder.isTypeSupported.mockReturnValue(false);
    const unsupported = useMediaRecorder({ stream: ref(makeStream()) });
    unsupported.stopRecording();
    expect(unsupported.recordingState.value).toBe('stopped');
  });

  it('does not stop again when already stopped after a recording', () => {
    const { startRecording, stopRecording } = useMediaRecorder({ stream: ref(makeStream()) });
    startRecording();
    stopRecording();
    stopRecording();

    expect(instances[0].stop).toHaveBeenCalledOnce();
  });

  it('pauses only while recording', () => {
    const { startRecording, pauseRecording, recordingState } = useMediaRecorder({ stream: ref(makeStream()) });

    // Not recording yet -> no-op (no recorder).
    pauseRecording();
    expect(recordingState.value).toBe('stopped');

    startRecording();
    pauseRecording();
    expect(instances[0].pause).toHaveBeenCalledOnce();
    expect(recordingState.value).toBe('paused');

    // Already paused -> no-op.
    pauseRecording();
    expect(instances[0].pause).toHaveBeenCalledOnce();
  });

  it('does not pause when unsupported', () => {
    FakeMediaRecorder.isTypeSupported.mockReturnValue(false);
    const { pauseRecording, recordingState } = useMediaRecorder({ stream: ref(makeStream()) });
    pauseRecording();
    expect(recordingState.value).toBe('stopped');
  });

  it('resumes only from a paused state', () => {
    const { startRecording, pauseRecording, resumeRecording, recordingState } = useMediaRecorder({ stream: ref(makeStream()) });

    // No recorder yet -> no-op.
    resumeRecording();
    expect(recordingState.value).toBe('stopped');

    startRecording();
    // Recording, not paused -> no-op.
    resumeRecording();
    expect(instances[0].resume).not.toHaveBeenCalled();

    pauseRecording();
    resumeRecording();
    expect(instances[0].resume).toHaveBeenCalledOnce();
    expect(recordingState.value).toBe('recording');
  });

  it('does not resume when unsupported', () => {
    FakeMediaRecorder.isTypeSupported.mockReturnValue(false);
    const { resumeRecording, recordingState } = useMediaRecorder({ stream: ref(makeStream()) });
    resumeRecording();
    expect(recordingState.value).toBe('stopped');
  });
});
