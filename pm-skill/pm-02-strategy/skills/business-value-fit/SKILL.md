---
name: business-value-fit
description: 当需要评估价值主张与用户需求的匹配度时使用。价值主张匹配度自动评估，AI自动执行，评估商业画布中的价值主张与用户痛点/收益的匹配程度。关键词：价值主张匹配、痛点覆盖、收益验证、匹配度评分、用户需要吗、价值对不对。
metadata:
  module: "产品商业与战略"
  sub-module: "商业模式设计"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["SaaS", "通用"]
  trigger_examples:
    - "我们的价值主张对不对"
    - "用户真的需要这个功能吗"
  interaction_mode: "ai_suggest_human_approve"
---

# 价值主张匹配度自动评估

## 核心原则

1. **痛点覆盖优先**——高频高严重度痛点必须被价值主张覆盖，遗漏即警告
2. **531评分标尺**——匹配度评估使用5/3/1/0四级评分，标准统一不可模糊
3. **加权计算透明**——痛点权重=频率×严重度，收益权重=重要性×满意度缺口
4. **缺口即行动**——未覆盖的痛点和收益必须附带改进建议，不可只标注不行动

**执行周期**：在Pipeline 1（商业模式画布）完成后自动触发

**核心目标**：系统性地评估价值主张与用户真实痛点和期望收益的匹配程度，识别覆盖盲区和改进机会。

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| BMC价值主张 | JSON | 是 | output/pm-strategy/business-model-canvas/bmc.json | 价值主张列表，含Pain Relievers和Gain Creators |
| 用户研究数据 | JSON | 是 | user-research-user-modeling / user-research-voice-analysis | 用户画像、痛点、期望收益、机会简报 |

### 必需输入

**BMC中的价值主张（来自Pipeline 1）：**
```json
{
  "value_propositions": [
    {
      "proposition_id": "vp-1",
      "headline": "价值主张标题",
      "description": "价值主张详细描述",
      "target_segment": "segment-1",
      "pain_relievers": ["解决的痛点1", "解决的痛点2"],
      "gain_creators": ["创造的收益1", "创造的收益2"]
    }
  ]
}
```

**探索阶段用户研究数据：**
```json
{
  "persona_summary": {
    "demographics": "人口统计特征",
    "behaviors": "用户行为特征",
    "goals": "用户目标"
  },
  "problem_statement": {
    "pains": [
      {
        "pain_id": "pain-1",
        "description": "痛点描述",
        "frequency": "出现频率",
        "severity": "严重程度",
        "urgency": "紧迫程度"
      }
    ],
    "gains": [
      {
        "gain_id": "gain-1",
        "description": "期望收益描述",
        "importance": "重要性",
        "current_satisfaction": "当前满意度"
      }
    ]
  },
  "opportunity_definition": {
    "opportunity_description": "企业培训数字化渗透率仅28%，AI个性化学习需求年增长45%",
    "evidence": ["艾瑞咨询2024企业培训市场报告", "国务院职业教育改革实施方案"]
  }
}
```

## 执行步骤

### Step 1：痛点对齐度评估

**任务**：系统性评估每个Pain Reliever与用户痛点的覆盖情况。

**评分标准（5/3/1评分）：**

| 评分 | 含义 | 判定条件 |
|------|------|----------|
| 5 | 完美覆盖 | 价值主张完全解决痛点核心，用户可显著感知 |
| 3 | 部分覆盖 | 价值主张解决痛点但非核心维度，或解决程度有限 |
| 1 | 边缘覆盖 | 价值主张与痛点关联弱，仅间接影响 |
| 0 | 未覆盖 | 价值主张未涉及该痛点 |

**执行逻辑**：
1. 遍历每个Pain Reliever
2. 与问题陈述中的每个痛点进行匹配
3. 依据评分标准确定匹配分数
4. 计算加权平均分（权重：频率×严重程度）

**输出格式：**
```json
{
  "pain_alignment": {
    "covered_pains": [
      {
        "pain_id": "pain-1",
        "pain_description": "培训效果难以量化和追踪",
        "matched_by": ["vp-1"],
        "coverage_score": 5,
        "coverage_quality": "full/partial/edge/none",
        "notes": "AI学习报告功能完全覆盖该痛点"
      }
    ],
    "uncovered_pains": [
      {
        "pain_id": "pain-5",
        "pain_description": "学员学习路径缺乏个性化",
        "frequency": "high",
        "severity": "high",
        "impact": "高频高严重度痛点'课程内容与岗位需求脱节'未被覆盖",
        "recommendation": "建议增加岗位技能图谱匹配功能"
      }
    ],
    "pain_coverage_summary": {
      "total_pains": 10,
      "fully_covered": 4,
      "partially_covered": 3,
      "uncovered": 3,
      "weighted_average_score": 3.2,
      "high_frequency_coverage_rate": "80%"
    }
  }
}
```

