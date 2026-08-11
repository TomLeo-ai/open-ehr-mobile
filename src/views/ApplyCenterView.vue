<template>
  <AppShell title="流程申请" subtitle="员工流程服务">
    <section class="apply-center__hero demo-card">
      <div class="apply-center__hero-top">
        <div>
          <p>Employee Request Hub</p>
          <h1>常用申请集中办理</h1>
          <span>以移动端场景组织证明、考勤、激励、材料和异动流程。</span>
        </div>
        <span class="apply-center__hero-badge">纯前端 Mock</span>
      </div>

      <div class="apply-center__hero-actions">
        <RouterLink class="apply-center__hero-action apply-center__hero-action--primary" to="/apply/on-job">
          <FilePlus aria-hidden="true" :size="17" :stroke-width="2.15" />
          开具证明
          <ChevronRight aria-hidden="true" :size="18" :stroke-width="2.2" />
        </RouterLink>
        <RouterLink class="apply-center__hero-action" to="/approval/my-process">
          <FileSearch aria-hidden="true" :size="17" :stroke-width="2.15" />
          我的流程
        </RouterLink>
      </div>

      <div class="apply-center__hero-stats" aria-label="申请中心演示范围">
        <span><strong>5</strong> 类流程</span>
        <span><strong>15</strong> 条链路</span>
        <span><strong>Mock</strong> 数据</span>
      </div>
    </section>

    <section class="apply-center__lane demo-card" aria-label="申请办理路径">
      <div v-for="step in processSteps" :key="step.title" class="apply-center__lane-step">
        <span>{{ step.index }}</span>
        <strong>{{ step.title }}</strong>
        <small>{{ step.desc }}</small>
      </div>
    </section>

    <SectionBlock title="常用流程" desc="覆盖证明、推荐奖励、居住证和户籍办理等高频申请。">
      <div class="apply-center__list">
        <article v-for="item in primaryEntries" :key="item.title" class="apply-center__item">
          <span class="apply-center__item-icon" :class="`apply-center__icon--${item.tone}`" aria-hidden="true">
            <component :is="item.icon" class="apply-center__svg" :size="22" :stroke-width="2.1" />
          </span>
          <div class="apply-center__content">
            <div class="apply-center__item-head">
              <strong>{{ item.title }}</strong>
              <span class="demo-tag demo-tag--neutral">{{ item.category }}</span>
            </div>
            <small>{{ item.desc }}</small>
            <div class="apply-center__item-meta" aria-label="流程能力">
              <span>新增申请</span>
              <span>详情查看</span>
              <span>重新发起</span>
            </div>
            <nav :aria-label="`${item.title}操作`">
              <RouterLink class="apply-center__action" :to="item.path" :aria-label="`新增${item.title}`">
                <FilePlus class="apply-center__action-icon" aria-hidden="true" :size="16" :stroke-width="2.15" />
                新增
              </RouterLink>
              <RouterLink class="apply-center__action" :to="item.detailPath" :aria-label="`查看${item.title}详情`">
                <FileSearch class="apply-center__action-icon" aria-hidden="true" :size="16" :stroke-width="2.15" />
                详情
              </RouterLink>
              <RouterLink class="apply-center__action" :to="item.reissuePath" :aria-label="`重新发起${item.title}`">
                <RotateCcw class="apply-center__action-icon" aria-hidden="true" :size="16" :stroke-width="2.15" />
                重发起
              </RouterLink>
            </nav>
          </div>
        </article>
      </div>
    </SectionBlock>

    <SectionBlock title="其他流程" desc="覆盖考勤异常、离职等员工服务场景。">
      <div class="apply-center__list">
        <article v-for="item in laterEntries" :key="item.title" class="apply-center__item">
          <span class="apply-center__item-icon" :class="`apply-center__icon--${item.tone}`" aria-hidden="true">
            <component :is="item.icon" class="apply-center__svg" :size="22" :stroke-width="2.1" />
          </span>
          <div class="apply-center__content">
            <div class="apply-center__item-head">
              <strong>{{ item.title }}</strong>
              <span class="demo-tag demo-tag--neutral">{{ item.category }}</span>
            </div>
            <small>{{ item.desc }}</small>
            <div class="apply-center__item-meta" aria-label="流程能力">
              <span>新增申请</span>
              <span>详情查看</span>
              <span>重新发起</span>
            </div>
            <nav :aria-label="`${item.title}操作`">
              <RouterLink class="apply-center__action" :to="item.path" :aria-label="`新增${item.title}`">
                <FilePlus class="apply-center__action-icon" aria-hidden="true" :size="16" :stroke-width="2.15" />
                新增
              </RouterLink>
              <RouterLink class="apply-center__action" :to="item.detailPath" :aria-label="`查看${item.title}详情`">
                <FileSearch class="apply-center__action-icon" aria-hidden="true" :size="16" :stroke-width="2.15" />
                详情
              </RouterLink>
              <RouterLink class="apply-center__action" :to="item.reissuePath" :aria-label="`重新发起${item.title}`">
                <RotateCcw class="apply-center__action-icon" aria-hidden="true" :size="16" :stroke-width="2.15" />
                重发起
              </RouterLink>
            </nav>
          </div>
        </article>
      </div>
    </SectionBlock>
  </AppShell>
