<template>
  <DemoShell title="薪资查询" subtitle="月度薪资单" show-back :with-tabbar="false">
    <section class="salary-view__switch" aria-label="月份切换">
      <button
        v-for="item in salaryMonths"
        :key="item.month"
        class="salary-view__switch-item"
        :class="{ 'salary-view__switch-item--active': item.month === selectedMonth.month }"
        type="button"
        @click="selectMonth(item.month)"
      >
        {{ item.month }}
      </button>
    </section>

    <section class="salary-view__summary demo-card">
      <span>实发工资</span>
      <strong>¥ {{ selectedMonth.net }}</strong>
      <p>{{ selectedMonth.month }} 薪资单已生成，以下为演示明细。</p>
      <div class="salary-view__summary-metrics" aria-label="薪资摘要">
        <article class="salary-view__summary-metric">
          <small>收入合计</small>
          <strong>+ {{ incomeTotal }}</strong>
        </article>
        <article class="salary-view__summary-metric">
          <small>扣款合计</small>
          <strong class="salary-view__summary-metric--deduction">- {{ deductionTotal }}</strong>
        </article>
        <article class="salary-view__summary-metric">
          <small>本月实发</small>
          <strong>{{ selectedMonth.net }}</strong>
        </article>
      </div>
      <button class="demo-text-button" type="button" @click="showToast('薪资单下载任务已创建')">
        下载电子薪资单
      </button>
    </section>

    <DemoBlocks title="收入明细" desc="基础工资、津贴、奖金与补贴。">
      <div class="salary-view__rows">
        <button
          v-for="[label, value] in selectedMonth.income"
          :key="label"
          class="salary-view__row"
          type="button"
          :aria-label="`查看${label}明细`"
          @click="openDetail(label, value, 'income')"
        >
          <span>{{ label }}</span>
          <strong>+ {{ value }}</strong>
        </button>
      </div>
    </DemoBlocks>

    <DemoBlocks title="扣款明细" desc="社保、公积金和个税扣款。">
      <div class="salary-view__rows">
        <button
          v-for="[label, value] in selectedMonth.deduction"
          :key="label"
          class="salary-view__row"
          type="button"
          :aria-label="`查看${label}明细`"
          @click="openDetail(label, value, 'deduction')"
        >
          <span>{{ label }}</span>
          <strong class="salary-view__deduction">- {{ value }}</strong>
        </button>
      </div>
    </DemoBlocks>

    <div v-if="selectedDetail" class="salary-view__dialog" role="dialog" aria-modal="true">
      <article class="salary-view__dialog-card demo-card">
        <p class="salary-view__dialog-eyebrow">{{ selectedMonth.month }} 薪资说明</p>
        <h2>{{ selectedDetail.label }}</h2>
        <strong :class="{ 'salary-view__dialog-value--deduction': selectedDetail.kind === 'deduction' }">
          {{ selectedDetail.kind === 'deduction' ? '-' : '+' }} {{ selectedDetail.value }}
        </strong>
        <p>
          {{
            selectedDetail.kind === 'deduction'
              ? `${selectedDetail.label}已按当月标准完成核算，可在正式环境中查看详细计算口径。`
              : `${selectedDetail.label}已计入当月薪资，可在正式环境中查看发放说明与归属周期。`
          }}
        </p>
        <div class="salary-view__dialog-actions">
          <button class="demo-secondary-button" type="button" @click="selectedDetail = null">关闭</button>
          <button class="demo-primary-button" type="button" @click="confirmDetail">我知道了</button>
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
import { salaryMonths } from '@/data/mock';

const activeMonth = ref(salaryMonths[0]?.month ?? '');
const toastMessage = ref('');
const selectedDetail = ref<{ label: string; value: string; kind: 'income' | 'deduction' } | null>(null);
let timer: number | undefined;

const selectedMonth = computed(() => salaryMonths.find((item) => item.month === activeMonth.value) ?? salaryMonths[0]);
const parseAmount = (value: string) => Number(value.replace(/,/g, ''));
const formatAmount = (value: number) =>
  new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
const incomeTotal = computed(() =>
  formatAmount(selectedMonth.value.income.reduce((sum, [, value]) => sum + parseAmount(value), 0)),
);
const deductionTotal = computed(() =>
  formatAmount(selectedMonth.value.deduction.reduce((sum, [, value]) => sum + parseAmount(value), 0)),
);

const selectMonth = (month: string) => {
  activeMonth.value = month;
};

const openDetail = (label: string, value: string, kind: 'income' | 'deduction') => {
  selectedDetail.value = { label, value, kind };
};

