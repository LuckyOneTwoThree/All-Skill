---
name: agile-retrospective
description: 当需要辅助迭代复盘时使用。迭代复盘报告生成工具，帮助整理Good/Better/Best、行动项和趋势分析。关键词：迭代复盘、Retro、复盘报告、行动项、持续改进。
metadata:
  module: "项目管理与执行"
  sub-module: "敏捷执行"
  type: "pipeline"
  version: "2.0"
  domain_tags: ["互联网", "软件", "通用"]
  interaction_mode: "human_ai_collaborate"
execution_depth:
  default: standard
---

# 迭代复盘报告生成

## 核心原则

1. **复盘是为了学习，不是为了追责**：Sprint复盘报告的核心价值在于从每个迭代中提取可复用的学习，形成团队持续改进的飞轮。复盘不是评分卡，而是改进路线图
2. **透明度即协作**：复盘结论、改进建议全员可见，确保团队对齐
3. **闭环改进**：每个Sprint的复盘结论必须转化为下一Sprint的具体行动项，改进建议不被遗忘，而是成为下一轮规划的输入
4. **数据驱动**：复盘结论须有数据支撑，避免主观臆断

## 基本信息

| 项目 | 值 |
|------|-----|
| Pipeline ID | agile-retrospective |
| 版本 | 2.0 |
| 模块 | 项目管理与执行 / 敏捷执行 |
| 交互模式 | 人机协同 |
| 上游依赖 | agile-sprint-review、agile-sprint-planning |
| 下游衔接 | agile-sprint-planning（下一Sprint规划） |

## 交互模式

**👤🤖 人机协同**

- 数据分析、报告组装由AI自动完成
- Sprint Retro会议由人类参与讨论和决定
- 复盘报告需人类审核确认（Sprint Goal达成度判定、改进行动项负责人分配、下一Sprint容量预测）

---

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| sprint_review | object | 是 | output/pm-project/agile-sprint-review/sprint_review.json | Sprint评审数据，包含交付物、Demo清单和反馈 |
| sprint_retro | object | 是 | output/pm-project/agile-sprint-review/sprint_retro.json | Sprint回顾数据，包含指标、问题识别和改进建议 |
| sprint_backlog | object | 是 | output/pm-project/agile-sprint-planning/sprint_plan.json | Sprint计划的Stories |
| historical_sprint_data | text | ○ | 用户输入 | 过往3-5个Sprint的速率和交付数据 |
| team_data | object | ○ | 用户提供 | 团队绩效数据 |

## 执行步骤

### Step 1: Sprint目标达成分析 [核心]

对比计划与实际交付：

1. **Sprint Goal达成度**：完全达成 / 部分达成 / 未达成
2. **Story完成率**：计划Story数 vs 完成Story数 vs 溢出Story数
3. **Story Point达成率**：承诺SP vs 完成SP vs 溢出SP
4. **溢出分析**：溢出Story的根因分类（估时不准/需求变更/技术债务/外部依赖）

### Step 2: 交付质量评估 [核心]

评估本Sprint交付物的质量状况：

1. **缺陷密度**：每Story Point的缺陷数，与历史均值对比
2. **缺陷分布**：按严重程度（P0/P1/P2/P3）分布
3. **返工率**：因质量问题导致的返工Story占比
4. **技术债务**：本Sprint新增/偿还的技术债务

### Step 3: 团队速率分析 [条件]

分析团队交付速率趋势：

1. **本Sprint速率**：完成SP、有效工作天数、日均SP
2. **速率趋势**：近5个Sprint的速率变化趋势（上升/稳定/下降）
3. **速率波动**：标准差和变异系数，评估可预测性
4. **容量利用率**：实际产出 vs 可用容量的比率

### Step 4: 改进行动项提取 [核心]

从执行数据中提取可操作的改进建议：

1. **做得好的**（Keep）：本Sprint值得保持的做法
2. **需要改进的**（Improve）：本Sprint暴露的问题和改进方向
3. **新尝试的**（Try）：下个Sprint建议引入的新实践
4. **行动项清单**：每项改进有明确负责人、截止日期和验收标准

### Step 5: 下一Sprint建议 [深度]

基于复盘结论为下一Sprint提供建议：

