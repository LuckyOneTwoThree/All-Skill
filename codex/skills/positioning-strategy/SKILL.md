---
name: positioning-strategy
description: "Product positioning strategy development integrating positioning statement, value curve, differentiation assessment and exclusion strategy. Keywords: product positioning, positioning strategy, differentiation, value curve, positioning statement."
metadata:
  module: "Product Business & Strategy"
  sub-module: "Product Positioning & Differentiation"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "Help me determine product positioning"
    - "Write a positioning statement"
    - "Analyze differentiation advantages"
    - "How do we differ from competitors"
    - "Is our differentiation sustainable"
execution_depth:
  default: standard
  quick_description: "Output positioning statement and differentiation strategy"
  deep_description: "Full strategy + positioning validation plan + differentiation quantified assessment + positioning evolution roadmap"
---

# Product Positioning Strategy Development

## Core Principles

1. **Formula-Driven Generation** -- Use [Target User] + [Product Name] + [Core Value] + [Differentiation Point] positioning formula
2. **3-5 Candidate Comparison** -- Generate 3-5 differentiated positioning statements with varying differentiation sources/user granularity/competitor references
3. **Five-Item Quality Gate** -- specific/differentiated/exclusive/verifiable/concise five checks must all pass before output
4. **Retry on Failure** -- Quality check failures auto-retry up to 3 times; if still failing, escalate to human
5. **User-Driven Competitive Factors** -- Competitive factors extracted from user research, not AI subjective setting
6. **Blue Ocean Four Actions Framework** -- Eliminate/Reduce/Raise/Create four actions must all be identified
7. **Quantified Differentiation Strength** -- Calculate differentiation strength 0-1 score via area method; <0.5 triggers warning
8. **Multi-Party Score Comparison** -- Score comparison between our product and each major competitor on the same factor, visualizing differences
9. **Five Dimensions Full Coverage** -- Feature/Experience/Scenario/Business/Ecosystem 5 dimensions, none can be missing
10. **Quantified Catch-Up Difficulty** -- Scoring criteria anchored to competitor catch-up time (3 months/6 months/12 months+), rejecting vague judgments
11. **Weighted Composite Score** -- Weighted calculation of comprehensive differentiation strength across dimensions; weights adjustable but must be explicit
12. **Most Sustainable Recommendation** -- Not only assess current differentiation but also recommend the most sustainable differentiation source
13. **Exclusion Is Strategic Choice** -- Exclusion is not lack of capability but focus; each exclusion must have a strategic rationale
14. **Overlap Hard Check** -- Reject exclusion recommendation when excluded users overlap with core users by >=30%
15. **Market Shrinkage Warning** -- Force human approval when potential market shrinks >=50% after exclusion
16. **Alternative Must Be Provided** -- Provide alternative recommendations for excluded user groups; cannot exclude without guidance

## Interaction Mode

AI->Human AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| Value Proposition Fit Results | JSON | Yes | output/pm-strategy/business-value-fit/evaluation_report.json | Value proposition fit score |
| Competitor Analysis Data | JSON | Yes | output/pm-discovery/market-competitor-analysis/competitor-analysis.json | Competitor positioning, differentiation factors |
| User Insights | JSON | Yes | user-research-user-modeling | User personas, core needs |
| Value Propositions | JSON | O | output/pm-strategy/business-model-canvas/bmc.json | Value propositions, Pain Relievers, Gain Creators |
| Self-Capability Assessment | JSON | O | User provided | Technical barriers, resource advantages |

## Execution Steps

### Step 1: Positioning Statement [Core]

#### Positioning Element Extraction
Extract positioning elements from input data:

1. **Target Users**: Extract core user groups from user personas
2. **Core Value**: Extract high-fit value from value proposition matching
3. **Differentiation Points**: Extract differentiation factors from competitor analysis
4. **Category Definition**: Define the product category

#### Positioning Statement Generation
Generate 3-5 positioning statements using the positioning formula:

**Positioning Formula**:
```
For [Target Users], [Product Name] is a [Category Definition],
that [Core Value], unlike [Competitor Reference], [Differentiation Point]
```

**Generation Strategy**:
1. **Differentiation Source Variation**: Feature differentiation/Experience differentiation/Scenario differentiation
2. **User Granularity Variation**: Broad user group/Precise user group
3. **Competitor Reference Variation**: Direct competitors/Indirect competitors/Traditional solutions

