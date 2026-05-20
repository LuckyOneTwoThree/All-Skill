---
name: stakeholder-analysis
description: Use when conducting stakeholder analysis, stakeholder alignment, or communication strategy design. Integrates stakeholder map, communication strategy, and strategic brief. Keywords: stakeholder, stakeholder map, communication strategy.
metadata:
  module: "Product Business & Strategy"
  sub-module: "Stakeholder Management"
  type: "pipeline"
  version: "3.0"
  domain_tags: ["General"]
  trigger_examples:
    - "Help me map out stakeholders"
    - "Who will influence this project"
    - "Help me develop a stakeholder management strategy"
    - "How to communicate with various parties"
    - "Help me write a strategic brief for my boss"
    - "One-page strategic report"
  interaction_mode: "ai_suggest_human_approve"
execution_depth:
  default: standard
  quick_description: "Directly output stakeholder map and influence assessment"
  deep_description: "Complete analysis + influence dynamic simulation + communication strategy design + interest balancing plan"
---

# Stakeholder Analysis

## Core Principles

1. **Four Categories Full Coverage** — Product decision makers/Resource controllers/Affected parties/External stakeholders, all four categories must be covered
2. **Dual-Dimension Quantification** — Influence and interest scored 1-5, four-quadrant classification evidence-based
3. **Key Decision Makers Not Missed** — If key decision makers are not in the map, subsequent process is blocked
4. **Communication Strategy Specificity** — Each stakeholder's communication strategy must include concerns and suggested topics
5. **Six-Chapter Closed Loop** — Background → Opportunity → Choice → Success → Risk → Resource forms a complete logical closed loop
6. **Data Source Labeling** — Each chapter must label data sources; no unsupported inferences allowed
7. **Quality Score Gate** — Document quality <60 auto-revises; if still below standard after revision, human review
8. **Cross-Department Mandatory Approval** — When ≥3 departments' resources are involved, mandatory human approval
9. **One-Page Principle** — Decision makers don't have time for long documents; core arguments must be clear on one page
10. **Audience Adaptation** — Executives focus on strategic ROI, teams focus on execution collaboration, external parties focus on value and trust
11. **Key Information Not Missed** — Strategic goals/core risks/action items are indispensable; missing any one returns for revision
12. **Sensitive Data Desensitization** — External briefs auto-desensitized; when action items >3, suggest focusing

## Interaction Mode

🤖→👤 AI Suggests, Human Approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| Business Model Canvas | JSON | Yes | output/pm-strategy/business-model-canvas/bmc.json | Key partners, customer relationships |
| Product/Business information | string | Yes | User provided | Product name, organizational structure, business model |
| Business Strategy Report | JSON | No | output/pm-strategy/business-strategy-report/business-strategy-report.json | Strategic direction, OKR, roadmap |
| Audience type | string | Yes | User provided | executive/team/external |

## Execution Steps

### Step 1: Stakeholder Map [Core]

#### Stakeholder Identification

Identify stakeholders from 4 dimensions:

**1. Product Decision Makers**
- Product owner
- Business owner
- Technical lead
- Executive team

**2. Resource Controllers**
- Budget approvers
- Human resources
- Technical resources
- Data resources

**3. Affected Parties**
- Internal teams
- Existing users
- Partners
- Operations team

**4. External Stakeholders**
- Regulatory bodies
- Industry associations
- Media
- Investors

#### Influence-Interest Assessment

Perform dual-dimension assessment for each stakeholder:

**Influence Score (1-5)**:
```
5: Has final decision authority
4: Has significant influence
3: Has moderate influence
2: Has minor influence
1: Almost no influence
```

**Interest Score (1-5)**:
```
5: Extremely concerned, actively participates
4: Highly concerned, follows up regularly
3: Moderately concerned, checks in occasionally
2: Low concern, passively informed
1: Almost no concern
```

#### Four-Quadrant Classification

Classify based on the influence-interest matrix:

```
          │ High Interest    │ Low Interest
──────────┼─────────────────┼──────────────
High      │ Manage Closely   │ Keep Satisfied
Influence │ (Key Player)     │ (Keep Satisfied)
──────────┼─────────────────┼──────────────
Low       │ Keep Informed    │ Minimal Effort
Influence │ (Keep Informed)  │ (Minimal Effort)
```

#### Communication Strategy Development

Develop communication strategy for each stakeholder:

| Element | Content |
|------|------|
| Communication frequency | Daily/Weekly/Monthly/As needed |
| Communication method | Meeting/Email/Brief/One-on-one |
| Concerns | What this stakeholder cares about most |
| Suggested topics | What should be discussed during communication |
| Risk | Consequences of not communicating |

### Step 2: Communication Strategy [Core]

#### Document Structure Planning

Determine the 6 core chapters of the document:

1. **Background & Current Status**: Why stakeholder management is needed
2. **Opportunities & Challenges**: Opportunities and challenges brought by stakeholders
3. **Strategy Selection**: Strategies for different stakeholders
4. **Success Criteria**: How to measure strategy success
5. **Risks & Contingencies**: Risks in stakeholder management
6. **Resources & Actions**: Required resources and action plan

#### Background & Current Status

Integrate stakeholder map and strategy report:

**Content Points**:
- Product strategy background
- Stakeholder overview
- Key stakeholder identification
- Current relationship status

#### Opportunities & Challenges

Analyze opportunities and challenges brought by stakeholders:

**Opportunity Analysis**:
- Which stakeholders can become strategic allies
- How to leverage high-influence supporters
- Collaboration opportunity identification

**Challenge Analysis**:
- Which stakeholders may become obstacles
- Interest conflict identification
- Potential risk points

#### Strategy Selection

Develop strategies for each key stakeholder:

| Stakeholder | Current Attitude | Target Attitude | Strategy | Key Actions |
|-----------|---------|---------|------|---------|
| Product VP | Support | Strong support | Deep engagement | Weekly strategic alignment meetings |
| Technical Director | Neutral | Support | Interest alignment | Joint technical solution reviews |
| CFO | Observing | Support | Data persuasion | Dedicated ROI presentation |

#### Success Criteria

Define metrics for strategy success:

| Metric | Current Value | Target Value | Measurement Method |
|------|--------|--------|---------|
| Key decision maker support rate | 60% | 90% | Decision pass rate |
| Resource acquisition efficiency | Medium | High | Resource request cycle |
| Stakeholder satisfaction | 3.5 | 4.5 | Quarterly survey |

#### Risks & Contingencies

Identify risks in stakeholder management:

| Risk | Probability | Impact | Contingency |
|------|------|------|------|
| Key decision maker change | Medium | High | Build relationships with multiple decision makers |
| Interest conflict escalation | Low | High | Early identification + mediation mechanism |
| Communication breakdown | Medium | Medium | Regular communication + feedback mechanism |

#### Document Assembly

**Document Structure**:

```
# {Product Name} Stakeholder Strategy Document

## 1. Background & Current Status
### 1.1 Strategic Background
### 1.2 Stakeholder Overview
### 1.3 Key Stakeholders

## 2. Opportunities & Challenges
### 2.1 Strategic Ally Identification
### 2.2 Potential Obstacle Analysis
### 2.3 Interest Conflict Map

## 3. Strategy Selection
### 3.1 Manage Closely Strategy
### 3.2 Keep Satisfied Strategy
### 3.3 Keep Informed Strategy
### 3.4 Minimal Effort Strategy

## 4. Success Criteria
### 4.1 Key Metrics
### 4.2 Measurement Methods
### 4.3 Assessment Cycle

## 5. Risks & Contingencies
### 5.1 Risk Matrix
### 5.2 Mitigation Measures
### 5.3 Emergency Plans

## 6. Resources & Actions
### 6.1 Resource Requirements
### 6.2 Action Plan
### 6.3 Timeline

## Appendix
- Detailed stakeholder profiles
- Communication record template
- Data sources
```

