---
name: stakeholder-analysis
description: "Stakeholder analysis integrating stakeholder map, communication strategy and strategic brief. Keywords: stakeholder, stakeholder map, communication strategy."
metadata:
  module: "Product Business & Strategy"
  sub-module: "Stakeholder Management"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "Help me map out stakeholders"
    - "Who will influence this project"
    - "Help me develop a stakeholder management strategy"
    - "How to communicate with various parties"
    - "Help me write a strategic brief for leadership"
    - "One-page strategy briefing"
execution_depth:
  default: standard
  quick_description: "Output stakeholder map and influence assessment"
  deep_description: "Full analysis + influence dynamics simulation + communication strategy design + interest balancing plan"
---

# Stakeholder Analysis

## Core Principles

1. **Four Categories Full Coverage** -- Product decision makers/resource controllers/affected parties/external stakeholders, all four categories must be covered
2. **Dual-Dimension Quantification** -- Influence and interest scored 1-5, four-quadrant classification evidence-based
3. **Key Decision Makers Not Missed** -- If key decision makers are not in the map, downstream process is blocked
4. **Communication Strategy Specificity** -- Each stakeholder's communication strategy must include concerns and suggested topics
5. **Six-Chapter Closed Loop** -- Background -> Opportunity -> Choice -> Success -> Risk -> Resource forms a complete logical closed loop
6. **Data Source Labeling** -- Each chapter labels data sources; inference without basis is not allowed
7. **Quality Score Gate** -- Document quality <60 auto-revises; if still below after revision, human review
8. **Cross-Department Mandatory Approval** -- When >=3 departments' resources are involved, mandatory human approval
9. **One-Page Principle** -- Decision makers don't have time for long documents; core arguments must fit on one page
10. **Audience Adaptation** -- Executives focus on strategic ROI, teams focus on execution collaboration, external parties focus on value and trust
11. **Key Information Not Missed** -- Strategic objectives/core risks/action items are all indispensable; missing any one requires return for supplementation
12. **Sensitive Data Desensitization** -- External briefs auto-desensitized; when action items >3, recommend focusing
13. **One-Page Principle** -- Decision makers don't have time for long documents; core arguments must fit on one page
14. **Audience Adaptation** -- Executives focus on strategic ROI, teams focus on execution collaboration, external parties focus on value and trust
15. **Key Information Not Missed** -- Strategic objectives/core risks/action items are all indispensable; missing any one requires return for supplementation
16. **Sensitive Data Desensitization** -- External briefs auto-desensitized; when action items >3, recommend focusing

## Interaction Mode

AI->Human AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| Business Model Canvas | JSON | Yes | output/pm-strategy/business-model-canvas/bmc.json | Key partners, customer relationships |
| Product/Business Info | string | Yes | User provided | Product name, organizational structure, business model |
| Business Strategy Report | JSON | O | output/pm-strategy/business-strategy-report/business-strategy-report.json | Strategic directions, OKRs, roadmap |
| Audience Type | string | Yes | User provided | executive/team/external |

## Execution Steps

### Step 1: Stakeholder Map [Core]

#### Stakeholder Identification

Identify stakeholders from 4 dimensions:

**1. Product Decision Makers**
- Product owner
- Business owner
- Technology owner
- Executive leadership

**2. Resource Controllers**
- Budget approvers
- Human resources
- Technology resources
- Data resources

**3. Affected Parties**
- Internal teams
- Existing users
- Partners
- Operations teams

**4. External Stakeholders**
- Regulatory bodies
- Industry associations
- Media
- Investors

#### Influence-Interest Assessment

Assess each stakeholder on dual dimensions:

**Influence Score (1-5)**:
```
5: Has final decision authority
4: Has major influence
3: Has moderate influence
2: Has minor influence
1: Almost no influence
```

**Interest Score (1-5)**:
```
5: Extremely attentive, actively participates
4: Highly attentive, regularly follows up
3: Moderately attentive, occasionally checks in
2: Low attention, passively informed
1: Almost no attention
```

