import type { ComposerizeResult, Message, MessageType } from '@thetechnetwork/composerize-ts';
import { composerize } from '@thetechnetwork/composerize-ts';

export function convertDockerRunToDockerCompose(dockerRun: string): ComposerizeResult {
  return composerize(dockerRun.trim());
}

export function getMessagesOfType({ messages, type }: { messages: Message[]; type: MessageType }): string[] {
  return messages.filter(message => message.type === type).map(message => message.value);
}
