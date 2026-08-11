<template>
  <AppShell title="个人信息" subtitle="员工档案" show-back :with-tabbar="false">
    <section class="profile-view__card demo-card" aria-labelledby="profile-title">
      <div class="profile-view__avatar" aria-hidden="true">
        <UserRound class="profile-view__svg" :size="30" :stroke-width="2.1" />
      </div>
      <div class="profile-view__main">
        <div class="profile-view__head">
          <h1 id="profile-title">{{ employeeProfile.name }}</h1>
          <div class="profile-view__badges" aria-label="员工档案状态">
            <span class="demo-tag demo-tag--success">
              <BadgeCheck class="profile-view__tag-icon" aria-hidden="true" :size="13" :stroke-width="2.1" />
              {{ employeeProfile.status }}
            </span>
            <span class="demo-tag demo-tag--neutral">Mock 数据</span>
          </div>
        </div>
        <p>
          <IdCard class="profile-view__meta-icon" aria-hidden="true" :size="14" :stroke-width="2.1" />
          <span>{{ employeeProfile.badge }} · {{ employeeProfile.department }}</span>
        </p>
        <p>
          <BriefcaseBusiness class="profile-view__meta-icon" aria-hidden="true" :size="14" :stroke-width="2.1" />
          <span>{{ employeeProfile.position }} · {{ employeeProfile.company }}</span>
        </p>
        <div class="profile-view__tags" aria-label="员工标签">
          <span v-for="tag in employeeProfile.tags" :key="tag">{{ tag }}</span>
        </div>
      </div>
    </section>

    <section class="profile-view__tabs" aria-label="档案分组">
      <RouterLink
        v-for="item in profileGroupTabs"
        :key="item.path"
        class="profile-view__tab"
        :class="{ 'profile-view__tab--active': currentGroup.path === item.path }"
        :to="item.path"
        :aria-current="currentGroup.path === item.path ? 'page' : undefined"
      >
        <span class="profile-view__tab-icon" :class="`profile-view__icon--${item.tone}`" aria-hidden="true">
          <component :is="item.icon" class="profile-view__svg" :size="17" :stroke-width="2.1" />
        </span>
        <span>{{ item.title }}</span>
      </RouterLink>
    </section>

    <SectionBlock :title="currentGroup.title" desc="当前分组的员工档案明细。">
      <FieldList v-if="currentGroup.fields.length" :fields="currentGroup.fields" />
      <div v-else class="profile-view__empty" role="status">
        <Info class="profile-view__svg" aria-hidden="true" :size="20" :stroke-width="2.1" />
        <span>暂无档案字段，请检查 mock 数据配置。</span>
      </div>
    </SectionBlock>

    <SectionBlock title="档案操作" desc="支持档案确认和信息变更申请。">
      <div class="profile-view__actions">
        <button class="demo-primary-button" type="button" @click="showToast('已提交档案核对确认')">
          <CheckCircle2 class="profile-view__svg" aria-hidden="true" :size="17" :stroke-width="2.15" />
          确认无误
        </button>
        <button class="demo-secondary-button" type="button" @click="showToast('已创建档案变更模拟记录')">
          <FilePenLine class="profile-view__svg" aria-hidden="true" :size="17" :stroke-width="2.15" />
          模拟申请变更
        </button>
      </div>
    </SectionBlock>

    <ToastMessage :message="toastMessage" />
  </AppShell>
</template>

<script setup lang="ts">
import type { Component } from 'vue';
import {
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardList,
  FilePenLine,
  GraduationCap,
  IdCard,
  Info,
  Languages,
  UserRound,
  UsersRound,
  WalletCards,
} from '@lucide/vue';
import { computed } from 'vue';
import SectionBlock from '@/components/SectionBlock.vue';
import FieldList from '@/components/FieldList.vue';
import AppShell from '@/components/AppShell.vue';
import ToastMessage from '@/components/ToastMessage.vue';
import { useToastMessage } from '@/composables/useToastMessage';
import { employeeProfile, profileGroups } from '@/data/mock';

type ProfileTone = 'primary' | 'success' | 'warning' | 'error';

type ProfileGroupMeta = {
  icon: Component;
  tone: ProfileTone;
};

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

const fallbackGroupMeta: ProfileGroupMeta = {
  icon: ClipboardList,
  tone: 'primary',
};

