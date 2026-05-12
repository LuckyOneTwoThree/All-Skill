---
name: market-orchestrator
description: 当需要执行完整的市场与竞品分析流程时使用。市场竞品指挥官，调度market-tam-som/pest/competitor-intel/quadrant/report。关键词：市场分析、竞品分析、TAM/SAM/SOM、PEST、竞品情报、四象限。
metadata:
  module: "产品探索与发现"
  sub-module: "市场竞品"
  type: "orchestrator"
  version: "7.0"
---

# 市场竞品指挥官

## 核心原则

1. **市场是动态生态系统**——市场不是静态的赛场，竞品在流动、用户在迁移、技术在演进，编排器确保分析结果标注时效性，建议复评周期
2. **宏观微观交叉验证**——TAM/PEST是宏观视角，competitor-intel/quadrant是微观视角，report必须整合宏观微观才输出结论，单一视角结论不可信
3. **并行采集串行整合**——TAM与PEST可并行采集，competitor-intel依赖宏观输入，quadrant依赖intel数据，report依赖全部上游，有依赖的步骤必须串行
4. **人类验证三个关键节点**——TAM双路径差异>20%时人类判断、竞品战略推断低置信度时人类验证、差异化策略优先级人类确认

## 编排协议

你是编排器，职责是**按阶段调度子Skill执行**，而非代理执行子Skill逻辑。严格遵循以下协议：

### 调用规则

1. **显式调用**：使用 `Skill` 工具调用子Skill，传递输入数据，接收输出结果
2. **不代理执行**：不读取子Skill的SKILL.md来替代执行，不自行推断子Skill的内部逻辑
3. **契约驱动**：只关注子Skill的输入契约、输出契约和验证条件，不关注内部实现
4. **状态传递**：将当前阶段的输出作为下一阶段的输入，通过文件路径传递数据
5. **验证后推进**：每个阶段输出验证通过后，才推进到下一阶段
6. **阶段总结**：所有子Skill执行完成后，生成阶段总结文档，写入 `output/phase-reports/pm-discovery/market-orchestrator.md`

### 上下文管理

- 每个子Skill调用完成后，只保留**输出文件路径**和**关键结论摘要**
- 详细输出写入 `output/pm-discovery/{skill-name}/` 目录
- 若上下文接近上限，优先保留当前阶段内容和待执行阶段的子Skill名称

### 阶段总结

所有子Skill执行完成后，编排器必须生成一份阶段总结文档，写入 `output/phase-reports/pm-discovery/market-orchestrator.md`，包含以下结构：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

## Pipeline 定义

```yaml
pipeline: market-orchestrator
version: 7.0

stages:
  - id: phase-1
    name: "并行采集"
    parallel: true
    skills:
      - market-tam-som
      - market-pest
    gate:
      condition: "tam-som.json + pest.json 均已生成且验证通过"
      fail_action: "补充品类关键词和目标市场信息或检查子Skill执行结果"

  - id: phase-2
    name: "竞品情报"
    depends_on: [phase-1]
    skills: [market-competitor-intel]
    gate:
      condition: "competitors数组非空，Feature Matrix已更新"
      fail_action: "检查竞品列表是否充分"

  - id: phase-3
    name: "四象限定位"
    depends_on: [phase-2]
    skills: [market-competitor-quadrant]
    gate:
      condition: "四象限均已填充，每项标注了数据来源和置信度"
      fail_action: "补充已知竞品名称或检查输入数据"

  - id: phase-4
    name: "竞品报告"
    depends_on: [phase-1, phase-2, phase-3]
    skills: [market-competitor-report]
    gate:
      condition: "执行摘要包含3条核心发现+Top1策略"
      fail_action: "检查上游数据是否完整"
```

## 阶段执行计划

### 阶段1：并行采集

#### 调用 market-tam-som

```
Skill: market-tam-som
输入:
  category_keywords: 用户提供（品类关键词）
  target_market: 用户提供（目标市场地理范围）
  time_range: 用户提供（测算时间范围）
输出: output/pm-discovery/market-tam-som/tam-som.json
验证: tam/sam/som三层测算完整，每层含区间估计（乐观/中性/保守），关键假设已标注
模式: 🤖→👤
```

#### 调用 market-pest

```
Skill: market-pest
输入:
  category_keywords: 用户提供（品类关键词）
  target_market: 用户提供（目标市场）
输出: output/pm-discovery/market-pest/pest.json
验证: political/economic/social/technological四维度均已扫描，每维度至少3条趋势摘要
模式: 🤖
```

⏸ **阶段卡口**：tam-som.json + pest.json 均已生成且验证通过 → 未通过：补充品类关键词和目标市场信息或检查子Skill执行结果

### 阶段2：竞品情报

#### 调用 market-competitor-intel

```
Skill: market-competitor-intel
输入:
  competitor_list: 用户提供（竞品列表）
  monitor_config: 用户提供（监控配置）
  tam_som_ref: output/pm-discovery/market-tam-som/tam-som.json（可选）
  pest_ref: output/pm-discovery/market-pest/pest.json（可选）
输出: output/pm-discovery/market-competitor-intel/competitor-intel.json
验证: competitors数组非空，Feature Matrix已更新，竞品口碑对比已完成，战略方向推断已完成
模式: 🤖
```

