---
name: acquisition-analysis
description: Use when evaluating acquisition channels or optimizing the acquisition funnel. An integrated acquisition analysis pipeline that first analyzes 19 acquisition channel data to calculate channel scale, conversion rate, and ROI, outputting a channel tiering report, then analyzes acquisition funnel data to identify the largest drop-off nodes and automatically generates optimization plans and A/B test designs. Keywords: acquisition channel, channel evaluation, ROI analysis, channel tiering, acquisition optimization, funnel optimization, conversion optimization, A/B testing, acquisition funnel, low conversion rate, which channel is best, how to improve conversion.
metadata:
  module: "Product Growth & Operations"
  sub-module: "Acquisition"
  type: "pipeline"
  version: "3.0"
  domain_tags: ["Internet", "SaaS", "General"]
  trigger_examples:
    - "Which channel has the best user acquisition results"
    - "Help me check the ROI of each channel"
    - "The registration-to-activation conversion rate is too low"
    - "Where is the biggest drop-off in the funnel"
    - "How to improve acquisition conversion rate"
  interaction_mode: "ai_suggest_human_approve"
execution_depth:
  default: standard
  quick_description: "Directly output acquisition channel and CAC analysis"
  deep_description: "Full analysis + channel attribution model + CAC optimization simulation + acquisition experiment roadmap"
---

# Integrated Acquisition Analysis

## Core Principles

1. **Channels as Investment Portfolio**: Each channel is an investment, evaluated with both ROI and scale dimensions rather than a single metric
2. **Tiered Management with Dynamic Adjustment**: Primary/Test/Observation three-tier dynamic rotation, data-driven upgrades and downgrades
3. **LTV Perspective for ROI**: Channel ROI must consider user LTV rather than single-time revenue, avoiding short-sighted elimination of long-cycle high-value channels
4. **Drop-off is Signal**: Every drop-off node is users voting with their feet; the node with the highest drop-off rate is the biggest optimization lever
5. **Obstacle Classification for Targeted Resolution**: Awareness/Trust/Action/Value four types of obstacles require completely different optimization approaches
6. **Experiment Validation Over Guessing**: Optimization plans must be validated through A/B testing, using data to replace intuition

## Interaction Mode

🤖→👤 AI Suggests, Human Approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| 19 acquisition channel data | object | Yes | User provided | Complete data for 19 acquisition channels |
| Historical channel performance | object | Yes | User provided | Historical channel performance data |
| Channel configuration and costs | object | Yes | User provided | Channel configuration and cost data |
| Historical optimization data | object | ○ | User provided | Historical optimization experiment data |

## List of 19 Acquisition Channels

### Paid Acquisition Channels
1. **Search Ads (SEM)** - Google Ads, Baidu PPC
2. **Social Ads** - Facebook/Instagram Ads, LinkedIn Ads, WeChat Moments Ads
3. **Display Ads** - DSP ads, native ads
4. **Video Ads** - YouTube Ads, Douyin/Kuaishou Ads
5. **App Store Ads** - Apple Search Ads, Google Play Ads

### Organic Acquisition Channels
6. **SEO/SEM Organic** - Search engine organic rankings
7. **Content Marketing** - Blog posts, whitepapers, case studies
8. **Social Media Organic** - Weibo, Xiaohongshu, Douyin organic content
9. **Community Operations** - Zhihu, Tieba, industry forums
10. **Viral Spread** - User sharing, word-of-mouth

### Partnership Acquisition Channels
11. **Affiliate Marketing** - Partner referral commissions
12. **Channel Distribution** - Distributor/agent networks
13. **Platform Partnerships** - App marketplace features, platform launches
14. **Cross-brand Collaboration** - Brand joint campaigns

### Sales Acquisition Channels
15. **SDR Outbound** - Telesales team proactive outreach
16. **Offline Events** - Industry exhibitions, offline salons
17. **Sales Referrals** - Sales lead referrals

### Other Channels
18. **Existing User Outreach** - Email marketing, push notifications, SMS
19. **PR/Brand** - Media coverage, brand events

