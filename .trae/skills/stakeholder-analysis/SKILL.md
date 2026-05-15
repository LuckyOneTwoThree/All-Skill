---
name: stakeholder-analysis
description: 利益相关者分析，整合利益相关者地图、沟通策略和战略简报。关键词：利益相关者、Stakeholder、利益相关者地图、沟通策略。
metadata:
  module: "产品商业与战略"
  sub-module: "利益相关者管理"
  type: "pipeline"
  version: "3.0"
  domain_tags: ["通用"]
  trigger_examples:
    - "帮我梳理一下利益相关方"
    - "谁会影响这个项目"
    - "帮我制定利益相关者管理策略"
    - "怎么和各方沟通"
    - "帮我写一份给老板的战略简报"
    - "一页纸汇报战略"
  interaction_mode: "ai_suggest_human_approve"
---

# 利益相关者分析

## 核心原则

1. **四类全覆盖**——产品决策者/资源控制者/受影响方/外部相关方四类缺一不可
2. **双维度量化**——影响力和关注度1-5分评估，四象限分类有据可依
3. **关键决策者不遗漏**——关键决策者未在地图中则阻塞后续流程
4. **沟通策略具体化**——每个Stakeholder的沟通策略必须包含关切点和建议话题
5. **六章节闭环**——背景→机会→选择→成功→风险→资源形成完整逻辑闭环
6. **数据源标注**——每个章节标注数据来源，不可无据推演
7. **质量评分门控**——文档质量<60分自动修改，修改后仍不达标则人类审核
8. **跨部门强制审批**——涉及≥3个部门资源时强制人类审批
9. **一页纸原则**——决策层没有时间看长文，核心论点必须一页纸说清
10. **受众适配**——高管侧重战略ROI、团队侧重执行协作、外部侧重价值信任
11. **关键信息不遗漏**——战略目标/核心风险/行动项缺一不可，缺一则退回
12. **敏感数据脱敏**——外部简报自动脱敏，行动项>3个时建议聚焦

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 商业模式画布 | JSON | 是 | output/pm-strategy/business-model-canvas/bmc.json | 关键伙伴、客户关系 |
| 产品/业务信息 | string | 是 | 用户提供 | 产品名称、组织架构、业务模式 |
| 商业战略报告 | JSON | ○ | output/pm-strategy/business-strategy-report/business-strategy-report.json | 战略方向、OKR、路线图 |
| 受众类型 | string | 是 | 用户提供 | executive/team/external |

## 执行步骤

### Step 1: 利益相关者地图

#### 利益相关者识别

从4个维度识别利益相关者：

**1. 产品决策者**
- 产品负责人
- 业务负责人
- 技术负责人
- 高管层

**2. 资源控制者**
- 预算审批人
- 人力资源
- 技术资源
- 数据资源

**3. 受影响方**
- 内部团队
- 现有用户
- 合作伙伴
- 运营团队

**4. 外部相关方**
- 监管机构
- 行业协会
- 媒体
- 投资人

#### 影响力-关注度评估

对每个利益相关者进行双维度评估：

**影响力评分 (1-5)**：
```
5分：有最终决策权
4分：有重大影响权
3分：有中等影响
2分：有较小影响
1分：几乎无影响
```

**关注度评分 (1-5)**：
```
5分：极度关注，主动参与
4分：高度关注，定期跟进
3分：中等关注，偶尔过问
2分：低度关注，被动了解
1分：几乎不关注
```

#### 四象限分类

基于影响力-关注度矩阵进行分类：

```
          │ 高关注度        │ 低关注度
──────────┼─────────────────┼──────────────
高影响力  │ 重点管理        │ 保持满意
          │ (Key Player)    │ (Keep Satisfied)
──────────┼─────────────────┼──────────────
低影响力  │ 保持告知        │ 最小关注
          │ (Keep Informed) │ (Minimal Effort)
```

#### 沟通策略制定

为每个利益相关者制定沟通策略：

| 要素 | 内容 |
|------|------|
| 沟通频率 | 日常/周度/月度/按需 |
| 沟通方式 | 会议/邮件/简报/一对一 |
| 关切点 | 该Stakeholder最关心什么 |
| 建议话题 | 沟通时应该讨论什么 |
| 风险 | 不沟通可能导致的后果 |

### Step 2: 沟通策略

#### 文档结构规划

确定文档的6个核心章节：

1. **背景与现状**：为什么需要利益相关者管理
2. **机会与挑战**：利益相关者带来的机会和挑战
3. **策略选择**：针对不同利益相关者的策略
4. **成功标准**：如何衡量策略成功
5. **风险与预案**：利益相关者管理中的风险
6. **资源与行动**：需要的资源和行动计划

#### 背景与现状

整合利益相关者地图和战略报告：

**内容要点**：
- 产品战略背景
- 利益相关者全景图
- 关键利益相关者识别
- 当前关系状态

#### 机会与挑战

分析利益相关者带来的机会和挑战：

**机会分析**：
- 哪些利益相关者可以成为战略助力
- 如何利用影响力高的支持者
- 合作机会识别

