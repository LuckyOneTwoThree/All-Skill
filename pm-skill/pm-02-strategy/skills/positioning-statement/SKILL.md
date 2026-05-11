---
name: positioning-statement
description: 当需要生成产品定位陈述候选时使用。定位陈述自动生成，输入探索阶段输出+BMC+竞品分析，输出3-5个差异化定位陈述。关键词：定位陈述、差异化、目标用户、价值主张。
metadata:
  module: "产品商业与战略"
  sub-module: "产品定位与差异化"
  type: "pipeline"
  version: "1.0"
  interaction_mode: "ai_suggest_human_approve"
---

# Pipeline 4: 定位陈述自动生成

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
| 探索阶段输出 | JSON | 是 | user-research-user-modeling / opportunity-brief | 用户痛点、需求洞察 |
| BMC | JSON | 是 | output/pm-strategy/business-model-canvas/bmc.json | 商业模式画布，包含价值主张 |
| 竞品分析数据 | JSON | 是 | output/pm-discovery/market-competitor-intel/competitor-intel.json | 竞品定位、功能对比 |

## 执行步骤

### Step 1: 定位公式要素填充
使用经典定位公式：
> [目标用户] + [产品名称] + [核心价值] + [使用场景/差异化点]

从输入数据中提取各要素：
- **目标用户**：明确的目标用户群体描述
- **核心价值**：产品提供的核心利益
- **差异化点**：与竞品的区别

### Step 2: 生成定位陈述候选
生成3-5个定位陈述，差异化来源包括：
1. **差异化来源不同**：强调不同卖点
2. **目标用户粒度不同**：覆盖不同用户群体
3. **竞品参照不同**：对比不同竞品

### Step 3: 质量检查
对每个定位陈述进行5项检查：
- [ ] specific_enough：描述是否具体明确
- [ ] differentiated：是否具有差异化
- [ ] exclusive：是否排他（用户专属感）
- [ ] verifiable：是否可以验证
- [ ] concise：是否简洁有力

## 输出

**存储路径**：`output/pm-strategy/positioning-statement/positioning-statements.json`

**输出文件**：positioning-statements.json

```json
{
  "positioning_statements": [
    {
      "statement": "面向中大型企业培训管理者的智学云平台，通过AI自适应学习引擎解决员工培训效果难衡量、学习路径一刀切的问题",
      "differentiation_source": "自研AI自适应学习引擎，基于知识图谱动态生成个性化学习路径，区别于竞品的静态课程分发模式",
      "excluded_audience": "K12学科辅导需求的学生及家长",
      "quality_check": {
        "specific_enough": true,
        "differentiated": true,
        "exclusive": true,
        "verifiable": true,
        "concise": true,
        "passed": true
      }
    }
  ]
}
```

## 决策规则

| 情况 | 处理方式 |
|------|----------|
| 质量检查全部通过 | 进入下一阶段 |
| 质量检查不通过 | 自动重试(最多3次) |
| 3次仍不通过 | 升级人类审批 |

## 质量检查

5项检查必须全部通过：
1. **specific_enough** - 定位陈述是否具体到可执行
2. **differentiated** - 是否与竞品有明显区别
3. **exclusive** - 是否为特定用户群体专属
4. **verifiable** - 价值主张是否可被验证
5. **concise** - 陈述是否简洁有力

---

## 降级策略

当上游文件不存在时，本Skill仍可独立执行：

| 缺失的上游文件 | 降级方案 |
|---------------|---------|
| exploration_outputs（persona / opportunity-brief等） | 用户提供产品描述和竞品 → 直接生成定位陈述，标注"缺乏探索阶段数据" |
| bmc.json | 用户提供产品描述和竞品 → 直接生成定位陈述，标注"缺乏BMC数据" |
| competitor-intel.json | 用户提供产品描述和竞品 → 直接生成定位陈述，标注"缺乏竞品分析数据" |
| 所有上游文件均缺失 | 提示用户先执行前序阶段，或基于用户提供的产品描述和竞品直接生成定位陈述 |

数据获取说明：
- 本Skill需要探索输出、BMC和竞品分析数据，请通过以下方式之一提供：
  1. 直接描述产品、目标用户和主要竞品
  2. 上传bmc.json / competitor-intel.json / persona.json等文件
  3. 提供数据文件路径
- AI不负责外部数据采集，仅负责分析
