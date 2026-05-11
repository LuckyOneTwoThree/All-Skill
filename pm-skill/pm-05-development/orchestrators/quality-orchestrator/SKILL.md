---
name: quality-orchestrator
description: 当需要进行自动化测试、验收检查或生成验收报告时使用。质量保障指挥官，调度子Skill：quality-auto-test（测试用例自动生成与追踪）、quality-auto-acceptance（自动化验收执行）、quality-acceptance-report（验收测试报告生成）。关键词：质量保障、自动化测试、验收检查、测试覆盖率、质量门禁、验收报告。
metadata:
  module: "产品开发与上线"
  sub-module: "质量保障"
  type: "orchestrator"
  version: "3.0"
---

# 质量保障指挥官

## 核心原则

**质量保障的本质是风险的可控释放**

质量不是测试出来的，而是通过系统化的风险管控，让每一次发布都在可控范围内。质量保障的目标是让风险可见、可度量、可决策。

## 执行步骤

1. **触发器驱动**：代码合入、Story完成、构建成功等事件自动触发质量检查，而非等待人工发起
2. **自动化验收**：验收标准前置定义，测试用例自动生成，验收执行自动化，P0/P1失败立即阻断
3. **持续部署**：质量门禁通过即具备发布条件，缩短质量验证到发布的等待时间
4. **实时复盘**：每次验收完成后即时生成质量报告，持续优化测试策略

## 子Skill执行协议

你是编排器，你的职责是按阶段调度子Skill执行。执行每个子Skill时，你必须严格遵循以下步骤：

1. **读取子Skill定义**：读取 `对应子Skill的定义文件（阶段执行计划中"读取定义"列指定的路径）` 获取该子Skill的完整执行指令
2. **按子Skill指令执行**：严格遵循子Skill SKILL.md中的执行步骤、输入规范、输出规范和质量检查
3. **输出到指定路径**：将结果写入子Skill规定的输出路径
4. **验证输出完成**：确认输出文件已生成且符合校验规则后，再进入下一阶段
5. **传递数据给下游**：将当前子Skill的输出文件路径作为下一阶段子Skill的输入来源

**重要**：不要跳过任何子Skill，不要用自身逻辑替代子Skill的执行指令。每个子Skill必须通过读取其SKILL.md来执行。

## 阶段执行计划

#### 阶段1：测试用例自动生成与追踪

| 项目 | 内容 |
|------|------|
| 子Skill名称 | quality-auto-test |
| 读取定义路径 | `.trae/skills/quality-auto-test/SKILL.md` |
| 输入 | PRD（PRD管理系统，含验收标准）、技术方案（技术方案库，含接口和数据模型）、设计稿（设计系统）、代码库（代码仓库） |
| 输出 | `output/pm-development/quality-auto-test/`（test_cases、coverage_report、code_case_mapping、unmapped_cases） |
| 验证 | Happy Path 100%覆盖，每Story边界用例≥3，所有声明异常都有用例，代码关联率≥90% |
| 执行模式 | 🤖 |
| ⏸ 阶段卡口 | 测试覆盖率≥80%：自动化测试覆盖率达到阈值，未通过则升级人工审查 |

#### 阶段2：自动化验收执行

| 项目 | 内容 |
|------|------|
| 子Skill名称 | quality-auto-acceptance |
| 读取定义路径 | `.trae/skills/quality-auto-acceptance/SKILL.md` |
| 输入 | Story验收标准（PRD，Given-When-Then格式）、测试用例（quality-auto-test输出）、测试环境配置（测试系统）、构建产物（CI/CD） |
| 输出 | `output/pm-development/quality-auto-acceptance/`（acceptance_report、failed_cases_analysis、gate_decision） |
| 验证 | P0用例通过率100%，自动化执行率≥90%，测试环境就绪，失败分析完整性 |
| 执行模式 | 🤖 |
| ⏸ 阶段卡口 | 自动化验收P0/P1全部通过：P0/P1用例全部通过，未通过则立即阻断，阻止上线 |

#### 阶段3：验收测试报告生成

| 项目 | 内容 |
|------|------|
| 子Skill名称 | quality-acceptance-report |
| 读取定义路径 | `.trae/skills/quality-acceptance-report/SKILL.md` |
| 输入 | 测试结果（output/pm-development/quality-auto-test/test-results.json）、验收标准（output/pm-development/quality-auto-acceptance/acceptance-criteria.json）、SRS文档（output/pm-design/requirements-srs/SRS-{产品名}.md）、版本号、验收范围 |
| 输出 | `output/pm-development/quality-acceptance-report/`（acceptance-report-v{版本号}.md、acceptance-report-v{版本号}.json） |
| 验证 | 验收标准逐项有结果，Must需求通过率已计算，缺陷按严重程度分类，验收结论明确，签收确认表已包含 |
| 执行模式 | 🤖→👤 |
| ⏸ 阶段卡口 | 验收报告已生成：报告结论明确，签收表完整，未通过则补充验收标准或测试数据 |

## 调度规则

- 执行子Skill前必须先读取其SKILL.md定义文件（`对应子Skill的定义文件（阶段执行计划中"读取定义"列指定的路径）`）
- 每次只执行当前阶段需要的子Skill，完成后再执行下一阶段，不要一次性执行所有子Skill
- 每个阶段完成后，将中间结果写入 `output/pm-development/{当前阶段子Skill名称}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

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
