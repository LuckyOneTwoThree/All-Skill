---
name: retention-management
description: Use when needing to reduce churn rate or improve user engagement. An integrated retention management pipeline that first builds a churn prediction model to identify high-risk users and automatically trigger intervention actions, then performs lifecycle-based segmentation to generate operation strategies and personalized outreach content. Keywords: churn prediction, churn intervention, churn model, user retention, user segmentation, segment operations, lifecycle operations, personalized outreach, engagement improvement, user activity, high churn rate, how to retain, how to differentiate, operation segmentation.
metadata:
  module: "Product Growth & Operations"
  sub-module: "Retention"
  type: "pipeline"
  version: "3.0"
  domain_tags: ["Internet", "SaaS", "General"]
  trigger_examples:
    - "Users keep churning, what should I do"
    - "How to detect users about to leave early"
    - "Churn rate is too high, how to reduce it"
    - "How to differentiate operations for different users"
    - "How to improve user engagement"
    - "How to do user segmentation"
  interaction_mode: "ai_suggest_human_approve"
execution_depth:
  default: standard
  quick_description: "Execute churn prediction and basic intervention strategy recommendations, output high-risk user list and intervention suggestions"
  deep_description: "Full segment operation strategy + Personalized outreach content + Intervention ROI tracking + Churn model optimization suggestions + User lifecycle value prediction"
---

# Integrated Retention Management

## Core Principles

1. **Prevention Over Recovery**: Intervening when churn signals appear is far less costly and more successful than recovering after churn
2. **Intervention Must Match Risk Level**: High-risk users need high-touch intervention; over-intervening with low-risk users will push them away
3. **ROI Closed-Loop Validation**: Every intervention strategy must track churn prevention ROI; ineffective strategies should be eliminated promptly
4. **Segmentation is Strategy**: The purpose of user segmentation is differentiated operations; segmentation criteria must directly link to operational actions
5. **Health Score is a Leading Indicator**: User health decline precedes behavioral churn, making it the best intervention timing
6. **Outreach Frequency Must Match Value**: High-value content can be delivered at high frequency; excessive low-value outreach equals spam

## Interaction Mode

🤖→👤 AI Suggests, Human Approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| User behavior data | JSON | Yes | Data analytics platform → Activity logs | Activity logs, feature usage, content interaction |
| Churn history data | JSON | Yes | Data analytics platform → Churn records | Behavioral characteristics of churned users |
| User account data | JSON | Yes | User system → Account information | Basic info, payment status |
| User lifecycle stage | object | ○ | User provided | Registration time, key milestones |

## Churn Definition

### Churn Criteria
| User Type | Churn Definition |
|---------|---------|
| Free users | No active behavior for 30 consecutive days |
| Paid users | No active behavior for 60 consecutive days or subscription cancellation |
| Enterprise users | No active behavior for 90 consecutive days or contract expiration |

### Churn Types
- **Active Churn**: User actively stops using or cancels subscription
- **Passive Churn**: User is no longer active but has not explicitly indicated leaving
- **Payment Churn**: Paid user downgrades or cancels subscription

## User Lifecycle Segmentation

### Segment Definitions

| Tier | Time Criteria | User Behavioral Characteristics | Core Needs |
|------|---------|-------------|---------|
| New users | 0-30 days | Exploring product features | Quick onboarding, experience value |
| Growing users | 30-90 days | Increasing usage frequency | Deep usage, build habits |
| Mature users | 90+ days | Stable usage | Sustained value, prevent dormancy |
| Dormant users | No activity for 7-30 consecutive days | Sudden activity drop | Reactivation, value recall |
| Churned users | No activity for 30+ consecutive days | No active behavior | Targeted win-back |

### Health Score

Comprehensively evaluate user health status across the lifecycle:

```
Health Score = 0.3 × Activity Level + 0.25 × Feature Depth + 0.25 × Payment Willingness + 0.2 × Social Engagement
```

## Execution Steps

### Step 1: Churn Prediction (from retention-churn) [Core]

Build a churn prediction model, identify high-risk users, and automatically trigger intervention actions.

#### 1.1 Churn Prediction Model Building

##### Data Preparation
1. **Label Data**: Historical churned user labels
2. **Feature Engineering**: Build churn prediction features
3. **Data Splitting**: Training set/validation set/test set

