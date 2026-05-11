---
name: insight-5whys
description: 当需要对关键痛点或问题现象进行根因深挖时使用。5Whys结构化根因分析，通过逐层追问定位可行动的根因和改进点，支持多路径并行分析。关键词：5Whys、根因分析、因果链、痛点深挖、原因追溯。
metadata:
  module: "产品探索与发现"
  sub-module: "需求洞察"
  type: "pipeline"
  version: "2.0"
  interaction_mode: "ai_suggest_human_approve"
---

# 5 Whys结构化根因分析

## 核心原则

1. **现象驱动而非假设驱动**——从可观测的问题现象出发，而非先入为主的假设；每层追问必须锚定上一层回答，禁止跳跃式推断
2. **因果链可追溯**——每一层追问必须有数据或逻辑支撑，拒绝无依据跳跃；evidence字段必须引用具体数据来源或逻辑推理过程
3. **多路径探索**——不只追踪最可能原因，当Top1与Top2置信度差距<0.15时，并行分析多条因果链，避免过早收敛到错误根因
4. **终止即行动**——追问的终点不是"为什么"，而是"做什么"；根因必须转化为可行动改进点，包含effort/impact/suggested_metrics

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 待分析的问题现象 | JSON | 是 | output/pm-discovery/insight-jtbd/jtbd.json / 用户提供 | 待分析的问题现象描述，含痛点指标与趋势 |
| 痛点数据 | JSON | ○ | output/pm-discovery/insight-5whys/5whys.json 上游 | 已有的5Whys分析结果（增量分析时使用） |

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
  - **数据支撑度**：是否有数据可验证该原因（high/medium/low）
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

### Round 2-N: 对上一轮原因追问为什么

**主路径追踪**：
- 取上一轮likelihood_rank=1的原因作为追问对象
- 生成子原因列表Top3
- 有数据可验证时，自动查询相关数据
- 重复追问直到满足终止条件

**多路径分叉**（当满足分叉条件时）：
- 当上一轮Top1与Top2置信度差距 < 0.15时，同时追踪两条因果链
- 每条路径独立追问，独立评估终止条件
- 输出中通过`path_id`区分不同路径

### 终止条件（满足任一即停止）

| 条件 | 说明 |
|---|---|
| 达到第5层 | 已进行5轮追问，更深层次推断可信度不足 |
| 原因已触及不可再分根因 | 如"系统架构限制"、"组织流程问题"、"法规要求"等不可再细化的原因 |
| 连续2层置信度 < 0.3 | 推断链可信度不足，需人类介入 |
| 已找到可行动改进点 | 根因已明确且可转化为具体行动，继续追问不再产生新价值 |

## 输出

输出文件：`output/pm-discovery/insight-5whys/5whys.json`

**输出Schema**：

```json
{
  "type": "object",
  "required": ["analysis_metadata", "phenomenon", "chains", "root_cause", "actionable_fix"],
  "properties": {
    "analysis_metadata": {"type": "object", "description": "分析元数据，包含来源文件、分析时间戳和路径数"},
    "phenomenon": {"type": "object", "description": "待分析的问题现象描述及指标"},
    "chains": {"type": "array", "description": "因果链列表，支持多路径并行分析"},
    "root_cause": {"type": "string", "description": "定位到的根本原因"},
    "actionable_fix": {"type": "object", "description": "可行动的改进建议"},
    "needs_human_validation": {"type": "boolean", "description": "是否需要人工验证"},
    "validation_notes": {"type": "string", "description": "验证说明备注"}
  }
}
```

**输出校验规则**：

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| analysis_metadata | object | 是 | 分析元信息 |
| analysis_metadata.source_files | array | 是 | 数据来源文件列表 |
| analysis_metadata.total_paths | number | 是 | 因果链路径数（≥1） |
| analysis_metadata.analysis_timestamp | string | 是 | 分析时间戳(ISO8601) |
| phenomenon | object | 是 | 待分析的问题现象 |
| phenomenon.description | string | 是 | 现象描述 |
| phenomenon.metrics | object | 否 | 量化指标 |
| chains | array | 是 | 因果链列表，长度≥1 |
| chains[].path_id | string | 是 | 路径标识（如"main"/"alt-1"） |
| chains[].round | number | 是 | 追问轮次 |
| chains[].question | string | 是 | 追问问题 |
| chains[].answer | string | 是 | 回答内容 |
| chains[].evidence | string | 是 | 证据来源 |
| chains[].confidence | number | 是 | 置信度(0-1.0) |
| chains[].data_support | enum(high,medium,low) | 是 | 数据支撑度 |
| root_cause | string | 是 | 根本原因，非空 |
| actionable_fix | object | 是 | 可行动改进建议 |
| actionable_fix.description | string | 是 | 改进建议描述 |
| actionable_fix.effort | enum(low,medium,high) | 是 | 实施难度 |
| actionable_fix.impact | enum(low,medium,high) | 是 | 预期影响 |
| actionable_fix.suggested_metrics | array | 是 | 建议追踪的指标 |
| needs_human_validation | boolean | 是 | 是否需人工验证 |
| validation_notes | string | 否 | 验证说明 |

