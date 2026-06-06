# Open EHR Mobile

Open EHR Mobile 是一个基于 Vue 3、Vite、TypeScript 和 Vue Router 的纯前端移动端 EHR 开源演示项目。项目聚焦员工移动端常见场景：工作台、申请中心、审批中心和员工自助查询。

当前版本不包含后端服务，所有登录、申请、审批、自助查询和反馈交互均通过 mock 数据、本地组件状态与浏览器本地存储模拟，适合用于移动端 EHR 原型演示、前端二次开发和开源样板工程。

## 功能清单

1. 登录入口：点击进入系统，跳转到移动端首页工作台。
2. 首页工作台：展示员工身份卡、待办统计、快捷申请、快捷查询和公告入口。
3. 申请中心：支持在职/收入证明、内部推荐奖励、居住证/户籍办理、考勤异常、离职申请。
4. 申请表单：支持新增、详情、重发起、保存草稿、提交申请、附件预览。
5. 审批中心：支持待办、已办、我的流程、草稿列表和详情跳转。
6. 审批详情：支持同意、驳回、转办、加签、审批意见和流程状态反馈。
7. 自助查询：支持个人信息、薪资、考勤、休假、异常撤回、年度结果、联系人。
8. 本地 mock：申请草稿、申请提交、审批详情状态使用浏览器本地存储模拟。
9. 冒烟验证：内置 Playwright 主链路检查脚本，覆盖路由、点击流、核心交互和移动端布局。

## 技术栈

1. Vue 3
2. Vite
3. TypeScript
4. Vue Router
5. Playwright

项目暂不引入后端、Pinia 或额外 UI 组件库，保持依赖轻量。

## 目录结构

```text
open-ehr-mobile/
├─ src/
│  ├─ components/        # 页面组件与通用演示组件
│  ├─ data/              # mock 数据与类型定义
│  ├─ router.ts          # Vue Router 路由配置
│  ├─ styles/            # 全局样式与移动端基础变量
│  └─ views/             # 页面视图
├─ scripts/
│  ├─ playwright-smoke.mjs
│  └─ verify-open-source.mjs
├─ index.html
├─ package.json
├─ vite.config.ts
├─ tsconfig.json
├─ .env.example
├─ .gitignore
├─ LICENSE
└─ NOTICE
```

## 环境要求

建议使用 Node.js `20.19.0` 或更高版本。

```shell
node -v
npm -v
```

## 本地启动

```shell
npm install
npm run dev
```

默认开发地址：

```text
http://127.0.0.1:5180
```

## 常用命令

```shell
npm run dev
npm run type-check
npm run build
npm run preview
npm run verify:oss
npm run test:smoke
```

命令说明：

1. `npm run dev`：启动本地开发服务，默认端口 `5180`。
2. `npm run type-check`：执行 TypeScript 类型检查。
3. `npm run build`：先类型检查，再执行生产构建。
4. `npm run preview`：预览构建产物。
5. `npm run verify:oss`：检查开源必需文件与敏感词。
6. `npm run test:smoke`：执行 Playwright 移动端主链路冒烟验证。

## 页面路由

```text
/login
/home
/demo-checklist
/apply
/apply/on-job
/apply/on-job/detail/CERT-20260601-001
/apply/on-job/reissue/CERT-20260601-001
/apply/recommend-reward
/apply/settle
/apply/attendance-exception
/apply/resignation
/approval/todo
/approval/done
/approval/my-process
/approval/draft
/approval/detail/todo-001
/self-service
/self-service/profile
/self-service/salary
/self-service/attendance
/self-service/vacation
/self-service/cancellation
/self-service/summary-result
/self-service/contact-book
```

## Mock 说明

主要 mock 数据位于：

```text
src/data/mock.ts
src/data/types.ts
```

交互模拟说明：

1. 登录入口通过路由跳转模拟，不发起网络请求。
2. 申请表单保存草稿后，会写入浏览器本地存储 `open-ehr-mobile:form-drafts`。
3. 申请表单提交后，会写入浏览器本地存储 `open-ehr-mobile:form-submissions`。
4. 审批详情的同意、驳回、转办、加签会更新页面状态，并写入浏览器本地存储 `open-ehr-mobile:approval-detail-state`。
5. 薪资月份切换、考勤筛选、休假刷新、联系人搜索、撤回申请等均为组件内 mock 交互。

清空浏览器本地存储后，页面会回到内置 mock 初始状态。

## 二次开发建议

1. 若要替换为真实接口，建议保留当前页面与类型结构，在 `src/data` 外新增 API 层。
2. 若要接入状态管理，可在申请、审批和自助查询模块逐步引入 Pinia。
3. 若要接入移动端组件库，建议先统一按钮、标签、列表、弹窗、表单控件，再替换页面内部结构。
4. 若要发布为企业内部应用，请重新审查品牌、文案、数据来源、隐私说明和许可边界。

## 截图与验证

运行本地开发服务后执行：

```shell
npm run test:smoke
```

脚本会使用 `390x844` 移动端视口访问主要页面，并把截图输出到：

```text
output/playwright/
```

脚本会按以下顺序选择浏览器：

1. 使用环境变量 `PLAYWRIGHT_CHROME_PATH` 指定的浏览器。
2. 在 Windows 上尝试使用常见系统 Chrome 路径。
3. 回退到 Playwright 自带 Chromium。

## 开源合规

```shell
npm run verify:oss
```

该命令会检查：

1. 开源必需文件是否存在。
2. 业务源码和文档中是否残留旧内部品牌词。
3. 是否出现未脱敏手机号、非示例邮箱、内部地址或高风险配置字段。

## 许可

本项目使用 MIT License，详见 `LICENSE`。
