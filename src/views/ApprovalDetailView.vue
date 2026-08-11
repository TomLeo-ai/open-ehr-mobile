<template>
  <AppShell title="审批详情" subtitle="移动审批处理" show-back :with-tabbar="false">
    <section class="approval-detail__hero demo-card">
      <div class="approval-detail__hero-main">
        <p>审批详情</p>
        <h1>{{ detailState.title }}</h1>
        <span>当前节点：{{ detailState.node }}</span>
      </div>
      <span class="demo-tag" :class="statusClass">{{ detailState.status }}</span>
      <dl class="approval-detail__hero-meta" aria-label="审批摘要">
        <div>
          <dt>申请人</dt>
          <dd>{{ detailState.applicant }}</dd>
        </div>
        <div>
          <dt>流程编号</dt>
          <dd>{{ processNo }}</dd>
        </div>
        <div>
          <dt>附件</dt>
          <dd>{{ detailState.attachments.length }} 份</dd>
        </div>
      </dl>
    </section>

    <SectionBlock title="申请信息" desc="审批详情中的业务表单摘要。">
      <FieldList :fields="detailState.fields" />
    </SectionBlock>

    <SectionBlock title="附件材料" desc="展示业务附件和预览入口。">
      <div class="approval-detail__attachments">
        <button
          v-for="file in detailState.attachments"
          :key="file.name"
          class="approval-detail__attachment"
          type="button"
          :aria-label="`预览附件：${file.name}，${file.size}`"
          @click="showToast(`预览附件：${file.name}`)"
        >
          <span class="approval-detail__attachment-icon" aria-hidden="true">
            <Paperclip class="approval-detail__svg" :size="20" :stroke-width="2.1" />
          </span>
          <span class="approval-detail__attachment-main">
            <strong>{{ file.name }}</strong>
            <small>{{ file.size }}</small>
          </span>
          <span class="demo-tag demo-tag--success">{{ file.status }}</span>
          <FileSearch class="approval-detail__attachment-action" aria-hidden="true" :size="18" :stroke-width="2.1" />
        </button>
      </div>
    </SectionBlock>

    <SectionBlock title="审批流程" desc="按移动端时间线展示审批轨迹。">
      <Timeline :items="detailState.timeline" />
    </SectionBlock>

    <SectionBlock title="审批意见" desc="驳回类动作会校验意见。">
      <label class="approval-detail__reason-label" for="approval-detail-reason">
        <MessageSquareText class="approval-detail__svg" aria-hidden="true" :size="18" :stroke-width="2.1" />
        审批意见
      </label>
      <textarea
        id="approval-detail-reason"
        v-model="reason"
        class="approval-detail__reason"
        placeholder="请输入审批意见"
        aria-describedby="approval-detail-reason-helper"
      />
      <p id="approval-detail-reason-helper" class="approval-detail__reason-helper">
        同意、转办、加签可直接提交；驳回前请保留明确意见。
      </p>
      <div class="approval-detail__quick" aria-label="审批意见快捷短语">
        <button
          v-for="item in opinions"
          :key="item"
          type="button"
          @click="reason = item"
        >
          {{ item }}
        </button>
      </div>
    </SectionBlock>

    <div class="approval-detail__actions-spacer" aria-hidden="true" />

    <div class="approval-detail__actions" aria-label="审批操作">
      <button class="demo-secondary-button" type="button" :disabled="isProcessing" @click="handleAction('transfer')">
        <component
          :is="actionIcon('transfer')"
          class="approval-detail__action-icon"
          :class="{ 'approval-detail__action-icon--loading': isProcessing && processingAction === 'transfer' }"
          aria-hidden="true"
          :size="17"
          :stroke-width="2.1"
        />
        {{ actionLabel('transfer', '转办') }}
      </button>
      <button class="demo-secondary-button" type="button" :disabled="isProcessing" @click="handleAction('add-sign')">
        <component
          :is="actionIcon('add-sign')"
          class="approval-detail__action-icon"
          :class="{ 'approval-detail__action-icon--loading': isProcessing && processingAction === 'add-sign' }"
          aria-hidden="true"
          :size="17"
          :stroke-width="2.1"
        />
        {{ actionLabel('add-sign', '加签') }}
      </button>
      <button class="demo-secondary-button" type="button" :disabled="isProcessing" @click="reject">
        <component
          :is="actionIcon('reject')"
          class="approval-detail__action-icon"
          :class="{ 'approval-detail__action-icon--loading': isProcessing && processingAction === 'reject' }"
          aria-hidden="true"
          :size="17"
          :stroke-width="2.1"
        />
        {{ actionLabel('reject', '驳回') }}
      </button>
      <button class="demo-primary-button" type="button" :disabled="isProcessing" @click="handleAction('approve')">
        <component
          :is="actionIcon('approve')"
          class="approval-detail__action-icon"
          :class="{ 'approval-detail__action-icon--loading': isProcessing && processingAction === 'approve' }"
          aria-hidden="true"
          :size="17"
          :stroke-width="2.1"
        />
        {{ actionLabel('approve', '同意') }}
      </button>
    </div>

    <ToastMessage :message="toastMessage" />
  </AppShell>
