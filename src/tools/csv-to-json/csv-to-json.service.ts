export { convertCsvToJson, parseCsv };

interface ParseOptions {
  delimiter?: string;
  // When true, the first row is treated as the header and each record becomes
  // an object keyed by the header names. Otherwise records are string arrays.
  header?: boolean;
}

// A small RFC 4180 CSV parser: supports quoted fields, escaped quotes (""),
// and delimiters/newlines inside quotes. Handles both \n and \r\n line endings.
function parseCsv(csv: string, { delimiter = ',' }: { delimiter?: string } = {}): string[][] {
  const rows: string[][] = [];
  let field = '';
  let row: string[] = [];
  let inQuotes = false;
  let i = 0;

  while (i < csv.length) {
    const char = csv[i];

    if (inQuotes) {
      if (char === '"') {
        if (csv[i + 1] === '"') {
          // Escaped quote.
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i += 1;
        continue;
      }
      field += char;
      i += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      i += 1;
      continue;
    }

    if (char === delimiter) {
      row.push(field);
      field = '';
      i += 1;
      continue;
    }

    if (char === '\r') {
      // Swallow a following \n (Windows line ending).
      if (csv[i + 1] === '\n') {
        i += 1;
      }
      row.push(field);
      rows.push(row);
      field = '';
      row = [];
      i += 1;
      continue;
    }

    if (char === '\n') {
      row.push(field);
      rows.push(row);
      field = '';
      row = [];
      i += 1;
      continue;
    }

    field += char;
    i += 1;
  }

  // Flush the final field/row unless the input ended on a clean newline.
  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

function convertCsvToJson(csv: string, { delimiter = ',', header = true }: ParseOptions = {}): string {
  const rows = parseCsv(csv.trim(), { delimiter });

  if (rows.length === 0) {
    return '[]';
  }

  let result: unknown;

  if (header) {
    const [headerRow, ...dataRows] = rows;
    result = dataRows.map(cells =>
      Object.fromEntries(headerRow.map((key, index) => [key, cells[index] ?? ''])),
    );
  }
  else {
    result = rows;
  }

  return JSON.stringify(result, null, 2);
}