**验收标准**：
- 所有Pain Relievers已与痛点匹配
- 每个痛点有明确覆盖状态
- 遗漏痛点包含改进建议

### Step 2：收益创造验证

**任务**：评估Gain Creators与用户期望收益的匹配情况。

**执行逻辑**：
1. 遍历每个Gain Creator
2. 与问题陈述中的期望收益进行匹配
3. 评估收益创造的真实性和可实现性
4. 识别用户期望但未被承诺的收益

**输出格式：**
```json
{
  "gain_validation": {
    "covered_gains": [
      {
        "gain_id": "gain-1",
        "gain_description": "培训投入产出可量化",
        "created_by": ["vp-1"],
        "coverage_status": "covered/partial/not_covered",
        "realizability": "高/中/低",
        "notes": "AI学习报告+ROI看板可实现，技术成熟度高"
      }
    ],
    "uncovered_gains": [
      {
        "gain_id": "gain-3",
        "gain_description": "学员自主学习意愿提升",
        "importance": "high",
        "gap_analysis": "用户期望社交化学习体验但当前价值主张未涉及",
        "recommendation": "建议在V2.0规划中纳入学习社区功能"
      }
    ],
    "gain_summary": {
      "total_gains": 8,
      "covered": 5,
      "partial": 2,
      "uncovered": 1,
      "alignment_rate": "75%"
    }
  }
}
```

**验收标准**：
- 所有Gain Creators已验证
- 未覆盖收益已识别并评估重要性
- 可实现性评估合理

### Step 3：匹配度总评

**任务**：综合痛点覆盖和收益创造，计算整体匹配度评分。

**加权平均计算**：
```
Overall Fit Score = (Pain Alignment Score × 0.6) + (Gain Validation Score × 0.4)
```

**评分解释：**
| 分数范围 | 含义 | 行动建议 |
|----------|------|----------|
| 4.0-5.0 | 优秀匹配 | 价值主张设计合理，可进入下一阶段 |
| 3.0-3.9 | 良好匹配 | 有改进空间，建议优化后进入下一阶段 |
| 2.0-2.9 | 一般匹配 | 存在明显缺口，需要调整价值主张 |
| 1.0-1.9 | 较差匹配 | 价值主张与用户需求存在重大错位 |
| 0-0.9 | 严重错位 | 需要重新设计价值主张 |

**输出格式：**
```json
{
  "overall_fit_score": 3.4,
  "score_interpretation": "良好匹配",
  "score_breakdown": {
    "pain_alignment_score": 3.5,
    "pain_weight": 0.6,
    "pain_contribution": 2.1,
    "gain_validation_score": 3.25,
    "gain_weight": 0.4,
    "gain_contribution": 1.3
  },
  "coverage_rate": {
    "pain_coverage": "80%",
    "gain_coverage": "75%",
    "high_priority_coverage": "85%"
  }
}
```

## 输出

**存储路径**：`output/pm-strategy/business-value-fit/`

**输出文件**：evaluation_report.json

### 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| evaluation_report.evaluation_metadata.evaluated_at | string | 是 | 评估时间戳 |
| evaluation_report.evaluation_metadata.value_propositions_evaluated | number | 是 | 已评估价值主张数量 |
| evaluation_report.evaluation_metadata.pains_analyzed | number | 是 | 已分析痛点数量 |
| evaluation_report.evaluation_metadata.gains_analyzed | number | 是 | 已分析收益数量 |
| evaluation_report.evaluation_metadata.confidence | string | 是 | high/medium/low |
| evaluation_report.pain_alignment.covered_pains | array | 是 | 已覆盖痛点列表 |
| evaluation_report.pain_alignment.uncovered_pains | array | 是 | 未覆盖痛点列表，每项含recommendation |
| evaluation_report.pain_alignment.pain_coverage_summary | object | 是 | 覆盖率统计 |
| evaluation_report.gain_validation.covered_gains | array | 是 | 已覆盖收益列表 |
| evaluation_report.gain_validation.uncovered_gains | array | 是 | 未覆盖收益列表，每项含recommendation |
| evaluation_report.overall_fit_score | number | 是 | 综合匹配度评分0-5 |
| evaluation_report.coverage_rate | object | 是 | 覆盖率指标 |
| evaluation_report.improvement_suggestions | array | 是 | 改进建议列表 |
| evaluation_report.warnings | array | 是 | 警告列表 |

### 完整评估报告

```json
{
  "evaluation_report": {
    "evaluation_metadata": {
      "evaluated_at": "2024-06-15T14:20:00Z",
      "value_propositions_evaluated": 3,
      "pains_analyzed": 10,
      "gains_analyzed": 8,
      "confidence": "high/medium/low"
    },
    "pain_alignment": {...},
    "gain_validation": {...},
    "overall_fit_score": {...},
    "coverage_rate": {...},
    "improvement_suggestions": [
      {
        "suggestion_id": "sug-1",
        "priority": "high/medium/low",
        "category": "add_pain_coverage/enhance_gain/clarify_message/reposition",
        "description": "增加AI学习路径效果可视化功能，覆盖学员进度追踪痛点",
        "expected_impact": "痛点覆盖率提升15%，匹配度评分提升0.5分",
        "implementation_effort": "中等，需2个Sprint开发周期"
      }
    ],
    "warnings": [
      {
        "warning_type": "high_frequency_uncovered",
        "description": "高频痛点'培训效果难以量化'未被价值主张覆盖",
        "affected_pains": ["pain-3", "pain-7"],
        "severity": "high"
      }
    ]
  }
}
```

