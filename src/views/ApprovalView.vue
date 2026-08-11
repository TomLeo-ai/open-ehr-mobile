<template>
  <AppShell title="审批" subtitle="移动审批工作台">
    <section class="approval-view__hero demo-card">
      <div>
        <p>审批中心</p>
        <h1>{{ currentTabMeta.heading }}</h1>
        <span>{{ currentTabMeta.desc }}</span>
      </div>
      <span class="demo-tag demo-tag--neutral">Mock 数据</span>
    </section>

    <nav class="approval-view__tabs demo-card" aria-label="审批列表分类">
      <RouterLink
        v-for="item in tabsWithMeta"
        :key="item.key"
        class="approval-view__tab"
        :class="{ 'approval-view__tab--active': item.key === activeTab }"
        :to="item.path"
        :aria-label="`查看${item.label}，共${item.count}条`"
        :aria-current="item.key === activeTab ? 'page' : undefined"
      >
        <component :is="item.icon" class="approval-view__svg" aria-hidden="true" :size="18" :stroke-width="2.1" />
        <span class="approval-view__tab-label">{{ item.label }}</span>
        <span class="approval-view__tab-count">{{ item.count }}</span>
      </RouterLink>
    </nav>

    <section class="approval-view__summary" aria-label="审批数量概览">
      <article v-for="item in summaryCards" :key="item.key" class="approval-view__summary-card demo-card">
        <span class="approval-view__summary-icon" :class="`approval-view__icon--${item.tone}`" aria-hidden="true">
          <component :is="item.icon" class="approval-view__svg" :size="20" :stroke-width="2.1" />
        </span>
        <div>
          <strong>{{ item.count }}</strong>
          <span>{{ item.label }}</span>
        </div>
      </article>
    </section>

    <section class="approval-view__list" :aria-label="`${currentTabMeta.label}列表`" aria-live="polite">
      <RouterLink
        v-for="item in approvalCards"
        :key="item.id"
        class="approval-view__item demo-card"
        :to="`/approval/detail/${item.id}`"
        :aria-label="`查看审批详情：${item.title}，状态${item.status}`"
      >
        <span class="approval-view__item-icon" :class="`approval-view__icon--${item.tone}`" aria-hidden="true">
          <component :is="item.icon" class="approval-view__svg" :size="22" :stroke-width="2.1" />
        </span>
        <div class="approval-view__item-main">
          <div class="approval-view__item-head">
            <h2>{{ item.title }}</h2>
            <span class="demo-tag" :class="statusToneClass(item.tone)">{{ item.status }}</span>
          </div>
          <p>{{ item.desc }}</p>
          <dl class="approval-view__meta">
            <div v-for="meta in item.metaItems" :key="`${item.id}-${meta.label}-${meta.value}`">
              <dt>{{ meta.label }}</dt>
              <dd>{{ meta.value }}</dd>
            </div>
          </dl>
        </div>
        <ChevronRight class="approval-view__chevron" aria-hidden="true" :size="20" :stroke-width="2.2" />
      </RouterLink>

      <div v-if="approvalCards.length === 0" class="approval-view__empty demo-card" role="status">
        <span class="approval-view__empty-icon" aria-hidden="true">
          <Inbox class="approval-view__svg" :size="24" :stroke-width="2.1" />
        </span>
        <strong>暂无{{ currentTabMeta.label }}</strong>
        <small>当前 mock 数据没有对应审批单，可切换其他分类继续演示。</small>
      </div>
    </section>
  </AppShell>
</template>

<script setup lang="ts">
import type { Component } from 'vue';
import {
  BadgeCheck,
  ChevronRight,
  CircleAlert,
  ClipboardCheck,
  FileClock,
  FilePenLine,
  Inbox,
  ListChecks,
} from '@lucide/vue';
import { computed } from 'vue';
import AppShell from '@/components/AppShell.vue';
import { mergeApprovalListState } from '@/composables/useApprovalMockState';
import { approvalTabs, approvals } from '@/data/mock';
import type { ApprovalListItem, Tone } from '@/data/types';

type ApprovalTabKey = keyof typeof approvals;

type ApprovalMetaItem = {
  label: string;
  value: string;
};

type ApprovalCard = ApprovalListItem & {
  icon: Component;
  metaItems: ApprovalMetaItem[];
};

type TabMeta = {
  label: string;
  heading: string;
  desc: string;
  icon: Component;
  tone: Tone;
};

const props = defineProps({
  tab: {
    type: String,
    default: 'todo',
  },
});