#### Four-Quadrant Classification

Classify based on influence-interest matrix:

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

Determine 6 core chapters of the document:

1. **Background and Current Status**: Why stakeholder management is needed
2. **Opportunities and Challenges**: Opportunities and challenges stakeholders bring
3. **Strategy Selection**: Strategies for different stakeholders
4. **Success Criteria**: How to measure strategy success
5. **Risks and Contingencies**: Risks in stakeholder management
6. **Resources and Actions**: Required resources and action plans

#### Background and Current Status

Integrate stakeholder map and strategy report:

**Content Points**:
- Product strategic background
- Stakeholder landscape
- Key stakeholder identification
- Current relationship status

#### Opportunities and Challenges

Analyze opportunities and challenges stakeholders bring:

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
| Product VP | Support | Strong support | Deep involvement | Weekly strategic alignment meetings |
| Technology Director | Neutral | Support | Interest alignment | Joint technical solution reviews |
| CFO | Observing | Support | Data persuasion | Dedicated ROI briefing |

#### Success Criteria

Define measurement standards for strategy success:

| Metric | Current Value | Target Value | Measurement Method |
|------|--------|--------|---------|
| Key decision maker support rate | 60% | 90% | Decision pass rate |
| Resource acquisition efficiency | Medium | High | Resource request cycle |
| Stakeholder satisfaction | 3.5 | 4.5 | Quarterly survey |

#### Risks and Contingencies

Identify risks in stakeholder management:

| Risk | Probability | Impact | Contingency |
|------|------|------|------|
| Key decision maker change | Medium | High | Build multi-decision-maker relationships |
| Interest conflict escalation | Low | High | Early identification + mediation mechanism |
| Communication breakdown | Medium | Medium | Regular communication + feedback mechanism |

#### Document Assembly

**Document Structure**:

```
# {Product Name} Stakeholder Strategy Document

## 1. Background and Current Status
### 1.1 Strategic Background
### 1.2 Stakeholder Landscape
### 1.3 Key Stakeholders

## 2. Opportunities and Challenges
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
### 4.3 Evaluation Cycle

## 5. Risks and Contingencies
### 5.1 Risk Matrix
### 5.2 Mitigation Measures
### 5.3 Emergency Plans

## 6. Resources and Actions
### 6.1 Resource Requirements
### 6.2 Action Plan
### 6.3 Timeline

## Appendix
- Detailed stakeholder profiles
- Communication record templates
- Data sources
```

### Step 3: Strategic Brief [Core]

#### Audience Analysis

Determine briefing strategy based on audience type:

| Audience | Focus | Depth | Expression Style |
|------|--------|------|----------|
| Executive | Strategic ROI, risks, decisions | High-level overview | Data-driven, conclusions first |
| Team | Goals, collaboration, execution | Moderate detail | Clear action items, timeline |
| External | Value, trust, collaboration | Selected information | Value-oriented, desensitized |

#### Core Information Extraction

Extract core information from strategy report:

**Must-Have Information (all required)**:
1. Strategic objectives (1-3)
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
- [Direction 1]: [One-sentence description + Expected ROI]
- [Direction 2]: [One-sentence description + Expected ROI]

## Key Metrics
- North Star metric: [Metric name] = [Current value] -> [Target value]
- Core OKRs: [O1] / [O2]

## Core Risks
1. [Risk 1]: [Probability] x [Impact] = [Risk level]
2. [Risk 2]: [Probability] x [Impact] = [Risk level]
3. [Risk 3]: [Probability] x [Impact] = [Risk level]

## Decision Requests
- [ ] [Decision item 1]
- [ ] [Decision item 2]

## Next Steps
1. [Action 1] - Owner - Deadline
2. [Action 2] - Owner - Deadline
```

**Team Brief Template**:
```
# {Product Name} Strategic Alignment Brief

