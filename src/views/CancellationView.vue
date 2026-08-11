<template>
  <AppShell title="异常撤回" subtitle="申请撤回查询" show-back :with-tabbar="false">
    <section class="cancellation-view__hero demo-card" aria-labelledby="cancellation-title">
      <div class="cancellation-view__hero-head">
        <span class="cancellation-view__hero-icon cancellation-view__icon--primary" aria-hidden="true">
          <RotateCcw class="cancellation-view__svg" :size="24" :stroke-width="2.1" />
        </span>
        <div>
          <p class="cancellation-view__eyebrow">撤回规则</p>
          <h1 id="cancellation-title">可撤回申请</h1>
        </div>
        <span class="demo-tag demo-tag--neutral">Mock 数据</span>
      </div>
      <p>仅审批中的异常申请允许发起撤回，已完成或撤回中的记录仅支持查看详情。</p>
      <div class="cancellation-view__summary" aria-label="异常撤回摘要">
        <article v-for="item in summaryStats" :key="item.label" class="cancellation-view__stat">
          <span class="cancellation-view__stat-icon" :class="`cancellation-view__icon--${item.tone}`" aria-hidden="true">
            <component :is="item.icon" class="cancellation-view__svg" :size="18" :stroke-width="2.1" />
          </span>
          <strong>{{ item.value }}</strong>
          <span>{{ item.label }}</span>
        </article>
      </div>
    </section>

    <SectionBlock title="异常申请列表" desc="点击记录查看详情，符合条件可发起撤回。">
      <div v-if="cancellations.length" class="cancellation-view__list">
        <button
          v-for="item in cancellations"
          :key="item.id"
          class="cancellation-view__item"
          type="button"
          :aria-label="`查看异常撤回记录：${item.title}，状态：${item.status}`"
          @click="selectCancellation(item)"
        >
          <span
            class="cancellation-view__item-icon"
            :class="`cancellation-view__icon--${getStatusMeta(item.status).tone}`"
            aria-hidden="true"
          >
            <component :is="getStatusMeta(item.status).icon" class="cancellation-view__svg" :size="19" :stroke-width="2.1" />
          </span>
          <span class="cancellation-view__item-content">
            <span class="cancellation-view__item-head">
              <strong>{{ item.title }}</strong>
              <span :class="`demo-tag cancellation-view__tag cancellation-view__tag--${getStatusMeta(item.status).tone}`">
                <component :is="getStatusMeta(item.status).icon" class="cancellation-view__svg" aria-hidden="true" :size="13" :stroke-width="2.2" />
                {{ item.status }}
              </span>
            </span>
            <small>{{ item.desc }}</small>
            <em>{{ item.meta }}</em>
          </span>
          <ChevronRight class="cancellation-view__item-action" aria-hidden="true" :size="18" :stroke-width="2.1" />
        </button>
      </div>
      <div v-else class="cancellation-view__empty" role="status">
        <Info class="cancellation-view__svg" aria-hidden="true" :size="20" :stroke-width="2.1" />
        <span>暂无可查询的异常撤回记录，请检查 mock 数据。</span>
      </div>
    </SectionBlock>

    <div
      v-if="selectedItem"
      class="cancellation-view__dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancellation-dialog-title"
      aria-describedby="cancellation-dialog-desc"
      @click.self="closeDialog"
    >
      <article class="cancellation-view__dialog-card demo-card">
        <button class="cancellation-view__dialog-close" type="button" aria-label="关闭异常撤回详情" @click="closeDialog">
          <X class="cancellation-view__svg" aria-hidden="true" :size="20" :stroke-width="2.2" />
        </button>
        <span class="cancellation-view__dialog-icon" :class="`cancellation-view__icon--${selectedMeta.tone}`" aria-hidden="true">
          <component :is="selectedMeta.icon" class="cancellation-view__svg" :size="22" :stroke-width="2.1" />
        </span>
        <p class="cancellation-view__eyebrow">异常撤回详情</p>
        <h2 id="cancellation-dialog-title">{{ selectedItem.title }}</h2>
        <p id="cancellation-dialog-desc">{{ selectedItem.desc }}</p>
        <dl class="cancellation-view__dialog-meta">
          <div>
            <dt>当前状态</dt>
            <dd :class="`cancellation-view__status cancellation-view__status--${selectedMeta.tone}`">
              {{ selectedItem.status }}
            </dd>
          </div>
          <div>
            <dt>申请信息</dt>
            <dd>{{ selectedItem.meta }}</dd>
          </div>
          <div>
            <dt>数据来源</dt>
            <dd>前端 mock</dd>
          </div>
        </dl>
        <div class="cancellation-view__hint" :class="`cancellation-view__hint--${selectedMeta.tone}`" role="status">
          <component :is="selectedMeta.icon" class="cancellation-view__svg" aria-hidden="true" :size="17" :stroke-width="2.1" />
          <span>{{ selectedMeta.actionHint }}</span>
        </div>
        <div class="cancellation-view__dialog-actions">
          <button class="demo-secondary-button" type="button" @click="closeDialog">关闭</button>
          <button
            class="demo-primary-button"
            type="button"
            :disabled="!canWithdraw"
            @click="withdraw"
          >
            <RotateCcw class="cancellation-view__svg" aria-hidden="true" :size="17" :stroke-width="2.15" />
            发起撤回
          </button>
        </div>
      </article>
    </div>

    <ToastMessage :message="toastMessage" />
  </AppShell>
