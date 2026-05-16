# Stage-E: 快速生成（express 模式专属）

仅在 `mode=express` 时执行。根据 `express_engine` 参数选择对应的 ext Skill，直接读取 PRD 和品牌规范，一步生成完整页面代码，跳过设计系统建立、令牌生成、增强-审计循环。

**引擎→Skill 映射**：

| express_engine | 调用的 ext Skill | 输入适配 |
|----------------|-----------------|---------|
| `visual` | ext-frontend-design | design_brief=PRD描述 + register + 品牌规范 |
| `ux` | ext-ui-ux-pro-max | --domain + PRD描述 + 行业关键词 |
| `polish` | ext-impeccable | Mode B内联上下文：register + 产品名称 + 产品定位 + 品牌规范 + PRD描述 + 目标框架 + 目标语言 |
| `motion` | ext-interaction-design | PRD描述 + 交互需求描述 + 目标框架 |

**polish 引擎（ext-impeccable）内联上下文说明**：

express 模式不生成 PRODUCT.md/DESIGN.md，因此必须使用 ext-impeccable 的 Mode B（Inline Context）。编排器需构建以下内联上下文传递给 ext-impeccable：
- `register`：从 PRD 描述中提取的产品核心特征
- 产品名称：从项目信息收集阶段获取（project_name）
- 产品定位：从项目信息收集阶段获取（可选，缺失时从 PRD 推断）
- 品牌规范：从项目信息收集阶段获取（可选，缺失时标注"待品牌规范补充"）
- 当前步骤产出：PRD 文本描述
- 目标语言：从项目信息收集阶段获取（默认 zh-CN）

当品牌规范或产品定位缺失时，编排器应提示用户提供，或从 PRD 文本中自动推断。

```
动作: 快速生成
触发条件: mode=express
输入:
  prd_text: output/pm-design/design-prd/prd.md（可选）或用户直接描述
  品牌规范: 用户提供（可选）
  产品定位: 用户提供（可选）
  target_framework: React/Vue/Svelte/HTML（默认React）
  target_language: 目标语言（默认zh-CN）
  project_dir: 项目根目录
  express_engine: visual/ux/polish/motion（默认visual）
  express_prompt_source: auto/manual（默认auto）
  express_prompt: 用户自行编写或从外部工具获取的prompt（仅manual模式必填）
处理流程:
  1. 根据 express_engine 选择对应的 ext Skill
  2. 根据 express_prompt_source 决定 prompt 来源：
     - auto: 编排器从 PRD + 品牌规范 + 产品定位自动生成 prompt，适配为该 Skill 的输入格式
     - manual: 编排器提示用户前往推荐的外部工具官网（如 v0.dev/Bolt/Lovable/Cursor/Framer 等），用户获取/编写 prompt 后填入 express_prompt，编排器直接传递
  3. 调用选定的 ext Skill，直接输出完整页面代码
  4. 将代码写入 {project_dir}/src/
  5. 初始化最小项目脚手架（package.json + 入口文件 + 基础配置）
  6. 执行最小质量检查：
     - WCAG AA 对比度检查（正文≥4.5:1）
     - 无硬编码密钥/token
     - npm run dev 启动成功
输出:
  {project_dir}/ — 可运行的项目（含页面代码）
验证: 页面代码已生成 + WCAG AA达标 + 无硬编码密钥 + npm run dev启动成功
模式: 🤖（auto）/ 🤖→👤→🤖（manual: 提示用户→用户填写prompt→继续执行）
```

**manual 模式超时/回退规则**：
- 编排器提示用户前往外部工具后，等待用户填写 `express_prompt`
- 若用户表示无法获取 prompt，编排器提供两个选项：
  1. 切换到 `auto` 模式（编排器自动生成 prompt）
  2. 取消 express 模式，切换到 `full` 模式执行完整流程

**express 模式限制**：
- 不生成 design tokens、visual_direction、design_brief.json
- 不经过 ext-impeccable 增强/审计
- 不支持 design_feedback 回传
- 不支持 quality_debt 追踪
- 如需后续 API 集成或生产就绪，需切换到 full 模式重新执行
