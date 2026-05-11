---
name: quality-auto-test
description: 当需要从PRD自动生成测试用例时使用。测试用例自动生成与追踪，从PRD验收标准、用户故事和异常流程自动生成测试用例，并与代码提交自动关联追踪。包含Happy Path、边界用例和异常用例生成。🤖 AI自动执行。关键词：自动化测试、测试用例生成、测试覆盖率、边界测试、异常测试、自动测试。
metadata:
  module: "产品开发与上线"
  sub-module: "质量保障"
  type: "pipeline"
  version: "1.0"
  interaction_mode: "ai_auto"
---

# Pipeline 4: 测试用例自动生成与追踪

## 核心原则

1. **触发器驱动**：由PRD更新和Story开发完成事件自动触发，而非等待人工发起
2. **自动化验收**：测试用例自动生成，覆盖率自动检查，代码关联自动追踪
3. **持续部署**：测试用例与代码同步更新，确保持续部署时测试覆盖完整
4. **实时复盘**：覆盖率报告即时生成，未覆盖功能点即时告警

## 交互模式

🤖 **AI自动执行**

触发条件：
- PRD更新事件
- Story开发完成事件
- 手动触发（测试负责人请求）

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| PRD | JSON | 是 | PRD管理系统 | 包含验收标准 |
| 技术方案 | JSON | 是 | 技术方案库 | 包含接口和数据模型 |
| 设计稿 | 文件 | 是 | 设计系统 | 用于理解交互细节 |
| 代码库 | 文件 | 是 | 代码仓库 | 用于代码关联追踪 |

### PRD验收标准结构示例

```json
{
  "stories": [
    {
      "story_id": "story_001",
      "title": "手机号验证码登录",
      "acceptance_criteria": [
        {
          "id": "AC001",
          "format": "given_when_then",
          "content": "Given 用户输入有效手机号\nWhen 用户点击获取验证码\nThen 系统发送6位数字验证码到该手机号"
        },
        {
          "id": "AC002",
          "format": "given_when_then",
          "content": "Given 用户收到验证码\nWhen 用户输入正确验证码并提交\nThen 用户登录成功并跳转首页"
        }
      ],
      "boundary_conditions": [
        "手机号格式错误",
        "手机号未注册",
        "验证码输入错误",
        "验证码超时",
        "验证码尝试次数超限"
      ],
      "exception_scenarios": [
        "短信服务不可用",
        "同一手机号高频请求"
      ]
    }
  ]
}
```

## 执行步骤

### Step 1: 从PRD验收标准提取测试用例模板

#### 1.1 GWT格式解析

**解析规则**：

| GWT组件 | 映射到测试用例 |
|---------|----------------|
| Given | 前置条件（Precondition） |
| When | 测试步骤（Test Steps） |
| Then | 预期结果（Expected Result） |

**解析输出示例**：

```json
{
  "test_case_template": {
    "source": "AC001",
    "preconditions": [
      "用户输入有效手机号（11位数字，以1开头）"
    ],
    "test_steps": [
      "1. 用户输入手机号",
      "2. 用户点击获取验证码按钮"
    ],
    "expected_results": [
      "系统发送6位数字验证码到该手机号",
      "验证码5分钟内有效",
      "显示发送成功提示"
    ],
    "test_data": {
      "phone": "13800138000"
    }
  }
}
```

#### 1.2 测试用例类型判定

**类型分类规则**：

| 验收标准类型 | 测试用例类型 |
|--------------|--------------|
| 正常流程描述 | Happy Path用例 |
| 包含"如果"、"假设" | 边界用例 |
| 包含"异常"、"错误"、"失败" | 异常用例 |
| 性能/响应时间要求 | 性能测试用例 |

#### 1.3 测试用例模板输出

