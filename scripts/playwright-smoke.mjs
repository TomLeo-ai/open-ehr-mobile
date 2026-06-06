import { chromium } from 'playwright';
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const baseUrl = process.env.DEMO_BASE_URL || 'http://127.0.0.1:5180';
const outputDir = new URL('../output/playwright/', import.meta.url);
const outputPath = fileURLToPath(outputDir);
const windowsChromeCandidates = [
  process.env.PROGRAMFILES,
  process.env['PROGRAMFILES(X86)'],
  process.env.LOCALAPPDATA,
]
  .filter(Boolean)
  .map((basePath) => `${basePath}\\Google\\Chrome\\Application\\chrome.exe`);
const chromeExecutablePath = process.env.PLAYWRIGHT_CHROME_PATH
  || windowsChromeCandidates.find((candidate) => existsSync(candidate));

const logProgress = (phase, name) => {
  console.error(`[smoke] ${phase}: ${name}`);
};

const routes = [
  { path: '/home', name: 'home-workbench' },
  { path: '/demo-checklist', name: 'demo-checklist' },
  { path: '/apply', name: 'apply-center' },
  { path: '/apply/on-job', name: 'apply-on-job-add' },
  { path: '/apply/on-job/detail/CERT-20260601-001', name: 'apply-on-job-detail' },
  { path: '/apply/on-job/reissue/CERT-20260601-001', name: 'apply-on-job-reissue' },
  { path: '/apply/recommend-reward', name: 'apply-recommend-add' },
  { path: '/apply/recommend-reward/detail/REF-20260601-001', name: 'apply-recommend-detail' },
  { path: '/apply/recommend-reward/reissue/REF-20260601-001', name: 'apply-recommend-reissue' },
  { path: '/apply/settle', name: 'apply-settle-add' },
  { path: '/apply/settle/detail/RESIDE-20260601-001', name: 'apply-settle-detail' },
  { path: '/apply/settle/reissue/RESIDE-20260601-001', name: 'apply-settle-reissue' },
  { path: '/apply/attendance-exception', name: 'apply-attendance-add' },
  { path: '/apply/resignation', name: 'resignation-add' },
  { path: '/apply/resignation/detail/OFFBOARD-20260601-001', name: 'resignation-detail' },
  { path: '/apply/resignation/reissue/OFFBOARD-20260601-001', name: 'resignation-reissue' },
  { path: '/apply/attendance-exception/detail/ATT-20260601-001', name: 'attendance-detail' },
  { path: '/apply/attendance-exception/reissue/ATT-20260601-001', name: 'attendance-reissue' },
  { path: '/approval/todo', name: 'approval-todo' },
  { path: '/approval/done', name: 'approval-done' },
  { path: '/approval/my-process', name: 'approval-my-process' },
  { path: '/approval/draft', name: 'approval-draft' },
  { path: '/approval/detail/todo-001', name: 'approval-detail' },
  { path: '/self-service', name: 'self-service' },
  { path: '/self-service/profile', name: 'profile-main' },
  { path: '/self-service/profile/career', name: 'profile-career' },
  { path: '/self-service/profile/family', name: 'profile-family' },
  { path: '/self-service/profile/qualification', name: 'profile-qualification' },
  { path: '/self-service/profile/finance', name: 'profile-finance' },
  { path: '/self-service/salary', name: 'salary' },
  { path: '/self-service/attendance', name: 'attendance-query' },
  { path: '/self-service/vacation', name: 'vacation' },
  { path: '/self-service/cancellation', name: 'cancellation' },
  { path: '/self-service/summary-result', name: 'summary-result' },
  { path: '/self-service/contact-book', name: 'contact-book' },
];

