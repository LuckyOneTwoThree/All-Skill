---
name: development-task-breakdown
description: 当需要将PRD分解为开发任务时使用。PRD任务分解消费与开发深化，将PRD Pipeline输出的任务分解结构进行技术深化、Sprint分配和依赖检测，输出可直接进入开发阶段的Epic→Story→Task结构。🤖 AI自动执行。关键词：任务分解、Epic拆分、Story拆分、Sprint任务、开发规划、开发任务拆分。
metadata:
  module: "产品开发与上线"
  sub-module: "开发交付"
  type: "pipeline"
  version: "1.0"
  interaction_mode: "ai_auto"
---

# Pipeline 1: PRD任务分解消费与开发深化

## 核心原则

1. **触发器驱动**：由PRD任务分解完成事件自动触发，而非人工调度
2. **自动化验收**：门禁校验自动化，Sprint分配冲突自动检测
3. **持续部署**：任务分解结果直接对接开发流水线，缩短从需求到开发的等待时间
4. **实时复盘**：任务分解完成后即时生成依赖图谱和风险提示

## 交互模式

🤖 **AI自动执行**

消费PRD Pipeline 4.6输出，触发条件：PRD任务分解完成且门禁校验通过。

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| prd_task_breakdown | JSON | 是 | PRD Pipeline | PRD输出的任务分解结构 |
| prd_quality_gates | JSON | 是 | PRD Pipeline | PRD门禁校验结果 |
| tech_stack | JSON | 是 | 技术规范库 | 技术栈配置 |
| team_capacity | JSON | 是 | 团队配置 | 团队成员能力与容量 |
| sprint_calendar | JSON | 是 | 项目日历 | Sprint排期计划 |

### prd_task_breakdown 结构示例

```json
{
  "epics": [
    {
      "id": "epic_001",
      "title": "用户登录模块",
      "description": "支持多方式登录",
      "stories": [
        {
          "id": "story_001",
          "title": "手机号验证码登录",
          "acceptance_criteria": ["用户输入手机号", "系统发送验证码", "验证码5分钟有效"],
          "tasks": [
            {
              "id": "task_001",
              "title": "开发短信验证码API",
              "type": "backend"
            }
          ]
        }
      ]
    }
  ]
}
```

## 执行步骤

### Step 1: PRD任务分解消费

#### 1.1 门禁校验

**校验规则**：

| 门禁项 | 检查内容 | 未通过处理 |
|--------|----------|------------|
| 版本一致性 | PRD版本号与prd_task_breakdown版本号一致 | 拒绝并要求对齐 |
| 完整性检查 | Epic/Story/Task层级完整 | 拒绝并列出缺失项 |
| 验收标准 | 每个Story都有验收标准 | 拒绝并要求补充 |
| 依赖声明 | Epic间依赖已声明 | 警告但不阻塞 |

#### 1.2 需求理解深化

- 识别隐含的业务规则
- 补充技术约束条件
- 标注需要确认的点

### Step 2: 技术方案深化

#### 2.1 前端深化

**深化内容**：

| 深化项 | 输出 |
|--------|------|
| 组件拆分 | 识别可复用组件 |
| 状态管理 | 明确状态来源与更新逻辑 |
| API调用 | 明确调用接口与参数 |
| 异常处理 | 定义前端异常场景 |

**输出格式**：

```json
{
  "frontend_tasks": [
    {
      "task_id": "task_001",
      "components": ["Button", "Input"],
      "state_management": "React Context",
      "api_calls": [
        {"method": "POST", "endpoint": "/api/sms/send", "params": ["phone"]}
      ],
      "error_scenarios": ["网络错误", "接口超时", "验证码错误"]
    }
  ]
}
```

#### 2.2 后端深化

**深化内容**：

| 深化项 | 输出 |
|--------|------|
| 接口设计 | RESTful API定义 |
| 数据模型 | 数据库表结构 |
| 业务逻辑 | 核心算法与流程 |
| 性能要求 | QPS、响应时间要求 |

**输出格式**：