const profileGroupIconMap: Record<string, ProfileGroupMeta> = {
  '/self-service/profile': { icon: ClipboardList, tone: 'primary' },
  '/self-service/profile/career': { icon: GraduationCap, tone: 'primary' },
  '/self-service/profile/family': { icon: UsersRound, tone: 'warning' },
  '/self-service/profile/qualification': { icon: Languages, tone: 'success' },
  '/self-service/profile/finance': { icon: WalletCards, tone: 'error' },
};

const currentGroup = computed(() => {
  const path = props.group ? groupPathMap[props.group] : '/self-service/profile';
  return profileGroups.find((item) => item.path === path) ?? profileGroups[0];
});

const profileGroupTabs = computed(() =>
  profileGroups.map((item) => ({
    ...item,
    ...(profileGroupIconMap[item.path] ?? fallbackGroupMeta),
  })),
);

const { toastMessage, showToast } = useToastMessage();
</script>

<style scoped>
.profile-view__card {
  display: grid;
  grid-template-columns: 68px minmax(0, 1fr);
  gap: var(--demo-space-4);
  align-items: start;
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
}

.profile-view__main {
  min-width: 0;
  padding-top: 2px;
}

.profile-view__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--demo-space-2);
}

h1 {
  min-width: 0;
  flex: 1;
  overflow: hidden;
  margin: 0;
  color: var(--demo-color-text);
  font-size: 20px;
  line-height: 1.3;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile-view__badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: flex-end;
}

.profile-view__badges .demo-tag {
  gap: 4px;
}

.profile-view__card p {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 6px;
  overflow: hidden;
  margin: 6px 0 0;
  color: var(--demo-color-text-secondary);
  font-size: 13px;
}

.profile-view__card p span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile-view__meta-icon,
.profile-view__tag-icon {
  display: block;
  flex-shrink: 0;
}

.profile-view__meta-icon {
  color: var(--demo-color-primary-dark);
}

.profile-view__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}

.profile-view__tags span {
  border-radius: var(--demo-radius-full);
  color: var(--demo-color-primary-dark);
  background: rgba(217, 228, 237, 0.8);
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 600;
}

.profile-view__tabs {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--demo-space-2);
}

.profile-view__tab {
  display: grid;
  min-height: 54px;
  min-width: 0;
  grid-template-columns: 34px minmax(0, 1fr);
  gap: var(--demo-space-2);
  align-items: center;
  border-radius: var(--demo-radius-md);
  color: var(--demo-color-text-secondary);
  background: var(--demo-color-surface-inset);
  padding: 9px 10px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.2;
  touch-action: manipulation;
  transition: background-color 0.18s ease, box-shadow 0.18s ease, color 0.18s ease, transform 0.18s ease;
}

.profile-view__tab--active {
  color: var(--demo-color-primary-dark);
  background: #fff;
  font-weight: 600;
  box-shadow: var(--demo-shadow-sm);
}

.profile-view__tab:active,
.profile-view__actions button:active {
  transform: scale(0.985);
}

.profile-view__tab:focus-visible,
.profile-view__actions button:focus-visible {
  outline: 2px solid var(--demo-color-primary);
  outline-offset: 2px;
}

.profile-view__tab-icon {
  display: inline-flex;
  width: 34px;
  height: 34px;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: var(--demo-radius-md);
}

.profile-view__icon--primary {
  color: var(--demo-color-primary-dark);
  background: var(--demo-color-primary-soft);
}

.profile-view__icon--success {
  color: #2f6a50;
  background: var(--demo-color-success-soft);
}

.profile-view__icon--warning {
  color: #8f6b2f;
  background: var(--demo-color-warning-soft);
}

.profile-view__icon--error {
  color: #a95650;
  background: var(--demo-color-error-soft);
}

.profile-view__svg {
  display: block;
  flex-shrink: 0;
}

.profile-view__actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--demo-space-3);
}

.profile-view__actions button {
  gap: var(--demo-space-2);
  touch-action: manipulation;
}

.profile-view__empty {
  display: grid;
  min-height: 96px;
  place-items: center;
  gap: var(--demo-space-2);
  border-radius: var(--demo-radius-md);
  color: var(--demo-color-text-secondary);
  background: var(--demo-color-surface-muted);
  padding: var(--demo-space-4);
  text-align: center;
}

@media (max-width: 360px) {
  .profile-view__card,
  .profile-view__actions {
    grid-template-columns: 1fr;
  }
}
</style>
