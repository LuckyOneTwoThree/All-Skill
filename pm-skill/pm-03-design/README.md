# 模块3：产品构思与设计

## 定位

承接战略阶段的定位与路线图，将战略意图转化为具体的产品方案和可验证的原型。目标是**用最小成本验证核心假设，而非追求完美设计**。

## 何时使用

- 已完成产品战略，需要将需求转化为具体方案
- 需要发散创意并收敛为可执行的产品方案
- 需要生成PRD文档，为设计与开发提供标准化输入
- 需要设计信息架构、用户流程和原型
- 需要验证方案可行性，降低构建风险

## 子模块与编排器

| 子模块 | 编排器 | 作用 | 何时调用 |
|--------|--------|------|----------|
| 需求管理 | requirements-orchestrator | 收集、理解、排序需求，区分真需求与伪需求 | 需要系统化管理需求时 |
| 创意发散与方案构思 | ideation-orchestrator | 通过HMW、SCAMPER、逆转等方法发散创意并收敛 | 需要生成和筛选产品方案时 |
| 产品设计与原型 | design-orchestrator | 生成PRD、设计信息架构、用户流程和交互原型 | 需要将方案具象化为设计时 |
| 方案验证 | validation-orchestrator | 识别关键假设、定义MVP、设计实验、可用性测试 | 需要验证方案可行性时 |

## Pipeline Skill 清单

### 需求管理（4个）

| Skill | Pipeline | 作用 | 输入 | 输出 |
|-------|----------|------|------|------|
| requirements-collection | 1 | 收集需求并自动分类，标注置信度 | 上游战略输出、用户反馈 | requirements-collection.json |
| requirements-understanding | 2 | 深度理解需求，填充理解模板5项（场景/动机/期望/约束/优先级） | 需求列表 | requirements-understanding.json |
| requirements-prioritization | 3 | 基于RICE评分给出MoSCoW建议 | 需求理解结果、资源约束 | requirements-prioritization.json |
| requirements-srs | 4 | 需求规格说明书（SRS）：补充非功能需求、接口约束、数据约束和边界条件 | PRD、API契约、数据模型 | requirements-srs.json |

### 创意发散与方案构思（4个）

| Skill | Pipeline | 作用 | 输入 | 输出 |
|-------|----------|------|------|------|
| ideation-hmw | 4 | How Might We 问题重构，通过质量检查 | 问题陈述、需求理解 | hmw.json |
| ideation-scamper | 5 | SCAMPER创意发散，生成大量候选方案 | HMW问题、约束条件 | scamper.json |
| ideation-inversion | 6 | 逆转分析，从反面推导设计约束 | HMW问题、竞品分析 | inversion.json |
| ideation-convergence | 7 | 收敛Top5方案，深化细节和可行性 | SCAMPER方案、逆转约束 | convergence.json |

### 产品设计与原型（5个）

| Skill | Pipeline | 作用 | 输入 | 输出 |
|-------|----------|------|------|------|
| design-prd | 8 | PRD自动生成与管理，支持L/S/X三级分层，4道质量门禁 | 需求管理输出、创意发散输出 | PRD文档、质量门禁报告 |
| design-ia | 9 | 生成信息架构（IA）候选方案 | PRD文档、收敛方案 | ia.json |
| design-userflow | 10 | 设计用户流程，消除死胡同 | PRD文档、IA方案 | userflow.json |
| design-prototype | 11 | 生成交互原型，检查设计规范一致性 | 用户流程、设计规范 | prototype.json |
| design-handoff-spec | 12 | 设计交接文档：整合原型规格、设计令牌、交互规则和响应式断点，产出面向开发的设计交接清单 | 原型规格、设计令牌、IA、用户流程 | design-handoff-spec.json |

### 方案验证（4个）

| Skill | Pipeline | 作用 | 输入 | 输出 |
|-------|----------|------|------|------|
| validation-assumption-map | 12 | 识别和映射关键假设，定位最大风险假设 | 产品方案、商业模式 | assumption-map.json |
| validation-mvp | 13 | 定义MVP范围，确保占比<60% | 假设地图、需求优先级 | mvp.json |
| validation-experiment | 14 | 设计验证实验方案 | MVP范围、假设地图 | experiment.json |
| validation-usability | 15 | 可用性测试，问题严重程度分级 | 原型、实验方案 | usability.json |

