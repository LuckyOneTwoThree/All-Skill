---
name: positioning-statement
description: 当需要定义产品定位陈述时使用。定位陈述自动生成，输入价值主张+竞品分析+用户洞察，输出3-5个差异化定位陈述候选，含质量门检查。关键词：定位陈述、产品定位、差异化定位、价值主张表达。
metadata:
  module: "产品商业与战略"
  sub-module: "产品定位与差异化"
  type: "pipeline"
  version: "2.0"
  interaction_mode: "ai_suggest_human_approve"
---

# Pipeline 5: 定位陈述自动生成

## 核心原则

1. **公式化生成**——使用[目标用户]+[产品名]+[核心价值]+[差异化点]定位公式
2. **3-5候选比较**——生成3-5个差异化定位陈述，差异化来源/用户粒度/竞品参照各不同
3. **五项质量门**——specific/differentiated/exclusive/verifiable/concise五项检查全通过才可输出
4. **不通过重试**——质量检查不通过自动重试最多3次，仍不通过升级人类

## 交互模式
🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 价值主张匹配结果 | JSON | 是 | output/pm-strategy/business-value-fit/evaluation_report.json | 价值主张匹配度评分 |
| 竞品分析数据 | JSON | 是 | output/pm-discovery/market-competitor-intel/competitor-intel.json | 竞品定位、差异化要素 |
| 用户洞察 | JSON | 是 | user-research-user-modeling | 用户画像、核心需求 |

## 执行步骤

### Step 1: 定位要素提取
从输入数据中提取定位要素：

1. **目标用户**：从用户画像中提取核心用户群体
2. **核心价值**：从价值主张匹配中提取高匹配度价值
3. **差异化点**：从竞品分析中提取差异化要素
4. **品类定义**：定义产品所属品类

### Step 2: 定位陈述生成
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

### Step 3: 质量门检查
对每个定位陈述进行5项质量检查：

| 检查项 | 标准 | 通过条件 |
|--------|------|----------|
| Specific (具体性) | 目标用户和价值明确 | 用户群体可识别，价值可感知 |
| Differentiated (差异化) | 与竞品有明确差异 | 差异点可验证 |
| Exclusive (排他性) | 不是所有竞品都能说 | 至少1个竞品无法声称 |
| Verifiable (可验证) | 可以被事实验证 | 有可量化的支撑证据 |
| Concise (简洁性) | 一句话说清 | ≤30字核心表述 |

### Step 4: 推荐与排序
基于质量门检查结果，推荐和排序定位陈述：
- 全部通过的排在前面
- 部分通过的标注改进建议
- 未通过的标注淘汰原因

## 输出

**存储路径**：`output/pm-strategy/positioning-statement/`

**输出文件**：positioning-statements.json

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

```json
{
  "positioning_statements": [
    {
      "statement": "对于中小型培训机构，EduAI是一个AI教学SaaS平台，它通过自适应学习引擎提升学员完课率，不同于传统课程平台，EduAI能根据学员知识图谱动态调整教学路径",
      "target_user": "中小型培训机构",
      "category": "AI教学SaaS平台",
      "core_value": "通过自适应学习引擎提升学员完课率",
      "differentiation": "根据学员知识图谱动态调整教学路径",
      "competitor_reference": "传统课程平台",
      "quality_check": {
        "specific": true,
        "differentiated": true,
        "exclusive": true,
        "verifiable": true,
        "concise": true,
        "all_passed": true
      },
      "rank": 1
    },
    {
      "statement": "对于企业培训管理者，EduAI是一个智能培训管理平台，它让培训效果可量化，不同于静态课程平台，EduAI提供AI驱动的学习ROI看板",
      "target_user": "企业培训管理者",
      "category": "智能培训管理平台",
      "core_value": "让培训效果可量化",
      "differentiation": "AI驱动的学习ROI看板",
      "competitor_reference": "静态课程平台",
      "quality_check": {
        "specific": true,
        "differentiated": true,
        "exclusive": false,
        "verifiable": true,
        "concise": true,
        "all_passed": false,
        "improvement_suggestion": "排他性不足：竞品B也可声称提供ROI看板"
      },
      "rank": 2
    }
  ],
  "recommended_index": 0
}
```

## 决策规则

1. **质量门规则**：5项质量检查全通过才可输出
2. **重试规则**：不通过自动重试最多3次
3. **升级规则**：3次重试仍不通过升级人类
4. **最终选择**：人类从候选中选择最终定位陈述

## 质量检查

- [ ] 3-5个定位陈述已生成
- [ ] 每个陈述使用定位公式
- [ ] 5项质量检查已完成
- [ ] 推荐排序合理
- [ ] 差异化来源多样化

---

## 降级策略

当上游文件不存在时，本Skill仍可独立执行：

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| evaluation_report.json（价值主张匹配） | 用户提供产品价值描述 → 生成定位陈述 | 缺乏价值匹配数据，核心价值可能不够精准 |
| competitor-intel.json（竞品分析） | 用户提供产品价值描述 → 生成定位陈述 | 缺乏竞品数据，差异化点和竞品参照缺乏依据 |
| evaluation_report.json + competitor-intel.json | 用户提供产品价值描述 → 生成定位陈述 | 整体置信度降低，定位陈述缺乏数据锚定 |
| 所有上游文件均缺失 | 提示用户先执行前序阶段，或基于用户提供的产品价值描述生成定位陈述 | 整体置信度显著降低，定位陈述仅为假设推断 |
| 用户洞察数据 | 若用户洞察数据缺失，提示用户提供或跳过该输入相关步骤 | 目标用户定义可能不够精准 |

数据获取说明：
- 本Skill需要价值主张匹配和竞品分析数据，请通过以下方式之一提供：
  1. 直接描述产品价值、目标用户和竞品差异
  2. 上传evaluation_report.json / competitor-intel.json文件
  3. 提供数据文件路径
- AI不负责外部数据采集，仅负责分析

---

## 上游变更响应

### 上游变更影响表

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| evaluation_report价值主张匹配变更 | 核心价值提取 | 重新执行Step 1-2，更新定位陈述 |
| competitor-intel竞品分析更新 | 差异化点和竞品参照 | 重新执行Step 1-2，更新差异化要素 |
| persona用户画像更新 | 目标用户定义 | 重新执行Step 1，更新目标用户 |

### 下游通知机制表

| 变更类型 | 影响范围 | 通知方式 |
|----------|----------|----------|
| 定位陈述变更 | positioning-exclusion、positioning-differentiation | 输出文件版本号+变更摘要 |
| 质量门检查结果变更 | positioning-exclusion | 输出文件版本号+变更摘要 |
