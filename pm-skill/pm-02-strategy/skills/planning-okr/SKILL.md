---
name: planning-okr
description: 当需要制定季度/年度OKR、目标分解、绩效考核标准时使用。OKR自动生成。从战略方向生成目标与关键结果，包括Objective生成、Key Results设计、可行性评估和OKR对齐检查。关键词：OKR、目标管理、关键结果、目标分解、OKR对齐。
metadata:
  module: "产品商业与战略"
  sub-module: "战略规划与路线图"
  type: "pipeline"
  version: "1.0"
  interaction_mode: "ai_suggest_human_approve"
---

# Pipeline 9: OKR自动生成

## 核心原则

1. **选项生成优于单一推荐**：每个关键决策点生成2-3个可比较选项，由人类选择而非AI替选
2. **数据驱动填充人类驱动选择**：AI负责数据整合与逻辑推导，人类负责方向判断与最终决策
3. **假设显式化**：所有推断内容必须标注为假设，包含风险等级和验证方法
4. **财务建模自动化**：单位经济、敏感性分析等财务计算由AI自动完成，人类只审核结论

## 交互模式
🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| SWOT战略方向 | JSON | 是 | output/pm-strategy/planning-swot/swot.json | SO/ST/WO/WT战略方向 |
| 北极星指标 | JSON | 是 | output/pm-strategy/planning-north-star/north-star.json | 北极星指标及下钻指标 |
| BMC商业模式画布 | JSON | ○ | output/pm-strategy/business-model-canvas/bmc.json | 价值主张、收入来源 |
| 业务现状数据 | JSON | ○ | 用户提供 | 当前业务指标基线 |

## 执行步骤

### Step 1: Objective生成

生成2-3个Objective候选

质量检查标准：
- **方向感**：表达清晰的方向和意图
- **战略一致性**：与SWOT战略方向一致
- **激励性**：能够激励团队
- **时间-bound**：有明确的周期

Objective模板：
```
O: [动词] + [什么] + [达成什么]
```

### Step 2: Key Results生成

每个Objective生成3-5个Key Results

质量检查标准：
- **可量化**：用数字衡量
- **可验证**：有明确的验证方法
- **多维度**：覆盖不同维度（数量/质量/时间/成本）
- **有挑战性**：需要努力才能达成

KR模板：
```
KR: [时间] [数量/百分比] [做什么] 达到 [目标值]
```

### Step 3: KR可行性评估

对每个KR进行可行性评估：

```yaml
kr_assessment:
  baseline: 当前值
  target: 目标值
  growth_needed: 需要的增长率
  achievability: 达成概率 (0-1)
  dimension: 维度分类
  confidence_level: 置信度
```

### Step 4: OKR对齐检查

检查OKR之间的对齐关系：
- 与公司战略对齐
- O与KR逻辑一致
- KR之间相互支撑
- 时间线合理

## 输出

**存储路径**：`output/pm-strategy/planning-okr/`

**输出文件**：okr.json

```yaml
okr_candidates:
  - objective: "O1: 提升用户活跃度"
    key_results:
      - kr: "KR1: DAU达到100万"
        baseline: 60万
        target: 100万
        growth_needed: 67%
        achievability: 0.65
        dimension: "数量"
        confidence_level: 0.85
      - kr: "KR2: 用户次留率达到45%"
        baseline: 35%
        target: 45%
        growth_needed: 29%
        achievability: 0.70
        dimension: "质量"
        confidence_level: 0.80
      - kr: "KR3: 核心功能使用率达到60%"
        baseline: 40%
        target: 60%
        growth_needed: 50%
        achievability: 0.55
        dimension: "质量"
        confidence_level: 0.75
    alignment_check:
      strategic_alignment: true
      kr_coherence: true
      timeline_feasibility: true
      notes: "对齐检查说明"
  - objective: "O2: 优化单位经济模型"
    key_results:
      - kr: "KR1: CAC降低20%"
        baseline: 150元
        target: 120元
        growth_needed: -20%
        achievability: 0.60
        dimension: "成本"
        confidence_level: 0.75
    alignment_check:
      strategic_alignment: true
      kr_coherence: true
      timeline_feasibility: true
      notes: "对齐检查说明"
```

## 决策规则

1. **达成概率升级**：
   - 达成概率 < 0.3：升级调整目标
   - 达成概率 > 0.9：升级增加挑战
2. **OKR最终确认**：必须人类决策
3. **资源匹配**：检查KR资源需求是否可满足

## 质量检查

- [ ] 每个Objective有3-5个KR
- [ ] KR可量化且有明确指标
- [ ] KR有截止时间
- [ ] 对齐检查通过
- [ ] 可行性评估已完成
- [ ] 战略一致性已验证

---

## 降级策略

当上游文件不存在时，本Skill仍可独立执行：

| 缺失的上游文件 | 降级方案 |
|---------------|---------|
| swot.json | 用户提供业务目标 → 直接生成OKR候选，标注"缺乏SWOT数据支撑" |
| north-star.json | 用户提供业务目标 → 直接生成OKR候选，标注"缺乏北极星指标对齐" |
| bmc.json | 用户提供业务目标 → 直接生成OKR候选，标注"缺乏BMC数据" |
| swot.json + north-star.json + bmc.json | 用户提供业务目标 → 直接生成OKR候选，整体置信度降低 |
| 所有上游文件均缺失 | 提示用户先执行前序阶段，或基于用户提供的业务目标直接生成OKR候选 |
| 业务现状数据（用户提供） | 若用户未提供业务现状数据，提示用户提供或跳过该输入相关步骤 |

数据获取说明：
- 本Skill需要SWOT、北极星指标和BMC数据，请通过以下方式之一提供：
  1. 直接描述业务目标和关键结果预期
  2. 上传swot.json / north-star.json / bmc.json文件
  3. 提供数据文件路径
- AI不负责外部数据采集，仅负责分析
