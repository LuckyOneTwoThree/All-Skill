---
name: positioning-strategy
description: 产品定位策略制定，整合定位陈述、价值曲线、差异化评估和排除策略。关键词：产品定位、定位策略、差异化、价值曲线、定位陈述。
metadata:
  module: "产品商业与战略"
  sub-module: "产品定位与差异化"
  type: "pipeline"
  version: "3.0"
  domain_tags: ["通用"]
  trigger_examples:
    - "帮我确定产品定位"
    - "写一个定位陈述"
    - "分析一下差异化优势"
    - "我们和竞品差在哪"
    - "我们的差异化能持续吗"
    - "哪些用户不是我们的目标"
  interaction_mode: "ai_suggest_human_approve"
---

# 产品定位策略制定

## 核心原则

1. **公式化生成**——使用[目标用户]+[产品名]+[核心价值]+[差异化点]定位公式
2. **3-5候选比较**——生成3-5个差异化定位陈述，差异化来源/用户粒度/竞品参照各不同
3. **五项质量门**——specific/differentiated/exclusive/verifiable/concise五项检查全通过才可输出
4. **不通过重试**——质量检查不通过自动重试最多3次，仍不通过升级人类
5. **竞争要素用户驱动**——竞争要素从用户研究中提取，非AI主观设定
6. **蓝海四动作框架**——Eliminate/Reduce/Raise/Create四动作必须全部识别
7. **差异化强度量化**——通过面积法计算差异化强度0-1评分，<0.5触发警告
8. **多方评分对比**——我方与每个主要竞品在同一要素上评分对比，差异可视化
9. **五维度全覆盖**——功能/体验/场景/商业/生态5个维度缺一不可
10. **追赶难度量化**——评分标准锚定竞品追赶时间（3月/6月/12月+），拒绝模糊判断
11. **加权综合评分**——各维度加权计算综合差异化强度，权重可调但必须显式
12. **最可持续推荐**——不仅评估当前差异，更要推荐最可持续的差异化来源
13. **排他是战略选择**——排他不是能力不足而是聚焦，每条排他必须有战略理由
14. **重叠度硬检查**——排他用户与核心用户重叠≥30%时拒绝排他建议
15. **市场缩减预警**——排他后潜在市场缩减≥50%时强制人类审批
16. **替代方案必提供**——为排除的用户群体提供替代建议，不可只排除不指引

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 价值主张匹配结果 | JSON | 是 | output/pm-strategy/business-value-fit/evaluation_report.json | 价值主张匹配度评分 |
| 竞品分析数据 | JSON | 是 | output/pm-discovery/market-competitor-analysis/competitor-analysis.json | 竞品定位、差异化要素 |
| 用户洞察 | JSON | 是 | user-research-user-modeling | 用户画像、核心需求 |
| 价值主张 | JSON | ○ | output/pm-strategy/business-model-canvas/bmc.json | 价值主张、Pain Relievers、Gain Creators |
| 自身能力评估 | JSON | ○ | 用户提供 | 技术壁垒、资源优势 |

## 执行步骤

### Step 1: 定位陈述

#### 定位要素提取
从输入数据中提取定位要素：

1. **目标用户**：从用户画像中提取核心用户群体
2. **核心价值**：从价值主张匹配中提取高匹配度价值
3. **差异化点**：从竞品分析中提取差异化要素
4. **品类定义**：定义产品所属品类

#### 定位陈述生成
使用定位公式生成3-5个定位陈述：

**定位公式**：
```
对于 [目标用户]，[产品名] 是一个 [品类定义]，
它 [核心价值]，不同于 [竞品参照]，[差异化点]
```

**生成策略**：
1. **差异化来源变化**：功能差异/体验差异/场景差异
2. **用户粒度变化**：宽泛用户群/精准用户群
3. **竞品参照变化**：直接竞品/间接竞品/传统方案

#### 质量门检查
对每个定位陈述进行5项质量检查：

