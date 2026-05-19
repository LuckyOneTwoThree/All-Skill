---
name: retention-management
description: "Use when reducing churn rate or improving user engagement. Integrated retention management pipeline that builds churn prediction models to identify high-risk users and auto-trigger interventions, then segments users by lifecycle stage to generate operations strategies and personalized outreach content. Keywords: churn prediction, churn intervention, churn model, user retention, user segmentation, segmented operations, lifecycle operations, personalized outreach, engagement improvement."
metadata:
  module: "Product Growth & Operations"
  sub-module: "Retention"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "Users keep churning, what should I do"
    - "How to detect users about to leave early"
    - "Churn rate is too high, how to reduce it"
    - "How to differentiate operations for different users"
    - "How to improve user engagement"
    - "How to implement user segmentation"
---

# Integrated Retention Management

## Core Principles

1. **Prevention over retention**: Intervening when churn signals appear is far less costly and more successful than recalling after churn
2. **Intervention must match risk**: High-risk users need high-touch intervention; over-intervening with low-risk users pushes them away
3. **ROI closed-loop validation**: Each intervention strategy must track churn prevention ROI; ineffective strategies are eliminated promptly
4. **Segmentation is strategy**: The purpose of user segmentation is differentiated operations; segmentation criteria must directly link to operational actions
5. **Health score is leading indicator**: User health decline precedes behavioral churn, making it the best intervention timing
6. **Outreach frequency matches value**: High-value content can support high-frequency outreach; excessive low-value content outreach equals harassment

## Interaction Mode

AI->Human AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| User Behavior Data | JSON | Yes | Data analytics platform -> Activity logs | Activity logs, feature usage, content interaction |
| Churn History Data | JSON | Yes | Data analytics platform -> Churn records | Churned user behavioral characteristics |
| User Account Data | JSON | Yes | User system -> Account info | Basic information, payment status |
| User Lifecycle Stage | object | No | User provided | Registration date, key milestones |

## Churn Definition

### Churn Criteria
| User Type | Churn Definition |
|---------|---------|
| Free users | No active behavior for 30 consecutive days |
| Paid users | No active behavior for 60 consecutive days or subscription cancelled |
| Enterprise users | No active behavior for 90 consecutive days or contract expired |

### Churn Types
- **Active churn**: User actively stops using or cancels subscription
- **Passive churn**: User is no longer active but has not explicitly indicated leaving
- **Payment churn**: Paid user downgrades or cancels subscription

## User Lifecycle Segmentation

### Segment Definitions

| Segment | Time Criteria | User Behavioral Characteristics | Core Needs |
|------|---------|-------------|---------|
| New users | 0-30 days | Exploring product features | Quick onboarding, experience value |
| Growing users | 30-90 days | Increasing usage frequency | Deep usage, build habits |
| Mature users | 90+ days | Stable usage | Continuous value, prevent dormancy |
| Dormant users | 7-30 consecutive days inactive | Sudden activity drop | Reactivation, value recall |
| Churned users | 30+ consecutive days inactive | No active behavior | Targeted recall |

### Health Score

Comprehensively assess user health status in the lifecycle:

```
Health Score = 0.3 x Activity + 0.25 x Feature Depth + 0.25 x Payment Willingness + 0.2 x Social Engagement
```

## Execution Steps

### Step 1: Churn Prediction (from retention-churn)

Build churn prediction model, identify high-risk users, and auto-trigger intervention actions.

#### 1.1 Churn Prediction Model Construction

##### Data Preparation
1. **Label data**: Historical churned user labels
2. **Feature engineering**: Build churn prediction features
3. **Data split**: Training set/validation set/test set

##### Churn Signal Features
| Feature Category | Specific Features |
|---------|---------|
| Activity features | Visit frequency, usage duration, feature usage count |
| Behavioral features | Core feature usage, key action completion |
| Engagement features | Content interaction, social behavior |
| Payment features | Payment status, spending amount, payment cycle |
| Feedback features | NPS score, customer service contacts, support tickets |

##### Model Training
Supports multiple model types:
- Logistic regression (strong interpretability)
- XGBoost/LightGBM (high accuracy)
- Deep learning models (complex pattern recognition)
- Ensemble models (stable and reliable)

#### 1.2 High-Risk User Identification

##### Risk Stratification
| Risk Level | Risk Score | Definition | Response Strategy |
|---------|---------|------|---------|
| High risk | >=0.7 | Very likely to churn | Immediate intervention |
| Medium risk | 0.4-0.7 | High churn possibility | Close attention |
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
| High risk | Dedicated customer success, limited-time offer | Phone + SMS + Email | Immediate |
| Medium risk | Personalized value push, survey | Email + Push | Within 24 hours |
| Low risk | Content marketing, version update notification | Push + In-app message | Within 48 hours |