const clickFlows = [
  {
    name: 'apply-to-on-job-detail',
    start: '/apply',
    selector: 'a[href="/apply/on-job/detail/CERT-20260601-001"]',
    expectedPath: '/apply/on-job/detail/CERT-20260601-001',
  },
  {
    name: 'apply-to-on-job-add',
    start: '/apply',
    selector: 'a[href="/apply/on-job"]',
    expectedPath: '/apply/on-job',
  },
  {
    name: 'apply-to-on-job-reissue',
    start: '/apply',
    selector: 'a[href="/apply/on-job/reissue/CERT-20260601-001"]',
    expectedPath: '/apply/on-job/reissue/CERT-20260601-001',
  },
  {
    name: 'apply-to-recommend-add',
    start: '/apply',
    selector: 'a[href="/apply/recommend-reward"]',
    expectedPath: '/apply/recommend-reward',
  },
  {
    name: 'apply-to-recommend-detail',
    start: '/apply',
    selector: 'a[href="/apply/recommend-reward/detail/REF-20260601-001"]',
    expectedPath: '/apply/recommend-reward/detail/REF-20260601-001',
  },
  {
    name: 'apply-to-recommend-reissue',
    start: '/apply',
    selector: 'a[href="/apply/recommend-reward/reissue/REF-20260601-001"]',
    expectedPath: '/apply/recommend-reward/reissue/REF-20260601-001',
  },
  {
    name: 'apply-to-settle-add',
    start: '/apply',
    selector: 'a[href="/apply/settle"]',
    expectedPath: '/apply/settle',
  },
  {
    name: 'apply-to-settle-detail',
    start: '/apply',
    selector: 'a[href="/apply/settle/detail/RESIDE-20260601-001"]',
    expectedPath: '/apply/settle/detail/RESIDE-20260601-001',
  },
  {
    name: 'apply-to-settle-reissue',
    start: '/apply',
    selector: 'a[href="/apply/settle/reissue/RESIDE-20260601-001"]',
    expectedPath: '/apply/settle/reissue/RESIDE-20260601-001',
  },
  {
    name: 'apply-to-attendance-add',
    start: '/apply',
    selector: 'a[href="/apply/attendance-exception"]',
    expectedPath: '/apply/attendance-exception',
  },
  {
    name: 'apply-to-attendance-detail',
    start: '/apply',
    selector: 'a[href="/apply/attendance-exception/detail/ATT-20260601-001"]',
    expectedPath: '/apply/attendance-exception/detail/ATT-20260601-001',
  },
  {
    name: 'apply-to-resignation-add',
    start: '/apply',
    selector: 'a[href="/apply/resignation"]',
    expectedPath: '/apply/resignation',
  },
  {
    name: 'apply-to-resignation-detail',
    start: '/apply',
    selector: 'a[href="/apply/resignation/detail/OFFBOARD-20260601-001"]',
    expectedPath: '/apply/resignation/detail/OFFBOARD-20260601-001',
  },
  {
    name: 'approval-list-to-detail',
    start: '/approval/todo',
    selector: '.approval-view__list .demo-list-card',
    expectedPath: '/approval/detail/todo-001',
  },
  {
    name: 'home-to-demo-checklist',
    start: '/home',
    selector: 'a[href="/demo-checklist"]',
    expectedPath: '/demo-checklist',
  },
  {
    name: 'home-stat-to-approval-todo',
    start: '/home',
    selector: '.home-view__stats .home-view__stat',
    index: 0,
    expectedPath: '/approval/todo',
  },
  {
    name: 'home-stat-to-my-process',
    start: '/home',
    selector: '.home-view__stats .home-view__stat',
    index: 1,
    expectedPath: '/approval/my-process',
  },
  {
    name: 'home-stat-to-draft',
    start: '/home',
    selector: '.home-view__stats .home-view__stat',
    index: 2,
    expectedPath: '/approval/draft',
  },
  {
    name: 'home-quick-apply-on-job',
    start: '/home',
    selector: '.home-view__grid .home-view__entry',
    index: 0,
    expectedPath: '/apply/on-job',
  },
  {
    name: 'home-quick-apply-attendance',
    start: '/home',
    selector: '.home-view__grid .home-view__entry',
    index: 1,
    expectedPath: '/apply/attendance-exception',
  },
  {
    name: 'home-quick-apply-resignation',
    start: '/home',
    selector: '.home-view__grid .home-view__entry',
    index: 2,
    expectedPath: '/apply/resignation',
  },
  {
    name: 'home-quick-query-profile',
    start: '/home',
    selector: '.home-view__query-list .home-view__query',
    index: 0,
    expectedPath: '/self-service/profile',
  },
  {
    name: 'self-service-to-salary',
    start: '/self-service',
    selector: 'a[href="/self-service/salary"]',
    expectedPath: '/self-service/salary',
  },
  {
    name: 'home-quick-query-salary',
    start: '/home',
    selector: '.home-view__query-list .home-view__query',
    index: 1,
    expectedPath: '/self-service/salary',
  },
  {
    name: 'home-quick-query-vacation',
    start: '/home',
    selector: '.home-view__query-list .home-view__query',
    index: 2,
    expectedPath: '/self-service/vacation',
  },
  {
    name: 'home-quick-query-contact-book',
    start: '/home',
    selector: '.home-view__query-list .home-view__query',
    index: 3,
    expectedPath: '/self-service/contact-book',
  },
  {
    name: 'checklist-to-resignation-detail',
    start: '/demo-checklist',
    selector: 'a[href="/apply/resignation/detail/OFFBOARD-20260601-001"]',
    expectedPath: '/apply/resignation/detail/OFFBOARD-20260601-001',
  },
  {
    name: 'apply-to-attendance-reissue',
    start: '/apply',
    selector: 'a[href="/apply/attendance-exception/reissue/ATT-20260601-001"]',
    expectedPath: '/apply/attendance-exception/reissue/ATT-20260601-001',
  },
  {
    name: 'apply-to-resignation-reissue',
    start: '/apply',
    selector: 'a[href="/apply/resignation/reissue/OFFBOARD-20260601-001"]',
    expectedPath: '/apply/resignation/reissue/OFFBOARD-20260601-001',
  },
  {
    name: 'bottom-nav-home-to-apply',
    start: '/home',
    selector: '.demo-shell__tab[href="/apply"]',
    expectedPath: '/apply',
  },
  {
    name: 'bottom-nav-apply-to-approval',
    start: '/apply',
    selector: '.demo-shell__tab[href="/approval"]',
    expectedPath: '/approval/todo',
  },
  {
    name: 'bottom-nav-approval-to-self-service',
    start: '/approval/todo',
    selector: '.demo-shell__tab[href="/self-service"]',
    expectedPath: '/self-service',
  },
  {
    name: 'approval-tab-to-done',
    start: '/approval/todo',
    selector: 'a[href="/approval/done"]',
    expectedPath: '/approval/done',
  },
  {
    name: 'approval-tab-to-my-process',
    start: '/approval/todo',
    selector: 'a[href="/approval/my-process"]',
    expectedPath: '/approval/my-process',
  },
  {
    name: 'approval-tab-to-draft',
    start: '/approval/todo',
    selector: 'a[href="/approval/draft"]',
    expectedPath: '/approval/draft',
  },
  {
    name: 'approval-done-card-to-detail',
    start: '/approval/done',
    selector: '.approval-view__list .demo-list-card',
    expectedPath: '/approval/detail/done-001',
  },
  {
    name: 'approval-my-process-card-to-detail',
    start: '/approval/my-process',
    selector: '.approval-view__list .demo-list-card',
    expectedPath: '/approval/detail/process-001',
  },
  {
    name: 'approval-draft-card-to-detail',
    start: '/approval/draft',
    selector: '.approval-view__list .demo-list-card',
    expectedPath: '/approval/detail/draft-001',
  },
  {
    name: 'form-mode-add-to-detail',
    start: '/apply/on-job',
    selector: 'a[href="/apply/on-job/detail/CERT-20260601-001"]',
    expectedPath: '/apply/on-job/detail/CERT-20260601-001',
  },
  {
    name: 'form-mode-detail-to-reissue',
    start: '/apply/on-job/detail/CERT-20260601-001',
    selector: 'a[href="/apply/on-job/reissue/CERT-20260601-001"]',
    expectedPath: '/apply/on-job/reissue/CERT-20260601-001',
  },
  {
    name: 'form-mode-reissue-to-add',
    start: '/apply/on-job/reissue/CERT-20260601-001',
    selector: 'a[href="/apply/on-job"]',
    expectedPath: '/apply/on-job',
  },
  {
    name: 'recommend-mode-add-to-detail',
    start: '/apply/recommend-reward',
    selector: 'a[href="/apply/recommend-reward/detail/REF-20260601-001"]',
    expectedPath: '/apply/recommend-reward/detail/REF-20260601-001',
  },
  {
    name: 'recommend-mode-detail-to-reissue',
    start: '/apply/recommend-reward/detail/REF-20260601-001',
    selector: 'a[href="/apply/recommend-reward/reissue/REF-20260601-001"]',
    expectedPath: '/apply/recommend-reward/reissue/REF-20260601-001',
  },
  {
    name: 'recommend-mode-reissue-to-add',
    start: '/apply/recommend-reward/reissue/REF-20260601-001',
    selector: 'a[href="/apply/recommend-reward"]',
    expectedPath: '/apply/recommend-reward',
  },
  {
    name: 'settle-mode-add-to-detail',
    start: '/apply/settle',
    selector: 'a[href="/apply/settle/detail/RESIDE-20260601-001"]',
    expectedPath: '/apply/settle/detail/RESIDE-20260601-001',
  },
  {
    name: 'settle-mode-detail-to-reissue',
    start: '/apply/settle/detail/RESIDE-20260601-001',
    selector: 'a[href="/apply/settle/reissue/RESIDE-20260601-001"]',
    expectedPath: '/apply/settle/reissue/RESIDE-20260601-001',
  },
  {
    name: 'settle-mode-reissue-to-add',
    start: '/apply/settle/reissue/RESIDE-20260601-001',
    selector: 'a[href="/apply/settle"]',
    expectedPath: '/apply/settle',
  },
  {
    name: 'attendance-mode-add-to-detail',
    start: '/apply/attendance-exception',
    selector: 'a[href="/apply/attendance-exception/detail/ATT-20260601-001"]',
    expectedPath: '/apply/attendance-exception/detail/ATT-20260601-001',
  },
  {
    name: 'attendance-mode-detail-to-reissue',
    start: '/apply/attendance-exception/detail/ATT-20260601-001',
    selector: 'a[href="/apply/attendance-exception/reissue/ATT-20260601-001"]',
    expectedPath: '/apply/attendance-exception/reissue/ATT-20260601-001',
  },
  {
    name: 'attendance-mode-reissue-to-add',
    start: '/apply/attendance-exception/reissue/ATT-20260601-001',
    selector: 'a[href="/apply/attendance-exception"]',
    expectedPath: '/apply/attendance-exception',
  },
  {
    name: 'resignation-mode-add-to-detail',
    start: '/apply/resignation',
    selector: 'a[href="/apply/resignation/detail/OFFBOARD-20260601-001"]',
    expectedPath: '/apply/resignation/detail/OFFBOARD-20260601-001',
  },
  {
    name: 'resignation-mode-detail-to-reissue',
    start: '/apply/resignation/detail/OFFBOARD-20260601-001',
    selector: 'a[href="/apply/resignation/reissue/OFFBOARD-20260601-001"]',
    expectedPath: '/apply/resignation/reissue/OFFBOARD-20260601-001',
  },
  {
    name: 'resignation-mode-reissue-to-add',
    start: '/apply/resignation/reissue/OFFBOARD-20260601-001',
    selector: 'a[href="/apply/resignation"]',
    expectedPath: '/apply/resignation',
  },
];

