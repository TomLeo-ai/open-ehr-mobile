# Contributing

感谢你关注 Open EHR Mobile。这个项目的目标是提供一个可公开发布、可演示、可二次开发的移动端 HR 自助与审批流程前端模板。

## 贡献范围

欢迎贡献：

1. README、产品说明、架构说明和演示路径文档。
2. Vue 3 + TypeScript 页面、组件和 mock 数据优化。
3. 移动端 UI/UX 改进，包括 safe area、触控尺寸、可访问性、空状态和错误状态。
4. Playwright smoke 脚本、开源扫描脚本和发布前质量门禁。
5. 轻量依赖改进，例如统一图标库，但需要说明收益并避免引入大型 UI 组件库。

暂不接受：

1. 新增默认后端服务、数据库、缓存或真实系统集成。
2. 提交真实员工、组织、薪资、考勤、审批或联系信息。
3. 提交本地日志、构建产物、依赖目录、内部路径、真实账号、真实邮箱、真实手机号或敏感配置。
4. 大范围无关重构，尤其是一次性改动所有页面或破坏现有路由矩阵。

## 本地开发

```shell
npm install
npm run dev
```

默认开发地址：

```text
http://127.0.0.1:5180
```

## 代码规范

1. 使用 Vue 3 Composition API 和 `<script setup>`。
2. TypeScript 类型应清晰，避免使用不必要的 `any`。
3. 组件命名使用 PascalCase，变量和方法命名使用 camelCase。
4. 样式优先使用已有 token、BEM class 和移动端 spacing 体系。
5. 页面结构应优先保持现有路由和业务域边界：`home`、`apply`、`approval`、`self-service`。
6. UI 改动需要关注 375、390、430 宽度下无横向滚动、无遮挡和可触控。

## Mock 数据规范

1. 示例邮箱使用 `example.com`。
2. 手机号必须脱敏，例如 `138****0001`。
3. 业务编号、员工姓名、组织、附件、薪资和审批记录均使用虚构示例。
4. 不提交真实内部品牌词、真实办公地点或真实客户信息。
5. 浏览器本地存储 key 使用 `open-ehr-mobile:{module}:{feature}` 风格。

## 提交前检查

提交前至少运行：

```shell
npm run verify:oss
npm run type-check
```

涉及 UI、路由、交互或 mock 数据时，还应运行：

```shell
npm run build
npm run test:smoke
```

`test:smoke` 默认访问 `http://127.0.0.1:4180`，请先运行 `npm run build && npm run preview`；如果使用开发服务器，请设置 `SMOKE_BASE_URL=http://127.0.0.1:5180` 后再执行 smoke。

## 文档贡献

文档应保持开源友好：

1. 先说明产品边界，再说明能力范围。
2. 避免营销化表达，优先写清楚可演示、可验证、可二次开发的事实。
3. 截图如需进入 README，应放入 `docs/assets/` 或 `public/`，不要依赖 ignored 的 `output/`。
4. 不写入本地路径、真实账号、真实联系方式或敏感配置。

## Pull Request 建议

1. 保持改动小而可验证。
2. 在 PR 描述中写清楚改动范围、验证命令和影响路由。
3. UI 改动建议附移动端截图或 smoke 输出摘要。
4. 不要在同一个 PR 中混合产品文档、UI 重构、业务逻辑和验证脚本大改。
