import { describe, expect, it } from 'vitest';
import { formatSql } from './sql-prettify.service';

describe('sql-prettify', () => {
  describe('formatSql', () => {
    const defaultConfig = {
      keywordCase: 'upper',
      useTabs: false,
      language: 'sql',
      indentStyle: 'standard',
    } as const;

    it('formats a simple query with uppercase keywords', () => {
      expect(formatSql('select field1,field2,field3 from my_table where my_condition;', defaultConfig)).toBe(
        'SELECT\n  field1,\n  field2,\n  field3\nFROM\n  my_table\nWHERE\n  my_condition;',
      );
    });

    it('formats a query with joins, ordering and limit', () => {
      expect(
        formatSql(
          'select a.x, b.y from a inner join b on a.id=b.id where a.x>10 order by a.x desc limit 5;',
          defaultConfig,
        ),
      ).toBe(
        'SELECT\n  a.x,\n  b.y\nFROM\n  a\n  INNER JOIN b ON a.id = b.id\nWHERE\n  a.x > 10\nORDER BY\n  a.x DESC\nLIMIT\n  5;',
      );
    });

    it('lowercases keywords when keywordCase is lower', () => {
      expect(
        formatSql('SELECT FIELD1,FIELD2,FIELD3 FROM MY_TABLE WHERE MY_CONDITION;', {
          ...defaultConfig,
          keywordCase: 'lower',
        }),
      ).toBe('select\n  FIELD1,\n  FIELD2,\n  FIELD3\nfrom\n  MY_TABLE\nwhere\n  MY_CONDITION;');
    });

    it('supports the tabularLeft indent style', () => {
      expect(
        formatSql('select field1,field2,field3 from my_table where my_condition;', {
          ...defaultConfig,
          indentStyle: 'tabularLeft',
        }),
      ).toBe('SELECT    field1,\n          field2,\n          field3\nFROM      my_table\nWHERE     my_condition;');
    });

    it('supports dialect specific syntax', () => {
      expect(
        formatSql('select * from t where a ilike $$x%$$;', { ...defaultConfig, language: 'postgresql' }),
      ).toBe('SELECT\n  *\nFROM\n  t\nWHERE\n  a ILIKE $$x%$$;');
    });

    it('handles an empty string', () => {
      expect(formatSql('', defaultConfig)).toBe('');
    });

    it('throws on invalid sql', () => {
      expect(() => formatSql('select ((( from', defaultConfig)).toThrow();
    });
  });
});
