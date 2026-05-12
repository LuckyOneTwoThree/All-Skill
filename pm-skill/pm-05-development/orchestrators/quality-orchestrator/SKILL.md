---
name: quality-orchestrator
description: 当需要进行自动化测试、验收检查或生成验收报告时使用。质量保障指挥官，调度子Skill：quality-auto-test（测试用例自动生成与追踪）、quality-auto-acceptance（自动化验收执行）、quality-acceptance-report（验收测试报告生成）。关键词：质量保障、自动化测试、验收检查、测试覆盖率、质量门禁、验收报告。
metadata:
  module: "产品开发与上线"
  sub-module: "质量保障"
  type: "orchestrator"
  version: "5.0"
---

# 质量保障指挥官

## 核心原则

**质量保障的本质是风险的可控释放**

质量不是测试出来的，而是通过系统化的风险管控，让每一次发布都在可控范围内。质量保障的目标是让风险可见、可度量、可决策。

## 编排理念

1. **测试先行，验收兜底**：测试用例生成必须在验收执行之前完成，验收报告必须在签收之前完成
2. **P0/P1一票否决**：任何P0/P1失败立即阻断，不因其他维度通过而放行
3. **风险可见化传递**：每个阶段的风险和未覆盖项必须显式传递到下游，而非隐式忽略

## 编排协议

你是编排器，职责是**按阶段调度子Skill执行**，而非代理执行子Skill逻辑。严格遵循以下协议：

### 调用规则

1. **显式调用**：使用 `Skill` 工具调用子Skill，传递输入数据，接收输出结果
2. **不代理执行**：不读取子Skill的SKILL.md来替代执行，不自行推断子Skill的内部逻辑
3. **契约驱动**：只关注子Skill的输入契约、输出契约和验证条件，不关注内部实现
4. **状态传递**：将当前阶段的输出作为下一阶段的输入，通过文件路径传递数据
5. **验证后推进**：每个阶段输出验证通过后，才推进到下一阶段
6. **阶段总结**：所有子Skill执行完成后，生成阶段总结文档，写入 `output/phase-reports/pm-development/quality-orchestrator.md`

### 上下文管理

- 每个子Skill调用完成后，只保留**输出文件路径**和**关键结论摘要**
- 详细输出写入对应模块的 `output/pm-development/{skill-name}/` 目录
- 若上下文接近上限，优先保留当前阶段内容和待执行阶段的子Skill名称

### 阶段总结

所有子Skill执行完成后，编排器必须生成一份阶段总结文档，写入 `output/phase-reports/pm-development/quality-orchestrator.md`，包含以下结构：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

## Pipeline

```yaml
pipeline:
  - stage: quality-auto-test
    gate: 测试覆盖率≥80%
  - stage: quality-auto-acceptance
    depends_on: [quality-auto-test]
    gate: 自动化验收P0/P1全部通过
  - stage: quality-acceptance-report
    depends_on: [quality-auto-test, quality-auto-acceptance]
    gate: 验收报告已生成
```

## 阶段执行计划

#### 调用 quality-auto-test

```
Skill: quality-auto-test
输入:
  prd: PRD管理系统（含验收标准）
  tech_plan: 技术方案库（含接口和数据模型）
  design: 设计系统
  code_repo: 代码仓库
输出: output/pm-development/quality-auto-test/
验证: Happy Path 100%覆盖，每Story边界用例≥3，所有声明异常都有用例，代码关联率≥90%
模式: 🤖
```

#### 调用 quality-auto-acceptance

```
Skill: quality-auto-acceptance
输入:
  story_acceptance_criteria: PRD（Given-When-Then格式）
  test_cases: quality-auto-test输出
  test_env_config: 测试系统
  build_artifact: CI/CD
输出: output/pm-development/quality-auto-acceptance/
验证: P0用例通过率100%，自动化执行率≥90%，测试环境就绪，失败分析完整性
模式: 🤖
```

#### 调用 quality-acceptance-report

```
Skill: quality-acceptance-report
输入:
  test_results: output/pm-development/quality-auto-test/test-results.json
  acceptance_criteria: output/pm-development/quality-auto-acceptance/acceptance-criteria.json
  srs_doc: output/pm-design/requirements-srs/SRS-{产品名}.md
  version: 版本号
  acceptance_scope: 验收范围
输出: output/pm-development/quality-acceptance-report/
验证: 验收标准逐项有结果，Must需求通过率已计算，缺陷按严重程度分类，验收结论明确，签收确认表已包含
模式: 🤖→👤
```

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 测试覆盖率≥80% | 自动化测试覆盖率达到阈值 | 升级人工审查 |
| 自动化验收P0/P1全部通过 | P0/P1用例全部通过 | 立即阻断，阻止上线 |
| 验收报告已生成 | 报告结论明确，签收表完整 | 补充验收标准或测试数据 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 验收标准确认 | 新Story进入验收阶段 | 确认验收标准的完整性和正确性 |
| 测试策略确认 | 自动化测试用例生成完成 | 确认测试覆盖范围和优先级 |
| P2用例失败处理 | P2用例失败但P0/P1全部通过 | 确认是否阻断发布或标记为已知问题 |
| 质量门禁例外审批 | 质量门禁未通过但需紧急上线 | 确认是否放行及补偿措施 |
| 验收报告签收 | 验收报告生成完成 | 确认验收结论并签收 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 输入缺失 | 阻塞Pipeline并请求补全 |
| 测试环境不可用 | 等待重试，最多3次 |
| 测试执行超时 | 标记为失败，生成超时报告 |
| 覆盖率不达标 | 升级人工审查 |
| P0/P1用例失败 | 立即阻断，发送告警 |

## 变更记录

- v1.0: 初始版本
- v2.0: 新增 quality-acceptance-report（验收报告）
- v3.0: 优化为子Skill执行协议+阶段执行计划模式，增加子Skill定义读取路径和输入输出规范，调度规则从"加载"改为"执行"
- v4.0: 执行步骤原则替换为编排理念
- v5.0: 编排协议优化——将"读取子Skill定义并代理执行"改为"使用Skill工具显式调用子Skill"；新增Pipeline定义（YAML声明式执行图）；阶段执行计划改为调用指令格式；调度规则合并入编排协议