const showToast = (message: string) => {
  toastMessage.value = message;
  window.clearTimeout(timer);
  timer = window.setTimeout(() => {
    toastMessage.value = '';
  }, 2200);
};

const confirmDetail = () => {
  if (!selectedDetail.value) return;
  const { label } = selectedDetail.value;
  selectedDetail.value = null;
  showToast(`已查看${label}说明`);
};
</script>

<style scoped>
.salary-view__switch {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--demo-space-2);
  border-radius: var(--demo-radius-lg);
  background: var(--demo-color-surface-inset);
  padding: 4px;
}

.salary-view__switch-item {
  min-height: 40px;
  border-radius: var(--demo-radius-md);
  color: var(--demo-color-text-secondary);
  background: transparent;
  font-size: 14px;
  font-weight: 600;
}

.salary-view__switch-item--active {
  color: var(--demo-color-primary-dark);
  background: #fff;
  box-shadow: var(--demo-shadow-sm);
}

.salary-view__summary {
  display: grid;
  gap: var(--demo-space-2);
  padding: var(--demo-space-5);
  background:
    linear-gradient(135deg, rgba(107, 140, 174, 0.2), rgba(255, 255, 255, 0.98)),
    #fff;
}

.salary-view__summary span,
.salary-view__row span {
  color: var(--demo-color-text-secondary);
  font-size: 14px;
  font-weight: 600;
}

.salary-view__summary strong {
  color: var(--demo-color-primary-dark);
  font-size: 32px;
  line-height: 1.2;
}

.salary-view__summary p {
  margin: 0;
  color: var(--demo-color-text-tertiary);
  font-size: 13px;
}

.salary-view__summary .demo-text-button {
  justify-self: start;
  margin-top: var(--demo-space-3);
  padding: 0 18px;
  box-shadow: 0 8px 16px rgba(107, 140, 174, 0.12);
}

.salary-view__summary-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--demo-space-2);
  margin-top: var(--demo-space-2);
}

.salary-view__summary-metric {
  display: grid;
  gap: 6px;
  border-radius: var(--demo-radius-md);
  background: rgba(255, 255, 255, 0.72);
  padding: 12px;
}

.salary-view__summary-metric small {
  color: var(--demo-color-text-tertiary);
  font-size: 11px;
  font-weight: 600;
}

.salary-view__summary-metric strong {
  color: var(--demo-color-primary-dark);
  font-size: 16px;
  line-height: 1.2;
}

.salary-view__summary-metric--deduction {
  color: #a95650 !important;
}

.salary-view__rows {
  display: grid;
  gap: var(--demo-space-2);
}

.salary-view__row {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: var(--demo-space-3);
  border: 0;
  border-radius: var(--demo-radius-md);
  background: var(--demo-color-surface-muted);
  padding: 12px;
  text-align: left;
  cursor: pointer;
}

.salary-view__row:active {
  background: var(--demo-color-primary-soft);
}

.salary-view__row:focus-visible {
  outline: 2px solid var(--demo-color-primary);
  outline-offset: 2px;
}

.salary-view__dialog {
  position: fixed;
  z-index: 60;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgba(32, 50, 65, 0.28);
  padding: 12px;
}

.salary-view__dialog-card {
  display: grid;
  width: min(398px, 100%);
  gap: var(--demo-space-3);
  padding: var(--demo-space-5);
}

.salary-view__dialog-eyebrow {
  margin: 0;
  color: var(--demo-color-primary-dark);
  font-size: 12px;
  font-weight: 700;
}

.salary-view__dialog-card h2,
.salary-view__dialog-card p {
  margin: 0;
}

.salary-view__dialog-card h2 {
  color: var(--demo-color-text);
  font-size: 20px;
}

.salary-view__dialog-card p {
  color: var(--demo-color-text-secondary);
  font-size: 13px;
  line-height: 1.5;
}

.salary-view__dialog-card strong {
  color: #2f6a50;
  font-size: 28px;
  line-height: 1.2;
}

.salary-view__dialog-value--deduction {
  color: #a95650;
}

.salary-view__dialog-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--demo-space-3);
}

.salary-view__row strong {
  color: #2f6a50;
  font-size: 15px;
}

.salary-view__row .salary-view__deduction {
  color: #a95650;
}

@media (max-width: 360px) {
  .salary-view__summary-metrics {
    grid-template-columns: 1fr;
  }

  .salary-view__dialog-actions {
    grid-template-columns: 1fr;
  }
}
</style>