```json
{
  "case_templates": [
    {
      "template_id": "T001",
      "story_id": "story_001",
      "acceptance_criteria_id": "AC001",
      "case_type": "happy_path",
      "case_name": "手机号验证码登录-发送验证码",
      "preconditions": ["用户未登录"],
      "test_steps": [
        "输入有效手机号",
        "点击获取验证码"
      ],
      "expected_results": [
        "收到6位数字验证码",
        "显示发送成功提示"
      ],
      "priority": "P0"
    }
  ]
}
```

### Step 2: 从用户故事生成边界用例

#### 2.1 边界条件识别

**识别策略**：

| 识别维度 | 边界类型 | 示例 |
|----------|----------|------|
| 数值边界 | 最大/最小值 | 用户名长度1-20字符 |
| 格式边界 | 有效/无效格式 | 手机号11位数字 |
| 数量边界 | 空/单/批量 | 购物车0件/1件/100件 |
| 时间边界 | 有效期内/外 | 验证码5分钟有效期 |
| 状态边界 | 正常/临界状态 | 余额为0/负数 |

#### 2.2 边界用例生成规则

**等价类划分**：

| 输入类型 | 有效等价类 | 无效等价类 |
|----------|------------|------------|
| 手机号 | 11位数字，1开头 | 少于11位、多于11位、非数字 |
| 验证码 | 6位数字 | 少于6位、多于6位、字母混合 |
| 密码 | 8-20位字母数字 | 少于8位、多于20位、纯数字 |

**边界值测试点**：

```json
{
  "boundary_cases": [
    {
      "case_id": "BC001",
      "story_id": "story_001",
      "boundary_type": "value_boundary",
      "field": "手机号",
      "test_points": [
        {"value": "13700000000", "type": "valid_min", "description": "最小有效值"},
        {"value": "19999999999", "type": "valid_max", "description": "最大有效值"},
        {"value": "1370000000", "type": "invalid_min", "description": "小于最小值"},
        {"value": "138000000000", "type": "invalid_max", "description": "大于最大值"}
      ],
      "expected_behavior": "有效值发送成功，无效值提示错误"
    }
  ]
}
```

#### 2.3 边界用例输出

```json
{
  "generated_boundary_cases": [
    {
      "case_id": "TC_BC_001",
      "case_name": "手机号-10位数字",
      "story_id": "story_001",
      "test_data": {"phone": "1370000000"},
      "expected_result": "提示手机号格式不正确",
      "boundary_type": "underflow",
      "priority": "P1"
    },
    {
      "case_id": "TC_BC_002",
      "case_name": "手机号-12位数字",
      "story_id": "story_001",
      "test_data": {"phone": "137000000000"},
      "expected_result": "提示手机号格式不正确",
      "boundary_type": "overflow",
      "priority": "P1"
    },
    {
      "case_id": "TC_BC_003",
      "case_name": "手机号-包含字母",
      "story_id": "story_001",
      "test_data": {"phone": "1370000000a"},
      "expected_result": "提示手机号格式不正确",
      "boundary_type": "invalid_format",
      "priority": "P1"
    }
  ]
}
```

### Step 3: 从异常流程生成异常用例

#### 3.1 异常场景识别

**异常来源**：

| 来源 | 异常类型 |
|------|----------|
| PRD声明的异常场景 | 显式异常 |
| 技术方案的异常处理 | 实现层面异常 |
| 第三方服务依赖 | 外部服务异常 |
| 网络和基础设施 | 环境异常 |

#### 3.2 异常用例生成

**异常用例模板**：

```json
{
  "exception_cases": [
    {
      "case_id": "TC_EX_001",
      "case_name": "短信服务不可用",
      "story_id": "story_001",
      "exception_type": "external_service_failure",
      "scenario": "短信网关返回超时",
      "injection_method": "mock_sms_gateway_timeout",
      "preconditions": ["用户输入有效手机号"],
      "test_steps": [
        "输入手机号",
        "点击获取验证码",
        "触发短信网关超时"
      ],
      "expected_behavior": "显示服务繁忙提示，允许稍后重试",
      "fallback_expected": "记录异常日志，触发告警",
      "priority": "P1"
    }
  ]
}
```