**挑战分析**：
- 哪些利益相关者可能成为阻碍
- 利益冲突识别
- 潜在风险点

#### 策略选择

为每个关键利益相关者制定策略：

| 利益相关者 | 当前态度 | 目标态度 | 策略 | 关键行动 |
|-----------|---------|---------|------|---------|
| 产品VP | 支持 | 强力支持 | 深度参与 | 周度战略对齐会 |
| 技术总监 | 中立 | 支持 | 利益绑定 | 技术方案联合评审 |
| 财务总监 | 观望 | 支持 | 数据说服 | ROI专项汇报 |

#### 成功标准

定义策略成功的衡量标准：

| 指标 | 当前值 | 目标值 | 衡量方式 |
|------|--------|--------|---------|
| 关键决策者支持率 | 60% | 90% | 决策通过率 |
| 资源获取效率 | 中 | 高 | 资源申请周期 |
| 利益相关者满意度 | 3.5 | 4.5 | 季度调研 |

#### 风险与预案

识别利益相关者管理中的风险：

| 风险 | 概率 | 影响 | 预案 |
|------|------|------|------|
| 关键决策者变更 | 中 | 高 | 建立多决策者关系 |
| 利益冲突升级 | 低 | 高 | 提前识别+调解机制 |
| 沟通不畅 | 中 | 中 | 定期沟通+反馈机制 |

#### 文档组装

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

### Step 3: 战略简报

#### 受众分析

根据受众类型确定简报策略：

| 受众 | 关注点 | 深度 | 表达方式 |
|------|--------|------|----------|
| 高管(executive) | 战略ROI、风险、决策 | 高层概览 | 数据驱动、结论先行 |
| 团队(team) | 目标、协作、执行 | 中等细节 | 清晰行动项、时间线 |
| 外部(external) | 价值、信任、合作 | 精选信息 | 价值导向、脱敏处理 |

#### 核心信息提取

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

#### 简报生成

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

#### 脱敏处理

对外部简报进行脱敏：
- 移除内部OKR数据
- 移除具体财务数字
- 移除竞品对比细节
- 保留价值主张和合作方向

## 输出

**存储路径**：`output/pm-strategy/stakeholder-analysis/`

**输出文件**：

| 文件 | 格式 | 说明 |
|------|------|------|
| stakeholder-analysis.json | JSON | 结构化数据（包含map + strategy + brief） |
| stakeholder-analysis.md | Markdown | 完整利益相关者分析报告 |

**stakeholder-analysis.json 输出Schema**：

```json
{
  "type": "object",
  "required": ["stakeholder_map", "strategy_doc", "brief"],
  "properties": {
    "stakeholder_map": {"type": "object", "description": "利益相关者地图，含四象限分类和沟通策略"},
    "strategy_doc": {"type": "object", "description": "利益相关者战略文档，含六章节闭环"},
    "brief": {"type": "object", "description": "战略简报，含受众适配内容"}
  }
}
```

### 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| stakeholder_map.stakeholders | array | 是 | 利益相关者列表 |
| stakeholder_map.stakeholders[].name | string | 是 | 姓名/角色 |
| stakeholder_map.stakeholders[].category | string | 是 | decision_maker/resource_controller/affected/external |
| stakeholder_map.stakeholders[].influence | number | 是 | 影响力1-5 |
| stakeholder_map.stakeholders[].interest | number | 是 | 关注度1-5 |
| stakeholder_map.stakeholders[].quadrant | string | 是 | key_player/keep_satisfied/keep_informed/minimal_effort |
| stakeholder_map.stakeholders[].communication_strategy | object | 是 | 沟通策略 |
| stakeholder_map.stakeholders[].communication_strategy.frequency | string | 是 | 沟通频率 |
| stakeholder_map.stakeholders[].communication_strategy.method | string | 是 | 沟通方式 |
| stakeholder_map.stakeholders[].communication_strategy.concerns | array | 是 | 关切点列表 |
| stakeholder_map.stakeholders[].communication_strategy.suggested_topics | array | 是 | 建议话题列表 |
| stakeholder_map.stakeholders[].communication_strategy.risk | string | 是 | 不沟通的风险 |
| stakeholder_map.quadrant_summary | object | 是 | 四象限汇总 |
| stakeholder_map.key_decision_makers_identified | boolean | 是 | 关键决策者是否已识别 |
| strategy_doc.doc_metadata.product_name | string | 是 | 产品名称 |
| strategy_doc.doc_metadata.generated_at | string | 是 | 生成时间戳 |
| strategy_doc.doc_metadata.data_sources | array | 是 | 数据来源列表 |
| strategy_doc.doc_metadata.quality_score | number | 是 | 文档质量评分0-100 |
| strategy_doc.background.strategic_context | string | 是 | 战略背景 |
| strategy_doc.background.stakeholder_overview | array | 是 | 利益相关者全景 |
| strategy_doc.background.key_stakeholders | array | 是 | 关键利益相关者 |
| strategy_doc.opportunities_and_challenges.opportunities | array | 是 | 机会列表 |
| strategy_doc.opportunities_and_challenges.challenges | array | 是 | 挑战列表 |
| strategy_doc.strategies | array | 是 | 策略列表，每项含stakeholder/current_attitude/target_attitude/strategy/key_actions |
| strategy_doc.success_criteria | array | 是 | 成功标准列表 |
| strategy_doc.risks_and_contingencies | array | 是 | 风险与预案列表 |
| strategy_doc.resources_and_actions | object | 是 | 资源与行动计划 |
| brief.brief_metadata.audience_type | string | 是 | executive/team/external |
| brief.brief_metadata.generated_at | string | 是 | 生成时间戳 |
| brief.brief_content.strategic_goals | array | 是 | 1-3个战略目标 |
| brief.brief_content.key_risks | array | 是 | Top3风险 |
| brief.brief_content.action_items | array | 是 | 3-5个行动项 |
| brief.brief_content.decision_requests | array | ○ | 决策请求（高管简报必填） |
| brief.brief_content.milestones | array | ○ | 里程碑（团队简报必填） |
| brief.brief_content.value_propositions | array | ○ | 价值主张（外部简报必填） |
| brief.brief_content.desensitized | boolean | 是 | 是否已脱敏（外部简报必须为true） |