## Execution Steps

### Step 1: Channel Evaluation (from acquisition-channel) [Conditional]

Analyze 19 acquisition channel data, calculate channel scale, conversion rate, ROI, and output a channel tiering report.

#### 1.1 Channel Scale Evaluation

Analyze the reachable scale and actual deployment scale of each channel:

- **Reachable Scale**: Size of the channel's potential user pool
- **Actual Deployment Scale**: Number of users covered by current resource investment
- **Market Share**: Proportion of investment relative to competitors
- **Growth Potential**: Growth trend of channel scale

#### 1.2 Conversion Rate Analysis

Calculate the complete conversion funnel for each channel:

| Metric | Description |
|------|------|
| Impression → Click conversion rate | Ad display to user click |
| Click → Visit conversion rate | Ad click to page visit |
| Visit → Registration conversion rate | Page visit to account registration |
| Registration → Activation conversion rate | Account registration to first use |
| Overall conversion rate | End-to-end conversion from impression to activation |

#### 1.3 ROI Calculation

Calculate the return on investment for each channel:

```
Channel ROI = (Revenue from channel - Channel investment cost) / Channel investment cost

LTV-adjusted ROI = (User LTV from channel - Channel CAC) / Channel CAC
```

#### 1.4 Channel Tiering

Tier channels based on multi-dimensional scoring:

##### Primary Channels
- ROI ≥ Target ROI
- Scalable
- Controllable acquisition cost
- High user quality

##### Test Channels
- ROI close to target but unstable
- Growth potential to be validated
- New acquisition method exploration
- Specific user segment targeting

##### Observation Channels
- ROI below target
- Strategic significance greater than short-term ROI
- Primarily brand building
- In optimization phase

#### Scoring Model

```
Composite Score = 0.3 × ROI Score + 0.25 × Scale Score + 0.25 × Quality Score + 0.2 × Sustainability Score
```

#### Channel Evaluation Decision Rules

| Situation | Action |
|------|----------|
| Channel ROI ≥ target and scale is expandable | Tier as primary channel, increase investment |
| Channel ROI close to target but unstable | Tier as test channel, continue validation |
| Channel ROI < target and no strategic significance | Tier as observation channel, reduce investment |
| New channel with no historical data | Small traffic test, evaluate after 2 weeks |

### Step 2: Funnel Optimization (from acquisition-optimize) [Core]

Based on the channel evaluation data output from Step 1, analyze acquisition funnel data, identify the largest drop-off nodes, and automatically generate optimization plans and A/B test designs.

#### Funnel Stage Definitions

The standard acquisition funnel includes the following stages:

```
Impression → Click → Visit → Register → Activate → Pay
```

##### Stage 1: Impression
- Ad displayed to target users
- Key metrics: Impression volume, CTR

##### Stage 2: Click
- User clicks ad to enter landing page
- Key metrics: Click volume, CPM

##### Stage 3: Visit
- User visits landing page/product page
- Key metrics: UV, bounce rate, page dwell time

##### Stage 4: Register
- User completes account registration
- Key metrics: Registration volume, registration rate

##### Stage 5: Activate
- User completes core action for the first time
- Key metrics: Activation volume, activation rate

##### Stage 6: Pay (Optional)
- User completes first payment
- Key metrics: Payment volume, payment conversion rate

#### 2.1 Funnel Layer Conversion Analysis

1. **Calculate conversion rate at each layer**: Identify conversion efficiency at each stage
2. **Benchmark comparison**: Compare with industry benchmarks and historical data
3. **Trend analysis**: Time trends of conversion rates at each layer
4. **Channel comparison**: Funnel performance differences across channels

#### 2.2 Largest Drop-off Node Identification

1. **Calculate drop-off impact coefficient**:
   ```
   Impact Coefficient = Drop-off rate at this layer × Conversion rate weight from this layer to final
   ```

2. **Multi-dimensional breakdown**:
   - By channel
   - By user persona
   - By traffic source
   - By time period

3. **Drop-off cause inference**:
   - Quantitative analysis: User behavior data
   - Qualitative analysis: User feedback, interviews

