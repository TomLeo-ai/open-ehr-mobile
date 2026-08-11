<template>
  <AppShell title="年度结果" subtitle="绩效总结" show-back :with-tabbar="false">
    <section v-if="hasResults" class="summary-result__tabs" aria-label="年度切换">
      <button
        v-for="item in summaryResults"
        :key="item.year"
        class="summary-result__tab"
        :class="{ 'summary-result__tab--active': item.year === selectedResult?.year }"
        type="button"
        :aria-pressed="item.year === selectedResult?.year"
        @click="selectYear(item.year)"
      >
        <ChartColumn class="summary-result__svg" aria-hidden="true" :size="17" :stroke-width="2.1" />
        {{ item.year }}
      </button>
    </section>

    <section v-if="selectedResult" class="summary-result__score demo-card" aria-labelledby="summary-result-title">
      <header class="summary-result__hero-head">
        <span class="summary-result__hero-icon" aria-hidden="true">
          <Trophy class="summary-result__svg" :size="24" :stroke-width="2.1" />
        </span>
        <div>
          <p class="summary-result__eyebrow">年度评定</p>
          <h2 id="summary-result-title">{{ selectedResult.year }} 绩效结果</h2>
        </div>
        <span class="demo-tag demo-tag--neutral">Mock 数据</span>
      </header>

      <div class="summary-result__grade">
        <strong :aria-label="`${selectedResult.year}年度等级${selectedResult.grade}`">{{ selectedResult.grade }}</strong>
        <div>
          <span>综合得分</span>
          <b>{{ selectedResult.score }} 分</b>
        </div>
      </div>

      <p>{{ selectedResult.desc }}</p>

      <div
        class="summary-result__score-bar"
        role="progressbar"
        :aria-label="`${selectedResult.year}年度综合得分`"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-valuenow="scoreNumber"
      >
        <span :style="{ width: `${scoreNumber}%` }" />
      </div>
    </section>

    <SectionBlock v-if="selectedResult" title="评定反馈" desc="年度总结结果与改进建议。">
      <div class="summary-result__metrics" aria-label="年度评定摘要">
        <span
          v-for="item in metrics"
          :key="item.label"
          class="summary-result__metric"
          :class="`summary-result__metric--${item.tone}`"
        >
          <component :is="item.icon" class="summary-result__svg" aria-hidden="true" :size="18" :stroke-width="2.1" />
          <strong>{{ item.value }}</strong>
          <small>{{ item.label }}</small>
        </span>
      </div>
    </SectionBlock>

    <SectionBlock v-if="selectedResult" title="结果操作" desc="用于现场演示确认与申诉反馈。">
      <div class="summary-result__actions">
        <button class="demo-primary-button" type="button" @click="showToast('年度结果已确认')">
          <CheckCircle2 class="summary-result__svg" aria-hidden="true" :size="17" :stroke-width="2.15" />
          确认结果
        </button>
        <button class="demo-secondary-button" type="button" @click="showToast('申诉反馈已提交')">
          <FilePenLine class="summary-result__svg" aria-hidden="true" :size="17" :stroke-width="2.15" />
          提交反馈
        </button>
      </div>
    </SectionBlock>

    <section v-else class="summary-result__empty demo-card" role="status">
      <Info class="summary-result__svg" aria-hidden="true" :size="22" :stroke-width="2.1" />
      <strong>暂无年度结果</strong>
      <span>请检查 mock 年度结果数据，或在二次开发时接入真实评定接口。</span>
    </section>

    <ToastMessage class="summary-result__toast" :message="toastMessage" />
  </AppShell>
</template>

<script setup lang="ts">
import { computed, ref, type Component } from 'vue';
import {
  BadgeCheck,
  ChartColumn,
  CheckCircle2,
  FilePenLine,
  Info,
  MessageSquareText,
  TrendingUp,
  Trophy,
} from '@lucide/vue';
import SectionBlock from '@/components/SectionBlock.vue';
import AppShell from '@/components/AppShell.vue';
import ToastMessage from '@/components/ToastMessage.vue';
import { useToastMessage } from '@/composables/useToastMessage';
import { summaryResults } from '@/data/mock';

const activeYear = ref(summaryResults[0]?.year ?? '');
const { toastMessage, showToast } = useToastMessage();

type MetricTone = 'primary' | 'success' | 'warning';

type SummaryMetric = {
  label: string;
  value: string;
  icon: Component;
  tone: MetricTone;
};

const hasResults = computed(() => summaryResults.length > 0);
const selectedResult = computed(() => summaryResults.find((item) => item.year === activeYear.value) ?? summaryResults[0] ?? null);
const scoreNumber = computed(() => {
  const score = Number(selectedResult.value?.score ?? 0);
  return Number.isFinite(score) ? Math.max(0, Math.min(100, score)) : 0;
});

const metrics = computed<SummaryMetric[]>(() => {
  if (!selectedResult.value) return [];
  return [
    { label: '目标达成', value: `${Math.min(scoreNumber.value + 4, 100)}%`, icon: TrendingUp, tone: 'success' },
    { label: '协作反馈', value: selectedResult.value.grade.startsWith('A') ? '优秀' : '稳定', icon: BadgeCheck, tone: 'primary' },
    { label: '发展建议', value: '2 项', icon: MessageSquareText, tone: 'warning' },
  ];
});

