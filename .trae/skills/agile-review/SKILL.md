---
name: agile-review
description: 当需要自动化Sprint评审和复盘报告时使用。Sprint评审与复盘报告一体化，Step 1完成Sprint评审（产出清单整理、Demo准备清单、反馈收集分类、数据收集、问题识别、改进建议生成），Step 2生成完整复盘报告（Sprint目标达成分析、交付质量评估、团队速率趋势、改进行动项、下一Sprint建议），Step 3完成上线复盘（效果复盘、工程质量复盘、过程复盘、改进行动项生成）。关键词：Sprint Review、Sprint Retro、迭代评审、迭代回顾、敏捷复盘、评审会、复盘报告、Sprint复盘、改进行动项、做得怎么样、上线复盘、发布复盘、效果评估、持续改进。
metadata:
  module: "项目管理与执行"
  sub-module: "敏捷执行"
  type: "pipeline"
  version: "3.1"
  domain_tags: ["互联网", "SaaS", "通用"]
  trigger_examples:
    - "sprint结束了要评审"
    - "迭代回顾怎么做"
    - "这期做得怎么样"
    - "sprint复盘报告怎么写"
    - "帮我出一份迭代复盘报告"
    - "这期迭代总结一下"
    - "上线两周了，做个复盘"
    - "帮我总结一下这次发布的效果"
    - "开个回顾会，整理改进点"
  interaction_mode: "ai_auto"
---

# Sprint评审与复盘报告自动化

## 核心原则

1. **透明度即协作**：Sprint产出、反馈、改进建议全员可见，确保团队对齐
2. **风险前置**：Retro识别的问题和风险及时暴露，防止在后续Sprint中重复出现
3. **自动化追踪**：改进建议执行状态、行动项完成情况自动追踪
4. **复盘是为了学习，不是为了追责**：Sprint复盘报告的核心价值在于从每个迭代中提取可复用的学习，形成团队持续改进的飞轮。复盘不是评分卡，而是改进路线图

## 交互模式

**🤖 AI自动执行**

- 所有准备和后续处理由AI自动完成
- Sprint Review会议仍需人类主持和展示
- Sprint Retro会议由人类参与讨论和决定
- 改进建议需人类确认后才可执行
- 复盘报告需人类审核确认（Sprint Goal达成度判定、改进行动项负责人分配、下一Sprint容量预测）

---

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| sprint_backlog | object | 是 | output/pm-project/agile-sprint-planning/sprint_plan.json | Sprint计划的Stories |
| completed_stories | object[] | 是 | 用户提供 | 已完成的Stories |
| team_data | object | ○ | 用户提供 | 团队绩效数据 |
| stakeholder_feedback | object[] | ○ | 用户提供 | 利益相关方反馈（可选） |
| daily_sync_records | markdown | ○ | agile-daily-sync | 每日同步记录（障碍追踪、风险记录、进展更新） |
| historical_sprint_data | text | ○ | 用户输入 | 过往3-5个Sprint的速率和交付数据 |
| release_data | JSON | ○ | 发布管理系统 | 发布版本和变更内容（上线复盘时必填） |
| monitoring_data | JSON | ○ | 监控系统 | 业务指标和性能指标（上线复盘时必填） |
| user_feedback_data | JSON | ○ | 客服系统/反馈平台 | 用户满意度和反馈（上线复盘时可选） |
| bug_statistics | JSON | ○ | Bug跟踪系统 | 发布相关Bug统计（上线复盘时可选） |
| release_process_data | JSON | ○ | 发布日志 | 发布流程数据（上线复盘时可选） |

## 执行步骤

### Step 1: Sprint评审（评估目标达成情况并沉淀改进）

#### Step 1.1: 产出清单自动整理

**动作**：
- 汇总Sprint完成的所有Stories
- 整理每个Story的交付内容
- 统计完成率
- 生成产出摘要

**输出**：
```json
{
  "deliverables": {
    "sprint_summary": {
      "sprint_id": "string",
      "planned_stories": number,
      "completed_stories": number,
      "cancelled_stories": number,
      "completion_rate": 0.0-1.0,
      "planned_points": number,
      "completed_points": number,
      "points_completion_rate": 0.0-1.0
    },
    "completed_items": [{
      "story_id": "string",
      "title": "string",
      "story_points": number,
      "key_deliverables": ["string"],
      "completed_by": "string",
      "quality_notes": "string"
    }],
    "incomplete_items": [{
      "story_id": "string",
      "title": "string",
      "remaining_work": "string",
      "carryover_decision": "next_sprint | deprioritize | replan"
    }]
  }
}
```

#### Step 1.2: Demo准备清单生成

**动作**：
- 基于完成Stories生成Demo议程
- 标注每个Demo的时长
- 准备Demo环境检查清单
- 建议演示顺序

**输出**：
```json
{
  "demo_checklist": {
    "demo_duration_minutes": number,
    "items": [{
      "order": 1,
      "demo_topic": "string",
      "story_id": "string",
      "presenter": "string",
      "duration_minutes": number,
      "environment_check": {
        "staging_ready": boolean,
        "test_data_ready": boolean,
        "access_verified": boolean
      },
      "key_points": ["string"],
      "questions_to_anticipate": ["string"]
    }]
  }
}
```

#### Step 1.3: 反馈自动收集与分类

**动作**：
- 收集利益相关方反馈
- 分类反馈类型（功能/体验/性能/其他）
- 识别重复反馈
- 按重要性排序

**输出**：
```json
{
  "feedback_collected": {
    "total_feedback_count": number,
    "feedback_by_type": {
      "feature_request": number,
      "usability_issue": number,
      "performance_concern": number,
      "bug_report": number,
      "positive_feedback": number,
      "other": number
    },
    "feedback_items": [{
      "feedback_id": "FB-001",
      "description": "string",
      "type": "string",
      "source": "string",
      "timestamp": "ISO datetime",
      "priority": "high | medium | low",
      "related_story": "string | null",
      "actionable": boolean
    }]
  }
}
```

