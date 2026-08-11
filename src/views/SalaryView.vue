<template>
  <AppShell title="薪资查询" subtitle="月度薪资单" show-back :with-tabbar="false">
    <section class="salary-view__switch" aria-label="月份切换">
      <button
        v-for="item in salaryMonths"
        :key="item.month"
        class="salary-view__switch-item"
        :class="{ 'salary-view__switch-item--active': item.month === selectedMonth.month }"
        type="button"
        :aria-pressed="item.month === selectedMonth.month"
        @click="selectMonth(item.month)"
      >
        {{ item.month }}
      </button>
    </section>

    <section class="salary-view__summary demo-card">
      <div class="salary-view__summary-head">
        <span class="salary-view__summary-icon salary-view__icon--primary" aria-hidden="true">
          <WalletCards class="salary-view__svg" :size="24" :stroke-width="2.1" />
        </span>
        <div class="salary-view__summary-main">
          <span>实发工资</span>
          <strong>¥ {{ selectedMonth.net }}</strong>
        </div>
        <span class="demo-tag demo-tag--neutral">Mock 数据</span>
      </div>
      <p>{{ selectedMonth.month }} 薪资单已生成，以下为纯前端演示明细。</p>
      <div class="salary-view__summary-metrics" aria-label="薪资摘要">
        <article class="salary-view__summary-metric">
          <span class="salary-view__metric-icon salary-view__icon--success" aria-hidden="true">
            <TrendingUp class="salary-view__svg" :size="17" :stroke-width="2.15" />
          </span>
          <small>收入合计</small>
          <strong>+ {{ incomeTotal }}</strong>
        </article>
        <article class="salary-view__summary-metric">
          <span class="salary-view__metric-icon salary-view__icon--error" aria-hidden="true">
            <TrendingDown class="salary-view__svg" :size="17" :stroke-width="2.15" />
          </span>
          <small>扣款合计</small>
          <strong class="salary-view__summary-metric--deduction">- {{ deductionTotal }}</strong>
        </article>
        <article class="salary-view__summary-metric">
          <span class="salary-view__metric-icon salary-view__icon--primary" aria-hidden="true">
            <CircleDollarSign class="salary-view__svg" :size="17" :stroke-width="2.15" />
          </span>
          <small>本月实发</small>
          <strong>{{ selectedMonth.net }}</strong>
        </article>
      </div>
      <button class="demo-text-button salary-view__download" type="button" @click="showToast('薪资单下载任务已创建')">
        <Download class="salary-view__svg" aria-hidden="true" :size="17" :stroke-width="2.15" />
        下载电子薪资单
      </button>
    </section>

    <SectionBlock title="收入明细" desc="基础工资、津贴、奖金与补贴。">
      <div v-if="selectedMonth.income.length" class="salary-view__rows">
        <button
          v-for="[label, value] in selectedMonth.income"
          :key="label"
          class="salary-view__row"
          type="button"
          :aria-label="`查看${label}明细`"
          @click="openDetail(label, value, 'income')"
        >
          <span class="salary-view__row-icon salary-view__icon--success" aria-hidden="true">
            <ReceiptText class="salary-view__svg" :size="19" :stroke-width="2.1" />
          </span>
          <span class="salary-view__row-main">
            <span>{{ label }}</span>
            <small>{{ selectedMonth.month }} 归属周期</small>
          </span>
          <strong>+ {{ value }}</strong>
          <Eye class="salary-view__row-action" aria-hidden="true" :size="18" :stroke-width="2.1" />
        </button>
      </div>
      <div v-else class="salary-view__empty" role="status">
        <Info class="salary-view__svg" aria-hidden="true" :size="20" :stroke-width="2.1" />
        <span>暂无收入明细，请检查 mock 薪资数据。</span>
      </div>
    </SectionBlock>

    <SectionBlock title="扣款明细" desc="社保、公积金和个税扣款。">
      <div v-if="selectedMonth.deduction.length" class="salary-view__rows">
        <button
          v-for="[label, value] in selectedMonth.deduction"
          :key="label"
          class="salary-view__row"
          type="button"
          :aria-label="`查看${label}明细`"
          @click="openDetail(label, value, 'deduction')"
        >
          <span class="salary-view__row-icon salary-view__icon--error" aria-hidden="true">
            <ReceiptText class="salary-view__svg" :size="19" :stroke-width="2.1" />
          </span>
          <span class="salary-view__row-main">
            <span>{{ label }}</span>
            <small>{{ selectedMonth.month }} 归属周期</small>
          </span>
          <strong class="salary-view__deduction">- {{ value }}</strong>
          <Eye class="salary-view__row-action" aria-hidden="true" :size="18" :stroke-width="2.1" />
        </button>
      </div>
      <div v-else class="salary-view__empty" role="status">
        <Info class="salary-view__svg" aria-hidden="true" :size="20" :stroke-width="2.1" />
        <span>暂无扣款明细，请检查 mock 薪资数据。</span>
      </div>
    </SectionBlock>

    <div
      v-if="selectedDetail"
      class="salary-view__dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="salary-detail-title"
      aria-describedby="salary-detail-desc"
    >
      <article class="salary-view__dialog-card demo-card">
        <button class="salary-view__dialog-close" type="button" aria-label="关闭薪资说明" @click="selectedDetail = null">
          <X class="salary-view__svg" aria-hidden="true" :size="20" :stroke-width="2.2" />
        </button>
        <span
          class="salary-view__dialog-icon"
          :class="selectedDetail.kind === 'deduction' ? 'salary-view__icon--error' : 'salary-view__icon--success'"
          aria-hidden="true"
        >
          <ReceiptText class="salary-view__svg" :size="22" :stroke-width="2.1" />
        </span>
        <p class="salary-view__dialog-eyebrow">{{ selectedMonth.month }} 薪资说明</p>
        <h2 id="salary-detail-title">{{ selectedDetail.label }}</h2>
        <strong :class="{ 'salary-view__dialog-value--deduction': selectedDetail.kind === 'deduction' }">
          {{ selectedDetail.kind === 'deduction' ? '-' : '+' }} {{ selectedDetail.value }}
        </strong>
        <p id="salary-detail-desc">
          {{
            selectedDetail.kind === 'deduction'
              ? `${selectedDetail.label}已按当月标准完成核算，可在正式环境中查看详细计算口径。`
              : `${selectedDetail.label}已计入当月薪资，可在正式环境中查看发放说明与归属周期。`
          }}
        </p>
        <div class="salary-view__dialog-actions">
          <button class="demo-secondary-button" type="button" @click="selectedDetail = null">关闭</button>
          <button class="demo-primary-button" type="button" @click="confirmDetail">
            <CheckCircle2 class="salary-view__svg" aria-hidden="true" :size="17" :stroke-width="2.15" />
            我知道了
          </button>
        </div>
      </article>
    </div>

    <ToastMessage :message="toastMessage" />
  </AppShell>
