<template>
  <AppShell title="员工自助" subtitle="查询中心">
    <section class="self-service__hero demo-card">
      <div class="self-service__hero-head">
        <p class="self-service__eyebrow">员工自助</p>
        <span class="demo-tag demo-tag--neutral">Mock 数据</span>
      </div>
      <h1>你好，{{ employeeProfile.name }}</h1>
      <p>{{ employeeProfile.department }} · {{ employeeProfile.position }}</p>
      <div class="self-service__hero-stats" aria-label="员工自助演示范围">
        <span>
          <SearchCheck class="self-service__stat-icon" aria-hidden="true" :size="18" :stroke-width="2.1" />
          <strong>{{ selfServiceEntries.length }}</strong>
          <small>查询入口</small>
        </span>
        <span>
          <History class="self-service__stat-icon" aria-hidden="true" :size="18" :stroke-width="2.1" />
          <strong>{{ activities.length }}</strong>
          <small>近期动态</small>
        </span>
        <span>
          <Umbrella class="self-service__stat-icon" aria-hidden="true" :size="18" :stroke-width="2.1" />
          <strong>8.5</strong>
          <small>年假余额</small>
        </span>
      </div>
    </section>

    <SectionBlock title="自助入口" desc="覆盖员工档案、薪资、考勤、休假、撤回、绩效和 HR 联系人。">
      <div v-if="selfServiceCards.length" class="self-service__grid">
        <RouterLink
          v-for="item in selfServiceCards"
          :key="item.path"
          class="self-service__entry"
          :to="item.path"
          :aria-label="`${item.title}：${item.desc}`"
        >
          <span class="self-service__entry-icon" :class="`self-service__icon--${item.tone}`" aria-hidden="true">
            <component :is="item.icon" class="self-service__svg" :size="22" :stroke-width="2.1" />
          </span>
          <span class="self-service__entry-content">
            <span class="self-service__entry-head">
              <strong>{{ item.title }}</strong>
              <span class="demo-tag demo-tag--neutral">{{ item.category }}</span>
            </span>
            <small>{{ item.desc }}</small>
          </span>
        </RouterLink>
      </div>
      <div v-else class="self-service__empty" role="status">
        <Inbox class="self-service__svg" aria-hidden="true" :size="22" :stroke-width="2.1" />
        <span>暂无自助入口，请检查 mock 数据配置。</span>
      </div>
    </SectionBlock>

    <SectionBlock title="近期查询" desc="查看最近使用的员工自助服务。">
      <div class="self-service__activity-list">
        <button
          v-for="item in activities"
          :key="item.title"
          class="self-service__activity"
          type="button"
          :aria-label="`查看近期查询：${item.title}`"
          @click="showRecentQueryToast(item.title)"
        >
          <span class="self-service__activity-icon" :class="`self-service__icon--${item.tone}`" aria-hidden="true">
            <component :is="item.icon" class="self-service__svg" :size="20" :stroke-width="2.1" />
          </span>
          <span>
            <strong>{{ item.title }}</strong>
            <small>{{ item.desc }}</small>
          </span>
          <b>{{ item.time }}</b>
        </button>
      </div>
    </SectionBlock>

    <ToastMessage :message="toastMessage" />
  </AppShell>
</template>

<script setup lang="ts">
import type { Component } from 'vue';
import {
  CalendarClock,
  ChartColumn,
  CircleDollarSign,
  ContactRound,
  History,
  Inbox,
  RotateCcw,
  SearchCheck,
  Umbrella,
  UserRound,
  WalletCards,
} from '@lucide/vue';
import { computed } from 'vue';
import SectionBlock from '@/components/SectionBlock.vue';
import AppShell from '@/components/AppShell.vue';
import ToastMessage from '@/components/ToastMessage.vue';
import { useToastMessage } from '@/composables/useToastMessage';
import { employeeProfile, selfServiceEntries } from '@/data/mock';

type EntryTone = 'primary' | 'success' | 'warning' | 'error';

type EntryMeta = {
  icon: Component;
  category: string;
  tone: EntryTone;
};

type ActivityItem = {
  title: string;
  desc: string;
  time: string;
  icon: Component;
  tone: EntryTone;
};

const fallbackEntryMeta: EntryMeta = {
  icon: SearchCheck,
  category: '查询',
  tone: 'primary',
};

const selfServiceIconMap: Record<string, EntryMeta> = {
  '/self-service/profile': { icon: UserRound, category: '档案', tone: 'primary' },
  '/self-service/salary': { icon: CircleDollarSign, category: '薪资', tone: 'success' },
  '/self-service/attendance': { icon: CalendarClock, category: '考勤', tone: 'warning' },
  '/self-service/vacation': { icon: Umbrella, category: '假期', tone: 'success' },
  '/self-service/cancellation': { icon: RotateCcw, category: '撤回', tone: 'error' },
  '/self-service/summary-result': { icon: ChartColumn, category: '绩效', tone: 'primary' },
  '/self-service/contact-book': { icon: ContactRound, category: '联系人', tone: 'primary' },
};

const selfServiceCards = computed(() =>
  selfServiceEntries.map((item) => ({
    ...item,
    ...(selfServiceIconMap[item.path] ?? fallbackEntryMeta),
  })),
);

