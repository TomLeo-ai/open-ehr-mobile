<template>
  <AppShell title="休假结余" subtitle="假期账户" show-back :with-tabbar="false">
    <section class="vacation-view__tabs" aria-label="假期类型">
      <button
        v-for="item in vacationTabs"
        :key="item.type"
        class="vacation-view__tab"
        :class="{ 'vacation-view__tab--active': item.type === selectedVacation.type }"
        type="button"
        :aria-pressed="item.type === selectedVacation.type"
        @click="selectVacation(item.type)"
      >
        <span class="vacation-view__tab-icon" :class="`vacation-view__icon--${item.tone}`" aria-hidden="true">
          <component :is="item.icon" class="vacation-view__svg" :size="17" :stroke-width="2.1" />
        </span>
        <span>{{ item.type }}</span>
      </button>
    </section>

    <section class="vacation-view__balance demo-card" aria-labelledby="vacation-title">
      <div class="vacation-view__balance-head">
        <span class="vacation-view__balance-icon" :class="`vacation-view__icon--${currentMeta.tone}`" aria-hidden="true">
          <component :is="currentMeta.icon" class="vacation-view__svg" :size="24" :stroke-width="2.1" />
        </span>
        <div class="vacation-view__balance-main">
          <span>假期账户</span>
          <h1 id="vacation-title">{{ selectedVacation.type }}余额</h1>
        </div>
        <span class="demo-tag demo-tag--neutral">Mock 数据</span>
      </div>
      <strong>{{ selectedVacation.balance }}</strong>
      <p>{{ currentMeta.desc }}，已使用 {{ selectedVacation.used }}，记录按最近时间排序。</p>
      <div class="vacation-view__metrics" aria-label="假期账户摘要">
        <article>
          <small>当前余额</small>
          <b>{{ selectedVacation.balance }}</b>
        </article>
        <article>
          <small>已使用</small>
          <b>{{ selectedVacation.used }}</b>
        </article>
        <article>
          <small>记录数</small>
          <b>{{ selectedVacation.records.length }} 条</b>
        </article>
      </div>
      <div
        class="vacation-view__progress"
        role="progressbar"
        :aria-label="`${selectedVacation.type}余额使用进度`"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-valuenow="progressNumber"
      >
        <i :style="{ width: progressWidth }" />
      </div>
    </section>

    <SectionBlock title="使用记录" desc="点击可查看假期记录反馈。">
      <div v-if="selectedVacation.records.length" class="vacation-view__records">
        <button
          v-for="record in selectedVacation.records"
          :key="record"
          class="vacation-view__record"
          type="button"
          :aria-label="`查看假期记录：${record}`"
          @click="showToast(`已查看：${record}`)"
        >
          <span class="vacation-view__record-icon" :class="`vacation-view__icon--${currentMeta.tone}`" aria-hidden="true">
            <History class="vacation-view__svg" :size="18" :stroke-width="2.1" />
          </span>
          <span class="vacation-view__record-main">
            <span>{{ record }}</span>
            <small>{{ selectedVacation.type }}使用记录</small>
          </span>
          <ChevronRight class="vacation-view__record-action" aria-hidden="true" :size="18" :stroke-width="2.1" />
        </button>
      </div>
      <div v-else class="vacation-view__empty" role="status">
        <Info class="vacation-view__svg" aria-hidden="true" :size="20" :stroke-width="2.1" />
        <span>暂无假期使用记录，请检查 mock 假期数据。</span>
      </div>
    </SectionBlock>

    <SectionBlock title="假期操作" desc="支持休假申请和余额刷新。">
      <div class="vacation-view__actions">
        <button class="demo-primary-button" type="button" @click="showToast('已创建休假申请模拟记录')">
          <FilePenLine class="vacation-view__svg" aria-hidden="true" :size="17" :stroke-width="2.15" />
          模拟发起休假申请
        </button>
        <button class="demo-secondary-button" type="button" @click="showToast('假期余额已刷新')">
          <RefreshCw class="vacation-view__svg" aria-hidden="true" :size="17" :stroke-width="2.15" />
          刷新余额
        </button>
      </div>
    </SectionBlock>

    <ToastMessage :message="toastMessage" />
  </AppShell>
