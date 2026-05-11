---
name: architecture-decision-record
description: 当需要记录重要的架构或技术决策时使用。架构决策记录(ADR)自动生成，包含决策背景、备选方案评估、决策结果、影响分析和决策回顾机制。关键词：架构决策、ADR、技术决策、决策记录、Architecture Decision Record、方案评估。
metadata:
  module: "产品开发与上线"
  sub-module: "开发交付"
  type: "pipeline"
  version: "2.0"
  interaction_mode: "ai_suggest_human_approve"
---

# 架构决策记录(ADR)生成

## 核心原则

**重要的决策值得被记录，记录的决策值得被回顾**

架构决策记录(ADR)的核心价值在于让技术决策过程透明化、可追溯。当6个月后有人问"为什么用Redis而不是Memcached"时，ADR能给出当时的上下文、考量和权衡，而非依赖记忆或猜测。

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 来源 | 必需 | 说明 |
|--------|------|------|------|
| 决策背景 | 用户提供 | ✅ | 需要决策的问题、约束条件 |
| 备选方案 | 用户提供 | ⬜ | 已知的备选技术/方案 |
| 约束条件 | 用户提供 | ⬜ | 技术约束、团队约束、时间约束 |

### 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 无决策背景 | 无法生成，要求用户提供决策问题 | - |
| 无备选方案 | 基于决策背景推导常见备选方案，标注"待方案补充" | 备选方案可能不全面 |
| 无约束条件 | 基于行业通用约束评估，标注"约束待确认" | 约束条件可能不精确 |

## 执行步骤

### Step 1：决策背景梳理

清晰描述触发此决策的背景：

1. **问题陈述**：需要解决什么问题或做什么决策
2. **决策驱动因素**：
   - 技术驱动：性能瓶颈、可扩展性需求、技术债
   - 业务驱动：新功能需求、合规要求、成本优化
   - 团队驱动：技能匹配、招聘难度、组织架构
3. **约束条件**：
   - 技术约束：现有技术栈、集成要求、性能指标
   - 资源约束：团队规模、时间窗口、预算
   - 组织约束：合规要求、安全策略、供应商锁定

### Step 2：备选方案评估

对每个备选方案进行结构化评估：

1. **方案描述**：每个备选方案的核心思路
2. **评估维度**：
   - 功能适配度：满足需求的程度
   - 性能表现：吞吐量/延迟/资源消耗
   - 可扩展性：水平/垂直扩展能力
   - 可维护性：代码复杂度/社区活跃度/文档质量
   - 团队适配度：学习曲线/招聘难度
   - 成本：开发成本/运维成本/许可费用
   - 风险：技术风险/供应商风险/迁移风险
3. **评分矩阵**：各方案在各维度的评分（1-5分）
4. **优劣势总结**：每个方案的核心优势和劣势

### Step 3：决策结果

记录最终决策及其理由：

1. **决策结论**：选择的方案
2. **决策理由**：为什么选择此方案（引用评估矩阵数据）
3. **权衡取舍**：接受了哪些劣势，换取了哪些优势
4. **决策条件**：此决策成立的前提条件

### Step 4：影响分析

分析此决策的影响范围：

1. **系统影响**：
   - 受影响的系统/模块
   - 需要修改的接口/数据流
   - 迁移路径和步骤
2. **团队影响**：
   - 需要学习的技能
   - 团队结构调整
   - 培训需求
3. **运维影响**：
   - 基础设施变更
   - 监控/告警调整
   - 故障排查流程变更
4. **成本影响**：
   - 一次性投入
   - 持续运营成本变化

### Step 5：决策回顾机制

定义此决策的回顾机制：

1. **回顾触发条件**：
   - 决策前提条件发生变化
   - 出现新的备选方案
   - 决策导致的负面影响超过阈值
2. **回顾周期**：定期回顾的时间间隔
3. **回顾指标**：用于评估决策有效性的量化指标
4. **逆转成本**：推翻此决策的预估成本

### Step 6：报告组装

将以上内容组装为完整ADR文档。

## 输出

### 输出文件

| 文件 | 路径 | 说明 |
|------|------|------|
| ADR文档 | `output/pm-development/architecture-decision-record/ADR-{NNNN}-{slug}.md` | 人类可读的完整ADR |
| 结构化数据 | `output/pm-development/architecture-decision-record/adr-index.json` | 所有ADR的索引文件 |

**输出Schema**：

