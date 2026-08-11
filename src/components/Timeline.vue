<template>
  <ol class="timeline">
    <li v-for="item in items" :key="`${item.title}-${item.time}`" class="timeline__item">
      <span class="timeline__dot" :class="dotClass(item.tone)" />
      <div class="timeline__content">
        <div class="timeline__head">
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
import type { TimelineItem, Tone } from '@/data/types';

defineOptions({ name: 'Timeline' });

defineProps({
  items: {
    type: Array as PropType<TimelineItem[]>,
    required: true,
  },
});

const tagClass = (tone?: Tone) => {
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

const dotClass = (tone?: Tone) => {
  return tone ? `timeline__dot--${tone}` : '';
};
</script>

<style scoped>
.timeline {
  display: grid;
  gap: var(--ehr-space-3);
  margin: 0;
  padding: 0;
  list-style: none;
}

.timeline__item {
  position: relative;
  display: grid;
  grid-template-columns: 18px minmax(0, 1fr);
  gap: var(--ehr-space-3);
}

.timeline__item:not(:last-child)::before {
  position: absolute;
  top: 18px;
  bottom: -12px;
  left: 8px;
  width: 2px;
  border-radius: var(--ehr-radius-full);
  background: var(--ehr-color-border);
  content: "";
}

.timeline__dot {
  z-index: 1;
  width: 18px;
  height: 18px;
  border: 4px solid var(--ehr-color-surface);
  border-radius: var(--ehr-radius-full);
  background: var(--ehr-color-primary);
  box-shadow: var(--ehr-shadow-xs);
}

.timeline__dot--success {
  background: var(--ehr-color-success);
}

.timeline__dot--warning {
  background: var(--ehr-color-warning);
}

.timeline__dot--error {
  background: var(--ehr-color-error);
}

.timeline__dot--neutral {
  background: var(--ehr-color-ink-subtle);
}

.timeline__content {
  border: 1px solid rgba(214, 226, 223, 0.74);
  border-radius: var(--ehr-radius-lg);
  background: var(--ehr-color-surface-raised);
  padding: var(--ehr-space-3);
}

.timeline__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ehr-space-2);
}

strong {
  color: var(--ehr-color-ink);
  font-size: 14px;
}

p {
  margin: 6px 0 0;
  color: var(--ehr-color-ink-soft);
  font-size: 13px;
}

time {
  display: block;
  margin-top: 6px;
  color: var(--ehr-color-ink-muted);
  font-size: 12px;
}
</style>
