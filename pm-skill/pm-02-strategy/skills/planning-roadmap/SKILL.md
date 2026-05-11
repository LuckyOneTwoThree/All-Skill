---
name: planning-roadmap
description: 当需要制定产品路线图、季度规划、版本规划、资源分配时使用。路线图自动规划。基于OKR和战略方向，规划Epic级别的产品路线图，进行Now/Next/Later分层和RICE评分排序。关键词：产品路线图、版本规划、RICE评分、季度规划、Epic规划。
metadata:
  module: "产品商业与战略"
  sub-module: "战略规划与路线图"
  type: "pipeline"
  version: "1.0"
  interaction_mode: "ai_suggest_human_approve"
---

# Pipeline 10: 路线图自动规划

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
| OKR目标与关键结果 | JSON | 是 | output/pm-strategy/planning-okr/okr.json | Objective与Key Results |
| SWOT战略方向 | JSON | 是 | output/pm-strategy/planning-swot/swot.json | SO/ST/WO/WT战略方向 |
| 需求优先级评分 | JSON | ○ | requirements-prioritization | RICE评分结果 |
| 资源约束条件 | JSON | ○ | 用户提供 | 团队容量、预算、时间约束 |

## 执行步骤

### Step 1: 战略主题提取

从OKR和SWOT中提取3-5个战略主题：

```
主题 = 战略方向 + 业务目标 + 价值主张
```

每个战略主题包含：
- 主题名称
- 支撑的OKR
- 战略意义

### Step 2: Epic级别规划

将战略主题分解为季度Epic：

```yaml
epic:
  name: "Epic名称"
  quarter: "Q1 2024"
  description: "Epic描述"
  success_metric: "成功指标"
  rice_score: 75
  effort: "人月"
  dependencies:
    - "依赖项1"
    - "依赖项2"
  risks:
    - risk: "风险描述"
      likelihood: "high/medium/low"
      mitigation: "缓解措施"
  key_assumptions:
    - "关键假设1"
    - "关键假设2"
```

### Step 3: Now/Next/Later分层

根据RICE评分和时间维度分层：

**Now (当前季度)**
- 已确认的高优先级Epic
- 必须完成的依赖项
- 高信心度项目

**Next (下一季度)**
- 计划中但可调整的Epic
- 依赖Now阶段结果
- 中等优先级项目

**Later (远期)**
- 方向性规划
- 需进一步验证的假设
- 低优先级或探索性项目

### Step 4: RICE评分计算

RICE公式：
```
RICE Score = (Reach × Impact × Confidence) ÷ Effort
```

评分标准：
- **Reach (触达)**：影响的用户/客户数量
- **Impact (影响)**：对目标的正面影响程度 (0.25-3)
- **Confidence (信心)**：对数据和假设的信心度 (0.5-1)
- **Effort (工作量)**：完成所需的人月数

### Step 5: 风险标注

识别并标注风险：
- 技术风险
- 资源风险
- 依赖风险
- 市场风险

## 输出

**存储路径**：`output/pm-strategy/planning-roadmap/`

**输出文件**：roadmap.json

```yaml
roadmap:
  strategic_themes:
    - theme: "用户增长"
      okr_reference: "O1: 提升用户活跃度"
      priority: 1
    - theme: "商业变现"
      okr_reference: "O2: 优化单位经济"
      priority: 2
  quarterly_epics:
    - quarter: "Q1 2024"
      epics:
        - epic: "用户引导优化"
          success_metric: "新用户激活率提升30%"
          rice_score: 85
          effort: 3
          dependencies: ["设计资源"]
          risks:
            - risk: "技术实现复杂度"
              likelihood: "medium"
              mitigation: "预留技术调研时间"
          key_assumptions:
            - "数据分析支持优化方向"
    - quarter: "Q2 2024"
      epics:
        - epic: "社交功能开发"
          success_metric: "用户互动率提升50%"
          rice_score: 72
          effort: 5
          dependencies: ["后端API支持"]
          risks:
            - risk: "用户隐私合规"
              likelihood: "high"
              mitigation: "法务提前介入"
          key_assumptions:
            - "功能上线后用户接受度高"
  now_next_later:
    now:
      - epic: "用户引导优化"
        quarter: "Q1"
        rationale: "高RICE分数，直接支撑OKR"
    next:
      - epic: "社交功能开发"
        quarter: "Q2"
        rationale: "依赖Q1数据验证，需进一步调研"
    later:
      - epic: "国际化扩展"
        quarter: "Q3+"
        rationale: "长期战略方向，需市场验证"
```

## 决策规则

1. **RICE计算**：AI自动完成计算
2. **优先级决策**：人类决策最终优先级
3. **资源分配**：人类决策季度资源分配
4. **分层调整**：人类可调整Now/Next/Later分层

## 质量检查

- [ ] Epic有明确的成功指标
- [ ] 所有Epic有依赖关系标注
- [ ] Now/Next/Later分层已完成
- [ ] RICE评分已计算
- [ ] 风险已识别并有缓解措施
- [ ] 资源估算合理

---

## 降级策略

当上游文件不存在时，本Skill仍可独立执行：

| 缺失的上游文件 | 降级方案 |
|---------------|---------|
| okr.json | 用户提供目标列表 → 直接规划路线图，标注"缺乏OKR结构化数据" |
| swot.json | 用户提供目标列表 → 直接规划路线图，标注"缺乏SWOT数据" |
| 需求优先级数据（priority-scoring / kano） | 用户提供目标列表 → 直接规划路线图，标注"缺乏需求优先级数据" |
| okr.json + swot.json + 需求优先级 | 用户提供目标列表 → 直接规划路线图，整体置信度降低 |
| 所有上游文件均缺失 | 提示用户先执行前序阶段，或基于用户提供的目标列表直接规划路线图 |
| 资源约束条件（用户提供） | 若用户未提供资源约束条件，提示用户提供或跳过该输入相关步骤 |

数据获取说明：
- 本Skill需要OKR、SWOT和需求优先级数据，请通过以下方式之一提供：
  1. 直接描述业务目标和功能优先级
  2. 上传okr.json / swot.json / priority-scoring.json文件
  3. 提供数据文件路径
- AI不负责外部数据采集，仅负责分析