const tabMetaMap: Record<ApprovalTabKey, TabMeta> = {
  todo: {
    label: '待办',
    heading: '待处理事项集中查看',
    desc: '按到达时间聚合审批任务，适合演示移动端负责人处理场景。',
    icon: ListChecks,
    tone: 'warning',
  },
  done: {
    label: '已办',
    heading: '已处理流程可追溯',
    desc: '查看已同意、已驳回和已处理记录，便于演示审批闭环。',
    icon: BadgeCheck,
    tone: 'success',
  },
  'my-process': {
    label: '我的流程',
    heading: '我发起的流程进度',
    desc: '展示当前发起人的流程状态和后续节点，适合业务方走查链路。',
    icon: FileClock,
    tone: 'primary',
  },
  draft: {
    label: '草稿',
    heading: '未提交申请继续编辑',
    desc: '保留未完成申请草稿，强调纯前端 mock 的可演示状态。',
    icon: FilePenLine,
    tone: 'neutral',
  },
};

const toneIconMap: Record<Tone, Component> = {
  primary: ClipboardCheck,
  success: BadgeCheck,
  warning: FileClock,
  error: CircleAlert,
  neutral: FilePenLine,
};

const isApprovalTabKey = (value: string): value is ApprovalTabKey => {
  return Object.prototype.hasOwnProperty.call(approvals, value);
};

const activeTab = computed<ApprovalTabKey>(() => {
  return isApprovalTabKey(props.tab) ? props.tab : 'todo';
});

const currentTabMeta = computed(() => tabMetaMap[activeTab.value]);

const tabsWithMeta = computed(() =>
  approvalTabs.map((item) => {
    const key = isApprovalTabKey(item.key) ? item.key : 'todo';
    return {
      ...item,
      ...tabMetaMap[key],
      key,
      count: approvals[key]?.length ?? 0,
    };
  }),
);

const summaryCards = computed(() =>
  tabsWithMeta.value.map((item) => ({
    key: item.key,
    label: item.label,
    count: item.count,
    icon: item.icon,
    tone: item.tone,
  })),
);

const list = computed(() => (approvals[activeTab.value] ?? []).map(mergeApprovalListState));

const parseMeta = (meta: string): ApprovalMetaItem[] => {
  return meta
    .split('|')
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item, index) => {
      if (item.startsWith('到达 ')) {
        return { label: '到达', value: item.replace('到达 ', '') };
      }

      const [label, ...valueParts] = item.split('：');
      if (valueParts.length > 0) {
        return {
          label,
          value: valueParts.join('：'),
        };
      }

      return {
        label: index === 0 ? '申请人' : '记录',
        value: item,
      };
    });
};

const approvalCards = computed<ApprovalCard[]>(() =>
  list.value.map((item) => ({
    ...item,
    icon: toneIconMap[item.tone],
    metaItems: parseMeta(item.meta),
  })),
);

const statusToneClass = (tone: Tone) => {
  if (tone === 'success') {
    return 'demo-tag--success';
  }
  if (tone === 'warning') {
    return 'demo-tag--warning';
  }
  if (tone === 'error') {
    return 'demo-tag--error';
  }
  if (tone === 'neutral') {
    return 'demo-tag--neutral';
  }
  return '';
};
</script>

<style scoped>
.approval-view__hero {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--ehr-space-3);
  overflow: hidden;
  padding: var(--ehr-space-5);
  color: #ffffff;
  background: var(--ehr-bg-hero);
  box-shadow: var(--ehr-shadow-lg);
}

.approval-view__hero div {
  min-width: 0;
}

.approval-view__hero p {
  margin: 0;
  color: rgba(255, 255, 255, 0.72);
  font-size: 12px;
  font-weight: 850;
  text-transform: uppercase;
}

.approval-view__hero h1 {
  margin: 4px 0;
  color: #ffffff;
  font-size: 24px;
  line-height: 1.25;
}

.approval-view__hero span:not(.demo-tag) {
  display: block;
  color: rgba(255, 255, 255, 0.78);
  font-size: 13px;
  line-height: 1.45;
}

.approval-view__hero .demo-tag {
  flex: 0 0 auto;
  border-color: rgba(255, 255, 255, 0.2);
  color: #dff7f2;
  background: rgba(255, 255, 255, 0.12);
}

.approval-view__tabs {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 6px;
  border: 1px solid rgba(214, 226, 223, 0.82);
  padding: 7px;
}

.approval-view__tab {
  display: grid;
  min-width: 0;
  min-height: 58px;
  align-content: center;
  justify-items: center;
  gap: 3px;
  border-radius: var(--ehr-radius-md);
  color: var(--ehr-color-ink-muted);
  font-size: 12px;
  font-weight: 750;
  touch-action: manipulation;
  transition: background-color var(--ehr-motion-fast), color var(--ehr-motion-fast), transform var(--ehr-motion-fast);
}

.approval-view__tab:active,
.approval-view__item:active {
  transform: scale(0.985);
}

.approval-view__tab:focus-visible,
.approval-view__item:focus-visible {
  outline: none;
  box-shadow: var(--ehr-focus-ring);
}

.approval-view__tab--active {
  color: var(--ehr-color-primary-strong);
  background: var(--ehr-color-primary-soft);
}