| 检查项 | 标准 | 通过条件 |
|--------|------|----------|
| Specific (具体性) | 目标用户和价值明确 | 用户群体可识别，价值可感知 |
| Differentiated (差异化) | 与竞品有明确差异 | 差异点可验证 |
| Exclusive (排他性) | 不是所有竞品都能说 | 至少1个竞品无法声称 |
| Verifiable (可验证) | 可以被事实验证 | 有可量化的支撑证据 |
| Concise (简洁性) | 一句话说清 | ≤30字核心表述 |

#### 推荐与排序
基于质量门检查结果，推荐和排序定位陈述：
- 全部通过的排在前面
- 部分通过的标注改进建议
- 未通过的标注淘汰原因

### Step 2: 价值曲线分析

#### 竞争要素提取
从用户研究数据中提取5-8个竞争要素：

**提取逻辑**：
1. 从用户关注要素中提取高频关键词
2. 从价值主张中提取核心价值维度
3. 从竞品分析中提取竞品竞争维度
4. 合并和去重，形成5-8个竞争要素

**要素命名规范**：
- 使用用户语言（非技术术语）
- 每个要素可独立评分
- 要素之间不重叠

#### 竞品评分
对每个竞品在竞争要素上进行1-5分评分：

**评分标准**：
```
5分：行业领先，显著优于竞品
4分：优秀，优于多数竞品
3分：行业平均水平
2分：低于行业平均
1分：明显不足
```

**评分依据**：
- 功能完整性
- 用户评价
- 定价竞争力
- 市场份额

#### 我方评分
对我方产品在竞争要素上进行1-5分评分：

**评分原则**：
- 基于现有能力客观评分
- 不夸大、不低估
- 标注评分依据

#### 蓝海四动作识别
基于价值曲线分析，识别蓝海策略的4个动作：

**Eliminate（消除）**：哪些竞争要素可以完全消除？
- 评分≤2的要素
- 用户不关注的要素
- 成本高但价值低的要素

**Reduce（减少）**：哪些竞争要素可以降低标准？
- 评分3-4但非核心的要素
- 过度投资的要素
- 用户关注度中等的要素

**Raise（提升）**：哪些竞争要素需要提升？
- 核心差异化要素
- 用户高度关注但评分偏低的要素
- 竞品普遍薄弱的要素

**Create（创造）**：哪些新的竞争要素可以创造？
- 用户未被满足的需求
- 竞品尚未提供的价值
- 创新性功能或体验

#### 差异化强度计算
通过面积法计算差异化强度：

```
差异化强度 = 我方曲线与竞品平均曲线的面积差 / 最大可能面积差
```

- 强度 ≥ 0.7：强差异化
- 强度 0.5-0.7：中等差异化
- 强度 < 0.5：弱差异化（触发警告）

### Step 3: 差异化评估

#### 功能差异评估
评估产品功能的差异化程度：

| 评分 | 含义 | 说明 |
|------|------|------|
| 5分 | 难以复制 | 竞品需要12个月以上追赶 |
| 3分 | 中等难度 | 竞品需要3-6个月追赶 |
| 1分 | 容易复制 | 竞品可在3个月内复制 |

评估维度：
- 核心功能独特性
- 技术复杂度
- 数据积累优势

#### 体验差异评估
评估用户体验层面的差异化：

| 评分 | 含义 | 说明 |
|------|------|------|
| 5分 | 难以追赶 | 用户习惯已形成，转换成本高 |
| 3分 | 中等难度 | 需要持续投入才能保持 |
| 1分 | 容易追赶 | 体验要素可快速复制 |

评估维度：
- 用户习惯培养程度
- 界面/交互独特性
- 使用流程效率

#### 场景差异评估
评估垂直场景深耕程度：

| 评分 | 含义 | 说明 |
|------|------|------|
| 5分 | 深度场景 | 深度理解行业Know-How |
| 3分 | 中度场景 | 覆盖主流场景 |
| 1分 | 浅度场景 | 仅有通用功能 |

评估维度：
- 场景覆盖深度
- 行业专业知识
- 场景解决方案完整性

#### 商业差异评估
评估商业模式独特性：

