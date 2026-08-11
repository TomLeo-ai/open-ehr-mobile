import type {
  ApplicationForm,
  ApprovalDetailState,
  ApprovalListItem,
  AttachmentItem,
  ChecklistItem,
  FormSection,
  TimelineItem,
} from './types';

export const employeeProfile = {
  name: '陈晓宁',
  badge: 'EMP0001',
  department: '人力资源共享服务中心',
  position: '员工关系经理',
  company: '示例科技有限公司',
  status: '在职',
  tags: ['正式员工', '移动端服务'],
  phone: '138****0001',
  email: 'employee@example.com',
};

export const homeStats = [
  { label: '待办审批', value: '6', path: '/approval/todo' },
  { label: '我的流程', value: '4', path: '/approval/my-process' },
  { label: '我的草稿', value: '3', path: '/approval/draft' },
];

export const quickApplyItems = [
  { title: '在职/收入证明', desc: '开具在职证明、收入证明', path: '/apply/on-job', icon: '证' },
  { title: '考勤异常申请', desc: '补卡、漏打卡、异常说明', path: '/apply/attendance-exception', icon: '勤' },
  { title: '离职申请', desc: '离职发起、交接说明', path: '/apply/resignation', icon: '离' },
];

export const quickQueryItems = [
  { title: '个人信息', desc: '查看档案、任职、联系信息', path: '/self-service/profile', icon: '人' },
  { title: '薪资查询', desc: '月度薪资与补扣款明细', path: '/self-service/salary', icon: '薪' },
  { title: '休假结余', desc: '年假、调休、福利假余额', path: '/self-service/vacation', icon: '假' },
  { title: '后台联系人', desc: 'HR 电话与邮箱查询', path: '/self-service/contact-book', icon: '联' },
];

export const notices = [
  {
    title: '移动端员工自助服务试运行通知',
    desc: '本次移动端服务覆盖申请、审批、自助查询和首页工作台，便于确认员工使用体验。',
    date: '05-15',
  },
  {
    title: '五月薪资单开放查看提醒',
    desc: '薪资信息涉及个人隐私，请在安全网络环境下查看。',
    date: '05-10',
  },
  {
    title: '端午节假期与值班安排确认',
    desc: '涉及值班的同事请在本周内完成班次确认。',
    date: '05-08',
  },
];

export const businessGuideItems: ChecklistItem[] = [
  {
    title: '首页工作台',
    path: '/home',
    module: '首页',
    focus: '身份卡、待办统计、快捷申请、快捷查询、公告入口',
    status: '已验收',
    tone: 'success',
    screenshot: 'home-workbench.png',
  },
  {
    title: '申请中心',
    path: '/apply',
    module: '申请',
    focus: '五类申请入口、新增/详情/重发起链路、材料与审批状态',
    status: '已验收',
    tone: 'success',
    screenshot: 'apply-center.png',
  },
  {
    title: '离职申请详情',
    path: '/apply/resignation/detail/OFFBOARD-20260601-001',
    module: '申请',
    focus: '离职主字段、surveyinfo1~15、竞业、文书材料、只读态',
    status: '重点演示',
    tone: 'primary',
    screenshot: 'resignation-detail.png',
  },
  {
    title: '考勤异常详情',
    path: '/apply/attendance-exception/detail/ATT-20260601-001',
    module: '申请',
    focus: 'exceptionTypeId、startDate/endDate、annexPath、origin、审批状态',
    status: '重点演示',
    tone: 'primary',
    screenshot: 'attendance-detail.png',
  },
  {
    title: '审批中心',
    path: '/approval/todo',
    module: '审批',
    focus: '待办/已办/我的流程/草稿 Tab、列表卡片、详情跳转',
    status: '已验收',
    tone: 'success',
    screenshot: 'approval-todo.png',
  },
  {
    title: '审批详情',
    path: '/approval/detail/todo-001',
    module: '审批',
    focus: '业务摘要、附件预览、审批轨迹、底部审批动作',
    status: '已验收',
    tone: 'success',
    screenshot: 'approval-detail.png',
  },
  {
    title: '自助查询入口',
    path: '/self-service',
    module: '自助',
    focus: '个人信息、薪资、考勤、休假、撤回、年度结果、联系人',
    status: '已验收',
    tone: 'success',
    screenshot: 'self-service.png',
  },
  {
    title: '后台联系人',
    path: '/self-service/contact-book',
    module: '自助',
    focus: 'HR 联系人搜索、电话邮箱展示、联系信息复制',
    status: '待复核',
    tone: 'warning',
    screenshot: 'contact-book.png',
  },
];

export const approvalTabs = [
  { key: 'todo', label: '待办', path: '/approval/todo' },
  { key: 'done', label: '已办', path: '/approval/done' },
  { key: 'my-process', label: '我的流程', path: '/approval/my-process' },
  { key: 'draft', label: '草稿', path: '/approval/draft' },
];