```json
{
  "backend_tasks": [
    {
      "task_id": "task_001",
      "apis": [
        {
          "method": "POST",
          "path": "/api/sms/send",
          "request": {"phone": "string(11)"},
          "response": {"code": "string", "message": "string"}
        }
      ],
      "data_models": [
        {
          "table": "sms_code",
          "fields": [
            {"name": "phone", "type": "varchar(11)", "index": true},
            {"name": "code", "type": "varchar(6)"},
            {"name": "expire_at", "type": "datetime"}
          ]
        }
      ],
      "business_rules": ["验证码6位数字", "有效期5分钟", "同一手机号60秒限制"]
    }
  ]
}
```

#### 2.3 测试深化

**深化内容**：

| 深化项 | 输出 |
|--------|------|
| 测试策略 | 单元/集成/E2E分层 |
| 关键路径 | 必测的业务流程 |
| 边界条件 | 需要测试的边界值 |
| Mock策略 | 外部依赖如何Mock |

**输出格式**：

```json
{
  "test_strategies": [
    {
      "story_id": "story_001",
      "unit_test_coverage": ["验证码生成逻辑", "有效期校验逻辑"],
      "integration_test_cases": ["发送验证码流程", "验证码登录流程"],
      "e2e_test_scenarios": ["完整登录流程"]
    }
  ]
}
```

### Step 3: Sprint分配

#### 3.1 容量计算

**输入**：
- team_capacity: 团队成员及其可用工时
- sprint_calendar: Sprint周期与工作日

**计算公式**：

```
可用容量 = Σ(成员可用工时 × 专注度系数)
建议任务量 = 可用容量 × 0.8  // 保留20%缓冲
```

#### 3.2 分配策略

| 策略 | 适用场景 |
|------|----------|
| 技能匹配优先 | 技术深度要求高的任务 |
| 故事完整性优先 | 保持Story内任务由同一人完成 |
| 负载均衡优先 | 多个并行任务需要协同 |

#### 3.3 输出格式

```json
{
  "sprint_assignments": [
    {
      "sprint_id": "sprint_2024_w01",
      "start_date": "2024-01-02",
      "end_date": "2024-01-12",
      "stories": [
        {
          "story_id": "story_001",
          "owner": "developer_zhang",
          "estimated_hours": 16,
          "tasks": [
            {"task_id": "task_001", "owner": "developer_zhang", "hours": 4}
          ]
        }
      ],
      "total_hours": 120,
      "available_hours": 120
    }
  ]
}
```

### Step 4: 依赖检测

#### 4.1 Epic间依赖

**检测类型**：

| 依赖类型 | 描述 | 风险等级 |
|----------|------|----------|
| 数据依赖 | A的数据是B的输入 | 高 |
| 服务依赖 | A调用B的服务 | 中 |
| 时间依赖 | B必须等A完成后才能开始 | 高 |
| 资源依赖 | 需要相同的技术资源 | 低 |

**检测规则**：

```json
{
  "epic_dependencies": [
    {
      "from": "epic_001",
      "to": "epic_002",
      "type": "data_dependency",
      "description": "用户中心数据被订单中心依赖",
      "risk_level": "high",
      "mitigation": "epic_001核心数据模型需提前定义"
    }
  ]
}
```

#### 4.2 Story间依赖

**检测规则**：
- 同一Epic内的Story是否有数据流依赖
- 不同Epic的Story是否有接口依赖

#### 4.3 输出格式

```json
{
  "dependency_graph": {
    "nodes": [
      {"id": "epic_001", "label": "用户登录模块"},
      {"id": "epic_002", "label": "订单模块"}
    ],
    "edges": [
      {
        "from": "epic_001",
        "to": "epic_002",
        "type": "api_dependency",
        "description": "订单创建需要用户登录态"
      }
    ]
  }
}
```

## 输出

**存储路径**：`output/pm-development/development-task-breakdown/`

**输出文件**：`task_breakdown.json`

**输出Schema**：

