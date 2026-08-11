<template>
  <AppShell title="首页" subtitle="HR 服务工作台">
    <section class="home-view__hero demo-card">
      <div class="home-view__hero-top">
        <div>
          <p class="home-view__eyebrow">Open EHR Mobile</p>
          <h1>今日员工服务工作台</h1>
        </div>
        <span class="demo-tag demo-tag--neutral">Mock 数据</span>
      </div>

      <div class="home-view__profile-line">
        <div class="home-view__avatar">{{ employeeProfile.name.slice(0, 1) }}</div>
        <div>
          <strong>{{ employeeProfile.name }}</strong>
          <span>{{ employeeProfile.position }} · {{ employeeProfile.department }}</span>
        </div>
      </div>

      <div class="home-view__hero-actions">
        <RouterLink class="home-view__primary-action" to="/approval/todo" aria-label="处理待办审批">
          <ListChecks class="home-view__svg" aria-hidden="true" :size="18" :stroke-width="2.15" />
          处理待办
        </RouterLink>
        <RouterLink class="home-view__secondary-action" to="/apply" aria-label="进入流程申请中心">
          <FilePenLine class="home-view__svg" aria-hidden="true" :size="18" :stroke-width="2.15" />
          发起申请
        </RouterLink>
      </div>
    </section>

    <section class="home-view__stats" aria-label="今日工作概览">
      <RouterLink
        v-for="item in statCards"
        :key="item.label"
        class="home-view__stat demo-card"
        :to="item.path"
        :aria-label="`${item.label}：${item.value}`"
      >
        <span class="home-view__stat-icon" :class="`home-view__icon--${item.tone}`" aria-hidden="true">
          <component :is="item.icon" class="home-view__svg" :size="18" :stroke-width="2.15" />
        </span>
        <span class="home-view__stat-main">
          <strong>{{ item.value }}</strong>
          <span>{{ item.label }}</span>
        </span>
      </RouterLink>
    </section>

    <RouterLink class="home-view__demo-check demo-card" to="/demo-checklist" aria-label="查看业务导览">
      <span class="home-view__demo-check-icon home-view__icon--primary" aria-hidden="true">
        <Route class="home-view__svg" :size="22" :stroke-width="2.1" />
      </span>
      <div class="home-view__demo-check-content">
        <strong>业务导览</strong>
        <small>按演示路径串联首页、申请、审批和员工自助</small>
      </div>
      <ChevronRight class="home-view__chevron" aria-hidden="true" :size="22" :stroke-width="2.2" />
    </RouterLink>

    <SectionBlock title="快捷申请" desc="把高频流程放在首屏附近，适合移动端即时发起。">
      <div class="home-view__grid">
        <RouterLink
          v-for="item in quickApplyCards"
          :key="item.title"
          class="home-view__entry"
          :to="item.path"
          :aria-label="`${item.title}：${item.desc}`"
        >
          <span class="home-view__entry-icon" :class="`home-view__icon--${item.tone}`" aria-hidden="true">
            <component :is="item.icon" class="home-view__svg" :size="21" :stroke-width="2.1" />
          </span>
          <strong>{{ item.title }}</strong>
          <small>{{ item.desc }}</small>
        </RouterLink>
      </div>
    </SectionBlock>

    <SectionBlock title="自助查询" desc="员工档案、薪资、假期和 HR 联系人保持一跳可达。">
      <div class="home-view__query-list">
        <RouterLink
          v-for="item in quickQueryCards"
          :key="item.title"
          class="home-view__query"
          :to="item.path"
          :aria-label="`${item.title}：${item.desc}`"
        >
          <span class="home-view__query-icon" :class="`home-view__icon--${item.tone}`" aria-hidden="true">
            <component :is="item.icon" class="home-view__svg" :size="20" :stroke-width="2.1" />
          </span>
          <span>
            <strong>{{ item.title }}</strong>
            <small>{{ item.desc }}</small>
          </span>
          <ChevronRight class="home-view__chevron" aria-hidden="true" :size="20" :stroke-width="2.2" />
        </RouterLink>
      </div>
    </SectionBlock>

    <SectionBlock title="公司公告" desc="保留演示提醒，同时强调数据均为 mock。">
      <div class="home-view__notice-list">
        <button
          v-for="item in notices"
          :key="item.title"
          class="home-view__notice"
          type="button"
          :aria-label="`查看公告：${item.title}`"
          @click="showNotice(item.title)"
        >
          <span class="home-view__notice-icon home-view__icon--primary" aria-hidden="true">
            <Bell class="home-view__svg" :size="19" :stroke-width="2.1" />
          </span>
          <span>
            <strong>{{ item.title }}</strong>
            <small>{{ item.desc }}</small>
          </span>
          <time>{{ item.date }}</time>
        </button>
      </div>
    </SectionBlock>

    <ToastMessage :message="toastMessage" />
  </AppShell>
</template>

