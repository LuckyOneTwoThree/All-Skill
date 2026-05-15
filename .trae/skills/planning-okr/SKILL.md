---
name: planning-okr
description: 当需要制定季度/年度OKR、目标分解、绩效考核标准时使用。OKR自动生成。从战略方向生成目标与关键结果，包括Objective生成、Key Results设计、可行性评估和OKR对齐检查。关键词：OKR、目标管理、关键结果、目标分解、OKR对齐、定目标、目标拆解。
metadata:
  module: "产品商业与战略"
  sub-module: "战略规划与路线图"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["通用"]
  trigger_examples:
    - "帮我制定季度OKR"
    - "目标怎么拆解"
  interaction_mode: "ai_suggest_human_approve"
---

# OKR自动生成

## 核心原则

1. **O从战略来**——Objective必须源于SWOT战略方向，不可脱离战略凭空设定
2. **KR必须可量化**——每个KR有明确数字目标和验证方法，拒绝模糊表述
3. **可行性硬检查**——达成概率<0.3升级调整目标，>0.9升级增加挑战
4. **对齐闭环**——O与KR逻辑一致、KR之间相互支撑、与北极星指标关联

## 交互模式
🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| SWOT战略方向 | JSON | 是 | output/pm-strategy/strategic-analysis/strategic-analysis.json | SO/ST/WO/WT战略方向 |
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

**KR达成概率估算规则**：

| 场景 | 估算方法 | 置信度 |
|------|----------|--------|
| 有历史数据 | 基于历史趋势外推，target/baseline比值与历史增速对比 | 高(≥0.7) |
| 有行业基准 | 参考同行业同阶段公司的KR达成率 | 中(0.4-0.7) |
| 无参考数据 | 基于德尔菲法——AI提供3档概率(乐观0.8/中性0.5/保守0.2)，人类选择 | 低(<0.4) |

达成概率 < 0.3 的 KR 标注 needs_human_validation: true，建议调整 target 或拆分为多个渐进式KR。

**北极星指标消费**：从输入的北极星指标中提取核心指标和下钻指标，确保至少1个KR的metric与北极星指标直接关联，标注 north_star_alignment: true。

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

**achievability 计算方法**：

```
achievability_score = w1 × resource_fit + w2 × historical_trend + w3 × dependency_risk

- resource_fit: 团队当前资源/预估所需资源（0-1），基于团队规模动态校准：
  - 1-3人: 0.3（资源紧张）
  - 4-6人: 0.5（资源适中）
  - 7-10人: 0.7（资源充裕）
  - >10人: 0.8（资源丰富）
  - 若团队规模未知，默认0.4（偏保守）
- historical_trend: 基于历史数据时为达成概率，无历史数据时为0.5
- dependency_risk: 1 - (外部依赖数量 × 0.15)，最低0.1
- w1=0.4, w2=0.35, w3=0.25

achievability_score < 0.4 标注为高风险KR，needs_human_validation: true
```

### Step 4: OKR对齐检查

检查OKR之间的对齐关系：
- 与公司战略对齐
- O与KR逻辑一致
- KR之间相互支撑
- 时间线合理

**对齐检查执行规则**：

| 检查维度 | 检查方法 | 通过条件 | 不通过处理 |
|----------|----------|----------|-----------|
| O-KR一致性 | 每个KR必须直接贡献对应O的达成 | 所有KR与O有直接因果关系 | 标注不一致KR，建议重新定义 |
| KR间独立性 | KR之间不应有包含或因果关系 | KR两两之间无逻辑依赖 | 合并依赖KR或拆分为独立KR |
| 北极星对齐 | 至少1个KR的指标与北极星指标直接关联 | north_star_alignment=true的KR≥1 | 标注北极星对齐缺失，建议增加关联KR |
| 量化可验证 | 每个KR包含数字目标值和截止时间 | 所有KR包含metric+target+deadline | 标注不可验证KR，建议补充量化指标 |
| 资源可行性 | achievability_score ≥ 0.4 | 所有KR的achievability ≥ 0.4 | 标注高风险KR，建议调整target或增加资源 |

## 输出

**存储路径**：`output/pm-strategy/planning-okr/`

**输出文件**：okr.json

