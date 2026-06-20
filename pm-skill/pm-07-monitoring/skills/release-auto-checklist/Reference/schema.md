# release-auto-checklist 输出 Schema

> 本文档从 release-auto-checklist SKILL.md 拆分而来，包含完整输出数据结构定义、最终输出结构、输出字段说明和输出校验规则。

## 输出Schema

```json
{
  "type": "object",
  "required": ["release_checklist"],
  "properties": {
    "release_checklist": {
      "type": "object",
      "description": "发布检查清单根对象",
      "required": ["version", "items", "gate_result", "blockers", "risk_summary"],
      "properties": {
        "version": {"type": "string", "description": "发布版本号"},
        "items": {
          "type": "array",
          "description": "检查项列表",
          "items": {
            "type": "object",
            "required": ["id", "category", "description", "status", "severity"],
            "properties": {
              "id": {"type": "string", "description": "检查项编号"},
              "category": {"type": "string", "description": "检查类别，枚举值：code_quality/testing/security/compliance/infrastructure/monitoring"},
              "description": {"type": "string", "description": "检查描述"},
              "status": {"type": "string", "description": "状态，枚举值：pass/fail/pending/waived"},
              "severity": {"type": "string", "description": "严重级别，枚举值：blocker/warning/info"},
              "evidence": {"type": "string", "description": "证据链接"},
              "assignee": {"type": "string", "description": "负责人"}
            }
          }
        },
        "gate_result": {"type": "string", "description": "门禁结果，枚举值：go/no_go/conditional"},
        "blockers": {"type": "array", "description": "阻断项列表"},
        "risk_summary": {"type": "object", "description": "风险摘要"}
      }
    }
  }
}
```

## 最终输出结构

```json
{
  "release_checklist": {
    "version": "v2.1.0",
    "items": [
      {
        "id": "T7_C001",
        "category": "code_quality",
        "description": "代码已通过静态分析",
        "status": "pass",
        "severity": "blocker",
        "evidence": "sonarqube_scan_2024_0125.json",
        "assignee": "ci_system"
      }
    ],
    "gate_result": "conditional",
    "blockers": [
      {
        "id": "T-1_C002",
        "title": "发布通知未发送",
        "owner": "dev_zhang"
      }
    ],
    "risk_summary": {
      "risk_level": "medium",
      "blocking_items_count": 1
    }
  }
}
```

## 输出字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| release_checklist | JSON | 发布检查清单根对象 |
| release_checklist.version | string | 发布版本号 |
| release_checklist.items | array | 检查项列表 |
| release_checklist.gate_result | string | 门禁结果 |
| release_checklist.blockers | array | 阻断项列表 |
| release_checklist.risk_summary | object | 风险摘要 |

## 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| release_checklist | object | 是 | 发布检查清单根对象 |
| release_checklist.version | string | 是 | 发布版本号 |
| release_checklist.items | array | 是 | 检查项列表 |
| release_checklist.items[].id | string | 是 | 检查项编号 |
| release_checklist.items[].category | string | 是 | 检查类别，枚举值：code_quality/testing/security/compliance/infrastructure/monitoring |
| release_checklist.items[].description | string | 是 | 检查描述 |
| release_checklist.items[].status | string | 是 | 状态，枚举值：pass/fail/pending/waived |
| release_checklist.items[].severity | string | 是 | 严重级别，枚举值：blocker/warning/info |
| release_checklist.items[].evidence | string | 否 | 证据链接 |
| release_checklist.items[].assignee | string | 否 | 负责人 |
| release_checklist.gate_result | string | 是 | 门禁结果，枚举值：go/no_go/conditional |
| release_checklist.blockers | array | 是 | 阻断项列表 |
| release_checklist.risk_summary | object | 是 | 风险摘要 |
