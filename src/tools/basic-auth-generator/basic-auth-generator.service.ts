import { textToBase64 } from '@/utils/base64';

export { getBasicAuthHeader };

function getBasicAuthHeader({ username, password }: { username: string; password: string }): string {
  return `Authorization: Basic ${textToBase64(`${username}:${password}`)}`;
}
