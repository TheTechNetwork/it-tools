import { defineConfig } from 'figue';
import * as v from 'valibot';

export const { config } = defineConfig(
  {
    app: {
      version: {
        doc: 'Application current version',
        schema: v.string(),
        default: '0.0.0',
        env: 'PACKAGE_VERSION',
      },
      lastCommitSha: {
        doc: 'Application last commit SHA version',
        schema: v.string(),
        default: '',
        env: 'VITE_VERCEL_GIT_COMMIT_SHA',
      },
      baseUrl: {
        doc: 'Application base url',
        schema: v.string(),
        default: '/',
        env: 'BASE_URL',
      },
      env: {
        doc: 'Application current env',
        schema: v.picklist(['production', 'development', 'preview', 'test']),
        default: 'development',
        env: 'VITE_VERCEL_ENV',
      },
    },
    showBanner: {
      doc: 'Show the banner',
      schema: v.boolean(),
      default: false,
      env: 'VITE_SHOW_BANNER',
    },
    showSponsorBanner: {
      doc: 'Show the sponsor banner',
      schema: v.boolean(),
      default: false,
      env: 'VITE_SHOW_SPONSOR_BANNER',
    },
  },
  {
    envSource: {
      ...import.meta.env,
      // Because the string 'import.meta.env.PACKAGE_VERSION' is statically replaced during build time (see 'define' in vite.config.ts)
      PACKAGE_VERSION: import.meta.env.PACKAGE_VERSION,
    },
  },
);
