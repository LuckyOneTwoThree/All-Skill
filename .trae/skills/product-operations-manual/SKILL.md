---
name: product-operations-manual
description: 当需要将运营策略和流程汇总为完整可交付的产品运营手册时使用。产品运营手册自动生成，包含日常运营SOP、内容运营规范、用户运营策略、活动运营模板和应急响应流程。关键词：运营手册、运营SOP、内容运营、用户运营、活动运营、应急响应、运营流程、日常运营、运营规范。
metadata:
  module: "产品增长与运营"
  sub-module: "增长模式"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["互联网", "SaaS", "通用"]
  trigger_examples:
    - "运营手册怎么写"
    - "日常运营流程怎么规范"
    - "帮我整理运营SOP"
  interaction_mode: "ai_suggest_human_approve"
---

# 产品运营手册生成

## 核心原则

**运营手册是团队的肌肉记忆，不是束之高阁的文档**

产品运营手册的核心价值在于让团队在无指导的情况下也能正确执行日常运营。手册不是写完就结束的文档，而是持续更新的活文档，是团队协作的最低共识。

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 增长模式 | markdown | 否 | growth-model | 增长模式、飞轮模型、瓶颈环节 |
| 激活策略 | markdown | 否 | activation-onboarding | Onboarding流程、激活策略 |
| 留存策略 | markdown | 否 | retention-management | 分层运营、促活策略 |
| 变现策略 | markdown | 否 | revenue-funnel | 付费漏斗、定价策略 |
| 产品信息 | text | 是 | 用户输入 | 产品功能、运营目标、团队结构 |

## 执行步骤

### Step 1：日常运营 SOP

定义产品日常运营的标准操作流程：

1. **日运营检查清单**：
   - 核心指标看板检查（DAU/收入/转化率）
   - 异常告警确认与处理
   - 用户反馈渠道巡查
   - 内容发布排期确认
2. **周运营节奏**：
   - 周一：上周数据复盘 + 本周目标设定
   - 周三：中期检查 + 策略微调
   - 周五：周报输出 + 下周排期
3. **月运营节奏**：
   - 月度OKR回顾与校准
   - 运营活动效果评估
   - 下月运营计划制定

### Step 2：内容运营规范

定义内容运营的标准和流程：

1. **内容类型矩阵**：产品更新、用户故事、行业洞察、教程指南、活动公告
2. **内容生产流程**：选题→撰写→审核→发布→推广→复盘
3. **内容质量标准**：标题规范、字数范围、配图要求、SEO优化
4. **内容分发渠道**：官网、公众号、社区、邮件、Push、社交媒体
5. **内容日历模板**：周/月内容排期模板

### Step 3：用户运营策略

定义用户运营的分层策略和执行方法：

1. **用户分层模型**：基于RFM或生命周期的用户分层
2. **分层运营策略**：
   - 新用户：Onboarding引导 + 首次价值体验
   - 活跃用户：深度使用 + 社区参与
   - 沉默用户：召回策略 + 价值再发现
   - 流失用户：流失预警 + 挽回方案
3. **触达策略**：Push、邮件、短信、站内信的触达频率和内容规范
4. **用户反馈处理**：反馈收集→分类→响应→闭环的SLA

### Step 4：活动运营模板

定义活动运营的标准模板和流程：

1. **活动类型**：拉新活动、促活活动、付费转化、品牌传播
2. **活动策划模板**：目标→受众→玩法→预算→排期→风险
3. **活动执行检查清单**：上线前/中/后的检查项
4. **活动复盘模板**：数据回顾→效果评估→经验沉淀→改进建议
5. **活动预算模板**：费用明细、ROI预估、审批流程

### Step 5：应急响应流程

定义运营异常的应急响应流程：

1. **异常分级**：P0（服务不可用）→ P1（核心功能受损）→ P2（体验降级）→ P3（轻微影响）
2. **响应SLA**：P0 5分钟响应、P1 15分钟响应、P2 1小时响应、P3 4小时响应
3. **升级路径**：运营→产品→技术→管理层的升级条件
4. **应急沟通模板**：用户公告、内部通报、事后总结
5. **常见应急场景**：服务器故障、数据异常、负面舆情、安全事件

### Step 6：报告组装

将以上内容组装为完整运营手册。

