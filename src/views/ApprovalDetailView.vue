<template>
  <DemoShell title="审批详情" subtitle="业务表单与流程记录" show-back :with-tabbar="false">
    <section class="approval-detail__hero demo-card">
      <div>
        <p>当前节点：{{ detailState.node }}</p>
        <h1>{{ detailState.title }}</h1>
        <span>申请人：{{ detailState.applicant }}</span>
      </div>
      <span class="demo-tag" :class="statusClass">{{ detailState.status }}</span>
    </section>

    <DemoBlocks title="申请信息" desc="审批详情中的业务表单摘要。">
      <DemoFieldList :fields="detailState.fields" />
    </DemoBlocks>

    <DemoBlocks title="附件材料" desc="展示业务附件和预览入口。">
      <div class="approval-detail__attachments">
        <button
          v-for="file in detailState.attachments"
          :key="file.name"
          type="button"
          @click="showToast(`预览附件：${file.name}`)"
        >
          <span>
            <strong>{{ file.name }}</strong>
            <small>{{ file.size }}</small>
          </span>
          <span class="demo-tag demo-tag--success">{{ file.status }}</span>
        </button>
      </div>
    </DemoBlocks>

    <DemoBlocks title="审批流程" desc="按移动端时间线展示审批轨迹。">
      <DemoTimeline :items="detailState.timeline" />
    </DemoBlocks>

    <DemoBlocks title="审批意见" desc="驳回类动作会校验意见。">
      <textarea v-model="reason" class="approval-detail__reason" placeholder="请输入审批意见" />
      <div class="approval-detail__quick">
        <button v-for="item in opinions" :key="item" type="button" @click="reason = item">{{ item }}</button>
      </div>
    </DemoBlocks>

    <div class="approval-detail__actions-spacer" aria-hidden="true" />

    <div class="approval-detail__actions">
      <button class="demo-secondary-button" type="button" :disabled="isProcessing" @click="handleAction('transfer')">
        {{ actionLabel('transfer', '转办') }}
      </button>
      <button class="demo-secondary-button" type="button" :disabled="isProcessing" @click="handleAction('add-sign')">
        {{ actionLabel('add-sign', '加签') }}
      </button>
      <button class="demo-secondary-button" type="button" :disabled="isProcessing" @click="reject">
        {{ actionLabel('reject', '驳回') }}
      </button>
      <button class="demo-primary-button" type="button" :disabled="isProcessing" @click="handleAction('approve')">
        {{ actionLabel('approve', '同意') }}
      </button>
    </div>

    <DemoToast :message="toastMessage" />
  </DemoShell>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import DemoBlocks from '@/components/DemoBlocks.vue';
import DemoFieldList from '@/components/DemoFieldList.vue';
import DemoShell from '@/components/DemoShell.vue';
import DemoTimeline from '@/components/DemoTimeline.vue';
import DemoToast from '@/components/DemoToast.vue';
import type { DemoTimelineItem, DemoTone } from '@/data/types';
import { approvalDetail, approvals } from '@/data/mock';

type ApprovalDetailState = Omit<typeof approvalDetail, 'timeline'> & {
  timeline: DemoTimelineItem[];
};

const reason = ref('同意，情况属实。');
const toastMessage = ref('');
const isProcessing = ref(false);
const processingAction = ref<'transfer' | 'add-sign' | 'reject' | 'approve' | ''>('');
const route = useRoute();
let timer: number | undefined;
const opinions = ['同意，情况属实。', '请补充证明材料后重新提交。', '已确认，可进入下一节点。'];

const processInstanceId = computed(() => {
  const value = route.params.processInstanceId;
  return typeof value === 'string' ? value : 'demo';
});

const approvalStorageKey = computed(() => {
  return `open-ehr-mobile:approval-detail-state:${processInstanceId.value}`;
});

const approvalSummary = computed(() => {
  return Object.values(approvals)
    .flat()
    .find((item) => item.id === processInstanceId.value);
});