### 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| okr_candidates | array | 是 | 至少2个Objective候选 |
| okr_candidates[].objective | string | 是 | Objective描述 |
| okr_candidates[].key_results | array | 是 | 每个O至少3个KR |
| okr_candidates[].key_results[].kr | string | 是 | KR描述 |
| okr_candidates[].key_results[].baseline | string | 是 | 当前基线值 |
| okr_candidates[].key_results[].target | string | 是 | 目标值 |
| okr_candidates[].key_results[].growth_needed | string | 是 | 需增长率 |
| okr_candidates[].key_results[].achievability | number | 是 | 达成概率0-1 |
| okr_candidates[].key_results[].confidence_level | number | 是 | 置信度0-1 |
| okr_candidates[].key_results[].deadline | string | 是 | KR截止日期（ISO8601格式） |
| okr_candidates[].alignment_check.strategic_alignment | boolean | 是 | 战略对齐检查 |
| okr_candidates[].alignment_check.kr_coherence | boolean | 是 | KR一致性检查 |
| okr_candidates[].alignment_check.timeline_feasibility | boolean | 是 | 时间线可行性 |

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
        deadline: "2026-06-30"
      - kr: "KR2: 用户次留率达到45%"
        baseline: 35%
        target: 45%
        growth_needed: 29%
        achievability: 0.70
        dimension: "质量"
        confidence_level: 0.80
        deadline: "2026-06-30"
      - kr: "KR3: 核心功能使用率达到60%"
        baseline: 40%
        target: 60%
        growth_needed: 50%
        achievability: 0.55
        dimension: "质量"
        confidence_level: 0.75
        deadline: "2026-06-30"
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
        deadline: "2026-06-30"
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

- [ ] 每个O包含1句话描述且≤30字
- [ ] 每个KR包含≥1个数字目标值(metric+target)
- [ ] 每个KR包含deadline字段(ISO8601格式)
- [ ] north_star_alignment=true的KR≥1，O-KR一致性检查100%通过
- [ ] 所有KR的achievability_score已计算且≥0.4的KR占比≥60%
- [ ] 战略一致性已验证

---

## 降级策略

当上游文件不存在时，本Skill仍可独立执行：

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| strategic-analysis.json | 用户提供业务目标 → 直接生成OKR候选 | 缺乏战略分析数据支撑，O与战略方向对齐度可能不足 |
| north-star.json | 用户提供业务目标 → 直接生成OKR候选 | 缺乏北极星指标对齐，KR可能与核心指标脱节 |
| bmc.json | 用户提供业务目标 → 直接生成OKR候选 | 缺乏BMC数据，OKR与商业模型关联度可能偏弱 |
| strategic-analysis.json + north-star.json + bmc.json | 用户提供业务目标 → 直接生成OKR候选 | 整体置信度降低，OKR缺乏战略和指标锚定 |
| 所有上游文件均缺失 | 提示用户先执行前序阶段，或基于用户提供的业务目标直接生成OKR候选 | 整体置信度显著降低，OKR仅为通用目标参考 |
| 业务现状数据（用户提供） | 若用户未提供业务现状数据，提示用户提供或跳过该输入相关步骤 | 缺乏基线数据，KR目标值缺乏参照 |

## 数据获取说明

本Skill需要战略分析、北极星指标和BMC数据，请通过以下方式之一提供：
  1. 直接描述业务目标和关键结果预期
  2. 上传strategic-analysis.json / north-star.json / bmc.json文件
  3. 提供数据文件路径
- AI不负责外部数据采集，仅负责分析

---

## 上游变更响应

### 上游变更影响表

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| strategic-analysis.json战略方向调整 | Objective生成需重新对齐 | 重新执行Step 1，更新O候选 |
| north-star.json北极星变更 | KR需与北极星重新对齐 | 重新执行Step 2，更新KR和关联关系 |
| bmc.json商业模式变更 | OKR与商业模型关联 | 重新评估OKR与收入/成本结构对齐 |

### 下游通知机制表

| 变更类型 | 影响范围 | 通知方式 |
|----------|----------|----------|
| Objective调整 | planning-roadmap、business-strategy-report | 输出文件版本号+变更摘要 |
| KR目标值变更 | planning-roadmap | 输出文件版本号+变更摘要 |
| 对齐检查结果变更 | planning-roadmap | 输出文件版本号+变更摘要 |

## 与prd.json数据契约对齐

| 本Skill输出字段 | prd.json对应字段 | 对齐规则 |
|----------------|-----------------|---------|
| okr_candidates[].objective | prd.json.goals[].description | O描述与PRD目标描述一致 |
| okr_candidates[].key_results[].kr | prd.json.goals[].success_metrics[].metric_name | KR描述包含PRD成功指标名称 |
| okr_candidates[].key_results[].target | prd.json.goals[].success_metrics[].target_value | KR目标值与PRD指标目标值一致 |
| okr_candidates[].key_results[].baseline | prd.json.goals[].success_metrics[].current_value | KR基线与PRD指标当前值一致 |
