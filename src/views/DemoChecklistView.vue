<template>
  <DemoShell title="业务地图" subtitle="移动端服务导览" show-back :with-tabbar="false">
    <section class="demo-checklist__hero demo-card">
      <p>Service Map</p>
      <h1>按业务路径查看移动端功能</h1>
      <span>覆盖首页工作台、流程申请、审批中心和员工自助服务。</span>
    </section>

    <section class="demo-checklist__summary">
      <article class="demo-card">
        <strong>{{ demoChecklist.length }}</strong>
        <span>关键页面</span>
      </article>
      <article class="demo-card">
        <strong>{{ passedCount }}</strong>
        <span>已覆盖</span>
      </article>
      <article class="demo-card">
        <strong>{{ focusCount }}</strong>
        <span>重点流程</span>
      </article>
    </section>

    <DemoBlocks title="推荐演示路径" desc="从首页进入，依次覆盖申请、审批、自助三条主线。">
      <div class="demo-checklist__steps">
        <RouterLink
          v-for="item in demoChecklist"
          :key="item.path"
          class="demo-checklist__item"
          :to="item.path"
        >
          <div>
            <span>{{ item.module }}</span>
            <strong>{{ item.title }}</strong>
            <small>{{ item.focus }}</small>
          </div>
          <b class="demo-tag" :class="tagClass(item.tone)">{{ item.status }}</b>
        </RouterLink>
      </div>
    </DemoBlocks>

    <DemoBlocks title="功能范围" desc="移动端页面按员工日常办理路径组织。">
      <ul class="demo-checklist__rules">
        <li>首页展示员工身份、待办统计、快捷入口和公告提醒。</li>
        <li>申请中心支持新增、详情查看和重新发起。</li>
        <li>审批中心覆盖待办、已办、我的流程和草稿。</li>
        <li>自助查询覆盖档案、薪资、考勤、休假、撤回、绩效和联系人。</li>
      </ul>
    </DemoBlocks>
  </DemoShell>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import DemoBlocks from '@/components/DemoBlocks.vue';
import DemoShell from '@/components/DemoShell.vue';
import { demoChecklist } from '@/data/mock';
import type { DemoTone } from '@/data/types';

defineOptions({ name: 'DemoChecklistView' });

const passedCount = computed(() => demoChecklist.filter((item) => item.status === '已验收').length);
const focusCount = computed(() => demoChecklist.filter((item) => item.status === '重点演示').length);

const tagClass = (tone: DemoTone) => {
  if (tone === 'success') return 'demo-tag--success';
  if (tone === 'warning') return 'demo-tag--warning';
  if (tone === 'error') return 'demo-tag--error';
  if (tone === 'neutral') return 'demo-tag--neutral';
  return '';
};
</script>

<style scoped>
.demo-checklist__hero {
  padding: var(--demo-space-5);
  background: linear-gradient(180deg, rgba(236, 244, 255, 0.92), #fff);
}

.demo-checklist__hero p {
  margin: 0;
  color: var(--demo-color-primary-dark);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
}

.demo-checklist__hero h1 {
  margin: 4px 0;
  color: var(--demo-color-text);
  font-size: 24px;
  line-height: 1.25;
}

.demo-checklist__hero span {
  color: var(--demo-color-text-secondary);
  font-size: 13px;
}

.demo-checklist__summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--demo-space-3);
}

.demo-checklist__summary article {
  display: grid;
  justify-items: center;
  padding: var(--demo-space-3);
}

.demo-checklist__summary strong {
  color: var(--demo-color-primary-dark);
  font-size: 24px;
}

.demo-checklist__summary span {
  color: var(--demo-color-text-secondary);
  font-size: 12px;
}

.demo-checklist__steps {
  display: grid;
  gap: var(--demo-space-3);
}

.demo-checklist__item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: var(--demo-space-3);
  align-items: start;
  border-radius: var(--demo-radius-md);
  background: var(--demo-color-surface-muted);
  padding: var(--demo-space-3);
}

.demo-checklist__item div {
  display: grid;
  min-width: 0;
  gap: 3px;
}

.demo-checklist__item span,
.demo-checklist__item em {
  color: var(--demo-color-text-tertiary);
  font-size: 12px;
  font-style: normal;
}

.demo-checklist__item strong {
  color: var(--demo-color-text);
  font-size: 15px;
}

.demo-checklist__item small {
  color: var(--demo-color-text-secondary);
  font-size: 12px;
}

.demo-checklist__rules {
  display: grid;
  gap: var(--demo-space-2);
  margin: 0;
  padding-left: 18px;
  color: var(--demo-color-text-secondary);
  font-size: 13px;
}

@media (max-width: 360px) {
  .demo-checklist__summary {
    grid-template-columns: 1fr;
  }
}
</style>
