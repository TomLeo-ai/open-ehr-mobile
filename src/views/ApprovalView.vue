<template>
  <DemoShell title="审批" subtitle="待办、已办、我的流程与草稿">
    <nav class="approval-view__tabs demo-card">
      <RouterLink
        v-for="item in approvalTabs"
        :key="item.key"
        class="approval-view__tab"
        :class="{ 'approval-view__tab--active': activeTab === item.key }"
        :to="item.path"
      >
        {{ item.label }}
        <span>{{ approvals[item.key]?.length || 0 }}</span>
      </RouterLink>
    </nav>

    <section class="approval-view__summary">
      <article class="demo-card">
        <strong>{{ approvals.todo.length }}</strong>
        <span>待办</span>
      </article>
      <article class="demo-card">
        <strong>{{ approvals.done.length }}</strong>
        <span>已办</span>
      </article>
      <article class="demo-card">
        <strong>{{ approvals.draft.length }}</strong>
        <span>草稿</span>
      </article>
    </section>

    <section class="approval-view__list">
      <DemoListCard
        v-for="item in list"
        :key="item.id"
        :title="item.title"
        :desc="item.desc"
        :meta="item.meta"
        :status="item.status"
        :tone="item.tone"
        @click="$router.push(`/approval/detail/${item.id}`)"
      />
    </section>

  </DemoShell>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import DemoListCard from '@/components/DemoListCard.vue';
import DemoShell from '@/components/DemoShell.vue';
import { approvalTabs, approvals } from '@/data/mock';

const props = defineProps({
  tab: {
    type: String,
    default: 'todo',
  },
});

const activeTab = computed(() => props.tab || 'todo');
const list = computed(() => approvals[activeTab.value] ?? approvals.todo);
</script>

<style scoped>
.approval-view__tabs {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 6px;
  padding: 8px;
}

.approval-view__tab {
  display: flex;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 2px;
  border-radius: var(--demo-radius-md);
  color: var(--demo-color-text-tertiary);
  font-size: 13px;
}

.approval-view__tab span {
  font-size: 11px;
}

.approval-view__tab--active {
  color: var(--demo-color-primary-dark);
  background: var(--demo-color-primary-soft);
  font-weight: 700;
}

.approval-view__summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--demo-space-3);
}

.approval-view__summary article {
  display: grid;
  justify-items: center;
  padding: var(--demo-space-3);
}

.approval-view__summary strong {
  color: var(--demo-color-primary-dark);
  font-size: 24px;
}

.approval-view__summary span {
  color: var(--demo-color-text-secondary);
  font-size: 12px;
}

.approval-view__list {
  display: grid;
  gap: var(--demo-space-3);
}
</style>
