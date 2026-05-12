---
name: opportunity-orchestrator
description: 当需要执行完整的机会识别与定义流程时使用。机会识别指挥官，调度opportunity-scoring/hmw/problem-statement/brief。关键词：机会识别、机会评分、HMW、Problem Statement、Opportunity Brief。
metadata:
  module: "产品探索与发现"
  sub-module: "机会识别"
  type: "orchestrator"
  version: "6.0"
---

# 机会识别指挥官

## 核心原则

1. **好机会是定义出来的**——机会不是客观存在等待发现的，而是通过Problem Statement定义、HMW重构、评分验证逐步定义出来的，编排器确保定义过程完整
2. **评分先于发散**——先评分确定机会优先级（scoring），再发散探索创新空间（hmw），顺序不可颠倒，否则HMW会发散到低价值方向
3. **Problem Statement是锚点**——所有HMW和Brief都锚定在Problem Statement上，Problem Statement质量不通过则后续输出不可信
4. **人类判定三个关键节点**——战略契合度评分人类判定、Problem Statement质量3次不通过人类仲裁、Brief最终决策人类审批

## 编排协议

你是编排器，职责是**按阶段调度子Skill执行**，而非代理执行子Skill逻辑。严格遵循以下协议：

### 调用规则

1. **显式调用**：使用 `Skill` 工具调用子Skill，传递输入数据，接收输出结果
2. **不代理执行**：不读取子Skill的SKILL.md来替代执行，不自行推断子Skill的内部逻辑
3. **契约驱动**：只关注子Skill的输入契约、输出契约和验证条件，不关注内部实现
4. **状态传递**：将当前阶段的输出作为下一阶段的输入，通过文件路径传递数据
5. **验证后推进**：每个阶段输出验证通过后，才推进到下一阶段
6. **阶段总结**：所有子Skill执行完成后，生成阶段总结文档，写入 `output/phase-reports/pm-discovery/opportunity-orchestrator.md`

### 上下文管理

- 每个子Skill调用完成后，只保留**输出文件路径**和**关键结论摘要**
- 详细输出写入 `output/pm-discovery/{skill-name}/` 目录
- 若上下文接近上限，优先保留当前阶段内容和待执行阶段的子Skill名称

### 阶段总结

所有子Skill执行完成后，编排器必须生成一份阶段总结文档，写入 `output/phase-reports/pm-discovery/opportunity-orchestrator.md`，包含以下结构：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

## Pipeline 定义

```yaml
pipeline: opportunity-orchestrator
version: 6.0

stages:
  - id: phase-1
    name: "机会评分"
    skills: [opportunity-scoring]
    gate:
      condition: "5个维度均已评分，战略契合度由人类判定"
      fail_action: "等待人类判定战略契合度"

  - id: phase-2
    name: "问题定义"
    depends_on: [phase-1]
    skills: [opportunity-problem-statement]
    gate:
      condition: "5项质量检查全部通过"
      fail_action: "针对未通过项定向修复重试，3次仍不通过升级人类"

  - id: phase-3
    name: "HMW发散"
    depends_on: [phase-2]
    skills: [opportunity-hmw]
    gate:
      condition: "4维度均已覆盖，总计8-12个HMW陈述"
      fail_action: "补充Problem Statement或用户研究数据"

  - id: phase-4
    name: "机会简报"
    depends_on: [phase-1, phase-2, phase-3]
    skills: [opportunity-brief]
    gate:
      condition: "证据摘要完整，关键假设可验证，人类决策项非空"
      fail_action: "补充上游数据或等待人类决策"
```

## 阶段执行计划

### 阶段1：机会评分

#### 调用 opportunity-scoring

```
Skill: opportunity-scoring
输入:
  voice_analysis: output/pm-discovery/user-research-voice-analysis/voice-analysis.json
  behavior_analysis: output/pm-discovery/user-research-behavior-analysis/behavior-analysis.json
  tam_som: output/pm-discovery/market-tam-som/tam-som.json
  competitor_intel: output/pm-discovery/market-competitor-intel/competitor-intel.json
  tech_assessment: 用户提供（可选，技术团队评估）
输出: output/pm-discovery/opportunity-scoring/opportunity-scoring.json
验证: 5个维度均已评分，战略契合度标记为needs_human=true，评分依据完整
模式: 🤖（战略契合度维度👤由人类判定）
```

### 阶段2：问题定义

#### 调用 opportunity-problem-statement

```
Skill: opportunity-problem-statement
输入:
  voice_analysis: output/pm-discovery/user-research-voice-analysis/voice-analysis.json
  behavior_analysis: output/pm-discovery/user-research-behavior-analysis/behavior-analysis.json
  persona: output/pm-discovery/user-research-user-modeling/persona.json
  jtbd: output/pm-discovery/insight-jtbd/jtbd.json
  kano: output/pm-discovery/insight-kano/kano.json
  opportunity_scoring: output/pm-discovery/opportunity-scoring/opportunity-scoring.json（可选）
输出: output/pm-discovery/opportunity-problem-statement/problem-statement.json
验证: 5项质量检查全部通过（quality_check.all_passed=true），数据支撑完整
模式: 🤖→👤
```