</template>

<script setup lang="ts">
import type { Component } from 'vue';
import {
  CalendarCheck,
  ChevronRight,
  FilePenLine,
  Gift,
  History,
  Info,
  RefreshCw,
  TimerReset,
  Umbrella,
} from '@lucide/vue';
import { computed, ref } from 'vue';
import SectionBlock from '@/components/SectionBlock.vue';
import AppShell from '@/components/AppShell.vue';
import ToastMessage from '@/components/ToastMessage.vue';
import { useToastMessage } from '@/composables/useToastMessage';
import { vacations } from '@/data/mock';

type Vacation = (typeof vacations)[number];
type VacationTone = 'primary' | 'success' | 'warning' | 'error';

type VacationMeta = {
  icon: Component;
  tone: VacationTone;
  desc: string;
};

const activeType = ref(vacations[0]?.type ?? '');
const { toastMessage, showToast } = useToastMessage();

const selectedVacation = computed(() => vacations.find((item) => item.type === activeType.value) ?? vacations[0]);

const fallbackMeta: VacationMeta = {
  icon: Umbrella,
  tone: 'primary',
  desc: '假期账户为纯前端 mock 数据',
};

const vacationMetaMap: Record<string, VacationMeta> = {
  年假: { icon: CalendarCheck, tone: 'success', desc: '年假余额按年度初始化并随使用记录更新' },
  调休: { icon: TimerReset, tone: 'warning', desc: '调休余额来自加班转调休和已使用记录' },
  福利假: { icon: Gift, tone: 'primary', desc: '福利假用于演示企业补充假期账户' },
};

const vacationTabs = computed(() =>
  vacations.map((item) => ({
    ...item,
    ...(vacationMetaMap[item.type] ?? fallbackMeta),
  })),
);

const currentMeta = computed(() => vacationMetaMap[selectedVacation.value.type] ?? fallbackMeta);

const progressValue = computed(() => {
  if (selectedVacation.value.type === '年假') return '71%';
  if (selectedVacation.value.type === '调休') return '75%';
  return '100%';
});

const progressNumber = computed(() => Number(progressValue.value.replace('%', '')));

const progressWidth = computed(() => `${progressNumber.value}%`);

const selectVacation = (type: Vacation['type']) => {
  activeType.value = type;
};
</script>

<style scoped>
.vacation-view__tabs {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--demo-space-2);
  border-radius: var(--demo-radius-lg);
  background: var(--demo-color-surface-inset);
  padding: 4px;
}

.vacation-view__tab {
  display: grid;
  min-height: 54px;
  min-width: 0;
  grid-template-columns: 34px minmax(0, 1fr);
  gap: var(--demo-space-2);
  align-items: center;
  border-radius: var(--demo-radius-md);
  color: var(--demo-color-text-secondary);
  background: transparent;
  padding: 9px 10px;
  font-size: 13px;
  font-weight: 600;
  touch-action: manipulation;
  transition: background-color 0.18s ease, box-shadow 0.18s ease, color 0.18s ease, transform 0.18s ease;
}

.vacation-view__tab--active {
  color: var(--demo-color-primary-dark);
  background: #fff;
  box-shadow: var(--demo-shadow-sm);
}

.vacation-view__tab:active,
.vacation-view__record:active,
.vacation-view__actions button:active {
  transform: scale(0.985);
}

.vacation-view__tab:focus-visible,
.vacation-view__record:focus-visible,
.vacation-view__actions button:focus-visible {
  outline: 2px solid var(--demo-color-primary);
  outline-offset: 2px;
}

