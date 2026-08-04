export { escapeUnicode, getEmojiCodePoints };

function escapeUnicode({ emoji }: { emoji: string }) {
  return emoji
    .split('')
    .map(unit => `\\u${unit.charCodeAt(0).toString(16).padStart(4, '0')}`)
    .join('');
}

function getEmojiCodePoints({ emoji }: { emoji: string }) {
  return emoji.codePointAt(0) ? `0x${emoji.codePointAt(0)?.toString(16)}` : undefined;
}