| 评分 | 含义 | 说明 |
|------|------|------|
| 5分 | 独特模式 | 商业模式难以复制 |
| 3分 | 可复制模式 | 模式可学习但有壁垒 |
| 1分 | 同质模式 | 与行业普遍模式相同 |

评估维度：
- 收入结构独特性
- 成本结构优势
- 商业模式护城河

#### 生态差异评估
评估生态系统的差异化强度：

| 评分 | 含义 | 说明 |
|------|------|------|
| 5分 | 强生态 | 多方参与，网络效应强 |
| 3分 | 中生态 | 有一定合作伙伴 |
| 1分 | 弱生态 | 单一产品 |

评估维度：
- 合作伙伴数量
- 网络效应强度
- 生态锁定能力

#### 综合差异化强度计算
加权计算综合差异化强度：
```
综合差异化强度 = (功能差异×0.25 + 体验差异×0.20 + 场景差异×0.25 + 商业差异×0.15 + 生态差异×0.15) / 5
```

#### 最可持续差异化来源推荐
基于5个维度评分，推荐最可持续的差异化来源：
1. 识别评分最高的维度
2. 分析可持续性理由
3. 给出具体行动建议

### Step 4: 排除策略

#### AI分析 - 竞品覆盖扫描
AI扫描竞品分析数据，识别：
- 各竞品主要覆盖的用户群体
- 竞品覆盖薄弱/放弃的用户群体
- 潜在的差异化机会点

#### AI建议 - 排他候选生成
基于定位陈述，AI生成3-5个排他候选：

**排他维度建议**：
1. **用户特征维度**：按人口属性排除
2. **使用场景维度**：按使用场景排除
3. **需求强度维度**：按需求深度排除
4. **付费能力维度**：按支付意愿排除

#### 人类决策 - 最终排他陈述
产品负责人基于AI分析建议，决定：

**必须明确回答**：
1. 我们明确不为哪些用户群体服务？
2. 为什么不服务这些用户？（战略原因）
3. 服务这些用户会有什么负面影响？

**决策原则**：
- 排他是为了聚焦，不是简单的放弃
- 每一条排他都应有明确的战略理由
- 排他决策需要与长期产品愿景一致

## 输出

**存储路径**：`output/pm-strategy/positioning-strategy/`

**输出文件**：

| 文件 | 格式 | 说明 |
|------|------|------|
| positioning-strategy.json | JSON | 结构化数据（包含statement + value_curve + differentiation + exclusion） |
| positioning-strategy.md | Markdown | 完整定位策略报告 |

**positioning-strategy.json 输出Schema**：

```json
{
  "type": "object",
  "required": ["positioning_statements", "value_curve", "differentiation_scores", "exclusion"],
  "properties": {
    "positioning_statements": {"type": "array", "description": "3-5个定位陈述候选"},
    "recommended_index": {"type": "number", "description": "推荐索引"},
    "value_curve": {"type": "object", "description": "价值曲线数据，含竞争要素评分和蓝海动作"},
    "differentiation_scores": {"type": "object", "description": "五维度差异化评分"},
    "overall_differentiation_strength": {"type": "number", "description": "综合差异化强度0-1"},
    "recommended_differentiation_source": {"type": "object", "description": "推荐最可持续差异化来源"},
    "exclusion": {"type": "object", "description": "排他决策数据"}
  }
}
```

