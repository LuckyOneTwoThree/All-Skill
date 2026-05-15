---
name: quality-acceptance
description: 当需要生成验收执行计划并生成签收报告时使用。验收执行计划生成+签收报告生成，基于Given-When-Then格式的验收标准生成验收执行计划（P0/P1失败阻断上线），整合验收执行计划、验收标准、遗留问题和签收确认，产出可签收的验收报告。🤖 AI生成计划+AI建议人类审批。关键词：验收执行计划、验收测试、Given-When-Then、质量门禁、上线检查、验收报告、签收报告、UAT报告、验收确认。
metadata:
  module: "产品监控与迭代"
  sub-module: "质量保障"
  type: "pipeline"
  version: "3.1"
  domain_tags: ["互联网", "通用"]
  trigger_examples:
    - "自动跑一下验收测试"
    - "帮我执行验收检查"
    - "看看能不能过质量门禁"
    - "生成验收报告"
    - "版本要验收了，帮我出报告"
    - "整理一下验收结果"
  interaction_mode: "ai_plan"
---

# 验收执行计划生成与签收报告生成

## 核心原则

1. **触发器驱动**：由Story完成和构建成功事件自动触发验收，而非等待人工发起
2. **验收计划生成**：验收标准自动解析，测试环境配置建议生成，执行指令和判定规则自动生成
3. **持续部署**：验收通过即具备发布条件，P0/P1失败立即阻断
4. **实时复盘**：验收结果即时生成，失败用例即时分析根因
5. **标准前置**：验收标准必须在测试前定义，不能测完再定
6. **数据说话**：通过/不通过由数据决定，不由人决定
7. **遗留可追踪**：未通过项必须有处理方案和追踪编号
8. **签收可审计**：签收记录可追溯，责任可界定

## 交互模式

🤖 **AI生成计划**（Step 1）→ 👤 **AI建议人类审批**（Step 2）

触发条件：
- Story开发完成事件
- 代码合入主干事件
- 构建成功事件
- 手动触发（验收负责人请求）

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| Story验收标准 | JSON | 是 | PRD | Given-When-Then格式 |
| 测试用例 | JSON数组 | 是 | PRD | PRD验收标准推导的测试用例 |
| 测试环境配置 | JSON | 是 | 测试系统 | 环境参数和Mock配置建议 |
| 构建产物 | 文件/引用 | 是 | CI/CD | 待验收的构建版本 |
| 测试结果 | JSON | ○ | CI/CD | 自动化测试执行结果 |
| SRS文档 | Markdown | ○ | output/pm-design/design-prd/prd.md | 需求规格（含验收标准，已由 design-prd 覆盖） |
| 版本号 | string | 是 | 用户提供 | 验收的版本号 |
| 验收范围 | string | 是 | 用户提供 | 本次验收的功能范围 |
| 验收方 | string | ○ | 用户提供 | 验收负责人/团队 |
| 后端审查报告 | JSON | ○ | output/backend-architecture/backend-architecture-spec/review_report.json | 后端架构审查结果 |
| API覆盖报告 | JSON | ○ | output/backend-api-design/api-design-spec/api-coverage.json | PRD/前端对齐覆盖报告 |

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

### Step 1: 验收执行计划生成

#### 1.1 验收标准解析

**GWT格式标准化**：

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

| 策略 | 适用场景 | 执行指令生成方式 |
|------|----------|------------------|
| E2E自动化 | 完整用户流程 | Selenium/Cypress执行指令生成 |
| API自动化 | 纯后端功能 | RestAssured/Postman执行指令生成 |
| 单元测试 | 独立函数逻辑 | Jest/JUnit执行指令生成 |
| 集成测试 | 模块间交互 | 混合策略执行指令生成 |

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

#### 1.4 测试环境配置建议

**环境就绪检查**：

| 检查项 | 检查内容 | 超时时间 |
|--------|----------|----------|
| 应用服务 | 服务启动且健康检查通过 | 60s |
| 数据库 | 数据库连接正常，数据就绪 | 30s |
| 缓存服务 | Redis连接正常 | 15s |
| 消息队列 | MQ连接正常 | 15s |
| 第三方Mock | Mock服务可用 | 30s |
| 测试账号 | 测试数据准备完成 | 20s |

