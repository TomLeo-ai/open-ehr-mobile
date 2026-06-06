<template>
  <DemoShell title="年度结果" subtitle="绩效总结" show-back :with-tabbar="false">
    <section class="summary-result__tabs" aria-label="年度切换">
      <button
        v-for="item in summaryResults"
        :key="item.year"
        class="summary-result__tab"
        :class="{ 'summary-result__tab--active': item.year === selectedResult.year }"
        type="button"
        @click="activeYear = item.year"
      >
        {{ item.year }}
      </button>
    </section>

    <section class="summary-result__score demo-card">
      <span>{{ selectedResult.year }} 年度评定</span>
      <strong>{{ selectedResult.grade }}</strong>
      <p>综合得分 {{ selectedResult.score }} 分</p>
    </section>

    <DemoBlocks title="评定反馈" desc="年度总结结果与改进建议。">
      <p class="summary-result__desc">{{ selectedResult.desc }}</p>
      <div class="summary-result__metrics">
        <span v-for="item in metrics" :key="item.label">
          <strong>{{ item.value }}</strong>
          <small>{{ item.label }}</small>
        </span>
      </div>
    </DemoBlocks>

    <DemoBlocks title="结果操作" desc="用于现场演示确认与申诉反馈。">
      <div class="summary-result__actions">
        <button class="demo-primary-button" type="button" @click="showToast('年度结果已确认')">
          确认结果
        </button>
        <button class="demo-secondary-button" type="button" @click="showToast('申诉反馈已提交')">
          提交反馈
        </button>
      </div>
    </DemoBlocks>

    <DemoToast :message="toastMessage" />
  </DemoShell>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import DemoBlocks from '@/components/DemoBlocks.vue';
import DemoShell from '@/components/DemoShell.vue';
import DemoToast from '@/components/DemoToast.vue';
import { summaryResults } from '@/data/mock';

const activeYear = ref(summaryResults[0]?.year ?? '');
const toastMessage = ref('');
let timer: number | undefined;

const selectedResult = computed(() => summaryResults.find((item) => item.year === activeYear.value) ?? summaryResults[0]);

const metrics = [
  { label: '目标达成', value: '96%' },
  { label: '协作反馈', value: '优秀' },
  { label: '发展建议', value: '2 项' },
];

const showToast = (message: string) => {
  toastMessage.value = message;
  window.clearTimeout(timer);
  timer = window.setTimeout(() => {
    toastMessage.value = '';
  }, 2200);
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
  min-height: 40px;
  border-radius: var(--demo-radius-md);
  color: var(--demo-color-text-secondary);
  background: transparent;
  font-size: 14px;
  font-weight: 600;
}

.summary-result__tab--active {
  color: var(--demo-color-primary-dark);
  background: #fff;
  box-shadow: var(--demo-shadow-sm);
}

.summary-result__score {
  display: grid;
  gap: var(--demo-space-2);
  justify-items: center;
  padding: var(--demo-space-6);
  background:
    linear-gradient(135deg, rgba(107, 140, 174, 0.2), rgba(255, 255, 255, 0.98)),
    #fff;
  text-align: center;
}

.summary-result__score span,
.summary-result__metrics small {
  color: var(--demo-color-text-tertiary);
  font-size: 13px;
}

.summary-result__score strong {
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

.summary-result__score p,
.summary-result__desc {
  margin: 0;
  color: var(--demo-color-text-secondary);
  font-size: 14px;
}

.summary-result__metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--demo-space-3);
  margin-top: var(--demo-space-4);
}

.summary-result__metrics span {
  display: grid;
  gap: 2px;
  justify-items: center;
  border-radius: var(--demo-radius-md);
  background: var(--demo-color-surface-muted);
  padding: var(--demo-space-3);
}

.summary-result__metrics strong {
  color: var(--demo-color-primary-dark);
  font-size: 16px;
}

.summary-result__actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--demo-space-3);
}

@media (max-width: 360px) {
  .summary-result__metrics,
  .summary-result__actions {
    grid-template-columns: 1fr;
  }
}
</style>