</template>

<script setup lang="ts">
import type { Component } from 'vue';
import {
  Ban,
  ChevronRight,
  Clock3,
  Info,
  RotateCcw,
  ShieldAlert,
  X,
} from '@lucide/vue';
import { computed, ref } from 'vue';
import SectionBlock from '@/components/SectionBlock.vue';
import AppShell from '@/components/AppShell.vue';
import ToastMessage from '@/components/ToastMessage.vue';
import { useToastMessage } from '@/composables/useToastMessage';
import { cancellations } from '@/data/mock';

type CancellationItem = (typeof cancellations)[number];
type CancellationStatus = CancellationItem['status'];
type CancellationTone = 'primary' | 'warning' | 'neutral' | 'error';

type CancellationStatusMeta = {
  icon: Component;
  tone: CancellationTone;
  actionHint: string;
};

type CancellationStat = {
  label: string;
  value: string;
  icon: Component;
  tone: CancellationTone;
};

const selectedItem = ref<CancellationItem | null>(null);
const { toastMessage, showToast } = useToastMessage();

const fallbackStatusMeta: CancellationStatusMeta = {
  icon: ShieldAlert,
  tone: 'neutral',
  actionHint: '当前记录仅用于前端演示，请以 mock 状态为准。',
};

const statusMetaMap: Record<CancellationStatus, CancellationStatusMeta> = {
  可撤回: {
    icon: RotateCcw,
    tone: 'primary',
    actionHint: '当前流程仍在审批中，可提交撤回申请等待 HR 确认。',
  },
  不可撤回: {
    icon: Ban,
    tone: 'neutral',
    actionHint: '该流程已完成，只能查看详情，不能再次发起撤回。',
  },
  撤回中: {
    icon: Clock3,
    tone: 'warning',
    actionHint: '撤回申请已进入处理中，请等待后续节点确认。',
  },
};

const countByStatus = (status: CancellationStatus) => cancellations.filter((item) => item.status === status).length;

const summaryStats = computed(
  () =>
    [
      { label: '可撤回', value: `${countByStatus('可撤回')} 条`, icon: RotateCcw, tone: 'primary' },
      { label: '已关闭', value: `${countByStatus('不可撤回')} 条`, icon: Ban, tone: 'neutral' },
      { label: '待确认', value: `${countByStatus('撤回中')} 条`, icon: Clock3, tone: 'warning' },
    ] satisfies CancellationStat[],
);

const selectedMeta = computed(() => (selectedItem.value ? getStatusMeta(selectedItem.value.status) : fallbackStatusMeta));

const canWithdraw = computed(() => selectedItem.value?.status === '可撤回');

const getStatusMeta = (status: CancellationStatus): CancellationStatusMeta => statusMetaMap[status] ?? fallbackStatusMeta;

const selectCancellation = (item: CancellationItem) => {
  selectedItem.value = item;
};

const closeDialog = () => {
  selectedItem.value = null;
};

const withdraw = () => {
  if (!selectedItem.value) return;
  closeDialog();
  showToast('撤回申请已提交，等待 HR 确认');
};
</script>

