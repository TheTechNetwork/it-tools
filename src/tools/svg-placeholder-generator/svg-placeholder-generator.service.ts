import { textToBase64 } from '@/utils/base64';

export { generateSvgPlaceholder, svgToBase64DataUrl };

function generateSvgPlaceholder({
  width,
  height,
  fontSize,
  bgColor,
  fgColor,
  useExactSize,
  customText = '',
}: {
  width: number;
  height: number;
  fontSize: number;
  bgColor: string;
  fgColor: string;
  useExactSize: boolean;
  customText?: string;
}): string {
  const text = customText.length > 0 ? customText : `${width}x${height}`;
  const size = useExactSize ? ` width="${width}" height="${height}"` : '';

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"${size}>
  <rect width="${width}" height="${height}" fill="${bgColor}"></rect>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="${fontSize}px" fill="${fgColor}">${text}</text>   
</svg>
  `.trim();
}

function svgToBase64DataUrl(svgString: string): string {
  return `data:image/svg+xml;base64,${textToBase64(svgString)}`;
}