##### Churn Signal Features
| Feature Category | Specific Features |
|---------|---------|
| Activity features | Visit frequency, usage duration, number of features used |
| Behavioral features | Core feature usage, key action completion |
| Engagement features | Content interaction, social behavior |
| Payment features | Payment status, spending amount, payment cycle |
| Feedback features | NPS score, customer service contact, support tickets |

##### Model Training
Supports multiple model types:
- Logistic Regression (strong interpretability)
- XGBoost/LightGBM (high accuracy)
- Deep learning models (complex pattern recognition)
- Ensemble models (stable and reliable)

#### 1.2 High-Risk User Identification

##### Risk Stratification
| Risk Level | Risk Score | Definition | Response Strategy |
|---------|---------|------|---------|
| High risk | ≥0.7 | Very likely to churn | Immediate intervention |
| Medium risk | 0.4-0.7 | High churn probability | Close monitoring |
| Low risk | 0.2-0.4 | Churn tendency | Preventive intervention |
| Stable | <0.2 | Normal user | Routine maintenance |

##### Churn Signal Analysis
Identify key factors leading to high risk:
- Activity decline signals
- Feature usage reduction signals
- Negative feedback signals
- Competitor usage signals

#### 1.3 Automated Intervention Triggering

##### Intervention Strategy Library
| Risk Level | Intervention Strategy | Outreach Channel | Response Time |
|---------|---------|---------|---------|
| High risk | Dedicated customer success outreach, limited-time offer | Phone + SMS + Email | Immediate |
| Medium risk | Personalized value push, survey research | Email + Push | Within 24 hours |
| Low risk | Content marketing, version update notification | Push + In-app message | Within 48 hours |

##### Intervention Content Types
1. **Value Recall**: Showcase new product features and use cases
2. **Problem Resolution**: Provide solutions for known issues
3. **Incentive Offers**: Provide renewal discounts or value-added services
4. **Human Care**: Customer success proactive outreach to understand needs
5. **Social Activation**: Invite friends to use together

##### Intervention Timing
- Trigger immediately after user behavior change
- Preventive intervention triggered before risk accumulates
- Avoid outreach during user busy hours

#### 1.4 Intervention Effect Tracking

##### Core Metrics
| Metric | Description | Target Value |
|------|------|--------|
| Intervention coverage rate | Proportion of high-risk users who received intervention | ≥80% |
| Response rate | Proportion of users who responded after intervention | ≥15% |
| Churn prevention rate | Proportion of users who did not churn after intervention | ≥10% |
| ROI | Churn prevention revenue / Intervention cost | ≥3.0 |

##### Effect Analysis
- Effect comparison across different intervention strategies
- Intervention effect differences across user groups
- Impact of intervention timing on effectiveness
- Optimization directions for intervention content

### Step 2: Segment Operations (from retention-engagement) [Conditional]

Based on the churn prediction results output from Step 1, segment users by lifecycle stage and generate operation strategies and personalized outreach content.

#### 2.1 User Segmentation

##### Segmentation Rule Engine
```yaml
rules:
  - segment: "new_user"
    condition: "account_age_days <= 30 AND is_activated == true"

  - segment: "growing_user"
    condition: "account_age_days > 30 AND account_age_days <= 90 AND weekly_active_days >= 3"

  - segment: "mature_user"
    condition: "account_age_days > 90 AND weekly_active_days >= 2"

  - segment: "at_risk"
    condition: "consecutive_inactive_days >= 7 AND consecutive_inactive_days < 30"

  - segment: "churned"
    condition: "consecutive_inactive_days >= 30"
```

##### Segmentation Priority
Dormant and churned user identification takes priority over normal segmentation, ensuring timely triggering of churn prevention strategies.

#### 2.2 Segment Characteristic Analysis

##### New User Analysis
- Activation path analysis
- Early behavior clustering
- Activation barrier identification

##### Growing User Analysis
- Feature depth usage analysis
- Usage frequency trends
- Value perception assessment

##### Mature User Analysis
- Feature usage stability
- Payment conversion potential
- Social activity level

##### Dormant User Analysis
- Last behavior before dormancy
- Dormancy trigger factors
- Potential reactivation value

##### Churned User Analysis
- Churn time distribution
- Churn cause inference
- Win-back value assessment

#### 2.3 Automated Operation Strategy Generation

##### Segment Operation Strategies

