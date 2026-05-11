---
name: growth-orchestrator
description: 当需要制定增长策略或系统化推进增长时使用。增长策略总指挥官，先诊断增长模式，再按需调度获客/激活/留存/变现子编排器。关键词：增长策略、增长模式、AARRR、增长飞轮、增长体系。
metadata:
  module: "产品增长与运营"
  sub-module: "增长模式"
  type: "orchestrator"
  version: "4.0"
---

# 增长策略总指挥官

## 核心原则

**先诊断模式，再分发执行**

增长不是盲目堆渠道，而是先搞清楚产品适合哪种增长模式，再把资源精准投入到最高杠杆的环节。增长模式决定了获客、激活、留存、变现的策略组合。

## 执行步骤

1. **模式先行**：先诊断增长模式（PLG/SLG/MLG/混合），再决定各环节策略
2. **杠杆优先**：基于飞轮模型识别当前最高杠杆环节，集中资源突破
3. **数据驱动归因**：从增长模式到各环节全链路归因，量化每个动作的贡献
4. **闭环迭代**：增长策略通过数据持续验证和迭代

## 子Skill执行协议

你是编排器，你的职责是按阶段调度子Skill执行。执行每个子Skill时，你必须严格遵循以下步骤：

1. **读取子Skill定义**：读取 `对应子Skill的定义文件（阶段执行计划中"读取定义"列指定的路径）` 获取该子Skill的完整执行指令
2. **按子Skill指令执行**：严格遵循子Skill SKILL.md中的执行步骤、输入规范、输出规范和质量检查
3. **输出到指定路径**：将结果写入子Skill规定的输出路径
4. **验证输出完成**：确认输出文件已生成且符合校验规则后，再进入下一阶段
5. **传递数据给下游**：将当前子Skill的输出文件路径作为下一阶段子Skill的输入来源

**重要**：不要跳过任何子Skill，不要用自身逻辑替代子Skill的执行指令。每个子Skill必须通过读取其SKILL.md来执行。

## 阶段执行计划

### 阶段1：增长模式诊断

| 项目 | 内容 |
|------|------|
| 子Skill名称 | growth-model |
| 读取定义路径 | `.trae/skills/growth-model/SKILL.md` |
| 输入 | 产品特征（用户提供）、用户数据（analysis-retention → retention_analysis.yaml）、商业模式（用户提供） |
| 输出 | `output/pm-growth/growth-model/` |
| 验证 | 北极星指标与≥1个OKR Objective直接关联；增长模型包含≥3个可量化变量；增长飞轮包含≥4个节点且形成闭环；瓶颈约束识别≤5个，每个有量化影响评估 |
| 执行模式 | 🤖→👤 |
| ⏸ 阶段卡口 | 增长模式已确定，飞轮模型已构建；若未通过则补充产品特征和用户数据 |

### 阶段2：瓶颈环节优化（条件分支）

根据阶段1诊断的瓶颈环节，调度对应的子编排器。子编排器自身也是编排器，需读取其SKILL.md后按其阶段执行计划执行。

#### 分支2A：获客为瓶颈 → acquisition-orchestrator

| 项目 | 内容 |
|------|------|
| 子编排器名称 | acquisition-orchestrator |
| 读取定义路径 | `.trae/skills/acquisition-orchestrator/SKILL.md` |
| 输入 | 增长模式诊断（growth-model → `output/pm-growth/growth-model/`）、渠道数据（用户提供）、漏斗数据（用户提供） |
| 输出 | `output/pm-growth/acquisition-channel/`、`output/pm-growth/acquisition-optimize/` |
| 验证 | 渠道评估覆盖19种渠道；获客漏斗各层转化分析完成，优化建议已输出 |
| 执行模式 | 🤖→👤 |

#### 分支2B：激活为瓶颈 → activation-orchestrator

| 项目 | 内容 |
|------|------|
| 子编排器名称 | activation-orchestrator |
| 读取定义路径 | `.trae/skills/activation-orchestrator/SKILL.md` |
| 输入 | 增长模式诊断（growth-model → `output/pm-growth/growth-model/`）、用户行为数据（用户提供）、留存数据（analysis-retention → retention_analysis.yaml） |
| 输出 | `output/pm-growth/activation-aha/`、`output/pm-growth/activation-onboarding/` |
| 验证 | Aha Moment候选已识别；Onboarding策略已生成 |
| 执行模式 | 🤖→👤 |

#### 分支2C：留存为瓶颈 → retention-orchestrator

| 项目 | 内容 |
|------|------|
| 子编排器名称 | retention-orchestrator |
| 读取定义路径 | `.trae/skills/retention-orchestrator/SKILL.md` |
| 输入 | 增长模式诊断（growth-model → `output/pm-growth/growth-model/`）、用户行为数据（用户提供）、流失历史数据（用户提供） |
| 输出 | `output/pm-growth/retention-churn/`、`output/pm-growth/retention-engagement/` |
| 验证 | 流失预警模型已构建；用户分层已完成 |
| 执行模式 | 🤖→👤 |

#### 分支2D：变现为瓶颈 → revenue-orchestrator

| 项目 | 内容 |
|------|------|
| 子编排器名称 | revenue-orchestrator |
| 读取定义路径 | `.trae/skills/revenue-orchestrator/SKILL.md` |
| 输入 | 增长模式诊断（growth-model → `output/pm-growth/growth-model/`）、付费漏斗数据（用户提供）、收入数据（用户提供） |
| 输出 | `output/pm-growth/revenue-funnel/`、`output/pm-growth/revenue-nrr/`、`output/pm-growth/revenue-upsell/` |
| 验证 | 付费漏斗分析完成；NRR追踪已建立 |
| 执行模式 | 🤖→👤 |

