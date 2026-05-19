---
name: business-model-canvas
description: "Use when designing or evaluating a product business model. Auto-generates a Business Model Canvas converting exploration insights into a 9-block canvas. Keywords: business model canvas, BMC, value proposition, revenue model, cost structure, monetization."
metadata:
  module: "Product Business & Strategy"
  sub-module: "Business Model Design"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "Help me clarify our business model"
    - "How does our business model make money"
---

# Business Model Canvas Auto-Generation

## Core Principles

1. **Nine-Block Interconnection** -- The 9 canvas elements must be logically consistent, forming a closed loop: Customer Segments -> Value Propositions -> Channels -> Revenue
2. **Options Over Conclusions** -- Generate 2-3 comparable options for key decision points such as revenue models, with human selection
3. **Explicit Assumption Labeling** -- All inferred content must be labeled as assumptions, including risk level and validation method
4. **Automatic Financial Projection** -- Unit economics and sensitivity analysis are completed automatically by AI; humans only review conclusions

**Execution Cycle**: Triggered after the product exploration phase is complete

**Core Objective**: Transform user insights and market data collected during the exploration phase into a structured Business Model Canvas, clarifying the system architecture for value creation, delivery, and capture.

## Interaction Mode

AI->Human AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| product_context | JSON | Yes | user-research-user-modeling / opportunity-definition | Exploration phase output: user personas, problem statement, opportunity definition |
| market_data | JSON | Yes | market-competitor-analysis | Market data: competitor business models, market size, industry benchmarks |

### Required Input

**product_context (from exploration phase):**
```json
{
  "persona_summary": "Target user persona summary, including user characteristics, needs, pain points",
  "problem_statement": "User problem statement, clarifying the core problem to solve",
  "opportunity_definition": "Business opportunity definition, including market size, opportunity description"
}
```

**market_data (market data):**
```json
{
  "competitor_business_models": [
    {
      "competitor_name": "Competitor name",
      "business_model_type": "Competitor business model type",
      "key_elements": {
        "value_proposition": "Competitor value proposition",
        "revenue_model": "Competitor revenue model",
        "pricing": "Competitor pricing"
      }
    }
  ],
  "market_size": {
    "tam": "Total Addressable Market",
    "sam": "Serviceable Available Market",
    "som": "Serviceable Obtainable Market"
  },
  "industry_benchmarks": {
    "typical_margin": "Industry typical profit margin",
    "typical_pricing": "Industry typical pricing range",
    "customer_acquisition_cost": "Industry CAC benchmark"
  }
}
```

## Execution Steps

### Step 1: Customer Segments Population

**Task**: Define target customer segment groups based on user personas and pain point analysis.

**Execution Logic**:
1. Extract key characteristics of user personas from the exploration phase
2. Segment groups by need priority and accessibility
3. Define core characteristics for each segment group

**Output Format**:
```json
{
  "customer_segments": [
    {
      "segment_id": "segment-1",
      "name": "Small and medium training institutions",
      "characteristics": ["Student scale 50-500", "Need for digital transformation"],
      "primary_pains": ["Lack of technical capability to build online teaching platforms"],
      "priority": "high/medium/low"
    }
  ]
}
```

**Acceptance Criteria**:
- At least 2 differentiated customer segment groups identified
- Each group has clear characteristic descriptions
- Priority ranking is data-supported

### Step 2: Value Propositions Population

**Task**: Design differentiated value propositions based on user pain points and competitor analysis.

**Execution Logic**:
1. Extract core user pain points and high-priority needs
2. Analyze competitor value proposition coverage and gaps
3. Design value propositions that address key pain points
4. Define Pain Relievers and Gain Creators

**Output Format**:
```json
{
  "value_propositions": [
    {
      "proposition_id": "vp-1",
      "headline": "AI-driven personalized teaching SaaS platform",
      "description": "Providing training institutions with an out-of-the-box online teaching solution through an AI adaptive learning engine",
      "target_segment": "segment-1",
      "pain_relievers": ["Lowering the technical barrier for training institutions to go online", "Improving student learning efficiency and completion rates"],
      "gain_creators": ["Training institution operating costs reduced by 40%", "Student completion rate increased to 85%"],
      "differentiation": "AI adaptive learning engine dynamically adjusts teaching paths, unlike static course platforms"
    }
  ]
}
```

**Acceptance Criteria**:
- At least 1 value proposition per customer segment group
- Value propositions directly address high-priority pain points
- Includes specific descriptions of Pain Relievers and Gain Creators

### Step 3a: Revenue Streams Population (Decision Tree Matching)

**Task**: Automatically match potential revenue model types based on product characteristics and market benchmarks.

**Decision Tree Logic**:

```
Start
  │
  ├─ Product form = Physical goods?
  │     └─ Yes -> Checkpoint: Subscription service needed?
  │           ├─ Yes -> Revenue model = Subscription + One-time purchase
  │           └─ No -> Revenue model = One-time sales
  │
  ├─ Product form = Software/Digital service?
  │     └─ Yes -> Checkpoint: User usage frequency?
  │           ├─ High frequency (>1/week) -> Revenue model = Subscription
  │           ├─ Medium frequency (1/month) -> Revenue model = Usage-based billing
  │           └─ Low frequency (<1/month) -> Revenue model = Project-based/One-time
  │
  ├─ Product form = Platform service?
  │     └─ Yes -> Revenue model = Platform commission/take rate
  │
  └─ Multi-sided market?
        ├─ Yes -> Revenue model = Subscription + Platform commission
        └─ No -> Select based on product form
```

**Step 3b: Multi-Option Revenue Model Generation**

**Task**: Based on Step 3a decision tree results, generate at least 2 comparable revenue model options.

**Execution Logic**:
1. Determine the primary revenue model based on decision tree results
2. Generate at least 1 alternative revenue model (considering hybrid models)
3. Analyze pros and cons of each model

**Output Format**:
```json
{
  "revenue_models": [
    {
      "model_id": "rm-1",
      "type": "SaaS Subscription",
      "description": "Tiered monthly/annual subscription priced by institution student count",
      "pricing_structure": {
        "base_price": "2980",
        "unit": "CNY/institution/month",
        "tiers": ["Basic: up to 50 users 2980 CNY/month", "Professional: up to 200 users 6980 CNY/month"]
      },
      "pros": ["Predictable revenue, stable cash flow", "Natural revenue growth as customer scale increases"],
      "cons": ["High initial customer acquisition cost", "Requires continuous product iteration investment"],
      "risk_level": "low/medium/high"
    },
    {
      "model_id": "rm-2",
      "type": "Usage-based + Subscription Hybrid",
      "description": "Base subscription + overage billing by AI usage volume",
      "pricing_structure": {...},
      "pros": [...],
      "cons": [...],
      "risk_level": "low/medium/high"
    }
  ]
}
```

**Acceptance Criteria**:
- At least 2 revenue model options generated
- Each model includes a clear pricing structure
- Pros/cons analysis and risk level labeled

### Step 4: Cost Structure Population

**Task**: Analyze and estimate the cost structure based on business model requirements.

**Execution Logic**:
1. Identify cost drivers based on key activities and resource allocation
2. Distinguish fixed costs and variable costs
3. Estimate the magnitude and proportion of each cost item
4. Compare with industry benchmarks

**Output Format**:
```json
{
  "cost_structure": {
    "fixed_costs": [
      {
        "item": "R&D team salaries",
        "estimated_monthly": "800000",
        "category": "Personnel/Infrastructure/Operations"
      }
    ],
    "variable_costs": [
      {
        "item": "AI compute usage fees",
        "unit_cost": "0.5 CNY/inference call",
        "driver": "Active students x Average AI interactions per student"
      }
    ],
    "unit_economics": {
      "target_cac": "5000 CNY/institution",
      "target_ltv": "80000 CNY",
      "ltv_cac_ratio": "16:1"
    }
  }
}
```

**Acceptance Criteria**:
- Major cost items identified
- Fixed costs and variable costs classified
- Unit economics metrics set

### Step 5: Channels Population

**Task**: Define channels for reaching customers and delivering value.

**Execution Logic**:
1. Determine channel preferences based on customer segments
2. Analyze cost and efficiency of each channel
3. Design online and offline channel mix
4. Plan channel priorities

**Output Format**:
```json
{
  "channels": [
    {
      "channel_id": "ch-1",
      "name": "Education industry expos and community operations",
      "type": "direct/indirect",
      "phase": "awareness/evaluation/purchase/delivery",
      "cost_efficiency": "high/medium/low",
      "priority": 1
    }
  ]
}
```

**Acceptance Criteria**:
- Covers all stages of the customer journey
- Mix of direct and indirect channels
- Reasonable priority ranking

### Step 6: Key Activities/Resources/Partners Population

**Task**: Define the key activities, resources, and partnerships needed to realize the business model.

**Execution Logic**:

**Key Activities Identification**:
1. Value creation activities
2. Platform/network building activities
3. Customer acquisition activities

**Key Resources Identification**:
1. Physical assets
2. Intellectual property
3. Human resources
4. Financial resources

**Key Partners Identification**:
1. Suppliers
2. Strategic alliances
3. Joint venture partners

