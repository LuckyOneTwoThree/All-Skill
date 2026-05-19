# PRD Generator Input Schema Reference

> This document is split from the design-prd SKILL.md and contains the complete input data structure definition and validation rules for the PRD Generator.

| Input | Type | Required | Source | Description |
|--------|------|------|------|------|
| metadata | JSON/object | Yes | System generated | Request metadata (request_id, trigger, requester, timestamp) |
| insight_analysis | JSON/object | O | output/pm-discovery/insight-analysis | Insight analysis output: user insights, pain points, behavior patterns, replaces original requirements-collection input |
| opportunity_definition | JSON/object | O | output/pm-discovery/opportunity-definition | Opportunity definition output: opportunity list, priority ranking, problem statements, replaces original requirements-understanding/prioritization input |
| exploration_outputs | JSON/object | O | Upstream exploration phase | Exploration phase output: user insights, problem statements |
| strategy_outputs | JSON/object | O | User provided | Strategy phase output: OKR, roadmap |
| ideation_outputs | JSON/object | O | output/pm-design/ideation-workshop/ideation-workshop.json | Ideation phase output: solutions, feature list |
| design_outputs | JSON/object | O | User provided | Design phase output: prototypes, user flows, information architecture |
| metrics_outputs | JSON/object | O | User provided | Metrics phase output: metric system, tracking plan |
| requirement | JSON/object | Yes | User provided | Requirement context (product_name required) and manual override configuration |

### 7.1 Input Data Structure

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
      "insight_analysis": {
        "insights": [
          {
            "insight_id": "string",
            "type": "user_feedback|analytics|competitor",
            "content": "string",
            "confidence": "high|medium|low",
            "source": "string"
          }
        ],
        "pain_points": [
          {
            "pain_id": "string",
            "description": "string",
            "severity": "high|medium|low",
            "affected_users": "number"
          }
        ],
        "behavior_patterns": [
          {
            "pattern_id": "string",
            "description": "string",
            "frequency": "string",
            "evidence": "string"
          }
        ]
      },
      "opportunity_definition": {
        "opportunities": [
          {
            "opportunity_id": "string",
            "title": "string",
            "description": "string",
            "priority": "P0|P1|P2",
            "effort_estimate": "number",
            "impact_estimate": "number"
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

### 7.2 Input Validation Rules

**Required Fields**:
- metadata.request_id
- upstream must include output from at least one phase
- requirement.context.product_name

**Optional Fields**:
- Other missing fields are handled according to L0/L1/L2 strategies
