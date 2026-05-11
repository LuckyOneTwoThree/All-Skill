---
name: user-feedback-loop-report
description: 当需要将用户反馈处理过程汇总为完整可交付的闭环报告时使用。用户反馈闭环报告自动生成，包含反馈来源分析、处理进度追踪、闭环率统计、未解决问题和改进建议。关键词：用户反馈闭环、反馈报告、反馈追踪、闭环率、VOC闭环、反馈处理。
metadata:
  module: "产品监控与迭代"
  sub-module: "监控预警"
  type: "pipeline"
  version: "2.0"
  interaction_mode: "ai_suggest_human_approve"
---

# 用户反馈闭环报告生成

## 核心原则

**每一条用户反馈都值得被回应**

用户反馈闭环报告的核心价值在于确保每一条用户反馈都有始有终。闭环不是形式上的"已读"，而是实质上的"已处理"或"已决策"。未闭环的反馈是用户信任的流失。

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 来源 | 必需 | 说明 |
|--------|------|------|------|
| 用户声音分析 | output/pm-discovery/user-research-voice-analysis | ⬜ | 情感分析、主题提取、痛点清单 |
| 异常监控数据 | output/pm-monitoring/monitoring-anomaly | ⬜ | 异常事件、用户影响范围 |
| 反馈数据 | 用户提供 | ✅ | 各渠道用户反馈原始数据 |
| 处理记录 | 用户提供 | ⬜ | 已处理反馈的记录和结果 |

### 降级策略

| 缺失输入 | 降级方案 |
|----------|----------|
| 无用户声音分析 | 基于原始反馈数据自行分类分析，标注"待VOC深度分析" |
| 无异常监控数据 | 跳过异常关联分析，标注"待监控数据补充" |
| 无处理记录 | 仅统计反馈来源和分类，闭环率标注"待处理记录补充" |
| 无反馈数据 | 若用户未提供反馈数据，提示用户提供或跳过该输入相关步骤 |

## 执行步骤

### Step 1：反馈来源分析

统计和分析反馈的来源分布：

1. **渠道分布**：App内反馈 / 客服工单 / 社交媒体 / 应用商店 / 社区 / 邮件
2. **情感分布**：正面 / 中性 / 负面 及占比
3. **主题分布**：按功能模块分类的反馈分布
4. **时间趋势**：反馈量的时间变化趋势

### Step 2：处理进度追踪

追踪每条反馈的处理状态：

1. **状态分类**：
   - 🆕 新增（未处理）
   - 👀 评估中（确认有效性）
   - 📋 已排期（纳入迭代计划）
   - 🔨 处理中（开发/修复进行中）
   - ✅ 已闭环（问题已解决并验证）
   - ❌ 已关闭（不处理，附理由）
2. **处理时效**：各状态的平均停留时间
3. **瓶颈识别**：处理流程中的堵点

### Step 3：闭环率统计

计算和追踪反馈闭环率：

1. **整体闭环率**：已闭环 + 已关闭 / 总反馈数
2. **按渠道闭环率**：各渠道的闭环率对比
3. **按严重度闭环率**：P0/P1/P2/P3的闭环率
4. **闭环时效**：从反馈到闭环的平均时间
5. **趋势对比**：与上一周期的闭环率对比

### Step 4：未解决问题分析

分析尚未闭环的反馈：

1. **P0/P1未解决清单**：高优先级未解决问题
2. **长期未解决**：超过30天未闭环的反馈
3. **重复反馈**：多次反馈的同类问题
4. **根因分析**：未闭环的主要原因分类

### Step 5：改进建议

基于闭环分析提出改进建议：

1. **流程改进**：缩短处理时效的流程优化
2. **产品改进**：高频反馈对应的产品优化方向
3. **沟通改进**：用户反馈回应的沟通策略
4. **预防措施**：减少同类反馈的预防方案

### Step 6：报告组装

将以上内容组装为完整闭环报告。

## 输出

### 输出文件

| 文件 | 路径 | 说明 |
|------|------|------|
| 反馈闭环报告 | `output/pm-monitoring/user-feedback-loop-report/feedback-loop-report.md` | 人类可读的完整报告 |
| 结构化数据 | `output/pm-monitoring/user-feedback-loop-report/feedback-loop-report.json` | 机器可消费的结构化数据 |

**输出Schema**：