1. **速率预测**：基于趋势预测下一Sprint可承诺SP范围
2. **风险预判**：基于本Sprint溢出根因预判下Sprint风险
3. **容量建议**：考虑假期、人员变动等因素的容量调整
4. **改进实验**：建议在下一Sprint中验证的1-2个改进实验

### Step 6: 报告组装 [核心]

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

## 输出

**存储路径**：`output/pm-project/agile-retrospective/`

### 输出深度分级

| 深度级别 | 输出范围 | 说明 |
|----------|----------|------|
| quick | 复盘核心结论 + TOP3改进项 | 核心结论 + 最小可行产物，仅输出Step 1/2/4核心结论 |
| standard | 完整复盘报告（当前默认） | 完整产物，包含Step 1-6全部输出 |
| deep | 完整复盘 + 扩展分析 | 完整产物 + 团队动力学分析 + 趋势对比 + 改进路线图 + 决策记录 + 风险评估 |

**输出文件**：

| 文件 | 路径 | 说明 |
|------|------|------|
| Sprint复盘报告 | sprint-retro-S{NN}.md | 人类可读的完整复盘报告 |
| 复盘结构化数据 | sprint-retro-S{NN}.json | 机器可消费的复盘结构化数据 |
| 元数据 | metadata.json | 元数据 |

**输出Schema**：

```json
{
  "type": "object",
  "required": ["retrospective_report", "metadata"],
  "properties": {
    "retrospective_report": {"type": "object", "description": "复盘报告数据，包含目标达成、交付质量、速率趋势、改进行动项"},
    "metadata": {"type": "object", "description": "元数据"}
  }
}
```

### 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
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
| metadata.sprint_id | string | 是 | Sprint标识，须与retrospective_report中一致 |
| metadata.generated_at | string | 是 | 生成时间，ISO 8601格式 |
| metadata.retro_completed | boolean | 是 | Retro是否完成 |
| metadata.report_completed | boolean | 是 | 复盘报告是否完成 |

### 输出示例

```json
{
  "retrospective_report": {
    "sprint_id": "S08",
    "goal_achievement": { /* status/sprint_goal/evidence */ },
    "delivery_metrics": { /* stories_planned/completed/spilled/sp_planned/completed/spill_reasons */ },
    "quality_metrics": { /* defect_density/defect_distribution/rework_rate/tech_debt_delta */ },
    "velocity": { /* current/trend/historical/capacity_utilization */ },
    "action_items": { /* keep[]/improve[]/try[] */ },
    "next_sprint_recommendation": { /* velocity_range/risks/capacity_adjustment/experiments */ }
  },
  "metadata": {
    "sprint_id": "SPR-2024-S08",
    "generated_at": "ISO datetime",
    "retro_completed": true,
    "report_completed": true
  }
}
```

---

## Retro时长建议

| 环节 | 建议时长 |
|------|----------|
| 数据回顾 | 15% |
| 问题讨论 | 50% |
| 改进建议 | 35% |

## 决策规则

| 条件 | 动作 |
|------|------|
| Sprint完成率 < 60% | 触发深度复盘 |
| 速率连续3个Sprint下降 | 自动标记为风险并建议专项复盘 |
| 返工率>20% | 质量改进行动项优先级提升为最高 |
| Sprint Goal未达成 | 溢出根因分析为必填项 |
| 改进建议连续2个Sprint未执行 | 升级至团队讨论 |

## 质量检查

### P0 检查（quick/standard/deep 都必须通过）

- [ ] 目标达成与数据一致（达成度判定与Story完成率吻合）
- [ ] 行动项可执行（每项有负责人和截止日期）

### P1 检查（standard/deep 必须通过）

- [ ] 溢出根因已分类（每个溢出Story有根因标签）
- [ ] 速率趋势有依据（趋势判断基于至少3个Sprint数据，否则标注"数据不足，趋势待观察"）
- [ ] 改进建议有明确负责人和跟进计划

### P2 检查（仅 deep 必须通过）

- [ ] 团队动力学分析完整（团队协作模式、沟通效率、决策质量）
- [ ] 趋势对比分析完整（跨Sprint指标趋势对比、改进效果追踪）
- [ ] 改进路线图已生成（短期/中期/长期改进计划，含里程碑和验收标准）

## 降级策略