</template>

<script setup lang="ts">
import {
  CheckCircle2,
  CircleDollarSign,
  Download,
  Eye,
  Info,
  ReceiptText,
  TrendingDown,
  TrendingUp,
  WalletCards,
  X,
} from '@lucide/vue';
import { computed, ref } from 'vue';
import SectionBlock from '@/components/SectionBlock.vue';
import AppShell from '@/components/AppShell.vue';
import ToastMessage from '@/components/ToastMessage.vue';
import { useToastMessage } from '@/composables/useToastMessage';
import { salaryMonths } from '@/data/mock';

const activeMonth = ref(salaryMonths[0]?.month ?? '');
const { toastMessage, showToast } = useToastMessage();
const selectedDetail = ref<{ label: string; value: string; kind: 'income' | 'deduction' } | null>(null);

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
  min-height: 44px;
  border-radius: var(--demo-radius-md);
  color: var(--demo-color-text-secondary);
  background: transparent;
  font-size: 14px;
  font-weight: 600;
  touch-action: manipulation;
  transition: background-color 0.18s ease, box-shadow 0.18s ease, color 0.18s ease, transform 0.18s ease;
}

.salary-view__switch-item--active {
  color: var(--demo-color-primary-dark);
  background: #fff;
  box-shadow: var(--demo-shadow-sm);
}

.salary-view__switch-item:active,
.salary-view__download:active,
.salary-view__row:active {
  transform: scale(0.985);
}

