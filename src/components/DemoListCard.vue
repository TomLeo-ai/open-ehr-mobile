<template>
  <button class="demo-list-card demo-card" type="button">
    <div class="demo-list-card__main">
      <h3>{{ title }}</h3>
      <p>{{ desc }}</p>
      <small>{{ meta }}</small>
    </div>
    <span class="demo-tag" :class="toneClass">{{ status }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue';
import type { DemoTone } from '@/data/types';

defineOptions({ name: 'DemoListCard' });

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  meta: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  tone: {
    type: String as PropType<DemoTone>,
    default: 'primary',
  },
});

const toneClass = computed(() => {
  if (props.tone === 'success') {
    return 'demo-tag--success';
  }
  if (props.tone === 'warning') {
    return 'demo-tag--warning';
  }
  if (props.tone === 'error') {
    return 'demo-tag--error';
  }
  return '';
});
</script>

<style scoped>
.demo-list-card {
  display: flex;
  width: 100%;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--demo-space-3);
  padding: var(--demo-space-4);
  text-align: left;
  transition: transform 0.18s ease, background-color 0.18s ease;
}

.demo-list-card:active {
  transform: scale(0.985);
  background: var(--demo-color-surface-muted);
}

.demo-list-card__main {
  min-width: 0;
}

h3 {
  margin: 0;
  color: var(--demo-color-text);
  font-size: 16px;
  font-weight: 600;
  line-height: 1.35;
}

p {
  display: -webkit-box;
  overflow: hidden;
  margin: 6px 0 0;
  color: var(--demo-color-text-secondary);
  font-size: 13px;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

small {
  display: block;
  margin-top: 8px;
  color: var(--demo-color-text-tertiary);
  font-size: 12px;
}
</style>