**环境隔离配置**：

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

**Mock服务配置建议**：

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

#### 1.5 执行指令生成

**执行计划生成**：

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

**执行引擎配置建议**：

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

#### 1.6 判定规则生成

**结果聚合**：

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

**门禁判定**：

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

#### 1.7 失败分析规则生成

**失败分类**：

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

**修复建议生成**：

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

**回归风险评估**：

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

### Step 2: 签收报告生成

#### 2.1 验收标准提取

从 PRD 和验收标准数据中提取验收标准：

**验收标准分类**：

| 类别 | 说明 | 通过条件 |
|------|------|---------|
| 功能验收 | 核心功能是否按需求实现 | 全部Must需求通过 |
| 性能验收 | 性能指标是否达标 | 关键指标达标率100% |
| 安全验收 | 安全要求是否满足 | 无高危/严重漏洞 |
| 兼容性验收 | 目标平台是否兼容 | 全部目标平台通过 |
| 用户体验验收 | 核心流程是否顺畅 | 无P0级体验问题 |

**每条验收标准**：

| 编号 | 标准描述 | 来源（PRD编号） | 优先级 | 验证方法 |
|------|---------|---------------|--------|---------|
| AC-001 | 用户可在3步内完成注册 | FR-AUTH-001 | Must | 功能测试 |
| AC-002 | 页面首屏加载<2s | NFR-PERF-001 | Must | 性能测试 |

#### 2.2 测试结果整合

整合测试结果，映射到验收标准：

**测试结果汇总**：

| 验收标准 | 测试用例数 | 通过 | 失败 | 阻塞 | 通过率 | 状态 |
|----------|-----------|------|------|------|--------|------|
| AC-001 | 5 | 5 | 0 | 0 | 100% | ✅ |
| AC-002 | 3 | 2 | 1 | 0 | 67% | ❌ |

**整体统计**：

| 指标 | 数值 |
|------|------|
| 总测试用例数 | |
| 通过数 | |
| 失败数 | |
| 阻塞数 | |
| 跳过数 | |
| 总通过率 | |
| Must需求通过率 | |

#### 2.3 缺陷分析

对失败和阻塞的测试用例进行缺陷分析：

**缺陷清单**：

| 缺陷编号 | 关联验收标准 | 严重程度 | 描述 | 复现步骤 | 状态 | 责任人 |
|----------|------------|---------|------|---------|------|--------|
| BUG-001 | AC-002 | 严重 | 首屏加载超时 | 1.打开首页 2.等待 | 待修复 | |

**严重程度定义**：

| 等级 | 定义 | 验收影响 |
|------|------|---------|
| 致命 | 系统崩溃/数据丢失 | 阻塞验收 |
| 严重 | 核心功能不可用 | 阻塞验收 |
| 一般 | 功能受限但有替代方案 | 可带病验收 |
| 轻微 | 体验问题 | 可带病验收 |
| 建议 | 优化建议 | 不影响验收 |

#### 2.4 遗留问题评估

**遗留问题清单**：

| 编号 | 描述 | 严重程度 | 影响范围 | 处理方案 | 预计修复时间 | 风险评估 |
|------|------|---------|---------|---------|------------|---------|
| | | | | 修复/规避/接受 | | |

**遗留问题验收影响判断**：

| 条件 | 验收建议 |
|------|---------|
| 有致命/严重缺陷未修复 | ❌ 不建议通过验收 |
| 仅有一般/轻微缺陷 | ✅ 建议有条件通过，遗留问题列入下版本 |
| 无遗留问题 | ✅ 建议通过验收 |

#### 2.5 验收结论

**验收结论模板**：

```
验收结论：✅ 通过 / ⚠️ 有条件通过 / ❌ 不通过

验收范围：{版本号} {功能范围}
验收日期：{日期}
验收方：{验收方}

通过项：{N}项（占比{X}%）
未通过项：{N}项（占比{X}%）
Must需求通过率：{X}%

遗留问题：{N}个
- 致命/严重：{N}个
- 一般/轻微：{N}个

验收建议：
{具体建议}
```

