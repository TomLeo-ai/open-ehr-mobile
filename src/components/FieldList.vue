<template>
  <dl class="field-list">
    <div v-for="field in fields" :key="field.label" class="field-list__row">
      <dt>
        {{ field.label }}
        <span v-if="field.required" class="field-list__required">*</span>
      </dt>
      <dd>{{ field.value }}</dd>
    </div>
  </dl>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { FieldDefinition } from '@/data/types';

defineOptions({ name: 'FieldList' });

defineProps({
  fields: {
    type: Array as PropType<FieldDefinition[]>,
    required: true,
  },
});
</script>

<style scoped>
.field-list {
  display: grid;
  gap: 10px;
  margin: 0;
}

.field-list__row {
  display: grid;
  grid-template-columns: 112px minmax(0, 1fr);
  gap: var(--ehr-space-3);
  align-items: start;
  border: 1px solid rgba(214, 226, 223, 0.74);
  border-radius: var(--ehr-radius-lg);
  background: var(--ehr-color-surface-raised);
  padding: 10px 12px;
}

dt {
  color: var(--ehr-color-ink-muted);
  font-size: 13px;
}

dd {
  min-width: 0;
  margin: 0;
  color: var(--ehr-color-ink);
  font-size: 14px;
  font-weight: 800;
  text-align: right;
  overflow-wrap: anywhere;
}

.field-list__required {
  color: var(--ehr-color-error);
}

@media (max-width: 360px) {
  .field-list__row {
    grid-template-columns: 1fr;
    gap: 4px;
  }

  dd {
    text-align: left;
  }
}
</style>
