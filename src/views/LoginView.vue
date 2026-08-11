<template>
  <AppShell title="Open EHR Mobile" subtitle="企业 HR 开源前端模板" :with-tabbar="false">
    <section class="login-view demo-card">
      <p class="login-view__eyebrow">Open EHR Mobile</p>
      <h1>企业移动员工服务</h1>
      <p>已准备员工、审批、申请和自助查询数据，适合快速查看移动端页面范围与交互体验。</p>
      <button class="demo-primary-button" type="button" @click="$router.push('/home')">进入系统</button>
      <button class="demo-secondary-button" type="button" @click="$router.push('/self-service')">查看自助服务</button>
    </section>
  </AppShell>
</template>

<script setup lang="ts">
import AppShell from '@/components/AppShell.vue';
</script>

<style scoped>
.login-view {
  display: grid;
  gap: var(--demo-space-4);
  padding: var(--demo-space-6);
  background:
    linear-gradient(180deg, rgba(236, 244, 255, 0.88), rgba(255, 255, 255, 1));
}

.login-view__eyebrow {
  margin: 0;
  color: var(--demo-color-primary-dark);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  color: var(--demo-color-text);
  font-size: 28px;
  line-height: 1.25;
}

p {
  margin: 0;
  color: var(--demo-color-text-secondary);
  font-size: 15px;
}
</style>