## Our Direction
- Strategic objectives: [O1] / [O2]
- This quarter's focus: [Focus 1] / [Focus 2]

## Our Goals
- KR1: [Target value] (Current: [Baseline value])
- KR2: [Target value] (Current: [Baseline value])

## Collaboration Points
- [Team A] responsible for [items]
- [Team B] responsible for [items]
- Dependencies: [Description]

## Milestones
- [Date]: [Milestone 1]
- [Date]: [Milestone 2]
```

**External Brief Template**:
```
# {Product Name} Collaboration Brief

## Product Value
- [Value proposition 1]
- [Value proposition 2]

## Collaboration Opportunities
- [Collaboration direction 1]
- [Collaboration direction 2]

## Contact Information
- [Contact person]
```

#### Desensitization Processing

Desensitize external briefs:
- Remove internal OKR data
- Remove specific financial figures
- Remove competitor comparison details
- Retain value propositions and collaboration directions

### Output Depth Grading

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | stakeholder map and influence assessment | Core conclusions + minimum viable deliverable |
| standard | Full deliverables (default) | Complete output including all Steps |
| deep | Full analysis + influence dynamics simulation + communication strategy design + interest balancing plan | Full deliverables + extended analysis + deep simulation |

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
    "stakeholder_map": {"type": "object", "description": "Stakeholder map, including four-quadrant classification and communication strategies"},
    "strategy_doc": {"type": "object", "description": "Stakeholder strategy document, including six-chapter closed loop"},
    "brief": {"type": "object", "description": "Strategic brief, including audience-adapted content"}
  }
}
```

### Output Validation Rules

| Field Path | Type | Required | Description |
|----------|------|------|------|
| stakeholder_map.stakeholders | array | Yes | Stakeholder list |
| stakeholder_map.stakeholders[].name | string | Yes | Name/role |
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
| stakeholder_map.key_decision_makers_identified | boolean | Yes | Whether key decision makers are identified |
| strategy_doc.doc_metadata.product_name | string | Yes | Product name |
| strategy_doc.doc_metadata.generated_at | string | Yes | Generation timestamp |
| strategy_doc.doc_metadata.data_sources | array | Yes | Data source list |
| strategy_doc.doc_metadata.quality_score | number | Yes | Document quality score 0-100 |
| strategy_doc.background.strategic_context | string | Yes | Strategic background |
| strategy_doc.background.stakeholder_overview | array | Yes | Stakeholder landscape |
| strategy_doc.background.key_stakeholders | array | Yes | Key stakeholders |
| strategy_doc.opportunities_and_challenges.opportunities | array | Yes | Opportunities list |
| strategy_doc.opportunities_and_challenges.challenges | array | Yes | Challenges list |
| strategy_doc.strategies | array | Yes | Strategy list, each including stakeholder/current_attitude/target_attitude/strategy/key_actions |
| strategy_doc.success_criteria | array | Yes | Success criteria list |
| strategy_doc.risks_and_contingencies | array | Yes | Risks and contingencies list |
| strategy_doc.resources_and_actions | object | Yes | Resources and action plan |
| brief.brief_metadata.audience_type | string | Yes | executive/team/external |
| brief.brief_metadata.generated_at | string | Yes | Generation timestamp |
| brief.brief_content.strategic_goals | array | Yes | 1-3 strategic objectives |
| brief.brief_content.key_risks | array | Yes | Top 3 risks |
| brief.brief_content.action_items | array | Yes | 3-5 action items |
| brief.brief_content.decision_requests | array | O | Decision requests (required for executive brief) |
| brief.brief_content.milestones | array | O | Milestones (required for team brief) |
| brief.brief_content.value_propositions | array | O | Value propositions (required for external brief) |
| brief.brief_content.desensitized | boolean | Yes | Whether desensitized (must be true for external brief) |

## Decision Rules