**签收确认**：

| 角色 | 姓名 | 签收意见 | 签名 | 日期 |
|------|------|---------|------|------|
| 产品负责人 | | 同意/不同意/有条件同意 | | |
| 技术负责人 | | 同意/不同意/有条件同意 | | |
| 测试负责人 | | 同意/不同意/有条件同意 | | |
| 业务方代表 | | 同意/不同意/有条件同意 | | |

#### 2.6 文档组装

**报告结构**：

```
# {产品名} v{版本号} 验收测试报告

## 1. 验收概述
### 1.1 验收范围
### 1.2 验收标准
### 1.3 验收环境

## 2. 验收执行计划
### 2.1 验收标准解析
### 2.2 测试环境配置建议
### 2.3 执行指令与判定规则
### 2.4 门禁判定

## 3. 测试结果汇总
### 3.1 整体统计
### 3.2 验收标准逐项结果
### 3.3 测试覆盖率

## 4. 缺陷分析
### 4.1 缺陷统计
### 4.2 缺陷清单
### 4.3 缺陷趋势

## 5. 遗留问题
### 5.1 遗留问题清单
### 5.2 遗留问题风险评估
### 5.3 处理计划

## 6. 验收结论
### 6.1 结论
### 6.2 遗留问题处理方案
### 6.3 签收确认

## 附录
- 测试用例明细
- 测试环境配置
- 验收标准完整清单
- 失败用例分析详情
```

## 输出

**存储路径**：`output/pm-monitoring/quality-acceptance/`

**输出文件**：

| 文件 | 格式 | 说明 |
|------|------|------|
| acceptance-report.md | Markdown | 完整验收测试报告（含验收执行计划和签收确认） |
| acceptance-report.json | JSON | 结构化数据 |

**输出Schema**：

```json
{
  "type": "object",
  "required": ["output_id", "story_id", "acceptance_report", "gate_decision", "version", "acceptance_date", "conclusion"],
  "properties": {
    "output_id": {"type": "string", "description": "输出唯一标识"},
    "story_id": {"type": "string", "description": "Story ID"},
    "build_ref": {"type": "string", "description": "构建版本引用"},
    "version": {"type": "string", "description": "验收版本号"},
    "acceptance_date": {"type": "string", "description": "验收日期"},
    "acceptance_scope": {"type": "string", "description": "验收功能范围"},
    "acceptance_party": {"type": "string", "description": "验收方"},
    "executed_at": {"type": "string", "description": "执行时间"},
    "acceptance_report": {"type": "object", "description": "验收报告主体，包含汇总和逐项结果"},
    "failed_cases_analysis": {"type": "array", "description": "失败用例分析，包含根因和修复建议"},
    "gate_decision": {"type": "object", "description": "质量门禁判定结果，包含是否通过和阻断项"},
    "criteria_results": {"type": "array", "description": "验收标准逐项结果"},
    "defects": {"type": "array", "description": "缺陷清单"},
    "open_issues": {"type": "array", "description": "遗留问题清单"},
    "conclusion": {"type": "object", "description": "验收结论，包含结果和签收确认"}
  }
}
```

### 最终输出结构

```json
{
  "output_id": "acceptance_report_xxx",
  "story_id": "story_001",
  "build_ref": "build_2024_0125_001",
  "version": "2.3.0",
  "acceptance_date": "2025-03-15",
  "acceptance_scope": "",
  "acceptance_party": "",
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
        "id": "AC-001",
        "description": "",
        "source": "FR-XXX",
        "priority": "Must/Should",
        "test_cases": 0,
        "passed": 0,
        "failed": 0,
        "status": "✅/❌/⚠️"
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
  },
  "defects": [
    {
      "id": "BUG-001",
      "criteria_id": "AC-001",
      "severity": "致命/严重/一般/轻微",
      "description": "",
      "status": "待修复/修复中/已修复"
    }
  ],
  "open_issues": [],
  "conclusion": {
    "result": "通过/有条件通过/不通过",
    "recommendation": "",
    "sign_off": [
      {
        "role": "产品负责人",
        "name": "",
        "opinion": "同意/不同意/有条件同意",
        "signature": "",
        "date": ""
      }
    ]
  }
}
```

