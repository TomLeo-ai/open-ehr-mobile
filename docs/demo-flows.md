# 演示路径

本文件用于说明 Open EHR Mobile 的推荐演示路径。所有流程均为纯前端 mock，不会发起真实网络请求。

## 演示前准备

```shell
npm install
npm run dev
```

打开：

```text
http://127.0.0.1:5180
```

建议使用移动端视口查看，例如 `390x844`。

## 推荐路径 1：首页总览

入口：

```text
/home
```

检查点：

1. 员工身份卡展示姓名、工号、部门、岗位和状态。
2. 待办审批、我的流程、我的草稿统计可点击跳转。
3. 业务导览入口可跳转到 `/demo-checklist`。
4. 快捷申请可进入证明、考勤异常和离职申请。
5. 自助查询可进入个人信息、薪资、休假和联系人。

## 推荐路径 2：申请中心

入口：

```text
/apply
```

检查点：

1. 常用流程展示在职/收入证明、内部推荐奖励、居住证/户籍办理。
2. 其他流程展示考勤异常和离职申请。
3. 每个流程提供新增、详情、重发起三个入口。

重点路由：

```text
/apply/on-job
/apply/on-job/detail/CERT-20260601-001
/apply/on-job/reissue/CERT-20260601-001
/apply/attendance-exception/detail/ATT-20260601-001
/apply/resignation/detail/OFFBOARD-20260601-001
```

可验证交互：

1. 新增表单点击保存草稿，应出现草稿反馈。
2. 新增表单点击提交申请，应出现提交流程反馈。
3. 详情模式点击附件，应出现附件预览反馈。
4. 重发起模式字段应恢复可编辑状态。

## 推荐路径 3：审批中心

入口：

```text
/approval/todo
```

检查点：

1. 顶部 tab 可切换待办、已办、我的流程、草稿。
2. 列表卡片可进入审批详情。
3. 摘要卡展示待办、已办、草稿数量。

重点路由：

```text
/approval/todo
/approval/done
/approval/my-process
/approval/draft
/approval/detail/todo-001
```

可验证交互：

1. 审批意见为空时点击驳回，应出现校验反馈。
2. 点击快捷意见后，意见框应自动填充。
3. 点击同意，应更新状态和时间线。
4. 点击转办或加签，应更新当前节点和流程状态。
5. 底部操作栏在移动端不应遮挡正文内容。

## 推荐路径 4：员工自助

入口：

```text
/self-service
```

检查点：

1. 自助入口覆盖个人信息、薪资、打卡、休假、异常撤回、年度结果、联系人。
2. 近期查询按钮可触发反馈。
3. 底部导航可从自助回到首页、申请和审批。

重点路由：

```text
/self-service/profile
/self-service/salary
/self-service/attendance
/self-service/vacation
/self-service/cancellation
/self-service/summary-result
/self-service/contact-book
```

可验证交互：

1. 薪资页面可切换月份、查看明细、触发下载反馈。
2. 考勤页面可筛选异常并打开详情。
3. 休假页面可切换假期类型并刷新余额。
4. 异常撤回页面可打开详情并发起撤回。
5. 联系人页面可搜索、打开详情并复制信息。

## 推荐路径 5：业务导览

入口：

```text
/demo-checklist
```

检查点：

1. 展示关键页面数量、已覆盖数量和重点流程数量。
2. 按首页、申请、审批、自助列出推荐演示路径。
3. 每个条目可直接跳转到对应页面。

## 自动化验证

默认 smoke 面向生产预览服务。推荐先构建，再直接运行 smoke；脚本会在 `http://127.0.0.1:4180` 不可达时自动启动临时 Vite preview，并在测试结束后清理：

```shell
npm run build
npm run test:smoke
```

如需人工预览页面，可单独启动 `4180` 端口：

```shell
npm run preview
```

如果使用 `npm run dev` 的 `5180` 端口运行页面，并希望 smoke 复用该服务，请显式指定 smoke 基础地址。推荐使用 `SMOKE_BASE_URL`；`EHR_BASE_URL` 和 `DEMO_BASE_URL` 会继续作为兼容别名：

```shell
# PowerShell
$env:SMOKE_BASE_URL="http://127.0.0.1:5180"; npm run test:smoke

# Bash / zsh
SMOKE_BASE_URL=http://127.0.0.1:5180 npm run test:smoke
```

脚本会覆盖：

1. 主要路由加载。
2. 关键点击流。
3. 核心交互反馈。
4. console error。
5. 移动端横向滚动。
6. 底部操作栏遮挡。
7. `375x812`、`390x844`、`430x932` 三组路由截图输出；点击流和核心交互默认使用 `390x844`。

截图默认输出到 ignored 的 `output/playwright/`，只用于本地验证。公开文档截图应放入 `docs/assets/` 或 `public/`。
