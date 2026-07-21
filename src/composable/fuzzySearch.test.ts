import { describe, expect, it } from 'vitest';
import { ref } from 'vue';
import { useFuzzySearch } from './fuzzySearch';

describe('useFuzzySearch', () => {
  const data = [
    { name: 'apple', description: 'a red fruit' },
    { name: 'banana', description: 'a yellow fruit' },
    { name: 'carrot', description: 'an orange vegetable' },
  ];

  it('finds items matching the search query', () => {
    const search = ref('apple');
    const { searchResult } = useFuzzySearch({ search, data, options: { keys: ['name'] } });

    expect(searchResult.value).toEqual([{ name: 'apple', description: 'a red fruit' }]);
  });

  it('searches across multiple keys', () => {
    const search = ref('vegetable');
    const { searchResult } = useFuzzySearch({ search, data, options: { keys: ['name', 'description'] } });

    expect(searchResult.value).toEqual([{ name: 'carrot', description: 'an orange vegetable' }]);
  });

  it('is reactive to changes of the search ref', () => {
    const search = ref('apple');
    const { searchResult } = useFuzzySearch({ search, data, options: { keys: ['name'] } });

    expect(searchResult.value).toEqual([{ name: 'apple', description: 'a red fruit' }]);

    search.value = 'banana';

    expect(searchResult.value).toEqual([{ name: 'banana', description: 'a yellow fruit' }]);
  });

  it('accepts a plain string as search value', () => {
    const { searchResult } = useFuzzySearch({ search: 'banana', data, options: { keys: ['name'] } });

    expect(searchResult.value).toEqual([{ name: 'banana', description: 'a yellow fruit' }]);
  });

  it('returns no exact-mismatch results for a query without match', () => {
    const search = ref('zzzzzz');
    const { searchResult } = useFuzzySearch({ search, data, options: { keys: ['name'] } });

    expect(searchResult.value).toEqual([]);
  });

  it('returns the whole dataset for an empty query when filterEmpty is false', () => {
    const search = ref('');
    const { searchResult } = useFuzzySearch({
      search,
      data,
      options: { keys: ['name'], filterEmpty: false },
    });

    expect(searchResult.value).toEqual(data);
  });
});
