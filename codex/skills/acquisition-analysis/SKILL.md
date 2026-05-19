---
name: acquisition-analysis
description: "Use when evaluating acquisition channels or optimizing acquisition funnel. Analyzes 19 channel types for scale, conversion rate, and ROI to output channel grading report, then identifies biggest funnel drop-off points and auto-generates optimization plans and A/B test designs. Keywords: acquisition channels, channel evaluation, ROI analysis, channel grading, funnel optimization, conversion optimization, A/B testing."
metadata:
  module: "Product Growth & Operations"
  sub-module: "Acquisition"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "Which channel has the best user acquisition results"
    - "Help me check ROI across channels"
    - "Registration to activation conversion rate is too low"
    - "Where is the biggest funnel drop-off"
    - "How to improve acquisition conversion rate"
---

# Integrated Acquisition Analysis

## Core Principles

1. **Channels as investment portfolio**: Each channel is an investment, evaluated with dual dimensions of ROI and scale, not a single metric
2. **Tiered management with dynamic adjustment**: Primary/Test/Observation three-tier dynamic rotation, data-driven upgrade/downgrade
3. **LTV-based ROI calculation**: Channel ROI must consider user LTV rather than single revenue, avoiding short-sighted elimination of long-cycle high-value channels
4. **Drop-off is signal**: Each drop-off point is users voting with their feet; the highest drop-off point is the biggest optimization leverage
5. **Obstacle classification for targeted resolution**: Awareness/Trust/Action/Value four obstacle types require completely different optimization approaches
6. **Experiment validation over guessing**: Optimization plans must be validated through A/B testing, using data instead of intuition

## Interaction Mode

AI->Human AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| 19 Channel Types Data | object | Yes | User provided | Complete data for 19 acquisition channel types |
| Historical Channel Performance | object | Yes | User provided | Historical channel performance data |
| Channel Configuration and Costs | object | Yes | User provided | Channel configuration and cost data |
| Historical Optimization Data | object | No | User provided | Historical optimization experiment data |

## 19 Acquisition Channel Types

### Paid Acquisition Channels
1. **Search Ads (SEM)** - Google Ads, Baidu PPC
2. **Social Ads** - Facebook/Instagram Ads, LinkedIn Ads, WeChat Moments Ads
3. **Display Ads** - DSP ads, native ads
4. **Video Ads** - YouTube Ads, TikTok/Kuaishou ads
5. **App Store Ads** - Apple Search Ads, Google Play Ads

### Organic Acquisition Channels
6. **SEO/SEM Organic** - Search engine organic rankings
7. **Content Marketing** - Blog posts, whitepapers, case studies
8. **Social Media Organic** - Weibo, Xiaohongshu, TikTok organic content
9. **Community Operations** - Zhihu, forums, industry forums
10. **Viral Spread** - User sharing, word-of-mouth

### Partnership Acquisition Channels
11. **Affiliate Marketing** - Partner referral commissions
12. **Channel Distribution** - Dealer/agent networks
13. **Platform Partnerships** - App marketplace featuring, platform premieres
14. **Cross-industry Collaboration** - Brand joint campaigns

### Sales Acquisition Channels
15. **SDR Outbound** - Telesales team proactive outreach
16. **Offline Events** - Industry exhibitions, offline salons
17. **Sales Referrals** - Sales lead referrals

### Other Channels
18. **Existing User Outreach** - Email marketing, push notifications, SMS
19. **PR/Brand** - Media coverage, brand events

## Execution Steps

### Step 1: Channel Assessment (from acquisition-channel)

Analyze 19 acquisition channel types data, calculate channel scale, conversion rate, ROI, and output channel grading report.

#### 1.1 Channel Scale Assessment

Analyze each channel's reachable scale and actual deployment scale:

- **Reachable scale**: Channel's potential user pool size
- **Actual deployment scale**: User volume covered by current resource investment
- **Market share**: Deployment share relative to competitors
- **Growth potential**: Channel scale growth trend

#### 1.2 Conversion Rate Analysis

Calculate complete conversion funnel for each channel:

| Metric | Description |
|------|------|
| Impression -> Click conversion rate | Ad display to user click |
| Click -> Visit conversion rate | Ad click to page visit |
| Visit -> Registration conversion rate | Page visit to account registration |
| Registration -> Activation conversion rate | Account registration to first use |
| Overall conversion rate | Impression to activation end-to-end conversion |

#### 1.3 ROI Calculation

Calculate investment return rate for each channel:

```
Channel ROI = (Revenue from channel - Channel investment cost) / Channel investment cost

LTV-adjusted ROI = (User LTV from channel - Channel CAC) / Channel CAC
```

#### 1.4 Channel Grading

Grade channels based on multi-dimensional scoring:

##### Primary Channels
- ROI >= Target ROI
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
Composite Score = 0.3 x ROI Score + 0.25 x Scale Score + 0.25 x Quality Score + 0.2 x Sustainability Score
```

#### Channel Assessment Decision Rules

| Situation | Action |
|------|----------|
| Channel ROI >= target and scalable | Grade as primary channel, increase investment |
| Channel ROI close to target but unstable | Grade as test channel, continue validation |
| Channel ROI < target and no strategic significance | Grade as observation channel, reduce investment |
| New channel with no historical data | Small traffic test, evaluate after 2 weeks |

### Step 2: Funnel Optimization (from acquisition-optimize)

Based on Step 1 channel assessment output, analyze acquisition funnel data, identify biggest drop-off points, and auto-generate optimization plans and A/B test designs.

#### Funnel Stage Definition

Standard acquisition funnel includes the following stages:

```
Impression -> Click -> Visit -> Registration -> Activation -> Payment
```

##### Stage 1: Impression
- Ad displayed to target users
- Key metrics: Impressions, CTR

##### Stage 2: Click
- User clicks ad to enter landing page
- Key metrics: Clicks, CPM

##### Stage 3: Visit
- User visits landing page/product page
- Key metrics: UV, bounce rate, page dwell time

##### Stage 4: Registration
- User completes account registration
- Key metrics: Registrations, registration rate

##### Stage 5: Activation
- User completes core action for the first time
- Key metrics: Activations, activation rate

##### Stage 6: Payment (optional)
- User completes first payment
- Key metrics: Payments, payment conversion rate

#### 2.1 Funnel Stage Conversion Analysis

1. **Calculate conversion rate at each stage**: Identify conversion efficiency at each stage
2. **Benchmark comparison**: Compare with industry benchmarks and historical data
3. **Trend analysis**: Time trends of conversion rates at each stage
4. **Channel comparison**: Funnel performance differences across channels

#### 2.2 Biggest Drop-off Point Identification

1. **Calculate drop-off impact coefficient**:
   ```
   Impact coefficient = Drop-off rate at this stage x Weight of conversion rate from this stage to final
   ```

2. **Multi-dimensional breakdown**:
   - By channel
   - By user profile
   - By traffic source
   - By time period

3. **Drop-off cause inference**:
   - Quantitative analysis: User behavior data
   - Qualitative analysis: User feedback, interviews

#### 2.3 Optimization Plan Auto-Generation

Based on drop-off cause analysis, generate targeted optimization plans:

| Drop-off Type | Optimization Direction | Typical Solutions |
|---------|---------|---------|
| Awareness barrier | Optimize ad creatives | Highlight value proposition, improve creative |
| Trust barrier | Enhance social proof | Add reviews, case studies, data |
| Action barrier | Simplify process | Reduce steps, lower threshold |
| Value barrier | Strengthen value perception | Demo features, free trial |

#### 2.4 A/B Test Design

Design A/B tests for optimization plans:

1. **Hypothesis definition**: Clarify the optimization hypothesis being tested
2. **Sample calculation**: Determine sample size needed for statistical significance
3. **Test groups**: Design control and treatment groups
4. **Monitoring metrics**: Define primary and secondary monitoring metrics
5. **Decision rules**: Define when to stop the test and determine winner

## Output

**Storage Path**: `output/pm-growth/acquisition-analysis/`

**Output Files**: acquisition-analysis.json, acquisition-analysis.md

**Output Schema**:

```json
{
  "type": "object",
  "required": ["channel_assessment", "funnel_analysis", "optimization_suggestions"],
  "properties": {
    "channel_assessment": {"type": "object", "description": "Channel assessment results, including channel details, grading, and summary metrics"},
    "funnel_analysis": {"type": "object", "description": "Funnel analysis, including stage data and key drop-off points"},
    "optimization_suggestions": {"type": "array", "description": "Optimization suggestions list, including priority, issue, solution, and expected improvement"},
    "ab_test_designs": {"type": "array", "description": "A/B test design plans list"}
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
        "scale": "Annual reach 50K+ education institution decision makers",
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
    "observation_channels": ["PR/Brand", "Cross-industry Collaboration", "Video Ads"],
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
      "stage": "Visit->Registration",
      "issue": "Too many registration form fields, education institution users have low willingness to fill out",
      "solution": "Simplify registration form to 3 required fields, support WeChat scan one-click registration",
      "expected_improvement": "Expected 15% conversion rate increase",
      "effort": "medium"
    }
  ],
  "ab_test_designs": [
    {
      "test_id": "TEST_001",
      "hypothesis": "Simplifying registration process can reduce visit-to-registration drop-off rate",
      "control": "Current 6-field registration form",
      "treatment": "3-field simplified registration form + WeChat scan registration",
      "primary_metric": "Visit->Registration conversion rate",
      "secondary_metrics": ["Registration completion time", "Post-registration activation rate"],
      "min_sample_size": 10000,
      "estimated_duration": "7 days"
    }
  ]
}
```

## A/B Test Design Template

```yaml
test_id: "ACQ_TEST_{sequence}"
name: "Test name"
hypothesis: "If...then... hypothesis"
variants:
  control: "Control group plan description"
  treatment: "Treatment group plan description"
