import Fuse from 'fuse.js';
import { codesByCategories } from './http-status-codes.constants';

export { allHttpStatusCodes, searchHttpStatusCodes };
export type { HttpStatusCode };

type HttpStatusCode = (typeof codesByCategories)[number]['codes'][number] & { category: string };

const allHttpStatusCodes: HttpStatusCode[] = codesByCategories.flatMap(({ codes, category }) =>
  codes.map(code => ({ ...code, category })),
);

const fuse = new Fuse(allHttpStatusCodes, {
  keys: [{ name: 'code', weight: 3 }, { name: 'name', weight: 2 }, 'description', 'category'],
});

function searchHttpStatusCodes(query: string): HttpStatusCode[] {
  return fuse.search(query).map(({ item }) => item);
}