⏸ **阶段卡口**：competitors数组非空，Feature Matrix已更新 → 未通过：检查竞品列表是否充分

### 阶段3：四象限定位

#### 调用 market-competitor-quadrant

```
Skill: market-competitor-quadrant
输入:
  category_keywords: 用户提供（品类关键词）
  known_competitors: 用户提供（已知竞品列表）
  intel_ref: output/pm-discovery/market-competitor-intel/competitor-intel.json（可选）
输出: output/pm-discovery/market-competitor-quadrant/competitor-quadrant.json
验证: 四象限（direct/indirect/substitutes/potential）均已填充，每项标注了数据来源和置信度
模式: 🤖→👤
```

⏸ **阶段卡口**：四象限均已填充，每项标注了数据来源和置信度 → 未通过：补充已知竞品名称或检查输入数据

### 阶段4：竞品报告

#### 调用 market-competitor-report

```
Skill: market-competitor-report
输入:
  category_keywords: 用户提供（品类关键词）
  product_info: 用户提供（自身产品信息，可选）
  intel_ref: output/pm-discovery/market-competitor-intel/competitor-intel.json
  quadrant_ref: output/pm-discovery/market-competitor-quadrant/competitor-quadrant.json
  tam_som_ref: output/pm-discovery/market-tam-som/tam-som.json
  pest_ref: output/pm-discovery/market-pest/pest.json
输出: output/pm-discovery/market-competitor-report/competitor-report.md + output/pm-discovery/market-competitor-report/competitor-report.json
验证: 执行摘要包含3条核心发现+Top1策略，每个核心竞品有完整SWOT分析，差异化策略至少3条
模式: 🤖→👤
```

⏸ **阶段卡口**：执行摘要包含3条核心发现+Top1策略 → 未通过：检查上游数据是否完整

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 阶段1完成 | tam-som.json + pest.json 均已生成 | 补充品类关键词和目标市场信息或检查子Skill执行结果 |
| TAM/SAM/SOM关键假设已标注 | tam-som.json 中 key_assumptions 非空 | 补充数据重新执行market-tam-som |
| 阶段2完成 | competitor-intel.json 已生成，Feature Matrix已更新 | 检查竞品列表是否充分 |
| 竞品Feature Matrix已更新 | competitors数组中feature_matrix非空 | 补充竞品信息重新执行market-competitor-intel |
| 阶段3完成 | competitor-quadrant.json 已生成，四象限已填充 | 补充已知竞品名称或检查输入数据 |
| 差异化机会已识别 | reputation_comparison中differentiation_opportunities非空 | 补充竞品口碑数据 |
| 阶段4完成 | competitor-report.md + competitor-report.json 均已生成 | 检查上游数据是否完整 |
| 竞品分析报告执行摘要完整 | executive_summary含3条核心发现+Top1策略 | 补充上游数据重新生成报告 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| TAM/SAM/SOM关键假设验证 | market-tam-som完成 | 确认关键假设是否合理，双路径差异>20%时需人类判断 |
| 竞品战略推断验证 | market-competitor-intel完成，战略推断置信度<0.5 | 确认竞品战略方向推断是否合理 |
| 差异化策略优先级确认 | market-competitor-report完成 | 确认差异化策略的优先级排序和资源分配 |
| 报告结论与行动建议审批 | market-competitor-report完成 | 审批竞品分析报告的最终结论和行动建议 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 阶段1某子Skill失败 | 不阻塞另一子Skill，失败子Skill使用降级方案继续，标注"降级执行" |
| tam-som.json双路径差异>30% | 标注"双路径严重分歧"，升级人类判断，report中使用中性值 |
| pest.json某维度数据完全缺失 | 使用行业基准值填充，标注"推断值"，report中标注该维度数据不完整 |
| competitor-intel.json竞品列表为空 | 提示用户提供竞品列表或品类关键词，基于AI知识推断竞品，标注"竞品列表为AI推断" |
| competitor-quadrant.json某象限为空 | 标注"该象限未识别到竞品"，建议人类提供线索，report中标注象限覆盖不完整 |
| 上游数据全部缺失 | 降级为轻量版流程：用户提供品类关键词 → 基于AI知识库生成简要竞品分析报告 |

## 变更记录

- v1.0: 初始版本
- v2.0: 结构优化
- v3.0: 新增 market-competitor-report（竞品分析报告）
- v4.0: 新增子Skill执行协议，将描述性调度改为命令式可执行步骤；新增阶段执行计划含读取路径、输入输出、验证条件；新增阶段卡口表格和人类决策点表格
- v5.0: 统一阶段执行计划为表格格式，移除数据流转图
- v6.0: 核心原则重写为编排理念（动态生态系统/宏观微观交叉/并行采集串行整合/人类验证三节点）；新增异常处理表（6种异常场景）；移除通用4条执行步骤原则
- v7.0: 编排协议优化——将"读取子Skill定义并代理执行"改为"使用Skill工具显式调用子Skill"；新增Pipeline定义（YAML声明式执行图）；阶段执行计划改为调用指令格式；调度规则合并入编排协议
