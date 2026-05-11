---
name: quality-auto-acceptance
description: 当需要自动执行验收测试时使用。自动化验收执行，基于Given-When-Then格式的验收标准自动执行验收，包括测试环境准备、自动化执行、结果判定和失败分析。P0/P1失败将阻止上线。🤖 AI自动执行。关键词：自动化验收、验收测试、Given-When-Then、质量门禁、上线检查、自动验收。
metadata:
  module: "产品开发与上线"
  sub-module: "质量保障"
  type: "pipeline"
  version: "1.0"
  interaction_mode: "ai_auto"
---

# Pipeline 5: 自动化验收执行

## 核心原则

1. **触发器驱动**：由Story完成和构建成功事件自动触发验收，而非等待人工发起
2. **自动化验收**：验收标准自动解析，测试环境自动准备，执行和判定全自动化
3. **持续部署**：验收通过即具备发布条件，P0/P1失败立即阻断
4. **实时复盘**：验收结果即时生成，失败用例即时分析根因

## 交互模式

🤖 **AI自动执行**

触发条件：
- Story开发完成事件
- 代码合入主干事件
- 构建成功事件
- 手动触发（验收负责人请求）

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| Story验收标准 | JSON | 是 | PRD | Given-When-Then格式 |
| 测试用例 | JSON数组 | 是 | Pipeline 4 | 自动生成的测试用例 |
| 测试环境配置 | JSON | 是 | 测试系统 | 环境参数和Mock配置 |
| 构建产物 | 文件/引用 | 是 | CI/CD | 待验收的构建版本 |

### Story验收标准结构示例

```json
{
  "story_id": "story_001",
  "title": "手机号验证码登录",
  "build_ref": "build_2024_0125_001",
  "version": "v2.1.0",
  "acceptance_criteria": [
    {
      "id": "AC001",
      "format": "given_when_then",
      "content": "Given 用户在登录页面\nWhen 用户输入有效手机号13800138000\nAnd 点击获取验证码按钮\nThen 系统发送6位数字验证码到该手机号\nAnd 页面显示发送成功提示",
      "automatable": true,
      "priority": "P0"
    },
    {
      "id": "AC002",
      "format": "given_when_then",
      "content": "Given 用户收到验证码123456\nWhen 用户输入验证码123456\nAnd 点击登录按钮\nThen 用户登录成功\nAnd 页面跳转到首页",
      "automatable": true,
      "priority": "P0"
    }
  ]
}
```

## 执行步骤

### Step 1: 验收标准解析

#### 1.1 GWT格式标准化

**解析规则**：

| GWT组件 | 解析结果 | 用途 |
|---------|----------|------|
| Given | 前置条件数组 | Setup步骤 |
| When | 操作步骤数组 | 执行步骤 |
| And | 追加到上一个When | 连续操作 |
| Then | 预期结果数组 | 断言验证 |

**解析输出**：

```json
{
  "parsed_criteria": [
    {
      "criteria_id": "AC001",
      "setup": [
        "打开登录页面",
        "确认页面已加载完成"
      ],
      "actions": [
        "输入手机号: 13800138000",
        "点击获取验证码按钮"
      ],
      "assertions": [
        "验证短信发送API被调用",
        "验证返回成功响应",
        "验证页面显示发送成功提示"
      ],
      "priority": "P0",
      "automatable": true
    }
  ]
}
```

#### 1.2 测试策略选择

**策略类型**：

| 策略 | 适用场景 | 执行方式 |
|------|----------|----------|
| E2E自动化 | 完整用户流程 | Selenium/Cypress |
| API自动化 | 纯后端功能 | RestAssured/Postman |
| 单元测试 | 独立函数逻辑 | Jest/JUnit |
| 集成测试 | 模块间交互 | 混合策略 |

**策略选择规则**：

```json
{
  "strategy_selection": {
    "AC001": {
      "selected_strategy": "api_automation",
      "reason": "验收点为API调用和响应",
      "test_framework": "rest_assured",
      "script_location": "tests/api/test_login.py::test_send_verification_code"
    },
    "AC002": {
      "selected_strategy": "e2e_automation",
      "reason": "包含页面跳转等UI验证",
      "test_framework": "cypress",
      "script_location": "tests/e2e/test_login.py::test_verify_code_login"
    }
  }
}
```