export const approvals: Record<string, ApprovalListItem[]> = {
  todo: [
    {
      id: 'todo-001',
      title: '考勤异常申请审批',
      desc: '申请人补充了 05-13 晚间漏打卡说明，需部门负责人确认。',
      meta: '周思远 | 当前节点：部门负责人审批 | 到达 2026-05-15 09:20',
      status: '待处理',
      tone: 'warning',
    },
    {
      id: 'todo-002',
      title: '内部推荐奖励申请',
      desc: '候选人已入职满试用期，等待薪酬专员复核奖励条件。',
      meta: '陈依凡 | 当前节点：薪酬复核 | 到达 2026-05-14 16:12',
      status: '待复核',
      tone: 'primary',
    },
    {
      id: 'todo-003',
      title: '居住证积分办理申请',
      desc: '员工已提交学历、社保与居住材料，等待 HR 初审。',
      meta: '郑浩宇 | 当前节点：HR 初审 | 到达 2026-05-13 11:05',
      status: '待初审',
      tone: 'warning',
    },
  ],
  done: [
    {
      id: 'done-001',
      title: '在职/收入证明申请',
      desc: '电子版证明已完成开具，纸质盖章件由前台寄出。',
      meta: '李欣妍 | 已办时间：2026-05-14 14:30',
      status: '已通过',
      tone: 'success',
    },
    {
      id: 'done-002',
      title: '离职申请',
      desc: '交接计划补充完整后已进入 HR 归档节点。',
      meta: '唐沐辰 | 已办时间：2026-05-13 17:42',
      status: '已处理',
      tone: 'success',
    },
    {
      id: 'done-003',
      title: '异常申请撤回',
      desc: '撤回原因与原申请记录不匹配，已退回申请人补充。',
      meta: '谢可欣 | 已办时间：2026-05-12 10:18',
      status: '已驳回',
      tone: 'error',
    },
  ],
  'my-process': [
    {
      id: 'process-001',
      title: '示例市居住证积分办理申请',
      desc: '材料初审通过，当前等待人事经理审批。',
      meta: '发起时间：2026-05-12 09:10 | 当前节点：人事经理审批',
      status: '审批中',
      tone: 'primary',
    },
    {
      id: 'process-002',
      title: '薪资证明申请',
      desc: '收入模板已选择，等待证明开具。',
      meta: '发起时间：2026-05-10 13:22 | 当前节点：证明开具',
      status: '流转中',
      tone: 'warning',
    },
    {
      id: 'process-003',
      title: '考勤异常申请',
      desc: '部门负责人已通过，HR 考勤岗待处理。',
      meta: '发起时间：2026-05-09 18:40 | 当前节点：HR 审核',
      status: '审批中',
      tone: 'primary',
    },
  ],
  draft: [
    {
      id: 'draft-001',
      title: '离职申请草稿',
      desc: '已填写离职日期和离职原因，交接人信息待补充。',
      meta: '保存时间：2026-05-14 20:12',
      status: '可继续编辑',
      tone: 'neutral',
    },
    {
      id: 'draft-002',
      title: '内部推荐奖励草稿',
      desc: '候选人信息已选择，奖励说明待补充。',
      meta: '保存时间：2026-05-13 15:24',
      status: '草稿',
      tone: 'neutral',
    },
  ],
};

export const approvalDetail: ApprovalDetailState = {
  title: '考勤异常申请审批',
  status: '待审批',
  applicant: '周思远',
  node: '部门负责人审批',
  fields: [
    { label: '流程编号', value: 'ATT-20260601-001' },
    { label: '申请类型', value: '考勤异常申请' },
    { label: '申请人', value: '周思远 / EMP0002' },
    { label: '所属部门', value: '产品研发中心' },
    { label: '异常日期', value: '2026-05-13' },
    { label: '异常类型', value: '漏打卡' },
    { label: '异常时段', value: '下班打卡' },
    { label: '申请原因', value: '项目现场协作结束较晚，移动打卡定位失败，未能及时完成下班打卡。' },
  ],
  attachments: [
    { name: '项目现场会议签到截图.png', size: '428KB', status: '可预览' },
    { name: '项目经理情况说明.pdf', size: '860KB', status: '可预览' },
  ] satisfies AttachmentItem[],
  timeline: [
    { title: '发起申请', desc: '周思远提交考勤异常申请', time: '2026-05-14 09:10', status: '已完成', tone: 'success' },
    { title: '部门负责人审批', desc: '等待当前审批人处理', time: '2026-05-15 09:20', status: '审批中', tone: 'warning' },
    { title: 'HR 考勤岗复核', desc: '通过后进入考勤月结记录', time: '预计下一节点', status: '待流转', tone: 'neutral' },
  ] satisfies TimelineItem[],
};

const baseEmployeeFields = [
  { label: '工号', key: 'badge', value: 'EMP0001', readonly: true },
  { label: '姓名', key: 'name', value: '陈晓宁', readonly: true },
  { label: '公司名称', key: 'companyName', value: '示例科技有限公司', readonly: true },
  { label: '部门名称', key: 'deptName', value: '人力资源共享服务中心', readonly: true },
  { label: '入职日期', key: 'joindate', value: '2021-07-12', type: 'date', readonly: true },
  { label: '身份证号', key: 'idCard', value: '310***********2648', readonly: true },
] satisfies FormSection['fields'];

