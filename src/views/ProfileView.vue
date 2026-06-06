<template>
  <DemoShell title="个人信息" subtitle="员工档案" show-back :with-tabbar="false">
    <section class="profile-view__card demo-card">
      <div class="profile-view__avatar">{{ employeeProfile.name.slice(0, 1) }}</div>
      <div class="profile-view__main">
        <div class="profile-view__head">
          <h1>{{ employeeProfile.name }}</h1>
          <span class="demo-tag demo-tag--success">{{ employeeProfile.status }}</span>
        </div>
        <p>{{ employeeProfile.badge }} · {{ employeeProfile.department }}</p>
        <p>{{ employeeProfile.company }}</p>
      </div>
    </section>

    <section class="profile-view__tabs" aria-label="档案分组">
      <RouterLink
        v-for="item in profileGroups"
        :key="item.path"
        class="profile-view__tab"
        :class="{ 'profile-view__tab--active': currentGroup.path === item.path }"
        :to="item.path"
      >
        {{ item.title }}
      </RouterLink>
    </section>

    <DemoBlocks :title="currentGroup.title" desc="员工档案信息按分组展示。">
      <DemoFieldList :fields="currentGroup.fields" />
    </DemoBlocks>

    <DemoBlocks title="档案操作" desc="支持档案确认和信息变更申请。">
      <div class="profile-view__actions">
        <button class="demo-primary-button" type="button" @click="showToast('已提交档案核对确认')">
          确认无误
        </button>
        <button class="demo-secondary-button" type="button" @click="showToast('已发起信息变更申请')">
          申请变更
        </button>
      </div>
    </DemoBlocks>

    <DemoToast :message="toastMessage" />
  </DemoShell>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import DemoBlocks from '@/components/DemoBlocks.vue';
import DemoFieldList from '@/components/DemoFieldList.vue';
import DemoShell from '@/components/DemoShell.vue';
import DemoToast from '@/components/DemoToast.vue';
import { employeeProfile, profileGroups } from '@/data/mock';

const props = defineProps({
  group: {
    type: String,
    default: '',
  },
});

const groupPathMap: Record<string, string> = {
  career: '/self-service/profile/career',
  family: '/self-service/profile/family',
  qualification: '/self-service/profile/qualification',
  finance: '/self-service/profile/finance',
};

const currentGroup = computed(() => {
  const path = props.group ? groupPathMap[props.group] : '/self-service/profile';
  return profileGroups.find((item) => item.path === path) ?? profileGroups[0];
});

const toastMessage = ref('');
let timer: number | undefined;

const showToast = (message: string) => {
  toastMessage.value = message;
  window.clearTimeout(timer);
  timer = window.setTimeout(() => {
    toastMessage.value = '';
  }, 2200);
};
</script>

<style scoped>
.profile-view__card {
  display: grid;
  grid-template-columns: 68px minmax(0, 1fr);
  gap: var(--demo-space-4);
  align-items: center;
  padding: var(--demo-space-5) var(--demo-space-4);
  background:
    linear-gradient(135deg, rgba(107, 140, 174, 0.18), rgba(255, 255, 255, 0.96)),
    #fff;
  box-shadow: 0 14px 30px rgba(107, 140, 174, 0.1);
}

.profile-view__avatar {
  display: inline-flex;
  width: 68px;
  height: 68px;
  align-items: center;
  justify-content: center;
  border-radius: var(--demo-radius-xl);
  color: rgba(255, 255, 255, 0.96);
  background: linear-gradient(135deg, var(--demo-color-primary), var(--demo-color-primary-dark));
  box-shadow: var(--demo-shadow-md);
  font-size: 26px;
  font-weight: 700;
}

.profile-view__main {
  min-width: 0;
}

.profile-view__head {
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
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile-view__card p {
  overflow: hidden;
  margin: 4px 0 0;
  color: var(--demo-color-text-secondary);
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile-view__tabs {
  display: flex;
  gap: var(--demo-space-2);
  overflow-x: auto;
  padding: 2px 2px 4px;
  scrollbar-width: none;
}

.profile-view__tabs::-webkit-scrollbar {
  display: none;
}

.profile-view__tab {
  flex: 0 0 auto;
  border-radius: var(--demo-radius-full);
  color: var(--demo-color-text-secondary);
  background: var(--demo-color-surface-inset);
  padding: 9px 12px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.profile-view__tab--active {
  color: rgba(255, 255, 255, 0.96);
  background: var(--demo-color-primary);
  font-weight: 600;
}

.profile-view__actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--demo-space-3);
}

@media (max-width: 360px) {
  .profile-view__card,
  .profile-view__actions {
    grid-template-columns: 1fr;
  }
}
</style>
