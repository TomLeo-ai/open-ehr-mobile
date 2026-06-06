<template>
  <DemoShell title="打卡记录" subtitle="月度考勤" show-back :with-tabbar="false">
    <section class="attendance-view__summary">
      <article v-for="item in stats" :key="item.label" class="attendance-view__stat demo-card">
        <strong>{{ item.value }}</strong>
        <span>{{ item.label }}</span>
      </article>
    </section>

    <section class="attendance-view__filters" aria-label="考勤筛选">
      <button
        v-for="item in filters"
        :key="item"
        class="attendance-view__filter"
        :class="{ 'attendance-view__filter--active': activeFilter === item }"
        type="button"
        @click="activeFilter = item"
      >
        {{ item }}
      </button>
    </section>

    <DemoBlocks title="每日记录" desc="点击记录可查看打卡详情。">
      <div class="attendance-view__list">
        <button
          v-for="item in visibleDays"
          :key="item.day"
          class="attendance-view__item"
          type="button"
          @click="selectedDay = item"
        >
          <span>
            <strong>{{ item.day }}</strong>
            <small>{{ item.desc }}</small>
          </span>
          <b :class="`attendance-view__status attendance-view__status--${getTone(item.status)}`">
            {{ item.status }}
          </b>
        </button>
      </div>
    </DemoBlocks>

    <div v-if="selectedDay" class="attendance-view__dialog" role="dialog" aria-modal="true">
      <article class="attendance-view__dialog-card demo-card">
        <h2>{{ selectedDay.day }} 打卡详情</h2>
        <p>{{ selectedDay.desc }}</p>
        <div class="attendance-view__dialog-actions">
          <button class="demo-secondary-button" type="button" @click="selectedDay = null">关闭</button>
          <button class="demo-primary-button" type="button" @click="applyException">发起异常申请</button>
        </div>
      </article>
    </div>

    <DemoToast :message="toastMessage" />
  </DemoShell>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import DemoBlocks from '@/components/DemoBlocks.vue';
import DemoShell from '@/components/DemoShell.vue';
import DemoToast from '@/components/DemoToast.vue';
import { attendanceDays } from '@/data/mock';

type AttendanceDay = (typeof attendanceDays)[number];

const filters = ['全部', '正常', '异常', '外勤'];
const activeFilter = ref('全部');
const selectedDay = ref<AttendanceDay | null>(null);
const toastMessage = ref('');
let timer: number | undefined;

const stats = [
  { label: '正常出勤', value: '18 天' },
  { label: '异常记录', value: '1 条' },
  { label: '外勤记录', value: '2 条' },
];

const visibleDays = computed(() => {
  if (activeFilter.value === '全部') {
    return attendanceDays;
  }
  return attendanceDays.filter((item) => item.status === activeFilter.value);
});

const getTone = (status: string) => {
  if (status === '异常') return 'error';
  if (status === '外勤') return 'warning';
  return 'success';
};

const showToast = (message: string) => {
  toastMessage.value = message;
  window.clearTimeout(timer);
  timer = window.setTimeout(() => {
    toastMessage.value = '';
  }, 2200);
};

const applyException = () => {
  selectedDay.value = null;
  showToast('已进入考勤异常申请');
};
</script>

<style scoped>
.attendance-view__summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--demo-space-3);
}

.attendance-view__stat {
  display: grid;
  gap: 2px;
  justify-items: center;
  padding: var(--demo-space-3);
}

.attendance-view__stat strong {
  color: var(--demo-color-primary-dark);
  font-size: 20px;
}

.attendance-view__stat span,
.attendance-view__item small {
  color: var(--demo-color-text-tertiary);
  font-size: 12px;
}

.attendance-view__filters {
  display: flex;
  gap: var(--demo-space-2);
  overflow-x: auto;
  scrollbar-width: none;
}

.attendance-view__filters::-webkit-scrollbar {
  display: none;
}

.attendance-view__filter {
  flex: 0 0 auto;
  border-radius: var(--demo-radius-full);
  color: var(--demo-color-text-secondary);
  background: var(--demo-color-surface-inset);
  padding: 8px 14px;
  font-size: 13px;
}

.attendance-view__filter--active {
  color: rgba(255, 255, 255, 0.96);
  background: var(--demo-color-primary);
  font-weight: 600;
}

.attendance-view__list {
  display: grid;
  gap: var(--demo-space-3);
}

.attendance-view__item {
  display: grid;
  width: 100%;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: var(--demo-space-3);
  align-items: center;
  border-radius: var(--demo-radius-md);
  background: var(--demo-color-surface-muted);
  padding: var(--demo-space-3);
  text-align: left;
}

.attendance-view__item span {
  display: grid;
  min-width: 0;
  gap: 3px;
}

.attendance-view__item strong {
  color: var(--demo-color-text);
  font-size: 15px;
}

.attendance-view__status {
  border-radius: var(--demo-radius-full);
  padding: 3px 9px;
  font-size: 12px;
}

.attendance-view__status--success {
  color: #2f6a50;
  background: var(--demo-color-success-soft);
}

.attendance-view__status--warning {
  color: #8f6b2f;
  background: var(--demo-color-warning-soft);
}

.attendance-view__status--error {
  color: #a95650;
  background: var(--demo-color-error-soft);
}

.attendance-view__dialog {
  position: fixed;
  z-index: 60;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgba(32, 50, 65, 0.28);
  padding: var(--demo-space-4);
}

.attendance-view__dialog-card {
  width: min(398px, 100%);
  padding: var(--demo-space-5);
}

.attendance-view__dialog-card h2 {
  margin: 0;
  color: var(--demo-color-text);
  font-size: 18px;
}

.attendance-view__dialog-card p {
  margin: var(--demo-space-3) 0 var(--demo-space-4);
  color: var(--demo-color-text-secondary);
  font-size: 14px;
}

.attendance-view__dialog-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--demo-space-3);
}

@media (max-width: 360px) {
  .attendance-view__summary,
  .attendance-view__dialog-actions {
    grid-template-columns: 1fr;
  }
}
</style>