</template>

<script setup lang="ts">
import type { Component } from 'vue';
import {
  CheckCircle2,
  FileSearch,
  LoaderCircle,
  MessageSquareText,
  Paperclip,
  Share2,
  UserRoundPlus,
  XCircle,
} from '@lucide/vue';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import SectionBlock from '@/components/SectionBlock.vue';
import FieldList from '@/components/FieldList.vue';
import AppShell from '@/components/AppShell.vue';
import Timeline from '@/components/Timeline.vue';
import ToastMessage from '@/components/ToastMessage.vue';
import { getApprovalToneByStatus, persistApprovalListState } from '@/composables/useApprovalMockState';
import { useToastMessage } from '@/composables/useToastMessage';
import type { ApprovalDetailState, TimelineItem, Tone } from '@/data/types';
import { approvalDetail, approvalDetails } from '@/data/mock';

const reason = ref('同意，情况属实。');
const { toastMessage, showToast } = useToastMessage();
const isProcessing = ref(false);
const processingAction = ref<'transfer' | 'add-sign' | 'reject' | 'approve' | ''>('');
const route = useRoute();
const opinions = ['同意，情况属实。', '请补充证明材料后重新提交。', '已确认，可进入下一节点。'];

const processInstanceId = computed(() => {
  const value = route.params.processInstanceId;
  return typeof value === 'string' ? value : 'demo';
});

const approvalStorageKey = computed(() => {
  return `open-ehr-mobile:approval-detail-state:${processInstanceId.value}`;
});

const processNo = computed(() => {
  return detailState.value.fields.find((item) => item.label === '流程编号')?.value ?? processInstanceId.value;
});

const createInitialDetailState = (): ApprovalDetailState => {
  return structuredClone(approvalDetails[processInstanceId.value] ?? approvalDetail);
};

const detailState = ref<ApprovalDetailState>(createInitialDetailState());

const readStoredDetail = () => {
  try {
    const raw = window.localStorage.getItem(approvalStorageKey.value);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as ApprovalDetailState;
    return Array.isArray(parsed.timeline) ? parsed : undefined;
  } catch {
    return undefined;
  }
};

const persistDetailState = () => {
  window.localStorage.setItem(approvalStorageKey.value, JSON.stringify(detailState.value));
};

onMounted(() => {
  const storedDetail = readStoredDetail();
  if (storedDetail) {
    detailState.value = storedDetail;
  }
});

const statusClass = computed(() => {
  return detailState.value.status === '已同意'
    ? 'demo-tag--success'
    : ['已通过', '已处理'].includes(detailState.value.status)
      ? 'demo-tag--success'
      : detailState.value.status === '已驳回'
      ? 'demo-tag--error'
      : detailState.value.status === '审批中转办'
        ? 'demo-tag--warning'
        : detailState.value.status === '审批中加签'
          ? ''
          : 'demo-tag--warning';
});

const actionLabel = (key: 'transfer' | 'add-sign' | 'reject' | 'approve', fallback: string) => {
  return isProcessing.value && processingAction.value === key ? '处理中...' : fallback;
};

const actionIconMap: Record<'transfer' | 'add-sign' | 'reject' | 'approve', Component> = {
  transfer: Share2,
  'add-sign': UserRoundPlus,
  reject: XCircle,
  approve: CheckCircle2,
};

const actionIcon = (key: 'transfer' | 'add-sign' | 'reject' | 'approve') => {
  return isProcessing.value && processingAction.value === key ? LoaderCircle : actionIconMap[key];
};

const updateTimeline = (
  currentTitle: string,
  currentDesc: string,
  currentStatus: string,
  currentTone: Tone,
) => {
  detailState.value.timeline = detailState.value.timeline.map((item, index) => {
    if (index === 0) {
      return { ...item, status: '已完成', tone: 'success' } satisfies TimelineItem;
    }
    if (index === 1) {
      return {
        ...item,
        title: currentTitle,
        desc: currentDesc,
        status: currentStatus,
        tone: currentTone,
        time: '刚刚更新',
      } satisfies TimelineItem;
    }
    return item;
  });
};

