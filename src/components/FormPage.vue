<template>
  <AppShell :title="title" :subtitle="subtitle" show-back :with-tabbar="false">
    <section class="form-page__hero demo-card">
      <div>
        <p class="form-page__eyebrow">{{ eyebrow }}</p>
        <h2>{{ title }}</h2>
        <p>{{ summary }}</p>
      </div>
      <span class="demo-tag" :class="statusClass">{{ status }}</span>
    </section>

    <section class="form-page__status demo-card">
      <div v-for="item in statusItems" :key="item.label">
        <span>{{ item.label }}</span>
        <strong>{{ item.value }}</strong>
      </div>
    </section>

    <nav v-if="modeLinks.length" class="form-page__modes demo-card" aria-label="表单状态演示">
      <RouterLink
        v-for="link in modeLinks"
        :key="link.path"
        :to="link.path"
        class="form-page__mode"
        :class="{ 'form-page__mode--active': link.mode === mode }"
      >
        {{ link.label }}
      </RouterLink>
    </nav>

    <SectionBlock
      v-for="section in sections"
      :key="section.title"
      :title="section.title"
      :desc="section.desc"
    >
      <template #extra>
        <span v-if="section.badge" class="demo-tag demo-tag--neutral">{{ section.badge }}</span>
      </template>
      <div class="form-page__fields">
        <div
          v-for="field in section.fields"
          :key="field.label"
          class="form-page__field"
          :class="{ 'form-page__field--readonly': field.readonly }"
        >
          <span class="form-page__label">
            {{ field.label }}
            <b v-if="field.required">*</b>
          </span>
          <textarea
            v-if="field.type === 'textarea'"
            v-model="field.value"
            :aria-label="field.label"
            :readonly="field.readonly"
            rows="3"
          />
          <select v-else-if="field.type === 'select'" v-model="field.value" :aria-label="field.label" :disabled="field.readonly">
            <option v-for="option in field.options" :key="option" :value="option">{{ option }}</option>
          </select>
          <button
            v-else-if="field.type === 'attachment'"
            class="form-page__field-attachment"
            type="button"
            :aria-label="`预览${field.label}：${field.value}`"
            @click="emitFeedback(`预览附件：${field.value}`)"
          >
            <Paperclip class="form-page__svg" aria-hidden="true" :size="18" :stroke-width="2.1" />
            <span>{{ field.value }}</span>
          </button>
          <input v-else v-model="field.value" :aria-label="field.label" :readonly="field.readonly" :type="inputType(field.type)" />
          <small v-if="field.helper">{{ field.helper }}</small>
        </div>
      </div>
    </SectionBlock>

    <SectionBlock title="附件材料" desc="展示已上传材料、审核状态和预览入口。">
      <div class="form-page__attachments">
        <button
          v-for="file in attachments"
          :key="file.name"
          :aria-label="`预览附件：${file.name}`"
          class="form-page__attachment"
          type="button"
          @click="emitFeedback(`预览附件：${file.name}`)"
        >
          <div>
            <strong>{{ file.name }}</strong>
            <span>{{ file.size }}</span>
          </div>
          <span class="demo-tag demo-tag--success">{{ file.status }}</span>
        </button>
      </div>
    </SectionBlock>

    <div class="form-page__actions">
      <button
        v-if="mode !== 'detail'"
        class="demo-secondary-button"
        type="button"
        @click="handleSaveDraft"
      >
        保存草稿
      </button>
      <button
        class="demo-primary-button"
        type="button"
        @click="handlePrimaryAction"
      >
        {{ mode === 'detail' ? '预览材料' : '提交申请' }}
      </button>
    </div>
  </AppShell>
</template>

<script setup lang="ts">
import { Paperclip } from '@lucide/vue';
import { computed, type PropType } from 'vue';
import { RouterLink } from 'vue-router';
import SectionBlock from '@/components/SectionBlock.vue';
import AppShell from '@/components/AppShell.vue';
import type { AttachmentItem, FormModeLink, FormSection, Tone } from '@/data/types';

defineOptions({ name: 'FormPage' });

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: '员工流程服务',
  },
  eyebrow: {
    type: String,
    default: '流程申请',
  },
  summary: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: '新增申请',
  },
  source: {
    type: String,
    default: '',
  },
  processNo: {
    type: String,
    default: 'PROC-20260601-001',
  },
  currentNode: {
    type: String,
    default: '申请人填写',
  },
  applicant: {
    type: String,
    default: '陈晓宁 / EMP0001',
  },
  mode: {
    type: String as PropType<'add' | 'detail' | 'reissue'>,
    default: 'add',
  },
  modeLinks: {
    type: Array as PropType<FormModeLink[]>,
    default: () => [],
  },
  tone: {
    type: String as PropType<Tone>,
    default: 'primary',
  },
  sections: {
    type: Array as PropType<FormSection[]>,
    required: true,
  },
  attachments: {
    type: Array as PropType<AttachmentItem[]>,
    default: () => [],
  },
});

