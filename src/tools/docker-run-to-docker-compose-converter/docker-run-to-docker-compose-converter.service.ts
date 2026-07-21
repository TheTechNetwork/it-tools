import type { ComposerizeResult, Message, MessageType } from 'composerize-ts';
import { composerize } from 'composerize-ts';

export { convertDockerRunToDockerCompose, getMessagesOfType };

function convertDockerRunToDockerCompose(dockerRun: string): ComposerizeResult {
  return composerize(dockerRun.trim());
}

function getMessagesOfType({ messages, type }: { messages: Message[]; type: MessageType }): string[] {
  return messages.filter(message => message.type === type).map(message => message.value);
}
