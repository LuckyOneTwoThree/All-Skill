---
name: development-prd-sync
description: 当需要检测PRD与设计稿或代码的不一致时使用。PRD双向同步自动化，实现PRD与设计稿、代码、测试用例的双向同步，自动检测不一致并生成更新提案。包含正向同步（PRD→设计/代码/测试用例）和逆向同步（代码→PRD）。🤖 AI自动执行。关键词：PRD同步、需求同步、双向同步、需求追踪、一致性检查、文档一致性、PRD更新。
metadata:
  module: "产品开发与上线"
  sub-module: "开发交付"
  type: "pipeline"
  version: "2.0"
  interaction_mode: "ai_auto"
---

# Pipeline 3: PRD双向同步自动化

## 核心原则

1. **触发器驱动**：由PRD更新和代码合入事件自动触发同步，而非人工发起
2. **自动化验收**：一致性检查自动化，冲突检测自动化，差异报告自动生成
3. **持续部署**：PRD与代码/测试用例实时同步，确保发布内容与需求一致
4. **实时复盘**：同步偏差即时检测，冲突即时告警

## 交互模式

🤖 **AI自动执行**

触发条件：
- PRD内容更新事件
- 代码合入主干事件
- 定时同步检查（建议每小时执行一次）

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| PRD文档 | object | 是 | output/pm-design/design-prd/prd.json | 产品需求文档，作为同步的单一数据源 |
| 技术方案 | object | 是 | output/pm-development/development-task-breakdown/task_breakdown.json | 代码实现、设计稿、测试用例 |
| 开发进度 | object | ○ | 用户提供 | 代码变更、合入记录、构建状态 |

## 执行步骤

### 同步方向

```
┌─────────────────────────────────────────────────────────────┐
│                        PRD文档                              │
│  (单一数据源，所有变更的权威参考)                            │
└─────────────────────────────────────────────────────────────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
    ┌──────────┐    ┌──────────┐    ┌──────────────┐
    │  设计稿  │    │   代码   │    │  测试用例   │
    │          │    │          │    │              │
    └──────────┘    └──────────┘    └──────────────┘
          │                │                │
          └────────────────┴────────────────┘
                           │
                    同步状态反馈
```

### Step 1: PRD→设计同步

#### 1.1 PRD变更检测

**检测规则**：

| 检测维度 | 检查内容 |
|----------|----------|
| 功能点变更 | 新增/修改/删除的功能描述 |
| 交互流程变更 | 用户操作流程的变化 |
| 界面要求变更 | 页面布局/组件要求 |
| 状态定义变更 | 各种状态的定义 |

**PRD变更输出**：

```json
{
  "prd_changes": [
    {
      "change_type": "modify",
      "location": "3.1 登录页面",
      "before": "支持手机号+验证码登录",
      "after": "支持手机号+验证码登录和微信登录",
      "impact_on_design": "需要增加微信登录入口和相关UI"
    }
  ]
}
```

#### 1.2 设计稿差异分析

**分析内容**：

| 分析项 | 输出 |
|--------|------|
| 对应设计稿 | 该PRD章节对应的设计稿 |
| 版本对比 | 设计稿版本与PRD变更的匹配度 |
| 是否需要更新 | 判断结果及原因 |

**差异分析输出**：

```json
{
  "design_diff_analysis": [
    {
      "prd_section": "3.1 登录页面",
      "design_file": "design/login_page_v2.fig",
      "design_version": "2.0",
      "diff_content": "设计稿未包含微信登录入口",
      "update_needed": true,
      "update_suggestion": "在登录页面增加微信登录按钮"
    }
  ]
}
```

#### 1.3 设计同步通知

**通知格式**：

```json
{
  "design_sync_notification": {
    "recipient": "designer_li",
    "subject": "PRD变更通知：登录模块需要设计更新",
    "priority": "high",
    "change_summary": "登录页面需增加微信登录入口",
    "prd_reference": "PRD_v1.3.0_3.1节",
    "deadline": "ISO8601"
  }
}
```

### Step 2: PRD→代码同步

#### 2.1 PRD功能点提取

**提取内容**：

| 提取项 | 说明 |
|--------|------|
| 功能描述 | 功能的详细描述 |
| 验收标准 | Given-When-Then格式的标准 |
| 边界条件 | 各种边界情况 |
| 异常处理 | 异常场景及处理方式 |

**功能点提取输出**：

```json
{
  "extracted_features": [
    {
      "feature_id": "F001",
      "feature_name": "微信登录",
      "acceptance_criteria": [
        "Given 用户未登录\nWhen 用户点击微信登录\nThen 跳转微信授权页面",
        "Given 用户已授权\nWhen 微信返回授权成功\nThen 用户完成登录并跳转首页"
      ],
      "boundary_conditions": [
        "微信App未安装",
        "微信授权被拒绝",
        "微信服务不可用"
      ]
    }
  ]
}
```