export const applicationForms: Record<string, ApplicationForm> = {
  onJob: {
    title: '在职/收入证明申请',
    summary: '按员工信息、申请信息、开具与签收、附件材料分组展示。',
    status: '新增申请',
    tone: 'primary',
    source: '在职/收入证明业务表单',
    processNo: 'CERT-20260601-001',
    currentNode: '申请人填写',
    applicant: '陈晓宁 / EMP0001',
    modeLinks: [
      { label: '新增', path: '/apply/on-job', mode: 'add' },
      { label: '详情', path: '/apply/on-job/detail/CERT-20260601-001', mode: 'detail' },
      { label: '重发起', path: '/apply/on-job/reissue/CERT-20260601-001', mode: 'reissue' },
    ],
    sections: [
      { title: '员工基础信息', desc: '展示工号、身份证号、入职日期、公司和部门等基础信息。', badge: '只读', fields: baseEmployeeFields },
      {
        title: '申请信息',
        desc: '填写证明用途、收取方式、联系方式、模板和收入展示信息。',
        badge: '核心',
        fields: [
          { label: '证明用途', key: 'use', value: '办理居住证积分续签', required: true },
          { label: '收取类型', key: 'sealType', value: '快递（填写快递地址相关信息，到付）', type: 'select', required: true, options: ['电子版（无需纸质文档）', '快递（填写快递地址相关信息，到付）'] },
          { label: '联系方式', key: 'contactInfo', value: '138****0001', required: true },
          { label: '收件人', key: 'receiverName', value: '陈晓宁', visibleWhen: '收取类型为快递时展示' },
          { label: '收件电话', key: 'receiverMobile', value: '138****0001', visibleWhen: '收取类型为快递时展示' },
          { label: '快递地址', key: 'expressAdd', value: '示例市未来区云谷路 100 号 A 座', visibleWhen: '收取类型为快递时必填' },
          { label: '是否显示收入', key: 'incomeTemplate', value: '是', type: 'select', required: true, options: ['是', '否'] },
          { label: '全额工资', key: 'allSalary', value: '32000', type: 'number', visibleWhen: '是否显示收入为是，且进入开具/财务节点' },
          { label: '补贴', key: 'specialAllowanceName', value: '通讯补贴、交通补贴', visibleWhen: '是否显示收入为是，且进入开具/财务节点' },
          { label: '收入币种', key: 'currency', value: '人民币 CNY', type: 'select', visibleWhen: '是否显示收入为是', options: ['人民币 CNY', '美元 USD'] },
          { label: '证明模板选择', key: 'jobTemplate', value: '标准收入证明模板', type: 'select', options: ['标准在职证明模板', '标准收入证明模板', '自定义证明模板'] },
          { label: '用印类型', key: 'signet', value: '人事章', type: 'select', options: ['公章', '人事章'] },
        ],
      },
      {
        title: '开具与签收',
        desc: '展示证明开具、模板附件和签收状态。',
        badge: '流程',
        fields: [
          { label: '开具情况', key: 'issuanceStatus', value: '待 HR 开具证明，开具完成后上传盖章证明附件。', type: 'textarea' },
          { label: '开具状态', key: 'issueStatus', value: 'HR 处理中', readonly: true },
          { label: '预计开具日期', key: 'expectedIssueDate', value: '2026-05-17', type: 'date', readonly: true },
          { label: '签收状态', key: 'receiveStatus', value: '待签收', readonly: true },
          { label: '模板附件', key: 'specialTemplateUrl', value: 'income-template-2026.docx', readonly: true },
          { label: '备注', key: 'remark', value: '请优先提供电子版，纸质盖章件同步寄出。', type: 'textarea' },
        ],
      },
    ],
    attachments: [
      { name: 'specialTemplateUrl_自定义证明模板.docx', size: '96KB', status: '模板附件', desc: '选择自定义模板时展示，可预览不可真实下载。' },
      { name: 'issuanceCertificateAnnexUrl_开具证明附件.pdf', size: '待生成', status: '待开具', desc: 'HR 开具节点上传盖章证明附件。' },
      { name: 'deliverySignAnnexUrl_签收回执.pdf', size: '待生成', status: '待签收', desc: '收取类型为快递时展示签收附件。' },
    ],
  },
  recommend: {
    title: '内部推荐奖励申请',
    summary: '突出推荐人、被推荐人、岗位入职与奖励说明。',
    status: '新增申请',
    tone: 'primary',
    source: '内部推荐奖励业务表单',
    processNo: 'REF-20260601-001',
    currentNode: '薪酬专员复核',
    applicant: '陈晓宁 / EMP0001',
    modeLinks: [
      { label: '新增', path: '/apply/recommend-reward', mode: 'add' },
      { label: '详情', path: '/apply/recommend-reward/detail/REF-20260601-001', mode: 'detail' },
      { label: '重发起', path: '/apply/recommend-reward/reissue/REF-20260601-001', mode: 'reissue' },
    ],
    sections: [
      { title: '推荐人信息', badge: '只读', fields: baseEmployeeFields.slice(0, 4) },
      {
        title: '被推荐人信息',
        desc: '展示被推荐人、推荐来源、岗位、入职和转正状态。',
        badge: '核心',
        fields: [
          { label: '被推荐人', key: 'recommendedName', value: '许知远', required: true },
          { label: '被推荐人工号', key: 'recommendedBadge', value: 'EMP0003', readonly: true },
          { label: '被推荐人员工状态', key: 'statusStr', value: '在职', readonly: true },
          { label: '被推荐人离职日期', key: 'recommendedDepartTime', value: '无', readonly: true },
          { label: '被推荐人行业', key: 'recommendedIndustryName', value: '数字化咨询与软件服务', readonly: true },
          { label: '被推荐人职级', key: 'recommendedEmpGrade', value: 'P5-2', readonly: true },
          { label: '被推荐人入职日期', key: 'recommendedJoinDate', value: '2026-02-18', type: 'date', readonly: true },
          { label: '被推荐人部门', key: 'recommendedDeptName', value: '产品研发中心', readonly: true },
          { label: '被推荐人职务', key: 'recommendedJobName', value: '高级 Java 开发工程师', readonly: true },
          { label: '被推荐人转正日期', key: 'regularizationDate', value: '2026-05-18', type: 'date', readonly: true },
        ],
      },
      {
        title: '奖励申请信息',
        badge: '流程',
        fields: [
          { label: '内部推荐奖励', key: 'reward', value: '3000', type: 'number', readonly: true },
          { label: '推荐人行业', key: 'industryName', value: '数字化咨询与软件服务', readonly: true },
          { label: '推荐人职级', key: 'empGrade', value: 'P6-2', readonly: true },
          { label: '推荐人离职日期', key: 'departTime', value: '无', readonly: true },
          { label: '感谢信是否发送', key: 'isSentLetter', value: '待发送', type: 'select', options: ['待发送', '已发送'], visibleWhen: '特定审批节点或管理员可见' },
          { label: '备注', key: 'notes', value: '候选人已完成试用期转正，符合推荐奖励发放条件。', type: 'textarea' },
          { label: '流程状态', key: 'status', value: '新增申请', readonly: true },
        ],
      },
    ],
    attachments: [
      { name: '推荐奖励申请说明.pdf', size: '148KB', status: '可预览', desc: '用于查看推荐奖励发放规则和确认说明。' },
    ],
  },
  settle: {
    title: '居住证/户籍办理申请',
    summary: '按员工信息、办理申请、材料说明分组展示。',
    status: '草稿',
    tone: 'warning',
    source: '居住证/户籍办理业务表单',
    processNo: 'RESIDE-20260601-001',
    currentNode: 'HR 初审',
    applicant: '陈晓宁 / EMP0001',
    modeLinks: [
      { label: '新增', path: '/apply/settle', mode: 'add' },
      { label: '详情', path: '/apply/settle/detail/RESIDE-20260601-001', mode: 'detail' },
      { label: '重发起', path: '/apply/settle/reissue/RESIDE-20260601-001', mode: 'reissue' },
    ],
    sections: [
      { title: '员工基础信息', badge: '只读', fields: baseEmployeeFields },
      {
        title: '办理申请',
        desc: '选择申请类别和事项，填写申请原因与办理条件信息。',
        badge: '核心',
        fields: [
          { label: '申请类别', key: 'category', value: '居住证办理', type: 'select', required: true, options: ['居住证办理', '户籍办理'] },
          { label: '申请事项', key: 'resideSettle', value: '示例市居住证积分续办', type: 'select', required: true, options: ['示例市居住证积分首次办理', '示例市居住证积分续办', '居转户材料初审', '留学生落户材料初审'], visibleWhen: '类别为居住证办理或户籍办理时切换不同选项' },
          { label: '申请事项编码', key: 'resideSettleId', value: '1-2', readonly: true },
          { label: '申请原因', key: 'reasonApp', value: '子女入学及居住证积分续办需要公司协助出具材料。', type: 'textarea', required: true },
          { label: '工作邮箱', key: 'workEmail', value: 'employee@example.com', readonly: true },
          { label: '手机号', key: 'phoneNumber', value: '138****0001', readonly: true },
          { label: '最高学历', key: 'highStudyli', value: '硕士研究生', readonly: true },
          { label: '居住证有效期', key: 'residencePermitDate', value: '2027-03-31', type: 'date' },
          { label: '社保缴纳月份', key: 'socialSecurityMonth', value: '近 12 个月连续缴纳', readonly: true },
          { label: '个税缴纳月份', key: 'taxMonth', value: '近 12 个月连续申报', readonly: true },
          { label: '工作业绩', key: 'workPerformance', value: '负责人力资源共享服务流程优化，支持移动端员工体验改造项目落地。', type: 'textarea', required: true },
        ],
      },
      {
        title: '材料与办理说明',
        desc: '按材料类型展示提交方式、附件和审核状态。',
        badge: '附件',
        fields: [
          { label: '材料提交方式', key: 'materialSubmitType', value: '线上上传后 HR 初审', type: 'select', options: ['线上上传后 HR 初审', '线下递交纸质材料'] },
          { label: '附件', key: 'mateAccess', value: '学历学位证明、社保缴纳证明、个税申报记录', type: 'attachment', required: true },
          { label: '学历材料状态', key: 'degreeMaterialStatus', value: '已上传，待核验', readonly: true },
          { label: '社保/个税材料状态', key: 'taxMaterialStatus', value: '已上传，待核验', readonly: true },
          { label: 'HR 补充说明', key: 'hrNotice', value: '办理周期和材料清单以属地政策为准，请按页面提示补充材料。', type: 'textarea', readonly: true },
        ],
      },
    ],
    attachments: [
      { name: '学历学位证明.zip', size: '4.8MB', status: '已上传', desc: '学历证书、学位证书、学信网验证材料。' },
      { name: '社保缴纳证明.pdf', size: '2.1MB', status: '已上传', desc: '用于居住证积分或户籍办理初审。' },
      { name: '个税申报记录.pdf', size: '1.6MB', status: '待补充', desc: '重发起时提示补齐。' },
    ],
  },
  attendance: {
    title: '考勤异常申请',
    summary: '按员工信息、异常信息和流程查询状态分组展示。',
    status: '新增申请',
    tone: 'primary',
    source: '考勤异常业务表单',
    processNo: 'ATT-20260601-001',
    currentNode: '申请人填写',
    applicant: '周思远 / EMP0002',
    modeLinks: [
      { label: '新增', path: '/apply/attendance-exception', mode: 'add' },
      { label: '详情', path: '/apply/attendance-exception/detail/ATT-20260601-001', mode: 'detail' },
      { label: '重发起', path: '/apply/attendance-exception/reissue/ATT-20260601-001', mode: 'reissue' },
    ],
    sections: [
      { title: '员工基础信息', badge: '只读', fields: baseEmployeeFields.slice(0, 4) },
      {
        title: '异常信息',
        desc: '填写异常类别、日期、时长、附件和事由。',
        badge: '核心',
        fields: [
          { label: '异常类别', key: 'exceptionTypeId', value: '漏打卡', type: 'select', required: true, options: ['漏打卡', '迟到说明', '早退说明', '外勤/出差异常', '休假异常'] },
          { label: '时间长度(天)', key: 'dayLen', value: '0.5', type: 'number', readonly: true, visibleWhen: '异常类别不是特殊值 10 时显示' },
          { label: '休假总计/时长', key: 'xjNum', value: '0.5 小时', readonly: true, visibleWhen: '异常类别为休假类时显示' },
          { label: '开始日期', key: 'startDate', value: '2026-05-13', type: 'date', required: true },
          { label: '结束日期', key: 'endDate', value: '2026-05-13', type: 'date', required: true },
          { label: '开始时间选项', key: 'startOption', value: '下班后', type: 'select', options: ['上午', '下午', '下班后'], visibleWhen: 'isViewOption 为 true' },
          { label: '结束时间选项', key: 'endOption', value: '下班后', type: 'select', options: ['上午', '下午', '下班后'], visibleWhen: 'isViewOption 为 true' },
          { label: '时间', key: 'xjTime', value: '18:00-18:30', type: 'select', options: ['09:00-09:30', '12:00-13:00', '18:00-18:30'], visibleWhen: 'isViewTime 为 true' },
          { label: '附件', key: 'annexPath', value: '项目现场签到截图.png', type: 'attachment', helper: '附件说明随异常类别切换展示。' },
          { label: '事由', key: 'origin', value: '项目现场协作结束较晚，移动打卡定位失败，未能及时完成下班打卡。', type: 'textarea', required: true },
        ],
      },
      {
        title: '流程查询字段',
        desc: '展示提交时间、处理人和审批状态。',
        badge: '状态',
        fields: [
          { label: '所属公司', key: 'companyName', value: '示例科技有限公司', readonly: true },
          { label: '所属部门', key: 'departmentName', value: '产品研发中心', readonly: true },
          { label: '提交时间', key: 'commitTime', value: '2026-05-14 09:10', readonly: true },
          { label: '结束时间', key: 'endTime', value: '待审批完成', readonly: true },
          { label: '当前处理人', key: 'assigneeName', value: '部门负责人 王睿', readonly: true },
          { label: '审批状态', key: 'status', value: '待提交', readonly: true },
        ],
      },
    ],
    attachments: [
      { name: '项目现场签到截图.png', size: '428KB', status: '已上传', desc: '证明员工在项目现场。' },
      { name: '项目经理情况说明.pdf', size: '860KB', status: '可预览', desc: '审批详情页展示。' },
    ],
  },
  resignation: {
    title: '离职申请',
    summary: '覆盖离职类型、日期、原因、调研、竞业和附件材料。',
    status: '草稿',
    tone: 'warning',
    source: '离职申请业务表单',
    processNo: 'OFFBOARD-20260601-001',
    currentNode: '申请人填写',
    applicant: '陈晓宁 / EMP0001',
    modeLinks: [
      { label: '新增', path: '/apply/resignation', mode: 'add' },
      { label: '详情', path: '/apply/resignation/detail/OFFBOARD-20260601-001', mode: 'detail' },
      { label: '重发起', path: '/apply/resignation/reissue/OFFBOARD-20260601-001', mode: 'reissue' },
    ],
    sections: [
      {
        title: '员工基础信息',
        desc: '展示公司、部门、职务、职级、员工类型、工作城市和联系方式。',
        badge: '只读',
        fields: [
          { label: '姓名', key: 'name', value: '陈晓宁', readonly: true },
          { label: '工号', key: 'badge', value: 'EMP0001', readonly: true },
          { label: '所属公司', key: 'companyAbbreviation', value: '示例科技', readonly: true },
          { label: '所属部门', key: 'departmentName', value: '人力资源共享服务中心', readonly: true },
          { label: '员工职务', key: 'jobName', value: '员工关系经理', readonly: true },
          { label: '员工职级', key: 'empGradeStr', value: 'P6-2', readonly: true },
          { label: '入职时间', key: 'joindate', value: '2021-07-12', type: 'date', readonly: true },
          { label: '员工类型', key: 'empTypeStr', value: '正式员工', readonly: true },
          { label: '工作城市', key: 'workCityStr', value: '示例市', readonly: true },
          { label: '档案编号', key: 'fileno', value: 'ARCH-EMP0001', readonly: true },
          { label: '手机号码', key: 'mobile', value: '138****0001', readonly: true },
        ],
      },
      {
        title: '离职信息',
        desc: '填写离职原因、离职类型、预计离职日期和证明领取方式。',
        badge: '核心',
        fields: [
          { label: '离职原因', key: 'resignationreasonDetails', value: '个人职业规划调整，已与直属主管完成初步沟通。', type: 'textarea', required: true },
          { label: '离职类型', key: 'resignationtype', value: '个人主动离职', type: 'select', required: true, options: ['个人主动离职', '协商解除', '合同到期不续签', '公司提出解除'] },
          { label: '离职主要原因', key: 'resignationreason', value: '职业发展', type: 'select', required: true, options: ['职业发展', '薪酬福利', '工作地点', '家庭原因', '其他'] },
          { label: '具体原因', key: 'specificReason', value: '希望转向 HR 数字化产品方向。', type: 'textarea', visibleWhen: '随离职主要原因联动' },
          { label: '申请离职时间', key: 'applicationdate', value: '2026-06-20', type: 'date', required: true, readonly: true },
          { label: '离职证明领取方式', key: 'quitGetWay', value: '快递纸质版', type: 'select', required: true, options: ['快递纸质版', '电子版邮件', '现场领取'] },
          { label: '离职证明快递地址', key: 'courierAddress', value: '示例市未来区云谷路 100 号 A 座', type: 'textarea', visibleWhen: 'quitGetWay 为快递纸质版时必填' },
          { label: '电子版接收邮箱', key: 'email', value: 'employee@example.com', visibleWhen: 'quitGetWay 为电子版邮件时必填' },
        ],
      },
      {
        title: '离职调研问卷',
        desc: '按多题问卷收集离职原因、团队体验和后续回访意愿。',
        badge: '问卷',
        fields: [
          { label: '调研问卷1：工作内容匹配度', key: 'surveyinfo1', value: '基本匹配', type: 'select', required: true, options: ['非常匹配', '基本匹配', '不匹配'] },
          { label: '调研问卷2：团队氛围', key: 'surveyinfo2', value: '满意', type: 'select', required: true, options: ['满意', '一般', '不满意'] },
          { label: '调研问卷3：薪酬福利感受', key: 'surveyinfo3', value: '一般', type: 'select', required: true, options: ['满意', '一般', '不满意'] },
          { label: '调研问卷4：主管沟通', key: 'surveyinfo4', value: '顺畅', type: 'select', required: true, options: ['顺畅', '一般', '较少沟通'] },
          { label: '调研问卷5：培训与成长', key: 'surveyinfo5', value: '有帮助', type: 'select', required: true, options: ['有帮助', '一般', '帮助较少'] },
          { label: '调研问卷6：工作负荷', key: 'surveyinfo6', value: '适中', type: 'select', required: true, options: ['偏高', '适中', '偏低'] },
          { label: '调研问卷7：离职前是否已沟通', key: 'surveyinfo7', value: '已与直属主管沟通', type: 'select', required: true, options: ['已与直属主管沟通', '已与 HR 沟通', '尚未沟通'] },
          { label: '调研问卷8：是否愿意后续回访', key: 'surveyinfo8', value: '愿意', type: 'select', required: true, options: ['愿意', '不愿意'] },
        ],
      },
      {
        title: '离职调研补充',
        desc: '长文本和后续意向类问题单独分组，避免移动端一屏过密。',
        badge: '补充',
        fields: [
          { label: '调研问卷9：最希望改善的事项', key: 'surveyinfo9', value: '希望 HR 数字化工具在移动端有更多自助能力。', type: 'textarea', required: true },
          { label: '调研问卷10：对团队建议', key: 'surveyinfo10', value: '建议继续保持跨团队分享机制，并加强新人导师陪伴。', type: 'textarea', required: true },
          { label: '调研问卷11：是否推荐朋友加入', key: 'surveyinfo11', value: '愿意推荐', type: 'select', required: true, options: ['愿意推荐', '视岗位而定', '暂不推荐'] },
          { label: '调研问卷12：是否接受返聘机会', key: 'surveyinfo12', value: '可保持沟通', type: 'select', required: true, options: ['可保持沟通', '暂不考虑'] },
          { label: '调研问卷13：离职去向', key: 'surveyinfo13', value: '同行业 HR 数字化产品岗位', required: true },
          { label: '调研问卷14：其它说明', key: 'surveyinfo14', value: '离职交接计划已与部门负责人确认。', type: 'textarea' },
          { label: '调研问卷15：员工签字确认', key: 'surveyinfo15', value: '本人确认以上信息真实有效', type: 'select', required: true, options: ['本人确认以上信息真实有效', '暂不确认'] },
        ],
      },
      {
        title: '确认与竞业',
        desc: '展示确认、竞业限制和离职文书出具信息。',
        badge: '流程',
        fields: [
          { label: '确认并下载工作人员信息', key: 'confirmInfo', value: '已确认', type: 'select', required: true, options: ['已确认', '未确认'] },
          { label: '是否启动竞业限制', key: 'isCompetition', value: '否', type: 'select', required: true, options: ['是', '否'] },
          { label: '关于是否启动竞业的理由', key: 'isCompetitionReason', value: '岗位不涉及需要启动竞业限制的核心商业信息。', type: 'textarea', visibleWhen: 'isCompetition 为是时必填' },
          { label: '工资支付日', key: 'salaryPayment', value: '2026-07-10', type: 'date', visibleWhen: '示例权限节点显示' },
          { label: '离职证明出具情况', key: 'produceState', value: '待离职办理完成后出具。', type: 'textarea', visibleWhen: '开具相关节点显示' },
        ],
      },
    ],
    attachments: [
      { name: '员工离职申请表.pdf', size: '待生成', status: '流程材料', desc: '由流程信息生成并提供预览入口。' },
      { name: '离职证明.pdf', size: '待生成', status: '待开具', desc: '开具节点展示。' },
      { name: '履行竞业限制义务通知函.pdf', size: '待确认', status: '条件材料', desc: '启动竞业限制时展示。' },
    ],
  },
};

