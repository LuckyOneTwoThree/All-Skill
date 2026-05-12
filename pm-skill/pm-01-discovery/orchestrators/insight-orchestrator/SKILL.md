---
name: insight-orchestrator
description: 当需要执行完整的需求分析流程时使用。需求洞察指挥官，按阶段调度子Skill执行，包括insight-jtbd、insight-requirement-layers、insight-5whys、insight-kano、insight-priority-scoring。关键词：需求分析流程、需求洞察编排、需求优先级全流程、JTBD、5Whys、KANO、优先级评分。
metadata:
  module: "产品探索与发现"
  sub-module: "需求洞察"
  type: "orchestrator"
  version: "6.0"
---

# 需求洞察指挥官

## 核心原则

1. **需求≠问题**——用户描述的是解决方案不是问题本身，编排器确保先拆解（requirement-layers）再分析（jtbd/5whys），避免停留在表面需求
2. **多维度交叉验证**——JTBD+需求三层+5Whys+KANO四维交叉，单一维度结论不可信，编排器确保各维度数据汇合后才输出最终优先级
3. **串行依赖并行独立**——有数据依赖的步骤串行（5whys依赖jtbd），无依赖的步骤并行（jtbd与requirement-layers可并行），缩短整体周期
4. **人类决策不可替代**——情感诉求验证、KANO边界判定、优先级权重确认必须人类参与，编排器在每个阶段卡口设置人类决策点

## 编排协议

你是编排器，职责是**按阶段调度子Skill执行**，而非代理执行子Skill逻辑。严格遵循以下协议：

### 调用规则

1. **显式调用**：使用 `Skill` 工具调用子Skill，传递输入数据，接收输出结果
2. **不代理执行**：不读取子Skill的SKILL.md来替代执行，不自行推断子Skill的内部逻辑
3. **契约驱动**：只关注子Skill的输入契约、输出契约和验证条件，不关注内部实现
4. **状态传递**：将当前阶段的输出作为下一阶段的输入，通过文件路径传递数据
5. **验证后推进**：每个阶段输出验证通过后，才推进到下一阶段
6. **阶段总结**：所有子Skill执行完成后，生成阶段总结文档，写入 `output/phase-reports/pm-discovery/insight-orchestrator.md`

### 上下文管理

- 每个子Skill调用完成后，只保留**输出文件路径**和**关键结论摘要**
- 详细输出写入 `output/pm-discovery/{skill-name}/` 目录
- 若上下文接近上限，优先保留当前阶段内容和待执行阶段的子Skill名称

### 阶段总结

所有子Skill执行完成后，编排器必须生成一份阶段总结文档，写入 `output/phase-reports/pm-discovery/insight-orchestrator.md`，包含以下结构：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

## Pipeline 定义

```yaml
pipeline: insight-orchestrator
version: 6.0

stages:
  - id: phase-1
    name: "并行洞察"
    parallel: true
    skills:
      - insight-jtbd
      - insight-requirement-layers
    gate:
      condition: "jtbd.json + requirement-layers.json 均已生成且验证通过"
      fail_action: "补充输入数据或检查子Skill执行结果"

  - id: phase-2
    name: "根因深挖"
    depends_on: [phase-1]
    skills: [insight-5whys]
    gate:
      condition: "chains和root_cause字段非空"
      fail_action: "检查输入数据是否充分"

  - id: phase-3
    name: "需求分类"
    depends_on: [phase-1]
    skills: [insight-kano]
    gate:
      condition: "kano_classification字段非空，边界情况已标注"
      fail_action: "边界情况升级人类判定"

  - id: phase-4
    name: "优先级评分"
    depends_on: [phase-1, phase-2, phase-3]
    skills: [insight-priority-scoring]
    gate:
      condition: "priority_list和total_score字段非空，score_confidence已标注"
      fail_action: "优先级权重需人类确认"
```

## 阶段执行计划

### 阶段1：并行洞察

**并行调用** `insight-jtbd` + `insight-requirement-layers`

#### 调用 insight-jtbd

```
Skill: insight-jtbd
输入:
  user_feedback: 用户提供 或 output/pm-discovery/user-research-voice-analysis/voice-analysis.json
  behavior_data: 用户提供 或 output/pm-discovery/user-research-behavior-analysis/behavior-analysis.json
输出: output/pm-discovery/insight-jtbd/jtbd.json
验证: jobs数组非空，三层Job（functional/emotional/social）均已提取
模式: 🤖→👤
```

#### 调用 insight-requirement-layers

```
Skill: insight-requirement-layers
输入:
  requirements: 用户提供 或 output/pm-discovery/user-research-voice-analysis/voice-analysis.json
输出: output/pm-discovery/insight-requirement-layers/requirement-layers.json
验证: requirement_layers数组非空，三层（surface/behavioral/essential）均已拆解
模式: 🤖→👤
```

