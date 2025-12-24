import type { App } from 'vue';

import { init, track } from '@plausible-analytics/tracker';
import { noop } from 'lodash';
import { config } from '@/config';

interface PlausibleInstance {
  trackEvent: (eventName: string) => void;
}

function createFakePlausibleInstance(): PlausibleInstance {
  return {
    trackEvent: noop,
  };
}

function createPlausibleInstance({
  config,
}: {
  config: {
    isTrackerEnabled: boolean;
    domain: string;
    apiHost: string;
    trackLocalhost: boolean;
  };
}): PlausibleInstance {
  if (config.isTrackerEnabled) {
    init({
      domain: config.domain,
      endpoint: config.apiHost,
      captureOnLocalhost: config.trackLocalhost,
    });

    return {
      trackEvent: (eventName: string) => track(eventName, {}),
    };
  }

  return createFakePlausibleInstance();
}

export const plausible = {
  install: (app: App) => {
    const plausibleInstance = createPlausibleInstance({ config: config.plausible });

    app.provide('plausible', plausibleInstance);
  },
};
