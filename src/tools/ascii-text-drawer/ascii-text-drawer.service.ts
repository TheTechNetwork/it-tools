import figlet from 'figlet';

export { drawAsciiArtText };

function drawAsciiArtText({ text, font, width }: { text: string; font: string; width: number }): Promise<string> {
  const options = {
    font,
    width,
    whitespaceBreak: true,
  };

  return new Promise<string>((resolve, reject) =>
    figlet.text(text, options, (err, drawnText) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(drawnText ?? '');
    }));
}
