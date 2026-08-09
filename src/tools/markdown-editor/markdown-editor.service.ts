import DOMPurify from 'dompurify';
import markdownit from 'markdown-it';

export { renderMarkdownToHtml, renderMarkdownToSafeHtml };

function renderMarkdownToHtml(markdown: string): string {
  const md = markdownit({ html: true, linkify: true, typographer: true, breaks: true });
  return md.render(markdown);
}

// Preview is injected with v-html, so raw HTML authored in the markdown must be
// sanitized before it reaches the DOM.
function renderMarkdownToSafeHtml(markdown: string): string {
  return DOMPurify.sanitize(renderMarkdownToHtml(markdown));
}