#### Step 1.4: 数据自动收集

**动作**：
- 收集Sprint完成率、质量指标、协作数据
- 分析团队节奏和效率
- 提取关键数据指标
- 生成数据摘要

**输出**：
```json
{
  "metrics": {
    "completion_metrics": {
      "story_completion_rate": 0.0-1.0,
      "point_completion_rate": 0.0-1.0,
      "avg_story_completion_time_days": number,
      "carryover_rate": 0.0-1.0
    },
    "quality_metrics": {
      "bug_count": number,
      "bug_rejection_rate": 0.0-1.0,
      "code_review_turnaround_hours": number,
      "build_failure_rate": 0.0-1.0
    },
    "collaboration_metrics": {
      "blocker_resolution_time_hours": number,
      "meeting_hours_total": number,
      "ad_hoc_interruption_count": number,
      "cross_team_dependency_delays": number
    },
    "team_health": {
      "avg_overtime_hours": number,
      "member_stress_indicators": ["string"],
      "velocity_stability": "stable | fluctuating | declining"
    }
  }
}
```

#### Step 1.5: 问题自动识别

**动作**：
- 分析数据识别模式和问题
- 检测Sprint中的异常
- 识别重复出现的问题
- 分类问题类型（流程/技术/协作/资源）

**输出**：
```json
{
  "problems_identified": [{
    "problem_id": "PRB-001",
    "description": "string",
    "category": "process | technical | collaboration | resource",
    "evidence": "string",
    "frequency": "first_time | recurring | persistent",
    "severity": "high | medium | low",
    "impact": "string"
  }]
}
```

#### Step 1.6: 改进建议自动生成

**动作**：
- 基于问题生成针对性改进建议
- 考虑团队上下文和历史改进
- 建议可落地的具体行动
- 标注建议优先级

**输出**：
```json
{
  "improvement_suggestions": [{
    "suggestion_id": "IMP-001",
    "problem_addressed": "PRB-001",
    "description": "string",
    "proposed_action": "string",
    "expected_impact": "string",
    "implementation_effort": "low | medium | high",
    "priority": "high | medium | low",
    "owner_suggestion": "string",
    "success_metric": "string"
  }]
}
```

---

### Step 2: 复盘报告生成（Sprint目标达成分析、交付质量评估、团队速率趋势、改进行动项）

Step 2接收Step 1的输出作为输入，结合Sprint计划和历史数据，生成完整的复盘报告。

#### Step 2.1: Sprint目标达成分析

对比计划与实际交付：

1. **Sprint Goal达成度**：完全达成 / 部分达成 / 未达成
2. **Story完成率**：计划Story数 vs 完成Story数 vs 溢出Story数
3. **Story Point达成率**：承诺SP vs 完成SP vs 溢出SP
4. **溢出分析**：溢出Story的根因分类（估时不准/需求变更/技术债务/外部依赖）

#### Step 2.2: 交付质量评估

评估本Sprint交付物的质量状况：

1. **缺陷密度**：每Story Point的缺陷数，与历史均值对比
2. **缺陷分布**：按严重程度（P0/P1/P2/P3）分布
3. **返工率**：因质量问题导致的返工Story占比
4. **技术债务**：本Sprint新增/偿还的技术债务

#### Step 2.3: 团队速率分析

分析团队交付速率趋势：

1. **本Sprint速率**：完成SP、有效工作天数、日均SP
2. **速率趋势**：近5个Sprint的速率变化趋势（上升/稳定/下降）
3. **速率波动**：标准差和变异系数，评估可预测性
4. **容量利用率**：实际产出 vs 可用容量的比率

#### Step 2.4: 改进行动项提取

从执行数据中提取可操作的改进建议：

1. **做得好的**（Keep）：本Sprint值得保持的做法
2. **需要改进的**（Improve）：本Sprint暴露的问题和改进方向
3. **新尝试的**（Try）：下个Sprint建议引入的新实践
4. **行动项清单**：每项改进有明确负责人、截止日期和验收标准

#### Step 2.5: 下一Sprint建议

基于复盘结论为下一Sprint提供建议：

1. **速率预测**：基于趋势预测下一Sprint可承诺SP范围
2. **风险预判**：基于本Sprint溢出根因预判下Sprint风险
3. **容量建议**：考虑假期、人员变动等因素的容量调整
4. **改进实验**：建议在下一Sprint中验证的1-2个改进实验

#### Step 2.6: 报告组装

将以上内容组装为完整报告。

**Markdown报告结构**：
```markdown
# Sprint复盘报告：Sprint {NN}

## 1. 执行摘要
- Sprint Goal达成度 / Story完成率 / 速率 / Top 3改进项

## 2. 目标达成分析
- Sprint Goal评估
- Story完成率（计划/完成/溢出）
- Story Point达成率
- 溢出根因分析

## 3. 交付质量评估
- 缺陷密度（vs 历史均值）
- 缺陷分布（P0-P3）
- 返工率
- 技术债务变化

## 4. 团队速率分析
- 本Sprint速率
- 速率趋势（近5个Sprint图表）
- 速率波动与可预测性
- 容量利用率

## 5. 改进行动项
- ✅ Keep（做得好的）
- 🔧 Improve（需要改进的）
- 🧪 Try（新尝试的）
- 行动项清单（负责人/截止日期/验收标准）

## 6. 下一Sprint建议
- 速率预测范围
- 风险预判
- 容量建议
- 改进实验建议
```

