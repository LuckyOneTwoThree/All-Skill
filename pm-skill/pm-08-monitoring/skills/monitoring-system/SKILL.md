---
name: monitoring-system
description: 当需要构建产品监控预警体系时使用。产品监控预警体系自动构建，根据产品架构和业务需求，自动生成监控指标、告警规则和 On-Call 手册。关键词：监控系统、监控配置、健康检查、告警规则、监控体系、监控搭建、告警配置。
metadata:
  module: "产品监控与迭代"
  sub-module: "监控预警"
  type: "pipeline"
  version: "2.0"
  interaction_mode: "ai_auto"
---

# Pipeline 1: 监控预警体系自动构建 🤖

## 核心原则

1. **监控体系的起点是核心路径而非指标堆砌**：先识别核心业务路径，再为路径配置指标和告警，避免监控一切却看不到关键
2. **告警规则是信号与噪音的平衡**：告警太多等于没有告警，每条告警都必须值得人工关注
3. **On-Call手册是监控体系的最后一公里**：没有On-Call手册的监控系统是不完整的，告警响了没人知道怎么处理等于没有监控

## 交互模式

🤖 AI自动执行（系统配置类）

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 产品架构 | JSON/文件 | 是 | 用户提供 | 系统架构图、组件关系、依赖链路 |
| 指标体系 | JSON | 是 | output/pm-metrics-design/metrics-system/metric_system.json | 需监控的业务指标和技术指标定义 |
| SLA 要求 | JSON | 是 | 用户提供 | 可用性、响应时间、吞吐量要求 |
| 现有监控 | JSON | ○ | output/pm-monitoring/monitoring-system/现有配置 | 已有的监控配置和告警规则 |

## 执行步骤

### Step 1: 核心路径识别

**目标**：识别产品关键路径和服务依赖

**方法**：
- 分析架构文档提取服务组件
- 识别用户请求主链路
- 映射服务间依赖关系
- 标记单点故障风险点

**输出**：核心路径清单，包含入口服务 → 核心服务 → 数据层 → 外部依赖

### Step 2: 指标-告警规则生成

**目标**：为每个核心路径生成监控指标和告警规则

**指标类型**：
- 黄金指标：延迟、流量、错误、饱和度
- 业务指标：转化率、订单量、DAU/MAU
- 自定义指标：特定业务事件

**告警规则配置**：

| 规则类型 | 生成方式 | 参数来源 |
|----------|----------|----------|
| 静态阈值 | 固定值 + SLA 要求 | SLA/SLO 定义 |
| 历史基线 | 统计历史数据 | 7d/30d 均值/标准差 |
| 动态阈值 | 趋势分析 + 异常检测 | 预测区间 |
| 复合告警 | 多指标组合逻辑 | 业务规则 |

**告警参数**：

```yaml
alert_rule:
  name: {metric_name}_alert
  severity: critical | high | medium | low
  threshold:
    operator: > | < | >= | <=
    value: {threshold_value}
  baseline:
    method: historical | moving_average | seasonal
    window: 7d | 30d | custom
    deviation: {sigma_value}σ
  sensitivity: high | medium | low
  evaluation_interval: {interval}
  for: {duration}
```

### Step 3: 告警收敛规则

**目标**：减少告警噪音，避免告警风暴

**收敛策略**：
- 告警分组：按服务/组件/时间窗口聚合
- 告警抑制：父子告警关系，高优先级抑制低优先级
- 静默规则：维护窗口内自动静默
- 去重规则：相同告警合并通知

### Step 4: On-Call 手册生成

**目标**：为每个告警生成标准化响应手册

**手册内容**：
- 问题描述
- 自检清单
- 常见原因
- 快速修复步骤
- 升级条件
- 关联文档链接

## 输出

**输出Schema**：

```json
{
  "type": "object",
  "required": ["metrics"],
  "properties": {
    "metrics": {"type": "array", "description": "监控指标配置列表，包含名称、类别、阈值和基线"},
    "alert_policies": {"type": "object", "description": "告警策略配置"},
    "suppression_rules": {"type": "object", "description": "收敛规则配置"}
  }
}
```

```
├── core_paths.md                    # 核心路径清单
├── metrics/
│   ├── availability/
│   │   └── alert_rule.yaml
│   ├── latency/
│   │   └── alert_rule.yaml
│   ├── error_rate/
│   │   └── alert_rule.yaml
│   └── [custom_metrics]/
│       └── alert_rule.yaml
├── alert_policies.yaml              # 告警策略配置
├── suppression_rules.yaml           # 收敛规则
└── oncall_handbook.md               # On-Call 手册
```