##### Intervention Content Types
1. **Value recall**: Showcase new product features and use cases
2. **Problem resolution**: Provide solutions for known issues
3. **Incentive offers**: Provide renewal discounts or value-added services
4. **Human care**: Customer success proactive outreach to understand needs
5. **Social activation**: Invite friends to use together

##### Intervention Timing
- Trigger immediately after user behavior change
- Preventive intervention triggered before risk accumulates
- Avoid outreach during user busy periods

#### 1.4 Intervention Effect Tracking

##### Core Metrics
| Metric | Description | Target Value |
|------|------|--------|
| Intervention coverage | Proportion of high-risk users intervened | >=80% |
| Response rate | Proportion of users responding after intervention | >=15% |
| Churn prevention rate | Proportion of users not churning after intervention | >=10% |
| ROI | Churn prevention revenue / Intervention cost | >=3.0 |

##### Effect Analysis
- Effect comparison across intervention strategies
- Intervention effect differences across user groups
- Impact of intervention timing on effectiveness
- Optimization directions for intervention content

### Step 2: Segmented Operations (from retention-engagement)

Based on Step 1 churn prediction output, segment users by lifecycle stage and generate operations strategies and personalized outreach content.

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
Dormant and churned user identification priority is higher than normal segmentation, ensuring timely triggering of churn prevention strategies.

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
- Potential recall value

##### Churned User Analysis
- Churn time distribution
- Churn cause inference
- Recall value assessment

#### 2.3 Automated Operations Strategy Generation

##### Segmented Operations Strategy

| User Segment | Operations Objective | Core Strategy | Key Metrics |
|---------|---------|---------|---------|
| New users | Activation + retention | Guide experience, habit building | D7/D30 retention rate |
| Growing users | Deep usage | Feature expansion, value reinforcement | Feature usage count, usage duration |
| Mature users | Sustained activity | Prevent dormancy, value-added services | Monthly active rate, NRR |
| Dormant users | Reactivation | Value recall, problem resolution | Wake-up rate, recall ROI |
| Churned users | Targeted recall | Incentive offers, emotional recall | Recall rate, recalled user LTV |

##### Strategy Trigger Rules
```yaml
trigger_rules:
  new_user:
    - event: "Registration complete"
      action: "Send welcome sequence"
    - event: "Activation complete"
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
      action: "Trigger recall flow"

  churned:
    - event: "Churned for 30 days"
      action: "Trigger recall campaign"
```

#### 2.4 Outreach Content Personalization

##### Content Type Matrix
| User Segment | Push Content | Content Style | Outreach Frequency |
|---------|---------|---------|---------|
| New users | Usage tutorials, feature introductions | Friendly guidance | High |
| Growing users | Advanced tips, case sharing | Value-oriented | Medium |
| Mature users | Feature updates, membership benefits | Maintenance care | Low |
| Dormant users | Value recall, limited-time offers | Incentive-driven | Concentrated |
| Churned users | Recall campaigns, exclusive offers | Emotional appeal | Concentrated |

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
    "segments": {"type": "array", "description": "User segmentation data, including segment name, count, characteristics, and health score"},
    "segment_overview": {"type": "object", "description": "Segment overview, including count and average health score"},
    "strategies": {"type": "array", "description": "Segmented operations strategy list, including objectives, actions, and success metrics"},
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
      "name": "New users",
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
      "objective": "Promote activation and early retention",
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
Weekly scheduled outreach:
- Monday: Active user weekly report
- Wednesday: Feature usage reminder (new users)
- Friday: Active user content push

