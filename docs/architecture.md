# Architecture

## 架构概览

Open EHR Mobile 是纯前端单页应用，运行时由 Vue Router 组织页面，由 `src/data` 提供 mock 数据，由浏览器本地存储模拟部分提交和审批状态。

```text
index.html
└─ src/main.ts
   ├─ src/App.vue
   ├─ src/router.ts
   ├─ src/styles/tokens.css
   ├─ src/styles/base.css
   ├─ src/components/
   ├─ src/views/
   └─ src/data/
```

## 技术栈

1. Vue 3：页面和组件渲染。
2. TypeScript：数据结构和组件状态约束。
3. Vite：开发服务、构建和预览。
4. Vue Router：移动端页面路由。
5. Playwright：主链路 smoke 与截图。

## 路由结构

路由集中在 `src/router.ts`：

1. `/home`：首页工作台。
2. `/apply`：申请中心。
3. `/apply/*`：申请表单新增、详情和重发起。
4. `/approval/:tab`：审批列表。
5. `/approval/detail/:processInstanceId`：审批详情。
6. `/self-service`：员工自助入口。
7. `/self-service/*`：自助查询子页面。
8. `/demo-checklist`：业务导览。

保持路由矩阵稳定是二次开发的重要前提。新增页面时应优先扩展现有业务域，而不是引入新的顶层结构。

## 数据结构

mock 数据集中在：

```text
src/data/mock.ts
src/data/types.ts
```

当前主要类型包括：

1. `ApplicationForm`：申请表单配置。
2. `FormSection`：表单分组。
3. `FieldDefinition`：字段定义。
4. `ApprovalListItem`：审批列表项。
5. `TimelineItem`：审批时间线。
6. `ChecklistItem`：演示导览项。

核心类型已使用业务语义命名。后续产品化命名时，优先保持 `ApplicationForm`、`FormSection`、`FieldDefinition`、`TimelineItem` 等类型稳定，避免为兼容历史演示命名引入破坏性改动。

## 状态与本地存储

当前本地存储用于模拟：

1. 申请草稿：`open-ehr-mobile:form-drafts`。
2. 申请提交：`open-ehr-mobile:form-submissions`。
3. 审批详情：`open-ehr-mobile:approval-detail-state:{processInstanceId}`。

后续可抽离为 composables：

1. `useLocalStorageRecord`：统一读写、异常兜底和容量限制。
2. `useToast`：统一 toast 状态、计时和清理。
3. `useFormDraft`：统一表单草稿和提交记录。

## 样式系统

全局样式位于：

```text
src/styles/tokens.css
src/styles/base.css
```

当前 token 已覆盖：

1. 色彩。
2. 字体。
3. 间距。
4. 圆角。
5. 阴影。
6. safe area。
7. 顶部栏和底部导航高度。

当前设计系统以 `--ehr-*` 语义 token 为主，继续保留 `--demo-*` 兼容别名，避免一次性破坏旧组件或第三方示例代码。

后续产品化方向：

1. 将剩余 `demo-*` class 逐步迁移到产品语义 class。
2. 用轻量图标库替换文字符号图标。
3. 统一 icon-only 控件的 `aria-label`。
4. 保持 375、390、430 宽度下无横向滚动。

## 验证脚本

```text
scripts/verify-open-source.mjs
scripts/playwright-smoke.mjs
```

`verify-open-source.mjs` 负责检查开源发布面，包括必需文件、敏感词、本地路径、未脱敏手机号、非示例邮箱和不应发布目录。

`playwright-smoke.mjs` 负责检查主要路由、点击流、核心交互、console error、移动端截图、横向滚动和底部动作栏遮挡。默认 `baseUrl` 为 `http://127.0.0.1:4180`，当本地服务不可达时会临时启动 Vite preview，并在测试结束后清理；如需复用 `npm run dev`，可通过 `SMOKE_BASE_URL` 指向 `5180`。

## 扩展建议

1. 接真实 API 时新增 `src/api/`，不要直接在页面里写请求逻辑。
2. 接状态管理时优先围绕申请、审批、自助三大域拆分 store。
3. UI 组件产品化应先从 Shell、Section、ListCard、FormPage、Timeline、Toast 开始。
4. 截图资产如需进入公开文档，应放入 `docs/assets/` 或 `public/`。
