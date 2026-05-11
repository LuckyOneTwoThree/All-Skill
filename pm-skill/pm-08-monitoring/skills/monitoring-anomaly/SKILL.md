---
name: monitoring-anomaly
description: 当需要对告警进行归因分析时使用。告警自动分析与归因，对接收到的告警进行分类、关联分析、根因定位和影响评估，输出修复建议并标记需人工升级的告警。关键词：异常检测、异常告警、告警分级、自动归因、指标异常。
metadata:
  module: "产品监控与迭代"
  sub-module: "监控预警"
  type: "pipeline"
  version: "1.0"
  interaction_mode: "ai_auto"
---

# Pipeline 2: 告警自动分析与归因 🤖 (7×24)

## 核心原则

1. **主动监控而非被动响应**：7×24小时运行，告警产生后即时分析归因，而非等待人工发起
2. **归因分层**：按"确认真实性→定位范围→关联事件→生成归因"分层推进，避免跳步导致误判
3. **决策规则前置**：告警分级规则和升级阈值在系统建设时已定义，告警发生时自动执行
4. **持续学习**：每次归因结论反馈到知识库，持续优化归因模型

## 交互模式

🤖 AI自动执行（异常检测类）

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 告警数据 | object | 是 | output/pm-monitoring/monitoring-system/alert.json | 告警内容、时间、来源服务 |
| 版本发布信息 | object | ○ | output/pm-development/release-gradual/release_record.json | 近期发布记录 |
| 配置变更记录 | object | ○ | 用户提供 | 配置修改历史 |
| 流量变化数据 | object | ○ | 用户提供 | 流量趋势和异常波动 |
| 根因知识库 | object[] | ○ | 用户提供 | 历史问题-根因映射 |

## 执行步骤

### Step 1: 告警分类

**目标**：将告警归类到正确的层级和类型

**分类维度**：

| 类别 | 子类 | 特征 |
|------|------|------|
| 系统层 | 基础设施 | CPU/内存/磁盘/网络 |
| 系统层 | 容器 | Pod/容器重启/资源限制 |
| 系统层 | 中间件 | 数据库/缓存/消息队列 |
| 应用层 | 服务响应 | 超时/连接失败/资源耗尽 |
| 应用层 | 错误异常 | 异常堆栈/业务异常 |
| 业务层 | 业务指标 | 转化率/订单量/支付失败 |
| 业务层 | 用户行为 | DAU 异常/功能使用异常 |
| 外部层 | 第三方服务 | API 超时/返回错误 |
| 外部层 | CDN/DNS | 访问异常/证书问题 |

**输出**：

```yaml
classification:
  layer: system | application | business | external
  category: {specific_category}
  confidence: 0.0-1.0
  related_alerts: [alert_ids]
```

### Step 2: 关联分析

**目标**：发现告警之间的关联关系和告警风暴

**分析方法**：
- 时间窗口关联（告警时间接近）
- 服务拓扑关联（同一服务链路）
- 指标波动关联（同时发生异常）
- 变更事件关联（发布/配置变更后触发）

**输出**：

```yaml
correlation:
  is_correlated: true | false
  correlation_type: time | topology | metrics | change
  related_alerts: [alert_ids]
  correlation_score: 0.0-1.0
  root_alert: {alert_id} | null
```

### Step 3: 根因定位 (5 Why)

**目标**：通过 5 Why 追问法定位根本原因

**分析方法**：
- 基于告警类型的常见根因模式匹配
- 基于变更事件的时序分析
- 基于依赖拓扑的向上溯源
- 基于知识库的历史案例匹配

**5 Why 输出格式**：

```yaml
root_cause:
  why_chain:
    - question: "为什么 {现象}？"
      answer: "{直接原因}"
      evidence: "{证据}"
    - question: "为什么 {直接原因}？"
      answer: "{深层原因}"
      evidence: "{证据}"
    - question: "为什么 {深层原因}？"
      answer: "{根因}"
      evidence: "{证据}"
    - question: "为什么 {根因}？"
      answer: "{系统性问题}"
      evidence: "{证据}"
    - question: "为什么 {系统性问题}？"
      answer: "{根本原因}"
      evidence: "{证据}"
  root_cause_summary: "{一句话根因描述}"
  root_cause_category: {category}
  confidence: 0.0-1.0
```

### Step 4: 影响评估

**目标**：评估告警对用户和业务的影响范围

**评估维度**：

| 维度 | 指标 |
|------|------|
| 用户影响 | 受影响用户数/比例 |
| 功能影响 | 核心功能可用性 |
| 业务影响 | 转化率/订单量损失 |
| 收入影响 | 预估 GMV 损失 |
| 声誉影响 | 客诉数量/舆情 |

**输出**：

```yaml
impact_scope:
  level: critical | major | minor | negligible
  affected_users:
    count: {number}
    percentage: {percentage}
  affected_features:
    - feature_name: {name}
      availability: {percentage}
  business_metrics:
    - metric: {name}
      impact: {value}
      duration: {time}
  revenue_impact:
    estimated_loss: {amount}
    confidence: {percentage}
```

### Step 5: 修复建议

