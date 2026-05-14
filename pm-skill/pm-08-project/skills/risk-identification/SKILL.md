---
name: risk-identification
description: 当需要识别和评估项目风险时使用。风险自动识别与评估，持续扫描项目数据、外部数据和历史风险库，自动完成风险识别、评估、优先级排序、策略建议，输出完整的风险登记册。关键词：风险识别、风险评估、风险登记册、风险扫描、风险优先级、风险管理、会出什么问题、风险排查。
metadata:
  module: "项目管理与执行"
  sub-module: "风险管理"
  type: "pipeline"
  version: "3.1"
  domain_tags: ["互联网", "SaaS", "通用"]
  trigger_examples:
    - "项目有什么风险"
    - "帮我识别一下风险"
    - "可能出什么问题"
  interaction_mode: "ai_auto"
---

# 风险自动识别与评估

## 核心原则

1. **透明度即协作**：风险登记册全员可见，风险状态实时同步
2. **风险前置**：在项目启动时即建立风险登记册，持续扫描而非等问题出现才识别
3. **自动化追踪**：风险指标自动监控，触发条件自动检测

## 交互模式

**🤖 AI自动执行（持续运行）**

- 扫描和分析由AI自动完成
- 每小时执行增量检查
- 每日执行完整扫描
- 新风险自动添加到登记册
- 人类可随时查询和审核风险登记册

---

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| project_data | object | 是 | output/pm-project/agile-sprint-planning/sprint_plan.json | 项目数据（进度、变更、依赖） |
| external_data | object | ○ | 用户提供 | 外部数据（行业、技术、竞争） |
| historical_risk_library | object[] | ○ | 用户提供 | 历史风险库 |
| current_risk_register | object | ○ | output/pm-project/risk-identification/risk_register.json | 当前风险登记册（增量更新用） |

---

## 执行步骤

### Step 1: 风险来源自动扫描

**动作**：
- 扫描技术风险来源（架构、技术债务、依赖）
- 扫描团队风险来源（人员、能力、协作）
- 扫描外部风险来源（市场、政策、竞争）
- 扫描业务风险来源（需求、范围、验收）

**输出**：
```json
{
  "risk_sources": {
    "technical": [{
      "source_id": "TECH-001",
      "source_type": "architecture | dependency | quality | security",
      "description": "string",
      "signal_strength": 0.0-1.0,
      "evidence": ["string"]
    }],
    "team": [{
      "source_id": "TEAM-001",
      "source_type": "capacity | skill | collaboration | stability",
      "description": "string",
      "signal_strength": 0.0-1.0,
      "evidence": ["string"]
    }],
    "external": [{
      "source_id": "EXT-001",
      "source_type": "market | regulatory | competitive | environmental",
      "description": "string",
      "signal_strength": 0.0-1.0,
      "evidence": ["string"]
    }],
    "business": [{
      "source_id": "BIZ-001",
      "source_type": "requirement | scope | stakeholder | acceptance",
      "description": "string",
      "signal_strength": 0.0-1.0,
      "evidence": ["string"]
    }]
  }
}
```

### Step 2: 风险自动评估

**动作**：
- 为每个识别出的风险评估发生概率（P）
- 为每个风险评估影响程度（I）
- 计算风险分值（RS = P × I）
- 标注评估置信度

**输出**：
```json
{
  "risk_assessments": [{
    "risk_id": "RISK-001",
    "description": "string",
    "category": "technical | team | external | business",
    "probability": 0.0-1.0,
    "probability_rationale": "string",
    "impact": 0.0-1.0,
    "impact_rationale": "string",
    "risk_score": 0.0-1.0,
    "assessment_confidence": 0.0-1.0,
    "assessment_method": "data-driven | heuristic | hybrid"
  }]
}
```

### Step 3: 风险优先级自动排序

**动作**：
- 按风险分值降序排列
- 考虑风险紧迫性（时间因素）
- 考虑风险关联性（相关风险聚合）
- 生成优先级矩阵