### 输出字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| acceptance_report | JSON | 验收报告主体 |
| failed_cases_analysis | JSON | 失败用例分析 |
| gate_decision | JSON | 质量门禁判定结果 |
| criteria_results | JSON | 验收标准逐项结果 |
| defects | JSON | 缺陷清单 |
| open_issues | JSON | 遗留问题清单 |
| conclusion | JSON | 验收结论与签收确认 |

## 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| auto_acceptance | object | 是 | 自动验收根对象 |
| auto_acceptance.execution_summary | object | 是 | 执行摘要 |
| auto_acceptance.execution_summary.total_checks | number | 是 | 检查项总数 |
| auto_acceptance.execution_summary.auto_passed | number | 是 | 自动通过数 |
| auto_acceptance.execution_summary.auto_failed | number | 是 | 自动失败数 |
| auto_acceptance.execution_summary.manual_required | number | 是 | 需人工验证数 |
| auto_acceptance.checks | array | 是 | 检查项列表 |
| auto_acceptance.checks[].id | string | 是 | 检查项编号 |
| auto_acceptance.checks[].type | string | 是 | 检查类型，枚举值：functional/performance/security/compatibility |
| auto_acceptance.checks[].method | string | 是 | 验收方法，枚举值：automated/semi_auto/manual |
| auto_acceptance.checks[].result | string | 是 | 结果，枚举值：pass/fail/pending |
| auto_acceptance.checks[].evidence | object | 否 | 验收证据 |
| auto_acceptance.checks[].confidence | number | 是 | 置信度，0-1 |
| auto_acceptance.gate_result | string | 是 | 门禁结果，枚举值：pass/fail/conditional_pass |
| acceptance_report | object | 是 | 验收报告根对象 |
| acceptance_report.summary | object | 是 | 验收摘要 |
| acceptance_report.summary.total_items | number | 是 | 验收项总数 |
| acceptance_report.summary.passed | number | 是 | 通过项数 |
| acceptance_report.summary.failed | number | 是 | 失败项数 |
| acceptance_report.summary.blocked | number | 是 | 阻断项数 |
| acceptance_report.items | array | 是 | 验收项列表 |
| acceptance_report.items[].id | string | 是 | 验收项编号 |
| acceptance_report.items[].category | string | 是 | 验收类别 |
| acceptance_report.items[].description | string | 是 | 验收描述 |
| acceptance_report.items[].result | string | 是 | 结果，枚举值：pass/fail/blocked/waived |
| acceptance_report.items[].evidence | string | 否 | 证据链接 |
| acceptance_report.items[].severity | string | 是 | 严重级别，枚举值：P0/P1/P2/P3 |
| acceptance_report.risk_assessment | object | 是 | 风险评估 |
| acceptance_report.sign_off | object | 是 | 签收记录 |
| acceptance_report.sign_off.status | string | 是 | 签收状态，枚举值：pending/signed/rejected |

## 上游变更响应

当上游输入发生变更时，本Skill的响应策略：

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| 验收标准变更 | 检查项和方法 | 重新生成受影响的检查项，保留已通过的历史记录 |
| 测试用例变更 | 自动验收检查项 | 更新关联的验收检查项，标记需人类确认 |
| PRD需求变更 | 验收覆盖度 | 重新评估验收覆盖度，标记需人类确认 |
| 代码变更 | 验收执行计划 | 重新生成受影响的验收执行计划 |
| 安全需求变更 | 安全验收项 | 更新安全验收项，重新评估安全风险 |

当验收结果自身变更时，对下游的通知机制：

| 验收变更类型 | 通知范围 | 通知方式 |
|-------------|----------|----------|
| 门禁结果变更 | iteration-orchestrator | 标记门禁变更，触发发布决策更新 |
| P0/P1检查失败 | change-impact-analysis | 标记失败项，触发影响评估 |
| 需人工验证项 | iteration-orchestrator | 标记待验证项，触发人工验收流程 |
| P0/P1失败 | iteration-orchestrator | 标记阻断项，阻止发布流程 |
| 签收状态变更 | iteration-orchestrator | 标记签收状态，触发发布决策 |