const activities = [
  { title: '薪资单已查看', desc: '2026-05 月薪资明细', time: '今天', icon: WalletCards, tone: 'success' },
  { title: '考勤异常待处理', desc: '05-13 下班缺卡记录', time: '05-14', icon: CalendarClock, tone: 'warning' },
  { title: '年假余额刷新', desc: '当前剩余 8.5 天', time: '05-10', icon: Umbrella, tone: 'primary' },
] satisfies ActivityItem[];

const { toastMessage, showToast: showToastMessage } = useToastMessage();

const showRecentQueryToast = (title: string) => {
  showToastMessage(`已打开查询记录：${title}`);
};
</script>

<style scoped>
.self-service__hero {
  display: grid;
  gap: var(--ehr-space-3);
  overflow: hidden;
  padding: var(--ehr-space-5);
  color: #ffffff;
  background: var(--ehr-bg-hero);
  box-shadow: var(--ehr-shadow-lg);
}

.self-service__hero-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ehr-space-3);
}

.self-service__hero .demo-tag {
  border-color: rgba(255, 255, 255, 0.2);
  color: #dff7f2;
  background: rgba(255, 255, 255, 0.12);
}

.self-service__eyebrow {
  margin: 0;
  color: rgba(255, 255, 255, 0.72);
  font-size: 12px;
  font-weight: 850;
  letter-spacing: 0;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  color: #ffffff;
  font-size: 24px;
  line-height: 1.25;
}

.self-service__hero p {
  margin: 0;
  color: rgba(255, 255, 255, 0.78);
  font-size: 14px;
}

.self-service__hero-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--ehr-space-3);
}

.self-service__hero-stats span {
  display: grid;
  min-height: 82px;
  gap: 5px;
  align-content: center;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: var(--ehr-radius-md);
  background: rgba(255, 255, 255, 0.11);
  padding: 14px 12px;
}

.self-service__stat-icon {
  color: #dff7f2;
}

.self-service__hero-stats strong {
  color: #ffffff;
  font-size: 22px;
}

.self-service__hero-stats small,
.self-service__entry small,
.self-service__activity small {
  color: var(--ehr-color-ink-muted);
  font-size: 12px;
}

.self-service__hero-stats small {
  color: rgba(255, 255, 255, 0.68);
}

.self-service__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--ehr-space-3);
}

.self-service__entry {
  display: grid;
  min-height: 162px;
  min-width: 0;
  gap: var(--ehr-space-3);
  align-content: start;
  border: 1px solid rgba(214, 226, 223, 0.76);
  border-radius: var(--ehr-radius-lg);
  background: var(--ehr-color-surface-raised);
  padding: var(--ehr-space-4);
  touch-action: manipulation;
  transition: background-color var(--ehr-motion-fast), box-shadow var(--ehr-motion-fast), transform var(--ehr-motion-fast);
}

.self-service__entry:active,
.self-service__activity:active {
  transform: scale(0.985);
}

.self-service__entry:focus-visible,
.self-service__activity:focus-visible {
  outline: none;
  box-shadow: var(--ehr-focus-ring);
}

.self-service__entry-icon {
  display: inline-flex;
  width: 42px;
  height: 42px;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: var(--ehr-radius-md);
}

.self-service__activity-icon {
  display: inline-flex;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: var(--ehr-radius-md);
}

.self-service__svg {
  display: block;
  flex-shrink: 0;
}

.self-service__icon--primary {
  color: var(--ehr-color-primary-strong);
  background: var(--ehr-color-primary-soft);
}

.self-service__icon--success {
  color: var(--ehr-color-success);
  background: var(--ehr-color-success-soft);
}

.self-service__icon--warning {
  color: var(--ehr-color-warning);
  background: var(--ehr-color-warning-soft);
}

.self-service__icon--error {
  color: var(--ehr-color-error);
  background: var(--ehr-color-error-soft);
}

.self-service__entry-content,
.self-service__activity span {
  display: grid;
  min-width: 0;
  gap: 3px;
}

.self-service__entry-head {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.self-service__entry strong,
.self-service__activity strong,
.self-service__empty span {
  color: var(--ehr-color-ink);
  font-size: 15px;
}

.self-service__entry small {
  line-height: 1.45;
}

.self-service__activity-list {
  display: grid;
  gap: var(--ehr-space-3);
}

.self-service__activity {
  display: grid;
  width: 100%;
  min-height: 72px;
  grid-template-columns: 40px minmax(0, 1fr) auto;
  gap: var(--ehr-space-3);
  align-items: center;
  border: 1px solid rgba(214, 226, 223, 0.76);
  border-radius: var(--ehr-radius-lg);
  background: var(--ehr-color-surface-raised);
  padding: 14px var(--ehr-space-3);
  text-align: left;
  touch-action: manipulation;
  transition: background-color var(--ehr-motion-fast), box-shadow var(--ehr-motion-fast), transform var(--ehr-motion-fast);
}

.self-service__activity b {
  color: var(--ehr-color-ink-muted);
  font-size: 12px;
  font-weight: 750;
}

.self-service__empty {
  display: grid;
  min-height: 96px;
  place-items: center;
  gap: var(--ehr-space-2);
  border-radius: var(--ehr-radius-md);
  color: var(--ehr-color-ink-soft);
  background: var(--ehr-color-surface-muted);
  padding: var(--ehr-space-4);
  text-align: center;
}

@media (max-width: 360px) {
  .self-service__grid,
  .self-service__hero-stats {
    grid-template-columns: 1fr;
  }
}
</style>
