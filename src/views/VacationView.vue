<template>
  <DemoShell title="休假结余" subtitle="假期账户" show-back :with-tabbar="false">
    <section class="vacation-view__tabs" aria-label="假期类型">
      <button
        v-for="item in vacations"
        :key="item.type"
        class="vacation-view__tab"
        :class="{ 'vacation-view__tab--active': item.type === selectedVacation.type }"
        type="button"
        @click="activeType = item.type"
      >
        {{ item.type }}
      </button>
    </section>

    <section class="vacation-view__balance demo-card">
      <span>{{ selectedVacation.type }}余额</span>
      <strong>{{ selectedVacation.balance }}</strong>
      <p>已使用 {{ selectedVacation.used }}，记录按最近时间排序。</p>
      <div class="vacation-view__progress">
        <i :style="{ width: progressWidth }" />
      </div>
    </section>

    <DemoBlocks title="使用记录" desc="点击可查看假期记录反馈。">
      <div class="vacation-view__records">
        <button
          v-for="record in selectedVacation.records"
          :key="record"
          class="vacation-view__record"
          type="button"
          @click="showToast(`已查看：${record}`)"
        >
          <span>{{ record }}</span>
          <b>›</b>
        </button>
      </div>
    </DemoBlocks>

    <DemoBlocks title="假期操作" desc="支持休假申请和余额刷新。">
      <div class="vacation-view__actions">
        <button class="demo-primary-button" type="button" @click="showToast('已进入休假申请')">
          发起休假申请
        </button>
        <button class="demo-secondary-button" type="button" @click="showToast('假期余额已刷新')">
          刷新余额
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
import { vacations } from '@/data/mock';

const activeType = ref(vacations[0]?.type ?? '');
const toastMessage = ref('');
let timer: number | undefined;

const selectedVacation = computed(() => vacations.find((item) => item.type === activeType.value) ?? vacations[0]);

const progressWidth = computed(() => {
  if (selectedVacation.value.type === '年假') return '71%';
  if (selectedVacation.value.type === '调休') return '75%';
  return '100%';
});

const showToast = (message: string) => {
  toastMessage.value = message;
  window.clearTimeout(timer);
  timer = window.setTimeout(() => {
    toastMessage.value = '';
  }, 2200);
};
</script>

<style scoped>
.vacation-view__tabs {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--demo-space-2);
  border-radius: var(--demo-radius-lg);
  background: var(--demo-color-surface-inset);
  padding: 4px;
}

.vacation-view__tab {
  min-height: 40px;
  border-radius: var(--demo-radius-md);
  color: var(--demo-color-text-secondary);
  background: transparent;
  font-size: 14px;
  font-weight: 600;
}

.vacation-view__tab--active {
  color: var(--demo-color-primary-dark);
  background: #fff;
  box-shadow: var(--demo-shadow-sm);
}

.vacation-view__balance {
  display: grid;
  gap: var(--demo-space-2);
  padding: var(--demo-space-5);
  background:
    linear-gradient(135deg, rgba(184, 212, 200, 0.38), rgba(255, 255, 255, 0.98)),
    #fff;
}

.vacation-view__balance span {
  color: var(--demo-color-text-secondary);
  font-size: 14px;
}

.vacation-view__balance strong {
  color: var(--demo-color-primary-dark);
  font-size: 32px;
  line-height: 1.2;
}

.vacation-view__balance p {
  margin: 0;
  color: var(--demo-color-text-tertiary);
  font-size: 13px;
}

.vacation-view__progress {
  overflow: hidden;
  height: 7px;
  border-radius: var(--demo-radius-full);
  background: var(--demo-color-surface-inset);
}

.vacation-view__progress i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--demo-color-primary);
}

.vacation-view__records {
  display: grid;
  gap: var(--demo-space-2);
}

.vacation-view__record {
  display: grid;
  width: 100%;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: var(--demo-space-3);
  align-items: center;
  border-radius: var(--demo-radius-md);
  background: var(--demo-color-surface-muted);
  padding: var(--demo-space-3);
  text-align: left;
}

.vacation-view__record span {
  color: var(--demo-color-text);
  font-size: 14px;
}

.vacation-view__record b {
  color: var(--demo-color-text-quaternary);
  font-size: 22px;
}

.vacation-view__actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--demo-space-3);
}

@media (max-width: 360px) {
  .vacation-view__tabs,
  .vacation-view__actions {
    grid-template-columns: 1fr;
  }
}
</style>
