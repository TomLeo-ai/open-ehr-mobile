<template>
  <DemoShell :title="title" :subtitle="subtitle" show-back :with-tabbar="false">
    <section class="demo-form-page__hero demo-card">
      <div>
        <p class="demo-form-page__eyebrow">{{ eyebrow }}</p>
        <h2>{{ title }}</h2>
        <p>{{ summary }}</p>
      </div>
      <span class="demo-tag" :class="statusClass">{{ status }}</span>
    </section>

    <section class="demo-form-page__status demo-card">
      <div v-for="item in statusItems" :key="item.label">
        <span>{{ item.label }}</span>
        <strong>{{ item.value }}</strong>
      </div>
    </section>

    <nav v-if="modeLinks.length" class="demo-form-page__modes demo-card" aria-label="表单状态演示">
      <RouterLink
        v-for="link in modeLinks"
        :key="link.path"
        :to="link.path"
        class="demo-form-page__mode"
        :class="{ 'demo-form-page__mode--active': link.mode === mode }"
      >
        {{ link.label }}
      </RouterLink>
    </nav>

    <DemoBlocks
      v-for="section in sections"
      :key="section.title"
      :title="section.title"
      :desc="section.desc"
    >
      <template #extra>
        <span v-if="section.badge" class="demo-tag demo-tag--neutral">{{ section.badge }}</span>
      </template>
      <div class="demo-form-page__fields">
        <label
          v-for="field in section.fields"
          :key="field.label"
          class="demo-form-page__field"
          :class="{ 'demo-form-page__field--readonly': field.readonly }"
        >
          <span class="demo-form-page__label">
            {{ field.label }}
            <b v-if="field.required">*</b>
          </span>
          <textarea
            v-if="field.type === 'textarea'"
            v-model="field.value"
            :readonly="field.readonly"
            rows="3"
          />
          <select v-else-if="field.type === 'select'" v-model="field.value" :disabled="field.readonly">
            <option v-for="option in field.options" :key="option" :value="option">{{ option }}</option>
          </select>
          <input v-else v-model="field.value" :readonly="field.readonly" :type="inputType(field.type)" />
          <small v-if="field.helper">{{ field.helper }}</small>
        </label>
      </div>
    </DemoBlocks>

    <DemoBlocks title="附件材料" desc="展示已上传材料、审核状态和预览入口。">
      <div class="demo-form-page__attachments">
        <button
          v-for="file in attachments"
          :key="file.name"
          :aria-label="`预览附件：${file.name}`"
          class="demo-form-page__attachment"
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
    </DemoBlocks>

    <div class="demo-form-page__actions">
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
  </DemoShell>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue';
import { RouterLink } from 'vue-router';
import DemoBlocks from '@/components/DemoBlocks.vue';
import DemoShell from '@/components/DemoShell.vue';
import type { DemoAttachment, DemoModeLink, DemoSection, DemoTone } from '@/data/types';

defineOptions({ name: 'DemoFormPage' });

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
    default: 'DEMO-20260601-001',
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
    type: Array as PropType<DemoModeLink[]>,
    default: () => [],
  },
  tone: {
    type: String as PropType<DemoTone>,
    default: 'primary',
  },
  sections: {
    type: Array as PropType<DemoSection[]>,
    required: true,
  },
  attachments: {
    type: Array as PropType<DemoAttachment[]>,
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
.demo-form-page__hero {
  display: flex;
  min-width: 0;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--demo-space-3);
  padding: var(--demo-space-4);
  background: linear-gradient(180deg, rgba(236, 244, 255, 0.9), #ffffff);
}

.demo-form-page__eyebrow {
  margin: 0;
  color: var(--demo-color-primary-dark);
  font-size: 12px;
  font-weight: 600;
}

.demo-form-page__hero h2 {
  margin: 3px 0 0;
  color: var(--demo-color-text);
  font-size: 20px;
  line-height: 1.35;
}

.demo-form-page__hero p:last-child {
  margin: 6px 0 0;
  color: var(--demo-color-text-secondary);
  font-size: 13px;
}

.demo-form-page__status {
  display: grid;
  min-width: 0;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--demo-space-3);
  padding: var(--demo-space-4);
}

