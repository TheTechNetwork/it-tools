import _ from 'lodash';
import { inject } from 'vue';

export { createTrackerService, useTracker };

interface PlausibleInstance {
  trackEvent: (eventName: string) => void;
}

function createTrackerService({ plausible }: { plausible: PlausibleInstance }) {
  return {
    trackEvent({ eventName }: { eventName: string }) {
      plausible.trackEvent(eventName);
    },
  };
}

function useTracker() {
  const plausible: PlausibleInstance | undefined = inject('plausible');

  if (_.isNil(plausible)) {
    throw new TypeError('Plausible must be instantiated');
  }

  const tracker = createTrackerService({ plausible });

  return {
    tracker,
  };
}