#### 1.3 测试数据准备

**数据需求分析**：

```json
{
  "test_data_requirements": {
    "AC001": {
      "phone": "13800138000",
      "type": "valid_phone",
      "source": "test_data/phones/valid.json"
    },
    "AC002": {
      "phone": "13800138000",
      "verification_code": "123456",
      "type": "valid_code",
      "source": "generated_by_AC001"
    }
  }
}
```

### Step 2: 测试环境准备

#### 2.1 环境就绪检查

**检查清单**：

| 检查项 | 检查内容 | 超时时间 |
|--------|----------|----------|
| 应用服务 | 服务启动且健康检查通过 | 60s |
| 数据库 | 数据库连接正常，数据就绪 | 30s |
| 缓存服务 | Redis连接正常 | 15s |
| 消息队列 | MQ连接正常 | 15s |
| 第三方Mock | Mock服务可用 | 30s |
| 测试账号 | 测试数据准备完成 | 20s |

**检查输出**：

```json
{
  "environment_check": {
    "app_service": {"status": "ready", "health_check_passed": true},
    "database": {"status": "ready", "connection_ok": true},
    "cache": {"status": "ready", "connection_ok": true},
    "message_queue": {"status": "ready", "connection_ok": true},
    "mocks": {"status": "ready", "all_available": true},
    "test_data": {"status": "ready", "accounts_prepared": 10}
  }
}
```

#### 2.2 环境隔离配置

**隔离策略**：

```json
{
  "isolation_config": {
    "test_db": "test_db_isolation_enabled",
    "test_cache_prefix": "test:",
    "network_isolation": "enabled",
    "clean_strategy": "per_suite"
  }
}
```

#### 2.3 Mock服务配置

**配置内容**：

```json
{
  "mock_config": {
    "sms_gateway": {
      "enabled": true,
      "behavior": "record_and_playback",
      "record_file": "mocks/recordings/sms_gateway.json"
    },
    "wechat_auth": {
      "enabled": true,
      "behavior": "simulate_success",
      "user_id": "mock_wechat_123"
    }
  }
}
```

### Step 3: 自动化执行

#### 3.1 执行计划生成

**执行计划**：

```json
{
  "execution_plan": {
    "total_criteria": 12,
    "parallel_groups": [
      {
        "group_id": "group_1",
        "criteria": ["AC001", "AC002"],
        "execution_mode": "sequential",
        "reason": "存在依赖关系（AC002依赖AC001的数据）"
      },
      {
        "group_id": "group_2",
        "criteria": ["AC003", "AC004", "AC005"],
        "execution_mode": "parallel",
        "reason": "相互独立"
      }
    ],
    "estimated_duration_minutes": 25
  }
}
```

#### 3.2 执行引擎配置

**配置示例**：

```json
{
  "execution_config": {
    "runner": "pytest",
    "browsers": ["chrome", "firefox"],
    "retry_config": {
      "enabled": true,
      "max_retries": 2,
      "retry_on_failure": ["timeout", "network_error"]
    },
    "timeout_config": {
      "test_case_timeout": 120,
      "api_call_timeout": 30,
      "page_load_timeout": 60
    },
    "reporting": {
      "generate_html_report": true,
      "generate_json_report": true,
      "screenshots_on_failure": true,
      "video_recording": "on_failure"
    }
  }
}
```

#### 3.3 执行过程监控

**实时状态**：

```json
{
  "execution_progress": {
    "total": 12,
    "executed": 8,
    "passed": 7,
    "failed": 1,
    "skipped": 0,
    "running": 1,
    "estimated_remaining_minutes": 5,
    "current_execution": {
      "criteria_id": "AC008",
      "started_at": "ISO8601",
      "duration_seconds": 15
    }
  }
}
```

### Step 4: 结果判定

#### 4.1 结果聚合

**聚合结果**：

