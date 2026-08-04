export type KeyboardEventLike = Pick<
  KeyboardEvent,
  'key' | 'keyCode' | 'code' | 'location' | 'metaKey' | 'shiftKey' | 'ctrlKey' | 'altKey'
>;

export interface KeyCodeInfo {
  key: string;
  keyCode: string;
  code: string;
  location: string;
  modifiers: string;
}

export { formatModifiers, getKeyCodeInfo };

function formatModifiers(event: Pick<KeyboardEventLike, 'metaKey' | 'shiftKey' | 'ctrlKey' | 'altKey'>): string {
  return [
    event.metaKey && 'Meta',
    event.shiftKey && 'Shift',
    event.ctrlKey && 'Ctrl',
    event.altKey && 'Alt',
  ]
    .filter(Boolean)
    .join(' + ');
}

function getKeyCodeInfo(event: KeyboardEventLike): KeyCodeInfo {
  return {
    key: event.key,
    keyCode: String(event.keyCode),
    code: event.code,
    location: String(event.location),
    modifiers: formatModifiers(event),
  };
}
