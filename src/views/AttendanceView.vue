<template>
  <AppShell title="打卡记录" subtitle="月度考勤" show-back :with-tabbar="false">
    <section class="attendance-view__hero demo-card" aria-labelledby="attendance-title">
      <div class="attendance-view__hero-head">
        <span class="attendance-view__hero-icon attendance-view__icon--primary" aria-hidden="true">
          <CalendarClock class="attendance-view__svg" :size="24" :stroke-width="2.1" />
        </span>
        <div>
          <p class="attendance-view__eyebrow">考勤查询</p>
          <h1 id="attendance-title">2026-05 月度打卡</h1>
        </div>
        <span class="demo-tag demo-tag--neutral">Mock 数据</span>
      </div>
      <p>按状态筛选每日记录，演示移动端员工自助查询与异常申请入口。</p>
      <div class="attendance-view__summary" aria-label="考勤摘要">
        <article v-for="item in stats" :key="item.label" class="attendance-view__stat">
          <span class="attendance-view__stat-icon" :class="`attendance-view__icon--${item.tone}`" aria-hidden="true">
            <component :is="item.icon" class="attendance-view__svg" :size="18" :stroke-width="2.1" />
          </span>
          <strong>{{ item.value }}</strong>
          <span>{{ item.label }}</span>
        </article>
      </div>
    </section>

    <section class="attendance-view__filters" aria-label="考勤筛选">
      <ListFilter class="attendance-view__filter-icon" aria-hidden="true" :size="18" :stroke-width="2.1" />
      <button
        v-for="item in filters"
        :key="item"
        class="attendance-view__filter"
        :class="{ 'attendance-view__filter--active': activeFilter === item }"
        type="button"
        :aria-pressed="activeFilter === item"
        @click="setFilter(item)"
      >
        {{ item }}
      </button>
    </section>

    <SectionBlock title="每日记录" desc="点击记录可查看打卡详情。">
      <div v-if="visibleDays.length" class="attendance-view__list">
        <button
          v-for="item in visibleDays"
          :key="item.day"
          class="attendance-view__item"
          type="button"
          :aria-label="`查看 ${item.day} 打卡详情：${item.status}，${item.desc}`"
          @click="selectedDay = item"
        >
          <span class="attendance-view__item-icon" :class="`attendance-view__icon--${getTone(item.status)}`" aria-hidden="true">
            <component :is="getStatusIcon(item.status)" class="attendance-view__svg" :size="19" :stroke-width="2.1" />
          </span>
          <span>
            <strong>{{ item.day }}</strong>
            <small>{{ item.desc }}</small>
          </span>
          <b :class="`attendance-view__status attendance-view__status--${getTone(item.status)}`">
            {{ item.status }}
          </b>
        </button>
      </div>
      <div v-else class="attendance-view__empty" role="status">
        <Info class="attendance-view__svg" aria-hidden="true" :size="20" :stroke-width="2.1" />
        <span>暂无匹配的打卡记录，请检查 mock 考勤数据。</span>
      </div>
    </SectionBlock>

    <div
      v-if="selectedDay"
      class="attendance-view__dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="attendance-detail-title"
      aria-describedby="attendance-detail-desc"
    >
      <article class="attendance-view__dialog-card demo-card">
        <button class="attendance-view__dialog-close" type="button" aria-label="关闭打卡详情" @click="selectedDay = null">
          <X class="attendance-view__svg" aria-hidden="true" :size="20" :stroke-width="2.2" />
        </button>
        <span class="attendance-view__dialog-icon" :class="`attendance-view__icon--${getTone(selectedDay.status)}`" aria-hidden="true">
          <component :is="getStatusIcon(selectedDay.status)" class="attendance-view__svg" :size="22" :stroke-width="2.1" />
        </span>
        <p class="attendance-view__dialog-eyebrow">打卡详情</p>
        <h2 id="attendance-detail-title">{{ selectedDay.day }} 打卡详情</h2>
        <p id="attendance-detail-desc">{{ selectedDay.desc }}</p>
        <dl class="attendance-view__dialog-meta">
          <div>
            <dt>当前状态</dt>
            <dd :class="`attendance-view__status attendance-view__status--${getTone(selectedDay.status)}`">
              {{ selectedDay.status }}
            </dd>
          </div>
          <div>
            <dt>数据来源</dt>
            <dd>前端 mock</dd>
          </div>
        </dl>
        <div class="attendance-view__dialog-actions">
          <button class="demo-secondary-button" type="button" @click="selectedDay = null">关闭</button>
          <button class="demo-primary-button" type="button" @click="applyException">
            <FilePenLine class="attendance-view__svg" aria-hidden="true" :size="17" :stroke-width="2.15" />
            发起异常申请
          </button>
        </div>
      </article>
    </div>

  </AppShell>
</template>