#### 2.2 代码一致性检查

**检查规则**：

| 检查类型 | 检查内容 | 检查方法 |
|----------|----------|----------|
| 功能覆盖 | 代码是否实现了所有功能点 | AST解析+规则匹配 |
| 验收标准覆盖 | 是否有对应的自动化测试 | 测试用例映射 |
| 异常处理覆盖 | 是否处理了所有异常场景 | 代码路径分析 |

**一致性检查输出**：

```json
{
  "code_consistency_check": {
    "feature_coverage": {
      "feature_id": "F001",
      "feature_name": "微信登录",
      "implemented": true,
      "coverage_rate": 0.85,
      "missing_parts": ["微信未安装时的降级处理"]
    },
    "acceptance_criteria_coverage": {
      "total": 3,
      "automated": 2,
      "coverage_rate": 0.67
    },
    "exception_handling_coverage": {
      "total": 5,
      "handled": 4,
      "missing": ["微信App未安装提示"]
    }
  }
}
```

#### 2.3 差异报告生成

**报告格式**：

```json
{
  "code_diff_report": {
    "prd_version": "1.3.0",
    "code_version": "v2.0.1",
    "consistency_status": "partial",
    "differences": [
      {
        "type": "missing_implementation",
        "location": "auth/wechat_login.ts",
        "description": "缺少微信App未安装的检测和处理",
        "severity": "medium",
        "suggested_fix": "增加微信App可用性检测逻辑"
      }
    ],
    "recommendations": [
      "建议补充微信App未安装的降级处理逻辑",
      "建议增加微信授权超时的处理"
    ]
  }
}
```

### Step 3: PRD→测试用例同步

#### 3.1 PRD功能点→测试用例映射

**映射规则**：

| PRD验收标准 | 测试用例类型 |
|-------------|--------------|
| Given-When-Then标准 | E2E测试用例 |
| 边界条件 | 边界值测试用例 |
| 异常场景 | 异常测试用例 |
| 性能要求 | 性能测试用例 |

**映射输出**：

```json
{
  "prd_test_mapping": [
    {
      "feature_id": "F001",
      "feature_name": "微信登录",
      "acceptance_criteria": "Given 用户未登录...",
      "mapped_test_cases": [
        {"case_id": "TC001", "case_name": "正常微信登录流程", "type": "e2e"},
        {"case_id": "TC002", "case_name": "微信授权被拒绝", "type": "exception"}
      ],
      "coverage_status": "complete"
    }
  ]
}
```

#### 3.2 测试用例覆盖检查

**检查规则**：

| 检查项 | 标准 |
|--------|------|
| Happy Path覆盖 | 每个功能的正常流程必须有测试用例 |
| 边界用例数量 | 每个功能至少3个边界用例 |
| 异常用例完整 | 每个声明的异常场景必须有测试用例 |

**覆盖检查输出**：

```json
{
  "test_coverage_check": {
    "happy_path_coverage": {
      "total_features": 10,
      "covered": 9,
      "missing": ["F009"]
    },
    "boundary_cases": {
      "total": 30,
      "covered": 28,
      "min_per_feature": 3,
      "below_threshold": ["F003 仅2个边界用例"]
    },
    "exception_coverage": {
      "total_declared": 15,
      "total_covered": 12,
      "missing": ["F001_微信App未安装"]
    }
  }
}
```

#### 3.3 缺失报告生成

**报告格式**：

```json
{
  "missing_test_report": {
    "prd_version": "1.3.0",
    "generated_at": "ISO8601",
    "missing_cases": [
      {
        "feature_id": "F001",
        "missing_type": "exception_case",
        "description": "微信App未安装的异常处理",
        "priority": "medium",
        "suggested_case": {
          "case_name": "微信App未安装时提示用户安装",
          "precondition": "用户未安装微信App",
          "steps": ["点击微信登录", "检测到微信未安装", "弹出提示"],
          "expected_result": "显示引导安装微信的提示"
        }
      }
    ],
    "total_missing": 3,
    "p0_missing": 0
  }
}
```

### Step 4: 逆向同步（代码→PRD）

#### 4.1 代码变更检测

**检测规则**：

| 检测维度 | 检测内容 |
|----------|----------|
| 新增接口 | 新增的API或方法 |
| 修改逻辑 | 业务逻辑的变更 |
| 新增字段 | 数据模型的变更 |
| 注释和文档 | 代码中的说明是否暗示了PRD遗漏 |

**代码变更输出**：

