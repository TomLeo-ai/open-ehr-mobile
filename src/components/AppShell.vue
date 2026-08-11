<template>
  <div class="demo-page app-shell">
    <header class="app-shell__header">
      <button
        v-if="showBack"
        class="app-shell__icon-button"
        type="button"
        aria-label="返回"
        @click="goBack"
      >
        <ChevronLeft class="app-shell__back-icon" aria-hidden="true" :size="24" :stroke-width="2.25" />
      </button>
      <RouterLink v-else class="app-shell__brand" to="/home" aria-label="返回 Open EHR Mobile 首页">
        <span class="app-shell__brand-mark" aria-hidden="true">E</span>
      </RouterLink>

      <div class="app-shell__title-block">
        <span class="app-shell__product">Open EHR Mobile</span>
        <h1 class="app-shell__title">{{ title }}</h1>
        <p v-if="subtitle" class="app-shell__subtitle">{{ subtitle }}</p>
      </div>

      <slot name="right">
        <span class="app-shell__right-chip">Mock</span>
      </slot>
    </header>

    <main class="demo-scroll" :class="{ 'demo-scroll--detail': !withTabbar }">
      <slot />
    </main>

    <nav v-if="withTabbar" class="app-shell__tabbar" aria-label="主导航">
      <RouterLink
        v-for="item in tabs"
        :key="item.path"
        class="app-shell__tab"
        :class="{ 'app-shell__tab--active': isActiveTab(item.path) }"
        :aria-label="`前往${item.title}`"
        :aria-current="isActiveTab(item.path) ? 'page' : undefined"
        :to="item.path"
      >
        <span class="app-shell__tab-icon" aria-hidden="true">
          <component :is="item.icon" class="app-shell__tab-svg" :size="21" :stroke-width="2.15" />
        </span>
        <span>{{ item.title }}</span>
      </RouterLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeft, ClipboardCheck, FilePlus, Home, UserRoundCog } from '@lucide/vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';

defineOptions({ name: 'AppShell' });

defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
  showBack: {
    type: Boolean,
    default: false,
  },
  withTabbar: {
    type: Boolean,
    default: true,
  },
});

const route = useRoute();
const router = useRouter();

const tabs = [
  { path: '/home', title: '首页', icon: Home },
  { path: '/apply', title: '申请', icon: FilePlus },
  { path: '/approval', title: '审批', icon: ClipboardCheck },
  { path: '/self-service', title: '自助', icon: UserRoundCog },
];

const isActiveTab = (path: string) => {
  return path === '/home' ? route.path === '/home' : route.path.startsWith(path);
};

const goBack = () => {
  const historyState = window.history.state as { back?: string | null };
  if (historyState.back) {
    router.back();
    return;
  }
  router.replace('/home');
};
</script>

<style scoped>
.app-shell__header {
  position: fixed;
  z-index: 40;
  top: 0;
  left: 50%;
  display: grid;
  width: 100%;
  max-width: 430px;
  min-height: calc(var(--ehr-safe-top) + var(--ehr-header-height));
  grid-template-columns: 48px minmax(0, 1fr) 54px;
  align-items: center;
  gap: var(--ehr-space-2);
  transform: translateX(-50%);
  border-bottom: 1px solid rgba(214, 226, 223, 0.72);
  background: rgba(251, 253, 252, 0.94);
  backdrop-filter: blur(18px);
  box-shadow: 0 8px 24px rgba(18, 35, 41, 0.06);
  padding: var(--ehr-safe-top) var(--ehr-space-4) 0;
}

.app-shell__brand,
.app-shell__icon-button {
  display: inline-flex;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  border-radius: var(--ehr-radius-md);
  color: var(--ehr-color-primary-strong);
  background: transparent;
  touch-action: manipulation;
}

.app-shell__brand {
  background: var(--ehr-color-primary-soft);
}

.app-shell__brand-mark {
  display: inline-flex;
  width: 30px;
  height: 30px;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  color: #fff;
  background: var(--ehr-bg-hero);
  font-size: 15px;
  font-weight: 800;
}

.app-shell__icon-button:active,
.app-shell__brand:active {
  transform: scale(0.96);
}

.app-shell__icon-button:focus-visible,
.app-shell__brand:focus-visible,
.app-shell__tab:focus-visible {
  outline: none;
  box-shadow: var(--ehr-focus-ring);
}

.app-shell__back-icon {
  display: block;
}

.app-shell__title-block {
  display: grid;
  min-width: 0;
  align-self: center;
  gap: 1px;
}

.app-shell__product {
  overflow: hidden;
  max-width: 100%;
  color: var(--ehr-color-primary-strong);
  font-size: 10px;
  font-weight: 800;
  line-height: 1.1;
  text-overflow: ellipsis;
  text-transform: uppercase;
  white-space: nowrap;
}

.app-shell__title {
  overflow: hidden;
  max-width: 100%;
  margin: 0;
  color: var(--ehr-color-ink);
  font-size: 18px;
  font-weight: 800;
  line-height: 1.18;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.app-shell__subtitle {
  overflow: hidden;
  max-width: 100%;
  margin: 0;
  color: var(--ehr-color-ink-muted);
  font-size: 12px;
  line-height: 1.25;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.app-shell__right-chip {
  display: inline-flex;
  min-width: 48px;
  min-height: 30px;
  align-items: center;
  justify-content: center;
  justify-self: end;
  border: 1px solid rgba(81, 97, 106, 0.14);
  border-radius: var(--ehr-radius-full);
  color: var(--ehr-color-neutral);
  background: var(--ehr-color-neutral-soft);
  font-size: 11px;
  font-weight: 800;
}

.app-shell__tabbar {
  position: fixed;
  z-index: 40;
  bottom: 0;
  left: 50%;
  display: grid;
  width: 100%;
  max-width: 430px;
  min-height: calc(var(--ehr-safe-bottom) + var(--ehr-tab-height));
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 4px;
  transform: translateX(-50%);
  border-top: 1px solid rgba(214, 226, 223, 0.8);
  background: rgba(251, 253, 252, 0.96);
  box-shadow: 0 -14px 34px rgba(18, 35, 41, 0.1);
  backdrop-filter: blur(18px);
  padding: 8px 6px var(--ehr-safe-bottom);
}

.app-shell__tab {
  display: flex;
  min-width: 0;
  min-height: 58px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 4px;
  border-radius: var(--ehr-radius-lg);
  color: var(--ehr-color-ink-muted);
  font-size: 12px;
  font-weight: 700;
  touch-action: manipulation;
  transition:
    background-color var(--ehr-motion-fast),
    color var(--ehr-motion-fast),
    transform var(--ehr-motion-fast),
    box-shadow var(--ehr-motion-fast);
}

.app-shell__tab:active {
  transform: scale(0.97);
}

.app-shell__tab--active {
  color: var(--ehr-color-primary-strong);
  background: var(--ehr-color-primary-soft);
  box-shadow: inset 0 0 0 1px rgba(15, 118, 110, 0.12);
}

.app-shell__tab-icon {
  display: inline-flex;
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.app-shell__tab-svg {
  display: block;
}
</style>