#### 2.3 Optimization Plan Auto-generation

Based on drop-off cause analysis, generate targeted optimization plans:

| Drop-off Type | Optimization Direction | Typical Solutions |
|---------|---------|---------|
| Awareness Barrier | Optimize ad creatives | Highlight value proposition, improve creative design |
| Trust Barrier | Enhance social proof | Add reviews, case studies, data |
| Action Barrier | Simplify process | Reduce steps, lower barriers |
| Value Barrier | Strengthen value perception | Demo features, free trial |

#### 2.4 A/B Test Design

Design A/B tests for optimization plans:

1. **Hypothesis definition**: Clarify the optimization hypothesis being tested
2. **Sample size calculation**: Determine the sample size needed to achieve statistical significance
3. **Test grouping**: Design control and treatment groups
4. **Monitoring metrics**: Define primary and secondary monitoring metrics
5. **Decision rules**: Define when to stop the test and determine the winner

### Output Depth Tiering

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | Acquisition channel and CAC analysis | Core conclusions + minimum viable output |
| standard | Full output (current default) | Complete output including all Step outputs |
| deep | Full analysis + channel attribution model + CAC optimization simulation + acquisition experiment roadmap | Full output + extended analysis + deep inference |

## Output

**Storage Path**: `output/pm-growth/acquisition-analysis/`

**Output Files**: acquisition-analysis.json, acquisition-analysis.md

**Output Schema**:

```json
{
  "type": "object",
  "required": ["channel_assessment", "funnel_analysis", "optimization_suggestions"],
  "properties": {
    "channel_assessment": {"type": "object", "description": "Channel evaluation results, including channel details, tiering, and summary metrics"},
    "funnel_analysis": {"type": "object", "description": "Funnel analysis, including stage data and key drop-off nodes"},
    "optimization_suggestions": {"type": "array", "description": "Optimization suggestion list, including priority, issue, solution, and expected improvement"},
    "ab_test_designs": {"type": "array", "description": "A/B test design plan list"}
  }
}
```

`acquisition_analysis`
```json
{
  "channel_assessment": {
    "channels": [
      {
        "name": "Education Industry Exhibition",
        "scale": "Reaches 50K+ education institution decision-makers annually",
        "volume": 10000,
        "conversion_rate": 0.035,
        "cost_per_acquisition": 45.00,
        "roi": 2.5,
        "quality_score": 0.85,
        "classification": "primary|test|observation"
      }
    ],
    "primary_channels": ["Education Industry Exhibition", "SEO/SEM Organic", "Content Marketing"],
    "test_channels": ["Social Ads", "Community Operations", "Affiliate Marketing"],
    "observation_channels": ["PR/Brand", "Cross-brand Collaboration", "Video Ads"],
    "total_new_users": 50000,
    "blended_cac": 35.00,
    "blended_roi": 2.2
  },
  "funnel_analysis": {
    "stages": [
      {
        "name": "Registration",
        "volume": 100000,
        "conversion_rate": 0.05,
        "drop_off_rate": 0.95,
        "avg_time_spent": 30
      }
    ],
    "critical_drop_off": {
      "from_stage": "Visit",
      "to_stage": "Registration",
      "drop_off_rate": 0.85,
      "impact_score": 0.9
    }
  },
  "optimization_suggestions": [
    {
      "priority": 1,
      "stage": "Visit→Registration",
      "issue": "Registration form has too many fields, education institution users have low willingness to fill out",
      "solution": "Simplify registration form to 3 required fields, support WeChat QR code one-click registration",
      "expected_improvement": "Expected 15% conversion rate improvement",
      "effort": "medium"
    }
  ],
  "ab_test_designs": [
    {
      "test_id": "TEST_001",
      "hypothesis": "Simplifying the registration process can reduce the drop-off rate from visit to registration",
      "control": "Current 6-field registration form",
      "treatment": "3-field simplified registration form + WeChat QR code registration",
      "primary_metric": "Visit→Registration conversion rate",
      "secondary_metrics": ["Registration completion time", "Post-registration activation rate"],
      "min_sample_size": 10000,
      "estimated_duration": "7 days"
    }
  ]
}
```

