export type Tone = 'primary' | 'success' | 'warning' | 'error' | 'neutral';

export interface FieldDefinition {
  label: string;
  value: string;
  key?: string;
  required?: boolean;
  readonly?: boolean;
  type?: 'text' | 'select' | 'date' | 'textarea' | 'number' | 'attachment';
  options?: string[];
  helper?: string;
  source?: string;
  visibleWhen?: string;
}

export interface FormSection {
  title: string;
  desc?: string;
  badge?: string;
  fields: FieldDefinition[];
}

export interface AttachmentItem {
  name: string;
  size: string;
  status: string;
  desc?: string;
}

export interface FormModeLink {
  label: string;
  path: string;
  mode: 'add' | 'detail' | 'reissue';
}

export interface ApplicationForm {
  title: string;
  summary: string;
  status: string;
  tone: Tone;
  source: string;
  processNo: string;
  currentNode: string;
  applicant: string;
  modeLinks: FormModeLink[];
  sections: FormSection[];
  attachments: AttachmentItem[];
}

export interface TimelineItem {
  title: string;
  desc: string;
  time: string;
  status?: string;
  tone?: Tone;
}

export interface ApprovalDetailState {
  title: string;
  status: string;
  applicant: string;
  node: string;
  fields: FieldDefinition[];
  attachments: AttachmentItem[];
  timeline: TimelineItem[];
}

export interface ApprovalListItem {
  id: string;
  title: string;
  desc: string;
  meta: string;
  status: string;
  tone: Tone;
}

export interface ChecklistItem {
  title: string;
  path: string;
  module: string;
  focus: string;
  status: string;
  tone: Tone;
  screenshot: string;
}