### Step 3: Strategic Brief [Core]

#### Audience Analysis

Determine brief strategy based on audience type:

| Audience | Focus | Depth | Expression Style |
|------|--------|------|----------|
| Executive | Strategic ROI, risks, decisions | High-level overview | Data-driven, conclusions first |
| Team | Goals, collaboration, execution | Moderate detail | Clear action items, timeline |
| External | Value, trust, collaboration | Selected information | Value-oriented, desensitized |

#### Core Information Extraction

Extract core information from the strategy report:

**Must-Have Information (none can be missing)**:
1. Strategic goals (1-3)
2. Core risks (Top 3)
3. Action items (3-5)

**Optional Information**:
- Market data
- Competitive landscape
- Resource requirements
- Timeline

#### Brief Generation

Generate briefs by audience type:

**Executive Brief Template**:
```
# {Product Name} Strategic Brief

## Strategic Direction
- [Direction 1]: [One-line description + Expected ROI]
- [Direction 2]: [One-line description + Expected ROI]

## Key Metrics
- North Star Metric: [Metric Name] = [Current Value] → [Target Value]
- Core OKR: [O1] / [O2]

## Core Risks
1. [Risk 1]: [Probability] × [Impact] = [Risk Level]
2. [Risk 2]: [Probability] × [Impact] = [Risk Level]
3. [Risk 3]: [Probability] × [Impact] = [Risk Level]

## Decision Requests
- [ ] [Decision Item 1]
- [ ] [Decision Item 2]

## Next Actions
1. [Action 1] - Owner - Deadline
2. [Action 2] - Owner - Deadline
```

**Team Brief Template**:
```
# {Product Name} Strategic Alignment Brief

## Our Direction
- Strategic goals: [O1] / [O2]
- This quarter's focus: [Focus 1] / [Focus 2]

## Our Goals
- KR1: [Target Value] (Current: [Baseline Value])
- KR2: [Target Value] (Current: [Baseline Value])

## Collaboration Points
- [Team A] responsible for [Items]
- [Team B] responsible for [Items]
- Dependencies: [Description]

## Milestones
- [Date]: [Milestone 1]
- [Date]: [Milestone 2]
```

**External Brief Template**:
```
# {Product Name} Collaboration Brief

## Product Value
- [Value Proposition 1]
- [Value Proposition 2]

## Collaboration Opportunities
- [Collaboration Direction 1]
- [Collaboration Direction 2]

## Contact Information
- [Contact Person]
```

#### Desensitization Processing

Desensitize external briefs:
- Remove internal OKR data
- Remove specific financial figures
- Remove competitor comparison details
- Retain value propositions and collaboration directions

### Output Depth Grading

| Depth Level | Output Scope | Description |
|----------|----------|----------|
| quick | Stakeholder map and influence assessment | Core conclusions + minimum viable output |
| standard | Complete output (current default) | Complete output, including all Step outputs |
| deep | Complete analysis + influence dynamic simulation + communication strategy design + interest balancing plan | Complete output + extended analysis + deep simulation |

## Output

**Storage Path**: `output/pm-strategy/stakeholder-analysis/`

**Output Files**:

| File | Format | Description |
|------|------|------|
| stakeholder-analysis.json | JSON | Structured data (including map + strategy + brief) |
| stakeholder-analysis.md | Markdown | Complete stakeholder analysis report |

**stakeholder-analysis.json Output Schema**:

```json
{
  "type": "object",
  "required": ["stakeholder_map", "strategy_doc", "brief"],
  "properties": {
    "stakeholder_map": {"type": "object", "description": "Stakeholder map, including four-quadrant classification and communication strategy"},
    "strategy_doc": {"type": "object", "description": "Stakeholder strategy document, including six-chapter closed loop"},
    "brief": {"type": "object", "description": "Strategic brief, including audience-adapted content"}
  }
}
```

