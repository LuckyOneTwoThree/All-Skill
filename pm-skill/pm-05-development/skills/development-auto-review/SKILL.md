---
name: development-auto-review
description: 当需要分析需求变更的影响范围时使用。需求变更影响分析自动化，接收变更请求，自动进行变更分类（L1-L4）、影响传播分析、重评审必要性判断和版本联动分析，输出变更影响报告。🤖 AI自动执行。关键词：需求变更、变更影响、变更分析、需求变更分析、变更分类。
metadata:
  module: "产品开发与上线"
  sub-module: "开发交付"
  type: "pipeline"
  version: "1.0"
  interaction_mode: "ai_auto"
---

# Pipeline 2: 需求变更影响分析自动化

## 核心原则

1. **触发器驱动**：由变更请求系统新增事件自动触发，而非人工发起
2. **自动化验收**：变更分类、影响传播分析、重评审判断全流程自动化
3. **持续部署**：变更影响分析结果自动同步到版本规划，保持发布节奏
4. **实时复盘**：变更影响分析完成后即时生成版本联动建议

## 交互模式

🤖 **AI自动执行**

触发条件：变更请求系统新增变更请求。

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 变更请求 | JSON | 是 | 变更管理系统 | 待分析的变更内容 |
| 当前PRD | JSON | 是 | PRD管理系统 | 当前生效的PRD版本 |
| 当前技术方案 | JSON | 是 | 技术方案库 | 已评审的技术方案 |
| 开发进度 | JSON | 是 | 开发跟踪系统 | 当前各任务的开发状态 |

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

### Step 1: 变更分类（L1-L4）

#### 分类维度

| 级别 | 变更类型 | 影响范围 | 决策层级 |
|------|----------|----------|----------|
| L1 轻微 | 文字修正、样式调整、文案优化 | 单个小功能 | 开发者自决策 |
| L2 一般 | 功能细节调整、交互优化、非核心逻辑变更 | 单个功能模块 | 产品经理审批 |
| L3 重大 | 核心功能变更、API接口变更、数据库结构变更 | 多个功能模块 | 多角色评审 |
| L4 战略 | 架构变更、商业模式变更、跨系统影响 | 全局或跨系统 | 战略级评审 |

#### 分类决策树