⏸ **阶段卡口**：`jtbd.json` + `requirement-layers.json` 均已生成且验证通过 → 未通过：补充输入数据或检查子Skill执行结果

### 阶段2：根因深挖

**顺序调用** `insight-5whys`（依赖阶段1的 jtbd 输出）

```
Skill: insight-5whys
输入:
  jobs: output/pm-discovery/insight-jtbd/jtbd.json
输出: output/pm-discovery/insight-5whys/5whys.json
验证: chains和root_cause字段非空，actionable_fix含effort/impact
模式: 🤖→👤
```

⏸ **阶段卡口**：chains和root_cause字段非空 → 未通过：检查输入数据是否充分

### 阶段3：需求分类

**顺序调用** `insight-kano`（依赖阶段1的 requirement-layers 输出）

```
Skill: insight-kano
输入:
  voice_analysis: output/pm-discovery/user-research-voice-analysis/voice-analysis.json
  requirement_layers: output/pm-discovery/insight-requirement-layers/requirement-layers.json
输出: output/pm-discovery/insight-kano/kano.json
验证: kano_classification字段非空，边界情况已标注
模式: 🤖→👤
```

⏸ **阶段卡口**：kano_classification字段非空，边界情况已标注 → 未通过：边界情况升级人类判定

### 阶段4：优先级评分

**顺序调用** `insight-priority-scoring`（汇聚阶段1-3全部输出）

```
Skill: insight-priority-scoring
输入:
  requirement_layers: output/pm-discovery/insight-requirement-layers/requirement-layers.json
  kano: output/pm-discovery/insight-kano/kano.json
  jtbd: output/pm-discovery/insight-jtbd/jtbd.json
  whys: output/pm-discovery/insight-5whys/5whys.json
输出: output/pm-discovery/insight-priority-scoring/priority-scoring.json
验证: priority_list和total_score字段非空，score_confidence已标注，base_score和kano_bonus分别计算
模式: 🤖→👤（优先级权重需人类确认）
```

⏸ **阶段卡口**：priority_list和total_score字段非空，score_confidence已标注 → 未通过：优先级权重需人类确认

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 阶段1完成 | jtbd.json + requirement-layers.json 均已生成 | 补充输入数据或检查子Skill执行结果 |
| JTBD三层Job已提取 | functional/emotional/social Job均存在 | 补充数据重新调用insight-jtbd |
| 阶段2完成 | 5whys.json 已生成，root_cause非空 | 检查输入数据是否充分 |
| 阶段3完成 | kano.json 已生成，分类完成 | 边界情况升级人类判定 |
| 阶段4完成 | priority-scoring.json 已生成 | 优先级权重需人类确认 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| Emotional/Social Job验证 | insight-jtbd完成 | 确认情感和社会诉求推断是否合理 |
| KANO边界判定 | insight-kano完成 | 确认边界情况的分类归属 |
| 优先级权重确认 | insight-priority-scoring完成 | 确认评分权重和最终优先级排序 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 阶段1某子Skill失败 | 不阻塞另一子Skill，失败子Skill使用降级方案继续，标注"降级执行" |
| jtbd.json无Functional Job | 跳过阶段2（5whys依赖Functional Job），直接进入阶段3（kano不依赖jtbd） |
| 5whys.json根因为空 | 标注"根因未定位"，阶段4中痛点强度维度使用默认值，score_confidence降级 |
| kano.json全部为边界情况 | 全部升级人类判定，阶段4暂缓执行直到KANO分类确认 |
| priority-scoring权重未确认 | 输出评分结果但标注"权重待确认"，建议人类确认后再进入下游编排器 |
| 上游数据全部缺失 | 降级为轻量版流程：用户口述需求 → 调用insight-requirement-layers拆解 → 基于描述评分 |

## 变更记录

- v1.0: 初始版本
- v2.0: description触发词优化
- v3.0: 新增子Skill执行协议，将描述性调度改为命令式可执行步骤；新增阶段执行计划含读取路径、输入输出、验证条件；新增阶段卡口表格
- v4.0: 统一阶段执行计划为表格格式，移除数据流转图
- v5.0: 核心原则重写为编排理念；新增异常处理表；阶段2验证条件更新为chains（支持多路径）；阶段4验证条件新增base_score/kano_bonus
- v6.0: 编排协议优化——将"读取子Skill定义并代理执行"改为"使用Skill工具显式调用子Skill"；新增Pipeline定义（YAML声明式执行图）；阶段执行计划改为调用指令格式；调度规则简化为编排协议
