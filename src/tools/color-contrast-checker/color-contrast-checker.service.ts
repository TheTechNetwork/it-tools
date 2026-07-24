import { colord, extend } from 'colord';
import a11yPlugin from 'colord/plugins/a11y';
import namesPlugin from 'colord/plugins/names';

extend([a11yPlugin, namesPlugin]);

export { getContrastRatio, getWcagCompliance, isValidColor };
export type { WcagCompliance };

interface WcagCompliance {
  normalAa: boolean;
  normalAaa: boolean;
  largeAa: boolean;
  largeAaa: boolean;
}

function isValidColor(color: string): boolean {
  return colord(color).isValid();
}

// WCAG contrast ratio between two colors, from 1 (identical) to 21 (black/white).
function getContrastRatio(foreground: string, background: string): number {
  return colord(foreground).contrast(background);
}

// WCAG 2.1 thresholds: normal text needs 4.5 (AA) / 7 (AAA); large text
// (>=18pt or 14pt bold) needs 3 (AA) / 4.5 (AAA).
function getWcagCompliance(ratio: number): WcagCompliance {
  return {
    normalAa: ratio >= 4.5,
    normalAaa: ratio >= 7,
    largeAa: ratio >= 3,
    largeAaa: ratio >= 4.5,
  };
}
