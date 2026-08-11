import { onBeforeUnmount, ref } from 'vue';

const DEFAULT_TOAST_DURATION = 2200;

export const useToastMessage = (defaultDuration = DEFAULT_TOAST_DURATION) => {
  const toastMessage = ref('');
  let timer: number | undefined;

  const clearToast = () => {
    window.clearTimeout(timer);
    timer = undefined;
    toastMessage.value = '';
  };

  const showToast = (message: string, duration = defaultDuration) => {
    window.clearTimeout(timer);
    toastMessage.value = message;
    timer = window.setTimeout(() => {
      toastMessage.value = '';
      timer = undefined;
    }, duration);
  };

  onBeforeUnmount(() => {
    window.clearTimeout(timer);
  });

  return {
    toastMessage,
    showToast,
    clearToast,
  };
};