```json
{
  "code_changes": [
    {
      "file": "auth/login.ts",
      "change_type": "modify",
      "changes": [
        {
          "type": "new_logic",
          "location": "line 45-60",
          "description": "新增微信登录降级处理：当微信App未安装时，提示用户使用其他方式登录"
        }
      ],
      "potential_prd_implication": "需要在PRD中补充'微信未安装降级'的用户场景描述"
    }
  ]
}
```

#### 4.2 PRD更新必要性判断

**判断规则**：

| 代码变更类型 | 是否需要更新PRD |
|--------------|-----------------|
| 新增用户可见功能 | 必须更新 |
| 修改用户流程 | 必须更新 |
| 优化非功能需求 | 可选更新 |
| 代码重构 | 无需更新 |

**判断输出**：

```json
{
  "prd_update_judgment": [
    {
      "code_change": "新增微信降级处理逻辑",
      "prd_implication": "新增了一个用户场景（微信未安装）",
      "update_needed": true,
      "update_type": "add",
      "suggested_update": "在3.1.3节'异常流程'中增加'微信未安装'场景"
    }
  ]
}
```

#### 4.3 冲突检测

**冲突类型**：

| 冲突类型 | 描述 | 检测方法 |
|----------|------|----------|
| 功能冲突 | 代码实现与PRD描述矛盾 | 语义对比 |
| 逻辑冲突 | 代码逻辑与PRD流程冲突 | 流程对比 |
| 术语冲突 | 代码命名与PRD术语不一致 | 术语库对比 |

**冲突检测输出**：

```json
{
  "conflict_detection": [
    {
      "conflict_type": "logic_conflict",
      "code_location": "auth/wechat.ts:80",
      "code_behavior": "微信授权超时时间为10秒",
      "prd_description": "3.2.1节规定微信授权超时时间为30秒",
      "conflict_level": "high",
      "resolution": "以PRD为准，修改代码为30秒"
    }
  ]
}
```

#### 4.4 更新提案生成

**提案格式**：

```json
{
  "update_proposals": [
    {
      "proposal_id": "PROP_001",
      "type": "prd_addition",
      "reason": "代码新增了PRD未覆盖的用户场景",
      "suggested_content": "在3.1.3异常流程中增加：\n3.1.3.4 微信未安装\n- 前置条件：用户设备未安装微信App\n- 处理流程：检测到微信未安装→显示引导安装提示→用户可选择其他登录方式",
      "related_code": "auth/wechat.ts:45-60",
      "reviewer": "产品经理_zhang",
      "priority": "medium"
    }
  ]
}
```

## 输出

**存储路径**：`output/pm-development/development-prd-sync/`

**输出文件**：`prd_sync_report.json`

**输出Schema**：

```json
{
  "type": "object",
  "required": ["output_id", "sync_type", "sync_status"],
  "properties": {
    "output_id": {"type": "string", "description": "输出唯一标识"},
    "generated_at": {"type": "string", "description": "生成时间"},
    "sync_type": {"type": "string", "description": "同步类型：bidirectional"},
    "sync_status": {"type": "object", "description": "各方向同步状态，包含PRD→设计/代码/测试和代码→PRD"},
    "conflict_list": {"type": "array", "description": "检测到的冲突清单"},
    "update_proposals": {"type": "array", "description": "建议的更新提案列表"},
    "summary": {"type": "object", "description": "同步摘要，包含整体状态和待处理项"}
  }
}
```

### 最终输出结构

```json
{
  "output_id": "prd_sync_report_xxx",
  "generated_at": "ISO8601",
  "sync_type": "bidirectional",
  "sync_status": {
    "prd_to_design": {
      "status": "synced",
      "updates_generated": 1,
      "notifications_sent": 1
    },
    "prd_to_code": {
      "status": "partial",
      "consistency_rate": 0.92,
      "issues_found": 2
    },
    "prd_to_test": {
      "status": "synced",
      "coverage_rate": 0.88,
      "missing_cases": 3
    },
    "code_to_prd": {
      "status": "review_needed",
      "updates_proposed": 2,
      "conflicts_detected": 1
    }
  },
  "conflict_list": [...],
  "update_proposals": [...],
  "summary": {
    "overall_sync_status": "healthy",
    "pending_actions": 3,
    "requires_manual_review": true
  }
}
```

### 输出字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| sync_status | JSON | 各方向同步状态 |
| conflict_list | JSON | 检测到的冲突清单 |
| update_proposals | JSON | 建议的更新提案 |