## 决策规则

| 条件 | 决策 |
|------|------|
| 关键决策者检查 | 至少1个决策者已识别 |
| 评分校准 | 影响力评分需人类校准 |
| 沟通策略 | 需人类审批确认 |
| 文档质量评分≥60 | 通过，可输出 |
| 文档质量评分<60 | 自动修改后重新评分 |
| 修改后仍<60 | 升级人类审核 |
| 涉及≥3个部门资源 | 强制人类审批 |
| 关键利益相关者未覆盖 | 退回补充 |
| 战略目标缺失 | 退回补充，不可生成简报 |
| 核心风险缺失 | 退回补充，不可生成简报 |
| 行动项缺失 | 退回补充，不可生成简报 |
| 行动项>3个 | 标注"建议聚焦Top3" |
| 外部简报含敏感数据 | 自动脱敏处理 |

## 质量检查

- [ ] 4类利益相关者都已识别
- [ ] 每个利益相关者有双维度评分
- [ ] 四象限分类已完成
- [ ] 沟通策略具体可执行
- [ ] 关键决策者已识别
- [ ] 6个章节完整
- [ ] 每个章节有数据来源标注
- [ ] 利益相关者覆盖完整
- [ ] 策略具体可执行
- [ ] 成功标准可衡量
- [ ] 风险有预案
- [ ] 文档质量评分≥60
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
| bmc.json | 用户提供组织架构和业务信息 → 识别利益相关者 | 缺乏BMC数据，关键伙伴和客户关系可能遗漏 |
| 产品/业务信息（用户提供） | 若用户未提供产品/业务信息，提示用户提供或跳过该输入相关步骤 | 利益相关者识别缺乏业务上下文 |
| bmc.json + 产品/业务信息 | 用户提供组织架构和业务信息 → 识别利益相关者 | 整体置信度降低，利益相关者列表可能不完整 |
| 所有上游文件均缺失 | 提示用户先执行前序阶段，或基于用户提供的组织架构信息识别利益相关者 | 整体置信度显著降低，地图仅为通用参考 |
| business-strategy-report.json | 用户提供战略要点 → 生成战略文档和简报 | 缺乏结构化战略数据，策略与战略对齐度可能不足 |
| stakeholder-analysis.json（brief部分） | 若战略简报缺失，不影响核心文档生成 | 简报内容需从战略报告中重新提取 |

## 数据获取说明

本Skill需要商业模式画布和产品/业务信息，请通过以下方式之一提供：
  1. 直接提供组织架构、产品名称和业务模式
  2. 上传bmc.json文件
  3. 提供数据文件路径
- AI不负责外部数据采集，仅负责分析

## 上游变更响应

### 上游变更影响表

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| bmc.json关键伙伴变更 | 外部相关方识别 | 重新执行Step 1，更新外部相关方 |
| bmc.json客户关系变更 | 受影响方识别 | 重新执行Step 1，更新受影响方 |
| 组织架构变更 | 决策者和资源控制者 | 重新执行Step 1，更新决策者和资源控制者 |
| business-strategy-report战略调整 | 背景与现状、机会与挑战 | 重新执行Step 2，更新战略背景和机会挑战分析 |

### 下游通知机制表

| 变更类型 | 影响范围 | 通知方式 |
|----------|----------|----------|
| 利益相关者列表变更 | business-strategy-report | 输出文件版本号+变更摘要 |
| 策略调整 | business-strategy-report | 输出文件版本号+变更摘要 |
| 风险预案更新 | business-strategy-report | 输出文件版本号+变更摘要 |
| 简报内容变更 | 无特定下游 | 输出文件版本号+变更摘要 |

## 变更记录

- v3.0: 合并stakeholder-map、stakeholder-strategy-doc、stakeholder-brief为利益相关者分析Skill，整合利益相关者地图、沟通策略和战略简报为三步Pipeline