### Output Validation Rules

| Field Path | Type | Required | Description |
|----------|------|------|------|
| stakeholder_map.stakeholders | array | Yes | Stakeholder list |
| stakeholder_map.stakeholders[].name | string | Yes | Name/Role |
| stakeholder_map.stakeholders[].category | string | Yes | decision_maker/resource_controller/affected/external |
| stakeholder_map.stakeholders[].influence | number | Yes | Influence 1-5 |
| stakeholder_map.stakeholders[].interest | number | Yes | Interest 1-5 |
| stakeholder_map.stakeholders[].quadrant | string | Yes | key_player/keep_satisfied/keep_informed/minimal_effort |
| stakeholder_map.stakeholders[].communication_strategy | object | Yes | Communication strategy |
| stakeholder_map.stakeholders[].communication_strategy.frequency | string | Yes | Communication frequency |
| stakeholder_map.stakeholders[].communication_strategy.method | string | Yes | Communication method |
| stakeholder_map.stakeholders[].communication_strategy.concerns | array | Yes | Concerns list |
| stakeholder_map.stakeholders[].communication_strategy.suggested_topics | array | Yes | Suggested topics list |
| stakeholder_map.stakeholders[].communication_strategy.risk | string | Yes | Risk of not communicating |
| stakeholder_map.quadrant_summary | object | Yes | Four-quadrant summary |
| stakeholder_map.key_decision_makers_identified | boolean | Yes | Whether key decision makers have been identified |
| strategy_doc.doc_metadata.product_name | string | Yes | Product name |
| strategy_doc.doc_metadata.generated_at | string | Yes | Generation timestamp |
| strategy_doc.doc_metadata.data_sources | array | Yes | Data source list |
| strategy_doc.doc_metadata.quality_score | number | Yes | Document quality score 0-100 |
| strategy_doc.background.strategic_context | string | Yes | Strategic background |
| strategy_doc.background.stakeholder_overview | array | Yes | Stakeholder overview |
| strategy_doc.background.key_stakeholders | array | Yes | Key stakeholders |
| strategy_doc.opportunities_and_challenges.opportunities | array | Yes | Opportunities list |
| strategy_doc.opportunities_and_challenges.challenges | array | Yes | Challenges list |
| strategy_doc.strategies | array | Yes | Strategy list, each containing stakeholder/current_attitude/target_attitude/strategy/key_actions |
| strategy_doc.success_criteria | array | Yes | Success criteria list |
| strategy_doc.risks_and_contingencies | array | Yes | Risks and contingencies list |
| strategy_doc.resources_and_actions | object | Yes | Resources and action plan |
| brief.brief_metadata.audience_type | string | Yes | executive/team/external |
| brief.brief_metadata.generated_at | string | Yes | Generation timestamp |
| brief.brief_content.strategic_goals | array | Yes | 1-3 strategic goals |
| brief.brief_content.key_risks | array | Yes | Top 3 risks |
| brief.brief_content.action_items | array | Yes | 3-5 action items |
| brief.brief_content.decision_requests | array | No | Decision requests (required for executive brief) |
| brief.brief_content.milestones | array | No | Milestones (required for team brief) |
| brief.brief_content.value_propositions | array | No | Value propositions (required for external brief) |
| brief.brief_content.desensitized | boolean | Yes | Whether desensitized (must be true for external brief) |

## Decision Rules

| Condition | Decision |
|------|------|
| Key decision maker check | At least 1 decision maker identified |
| Score calibration | Influence scores require human calibration |
| Communication strategy | Requires human approval and confirmation |
| Document quality score ≥60 | Pass, can output |
| Document quality score <60 | Auto-revise and re-score |
| Still <60 after revision | Escalate to human review |
| Involves ≥3 departments' resources | Mandatory human approval |
| Key stakeholders not covered | Return for supplementation |
| Strategic goals missing | Return for supplementation, cannot generate brief |
| Core risks missing | Return for supplementation, cannot generate brief |
| Action items missing | Return for supplementation, cannot generate brief |
| Action items >3 | Label "Recommend focusing on Top 3" |
| External brief contains sensitive data | Auto-desensitize |