</template>

<script setup lang="ts">
import type { Component } from 'vue';
import {
  Award,
  CalendarClock,
  ChevronRight,
  FilePenLine,
  FilePlus,
  FileSearch,
  HousePlus,
  IdCard,
  RotateCcw,
  UserRoundPlus,
} from '@lucide/vue';
import SectionBlock from '@/components/SectionBlock.vue';
import AppShell from '@/components/AppShell.vue';

type EntryTone = 'primary' | 'success' | 'warning' | 'error';

type ApplyEntry = {
  title: string;
  desc: string;
  path: string;
  detailPath: string;
  reissuePath: string;
  category: string;
  icon: Component;
  tone: EntryTone;
};

const processSteps = [
  { index: '01', title: '选择流程', desc: '按员工场景进入申请' },
  { index: '02', title: '补充材料', desc: '表单、附件、说明集中填写' },
  { index: '03', title: '跟踪流转', desc: '详情与重发起链路完整可演示' },
];

const primaryEntries = [
  {
    title: '在职/收入证明申请',
    desc: '员工信息、证明用途、收取类型、模板、签收与附件。',
    path: '/apply/on-job',
    detailPath: '/apply/on-job/detail/CERT-20260601-001',
    reissuePath: '/apply/on-job/reissue/CERT-20260601-001',
    category: '证明',
    icon: IdCard,
    tone: 'primary',
  },
  {
    title: '内部推荐奖励申请',
    desc: '推荐人、被推荐人、岗位入职、奖励说明与附件。',
    path: '/apply/recommend-reward',
    detailPath: '/apply/recommend-reward/detail/REF-20260601-001',
    reissuePath: '/apply/recommend-reward/reissue/REF-20260601-001',
    category: '激励',
    icon: Award,
    tone: 'success',
  },
  {
    title: '居住证/户籍办理申请',
    desc: '申请类别、事项、工作业绩、学历与材料附件。',
    path: '/apply/settle',
    detailPath: '/apply/settle/detail/RESIDE-20260601-001',
    reissuePath: '/apply/settle/reissue/RESIDE-20260601-001',
    category: '材料',
    icon: HousePlus,
    tone: 'warning',
  },
] satisfies ApplyEntry[];

const laterEntries = [
  {
    title: '考勤异常申请',
    desc: '异常类别、日期、时长、事由、附件与审批状态。',
    path: '/apply/attendance-exception',
    detailPath: '/apply/attendance-exception/detail/ATT-20260601-001',
    reissuePath: '/apply/attendance-exception/reissue/ATT-20260601-001',
    category: '考勤',
    icon: CalendarClock,
    tone: 'warning',
  },
  {
    title: '离职申请',
    desc: '离职原因、领取方式、调研问卷、竞业和文书材料。',
    path: '/apply/resignation',
    detailPath: '/apply/resignation/detail/OFFBOARD-20260601-001',
    reissuePath: '/apply/resignation/reissue/OFFBOARD-20260601-001',
    category: '异动',
    icon: UserRoundPlus,
    tone: 'error',
  },
] satisfies ApplyEntry[];
</script>

<style scoped>
.apply-center__hero {
  display: grid;
  gap: var(--ehr-space-4);
  overflow: hidden;
  padding: var(--ehr-space-5);
  color: #ffffff;
  background: var(--ehr-bg-hero);
  box-shadow: var(--ehr-shadow-lg);
}

.apply-center__hero-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--ehr-space-3);
}

.apply-center__hero p {
  margin: 0;
  color: rgba(255, 255, 255, 0.72);
  font-size: 12px;
  font-weight: 850;
  text-transform: uppercase;
}

.apply-center__hero h1 {
  margin: 4px 0;
  color: #ffffff;
  font-size: 24px;
  line-height: 1.25;
}

.apply-center__hero span {
  color: rgba(255, 255, 255, 0.78);
  font-size: 13px;
}

.apply-center__hero-badge {
  display: inline-flex;
  min-height: 28px;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--ehr-radius-full);
  padding: 0 10px;
  background: rgba(255, 255, 255, 0.12);
  font-size: 12px;
  font-weight: 750;
  white-space: nowrap;
}

.apply-center__hero-actions {
  display: grid;
  grid-template-columns: 1.25fr 1fr;
  gap: var(--ehr-space-3);
}

.apply-center__hero-action {
  display: inline-flex;
  min-height: 46px;
  align-items: center;
  justify-content: center;
  gap: var(--ehr-space-2);
  border: 1px solid rgba(255, 255, 255, 0.24);
  border-radius: var(--ehr-radius-md);
  color: #ffffff;
  background: rgba(255, 255, 255, 0.12);
  font-size: 14px;
  font-weight: 800;
  touch-action: manipulation;
  transition: transform var(--ehr-motion-fast), box-shadow var(--ehr-motion-fast);
}

