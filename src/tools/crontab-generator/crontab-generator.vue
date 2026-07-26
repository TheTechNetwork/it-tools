<script setup lang="ts">
import { useStyleStore } from '@/stores/style.store';
import { getCronDescription, isCronValid } from './crontab-generator.service';

const { t } = useI18n();

const styleStore = useStyleStore();

const cron = ref('40 * * * *');
const cronstrueConfig = reactive({
  verbose: true,
  dayOfWeekStartIndexZero: true,
  use24HourTimeFormat: true,
  throwExceptionOnParseError: true,
});

const helpers = computed(() => [
  {
    symbol: '*',
    meaning: t('tools.crontab-generator.helpers.anyValue'),
    example: '* * * *',
    equivalent: t('tools.crontab-generator.equivalent.everyMinute'),
  },
  {
    symbol: '-',
    meaning: t('tools.crontab-generator.helpers.rangeOfValues'),
    example: '1-10 * * *',
    equivalent: t('tools.crontab-generator.equivalent.minutes1Through10'),
  },
  {
    symbol: ',',
    meaning: t('tools.crontab-generator.helpers.listOfValues'),
    example: '1,10 * * *',
    equivalent: t('tools.crontab-generator.equivalent.atMinutes1And10'),
  },
  {
    symbol: '/',
    meaning: t('tools.crontab-generator.helpers.stepValues'),
    example: '*/10 * * *',
    equivalent: t('tools.crontab-generator.equivalent.every10Minutes'),
  },
  {
    symbol: '@yearly',
    meaning: t('tools.crontab-generator.helpers.yearly'),
    example: '@yearly',
    equivalent: '0 0 1 1 *',
  },
  {
    symbol: '@annually',
    meaning: t('tools.crontab-generator.helpers.annually'),
    example: '@annually',
    equivalent: '0 0 1 1 *',
  },
  {
    symbol: '@monthly',
    meaning: t('tools.crontab-generator.helpers.monthly'),
    example: '@monthly',
    equivalent: '0 0 1 * *',
  },
  {
    symbol: '@weekly',
    meaning: t('tools.crontab-generator.helpers.weekly'),
    example: '@weekly',
    equivalent: '0 0 * * 0',
  },
  {
    symbol: '@daily',
    meaning: t('tools.crontab-generator.helpers.daily'),
    example: '@daily',
    equivalent: '0 0 * * *',
  },
  {
    symbol: '@midnight',
    meaning: t('tools.crontab-generator.helpers.midnight'),
    example: '@midnight',
    equivalent: '0 0 * * *',
  },
  {
    symbol: '@hourly',
    meaning: t('tools.crontab-generator.helpers.hourly'),
    example: '@hourly',
    equivalent: '0 * * * *',
  },
  {
    symbol: '@reboot',
    meaning: t('tools.crontab-generator.helpers.reboot'),
    example: '',
    equivalent: '',
  },
]);

const tableHeaders = computed(() => [
  { key: 'symbol', label: t('tools.crontab-generator.table.symbol') },
  { key: 'meaning', label: t('tools.crontab-generator.table.meaning') },
  { key: 'example', label: t('tools.crontab-generator.table.example') },
  { key: 'equivalent', label: t('tools.crontab-generator.table.equivalent') },
]);

const cronString = computed(() => getCronDescription(cron.value, cronstrueConfig));

const cronValidationRules = [
  {
    validator: (value: string) => isCronValid(value),
    message: t('tools.crontab-generator.validation.invalid'),
  },
];
</script>

<template>
  <c-card>
    <div mx-auto max-w-sm>
      <c-input-text
        v-model:value="cron"
        size="large"
        placeholder="* * * * *"
        :validation-rules="cronValidationRules"
        mb-3
      />
    </div>

    <div class="cron-string">
      {{ cronString }}
    </div>

    <n-divider />

    <div flex justify-center>
      <n-form :show-feedback="false" label-width="170" label-placement="left">
        <n-form-item :label="t('tools.crontab-generator.form.verbose')">
          <n-switch v-model:value="cronstrueConfig.verbose" />
        </n-form-item>
        <n-form-item :label="t('tools.crontab-generator.form.use24Hour')">
          <n-switch v-model:value="cronstrueConfig.use24HourTimeFormat" />
        </n-form-item>
        <n-form-item :label="t('tools.crontab-generator.form.daysStartAtZero')">
          <n-switch v-model:value="cronstrueConfig.dayOfWeekStartIndexZero" />
        </n-form-item>
      </n-form>
    </div>
  </c-card>
  <c-card>
    <pre>
┌──────────── [optional] seconds (0 - 59)
| ┌────────── minute (0 - 59)
| | ┌──────── hour (0 - 23)
| | | ┌────── day of month (1 - 31)
| | | | ┌──── month (1 - 12) OR jan,feb,mar,apr ...
| | | | | ┌── day of week (0 - 6, sunday=0) OR sun,mon ...
| | | | | |
* * * * * * command</pre>

    <div v-if="styleStore.isSmallScreen">
      <c-card v-for="{ symbol, meaning, example, equivalent } in helpers" :key="symbol" mb-3 important:border-none>
        <div>
          {{ t('tools.crontab-generator.table.symbol') }}: <strong>{{ symbol }}</strong>
        </div>
        <div>
          {{ t('tools.crontab-generator.table.meaning') }}: <strong>{{ meaning }}</strong>
        </div>
        <div>
          {{ t('tools.crontab-generator.table.example') }}:
          <strong><code>{{ example }}</code></strong>
        </div>
        <div>
          {{ t('tools.crontab-generator.table.equivalent') }}: <strong>{{ equivalent }}</strong>
        </div>
      </c-card>
    </div>

    <c-table v-else :data="helpers" :headers="tableHeaders" />
  </c-card>
</template>

<style lang="less" scoped>
::v-deep(input) {
  font-size: 30px;
  font-family: monospace;
  padding: 5px;
  text-align: center;
}

.cron-string {
  text-align: center;
  font-size: 22px;
  opacity: 0.8;
  margin: 5px 0 15px;
}

pre {
  overflow: auto;
  padding: 10px 0;
}
</style>
