---
name: stakeholder-map
description: 当需要识别和管理产品利益相关者时使用。利益相关者地图自动生成，识别产品决策者、资源控制者、受影响方和外部相关方，评估影响力和关注度，生成四象限地图。关键词：利益相关者、Stakeholder地图、影响力、关注度、四象限。
metadata:
  module: "产品商业与战略"
  sub-module: "利益相关者管理"
  type: "pipeline"
  version: "2.0"
  interaction_mode: "ai_suggest_human_approve"
---

# 利益相关者地图自动生成

## 核心原则

1. **四类全覆盖**——产品决策者/资源控制者/受影响方/外部相关方四类缺一不可
2. **双维度量化**——影响力和关注度1-5分评估，四象限分类有据可依
3. **关键决策者不遗漏**——关键决策者未在地图中则阻塞后续流程
4. **沟通策略具体化**——每个Stakeholder的沟通策略必须包含关切点和建议话题

## 交互模式
🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 商业模式画布 | JSON | 是 | output/pm-strategy/business-model-canvas/bmc.json | 关键伙伴、客户关系 |
| 产品/业务信息 | string | 是 | 用户提供 | 产品名称、组织架构、业务模式 |

## 执行步骤

### Step 1: 利益相关者识别

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

### Step 2: 影响力-关注度评估

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

### Step 3: 四象限分类

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

### Step 4: 沟通策略制定

为每个利益相关者制定沟通策略：

| 要素 | 内容 |
|------|------|
| 沟通频率 | 日常/周度/月度/按需 |
| 沟通方式 | 会议/邮件/简报/一对一 |
| 关切点 | 该Stakeholder最关心什么 |
| 建议话题 | 沟通时应该讨论什么 |
| 风险 | 不沟通可能导致的后果 |

## 输出

**存储路径**：`output/pm-strategy/stakeholder-map/`

**输出文件**：stakeholder-map.json

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

```json
{
  "stakeholder_map": {
    "stakeholders": [
      {
        "name": "产品VP",
        "category": "decision_maker",
        "influence": 5,
        "interest": 4,
        "quadrant": "key_player",
        "communication_strategy": {
          "frequency": "周度",
          "method": "一对一+战略简报",
          "concerns": ["产品方向", "市场竞争力", "ROI"],
          "suggested_topics": ["战略方向进展", "关键指标变化", "竞品动态"],
          "risk": "方向偏移，资源错配"
        }
      },
      {
        "name": "技术总监",
        "category": "resource_controller",
        "influence": 4,
        "interest": 3,
        "quadrant": "keep_satisfied",
        "communication_strategy": {
          "frequency": "月度",
          "method": "技术评审+邮件简报",
          "concerns": ["技术可行性", "团队负载", "技术债务"],
          "suggested_topics": ["技术方案评审", "资源需求", "技术风险"],
          "risk": "技术方案不支持，开发延期"
        }
      }
    ],
    "quadrant_summary": {
      "key_player": ["产品VP", "CEO"],
      "keep_satisfied": ["技术总监", "财务总监"],
      "keep_informed": ["运营团队", "客服团队"],
      "minimal_effort": ["行业协会"]
    },
    "key_decision_makers_identified": true
  }
}
```

## 决策规则

1. **关键决策者检查**：至少1个决策者已识别
2. **评分校准**：影响力评分需人类校准
3. **沟通策略**：需人类审批确认

## 质量检查

- [ ] 4类利益相关者都已识别
- [ ] 每个利益相关者有双维度评分
- [ ] 四象限分类已完成
- [ ] 沟通策略具体可执行
- [ ] 关键决策者已识别

---

## 降级策略

当上游文件不存在时，本Skill仍可独立执行：

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| bmc.json | 用户提供组织架构和业务信息 → 识别利益相关者 | 缺乏BMC数据，关键伙伴和客户关系可能遗漏 |
| 产品/业务信息（用户提供） | 若用户未提供产品/业务信息，提示用户提供或跳过该输入相关步骤 | 利益相关者识别缺乏业务上下文 |
| bmc.json + 产品/业务信息 | 用户提供组织架构和业务信息 → 识别利益相关者 | 整体置信度降低，利益相关者列表可能不完整 |
| 所有上游文件均缺失 | 提示用户先执行前序阶段，或基于用户提供的组织架构信息识别利益相关者 | 整体置信度显著降低，地图仅为通用参考 |

---

## 上游变更响应

### 上游变更影响表

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| bmc.json关键伙伴变更 | 外部相关方识别 | 重新执行Step 1，更新外部相关方 |
| bmc.json客户关系变更 | 受影响方识别 | 重新执行Step 1，更新受影响方 |
| 组织架构变更 | 决策者和资源控制者 | 重新执行Step 1-2，更新决策者和资源控制者 |

### 下游通知机制表

| 变更类型 | 影响范围 | 通知方式 |
|----------|----------|----------|
| 利益相关者列表变更 | stakeholder-brief、stakeholder-strategy-doc | 输出文件版本号+变更摘要 |
| 四象限分类变更 | stakeholder-brief | 输出文件版本号+变更摘要 |
| 沟通策略调整 | stakeholder-strategy-doc | 输出文件版本号+变更摘要 |
