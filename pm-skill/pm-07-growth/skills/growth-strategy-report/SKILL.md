---
name: growth-strategy-report
description: 当需要将增长模式诊断和各环节优化方案汇总为完整可交付的增长策略报告时使用。增长策略报告自动生成，包含增长模式评估、AARRR漏斗诊断、杠杆策略、飞轮模型和执行路线图。关键词：增长策略报告、增长报告、AARRR报告、增长飞轮、增长路线图。
metadata:
  module: "产品增长与运营"
  sub-module: "增长模式"
  type: "pipeline"
  version: "2.0"
  interaction_mode: "ai_suggest_human_approve"
---

# 增长策略报告生成

## 核心原则

**增长策略报告是行动蓝图，不是数据看板**

增长策略报告的核心价值在于将分散的增长诊断和各环节优化方案整合为一份可执行的增长蓝图。报告回答的不是"数据是什么"，而是"我们应该在哪里投入、投入多少、预期什么回报"。

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 来源 | 必需 | 说明 |
|--------|------|------|------|
| 增长模式诊断 | growth-model | ✅ | 增长模式、飞轮模型、瓶颈环节 |
| 获客方案 | acquisition-channel / acquisition-optimize | ⬜ | 渠道评估、漏斗优化 |
| 激活方案 | activation-aha / activation-onboarding | ⬜ | Aha Moment、Onboarding优化 |
| 留存方案 | retention-churn / retention-engagement | ⬜ | 流失预警、分层运营 |
| 变现方案 | revenue-funnel / revenue-nrr / revenue-upsell | ⬜ | 付费漏斗、NRR、增购 |
| 业务目标 | 用户提供 | ⬜ | 北极星指标、增长目标、预算约束 |

## 执行步骤

### Step 1：增长模式评估

从增长模式诊断结果提炼核心判断：

1. **增长模式识别**：PLG / SLG / MLG / 混合模式及判定依据
2. **飞轮模型构建**：飞轮节点、因果关系、增强回路、当前转动状态
3. **瓶颈定位**：当前最大瓶颈环节及量化依据
4. **增长阶段判断**：冷启动 / 起飞 / 规模化 / 成熟期

### Step 2：AARRR 漏斗诊断

整合各环节分析结果，构建全链路漏斗视图：

1. **获客漏斗**：曝光→点击→注册→激活，各环节转化率与行业基准对比
2. **激活漏斗**：注册→Aha Moment→核心功能使用，时间衰减分析
3. **留存曲线**：D1/D7/D30留存率，留存曲线形态（幂律/指数/对数）
4. **变现漏斗**：免费→试用→付费→续费→增购，各环节ARPU贡献

### Step 3：杠杆策略整合

基于瓶颈定位和各环节方案，整合杠杆策略：

1. **高杠杆策略**（投入产出比最高）：Top 3 策略 + 预期影响 + 所需资源
2. **中杠杆策略**（稳健增长）：补充策略 + 预期影响
3. **防御策略**（防止下滑）：风险缓解 + 预警指标
4. **策略优先级矩阵**：按影响×可行性排序

### Step 4：执行路线图

将策略转化为可执行的路线图：

1. **Quick Wins**（0-2周）：低投入高回报的即时行动
2. **核心优化**（2-8周）：关键杠杆的系统性优化
3. **长期投资**（8周+）：飞轮加速的基础设施建设
4. **里程碑与指标**：每个阶段的关键里程碑和验收指标

### Step 5：报告组装

将以上内容组装为完整报告。

## 输出

### 输出文件

| 文件 | 路径 | 说明 |
|------|------|------|
| 增长策略报告 | `output/pm-growth/growth-strategy-report/growth-strategy-report.md` | 人类可读的完整报告 |
| 结构化数据 | `output/pm-growth/growth-strategy-report/growth-strategy-report.json` | 机器可消费的结构化数据 |

**输出Schema**：

```json
{
  "type": "object",
  "required": ["product_name", "growth_model", "leverage_strategies", "roadmap"],
  "properties": {
    "product_name": {"type": "string", "description": "产品名称"},
    "report_date": {"type": "string", "description": "报告日期"},
    "growth_model": {"type": "object", "description": "增长模式评估，包含类型、飞轮模型和瓶颈"},
    "aarrr_funnel": {"type": "object", "description": "AARRR漏斗诊断，包含获客/激活/留存/变现"},
    "leverage_strategies": {"type": "object", "description": "杠杆策略，包含高/中/防御策略"},
    "roadmap": {"type": "object", "description": "执行路线图，包含Quick Wins/核心优化/长期投资"},
    "risks_and_assumptions": {"type": "array", "description": "风险与假设列表"}
  }
}
```

### Markdown 报告结构