type ApprovalDetailOverrides = Partial<
  Pick<ApprovalDetailState, 'title' | 'status' | 'applicant' | 'node' | 'attachments' | 'timeline'>
> & {
  processNo?: string;
  type?: string;
  applicantDetail?: string;
  extraFields?: ApprovalDetailState['fields'];
};

const createApprovalTimeline = (
  title: string,
  applicant: string,
  node: string,
  status: string,
  tone: TimelineItem['tone'],
): TimelineItem[] => [
  {
    title: '发起申请',
    desc: `${applicant} 提交${title.replace(/草稿$/, '')}`,
    time: '2026-05-12 09:10',
    status: '已完成',
    tone: 'success',
  },
  {
    title: node,
    desc: `当前状态：${status}`,
    time: '2026-05-15 09:20',
    status,
    tone,
  },
  {
    title: '后续节点',
    desc: '纯前端 mock 演示流程轨迹，不连接真实审批引擎。',
    time: '示例流程',
    status: 'Mock',
    tone: 'neutral',
  },
];

const createApprovalDetailFromForm = (
  form: ApplicationForm,
  overrides: ApprovalDetailOverrides = {},
): ApprovalDetailState => {
  const title = overrides.title ?? form.title;
  const applicant = overrides.applicant ?? form.applicant.split('/')[0]?.trim() ?? form.applicant;
  const node = overrides.node ?? form.currentNode;
  const status = overrides.status ?? form.status;
  const type = overrides.type ?? form.title.replace(/草稿$/, '');
  const processNo = overrides.processNo ?? form.processNo;
  const formFields = form.sections
    .flatMap((section) => section.fields)
    .filter((field) => !['流程编号', '申请类型', '申请人', '当前节点'].includes(field.label))
    .slice(0, 6)
    .map((field) => ({
      label: field.label,
      value: field.value,
      required: field.required,
      helper: field.helper,
    }));

  return {
    title,
    status,
    applicant,
    node,
    fields: [
      { label: '流程编号', value: processNo },
      { label: '申请类型', value: type },
      { label: '申请人', value: overrides.applicantDetail ?? form.applicant },
      { label: '当前节点', value: node },
      ...(overrides.extraFields ?? formFields),
    ],
    attachments: overrides.attachments ?? form.attachments,
    timeline: overrides.timeline ?? createApprovalTimeline(title, applicant, node, status, form.tone),
  };
};

