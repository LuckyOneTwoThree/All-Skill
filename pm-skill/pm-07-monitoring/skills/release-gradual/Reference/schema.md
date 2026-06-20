# release-gradual 输出 Schema

> 本文档从 release-gradual SKILL.md 拆分而来，包含完整输出数据结构定义、最终输出结构、输出字段说明和输出校验规则。

## 输出Schema

```json
{
  "type": "object",
  "required": ["gradual_release"],
  "properties": {
    "gradual_release": {
      "type": "object",
      "description": "灰度发布根对象",
      "required": ["strategy", "monitoring", "rollback_plan"],
      "properties": {
        "strategy": {
          "type": "object",
          "description": "灰度策略",
          "required": ["type", "stages"],
          "properties": {
            "type": {"type": "string", "description": "策略类型，枚举值：canary/blue_green/rolling/feature_flag"},
            "stages": {
              "type": "array",
              "description": "灰度阶段列表，至少2个",
              "items": {
                "type": "object",
                "required": ["name", "traffic_percentage", "duration", "success_criteria", "rollback_criteria"],
                "properties": {
                  "name": {"type": "string", "description": "阶段名称"},
                  "traffic_percentage": {"type": "number", "description": "流量百分比，0-100"},
                  "duration": {"type": "string", "description": "持续时间"},
                  "success_criteria": {"type": "object", "description": "成功标准"},
                  "rollback_criteria": {"type": "object", "description": "回滚标准"}
                }
              }
            }
          }
        },
        "monitoring": {
          "type": "object",
          "description": "监控配置",
          "required": ["metrics", "alert_rules"],
          "properties": {
            "metrics": {"type": "array", "description": "监控指标列表"},
            "alert_rules": {"type": "array", "description": "告警规则列表"}
          }
        },
        "rollback_plan": {
          "type": "object",
          "description": "回滚计划",
          "required": ["trigger_conditions", "steps"],
          "properties": {
            "trigger_conditions": {"type": "array", "description": "触发条件"},
            "steps": {"type": "array", "description": "回滚步骤"}
          }
        }
      }
    }
  }
}
```

## 最终输出结构

```json
{
  "gradual_release": {
    "strategy": {
      "type": "canary",
      "stages": [
        {
          "name": "phase_1",
          "traffic_percentage": 1,
          "duration": "30m",
          "success_criteria": { /* 见Step 1.2灰度计划生成 */ },
          "rollback_criteria": { /* 见Step 3.2阶段状态评估 */ }
        }
      ]
    },
    "monitoring": {
      "metrics": [ { /* 见Step 3.1指标采集 */ } ],
      "alert_rules": [ { /* 见护栏指标配置 */ } ]
    },
    "rollback_plan": {
      "trigger_conditions": [ { /* 见Step 4.1回滚触发条件 */ } ],
      "steps": [ { /* 见Step 4.2回滚执行 */ } ]
    }
  }
}
```

## 输出字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| gradual_release | object | 灰度发布根对象 |
| gradual_release.strategy | object | 灰度策略 |
| gradual_release.strategy.type | string | 策略类型 |
| gradual_release.strategy.stages | array | 灰度阶段列表 |
| gradual_release.monitoring | object | 监控配置 |
| gradual_release.rollback_plan | object | 回滚计划 |

## 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| gradual_release | object | 是 | 灰度发布根对象 |
| gradual_release.strategy | object | 是 | 灰度策略 |
| gradual_release.strategy.type | string | 是 | 策略类型，枚举值：canary/blue_green/rolling/feature_flag |
| gradual_release.strategy.stages | array | 是 | 灰度阶段列表，至少2个 |
| gradual_release.strategy.stages[].name | string | 是 | 阶段名称 |
| gradual_release.strategy.stages[].traffic_percentage | number | 是 | 流量百分比，0-100 |
| gradual_release.strategy.stages[].duration | string | 是 | 持续时间 |
| gradual_release.strategy.stages[].success_criteria | object | 是 | 成功标准 |
| gradual_release.strategy.stages[].rollback_criteria | object | 是 | 回滚标准 |
| gradual_release.monitoring | object | 是 | 监控配置 |
| gradual_release.monitoring.metrics | array | 是 | 监控指标列表 |
| gradual_release.monitoring.alert_rules | array | 是 | 告警规则列表 |
| gradual_release.rollback_plan | object | 是 | 回滚计划 |
| gradual_release.rollback_plan.trigger_conditions | array | 是 | 触发条件 |
| gradual_release.rollback_plan.steps | array | 是 | 回滚步骤 |
