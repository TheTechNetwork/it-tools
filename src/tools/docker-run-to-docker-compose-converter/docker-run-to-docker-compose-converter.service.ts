import type { ComposerizeResult, Message, MessageType } from '@unabandoned/composerize-ts';
import { composerize } from '@unabandoned/composerize-ts';

export function convertDockerRunToDockerCompose(dockerRun: string): ComposerizeResult {
  return composerize(dockerRun.trim());
}

export function getMessagesOfType({ messages, type }: { messages: Message[]; type: MessageType }): string[] {
  return messages.filter(message => message.type === type).map(message => message.value);
}