metrics:
  primary: "Primary metric"
  secondary: ["Secondary metrics list"]
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
| channel_assessment | object | Yes | Channel assessment results, must contain channels/primary_channels/test_channels/observation_channels |
| channel_assessment.channels | array | Yes | Channel assessment details list, each item must contain name/scale/conversion_rate/roi/classification |
| channel_assessment.primary_channels | array | Yes | Primary channel names list, at least 1 channel |
| channel_assessment.test_channels | array | Yes | Test channel names list |
| channel_assessment.observation_channels | array | Yes | Observation channel names list |
| channel_assessment.total_new_users | number | Yes | Total new users, must be >0 |
| channel_assessment.blended_cac | number | Yes | Blended acquisition cost, must be >0 |
| channel_assessment.blended_roi | number | Yes | Blended ROI |
| channel_assessment.channels[].classification | string | Yes | Channel grading, only primary/test/observation allowed |
| channel_assessment.channels[].roi | number | Yes | Channel ROI, must be calculated based on LTV |
| funnel_analysis | object | Yes | Funnel analysis, must contain stages and critical_drop_off |
| funnel_analysis.stages | array | Yes | Stage data, each item must contain name/volume/conversion_rate/drop_off_rate |
| funnel_analysis.critical_drop_off | object | Yes | Critical drop-off point, must contain from_stage/to_stage/drop_off_rate/impact_score |
| optimization_suggestions | array | Yes | Optimization suggestions list, each item must contain priority/stage/issue/solution/expected_improvement |
| optimization_suggestions[].priority | number | Yes | Priority, starting from 1 |
| ab_test_designs | array | No | A/B test design plans list, each item must contain test_id/hypothesis/primary_metric |

## Decision Rules

| Situation | Action |
|------|----------|
| Channel ROI >= target and scalable | Grade as primary channel, increase investment |
| Channel ROI close to target but unstable | Grade as test channel, continue validation |
| Channel ROI < target and no strategic significance | Grade as observation channel, reduce investment |
| New channel with no historical data | Small traffic test, evaluate after 2 weeks |
| Key stage drop-off rate >80% | Mark as highest priority optimization item |
| New channel conversion rate below average by 50% | Downgrade to observation channel |
| A/B test primary metric lift >=5% and statistically significant | Full rollout of optimization plan |
| Multiple drop-off points exist simultaneously | Sort by impact coefficient, prioritize highest impact item |

## Quality Checks

- [ ] Channel assessment covers scale, conversion rate, ROI, quality 4 dimensions
- [ ] Channel grading criteria clear (Primary/Test/Observation)
- [ ] ROI calculation considers user LTV rather than single revenue
- [ ] Assessment covers 19 acquisition channel types
- [ ] Funnel stage definition complete (Impression -> Activation/Payment)
- [ ] Drop-off causes distinguish Awareness/Trust/Action/Value 4 obstacle types
- [ ] Optimization plans include expected improvement and implementation difficulty assessment
- [ ] A/B test design includes decision rules and stopping conditions

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Upstream Input | Degradation Plan | Output Impact |
|----------|----------|----------|
| Channel data missing | User describes product type and target users -> recommend channel mix | Channel scoring based on industry experience rather than actual data |
| Historical performance missing | Skip channel historical performance assessment, use industry benchmarks | Cannot identify proven high-efficiency channels |
| Channel data + historical performance both missing | User describes product type and target users -> recommend channel mix | Output based on industry experience channel recommendations, marked "to be validated" |
| Historical optimization data missing | Skip historical comparison, analyze based on current data only | Cannot evaluate optimization trends |

### Data Acquisition Notes

When upstream files are missing, users need to provide the following information to support degraded generation:
- **Product type**: Product type and core features
- **Target users**: Target user group characteristics and scale
- **Budget range** (optional): Budget available for acquisition
- **Funnel data** (optional): User count and conversion rate at each acquisition funnel step
- **Optimization target** (optional): Key conversion rate to improve

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Source | Change Type | Impact Scope | Response Action |
|----------|----------|----------|----------|
| User provided - channel data | Data format change | channels field parsing | Adapt to new format, supplement missing field default values |
| User provided - historical performance | Data granularity change | ROI calculation and trend comparison | Recalculate at new granularity, note data scope change |
| User provided - channel configuration | Channel added/removed | 19 channel types list and grading | Update channel list, new channels default to test tier |
| User provided - historical optimization data | Experiment results update | Optimization recommendations baseline comparison | Update comparison baseline, adjust optimization priority |

### Downstream Notification Mechanism Table

| Downstream Consumer | Notification Condition | Notification Method | Notification Content |
|------------|----------|----------|----------|
| activation-aha | Activation stage drop-off rate change | Write to output file | Registration->Activation conversion rate and drop-off analysis |
| acquisition-orchestrator | Channel assessment and funnel optimization complete | Output file update | Channel grading and funnel optimization completion status and key conclusions |

## Version History

- v1.0: Merged acquisition-channel + acquisition-optimize