const emit = defineEmits<{
  feedback: [message: string];
}>();

type StoredFormRecord = {
  processNo: string;
  title: string;
  applicant: string;
  mode: 'add' | 'detail' | 'reissue';
  status: 'draft' | 'submitted';
  updatedAt: string;
  fields: Record<string, string>;
};

const formStorageKeys = {
  drafts: 'open-ehr-mobile:form-drafts',
  submissions: 'open-ehr-mobile:form-submissions',
} as const;

const statusClass = computed(() => {
  return props.tone === 'success'
    ? 'demo-tag--success'
    : props.tone === 'warning'
      ? 'demo-tag--warning'
      : props.tone === 'error'
        ? 'demo-tag--error'
        : props.tone === 'neutral'
          ? 'demo-tag--neutral'
          : '';
});

const statusItems = computed(() => {
  return [
    { label: '流程编号', value: props.processNo },
    { label: '当前节点', value: props.currentNode },
    { label: '申请人', value: props.applicant },
    { label: '资料范围', value: props.source || '员工申请信息' },
  ];
});

const inputType = (type?: string) => {
  if (type === 'date') {
    return 'date';
  }
  if (type === 'number') {
    return 'number';
  }
  return 'text';
};

const emitFeedback = (message: string) => {
  emit('feedback', message);
};

const readStoredRecords = (key: string) => {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredFormRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const collectFieldValues = () => {
  const fields: Record<string, string> = {};
  props.sections.forEach((section) => {
    section.fields.forEach((field) => {
      fields[field.key ?? field.label] = field.value;
    });
  });
  return fields;
};

const persistFormRecord = (key: string, status: StoredFormRecord['status']) => {
  const nextRecord: StoredFormRecord = {
    processNo: props.processNo,
    title: props.title,
    applicant: props.applicant,
    mode: props.mode,
    status,
    updatedAt: new Date().toISOString(),
    fields: collectFieldValues(),
  };
  const records = readStoredRecords(key).filter((record) => {
    return record.processNo !== nextRecord.processNo || record.mode !== nextRecord.mode;
  });
  window.localStorage.setItem(key, JSON.stringify([nextRecord, ...records].slice(0, 20)));
};

const handleSaveDraft = () => {
  persistFormRecord(formStorageKeys.drafts, 'draft');
  emitFeedback('草稿已保存');
};

const handlePrimaryAction = () => {
  if (props.mode === 'detail') {
    emitFeedback('已打开材料与流程轨迹预览');
    return;
  }
  persistFormRecord(formStorageKeys.submissions, 'submitted');
  emitFeedback('申请已提交，流程状态已更新');
};
</script>

<style scoped>
.form-page__hero {
  display: flex;
  min-width: 0;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--ehr-space-3);
  overflow: hidden;
  padding: var(--ehr-space-5);
  color: #ffffff;
  background: var(--ehr-bg-hero);
  box-shadow: var(--ehr-shadow-lg);
}

.form-page__eyebrow {
  margin: 0;
  color: rgba(255, 255, 255, 0.72);
  font-size: 12px;
  font-weight: 850;
  text-transform: uppercase;
}

.form-page__hero h2 {
  margin: 3px 0 0;
  color: #ffffff;
  font-size: 20px;
  line-height: 1.35;
}

.form-page__hero p:last-child {
  margin: 6px 0 0;
  color: rgba(255, 255, 255, 0.78);
  font-size: 13px;
  line-height: 1.45;
}

.form-page__hero .demo-tag {
  align-self: start;
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.12);
}

.form-page__status {
  display: grid;
  min-width: 0;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--ehr-space-3);
  border: 1px solid rgba(214, 226, 223, 0.78);
  padding: var(--ehr-space-4);
}

.form-page__status span,
.form-page__status strong {
  overflow-wrap: anywhere;
  display: block;
}

.form-page__status span {
  color: var(--ehr-color-ink-muted);
  font-size: 12px;
}

.form-page__status strong {
  margin-top: 2px;
  color: var(--ehr-color-ink);
  font-size: 13px;
  font-weight: 800;
  line-height: 1.35;
}

.form-page__modes {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--ehr-space-2);
  border: 1px solid rgba(214, 226, 223, 0.78);
  padding: var(--ehr-space-2);
}

