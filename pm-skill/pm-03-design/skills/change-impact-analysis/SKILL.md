---
name: change-impact-analysis
description: 当需要分析PRD变更、设计变更或需求变更影响范围时使用。变更影响自动分析，分析需求变更对功能、IA、用户流程、原型、交互规范等维度的影响范围，生成变更影响报告和重评审建议。关键词：变更影响、需求变更、影响分析、变更评审、PRD变更。
metadata:
  module: "产品构思与设计"
  sub-module: "设计评审"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["互联网", "通用"]
  trigger_examples:
    - "需求改了，看看影响范围"
    - "分析一下这个变更会影响哪些模块"
    - "改需求了帮我评估一下影响"
  interaction_mode: "ai_suggest_human_approve"
execution_depth:
  default: standard
  quick_description: "执行变更分类（L1-L4）和功能影响分析，输出变更级别与重评审必要性判断"
  deep_description: "额外包含原型/交互规范两维度影响分析、版本联动更新建议、设计规范一致性评估、设计重做清单"
---

# 需求变更影响分析自动化

## 核心原则

1. **PRD变更驱动**：由 design-orchestrator 在 PRD 变更时触发，而非人工发起
2. **自动化验收**：变更分类、影响传播分析、重评审判断全流程自动化
3. **结果同步**：分析结果同步到下游设计Skill（IA/用户流程/原型/交互规范），保持发布节奏
4. **实时复盘**：变更影响分析完成后即时生成版本联动建议

## 交互模式

🤖→👤 **AI建议人类审批**

触发条件：design-orchestrator 在 PRD 变更时触发。

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 变更请求 | JSON | 是 | 用户提供（PRD变更内容） | 待分析的变更内容 |
| 当前PRD | JSON | 是 | output/pm-design/design-prd/prd.json | 当前生效的PRD版本 |
| 当前IA | JSON | 是 | output/pm-design/design-ia/ia_proposals.json | 当前信息架构方案 |
| 当前用户流程 | JSON | 是 | output/pm-design/design-userflow/userflow.json | 当前用户流程设计 |
| 当前原型 | JSON | 是 | output/pm-design/design-prototype/prototype_spec.json | 当前原型设计规范 |
| 当前交互规范 | JSON | ○ | output/pm-design/interaction-spec/interaction-spec.json | 当前交互设计规范，评估变更对交互状态机的影响 |

### 变更请求结构示例

```json
{
  "change_id": "CR_2024_001",
  "title": "登录流程增加微信登录",
  "requester": "product_manager_zhang",
  "created_at": "ISO8601",
  "change_type": "functional",
  "description": "在现有手机号登录基础上增加微信授权登录方式",
  "affected_scope": ["登录模块", "用户中心"],
  "proposed_solution": "引入微信OpenID授权机制",
  "priority": "high",
  "expected_completion": "2024-02-01"
}
```

## 执行步骤

### Step 1: 变更分类（L1-L4） [核心]

#### 分类维度

| 级别 | 变更类型 | 影响范围 | 决策层级 |
|------|----------|----------|----------|
| L1 轻微 | 文字修正、样式调整、文案优化 | 单个小功能 | 开发者自决策 |
| L2 一般 | 功能细节调整、交互优化、非核心逻辑变更 | 单个功能模块 | 产品经理审批 |
| L3 重大 | 核心功能变更、IA结构变更、用户流程重构 | 多个功能模块 | 多角色评审 |
| L4 战略 | 架构变更、商业模式变更、跨系统影响 | 全局或跨系统 | 战略级评审 |

#### 分类决策树

```
变更请求
    │
    ├─ 是否影响核心业务流程？ ──是──→ L3
    │
    ├─ 是否改变IA结构？ ──是──→ L3
    │
    ├─ 是否影响用户流程？ ──是──→ L3
    │
    ├─ 是否影响多个功能模块？ ──是──→ L2
    │
    └─ 其他 ──→ L1
```

#### 分类输出

```json
{
  "classification": {
    "level": "L3",
    "level_description": "重大变更",
    "reasons": [
      "核心登录流程发生重大变化",
      "需要新增微信授权服务依赖"
    ],
    "confidence": 0.92
  }
}
```

### Step 2: 影响传播分析 [核心]

#### 2.1 功能影响分析