```json
{
  "result_aggregation": {
    "summary": {
      "total_criteria": 12,
      "passed": 10,
      "failed": 2,
      "skipped": 0,
      "pass_rate": 0.83
    },
    "by_priority": {
      "P0": {"total": 4, "passed": 3, "failed": 1},
      "P1": {"total": 5, "passed": 5, "failed": 0},
      "P2": {"total": 3, "passed": 2, "failed": 1}
    },
    "execution_duration_seconds": 1200,
    "automated_execution_rate": 0.92
  }
}
```

#### 4.2 门禁判定

**门禁规则**：

| 条件 | 判定结果 | 处理方式 |
|------|----------|----------|
| P0有失败 | **阻断** | 阻止上线，发送告警 |
| P1失败数 > 2 | **阻断** | 阻止上线，要求修复 |
| 自动化率 < 90% | **阻断** | 阻止上线，增加自动化 |
| P2失败数 > 5 | **警告** | 允许上线，需承诺修复 |

**门禁输出**：

```json
{
  "gate_decision": {
    "passed": false,
    "blocked_by": "P0_FAILURE",
    "blocking_items": [
      {
        "criteria_id": "AC002",
        "priority": "P0",
        "failure_reason": "登录成功后未跳转首页"
      }
    ],
    "release_allowed": false,
    "next_actions": [
      "修复AC002对应缺陷",
      "重新执行验收"
    ]
  }
}
```

### Step 5: 失败用例分析

#### 5.1 失败分类

**分类规则**：

| 失败类型 | 特征 | 处理策略 |
|----------|------|----------|
| 代码缺陷 | 功能未按预期工作 | 提交Bug，要求修复 |
| 环境问题 | 环境配置或数据问题 | 修复环境，重新执行 |
| 测试问题 | 测试脚本自身缺陷 | 修复测试脚本 |
| 数据问题 | 测试数据不准确 | 更新测试数据 |
| 需求变更 | 需求与实现不同步 | 确认是否更新需求 |

**分类输出**：

```json
{
  "failure_analysis": [
    {
      "criteria_id": "AC002",
      "failure_type": "code_defect",
      "evidence": {
        "expected": "页面跳转到首页",
        "actual": "页面停留在登录页",
        "error_message": "Navigation timeout after 30000ms",
        "screenshots": ["screenshots/ac002_failure_1.png"],
        "logs": ["logs/browser_console.log"]
      },
      "root_cause_hypothesis": "登录成功后前端路由跳转逻辑未正确执行",
      "likely_location": "frontend/router/index.ts",
      "confidence": 0.85
    }
  ]
}
```

#### 5.2 修复建议生成

**建议格式**：

```json
{
  "fix_suggestions": [
    {
      "criteria_id": "AC002",
      "fix_type": "code_fix",
      "location": "frontend/pages/login.vue",
      "line_range": "45-60",
      "suggestion": "在登录成功回调中添加router.push('/home')调用",
      "verification_plan": "重新执行AC002验收测试"
    }
  ]
}
```

#### 5.3 回归风险评估

**评估维度**：

```json
{
  "regression_risk": {
    "scope": "limited",
    "affected_stories": ["story_002", "story_003"],
    "risk_level": "medium",
    "reason": "登录模块修改可能影响用户注册流程",
    "recommendations": [
      "建议执行story_002和story_003的回归测试",
      "建议执行登录相关E2E测试套件"
    ]
  }
}
```

## 输出

**存储路径**：`output/pm-development/quality-auto-acceptance/`

**输出文件**：`acceptance_report.json`

**输出Schema**：

```json
{
  "type": "object",
  "required": ["output_id", "story_id", "acceptance_report", "gate_decision"],
  "properties": {
    "output_id": {"type": "string", "description": "输出唯一标识"},
    "story_id": {"type": "string", "description": "Story ID"},
    "build_ref": {"type": "string", "description": "构建版本引用"},
    "executed_at": {"type": "string", "description": "执行时间"},
    "acceptance_report": {"type": "object", "description": "验收报告主体，包含汇总和逐项结果"},
    "failed_cases_analysis": {"type": "array", "description": "失败用例分析，包含根因和修复建议"},
    "gate_decision": {"type": "object", "description": "质量门禁判定结果，包含是否通过和阻断项"}
  }
}
```

