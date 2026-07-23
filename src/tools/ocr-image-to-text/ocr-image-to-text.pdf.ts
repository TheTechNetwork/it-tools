// Render each page of a PDF to a PNG image so the OCR engine (which works on
// images) can read PDFs - both scanned documents (where each page is an image)
// and text PDFs. pdf.js runs its own worker, loaded same-origin as a bundled
// asset (workerSrc below), so it stays within the CSP's worker-src/connect-src
// 'self'. This module is loaded on demand (dynamic import) so pdf.js only ships
// to users who actually process a PDF.
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import PdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

export { renderPdfToImages };

GlobalWorkerOptions.workerSrc = PdfWorkerUrl;

// Higher scale -> sharper render -> better OCR, at the cost of memory/time. 2x
// is a good default for screen-resolution PDFs.
async function renderPdfToImages(file: File | ArrayBuffer, { scale = 2 }: { scale?: number } = {}): Promise<Blob[]> {
  const data = file instanceof File ? await file.arrayBuffer() : file;
  const loadingTask = getDocument({ data });
  const pdf = await loadingTask.promise;
  const images: Blob[] = [];

  try {
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement('canvas');
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);

      await page.render({ canvas, viewport }).promise;
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
      if (blob) {
        images.push(blob);
      }
      page.cleanup();
    }
  }
  finally {
    await loadingTask.destroy();
  }

  return images;
}