### Output JSON 格式

```json
{
  "analysis_metadata": {
    "source_files": ["jtbd.json"],
    "total_paths": 1,
    "analysis_timestamp": "ISO8601"
  },
  "phenomenon": {
    "description": "用户在注册流程第3步大量放弃",
    "source": "jtbd.json",
    "metrics": {
      "drop_off_rate": 0.35,
      "affected_users": 1200
    }
  },
  "chains": [
    {
      "path_id": "main",
      "round": 1,
      "question": "为什么用户在注册流程第3步大量放弃？",
      "answer": "第3步需要填写过多非必要信息",
      "evidence": "表单字段数12个，行业平均5个",
      "confidence": 0.85,
      "data_support": "high"
    },
    {
      "path_id": "main",
      "round": 2,
      "question": "为什么第3步需要填写过多非必要信息？",
      "answer": "产品需求将所有字段设为必填，未区分必要与非必要",
      "evidence": "需求文档PRD-2024-031中所有字段标记为必填",
      "confidence": 0.8,
      "data_support": "high"
    },
    {
      "path_id": "main",
      "round": 3,
      "question": "为什么产品需求将所有字段设为必填？",
      "answer": "业务方希望一次性收集完整用户画像数据",
      "evidence": "业务方需求评审会议记录",
      "confidence": 0.7,
      "data_support": "medium"
    },
    {
      "path_id": "main",
      "round": 4,
      "question": "为什么业务方希望一次性收集完整数据？",
      "answer": "缺乏分阶段收集数据的策略，将注册流程当作唯一的数据收集窗口",
      "evidence": "推断：未发现渐进式数据收集的产品设计",
      "confidence": 0.5,
      "data_support": "low"
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
| 多路径分叉 | Top1和Top2原因置信度差距 < 0.15 | 分叉为两条因果链并行分析，通过path_id区分 |
| 根因冲突 | 多路径定位到不同根因 | 输出所有根因及对应改进建议，由人类判断优先解决哪个 |

## 质量检查

- [ ] 因果链完整（从现象到根因逻辑连贯）
- [ ] 根因有数据支撑（至少1条evidence）
- [ ] 可行动建议已给出（actionable_fix非空，含effort/impact/suggested_metrics）
- [ ] 每层置信度已标注
- [ ] 每层数据支撑度已标注
- [ ] 终止条件已明确记录
- [ ] 低置信度环节已标记验证需求
- [ ] 多路径场景下path_id已区分

## 降级策略

当上游文件不存在时，本Skill仍可独立执行：

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 无强依赖 | 本Skill可独立运行，用户描述问题现象即可直接执行5Whys分析 | 无影响 |
| jtbd.json（可选） | 用户直接描述问题现象 → 执行5Whys，标注"缺乏JTBD数据关联" | chain起点缺乏Job关联，根因可能与用户任务脱节 |
| 所有上游文件均缺失 | 基于用户口头描述的问题现象直接执行5Whys根因分析 | 整体置信度降低，evidence依赖用户口述而非结构化数据 |

数据获取说明：
- 本Skill需要问题现象描述，请通过以下方式之一提供：
  1. 直接描述问题现象和已知数据
  2. 上传jtbd.json文件（可选）
  3. 提供数据文件路径
- AI不负责外部数据采集，仅负责分析

## 上游变更响应

当上游输入发生变更时，本Skill的响应策略：

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| jtbd.json中Job增删 | 因果链起点变化 | 标注受影响的chain条目，建议人类确认是否需要重新分析相关路径 |
| jtbd.json中Functional Job优先级调整 | Round1原因假设排序可能变化 | 标注"上游优先级已变更"，建议重新评估Round1的likelihood_rank |
| 痛点指标数据更新 | phenomenon.metrics变化 | 更新phenomenon字段，若指标趋势反转则建议重新评估根因 |

当本Skill自身变更时，对下游的通知机制：

| 变更类型 | 影响范围 | 通知方式 |
|----------|----------|----------|
| root_cause变更 | insight-priority-scoring | 标注痛点强度需重新评估 |
| actionable_fix调整 | insight-priority-scoring | 标注可解决性维度需重新评分 |
| 新增因果链路径 | insight-priority-scoring | 标注新增路径的根因需纳入优先级评估 |