**输出**：
```json
{
  "risk_prioritization": {
    "priority_matrix": {
      "critical": ["RISK-ID"],
      "high": ["RISK-ID"],
      "medium": ["RISK-ID"],
      "low": ["RISK-ID"]
    },
    "sorted_risks": [{
      "rank": 1,
      "risk_id": "RISK-001",
      "risk_score": 0.0-1.0,
      "urgency_factor": 0.0-1.0,
      "final_priority": 1
    }]
  }
}
```

### Step 4: 风险应对策略自动建议

**动作**：
- 基于风险类型和特征建议应对策略
- 提供多个策略选项（规避、转移、缓解、接受）
- 估算每个策略的成本和效果
- 指定建议的Owner

**输出**：
```json
{
  "risk_strategies": [{
    "risk_id": "RISK-001",
    "strategy_options": [{
      "strategy": "avoid | transfer | mitigate | accept",
      "description": "string",
      "estimated_cost": "low | medium | high",
      "estimated_effectiveness": 0.0-1.0,
      "implementation_effort": "low | medium | high",
      "recommended": boolean
    }],
    "recommended_strategy": "string",
    "recommended_owner": "string",
    "implementation_timeline": "string"
  }]
}
```

### Step 5: 风险登记册自动维护

**动作**：
- 合并新识别的风险
- 更新已存在风险的状态
- 关闭已解决的风险
- 生成完整的新风险登记册

**输出**：
```yaml
# risk_register

## 风险登记册摘要
- 总风险数：
- Critical风险：
- High风险：
- Medium风险：
- Low风险：
- 新增风险：
- 已关闭风险：
- 最后更新：

## 风险列表
{每个风险的完整信息}
```

---

## 输出

**存储路径**：`output/pm-project/risk-identification/`

**输出文件**：risk_register.json、metadata.json

**输出Schema**：

```json
{
  "type": "object",
  "required": ["risk_register", "metadata"],
  "properties": {
    "risk_register": {"type": "object", "description": "风险登记册，包含风险列表和汇总统计"},
    "metadata": {"type": "object", "description": "元数据，包含扫描时间、数据源和置信度"}
  }
}
```

### 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| risk_register.risks | array | 是 | 风险列表，每项须含id、description、category、probability、impact、priority |
| risk_register.risks[].id | string | 是 | 风险唯一标识，格式RISK-NNN |
| risk_register.risks[].category | string | 是 | 风险类别，枚举值technical/team/external/business |
| risk_register.risks[].probability | number | 是 | 发生概率，范围0.0-1.0 |
| risk_register.risks[].impact | number | 是 | 影响程度，范围0.0-1.0 |
| risk_register.risks[].priority | string | 是 | 优先级，枚举值critical/high/medium/low |
| risk_register.risks[].mitigation_strategy | string | 否 | 应对策略描述 |
| risk_register.risks[].owner | string | 否 | 风险负责人 |
| risk_register.risks[].status | string | 是 | 风险状态，枚举值active/mitigated/resolved/closed |
| risk_register.risks[].identified_date | string | 是 | 识别日期，ISO 8601格式 |
| risk_register.risks[].last_updated | string | 是 | 最后更新日期，ISO 8601格式 |
| risk_register.summary.total_risks | number | 是 | 风险总数 |
| risk_register.summary.by_priority | object | 是 | 按优先级分布统计，含critical/high/medium/low计数 |
| risk_register.summary.trend | string | 是 | 趋势，枚举值stable/increasing/decreasing |
| metadata.scan_time | string | 是 | 扫描时间，ISO 8601格式 |
| metadata.data_sources | array | 是 | 数据来源列表 |
| metadata.confidence | number | 是 | 整体置信度，范围0.0-1.0 |
| metadata.new_risks_identified | number | 是 | 新识别风险数 |
| metadata.risks_resolved | number | 是 | 已解决风险数 |