### 上游文件缺失降级方案

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| Sprint评审数据 | 基于用户提供完成情况生成复盘，标注"评审数据缺失" | 缺少Demo和反馈维度，复盘基于交付数据 |
| Sprint回顾数据 | 跳过问题识别和改进建议环节，标注"回顾数据缺失" | 复盘报告缺少问题识别和改进建议维度 |
| Sprint计划 | 基于评审结果反推Sprint目标，标注"计划信息缺失" | 目标达成分析基于反推数据，缺少计划基准对比 |
| 历史Sprint数据 | 跳过速率趋势分析，标注"首次Sprint无趋势数据" | 无速率趋势和可预测性分析，需后续Sprint积累数据 |
| 团队绩效数据 | 跳过协作和效率维度分析，仅基于交付数据复盘 | Retro缺少团队协作和效率维度分析 |

### 数据获取说明

当上游文件缺失时，通过以下方式获取必要数据：

1. **Sprint评审数据缺失**：请用户提供完成情况，AI将据此生成复盘报告
2. **Sprint计划缺失**：基于评审结果反推目标，标注"计划信息缺失"
3. **历史Sprint数据缺失**：跳过速率趋势分析，标注"首次Sprint无趋势数据"
4. **数据不可用时**：生成复盘框架，关键指标标注"待数据补充"

## 上游变更响应

### 上游变更影响表

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| Sprint评审结果变更（交付物/反馈更新） | 交付质量评估、改进行动项 | 更新质量指标和改进建议，重新生成报告 |
| 历史Sprint数据补充 | 速率趋势分析、可预测性评估 | 重新计算速率趋势和预测范围 |
| Sprint计划变更 | 目标达成分析基准 | 重新评估目标达成度 |

### 下游通知机制表

| 变更类型 | 影响范围 | 通知方式 |
|----------|----------|----------|
| 复盘报告变更 | 下一Sprint规划、团队改进计划 | 更新sprint-retro-S{NN}.json，通知agile-sprint-planning |
| 改进行动项变更 | 团队执行跟踪、后续Sprint验证 | 更新sprint-retro-S{NN}.json，通知行动项负责人 |
| 速率预测变更 | Sprint规划容量参考 | 更新sprint-retro-S{NN}.json，通知agile-sprint-planning |

### 复盘反馈回传机制

复盘的核心价值在于驱动持续改进闭环。以下定义了复盘结论回传上游 Skill 的规则，确保改进建议和行动项不仅停留在报告层面，而是能实际影响上游决策。

| 复盘结论类型 | 回传目标 | 回传内容 | 回传方式 |
|-------------|----------|----------|----------|
| 速率预测变更 | agile-sprint-planning | velocity_range、capacity_adjustment | 写入 output/pm-project/agile-retrospective/sprint-retro-S{NN}.json 的 next_sprint_recommendation，agile-sprint-planning 消费该字段作为下一Sprint容量规划输入 |
| 溢出根因模式 | agile-sprint-planning | spill_reasons 中的 recurring/persistent 类型 | 写入 sprint-retro-S{NN}.json，agile-sprint-planning 在规划阶段检查历史溢出根因 |
| 跨团队依赖阻塞 | agile-sprint-planning | collaboration 类型的 persistent 问题 | 写入 sprint-retro-S{NN}.json，agile-sprint-planning 在依赖确认环节引用 |
| 需求变更频繁 | design-prd、change-impact-analysis | 需求变更导致的溢出统计 | 写入 sprint-retro-S{NN}.json，标记 category=process，design-prd 在需求收集阶段参考历史变更频率 |
| 质量问题模式 | quality-acceptance | defect_density 趋势、rework_rate | 写入 sprint-retro-S{NN}.json，quality-acceptance 在验收标准制定时参考历史质量数据 |
| 改进实验结果 | agile-sprint-planning | 上一Sprint experiments 的执行结果 | 写入 sprint-retro-S{NN}.json 的 action_items.try，agile-sprint-planning 在下一Sprint规划时验证实验是否有效 |

#### 反馈回传执行规则

1. **自动回传**：复盘报告生成后，自动将回传内容写入对应输出文件，下游 Skill 在执行时消费
2. **回传标注**：所有回传内容须标注来源（`source: "agile-retrospective", sprint_id`），便于追溯
3. **回传验证**：回传内容须经过质量检查（数据完整、结论有证据支撑），不达标的回传内容标注"待验证"
4. **闭环检查**：下一Sprint复盘时，检查上一Sprint回传的改进实验是否被执行，未执行的升级为团队讨论项

---