.form-page__mode {
  display: inline-flex;
  min-height: 36px;
  align-items: center;
  justify-content: center;
  border-radius: var(--ehr-radius-md);
  color: var(--ehr-color-ink-muted);
  font-size: 13px;
  font-weight: 750;
  transition: background-color var(--ehr-motion-fast), color var(--ehr-motion-fast), box-shadow var(--ehr-motion-fast);
}

.form-page__mode:focus-visible {
  outline: none;
  box-shadow: var(--ehr-focus-ring);
}

.form-page__mode--active {
  color: var(--ehr-color-primary-strong);
  background: var(--ehr-color-primary-soft);
}

.form-page__fields {
  display: grid;
  min-width: 0;
  gap: var(--ehr-space-3);
}

.form-page__field {
  display: grid;
  min-width: 0;
  gap: 6px;
  border: 1px solid rgba(214, 226, 223, 0.74);
  border-radius: var(--ehr-radius-lg);
  background: var(--ehr-color-surface-raised);
  padding: var(--ehr-space-3);
}

.form-page__label {
  color: var(--ehr-color-ink-soft);
  font-size: 13px;
  font-weight: 800;
}

.form-page__label b {
  color: var(--ehr-color-error);
}

input,
select,
textarea {
  min-width: 0;
  width: 100%;
  border: 1px solid var(--ehr-color-border);
  border-radius: var(--ehr-radius-md);
  color: var(--ehr-color-ink);
  background: var(--ehr-color-surface-muted);
  padding: 12px;
  outline: none;
  font-size: 15px;
  transition: border-color var(--ehr-motion-fast), background-color var(--ehr-motion-fast), box-shadow var(--ehr-motion-fast);
}

textarea {
  resize: vertical;
}

input:focus,
select:focus,
textarea:focus {
  border-color: var(--ehr-color-primary);
  background: #ffffff;
  box-shadow: var(--ehr-focus-ring);
}

.form-page__field-attachment {
  display: grid;
  width: 100%;
  min-height: 48px;
  grid-template-columns: 22px minmax(0, 1fr);
  align-items: center;
  gap: var(--ehr-space-2);
  border: 1px solid rgba(15, 118, 110, 0.18);
  border-radius: var(--ehr-radius-md);
  color: var(--ehr-color-primary-strong);
  background: var(--ehr-color-primary-soft);
  padding: 11px 12px;
  font: inherit;
  font-size: 14px;
  font-weight: 750;
  text-align: left;
  touch-action: manipulation;
}

.form-page__field-attachment span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.form-page__field-attachment:active {
  transform: scale(0.985);
}

.form-page__field-attachment:focus-visible {
  border-color: var(--ehr-color-primary);
  outline: none;
  box-shadow: var(--ehr-focus-ring);
}

.form-page__field--readonly input,
.form-page__field--readonly select,
.form-page__field--readonly textarea {
  color: var(--ehr-color-ink-soft);
  background: var(--ehr-color-neutral-soft);
}

small {
  color: var(--ehr-color-ink-muted);
  font-size: 12px;
}

.form-page__attachments {
  display: grid;
  min-width: 0;
  gap: var(--ehr-space-3);
}

.form-page__attachment {
  display: flex;
  min-width: 0;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: var(--ehr-space-3);
  border: 1px solid rgba(214, 226, 223, 0.76);
  border-radius: var(--ehr-radius-lg);
  background: var(--ehr-color-surface-raised);
  padding: var(--ehr-space-3);
  color: inherit;
  cursor: pointer;
  font: inherit;
  text-align: left;
}

.form-page__attachment:active {
  background: var(--ehr-color-primary-soft);
}

.form-page__attachment:focus-visible {
  outline: none;
  box-shadow: var(--ehr-focus-ring);
}

.form-page__attachment strong,
.form-page__attachment span {
  display: block;
  overflow-wrap: anywhere;
}

.form-page__attachment strong {
  color: var(--ehr-color-ink);
  font-size: 14px;
  font-weight: 800;
}

.form-page__attachment div span {
  color: var(--ehr-color-ink-muted);
  font-size: 12px;
}

.form-page__svg {
  display: block;
  flex-shrink: 0;
}

.form-page__actions {
  position: fixed;
  z-index: 100;
  bottom: 0;
  left: 50%;
  display: grid;
  width: 100%;
  max-width: 430px;
  grid-template-columns: 1fr 1.4fr;
  gap: var(--ehr-space-3);
  transform: translateX(-50%);
  border-top: 1px solid rgba(214, 226, 223, 0.86);
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 -14px 32px rgba(18, 35, 41, 0.12);
  backdrop-filter: blur(18px);
  padding: var(--ehr-space-3) var(--ehr-space-4) calc(var(--ehr-safe-bottom) + var(--ehr-space-3));
}

.form-page__actions .demo-primary-button:only-child {
  grid-column: 1 / -1;
}
</style>
