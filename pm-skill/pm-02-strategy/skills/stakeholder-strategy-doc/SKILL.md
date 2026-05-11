---
name: stakeholder-strategy-doc
description: 当需要制定利益相关者战略文档时使用。利益相关者战略文档自动生成，整合利益相关者地图、沟通策略和战略报告，输出完整的利益相关者管理文档。关键词：利益相关者战略、沟通策略、利益相关者管理、战略文档。
metadata:
  module: "产品商业与战略"
  sub-module: "利益相关者管理"
  type: "pipeline"
  version: "2.0"
  interaction_mode: "ai_suggest_human_approve"
---

# 利益相关者战略文档自动生成

## 核心原则

1. **六章节闭环**——背景→机会→选择→成功→风险→资源形成完整逻辑闭环
2. **数据源标注**——每个章节标注数据来源，不可无据推演
3. **质量评分门控**——文档质量<60分自动修改，修改后仍不达标则人类审核
4. **跨部门强制审批**——涉及≥3个部门资源时强制人类审批

## 交互模式
🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 利益相关者地图 | JSON | 是 | output/pm-strategy/stakeholder-map/stakeholder-map.json | 利益相关者列表、四象限分类 |
| 商业战略报告 | JSON | 是 | output/pm-strategy/business-strategy-report/business-strategy-report.json | 战略方向、OKR、路线图 |
| 战略简报 | JSON | ○ | output/pm-strategy/stakeholder-brief/stakeholder-brief.json | 受众适配的简报内容 |

## 执行步骤

### Step 1: 文档结构规划

确定文档的6个核心章节：

1. **背景与现状**：为什么需要利益相关者管理
2. **机会与挑战**：利益相关者带来的机会和挑战
3. **策略选择**：针对不同利益相关者的策略
4. **成功标准**：如何衡量策略成功
5. **风险与预案**：利益相关者管理中的风险
6. **资源与行动**：需要的资源和行动计划

### Step 2: 背景与现状

整合利益相关者地图和战略报告：

**内容要点**：
- 产品战略背景
- 利益相关者全景图
- 关键利益相关者识别
- 当前关系状态

### Step 3: 机会与挑战

分析利益相关者带来的机会和挑战：

**机会分析**：
- 哪些利益相关者可以成为战略助力
- 如何利用影响力高的支持者
- 合作机会识别

**挑战分析**：
- 哪些利益相关者可能成为阻碍
- 利益冲突识别
- 潜在风险点

### Step 4: 策略选择

为每个关键利益相关者制定策略：

| 利益相关者 | 当前态度 | 目标态度 | 策略 | 关键行动 |
|-----------|---------|---------|------|---------|
| 产品VP | 支持 | 强力支持 | 深度参与 | 周度战略对齐会 |
| 技术总监 | 中立 | 支持 | 利益绑定 | 技术方案联合评审 |
| 财务总监 | 观望 | 支持 | 数据说服 | ROI专项汇报 |

### Step 5: 成功标准

定义策略成功的衡量标准：

| 指标 | 当前值 | 目标值 | 衡量方式 |
|------|--------|--------|---------|
| 关键决策者支持率 | 60% | 90% | 决策通过率 |
| 资源获取效率 | 中 | 高 | 资源申请周期 |
| 利益相关者满意度 | 3.5 | 4.5 | 季度调研 |

### Step 6: 风险与预案

识别利益相关者管理中的风险：

| 风险 | 概率 | 影响 | 预案 |
|------|------|------|------|
| 关键决策者变更 | 中 | 高 | 建立多决策者关系 |
| 利益冲突升级 | 低 | 高 | 提前识别+调解机制 |
| 沟通不畅 | 中 | 中 | 定期沟通+反馈机制 |

### Step 7: 文档组装

**文档结构**：

```
# {产品名}利益相关者战略文档

## 1. 背景与现状
### 1.1 战略背景
### 1.2 利益相关者全景图
### 1.3 关键利益相关者

## 2. 机会与挑战
### 2.1 战略助力识别
### 2.2 潜在阻碍分析
### 2.3 利益冲突地图

## 3. 策略选择
### 3.1 重点管理策略
### 3.2 保持满意策略
### 3.3 保持告知策略
### 3.4 最小关注策略

## 4. 成功标准
### 4.1 关键指标
### 4.2 衡量方式
### 4.3 评估周期

## 5. 风险与预案
### 5.1 风险矩阵
### 5.2 缓解措施
### 5.3 应急预案

## 6. 资源与行动
### 6.1 资源需求
### 6.2 行动计划
### 6.3 时间线

## 附录
- 利益相关者详细档案
- 沟通记录模板
- 数据来源
```

## 输出

**存储路径**：`output/pm-strategy/stakeholder-strategy-doc/`