| User Tier | Operation Goal | Core Strategy | Key Metrics |
|---------|---------|---------|---------|
| New users | Activation + Retention | Guide experience, habit formation | D7/D30 retention rate |
| Growing users | Deep usage | Feature expansion, value reinforcement | Number of features used, usage duration |
| Mature users | Sustained activity | Prevent dormancy, value-added services | Monthly active rate, NRR |
| Dormant users | Reactivation | Value recall, problem resolution | Wake-up rate, win-back ROI |
| Churned users | Targeted win-back | Incentive offers, emotional recall | Win-back rate, win-back user LTV |

##### Strategy Trigger Rules
```yaml
trigger_rules:
  new_user:
    - event: "Registration completed"
      action: "Send welcome sequence"
    - event: "Activation completed"
      action: "Send advanced guidance"

  growing_user:
    - event: "Feature usage reaches threshold"
      action: "Recommend advanced features"
    - event: "Usage frequency declines"
      action: "Send value reminder"

  mature_user:
    - event: "3 consecutive days inactive"
      action: "Send update notification"
    - event: "New feature launched"
      action: "Send feature recommendation"

  at_risk:
    - event: "Enters dormancy"
      action: "Trigger reactivation flow"

  churned:
    - event: "Churned for 30 days"
      action: "Trigger win-back campaign"
```

#### 2.4 Outreach Content Personalization

##### Content Type Matrix
| User Tier | Push Content | Content Style | Outreach Frequency |
|---------|---------|---------|---------|
| New users | Usage tutorials, feature introductions | Friendly guidance | High |
| Growing users | Advanced tips, case sharing | Value-oriented | Medium |
| Mature users | Feature updates, membership benefits | Maintenance & care | Low |
| Dormant users | Value recall, limited-time offers | Incentive-driven | Concentrated |
| Churned users | Win-back campaigns, exclusive offers | Emotional appeal | Concentrated |

##### Personalized Content Generation
- Recommend relevant content based on user usage history
- Adjust content format based on user preference settings
- Adjust content theme based on user lifecycle stage

## Output

**Storage Path**: `output/pm-growth/retention-management/`

**Output Files**: retention-management.json, retention-management.md

**Output Schema**:

```json
{
  "type": "object",
  "required": ["churn_prevention", "segments", "strategies"],
  "properties": {
    "churn_prevention": {"type": "object", "description": "Churn prediction and intervention results, including model, risk users, and intervention strategies"},
    "segments": {"type": "array", "description": "User segmentation data, including tier name, count, characteristics, and health score"},
    "segment_overview": {"type": "object", "description": "Tier overview, including count and average health score"},
    "strategies": {"type": "array", "description": "Segment operation strategy list, including goals, actions, and success metrics"},
    "personalized_content": {"type": "array", "description": "Personalized outreach content list, including content type, theme, and channel"}
  }
}
```

`retention_management`
```json
{
  "churn_prevention": {
    "risk_model": {
      "model_type": "XGBoost",
      "features": ["Usage frequency", "Feature breadth", "Payment status"],
      "accuracy": 0.85,
      "precision": 0.78,
      "recall": 0.72
    },
    "risk_thresholds": {
      "high_risk": 0.7,
      "medium_risk": 0.4,
      "low_risk": 0.2
    },
    "high_risk_users": [
      {
        "user_id": "User ID",
        "risk_score": 0.85,
        "risk_level": "high",
        "primary_churn_signals": ["Signal 1", "Signal 2"],
        "recommended_intervention": "Intervention strategy"
      }
    ],
    "interventions": [
      {
        "intervention_id": "INT_001",
        "trigger_condition": "Risk score > 0.7",
        "intervention_type": "personalized_outreach",
        "channel": "email",
        "content_theme": "Value recall",
        "expected_effectiveness": 0.25
      }
    ],
    "tracking": {
      "total_interventions_sent": 5000,
      "response_rate": 0.15,
      "churn_prevention_rate": 0.12,
      "roi": 3.5
    }
  },
  "segments": [
    {
      "name": "New Users",
      "segment_id": "new_user",
      "count": 5000,
      "percentage": 0.15,
      "characteristics": {
        "avg_age_days": 7,
        "avg_weekly_active_days": 3.5,
        "avg_features_used": 5,
        "paying_users_ratio": 0.08
      },
      "health_score": 0.72
    }
  ],
  "segment_overview": {
    "new_user": {"count": 5000, "avg_health": 0.72},
    "growing_user": {"count": 8000, "avg_health": 0.78},
    "mature_user": {"count": 15000, "avg_health": 0.85},
    "at_risk": {"count": 3000, "avg_health": 0.35},
    "churned": {"count": 2000, "avg_health": 0.1}
  },
  "strategies": [
    {
      "segment": "new_user",
      "objective": "Drive activation and early retention",
      "key_actions": ["Guide core feature usage", "Build usage habits"],
      "success_metrics": ["D30 retention rate", "Activation rate"]
    }
  ],
  "personalized_content": [
    {
      "segment": "new_user",
      "content_type": "onboarding_guidance",
      "theme": "Quickly experience core value",
      "channels": ["app_push", "email"],
      "frequency": "per_week"
    }
  ]
}
```