export const approvalDetails: Record<string, ApprovalDetailState> = {
  'todo-001': approvalDetail,
  'todo-002': createApprovalDetailFromForm(applicationForms.recommend, {
    title: '内部推荐奖励申请',
    applicant: '陈依凡',
    applicantDetail: '陈依凡 / EMP0008',
    status: '待复核',
    node: '薪酬复核',
  }),
  'todo-003': createApprovalDetailFromForm(applicationForms.settle, {
    title: '居住证积分办理申请',
    applicant: '郑浩宇',
    applicantDetail: '郑浩宇 / EMP0011',
    status: '待初审',
    node: 'HR 初审',
  }),
  'done-001': createApprovalDetailFromForm(applicationForms.onJob, {
    title: '在职/收入证明申请',
    applicant: '李欣妍',
    applicantDetail: '李欣妍 / EMP0015',
    status: '已通过',
    node: '流程已完成',
    timeline: [
      { title: '发起申请', desc: '李欣妍提交在职/收入证明申请', time: '2026-05-13 09:30', status: '已完成', tone: 'success' },
      { title: '证明开具', desc: 'HR 已完成电子版证明开具', time: '2026-05-14 14:30', status: '已通过', tone: 'success' },
      { title: '材料寄送', desc: '纸质盖章件由前台寄出', time: '2026-05-14 16:00', status: '已处理', tone: 'success' },
    ],
  }),
  'done-002': createApprovalDetailFromForm(applicationForms.resignation, {
    title: '离职申请',
    applicant: '唐沐辰',
    applicantDetail: '唐沐辰 / EMP0019',
    status: '已处理',
    node: 'HR 归档',
  }),
  'done-003': {
    title: '异常申请撤回',
    status: '已驳回',
    applicant: '谢可欣',
    node: '申请人补充说明',
    fields: [
      { label: '流程编号', value: 'CANCEL-20260601-003' },
      { label: '申请类型', value: '异常申请撤回' },
      { label: '申请人', value: '谢可欣 / EMP0022' },
      { label: '原申请', value: '04-21 迟到说明' },
      { label: '撤回原因', value: '原申请记录与撤回说明不匹配，需重新补充材料。' },
    ],
    attachments: [
      { name: '撤回原因说明.pdf', size: '220KB', status: '可预览' },
    ],
    timeline: [
      { title: '发起撤回', desc: '谢可欣提交异常撤回申请', time: '2026-05-12 09:40', status: '已完成', tone: 'success' },
      { title: 'HR 复核', desc: '撤回原因与原申请记录不匹配', time: '2026-05-12 10:18', status: '已驳回', tone: 'error' },
      { title: '申请人补充', desc: '等待申请人补充说明后重新提交', time: '示例流程', status: '待补充', tone: 'warning' },
    ],
  },
  'process-001': createApprovalDetailFromForm(applicationForms.settle, {
    title: '示例市居住证积分办理申请',
    applicant: '陈晓宁',
    applicantDetail: '陈晓宁 / EMP0001',
    status: '审批中',
    node: '人事经理审批',
  }),
  'process-002': createApprovalDetailFromForm(applicationForms.onJob, {
    title: '薪资证明申请',
    processNo: 'CERT-20260601-002',
    applicant: '陈晓宁',
    applicantDetail: '陈晓宁 / EMP0001',
    status: '流转中',
    node: '证明开具',
    type: '薪资证明申请',
  }),
  'process-003': createApprovalDetailFromForm(applicationForms.attendance, {
    title: '考勤异常申请',
    applicant: '陈晓宁',
    applicantDetail: '陈晓宁 / EMP0001',
    status: '审批中',
    node: 'HR 审核',
  }),
  'draft-001': createApprovalDetailFromForm(applicationForms.resignation, {
    title: '离职申请草稿',
    applicant: '陈晓宁',
    applicantDetail: '陈晓宁 / EMP0001',
    status: '可继续编辑',
    node: '申请人填写',
  }),
  'draft-002': createApprovalDetailFromForm(applicationForms.recommend, {
    title: '内部推荐奖励草稿',
    applicant: '陈晓宁',
    applicantDetail: '陈晓宁 / EMP0001',
    status: '草稿',
    node: '申请人填写',
  }),
};