```
变更请求
    │
    ├─ 是否影响核心业务流程？ ──是──→ L3
    │
    ├─ 是否改变API接口契约？ ──是──→ L3
    │
    ├─ 是否影响数据模型？ ──是──→ L3
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

### Step 2: 影响传播分析

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

#### 2.2 技术影响分析

**分析内容**：

| 分析项 | 输出 |
|--------|------|
| 代码变更范围 | 需要修改的代码文件和函数 |
| 数据库变更 | 需要修改的表结构和数据迁移 |
| API变更 | 新增/修改/废弃的接口 |
| 第三方依赖 | 新增/升级的依赖 |

**技术影响矩阵**：

```json
{
  "technical_impact": {
    "code_changes": [
      {"file": "auth/login.ts", "change_type": "modify", "change_lines": 150}
    ],
    "database_changes": [
      {"table": "user_bindings", "change_type": "add_column", "column": "wechat_openid"}
    ],
    "api_changes": [
      {"endpoint": "/api/auth/wechat", "method": "POST", "change_type": "new"}
    ],
    "external_dependencies": [
      {"service": "微信开放平台API", "change_type": "new", "risk": "medium"}
    ]
  }
}
```

#### 2.3 测试影响分析

**分析内容**：

| 分析项 | 输出 |
|--------|------|
| 需回归测试的功能 | 受影响功能的测试用例 |
| 需新增测试用例 | 针对新功能的测试 |
| 测试环境需求 | 测试所需的特殊环境 |

**测试影响矩阵**：

```json
{
  "test_impact": {
    "regression_cases": [
      {"case_id": "TC001", "case_name": "手机号登录正常流程", "priority": "P0"},
      {"case_id": "TC002", "case_name": "验证码错误处理", "priority": "P1"}
    ],
    "new_cases_needed": [
      {"case_id": "TC_NEW_001", "case_name": "微信授权登录流程", "priority": "P0"},
      {"case_id": "TC_NEW_002", "case_name": "微信未绑定处理", "priority": "P1"}
    ],
    "test_environment": {
      "needs_mock_wechat": true,
      "special_config": "微信沙箱环境"
    }
  }
}
```

#### 2.4 运营影响分析

**分析内容**：

| 分析项 | 输出 |
|--------|------|
| 运营配置变更 | 运营后台是否需要调整 |
| 数据统计影响 | 是否影响埋点和统计 |
| 客服话术影响 | 客服知识库是否需要更新 |

**运营影响矩阵**：

```json
{
  "operation_impact": {
    "config_changes": [],
    "data_tracking": [
      {"event": "wechat_login_success", "change_type": "new", "need_verify": true}
    ],
    "customer_service": [
      {"topic": "微信登录问题", "update_needed": true, "priority": "medium"}
    ]
  }
}
```

### Step 3: 重评审必要性判断

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
| 后端开发 | API/数据模型变更 |
| 前端开发 | 界面/交互变更 |
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

### Step 4: 版本联动分析

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

#### 4.2 代码版本规划

**分析内容**：

| 分析项 | 输出 |
|--------|------|
| 所属版本 | 变更计划纳入的版本 |
| 代码分支策略 | 如何组织代码变更 |
| 发布节奏 | 与哪个Sprint一起发布 |

**代码版本规划**：

```json
{
  "code_version_plan": {
    "target_release": "v2.1.0",
    "branch_strategy": "feature/wechat_login",
    "merge_target": "release/2.1.0",
    "sprint_plan": "Sprint 8",
    "code_freeze_date": "ISO8601"
  }
}
```

#### 4.3 测试用例版本更新

**分析内容**：

| 分析项 | 输出 |
|--------|------|
| 需要新增的测试用例 | 针对新功能 |
| 需要修改的测试用例 | 针对变更内容 |
| 需要删除的测试用例 | 已废弃功能 |

**测试用例版本更新**：

```json
{
  "test_case_version_update": {
    "cases_to_add": [
      {"case_id": "NEW_001", "case_name": "微信登录成功", "priority": "P0"}
    ],
    "cases_to_modify": [
      {"case_id": "TC_001", "case_name": "登录页面UI", "change": "增加微信登录入口"}
    ],
    "cases_to_delete": [],
    "estimated_test_effort_hours": 16
  }
}
```

## 输出

**存储路径**：`output/pm-development/development-auto-review/`

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
    "impact_analysis": {"type": "object", "description": "影响分析，包含功能/技术/测试/运营四维度"},
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
    "technical": {...},
    "test": {...},
    "operation": {...}
  },
  "review_needed": true,
  "review_decision": {...},
  "version_updates": {
    "prd": {...},
    "code": {...},
    "test_cases": {...}
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
| impact_analysis | JSON | 四维度影响分析详情 |
| review_needed | boolean | 是否需要重评审 |
| review_decision | JSON | 评审范围和内容 |
| version_updates | JSON | 版本联动更新建议 |

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
| 变更涉及数据迁移 | 必须包含数据回滚方案 |
| 变更涉及第三方服务 | 必须包含服务降级方案 |
| 变更影响P0功能 | 必须产品负责人签字确认 |

## 质量检查

### Quality Check

| 检查项 | 标准 | 未达标处理 |
|--------|------|------------|
| 影响范围穷举 | 功能/技术/测试/运营四维度全覆盖 | 返回补充 |
| 重评审判断依据 | 每个判断都有对应证据 | 返回补充 |
| 版本联动完整性 | PRD/代码/测试用例版本同步 | 告警+人工确认 |

### 影响范围穷举检查清单

- [ ] 功能影响：直接/间接/依赖功能已识别
- [ ] 技术影响：代码/数据库/API/依赖已识别
- [ ] 测试影响：回归/新增测试用例已识别
- [ ] 运营影响：配置/数据/客服已识别

## 降级策略

### 上游文件缺失降级方案

| 缺失范围 | 降级方案 | 输出影响 |
|----------|----------|----------|
| 变更请求缺失 | 无法执行，需用户描述变更内容 | - |
| 当前PRD缺失 | 用户描述变更内容 → 直接分析影响，无PRD基准对比 | 无法精确定位受影响章节，影响范围基于推断 |
| 技术方案缺失 | 跳过技术影响分析中的代码变更范围评估 | 技术影响分析不完整 |
| 变更请求 + 当前PRD + 技术方案均缺失 | 用户描述变更内容 → 直接分析影响 | 输出简化影响分析，各维度标注"待补充" |

### 数据获取说明

当上游文件缺失时，需用户提供以下信息以支撑降级生成：
- **变更内容描述**：变更了什么，涉及哪些功能模块
- **变更原因**（可选）：为什么需要变更
- **预期影响范围**（可选）：变更可能影响的模块或系统

## 执行日志

```json
{
  "execution_id": "exec_p2_xxx",
  "pipeline": "development-auto-review",
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