## 输出

### 输出文件

| 文件 | 路径 | 说明 |
|------|------|------|
| 产品运营手册 | `output/pm-growth/product-operations-manual/product-operations-manual.md` | 人类可读的完整手册 |
| 结构化数据 | `output/pm-growth/product-operations-manual/product-operations-manual.json` | 机器可消费的结构化数据 |

**输出Schema**：

```json
{
  "type": "object",
  "required": ["product_name", "daily_sop", "user_operations", "emergency_response"],
  "properties": {
    "product_name": {"type": "string", "description": "产品名称"},
    "report_date": {"type": "string", "description": "报告日期"},
    "daily_sop": {"type": "object", "description": "日常运营SOP，包含日/周/月检查清单"},
    "content_operations": {"type": "object", "description": "内容运营规范，包含类型矩阵、生产流程和质量标准"},
    "user_operations": {"type": "object", "description": "用户运营策略，包含分层模型和触达策略"},
    "activity_operations": {"type": "object", "description": "活动运营模板，包含策划和复盘模板"},
    "emergency_response": {"type": "object", "description": "应急响应流程，包含分级标准和SLA"}
  }
}
```

## 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| product_name | string | 是 | 产品名称，不可为空 |
| daily_sop | object | 是 | 日常运营SOP，须含daily_checklist/weekly_rhythm/monthly_rhythm |
| daily_sop.daily_checklist | array | 是 | 日检查清单，至少3项 |
| user_operations | object | 是 | 用户运营策略，须含segmentation_model/segment_strategies |
| user_operations.segment_strategies | array | 是 | 分层策略，至少覆盖新/活跃/沉默/流失4类 |
| emergency_response | object | 是 | 应急响应，须含severity_levels/response_sla |
| emergency_response.severity_levels | array | 是 | 异常分级，至少覆盖P0-P3 |
| content_operations | object | 否 | 内容运营规范 |
| activity_operations | object | 否 | 活动运营模板 |

## 质量检查

| 检查项 | 标准 | 不通过处理 |
|--------|------|------------|
| SOP可执行 | 每项SOP有具体动作和时间节点 | 补充执行细节 |
| 分层策略完整 | 至少覆盖新/活跃/沉默/流失4类用户 | 补充缺失分层 |
| 应急流程可操作 | P0-P3均有响应SLA和升级路径 | 补充缺失级别 |
| 模板可直接使用 | 活动模板有占位符和填写说明 | 补充模板细节 |

## 决策规则

- 当增长模式为PLG时，用户运营策略侧重自助激活和病毒传播
- 当增长模式为SLG时，运营SOP侧重销售支持和客户成功
- 当应急事件为P0级别时，自动触发升级路径至技术团队
- 需要人类确认的决策点：运营节奏设定、用户分层标准、触达频率上限、应急升级阈值

## 降级策略

### 上游文件缺失降级方案

| 缺失的上游输入 | 降级方案 | 输出影响 |
|----------|----------|----------|
| 无增长模式 | 手册聚焦通用运营SOP，增长策略部分标注"待增长模式诊断" | 运营SOP缺乏增长模式导向 |
| 无各环节策略 | 手册提供标准模板和最佳实践，标注"待策略定制" | 运营策略为通用模板，非定制化 |
| 无产品信息 | 无法生成，要求用户提供基本信息 | 无输出 |

## 上游变更响应

### 上游变更影响表

| 上游来源 | 变更类型 | 影响范围 | 响应动作 |
|----------|----------|----------|----------|
| growth-model | 增长模式变更 | 运营SOP和用户运营策略 | 调整运营节奏和分层策略 |
| activation-onboarding | Onboarding流程变更 | 新用户运营策略 | 更新新用户引导SOP |
| retention-management | 分层策略变更 | 用户运营策略 | 更新分层模型和触达策略 |
| revenue-funnel | 付费漏斗变更 | 变现运营策略 | 更新付费转化运营SOP |

### 下游通知机制表

| 下游消费者 | 通知条件 | 通知方式 | 通知内容 |
|------------|----------|----------|----------|
| growth-orchestrator | 运营手册生成完成 | 输出文件更新 | 手册完成状态和关键结论 |
| 用户提供 | 运营手册生成完成 | 输出文件 | 完整产品运营手册 |
