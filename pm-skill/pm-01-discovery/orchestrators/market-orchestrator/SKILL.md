---
name: market-orchestrator
description: 当需要执行完整的市场与竞品分析流程时使用。市场竞品指挥官，调度market-tam-som/pest/competitor-analysis。关键词：市场分析、竞品分析、TAM/SAM/SOM、PEST、竞品情报、四象限、市场规模、行业分析、竞争对手、竞品调研。
metadata:
  module: "产品探索与发现"
  sub-module: "市场竞品"
  type: "orchestrator"
  version: "9.0"
  domain_tags: ["通用"]
  trigger_examples:
    - "帮我分析一下市场"
    - "看看竞品都在做什么"
    - "评估一下市场规模"
    - "做一下竞品调研"
    - "分析一下行业趋势"
---

# 市场竞品指挥官

## 核心原则

1. **市场是动态生态系统**——市场不是静态的赛场，竞品在流动、用户在迁移、技术在演进，编排器确保分析结果标注时效性，建议复评周期
2. **宏观微观交叉验证**——TAM/PEST是宏观视角，competitor-analysis是微观视角，必须整合宏观微观才输出结论，单一视角结论不可信
3. **并行采集串行整合**——TAM与PEST可并行采集，competitor-analysis依赖宏观输入，有依赖的步骤必须串行
4. **人类验证关键节点**——TAM双路径差异>20%时人类判断、竞品战略推断低置信度时人类验证、差异化策略优先级人类确认

## 编排协议

> 协议源头：[orchestrator-protocol.md](../../../../templates/orchestrator-protocol.md)（仅供维护者追踪，本文件已内联完整协议内容，可独立使用）

你是编排器，职责是**按阶段调度子Skill执行**，而非代理执行子Skill逻辑。严格遵循以下协议：

### 调用规则

1. **双模式调用**：平台支持 Skill 工具时，显式调用子Skill；平台不支持时，按子Skill的 `name`、输入契约、输出契约和阶段卡口执行兼容调度。
2. **不代理扩写**：兼容调度时不得把子Skill内部方法论复制进编排器上下文，也不得改写子Skill逻辑；只传递必要输入、输出路径和验证条件。
3. **契约驱动**：只关注子Skill的输入契约、输出契约和验证条件，不关注内部实现细节。
4. **状态传递**：将当前阶段的输出作为下一阶段的输入，通过文件路径和 artifact index 传递数据。
5. **验证后推进**：每个阶段输出验证通过后，才推进到下一阶段。
6. **阶段总结（强制）**：Pipeline 所有 stages 执行完成后，**必须立即**执行 `post_pipeline` 中定义的阶段总结动作，生成总结文档。这不是可选步骤，若未生成阶段总结，编排器执行视为未完成。
7. **跨子Skill交叉验证**：当多个子Skill的产出之间存在一致性约束时，编排器可在阶段间执行交叉验证（读取多份产出比对一致性），这属于编排器的协调职责而非代理执行子Skill逻辑。交叉验证规则在编排器SKILL.md中显式定义。

### 上下文管理

- 每个子Skill调用完成后，只保留**输出文件路径**和**关键结论摘要**
- 详细输出写入 `output/{领域路径}/{skill-name}/` 目录
- 若上下文接近上限，优先保留当前阶段内容和待执行阶段的子Skill名称

### 阶段卡口标准

编排器的阶段卡口只校验以下3类条件，不深入子Skill内部字段：

| 卡口类型 | 校验内容 | 示例 |
|----------|----------|------|
| 输出存在性 | 输出文件已生成且非空 | "api-design-spec输出文件已生成" |
| 顶层结构完整性 | JSON顶层必填字段存在 | "prd.json包含features/pages/entities" |
| 人类决策确认 | 关键决策点已获人类确认 | "设计审查人类确认通过" |

### 通用异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 阶段总结生成失败 | 基于已完成的子Skill输出生成部分总结，缺失项标注"数据缺失"，不阻塞编排完成 |
| 关键决策点未获人类确认 | 暂停编排，输出待确认事项清单，等待人类确认后继续 |
| 上游数据缺失 | 标注缺失数据项，使用合理假设填充（标注置信度≤0.3），继续执行并在输出中高亮标注 |
| 所有上游数据全部缺失 | 标注"全数据缺失"状态，输出最小化模板，整体置信度设为0.3，强制人类确认是否继续 |

## Pipeline 定义

```yaml
pipeline: market-orchestrator
version: 9.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-discovery/market-orchestrator.md

stages:
  - id: phase-1
    name: "并行采集"
    skills:
      - market-tam-som
      - market-pest
    gate:
      condition: "tam-som.json + pest.json 均已生成且验证通过"
      fail_action: "补充品类关键词和目标市场信息或检查子Skill执行结果"

  - id: phase-2
    name: "竞品分析"
    depends_on: [phase-1]
    skills: [market-competitor-analysis]
    gate:
      condition: "执行摘要包含3条核心发现+Top1策略，四象限已填充，Feature Matrix已更新"
      fail_action: "检查竞品列表是否充分或上游数据是否完整"
```