export const selfServiceEntries = [
  { title: '个人信息', desc: '基础档案、任职、联系、经历信息', path: '/self-service/profile', icon: '人' },
  { title: '薪资查询', desc: '月度薪资、奖金、补扣款明细', path: '/self-service/salary', icon: '薪' },
  { title: '打卡记录', desc: '月度考勤统计和每日记录', path: '/self-service/attendance', icon: '勤' },
  { title: '休假结余', desc: '年假、调休、福利假余额', path: '/self-service/vacation', icon: '假' },
  { title: '异常撤回', desc: '查看并撤回异常申请', path: '/self-service/cancellation', icon: '撤' },
  { title: '年度结果', desc: '年度总结评定与反馈', path: '/self-service/summary-result', icon: '绩' },
  { title: '后台联系人', desc: 'HR 电话与邮箱查询', path: '/self-service/contact-book', icon: '联' },
];

export const profileGroups = [
  {
    title: '基础信息',
    path: '/self-service/profile',
    fields: [
      { label: '姓名', value: employeeProfile.name },
      { label: '工号', value: employeeProfile.badge },
      { label: '公司', value: employeeProfile.company },
      { label: '部门', value: employeeProfile.department },
      { label: '岗位', value: employeeProfile.position },
      { label: '工作邮箱', value: employeeProfile.email },
      { label: '手机号', value: employeeProfile.phone },
      { label: '员工状态', value: employeeProfile.status },
    ],
  },
  {
    title: '教育/工作经历',
    path: '/self-service/profile/career',
    fields: [
      { label: '最高学历', value: '硕士研究生' },
      { label: '毕业院校', value: '示例大学' },
      { label: '专业', value: '人力资源管理' },
      { label: '上一家公司', value: '某大型咨询公司' },
      { label: '当前职级', value: 'P6-2' },
    ],
  },
  {
    title: '家庭/紧急联系人',
    path: '/self-service/profile/family',
    fields: [
      { label: '紧急联系人', value: '林启明' },
      { label: '关系', value: '父亲' },
      { label: '联系电话', value: '138****0002' },
      { label: '现居地址', value: '示例市未来区云谷路 100 号' },
    ],
  },
  {
    title: '语言/证书/培训',
    path: '/self-service/profile/qualification',
    fields: [
      { label: '语言能力', value: '英语 CET-6' },
      { label: '专业证书', value: '人力资源管理师（二级）' },
      { label: '近期培训', value: '劳动关系风险与员工体验优化' },
    ],
  },
  {
    title: '银行卡/奖惩',
    path: '/self-service/profile/finance',
    fields: [
      { label: '工资卡银行', value: '示例银行云谷支行' },
      { label: '银行卡号', value: '6225 **** **** 8620' },
      { label: '奖励记录', value: '2025 年度优秀项目支持奖' },
      { label: '惩处记录', value: '无' },
    ],
  },
];