---

## 决策规则

### 上线阻断规则

| 条件 | 决策 |
|------|------|
| 存在P0失败 | **立即阻断**，发送紧急告警 |
| 存在P1失败 > 2个 | **立即阻断**，要求修复 |
| 自动化执行率 < 90% | **阻断**，要求提高自动化率 |
| 环境配置建议缺失 | **阻断**，排查环境配置 |
| Must需求通过率<100% | 验收结论为"不通过" |
| 有致命/严重缺陷未修复 | 验收结论为"不通过" |
| 一般缺陷>5个 | 建议修复后重新验收 |

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
| 测试环境配置 | 所有配置建议项已输出 | 阻断 |
| 失败分析完整性 | 包含根因和建议 | 告警 |

### 质量检查清单

- [ ] 所有P0用例执行指令已生成
- [ ] 自动化执行率达标
- [ ] 失败用例分析规则已生成
- [ ] 失败用例已有修复建议
- [ ] 环境配置建议已输出
- [ ] 验收标准逐项有结果
- [ ] Must需求通过率已计算
- [ ] 缺陷按严重程度分类
- [ ] 遗留问题有处理方案
- [ ] 验收结论明确（通过/有条件通过/不通过）
- [ ] 签收确认表已包含

## 降级策略

### 上游文件缺失降级方案

| 缺失范围 | 降级方案 | 输出影响 |
|----------|----------|----------|
| 验收标准缺失 | 用户提供Given-When-Then验收标准 → 生成验收检查清单 | 验收标准需人工编写 |
| 测试环境缺失 | 生成验收检查清单和执行指令，环境配置标注待填写 | 仅输出检查清单和执行指令，环境配置标注待填写 |
| 验收标准 + 测试环境均缺失 | 用户提供Given-When-Then验收标准 → 生成验收检查清单 | 输出验收检查清单，环境配置标注"待配置" |
| 测试结果缺失 | 基于验收标准生成待填报告模板 | 无法自动判断通过/不通过 |
| SRS缺失（已由 design-prd 覆盖） | 验收标准由用户提供 | 需人工定义验收标准 |
| 验收方缺失 | 若用户未提供验收方，提示用户提供或跳过该输入相关步骤 | 签收确认表标注"待指定验收方" |
| 后端审查报告缺失 | 仅基于功能验收标准验收 | 可能遗漏后端架构质量问题 |
| API覆盖报告缺失 | 仅基于PRD验收标准验收 | 可能遗漏API覆盖不完整问题 |

### 数据获取说明

当上游文件缺失时，需用户提供以下信息以支撑降级生成：
- **Given-When-Then验收标准**：每个验收条件的Given/When/Then描述
- **测试环境信息**（可选）：测试环境地址、账号等配置
- **构建版本**（可选）：待验收的构建版本号

## 执行日志

```json
{
  "execution_id": "exec_p5_xxx",
  "pipeline": "quality-acceptance",
  "story_id": "story_001",
  "trigger": "story_completed",
  "started_at": "ISO8601",
  "completed_at": "ISO8601",
  "steps": [
    {"step": "criteria_parsing", "status": "completed", "duration_ms": 200},
    {"step": "environment_config_suggestion", "status": "completed", "duration_ms": 200},
    {"step": "execution_instruction_generation", "status": "completed", "duration_ms": 500, "generated_instructions": 12},
    {"step": "result_judgment", "status": "completed", "duration_ms": 500},
    {"step": "failure_analysis", "status": "completed", "duration_ms": 3000},
    {"step": "report_generation", "status": "completed", "duration_ms": 2000},
    {"step": "sign_off_compilation", "status": "completed", "duration_ms": 500}
  ],
  "gate_decision": {
    "passed": false,
    "reason": "P0_FAILURE"
  },
  "notifications_sent": ["dev_lead", "product_manager"]
}
```

## 版本历史

- v3.1: 迁移至产品监控与迭代模块
- v3.0: 合并 quality-auto-acceptance + quality-acceptance-report