const selectYear = (year: string) => {
  activeYear.value = year;
};
</script>

<style scoped>
.summary-result__tabs {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--demo-space-2);
  border-radius: var(--demo-radius-lg);
  background: var(--demo-color-surface-inset);
  padding: 4px;
}

.summary-result__tab {
  display: inline-flex;
  min-height: 48px;
  align-items: center;
  justify-content: center;
  gap: var(--demo-space-2);
  border-radius: var(--demo-radius-md);
  color: var(--demo-color-text-secondary);
  background: transparent;
  font-size: 14px;
  font-weight: 600;
  touch-action: manipulation;
  transition: transform 0.18s ease, color 0.18s ease, background-color 0.18s ease;
}

.summary-result__tab:active {
  transform: scale(0.98);
}

.summary-result__tab:focus-visible {
  outline: 2px solid var(--demo-color-primary);
  outline-offset: 2px;
}

.summary-result__tab--active {
  color: var(--demo-color-primary-dark);
  background: #fff;
  box-shadow: var(--demo-shadow-sm);
}

.summary-result__score {
  display: grid;
  gap: var(--demo-space-4);
  padding: var(--demo-space-5);
  background:
    linear-gradient(135deg, rgba(107, 140, 174, 0.2), rgba(255, 255, 255, 0.98)),
    #fff;
}

.summary-result__hero-head {
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr) auto;
  gap: var(--demo-space-3);
  align-items: center;
}

.summary-result__hero-icon,
.summary-result__metric svg {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.summary-result__hero-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--demo-radius-md);
  color: var(--demo-color-primary-dark);
  background: var(--demo-color-primary-soft);
}

.summary-result__eyebrow,
.summary-result__grade span,
.summary-result__metrics small,
.summary-result__empty span {
  color: var(--demo-color-text-tertiary);
  font-size: 13px;
}

.summary-result__eyebrow,
.summary-result__score h2,
.summary-result__score p {
  margin: 0;
}

.summary-result__score h2 {
  color: var(--demo-color-text);
  font-size: 18px;
  line-height: 1.35;
}

.summary-result__grade {
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr);
  gap: var(--demo-space-4);
  align-items: center;
}

.summary-result__grade strong {
  display: inline-flex;
  width: 86px;
  height: 86px;
  align-items: center;
  justify-content: center;
  border-radius: var(--demo-radius-xl);
  color: rgba(255, 255, 255, 0.96);
  background: var(--demo-color-primary);
  box-shadow: var(--demo-shadow-md);
  font-size: 34px;
}

.summary-result__grade div {
  display: grid;
  min-width: 0;
  gap: 4px;
}

.summary-result__grade b {
  color: var(--demo-color-text);
  font-size: 24px;
  line-height: 1.2;
}

.summary-result__score p {
  color: var(--demo-color-text-secondary);
  font-size: 14px;
}

.summary-result__score-bar {
  overflow: hidden;
  height: 10px;
  border-radius: var(--demo-radius-full);
  background: var(--demo-color-surface-inset);
}

.summary-result__score-bar span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--demo-color-primary);
}

.summary-result__metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--demo-space-3);
}

.summary-result__metric {
  display: grid;
  min-width: 0;
  gap: 4px;
  justify-items: center;
  border-radius: var(--demo-radius-md);
  background: var(--demo-color-surface-muted);
  padding: var(--demo-space-3);
  text-align: center;
}

.summary-result__metric .summary-result__svg {
  margin-bottom: 2px;
}

.summary-result__metric--primary {
  color: var(--demo-color-primary-dark);
}

.summary-result__metric--success {
  color: #2f6a50;
}

.summary-result__metric--warning {
  color: #8f6b2f;
}

.summary-result__metric strong {
  color: var(--demo-color-primary-dark);
  font-size: 16px;
}

.summary-result__actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--demo-space-3);
}

.summary-result__actions .demo-primary-button,
.summary-result__actions .demo-secondary-button {
  gap: var(--demo-space-2);
}

.summary-result__empty {
  display: grid;
  gap: var(--demo-space-2);
  justify-items: center;
  padding: var(--demo-space-5);
  text-align: center;
}

.summary-result__empty .summary-result__svg {
  color: var(--demo-color-primary-dark);
}

.summary-result__empty strong {
  color: var(--demo-color-text);
  font-size: 16px;
}

.summary-result__svg {
  display: block;
  flex: 0 0 auto;
}

.summary-result__toast {
  position: static;
  justify-self: center;
  width: fit-content;
  margin-top: calc(var(--demo-space-2) * -1);
  bottom: auto;
  left: auto;
  transform: none;
}

@media (max-width: 360px) {
  .summary-result__hero-head {
    grid-template-columns: 48px minmax(0, 1fr);
  }

  .summary-result__hero-head .demo-tag {
    grid-column: 1 / -1;
    justify-self: start;
  }

  .summary-result__metrics,
  .summary-result__actions {
    grid-template-columns: 1fr;
  }

  .summary-result__grade {
    grid-template-columns: 1fr;
    justify-items: center;
    text-align: center;
  }
}
</style>
