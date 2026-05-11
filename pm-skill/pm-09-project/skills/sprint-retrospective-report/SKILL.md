---
name: sprint-retrospective-report
description: 当需要将Sprint执行数据汇总为完整可交付的复盘报告时使用。Sprint复盘报告自动生成，包含Sprint目标达成分析、交付质量评估、团队速率趋势、改进行动项和下一Sprint建议。关键词：Sprint复盘、迭代复盘、Sprint报告、团队回顾、改进行动项。
metadata:
  module: "项目管理与执行"
  sub-module: "敏捷执行"
  type: "pipeline"
  version: "1.0"
  interaction_mode: "ai_suggest_human_approve"
  upstream:
    - agile-sprint-planning
    - agile-daily-sync
    - agile-review
---

# Sprint复盘报告生成

## 核心原则

**复盘是为了学习，不是为了追责**

Sprint复盘报告的核心价值在于从每个迭代中提取可复用的学习，形成团队持续改进的飞轮。复盘不是评分卡，而是改进路线图。

## 输入

| 输入项 | 来源 | 必需 | 说明 |
|--------|------|------|------|
| Sprint计划 | output/pm-project/agile-sprint-planning | ✅ | Sprint Goal、Story列表、容量分配 |
| 每日同步记录 | output/pm-project/agile-daily-sync | ⬜ | 障碍追踪、风险记录、进展更新 |
| Sprint评审结果 | output/pm-project/agile-review | ✅ | 交付物、反馈、改进建议 |
| 历史Sprint数据 | 用户提供 | ⬜ | 过往3-5个Sprint的速率和交付数据 |

### 降级策略

| 缺失输入 | 降级方案 |
|----------|----------|
| 无Sprint计划 | 基于评审结果反推Sprint目标，标注"计划信息缺失" |
| 无每日同步记录 | 跳过障碍分析环节，标注"障碍数据缺失" |
| 无Sprint评审结果 | 仅生成基于计划的执行分析，标注"等待评审结果" |
| 无历史数据 | 跳过速率趋势分析，标注"首次Sprint无趋势数据" |

## 执行步骤

### Step 1：Sprint目标达成分析

对比计划与实际交付：

1. **Sprint Goal达成度**：完全达成 / 部分达成 / 未达成
2. **Story完成率**：计划Story数 vs 完成Story数 vs 溢出Story数
3. **Story Point达成率**：承诺SP vs 完成SP vs 溢出SP
4. **溢出分析**：溢出Story的根因分类（估时不准/需求变更/技术债务/外部依赖）

### Step 2：交付质量评估

评估本Sprint交付物的质量状况：

1. **缺陷密度**：每Story Point的缺陷数，与历史均值对比
2. **缺陷分布**：按严重程度（P0/P1/P2/P3）分布
3. **返工率**：因质量问题导致的返工Story占比
4. **技术债务**：本Sprint新增/偿还的技术债务

### Step 3：团队速率分析

分析团队交付速率趋势：

1. **本Sprint速率**：完成SP、有效工作天数、日均SP
2. **速率趋势**：近5个Sprint的速率变化趋势（上升/稳定/下降）
3. **速率波动**：标准差和变异系数，评估可预测性
4. **容量利用率**：实际产出 vs 可用容量的比率

### Step 4：改进行动项提取

从执行数据中提取可操作的改进建议：

1. **做得好的**（Keep）：本Sprint值得保持的做法
2. **需要改进的**（Improve）：本Sprint暴露的问题和改进方向
3. **新尝试的**（Try）：下个Sprint建议引入的新实践
4. **行动项清单**：每项改进有明确负责人、截止日期和验收标准

### Step 5：下一Sprint建议

基于复盘结论为下一Sprint提供建议：

1. **速率预测**：基于趋势预测下一Sprint可承诺SP范围
2. **风险预判**：基于本Sprint溢出根因预判下Sprint风险
3. **容量建议**：考虑假期、人员变动等因素的容量调整
4. **改进实验**：建议在下一Sprint中验证的1-2个改进实验

### Step 6：报告组装

将以上内容组装为完整报告。

## 输出

### 输出文件

| 文件 | 路径 | 说明 |
|------|------|------|
| Sprint复盘报告 | `output/pm-project/sprint-retrospective-report/sprint-retro-S{NN}.md` | 人类可读的完整报告 |
| 结构化数据 | `output/pm-project/sprint-retrospective-report/sprint-retro-S{NN}.json` | 机器可消费的结构化数据 |

### Markdown 报告结构

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

### JSON 结构

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

## 质量检查

| 检查项 | 标准 | 不达标处理 |
|--------|------|------------|
| 目标达成与数据一致 | 达成度判定与Story完成率吻合 | 重新评估达成度 |
| 溢出根因已分类 | 每个溢出Story有根因标签 | 补充根因分析 |
| 行动项可执行 | 每项有负责人和截止日期 | 补充执行细节 |
| 速率趋势有依据 | 趋势判断基于至少3个Sprint数据 | 标注"数据不足，趋势待观察" |
