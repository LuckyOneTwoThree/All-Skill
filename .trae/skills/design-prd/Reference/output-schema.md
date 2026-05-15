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