**分析内容**：

| 分析项 | 输出 |
|--------|------|
| 直接影响功能 | 受变更直接影响的PRD功能点 |
| 间接影响功能 | 受直接功能影响的关联功能 |
| 依赖该功能的功能 | 上游功能是否受影响 |

**功能影响矩阵**：

```json
{
  "functional_impact": {
    "directly_affected": [
      {"feature_id": "F001", "feature_name": "手机号登录", "impact_type": "modified"}
    ],
    "indirectly_affected": [
      {"feature_id": "F002", "feature_name": "用户注册", "impact_type": "needs_regression"},
      {"feature_id": "F003", "feature_name": "第三方绑定", "impact_type": "needs_regression"}
    ],
    "dependent_features": [
      {"feature_id": "F004", "feature_name": "订单创建", "reason": "依赖用户登录态"}
    ]
  }
}
```

#### 2.2 IA影响分析 [条件]

**分析内容**：

| 分析项 | 输出 |
|--------|------|
| 直接影响IA节点 | 受变更直接影响的IA节点 |
| IA结构变更 | 需要新增/修改/删除的IA节点 |
| 导航路径影响 | 受影响的导航路径 |

**IA影响矩阵**：

```json
{
  "ia_impact": {
    "directly_affected_nodes": [
      {"node_id": "IA001", "node_name": "用户中心", "impact_type": "modified"}
    ],
    "structure_changes": [
      {"node_id": "IA002", "node_name": "登录方式", "change_type": "add", "parent": "用户中心"}
    ],
    "navigation_path_impact": [
      {"path": "首页→登录→微信授权", "change_type": "new"}
    ]
  }
}
```

#### 2.3 用户流程影响分析 [条件]

**分析内容**：

| 分析项 | 输出 |
|--------|------|
| 直接影响流程 | 受变更直接影响的用户流程 |
| 流程节点变更 | 需要新增/修改/删除的流程节点 |
| 死胡同风险 | 变更是否引入新的死胡同 |

**用户流程影响矩阵**：

```json
{
  "userflow_impact": {
    "directly_affected_flows": [
      {"flow_id": "UF001", "flow_name": "登录流程", "impact_type": "modified"}
    ],
    "node_changes": [
      {"node_id": "UF001_N3", "node_name": "微信授权", "change_type": "add"}
    ],
    "dead_end_risks": [
      {"risk": "微信未绑定用户无退出路径", "severity": "high"}
    ]
  }
}
```

#### 2.4 原型影响分析 [深度]

**分析内容**：

| 分析项 | 输出 |
|--------|------|
| 受影响页面 | 需要修改的原型页面 |
| 组件变更 | 需要新增/修改的组件 |
| 设计规范一致性 | 变更对设计规范一致性的影响 |

**原型影响矩阵**：

```json
{
  "prototype_impact": {
    "affected_pages": [
      {"page_id": "P001", "page_name": "登录页", "change_type": "modify"}
    ],
    "component_changes": [
      {"component": "WechatLoginButton", "change_type": "new"}
    ],
    "design_consistency": {
      "consistency_score_before": 0.92,
      "consistency_score_after": 0.85,
      "violations": ["新增按钮未遵循设计令牌规范"]
    }
  }
}
```

#### 2.5 交互规范影响分析 [深度]

**分析内容**：

| 分析项 | 输出 |
|--------|------|
| 受影响交互状态 | 需要修改的交互状态机 |
| 动效变更 | 需要新增/修改的动效 |
| 手势规范变更 | 需要新增/修改的手势规范 |

**交互规范影响矩阵**：

```json
{
  "interaction_spec_impact": {
    "affected_states": [
      {"state": "loading", "scenario": "微信授权中", "change_type": "add"}
    ],
    "animation_changes": [
      {"animation": "wechat_auth_loading", "change_type": "new"}
    ],
    "gesture_changes": []
  }
}
```

### Step 3: 重评审必要性判断 [核心]

#### 评审触发规则

**决策矩阵**：

| 变更级别 | 涉及角色变化 | 假设变化 | 重评审必要性 |
|----------|--------------|----------|--------------|
| L4 | 任意 | 任意 | **必须重评审** |
| L3 | 任意 | 是 | **必须重评审** |
| L3 | 是 | 否 | **必须重评审** |
| L3 | 否 | 否 | 建议评审 |
| L2 | 是 | 是 | 建议评审 |
| L2 | 其他 | - | 可选评审 |
| L1 | - | - | 无需评审 |

