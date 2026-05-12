---
name: {domain}-{sub-module}-orchestrator
description: 当需要执行完整的{子模块}流程时使用。{子模块}指挥官，按阶段调度子Skill执行，包括{子Skill列表}。关键词：{关键词1}、{关键词2}、{关键词3}。
metadata:
  module: "{所属模块中文名}"
  sub-module: "{所属子模块中文名}"
  type: "orchestrator"
  version: "1.0"
---

# {子模块}指挥官

## 核心原则

{1-2句话概括本编排器的核心理念}

1. **{原则1名称}**——{原则1说明}
2. **{原则2名称}**——{原则2说明}
3. **{原则3名称}**——{原则3说明}

## 编排协议

你是编排器，职责是**按阶段调度子Skill执行**，而非代理执行子Skill逻辑。严格遵循以下协议：

### 调用规则

1. **显式调用**：使用 `Skill` 工具调用子Skill，传递输入数据，接收输出结果
2. **不代理执行**：不读取子Skill的SKILL.md来替代执行，不自行推断子Skill的内部逻辑
3. **契约驱动**：只关注子Skill的输入契约、输出契约和验证条件，不关注内部实现
4. **状态传递**：将当前阶段的输出作为下一阶段的输入，通过文件路径传递数据
5. **验证后推进**：每个阶段输出验证通过后，才推进到下一阶段
6. **阶段总结**：所有子Skill执行完成后，生成阶段总结文档，写入 `output/phase-reports/{module}/{orchestrator-name}.md`

### 上下文管理

- 每个子Skill调用完成后，只保留**输出文件路径**和**关键结论摘要**
- 详细输出写入 `output/{领域路径}/{skill-name}/` 目录
- 若上下文接近上限，优先保留当前阶段内容和待执行阶段的子Skill名称

### 阶段总结

所有子Skill执行完成后，编排器必须生成一份阶段总结文档，写入 `output/phase-reports/{module}/{orchestrator-name}.md`，包含以下结构：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

## Pipeline 定义

```yaml
pipeline: {orchestrator-name}
version: 1.0

stages:
  - id: phase-1
    name: "{阶段1业务名称}"
    parallel: true  # 如果有并行子Skill则设为true
    skills:
      - {skill-name-a}
      - {skill-name-b}
    gate:
      condition: "{卡口条件}"
      fail_action: "{未通过处理}"

  - id: phase-2
    name: "{阶段2业务名称}"
    depends_on: [phase-1]
    skills: [{skill-name-c}]
    gate:
      condition: "{卡口条件}"
      fail_action: "{未通过处理}"
```

## 阶段执行计划

### 阶段1：{业务名称}

**并行调用** `{skill-name-a}` + `{skill-name-b}`

#### 调用 {skill-name-a}

```
Skill: {skill-name-a}
输入:
  {field1}: {value1}
  {field2}: {value2}
输出: output/{领域路径}/{skill-name-a}/{output-file}
验证: {验证条件}
模式: 🤖→👤
```

#### 调用 {skill-name-b}

```
Skill: {skill-name-b}
输入:
  {field1}: {value1}
输出: output/{领域路径}/{skill-name-b}/{output-file}
验证: {验证条件}
模式: 🤖
```

⏸ **阶段卡口**：{卡口条件} → 未通过：{处理方式}

### 阶段2：{业务名称}

**顺序调用** `{skill-name-c}`（依赖阶段1输出）

```
Skill: {skill-name-c}
输入:
  {field1}: output/{领域路径}/{skill-name-a}/{output-file}
输出: output/{领域路径}/{skill-name-c}/{output-file}
验证: {验证条件}
模式: 🤖→👤
```

⏸ **阶段卡口**：{卡口条件} → 未通过：{处理方式}

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| {卡口名称} | {条件} | {处理方式} |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| {决策点} | {触发条件} | {决策内容} |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 阶段某子Skill失败 | {处理策略} |
| 上游数据缺失 | {处理策略} |
| 关键决策点未获人类确认 | 暂停编排，输出待确认事项清单，等待人类确认后继续 |

## 变更记录

- v1.0: 初始版本
