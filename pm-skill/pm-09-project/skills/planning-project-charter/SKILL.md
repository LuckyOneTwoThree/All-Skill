---
name: planning-project-charter
description: 当需要生成项目宪章文档时使用。项目宪章自动生成，将产品背景、战略目标、资源约束转化为正式的项目宪章文档，包含背景、目标与范围、成功标准、利益相关方、初步风险评估、资源需求和时间线。关键词：项目宪章、项目章程、项目目标、项目范围、成功标准。
metadata:
  module: "项目管理与执行"
  sub-module: "项目规划"
  type: "pipeline"
  version: "1.0"
  interaction_mode: "ai_suggest_human_approve"
---

# Pipeline 1: 项目宪章自动生成

## 核心原则

1. **透明度即协作**：项目宪章全员可见，目标、范围、成功标准信息透明，消除信息不对称
2. **风险前置**：在宪章生成阶段即识别初步风险，建立风险登记册雏形
3. **自动化追踪**：宪章审批状态、变更记录自动追踪，减少人工汇报负担

## 交互模式

**🤖→👤 AI建议人类审批**

- AI自动完成Step 1-6，生成完整的项目宪章草稿
- 人类审批重点：目标定义、范围边界、成功标准、利益相关方识别
- 人类可要求AI修改特定部分，AI重新生成
- 人类批准后，宪章正式生效

---

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| product_background | string | 是 | 用户提供 | 产品背景信息 |
| strategic_goals | string[] | 是 | 用户提供 | 战略目标列表 |
| resource_constraints | object | ○ | 用户提供 | 资源约束条件 |

---

## 执行步骤

### Step 1: 项目背景自动整理

**动作**：
- 提取关键产品信息（产品名称、定位、核心价值）
- 整理市场背景和竞争环境
- 识别项目起源和驱动因素
- 生成简洁的项目背景描述（200字以内）

**输出**：
```json
{
  "background_summary": "string",
  "product_info": {
    "name": "string",
    "positioning": "string",
    "core_value": "string"
  },
  "market_context": "string",
  "project_drivers": ["string"]
}
```

### Step 2: 目标与范围自动定义

**动作**：
- 将战略目标分解为可衡量的项目目标
- 区分项目范围（做什么）和非项目范围（不做什么）
- 明确风险范围（可能导致目标偏离的因素）
- 生成SMART目标描述

**输出**：
```json
{
  "objectives": [{
    "id": "OBJ-001",
    "description": "string",
    "measurable": "string",
    "target_date": "ISO date"
  }],
  "scope": {
    "in_scope": ["string"],
    "out_of_scope": ["string"]
  },
  "risk_scope": ["string"]
}
```

### Step 3: 成功标准自动量化

**动作**：
- 为每个目标定义可量化的成功标准
- 确定关键绩效指标（KPIs）
- 设置基准值和目标值
- 区分"必须达成"和"期望达成"

**输出**：
```json
{
  "success_criteria": [{
    "objective_id": "OBJ-001",
    "kpi": "string",
    "baseline": "number",
    "target": "number",
    "measurement_method": "string",
    "must_achieve": true | false
  }]
}
```

### Step 4: 利益相关方自动识别

**动作**：
- 扫描项目涉及的利益相关方（人员、团队、部门）
- 评估各方的利益诉求和影响力
- 确定关键决策者和审批者
- 生成利益相关方矩阵

**输出**：
```json
{
  "stakeholders": [{
    "name": "string",
    "role": "string",
    "interest": "string",
    "influence": "high | medium | low",
    "engagement_level": "string"
  }],
  "key_decision_makers": ["string"],
  "approval_required": ["string"]
}
```

### Step 5: 风险初步评估

**动作**：
- 基于项目背景识别初步风险
- 评估每个风险的概率和影响
- 建议初步应对策略
- 按优先级排序

**输出**：
```json
{
  "initial_risk_assessment": [{
    "id": "RISK-001",
    "description": "string",
    "category": "technical | team | external | business",
    "probability": 0.0-1.0,
    "impact": 0.0-1.0,
    "priority": "high | medium | low",
    "initial_mitigation": "string"
  }]
}
```