export const salaryMonths = [
  {
    month: '2026-05',
    net: '22,860.45',
    income: [
      ['基本工资', '18,000.00'],
      ['岗位津贴', '2,400.00'],
      ['绩效奖金', '4,200.00'],
      ['交通补贴', '600.00'],
    ],
    deduction: [
      ['社保个人部分', '1,680.00'],
      ['公积金个人部分', '1,260.00'],
      ['个税', '1,399.55'],
    ],
  },
  {
    month: '2026-04',
    net: '21,980.10',
    income: [
      ['基本工资', '18,000.00'],
      ['岗位津贴', '2,400.00'],
      ['项目奖金', '3,000.00'],
    ],
    deduction: [
      ['社保个人部分', '1,680.00'],
      ['公积金个人部分', '1,260.00'],
      ['个税', '479.90'],
    ],
  },
];

export const attendanceDays = [
  { day: '05-12', status: '正常', desc: '09:01 / 18:34，虹桥办公室' },
  { day: '05-13', status: '异常', desc: '09:02 / 缺卡，项目现场' },
  { day: '05-14', status: '正常', desc: '08:58 / 18:21，云谷办公室' },
  { day: '05-15', status: '外勤', desc: '09:30 / 17:50，项目会议' },
];

export const vacations = [
  { type: '年假', balance: '8.5 天', used: '3.5 天', records: ['2026-04-03 使用 1 天', '2026-02-10 使用 2.5 天'] },
  { type: '调休', balance: '12 小时', used: '4 小时', records: ['2026-05-04 加班转调休 8 小时', '2026-04-18 使用 4 小时'] },
  { type: '福利假', balance: '2 天', used: '0 天', records: ['2026 年度福利假初始化 2 天'] },
];

