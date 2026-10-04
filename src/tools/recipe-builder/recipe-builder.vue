<script setup lang="ts">
import type { Recipe, RecipeResult } from '@/recipes/recipe.types';
import { useCopy } from '@/composable/copy';
import { operations, operationsById } from '@/recipes/operations';
import { decodeRecipe, encodeRecipe } from '@/recipes/recipe.serialisation';
import { runRecipe } from '@/recipes/run-recipe';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const input = ref('{"someKey": "a value"}');
const recipe = ref<Recipe>([{ op: 'json-to-yaml' }, { op: 'base64-encode' }]);

// A recipe in the URL is the whole point of making it data: it can be handed to
// someone else. A bad one in the address bar should not blank the page.
onMounted(() => {
  const encoded = route.query.recipe;
  if (typeof encoded === 'string' && encoded.length > 0) {
    try {
      recipe.value = decodeRecipe(encoded);
    }
    catch {
      // leave the default recipe in place
    }
  }
});

const result = ref<RecipeResult>({ output: '', steps: [], ok: true });

watch([input, recipe], async () => {
  result.value = await runRecipe(recipe.value, input.value, operationsById);
}, { deep: true, immediate: true });

const shareLink = computed(() => {
  const url = new URL(router.resolve({ path: '/recipe-builder' }).href, window.location.origin);
  url.searchParams.set('recipe', encodeRecipe(recipe.value));
  return url.toString();
});

const { copy: copyLink } = useCopy({ source: shareLink, text: t('tools.recipe-builder.linkCopied') });
const { copy: copyOutput } = useCopy({ source: computed(() => result.value.output), text: t('tools.recipe-builder.outputCopied') });

const failedIndex = computed(() => result.value.steps.findIndex(step => step.status === 'failed' || step.status === 'unknown-operation'));

function addStep() {
  recipe.value.push({ op: operations[0].id });
}
function removeStep(index: number) {
  recipe.value.splice(index, 1);
}
function moveStep(index: number, by: number) {
  const target = index + by;
  if (target < 0 || target >= recipe.value.length) {
    return;
  }
  const [step] = recipe.value.splice(index, 1);
  recipe.value.splice(target, 0, step);
}
function argsFor(opId: string) {
  return operationsById.get(opId)?.args ?? [];
}
</script>

<template>
  <div>
    <c-card :title="t('tools.recipe-builder.input')">
      <c-input-text v-model:value="input" multiline rows="4" raw-text monospace placeholder="Text to run the recipe over…" />
    </c-card>

    <c-card :title="t('tools.recipe-builder.recipe')" mt-4>
      <div v-for="(step, index) in recipe" :key="index" mb-3>
        <n-card
          size="small"
          :class="{ 'recipe-step--failed': index === failedIndex }"
        >
          <div flex items-center gap-2>
            <n-tag size="small" :bordered="false">
              {{ index + 1 }}
            </n-tag>

            <n-select
              v-model:value="step.op"
              :options="operations.map(op => ({ label: op.name, value: op.id }))"
              style="flex: 1"
            />

            <n-button size="small" quaternary :disabled="index === 0" @click="moveStep(index, -1)">
              ↑
            </n-button>
            <n-button size="small" quaternary :disabled="index === recipe.length - 1" @click="moveStep(index, 1)">
              ↓
            </n-button>
            <n-button size="small" quaternary @click="step.disabled = !step.disabled">
              {{ step.disabled ? t('tools.recipe-builder.enableStep') : t('tools.recipe-builder.muteStep') }}
            </n-button>
            <n-button size="small" quaternary type="error" @click="removeStep(index)">
              {{ t('tools.recipe-builder.removeStep') }}
            </n-button>
          </div>

          <div v-if="argsFor(step.op).length > 0" mt-2 flex flex-wrap gap-3>
            <div v-for="arg of argsFor(step.op)" :key="arg.name" flex items-center gap-2>
              <span text-sm op-70>{{ arg.label }}</span>
              <n-switch
                v-if="arg.type === 'boolean'"
                :value="Boolean((step.args ??= {})[arg.name] ?? arg.default)"
                @update:value="(v: boolean) => (step.args ??= {})[arg.name] = v"
              />
              <n-select
                v-else-if="arg.type === 'select'"
                :value="String((step.args ??= {})[arg.name] ?? arg.default)"
                :options="arg.options.map(o => ({ label: o, value: o }))"
                style="min-width: 140px"
                @update:value="(v: string) => (step.args ??= {})[arg.name] = v"
              />
              <c-input-text
                v-else
                :value="String((step.args ??= {})[arg.name] ?? arg.default ?? '')"
                @update:value="(v: string) => (step.args ??= {})[arg.name] = v"
              />
            </div>
          </div>

          <n-alert
            v-if="result.steps[index]?.error"
            type="error"
            size="small"
            mt-2
            :show-icon="false"
          >
            {{ result.steps[index].error }}
          </n-alert>
        </n-card>
      </div>

      <n-button secondary @click="addStep">
        {{ t('tools.recipe-builder.addStep') }}
      </n-button>
    </c-card>

    <c-card :title="t('tools.recipe-builder.output')" mt-4>
      <c-input-text :value="result.output" multiline rows="6" raw-text monospace readonly />
      <div mt-3 flex gap-2>
        <c-button @click="copyOutput()">
          {{ t('tools.recipe-builder.copyOutput') }}
        </c-button>
        <c-button @click="copyLink()">
          {{ t('tools.recipe-builder.copyLink') }}
        </c-button>
      </div>
    </c-card>
  </div>
</template>

<style scoped>
.recipe-step--failed {
  outline: 1px solid var(--n-color-target);
}
</style>