## 阶段执行计划

### 阶段1：并行采集

#### 调用 market-tam-som

```
Skill: market-tam-som
输入:
  category_keywords: 用户提供（品类关键词）
  target_market: 用户提供（目标市场地理范围）
  time_range: 用户提供（测算时间范围）
输出: output/pm-discovery/market-tam-som/tam-som.json
验证: tam/sam/som三层测算完整，每层含区间估计（乐观/中性/保守），关键假设已标注
模式: 🤖→👤
```

#### 调用 market-pest

```
Skill: market-pest
输入:
  category_keywords: 用户提供（品类关键词）
  target_market: 用户提供（目标市场）
输出: output/pm-discovery/market-pest/pest.json
验证: political/economic/social/technological四维度均已扫描，每维度至少3条趋势摘要
模式: 🤖
```

⏸ **阶段卡口**：tam-som.json + pest.json 均已生成且验证通过 → 未通过：补充品类关键词和目标市场信息或检查子Skill执行结果

### 阶段2：竞品分析

#### 调用 market-competitor-analysis

```
Skill: market-competitor-analysis
输入:
  competitor_list: 用户提供（竞品列表）
  category_keywords: 用户提供（品类关键词）
  monitor_config: 用户提供（监控配置，可选）
  tam_som_ref: output/pm-discovery/market-tam-som/tam-som.json（可选）
  pest_ref: output/pm-discovery/market-pest/pest.json（可选）
  product_info: 用户提供（自身产品信息，可选）
输出: output/pm-discovery/market-competitor-analysis/competitor-analysis.json + output/pm-discovery/market-competitor-analysis/competitor-analysis.md
验证: 执行摘要包含3条核心发现+Top1策略，四象限已填充，Feature Matrix已更新，差异化策略至少3条
模式: 🤖→👤
```

⏸ **阶段卡口**：执行摘要包含3条核心发现+Top1策略，四象限已填充，Feature Matrix已更新 → 未通过：检查竞品列表是否充分或上游数据是否完整

### 阶段总结（post_pipeline）

所有子Skill执行完成后，必须生成阶段总结文档，写入 `output/phase-reports/pm-discovery/market-orchestrator.md`，包含以下6项结构（均不可为空）：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

| 参数 | 值 |
|------|-----|
| 子Skill输出路径 | output/pm-discovery/ |
| 总结输出路径 | output/phase-reports/pm-discovery/market-orchestrator.md |
| 审批记录路径 | output/approvals/{orchestrator-name}/{stage-id}.approval.json |

下游衔接:
  primary: opportunity-orchestrator（市场分析完成，基于市场规模和竞品格局定义产品机会）
  alternatives:
    - target: insight-orchestrator
      reason: 市场数据缺乏用户视角，需用户洞察补充
      condition: 市场分析结论缺乏用户需求验证时
    - target: positioning-orchestrator
      reason: 市场格局已清晰，直接进入定位策略
      condition: 竞品分析已充分，需确定差异化定位时
  special_cases:
    - target: market-competitor-analysis
      reason: 仅需竞品情报更新，无需完整市场分析
      condition: 市场规模已评估，仅需竞品动态追踪时

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 阶段1完成 | tam-som.json + pest.json 均已生成且非空 | 补充品类关键词和目标市场信息或检查子Skill执行结果 |
| 阶段2完成 | competitor-analysis.json + competitor-analysis.md 均已生成且非空 | 检查竞品列表是否充分或上游数据是否完整 |
| 阶段总结已生成 | output/phase-reports/pm-discovery/market-orchestrator.md 已生成且6项结构均非空 | 补充缺失结构项后重新生成 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| TAM/SAM/SOM关键假设验证 | market-tam-som完成 | 确认关键假设是否合理，双路径差异>20%时需人类判断 |
| 竞品战略推断验证 | market-competitor-analysis完成，战略推断置信度<0.5 | 确认竞品战略方向推断是否合理 |
| 差异化策略优先级确认 | market-competitor-analysis完成 | 确认差异化策略的优先级排序和资源分配 |
| 报告结论与行动建议审批 | market-competitor-analysis完成 | 审批竞品分析报告的最终结论和行动建议 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 阶段1某子Skill失败 | 不阻塞另一子Skill，失败子Skill使用降级方案继续，标注"降级执行" |
| tam-som.json双路径差异>30% | 标注"双路径严重分歧"，升级人类判断，report中使用中性值 |
| pest.json某维度数据完全缺失 | 使用行业基准值填充，标注"推断值"，report中标注该维度数据不完整 |
| competitor-analysis竞品列表为空 | 提示用户提供竞品列表或品类关键词，基于AI知识推断竞品，标注"竞品列表为AI推断" |
| competitor-analysis某象限为空 | 标注"该象限未识别到竞品"，建议人类提供线索，report中标注象限覆盖不完整 |
| 上游数据全部缺失 | 降级为轻量版流程：用户提供品类关键词 → 基于AI知识库生成简要竞品分析报告 |
| 阶段总结生成失败 | 基于已完成的子Skill输出生成部分总结，缺失项标注"数据缺失"，不阻塞编排完成 |
