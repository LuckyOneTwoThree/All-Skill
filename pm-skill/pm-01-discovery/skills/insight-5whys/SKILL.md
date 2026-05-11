---
name: insight-5whys
description: 当需要对关键痛点或问题现象进行根因深挖时使用。5Whys结构化根因分析，通过逐层追问定位可行动的根因和改进点。关键词：5Whys、根因分析、因果链、痛点深挖、原因追溯。
metadata:
  module: "产品探索与发现"
  sub-module: "需求洞察"
  type: "pipeline"
  version: "1.0"
  interaction_mode: "ai_suggest_human_approve"
---

# 5 Whys结构化根因分析

## 核心原则

1. **数据优先人工补充**——AI处理大规模数据，人类补充定性洞察
2. **显式规则拒绝模糊**——所有分类/判断规则必须可编码
3. **批量并行规模优势**——能并行的步骤不串行
4. **标注置信度分级交付**——所有推断标注置信度，<0.3终止追问，0.3-0.7升级人类验证，≥0.7自动通过

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 待分析的问题现象 | JSON | 是 | output/pm-discovery/insight-jtbd/jtbd.json / 用户提供 | 待分析的问题现象描述，含痛点指标与趋势 |

### Input JSON 示例结构

```json
{
  "phenomenon": {
    "description": "用户在注册流程第3步大量放弃",
    "source": "jtbd.json - Functional Job: 快速完成表单填写",
    "metrics": {
      "drop_off_rate": 0.35,
      "affected_users": 1200,
      "trend": "近30天上升12%"
    }
  }
}
```

## 执行步骤

### Round 1: 为什么会出现[现象]？

- 基于问题现象，生成原因假设列表Top3
- 按可能性从高到低排序
- 每个原因标注：
  - **数据支撑度**：是否有数据可验证该原因（高/中/低）
  - **置信度**：0-1.0，基于数据支撑度和逻辑合理性
- 输出格式：
  ```json
  {
    "round": 1,
    "question": "为什么用户在注册流程第3步大量放弃？",
    "answers": [
      {
        "answer": "第3步需要填写过多非必要信息",
        "likelihood_rank": 1,
        "evidence": "表单字段数12个，行业平均5个",
        "data_support": "high",
        "confidence": 0.85
      },
      {
        "answer": "第3步加载速度过慢",
        "likelihood_rank": 2,
        "evidence": "页面平均加载时间4.2秒",
        "data_support": "medium",
        "confidence": 0.6
      },
      {
        "answer": "用户在第3步遇到理解困难",
        "likelihood_rank": 3,
        "evidence": "客服咨询记录中3次提及",
        "data_support": "low",
        "confidence": 0.4
      }
    ]
  }
  ```

### Round 2-N: 对上一轮Top1原因追问为什么

- 取上一轮likelihood_rank=1的原因作为追问对象
- 生成子原因列表Top3
- 有数据可验证时，自动查询相关数据
- 重复追问直到满足终止条件

### 终止条件（满足任一即停止）

| 条件 | 说明 |
|---|---|
| 达到第5层 | 已进行5轮追问 |
| 原因已触及不可再分根因 | 如"系统架构限制"、"组织流程问题"等不可再细化的原因 |
| 连续2层置信度 < 0.3 | 推断链可信度不足，需人类介入 |
| 已找到可行动改进点 | 根因已明确且可转化为具体行动 |

## 输出

输出文件：`output/pm-discovery/insight-5whys/5whys.json`

**输出Schema**：

```json
{
  "type": "object",
  "required": ["phenomenon", "chain", "root_cause", "actionable_fix"],
  "properties": {
    "phenomenon": {"type": "object", "description": "待分析的问题现象描述及指标"},
    "chain": {"type": "array", "description": "逐层追问的因果链"},
    "root_cause": {"type": "string", "description": "定位到的根本原因"},
    "actionable_fix": {"type": "object", "description": "可行动的改进建议"},
    "needs_human_validation": {"type": "boolean", "description": "是否需要人工验证"},
    "validation_notes": {"type": "string", "description": "验证说明备注"}
  }
}
```