<script setup lang="ts">
import type { Component } from 'vue';
import {
  CalendarClock,
  CheckCircle2,
  Clock3,
  FilePenLine,
  Info,
  ListFilter,
  MapPin,
  TriangleAlert,
  X,
} from '@lucide/vue';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import SectionBlock from '@/components/SectionBlock.vue';
import AppShell from '@/components/AppShell.vue';
import { attendanceDays } from '@/data/mock';

type AttendanceDay = (typeof attendanceDays)[number];
type AttendanceFilter = '全部' | AttendanceDay['status'];
type AttendanceTone = 'success' | 'warning' | 'error' | 'primary';

type AttendanceStat = {
  label: string;
  value: string;
  icon: Component;
  tone: AttendanceTone;
};

const filters = ['全部', '正常', '异常', '外勤'] satisfies AttendanceFilter[];
const activeFilter = ref<AttendanceFilter>('全部');
const selectedDay = ref<AttendanceDay | null>(null);
const router = useRouter();

const countByStatus = (status: AttendanceDay['status']) => attendanceDays.filter((item) => item.status === status).length;

const stats = computed(
  () =>
    [
      { label: '正常出勤', value: `${countByStatus('正常')} 天`, icon: CheckCircle2, tone: 'success' },
      { label: '异常记录', value: `${countByStatus('异常')} 条`, icon: TriangleAlert, tone: 'error' },
      { label: '外勤记录', value: `${countByStatus('外勤')} 条`, icon: MapPin, tone: 'warning' },
    ] satisfies AttendanceStat[],
);

const visibleDays = computed(() => {
  if (activeFilter.value === '全部') {
    return attendanceDays;
  }
  return attendanceDays.filter((item) => item.status === activeFilter.value);
});

const setFilter = (filter: AttendanceFilter) => {
  activeFilter.value = filter;
  selectedDay.value = null;
};

const getTone = (status: string): AttendanceTone => {
  if (status === '异常') return 'error';
  if (status === '外勤') return 'warning';
  return 'success';
};

const getStatusIcon = (status: string): Component => {
  if (status === '异常') return TriangleAlert;
  if (status === '外勤') return MapPin;
  if (status === '正常') return CheckCircle2;
  return Clock3;
};

const applyException = () => {
  selectedDay.value = null;
  void router.push('/apply/attendance-exception');
};
</script>

<style scoped>
.attendance-view__hero {
  display: grid;
  gap: var(--demo-space-3);
  padding: var(--demo-space-5);
  background:
    linear-gradient(135deg, rgba(107, 140, 174, 0.2), rgba(255, 255, 255, 0.98)),
    #fff;
}

.attendance-view__hero-head {
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr) auto;
  gap: var(--demo-space-3);
  align-items: start;
}

.attendance-view__hero-icon,
.attendance-view__stat-icon,
.attendance-view__item-icon,
.attendance-view__dialog-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: var(--demo-radius-md);
}

.attendance-view__hero-icon {
  width: 48px;
  height: 48px;
}

.attendance-view__eyebrow {
  margin: 0;
  color: var(--demo-color-primary-dark);
  font-size: 12px;
  font-weight: 700;
}

h1 {
  margin: 3px 0 0;
  color: var(--demo-color-text);
  font-size: 22px;
  line-height: 1.25;
}

.attendance-view__hero p {
  margin: 0;
  color: var(--demo-color-text-secondary);
  font-size: 13px;
  line-height: 1.5;
}

.attendance-view__summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--demo-space-2);
  margin-top: var(--demo-space-2);
}

.attendance-view__stat {
  display: grid;
  min-height: 92px;
  gap: 6px;
  align-content: center;
  border-radius: var(--demo-radius-md);
  background: rgba(255, 255, 255, 0.72);
  padding: 12px;
}

.attendance-view__stat strong {
  color: var(--demo-color-primary-dark);
  font-size: 22px;
  line-height: 1;
}

.attendance-view__stat span,
.attendance-view__item small {
  color: var(--demo-color-text-tertiary);
  font-size: 12px;
}

.attendance-view__stat-icon,
.attendance-view__item-icon,
.attendance-view__dialog-icon {
  width: 40px;
  height: 40px;
}

.attendance-view__icon--primary {
  color: var(--demo-color-primary-dark);
  background: var(--demo-color-primary-soft);
}

.attendance-view__icon--success {
  color: #2f6a50;
  background: var(--demo-color-success-soft);
}

.attendance-view__icon--warning {
  color: #8f6b2f;
  background: var(--demo-color-warning-soft);
}

.attendance-view__icon--error {
  color: #a95650;
  background: var(--demo-color-error-soft);
}

.attendance-view__svg {
  display: block;
  flex-shrink: 0;
}

.attendance-view__filters {
  display: grid;
  grid-template-columns: 34px repeat(4, minmax(0, 1fr));
  gap: var(--demo-space-2);
  align-items: center;
  border-radius: var(--demo-radius-lg);
  background: var(--demo-color-surface-inset);
  padding: 4px;
}