#### Quality Gate Check
Perform 5 quality checks on each positioning statement:

| Check Item | Standard | Pass Condition |
|--------|------|----------|
| Specific | Target users and value are clear | User group identifiable, value perceivable |
| Differentiated | Clear difference from competitors | Differentiation point verifiable |
| Exclusive | Not all competitors can say this | At least 1 competitor cannot claim it |
| Verifiable | Can be factually verified | Has quantifiable supporting evidence |
| Concise | One sentence says it all | Core expression <=30 characters |

#### Recommendation and Ranking
Based on quality gate check results, recommend and rank positioning statements:
- Fully passed ones ranked first
- Partially passed ones labeled with improvement suggestions
- Failed ones labeled with elimination reasons

### Step 2: Value Curve Analysis [Core]

#### Competitive Factor Extraction
Extract 5-8 competitive factors from user research data:

**Extraction Logic**:
1. Extract high-frequency keywords from user concern factors
2. Extract core value dimensions from value propositions
3. Extract competitor competition dimensions from competitor analysis
4. Merge and deduplicate to form 5-8 competitive factors

**Factor Naming Convention**:
- Use user language (not technical jargon)
- Each factor can be independently scored
- No overlap between factors

#### Competitor Scoring
Score each competitor on competitive factors 1-5:

**Scoring Standard**:
```
5: Industry leading, significantly better than competitors
4: Excellent, better than most competitors
3: Industry average
2: Below industry average
1: Clearly insufficient
```

**Scoring Basis**:
- Feature completeness
- User reviews
- Pricing competitiveness
- Market share

#### Our Scoring
Score our product on competitive factors 1-5:

**Scoring Principles**:
- Score objectively based on current capabilities
- No exaggeration, no underestimation
- Label scoring basis

#### Blue Ocean Four Actions Identification
Based on value curve analysis, identify 4 actions for Blue Ocean strategy:

**Eliminate**: Which competitive factors can be completely eliminated?
- Factors scored <=2
- Factors users don't care about
- High-cost but low-value factors

**Reduce**: Which competitive factors can have lower standards?
- Factors scored 3-4 but non-core
- Over-invested factors
- Factors with medium user attention

**Raise**: Which competitive factors need to be elevated?
- Core differentiation factors
- Factors with high user attention but low scores
- Factors where competitors are generally weak

**Create**: Which new competitive factors can be created?
- Unmet user needs
- Value competitors haven't provided
- Innovative features or experiences

#### Differentiation Strength Calculation
Calculate differentiation strength via area method:

```
Differentiation Strength = Area difference between our curve and competitor average curve / Maximum possible area difference
```

- Strength >= 0.7: Strong differentiation
- Strength 0.5-0.7: Moderate differentiation
- Strength < 0.5: Weak differentiation (triggers warning)

### Step 3: Differentiation Assessment [Core]

#### Feature Differentiation Assessment
Assess product feature differentiation degree:

| Score | Meaning | Description |
|------|------|------|
| 5 | Hard to replicate | Competitors need 12+ months to catch up |
| 3 | Moderate difficulty | Competitors need 3-6 months to catch up |
| 1 | Easy to replicate | Competitors can replicate within 3 months |

Assessment dimensions:
- Core feature uniqueness
- Technical complexity
- Data accumulation advantage

#### Experience Differentiation Assessment
Assess user experience differentiation:

| Score | Meaning | Description |
|------|------|------|
| 5 | Hard to catch up | User habits formed, high switching costs |
| 3 | Moderate difficulty | Requires sustained investment to maintain |
| 1 | Easy to catch up | Experience elements can be quickly replicated |

Assessment dimensions:
- User habit cultivation degree
- Interface/interaction uniqueness
- Usage flow efficiency

#### Scenario Differentiation Assessment
Assess vertical scenario depth:

| Score | Meaning | Description |
|------|------|------|
| 5 | Deep scenario | Deep understanding of industry know-how |
| 3 | Moderate scenario | Covers mainstream scenarios |
| 1 | Shallow scenario | Only generic features |

Assessment dimensions:
- Scenario coverage depth
- Industry professional knowledge
- Scenario solution completeness

