import { describe, expect, it } from 'vitest';
import { convertJsonToTypescript } from './json-to-typescript.service';

describe('json-to-typescript', () => {
  it('generates an exported interface from a flat object', () => {
    const result = convertJsonToTypescript('{"name":"John","age":30,"isAdmin":true}');

    expect(result).toContain('export interface RootObject {');
    expect(result).toContain('name: string;');
    expect(result).toContain('age: number;');
    expect(result).toContain('isAdmin: boolean;');
  });

  it('generates nested interfaces for nested objects', () => {
    const result = convertJsonToTypescript('{"user":{"id":1,"roles":["admin"]}}');

    expect(result).toContain('export interface RootObject {');
    expect(result).toContain('export interface User {');
    expect(result).toContain('roles: string[];');
  });

  it('honours a custom root interface name', () => {
    const result = convertJsonToTypescript('{"id":1}', { rootName: 'ApiResponse' });

    expect(result).toContain('export interface ApiResponse {');
  });

  it('accepts arrays at the root', () => {
    const result = convertJsonToTypescript('[{"id":1},{"id":2}]');

    expect(result).toContain('export interface RootObject {');
    expect(result).toContain('id: number;');
  });

  it('tolerates JSON5 input (comments, trailing commas, unquoted keys)', () => {
    const result = convertJsonToTypescript('{ id: 1, /* a comment */ name: "x", }');

    expect(result).toContain('id: number;');
    expect(result).toContain('name: string;');
  });

  it('throws on invalid JSON', () => {
    expect(() => convertJsonToTypescript('not json')).toThrow();
  });

  it('throws on a non-object primitive', () => {
    expect(() => convertJsonToTypescript('42')).toThrow(/must be an object or an array/);
  });
});