Event-triggered outreach:
- Feature update: All-user notification
- Holiday campaigns: High-value user exclusive
- User milestones: Congratulations + incentive
```

## Output Validation Rules

| Field Path | Type | Required | Description |
|----------|------|------|------|
| churn_prevention | object | Yes | Churn prediction and intervention results, must contain risk_model/high_risk_users/interventions |
| churn_prevention.risk_model | object | Yes | Prediction model, must contain model_type/features/accuracy |
| churn_prevention.risk_model.accuracy | number | Yes | Model accuracy, must be >0.75 |
| churn_prevention.risk_thresholds | object | Yes | Risk thresholds, must contain high_risk/medium_risk/low_risk |
| churn_prevention.high_risk_users | array | Yes | High-risk user list, each item must contain user_id/risk_score/risk_level |
| churn_prevention.high_risk_users[].risk_level | string | Yes | Risk level, only high/medium/low/stable allowed |
| churn_prevention.interventions | array | Yes | Intervention strategy list, each item must contain trigger_condition/intervention_type/channel |
| churn_prevention.tracking | object | No | Effect tracking, must contain response_rate/churn_prevention_rate/roi |
| segments | array | Yes | User segmentation data, at least covering new/growing/mature/dormant/churned 5 segments |
| segments[].segment_id | string | Yes | Segment identifier, only new_user/growing_user/mature_user/at_risk/churned allowed |
| segments[].count | number | Yes | Segment user count, must be >=0 |
| segments[].health_score | number | Yes | Health score, range 0-1 |
| strategies | array | Yes | Operations strategy list, at least 5 items (1 per segment) |
| strategies[].segment | string | Yes | Target segment |
| strategies[].success_metrics | array | Yes | Success metrics list, at least 1 |
| personalized_content | array | No | Personalized content list |

## Decision Rules

| Situation | Action |
|------|----------|
| Risk score >=0.7 (high risk) | Immediate intervention, dedicated customer success engagement |
| Paid user shows churn signals | Priority handling, respond within 48 hours |
| Intervention response rate <10% | Optimize intervention content and channels |
| High-value user churn warning | Full-channel outreach + human care |
| Dormant user proportion >15% | Trigger batch recall strategy |
| New user D7 retention <25% | Optimize Onboarding and activation guidance |
| Mature user health score declining | Trigger anti-dormancy strategy |
| Operations outreach response rate <5% | Optimize outreach content and channels |

## Quality Checks

- [ ] Churn definition distinguishes free/paid/enterprise users
- [ ] Prediction model accuracy >75%
- [ ] Intervention strategies match risk levels
- [ ] Intervention effect tracking includes ROI calculation
- [ ] User segmentation covers complete lifecycle (new/growing/mature/dormant/churned)
- [ ] Health score includes activity, feature depth, payment willingness, social engagement
- [ ] Operations strategies match user segments
- [ ] Outreach content is personalized

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Upstream Input | Degradation Plan | Output Impact |
|----------|----------|----------|
| User behavior data missing | User provides user activity data -> analyze churn characteristics | Churn attribution based on activity data inference, behavioral feature analysis limited |
| Churn history missing | Skip churn trend comparison, analyze based on current data only | Cannot evaluate churn trend changes |
| User behavior data + churn history both missing | User provides user activity data -> analyze churn characteristics | Output basic churn analysis, intervention strategies marked "pending validation" |
| Lifecycle stage missing | Use generic lifecycle model (new/active/dormant/churned), mark "to be confirmed" | Segmentation criteria based on generic assumptions |
| User behavior data + lifecycle stage both missing | User describes user groups -> generate segmentation strategy | Output based on description segmentation strategy, marked "pending data validation" |
- If user has not provided user account data, prompt user to provide or skip steps related to that input

### Data Acquisition Notes

When upstream files are missing, users need to provide the following information to support degraded generation:
- **User activity data**: Active user count and churned user count per period
- **Churn definition** (optional): Product's criteria for defining churned users
- **High-value user proportion** (optional): Proportion of high-value users among active users
- **User group description**: Main types and characteristics of product users
- **Activity distribution** (optional): High/medium/low active user proportions
- **Operations resources** (optional): Resources and channels available for user operations

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Source | Change Type | Impact Scope | Response Action |
|----------|----------|----------|----------|
| Data analytics platform - activity logs | Behavioral event definition change | Churn signal features and model training | Update feature engineering, retrain model |
| Data analytics platform - churn records | Churn definition change | Churn labels and risk thresholds | Re-label with new definition, adjust thresholds |
| User system - account info | User attribute change | Risk stratification and intervention strategies | Update user features, adjust intervention matching |
| User provided - lifecycle | Milestone definition change | Segmentation criteria and strategy triggers | Adjust segmentation conditions and trigger rules |

### Downstream Notification Mechanism Table

| Downstream Consumer | Notification Condition | Notification Method | Notification Content |
|------------|----------|----------|----------|
| revenue-upsell | High-value user segment change | Write to output file | High-value user list and upgrade signals |
| retention-orchestrator | Churn prediction and segmented operations complete | Output file update | Retention management completion status and key conclusions |

## Key Success Metrics

| Metric | Definition | Target Value |
|------|------|--------|
| Segment retention rates | Proportion of each segment retaining in next period | Improve across segments |
| Dormant wake-up rate | Proportion of dormant users reactivated | >=15% |
| Average user health score | Average health score across all users | >=0.7 |
| Operations outreach response rate | Open/click rate of outreach messages | >=10% |

## Notes

- Churn prediction model needs regular updates to adapt to product changes and user behavior changes
- Avoid over-intervention that disturbs users and degrades user experience
- High-value user intervention priority and resource investment should be higher
- Establish intervention feedback mechanism to continuously optimize intervention strategies
