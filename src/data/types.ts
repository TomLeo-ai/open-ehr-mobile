export type DemoTone = 'primary' | 'success' | 'warning' | 'error' | 'neutral';

export interface DemoField {
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

export interface DemoSection {
  title: string;
  desc?: string;
  badge?: string;
  fields: DemoField[];
}

export interface DemoAttachment {
  name: string;
  size: string;
  status: string;
  desc?: string;
}

export interface DemoModeLink {
  label: string;
  path: string;
  mode: 'add' | 'detail' | 'reissue';
}

export interface DemoApplicationForm {
  title: string;
  summary: string;
  status: string;
  tone: DemoTone;
  source: string;
  processNo: string;
  currentNode: string;
  applicant: string;
  modeLinks: DemoModeLink[];
  sections: DemoSection[];
  attachments: DemoAttachment[];
}

export interface DemoTimelineItem {
  title: string;
  desc: string;
  time: string;
  status?: string;
  tone?: DemoTone;
}

export interface DemoListItem {
  id: string;
  title: string;
  desc: string;
  meta: string;
  status: string;
  tone: DemoTone;
}

export interface DemoChecklistItem {
  title: string;
  path: string;
  module: string;
  focus: string;
  status: string;
  tone: DemoTone;
  screenshot: string;
}
