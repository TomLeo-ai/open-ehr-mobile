import type { ApprovalListItem, Tone } from '@/data/types';

type ApprovalListStateRecord = {
  status: string;
  tone: Tone;
  node?: string;
  updatedAt: string;
};

type ApprovalListState = Record<string, ApprovalListStateRecord>;

const approvalListStateKey = 'open-ehr-mobile:approval-list-state';

const canUseLocalStorage = () => typeof window !== 'undefined' && Boolean(window.localStorage);

const readApprovalListState = (): ApprovalListState => {
  if (!canUseLocalStorage()) {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(approvalListStateKey);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as ApprovalListState;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

export const getApprovalToneByStatus = (status: string): Tone => {
  if (['已同意', '已通过', '已处理'].includes(status)) {
    return 'success';
  }

  if (status.includes('驳回')) {
    return 'error';
  }

  if (status.includes('草稿') || status.includes('继续编辑')) {
    return 'neutral';
  }

  if (status.includes('转办') || status.includes('加签') || status.includes('审批中')) {
    return 'primary';
  }

  return 'warning';
};

export const persistApprovalListState = (
  id: string,
  state: Pick<ApprovalListStateRecord, 'status' | 'tone' | 'node'>,
) => {
  if (!canUseLocalStorage()) {
    return;
  }

  const current = readApprovalListState();
  window.localStorage.setItem(
    approvalListStateKey,
    JSON.stringify({
      ...current,
      [id]: {
        ...state,
        updatedAt: new Date().toISOString(),
      },
    }),
  );
};

export const mergeApprovalListState = (item: ApprovalListItem): ApprovalListItem => {
  const stored = readApprovalListState()[item.id];
  if (!stored) {
    return item;
  }

  return {
    ...item,
    status: stored.status,
    tone: stored.tone,
  };
};