#### 评审角色识别

| 角色 | 触发条件 |
|------|----------|
| 产品经理 | 需求变更涉及产品功能 |
| 设计师 | UI/UX相关变更 |
| IA设计师 | IA结构变更 |
| 交互设计师 | 交互规范变更 |
| 测试负责人 | 任何变更 |
| 运营 | 运营相关变更 |

#### 重评审必要性输出

```json
{
  "review_decision": {
    "required": true,
    "level": "L3_mandatory_review",
    "review_scope": [
      {"role": "产品经理", "reason": "核心功能变更"},
      {"role": "测试负责人", "reason": "测试范围扩大"}
    ],
    "review_content": [
      "微信登录技术方案",
      "与现有登录流程的兼容性",
      "回归测试计划"
    ],
    "review_deadline": "ISO8601"
  }
}
```

### Step 4: 版本联动分析 [深度]

#### 4.1 PRD版本更新

**分析内容**：

| 分析项 | 输出 |
|--------|------|
| 需要更新的PRD章节 | 变更涉及的PRD章节 |
| 变更类型 | 新增/修改/删除 |
| 更新建议 | 具体的更新内容建议 |

**PRD版本更新**：

```json
{
  "prd_version_update": {
    "current_version": "1.2.0",
    "new_version": "1.3.0",
    "update_type": "minor_version",
    "sections_to_update": [
      {"chapter": "3.登录功能", "change_type": "modify", "suggestion": "增加微信登录章节"}
    ],
    "update_proposal": "详见附件PRD更新建议"
  }
}
```

#### 4.2 IA版本更新

**分析内容**：

| 分析项 | 输出 |
|--------|------|
| 需要更新的IA节点 | 变更涉及的IA节点 |
| 变更类型 | 新增/修改/删除 |
| 更新建议 | 具体的IA结构调整建议 |

**IA版本更新**：

```json
{
  "ia_version_update": {
    "current_version": "1.2.0",
    "new_version": "1.3.0",
    "nodes_to_update": [
      {"node_id": "IA001", "node_name": "用户中心", "change_type": "modify", "suggestion": "增加微信登录子节点"}
    ],
    "update_proposal": "详见附件IA更新建议"
  }
}
```

#### 4.3 用户流程版本更新

**分析内容**：

| 分析项 | 输出 |
|--------|------|
| 需要新增的流程 | 针对新功能 |
| 需要修改的流程 | 针对变更内容 |
| 需要删除的流程 | 已废弃功能 |

**用户流程版本更新**：

```json
{
  "userflow_version_update": {
    "flows_to_add": [
      {"flow_id": "NEW_001", "flow_name": "微信登录流程", "priority": "P0"}
    ],
    "flows_to_modify": [
      {"flow_id": "UF_001", "flow_name": "登录流程", "change": "增加微信登录分支"}
    ],
    "flows_to_delete": [],
    "estimated_redesign_effort_hours": 16
  }
}
```

## 输出

**存储路径**：`output/pm-design/change-impact-analysis/`

**输出文件**：`change_impact_report.json`

**输出Schema**：

```json
{
  "type": "object",
  "required": ["output_id", "change_id", "classification", "impact_analysis", "review_needed"],
  "properties": {
    "output_id": {"type": "string", "description": "输出唯一标识"},
    "change_id": {"type": "string", "description": "变更请求ID"},
    "generated_at": {"type": "string", "description": "生成时间"},
    "classification": {"type": "object", "description": "变更分类，包含级别和原因"},
    "impact_analysis": {"type": "object", "description": "影响分析，包含功能/IA/用户流程/原型/交互规范多维度"},
    "review_needed": {"type": "boolean", "description": "是否需要重评审"},
    "review_decision": {"type": "object", "description": "评审决策，包含评审范围和内容"},
    "version_updates": {"type": "object", "description": "版本联动更新建议"},
    "summary": {"type": "object", "description": "变更影响摘要，包含影响范围和风险等级"}
  }
}
```

### 最终输出结构