**JSON结构**：
```json
{
  "sprint_id": "S{NN}",
  "sprint_dates": { "start": "", "end": "" },
  "report_date": "",
  "goal_achievement": {
    "status": "fully|partially|not_achieved",
    "sprint_goal": "",
    "evidence": ""
  },
  "delivery_metrics": {
    "stories_planned": 0,
    "stories_completed": 0,
    "stories_spilled": 0,
    "sp_planned": 0,
    "sp_completed": 0,
    "spill_reasons": []
  },
  "quality_metrics": {
    "defect_density": 0,
    "defect_distribution": { "P0": 0, "P1": 0, "P2": 0, "P3": 0 },
    "rework_rate": 0,
    "tech_debt_delta": ""
  },
  "velocity": {
    "current": 0,
    "trend": "increasing|stable|decreasing",
    "historical": [],
    "capacity_utilization": 0
  },
  "action_items": {
    "keep": [],
    "improve": [],
    "try": []
  },
  "next_sprint_recommendation": {
    "velocity_range": [0, 0],
    "risks": [],
    "capacity_adjustment": "",
    "experiments": []
  }
}
```

---

### Step 3: 上线复盘

Step 3在发布完成后（建议T+2周）执行，自动收集多源数据，对上线效果、工程质量、发布过程进行复盘，并生成改进行动项。

#### Step 3.1: 效果复盘（上线后核心指标对比）

**动作**：
- 收集上线后核心业务指标和性能指标数据
- 对比发布目标与实际达成情况
- 对未达标指标进行归因分析
- 评估数据质量和完整性

**输出**：
```json
{
  "release_effectiveness": {
    "release_id": "string",
    "retrospective_period": {
      "start": "ISO date",
      "end": "ISO date"
    },
    "goal_vs_actual": [{
      "metric": "string",
      "target": number,
      "actual": number,
      "achievement_rate": 0.0-1.0,
      "status": "achieved | partially_achieved | not_achieved | exceeded",
      "gap": number,
      "significance": "high | medium | low"
    }],
    "attribution_analysis": [{
      "metric": "string",
      "actual_vs_target_gap": number,
      "attributions": [{
        "factor": "string",
        "impact": number,
        "confidence": 0.0-1.0,
        "evidence": "string"
      }],
      "primary_cause": "string"
    }],
    "data_quality": {
      "completeness": 0.0-1.0,
      "accuracy": "verified | unverified",
      "gaps": ["string"]
    }
  }
}
```

#### Step 3.2: 工程质量复盘（Bug密度、技术债变化）

**动作**：
- 统计发布后Bug数量、严重程度分布、来源分布
- 对比本次与上次发布的Bug趋势
- 分析技术债务变化（新增/偿还）
- 识别Bug根因模式

**输出**：
```json
{
  "release_quality": {
    "bug_statistics": {
      "total_bugs": number,
      "by_severity": { "P0": number, "P1": number, "P2": number, "P3": number },
      "by_source": {
        "testing_discovered": number,
        "production_reported": number,
        "leakage_rate": 0.0-1.0
      },
      "by_category": { "functional": number, "ui_ux": number, "performance": number, "security": number, "other": number }
    },
    "bug_trend_analysis": {
      "trend_comparison": {
        "total_bugs": { "current": number, "previous": number, "change_pct": number, "trend": "improving | stable | worsening" },
        "leakage_rate": { "current": number, "previous": number, "change_pct": number, "trend": "improving | stable | worsening" },
        "avg_fix_time_days": { "current": number, "previous": number, "change_pct": number, "trend": "improving | stable | worsening" }
      },
      "root_cause_patterns": [{
        "pattern": "string",
        "evidence": "string",
        "confidence": 0.0-1.0
      }]
    },
    "technical_debt_analysis": {
      "code_quality": {
        "maintainability_index": number,
        "baseline": number,
        "status": "improving | stable | slight_degradation | significant_degradation"
      },
      "debt_items": [{
        "item": "string",
        "severity": "high | medium | low",
        "estimated_debt_hours": number,
        "introduced_in": "string"
      }],
      "total_estimated_debt_hours": number
    }
  }
}
```

#### Step 3.3: 过程复盘（Sprint效率、协作质量）

**动作**：
- 分析问题发现时机分布（开发/测试/生产各阶段占比）
- 评估事件响应速度（检测、响应、修复时长）
- 分析团队协作效率（满意度、瓶颈识别）
- 评估发布流程质量

**输出**：
```json
{
  "release_process": {
    "issue_discovery_timing": {
      "discovery_stages": [{
        "stage": "string",
        "issues_found": number,
        "pct": 0.0-1.0,
        "cost_multiplier": number
      }],
      "assessment": {
        "ideal_production_share": "string",
        "actual_production_share": "string",
        "status": "good | needs_improvement | critical"
      }
    },
    "response_speed_analysis": {
      "incident_response": {
        "avg_detection_time_minutes": number,
        "avg_response_time_minutes": number,
        "avg_resolution_time_minutes": number,
        "benchmark": "string"
      },
      "assessment": "good | acceptable | needs_improvement"
    },
    "collaboration_efficiency": {
      "team_feedback_summary": {
        "survey_response_rate": 0.0-1.0,
        "overall_satisfaction": number,
        "key_positives": ["string"],
        "key_improvements": ["string"]
      },
      "bottlenecks_identified": [{
        "bottleneck": "string",
        "frequency": "string",
        "impact": "string",
        "owner": "string"
      }]
    }
  }
}
```

#### Step 3.4: 改进行动项生成

**动作**：
- 基于效果复盘、工程质量复盘、过程复盘结果自动生成改进行动项
- 按影响/紧急度/可行性综合评分排序
- 每项行动项包含负责人、截止日期、验证方法和成功标准
- 行动项分类：产品改进、测试改进、基础设施改进、流程改进

