# PRD生成器 输出Schema参考

> 本文档从 design-prd SKILL.md 拆分而来，包含PRD生成器的完整输出数据结构定义、质量报告格式和人类确认清单模板。

### 8.1 PRD文档输出

**格式**：Markdown
**文件命名**：`PRD-{产品名}-{需求ID}-{版本}.md`
**存储路径**：`output/pm-design/design-prd/`
**输出文件**：prd.md

**输出模板**：
```markdown
# {PRD标题}

| 字段 | 值 |
|------|-----|
| 文档ID | PRDS-{年月}-{序号} |
| 版本 | v{主版本}.{次版本} |
| 状态 | {状态} |
| 作者 | {作者} |
| 创建时间 | {时间} |

## 目录
1. [元信息](#1-元信息)
2. [背景与目标](#2-背景与目标)
3. [方案设计](#3-方案设计)
...
```

### 8.2 质量门禁检查报告

**格式**：JSON
**文件命名**：`{PRD-ID}_quality_report_{时间戳}.json`

**输出校验规则**：

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| prd_id | string | 是 | PRD唯一标识 |
| level | enum(L,S,X) | 是 | PRD分级 |
| metadata | object | 是 | 元信息 |
| metadata.product_name | string | 是 | 产品名称 |
| metadata.version | string | 是 | 版本号 |
| metadata.created_at | string | 是 | 创建时间(ISO8601) |
| sections | array | 是 | PRD章节列表 |
| sections[].section_id | string | 是 | 章节标识 |
| sections[].title | string | 是 | 章节标题 |
| sections[].content | string | 是 | 章节内容 |
| sections[].confidence | number | 是 | 章节置信度(0-1.0) |
| functional_requirements | array | 是 | 功能需求列表 |
| functional_requirements[].req_id | string | 是 | 需求标识 |
| functional_requirements[].title | string | 是 | 需求标题 |
| functional_requirements[].priority | enum(P0,P1,P2) | 是 | 优先级 |
| quality_gates | array | 是 | 质量门禁 |

**报告结构**：
```json
{
  "prd_id": "string",
  "check_timestamp": "ISO8601",
  "gate_results": {
    "gate1_completeness": {
      "status": "passed|failed|warning",
      "score": "number",
      "issues": [
        {
          "section": "string",
          "field": "string",
          "severity": "blocking|warning",
          "message": "string"
        }
      ]
    },
    "gate2_consistency": {
      "status": "passed|failed|warning",
      "score": "number",
      "traceability_chain": "intact|broken",
      "issues": []
    },
    "gate3_ambiguity": {
      "status": "passed|failed|warning",
      "auto_fixed": ["string"],
      "human_review_required": [
        {
          "location": "string",
          "question": "string",
          "options": ["string"]
        }
      ]
    },
    "gate4_traceability": {
      "status": "passed|failed|warning",
      "trace_coverage": "number%",
      "missing_traces": []
    }
  },
  "overall_status": "passed|failed|pending_human_review",
  "next_action": "string"
}
```

### 8.3 需人类确认清单

**格式**：Markdown
**文件命名**：`{PRD-ID}_human_review_required.md`

**输出内容**：
```markdown
# 需人类确认清单

生成时间：{时间}
PRD版本：v{版本}

## 歧义澄清问题

| # | 位置 | 问题 | 选项 |
|---|------|------|------|
| 1 | Section.X.X | 问题描述 | A/B/C |

## 优先级仲裁请求

| # | 冲突描述 | 涉及方 | 建议 |
|---|----------|--------|------|
| 1 | | | |

## 上游数据补充请求

| # | 字段 | 重要性 | 补充指导 |
|---|------|--------|----------|
| 1 | | | |
```

### 8.4 prd.json 完整 Schema

prd.json 是 PRD 的机器可消费版本，供 Backend/UI 下游 Skill 编程式消费，确保功能点、页面、实体、用户流程等核心信息可被自动解析和对齐。包含 7 个顶层数组：features、pages、entities、user_flows、non_functional_requirements、tracking_plan、traceability。