<style scoped>
.cancellation-view__hero {
  display: grid;
  gap: var(--demo-space-3);
  padding: var(--demo-space-5);
  background:
    linear-gradient(135deg, rgba(107, 140, 174, 0.18), rgba(255, 255, 255, 0.98)),
    #fff;
}

.cancellation-view__hero-head {
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr) auto;
  gap: var(--demo-space-3);
  align-items: start;
}

.cancellation-view__hero-icon,
.cancellation-view__stat-icon,
.cancellation-view__item-icon,
.cancellation-view__dialog-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: var(--demo-radius-md);
}

.cancellation-view__hero-icon {
  width: 48px;
  height: 48px;
}

.cancellation-view__stat-icon {
  width: 34px;
  height: 34px;
}

.cancellation-view__item-icon {
  width: 42px;
  height: 42px;
}

.cancellation-view__dialog-icon {
  width: 48px;
  height: 48px;
}

.cancellation-view__eyebrow {
  margin: 0 0 4px;
  color: var(--demo-color-primary-dark);
  font-size: 12px;
  font-weight: 700;
}

.cancellation-view__hero h1,
.cancellation-view__dialog-card h2 {
  margin: 0;
  color: var(--demo-color-text);
  font-size: 22px;
  line-height: 1.25;
}

.cancellation-view__hero p,
.cancellation-view__dialog-card p {
  margin: 0;
  color: var(--demo-color-text-secondary);
  font-size: 14px;
  line-height: 1.5;
}

.cancellation-view__summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--demo-space-2);
}

.cancellation-view__stat {
  display: grid;
  min-height: 88px;
  gap: 5px;
  align-content: center;
  border-radius: var(--demo-radius-md);
  background: rgba(255, 255, 255, 0.72);
  padding: 12px;
}

.cancellation-view__stat strong {
  color: var(--demo-color-primary-dark);
  font-size: 17px;
}

.cancellation-view__stat span:last-child {
  color: var(--demo-color-text-tertiary);
  font-size: 11px;
  font-weight: 600;
}

.cancellation-view__icon--primary {
  color: var(--demo-color-primary-dark);
  background: var(--demo-color-primary-soft);
}

.cancellation-view__icon--warning {
  color: #8f6b2f;
  background: var(--demo-color-warning-soft);
}

.cancellation-view__icon--neutral {
  color: var(--demo-color-text-secondary);
  background: var(--demo-color-surface-inset);
}

.cancellation-view__icon--error {
  color: #a95650;
  background: var(--demo-color-error-soft);
}

.cancellation-view__svg {
  display: block;
  flex-shrink: 0;
}

.cancellation-view__list {
  display: grid;
  gap: var(--demo-space-3);
}