```json
{
  "type": "object",
  "required": ["adr_id", "title", "status", "date", "context", "decision"],
  "properties": {
    "adr_id": {"type": "string", "description": "架构决策唯一标识"},
    "title": {"type": "string", "description": "决策标题"},
    "status": {"type": "string", "description": "决策状态：proposed/accepted/deprecated/superseded"},
    "date": {"type": "string", "description": "决策日期"},
    "context": {"type": "object", "description": "决策背景，包含问题、驱动因素和约束条件"},
    "alternatives": {"type": "array", "description": "备选方案列表，包含描述、评分和优劣势"},
    "decision": {"type": "object", "description": "决策结果，包含选择方案、理由和权衡"},
    "impact": {"type": "object", "description": "影响分析，包含系统/团队/运维/成本影响"},
    "review": {"type": "object", "description": "回顾机制，包含触发条件、周期和指标"}
  }
}
```

### Markdown 报告结构

```markdown
# ADR-{NNNN}: {决策标题}

## 状态
提议 | 已接受 | 已废弃 | 已取代（被ADR-xxxx取代）

## 日期
{决策日期}

## 决策背景
- 问题陈述
- 决策驱动因素
- 约束条件

## 备选方案评估
### 方案A：{名称}
- 描述 / 评分 / 优势 / 劣势

### 方案B：{名称}
- 描述 / 评分 / 优势 / 劣势

### 评分矩阵
| 维度 | 方案A | 方案B | 方案C |

## 决策结果
- 选择方案
- 决策理由
- 权衡取舍
- 决策前提条件

## 影响分析
- 系统影响
- 团队影响
- 运维影响
- 成本影响

## 回顾机制
- 回顾触发条件
- 回顾周期
- 回顾指标
- 逆转成本
```

### JSON 结构

```json
{
  "adr_id": "ADR-0001",
  "title": "",
  "status": "proposed|accepted|deprecated|superseded",
  "date": "",
  "context": {
    "problem": "",
    "drivers": [],
    "constraints": []
  },
  "alternatives": [
    {
      "name": "",
      "description": "",
      "scores": {},
      "pros": [],
      "cons": []
    }
  ],
  "decision": {
    "chosen": "",
    "rationale": "",
    "tradeoffs": "",
    "prerequisites": []
  },
  "impact": {
    "system": [],
    "team": [],
    "operations": [],
    "cost": []
  },
  "review": {
    "trigger_conditions": [],
    "review_cycle": "",
    "metrics": [],
    "reversal_cost": ""
  }
}
```

## 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| adr_records | array | 是 | ADR记录列表，至少1条 |
| adr_records[].id | string | 是 | ADR编号，格式ADR-NNN |
| adr_records[].title | string | 是 | 决策标题 |
| adr_records[].status | string | 是 | 状态，枚举值：proposed/accepted/deprecated/superseded |
| adr_records[].context | string | 是 | 决策背景 |
| adr_records[].alternatives | array | 是 | 备选方案列表，至少2个 |
| adr_records[].alternatives[].name | string | 是 | 方案名称 |
| adr_records[].alternatives[].pros | array | 是 | 优势列表 |
| adr_records[].alternatives[].cons | array | 是 | 劣势列表 |
| adr_records[].decision | string | 是 | 最终决策及理由 |
| adr_records[].consequences | object | 是 | 决策后果 |
| adr_records[].consequences.positive | array | 是 | 正面后果 |
| adr_records[].consequences.negative | array | 是 | 负面后果 |
| adr_records[].compliance_check | object | 是 | 合规校验结果 |

## 上游变更响应

当上游输入发生变更时，本Skill的响应策略：

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| PRD功能变更 | ADR的决策背景和备选方案 | 重新评估相关ADR的决策背景，标记需人类确认是否需要新增ADR |
| 技术架构变更 | ADR的备选方案和决策理由 | 更新受影响ADR的备选方案评估，标记需人类确认 |
| 安全需求变更 | ADR的合规校验 | 重新执行合规校验，更新consequences |
| 团队技术栈变更 | ADR的备选方案 | 重新评估备选方案的可行性，标记需人类确认 |

当ADR自身变更时，对下游的通知机制：

| ADR变更类型 | 通知范围 | 通知方式 |
|-------------|----------|----------|
| ADR状态变更 | development-task-breakdown | 标记ADR状态变更，触发任务拆解评估 |
| ADR决策修改 | development-auto-review | 标记决策修改，触发代码审查规则更新 |
| ADR废弃 | 全部下游 | 标记ADR废弃，触发影响评估 |

---

## 质量检查

| 检查项 | 标准 | 不通过处理 |
|--------|------|------------|
| 决策背景清晰 | 问题陈述无歧义，驱动因素和约束已列出 | 补充背景信息 |
| 备选方案≥2 | 至少评估2个备选方案 | 补充备选方案 |
| 评分有依据 | 每个评分有具体理由 | 补充评分依据 |
| 影响分析完整 | 系统/团队/运维/成本4维度 | 补充缺失维度 |
