import { md5, sha1, sha256, sha512 } from '@awasm/noble';
import { bytesToHex } from '@awasm/noble/utils.js';

export type FileHashAlgorithm = 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-512';

export const FILE_HASH_ALGORITHMS: Record<FileHashAlgorithm, typeof sha256> = {
  'MD5': md5,
  'SHA-1': sha1,
  'SHA-256': sha256,
  'SHA-512': sha512,
};

// Reads the file in chunks and streams them through the hasher, so hashing a
// multi-gigabyte file never loads the whole thing into memory. @awasm/noble runs
// the compression in WebAssembly, so this stays fast on large inputs.
export async function hashFile({
  file,
  algorithm,
  chunkSize = 8 * 1024 * 1024,
  onProgress,
}: {
  file: Blob;
  algorithm: FileHashAlgorithm;
  chunkSize?: number;
  onProgress?: (ratio: number) => void;
}): Promise<string> {
  const hasher = FILE_HASH_ALGORITHMS[algorithm].create();

  for (let offset = 0; offset < file.size; offset += chunkSize) {
    const slice = file.slice(offset, offset + chunkSize);
    hasher.update(new Uint8Array(await slice.arrayBuffer()));
    // file.size > 0 is guaranteed here (the loop only runs when offset < size).
    onProgress?.(Math.min(1, (offset + chunkSize) / file.size));
  }

  onProgress?.(1);
  return bytesToHex(hasher.digest());
}

// Computes every offered algorithm for one file, reading the file only once per
// algorithm. Returns a map of algorithm -> lowercase hex digest.
export async function hashFileAll({
  file,
  onProgress,
}: {
  file: Blob;
  onProgress?: (ratio: number) => void;
}): Promise<Record<FileHashAlgorithm, string>> {
  const algorithms = Object.keys(FILE_HASH_ALGORITHMS) as FileHashAlgorithm[];
  const result = {} as Record<FileHashAlgorithm, string>;

  for (const [index, algorithm] of algorithms.entries()) {
    result[algorithm] = await hashFile({
      file,
      algorithm,
      onProgress: ratio => onProgress?.((index + ratio) / algorithms.length),
    });
  }

  return result;
}