.attendance-view__filter-icon {
  color: var(--demo-color-text-tertiary);
  justify-self: center;
}

.attendance-view__filter {
  min-height: 44px;
  min-width: 0;
  border-radius: var(--demo-radius-md);
  color: var(--demo-color-text-secondary);
  background: transparent;
  padding: 0 8px;
  font-size: 13px;
  font-weight: 600;
  touch-action: manipulation;
  transition: background-color 0.18s ease, box-shadow 0.18s ease, color 0.18s ease, transform 0.18s ease;
}

.attendance-view__filter--active {
  color: var(--demo-color-primary-dark);
  background: #fff;
  font-weight: 600;
  box-shadow: var(--demo-shadow-sm);
}

.attendance-view__filter:active,
.attendance-view__item:active,
.attendance-view__dialog-actions button:active,
.attendance-view__dialog-close:active {
  transform: scale(0.985);
}

.attendance-view__filter:focus-visible,
.attendance-view__item:focus-visible,
.attendance-view__dialog-actions button:focus-visible,
.attendance-view__dialog-close:focus-visible {
  outline: 2px solid var(--demo-color-primary);
  outline-offset: 2px;
}

.attendance-view__list {
  display: grid;
  gap: var(--demo-space-3);
}

.attendance-view__item {
  display: grid;
  width: 100%;
  min-height: 76px;
  grid-template-columns: 40px minmax(0, 1fr) auto;
  gap: var(--demo-space-3);
  align-items: center;
  border: 0;
  border-radius: var(--demo-radius-md);
  background: var(--demo-color-surface-muted);
  padding: 14px var(--demo-space-3);
  text-align: left;
  touch-action: manipulation;
  transition: background-color 0.18s ease, transform 0.18s ease;
}

.attendance-view__item:active {
  background: var(--demo-color-primary-soft);
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
  display: inline-flex;
  min-height: 26px;
  align-items: center;
  justify-content: center;
  border-radius: var(--demo-radius-full);
  padding: 3px 9px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
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
  position: relative;
  display: grid;
  width: min(398px, 100%);
  gap: var(--demo-space-3);
  padding: var(--demo-space-5);
}

.attendance-view__dialog-close {
  position: absolute;
  top: 12px;
  right: 12px;
  display: inline-flex;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  border-radius: var(--demo-radius-md);
  color: var(--demo-color-text-tertiary);
  background: transparent;
  touch-action: manipulation;
}

.attendance-view__dialog-icon {
  margin-bottom: 2px;
}

.attendance-view__dialog-eyebrow {
  margin: 0;
  color: var(--demo-color-primary-dark);
  font-size: 12px;
  font-weight: 700;
}

.attendance-view__dialog-card h2 {
  margin: 0;
  color: var(--demo-color-text);
  font-size: 20px;
}

.attendance-view__dialog-card p {
  margin: 0;
  color: var(--demo-color-text-secondary);
  font-size: 13px;
  line-height: 1.5;
}

.attendance-view__dialog-meta {
  display: grid;
  gap: var(--demo-space-2);
  margin: 0;
}

.attendance-view__dialog-meta div {
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr);
  gap: var(--demo-space-3);
  align-items: center;
  border-radius: var(--demo-radius-md);
  background: var(--demo-color-surface-muted);
  padding: 10px 12px;
}

.attendance-view__dialog-meta dt {
  color: var(--demo-color-text-tertiary);
  font-size: 12px;
}

.attendance-view__dialog-meta dd {
  min-width: 0;
  margin: 0;
  color: var(--demo-color-text);
  font-size: 13px;
  font-weight: 600;
  text-align: right;
}

.attendance-view__dialog-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--demo-space-3);
}

.attendance-view__dialog-actions .demo-primary-button {
  gap: var(--demo-space-2);
}

.attendance-view__empty {
  display: grid;
  min-height: 96px;
  place-items: center;
  gap: var(--demo-space-2);
  border-radius: var(--demo-radius-md);
  color: var(--demo-color-text-secondary);
  background: var(--demo-color-surface-muted);
  padding: var(--demo-space-4);
  text-align: center;
}

@media (max-width: 360px) {
  .attendance-view__hero-head {
    grid-template-columns: 48px minmax(0, 1fr);
  }

  .attendance-view__hero-head .demo-tag {
    grid-column: 1 / -1;
    justify-self: start;
  }

  .attendance-view__summary,
  .attendance-view__dialog-actions {
    grid-template-columns: 1fr;
  }

  .attendance-view__filters {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .attendance-view__filter-icon {
    display: none;
  }

  .attendance-view__item {
    grid-template-columns: 40px minmax(0, 1fr);
  }

  .attendance-view__status {
    justify-self: start;
  }
}
</style>