const interactions = [
  {
    name: 'salary-month-switch-and-download-toast',
    path: '/self-service/salary',
    run: async (page) => {
      await page.getByRole('button', { name: '2026-04' }).click();
      await page.getByRole('button', { name: '下载电子薪资单' }).click();
      await page.getByText('薪资单下载任务已创建').waitFor({ timeout: 3000 });
    },
  },
  {
    name: 'salary-detail-dialog-and-confirm-toast',
    path: '/self-service/salary',
    run: async (page) => {
      await page.getByRole('button', { name: '查看基本工资明细' }).click();
      await page.getByRole('dialog').waitFor({ timeout: 3000 });
      await page.getByRole('button', { name: '我知道了' }).click();
      await page.getByText('已查看基本工资说明').waitFor({ timeout: 3000 });
    },
  },
  {
    name: 'approval-reject-validation-toast',
    path: '/approval/detail/todo-001',
    run: async (page) => {
      await page.getByPlaceholder('请输入审批意见').fill('');
      await page.getByRole('button', { name: '驳回' }).click();
      await page.getByText('审批建议不能为空').waitFor({ timeout: 3000 });
    },
  },
  {
    name: 'approval-agree-toast',
    path: '/approval/detail/todo-001',
    run: async (page) => {
      await page.getByRole('button', { name: '同意', exact: true }).click();
      await page.getByText('审批已同意').waitFor({ timeout: 3000 });
      await page.locator('.approval-detail__hero .demo-tag').getByText('已同意', { exact: true }).waitFor({ timeout: 3000 });
      await page.locator('.approval-detail__hero').getByText('当前节点：流程已完成', { exact: true }).waitFor({ timeout: 3000 });
    },
  },
  {
    name: 'cancellation-dialog-and-withdraw-toast',
    path: '/self-service/cancellation',
    run: async (page) => {
      await page.locator('.cancellation-view__item').first().click();
      await page.getByRole('dialog').waitFor({ timeout: 3000 });
      await page.getByRole('dialog').getByRole('button', { name: '发起撤回', exact: true }).click();
      await page.getByText('撤回申请已提交').waitFor({ timeout: 3000 });
    },
  },
  {
    name: 'contact-search-and-dialog',
    path: '/self-service/contact-book',
    run: async (page) => {
      await page.getByPlaceholder('输入姓名、职责或邮箱').fill('薪资');
      await page.locator('.contact-book__item').first().click();
      await page.getByRole('dialog').waitFor({ timeout: 3000 });
      await page.getByRole('button', { name: '关闭' }).click();
      await page.getByRole('dialog').waitFor({ state: 'detached', timeout: 3000 });
    },
  },
  {
    name: 'attendance-filter-and-dialog',
    path: '/self-service/attendance',
    run: async (page) => {
      await page.locator('.attendance-view__filter').filter({ hasText: '异常' }).click();
      await page.locator('.attendance-view__item').first().click();
      await page.getByRole('dialog').waitFor({ timeout: 3000 });
      await page.getByRole('button', { name: '发起异常申请' }).click();
      await page.getByText('已进入考勤异常申请').waitFor({ timeout: 3000 });
    },
  },
  {
    name: 'vacation-tab-and-refresh-toast',
    path: '/self-service/vacation',
    run: async (page) => {
      await page.getByRole('button', { name: '调休' }).click();
      await page.getByRole('button', { name: '刷新余额' }).click();
      await page.getByText('假期余额已刷新').waitFor({ timeout: 3000 });
    },
  },
  {
    name: 'summary-switch-and-confirm-toast',
    path: '/self-service/summary-result',
    run: async (page) => {
      await page.getByRole('button', { name: '2025' }).click();
      await page.getByRole('button', { name: '确认结果' }).click();
      await page.getByText('年度结果已确认').waitFor({ timeout: 3000 });
    },
  },
  {
    name: 'form-save-draft-toast',
    path: '/apply/on-job',
    run: async (page) => {
      await page.getByRole('button', { name: '保存草稿' }).click();
      await page.getByText('草稿已保存').waitFor({ timeout: 3000 });
    },
  },
  {
    name: 'form-submit-toast',
    path: '/apply/resignation',
    run: async (page) => {
      await page.getByRole('button', { name: '提交申请' }).click();
      await page.getByText('申请已提交，流程状态已更新').waitFor({ timeout: 3000 });
    },
  },
  {
    name: 'form-detail-preview-toast',
    path: '/apply/settle/detail/RESIDE-20260601-001',
    run: async (page) => {
      await page.getByRole('button', { name: '预览材料' }).click();
      await page.getByText('已打开材料与流程轨迹预览').waitFor({ timeout: 3000 });
    },
  },
  {
    name: 'form-attachment-preview-toast',
    path: '/apply/on-job/detail/CERT-20260601-001',
    run: async (page) => {
      await page.locator('.demo-form-page__attachment').first().click();
      await page.getByText(/预览附件/).waitFor({ timeout: 3000 });
    },
  },
  {
    name: 'approval-transfer-and-add-sign-toast',
    path: '/approval/detail/todo-001',
    run: async (page) => {
      await page.getByRole('button', { name: '转办' }).click();
      await page.getByText('转办人员选择已打开').waitFor({ timeout: 3000 });
      await page.getByText('审批中转办').waitFor({ timeout: 3000 });
      await page.getByText('转办人员待处理').waitFor({ timeout: 3000 });
      await page.getByRole('button', { name: '加签' }).click();
      await page.getByText('加签人员选择已打开').waitFor({ timeout: 3000 });
      await page.getByText('审批中加签').waitFor({ timeout: 3000 });
      await page.getByText('加签人员处理中').waitFor({ timeout: 3000 });
    },
  },
  {
    name: 'approval-reject-with-opinion-toast',
    path: '/approval/detail/todo-001',
    run: async (page) => {
      await page.getByPlaceholder('请输入审批意见').fill('请补充证明材料后重新提交。');
      await page.getByRole('button', { name: '驳回' }).click();
      await page.getByText('审批已驳回，列表状态已更新').waitFor({ timeout: 3000 });
      await page.locator('.approval-detail__hero .demo-tag').getByText('已驳回', { exact: true }).waitFor({ timeout: 3000 });
      await page.locator('.approval-detail__hero').getByText('当前节点：申请人重新提交', { exact: true }).waitFor({ timeout: 3000 });
    },
  },
  {
    name: 'home-notice-toast',
    path: '/home',
    run: async (page) => {
      await page.locator('.home-view__notice').first().click();
      await page.getByText('公告详情：').waitFor({ timeout: 3000 });
    },
  },
  {
    name: 'contact-empty-state',
    path: '/self-service/contact-book',
    run: async (page) => {
      await page.getByPlaceholder('输入姓名、职责或邮箱').fill('不存在的联系人');
      await page.getByText('未找到匹配联系人').waitFor({ timeout: 3000 });
    },
  },
  {
    name: 'contact-copy-toast',
    path: '/self-service/contact-book',
    run: async (page) => {
      await page.locator('.contact-book__item').first().click();
      await page.getByRole('dialog').waitFor({ timeout: 3000 });
      await page.getByRole('button', { name: '复制信息' }).click();
      await page.getByText('联系人信息已复制').waitFor({ timeout: 3000 });
    },
  },
  {
    name: 'profile-confirm-toast',
    path: '/self-service/profile',
    run: async (page) => {
      await page.getByRole('button', { name: '确认无误' }).click();
      await page.getByText('已提交档案核对确认').waitFor({ timeout: 3000 });
    },
  },
  {
    name: 'profile-tab-switch-and-change-toast',
    path: '/self-service/profile',
    run: async (page) => {
      await page.getByRole('link', { name: '家庭/紧急联系人' }).click();
      await page.waitForURL('**/self-service/profile/family', { timeout: 10000 });
      await page.locator('.profile-view__tab--active').getByText('家庭/紧急联系人').waitFor({ timeout: 3000 });
      await page.getByRole('button', { name: '申请变更' }).click();
      await page.getByText('已发起信息变更申请').waitFor({ timeout: 3000 });
    },
  },
  {
    name: 'back-from-apply-detail-to-apply-center',
    path: '/apply',
    run: async (page) => {
      await page.locator('a[href="/apply/settle/detail/RESIDE-20260601-001"]').click();
      await page.waitForURL('**/apply/settle/detail/RESIDE-20260601-001', { timeout: 10000 });
      await page.getByLabel('返回').click();
      await page.waitForURL('**/apply', { timeout: 10000 });
    },
  },
  {
    name: 'back-from-approval-detail-to-approval-list',
    path: '/approval/done',
    run: async (page) => {
      await page.locator('.approval-view__list .demo-list-card').first().click();
      await page.waitForURL('**/approval/detail/done-001', { timeout: 10000 });
      await page.getByLabel('返回').click();
      await page.waitForURL('**/approval/done', { timeout: 10000 });
    },
  },
  {
    name: 'approval-detail-attachment-preview-toast',
    path: '/approval/detail/todo-001',
    run: async (page) => {
      await page.locator('.approval-detail__attachments button').first().click();
      await page.getByText(/预览附件/).waitFor({ timeout: 3000 });
    },
  },
  {
    name: 'approval-detail-second-attachment-preview-toast',
    path: '/approval/detail/todo-001',
    run: async (page) => {
      await page.locator('.approval-detail__attachments button').nth(1).click();
      await page.getByText(/预览附件/).waitFor({ timeout: 3000 });
    },
  },
  {
    name: 'approval-quick-opinion-reject-toast',
    path: '/approval/detail/todo-001',
    run: async (page) => {
      await page.getByRole('button', { name: '请补充证明材料后重新提交。', exact: true }).click();
      await page.getByRole('button', { name: '驳回' }).click();
      await page.getByText('审批已驳回，列表状态已更新').waitFor({ timeout: 3000 });
    },
  },
  {
    name: 'approval-quick-opinion-fills-textarea',
    path: '/approval/detail/todo-001',
    run: async (page) => {
      await page.getByRole('button', { name: '已确认，可进入下一节点。', exact: true }).click();
      await page.getByPlaceholder('请输入审批意见').waitFor({ timeout: 3000 });
      const value = await page.getByPlaceholder('请输入审批意见').inputValue();
      if (!value.includes('已确认')) {
        throw new Error(`unexpected approval opinion value: ${value}`);
      }
    },
  },
  {
    name: 'approval-actions-visible-after-scroll',
    path: '/approval/detail/todo-001',
    run: async (page) => {
      await page.locator('.approval-detail__quick').scrollIntoViewIfNeeded();
      const visibility = await page.evaluate(() => {
        const actions = document.querySelector('.approval-detail__actions');
        if (!actions) {
          return { exists: false, buttons: 0, fullyVisible: false };
        }
        const rect = actions.getBoundingClientRect();
        const buttons = actions.querySelectorAll('button').length;
        const fullyVisible = rect.bottom <= window.innerHeight && rect.top >= 0;
        return { exists: true, buttons, fullyVisible };
      });
      if (!visibility.exists || visibility.buttons !== 4 || !visibility.fullyVisible) {
        throw new Error(`approval action bar visibility check failed: ${JSON.stringify(visibility)}`);
      }
      await page.getByRole('button', { name: '同意', exact: true }).click();
      await page.getByText('审批已同意，列表状态已更新').waitFor({ timeout: 3000 });
    },
  },
];

