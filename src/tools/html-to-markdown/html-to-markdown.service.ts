import TurndownService from 'turndown';

export { convertHtmlToMarkdown };

function convertHtmlToMarkdown(html: string): string {
  const turndown = new TurndownService({
    headingStyle: 'atx',
    hr: '---',
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
    emDelimiter: '*',
    strongDelimiter: '**',
    linkStyle: 'inlined',
  });

  // Preserve line breaks and drop non-content elements.
  turndown.remove(['script', 'style', 'head', 'title']);

  return turndown.turndown(html);
}
