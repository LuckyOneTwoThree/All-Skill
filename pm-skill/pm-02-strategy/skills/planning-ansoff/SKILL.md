---
name: planning-ansoff
description: 当需要进行市场扩张、产品扩张、多元化战略决策时使用。Ansoff矩阵自动定位。分析当前产品/市场定位，推荐增长路径。关键词：Ansoff矩阵、增长路径、市场扩张、多元化战略、产品扩张。
metadata:
  module: "产品商业与战略"
  sub-module: "战略规划与路线图"
  type: "pipeline"
  version: "2.0"
  interaction_mode: "ai_suggest_human_approve"
---

# Pipeline 11: Ansoff矩阵自动定位

## 核心原则

1. **象限定位先行**——先明确当前产品/市场象限，再推演增长路径
2. **双路径推演**——至少推荐2条增长路径，含风险等级和可行性评估
3. **风险递增原则**——从市场渗透到多元化，风险递增需显式标注
4. **能力匹配验证**——增长路径必须与SWOT优势/劣势交叉验证

## 交互模式
🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 当前产品定义 | string | 是 | 用户提供 | 产品核心功能和价值主张描述 |
| 当前市场定义 | string | 是 | 用户提供 | 目标市场、用户群体描述 |
| 增长目标 | string | ○ | output/pm-strategy/planning-okr/okr.json | 期望的增长方向和目标 |
| SWOT分析结果 | JSON | ○ | output/pm-strategy/planning-swot/swot.json | 优势/劣势/机会/威胁 |

## Ansoff矩阵框架

```
                    │ 现有产品      │ 新产品
────────────────────┼───────────────┼──────────────
    现有市场        │ 市场渗透      │ 产品开发
                    │ (Penetration) │ (Development)
────────────────────┼───────────────┼──────────────
    新市场          │ 市场开发      │ 多元化
                    │ (Development) │ (Diversification)
```

## 执行步骤

### Step 1: 当前象限判断

分析当前产品/市场定位：

**市场渗透 (Penetration)**
- 产品：现有产品
- 市场：现有市场
- 策略：增加市场份额、用户忠诚度、价格优化

**市场开发 (Development)**
- 产品：现有产品
- 市场：新市场
- 策略：地理扩张、用户细分、渠道拓展

**产品开发 (Development)**
- 产品：新产品
- 市场：现有市场
- 策略：产品线扩展、功能迭代、版本升级

**多元化 (Diversification)**
- 产品：新产品
- 市场：新市场
- 策略：相关多元化、非相关多元化

### Step 2: 增长路径推荐

基于SWOT和增长目标，推荐1-2条增长路径：

每条路径包含：
- 路径名称和类型
- 风险等级 (High/Medium/Low)
- 资源需求 (High/Medium/Low)
- 预期回报 (High/Medium/Low)
- 时间线 (周期)
- 可行性评估

### Step 3: 路径可行性评估

评估每条路径的可行性：
- 市场吸引力
- 能力匹配度
- 资源可获得性
- 风险可控性

## 输出

**存储路径**：`output/pm-strategy/planning-ansoff/`

**输出文件**：ansoff.json

### 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| ansoff.current_position.quadrant | string | 是 | 当前象限：市场渗透/市场开发/产品开发/多元化 |
| ansoff.current_position.description | string | 是 | 当前定位描述 |
| ansoff.current_position.rationale | array | 是 | 定位理由列表 |
| ansoff.growth_paths | array | 是 | 至少2条增长路径 |
| ansoff.growth_paths[].path | string | 是 | 路径名称 |
| ansoff.growth_paths[].quadrant | string | 是 | 目标象限 |
| ansoff.growth_paths[].risk_level | string | 是 | high/medium/low |
| ansoff.growth_paths[].feasibility.overall | number | 是 | 可行性综合评分0-1 |
| ansoff.growth_paths[].key_actions | array | 是 | 关键行动列表 |
| ansoff.growth_paths[].risks | array | 是 | 风险列表，含mitigation |
| ansoff.recommendations.primary | string | 是 | 推荐主路径 |
| ansoff.recommendations.rationale | string | 是 | 推荐理由 |