### 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| positioning_statements | array | 是 | 3-5个定位陈述候选 |
| positioning_statements[].statement | string | 是 | 定位陈述全文 |
| positioning_statements[].target_user | string | 是 | 目标用户 |
| positioning_statements[].category | string | 是 | 品类定义 |
| positioning_statements[].core_value | string | 是 | 核心价值 |
| positioning_statements[].differentiation | string | 是 | 差异化点 |
| positioning_statements[].competitor_reference | string | 是 | 竞品参照 |
| positioning_statements[].quality_check.specific | boolean | 是 | 具体性检查 |
| positioning_statements[].quality_check.differentiated | boolean | 是 | 差异化检查 |
| positioning_statements[].quality_check.exclusive | boolean | 是 | 排他性检查 |
| positioning_statements[].quality_check.verifiable | boolean | 是 | 可验证性检查 |
| positioning_statements[].quality_check.concise | boolean | 是 | 简洁性检查 |
| positioning_statements[].quality_check.all_passed | boolean | 是 | 全部通过标记 |
| positioning_statements[].rank | number | 是 | 推荐排序 |
| recommended_index | number | 是 | 推荐索引 |
| value_curve.competitive_factors | array | 是 | 5-8个竞争要素 |
| value_curve.competitive_factors[].factor | string | 是 | 要素名称 |
| value_curve.competitive_factors[].our_score | number | 是 | 我方评分1-5 |
| value_curve.competitive_factors[].competitor_scores | object | 是 | 各竞品评分 |
| value_curve.blue_ocean_actions.eliminate | array | 是 | 消除动作列表 |
| value_curve.blue_ocean_actions.reduce | array | 是 | 减少动作列表 |
| value_curve.blue_ocean_actions.raise | array | 是 | 提升动作列表 |
| value_curve.blue_ocean_actions.create | array | 是 | 创造动作列表 |
| value_curve.differentiation_strength | number | 是 | 差异化强度0-1 |
| value_curve.differentiation_warning | boolean | 是 | 差异化强度<0.5时为true |
| differentiation_scores.feature | object | 是 | 功能差异评分，含score/description/sustainability |
| differentiation_scores.experience | object | 是 | 体验差异评分 |
| differentiation_scores.scenario | object | 是 | 场景差异评分 |
| differentiation_scores.business | object | 是 | 商业差异评分 |
| differentiation_scores.ecosystem | object | 是 | 生态差异评分 |
| overall_differentiation_strength | number | 是 | 综合差异化强度0-1 |
| recommended_differentiation_source.dimension | string | 是 | 推荐维度 |
| recommended_differentiation_source.reason | string | 是 | 推荐理由 |
| recommended_differentiation_source.action | string | 是 | 行动建议 |
| exclusion.exclusion_statement | string | 是 | 排他陈述 |
| exclusion.rationale | array | 是 | 排他理由列表 |
| exclusion.rationale[].excluded_audience | string | 是 | 被排除用户群体 |
| exclusion.rationale[].reason | string | 是 | 战略理由 |
| exclusion.rationale[].alternative | string | 是 | 替代建议 |
| exclusion.implications.revenue_impact | string | 是 | 营收影响 |
| exclusion.implications.resource_optimization | string | 是 | 资源优化说明 |
| exclusion.implications.brand_positioning | string | 是 | 品牌定位影响 |
| exclusion.implications.risks | array | 是 | 潜在风险列表 |
| exclusion.human_decision.decided_by | string | 是 | 决策人 |
| exclusion.human_decision.decided_at | string | 是 | 决策时间 |

## 决策规则

| 条件 | 决策 |
|------|------|
| 质量门5项全通过 | 定位陈述可输出 |
| 质量门不通过 | 自动重试最多3次，仍不通过升级人类 |
| 差异化强度<0.5 | 触发警告，建议调整策略 |
| 蓝海动作 | 需人类审批确认 |
| 竞争要素 | 需人类校准 |
| 各维度评分 | 需人类校准主观维度 |
| 综合推荐 | 需人类最终判断确认 |
| 争议点 | 升级人类决策 |
| 排他用户群体与核心用户重叠度≥30% | 拒绝排他建议，标记"排他范围与核心用户冲突" |
| 排他用户群体与核心用户重叠度<30% | 生成排他建议，标记为"AI建议，需人类审批" |
| 排他后潜在市场缩减≥50% | 标记高风险，强制人类审批 |
| 排他后潜在市场缩减<50% | 正常流程，人类审批确认 |
| 竞品已覆盖该排他用户群体 | 标记"竞品已覆盖，排他需差异化理由" |
| 排他理由缺乏数据支撑（0个数据点） | 退回补充数据，不可提交审批 |
| 排他理由有≥2个数据支撑 | 可提交人类审批 |
| 争议决策（2个以上Stakeholder反对） | 升级为多方评审 |