```markdown
# 增长策略报告：{产品名称}

## 1. 执行摘要
- 增长模式 / 当前阶段 / 核心瓶颈 / Top 3 行动

## 2. 增长模式评估
- 增长模式识别及依据
- 飞轮模型（节点+因果关系）
- 瓶颈定位与量化

## 3. AARRR 漏斗诊断
- 获客漏斗（转化率 + 行业基准）
- 激活漏斗（Aha Moment + 时间衰减）
- 留存曲线（D1/D7/D30 + 形态分析）
- 变现漏斗（ARPU贡献分解）

## 4. 杠杆策略
- 高杠杆策略 Top 3（影响×可行性矩阵）
- 中杠杆策略
- 防御策略
- 策略优先级排序

## 5. 执行路线图
- Quick Wins（0-2周）
- 核心优化（2-8周）
- 长期投资（8周+）
- 里程碑与验收指标

## 6. 风险与假设
- 关键假设清单
- 风险缓解措施
- 监控指标与预警阈值
```

### JSON 结构

```json
{
  "product_name": "",
  "report_date": "",
  "growth_model": {
    "type": "PLG|SLG|MLG|hybrid",
    "evidence": "",
    "flywheel": {
      "nodes": [],
      "causal_links": [],
      "current_status": ""
    },
    "bottleneck": "",
    "stage": "cold_start|takeoff|scale|mature"
  },
  "aarrr_funnel": {
    "acquisition": {},
    "activation": {},
    "retention": {},
    "revenue": {}
  },
  "leverage_strategies": {
    "high": [],
    "medium": [],
    "defensive": []
  },
  "roadmap": {
    "quick_wins": [],
    "core_optimization": [],
    "long_term": []
  },
  "risks_and_assumptions": []
}
```

## 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| product_name | string | 是 | 产品名称，不可为空 |
| growth_model | object | 是 | 增长模式评估，须含type/flywheel/bottleneck |
| growth_model.type | string | 是 | 增长模式类型，仅允许PLG/SLG/MLG/hybrid |
| growth_model.flywheel.nodes | array | 是 | 飞轮节点，至少3个 |
| growth_model.bottleneck | string | 是 | 瓶颈描述，不可为空 |
| leverage_strategies | object | 是 | 杠杆策略，须含high/medium/defensive |
| leverage_strategies.high | array | 是 | 高杠杆策略，至少1条 |
| roadmap | object | 是 | 执行路线图，须含quick_wins/core_optimization/long_term |
| risks_and_assumptions | array | 否 | 风险与假设列表 |

## 质量检查

| 检查项 | 标准 | 不通过处理 |
|--------|------|------------|
| 飞轮模型完整性 | 至少3个节点+2条因果关系 | 补充飞轮节点或标注"待验证" |
| 策略与瓶颈一致 | 高杠杆策略直接针对核心瓶颈 | 调整策略或补充瓶颈分析 |
| 路线图可执行 | 每项行动有负责人、时间、验收指标 | 补充执行细节 |
| 漏斗数据完整 | AARRR至少3个环节有数据 | 标注缺失环节为"待补充" |

## 降级策略

### 上游文件缺失降级方案

| 缺失的上游输入 | 降级方案 | 输出影响 |
|----------|----------|----------|
| 无增长模式诊断 | 基于各环节方案反推增长模式，标注"模式待确认" | 增长模式为推断结论，需后续验证 |
| 仅有部分环节方案 | 仅覆盖已有数据的环节，缺失环节标注"待补充" | 报告覆盖不完整，缺失环节无策略建议 |
| 无任何上游输入 | 基于用户提供的产品信息生成增长策略框架，标注"需数据验证" | 报告为框架级，所有结论需数据验证 |
- 若用户未提供业务目标，提示用户提供或跳过该输入相关步骤

## 上游变更响应

### 上游变更影响表

| 上游来源 | 变更类型 | 影响范围 | 响应动作 |
|----------|----------|----------|----------|
| growth-model | 增长模式或瓶颈变更 | 增长模式评估和杠杆策略 | 重新评估模式，调整策略优先级 |
| acquisition-* / activation-* / retention-* / revenue-* | 优化方案更新 | AARRR漏斗诊断和策略整合 | 更新对应漏斗环节数据和策略 |
| 用户提供-业务目标 | 目标或预算变更 | 杠杆策略和执行路线图 | 重新排序策略优先级，调整路线图 |

### 下游通知机制表

| 下游消费者 | 通知条件 | 通知方式 | 通知内容 |
|------------|----------|----------|----------|
| growth-orchestrator | 报告生成完成 | 输出文件更新 | 报告完成状态和关键结论 |
| 用户提供 | 报告生成完成 | 输出文件 | 完整增长策略报告 |