```yaml
ansoff:
  current_position:
    quadrant: "市场渗透"
    description: "当前定位于现有市场中的现有产品"
    rationale:
      - "产品成熟稳定"
      - "市场渗透率已达较高水平"
      - "增长空间受限"
  growth_paths:
    - path: "市场开发"
      quadrant: "市场开发"
      risk_level: "medium"
      resource_requirement: "medium"
      expected_return: "medium"
      timeline: "6-12个月"
      feasibility:
        overall: 0.70
        market_attractiveness: 0.75
        capability_match: 0.80
        resource_availability: 0.65
        risk_controllability: 0.60
      key_actions:
        - "识别目标新市场细分"
        - "调整产品适配新市场"
        - "建立新渠道合作关系"
      risks:
        - risk: "市场认知不足"
          mitigation: "品牌联合推广"
        - risk: "本地化成本高"
          mitigation: "分阶段进入"
      dependencies:
        - "市场调研资源"
        - "本地化团队"
    - path: "产品开发"
      quadrant: "产品开发"
      risk_level: "high"
      resource_requirement: "high"
      expected_return: "high"
      timeline: "12-18个月"
      feasibility:
        overall: 0.55
        market_attractiveness: 0.85
        capability_match: 0.50
        resource_availability: 0.40
        risk_controllability: 0.45
      key_actions:
        - "新产品技术研发"
        - "MVP快速验证"
        - "用户测试迭代"
      risks:
        - risk: "技术研发失败"
          mitigation: "多方案并行"
        - risk: "市场不接受"
          mitigation: "早期用户验证"
      dependencies:
        - "研发团队扩展"
        - "技术合作伙伴"
  recommendations:
    primary: "市场开发"
    rationale: "风险可控，资源需求适中，与现有能力匹配度高"
    notes: "建议优先考虑市场开发，利用现有产品优势开拓新市场"
```

## 决策规则

1. **增长路径选择**：必须人类最终决策
2. **风险评估**：人类判断风险接受程度
3. **资源决策**：人类决策资源分配优先级

## 质量检查

- [ ] 4个象限都已分析
- [ ] 当前定位已确定
- [ ] 1-2条增长路径已推荐
- [ ] 每条路径有风险等级标注
- [ ] 每条路径有资源需求评估
- [ ] 可行性评估已完成
- [ ] 关键行动具体可执行

---

## 降级策略

当上游文件不存在时，本Skill仍可独立执行：

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 当前产品/市场定义数据 | 用户提供产品现状 → 定位Ansoff象限 | 缺乏结构化产品市场定义，象限定位可能不够精准 |
| 增长目标数据 | 用户提供产品现状和增长期望 → 定位Ansoff象限 | 缺乏增长目标数据，路径推荐缺乏方向锚定 |
| SWOT分析数据 | 用户提供产品现状 → 基于AI知识推演路径 | 缺乏SWOT交叉验证，可行性评估偏主观 |
| 所有上游文件均缺失 | 提示用户先执行前序阶段，或基于用户提供的产品现状定位Ansoff象限 | 整体置信度显著降低，路径推荐仅为假设推断 |

数据获取说明：
- 本Skill需要当前产品/市场定义和增长目标数据，请通过以下方式之一提供：
  1. 直接描述产品现状、当前市场和增长期望
  2. 上传bmc.json / swot.json等文件
  3. 提供数据文件路径
- AI不负责外部数据采集，仅负责分析

---

## 上游变更响应

### 上游变更影响表

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| 产品定义变更 | 当前象限定位需重新判断 | 重新执行Step 1，更新象限定位 |
| 市场定义变更 | 当前象限和增长路径 | 重新执行Step 1-3，更新象限和路径 |
| okr.json增长目标调整 | 增长路径推荐方向 | 重新执行Step 2，更新路径推荐 |
| swot.json SWOT更新 | 路径可行性评估 | 重新执行Step 3，更新可行性评分 |

### 下游通知机制表

| 变更类型 | 影响范围 | 通知方式 |
|----------|----------|----------|
| 象限定位变更 | business-strategy-report | 输出文件版本号+变更摘要 |
| 增长路径推荐变更 | planning-roadmap、business-strategy-report | 输出文件版本号+变更摘要 |
| 可行性评分变更 | planning-roadmap | 输出文件版本号+变更摘要 |