const finishAction = (message: string) => {
  isProcessing.value = false;
  processingAction.value = '';
  persistDetailState();
  persistApprovalListState(processInstanceId.value, {
    status: detailState.value.status,
    tone: getApprovalToneByStatus(detailState.value.status),
    node: detailState.value.node,
  });
  showToast(message);
};

const handleAction = (action: 'transfer' | 'add-sign' | 'approve') => {
  if (isProcessing.value) return;
  isProcessing.value = true;
  processingAction.value = action;

  window.setTimeout(() => {
    if (action === 'transfer') {
      detailState.value.status = '审批中转办';
      detailState.value.node = '转办人员待处理';
      updateTimeline('转办处理中', '待转办人员确认审批意见与处理结果', '处理中', 'warning');
      finishAction('转办人员选择已打开');
      return;
    }

    if (action === 'add-sign') {
      detailState.value.status = '审批中加签';
      detailState.value.node = '加签人员处理中';
      updateTimeline('加签处理中', '已加入加签节点，等待加签人员处理', '处理中', 'primary');
      finishAction('加签人员选择已打开');
      return;
    }

    detailState.value.status = '已同意';
    detailState.value.node = '流程已完成';
    updateTimeline('部门负责人审批通过', '审批意见已确认，流程状态已同步更新', '已完成', 'success');
    finishAction('审批已同意，列表状态已更新');
  }, 650);
};

const reject = () => {
  if (isProcessing.value) return;
  if (!reason.value.trim()) {
    showToast('审批建议不能为空');
    return;
  }
  isProcessing.value = true;
  processingAction.value = 'reject';

  window.setTimeout(() => {
    detailState.value.status = '已驳回';
    detailState.value.node = '申请人重新提交';
    updateTimeline('部门负责人驳回', '审批意见已退回申请人，等待补充材料后重新提交', '已驳回', 'error');
    finishAction('审批已驳回，列表状态已更新');
  }, 650);
};
</script>

<style scoped>
.approval-detail__hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: var(--ehr-space-3);
  overflow: hidden;
  padding: var(--ehr-space-5);
  color: #ffffff;
  background: var(--ehr-bg-hero);
  box-shadow: var(--ehr-shadow-lg);
}

.approval-detail__hero-main {
  min-width: 0;
}

.approval-detail__hero p {
  margin: 0;
  color: rgba(255, 255, 255, 0.72);
  font-size: 12px;
  font-weight: 850;
  text-transform: uppercase;
}

.approval-detail__hero-main span {
  display: block;
  margin-top: 4px;
  color: rgba(255, 255, 255, 0.78);
  font-size: 13px;
  line-height: 1.45;
}

.approval-detail__hero h1 {
  margin: 4px 0;
  color: #ffffff;
  font-size: 22px;
  line-height: 1.25;
}

.approval-detail__hero .demo-tag {
  flex: 0 0 auto;
  align-self: start;
  justify-self: end;
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.12);
}

.approval-detail__hero-meta {
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--ehr-space-2);
  margin: var(--ehr-space-1) 0 0;
}

.approval-detail__hero-meta div {
  min-width: 0;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: var(--ehr-radius-md);
  background: rgba(255, 255, 255, 0.11);
  padding: var(--ehr-space-2);
}

.approval-detail__hero-meta dt,
.approval-detail__hero-meta dd {
  margin: 0;
  min-width: 0;
}

.approval-detail__hero-meta dt {
  color: rgba(255, 255, 255, 0.64);
  font-size: 11px;
}