#### Business Differentiation Assessment
Assess business model uniqueness:

| Score | Meaning | Description |
|------|------|------|
| 5 | Unique model | Business model hard to replicate |
| 3 | Replicable model | Model learnable but has barriers |
| 1 | Homogeneous model | Same as industry common model |

Assessment dimensions:
- Revenue structure uniqueness
- Cost structure advantage
- Business model moat

#### Ecosystem Differentiation Assessment
Assess ecosystem differentiation strength:

| Score | Meaning | Description |
|------|------|------|
| 5 | Strong ecosystem | Multi-party participation, strong network effects |
| 3 | Moderate ecosystem | Has some partners |
| 1 | Weak ecosystem | Single product |

Assessment dimensions:
- Number of partners
- Network effect strength
- Ecosystem lock-in capability

#### Comprehensive Differentiation Strength Calculation
Weighted calculation of comprehensive differentiation strength:
```
Comprehensive Differentiation Strength = (Feature x 0.25 + Experience x 0.20 + Scenario x 0.25 + Business x 0.15 + Ecosystem x 0.15) / 5
```

#### Most Sustainable Differentiation Source Recommendation
Based on 5 dimension scores, recommend the most sustainable differentiation source:
1. Identify the highest-scoring dimension
2. Analyze sustainability rationale
3. Provide specific action recommendations

### Step 4: Exclusion Strategy [Core]

#### AI Analysis - Competitor Coverage Scan
AI scans competitor analysis data to identify:
- User groups primarily covered by each competitor
- User groups with weak/no competitor coverage
- Potential differentiation opportunity points

#### AI Suggestion - Exclusion Candidate Generation
Based on positioning statements, AI generates 3-5 exclusion candidates:

**Exclusion Dimension Suggestions**:
1. **User Characteristic Dimension**: Exclude by demographic attributes
2. **Usage Scenario Dimension**: Exclude by usage scenarios
3. **Need Intensity Dimension**: Exclude by need depth
4. **Payment Capability Dimension**: Exclude by willingness to pay

#### Human Decision - Final Exclusion Statement
Product owner decides based on AI analysis suggestions:

**Must Clearly Answer**:
1. Which user groups do we explicitly not serve?
2. Why not serve these users? (Strategic reason)
3. What negative impact would serving these users have?

**Decision Principles**:
- Exclusion is for focus, not simple abandonment
- Each exclusion should have a clear strategic rationale
- Exclusion decisions must align with long-term product vision

### Output Depth Grading

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | positioning statement and differentiation strategy | Core conclusions + minimum viable deliverable |
| standard | Full deliverables (default) | Complete output including all Steps |
| deep | Full strategy + positioning validation plan + differentiation quantified assessment + positioning evolution roadmap | Full deliverables + extended analysis + deep simulation |

## Output

**Storage Path**: `output/pm-strategy/positioning-strategy/`

**Output Files**:

| File | Format | Description |
|------|------|------|
| positioning-strategy.json | JSON | Structured data (including statement + value_curve + differentiation + exclusion) |
| positioning-strategy.md | Markdown | Complete positioning strategy report |

**positioning-strategy.json Output Schema**:

```json
{
  "type": "object",
  "required": ["positioning_statements", "value_curve", "differentiation_scores", "exclusion"],
  "properties": {
    "positioning_statements": {"type": "array", "description": "3-5 positioning statement candidates"},
    "recommended_index": {"type": "number", "description": "Recommended index"},
    "value_curve": {"type": "object", "description": "Value curve data, including competitive factor scores and blue ocean actions"},
    "differentiation_scores": {"type": "object", "description": "Five-dimension differentiation scores"},
    "overall_differentiation_strength": {"type": "number", "description": "Comprehensive differentiation strength 0-1"},
    "recommended_differentiation_source": {"type": "object", "description": "Recommended most sustainable differentiation source"},
    "exclusion": {"type": "object", "description": "Exclusion decision data"}
  }
}
```

### Output Validation Rules

