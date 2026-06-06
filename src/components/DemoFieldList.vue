<template>
  <dl class="demo-field-list">
    <div v-for="field in fields" :key="field.label" class="demo-field-list__row">
      <dt>
        {{ field.label }}
        <span v-if="field.required" class="demo-field-list__required">*</span>
      </dt>
      <dd>{{ field.value }}</dd>
    </div>
  </dl>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { DemoField } from '@/data/types';

defineOptions({ name: 'DemoFieldList' });

defineProps({
  fields: {
    type: Array as PropType<DemoField[]>,
    required: true,
  },
});
</script>

<style scoped>
.demo-field-list {
  display: grid;
  gap: 10px;
  margin: 0;
}

.demo-field-list__row {
  display: grid;
  grid-template-columns: 112px minmax(0, 1fr);
  gap: var(--demo-space-3);
  align-items: start;
  border-radius: var(--demo-radius-md);
  background: var(--demo-color-surface-muted);
  padding: 10px 12px;
}

dt {
  color: var(--demo-color-text-tertiary);
  font-size: 13px;
}

dd {
  min-width: 0;
  margin: 0;
  color: var(--demo-color-text);
  font-size: 14px;
  font-weight: 600;
  text-align: right;
  overflow-wrap: anywhere;
}

.demo-field-list__required {
  color: #a95650;
}

@media (max-width: 360px) {
  .demo-field-list__row {
    grid-template-columns: 1fr;
    gap: 4px;
  }

  dd {
    text-align: left;
  }
}
</style>