```json
{
  "output_id": "change_impact_report_xxx",
  "change_id": "CR_2024_001",
  "generated_at": "ISO8601",
  "classification": {
    "level": "L3",
    "level_description": "重大变更",
    "reasons": [...]
  },
  "impact_analysis": {
    "functional": {...},
    "ia": {...},
    "userflow": {...},
    "prototype": {...},
    "interaction_spec": {...}
  },
  "review_needed": true,
  "review_decision": {...},
  "version_updates": {
    "prd": {...},
    "ia": {...},
    "userflow": {...}
  },
  "summary": {
    "impact_scope": "多个功能模块",
    "estimated_effort_days": 10,
    "risk_level": "medium"
  }
}
```

### 输出字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| classification | JSON | 变更级别及原因 |
| impact_analysis | JSON | 多维度影响分析详情 |
| review_needed | boolean | 是否需要重评审 |
| review_decision | JSON | 评审范围和内容 |
| version_updates | JSON | 版本联动更新建议 |

## 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| output_id | string | 是 | 输出唯一标识 |
| change_id | string | 是 | 变更请求ID，须与输入change_id一致 |
| generated_at | string | 是 | 生成时间，ISO 8601格式 |
| classification | object | 是 | 变更分类 |
| classification.level | string | 是 | 变更级别，枚举值：L1/L2/L3/L4 |
| classification.level_description | string | 是 | 级别描述 |
| classification.reasons | array | 是 | 分级原因列表，不可为空 |
| classification.confidence | number | 是 | 分配置信度，范围0.0-1.0 |
| impact_analysis | object | 是 | 影响分析 |
| impact_analysis.functional | object | 是 | 功能影响分析，含directly_affected/indirectly_affected/dependent_features |
| impact_analysis.functional.directly_affected | array | 是 | 直接受影响功能列表，每项含feature_id/feature_name/impact_type |
| impact_analysis.ia | object | 是 | IA影响分析，含directly_affected_nodes/structure_changes/navigation_path_impact |
| impact_analysis.userflow | object | 是 | 用户流程影响分析，含directly_affected_flows/node_changes/dead_end_risks |
| impact_analysis.prototype | object | 否 | 原型影响分析，含affected_pages/component_changes/design_consistency |
| impact_analysis.interaction_spec | object | 否 | 交互规范影响分析，含affected_states/animation_changes/gesture_changes |
| review_needed | boolean | 是 | 是否需要重评审 |
| review_decision | object | 否 | 评审决策（review_needed为true时必填），含level/review_scope/review_content/review_deadline |
| review_decision.level | string | 否 | 评审级别，枚举值：L1_optional/L2_suggested/L3_mandatory/L4_strategic |
| review_decision.review_scope | array | 否 | 评审角色列表，每项含role/reason |
| version_updates | object | 否 | 版本联动更新建议，含prd/ia/userflow |
| version_updates.prd | object | 否 | PRD版本更新建议，含current_version/new_version/sections_to_update |
| version_updates.ia | object | 否 | IA版本更新建议，含current_version/new_version/nodes_to_update |
| version_updates.userflow | object | 否 | 用户流程版本更新建议，含flows_to_add/flows_to_modify/flows_to_delete |
| summary | object | 是 | 变更影响摘要 |
| summary.impact_scope | string | 是 | 影响范围描述 |
| summary.estimated_effort_days | number | 是 | 预估影响人天，须≥0 |
| summary.risk_level | string | 是 | 风险等级，枚举值：low/medium/high/critical |

## 上游变更响应

当上游输入发生变更时，本Skill的响应策略：

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| PRD需求变更 | 功能影响分析、版本联动 | 更新功能影响矩阵，重新评估变更级别和重评审必要性 |
| IA方案变更 | IA影响分析 | 更新IA影响矩阵，重新评估IA结构变更范围 |
| 用户流程变更 | 用户流程影响分析 | 更新用户流程影响矩阵，重新评估死胡同风险 |
| 原型变更 | 原型影响分析 | 更新原型影响矩阵，重新评估设计规范一致性 |
| 交互规范变更 | 交互规范影响分析 | 更新交互规范影响矩阵，重新评估状态机覆盖 |

当变更影响分析结果自身变更时，对下游的通知机制：

