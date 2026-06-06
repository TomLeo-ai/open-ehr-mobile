<template>
  <DemoFormPage
    :title="form.title"
    :summary="modeSummary"
    :status="statusText"
    :tone="tone"
    :source="form.source"
    :process-no="form.processNo"
    :current-node="currentNode"
    :applicant="form.applicant"
    :mode="normalizedMode"
    :mode-links="form.modeLinks"
    :sections="sections"
    :attachments="form.attachments"
    @feedback="showToast"
  />
  <DemoToast :message="toastMessage" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import DemoFormPage from '@/components/DemoFormPage.vue';
import DemoToast from '@/components/DemoToast.vue';
import { applicationForms } from '@/data/mock';
import type { DemoSection } from '@/data/types';

const props = defineProps({
  formKey: {
    type: String,
    required: true,
  },
  mode: {
    type: String,
    default: 'add',
  },
});

const form = computed(() => applicationForms[props.formKey] ?? applicationForms.onJob);
const normalizedMode = computed<'add' | 'detail' | 'reissue'>(() => {
  if (props.mode === 'detail' || props.mode === 'reissue') {
    return props.mode;
  }
  return 'add';
});

const sections = computed<DemoSection[]>(() => {
  return form.value.sections.map((section) => ({
    ...section,
    fields: section.fields.map((field) => ({
      ...field,
      readonly: normalizedMode.value === 'detail' ? true : field.readonly,
    })),
  }));
});

const statusText = computed(() => {
  if (normalizedMode.value === 'detail') return '详情只读';
  if (normalizedMode.value === 'reissue') return '重发起';
  return form.value.status;
});

const tone = computed(() => (normalizedMode.value === 'detail' ? 'neutral' : normalizedMode.value === 'reissue' ? 'warning' : form.value.tone));

const currentNode = computed(() => {
  if (normalizedMode.value === 'detail') return '流程详情归档';
  if (normalizedMode.value === 'reissue') return '申请人重发起';
  return form.value.currentNode;
});

const modeSummary = computed(() => {
  const prefix = normalizedMode.value === 'detail' ? '当前为详情只读；' : normalizedMode.value === 'reissue' ? '当前为重发起；' : '';
  return `${prefix}${form.value.summary}`;
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