### 交互（1个）

| Skill | Pipeline | 作用 | 输入 | 输出 |
|-------|----------|------|------|------|
| interaction-spec | 16 | 交互设计规范：包含交互状态机、动画规范、手势操作、反馈机制、无障碍交互和异常状态处理 | 用户流程、原型规格、设计交接文档 | interaction-spec.json |

## 执行顺序

```
阶段1            阶段2              阶段3                阶段4
┌──────────┐  ┌──────────────┐  ┌──────────────────┐  ┌──────────┐
│ 需求管理  │→│ 创意发散与    │→│ 产品设计与原型    │→│ 方案验证  │
│          │  │ 方案构思      │  │ PRD→IA→流程→原型  │  │          │
└──────────┘  └──────────────┘  └──────────────────┘  └──────────┘
 Pipeline 1-3     Pipeline 4-7     Pipeline 8-11      Pipeline 12-15
```

- 需求管理是起点，为创意发散提供输入
- 创意发散与方案构思依赖需求管理的输出
- PRD生成（Pipeline 8）基于需求和创意方案生成标准化需求文档，是产品设计与原型的第一步
- 产品设计（Pipeline 9-11）依赖PRD进行IA、流程和原型设计
- 方案验证依赖原型和假设地图
- 验证结果可能回溯到需求管理或创意阶段进行迭代

## 输出路径

```
output/pm-design/
├── requirements-collection/
├── requirements-understanding/
├── requirements-prioritization/
├── requirements-srs/
├── ideation-hmw/
├── ideation-scamper/
├── ideation-inversion/
├── ideation-convergence/
├── design-prd/
├── design-ia/
├── design-userflow/
├── design-prototype/
├── design-handoff-spec/
├── validation-assumption-map/
├── validation-mvp/
├── validation-experiment/
├── validation-usability/
└── interaction-spec/
```

## 阶段卡口

### 进入产品设计与原型前需满足：
- 收集完成：需求分类置信度已标注
- 理解完成：理解模板5项已填充
- 排序完成：MoSCoW人类已确认
- HMW完成：HMW通过质量检查
- 方案生成完成：至少10个候选方案
- 逆转分析完成：设计约束已生成
- 收敛完成：Top5方案已深化

### 进入方案设计（IA/流程/原型）前需满足：
- PRD生成完成：4道质量门禁全部通过

### 进入方案验证前需满足：
- IA设计完成：IA方案人类已确认
- 用户流程完成：用户流程死胡同=0
- 原型完成：原型设计规范一致性≥85%

### 进入下一模块（度量设计）前需满足：
- 假设地图完成：最大风险假设已识别
- MVP范围完成：MVP占比<60%
- 实验设计完成：实验方案人类已审核
- 可用性测试完成：问题严重程度分级合理

## 人类决策点

| 决策点 | 说明 |
|--------|------|
| 需求分类判定 | AI自动分类并标注置信度，低置信度需求由人类判定分类 |
| MoSCoW定级 | AI基于RICE评分给出MoSCoW建议，人类确认最终定级 |
| 方案最终选择 | AI生成对比矩阵和推荐，人类做最终方案选择 |
| PRD分级确认 | AI自动判断PRD层级（L/S/X），置信度<0.7时强制人类确认 |
| IA方案选择 | AI生成2-3个IA候选方案，人类选择最终方案 |
| 设计规范violation确认 | 设计规范一致性<85%时，人类判断是否接受violation |
| MVP范围确认 | AI建议MVP范围，人类审批并决定最终范围 |
| 实验方案审核 | AI设计实验方案，人类审核并批准 |
| 验证结论决策 | AI整理验证数据，人类做最终产品方案决策 |

## 核心信念

- 需求≠问题，用户描述的是解决方案不是问题本身
- 创意质量与数量正相关，早期判断是创意的敌人
- PRD是设计的起点，没有PRD就没有可执行的设计
- 设计是取舍不是堆砌，核心路径必须极致流畅
- 验证的是假设不是方案，用最小成本获取最大置信度
