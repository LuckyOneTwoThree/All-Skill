# PRD生成器 输入Schema参考

> 本文档从 design-prd SKILL.md 拆分而来，包含PRD生成器的完整输入数据结构定义和验证规则。

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| metadata | JSON/object | 是 | 系统生成 | 请求元信息（request_id、trigger、requester、timestamp） |
| exploration_outputs | JSON/object | ○ | output/pm-design/requirements-understanding/requirement_analysis.json | 探索阶段输出：用户洞察、问题陈述 |
| strategy_outputs | JSON/object | ○ | 用户提供 | 战略阶段输出：OKR、路线图 |
| ideation_outputs | JSON/object | ○ | output/pm-design/ideation-convergence/converged_solutions.json | 构思阶段输出：解决方案、功能列表 |
| design_outputs | JSON/object | ○ | 用户提供 | 设计阶段输出：原型、用户流程、信息架构 |
| metrics_outputs | JSON/object | ○ | 用户提供 | 度量阶段输出：指标体系、埋点方案 |
| requirement | JSON/object | 是 | 用户提供 | 需求上下文（product_name必填）及手动覆盖配置 |

### 7.1 输入数据结构

```json
{
  "prd_input": {
    "metadata": {
      "request_id": "string",
      "trigger": "manual|automated",
      "requester": "string",
      "timestamp": "ISO8601"
    },
    "upstream": {
      "exploration_outputs": {
        "insights": [
          {
            "insight_id": "string",
            "type": "user_feedback|analytics|competitor",
            "content": "string",
            "confidence": "high|medium|low",
            "source": "string"
          }
        ],
        "problem_statements": [
          {
            "ps_id": "string",
            "description": "string",
            "impact": {
              "user_count": "number",
              "business_loss": "string",
              "frequency": "string"
            }
          }
        ]
      },
      "strategy_outputs": {
        "okr": {
          "objective": "string",
          "key_results": [
            {
              "kr_id": "string",
              "description": "string",
              "metric": "string",
              "baseline": "number",
              "target": "number"
            }
          ]
        },
        "roadmap": {
          "items": [
            {
              "item_id": "string",
              "title": "string",
              "priority": "P0|P1|P2|P3",
              "effort_estimate": "number",
              "team_scope": ["string"]
            }
          ]
        }
      },
      "ideation_outputs": {
        "solutions": [
          {
            "solution_id": "string",
            "title": "string",
            "description": "string",
            "moscow": "Must|Should|Could|Wont",
            "effort": "number",
            "dependencies": ["string"]
          }
        ]
      },
      "design_outputs": {
        "prototypes": [
          {
            "prototype_id": "string",
            "type": "wireframe|high_fidelity|interactive",
            "pages": ["string"],
            "url": "string"
          }
        ],
        "user_flows": [
          {
            "flow_id": "string",
            "steps": [
              {
                "step": "number",
                "action": "string",
                "page": "string",
                "feedback": "string"
              }
            ]
          }
        ],
        "information_architecture": {
          "structure": "object"
        }
      },
      "metrics_outputs": {
        "primary_metrics": [
          {
            "metric_id": "string",
            "name": "string",
            "definition": "string",
            "data_source": "string"
          }
        ],
        "guardrail_metrics": [
          {
            "metric_id": "string",
            "name": "string",
            "threshold": "string"
          }
        ],
        "tracking_plan": {
          "events": [
            {
              "event_id": "string",
              "name": "string",
              "trigger": "string",
              "properties": ["string"]
            }
          ]
        }
      }
    },
    "requirement": {
      "manual_overrides": {
        "prd_level": "L|S|X",
        "custom_priorities": ["string"],
        "excluded_items": ["string"]
      },
      "context": {
        "product_name": "string",
        "team": "string",
        "business_unit": "string"
      }
    }
  }
}
```

### 7.2 输入验证规则

**必填字段**：
- metadata.request_id
- upstream至少包含一个阶段的输出
- requirement.context.product_name

**可选字段**：
- 其他字段缺失按L0/L1/L2策略处理