**目标**：生成标准化修复建议和操作步骤

**建议类型**：

| 根因类型 | 建议模板 |
|----------|----------|
| 资源不足 | 扩容/资源调整方案 |
| 代码问题 | 回滚/热修复方案 |
| 配置错误 | 配置修正步骤 |
| 依赖故障 | 切换/降级方案 |
| 流量异常 | 限流/熔断配置 |

**输出**：

```yaml
remediation:
  immediate_actions:
    - step: {description}
      command: {command} | {ui_action}
      automated: true | false
      rollback_command: {command}
  long_term_fixes:
    - description: {description}
      priority: P0-P3
      effort: {story_points}
  estimated_resolution_time: {minutes}
```

## 输出

**输出Schema**：

```json
{
  "type": "object",
  "required": ["alert_id", "classification", "root_cause", "impact_scope"],
  "properties": {
    "alert_id": {"type": "string", "description": "告警ID"},
    "timestamp": {"type": "string", "description": "告警时间"},
    "classification": {"type": "object", "description": "告警分类，包含层级、类别和置信度"},
    "root_cause": {"type": "object", "description": "根因分析，包含5Why链和摘要"},
    "impact_scope": {"type": "object", "description": "影响范围，包含级别、受影响用户和功能"},
    "remediation": {"type": "object", "description": "修复建议，包含即时行动列表"},
    "needs_human_escalation": {"type": "boolean", "description": "是否需要人工升级"}
  }
}
```

```
├── {alert_id}/
│   ├── classification.md
│   ├── correlation.md
│   ├── root_cause.md
│   ├── impact_assessment.md
│   ├── remediation.md
│   └── needs_human_escalation: true | false
└── escalation_queue.md
```

### 告警分析输出格式

```yaml
anomaly_analysis:
  alert_id: {id}
  timestamp: {ISO8601}
  classification:
    layer: application
    category: service_timeout
    confidence: 0.95
  root_cause:
    5why_chain:
      - question: "为什么 API 响应超时？"
        answer: "数据库查询超过 5s"
        evidence: "慢查询日志"
    summary: "未建索引导致查询超时"
  impact_scope:
    level: major
    affected_users: 1500
    affected_features: [payment, order]
  remediation:
    immediate_actions:
      - step: "添加索引"
        command: "CREATE INDEX..."
        automated: false
  needs_human_escalation: true
```

## 决策规则

| 场景 | 决策规则 |
|------|----------|
| 告警风暴（≥5条告警/5分钟） | 合并为单一告警，标记主因，抑制关联告警 |
| 根因不确定（候选原因≥3个） | 标记需人工排查，输出Top3候选原因及置信度 |
| 影响范围扩大（受影响用户增长≥20%/10分钟） | 自动升级severity 1级（最高P0） |
| 影响范围扩大（受影响用户增长5%-20%/10分钟） | 自动升级severity 1级 |
| 知识库命中（相似度≥0.85） | 输出历史解决方案，标注置信度 |
| 知识库命中（相似度0.6-0.85） | 输出历史解决方案，标注"需人工确认适用性" |
| 无历史案例 | 输出5 Why追问链，等待反馈 |
| P0异常恢复后 | 自动触发复盘流程，24小时内生成复盘报告 |

## 质量检查

- [ ] 告警分类准确率 ≥ 85%
- [ ] 根因定位准确率 ≥ 80%
- [ ] 5 Why 链条完整（3-5 层）
- [ ] 修复建议可执行
- [ ] 升级标记无遗漏
- [ ] MTTR 降低目标达成

## 降级策略

### 上游文件缺失降级方案

| 缺失的上游输入 | 影响范围 | 降级方案 | 降级输出 |
|---------------|---------|---------|---------|
| 告警数据 | 无法获取告警内容和来源 | 用户描述异常现象（症状、时间、影响范围），AI基于描述构建虚拟告警 | 基于描述的归因分析报告 |
| 版本发布信息 | 无法关联变更事件 | 跳过变更关联分析，在归因中标注"无法排除变更因素" | 排除变更关联的归因结果 |
| 配置变更记录 | 无法关联配置变更 | 跳过配置变更关联，在归因中标注"无法排除配置变更因素" | 排除配置关联的归因结果 |
| 流量变化数据 | 无法评估流量异常 | 跳过流量分析维度，在影响评估中标注流量数据缺失 | 缺少流量维度的分析结果 |
| 根因知识库 | 无法匹配历史案例 | 5 Why 分析完全依赖逻辑推理，无法提供历史参考方案 | 纯推理归因结果 |

### 数据获取说明

当上游文件缺失时，通过以下方式获取必要数据：

1. **告警数据缺失**：请用户描述异常现象，包括：症状表现、发生时间、受影响的服务/功能、影响范围（用户数/功能点），AI将基于描述进行归因分析
2. **上下文数据缺失**（版本发布/配置变更/流量变化）：AI将在归因分析中明确标注无法排除的因素，建议人工排查这些维度
3. **根因知识库缺失**：AI将完全依赖5 Why逻辑推理进行归因，输出中标注"无历史案例参考"，建议人工验证归因结论