## 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| sync_result | object | 是 | 同步结果根对象 |
| sync_result.changes | array | 是 | 变更列表 |
| sync_result.changes[].type | string | 是 | 变更类型，枚举值：added/modified/removed |
| sync_result.changes[].requirement_id | string | 是 | 需求ID |
| sync_result.changes[].field | string | 是 | 变更字段 |
| sync_result.changes[].old_value | string | 否 | 旧值（修改/删除时） |
| sync_result.changes[].new_value | string | 否 | 新值（新增/修改时） |
| sync_result.changes[].impact | string | 是 | 影响评估 |
| sync_result.changes[].action_required | string | 是 | 需要的行动 |
| sync_result.consistency_check | object | 是 | 一致性校验结果 |
| sync_result.consistency_check.is_consistent | boolean | 是 | 是否一致 |
| sync_result.consistency_check.inconsistencies | array | 否 | 不一致项列表 |
| sync_result.approval_status | string | 是 | 审批状态，枚举值：pending/approved/rejected |

## 上游变更响应

当上游输入发生变更时，本Skill的响应策略：

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| PRD需求变更 | 同步变更列表和影响评估 | 重新执行差异比对，标记新增变更，保留人类已确认的同步记录 |
| SRS需求变更 | 一致性校验 | 重新执行一致性校验，标记不一致项 |
| 需求变更日志更新 | 变更追溯 | 更新变更追溯链路，标记需人类确认 |

当同步结果自身变更时，对下游的通知机制：

| 同步变更类型 | 通知范围 | 通知方式 |
|-------------|----------|----------|
| 需求新增 | development-task-breakdown | 标记需求新增，触发任务拆解 |
| 需求修改 | development-auto-review | 标记需求修改，触发审查规则更新 |
| 一致性问题 | development-task-breakdown | 标记一致性问题，触发修复任务 |

---

## 决策规则

| 情况 | 处理方式 |
|------|----------|
| 功能冲突（代码与PRD矛盾） | 以PRD为准，生成修复建议 |
| 同步延迟>1小时 | 触发告警，检查同步服务 |
| 代码新增用户可见功能 | 必须生成PRD更新提案 |
| 测试用例覆盖率<80% | 标记为待补充，输出缺失清单 |

## 质量检查

### Quality Gates

| 检查项 | 标准 | 未达标处理 |
|--------|------|------------|
| 同步延迟 | < 1小时 | 告警 |
| 冲突检测准确率 | ≥ 90% | 人工抽样复核 |
| 覆盖完整性 | 功能/技术/测试用例全覆盖 | 返回补充 |

### 质量指标

| 指标 | 计算方式 | 目标值 |
|------|----------|--------|
| 同步覆盖率 | 已同步项/应同步项 | 100% |
| 冲突检测率 | 检出冲突/实际冲突 | ≥ 90% |
| 提案采纳率 | 被采纳提案/总提案 | ≥ 70% |

## 降级策略

### 上游文件缺失降级方案

| 缺失范围 | 降级方案 | 输出影响 |
|----------|----------|----------|
| PRD缺失 | 无法执行正向同步，仅执行代码→PRD逆向检查 | 同步方向受限 |
| 设计稿缺失 | 跳过PRD→设计同步步骤 | 设计同步报告缺失 |
| 代码缺失 | 跳过PRD→代码同步和逆向同步步骤 | 代码一致性检查缺失 |
| 测试用例缺失 | 跳过PRD→测试用例同步步骤 | 测试覆盖检查缺失 |
| PRD + 设计稿 + 代码 + 测试用例均缺失 | 用户提供PRD和代码文件路径 → 执行单向同步检查 | 仅输出单向同步结果，标注"待补充" |
| 开发进度缺失 | 若用户未提供开发进度，提示用户提供或跳过该输入相关步骤 | 无法进行代码→PRD逆向同步的增量分析 |

### 数据获取说明

当上游文件缺失时，需用户提供以下信息以支撑降级生成：
- **PRD文件路径**：PRD文档的位置
- **代码文件路径**（可选）：代码仓库或关键文件路径
- **同步方向**（可选）：需要检查的同步方向（正向/逆向/双向）

## 执行日志

```json
{
  "execution_id": "exec_p3_xxx",
  "pipeline": "development-prd-sync",
  "trigger": "prd_update | code_commit | scheduled",
  "started_at": "ISO8601",
  "completed_at": "ISO8601",
  "steps": [
    {"step": "prd_to_design_sync", "status": "completed", "duration_ms": 500},
    {"step": "prd_to_code_sync", "status": "completed", "duration_ms": 1200},
    {"step": "prd_to_test_sync", "status": "completed", "duration_ms": 800},
    {"step": "code_to_prd_sync", "status": "completed", "duration_ms": 1500}
  ],
  "output_ref": "output_ref_xxx",
  "quality_metrics": {
    "sync_coverage": 1.0,
    "conflict_accuracy": 0.92,
    "proposal_count": 3
  }
}
```
