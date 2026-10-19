# AI 产品拆解 Skill

围绕真实任务分析 AI 产品的商业定位、用户旅程、人机分工、Agent 机制、模型费用及基础资源，用证据还原产品架构。

- [在线阅读](https://wanchenghhh.github.io/productbreakingdown/)
- [Skill 主文件](ai-product-teardown/SKILL.md)
- [下载 Skill 压缩包](ai-product-teardown.zip)

## 使用

将 `ai-product-teardown` 文件夹放入支持 SKILL.md 的技能目录，在对话中调用 `$ai-product-teardown` 并提供产品名称或链接、目标场景与输出格式。

示例：使用 `$ai-product-teardown` 拆解一款 AI 网页产品，实际操作并截图，区分已经明确确认和待确认核实，完成二次验证后输出 Markdown 报告。

手机 App 优先使用公开产品视频、图片和官方资料，缺少关键路径时再补充用户材料。输出可选飞书、Markdown、HTML；飞书原生写入取决于执行环境中的实际连接能力。

## 内容维护

Skill 源文件位于 `ai-product-teardown/`，网页由这些文件生成，不单独维护另一份方法论。

```sh
npm install
npm run build
```

构建会更新 `docs/` 与 Skill 压缩包。提交源文件和生成结果后推送 `main`，GitHub Pages 从 `main` 的 `/docs` 目录发布。

## 方法来源

整合 [W3D1 AI 产品拆解](https://w3d1.vercel.app/) 与思敏老师的 OiiOii Multi Agent 平台拆解材料，并加入网页与 App 取证分流、两种核实状态和二次验证流程。产品案例的模型、价格与行业数据不作为长期固定事实。