**Output Format**:
```json
{
  "key_activities": [
    {
      "activity": "AI learning engine algorithm optimization",
      "type": "creation/delivery/platform",
      "priority": "high/medium/low"
    }
  ],
  "key_resources": [
    {
      "resource": "Adaptive learning algorithm engine",
      "type": "physical/intellectual/human/financial",
      "ownership": "in-house/outsourced/partnership"
    }
  ],
  "key_partners": [
    {
      "partner": "Vocational college content partners",
      "type": "supplier/strategic/joint_venture",
      "purpose": "Obtain authoritative course content licensing",
      "dependency": "Dependency level"
    }
  ]
}
```

**Acceptance Criteria**
- Key activities cover the full value creation process
- Resource requirements match capabilities
- Partnership design is reasonable

### Step 7: Customer Relationships Population

**Task**: Define relationship types with different customer segment groups.

**Execution Logic**:
1. Analyze relationship needs at each stage of the customer journey
2. Determine the mix of self-service/assisted service/community service
3. Plan the customer relationship evolution path

**Output Format**:
```json
{
  "customer_relationships": [
    {
      "segment_id": "segment-1",
      "relationship_type": "personal_assistance/dedicated_assistance/self_service/automated_service/community",
      "description": "Self-service + Customer Success Manager support",
      "touchpoints": ["Online help center and knowledge base", "Dedicated CSM monthly check-in"]
    }
  ]
}
```

**Acceptance Criteria**:
- Each customer segment group has a corresponding relationship type
- Relationship type matches product characteristics
- Touchpoints are clear

## Output

**Storage Path**: `output/pm-strategy/business-model-canvas/`

**Output Files**: bmc.json, assumptions.json

### Output Validation Rules

| Field Path | Type | Required | Description |
|----------|------|------|------|
| bmc.customer_segments | array | Yes | Customer segments list, at least 2 |
| bmc.value_propositions | array | Yes | Value propositions list, at least 1 |
| bmc.channels | array | Yes | Covers all customer journey stages |
| bmc.customer_relationships | array | Yes | Each segment has a corresponding relationship type |
| bmc.revenue_streams | array | Yes | Revenue streams list, at least 1 |
| bmc.key_resources | array | Yes | Covers physical/intellectual/human/financial |
| bmc.key_activities | array | Yes | Covers full value creation process |
| bmc.key_partnerships | array | Yes | Includes suppliers/strategic alliances/joint ventures |
| bmc.cost_structure | array | Yes | Cost structure list, at least 1 |
| metadata.confidence | number | Yes | Between 0-1, overall confidence |
| metadata.requires_human_review | boolean | Yes | Whether human review is needed |
| assumptions[].assumption_id | string | Yes | Unique assumption identifier |
| assumptions[].related_bmc_element | string | Yes | Related canvas element path |
| assumptions[].priority | string | Yes | critical/high/medium/low |
| assumptions[].confidence | number | Yes | Between 0-1, assumption confidence |

### Complete Business Model Canvas JSON

```json
{
  "bmc": {
    "customer_segments": [
      {
        "segment_name": "string - Customer group name",
        "description": "string - Group description",
        "characteristics": ["string - Group characteristics"]
      }
    ],
    "value_propositions": [
      {
        "proposition": "string - Value proposition",
        "target_segment": "string - Corresponding customer group",
        "pain_addressed": "string - Pain point addressed",
        "gain_created": "string - Gain created"
      }
    ],
    "channels": [
      {
        "channel_name": "string - Channel name",
        "type": "direct|indirect|partner",
        "phase": "awareness|evaluation|purchase|delivery|after_sales"
      }
    ],
    "customer_relationships": [
      {
        "type": "personal|automated|community|self_service",
        "segment": "string - Corresponding customer group",
        "description": "string - Relationship description"
      }
    ],
    "revenue_streams": [
      {
        "stream_name": "string - Revenue stream name",
        "pricing_model": "subscription|transaction|freemium|advertising|licensing",
        "estimated_amount": "string - Estimated amount range",
        "target_segment": "string - Corresponding customer group"
      }
    ],
    "key_resources": [
      {
        "resource": "string - Core resource",
        "type": "physical|intellectual|human|financial"
      }
    ],
    "key_activities": [
      {
        "activity": "string - Core activity",
        "type": "production|problem_solving|platform|network"
      }
    ],
    "key_partnerships": [
      {
        "partner": "string - Partner",
        "type": "strategic_alliance|joint_venture|buyer_supplier",
        "purpose": "string - Partnership purpose"
      }
    ],
    "cost_structure": [
      {
        "cost_item": "string - Cost item",
        "type": "fixed|variable",
        "estimated_range": "string - Estimated cost range",
        "category": "infrastructure|marketing|operations|personnel"
      }
    ]
  },
  "metadata": {
    "generated_at": "2024-06-15T10:30:00Z",
    "confidence": "0.78",
    "requires_human_review": true
  }
}
```