## 质量检查

- [ ] 3-5个定位陈述已生成
- [ ] 每个陈述使用定位公式
- [ ] 5项质量检查已完成
- [ ] 推荐排序合理
- [ ] 差异化来源多样化
- [ ] 5-8个竞争要素已提取
- [ ] 我方和竞品评分已完成
- [ ] 蓝海四动作已识别
- [ ] 差异化强度已计算
- [ ] 评分依据已标注
- [ ] 5个维度都已评估，无遗漏
- [ ] 评分有数据支撑，避免主观偏见
- [ ] 推荐理由与评分逻辑一致
- [ ] 行动建议可转化为产品策略
- [ ] 排他决策与产品愿景一致
- [ ] 有清晰的排除理由
- [ ] 排他陈述可向团队清晰传达
- [ ] 为排除的用户提供替代建议

---

## 降级策略

当上游文件不存在时，本Skill仍可独立执行：

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| evaluation_report.json（价值主张匹配） | 用户提供产品价值描述 → 生成定位陈述 | 缺乏价值匹配数据，核心价值可能不够精准 |
| competitor-analysis.json（竞品分析） | 用户提供产品价值描述 → 生成定位陈述 | 缺乏竞品数据，差异化点和竞品参照缺乏依据 |
| evaluation_report.json + competitor-analysis.json | 用户提供产品价值描述 → 生成定位陈述 | 整体置信度降低，定位陈述缺乏数据锚定 |
| 所有上游文件均缺失 | 提示用户先执行前序阶段，或基于用户提供的产品价值描述生成定位陈述 | 整体置信度显著降低，定位陈述仅为假设推断 |
| 用户洞察数据 | 若用户洞察数据缺失，提示用户提供或跳过该输入相关步骤 | 目标用户定义可能不够精准 |
| bmc.json | 用户提供竞品信息 → 绘制价值曲线 | 缺乏BMC数据，我方评分缺乏价值主张锚定 |
| 自身能力评估（用户提供） | 若用户未提供自身能力评估，提示用户提供或跳过该输入相关步骤 | 功能和场景差异评估缺乏内部数据支撑 |

## 数据获取说明

本Skill需要价值主张匹配和竞品分析数据，请通过以下方式之一提供：
  1. 直接描述产品价值、目标用户和竞品差异
  2. 上传evaluation_report.json / competitor-analysis.json文件
  3. 提供数据文件路径
- AI不负责外部数据采集，仅负责分析

## 上游变更响应

### 上游变更影响表

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| evaluation_report价值主张匹配变更 | 核心价值提取 | 重新执行Step 1，更新定位陈述 |
| competitor-analysis竞品分析更新 | 差异化点和竞品参照 | 重新执行Step 1-2，更新差异化要素 |
| persona用户画像更新 | 目标用户定义 | 重新执行Step 1，更新目标用户 |
| competitor-analysis竞品数据更新 | 竞品评分和蓝海动作 | 重新执行Step 2，更新竞品评分 |
| persona/voice-analysis用户洞察更新 | 竞争要素提取 | 重新执行Step 2，更新竞争要素 |
| bmc.json价值主张变更 | 我方评分和蓝海动作 | 重新执行Step 2，更新我方评分 |

### 下游通知机制表

| 变更类型 | 影响范围 | 通知方式 |
|----------|----------|----------|
| 定位陈述变更 | business-strategy-report、planning-roadmap | 输出文件版本号+变更摘要 |
| 差异化评分变更 | business-strategy-report | 输出文件版本号+变更摘要 |
| 排他决策变更 | business-strategy-report、business-pricing | 输出文件版本号+变更摘要 |
| 市场缩减评估变更 | business-pricing | 输出文件版本号+变更摘要 |

## 变更记录

- v3.0: 合并positioning-statement、positioning-value-curve、positioning-differentiation、positioning-exclusion为产品定位策略制定Skill，整合定位陈述、价值曲线分析、差异化评估和排除策略为四步Pipeline
