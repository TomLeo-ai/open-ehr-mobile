<template>
  <div class="demo-page">
    <header class="demo-shell__header">
      <button
        v-if="showBack"
        class="demo-shell__icon-button"
        type="button"
        aria-label="返回"
        @click="goBack"
      >
        ‹
      </button>
      <span v-else class="demo-shell__left-placeholder" aria-hidden="true" />
      <div class="demo-shell__title-block">
        <h1 class="demo-shell__title">{{ title }}</h1>
        <p v-if="subtitle" class="demo-shell__subtitle">{{ subtitle }}</p>
      </div>
      <slot name="right">
        <span class="demo-shell__right-placeholder" />
      </slot>
    </header>

    <main class="demo-scroll" :class="{ 'demo-scroll--detail': !withTabbar }">
      <slot />
    </main>

    <nav v-if="withTabbar" class="demo-shell__tabbar" aria-label="主导航">
      <RouterLink
        v-for="item in tabs"
        :key="item.path"
        class="demo-shell__tab"
        :class="{ 'demo-shell__tab--active': route.path.startsWith(item.path) }"
        :to="item.path"
      >
        <span class="demo-shell__tab-icon">{{ item.icon }}</span>
        <span>{{ item.title }}</span>
      </RouterLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';

defineOptions({ name: 'DemoShell' });

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
  { path: '/home', title: '首页', icon: '⌂' },
  { path: '/apply', title: '申请', icon: '＋' },
  { path: '/approval', title: '审批', icon: '✓' },
  { path: '/self-service', title: '自助', icon: '□' },
];

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
.demo-shell__header {
  position: fixed;
  z-index: 20;
  top: 0;
  left: 50%;
  display: grid;
  width: 100%;
  max-width: 430px;
  min-height: calc(var(--demo-safe-top) + var(--demo-header-height));
  grid-template-columns: 48px minmax(0, 1fr) 48px;
  align-items: end;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.94);
  box-shadow: var(--demo-shadow-sm);
  backdrop-filter: blur(14px);
  padding: var(--demo-safe-top) var(--demo-space-3) 0;
}

.demo-shell__title-block {
  display: grid;
  min-width: 0;
  justify-items: center;
  align-self: center;
  padding-bottom: 8px;
}

.demo-shell__title {
  overflow: hidden;
  max-width: 100%;
  margin: 0;
  color: var(--demo-color-text);
  font-size: 18px;
  font-weight: 600;
  line-height: 1.25;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.demo-shell__subtitle {
  overflow: hidden;
  max-width: 100%;
  margin: 2px 0 0;
  color: var(--demo-color-text-tertiary);
  font-size: 12px;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.demo-shell__icon-button,
.demo-shell__left-placeholder,
.demo-shell__right-placeholder {
  width: 44px;
  height: 44px;
}

.demo-shell__icon-button {
  color: var(--demo-color-primary-dark);
  background: transparent;
  font-size: 34px;
  line-height: 1;
}

.demo-shell__tabbar {
  position: fixed;
  z-index: 20;
  bottom: 0;
  left: 50%;
  display: grid;
  width: 100%;
  max-width: 430px;
  min-height: calc(var(--demo-safe-bottom) + var(--demo-tab-height));
  grid-template-columns: repeat(4, minmax(0, 1fr));
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.985);
  box-shadow: 0 -8px 18px rgba(107, 140, 174, 0.12);
  backdrop-filter: blur(14px);
  padding: 8px 4px var(--demo-safe-bottom);
}

.demo-shell__tab {
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 3px;
  border-radius: var(--demo-radius-md);
  color: var(--demo-color-text-tertiary);
  font-size: 12px;
}

.demo-shell__tab--active {
  color: var(--demo-color-primary-dark);
  background: var(--demo-color-primary-soft);
  font-weight: 600;
}

.demo-shell__tab-icon {
  font-size: 18px;
  line-height: 1;
}
</style>
