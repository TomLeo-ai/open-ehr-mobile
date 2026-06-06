<template>
  <DemoShell title="首页" subtitle="移动工作台">
    <section class="home-view__profile demo-card">
      <div class="home-view__avatar">{{ employeeProfile.name.slice(0, 1) }}</div>
      <div class="home-view__profile-main">
        <div class="home-view__profile-head">
          <h1>{{ employeeProfile.name }}</h1>
          <span class="demo-tag demo-tag--success">{{ employeeProfile.status }}</span>
        </div>
        <p>{{ employeeProfile.badge }} · {{ employeeProfile.department }}</p>
        <p>{{ employeeProfile.position }} · {{ employeeProfile.company }}</p>
        <div class="home-view__tags">
          <span v-for="tag in employeeProfile.tags" :key="tag">{{ tag }}</span>
        </div>
      </div>
    </section>

    <section class="home-view__stats">
      <RouterLink
        v-for="item in homeStats"
        :key="item.label"
        class="home-view__stat demo-card"
        :to="item.path"
      >
        <strong>{{ item.value }}</strong>
        <span>{{ item.label }}</span>
      </RouterLink>
    </section>

    <RouterLink class="home-view__demo-check demo-card" to="/demo-checklist">
      <span>验</span>
      <div class="home-view__demo-check-content">
        <strong>业务导览</strong>
        <small>按首页、申请、审批、自助的推荐路径查看关键页面</small>
      </div>
      <b>›</b>
    </RouterLink>

    <DemoBlocks title="快捷申请" desc="高频流程入口，按业务场景分组填写。">
      <div class="home-view__grid">
        <RouterLink v-for="item in quickApplyItems" :key="item.title" class="home-view__entry" :to="item.path">
          <span>{{ item.icon }}</span>
          <strong>{{ item.title }}</strong>
          <small>{{ item.desc }}</small>
        </RouterLink>
      </div>
    </DemoBlocks>

    <DemoBlocks title="自助查询" desc="员工常用信息查询、薪资、考勤、假期与联系人。">
      <div class="home-view__query-list">
        <RouterLink v-for="item in quickQueryItems" :key="item.title" class="home-view__query" :to="item.path">
          <span class="home-view__query-icon">{{ item.icon }}</span>
          <span>
            <strong>{{ item.title }}</strong>
            <small>{{ item.desc }}</small>
          </span>
          <b>›</b>
        </RouterLink>
      </div>
    </DemoBlocks>

    <DemoBlocks title="公司公告" desc="查看近期通知和服务提醒。">
      <div class="home-view__notice-list">
        <button
          v-for="item in notices"
          :key="item.title"
          class="home-view__notice"
          type="button"
          @click="showNotice(item.title)"
        >
          <span>
            <strong>{{ item.title }}</strong>
            <small>{{ item.desc }}</small>
          </span>
          <time>{{ item.date }}</time>
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
import { employeeProfile, homeStats, notices, quickApplyItems, quickQueryItems } from '@/data/mock';

const toastMessage = ref('');
let timer: number | undefined;

const showNotice = (title: string) => {
  toastMessage.value = `公告详情：${title}`;
  window.clearTimeout(timer);
  timer = window.setTimeout(() => {
    toastMessage.value = '';
  }, 2200);
};
</script>

<style scoped>
.home-view__profile {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr);
  gap: var(--demo-space-4);
  align-items: center;
  padding: var(--demo-space-5) var(--demo-space-4);
  background:
    linear-gradient(135deg, rgba(107, 140, 174, 0.18), rgba(255, 255, 255, 0.96)),
    #fff;
  box-shadow: 0 16px 32px rgba(107, 140, 174, 0.12);
}

.home-view__avatar {
  display: inline-flex;
  width: 72px;
  height: 72px;
  align-items: center;
  justify-content: center;
  border-radius: var(--demo-radius-xl);
  color: rgba(255, 255, 255, 0.96);
  background: linear-gradient(135deg, var(--demo-color-primary), var(--demo-color-primary-dark));
  box-shadow: var(--demo-shadow-md);
  font-size: 28px;
  font-weight: 700;
}

