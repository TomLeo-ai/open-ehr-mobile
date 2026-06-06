<template>
  <ol class="demo-timeline">
    <li v-for="item in items" :key="`${item.title}-${item.time}`" class="demo-timeline__item">
      <span class="demo-timeline__dot" :class="dotClass(item.tone)" />
      <div class="demo-timeline__content">
        <div class="demo-timeline__head">
          <strong>{{ item.title }}</strong>
          <span v-if="item.status" class="demo-tag" :class="tagClass(item.tone)">{{ item.status }}</span>
        </div>
        <p>{{ item.desc }}</p>
        <time>{{ item.time }}</time>
      </div>
    </li>
  </ol>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { DemoTimelineItem, DemoTone } from '@/data/types';

defineOptions({ name: 'DemoTimeline' });

defineProps({
  items: {
    type: Array as PropType<DemoTimelineItem[]>,
    required: true,
  },
});

const tagClass = (tone?: DemoTone) => {
  if (tone === 'success') {
    return 'demo-tag--success';
  }
  if (tone === 'warning') {
    return 'demo-tag--warning';
  }
  if (tone === 'error') {
    return 'demo-tag--error';
  }
  return '';
};

const dotClass = (tone?: DemoTone) => {
  return tone ? `demo-timeline__dot--${tone}` : '';
};
</script>

<style scoped>
.demo-timeline {
  display: grid;
  gap: var(--demo-space-3);
  margin: 0;
  padding: 0;
  list-style: none;
}

.demo-timeline__item {
  position: relative;
  display: grid;
  grid-template-columns: 18px minmax(0, 1fr);
  gap: var(--demo-space-3);
}

.demo-timeline__item:not(:last-child)::before {
  position: absolute;
  top: 18px;
  bottom: -12px;
  left: 8px;
  width: 2px;
  border-radius: var(--demo-radius-full);
  background: var(--demo-color-surface-strong);
  content: "";
}

.demo-timeline__dot {
  z-index: 1;
  width: 18px;
  height: 18px;
  border: 4px solid var(--demo-color-surface);
  border-radius: var(--demo-radius-full);
  background: var(--demo-color-primary);
  box-shadow: var(--demo-shadow-sm);
}

.demo-timeline__dot--success {
  background: var(--demo-color-success);
}

.demo-timeline__dot--warning {
  background: var(--demo-color-warning);
}

.demo-timeline__dot--error {
  background: var(--demo-color-error);
}

.demo-timeline__dot--neutral {
  background: var(--demo-color-text-quaternary);
}

.demo-timeline__content {
  border-radius: var(--demo-radius-md);
  background: var(--demo-color-surface-muted);
  padding: var(--demo-space-3);
}

.demo-timeline__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--demo-space-2);
}

strong {
  color: var(--demo-color-text);
  font-size: 14px;
}

p {
  margin: 6px 0 0;
  color: var(--demo-color-text-secondary);
  font-size: 13px;
}

time {
  display: block;
  margin-top: 6px;
  color: var(--demo-color-text-tertiary);
  font-size: 12px;
}
</style>