```json
{
  "type": "object",
  "required": ["report_period", "summary", "closure_metrics"],
  "properties": {
    "report_period": {"type": "object", "description": "报告周期，包含起止日期"},
    "report_date": {"type": "string", "description": "报告日期"},
    "summary": {"type": "object", "description": "执行摘要，包含总反馈数、闭环率和P0未解决数"},
    "source_analysis": {"type": "object", "description": "反馈来源分析，包含渠道/情感/主题分布"},
    "processing_status": {"type": "object", "description": "处理进度，包含状态分布和瓶颈"},
    "closure_metrics": {"type": "object", "description": "闭环率统计，包含整体和分渠道/分严重度闭环率"},
    "unresolved": {"type": "object", "description": "未解决问题，包含P0/P1清单和根因分析"},
    "improvement_suggestions": {"type": "array", "description": "改进建议列表"}
  }
}
```

### Markdown 报告结构

```markdown
# 用户反馈闭环报告：{报告周期}

## 1. 执行摘要
- 总反馈数 / 闭环率 / 平均闭环时间 / P0未解决数

## 2. 反馈来源分析
- 渠道分布
- 情感分布
- 主题分布
- 时间趋势

## 3. 处理进度追踪
- 状态分布
- 处理时效
- 瓶颈识别

## 4. 闭环率统计
- 整体闭环率
- 分渠道/分严重度闭环率
- 闭环时效
- 趋势对比

## 5. 未解决问题
- P0/P1未解决清单
- 长期未解决
- 重复反馈
- 根因分析

## 6. 改进建议
- 流程改进
- 产品改进
- 沟通改进
- 预防措施
```

### JSON 结构

```json
{
  "report_period": { "start": "", "end": "" },
  "report_date": "",
  "summary": {
    "total_feedback": 0,
    "closure_rate": 0,
    "avg_closure_time_days": 0,
    "p0_unresolved": 0
  },
  "source_analysis": {
    "channel_distribution": {},
    "sentiment_distribution": {},
    "topic_distribution": {},
    "time_trend": []
  },
  "processing_status": {
    "status_distribution": {},
    "avg_time_by_status": {},
    "bottlenecks": []
  },
  "closure_metrics": {
    "overall_rate": 0,
    "by_channel": {},
    "by_severity": {},
    "trend_comparison": {}
  },
  "unresolved": {
    "p0_p1_list": [],
    "long_standing": [],
    "repeated": [],
    "root_causes": []
  },
  "improvement_suggestions": []
}
```

## 质量检查

| 检查项 | 标准 | 不通过处理 |
|--------|------|------------|
| 闭环率可计算 | 有明确的闭环定义和计算公式 | 明确闭环标准 |
| P0未解决已列出 | 所有P0未闭环反馈有清单 | 补充P0清单 |
| 时效数据完整 | 各状态平均处理时间可计算 | 补充时效数据 |
| 改进建议可执行 | 每项建议有责任方和时间节点 | 补充执行细节 |

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|----------|----------|----------|
| 无用户声音分析 | 基于用户提供反馈数据直接分析，标注"VOC分析待补充" | 反馈分析缺乏情感和主题维度 |
| 无异常监控数据 | 跳过异常关联分析，标注"监控数据待补充" | 反馈与异常事件的关联缺失 |
| 无处理记录 | 仅统计反馈数量和分类，闭环率标注"无法计算" | 闭环率不可计算 |

## 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| summary | object | 是 | 执行摘要，须含total_feedback/closed_rate |
| source_analysis | object | 是 | 反馈来源分析 |
| progress_tracking | object | 否 | 处理进度追踪 |
| closed_rate | object | 否 | 闭环率统计，须含overall/by_category |
| unresolved_p0 | array | 否 | P0未解决清单 |
| improvement_suggestions | array | 否 | 改进建议列表 |

## 上游变更响应

### 上游变更影响表

| 上游来源 | 变更类型 | 影响范围 | 响应动作 |
|----------|----------|----------|----------|
| user-research-voice-analysis | VOC分析结果更新 | 反馈来源分析和情感维度 | 更新情感分布和主题分类 |
| monitoring-anomaly | 异常事件更新 | 反馈与异常关联分析 | 更新关联事件和影响范围 |

### 下游通知机制表

| 下游消费者 | 通知条件 | 通知方式 | 通知内容 |
|------------|----------|----------|----------|
| monitoring-orchestrator | 反馈闭环报告完成 | 输出文件更新 | 报告完成状态和关键结论 |
| iteration-backlog | P0未解决反馈 | 写入输出文件 | P0反馈清单和改进建议 |