## 决策规则

### 警告触发规则

1. **高频痛点遗漏警告**：
   - 触发条件：频率≥20%的痛点未被覆盖
   - 行动：生成警告，明确标注受影响痛点
   - 严重程度：高

2. **高严重度痛点遗漏警告**：
   - 触发条件：严重程度=high的痛点覆盖率<70%
   - 行动：生成警告，建议优先改进

3. **收益期望缺口警告**：
   - 触发条件：重要性=high的收益未被承诺
   - 行动：生成警告，评估是否需要调整

### 升级规则

1. **匹配度<3.0升级**：
   - 触发条件：Overall Fit Score < 3.0
   - 行动：标记为需要人类关注，不阻止但建议调整
   - 输出升级标记供人类决策者参考

2. **覆盖率<60%升级**：
   - 触发条件：高频痛点覆盖率 < 60%
   - 行动：强制升级人类审批

3. **高风险假设识别**：
   - 触发条件：匹配度依赖高风险假设
   - 行动：标注假设风险，建议验证计划

## 质量检查

### 自检清单

- [ ] 所有Pain Relievers已评估
- [ ] 所有Gain Creators已验证
- [ ] 遗漏清单完整无遗漏
- [ ] 评分逻辑一致
- [ ] 权重设置合理
- [ ] 警告规则正确触发

### 质量标准

1. **评分一致性**：
   - 相同痛点-价值主张组合的评分应保持一致
   - 评分理由充分且可解释

2. **覆盖完整性**：
   - 痛点覆盖不能为0（除非明确选择不覆盖某些痛点）
   - 高频高严重度痛点必须有覆盖

3. **建议可操作性**：
   - 改进建议具体可执行
   - 优先级排序合理

---

## 降级策略

当上游文件不存在时，本Skill仍可独立执行：

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| bmc.json | 用户提供价值主张和用户痛点 → 直接评估匹配度 | 缺乏BMC结构化数据，价值主张可能不完整 |
| 用户研究数据（voice-analysis / persona） | 用户提供价值主张和用户痛点 → 直接评估匹配度 | 缺乏用户研究数据，痛点频率和严重度缺乏实证 |
| bmc.json + 用户研究数据 | 用户提供价值主张和用户痛点描述 → 直接评估匹配度 | 整体置信度降低，评分缺乏数据锚定 |
| 所有上游文件均缺失 | 提示用户先执行前序阶段，或基于用户提供价值主张和用户痛点直接评估匹配度 | 整体置信度显著降低，评估仅为假设推断 |

## 数据获取说明

本Skill需要BMC和用户研究数据，请通过以下方式之一提供：
  1. 直接描述价值主张和用户痛点
  2. 上传bmc.json / persona.json / voice-analysis.json文件
  3. 提供数据文件路径
- AI不负责外部数据采集，仅负责分析

---

## 上游变更响应

### 上游变更影响表

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| bmc.json价值主张变更 | 痛点对齐度和收益创造验证需重新评估 | 重新执行Step 1-3，更新匹配度评分 |
| bmc.json客户细分调整 | 价值主张与细分群体对应关系 | 重新匹配价值主张与目标用户 |
| persona/voice-analysis用户痛点更新 | 痛点覆盖率和遗漏分析 | 重新执行Step 1，更新未覆盖痛点清单 |
| problem-statement问题陈述变更 | 痛点和收益的优先级权重 | 重新计算加权评分，更新匹配度总评 |

### 下游通知机制表

| 变更类型 | 影响范围 | 通知方式 |
|----------|----------|----------|
| 匹配度评分变更 | business-pricing、positioning-strategy | 输出文件版本号+变更摘要 |
| 痛点覆盖率变更 | business-model-canvas | 输出文件版本号+变更摘要 |
| 改进建议新增 | business-model-canvas | 输出文件版本号+变更摘要 |
| 警告触发/解除 | business-pricing | 输出文件版本号+变更摘要 |

---

## Integration

### 与Pipeline 1集成

Pipeline 2的输出将传递给Pipeline 3（定价策略），关键传递内容包括：
- 价值主张Fit评分
- 覆盖率和遗漏分析
- 改进建议（可能影响定价方案）

### 与人类决策集成

评估结果和警告将呈现给人类决策者，供以下决策参考：
- 是否需要调整价值主张
- 是否接受当前匹配度进入下一阶段
- 优先级改进方向