const isolatedInteractions = [
  {
    name: 'direct-open-apply-detail-back-to-home',
    path: '/apply/settle/detail/RESIDE-20260601-001',
    run: async (page) => {
      await page.getByLabel('返回').click();
      await page.waitForURL('**/home', { timeout: 10000 });
    },
  },
  {
    name: 'direct-open-approval-detail-back-to-home',
    path: '/approval/detail/todo-001',
    run: async (page) => {
      await page.getByLabel('返回').click();
      await page.waitForURL('**/home', { timeout: 10000 });
    },
  },
];

const browser = await chromium.launch({
  headless: true,
  ...(chromeExecutablePath ? { executablePath: chromeExecutablePath } : {}),
});

const page = await browser.newPage({
  viewport: { width: 390, height: 844 },
  isMobile: true,
});

const consoleErrors = [];

const attachDiagnostics = (targetPage) => {
  targetPage.on('console', (message) => {
    const text = message.text();
    if (
      message.type() === 'error'
      && !text.includes('favicon')
      && !text.includes('Failed to load resource')
    ) {
      consoleErrors.push(text);
    }
  });

  targetPage.on('pageerror', (error) => {
    consoleErrors.push(error.message);
  });

  targetPage.on('response', (response) => {
    const url = response.url();
    if (response.status() >= 400 && !url.includes('favicon')) {
      consoleErrors.push(`${response.status()} ${url}`);
    }
  });
};