**输出**：
```json
{
  "release_action_items": {
    "items": [{
      "item_id": "string",
      "source": "效果复盘 | 工程质量复盘 | 过程复盘",
      "title": "string",
      "description": "string",
      "priority": "high | medium | low",
      "type": "product_improvement | test_improvement | infrastructure | process_improvement",
      "owner": "string",
      "due_date": "ISO date",
      "verification_method": "string",
      "success_criteria": "string",
      "status": "open | in_progress | done"
    }],
    "priority_ranking": [{
      "item_id": "string",
      "priority_score": number,
      "factors": {
        "impact": number,
        "urgency": number,
        "feasibility": number
      },
      "rank": number
    }]
  }
}
```

#### Step 3.5: 上线复盘报告组装

将效果复盘、工程质量复盘、过程复盘和改进行动项组装为完整上线复盘报告。

**Markdown报告结构**：
```markdown
# 上线复盘报告：{release_id}

## 1. 执行摘要
- 发布版本 / 复盘周期 / 目标达成概况 / Top 3改进行动项

## 2. 效果复盘
- 目标vs实际对比
- 归因分析
- 数据质量评估

## 3. 工程质量复盘
- Bug统计与趋势
- 技术债务变化
- 根因模式识别

## 4. 过程复盘
- 问题发现时机分析
- 响应速度评估
- 协作效率分析

## 5. 改进行动项
- 行动项清单（来源/优先级/负责人/截止日期/验证方法）
- 优先级排序

## 6. 整体评估
- 评级（good / acceptable / needs_improvement）
- 综合摘要
```

**JSON结构**：
```json
{
  "release_retrospective": {
    "release_id": "string",
    "retrospective_period": { "start": "ISO date", "end": "ISO date" },
    "generated_at": "ISO datetime",
    "effectiveness": {
      "summary": {
        "goals_achieved": number,
        "goals_partially_achieved": number,
        "goals_not_achieved": number
      },
      "goal_vs_actual": [],
      "attribution_analysis": []
    },
    "quality": {
      "bug_statistics": {},
      "bug_trend_analysis": {},
      "technical_debt_analysis": {}
    },
    "process": {
      "issue_discovery_timing": {},
      "response_speed_analysis": {},
      "collaboration_efficiency": {}
    },
    "action_items": [],
    "overall_assessment": {
      "rating": "good | acceptable | needs_improvement",
      "summary": "string"
    }
  }
}
```

---

## 输出

**存储路径**：`output/pm-project/agile-review/`

**输出文件**：

| 文件 | 路径 | 说明 |
|------|------|------|
| Sprint评审数据 | sprint_review.json | Sprint评审数据，包含交付物、Demo清单和反馈收集 |
| Sprint回顾数据 | sprint_retro.json | Sprint回顾数据，包含指标、问题识别和改进建议 |
| Sprint复盘报告 | sprint-retro-S{NN}.md | 人类可读的完整复盘报告 |
| 复盘结构化数据 | sprint-retro-S{NN}.json | 机器可消费的复盘结构化数据 |
| 元数据 | metadata.json | 元数据 |
| 上线复盘数据 | release_retro.json | 上线复盘数据，包含效果复盘、工程质量复盘、过程复盘和改进行动项 |
| 上线复盘报告 | release-retro-{release_id}.md | 人类可读的上线复盘报告 |
| 上线复盘结构化数据 | release-retro-{release_id}.json | 机器可消费的上线复盘结构化数据 |

**输出Schema**：

```json
{
  "type": "object",
  "required": ["sprint_review"],
  "properties": {
    "sprint_review": {"type": "object", "description": "Sprint评审数据，包含交付物、Demo清单和反馈收集"},
    "sprint_retro": {"type": "object", "description": "Sprint回顾数据，包含指标、问题识别和改进建议"},
    "retrospective_report": {"type": "object", "description": "复盘报告数据，包含目标达成、交付质量、速率趋势、改进行动项"},
    "release_retrospective": {"type": "object", "description": "上线复盘数据，包含效果复盘、工程质量复盘、过程复盘和改进行动项"}
  }
}
```