.vacation-view__balance {
  display: grid;
  gap: var(--demo-space-3);
  padding: var(--demo-space-5);
  background:
    linear-gradient(135deg, rgba(184, 212, 200, 0.38), rgba(255, 255, 255, 0.98)),
    #fff;
}

.vacation-view__balance-head {
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr) auto;
  gap: var(--demo-space-3);
  align-items: start;
}

.vacation-view__balance-icon,
.vacation-view__tab-icon,
.vacation-view__record-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: var(--demo-radius-md);
}

.vacation-view__balance-icon {
  width: 48px;
  height: 48px;
}

.vacation-view__tab-icon {
  width: 34px;
  height: 34px;
}

.vacation-view__record-icon {
  width: 40px;
  height: 40px;
}

.vacation-view__balance-main {
  display: grid;
  min-width: 0;
  gap: 4px;
}

.vacation-view__balance-main span {
  color: var(--demo-color-text-secondary);
  font-size: 14px;
  font-weight: 600;
}

h1 {
  margin: 0;
  color: var(--demo-color-text);
  font-size: 22px;
  line-height: 1.25;
}

.vacation-view__balance strong {
  color: var(--demo-color-primary-dark);
  font-size: 32px;
  line-height: 1.2;
}

.vacation-view__balance p {
  margin: 0;
  color: var(--demo-color-text-tertiary);
  font-size: 13px;
  line-height: 1.5;
}

.vacation-view__metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--demo-space-2);
}

.vacation-view__metrics article {
  display: grid;
  min-height: 74px;
  gap: 4px;
  align-content: center;
  border-radius: var(--demo-radius-md);
  background: rgba(255, 255, 255, 0.72);
  padding: 12px;
}

.vacation-view__metrics small {
  color: var(--demo-color-text-tertiary);
  font-size: 11px;
  font-weight: 600;
}

.vacation-view__metrics b {
  color: var(--demo-color-primary-dark);
  font-size: 16px;
}

.vacation-view__progress {
  overflow: hidden;
  height: 7px;
  border-radius: var(--demo-radius-full);
  background: var(--demo-color-surface-inset);
}

.vacation-view__progress i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--demo-color-primary);
}

.vacation-view__icon--primary {
  color: var(--demo-color-primary-dark);
  background: var(--demo-color-primary-soft);
}

.vacation-view__icon--success {
  color: #2f6a50;
  background: var(--demo-color-success-soft);
}

.vacation-view__icon--warning {
  color: #8f6b2f;
  background: var(--demo-color-warning-soft);
}

.vacation-view__icon--error {
  color: #a95650;
  background: var(--demo-color-error-soft);
}

.vacation-view__svg {
  display: block;
  flex-shrink: 0;
}

.vacation-view__records {
  display: grid;
  gap: var(--demo-space-2);
}

.vacation-view__record {
  display: grid;
  width: 100%;
  min-height: 72px;
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

.vacation-view__record:active {
  background: var(--demo-color-primary-soft);
}

.vacation-view__record-main {
  display: grid;
  min-width: 0;
  gap: 3px;
}

.vacation-view__record-main span {
  color: var(--demo-color-text);
  font-size: 14px;
  font-weight: 600;
}

.vacation-view__record-main small {
  color: var(--demo-color-text-tertiary);
  font-size: 12px;
}

.vacation-view__record-action {
  color: var(--demo-color-text-quaternary);
  flex-shrink: 0;
}

.vacation-view__actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--demo-space-3);
}

.vacation-view__actions button {
  gap: var(--demo-space-2);
  touch-action: manipulation;
}

.vacation-view__empty {
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
  .vacation-view__balance-head {
    grid-template-columns: 48px minmax(0, 1fr);
  }

  .vacation-view__balance-head .demo-tag {
    grid-column: 1 / -1;
    justify-self: start;
  }

  .vacation-view__tabs,
  .vacation-view__metrics,
  .vacation-view__actions {
    grid-template-columns: 1fr;
  }
}
</style>
