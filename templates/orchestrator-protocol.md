# 编排器共享协议

> 本文件定义所有编排器统一遵循的编排协议。各编排器SKILL.md通过引用方式使用，避免重复维护。

## 编排协议

你是编排器，职责是**按阶段调度子Skill执行**，而非代理执行子Skill逻辑。严格遵循以下协议：

### 调用规则

1. **双模式调用**：平台支持 Skill 工具时，显式调用子Skill；平台不支持时，按子Skill的 `name`、输入契约、输出契约和阶段卡口执行兼容调度。
2. **不代理扩写**：兼容调度时不得把子Skill内部方法论复制进编排器上下文，也不得改写子Skill逻辑；只传递必要输入、输出路径和验证条件。
3. **契约驱动**：只关注子Skill的输入契约、输出契约和验证条件，不关注内部实现细节。
4. **状态传递**：将当前阶段的输出作为下一阶段的输入，通过文件路径和 artifact index 传递数据。
5. **验证后推进**：每个阶段输出验证通过后，才推进到下一阶段。
6. **阶段总结（强制）**：Pipeline 所有 stages 执行完成后，**必须立即**执行 `post_pipeline` 中定义的阶段总结动作，生成总结文档。这不是可选步骤，若未生成阶段总结，编排器执行视为未完成。
7. **跨子Skill交叉验证**：当多个子Skill的产出之间存在一致性约束时，编排器可在阶段间执行交叉验证（读取多份产出比对一致性），这属于编排器的协调职责而非代理执行子Skill逻辑。交叉验证规则在编排器SKILL.md中显式定义。

### 上下文管理

- 每个子Skill调用完成后，只保留**输出文件路径**和**关键结论摘要**
- 详细输出写入 `output/{领域路径}/{skill-name}/` 目录
- 若上下文接近上限，优先保留当前阶段内容和待执行阶段的子Skill名称
- 跨领域编排器不搬运子Skill全文；只维护 `artifact-index.json` 中的产物引用，按需读取直接下游需要的文件。

### 产物路径与索引

- 子Skill始终写入自己的领域原生输出路径，例如 `output/pm-design/`、`output/ui-frontend/`、`output/backend-api-design/`。
- 跨领域编排器只生成汇总产物：`output/cross-domain/artifact-index.json` 与 `output/phase-reports/cross-domain/{orchestrator-name}.md`。
- `artifact-index.json` 记录阶段、skill、真实输出路径、摘要和验证状态，作为跨领域传递的唯一索引；不得要求子Skill改写到 `output/cross-domain/{skill-name}/`。

### 人类审批记录

关键人类决策点应输出轻量审批记录，路径为 `output/approvals/{orchestrator-name}/{stage-id}.approval.json`：

```json
{
  "approval_id": "string",
  "stage": "string",
  "decision_required": "string",
  "recommended_option": "approve",
  "options": ["approve", "revise", "reject"],
  "risks": [],
  "status": "pending | approved | rejected",
  "decided_by": "human",
  "decided_at": "ISO8601"
}
```

### 阶段总结

所有子Skill执行完成后，编排器必须生成一份阶段总结文档，写入 `output/phase-reports/{module}/{orchestrator-name}.md`，包含以下结构：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器。结构包含三层：
   - **primary**（1个）：最推荐的下游编排器，必须是编排流skill，不能指向自身
   - **alternatives**（2-3个）：备选下游编排器，优先编排流skill，condition 采用[触发场景]+[判断依据]格式
   - **special_cases**（0-1个）：特殊情况推荐子Skill（非编排流），condition 必须注明"无需完整编排流"

### 阶段卡口统一标准

编排器的阶段卡口应只校验以下3类条件，不深入子Skill内部字段：

| 卡口类型 | 校验内容 | 示例 |
|----------|----------|------|
| 输出存在性 | 输出文件已生成且非空 | "insight-analysis输出文件已生成" |
| 顶层结构完整性 | JSON顶层必填字段存在 | "prd.json包含features/pages/entities/user_flows" |
| 人类决策确认 | 关键决策点已获人类确认 | "PRD人类确认通过" |

子Skill内部字段级别的校验（如"JTBD三层Job已提取""Feature Matrix已更新"）应在子Skill自身的质量检查中完成，编排器不关心。

### 阶段总结执行指令（post_pipeline）

所有业务阶段执行完成后，**必须立即**生成阶段总结文档：

```
动作: 生成阶段总结
输入:
  所有子Skill输出: output/{领域路径}/
  人类决策记录: 本轮执行中的人类决策点及结果
输出: output/phase-reports/{module}/{orchestrator-name}.md
验证: 阶段总结文档已生成，6项结构（执行概览/关键发现/决策记录/产出清单/风险与待办/下游衔接）均非空
下游衔接: （按本协议「下游衔接」三层结构定义）
模式: 🤖
```

⏸ **阶段卡口**：阶段总结文档已生成且6项结构均非空 → 未通过：补充缺失结构项后重新生成

各编排器在SKILL.md中仅需提供以下参数化信息，执行指令本体遵循本协议：

```markdown
### 阶段总结（post_pipeline）

遵循 [orchestrator-protocol.md](相对路径) 阶段总结协议。

| 参数 | 值 |
|------|-----|
| 子Skill输出路径 | output/{领域路径}/ |
| 总结输出路径 | output/phase-reports/{module}/{orchestrator-name}.md |

下游衔接:
  primary: {目标编排器}（{原因}）
  alternatives: {备选编排器列表}
  special_cases: {特殊情况}
```

### 通用异常处理条目

以下异常处理条目适用于所有编排器，各编排器无需重复定义：

| 异常类型 | 处理策略 |
|----------|----------|
| 阶段总结生成失败 | 基于已完成的子Skill输出生成部分总结，缺失项标注"数据缺失"，不阻塞编排完成 |
| 关键决策点未获人类确认 | 暂停编排，输出待确认事项清单，等待人类确认后继续 |
| 上游数据缺失 | 标注缺失数据项，使用合理假设填充（标注置信度≤0.3），继续执行并在输出中高亮标注 |
| 所有上游数据全部缺失 | 标注"全数据缺失"状态，输出最小化模板（仅含元信息和空结构），整体置信度设为0.3，强制人类确认是否继续。人类确认后基于用户提供信息和AI知识库推断生成，所有推断内容标注confidence≤0.5和needs_human_validation:true |

### 通用阶段卡口条目

以下卡口条目适用于所有编排器，各编排器无需重复定义：

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 阶段总结已生成 | output/phase-reports/{module}/{orchestrator-name}.md 已生成且6项结构均非空 | 补充缺失结构项后重新生成 |