## A/B Test Design Template

```yaml
test_id: "ACQ_TEST_{sequence_number}"
name: "Test name"
hypothesis: "If...then... hypothesis"
variants:
  control: "Control group description"
  treatment: "Treatment group description"
metrics:
  primary: "Primary metric"
  secondary: ["Secondary metric list"]
  guardrail: ["Guardrail metrics"]
design:
  min_sample_per_variant: 1000
  runtime_days: 7
  mde: 0.05
success_criteria:
  - primary_metric_lift: ">=5%"
  - guardrail_metrics: "No significant decline"
```

## Output Validation Rules

| Field Path | Type | Required | Description |
|----------|------|------|------|
| channel_assessment | object | Yes | Channel evaluation results, must include channels/primary_channels/test_channels/observation_channels |
| channel_assessment.channels | array | Yes | Channel evaluation detail list, each item must include name/scale/conversion_rate/roi/classification |
| channel_assessment.channels[].name | string | Yes | Channel name, cannot be empty |
| channel_assessment.channels[].scale | string | Yes | Channel scale description |
| channel_assessment.channels[].volume | number | No | Channel user volume |
| channel_assessment.channels[].conversion_rate | number | Yes | Conversion rate, range 0-1 |
| channel_assessment.channels[].cost_per_acquisition | number | No | Cost per acquisition |
| channel_assessment.channels[].quality_score | number | No | Quality score, range 0-1 |
| channel_assessment.channels[].classification | string | Yes | Channel tier, only allows primary/test/observation values |
| channel_assessment.channels[].roi | number | Yes | Channel ROI, must be calculated based on LTV |
| channel_assessment.primary_channels | array | Yes | Primary channel name list, at least 1 channel |
| channel_assessment.test_channels | array | Yes | Test channel name list |
| channel_assessment.observation_channels | array | Yes | Observation channel name list |
| channel_assessment.total_new_users | number | Yes | Total new users, must be >0 |
| channel_assessment.blended_cac | number | Yes | Blended CAC, must be >0 |
| channel_assessment.blended_roi | number | Yes | Blended ROI |
| funnel_analysis | object | Yes | Funnel analysis, must include stages and critical_drop_off |
| funnel_analysis.stages | array | Yes | Stage data, each item must include name/volume/conversion_rate/drop_off_rate |
| funnel_analysis.stages[].name | string | Yes | Stage name, cannot be empty |
| funnel_analysis.stages[].volume | number | Yes | Stage user volume, must be ≥0 |
| funnel_analysis.stages[].conversion_rate | number | Yes | Conversion rate, range 0-1 |
| funnel_analysis.stages[].drop_off_rate | number | Yes | Drop-off rate, range 0-1 |
| funnel_analysis.critical_drop_off | object | Yes | Critical drop-off node, must include from_stage/to_stage/drop_off_rate/impact_score |
| funnel_analysis.critical_drop_off.from_stage | string | Yes | Drop-off start stage |
| funnel_analysis.critical_drop_off.to_stage | string | Yes | Drop-off target stage |
| funnel_analysis.critical_drop_off.drop_off_rate | number | Yes | Drop-off rate, range 0-1 |
| funnel_analysis.critical_drop_off.impact_score | number | Yes | Impact score, range 0-1 |
| optimization_suggestions | array | Yes | Optimization suggestion list, each item must include priority/stage/issue/solution/expected_improvement |
| optimization_suggestions[].priority | number | Yes | Priority, starting from 1 |
| optimization_suggestions[].stage | string | Yes | Target stage, cannot be empty |
| optimization_suggestions[].issue | string | Yes | Issue description, cannot be empty |
| optimization_suggestions[].solution | string | Yes | Solution, cannot be empty |
| optimization_suggestions[].expected_improvement | string | Yes | Expected improvement effect |
| ab_test_designs | array | No | A/B test design plan list, each item must include test_id/hypothesis/primary_metric |
| ab_test_designs[].test_id | string | Yes | Test ID, cannot be empty |
| ab_test_designs[].hypothesis | string | Yes | Test hypothesis, cannot be empty |
| ab_test_designs[].primary_metric | string | Yes | Primary metric, cannot be empty |

