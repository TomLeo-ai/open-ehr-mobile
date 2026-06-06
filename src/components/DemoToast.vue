<template>
  <Transition name="demo-toast">
    <div v-if="message" class="demo-toast" role="status">{{ message }}</div>
  </Transition>
</template>

<script setup lang="ts">
defineOptions({ name: 'DemoToast' });

defineProps({
  message: {
    type: String,
    default: '',
  },
});
</script>

<style scoped>
.demo-toast {
  position: fixed;
  z-index: 100;
  left: 50%;
  bottom: calc(var(--demo-safe-bottom) + 92px);
  max-width: min(340px, calc(100vw - 48px));
  transform: translateX(-50%);
  border-radius: var(--demo-radius-full);
  color: rgba(255, 255, 255, 0.95);
  background: rgba(32, 50, 65, 0.92);
  box-shadow: var(--demo-shadow-lg);
  padding: 10px 16px;
  font-size: 13px;
  text-align: center;
}

.demo-toast-enter-active,
.demo-toast-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.demo-toast-enter-from,
.demo-toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 8px);
}
</style>
