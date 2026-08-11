<template>
  <Transition name="toast-message">
    <div v-if="message" class="toast-message" role="status">{{ message }}</div>
  </Transition>
</template>

<script setup lang="ts">
defineOptions({ name: 'ToastMessage' });

defineProps({
  message: {
    type: String,
    default: '',
  },
});
</script>

<style scoped>
.toast-message {
  position: fixed;
  z-index: 100;
  left: 50%;
  bottom: calc(var(--ehr-safe-bottom) + 92px);
  max-width: min(340px, calc(100vw - 48px));
  transform: translateX(-50%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--ehr-radius-full);
  color: rgba(255, 255, 255, 0.95);
  background: rgba(18, 35, 41, 0.92);
  box-shadow: var(--ehr-shadow-lg);
  backdrop-filter: blur(16px);
  padding: 10px 16px;
  font-size: 13px;
  text-align: center;
}

.toast-message-enter-active,
.toast-message-leave-active {
  transition: opacity var(--ehr-motion-base), transform var(--ehr-motion-base);
}

.toast-message-enter-from,
.toast-message-leave-to {
  opacity: 0;
  transform: translate(-50%, 8px);
}
</style>