## Automated Operations Calendar

```
Weekly fixed outreach:
- Monday: Active user weekly report
- Wednesday: Feature usage reminder (new users)
- Friday: Active user content push

Event-triggered outreach:
- Feature update: All-user notification
- Holiday event: High-value user exclusive
- User milestone: Congratulations + incentive
```

## Output Validation Rules

| Field Path | Type | Required | Description |
|----------|------|------|------|
| churn_prevention | object | Yes | Churn prediction and intervention results, must include risk_model/high_risk_users/interventions |
| churn_prevention.risk_model | object | Yes | Prediction model, must include model_type/features/accuracy |
| churn_prevention.risk_model.model_type | string | Yes | Model type |
| churn_prevention.risk_model.features | array | Yes | Model feature list |
| churn_prevention.risk_model.features[].feature_name | string | Yes | Feature name |
| churn_prevention.risk_model.features[].importance | number | No | Feature importance |
| churn_prevention.risk_model.accuracy | number | Yes | Model accuracy, must be >0.75 |
| churn_prevention.risk_thresholds | object | Yes | Risk thresholds, must include high_risk/medium_risk/low_risk |
| churn_prevention.high_risk_users | array | Yes | High-risk user list, each item must include user_id/risk_score/risk_level |
| churn_prevention.high_risk_users[].user_id | string | Yes | User ID |
| churn_prevention.high_risk_users[].risk_score | number | Yes | Risk score, range 0-1 |
| churn_prevention.high_risk_users[].risk_level | string | Yes | Risk level, only allows high/medium/low/stable |
| churn_prevention.high_risk_users[].primary_churn_signals | string[] | No | Primary churn signals |
| churn_prevention.high_risk_users[].recommended_intervention | string | No | Recommended intervention |
| churn_prevention.interventions | array | Yes | Intervention strategy list, each item must include trigger_condition/intervention_type/channel |
| churn_prevention.interventions[].trigger_condition | string | Yes | Trigger condition |
| churn_prevention.interventions[].intervention_type | string | Yes | Intervention type, enum: email/in_app/push/call |
| churn_prevention.interventions[].channel | string | Yes | Outreach channel |
| churn_prevention.interventions[].content_theme | string | No | Content theme |
| churn_prevention.tracking | object | No | Effect tracking, must include response_rate/churn_prevention_rate/roi |
| segments | array | Yes | User segmentation data, must cover at least new/growing/mature/dormant/churned 5 tiers |
| segments[].segment_id | string | Yes | Segment identifier, only allows new_user/growing_user/mature_user/at_risk/churned |
| segments[].count | number | Yes | Segment user count, must be ≥0 |
| segments[].health_score | number | Yes | Health score, range 0-1 |
| segments[].characteristics | object | No | Segment characteristics |
| segments[].characteristics.avg_tenure | string | No | Average lifecycle |
| segments[].characteristics.key_behaviors | string[] | No | Key behaviors |
| strategies | array | Yes | Operation strategy list, at least 5 (1 per tier) |
| strategies[].segment | string | Yes | Target segment |
| strategies[].key_actions | string[] | No | Key action list |
| strategies[].success_metrics | array | Yes | Success metric list, at least 1 |
| personalized_content | array | No | Personalized content list |
| personalized_content[].content_type | string | Yes | Content type, enum: email/in_app/push/sms |
| personalized_content[].theme | string | Yes | Content theme |
| personalized_content[].channels | string[] | No | Outreach channel list |
| personalized_content[].frequency | string | No | Outreach frequency |

## Decision Rules