### Step 6: 项目宪章文档生成

**动作**：
- 整合以上5个步骤的输出
- 生成正式的项目宪章文档
- 格式化输出为结构化文档
- 准备人类审批版本

**输出**：
```yaml
# project_charter

## 基本信息
- 项目名称：
- 宪章版本：
- 生效日期：
- 宪章负责人：

## 1. 项目背景
{Step 1 输出}

## 2. 目标与范围
{Step 2 输出}

## 3. 成功标准
{Step 3 输出}

## 4. 利益相关方
{Step 4 输出}

## 5. 初步风险评估
{Step 5 输出}

## 6. 资源需求摘要
{根据已有信息估算}

## 7. 时间线摘要
{根据已有信息估算}

## 审批签字
- 项目发起人：
- 项目经理：
- 日期：
```

---

## 输出

**存储路径**：`output/pm-project/planning-project-charter/`

**输出文件**：project_charter.json、metadata.json

**输出Schema**：

```json
{
  "type": "object",
  "required": ["project_charter", "metadata"],
  "properties": {
    "project_charter": {"type": "object", "description": "项目宪章，包含背景、目标、成功标准、干系人和风险评估"},
    "metadata": {"type": "object", "description": "元数据，包含置信度、生成时间和审批状态"}
  }
}
```

```json
{
  "project_charter": {
    "background": {
      "summary": "string",
      "product_info": {},
      "market_context": "string",
      "project_drivers": []
    },
    "objectives": {
      "scope": {},
      "risk_scope": []
    },
    "success_criteria": [],
    "stakeholders": [],
    "initial_risk_assessment": [],
    "resource_requirements": {},
    "timeline": {}
  },
  "metadata": {
    "confidence": 0.0-1.0,
    "generated_at": "ISO datetime",
    "human_approval_required": true,
    "approval_status": "pending | approved | rejected"
  }
}
```

---

## 置信度标注

每个Step输出需标注置信度：

| 置信度 | 含义 | 动作 |
|--------|------|------|
| 高（≥0.8） | 数据充分，推断合理 | 可直接使用 |
| 中（0.6-0.8） | 数据基本充分，部分推断 | 建议人工确认 |
| 低（<0.6） | 数据不足或推断不确定性高 | 必须人工审核 |

---

## 决策规则

| 条件 | 动作 |
|------|------|
| 战略目标与项目目标无法对齐 | 升级至人类决策 |
| 利益相关方识别遗漏关键人员 | 升级至人类补充 |
| 成功标准无法量化 | 升级至人类定义 |
| 初步风险数量 > 10 | 选择Top 10，其余归档备选 |

## 质量检查

- [ ] 项目目标符合SMART原则
- [ ] 利益相关方覆盖所有关键角色
- [ ] 成功标准可量化且可验证
- [ ] 初步风险清单包含影响和概率评估

## 降级策略

### 上游文件缺失降级方案

| 缺失的上游输入 | 影响范围 | 降级方案 | 降级输出 |
|---------------|---------|---------|---------|
| 产品背景 | 无法提取项目背景和驱动因素 | 用户描述项目目标和核心价值，AI基于描述生成背景摘要 | 基于用户描述的宪章草案 |
| 战略目标 | 无法分解为可衡量的项目目标 | 用户口述项目期望达成的目标，AI转化为SMART目标 | 基于用户输入的目标定义 |
| 资源约束 | 无法评估资源可行性 | 跳过资源需求估算，宪章中标注"资源需求待评估" | 含资源待评估项的宪章草案 |

### 数据获取说明

当上游文件缺失时，通过以下方式获取必要数据：

1. **产品背景缺失**：请用户描述项目目标、产品定位和核心价值，AI将基于描述整理为结构化的项目背景摘要
2. **战略目标缺失**：请用户口述项目期望达成的业务目标（如"提升转化率20%"），AI将转化为SMART格式的可衡量目标
3. **资源约束缺失**：宪章中资源需求部分标注为"待评估"，建议在资源规划阶段（Pipeline 2）补充完善