const configurePage = (targetPage) => {
  targetPage.setDefaultTimeout(5000);
  targetPage.setDefaultNavigationTimeout(15000);
  attachDiagnostics(targetPage);
};

configurePage(page);

await mkdir(outputDir, { recursive: true });

const gotoFresh = async (targetPage, path) => {
  await targetPage.goto(`${baseUrl}${path}`, { waitUntil: 'networkidle' });
  await targetPage.evaluate(() => window.localStorage.clear());
  await targetPage.reload({ waitUntil: 'networkidle' });
};

const routeResults = [];
for (const route of routes) {
  logProgress('route', route.path);
  await gotoFresh(page, route.path);
  const result = await page.evaluate(() => {
    const text = document.body.innerText.trim();
    const fixedActions = document.querySelector('.demo-form-page__actions');
    const fields = [...document.querySelectorAll('.demo-form-page__field')];
    const lastField = fields.at(-1);
    let actionOverlap = false;

    if (fixedActions && lastField) {
      const actionRect = fixedActions.getBoundingClientRect();
      const fieldRect = lastField.getBoundingClientRect();
      actionOverlap = fieldRect.bottom > actionRect.top && fieldRect.top < actionRect.bottom;
    }

    return {
      textLength: text.length,
      sample: text.slice(0, 80),
      overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      actionOverlap,
    };
  });

  const screenshotPath = fileURLToPath(new URL(`${route.name}.png`, outputDir));
  await page.screenshot({
    path: screenshotPath,
    fullPage: true,
  });

  routeResults.push({
    route: route.path,
    screenshot: `${outputPath}${route.name}.png`,
    ...result,
  });
}