.apply-center__hero-action--primary {
  border-color: #ffffff;
  color: var(--ehr-color-primary-strong);
  background: #ffffff;
}

.apply-center__hero-action:active {
  transform: scale(0.985);
}

.apply-center__hero-action:focus-visible {
  outline: none;
  box-shadow: var(--ehr-focus-ring);
}

.apply-center__hero-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--ehr-space-2);
}

.apply-center__hero-stats span {
  display: grid;
  min-height: 54px;
  align-content: center;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: var(--ehr-radius-md);
  color: rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.11);
  padding: var(--ehr-space-2);
  font-size: 11px;
  font-weight: 750;
}

.apply-center__hero-stats strong {
  color: #ffffff;
  font-size: 17px;
  line-height: 1.1;
}

.apply-center__lane {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--ehr-space-2);
  padding: var(--ehr-space-3);
}

.apply-center__lane-step {
  display: grid;
  min-width: 0;
  gap: 4px;
  border-radius: var(--ehr-radius-lg);
  background: var(--ehr-color-surface-muted);
  padding: var(--ehr-space-3);
}

.apply-center__lane-step span {
  color: var(--ehr-color-primary-strong);
  font-size: 11px;
  font-weight: 850;
}

.apply-center__lane-step strong {
  color: var(--ehr-color-ink);
  font-size: 13px;
  line-height: 1.3;
}

.apply-center__lane-step small {
  color: var(--ehr-color-ink-muted);
  font-size: 11px;
  line-height: 1.4;
}

.apply-center__list {
  display: grid;
  gap: var(--ehr-space-3);
}

.apply-center__item {
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr);
  gap: var(--ehr-space-3);
  align-items: flex-start;
  border: 1px solid rgba(214, 226, 223, 0.76);
  border-radius: var(--ehr-radius-lg);
  background: var(--ehr-color-surface-raised);
  padding: var(--ehr-space-4) var(--ehr-space-3);
}

.apply-center__item-icon {
  display: inline-flex;
  width: 48px;
  height: 48px;
  align-items: center;
  justify-content: center;
  border-radius: var(--ehr-radius-md);
  flex-shrink: 0;
}

.apply-center__svg,
.apply-center__action-icon {
  display: block;
  flex-shrink: 0;
}

.apply-center__icon--primary {
  color: var(--ehr-color-primary-strong);
  background: var(--ehr-color-primary-soft);
}

.apply-center__icon--success {
  color: var(--ehr-color-success);
  background: var(--ehr-color-success-soft);
}

.apply-center__icon--warning {
  color: var(--ehr-color-warning);
  background: var(--ehr-color-warning-soft);
}

.apply-center__icon--error {
  color: var(--ehr-color-error);
  background: var(--ehr-color-error-soft);
}

.apply-center__content {
  min-width: 0;
}

.apply-center__item-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--ehr-space-2);
}

.apply-center__item strong,
.apply-center__item small {
  display: block;
}

.apply-center__item strong {
  color: var(--ehr-color-ink);
  font-size: 15px;
  line-height: 1.35;
}

.apply-center__item small {
  margin-top: 2px;
  color: var(--ehr-color-ink-muted);
  font-size: 12px;
  line-height: 1.45;
}

.apply-center__item-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: var(--ehr-space-2);
}

.apply-center__item-meta span {
  display: inline-flex;
  min-height: 24px;
  align-items: center;
  border-radius: var(--ehr-radius-full);
  color: var(--ehr-color-neutral);
  background: var(--ehr-color-neutral-soft);
  padding: 0 8px;
  font-size: 11px;
  font-weight: 750;
}

.apply-center__item nav {
  display: flex;
  flex-wrap: wrap;
  gap: var(--ehr-space-2);
  margin-top: var(--ehr-space-3);
}

.apply-center__item nav a {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border: 1px solid rgba(15, 118, 110, 0.18);
  border-radius: var(--ehr-radius-full);
  color: var(--ehr-color-primary-strong);
  background: #ffffff;
  padding: 0 12px;
  font-size: 12px;
  font-weight: 750;
  touch-action: manipulation;
  transition: background-color var(--ehr-motion-fast), box-shadow var(--ehr-motion-fast), transform var(--ehr-motion-fast);
}

.apply-center__item nav a:active {
  transform: scale(0.98);
}

.apply-center__item nav a:focus-visible {
  outline: none;
  box-shadow: var(--ehr-focus-ring);
}

@media (max-width: 360px) {
  .apply-center__hero-actions,
  .apply-center__hero-stats {
    grid-template-columns: 1fr;
  }

  .apply-center__lane {
    grid-template-columns: 1fr;
  }

  .apply-center__item {
    grid-template-columns: 44px minmax(0, 1fr);
  }

  .apply-center__item-icon {
    width: 44px;
    height: 44px;
  }
}
</style>
