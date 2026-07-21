import markdownit from 'markdown-it';

export { convertMarkdownToHtml };

function convertMarkdownToHtml(markdown: string): string {
  const md = markdownit();
  return md.render(markdown);
}