```json
{
  "type": "object",
  "required": ["output_id", "source_prd_version", "epic_story_task"],
  "properties": {
    "output_id": {"type": "string", "description": "输出唯一标识"},
    "source_prd_version": {"type": "string", "description": "来源PRD版本号"},
    "generated_at": {"type": "string", "description": "生成时间"},
    "epic_story_task": {"type": "object", "description": "深化后的完整任务结构，包含Epics/Stories/Tasks"},
    "sprint_assignment": {"type": "object", "description": "Sprint分配结果，包含Sprint列表和任务分配"},
    "dependency_graph": {"type": "object", "description": "依赖关系图，包含节点和边"},
    "tech_clarifications": {"type": "object", "description": "技术细节澄清，包含前端/后端/测试深化内容"}
  }
}
```

### 最终输出结构

```json
{
  "output_id": "task_breakdown_v1",
  "source_prd_version": "1.2.0",
  "generated_at": "ISO8601",
  "epic_story_task": {
    "epics": [...],
    "stories": [...],
    "tasks": [...]
  },
  "sprint_assignment": {
    "sprints": [...]
  },
  "dependency_graph": {
    "nodes": [...],
    "edges": [...]
  },
  "tech_clarifications": {
    "frontend": [...],
    "backend": [...],
    "test": [...]
  }
}
```

### 输出字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| epic_story_task | JSON | 深化后的完整任务结构 |
| sprint_assignment | JSON | Sprint分配结果 |
| dependency_graph | JSON | 依赖关系图 |
| tech_clarifications | JSON | 技术细节澄清 |

## 决策规则

### 门禁决策

| 条件 | 决策 |
|------|------|
| PRD门禁未通过 | **阻止进入开发**，返回详细校验报告 |
| PRD门禁通过 | 进入Step 2技术方案深化 |
| 存在Epic间高风险依赖 | **告警**，但不阻塞，生成缓解建议 |

### Sprint分配决策

| 条件 | 决策 |
|------|------|
| Sprint容量不足 | 提示优先级调整，返回优化建议 |
| 存在未分配任务 | 告警，要求手动分配 |
| 依赖关系导致无法并行 | 重新排列Sprint顺序 |

## 质量检查

### Quality Gates

| 检查项 | 标准 | 未达标处理 |
|--------|------|------------|
| 任务分解完整性 | Epic→Story→Task三级完整 | 返回补充 |
| Sprint分配覆盖率 | 所有任务已分配 | 返回补充 |
| 依赖关系识别率 | Epic间依赖100%识别 | 警告+人工确认 |
| 技术方案完整性 | 每个Task都有前端/后端/测试细化 | 返回补充 |

## 降级策略

### 上游文件缺失降级方案

| 缺失范围 | 降级方案 | 输出影响 |
|----------|----------|----------|
| PRD任务分解缺失 | 用户提供PRD文本 → 直接分解任务 | 任务分解基于文本解析，可能遗漏隐含需求 |
| 技术栈缺失 | 使用通用技术栈模板，标注"待确认" | 技术方案深化基于通用假设 |
| 团队容量缺失 | 跳过Sprint分配步骤，输出任务分解但不分配 | 无Sprint分配结果，需人工排期 |
| PRD + 技术栈 + 团队容量均缺失 | 用户提供PRD文本 → 直接分解任务 | 输出Epic→Story→Task结构，技术细节和排期待补充 |

### 数据获取说明

当上游文件缺失时，需用户提供以下信息以支撑降级生成：
- **PRD文本**：产品需求文档内容（核心输入）
- **技术栈偏好**（可选）：前端/后端技术框架
- **团队规模**（可选）：开发团队人数和角色配置

## 执行日志

```json
{
  "execution_id": "exec_p1_xxx",
  "pipeline": "development-task-breakdown",
  "started_at": "ISO8601",
  "completed_at": "ISO8601",
  "steps": [
    {"step": "step_1", "status": "completed", "duration_ms": 1200},
    {"step": "step_2", "status": "completed", "duration_ms": 3500},
    {"step": "step_3", "status": "completed", "duration_ms": 800},
    {"step": "step_4", "status": "completed", "duration_ms": 600}
  ],
  "output_ref": "output_ref_xxx"
}
```