<script setup lang="ts">
import type { Component } from 'vue';
import {
  Bell,
  CalendarClock,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  ContactRound,
  FileClock,
  FilePenLine,
  IdCard,
  ListChecks,
  Route,
  UserRound,
} from '@lucide/vue';
import { computed } from 'vue';
import SectionBlock from '@/components/SectionBlock.vue';
import AppShell from '@/components/AppShell.vue';
import ToastMessage from '@/components/ToastMessage.vue';
import { useToastMessage } from '@/composables/useToastMessage';
import { employeeProfile, homeStats, notices, quickApplyItems, quickQueryItems } from '@/data/mock';

type IconTone = 'primary' | 'success' | 'warning' | 'error';

type IconMeta = {
  icon: Component;
  tone: IconTone;
};

const fallbackIconMeta: IconMeta = {
  icon: ClipboardList,
  tone: 'primary',
};

const statIconMap: Record<string, IconMeta> = {
  待办审批: { icon: ListChecks, tone: 'warning' },
  我的流程: { icon: FileClock, tone: 'primary' },
  我的草稿: { icon: FilePenLine, tone: 'success' },
};

const quickApplyIconMap: Record<string, IconMeta> = {
  '/apply/on-job': { icon: IdCard, tone: 'primary' },
  '/apply/attendance-exception': { icon: CalendarClock, tone: 'warning' },
  '/apply/resignation': { icon: FilePenLine, tone: 'error' },
};

const quickQueryIconMap: Record<string, IconMeta> = {
  '/self-service/profile': { icon: UserRound, tone: 'primary' },
  '/self-service/salary': { icon: CircleDollarSign, tone: 'success' },
  '/self-service/vacation': { icon: CalendarClock, tone: 'warning' },
  '/self-service/contact-book': { icon: ContactRound, tone: 'primary' },
};

const withIconMeta = <T extends { path: string }>(item: T, map: Record<string, IconMeta>) => {
  return {
    ...item,
    ...(map[item.path] ?? fallbackIconMeta),
  };
};

const statCards = computed(() =>
  homeStats.map((item) => ({
    ...item,
    ...(statIconMap[item.label] ?? fallbackIconMeta),
  })),
);

const quickApplyCards = computed(() => quickApplyItems.map((item) => withIconMeta(item, quickApplyIconMap)));

const quickQueryCards = computed(() => quickQueryItems.map((item) => withIconMeta(item, quickQueryIconMap)));

const { toastMessage, showToast } = useToastMessage();

const showNotice = (title: string) => {
  showToast(`公告详情：${title}`);
};
</script>

<style scoped>
.home-view__hero {
  display: grid;
  gap: var(--ehr-space-4);
  padding: var(--ehr-space-5);
  border: 0;
  color: #fff;
  background: var(--ehr-bg-hero);
  box-shadow: var(--ehr-shadow-lg);
}

.home-view__hero-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--ehr-space-3);
}

.home-view__eyebrow {
  margin: 0;
  color: rgba(255, 255, 255, 0.76);
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
}

.home-view__hero h1 {
  margin: 3px 0 0;
  color: #fff;
  font-size: 26px;
  line-height: 1.18;
}

.home-view__hero .demo-tag {
  border-color: rgba(255, 255, 255, 0.2);
  color: #dff7f2;
  background: rgba(255, 255, 255, 0.12);
}

.home-view__profile-line {
  display: grid;
  grid-template-columns: 52px minmax(0, 1fr);
  gap: var(--ehr-space-3);
  align-items: center;
}

.home-view__avatar {
  display: inline-flex;
  width: 52px;
  height: 52px;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.26);
  border-radius: var(--ehr-radius-lg);
  color: #fff;
  background: rgba(255, 255, 255, 0.14);
  font-size: 22px;
  font-weight: 850;
}

.home-view__profile-line strong,
.home-view__profile-line span {
  display: block;
  min-width: 0;
}

.home-view__profile-line strong {
  color: #fff;
  font-size: 18px;
}

.home-view__profile-line span {
  overflow: hidden;
  margin-top: 3px;
  color: rgba(255, 255, 255, 0.74);
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.home-view__hero-actions {
  display: grid;
  grid-template-columns: 1.25fr 1fr;
  gap: var(--ehr-space-3);
}

.home-view__primary-action,
.home-view__secondary-action {
  display: inline-flex;
  min-height: 46px;
  align-items: center;
  justify-content: center;
  gap: var(--ehr-space-2);
  border-radius: var(--ehr-radius-md);
  font-size: 14px;
  font-weight: 800;
  touch-action: manipulation;
  transition: transform var(--ehr-motion-fast), background-color var(--ehr-motion-fast);
}

.home-view__primary-action {
  color: var(--ehr-color-primary-strong);
  background: #fff;
}

.home-view__secondary-action {
  border: 1px solid rgba(255, 255, 255, 0.24);
  color: #fff;
  background: rgba(255, 255, 255, 0.12);
}

.home-view__stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--ehr-space-3);
}

