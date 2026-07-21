import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import { useCopy } from './copy';

const { messageSuccess } = vi.hoisted(() => ({ messageSuccess: vi.fn() }));

vi.mock('naive-ui', () => ({
  useMessage: () => ({ success: messageSuccess }),
}));

describe('useCopy', () => {
  let copiedText: string | undefined;

  beforeEach(() => {
    copiedText = undefined;
    messageSuccess.mockClear();

    // jsdom does not implement the clipboard API nor execCommand; useClipboard
    // (legacy mode) falls back to a hidden textarea + document.execCommand('copy').
    document.execCommand = vi.fn((command: string) => {
      if (command === 'copy') {
        copiedText = document.querySelector('textarea')?.value;
      }
      return true;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('copies the source value to the clipboard', async () => {
    const source = ref('hello world');
    const { copy } = useCopy({ source });

    await copy();

    expect(copiedText).toBe('hello world');
  });

  it('copies the current value of the source ref', async () => {
    const source = ref('initial');
    const { copy } = useCopy({ source });

    source.value = 'updated';
    await copy();

    expect(copiedText).toBe('updated');
  });

  it('copies explicit content when no source is provided', async () => {
    const { copy } = useCopy();

    await copy('direct content');

    expect(copiedText).toBe('direct content');
  });

  it('shows the default toast message after copying', async () => {
    const { copy } = useCopy({ source: ref('value') });

    await copy();

    expect(messageSuccess).toHaveBeenCalledWith('Copied to the clipboard');
  });

  it('shows a custom toast message when text is provided', async () => {
    const { copy } = useCopy({ source: ref('value'), text: 'Custom message' });

    await copy();

    expect(messageSuccess).toHaveBeenCalledWith('Custom message');
  });

  it('lets a per-call notification message override the default text', async () => {
    const { copy } = useCopy({ source: ref('value'), text: 'Default message' });

    await copy(undefined, { notificationMessage: 'Per-call message' });

    expect(messageSuccess).toHaveBeenCalledWith('Per-call message');
  });

  it('does not show a toast when createToast is false', async () => {
    const { copy } = useCopy({ source: ref('value'), createToast: false });

    await copy();

    expect(copiedText).toBe('value');
    expect(messageSuccess).not.toHaveBeenCalled();
  });

  it('exposes isJustCopied which becomes true after copying', async () => {
    const { copy, isJustCopied } = useCopy({ source: ref('value') });

    expect(isJustCopied.value).toBe(false);

    await copy();

    expect(isJustCopied.value).toBe(true);
  });
});