.cancellation-view__item {
  display: grid;
  width: 100%;
  min-height: 82px;
  grid-template-columns: 42px minmax(0, 1fr) auto;
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

.cancellation-view__item:active,
.cancellation-view__dialog-actions button:active,
.cancellation-view__dialog-close:active {
  transform: scale(0.985);
}

.cancellation-view__item:hover,
.cancellation-view__item:active {
  background: var(--demo-color-primary-soft);
}

.cancellation-view__item:focus-visible,
.cancellation-view__dialog-actions button:focus-visible,
.cancellation-view__dialog-close:focus-visible {
  outline: 2px solid var(--demo-color-primary);
  outline-offset: 2px;
}

.cancellation-view__item-content {
  display: grid;
  min-width: 0;
  gap: 5px;
}

.cancellation-view__item-head {
  display: flex;
  min-width: 0;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.cancellation-view__item strong {
  color: var(--demo-color-text);
  font-size: 15px;
}

.cancellation-view__item small,
.cancellation-view__item em,
.cancellation-view__dialog-card small {
  color: var(--demo-color-text-tertiary);
  font-size: 12px;
  font-style: normal;
  line-height: 1.45;
}

.cancellation-view__item-action {
  color: var(--demo-color-text-quaternary);
}

.cancellation-view__tag {
  gap: 4px;
}

.cancellation-view__tag--primary {
  color: var(--demo-color-primary-dark);
  background: var(--demo-color-primary-soft);
}

.cancellation-view__tag--warning {
  color: #8f6b2f;
  background: var(--demo-color-warning-soft);
}

.cancellation-view__tag--error {
  color: #a95650;
  background: var(--demo-color-error-soft);
}

.cancellation-view__tag--neutral {
  color: var(--demo-color-text-secondary);
  background: var(--demo-color-surface-inset);
}

.cancellation-view__empty {
  display: grid;
  min-height: 104px;
  place-items: center;
  gap: var(--demo-space-2);
  border-radius: var(--demo-radius-md);
  color: var(--demo-color-text-secondary);
  background: var(--demo-color-surface-muted);
  padding: var(--demo-space-4);
  text-align: center;
}

.cancellation-view__dialog {
  position: fixed;
  z-index: 60;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgba(32, 50, 65, 0.28);
  padding: var(--demo-space-4) var(--demo-space-4) max(var(--demo-space-4), env(safe-area-inset-bottom));
}

.cancellation-view__dialog-card {
  position: relative;
  display: grid;
  width: min(398px, 100%);
  gap: var(--demo-space-3);
  padding: var(--demo-space-5);
}

.cancellation-view__dialog-close {
  position: absolute;
  top: 14px;
  right: 14px;
  display: inline-flex;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  border-radius: var(--demo-radius-md);
  color: var(--demo-color-text-secondary);
  background: var(--demo-color-surface-muted);
  touch-action: manipulation;
}

.cancellation-view__dialog-meta {
  display: grid;
  gap: var(--demo-space-2);
  margin: 0;
}

.cancellation-view__dialog-meta div {
  display: grid;
  grid-template-columns: 84px minmax(0, 1fr);
  gap: var(--demo-space-3);
  align-items: center;
  border-radius: var(--demo-radius-md);
  background: var(--demo-color-surface-muted);
  padding: 11px 12px;
}

.cancellation-view__dialog-meta dt {
  color: var(--demo-color-text-tertiary);
  font-size: 12px;
}

.cancellation-view__dialog-meta dd {
  margin: 0;
  color: var(--demo-color-text);
  font-size: 13px;
  font-weight: 600;
}

.cancellation-view__status {
  display: inline-flex;
  width: fit-content;
  border-radius: var(--demo-radius-full);
  padding: 4px 9px;
}

.cancellation-view__status--primary {
  color: var(--demo-color-primary-dark);
  background: var(--demo-color-primary-soft);
}

.cancellation-view__status--warning {
  color: #8f6b2f;
  background: var(--demo-color-warning-soft);
}

.cancellation-view__status--neutral {
  color: var(--demo-color-text-secondary);
  background: var(--demo-color-surface-inset);
}

.cancellation-view__status--error {
  color: #a95650;
  background: var(--demo-color-error-soft);
}

.cancellation-view__hint {
  display: grid;
  grid-template-columns: 20px minmax(0, 1fr);
  gap: var(--demo-space-2);
  align-items: start;
  border-radius: var(--demo-radius-md);
  padding: 12px;
  color: var(--demo-color-text-secondary);
  font-size: 12px;
  line-height: 1.5;
}

.cancellation-view__hint--primary {
  background: var(--demo-color-primary-soft);
}

.cancellation-view__hint--warning {
  background: var(--demo-color-warning-soft);
}

.cancellation-view__hint--neutral {
  background: var(--demo-color-surface-inset);
}

.cancellation-view__hint--error {
  background: var(--demo-color-error-soft);
}

.cancellation-view__dialog-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--demo-space-3);
}

.cancellation-view__dialog-actions button {
  gap: var(--demo-space-2);
  touch-action: manipulation;
}

.demo-primary-button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

@media (max-width: 360px) {
  .cancellation-view__hero-head {
    grid-template-columns: 48px minmax(0, 1fr);
  }

  .cancellation-view__hero-head .demo-tag {
    grid-column: 1 / -1;
    justify-self: start;
  }

  .cancellation-view__summary,
  .cancellation-view__item,
  .cancellation-view__dialog-actions {
    grid-template-columns: 1fr;
  }

  .cancellation-view__item-action {
    display: none;
  }

  .cancellation-view__dialog-meta div {
    grid-template-columns: 1fr;
    gap: 4px;
  }
}
</style>