#### 3.3 Mock策略定义

```json
{
  "mock_strategies": [
    {
      "external_dependency": "短信网关",
      "mock_scenarios": [
        {"scenario": "超时", "response": "timeout", "delay": 30000},
        {"scenario": "返回错误", "response": {"code": 500, "message": "内部错误"}},
        {"scenario": "返回空", "response": null}
      ],
      "mock_framework": "mountebank",
      "config_file": "mocks/sms_gateway.json"
    }
  ]
}
```

### Step 4: 测试用例与代码提交自动关联追踪

#### 4.1 代码-用例映射规则

**映射维度**：

| 维度 | 映射方法 |
|------|----------|
| 接口级别 | API路径+HTTP方法 |
| 函数级别 | 函数名匹配 |
| 业务逻辑 | 规则模式匹配 |
| 数据层 | 数据库操作识别 |

#### 4.2 代码追踪配置

```json
{
  "code_tracking_config": {
    "tracking_level": "function",
    "commit_message_pattern": "story_{story_id}_case_{case_id}",
    "git_hooks": {
      "pre_commit": "validate_test_association",
      "commit_msg": "enforce_story_case_format"
    },
    "ci_integration": {
      "run_tests_on_commit": true,
      "report_coverage": true,
      "block_on_uncovered": true
    }
  }
}
```

#### 4.3 关联追踪输出

```json
{
  "code_case_mapping": [
    {
      "case_id": "TC_HP_001",
      "case_name": "发送验证码-正常流程",
      "code_files": [
        {"file": "backend/api/sms.py", "function": "send_verification_code", "covered": true},
        {"file": "backend/service/sms_service.py", "function": "generate_code", "covered": true}
      ],
      "last_commit": "abc123def",
      "last_verified": "ISO8601",
      "coverage_status": "covered"
    },
    {
      "case_id": "TC_BC_001",
      "case_name": "手机号-10位数字",
      "code_files": [
        {"file": "backend/validator/phone.py", "function": "validate_phone", "covered": true}
      ],
      "last_commit": "abc123def",
      "last_verified": "ISO8601",
      "coverage_status": "covered"
    }
  ]
}
```

## 输出

**存储路径**：`output/pm-development/quality-auto-test/`

**输出文件**：`test_cases.json`

**输出Schema**：

```json
{
  "type": "object",
  "required": ["output_id", "test_cases", "coverage_report"],
  "properties": {
    "output_id": {"type": "string", "description": "输出唯一标识"},
    "generated_at": {"type": "string", "description": "生成时间"},
    "source_prd_version": {"type": "string", "description": "来源PRD版本号"},
    "test_cases": {"type": "array", "description": "所有生成的测试用例，包含Happy Path/边界/异常用例"},
    "coverage_report": {"type": "object", "description": "覆盖率统计报告，包含各类型覆盖率"},
    "code_case_mapping": {"type": "array", "description": "用例与代码的映射关系"},
    "unmapped_cases": {"type": "array", "description": "未关联到代码的用例"}
  }
}
```

### 最终输出结构

```json
{
  "output_id": "test_cases_v1",
  "generated_at": "ISO8601",
  "source_prd_version": "1.3.0",
  "test_cases": [
    {
      "case_id": "TC_001",
      "case_name": "发送验证码-正常流程",
      "story_id": "story_001",
      "case_type": "happy_path",
      "priority": "P0",
      "preconditions": [...],
      "test_steps": [...],
      "expected_results": [...],
      "test_data": {...},
      "automated": true,
      "script_location": "tests/e2e/test_login.py::test_send_code_success"
    }
  ],
  "coverage_report": {
    "happy_path": {
      "total": 10,
      "covered": 10,
      "coverage_rate": 1.0
    },
    "boundary": {
      "total": 30,
      "covered": 28,
      "min_per_story": 3,
      "below_threshold": []
    },
    "exception": {
      "total": 15,
      "covered": 14,
      "missing": ["story_003_网络中断恢复"]
    },
    "overall_coverage": 0.93
  },
  "code_case_mapping": [...],
  "unmapped_cases": []
}
```