## Decision Rules

| Situation | Action |
|------|----------|
| Channel ROI ≥ target and scale is expandable | Tier as primary channel, increase investment |
| Channel ROI close to target but unstable | Tier as test channel, continue validation |
| Channel ROI < target and no strategic significance | Tier as observation channel, reduce investment |
| New channel with no historical data | Small traffic test, evaluate after 2 weeks |
| Key step drop-off rate >80% | Mark as highest priority optimization item |
| New channel conversion rate below 50% of average | Downgrade to observation channel |
| A/B test primary metric lift ≥5% and statistically significant | Full rollout of optimization plan |
| Multiple drop-off nodes exist simultaneously | Sort by impact coefficient, prioritize the highest impact item |

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] Channel evaluation covers 4 dimensions: scale, conversion rate, ROI, quality
- [ ] Channel tiering criteria are clear (Primary/Test/Observation)

### P1 Checks (must pass for standard/deep)

- [ ] ROI calculation considers user LTV rather than single-time revenue
- [ ] Evaluation covers 19 acquisition channel types
- [ ] Funnel stage definitions are complete (Impression → Activation/Payment)
- [ ] Drop-off causes distinguish Awareness/Trust/Action/Value four barrier types
- [ ] Optimization plans include expected improvement and implementation effort assessment
- [ ] A/B test design includes decision rules and stopping conditions

### P2 Checks (only deep must pass)

- [ ] Extended analysis is complete (deep inference and roadmap generated)
- [ ] Decision records are complete (key decisions have rationale and alternatives)

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Upstream Input | Degradation Plan | Output Impact | Data Acquisition Instructions |
|----------|----------|----------|------------|
| Channel data missing | User describes product type and target users → Recommend channel mix | Channel scoring based on industry experience rather than actual data | Request user to provide traffic, conversion rate, and cost data for each acquisition channel |
| Historical performance missing | Skip channel historical performance evaluation, use industry benchmarks | Cannot identify proven high-efficiency channels | Request user to provide historical channel performance data (CAC, LTV, conversion rate per channel) |
| Both channel data and historical performance missing | User describes product type and target users → Recommend channel mix | Output is channel recommendations based on industry experience, marked as "to be validated" | Request user to provide product type, target users, and acquisition budget |
| Historical optimization data missing | Skip historical comparison, analyze based on current data only | Cannot evaluate optimization trends | Request user to provide historical acquisition funnel data and optimization experiment results |

### Data Acquisition Instructions

When upstream files are missing, the user needs to provide the following information to support degraded generation:
- **Product Type**: Product type and core features
- **Target Users**: Target user group characteristics and scale
- **Budget Range** (optional): Available budget for acquisition
- **Funnel Data** (optional): User volume and conversion rate at each acquisition funnel step
- **Optimization Goal** (optional): Key conversion rate to improve

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Source | Change Type | Impact Scope | Response Action |
|----------|----------|----------|----------|
| User provided - Channel data | Data format change | channels field parsing | Adapt to new format, fill in default values for missing fields |
| User provided - Historical performance | Data granularity change | ROI calculation and trend comparison | Recalculate at new granularity, note data口径 changes |
| User provided - Channel configuration | Channel added/removed | 19 channel list and tiering | Update channel list, new channels default to test tier |
| User provided - Historical optimization data | Experiment results updated | Baseline comparison for optimization suggestions | Update comparison baseline, adjust optimization priorities |

### Downstream Notification Mechanism Table

| Downstream Consumer | Notification Condition | Notification Method | Notification Content |
|------------|----------|----------|----------|
| activation-aha | Activation stage drop-off rate change | Write to output file | Registration→Activation conversion rate and drop-off analysis |
| acquisition-orchestrator | Channel evaluation and funnel optimization completed | Output file updated | Channel tiering and funnel optimization completion status and key conclusions |