### 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| sprint_review.deliverables.sprint_summary.sprint_id | string | 是 | Sprint唯一标识，格式SPR-YYYY-SNN |
| sprint_review.deliverables.sprint_summary.completion_rate | number | 是 | Story完成率，范围0.0-1.0 |
| sprint_review.deliverables.sprint_summary.points_completion_rate | number | 是 | 故事点完成率，范围0.0-1.0 |
| sprint_review.deliverables.completed_items | array | 是 | 已完成Story列表，每项须含story_id、title、story_points |
| sprint_review.deliverables.incomplete_items | array | 是 | 未完成Story列表，carryover_decision须为枚举值 |
| sprint_review.demo_checklist.items | array | 是 | Demo清单，每项须含order、demo_topic、duration_minutes |
| sprint_review.demo_checklist.items[].environment_check | object | 否 | 环境检查项，含staging_ready、test_data_ready、access_verified |
| sprint_review.feedback_collected.total_feedback_count | number | 是 | 反馈总数，须≥feedback_items数组长度 |
| sprint_review.feedback_collected.feedback_items[].priority | string | 是 | 优先级，枚举值high/medium/low |
| sprint_retro.metrics.completion_metrics.story_completion_rate | number | 是 | Story完成率，须与sprint_summary中一致 |
| sprint_retro.problems_identified[].category | string | 是 | 问题分类，枚举值process/technical/collaboration/resource |
| sprint_retro.problems_identified[].frequency | string | 是 | 出现频率，枚举值first_time/recurring/persistent |
| sprint_retro.improvement_suggestions[].problem_addressed | string | 是 | 关联问题ID，须与problems_identified中的problem_id对应 |
| sprint_retro.improvement_suggestions[].implementation_effort | string | 是 | 实施成本，枚举值low/medium/high |
| retrospective_report.sprint_id | string | 是 | Sprint标识，格式S{NN} |
| retrospective_report.sprint_dates.start | string | 是 | Sprint开始日期，ISO 8601格式 |
| retrospective_report.sprint_dates.end | string | 是 | Sprint结束日期，ISO 8601格式 |
| retrospective_report.report_date | string | 是 | 报告生成日期，ISO 8601格式 |
| retrospective_report.goal_achievement.status | string | 是 | 达成状态，枚举值fully/partially/not_achieved |
| retrospective_report.goal_achievement.sprint_goal | string | 是 | Sprint目标描述 |
| retrospective_report.goal_achievement.evidence | string | 是 | 达成判定依据 |
| retrospective_report.delivery_metrics.stories_planned | number | 是 | 计划Story数，须≥0 |
| retrospective_report.delivery_metrics.stories_completed | number | 是 | 完成Story数，须≤stories_planned |
| retrospective_report.delivery_metrics.stories_spilled | number | 是 | 溢出Story数，须=stories_planned-stories_completed |
| retrospective_report.delivery_metrics.sp_planned | number | 是 | 计划SP数，须≥0 |
| retrospective_report.delivery_metrics.sp_completed | number | 是 | 完成SP数 |
| retrospective_report.delivery_metrics.spill_reasons | array | 否 | 溢出根因列表，每项须有根因标签 |
| retrospective_report.quality_metrics.defect_density | number | 是 | 缺陷密度，须≥0 |
| retrospective_report.quality_metrics.defect_distribution | object | 是 | 缺陷分布，含P0/P1/P2/P3计数 |
| retrospective_report.quality_metrics.rework_rate | number | 是 | 返工率，范围0.0-1.0 |
| retrospective_report.quality_metrics.tech_debt_delta | string | 是 | 技术债务变化描述 |
| retrospective_report.velocity.current | number | 是 | 当前Sprint速率，须≥0 |
| retrospective_report.velocity.trend | string | 是 | 速率趋势，枚举值increasing/stable/decreasing |
| retrospective_report.velocity.historical | array | 否 | 历史速率数据 |
| retrospective_report.velocity.capacity_utilization | number | 是 | 容量利用率，范围0.0-1.0 |
| retrospective_report.action_items.keep | array | 是 | 保持项列表 |
| retrospective_report.action_items.improve | array | 是 | 改进项列表 |
| retrospective_report.action_items.try | array | 是 | 尝试项列表 |
| retrospective_report.next_sprint_recommendation.velocity_range | array | 是 | 速率预测范围，[下限, 上限] |
| retrospective_report.next_sprint_recommendation.risks | array | 否 | 风险预判列表 |
| retrospective_report.next_sprint_recommendation.capacity_adjustment | string | 是 | 容量调整建议 |
| retrospective_report.next_sprint_recommendation.experiments | array | 否 | 改进实验建议 |
| metadata.sprint_id | string | 是 | Sprint标识，须与sprint_summary中一致 |
| metadata.generated_at | string | 是 | 生成时间，ISO 8601格式 |
| metadata.review_completed | boolean | 是 | Review是否完成 |
| metadata.retro_completed | boolean | 是 | Retro是否完成 |
| metadata.report_completed | boolean | 是 | 复盘报告是否完成 |
| release_retrospective.release_id | string | 是 | 发布ID，唯一标识本次发布 |
| release_retrospective.retrospective_period.start | string | 是 | 复盘周期开始日期，ISO 8601格式 |
| release_retrospective.retrospective_period.end | string | 是 | 复盘周期结束日期，ISO 8601格式 |
| release_retrospective.effectiveness.summary.goals_achieved | number | 是 | 达成目标数，须≥0 |
| release_retrospective.effectiveness.summary.goals_not_achieved | number | 是 | 未达成目标数，须≥0 |
| release_retrospective.effectiveness.goal_vs_actual | array | 是 | 目标vs实际对比列表，每项须含metric、target、actual、status |
| release_retrospective.effectiveness.goal_vs_actual[].status | string | 是 | 达成状态，枚举值achieved/partially_achieved/not_achieved/exceeded |
| release_retrospective.quality.bug_statistics.total_bugs | number | 是 | Bug总数，须≥0 |
| release_retrospective.quality.bug_statistics.by_severity | object | 是 | Bug严重程度分布，含P0/P1/P2/P3计数 |
| release_retrospective.quality.bug_trend_analysis.trend_comparison | object | 是 | Bug趋势对比，含total_bugs/leakage_rate/avg_fix_time_days趋势 |
| release_retrospective.quality.technical_debt_analysis.total_estimated_debt_hours | number | 是 | 技术债务总估时，须≥0 |
| release_retrospective.process.issue_discovery_timing.discovery_stages | array | 是 | 问题发现阶段分布，每项须含stage、issues_found、pct |
| release_retrospective.process.collaboration_efficiency.bottlenecks_identified | array | 否 | 识别的瓶颈列表 |
| release_retrospective.action_items | array | 是 | 改进行动项列表，每项须含item_id、title、priority、owner、due_date |
| release_retrospective.action_items[].status | string | 是 | 行动项状态，枚举值open/in_progress/done |
| release_retrospective.overall_assessment.rating | string | 是 | 整体评级，枚举值good/acceptable/needs_improvement |
| release_retrospective.overall_assessment.summary | string | 是 | 整体评估摘要 |

### 输出示例