| Field Path | Type | Required | Description |
|----------|------|------|------|
| positioning_statements | array | Yes | 3-5 positioning statement candidates |
| positioning_statements[].statement | string | Yes | Full positioning statement |
| positioning_statements[].target_user | string | Yes | Target users |
| positioning_statements[].category | string | Yes | Category definition |
| positioning_statements[].core_value | string | Yes | Core value |
| positioning_statements[].differentiation | string | Yes | Differentiation point |
| positioning_statements[].competitor_reference | string | Yes | Competitor reference |
| positioning_statements[].quality_check.specific | boolean | Yes | Specific check |
| positioning_statements[].quality_check.differentiated | boolean | Yes | Differentiated check |
| positioning_statements[].quality_check.exclusive | boolean | Yes | Exclusive check |
| positioning_statements[].quality_check.verifiable | boolean | Yes | Verifiable check |
| positioning_statements[].quality_check.concise | boolean | Yes | Concise check |
| positioning_statements[].quality_check.all_passed | boolean | Yes | All passed flag |
| positioning_statements[].rank | number | Yes | Recommendation ranking |
| recommended_index | number | Yes | Recommended index |
| value_curve.competitive_factors | array | Yes | 5-8 competitive factors |
| value_curve.competitive_factors[].factor | string | Yes | Factor name |
| value_curve.competitive_factors[].our_score | number | Yes | Our score 1-5 |
| value_curve.competitive_factors[].competitor_scores | object | Yes | Each competitor's score |
| value_curve.blue_ocean_actions.eliminate | array | Yes | Eliminate actions list |
| value_curve.blue_ocean_actions.reduce | array | Yes | Reduce actions list |
| value_curve.blue_ocean_actions.raise | array | Yes | Raise actions list |
| value_curve.blue_ocean_actions.create | array | Yes | Create actions list |
| value_curve.differentiation_strength | number | Yes | Differentiation strength 0-1 |
| value_curve.differentiation_warning | boolean | Yes | True when differentiation strength <0.5 |
| differentiation_scores.feature | object | Yes | Feature differentiation score, including score/description/sustainability |
| differentiation_scores.experience | object | Yes | Experience differentiation score |
| differentiation_scores.scenario | object | Yes | Scenario differentiation score |
| differentiation_scores.business | object | Yes | Business differentiation score |
| differentiation_scores.ecosystem | object | Yes | Ecosystem differentiation score |
| overall_differentiation_strength | number | Yes | Comprehensive differentiation strength 0-1 |
| recommended_differentiation_source.dimension | string | Yes | Recommended dimension |
| recommended_differentiation_source.reason | string | Yes | Recommendation rationale |
| recommended_differentiation_source.action | string | Yes | Action recommendation |
| exclusion.exclusion_statement | string | Yes | Exclusion statement |
| exclusion.rationale | array | Yes | Exclusion rationale list |
| exclusion.rationale[].excluded_audience | string | Yes | Excluded user group |
| exclusion.rationale[].reason | string | Yes | Strategic rationale |
| exclusion.rationale[].alternative | string | Yes | Alternative recommendation |
| exclusion.implications.revenue_impact | string | Yes | Revenue impact |
| exclusion.implications.resource_optimization | string | Yes | Resource optimization description |
| exclusion.implications.brand_positioning | string | Yes | Brand positioning impact |
| exclusion.implications.risks | array | Yes | Potential risks list |
| exclusion.human_decision.decided_by | string | Yes | Decision maker |
| exclusion.human_decision.decided_at | string | Yes | Decision time |

## Decision Rules

| Condition | Decision |
|------|------|
| Quality gate 5 items all passed | Positioning statement can be output |
| Quality gate not passed | Auto-retry up to 3 times, escalate to human if still failing |
| Differentiation strength <0.5 | Trigger warning, recommend strategy adjustment |
| Blue ocean actions | Require human approval and confirmation |
| Competitive factors | Require human calibration |
| Dimension scores | Require human calibration for subjective dimensions |
| Comprehensive recommendation | Requires human final judgment confirmation |
| Disputed points | Escalate to human decision |
| Excluded user group overlaps with core users by >=30% | Reject exclusion recommendation, label "exclusion scope conflicts with core users" |
| Excluded user group overlaps with core users by <30% | Generate exclusion recommendation, label as "AI suggestion, requires human approval" |
| Potential market shrinks >=50% after exclusion | Label high risk, force human approval |
| Potential market shrinks <50% after exclusion | Normal process, human approval confirmation |
| Competitor already covers the excluded user group | Label "competitor already covers, exclusion needs differentiation rationale" |
| Exclusion rationale lacks data support (0 data points) | Return for data supplementation, cannot submit for approval |
| Exclusion rationale has >=2 data points | Can submit for human approval |
| Disputed decision (2+ stakeholders object) | Escalate to multi-party review |

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] 3-5 positioning statements generated
- [ ] Each statement uses positioning formula

