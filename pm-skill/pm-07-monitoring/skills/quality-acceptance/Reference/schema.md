# quality-acceptance 输出 Schema

> 本文档从 quality-acceptance SKILL.md 拆分而来，包含完整输出数据结构定义、最终输出结构和输出校验规则。

## 输出Schema

```json
{
  "type": "object",
  "required": ["auto_acceptance", "acceptance_report"],
  "properties": {
    "auto_acceptance": {
      "type": "object",
      "description": "自动验收根对象",
      "required": ["execution_summary", "checks", "gate_result"],
      "properties": {
        "execution_summary": {
          "type": "object",
          "description": "执行摘要",
          "required": ["total_checks", "auto_passed", "auto_failed", "manual_required"],
          "properties": {
            "total_checks": {"type": "number", "description": "检查项总数"},
            "auto_passed": {"type": "number", "description": "自动通过数"},
            "auto_failed": {"type": "number", "description": "自动失败数"},
            "manual_required": {"type": "number", "description": "需人工验证数"}
          }
        },
        "checks": {
          "type": "array",
          "description": "检查项列表",
          "items": {
            "type": "object",
            "required": ["id", "type", "method", "result", "confidence"],
            "properties": {
              "id": {"type": "string", "description": "检查项编号"},
              "type": {"type": "string", "description": "检查类型，枚举值：functional/performance/security/compatibility"},
              "method": {"type": "string", "description": "验收方法，枚举值：automated/semi_auto/manual"},
              "result": {"type": "string", "description": "结果，枚举值：pass/fail/pending"},
              "evidence": {"type": "object", "description": "验收证据"},
              "confidence": {"type": "number", "description": "置信度，0-1"}
            }
          }
        },
        "gate_result": {"type": "string", "description": "门禁结果，枚举值：pass/fail/conditional_pass"}
      }
    },
    "acceptance_report": {
      "type": "object",
      "description": "验收报告根对象",
      "required": ["summary", "items", "risk_assessment", "sign_off"],
      "properties": {
        "summary": {
          "type": "object",
          "description": "验收摘要",
          "required": ["total_items", "passed", "failed", "blocked"],
          "properties": {
            "total_items": {"type": "number", "description": "验收项总数"},
            "passed": {"type": "number", "description": "通过项数"},
            "failed": {"type": "number", "description": "失败项数"},
            "blocked": {"type": "number", "description": "阻断项数"}
          }
        },
        "items": {
          "type": "array",
          "description": "验收项列表",
          "items": {
            "type": "object",
            "required": ["id", "category", "description", "result", "severity"],
            "properties": {
              "id": {"type": "string", "description": "验收项编号"},
              "category": {"type": "string", "description": "验收类别"},
              "description": {"type": "string", "description": "验收描述"},
              "result": {"type": "string", "description": "结果，枚举值：pass/fail/blocked/waived"},
              "evidence": {"type": "string", "description": "证据链接"},
              "severity": {"type": "string", "description": "严重级别，枚举值：P0/P1/P2/P3"}
            }
          }
        },
        "risk_assessment": {"type": "object", "description": "风险评估"},
        "sign_off": {
          "type": "object",
          "description": "签收记录",
          "required": ["status"],
          "properties": {
            "status": {"type": "string", "description": "签收状态，枚举值：pending/signed/rejected"}
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
  "auto_acceptance": {
    "execution_summary": { /* 见输出校验规则 */ },
    "checks": [ { /* 见Step 1.5执行指令生成 */ } ],
    "gate_result": "pass | fail | conditional_pass"
  },
  "acceptance_report": {
    "summary": { /* 见输出校验规则 */ },
    "items": [ { /* 见Step 2.2测试结果整合 */ } ],
    "risk_assessment": { /* 见Step 2.4遗留问题评估 */ },
    "sign_off": { /* 见Step 2.5验收结论 */ }
  }
}
```

## 输出字段说明

见输出Schema及输出校验规则。

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