> **多瓶颈场景**：若多个环节均为瓶颈，按飞轮顺序依次调度子编排器（获客→激活→留存→变现）。

### 阶段3：增长策略报告

| 项目 | 内容 |
|------|------|
| 子Skill名称 | growth-strategy-report |
| 读取定义路径 | `.trae/skills/growth-strategy-report/SKILL.md` |
| 输入 | 增长模式诊断（growth-model → `output/pm-growth/growth-model/`）、获客方案（acquisition-channel/acquisition-optimize → `output/pm-growth/acquisition-channel/`、`output/pm-growth/acquisition-optimize/`，可选）、激活方案（activation-aha/activation-onboarding → `output/pm-growth/activation-aha/`、`output/pm-growth/activation-onboarding/`，可选）、留存方案（retention-churn/retention-engagement → `output/pm-growth/retention-churn/`、`output/pm-growth/retention-engagement/`，可选）、变现方案（revenue-funnel/revenue-nrr/revenue-upsell → `output/pm-growth/revenue-funnel/`、`output/pm-growth/revenue-nrr/`、`output/pm-growth/revenue-upsell/`，可选）、业务目标（用户提供，可选） |
| 输出 | `output/pm-growth/growth-strategy-report/growth-strategy-report.md`、`output/pm-growth/growth-strategy-report/growth-strategy-report.json` |
| 验证 | 飞轮模型完整性（至少3个节点+2条因果关系）；策略与瓶颈一致；路线图可执行；漏斗数据完整（AARRR至少3个环节有数据） |
| 执行模式 | 🤖→👤 |
| ⏸ 阶段卡口 | 增长策略报告经人类确认；若未通过则调整策略方向和执行路线图 |

### 附加阶段A：GTM策略（按需触发）

| 项目 | 内容 |
|------|------|
| 子Skill名称 | gtm-strategy |
| 读取定义路径 | `.trae/skills/gtm-strategy/SKILL.md` |
| 输入 | 产品定位（positioning-statement，可选）、差异化策略（positioning-differentiation，可选）、商业模式（business-model-canvas，可选）、定价方案（business-pricing，可选）、增长模式（growth-model → `output/pm-growth/growth-model/`）、产品信息（用户提供） |
| 输出 | `output/pm-growth/gtm-strategy/gtm-strategy.md`、`output/pm-growth/gtm-strategy/gtm-strategy.json` |
| 验证 | ICP画像具体（至少包含行业、规模、角色3个维度）；上市路径有依据；渠道预算可执行；成功指标可量化 |
| 执行模式 | 🤖→👤 |
| 触发条件 | 新产品上市 / 市场拓展 |

### 附加阶段B：产品运营手册（按需触发）

| 项目 | 内容 |
|------|------|
| 子Skill名称 | product-operations-manual |
| 读取定义路径 | `.trae/skills/product-operations-manual/SKILL.md` |
| 输入 | 增长模式（growth-model → `output/pm-growth/growth-model/`，可选）、激活策略（activation-onboarding → `output/pm-growth/activation-onboarding/`，可选）、留存策略（retention-engagement → `output/pm-growth/retention-engagement/`，可选）、变现策略（revenue-funnel → `output/pm-growth/revenue-funnel/`，可选）、产品信息（用户提供） |
| 输出 | `output/pm-growth/product-operations-manual/product-operations-manual.md`、`output/pm-growth/product-operations-manual/product-operations-manual.json` |
| 验证 | SOP可执行；分层策略完整（至少覆盖新/活跃/沉默/流失4类用户）；应急流程可操作（P0-P3均有响应SLA和升级路径）；模板可直接使用 |
| 执行模式 | 🤖→👤 |
| 触发条件 | 运营手册制定需求 |

## 调度规则

- 执行子Skill前必须先读取其SKILL.md定义文件
- 每次只执行当前阶段需要的子Skill，完成后再执行下一阶段，不要一次性执行所有子Skill
- 每个阶段完成后，将中间结果写入 `output/pm-growth/{当前阶段子Skill名称}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件
- 子编排器（acquisition/activation/retention/revenue-orchestrator）按瓶颈条件分支调度，多瓶颈按飞轮顺序依次执行

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 增长模式诊断完成 | 增长模式已确定，飞轮模型已构建 | 补充产品特征和用户数据 |
| 瓶颈环节已识别 | 至少1个瓶颈环节已定位 | 延长分析周期或扩大数据范围 |
| 增长策略报告已确认 | 增长策略报告经人类确认 | 调整策略方向和执行路线图 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 增长模式确认 | growth-model诊断完成 | 确认最终增长模式（PLG/SLG/MLG/混合） |
| 瓶颈优先级确认 | 瓶颈环节识别完成 | 确认资源分配优先级 |
| 飞轮模型确认 | 飞轮模型构建完成 | 确认飞轮节点和因果关系 |
| 增长策略报告确认 | growth-strategy-report生成完成 | 确认策略方向和执行路线图 |
| GTM策略确认 | gtm-strategy生成完成 | 确认上市路径和渠道策略 |
| 运营手册确认 | product-operations-manual生成完成 | 确认运营SOP和应急流程 |

## 变更记录

- v1.0: 初始版本
- v2.0: 结构优化
- v3.0: 新增 growth-strategy-report（增长策略报告）、gtm-strategy（Go-to-Market策略）、product-operations-manual（产品运营手册）
- v4.0: 编排器优化——任务调度改为阶段执行计划，新增子Skill执行协议，调度规则改为执行模式，阶段卡口和人类决策点改为表格，条件分支子编排器说明