export const cancellations = [
  { id: 'cancel-1', title: '05-13 漏打卡申请', desc: '当前仍在审批中，可发起撤回。', meta: '申请日期：2026-05-14', status: '可撤回', tone: 'primary' as const },
  { id: 'cancel-2', title: '04-29 外勤打卡异常', desc: '已通过，不允许撤回。', meta: '申请日期：2026-04-30', status: '不可撤回', tone: 'neutral' as const },
  { id: 'cancel-3', title: '04-21 迟到说明', desc: '撤回申请处理中。', meta: '申请日期：2026-04-21', status: '撤回中', tone: 'warning' as const },
];

export const summaryResults = [
  { year: '2025', grade: 'A', score: '92', desc: '年度关键项目交付稳定，跨部门协作反馈优秀。' },
  { year: '2024', grade: 'B+', score: '86', desc: '员工关系专项处理质量稳定，流程优化需继续推进。' },
];

export const contactBook = [
  { name: '王若晴', role: '薪资福利专员', phone: '400-000-1001', email: 'payroll@example.com' },
  { name: '赵景行', role: '员工关系专员', phone: '400-000-1002', email: 'er@example.com' },
  { name: '沈言', role: '考勤假期专员', phone: '400-000-1003', email: 'attendance@example.com' },
  { name: '陆知夏', role: '招聘运营专员', phone: '400-000-1004', email: 'recruit@example.com' },
];