### 阶段3：HMW发散

#### 调用 opportunity-hmw

```
Skill: opportunity-hmw
输入:
  problem_statement: output/pm-discovery/opportunity-problem-statement/problem-statement.json
  voice_analysis: output/pm-discovery/user-research-voice-analysis/voice-analysis.json
  behavior_analysis: output/pm-discovery/user-research-behavior-analysis/behavior-analysis.json
输出: output/pm-discovery/opportunity-hmw/hmw.json
验证: 4个维度（eliminate_barriers/enhance_experience/create_value/redefine）均已覆盖，总计8-12个HMW陈述
模式: 🤖→👤
```

### 阶段4：机会简报

#### 调用 opportunity-brief

```
Skill: opportunity-brief
输入:
  voice_analysis: output/pm-discovery/user-research-voice-analysis/voice-analysis.json
  behavior_analysis: output/pm-discovery/user-research-behavior-analysis/behavior-analysis.json
  persona: output/pm-discovery/user-research-user-modeling/persona.json
  jtbd: output/pm-discovery/insight-jtbd/jtbd.json
  kano: output/pm-discovery/insight-kano/kano.json
  tam_som: output/pm-discovery/market-tam-som/tam-som.json
  competitor_intel: output/pm-discovery/market-competitor-intel/competitor-intel.json
  opportunity_scoring: output/pm-discovery/opportunity-scoring/opportunity-scoring.json
  hmw: output/pm-discovery/opportunity-hmw/hmw.json
  problem_statement: output/pm-discovery/opportunity-problem-statement/problem-statement.json
输出: output/pm-discovery/opportunity-brief/opportunity-brief.json
验证: 证据摘要3个子字段均有内容，关键假设已列出可验证性，人类决策项非空，机会评分完整
模式: 🤖→👤
```

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 阶段1完成 | opportunity-scoring.json 已生成 | 补充用户研究/市场/竞品数据或检查子Skill执行结果 |
| 战略契合度已人类判定 | strategic_fit.needs_human已由人类确认评分 | 等待人类判定战略契合度 |
| 阶段2完成 | hmw.json 已生成，4维度均已覆盖 | 补充Problem Statement或用户研究数据 |
| 阶段3完成 | problem-statement.json 已生成，quality_check.all_passed=true | 质量检查不通过则自动重试（最多3次），3次仍不通过升级人类 |
| Problem Statement质量检查通过 | 5项质量检查全部通过 | 针对未通过项定向修复重试 |
| 阶段4完成 | opportunity-brief.json 已生成，人类已做最终决策 | 补充上游数据或等待人类决策 |
| Opportunity Brief人类已决策 | human_decisions_needed中各项已确认 | 等待人类审批决策项 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 战略契合度判定 | opportunity-scoring完成 | 确认每个机会的战略契合度评分（AI仅提供分析建议，最终得分必须由人类判定） |
| Problem Statement质量检查 | opportunity-problem-statement质量检查3次不通过 | 人工审核所有尝试版本并决定最终Problem Statement |
| Opportunity Brief最终决策 | opportunity-brief完成 | 审批机会简报的结论、关键假设验证优先级和推荐下一步方案 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| opportunity-scoring战略契合度未判定 | 暂停进入阶段2，等待人类判定战略契合度评分，其余4个维度评分结果可先输出 |
| opportunity-hmw某维度未覆盖 | 标注"维度覆盖不完整"，基于已有Problem Statement补充生成该维度HMW，标注"推断补充" |
| opportunity-problem-statement质量检查3次不通过 | 升级人类仲裁，输出3次尝试版本及未通过项对比，由人类决定最终Problem Statement |
| opportunity-brief上游数据大量缺失 | 基于已有数据生成Brief，缺失字段标注"数据缺失"，证据摘要和关键假设置信度降级，建议人类补充数据后重新生成 |
| 所有上游数据全部缺失 | 降级为轻量版流程：用户口述问题 → 基于描述生成Problem Statement → 基于Problem Statement生成HMW → 输出轻量版Brief，全流程标注"数据缺失" |

## 变更记录

- v1.0: 初始版本
- v2.0: description触发词优化
- v3.0: 新增子Skill执行协议，将描述性调度改为命令式可执行步骤；新增阶段执行计划含读取路径、输入输出、验证条件；新增阶段卡口表格和人类决策点表格
- v4.0: 统一阶段执行计划为表格格式，移除数据流转图
- v5.0: 核心原则重写为4条编排理念（好机会是定义出来的/评分先于发散/Problem Statement是锚点/人类判定三节点）；移除通用4条执行步骤原则；新增异常处理表（5种异常场景）
- v6.0: 编排协议优化——将"读取子Skill定义并代理执行"改为"使用Skill工具显式调用子Skill"；新增Pipeline定义（YAML声明式执行图）；阶段执行计划改为调用指令格式；调度规则合并入编排协议