### 输出字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| test_cases | JSON数组 | 所有生成的测试用例 |
| coverage_report | JSON | 覆盖率统计报告 |
| code_case_mapping | JSON | 用例与代码的映射关系 |
| unmapped_cases | JSON数组 | 未关联到代码的用例 |

## 决策规则

### 覆盖率决策

| 条件 | 决策 |
|------|------|
| 覆盖率 < 80% | **升级人工审查**，列出未覆盖的功能点 |
| 覆盖率 ≥ 80% | 正常通过，列出覆盖情况 |
| Happy Path未全覆盖 | **必须人工确认**是否为有意为之 |
| 单个Story边界用例 < 3 | 自动补充或告警要求补充 |

### 自动化可行性判断

| 条件 | 决策 |
|------|------|
| UI交互类用例 | 优先自动化 |
| 纯后端逻辑用例 | 必须自动化 |
| 需要人工判断的用例 | 标记为手动执行 |
| 涉及第三方不可控系统 | 标记为手动执行，配置Mock |

## 质量检查

### Quality Gates

| 检查项 | 标准 | 未达标处理 |
|--------|------|------------|
| Happy Path覆盖 | 100%覆盖 | 阻止进入下一阶段 |
| 边界用例数量 | 每Story ≥ 3个 | 自动补充或告警 |
| 异常用例完整 | 所有声明异常都有用例 | 补充缺失用例 |
| 代码关联率 | ≥ 90%用例有代码关联 | 告警要求确认 |

### 质量检查清单

- [ ] Happy Path用例已生成且完整
- [ ] 边界用例数量达标（每Story ≥ 3）
- [ ] 异常用例覆盖所有声明场景
- [ ] 所有用例已关联到代码文件
- [ ] 自动化脚本路径已生成

## 降级策略

### 上游文件缺失降级方案

| 缺失范围 | 降级方案 | 输出影响 |
|----------|----------|----------|
| PRD缺失 | 用户提供功能描述 → 基于描述生成测试用例 | 验收标准缺失，测试用例基于功能描述推断 |
| 技术方案缺失 | 跳过接口和数据模型相关的测试用例生成 | API测试和数据层测试用例缺失 |
| 设计稿缺失 | 跳过交互细节相关的测试用例生成 | UI交互测试用例简化 |
| PRD + 技术方案 + 设计稿均缺失 | 用户提供功能描述 → 基于描述生成测试用例 | 输出基础测试用例，边界和异常用例标注"待补充" |

### 数据获取说明

当上游文件缺失时，需用户提供以下信息以支撑降级生成：
- **功能描述**：需要测试的功能模块和功能点
- **核心业务流程**（可选）：用户使用产品的主要操作步骤
- **已知边界条件**（可选）：需要特别测试的边界场景

## 执行日志

```json
{
  "execution_id": "exec_p4_xxx",
  "pipeline": "quality-auto-test",
  "trigger": "prd_update",
  "started_at": "ISO8601",
  "completed_at": "ISO8601",
  "steps": [
    {"step": "extract_templates", "status": "completed", "duration_ms": 800, "cases_generated": 12},
    {"step": "generate_boundary_cases", "status": "completed", "duration_ms": 1200, "cases_generated": 30},
    {"step": "generate_exception_cases", "status": "completed", "duration_ms": 1000, "cases_generated": 15},
    {"step": "code_tracking", "status": "completed", "duration_ms": 600, "mapping_rate": 0.95}
  ],
  "output": {
    "total_cases": 57,
    "automated_cases": 52,
    "manual_cases": 5,
    "overall_coverage": 0.93
  },
  "quality_checks": {
    "happy_path_coverage": 1.0,
    "boundary_cases_threshold_met": true,
    "exception_coverage_complete": true
  }
}
```