.approval-view__tab-label,
.approval-view__tab-count {
  display: block;
}

.approval-view__tab-label {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.approval-view__tab-count {
  font-size: 11px;
}

.approval-view__summary {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--ehr-space-3);
}

.approval-view__summary-card {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr);
  gap: var(--ehr-space-3);
  align-items: center;
  min-height: 76px;
  border: 1px solid rgba(214, 226, 223, 0.78);
  padding: var(--ehr-space-3);
}

.approval-view__summary-icon,
.approval-view__item-icon,
.approval-view__empty-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: var(--ehr-radius-md);
}

.approval-view__summary-icon {
  width: 42px;
  height: 42px;
}

.approval-view__summary strong {
  display: block;
  color: var(--ehr-color-ink);
  font-size: 24px;
  line-height: 1;
}

.approval-view__summary span:not(.approval-view__summary-icon) {
  display: block;
  margin-top: 4px;
  color: var(--ehr-color-ink-muted);
  font-size: 12px;
  font-weight: 750;
}

.approval-view__list {
  display: grid;
  gap: var(--ehr-space-3);
}

.approval-view__item {
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr) auto;
  gap: var(--ehr-space-3);
  align-items: flex-start;
  min-height: 126px;
  border: 1px solid rgba(214, 226, 223, 0.78);
  padding: var(--ehr-space-4) var(--ehr-space-3);
  touch-action: manipulation;
  transition: background-color var(--ehr-motion-fast), box-shadow var(--ehr-motion-fast), transform var(--ehr-motion-fast);
}

.approval-view__item:hover {
  box-shadow: var(--ehr-shadow-md);
}

.approval-view__item-icon {
  width: 48px;
  height: 48px;
}

.approval-view__item-main {
  min-width: 0;
}

.approval-view__item-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--ehr-space-2);
}

.approval-view__item h2 {
  min-width: 0;
  margin: 0;
  color: var(--ehr-color-ink);
  font-size: 16px;
  font-weight: 800;
  line-height: 1.35;
}

.approval-view__item p {
  display: -webkit-box;
  overflow: hidden;
  margin: 6px 0 0;
  color: var(--ehr-color-ink-soft);
  font-size: 13px;
  line-height: 1.45;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.approval-view__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: var(--ehr-space-2) 0 0;
}

.approval-view__meta div {
  display: inline-flex;
  max-width: 100%;
  min-height: 26px;
  align-items: center;
  gap: 4px;
  border-radius: var(--ehr-radius-full);
  background: var(--ehr-color-surface-muted);
  padding: 2px 8px;
}

.approval-view__meta dt,
.approval-view__meta dd {
  margin: 0;
  min-width: 0;
  font-size: 11px;
  line-height: 1.35;
}

.approval-view__meta dt {
  flex: 0 0 auto;
  color: var(--ehr-color-ink-muted);
}

.approval-view__meta dd {
  overflow: hidden;
  color: var(--ehr-color-ink-soft);
  font-weight: 750;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.approval-view__chevron {
  align-self: center;
  flex-shrink: 0;
  color: var(--ehr-color-ink-subtle);
}

.approval-view__svg {
  display: block;
}

.approval-view__icon--primary {
  color: var(--ehr-color-primary-strong);
  background: var(--ehr-color-primary-soft);
}

.approval-view__icon--success {
  color: var(--ehr-color-success);
  background: var(--ehr-color-success-soft);
}

.approval-view__icon--warning {
  color: var(--ehr-color-warning);
  background: var(--ehr-color-warning-soft);
}

.approval-view__icon--error {
  color: var(--ehr-color-error);
  background: var(--ehr-color-error-soft);
}

.approval-view__icon--neutral {
  color: var(--ehr-color-neutral);
  background: var(--ehr-color-neutral-soft);
}

.approval-view__empty {
  display: grid;
  justify-items: center;
  gap: var(--ehr-space-2);
  padding: var(--ehr-space-5);
  text-align: center;
}

.approval-view__empty-icon {
  width: 48px;
  height: 48px;
  color: var(--ehr-color-primary-strong);
  background: var(--ehr-color-primary-soft);
}

.approval-view__empty strong {
  color: var(--ehr-color-ink);
  font-size: 16px;
}

.approval-view__empty small {
  color: var(--ehr-color-ink-muted);
  font-size: 12px;
  line-height: 1.45;
}

@media (max-width: 360px) {
  .approval-view__hero {
    display: grid;
  }

  .approval-view__hero .demo-tag {
    justify-self: flex-start;
  }

  .approval-view__tabs {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .approval-view__item {
    grid-template-columns: 44px minmax(0, 1fr);
  }

  .approval-view__item-icon {
    width: 44px;
    height: 44px;
  }

  .approval-view__chevron {
    display: none;
  }
}
</style>