.home-view__profile-main {
  min-width: 0;
}

.home-view__profile-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--demo-space-2);
}

h1 {
  overflow: hidden;
  margin: 0;
  color: var(--demo-color-text);
  font-size: 20px;
  line-height: 1.3;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.home-view__profile p {
  overflow: hidden;
  margin: 4px 0 0;
  color: var(--demo-color-text-secondary);
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.home-view__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}

.home-view__tags span {
  border-radius: var(--demo-radius-full);
  color: var(--demo-color-primary-dark);
  background: rgba(217, 228, 237, 0.8);
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 600;
}

.home-view__stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--demo-space-3);
}

.home-view__demo-check {
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr) auto;
  gap: var(--demo-space-3);
  align-items: center;
  padding: var(--demo-space-4);
}

.home-view__demo-check span {
  display: inline-flex;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  border-radius: var(--demo-radius-md);
  color: var(--demo-color-primary-dark);
  background: var(--demo-color-primary-soft);
  font-weight: 700;
}

.home-view__demo-check strong,
.home-view__demo-check small {
  display: block;
}

.home-view__demo-check-content {
  min-width: 0;
}

.home-view__demo-check strong {
  color: var(--demo-color-text);
  font-size: 15px;
}

.home-view__demo-check small {
  color: var(--demo-color-text-tertiary);
  font-size: 12px;
}

.home-view__demo-check b {
  color: var(--demo-color-text-quaternary);
  font-size: 24px;
}

.home-view__stat {
  display: grid;
  gap: 4px;
  justify-items: center;
  padding: var(--demo-space-4) var(--demo-space-3);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(244, 248, 252, 0.98));
}

.home-view__stat strong {
  color: var(--demo-color-primary-dark);
  font-size: 28px;
  line-height: 1;
}

.home-view__stat span {
  color: var(--demo-color-text-secondary);
  font-size: 12px;
  font-weight: 600;
}

.home-view__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--demo-space-3);
}

.home-view__entry {
  display: grid;
  min-height: 112px;
  gap: 4px;
  align-content: center;
  justify-items: center;
  border-radius: var(--demo-radius-lg);
  background: var(--demo-color-surface-muted);
  padding: var(--demo-space-3);
  text-align: center;
}

.home-view__entry span,
.home-view__query-icon {
  display: inline-flex;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  border-radius: var(--demo-radius-md);
  color: var(--demo-color-primary-dark);
  background: var(--demo-color-primary-soft);
  font-weight: 700;
}

.home-view__entry strong,
.home-view__query strong,
.home-view__notice strong {
  display: block;
  color: var(--demo-color-text);
  font-size: 14px;
}

.home-view__entry small,
.home-view__query small,
.home-view__notice small {
  display: -webkit-box;
  overflow: hidden;
  color: var(--demo-color-text-tertiary);
  font-size: 11px;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.home-view__query-list,
.home-view__notice-list {
  display: grid;
  gap: var(--demo-space-3);
}

.home-view__query,
.home-view__notice {
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr) auto;
  gap: var(--demo-space-3);
  align-items: center;
  border-radius: var(--demo-radius-md);
  background: var(--demo-color-surface-muted);
  padding: 14px var(--demo-space-3);
  text-align: left;
}

.home-view__notice {
  grid-template-columns: minmax(0, 1fr) auto;
  width: 100%;
}

.home-view__query b {
  color: var(--demo-color-text-quaternary);
  font-size: 24px;
}

time {
  color: var(--demo-color-text-tertiary);
  font-size: 12px;
}

@media (max-width: 360px) {
  .home-view__grid,
  .home-view__stats {
    grid-template-columns: 1fr;
  }

  .home-view__profile {
    grid-template-columns: 60px minmax(0, 1fr);
  }

  .home-view__avatar {
    width: 60px;
    height: 60px;
  }
}
</style>