| Condition | Decision |
|------|------|
| Key decision maker check | At least 1 decision maker identified |
| Score calibration | Influence scores require human calibration |
| Communication strategy | Requires human approval and confirmation |
| Document quality score >=60 | Pass, can output |
| Document quality score <60 | Auto-revise and re-score |
| Still <60 after revision | Escalate to human review |
| Involves >=3 departments' resources | Mandatory human approval |
| Key stakeholder not covered | Return for supplementation |
| Strategic objectives missing | Return for supplementation, cannot generate brief |
| Core risks missing | Return for supplementation, cannot generate brief |
| Action items missing | Return for supplementation, cannot generate brief |
| Action items >3 | Label "recommend focusing on Top 3" |
| External brief contains sensitive data | Auto-desensitize |

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] All 4 stakeholder categories identified
- [ ] Each stakeholder has dual-dimension scores

### P1 Checks (must pass for standard/deep)

- [ ] Four-quadrant classification completed
- [ ] Communication strategies specific and executable
- [ ] Key decision makers identified
- [ ] 6 chapters complete
- [ ] Each chapter has data source labels
- [ ] Stakeholder coverage complete
- [ ] Strategies specific and executable
- [ ] Success criteria measurable
- [ ] Risks have contingencies
- [ ] Document quality score >=60
- [ ] One-page readable
- [ ] Three elements complete (objectives/risks/actions)
- [ ] Audience adaptation correct
- [ ] External brief desensitized
- [ ] Action items have owners and deadlines

### P2 Checks (must pass for deep only)

- [ ] Extended analysis complete (deep simulation and roadmap generated)
- [ ] Decision records complete (key decisions have rationale and alternatives)

---

## Degradation Strategy

When upstream files do not exist, this Skill can still execute independently:

| Missing Upstream Input | Degradation Plan | Output Impact | Data Acquisition Instructions |
|---------------|---------|---------|----------|
| bmc.json | User provides organizational structure and business info -> Identify stakeholders | Lacks BMC data, key partners and customer relationships may be missed | Request user to describe organizational structure and business model, or upload bmc.json |
| Product/business info (user provided) | If user has not provided product/business info, prompt user to provide or skip related steps | Stakeholder identification lacks business context | Prompt user to provide product name, business model, and organizational structure |
| bmc.json + Product/business info | User provides organizational structure and business info -> Identify stakeholders | Overall confidence reduced, stakeholder list may be incomplete | Request user to provide organizational structure and business info, or upload bmc.json |
| All upstream files missing | Prompt user to execute prior phases first, or identify stakeholders based on user-provided organizational structure info | Overall confidence significantly reduced, map is generic reference only | Request user to describe organizational structure and key roles, or execute business-model-canvas first |
| business-strategy-report.json | User provides strategic highlights -> Generate strategy document and brief | Lacks structured strategic data, strategy-strategy alignment may be insufficient | Request user to describe strategic priorities, or upload business-strategy-report.json |
| stakeholder-analysis.json (brief section) | If strategic brief is missing, does not affect core document generation | Brief content needs to be re-extracted from strategy report | Request user to provide strategic brief content or upload stakeholder-analysis.json |

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Change | Impact Scope | Response Strategy |
|----------|----------|----------|
| bmc.json key partner change | External stakeholder identification | Re-execute Step 1, update external stakeholders |
| bmc.json customer relationship change | Affected party identification | Re-execute Step 1, update affected parties |
| Organizational structure change | Decision makers and resource controllers | Re-execute Step 1, update decision makers and resource controllers |
| business-strategy-report strategic adjustment | Background and current status, opportunities and challenges | Re-execute Step 2, update strategic background and opportunity/challenge analysis |

### Downstream Notification Mechanism Table

| Change Type | Impact Scope | Notification Method |
|----------|----------|----------|
| Stakeholder list change | business-strategy-report | Output file version number + change summary |
| Strategy adjustment | business-strategy-report | Output file version number + change summary |
| Risk contingency update | business-strategy-report | Output file version number + change summary |
| Brief content change | No specific downstream | Output file version number + change summary |