```json
{
  "sprint_review": {
    "deliverables": {
      "sprint_summary": {
        "sprint_id": "SPR-2024-S08",
        "planned_stories": 8,
        "completed_stories": 7,
        "cancelled_stories": 0,
        "completion_rate": 0.875,
        "planned_points": 34,
        "completed_points": 30,
        "points_completion_rate": 0.88
      },
      "completed_items": [
        {
          "story_id": "STO-042",
          "title": "课程播放器进度记忆功能",
          "story_points": 5,
          "key_deliverables": ["断点续播", "多端进度同步"],
          "completed_by": "李伟",
          "quality_notes": "通过全量回归测试，无P0/P1缺陷"
        }
      ],
      "incomplete_items": [
        {
          "story_id": "STO-048",
          "title": "课堂弹幕互动功能",
          "remaining_work": "弹幕审核后台接口待联调",
          "carryover_decision": "next_sprint"
        }
      ]
    },
    "demo_checklist": {
      "demo_duration_minutes": 45,
      "items": [
        {
          "order": 1,
          "demo_topic": "课程断点续播演示",
          "story_id": "STO-042",
          "presenter": "李伟",
          "duration_minutes": 10,
          "environment_check": {
            "staging_ready": true,
            "test_data_ready": true,
            "access_verified": true
          },
          "key_points": ["跨设备续播", "进度条精确跳转"],
          "questions_to_anticipate": ["离线场景是否支持？"]
        }
      ]
    },
    "feedback_collected": {
      "total_feedback_count": 12,
      "feedback_by_type": {
        "feature_request": 3,
        "usability_issue": 2,
        "performance_concern": 1,
        "bug_report": 1,
        "positive_feedback": 4,
        "other": 1
      },
      "feedback_items": [
        {
          "feedback_id": "FB-001",
          "description": "希望课程播放器支持倍速播放",
          "type": "feature_request",
          "source": "教务主管",
          "timestamp": "2024-04-12T15:30:00+08:00",
          "priority": "medium",
          "related_story": null,
          "actionable": true
        }
      ]
    }
  },
  "sprint_retro": {
    "metrics": {
      "completion_metrics": {
        "story_completion_rate": 0.875,
        "point_completion_rate": 0.88,
        "avg_story_completion_time_days": 3.2,
        "carryover_rate": 0.125
      },
      "quality_metrics": {
        "bug_count": 4,
        "bug_rejection_rate": 0.25,
        "code_review_turnaround_hours": 8,
        "build_failure_rate": 0.05
      },
      "collaboration_metrics": {
        "blocker_resolution_time_hours": 6,
        "meeting_hours_total": 12,
        "ad_hoc_interruption_count": 5,
        "cross_team_dependency_delays": 1
      },
      "team_health": {
        "avg_overtime_hours": 3.5,
        "member_stress_indicators": ["1名成员反馈排期偏紧"],
        "velocity_stability": "stable"
      }
    },
    "problems_identified": [
      {
        "problem_id": "PRB-001",
        "description": "弹幕审核接口依赖内容安全团队排期，导致Story跨Sprint",
        "category": "collaboration",
        "evidence": "STO-048因审核接口未就绪阻塞3天",
        "frequency": "recurring",
        "severity": "high",
        "impact": "课堂互动功能交付延迟1个Sprint"
      }
    ],
    "improvement_suggestions": [
      {
        "suggestion_id": "IMP-001",
        "problem_addressed": "PRB-001",
        "description": "跨团队依赖需提前对齐排期",
        "proposed_action": "Sprint规划阶段邀请内容安全团队参与依赖确认",
        "expected_impact": "减少跨团队阻塞导致的延期",
        "implementation_effort": "low",
        "priority": "high",
        "owner_suggestion": "张明（PM）",
        "success_metric": "跨团队阻塞导致的延期减少50%"
      }
    ]
  },
  "retrospective_report": {
    "sprint_id": "S08",
    "sprint_dates": { "start": "2024-04-01", "end": "2024-04-12" },
    "report_date": "2024-04-12",
    "goal_achievement": {
      "status": "partially",
      "sprint_goal": "完成课堂互动功能与播放器优化",
      "evidence": "播放器优化完成，课堂互动功能因审核接口阻塞未完成"
    },
    "delivery_metrics": {
      "stories_planned": 8,
      "stories_completed": 7,
      "stories_spilled": 1,
      "sp_planned": 34,
      "sp_completed": 30,
      "spill_reasons": [{"story": "STO-048", "reason": "外部依赖"}]
    },
    "quality_metrics": {
      "defect_density": 0.13,
      "defect_distribution": { "P0": 0, "P1": 1, "P2": 2, "P3": 1 },
      "rework_rate": 0.0,
      "tech_debt_delta": "无新增技术债务"
    },
    "velocity": {
      "current": 30,
      "trend": "stable",
      "historical": [],
      "capacity_utilization": 0.88
    },
    "action_items": {
      "keep": ["跨团队依赖提前确认"],
      "improve": ["弹幕审核接口联调流程"],
      "try": ["Sprint规划阶段邀请依赖团队参与"]
    },
    "next_sprint_recommendation": {
      "velocity_range": [28, 34],
      "risks": ["弹幕审核接口仍为外部依赖"],
      "capacity_adjustment": "无变动",
      "experiments": ["依赖团队参与Sprint规划"]
    }
  },
  "metadata": {
    "sprint_id": "SPR-2024-S08",
    "generated_at": "2024-04-12T18:00:00+08:00",
    "review_completed": true,
    "retro_completed": true,
    "report_completed": true,
    "action_items_committed": 3
  }
}
```

---

## Review时长建议

| 环节 | 建议时长 |
|------|----------|
| Demo展示 | 50% |
| 反馈讨论 | 30% |
| 下一步对齐 | 20% |

## Retro时长建议

| 环节 | 建议时长 |
|------|----------|
| 数据回顾 | 15% |
| 问题讨论 | 50% |
| 改进建议 | 35% |

---

## 决策规则