| 变更影响分析变更类型 | 通知范围 | 通知方式 |
|---------------------|----------|----------|
| 变更级别升级 | agile-retrospective | 标记变更级别变化，触发复盘评估 |
| 影响范围扩大 | design-prd | 标记影响范围变化，触发PRD更新评估 |
| 重评审必要性变化 | quality-acceptance | 标记评审需求变化，触发验收标准更新 |
| 版本规划调整 | agile-sprint-planning | 标记版本规划变化，触发Sprint计划调整 |

---

## 决策规则

### 强制重评审规则

| 条件 | 决策 |
|------|------|
| L3级别变更 | **必须触发重评审** |
| L4级别变更 | **必须触发战略级评审** |
| 涉及假设变化 | 必须重评审 |
| 影响范围>3个功能模块 | 建议升级评审级别 |

### 特殊处理规则

| 条件 | 处理方式 |
|------|----------|
| 变更涉及IA结构重构 | 必须包含IA回滚方案 |
| 变更涉及设计系统/令牌变更 | 必须包含设计规范降级方案 |
| 变更影响P0功能 | 必须产品负责人签字确认 |

## 质量检查

### Quality Check

| 检查项 | 标准 | 未达标处理 |
|--------|------|------------|
| 影响范围穷举（P0） | 功能/IA/用户流程/原型/交互规范多维度全覆盖 | 返回补充 |
| 重评审判断依据（P0） | 每个判断都有对应证据 | 返回补充 |
| 版本联动完整性（P1） | PRD/IA/用户流程版本同步 | 告警+人工确认 |

### 影响范围穷举检查清单

- [ ] 功能影响：直接/间接/依赖功能已识别（P0）
- [ ] IA影响：IA节点/结构/导航路径已识别（P1）
- [ ] 用户流程影响：流程/节点/死胡同已识别（P1）
- [ ] 原型影响：页面/组件/设计一致性已识别（P2）
- [ ] 交互规范影响：状态/动效/手势已识别（P2）

## 降级策略

### 上游文件缺失降级方案

| 缺失范围 | 降级方案 | 输出影响 | 数据获取说明 |
|----------|----------|----------|------------|
| 变更请求缺失 | 无法执行，需用户描述变更内容 | - | 要求用户提供变更内容描述（变更了什么、涉及哪些功能模块） |
| 当前PRD缺失 | 用户描述变更内容 → 直接分析影响，无PRD基准对比 | 无法精确定位受影响章节，影响范围基于推断 | 要求用户提供当前PRD文档或功能需求描述 |
| 当前IA缺失 | 跳过IA影响分析 | IA影响分析不完整 | 要求用户提供IA方案或信息架构描述 |
| 当前用户流程缺失 | 跳过用户流程影响分析 | 用户流程影响分析不完整 | 要求用户提供用户流程图或流程描述 |
| 当前原型缺失 | 跳过原型影响分析 | 原型影响分析不完整 | 要求用户提供原型设计或页面描述 |
| 当前交互规范缺失 | 跳过交互规范影响分析 | 交互规范影响分析不完整 | 要求用户提供交互规范或交互描述 |
| 变更请求 + 当前PRD + 当前IA均缺失 | 用户描述变更内容 → 直接分析影响 | 输出简化影响分析，各维度标注"待补充" | 要求用户提供变更描述、当前PRD和IA方案 |

### 数据获取说明

当上游文件缺失时，需用户提供以下信息以支撑降级生成：
- **变更内容描述**：变更了什么，涉及哪些功能模块
- **变更原因**（可选）：为什么需要变更
- **预期影响范围**（可选）：变更可能影响的模块或系统

## 执行日志

```json
{
  "execution_id": "exec_p2_xxx",
  "pipeline": "change-impact-analysis",
  "change_id": "CR_2024_001",
  "started_at": "ISO8601",
  "completed_at": "ISO8601",
  "steps": [
    {"step": "step_1_classification", "status": "completed", "duration_ms": 500},
    {"step": "step_2_impact_analysis", "status": "completed", "duration_ms": 2000},
    {"step": "step_3_review_decision", "status": "completed", "duration_ms": 800},
    {"step": "step_4_version_updates", "status": "completed", "duration_ms": 600}
  ],
  "output_ref": "output_ref_xxx",
  "quality_checks_passed": true
}
```