### Output JSON 格式

```json
{
  "phenomenon": {
    "description": "用户在注册流程第3步大量放弃",
    "source": "jtbd.json",
    "metrics": {
      "drop_off_rate": 0.35,
      "affected_users": 1200
    }
  },
  "chain": [
    {
      "round": 1,
      "question": "为什么用户在注册流程第3步大量放弃？",
      "answer": "第3步需要填写过多非必要信息",
      "evidence": "表单字段数12个，行业平均5个",
      "confidence": 0.85
    },
    {
      "round": 2,
      "question": "为什么第3步需要填写过多非必要信息？",
      "answer": "产品需求将所有字段设为必填，未区分必要与非必要",
      "evidence": "需求文档PRD-2024-031中所有字段标记为必填",
      "confidence": 0.8
    },
    {
      "round": 3,
      "question": "为什么产品需求将所有字段设为必填？",
      "answer": "业务方希望一次性收集完整用户画像数据",
      "evidence": "业务方需求评审会议记录",
      "confidence": 0.7
    },
    {
      "round": 4,
      "question": "为什么业务方希望一次性收集完整数据？",
      "answer": "缺乏分阶段收集数据的策略，将注册流程当作唯一的数据收集窗口",
      "evidence": "推断：未发现渐进式数据收集的产品设计",
      "confidence": 0.5
    }
  ],
  "root_cause": "缺乏分阶段收集数据的策略，将注册流程当作唯一的数据收集窗口，导致注册步骤过重",
  "actionable_fix": {
    "description": "实施渐进式数据收集策略，注册流程仅保留核心必填字段（3-5个），其余字段在后续使用中逐步收集",
    "effort": "medium",
    "impact": "high",
    "suggested_metrics": ["注册完成率提升", "第3步放弃率下降"]
  },
  "needs_human_validation": false,
  "validation_notes": "推断链置信度逐步降低但均在0.3以上，根因有数据支撑，可行动建议已给出"
}
```

## 决策规则

| 规则 | 条件 | 动作 |
|---|---|---|
| 连续低置信度终止 | 连续2层置信度 < 0.3 | 终止追问，标记needs_human_validation=true，升级人类验证 |
| 单层低置信度升级 | 某层置信度 0.3-0.7 | 标记该层需人类验证，继续追问但标注"推断链可信度降低" |
| 置信度正常 | 某层置信度 ≥ 0.7 | 自动通过，继续追问 |
| 长推断链升级 | 推断链超过3步 | 升级验证中间环节，建议人类确认因果链的合理性 |
| 无数据支撑降级 | 某层原因无任何数据支撑 | 该层置信度上限设为0.5，标注"缺乏数据支撑" |
| 多根因情况 | Top1和Top2原因置信度差距 < 0.1 | 分叉为两条因果链并行分析 |

## 质量检查

- [ ] 因果链完整（从现象到根因逻辑连贯）
- [ ] 根因有数据支撑（至少1条evidence）
- [ ] 可行动建议已给出（actionable_fix非空）
- [ ] 每层置信度已标注
- [ ] 终止条件已明确记录
- [ ] 低置信度环节已标记验证需求

---

## 降级策略

当上游文件不存在时，本Skill仍可独立执行：

| 缺失的上游文件 | 降级方案 |
|---------------|---------|
| 无强依赖 | 本Skill可独立运行，用户描述问题现象即可直接执行5Whys分析 |
| jtbd.json（可选） | 用户直接描述问题现象 → 执行5Whys，标注"缺乏JTBD数据关联" |
| 所有上游文件均缺失 | 基于用户口头描述的问题现象直接执行5Whys根因分析 |

数据获取说明：
- 本Skill需要问题现象描述，请通过以下方式之一提供：
  1. 直接描述问题现象和已知数据
  2. 上传jtbd.json文件（可选）
  3. 提供数据文件路径
- AI不负责外部数据采集，仅负责分析
