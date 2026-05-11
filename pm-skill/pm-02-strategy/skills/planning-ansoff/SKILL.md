---
name: planning-ansoff
description: 当需要进行市场扩张、产品扩张、多元化战略决策时使用。Ansoff矩阵自动定位。分析当前产品/市场定位，推荐增长路径。关键词：Ansoff矩阵、增长路径、市场扩张、多元化战略、产品扩张。
metadata:
  module: "产品商业与战略"
  sub-module: "战略规划与路线图"
  type: "pipeline"
  version: "1.0"
  interaction_mode: "ai_suggest_human_approve"
---

# Pipeline 11: Ansoff矩阵自动定位

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

| 缺失的上游文件 | 降级方案 |
|---------------|---------|
| 当前产品/市场定义数据 | 用户提供产品现状 → 定位Ansoff象限，标注"缺乏结构化产品市场定义" |
| 增长目标数据 | 用户提供产品现状和增长期望 → 定位Ansoff象限，标注"缺乏增长目标数据" |
| 所有上游文件均缺失 | 提示用户先执行前序阶段，或基于用户提供的产品现状定位Ansoff象限 |

数据获取说明：
- 本Skill需要当前产品/市场定义和增长目标数据，请通过以下方式之一提供：
  1. 直接描述产品现状、当前市场和增长期望
  2. 上传bmc.json / swot.json等文件
  3. 提供数据文件路径
- AI不负责外部数据采集，仅负责分析