### 最终输出结构

```json
{
  "output_id": "acceptance_report_xxx",
  "story_id": "story_001",
  "build_ref": "build_2024_0125_001",
  "executed_at": "ISO8601",
  "acceptance_report": {
    "summary": {
      "total_criteria": 12,
      "passed": 10,
      "failed": 2,
      "pass_rate": 0.83,
      "automated_execution_rate": 0.92
    },
    "criteria_results": [
      {
        "criteria_id": "AC001",
        "status": "passed",
        "execution_time_ms": 1500
      }
    ]
  },
  "failed_cases_analysis": [
    {
      "criteria_id": "AC002",
      "failure_type": "code_defect",
      "evidence": {...},
      "root_cause": "前端路由跳转逻辑错误",
      "fix_suggestion": {...}
    }
  ],
  "gate_decision": {
    "passed": false,
    "blocked_by": "P0_FAILURE",
    "blocking_items": [...]
  }
}
```

### 输出字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| acceptance_report | JSON | 验收报告主体 |
| failed_cases_analysis | JSON | 失败用例分析 |
| gate_decision | JSON | 质量门禁判定结果 |

## 决策规则

### 上线阻断规则

| 条件 | 决策 |
|------|------|
| 存在P0失败 | **立即阻断**，发送紧急告警 |
| 存在P1失败 > 2个 | **立即阻断**，要求修复 |
| 自动化执行率 < 90% | **阻断**，要求提高自动化率 |
| 环境准备失败 | **阻断**，排查环境问题 |

### 通过条件

| 条件 | 要求 |
|------|------|
| P0用例 | 100%通过 |
| P1用例 | ≤ 2个失败 |
| P2用例 | ≤ 5个失败 |
| 自动化率 | ≥ 90% |

## 质量检查

### Quality Gates

| 检查项 | 标准 | 未达标处理 |
|--------|------|------------|
| P0用例通过率 | 100% | 阻断 |
| 自动化执行率 | ≥ 90% | 阻断 |
| 测试环境就绪 | 所有检查项通过 | 阻断 |
| 失败分析完整性 | 包含根因和建议 | 告警 |

### 质量检查清单

- [ ] 所有P0用例已执行且通过
- [ ] 自动化执行率达标
- [ ] 失败用例已有完整分析
- [ ] 失败用例已有修复建议
- [ ] 环境问题已排除

## 降级策略

### 上游文件缺失降级方案

| 缺失范围 | 降级方案 | 输出影响 |
|----------|----------|----------|
| 验收标准缺失 | 用户提供Given-When-Then验收标准 → 生成验收检查清单 | 验收标准需人工编写 |
| 测试环境缺失 | 生成验收检查清单但不执行自动化验收 | 仅输出检查清单，无法自动执行 |
| 验收标准 + 测试环境均缺失 | 用户提供Given-When-Then验收标准 → 生成验收检查清单 | 输出验收检查清单，执行步骤标注"待配置" |

### 数据获取说明

当上游文件缺失时，需用户提供以下信息以支撑降级生成：
- **Given-When-Then验收标准**：每个验收条件的Given/When/Then描述
- **测试环境信息**（可选）：测试环境地址、账号等配置
- **构建版本**（可选）：待验收的构建版本号

## 执行日志

```json
{
  "execution_id": "exec_p5_xxx",
  "pipeline": "quality-auto-acceptance",
  "story_id": "story_001",
  "trigger": "story_completed",
  "started_at": "ISO8601",
  "completed_at": "ISO8601",
  "steps": [
    {"step": "criteria_parsing", "status": "completed", "duration_ms": 200},
    {"step": "environment_preparation", "status": "completed", "duration_ms": 45000},
    {"step": "automated_execution", "status": "completed", "duration_ms": 720000, "passed": 10, "failed": 2},
    {"step": "result_judgment", "status": "completed", "duration_ms": 500},
    {"step": "failure_analysis", "status": "completed", "duration_ms": 3000}
  ],
  "gate_decision": {
    "passed": false,
    "reason": "P0_FAILURE"
  },
  "notifications_sent": ["dev_lead", "product_manager"]
}
```