### P1 Checks (must pass for standard/deep)

- [ ] 5 quality checks completed
- [ ] Recommendation ranking reasonable
- [ ] Differentiation sources diversified
- [ ] 5-8 competitive factors extracted
- [ ] Our and competitor scoring completed
- [ ] Blue ocean four actions identified
- [ ] Differentiation strength calculated
- [ ] Scoring basis labeled
- [ ] All 5 dimensions assessed, no omissions
- [ ] Scores have data support, avoiding subjective bias
- [ ] Recommendation rationale consistent with scoring logic
- [ ] Action recommendations convertible to product strategy
- [ ] Exclusion decisions consistent with product vision
- [ ] Clear exclusion rationale
- [ ] Exclusion statement clearly communicable to team
- [ ] Alternative recommendations provided for excluded users

### P2 Checks (must pass for deep only)

- [ ] Extended analysis complete (deep simulation and roadmap generated)
- [ ] Decision records complete (key decisions have rationale and alternatives)

---

## Degradation Strategy

When upstream files do not exist, this Skill can still execute independently:

| Missing Upstream Input | Degradation Plan | Output Impact | Data Acquisition Instructions |
|---------------|---------|---------|----------|
| evaluation_report.json (value proposition fit) | User provides product value description -> Generate positioning statements | Lacks value fit data, core value may not be precise enough | Request user to describe product value propositions and user pain points, or upload evaluation_report.json |
| competitor-analysis.json (competitor analysis) | User provides product value description -> Generate positioning statements | Lacks competitor data, differentiation points and competitor references lack basis | Request user to provide competitor names and their positioning, or upload competitor-analysis.json |
| evaluation_report.json + competitor-analysis.json | User provides product value description -> Generate positioning statements | Overall confidence reduced, positioning statements lack data anchoring | Request user to describe product value and competitive differences, or upload evaluation_report.json / competitor-analysis.json |
| All upstream files missing | Prompt user to execute prior phases first, or generate positioning statements based on user-provided product value description | Overall confidence significantly reduced, positioning statements are assumption-based only | Request user to describe product value and target users, or execute business-value-fit and market-competitor-analysis first |
| User insight data | If user insight data is missing, prompt user to provide or skip related steps | Target user definition may not be precise enough | Request user to describe target user characteristics and needs, or upload persona.json / voice-analysis.json |
| bmc.json | User provides competitor information -> Draw value curve | Lacks BMC data, our scoring lacks value proposition anchoring | Request user to describe business model and value propositions, or upload bmc.json |
| Self-capability assessment (user provided) | If user has not provided self-capability assessment, prompt user to provide or skip related steps | Feature and scenario differentiation assessment lacks internal data support | Prompt user to describe team capabilities, technical assets, and competitive advantages |

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Change | Impact Scope | Response Strategy |
|----------|----------|----------|
| evaluation_report value proposition fit change | Core value extraction | Re-execute Step 1, update positioning statements |
| competitor-analysis competitor analysis update | Differentiation points and competitor references | Re-execute Step 1-2, update differentiation factors |
| persona user persona update | Target user definition | Re-execute Step 1, update target users |
| competitor-analysis competitor data update | Competitor scoring and blue ocean actions | Re-execute Step 2, update competitor scoring |
| persona/voice-analysis user insight update | Competitive factor extraction | Re-execute Step 2, update competitive factors |
| bmc.json value proposition change | Our scoring and blue ocean actions | Re-execute Step 2, update our scoring |

### Downstream Notification Mechanism Table

| Change Type | Impact Scope | Notification Method |
|----------|----------|----------|
| Positioning statement change | business-strategy-report, planning-roadmap | Output file version number + change summary |
| Differentiation score change | business-strategy-report | Output file version number + change summary |
| Exclusion decision change | business-strategy-report, business-pricing | Output file version number + change summary |
| Market shrinkage assessment change | business-pricing | Output file version number + change summary |