.approval-detail__hero-meta dd {
  overflow: hidden;
  margin-top: 2px;
  color: #ffffff;
  font-size: 12px;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.approval-detail__attachments {
  display: grid;
  gap: var(--ehr-space-3);
}

.approval-detail__attachment {
  display: grid;
  width: 100%;
  grid-template-columns: 42px minmax(0, 1fr) auto auto;
  align-items: center;
  gap: var(--ehr-space-3);
  border: 1px solid rgba(214, 226, 223, 0.76);
  border-radius: var(--ehr-radius-lg);
  background: var(--ehr-color-surface-raised);
  padding: var(--ehr-space-3);
  text-align: left;
  cursor: pointer;
  touch-action: manipulation;
  transition: background-color var(--ehr-motion-fast), box-shadow var(--ehr-motion-fast), transform var(--ehr-motion-fast);
}

.approval-detail__attachment:active {
  transform: scale(0.985);
  background: var(--ehr-color-primary-soft);
}

.approval-detail__attachment:focus-visible {
  outline: none;
  box-shadow: var(--ehr-focus-ring);
}

.approval-detail__attachment-icon {
  display: inline-flex;
  width: 42px;
  height: 42px;
  align-items: center;
  justify-content: center;
  border-radius: var(--ehr-radius-md);
  color: var(--ehr-color-primary-strong);
  background: var(--ehr-color-primary-soft);
}

.approval-detail__attachment-main {
  min-width: 0;
}

.approval-detail__attachment strong,
.approval-detail__attachment small {
  display: block;
}

.approval-detail__attachment strong {
  overflow: hidden;
  color: var(--ehr-color-ink);
  font-size: 14px;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.approval-detail__attachment small {
  margin-top: 3px;
  color: var(--ehr-color-ink-muted);
  font-size: 12px;
}

.approval-detail__attachment-action {
  color: var(--ehr-color-ink-subtle);
}

.approval-detail__reason-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: var(--ehr-space-2);
  color: var(--ehr-color-ink);
  font-size: 14px;
  font-weight: 800;
}

.approval-detail__reason {
  width: 100%;
  border: 1px solid var(--ehr-color-border);
  border-radius: var(--ehr-radius-md);
  background: var(--ehr-color-surface-muted);
  padding: 12px;
  min-height: 88px;
  resize: vertical;
  transition: border-color var(--ehr-motion-fast), background-color var(--ehr-motion-fast), box-shadow var(--ehr-motion-fast);
}

.approval-detail__reason:focus-visible {
  border-color: var(--ehr-color-primary);
  background: var(--ehr-color-surface);
  outline: none;
  box-shadow: var(--ehr-focus-ring);
}

.approval-detail__reason-helper {
  margin: 8px 0 0;
  color: var(--ehr-color-ink-muted);
  font-size: 12px;
}

.approval-detail__quick {
  display: flex;
  flex-wrap: wrap;
  gap: var(--ehr-space-2);
  margin-top: var(--ehr-space-3);
}

.approval-detail__quick button {
  min-height: 44px;
  border: 1px solid rgba(15, 118, 110, 0.16);
  border-radius: var(--ehr-radius-full);
  color: var(--ehr-color-primary-strong);
  background: var(--ehr-color-primary-soft);
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 750;
  cursor: pointer;
  touch-action: manipulation;
  transition: background-color var(--ehr-motion-fast), transform var(--ehr-motion-fast), box-shadow var(--ehr-motion-fast);
}

.approval-detail__quick button:active {
  transform: scale(0.98);
}

.approval-detail__quick button:focus-visible {
  outline: none;
  box-shadow: var(--ehr-focus-ring);
}

.approval-detail__actions {
  position: fixed;
  z-index: 30;
  bottom: 0;
  left: 50%;
  display: grid;
  width: 100%;
  max-width: 430px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  transform: translateX(-50%);
  border-top: 1px solid rgba(214, 226, 223, 0.86);
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 -14px 32px rgba(18, 35, 41, 0.12);
  backdrop-filter: blur(18px);
  padding: 10px var(--ehr-space-4) calc(var(--ehr-safe-bottom) + 10px);
}

.approval-detail__actions-spacer {
  height: calc(var(--ehr-safe-bottom) + 164px);
}

.approval-detail__actions button {
  min-width: 0;
  min-height: 44px;
  gap: 5px;
  padding: 0 6px;
  font-size: 13px;
  touch-action: manipulation;
}

.approval-detail__actions button:disabled {
  opacity: 0.72;
  cursor: not-allowed;
}

.approval-detail__actions button:focus-visible {
  outline: none;
  box-shadow: var(--ehr-focus-ring);
}

.approval-detail__action-icon,
.approval-detail__svg {
  display: block;
  flex-shrink: 0;
}

.approval-detail__action-icon--loading {
  animation: approval-detail-spin 0.9s linear infinite;
}

@keyframes approval-detail-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .approval-detail__action-icon--loading {
    animation: none;
  }
}

@media (max-width: 360px) {
  .approval-detail__hero {
    grid-template-columns: 1fr;
  }

  .approval-detail__hero .demo-tag {
    justify-self: flex-start;
  }

  .approval-detail__hero-meta {
    grid-template-columns: 1fr;
  }

  .approval-detail__attachment {
    grid-template-columns: 40px minmax(0, 1fr) auto;
  }

  .approval-detail__attachment-icon {
    width: 40px;
    height: 40px;
  }

  .approval-detail__attachment-action {
    display: none;
  }

  .approval-detail__actions-spacer {
    height: calc(var(--ehr-safe-bottom) + 224px);
  }

  .approval-detail__actions {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
