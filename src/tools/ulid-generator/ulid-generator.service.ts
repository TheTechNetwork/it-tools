import _ from 'lodash';
import { ulid } from 'ulid';

export { generateUlids };
export type { UlidFormat };

type UlidFormat = 'raw' | 'json';

function generateUlids({ amount = 1, format = 'raw' }: { amount?: number; format?: UlidFormat } = {}): string {
  const ids = _.times(amount, () => ulid());

  if (format === 'json') {
    return JSON.stringify(ids, null, 2);
  }

  return ids.join('\n');
}