| 条件 | 动作 |
|------|------|
| Sprint完成率 < 60% | 触发深度复盘 |
| 质量问题数量异常增加 | 触发质量专项Retro |
| 改进建议连续2个Sprint未执行 | 升级至团队讨论 |
| 团队健康指标恶化 | 升级至管理层关注 |
| Sprint Goal未达成 | 溢出根因分析为必填项 |
| 速率连续3个Sprint下降 | 自动标记为风险并建议专项复盘 |
| 返工率>20% | 质量改进行动项优先级提升为最高 |
| 效果未达预期≥30% | 触发上线深度分析 |
| 发布后P0缺陷出现 | 触发紧急上线复盘 |
| Bug泄漏率上升>20% | 触发根因分析 |
| 发布回滚发生 | 触发专项上线复盘 |
| 目标未达成 | 生成产品/运营改进行动项 |
| Bug趋势恶化 | 生成测试/质量改进行动项 |
| 协作效率问题 | 生成流程改进行动项 |
| 技术债务增加 | 生成技术改进行动项 |

## 质量检查

- [ ] 评审覆盖所有已完成Story
- [ ] 演示内容与验收标准对应
- [ ] 反馈已分类（接受/拒绝/改进）
- [ ] 改进建议有明确负责人和跟进计划
- [ ] 目标达成与数据一致（达成度判定与Story完成率吻合）
- [ ] 溢出根因已分类（每个溢出Story有根因标签）
- [ ] 行动项可执行（每项有负责人和截止日期）
- [ ] 速率趋势有依据（趋势判断基于至少3个Sprint数据，否则标注"数据不足，趋势待观察"）
- [ ] 上线复盘数据来源已标注
- [ ] 上线复盘目标vs实际对比清晰
- [ ] 上线复盘归因分析有证据支撑
- [ ] 上线复盘Bug趋势分析完整
- [ ] 上线复盘过程问题已识别
- [ ] 上线复盘行动项有负责人和截止时间
- [ ] 上线复盘行动项有验证方法

## 降级策略

### 上游文件缺失降级方案

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| Sprint产出数据 | 用户提供完成情况（完成/未完成Stories），AI生成Review/Retro | 基于用户输入生成Review/Retro，缺少自动化数据支撑 |
| 团队绩效数据 | 跳过协作和效率维度分析，仅基于交付数据复盘 | Retro缺少团队协作和效率维度分析 |
| 利益相关方反馈 | 跳过反馈收集环节，Review中标注"无利益相关方反馈" | Review报告无外部反馈内容 |
| Sprint计划 | 基于评审结果反推Sprint目标，标注"计划信息缺失" | 目标达成分析基于反推数据，缺少计划基准对比 |
| 每日同步记录 | 跳过障碍分析环节，标注"障碍数据缺失" | 复盘报告缺少障碍追踪和风险记录维度 |
| 历史Sprint数据 | 跳过速率趋势分析，标注"首次Sprint无趋势数据" | 无速率趋势和可预测性分析，需后续Sprint积累数据 |
| 发布数据缺失 | 用户提供发布内容描述 → 生成上线复盘框架 | 无法进行目标vs实际对比 |
| 监控数据缺失 | 跳过效果复盘中的指标对比步骤 | 效果复盘章节标注"待补充" |
| 用户反馈数据缺失 | 跳过用户满意度分析 | 用户反馈维度缺失 |
| Bug统计数据缺失 | 跳过工程质量复盘中的Bug统计分析 | Bug统计维度缺失 |
| 发布过程数据缺失 | 跳过过程复盘中的响应速度和协作效率分析 | 过程复盘维度缺失 |

### 数据获取说明

当上游文件缺失时，通过以下方式获取必要数据：

1. **Sprint产出数据缺失**：请用户提供完成情况，包括：已完成的Stories列表、未完成Stories及原因、故事点完成情况，AI将据此生成Review和Retro报告
2. **团队绩效数据缺失**：跳过协作和效率维度分析，Retro仅基于交付和质量数据，标注"缺少团队协作数据"
3. **利益相关方反馈缺失**：Review中跳过反馈收集环节，标注"无利益相关方反馈"，建议通过其他渠道补充收集
4. **Sprint计划缺失**：基于评审结果反推目标，标注"计划信息缺失"
5. **历史Sprint数据缺失**：跳过速率趋势分析，标注"首次Sprint无趋势数据"
6. **数据不可用时**：生成复盘框架，关键指标标注"待数据补充"
7. **发布数据缺失**：请用户提供发布内容描述（发布了什么功能、目标是什么），AI将据此生成上线复盘框架
8. **监控数据缺失**：跳过效果复盘指标对比，标注"待监控数据补充"，建议后续补充
9. **Bug统计数据缺失**：跳过工程质量复盘Bug统计，标注"待Bug数据补充"
10. **发布过程数据缺失**：跳过过程复盘响应速度和协作效率分析，标注"待过程数据补充"

## 上游变更响应

### 上游变更影响表

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| Sprint计划变更（Story增减/优先级调整） | 产出清单、完成率计算、Demo议程 | 重新整理产出清单，更新完成率和Demo准备清单 |
| 团队数据更新（人员变动/绩效变化） | Retro协作指标、团队健康评估 | 重新计算协作指标，更新问题识别和改进建议 |
| 反馈数据补充（新增利益相关方反馈） | 反馈收集分类、优先级排序 | 重新分类反馈，更新反馈统计和优先级排序 |
| Sprint评审结果变更（交付物/反馈更新） | 交付质量评估、改进行动项 | 更新质量指标和改进建议，重新生成报告 |
| 历史Sprint数据补充 | 速率趋势分析、可预测性评估 | 重新计算速率趋势和预测范围 |
| 发布说明变更 | 上线复盘范围和指标回顾 | 更新复盘范围，重新评估指标回顾 |
| 灰度发布结果变更 | 上线复盘效果评估 | 更新灰度相关复盘内容，标记需人类确认 |
| 验收报告变更 | 上线复盘质量评估和改进建议 | 更新质量相关指标，重新评估改进建议 |
| 变更日志变更 | 上线复盘范围 | 更新变更影响评估，标记需人类确认 |

### 下游通知机制表