### Assumptions List

```json
{
  "assumptions": [
    {
      "assumption_id": "string - Assumption ID",
      "description": "string - Assumption description",
      "related_bmc_element": "string - Related canvas element (e.g. customer_segments.0)",
      "validation_method": "string - Validation method",
      "priority": "critical|high|medium|low",
      "confidence": 0.0
    }
  ]
}
```

## Decision Rules

### Revenue Model Decision Rules

1. **Option Generation Rule**: Must generate at least 2 revenue model options for selection

2. **Risk Assessment Rule**:
   - High-risk assumptions must be explicitly labeled in recommendations
   - When a high-risk assumption failure impacts >50% of revenue, mandatory escalation to human approval

3. **Assumption Explicitness Rule**:
   - All revenue assumptions must be listed
   - Each assumption must have a risk level labeled (low/medium/high)
   - Assumption sources must be traceable

### Overall Decision Rules

1. **Multi-Option Presentation**: Generate 2-3 comparable options for each key decision point

2. **Data Support Labeling**: Each canvas element must have its data source and inference basis labeled

3. **Uncertainty Transparency**: All inferred content must have confidence levels labeled

## Quality Checks

### Self-Check List

- [ ] All 9 elements of the Business Model Canvas are populated
- [ ] Each element's content has data support or assumption labels
- [ ] At least 2 revenue model options generated
- [ ] Assumptions list is complete, each assumption includes:
  - Clear description
  - Risk level labeled
  - Validation status labeled
  - Impact assessment provided
- [ ] Validation methods recommended for core assumptions
- [ ] Unit economics metrics set

### Output Quality Standards

1. **Completeness**: Each of the 9 canvas blocks has at least 1 entry, and value_propositions correspond to customer_segments
2. **Traceability**: Each block's content is labeled with data_source (upstream skill/user description/AI inference)
3. **Assumption Completeness**: assumptions list >=3 items, each including assumption+validation_method+priority
4. **Revenue Verifiability**: revenue_streams include >=1 specific revenue source and pricing strategy has numeric ranges

---

## Degradation Strategy

When upstream files do not exist, this Skill can still execute independently:

| Missing Upstream Input | Degradation Plan | Output Impact |
|---------------|---------|---------|
| persona.json / opportunity-definition.json | User provides product description and target users -> Generate BMC based on description | Customer segments and value propositions lack exploration phase data support, overall confidence drops from 0.8 to 0.5, related canvas blocks confidence <=0.4, labeled needs_human_validation: true |
| exploration_outputs (multiple exploration phase files) | User provides product description and target users -> Generate BMC based on description | Overall confidence drops from 0.8 to 0.5 for each module, assumption entries increase, related canvas blocks confidence <=0.3, labeled auto_filled: true |
| All upstream files missing | Prompt user to execute prior phases first, or generate BMC based on user-provided product description and target users | Overall confidence drops from 0.8 to 0.3, most content is assumption-based inference, related canvas blocks confidence <=0.3, labeled auto_filled: true |

## Data Acquisition Instructions

This Skill requires exploration phase output data (Persona, Opportunity Brief, etc.), please provide via one of the following methods:
  1. Directly describe the product concept, target users, and value proposition
  2. Upload persona.json / opportunity-definition.json files
  3. Provide data file paths
- AI is not responsible for external data collection, only for analysis

---

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Change | Impact Scope | Response Strategy |
|----------|----------|----------|
| persona.json user persona update | Customer segments and customer relationships modules need repopulation | Re-execute Step 1 and Step 7, label change source |
| opportunity-definition opportunity definition update | Value propositions and revenue models may need adjustment | Re-evaluate value proposition priorities, check revenue model fit |
| competitor-analysis competitor data update | Value proposition differentiation and revenue model pricing reference | Re-execute Step 2 and Step 3, update competitor benchmarking data |
| Market size data change | Revenue expectations and cost structure | Recalculate unit economics metrics, update market size assumptions |

### Downstream Notification Mechanism Table

| Change Type | Impact Scope | Notification Method |
|----------|----------|----------|
| Customer segment adjustment | business-value-fit, business-pricing | Output file version number + change summary |
| Value proposition change | business-value-fit, positioning-strategy | Output file version number + change summary |
| Revenue model change | business-pricing | Output file version number + change summary |
| Cost structure change | business-pricing, business-strategy-report | Output file version number + change summary |

---

## Human Review Checklist

Before submitting for human approval, ensure the following:

- [ ] Customer segments align with actual market conditions
- [ ] Value propositions are clearly differentiated and achievable
- [ ] Revenue model options each have clear pros and cons
- [ ] Cost structure matches the operational plan
- [ ] Key assumptions are verifiable with validation plans