const createInitialDetailState = (): ApprovalDetailState => {
  const base = structuredClone(approvalDetail);
  const summary = approvalSummary.value;
  if (!summary) {
    return base;
  }

  const applicant = summary.meta.split('|')[0]?.trim() || base.applicant;
  return {
    ...base,
    title: summary.title,
    applicant,
    status: summary.status,
  };
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
    : detailState.value.status === '已驳回'
      ? 'demo-tag--error'
      : detailState.value.status === '审批中转办'
        ? 'demo-tag--warning'
        : detailState.value.status === '审批中加签'
          ? 'demo-tag--primary'
          : 'demo-tag--warning';
});

const showToast = (message: string) => {
  toastMessage.value = message;
  window.clearTimeout(timer);
  timer = window.setTimeout(() => {
    toastMessage.value = '';
  }, 2200);
};

const actionLabel = (key: 'transfer' | 'add-sign' | 'reject' | 'approve', fallback: string) => {
  return isProcessing.value && processingAction.value === key ? '处理中...' : fallback;
};

const updateTimeline = (
  currentTitle: string,
  currentDesc: string,
  currentStatus: string,
  currentTone: DemoTone,
) => {
  detailState.value.timeline = detailState.value.timeline.map((item, index) => {
    if (index === 0) {
      return { ...item, status: '已完成', tone: 'success' } satisfies DemoTimelineItem;
    }
    if (index === 1) {
      return {
        ...item,
        title: currentTitle,
        desc: currentDesc,
        status: currentStatus,
        tone: currentTone,
        time: '刚刚更新',
      } satisfies DemoTimelineItem;
    }
    return item;
  });
};

const finishAction = (message: string) => {
  isProcessing.value = false;
  processingAction.value = '';
  persistDetailState();
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
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--demo-space-3);
  padding: var(--demo-space-5) var(--demo-space-4);
  background: linear-gradient(180deg, rgba(236, 244, 255, 0.9), #fff);
  box-shadow: 0 14px 30px rgba(107, 140, 174, 0.1);
}

.approval-detail__hero p,
.approval-detail__hero span {
  margin: 0;
  color: var(--demo-color-text-secondary);
  font-size: 12px;
}

.approval-detail__hero h1 {
  margin: 4px 0;
  font-size: 20px;
}

.approval-detail__hero .demo-tag {
  flex: 0 0 auto;
}

.approval-detail__attachments {
  display: grid;
  gap: var(--demo-space-3);
}

.approval-detail__attachments button {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: var(--demo-space-3);
  border: 0;
  border-radius: var(--demo-radius-md);
  background: var(--demo-color-surface-muted);
  padding: 14px var(--demo-space-3);
  text-align: left;
  cursor: pointer;
}

.approval-detail__attachments button:active {
  background: var(--demo-color-primary-soft);
}

.approval-detail__attachments button:focus-visible {
  outline: 2px solid var(--demo-color-primary);
  outline-offset: 2px;
}

.approval-detail__attachments strong,
.approval-detail__attachments small {
  display: block;
}

.approval-detail__attachments small {
  color: var(--demo-color-text-tertiary);
}

.approval-detail__reason {
  width: 100%;
  border: 1px solid transparent;
  border-radius: var(--demo-radius-md);
  background: var(--demo-color-surface-inset);
  padding: 12px;
  min-height: 88px;
  resize: vertical;
}

.approval-detail__quick {
  display: flex;
  flex-wrap: wrap;
  gap: var(--demo-space-2);
  margin-top: var(--demo-space-3);
}

.approval-detail__quick button {
  border-radius: var(--demo-radius-full);
  color: var(--demo-color-primary-dark);
  background: var(--demo-color-primary-soft);
  padding: 8px 10px;
  font-size: 12px;
  cursor: pointer;
}

.approval-detail__quick button:focus-visible {
  outline: 2px solid var(--demo-color-primary);
  outline-offset: 2px;
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
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 -10px 22px rgba(107, 140, 174, 0.12);
  padding: 10px var(--demo-space-4) calc(var(--demo-safe-bottom) + 10px);
}

.approval-detail__actions-spacer {
  height: calc(var(--demo-safe-bottom) + 164px);
}

.approval-detail__actions button {
  min-width: 0;
  min-height: 44px;
  padding: 0 6px;
  font-size: 13px;
}

.approval-detail__actions button:disabled {
  opacity: 0.72;
}

@media (max-width: 360px) {
  .approval-detail__actions-spacer {
    height: calc(var(--demo-safe-bottom) + 224px);
  }

  .approval-detail__actions {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