.home-view__stat,
.home-view__demo-check,
.home-view__entry,
.home-view__query,
.home-view__notice,
.home-view__primary-action,
.home-view__secondary-action {
  touch-action: manipulation;
  transition: background-color var(--ehr-motion-fast), box-shadow var(--ehr-motion-fast), transform var(--ehr-motion-fast);
}

.home-view__stat:active,
.home-view__demo-check:active,
.home-view__entry:active,
.home-view__query:active,
.home-view__notice:active,
.home-view__primary-action:active,
.home-view__secondary-action:active {
  transform: scale(0.985);
}

.home-view__stat:focus-visible,
.home-view__demo-check:focus-visible,
.home-view__entry:focus-visible,
.home-view__query:focus-visible,
.home-view__notice:focus-visible,
.home-view__primary-action:focus-visible,
.home-view__secondary-action:focus-visible {
  outline: none;
  box-shadow: var(--ehr-focus-ring);
}

.home-view__stat {
  display: grid;
  min-height: 96px;
  gap: var(--ehr-space-2);
  align-content: center;
  justify-items: start;
  padding: var(--ehr-space-4);
}

.home-view__stat-main {
  display: grid;
  gap: 2px;
}

.home-view__stat strong {
  color: var(--ehr-color-ink);
  font-size: 28px;
  line-height: 1;
}

.home-view__stat span:not(.home-view__stat-icon):not(.home-view__stat-main) {
  color: var(--ehr-color-ink-soft);
  font-size: 12px;
  font-weight: 750;
}

.home-view__demo-check {
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr) auto;
  gap: var(--ehr-space-3);
  align-items: center;
  min-height: 82px;
  padding: var(--ehr-space-4);
}

.home-view__stat-icon,
.home-view__demo-check-icon,
.home-view__entry-icon,
.home-view__query-icon,
.home-view__notice-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.home-view__stat-icon {
  width: 36px;
  height: 36px;
  border-radius: var(--ehr-radius-md);
}

.home-view__demo-check-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--ehr-radius-md);
}

.home-view__entry-icon,
.home-view__query-icon,
.home-view__notice-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--ehr-radius-md);
}

.home-view__icon--primary {
  color: var(--ehr-color-primary-strong);
  background: var(--ehr-color-primary-soft);
}

.home-view__icon--success {
  color: var(--ehr-color-success);
  background: var(--ehr-color-success-soft);
}

.home-view__icon--warning {
  color: var(--ehr-color-warning);
  background: var(--ehr-color-warning-soft);
}

.home-view__icon--error {
  color: var(--ehr-color-error);
  background: var(--ehr-color-error-soft);
}

.home-view__svg {
  display: block;
}

.home-view__demo-check strong,
.home-view__demo-check small {
  display: block;
}

.home-view__demo-check-content {
  min-width: 0;
}

.home-view__demo-check strong {
  color: var(--ehr-color-ink);
  font-size: 16px;
}

.home-view__demo-check small {
  color: var(--ehr-color-ink-muted);
  font-size: 12px;
  line-height: 1.45;
}

.home-view__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--ehr-space-3);
}

.home-view__entry {
  display: grid;
  min-height: 128px;
  gap: 7px;
  align-content: start;
  justify-items: start;
  border: 1px solid rgba(214, 226, 223, 0.76);
  border-radius: var(--ehr-radius-lg);
  background: var(--ehr-color-surface-raised);
  padding: var(--ehr-space-3);
  text-align: left;
}

.home-view__entry strong,
.home-view__query strong,
.home-view__notice strong {
  display: block;
  color: var(--ehr-color-ink);
  font-size: 14px;
  line-height: 1.35;
}

.home-view__entry small,
.home-view__query small,
.home-view__notice small {
  display: -webkit-box;
  overflow: hidden;
  color: var(--ehr-color-ink-muted);
  font-size: 11px;
  line-height: 1.45;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.home-view__query-list,
.home-view__notice-list {
  display: grid;
  gap: var(--ehr-space-3);
}

.home-view__query,
.home-view__notice {
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr) auto;
  gap: var(--ehr-space-3);
  align-items: center;
  min-height: 74px;
  border: 1px solid rgba(214, 226, 223, 0.76);
  border-radius: var(--ehr-radius-lg);
  background: var(--ehr-color-surface-raised);
  padding: 14px var(--ehr-space-3);
  text-align: left;
}

.home-view__notice {
  width: 100%;
}

.home-view__chevron {
  color: var(--ehr-color-ink-subtle);
  flex-shrink: 0;
}

time {
  color: var(--ehr-color-ink-muted);
  font-size: 12px;
  white-space: nowrap;
}

@media (max-width: 360px) {
  .home-view__grid,
  .home-view__stats {
    grid-template-columns: 1fr;
  }

  .home-view__hero-actions {
    grid-template-columns: 1fr;
  }
}
</style>