**输出文件**：

| 文件 | 格式 | 说明 |
|------|------|------|
| stakeholder-strategy-doc.md | Markdown | 完整利益相关者战略文档 |
| stakeholder-strategy-doc.json | JSON | 结构化数据 |

### 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| doc_metadata.product_name | string | 是 | 产品名称 |
| doc_metadata.generated_at | string | 是 | 生成时间戳 |
| doc_metadata.data_sources | array | 是 | 数据来源列表 |
| doc_metadata.quality_score | number | 是 | 文档质量评分0-100 |
| background.strategic_context | string | 是 | 战略背景 |
| background.stakeholder_overview | array | 是 | 利益相关者全景 |
| background.key_stakeholders | array | 是 | 关键利益相关者 |
| opportunities_and_challenges.opportunities | array | 是 | 机会列表 |
| opportunities_and_challenges.challenges | array | 是 | 挑战列表 |
| strategies | array | 是 | 策略列表，每项含stakeholder/current_attitude/target_attitude/strategy/key_actions |
| success_criteria | array | 是 | 成功标准列表 |
| risks_and_contingencies | array | 是 | 风险与预案列表 |
| resources_and_actions | object | 是 | 资源与行动计划 |

```json
{
  "doc_metadata": {
    "product_name": "产品名",
    "generated_at": "时间戳",
    "data_sources": [],
    "quality_score": 75
  },
  "background": {
    "strategic_context": "",
    "stakeholder_overview": [],
    "key_stakeholders": []
  },
  "opportunities_and_challenges": {
    "opportunities": [],
    "challenges": []
  },
  "strategies": [
    {
      "stakeholder": "产品VP",
      "current_attitude": "supportive",
      "target_attitude": "strongly_supportive",
      "strategy": "深度参与",
      "key_actions": ["周度战略对齐会", "关键决策预沟通"]
    }
  ],
  "success_criteria": [
    {
      "metric": "关键决策者支持率",
      "current": "60%",
      "target": "90%",
      "measurement": "决策通过率"
    }
  ],
  "risks_and_contingencies": [
    {
      "risk": "关键决策者变更",
      "probability": "medium",
      "impact": "high",
      "contingency": "建立多决策者关系"
    }
  ],
  "resources_and_actions": {
    "resource_needs": [],
    "action_plan": [],
    "timeline": ""
  }
}
```

## 决策规则

| 条件 | 决策 |
|------|------|
| 文档质量评分≥60 | 通过，可输出 |
| 文档质量评分<60 | 自动修改后重新评分 |
| 修改后仍<60 | 升级人类审核 |
| 涉及≥3个部门资源 | 强制人类审批 |
| 关键利益相关者未覆盖 | 退回补充 |

## 质量检查

- [ ] 6个章节完整
- [ ] 每个章节有数据来源标注
- [ ] 利益相关者覆盖完整
- [ ] 策略具体可执行
- [ ] 成功标准可衡量
- [ ] 风险有预案
- [ ] 文档质量评分≥60

---

## 降级策略

当上游文件不存在时，本Skill仍可独立执行：

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| stakeholder-map.json | 用户提供利益相关者信息 → 生成战略文档 | 缺乏结构化利益相关者地图，四象限分类可能不完整 |
| business-strategy-report.json | 用户提供战略要点 → 生成战略文档 | 缺乏结构化战略数据，策略与战略对齐度可能不足 |
| stakeholder-map.json + business-strategy-report.json | 用户提供利益相关者和战略要点 → 生成战略文档 | 整体置信度降低，文档缺乏数据锚定 |
| 所有上游文件均缺失 | 提示用户先执行前序阶段，或基于用户提供的利益相关者和战略信息生成文档 | 整体置信度显著降低，文档仅为用户提供信息的重组 |
| stakeholder-brief.json | 若战略简报缺失，不影响核心文档生成 | 简报内容需从战略报告中重新提取 |

---

## 上游变更响应

### 上游变更影响表

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| stakeholder-map利益相关者变更 | 背景与现状、策略选择 | 重新执行Step 2-4，更新利益相关者分析和策略 |
| business-strategy-report战略调整 | 背景与现状、机会与挑战 | 重新执行Step 2-3，更新战略背景和机会挑战分析 |
| stakeholder-brief简报内容变更 | 策略选择中的沟通内容 | 更新策略中的关键行动 |

### 下游通知机制表

| 变更类型 | 影响范围 | 通知方式 |
|----------|----------|----------|
| 策略调整 | stakeholder-brief | 输出文件版本号+变更摘要 |
| 风险预案更新 | stakeholder-brief | 输出文件版本号+变更摘要 |
| 文档质量评分变更 | 无下游 | 无需通知 |
