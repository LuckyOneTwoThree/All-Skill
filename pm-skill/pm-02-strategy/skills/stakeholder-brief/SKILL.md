---
name: stakeholder-brief
description: 当需要向不同受众快速传达战略核心信息时使用。战略简报自动生成，根据受众类型（高管/团队/外部）自动适配内容深度和表达方式，输出一页纸战略简报。关键词：战略简报、一页纸、高管简报、团队对齐、外部沟通。
metadata:
  module: "产品商业与战略"
  sub-module: "利益相关者管理"
  type: "pipeline"
  version: "2.0"
  interaction_mode: "ai_suggest_human_approve"
---

# 战略简报自动生成

## 核心原则

1. **一页纸原则**——决策层没有时间看长文，核心论点必须一页纸说清
2. **受众适配**——高管侧重战略ROI、团队侧重执行协作、外部侧重价值信任
3. **关键信息不遗漏**——战略目标/核心风险/行动项缺一不可，缺一则退回
4. **敏感数据脱敏**——外部简报自动脱敏，行动项>3个时建议聚焦

## 交互模式
🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 商业战略报告 | JSON | 是 | output/pm-strategy/business-strategy-report/business-strategy-report.json | 战略方向、OKR、路线图 |
| 利益相关者地图 | JSON | ○ | output/pm-strategy/stakeholder-map/stakeholder-map.json | 受众类型、影响力 |
| 受众类型 | string | 是 | 用户提供 | executive/team/external |

## 执行步骤

### Step 1: 受众分析

根据受众类型确定简报策略：

| 受众 | 关注点 | 深度 | 表达方式 |
|------|--------|------|----------|
| 高管(executive) | 战略ROI、风险、决策 | 高层概览 | 数据驱动、结论先行 |
| 团队(team) | 目标、协作、执行 | 中等细节 | 清晰行动项、时间线 |
| 外部(external) | 价值、信任、合作 | 精选信息 | 价值导向、脱敏处理 |

### Step 2: 核心信息提取

从战略报告中提取核心信息：

**必含信息（缺一不可）**：
1. 战略目标（1-3个）
2. 核心风险（Top3）
3. 行动项（3-5个）

**可选信息**：
- 市场数据
- 竞争态势
- 资源需求
- 时间线

### Step 3: 简报生成

按受众类型生成简报：

**高管简报模板**：
```
# {产品名}战略简报

## 战略方向
- [方向1]：[一句话说明+预期ROI]
- [方向2]：[一句话说明+预期ROI]

## 关键指标
- 北极星指标：[指标名]=[当前值]→[目标值]
- 核心OKR：[O1] / [O2]

## 核心风险
1. [风险1]：[概率]×[影响]=[风险等级]
2. [风险2]：[概率]×[影响]=[风险等级]
3. [风险3]：[概率]×[影响]=[风险等级]

## 决策请求
- [ ] [决策项1]
- [ ] [决策项2]

## 下一步行动
1. [行动1] - 负责人 - 截止日期
2. [行动2] - 负责人 - 截止日期
```

**团队简报模板**：
```
# {产品名}战略对齐简报

## 我们的方向
- 战略目标：[O1] / [O2]
- 本季度重点：[重点1] / [重点2]

## 我们的目标
- KR1：[目标值]（当前：[基线值]）
- KR2：[目标值]（当前：[基线值]）

## 协作要点
- [团队A]负责[事项]
- [团队B]负责[事项]
- 依赖关系：[说明]

## 里程碑
- [日期]：[里程碑1]
- [日期]：[里程碑2]
```

**外部简报模板**：
```
# {产品名}合作简报

## 产品价值
- [价值主张1]
- [价值主张2]

## 合作机会
- [合作方向1]
- [合作方向2]

## 联系方式
- [联系人]
```

### Step 4: 脱敏处理

对外部简报进行脱敏：
- 移除内部OKR数据
- 移除具体财务数字
- 移除竞品对比细节
- 保留价值主张和合作方向

## 输出

**存储路径**：`output/pm-strategy/stakeholder-brief/`

**输出文件**：

| 文件 | 格式 | 说明 |
|------|------|------|
| stakeholder-brief-{audience}.md | Markdown | 面向特定受众的简报 |
| stakeholder-brief.json | JSON | 结构化数据 |

### 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| brief_metadata.audience_type | string | 是 | executive/team/external |
| brief_metadata.generated_at | string | 是 | 生成时间戳 |
| brief_content.strategic_goals | array | 是 | 1-3个战略目标 |
| brief_content.key_risks | array | 是 | Top3风险 |
| brief_content.action_items | array | 是 | 3-5个行动项 |
| brief_content.decision_requests | array | ○ | 决策请求（高管简报必填） |
| brief_content.milestones | array | ○ | 里程碑（团队简报必填） |
| brief_content.value_propositions | array | ○ | 价值主张（外部简报必填） |
| brief_content.desensitized | boolean | 是 | 是否已脱敏（外部简报必须为true） |

```json
{
  "brief_metadata": {
    "audience_type": "executive",
    "generated_at": "时间戳",
    "source_report": "business-strategy-report.json"
  },
  "brief_content": {
    "strategic_goals": ["目标1", "目标2"],
    "key_risks": [
      {"risk": "风险1", "probability": "high", "impact": "high"},
      {"risk": "风险2", "probability": "medium", "impact": "high"},
      {"risk": "风险3", "probability": "low", "impact": "medium"}
    ],
    "action_items": [
      {"action": "行动1", "owner": "负责人", "deadline": "截止日期"},
      {"action": "行动2", "owner": "负责人", "deadline": "截止日期"}
    ],
    "decision_requests": ["决策1", "决策2"],
    "desensitized": false
  }
}
```

## 决策规则

| 条件 | 决策 |
|------|------|
| 战略目标缺失 | 退回补充，不可生成简报 |
| 核心风险缺失 | 退回补充，不可生成简报 |
| 行动项缺失 | 退回补充，不可生成简报 |
| 行动项>3个 | 标注"建议聚焦Top3" |
| 外部简报含敏感数据 | 自动脱敏处理 |

## 质量检查

- [ ] 一页纸可读完
- [ ] 三要素齐全（目标/风险/行动）
- [ ] 受众适配正确
- [ ] 外部简报已脱敏
- [ ] 行动项有负责人和截止日期

---

## 降级策略

当上游文件不存在时，本Skill仍可独立执行：

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| business-strategy-report.json | 用户提供战略要点 → 生成简报 | 缺乏结构化战略数据，简报内容可能不够完整 |
| stakeholder-map.json | 用户提供受众信息 → 生成简报 | 缺乏利益相关者地图，受众分析可能不够精准 |
| business-strategy-report.json + stakeholder-map.json | 用户提供战略要点和受众信息 → 生成简报 | 整体置信度降低，简报缺乏数据锚定 |
| 所有上游文件均缺失 | 提示用户先执行前序阶段，或基于用户提供的战略要点生成简报 | 整体置信度显著降低，简报仅为用户提供信息的重组 |

---

## 上游变更响应

### 上游变更影响表

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| business-strategy-report战略方向调整 | 简报战略目标和风险 | 重新提取核心信息，更新简报 |
| stakeholder-map利益相关者变更 | 受众分析 | 重新执行Step 1，更新受众策略 |

### 下游通知机制表

| 变更类型 | 影响范围 | 通知方式 |
|----------|----------|----------|
| 简报内容变更 | stakeholder-strategy-doc | 输出文件版本号+变更摘要 |
| 受众策略调整 | stakeholder-strategy-doc | 输出文件版本号+变更摘要 |