### 告警规则输出格式

```yaml
metrics:
  - name: api_response_time_p95
    category: latency
    severity: high
    threshold: 500ms
    baseline:
      method: historical
      window: 7d
      deviation: 2σ
    sensitivity: medium
  - name: error_rate
    category: availability
    severity: critical
    threshold: 1%
    baseline:
      method: historical
      window: 7d
      deviation: 3σ
    sensitivity: high
```

## 决策规则

| 场景 | 决策规则 |
|------|----------|
| 指标覆盖率<80% | 标记警告，提示补充指标，列出缺失的核心指标 |
| 指标覆盖率80%-95% | 标记提示，建议补充非核心指标 |
| 阈值冲突（同一指标≥2条告警规则） | 保留severity最高的规则，其余标记为重复并禁用 |
| 基线数据不足（<7天历史数据） | 使用静态阈值作为fallback，标记"需补充数据，7天后自动切换动态基线" |
| 新增服务 | 自动继承基础告警模板（CPU≥80%、内存≥85%、错误率≥1%），提示需专项配置 |
| P0服务告警缺失 | 强制补充黄金指标告警，不可跳过 |
| 告警噪音率≥15% | 自动收紧阈值10%，标记需人工审核 |

## 质量检查

- [ ] 核心路径覆盖率 ≥ 95%
- [ ] 每个核心路径至少有 4 个黄金指标
- [ ] 告警噪音率 < 15%
- [ ] 所有 P0 服务有 On-Call 手册
- [ ] 告警规则无冲突无遗漏
- [ ] SLA 要求有对应指标支撑

## 降级策略

### 上游文件缺失降级方案

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 指标体系 | 用户提供核心业务指标列表，基于通用指标模板补充黄金指标 | 基础监控指标配置，缺乏指标体系支撑 |
| 产品架构 | 用户提供服务组件清单，按通用微服务架构推断依赖关系 | 基础核心路径清单，依赖关系为推断 |
| SLA 要求 | 用户提供关键服务的可用性目标，采用行业默认阈值（99.9%/99.5%/99%） | 基于默认阈值的告警规则 |
| 现有监控 | 跳过兼容性检查，从零生成监控配置 | 全新监控配置 |

### 数据获取说明

当上游文件缺失时，通过以下方式获取必要数据：

1. **指标体系缺失**：请用户提供核心业务指标列表（如订单量、转化率、DAU等），AI将基于产品类型自动补充通用黄金指标（延迟、流量、错误率、饱和度）
2. **产品架构缺失**：请用户提供服务组件清单或系统名称列表，AI将按通用架构模式推断服务依赖关系，并在输出中标注推断项需人工确认
3. **SLA 要求缺失**：请用户提供关键服务的可用性目标（如"支付服务需99.9%可用"），未指定的服务采用行业默认标准，输出中标注默认值供人工审核

## 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| core_paths | array | 是 | 核心路径列表，至少1条路径 |
| core_paths[].path_name | string | 是 | 路径名称 |
| metrics | object | 是 | 监控指标配置，按路径分组 |
| alert_policies | array | 是 | 告警策略列表，至少1条规则 |
| suppression_rules | array | 否 | 抑制规则列表 |
| oncall_handbook | object | 否 | On-Call手册，须含escalation_paths/emergency_procedures |

## 上游变更响应

### 上游变更影响表

| 上游来源 | 变更类型 | 影响范围 | 响应动作 |
|----------|----------|----------|----------|
| metrics-system | 指标定义变更 | 监控指标配置和告警规则 | 更新指标映射和告警阈值 |
| 用户提供-产品架构 | 架构变更 | 核心路径和服务依赖 | 重新识别核心路径和依赖链 |
| 用户提供-SLA | SLA目标变更 | 告警阈值和分级标准 | 调整告警规则和升级条件 |

### 下游通知机制表

| 下游消费者 | 通知条件 | 通知方式 | 通知内容 |
|------------|----------|----------|----------|
| monitoring-anomaly | 监控体系配置完成 | 写入输出文件 | 告警规则和核心路径 |
| monitoring-dashboard | 监控体系配置完成 | 写入输出文件 | 指标配置和告警规则 |
| monitoring-escalation | 告警规则和On-Call手册更新 | 写入输出文件 | 升级规则和On-Call手册 |
| monitoring-orchestrator | 监控体系构建完成 | 输出文件更新 | 构建完成状态和关键配置 |