```json
{
  "prd_id": "string",
  "version": "string",
  "level": "L | S | X",
  "status": "draft | in_review | approved | released",
  "meta": {
    "title": "string",
    "owner": "string",
    "created_at": "ISO8601",
    "updated_at": "ISO8601"
  },
  "goals": [
    {
      "goal_id": "string",
      "description": "string",
      "okr_alignment": "string",
      "success_metrics": [
        {
          "metric_name": "string",
          "target_value": "string",
          "current_value": "string | null",
          "unit": "string"
        }
      ]
    }
  ],
  "features": [
    {
      "feature_id": "string",
      "name": "string",
      "description": "string",
      "priority": "must | should | could | wont",
      "status": "planned | in_progress | completed | cancelled",
      "goal_id": "string",
      "driven_by": {
        "north_star_metric": "string | null",
        "okr_objective": "string | null",
        "kr_id": "string | null",
        "expected_lift": "string"
      },
      "acceptance_criteria": [
        {
          "criterion_id": "string",
          "given": "string",
          "when": "string",
          "then": "string"
        }
      ],
      "dependencies": ["feature_id"],
      "related_pages": ["page_id"],
      "related_entities": ["entity_id"]
    }
  ],
  "pages": [
    {
      "page_id": "string",
      "name": "string",
      "route": "string",
      "description": "string",
      "data_requirements": [
        {
          "data_name": "string",
          "source": "api | local | cache",
          "data_operations": ["read | create | update | delete"],
          "related_entity": "entity_id | null",
          "fields": ["string"],
          "description": "string"
        }
      ],
      "functional_areas": ["string"],
      "user_flows": ["flow_id"],
      "states": [
        {
          "state_name": "string",
          "description": "string",
          "triggers": ["string"]
        }
      ]
    }
  ],
  "entities": [
    {
      "entity_id": "string",
      "name": "string",
      "description": "string",
      "fields": [
        {
          "field_name": "string",
          "type": "string",
          "required": "boolean",
          "description": "string",
          "constraints": "string | null"
        }
      ],
      "relationships": [
        {
          "target_entity_id": "string",
          "type": "one_to_one | one_to_many | many_to_many",
          "description": "string"
        }
      ],
      "api_endpoints": [
        {
          "method": "GET | POST | PUT | PATCH | DELETE",
          "path": "string",
          "description": "string"
        }
      ]
    }
  ],
  "user_flows": [
    {
      "flow_id": "string",
      "name": "string",
      "description": "string",
      "entry_page": "page_id",
      "steps": [
        {
          "step_id": "string",
          "action": "string",
          "page_id": "string",
          "expected_outcome": "string",
          "error_handling": "string | null"
        }
      ],
      "alternative_paths": [
        {
          "condition": "string",
          "steps": ["step_id"]
        }
      ]
    }
  ],
  "non_functional_requirements": {
    "performance": [
      {
        "requirement": "string",
        "metric": "string",
        "target": "string"
      }
    ],
    "availability": [
      {
        "requirement": "string",
        "metric": "string",
        "target": "string",
        "measurement": "string"
      }
    ],
    "security": [
      {
        "category": "authentication | authorization | encryption | audit | compliance",
        "requirement": "string",
        "implementation": "string"
      }
    ],
    "observability": [
      {
        "dimension": "metrics | logs | traces",
        "indicator": "string",
        "alert_threshold": "string"
      }
    ]
  },
  "tracking_plan": {
    "events": [
      {
        "event_id": "string",
        "event_name": "string",
        "trigger": "string",
        "properties": [
          {
            "property_name": "string",
            "type": "string",
            "required": "boolean"
          }
        ],
        "related_metric": "string"
      }
    ],
    "validation": {
      "coverage_target": "number",
      "data_delay_threshold": "string"
    }
  },
  "traceability": [
    {
      "feature_id": "string",
      "goal_id": "string",
      "upstream_source": "string",
      "upstream_artifact_id": "string"
    }
  ]
}
```