## Quality Check

### P0 Check (must pass for quick/standard/deep)

- [ ] All 4 stakeholder categories identified
- [ ] Each stakeholder has dual-dimension scores

### P1 Check (must pass for standard/deep)

- [ ] Four-quadrant classification completed
- [ ] Communication strategies are specific and actionable
- [ ] Key decision makers identified
- [ ] 6 chapters complete
- [ ] Each chapter has data source labeling
- [ ] Stakeholder coverage is complete
- [ ] Strategies are specific and actionable
- [ ] Success criteria are measurable
- [ ] Risks have contingencies
- [ ] Document quality score ≥60
- [ ] Can be read on one page
- [ ] Three elements complete (goals/risks/actions)
- [ ] Audience adaptation is correct
- [ ] External brief desensitized
- [ ] Action items have owners and deadlines

### P2 Check (only deep must pass)

- [ ] Extended analysis complete (deep simulation and roadmap generated)
- [ ] Decision records complete (key decisions have rationale and alternatives)

---

## Degradation Strategy

When upstream files do not exist, this Skill can still execute independently:

| Missing Upstream Input | Degradation Plan | Output Impact | Data Acquisition Instructions |
|---------------|---------|---------|------------|
| bmc.json | User provides organizational structure and business information → Identify stakeholders | Lacks BMC data, key partners and customer relationships may be missed | Ask user to provide key business model elements or upload bmc.json file |
| Product/Business information (user provided) | If user has not provided product/business information, prompt user to provide or skip steps related to this input | Stakeholder identification lacks business context | Ask user to provide product name, core features, and business model description |
| bmc.json + Product/Business information | User provides organizational structure and business information → Identify stakeholders | Overall confidence reduced, stakeholder list may be incomplete | Ask user to provide organizational structure, business model, and key partner information |
| All upstream files missing | Prompt user to execute prior stages first, or identify stakeholders based on user-provided organizational structure information | Overall confidence significantly reduced, map is only a general reference | Ask user to provide organizational structure, product features, and business goals |
| business-strategy-report.json | User provides strategic highlights → Generate strategy document and brief | Lacks structured strategy data, strategy-strategy alignment may be insufficient | Ask user to provide strategic direction and key strategy highlights or upload business-strategy-report.json file |
| stakeholder-analysis.json (brief section) | If strategic brief is missing, it does not affect core document generation | Brief content needs to be re-extracted from strategy report | Ask user to provide stakeholder analysis summary or upload stakeholder-analysis.json file |

## Data Acquisition Instructions

This Skill requires Business Model Canvas and product/business information. Please provide via one of the following methods:
  1. Directly provide organizational structure, product name, and business model
  2. Upload bmc.json file
  3. Provide data file paths
- AI is not responsible for external data collection, only for analysis

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Change | Impact Scope | Response Strategy |
|----------|----------|----------|
| bmc.json key partners change | External stakeholder identification | Re-execute Step 1, update external stakeholders |
| bmc.json customer relationships change | Affected party identification | Re-execute Step 1, update affected parties |
| Organizational structure change | Decision makers and resource controllers | Re-execute Step 1, update decision makers and resource controllers |
| business-strategy-report strategy adjustment | Background & current status, opportunities & challenges | Re-execute Step 2, update strategic background and opportunity/challenge analysis |

### Downstream Notification Mechanism Table

| Change Type | Impact Scope | Notification Method |
|----------|----------|----------|
| Stakeholder list change | business-strategy-report | Output file version number + change summary |
| Strategy adjustment | business-strategy-report | Output file version number + change summary |
| Risk contingency update | business-strategy-report | Output file version number + change summary |
| Brief content change | No specific downstream | Output file version number + change summary |
