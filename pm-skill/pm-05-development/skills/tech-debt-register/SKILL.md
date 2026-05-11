---
name: tech-debt-register
description: 当需要系统化管理技术债务或评估技术债务优先级时使用。技术债务登记册自动生成，包含债务识别与分类、影响评估、偿还优先级排序、偿还计划和预防策略。关键词：技术债务、技术债务登记、代码债务、架构债务、债务偿还、债务预防。
metadata:
  module: "产品开发与上线"
  sub-module: "开发交付"
  type: "pipeline"
  version: "1.0"
  interaction_mode: "ai_suggest_human_approve"
  upstream:
    - development-auto-review
    - development-prd-sync
---

# 技术债务登记册生成

## 核心原则

**技术债务不是罪恶，忽视才是**

技术债务和金融债务一样，本身不是坏事——关键在于是否有意识地借债、有计划地还债。技术债务登记册让隐性的技术债务显性化、可量化、可管理。

## 输入

| 输入项 | 来源 | 必需 | 说明 |
|--------|------|------|------|
| 代码审查结果 | development-auto-review | ⬜ | 代码质量问题、架构违规 |
| PRD同步记录 | development-prd-sync | ⬜ | 需求变更导致的技术妥协 |
| 技术信息 | 用户提供 | ✅ | 代码库状态、架构现状、团队反馈 |

### 降级策略

| 缺失输入 | 降级方案 |
|----------|----------|
| 无代码审查结果 | 基于团队反馈和用户提供信息识别债务，标注"待代码审查验证" |
| 无PRD同步记录 | 跳过需求变更导致的债务识别，标注"待PRD同步补充" |
| 无技术信息 | 无法生成，要求用户提供基本技术背景 |

## 执行步骤

### Step 1：债务识别与分类

从多个维度识别技术债务：

1. **代码债务**：
   - 重复代码 / 过长函数 / 过深嵌套
   - 硬编码 / 魔法数字 / 未使用的代码
   - 缺失的错误处理 / 不一致的命名
2. **架构债务**：
   - 循环依赖 / 紧耦合 / 单体膨胀
   - 缺失的抽象层 / 不合理的职责划分
   - 同步调用应异步 / 缺失的缓存层
3. **测试债务**：
   - 核心流程无测试 / 测试覆盖率低
   - 脆弱测试 / 过慢的测试
   - 缺失的集成测试 / E2E测试
4. **文档债务**：
   - API文档缺失 / 架构文档过时
   - 缺失的README / 部署文档不完整
5. **基础设施债务**：
   - 手动部署 / 缺失的CI/CD
   - 监控缺失 / 日志不规范
   - 安全补丁未更新

### Step 2：影响评估

对每项技术债务进行多维度影响评估：

1. **开发效率影响**：拖慢开发速度的程度（1-5分）
2. **系统稳定性影响**：导致故障的风险（1-5分）
3. **可维护性影响**：增加维护成本的程度（1-5分）
4. **可扩展性影响**：阻碍功能扩展的程度（1-5分）
5. **团队士气影响**：影响团队工作体验的程度（1-5分）
6. **复合利息**：不偿还时每Sprint增加的额外成本

### Step 3：偿还优先级排序

基于影响评估和偿还成本计算优先级：

1. **优先级评分**：(影响总分 × 复合利息) / 偿还成本
2. **紧急度分类**：
   - 🔴 紧急：影响生产稳定性，本Sprint必须偿还
   - 🟠 高优：显著影响开发效率，2个Sprint内偿还
   - 🟡 中优：影响可维护性，季度内偿还
   - 🟢 低优：影响较小，半年内偿还
3. **偿还时机建议**：
   - 伴随功能开发偿还（Boy Scout Rule）
   - 专项偿还Sprint
   - 重构周/技术日

### Step 4：偿还计划

制定可执行的偿还计划：

1. **Sprint分配**：每个Sprint预留15-20%容量用于技术债务偿还
2. **偿还路线图**：按优先级排列的偿还时间线
3. **验收标准**：每项债务偿还的验收标准
4. **回滚方案**：偿还失败的回滚策略

### Step 5：预防策略

制定技术债务预防策略：

1. **编码规范**：代码审查检查清单、静态分析规则
2. **架构守护**：架构决策记录(ADR)、架构 Fitness Function
3. **测试策略**：测试金字塔、覆盖率门禁
4. **持续监控**：技术债务看板、Sprint健康度追踪
5. **借债审批**：有意识借债的审批流程和记录模板

### Step 6：报告组装

将以上内容组装为完整技术债务登记册。

## 输出

### 输出文件

| 文件 | 路径 | 说明 |
|------|------|------|
| 技术债务登记册 | `output/pm-development/tech-debt-register/tech-debt-register.md` | 人类可读的完整登记册 |
| 结构化数据 | `output/pm-development/tech-debt-register/tech-debt-register.json` | 机器可消费的结构化数据 |

**输出Schema**：

```json
{
  "type": "object",
  "required": ["product_name", "summary", "debts"],
  "properties": {
    "product_name": {"type": "string", "description": "产品名称"},
    "report_date": {"type": "string", "description": "报告日期"},
    "summary": {"type": "object", "description": "债务概览，包含总数、分类分布和偿还进度"},
    "debts": {"type": "array", "description": "债务清单，包含类型、影响评分、优先级和偿还计划"},
    "prevention_strategies": {"type": "array", "description": "预防策略列表"}
  }
}
```

### Markdown 报告结构

```markdown
# 技术债务登记册：{产品名称}

## 1. 概览
- 债务总览（按类型/优先级分布）
- 偿还进度追踪
- 本Sprint偿还计划

## 2. 债务清单
### 2.1 🔴 紧急债务
| ID | 类型 | 描述 | 影响 | 偿还方案 | 负责人 | 截止日期 |

### 2.2 🟠 高优债务
### 2.3 🟡 中优债务
### 2.4 🟢 低优债务

## 3. 偿还计划
- Sprint容量分配
- 偿还路线图
- 验收标准

## 4. 预防策略
- 编码规范
- 架构守护
- 测试策略
- 借债审批流程

## 5. 统计与趋势
- 债务新增/偿还趋势
- 按模块分布
- 利息成本估算
```

### JSON 结构

```json
{
  "product_name": "",
  "report_date": "",
  "summary": {
    "total_count": 0,
    "by_type": {},
    "by_priority": {},
    "repaid_this_sprint": 0
  },
  "debts": [
    {
      "id": "TD-001",
      "type": "code|architecture|test|doc|infra",
      "description": "",
      "location": "",
      "impact_scores": {
        "dev_efficiency": 0,
        "stability": 0,
        "maintainability": 0,
        "scalability": 0,
        "team_morale": 0
      },
      "compound_interest": "",
      "repayment_cost": "",
      "priority": "urgent|high|medium|low",
      "repayment_plan": "",
      "acceptance_criteria": "",
      "owner": "",
      "deadline": ""
    }
  ],
  "prevention_strategies": []
}
```

## 质量检查

| 检查项 | 标准 | 不通过处理 |
|--------|------|------------|
| 债务分类完整 | 5类债务均有扫描 | 补充缺失类型 |
| 影响评估量化 | 每项债务有5维评分 | 补充缺失维度 |
| 优先级有依据 | 优先级基于影响×利息/成本计算 | 重新计算优先级 |
| 偿还计划可执行 | 紧急/高优债务有Sprint分配 | 补充偿还时间线 |