```json
{
  "risk_register": {
    "risks": [{
      "id": "RISK-001",
      "description": "视频转码服务供应商API限流可能导致课程上传延迟",
      "category": "external",
      "probability": 0.6,
      "impact": 0.8,
      "priority": "high",
      "mitigation_strategy": "接入备用转码服务商，实现自动故障切换",
      "owner": "王芳（后端Lead）",
      "status": "active",
      "identified_date": "2024-04-02",
      "last_updated": "2024-04-05"
    }],
    "summary": {
      "total_risks": 12,
      "by_priority": {"critical": 1, "high": 3, "medium": 5, "low": 3},
      "trend": "stable"
    }
  },
  "metadata": {
    "scan_time": "2024-04-05T10:30:00+08:00",
    "data_sources": ["sprint_plan.json", "历史风险库", "项目进度数据"],
    "confidence": 0.85,
    "new_risks_identified": 2,
    "risks_resolved": 1
  }
}
```

---

## 风险分类参考

| 类别 | 典型风险 |
|------|----------|
| Technical | 架构不匹配、技术债务、依赖延迟、安全漏洞 |
| Team | 人员离职、技能缺口、沟通不畅、协作冲突 |
| External | 市场变化、政策调整、竞争加剧、供应链中断 |
| Business | 需求变更、范围蔓延、验收延迟、预算超支 |

---

## 决策规则

| 条件 | 动作 |
|------|------|
| Critical风险数量 > 3 | 立即升级通知 |
| 新风险分值 > 0.8 | 立即升级 |
| 历史风险库无匹配 | 降低置信度，标注需人工审核 |
| 风险识别频率异常增加 | 触发系统性审查 |

## 质量检查

- [ ] 风险覆盖技术、资源、进度、外部4个维度
- [ ] 每个风险有影响和概率评估
- [ ] 风险优先级排序合理
- [ ] 高优先级风险有应对策略

## 降级策略

### 上游文件缺失降级方案

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 项目数据 | 用户描述项目范围和关键依赖，AI基于行业经验识别风险 | 基于行业经验的风险清单，缺少项目实际数据支撑 |
| 历史风险库 | 完全依赖AI行业知识识别风险，标注"无历史数据参考" | 基于AI知识的风险登记册，评估置信度较低 |
| 外部数据 | 跳过外部风险扫描，仅识别技术/团队/业务风险 | 缺少外部维度的风险登记册，需人工补充外部风险 |
| 当前风险登记册 | 从零生成风险登记册，无法与已有风险对比 | 全新风险登记册，无法进行增量对比和趋势分析 |

### 数据获取说明

当上游文件缺失时，通过以下方式获取必要数据：

1. **项目数据缺失**：请用户描述项目范围、技术栈、团队规模和关键依赖，AI将基于行业经验识别常见风险并评估概率和影响
2. **历史风险库缺失**：AI将完全依赖行业知识和通用风险模式识别风险，输出中标注"无历史数据参考，评估置信度较低"，建议人工审核
3. **外部数据缺失**：跳过外部风险扫描维度（市场/政策/竞争），风险登记册中标注"外部风险需人工补充评估"

## 上游变更响应

### 上游变更影响表

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| 项目数据变更（进度偏差/依赖变化/范围调整） | 风险来源扫描、风险评估、优先级排序 | 重新扫描风险来源，更新风险评估和优先级 |
| 外部数据更新（市场/政策/竞争变化） | 外部风险扫描、风险评估 | 更新外部风险扫描结果，重新评估相关风险 |
| 历史风险库更新（新增案例/教训） | 风险匹配、评估置信度 | 重新匹配历史案例，更新评估置信度 |

### 下游通知机制表

| 变更类型 | 影响范围 | 通知方式 |
|----------|----------|----------|
| 风险登记册变更（新增/更新/关闭风险） | 风险管理、项目经理 | 更新risk_register.json，通知risk-management |
| 风险优先级变更 | 风险管理判断、资源分配 | 更新risk_register.json，通知risk-management和项目经理 |
| 风险应对策略变更 | 风险管理应对追踪 | 更新risk_register.json，通知risk-management |