.salary-view__switch-item:focus-visible,
.salary-view__download:focus-visible,
.salary-view__row:focus-visible,
.salary-view__dialog-close:focus-visible {
  outline: 2px solid var(--demo-color-primary);
  outline-offset: 2px;
}

.salary-view__summary {
  display: grid;
  gap: var(--demo-space-3);
  padding: var(--demo-space-5);
  background:
    linear-gradient(135deg, rgba(107, 140, 174, 0.2), rgba(255, 255, 255, 0.98)),
    #fff;
}

.salary-view__summary-head {
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr) auto;
  gap: var(--demo-space-3);
  align-items: start;
}

.salary-view__summary-main {
  display: grid;
  min-width: 0;
  gap: 4px;
}

.salary-view__summary-main span,
.salary-view__row-main span {
  color: var(--demo-color-text-secondary);
  font-size: 14px;
  font-weight: 600;
}

.salary-view__summary-main strong {
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

.salary-view__download {
  gap: var(--demo-space-2);
  touch-action: manipulation;
}

.salary-view__summary-icon,
.salary-view__metric-icon,
.salary-view__row-icon,
.salary-view__dialog-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: var(--demo-radius-md);
}

.salary-view__summary-icon {
  width: 48px;
  height: 48px;
}

.salary-view__metric-icon,
.salary-view__row-icon,
.salary-view__dialog-icon {
  width: 40px;
  height: 40px;
}

.salary-view__svg {
  display: block;
  flex-shrink: 0;
}

.salary-view__icon--primary {
  color: var(--demo-color-primary-dark);
  background: var(--demo-color-primary-soft);
}

.salary-view__icon--success {
  color: #2f6a50;
  background: var(--demo-color-success-soft);
}

.salary-view__icon--error {
  color: #a95650;
  background: var(--demo-color-error-soft);
}

.salary-view__summary-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--demo-space-2);
  margin-top: var(--demo-space-2);
}

.salary-view__summary-metric {
  display: grid;
  min-height: 92px;
  gap: 6px;
  align-content: center;
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
  display: grid;
  width: 100%;
  min-height: 68px;
  grid-template-columns: 40px minmax(0, 1fr) auto 18px;
  gap: var(--demo-space-3);
  align-items: center;
  border: 0;
  border-radius: var(--demo-radius-md);
  background: var(--demo-color-surface-muted);
  padding: 14px var(--demo-space-3);
  text-align: left;
  cursor: pointer;
  touch-action: manipulation;
  transition: background-color 0.18s ease, transform 0.18s ease;
}

.salary-view__row:active {
  background: var(--demo-color-primary-soft);
}

.salary-view__row-main {
  display: grid;
  min-width: 0;
  gap: 3px;
}

.salary-view__row-main small {
  color: var(--demo-color-text-tertiary);
  font-size: 12px;
}

.salary-view__row-action {
  color: var(--demo-color-text-quaternary);
}

.salary-view__dialog {
  position: fixed;
  z-index: 60;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgba(32, 50, 65, 0.28);
  padding: var(--demo-space-4);
}

.salary-view__dialog-card {
  position: relative;
  display: grid;
  width: min(398px, 100%);
  gap: var(--demo-space-3);
  padding: var(--demo-space-5);
}

.salary-view__dialog-close {
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

.salary-view__dialog-icon {
  margin-bottom: 2px;
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

.salary-view__dialog-actions .demo-primary-button {
  gap: var(--demo-space-2);
}

.salary-view__row strong {
  color: #2f6a50;
  font-size: 15px;
  white-space: nowrap;
}

.salary-view__row .salary-view__deduction {
  color: #a95650;
}

.salary-view__empty {
  display: grid;
  min-height: 88px;
  place-items: center;
  gap: var(--demo-space-2);
  border-radius: var(--demo-radius-md);
  color: var(--demo-color-text-secondary);
  background: var(--demo-color-surface-muted);
  padding: var(--demo-space-4);
  text-align: center;
}

@media (max-width: 360px) {
  .salary-view__summary-metrics {
    grid-template-columns: 1fr;
  }

  .salary-view__summary-head {
    grid-template-columns: 48px minmax(0, 1fr);
  }

  .salary-view__summary-head .demo-tag {
    grid-column: 1 / -1;
    justify-self: start;
  }

  .salary-view__dialog-actions {
    grid-template-columns: 1fr;
  }
}
</style>
