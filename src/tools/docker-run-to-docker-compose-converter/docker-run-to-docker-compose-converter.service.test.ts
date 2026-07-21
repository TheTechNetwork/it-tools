import { MessageType } from 'composerize-ts';
import { describe, expect, it } from 'vitest';
import { convertDockerRunToDockerCompose, getMessagesOfType } from './docker-run-to-docker-compose-converter.service';

describe('docker-run-to-docker-compose-converter service', () => {
  describe('convertDockerRunToDockerCompose', () => {
    it('converts a simple docker run command', () => {
      const { yaml, messages } = convertDockerRunToDockerCompose('docker run nginx');

      expect(messages).toEqual([]);
      expect(yaml).toContain('version:');
      expect(yaml).toContain('services:');
      expect(yaml).toContain('image: nginx');
    });

    it('converts ports, volumes and restart policy', () => {
      const { yaml, messages } = convertDockerRunToDockerCompose(
        'docker run -p 80:80 -v /var/run/docker.sock:/tmp/docker.sock:ro --restart always nginx',
      );

      expect(messages).toEqual([]);
      expect(yaml).toContain('- \'80:80\'');
      expect(yaml).toContain('- \'/var/run/docker.sock:/tmp/docker.sock:ro\'');
      expect(yaml).toContain('restart: always');
    });

    it('trims surrounding whitespace before converting', () => {
      expect(convertDockerRunToDockerCompose('  docker run nginx  ')).toEqual(
        convertDockerRunToDockerCompose('docker run nginx'),
      );
    });

    it('reports options that cannot be translated to docker-compose as messages', () => {
      const { messages } = convertDockerRunToDockerCompose('docker run --rm nginx');

      expect(messages).toEqual([
        { type: MessageType.notTranslatable, value: 'The option "--rm" could not be translated to docker-compose.yml.' },
      ]);
    });

    it('reports unknown options as conversion errors', () => {
      const { messages } = convertDockerRunToDockerCompose('docker run --sig-proxy nginx');

      expect(messages).toEqual([{ type: MessageType.errorDuringConversion, value: 'Unknown option: sig-proxy' }]);
    });

    it('converts environment variables', () => {
      const { yaml } = convertDockerRunToDockerCompose('docker run -e FOO=bar nginx');

      expect(yaml).toContain('environment:');
      expect(yaml).toContain('- FOO=bar');
    });
  });

  describe('getMessagesOfType', () => {
    const messages = [
      { type: MessageType.notImplemented, value: '--log-opt max-size=1g' },
      { type: MessageType.notTranslatable, value: '--rm' },
      { type: MessageType.errorDuringConversion, value: 'boom' },
      { type: MessageType.notImplemented, value: '--foo' },
    ];

    it('returns the values of messages matching the given type', () => {
      expect(getMessagesOfType({ messages, type: MessageType.notImplemented })).toEqual([
        '--log-opt max-size=1g',
        '--foo',
      ]);
      expect(getMessagesOfType({ messages, type: MessageType.notTranslatable })).toEqual(['--rm']);
      expect(getMessagesOfType({ messages, type: MessageType.errorDuringConversion })).toEqual(['boom']);
    });

    it('returns an empty array when no message matches', () => {
      expect(getMessagesOfType({ messages: [], type: MessageType.notImplemented })).toEqual([]);
    });
  });
});