| Situation | Action |
|------|----------|
| Risk score ≥0.7 (high risk) | Immediate intervention, dedicated customer success outreach |
| Paid user shows churn signals | Prioritize, respond within 48 hours |
| Intervention response rate <10% | Optimize intervention content and channels |
| High-value user churn alert | All-channel outreach + human care |
| Dormant user proportion >15% | Trigger batch reactivation strategy |
| New user D7 retention <25% | Optimize Onboarding and activation guidance |
| Mature user health score declining | Trigger anti-dormancy strategy |
| Operation outreach response rate <5% | Optimize outreach content and channels |

## Quality Checks

- [ ] Churn definition distinguishes free/paid/enterprise users (P0)
- [ ] Prediction model accuracy >75% (P0)
- [ ] Intervention strategies match risk levels (P1)
- [ ] Intervention effect tracking includes ROI calculation (P2)
- [ ] User segmentation covers complete lifecycle (new/growing/mature/dormant/churned) (P1)
- [ ] Health score includes activity level, feature depth, payment willingness, social engagement (P1)
- [ ] Operation strategies match user tiers (P1)
- [ ] Outreach content is personalized (P2)

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Upstream Input | Degradation Plan | Output Impact | Data Acquisition Instructions |
|----------|----------|----------|------------|
| User behavior data missing | User provides user activity data → Analyze churn characteristics | Churn attribution based on activity data inference, behavioral characteristic analysis limited | Request user to provide user activity data (active user count and churned user count per period) |
| Churn history missing | Skip churn trend comparison, analyze based on current data only | Cannot evaluate churn trend changes | Request user to provide historical churn rate and churned user count trend data |
| Both user behavior data and churn history missing | User provides user activity data → Analyze churn characteristics | Output basic churn analysis, intervention strategies marked as "to be validated" | Request user to provide user activity data and churn definition criteria |
| Lifecycle stage missing | Use generic lifecycle model (new user/active/dormant/churned), mark as "to be confirmed" | Segmentation criteria based on generic assumptions | Request user to provide user lifecycle stage definitions and segmentation criteria |
| Both user behavior data and lifecycle stage missing | User describes user groups → Generate segmentation strategy | Output segmentation strategy based on description, marked as "awaiting data validation" | Request user to provide user group description and core behavioral characteristics |
| User account data missing | Skip account-level churn analysis, analyze based on aggregated data only | Cannot identify high churn risk accounts | Request user to provide user account list, payment status, and activity data |

### Data Acquisition Instructions

When upstream files are missing, the user needs to provide the following information to support degraded generation:
- **User Activity Data**: Active user count and churned user count per period
- **Churn Definition** (optional): Product's definition criteria for churned users
- **High-Value User Proportion** (optional): Proportion of high-value users among active users
- **User Group Description**: Main types and characteristics of product users
- **Activity Distribution** (optional): High-activity/medium-activity/low-activity user proportions
- **Operation Resources** (optional): Resources and channels available for user operations

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Source | Change Type | Impact Scope | Response Action |
|----------|----------|----------|----------|
| Data analytics platform - Activity logs | Behavioral event definition change | Churn signal features and model training | Update feature engineering, retrain model |
| Data analytics platform - Churn records | Churn definition change | Churn labels and risk thresholds | Re-label using new definition, adjust thresholds |
| User system - Account information | User attribute change | Risk stratification and intervention strategies | Update user characteristics, adjust intervention matching |
| User provided - Lifecycle | Milestone definition change | Segmentation criteria and strategy triggers | Adjust segmentation conditions and trigger rules |

### Downstream Notification Mechanism Table

| Downstream Consumer | Notification Condition | Notification Method | Notification Content |
|------------|----------|----------|----------|
| revenue-upsell | High-value user segment change | Write to output file | High-value user list and upgrade signals |
| retention-orchestrator | Churn prediction and segment operations completed | Output file updated | Retention management completion status and key conclusions |

## Key Success Metrics

| Metric | Definition | Target Value |
|------|------|--------|
| Retention rate per tier | Proportion of each tier's users retained in the next cycle | Improve tier by tier |
| Dormant user reactivation rate | Proportion of dormant users who are reactivated | ≥15% |
| Average user health score | Average health score across all users | ≥0.7 |
| Operation outreach response rate | Open/click rate of outreach messages | ≥10% |

## Notes

- Churn prediction models need regular updates to adapt to product changes and user behavior changes
- Avoid over-intervention that disturbs users and degrades user experience
- High-value user intervention priority and resource investment should be higher
- Establish intervention feedback mechanisms to continuously optimize intervention strategies