| 变更类型 | 影响范围 | 通知方式 |
|----------|----------|----------|
| Sprint评审结果变更 | Sprint复盘报告、下一Sprint规划 | 更新sprint_review.json，通知agile-sprint-planning |
| Retro改进建议变更 | 下一Sprint行动项、团队改进计划 | 更新sprint_retro.json，通知agile-sprint-planning |
| 行动项状态变更 | 团队执行跟踪、后续Sprint验证 | 更新metadata.json，通知相关行动项负责人 |
| 复盘报告变更 | 下一Sprint规划、团队改进计划 | 更新sprint-retro-S{NN}.json，通知agile-sprint-planning |
| 改进行动项变更 | 团队执行跟踪、后续Sprint验证 | 更新sprint-retro-S{NN}.json，通知行动项负责人 |
| 速率预测变更 | Sprint规划容量参考 | 更新sprint-retro-S{NN}.json，通知agile-sprint-planning |
| 上线复盘行动项新增 | 行动项追踪 | 更新release_retro.json，通知change-impact-analysis |
| 上线复盘行动项状态变更 | 行动项追踪、后续验证 | 更新release_retro.json，通知行动项负责人 |
| 上线复盘指标异常 | 深度分析触发 | 更新release-retro-{release_id}.json，触发深度分析 |
| 上线复盘报告变更 | 下一发布规划、团队改进计划 | 更新release-retro-{release_id}.json，通知相关团队 |

### 复盘反馈回传机制

复盘的核心价值在于驱动持续改进闭环。以下定义了复盘结论回传上游 Skill 的规则，确保改进建议和行动项不仅停留在报告层面，而是能实际影响上游决策。

#### Sprint复盘反馈回传

| 复盘结论类型 | 回传目标 | 回传内容 | 回传方式 |
|-------------|----------|----------|----------|
| 速率预测变更 | agile-sprint-planning | velocity_range、capacity_adjustment | 写入 output/pm-project/agile-review/sprint-retro-S{NN}.json 的 next_sprint_recommendation，agile-sprint-planning 消费该字段作为下一Sprint容量规划输入 |
| 溢出根因模式 | agile-sprint-planning | spill_reasons 中的 recurring/persistent 类型 | 写入 sprint_retro.json 的 problems_identified，agile-sprint-planning 在规划阶段检查历史溢出根因 |
| 跨团队依赖阻塞 | agile-sprint-planning | collaboration 类型的 persistent 问题 | 写入 sprint_retro.json 的 problems_identified，agile-sprint-planning 在依赖确认环节引用 |
| 需求变更频繁 | design-prd、change-impact-analysis | 需求变更导致的溢出统计 | 写入 sprint_retro.json 的 problems_identified，标记 category=process，design-prd 在需求收集阶段参考历史变更频率 |
| 质量问题模式 | quality-acceptance | defect_density 趋势、rework_rate | 写入 sprint_retro.json 的 metrics，quality-acceptance 在验收标准制定时参考历史质量数据 |
| 改进实验结果 | agile-sprint-planning | 上一Sprint experiments 的执行结果 | 写入 sprint-retro-S{NN}.json 的 action_items.try，agile-sprint-planning 在下一Sprint规划时验证实验是否有效 |

#### 上线复盘反馈回传

| 复盘结论类型 | 回传目标 | 回传内容 | 回传方式 |
|-------------|----------|----------|----------|
| 目标未达成 | design-prd | goal_vs_actual 中 not_achieved 项 | 写入 release-retro-{release_id}.json 的 effectiveness，design-prd 在下次PRD生成时参考历史目标达成率 |
| Bug泄漏率上升 | quality-acceptance | leakage_rate 趋势和 root_cause_patterns | 写入 release-retro-{release_id}.json 的 quality，quality-acceptance 在测试策略制定时参考 |
| 技术债务增加 | Backend Skill（backend-architecture-spec） | tech_debt_analysis 中的 debt_items | 写入 release-retro-{release_id}.json 的 quality，backend-architecture-spec 在架构设计时参考技术债务清单 |
| 协作瓶颈 | agile-sprint-planning | bottlenecks_identified | 写入 release-retro-{release_id}.json 的 process，agile-sprint-planning 在Sprint规划时规避已知瓶颈 |
| 发布流程问题 | monitoring-pipeline | issue_discovery_timing 中的 needs_improvement/critical 项 | 写入 release-retro-{release_id}.json 的 process，monitoring-pipeline 在监控策略制定时参考 |

#### 反馈回传执行规则

1. **自动回传**：复盘报告生成后，自动将回传内容写入对应输出文件，下游 Skill 在执行时消费
2. **回传标注**：所有回传内容须标注来源（`source: "agile-review", sprint_id/release_id`），便于追溯
3. **回传验证**：回传内容须经过质量检查（数据完整、结论有证据支撑），不达标的回传内容标注"待验证"
4. **闭环检查**：下一Sprint复盘时，检查上一Sprint回传的改进实验是否被执行，未执行的升级为团队讨论项

---

## 版本历史

- v1.0: 初始版本（agile-review）
- v2.0: 合并 agile-review + sprint-retrospective-report，新增Step 2复盘报告生成（Sprint目标达成分析、交付质量评估、团队速率趋势、改进行动项、下一Sprint建议）
- v3.0: 合并 retrospective-auto，新增Step 3上线复盘（效果复盘、工程质量复盘、过程复盘、改进行动项生成），扩展输入/输出/校验规则/通知机制
- v3.1: 新增复盘反馈回传机制——Sprint复盘反馈回传（6类：速率预测/溢出根因/跨团队依赖/需求变更/质量问题/改进实验）和上线复盘反馈回传（5类：目标未达成/Bug泄漏/技术债务/协作瓶颈/发布流程），定义回传执行规则（自动回传/回传标注/回传验证/闭环检查）
