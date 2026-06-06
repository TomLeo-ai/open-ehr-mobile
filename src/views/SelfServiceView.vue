<template>
  <DemoShell title="员工自助" subtitle="查询中心">
    <section class="self-service__hero demo-card">
      <p class="self-service__eyebrow">员工自助</p>
      <h1>你好，{{ employeeProfile.name }}</h1>
      <p>{{ employeeProfile.department }} · {{ employeeProfile.position }}</p>
      <div class="self-service__hero-stats">
        <span>
          <strong>{{ selfServiceEntries.length }}</strong>
          <small>查询入口</small>
        </span>
        <span>
          <strong>4</strong>
          <small>本月动态</small>
        </span>
        <span>
          <strong>8.5</strong>
          <small>年假余额</small>
        </span>
      </div>
    </section>

    <DemoBlocks title="自助入口" desc="覆盖员工档案、薪资、考勤、休假、撤回、绩效和 HR 联系人。">
      <div class="self-service__grid">
        <RouterLink
          v-for="item in selfServiceEntries"
          :key="item.path"
          class="self-service__entry"
          :to="item.path"
        >
          <span class="self-service__entry-icon">{{ item.icon }}</span>
          <strong>{{ item.title }}</strong>
          <small>{{ item.desc }}</small>
        </RouterLink>
      </div>
    </DemoBlocks>

    <DemoBlocks title="近期查询" desc="查看最近使用的员工自助服务。">
      <div class="self-service__activity-list">
        <button
          v-for="item in activities"
          :key="item.title"
          class="self-service__activity"
          type="button"
          @click="showToast(item.title)"
        >
          <span>
            <strong>{{ item.title }}</strong>
            <small>{{ item.desc }}</small>
          </span>
          <b>{{ item.time }}</b>
        </button>
      </div>
    </DemoBlocks>

    <DemoToast :message="toastMessage" />
  </DemoShell>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DemoBlocks from '@/components/DemoBlocks.vue';
import DemoShell from '@/components/DemoShell.vue';
import DemoToast from '@/components/DemoToast.vue';
import { employeeProfile, selfServiceEntries } from '@/data/mock';

const activities = [
  { title: '薪资单已查看', desc: '2026-05 月薪资明细', time: '今天' },
  { title: '考勤异常待处理', desc: '05-13 下班缺卡记录', time: '05-14' },
  { title: '年假余额刷新', desc: '当前剩余 8.5 天', time: '05-10' },
];

const toastMessage = ref('');
let timer: number | undefined;

const showToast = (title: string) => {
  toastMessage.value = `已打开查询记录：${title}`;
  window.clearTimeout(timer);
  timer = window.setTimeout(() => {
    toastMessage.value = '';
  }, 2200);
};
</script>

<style scoped>
.self-service__hero {
  display: grid;
  gap: var(--demo-space-3);
  padding: var(--demo-space-5);
  background:
    linear-gradient(135deg, rgba(107, 140, 174, 0.22), rgba(255, 255, 255, 0.96)),
    #fff;
}

.self-service__eyebrow {
  margin: 0;
  color: var(--demo-color-primary-dark);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  color: var(--demo-color-text);
  font-size: 24px;
  line-height: 1.25;
}

.self-service__hero p {
  margin: 0;
  color: var(--demo-color-text-secondary);
  font-size: 14px;
}

.self-service__hero-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--demo-space-3);
}

.self-service__hero-stats span {
  display: grid;
  gap: 4px;
  border-radius: var(--demo-radius-md);
  background: rgba(255, 255, 255, 0.68);
  padding: 14px 12px;
}

.self-service__hero-stats strong {
  color: var(--demo-color-primary-dark);
  font-size: 22px;
}

.self-service__hero-stats small,
.self-service__entry small,
.self-service__activity small {
  color: var(--demo-color-text-tertiary);
  font-size: 12px;
}

.self-service__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--demo-space-3);
}

.self-service__entry {
  display: grid;
  min-height: 144px;
  gap: 4px;
  align-content: start;
  border-radius: var(--demo-radius-lg);
  background: var(--demo-color-surface-muted);
  padding: var(--demo-space-4);
}

.self-service__entry-icon {
  display: inline-flex;
  width: 42px;
  height: 42px;
  align-items: center;
  justify-content: center;
  border-radius: var(--demo-radius-md);
  color: var(--demo-color-primary-dark);
  background: var(--demo-color-primary-soft);
  font-weight: 700;
}

.self-service__entry strong,
.self-service__activity strong {
  color: var(--demo-color-text);
  font-size: 15px;
}

.self-service__entry small {
  line-height: 1.45;
}

.self-service__activity-list {
  display: grid;
  gap: var(--demo-space-3);
}

.self-service__activity {
  display: grid;
  width: 100%;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: var(--demo-space-3);
  align-items: center;
  border-radius: var(--demo-radius-md);
  background: var(--demo-color-surface-muted);
  padding: 14px var(--demo-space-3);
  text-align: left;
}

.self-service__activity span {
  display: grid;
  min-width: 0;
  gap: 2px;
}

.self-service__activity b {
  color: var(--demo-color-text-tertiary);
  font-size: 12px;
  font-weight: 600;
}

@media (max-width: 360px) {
  .self-service__grid,
  .self-service__hero-stats {
    grid-template-columns: 1fr;
  }
}
</style>