.demo-form-page__status span,
.demo-form-page__status strong {
  overflow-wrap: anywhere;
  display: block;
}

.demo-form-page__status span {
  color: var(--demo-color-text-tertiary);
  font-size: 12px;
}

.demo-form-page__status strong {
  margin-top: 2px;
  color: var(--demo-color-text);
  font-size: 13px;
  line-height: 1.35;
}

.demo-form-page__modes {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--demo-space-2);
  padding: var(--demo-space-2);
}

.demo-form-page__mode {
  display: inline-flex;
  min-height: 36px;
  align-items: center;
  justify-content: center;
  border-radius: var(--demo-radius-md);
  color: var(--demo-color-text-secondary);
  font-size: 13px;
  font-weight: 600;
}

.demo-form-page__mode--active {
  color: var(--demo-color-primary-dark);
  background: var(--demo-color-primary-soft);
}

.demo-form-page__fields {
  display: grid;
  min-width: 0;
  gap: var(--demo-space-3);
}

.demo-form-page__field {
  display: grid;
  min-width: 0;
  gap: 6px;
}

.demo-form-page__label {
  color: var(--demo-color-text-secondary);
  font-size: 13px;
  font-weight: 600;
}

.demo-form-page__label b {
  color: #a95650;
}

input,
select,
textarea {
  min-width: 0;
  width: 100%;
  border: 1px solid transparent;
  border-radius: var(--demo-radius-md);
  color: var(--demo-color-text);
  background: var(--demo-color-surface-inset);
  padding: 12px;
  outline: none;
  font-size: 15px;
}

textarea {
  resize: vertical;
}

input:focus,
select:focus,
textarea:focus {
  border-color: var(--demo-color-primary);
  background: #fff;
}

.demo-form-page__field--readonly input,
.demo-form-page__field--readonly select,
.demo-form-page__field--readonly textarea {
  color: var(--demo-color-text-secondary);
  background: var(--demo-color-surface-muted);
}

small {
  color: var(--demo-color-text-tertiary);
  font-size: 12px;
}

.demo-form-page__attachments {
  display: grid;
  min-width: 0;
  gap: var(--demo-space-3);
}

.demo-form-page__attachment {
  display: flex;
  min-width: 0;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: var(--demo-space-3);
  border: 0;
  border-radius: var(--demo-radius-md);
  background: var(--demo-color-surface-muted);
  padding: var(--demo-space-3);
  color: inherit;
  cursor: pointer;
  font: inherit;
  text-align: left;
}

.demo-form-page__attachment:active {
  background: var(--demo-color-primary-soft);
}

.demo-form-page__attachment:focus-visible {
  outline: 2px solid var(--demo-color-primary);
  outline-offset: 2px;
}

.demo-form-page__attachment strong,
.demo-form-page__attachment span {
  display: block;
  overflow-wrap: anywhere;
}

.demo-form-page__attachment strong {
  color: var(--demo-color-text);
  font-size: 14px;
}

.demo-form-page__attachment div span {
  color: var(--demo-color-text-tertiary);
  font-size: 12px;
}

.demo-form-page__actions {
  position: fixed;
  z-index: 100;
  bottom: 0;
  left: 50%;
  display: grid;
  width: 100%;
  max-width: 430px;
  grid-template-columns: 1fr 1.4fr;
  gap: var(--demo-space-3);
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 -2px 8px rgba(107, 140, 174, 0.08);
  padding: var(--demo-space-3) var(--demo-space-4) calc(var(--demo-safe-bottom) + var(--demo-space-3));
}

.demo-form-page__actions .demo-primary-button:only-child {
  grid-column: 1 / -1;
}
</style>