const clickResults = [];
for (const flow of clickFlows) {
  logProgress('click', flow.name);
  try {
    await gotoFresh(page, flow.start);
    const target = typeof flow.index === 'number'
      ? page.locator(flow.selector).nth(flow.index)
      : flow.text
        ? page.locator(flow.selector).filter({ hasText: flow.text }).first()
        : page.locator(flow.selector).first();
    await target.evaluate((node) => {
      node.scrollIntoView({ block: 'center', inline: 'nearest' });
    });
    await Promise.all([
      page.waitForURL(`**${flow.expectedPath}`, { timeout: 10000 }),
      target.click(),
    ]);
    const currentPath = new URL(page.url()).pathname;
    clickResults.push({
      name: flow.name,
      start: flow.start,
      expectedPath: flow.expectedPath,
      currentPath,
      passed: currentPath === flow.expectedPath,
    });
  } catch (error) {
    clickResults.push({
      name: flow.name,
      start: flow.start,
      expectedPath: flow.expectedPath,
      currentPath: new URL(page.url()).pathname,
      passed: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

const interactionResults = [];
for (const interaction of interactions) {
  logProgress('interaction', interaction.name);
  try {
    await gotoFresh(page, interaction.path);
    await interaction.run(page);
    interactionResults.push({
      name: interaction.name,
      path: interaction.path,
      passed: true,
    });
  } catch (error) {
    interactionResults.push({
      name: interaction.name,
      path: interaction.path,
      passed: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

for (const interaction of isolatedInteractions) {
  logProgress('isolated', interaction.name);
  const isolatedPage = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
  });
  configurePage(isolatedPage);

  try {
    await gotoFresh(isolatedPage, interaction.path);
    await interaction.run(isolatedPage);
    interactionResults.push({
      name: interaction.name,
      path: interaction.path,
      passed: true,
    });
  } catch (error) {
    interactionResults.push({
      name: interaction.name,
      path: interaction.path,
      passed: false,
      error: error instanceof Error ? error.message : String(error),
    });
  } finally {
    await isolatedPage.close();
  }
}

await browser.close();

const failedRoutes = routeResults.filter((item) => item.textLength === 0 || item.overflow || item.actionOverlap);
const failedClicks = clickResults.filter((item) => !item.passed);
const failedInteractions = interactionResults.filter((item) => !item.passed);

const report = {
  baseUrl,
  routeResults,
  clickResults,
  interactionResults,
  consoleErrors,
  summary: {
    routeCount: routeResults.length,
    clickFlowCount: clickResults.length,
    interactionCount: interactionResults.length,
    failedRouteCount: failedRoutes.length,
    failedClickCount: failedClicks.length,
    failedInteractionCount: failedInteractions.length,
    consoleErrorCount: consoleErrors.length,
  },
};

console.log(JSON.stringify(report, null, 2));

if (failedRoutes.length || failedClicks.length || failedInteractions.length || consoleErrors.length) {
  process.exitCode = 1;
}
