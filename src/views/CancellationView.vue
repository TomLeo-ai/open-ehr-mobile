<template>
  <DemoShell title="异常撤回" subtitle="申请撤回查询" show-back :with-tabbar="false">
    <section class="cancellation-view__notice demo-card">
      <h1>可撤回申请</h1>
      <p>仅审批中的异常申请允许发起撤回，已完成或撤回中的记录仅支持查看详情。</p>
    </section>

    <DemoBlocks title="异常申请列表" desc="点击记录查看详情，符合条件可发起撤回。">
      <div class="cancellation-view__list">
        <button
          v-for="item in cancellations"
          :key="item.id"
          class="cancellation-view__item"
          type="button"
          @click="selectedItem = item"
        >
          <span>
            <strong>{{ item.title }}</strong>
            <small>{{ item.desc }}</small>
            <em>{{ item.meta }}</em>
          </span>
          <b :class="`demo-tag cancellation-view__tag--${item.tone}`">{{ item.status }}</b>
        </button>
      </div>
    </DemoBlocks>

    <div v-if="selectedItem" class="cancellation-view__dialog" role="dialog" aria-modal="true">
      <article class="cancellation-view__dialog-card demo-card">
        <h2>{{ selectedItem.title }}</h2>
        <p>{{ selectedItem.desc }}</p>
        <small>{{ selectedItem.meta }}</small>
        <div class="cancellation-view__dialog-actions">
          <button class="demo-secondary-button" type="button" @click="selectedItem = null">关闭</button>
          <button
            class="demo-primary-button"
            type="button"
            :disabled="selectedItem.status !== '可撤回'"
            @click="withdraw"
          >
            发起撤回
          </button>
        </div>
      </article>
    </div>

    <DemoToast :message="toastMessage" />
  </DemoShell>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DemoBlocks from '@/components/DemoBlocks.vue';
import DemoShell from '@/components/DemoShell.vue';
import DemoToast from '@/components/DemoToast.vue';
import { cancellations } from '@/data/mock';

type CancellationItem = (typeof cancellations)[number];

const selectedItem = ref<CancellationItem | null>(null);
const toastMessage = ref('');
let timer: number | undefined;

const showToast = (message: string) => {
  toastMessage.value = message;
  window.clearTimeout(timer);
  timer = window.setTimeout(() => {
    toastMessage.value = '';
  }, 2200);
};

const withdraw = () => {
  if (!selectedItem.value) return;
  selectedItem.value = null;
  showToast('撤回申请已提交，等待 HR 确认');
};
</script>

<style scoped>
.cancellation-view__notice {
  display: grid;
  gap: var(--demo-space-2);
  padding: var(--demo-space-5);
  background:
    linear-gradient(135deg, rgba(229, 212, 184, 0.36), rgba(255, 255, 255, 0.98)),
    #fff;
}

h1,
.cancellation-view__dialog-card h2 {
  margin: 0;
  color: var(--demo-color-text);
  font-size: 20px;
}

.cancellation-view__notice p,
.cancellation-view__dialog-card p {
  margin: 0;
  color: var(--demo-color-text-secondary);
  font-size: 14px;
}

.cancellation-view__list {
  display: grid;
  gap: var(--demo-space-3);
}

.cancellation-view__item {
  display: grid;
  width: 100%;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: var(--demo-space-3);
  align-items: start;
  border-radius: var(--demo-radius-md);
  background: var(--demo-color-surface-muted);
  padding: var(--demo-space-3);
  text-align: left;
}

.cancellation-view__item span {
  display: grid;
  min-width: 0;
  gap: 3px;
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
}

.cancellation-view__tag--success {
  color: #2f6a50;
  background: var(--demo-color-success-soft);
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

.cancellation-view__dialog {
  position: fixed;
  z-index: 60;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgba(32, 50, 65, 0.28);
  padding: var(--demo-space-4);
}

.cancellation-view__dialog-card {
  display: grid;
  width: min(398px, 100%);
  gap: var(--demo-space-3);
  padding: var(--demo-space-5);
}

.cancellation-view__dialog-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--demo-space-3);
}

.demo-primary-button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

@media (max-width: 360px) {
  .cancellation-view__item,
  .cancellation-view__dialog-actions {
    grid-template-columns: 1fr;
  }
}
</style>
