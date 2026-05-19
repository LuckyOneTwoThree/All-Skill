---
name: ideation-workshop
description: "Creative workshop integrating multi-method divergence (HMW/SCAMPER/reverse thinking) and creative convergence. Keywords: ideation, creative convergence, HMW, SCAMPER, reverse thinking, creative workshop."
metadata:
  module: "Product Ideation & Design"
  sub-module: "Ideation & Solution Conception"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "Help me brainstorm ideas"
    - "Use SCAMPER method for innovation"
    - "Think in reverse"
    - "Too many solutions, which to choose"
    - "Let's brainstorm"
    - "Creative workshop"
execution_depth:
  default: standard
  quick_description: "Output top ideas and evaluation matrix only"
  deep_description: "Full workshop + concept validation + feasibility assessment + innovation roadmap"
---

# Creative Workshop

## Core Principles

1. **Questions are more important than answers** -- HMW quality determines subsequent solution quality; broad and solution-presuming HMWs are poison to creativity
2. **Seven dimensions are divergence insurance** -- SCAMPER's seven dimensions ensure thinking doesn't fall into a single pattern; at least 2 solutions per dimension
3. **Failure is more enlightening than success** -- First figure out "why it would die", then figure out "how to live"; constraints are guardrails for creativity, not shackles
4. **Convergence is deepening, not elimination** -- Selected solutions must be fully deepened, not simply ranked
5. **Human decision authority is inalienable** -- AI provides analysis and recommendations; final solution selection must be decided by humans
6. **Quantity before quality** -- Divergence phase pursues solution quantity; convergence phase filters; early judgment is the enemy of creativity

The Creative Workshop integrates four methods: HMW problem reframing, SCAMPER structured divergence, reverse thinking, and creative convergence, forming a complete "diverge -> converge" creative process. Step 1 transforms problem statements into open-ended questions through HMW; Step 2 executes SCAMPER and reverse thinking in parallel to maximize divergence output; Step 3 completes creative convergence through filtering, deepening, and comparison matrix, providing structured support for human decision-making.

### Execution Roles

AI->Human **AI suggests, human approves**

- **AI responsible for**: HMW generation, SCAMPER solution generation, reverse thinking analysis, solution filtering, deepening analysis, comparison matrix generation
- **Human responsible for**: HMW approval, final solution selection, priority confirmation, action item decisions

---

## Interaction Mode

AI->Human AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|------------|------|----------|--------|-------------|
| Problem Statement | string | Yes | User provided / upstream output | Clearly and specifically describe the problem to be solved; avoid being too abstract or broad |
| User Research Data | JSON/object | Yes | User provided / upstream output | Must include at least one type of user research data (interviews, surveys, or behavioral data) to ensure HMW generation is evidence-based |
| Current Solution | JSON/object | O | User provided | Current product's existing solution description, including features and limitations |
| Competitor Solutions | JSON/array | O | User provided | Analysis of at least 2-3 competitor solutions, including features, strengths, and weaknesses |
| Product Context | JSON/object | O | User provided | Product strategy and resource constraint information |

### Input Format

```json
{
  "problem_statement": "Core problem description to be solved",
  "user_research_data": {
    "interviews": [
      {
        "user_id": "User identifier",
        "quotes": ["User verbatim quotes"],
        "pain_points": ["Pain point descriptions"],
        "context": "Usage scenario"
      }
    ],
    "surveys": [
      {
        "question": "Survey question",
        "responses": ["User responses"],
        "insights": ["Key insights"]
      }
    ],
    "behavior_data": {
      "metrics": "Behavioral data metrics",
      "patterns": ["User behavior patterns"]
    }
  },
  "current_solution": {
    "description": "Detailed description of current product solution",
    "features": ["Feature 1", "Feature 2"],
    "limitations": ["Current solution limitations"]
  },
  "competitor_solutions": [
    {
      "competitor_name": "Competitor name",
      "solution_description": "Competitor solution description",
      "key_features": ["Key feature 1", "Key feature 2"],
      "strengths": ["Strength 1", "Strength 2"],
      "weaknesses": ["Weakness 1", "Weakness 2"]
    }
  ],
  "product_context": {
    "strategic_goals": ["Strategic goal 1", "Strategic goal 2"],
    "resource_constraints": ["Resource constraint 1", "Resource constraint 2"],
    "timeline": "Time limit",
    "risk_tolerance": "Risk preference"
  }
}
```

---

## Execution Steps

### Step 1: HMW Problem Reframing [Core]

Based on problem statement and user research data, batch generate HMW statements from 6 dimensions, with quality checks and scoring.

#### 1.1 Generate HMW from 6 Dimensions

AI must generate HMW statements from the following 6 dimensions for each core problem:

##### Dimension Descriptions

1. **Remove**
   - Goal: Remove obstacle factors causing the problem
   - Question orientation: How might we eliminate the obstacles preventing users from achieving their goals?

2. **Reduce**
   - Goal: Reduce the effort, time, or complexity required to solve the problem
   - Question orientation: How might we lower the threshold for users to complete tasks?

3. **Accelerate**
   - Goal: Speed up the efficiency of users achieving their goals
   - Question orientation: How might we help users achieve their goals faster?

4. **Amplify**
   - Goal: Enhance users' perception and understanding of product value or features
   - Question orientation: How might we help users better perceive and understand product value?

5. **Expand**
   - Goal: Expand product usage scenarios or user groups
   - Question orientation: How might we apply the product to more usage scenarios?

6. **Rethink**
   - Goal: Redefine the problem or solution from a completely new perspective
   - Question orientation: How might we fundamentally rethink this problem?

##### Generation Requirements

- Generate at least 2-3 HMW statements per dimension
- HMW statements should:
  - Begin with "How might we"
  - Be specific enough to guide solution generation
  - Be open enough to preserve divergence space
  - Directly relate to insights from user research data

#### 1.2 HMW Quality Check

Perform quality checks on each generated HMW statement:

1. **Is it too broad**: Does the HMW cover too many problems, making it unable to guide specific solutions
2. **Does it presume a solution**: Does the HMW already imply a specific solution
3. **Is it specific enough**: Is the HMW specific enough to guide solution direction
4. **Does it have divergence space**: Does the HMW preserve multiple possible solution paths

Each HMW must simultaneously satisfy: not too broad, not solution-presuming, specific enough, and has divergence space.

#### 1.3 HMW Scoring

Score divergence potential (1-5) for HMW statements that pass quality check:

- **1 point**: Can only think of 1-2 solutions
- **2 points**: Can think of 2-3 related solutions
- **3 points**: Can think of 3-5 solutions
- **4 points**: Can think of 5-8 diverse solutions
- **5 points**: Can think of 8+ highly diverse solutions

#### HMW Output Structure

```json
{
  "hmw_ideas": {
    "hmw_statements": [
      {
        "id": "hmw_001",
        "statement": "How might we eliminate the friction points that cause users to abandon checkout?",
        "dimension": "remove",
        "source_problem": "Users abandon order completion midway",
        "source_data": {
          "type": "interview",
          "user_id": "user_001",
          "quote": "User verbatim quote"
        },
        "divergence_potential": 4,
        "quality_check": "passed",
        "quality_issues": [],
        "related_dimensions": ["remove", "reduce"]
      }
    ],
    "summary": {
      "total_hmw": 36,
      "passed": 32,
      "failed": 4,
      "dimension_distribution": {
        "remove": 6,
        "reduce": 6,
        "accelerate": 6,
        "amplify": 6,
        "expand": 6,
        "rethink": 6
      },
      "average_divergence": 3.8,
      "high_potential_count": 18
    }
  }
}
```

---

### Step 2: Parallel Divergence (SCAMPER + Reverse Thinking) [Core]

Based on Step 1 HMW output, execute SCAMPER structured divergence and reverse thinking analysis in parallel to maximize creative output.

#### 2A: SCAMPER Structured Solution Generation

For each selected HMW (recommend selecting divergence potential >= 3), generate 2-3 solutions from each of 7 dimensions.

##### SCAMPER Dimension Details

1. **Substitute (S)** -- What can replace existing elements?
2. **Combine (C)** -- What can be combined?
3. **Adapt (A)** -- What can be adapted or borrowed?
4. **Modify (M)** -- How can it be modified?
5. **Put to other use (P)** -- What other uses are possible?
6. **Eliminate (E)** -- What can be eliminated?
7. **Reverse (R)** -- How can it be reversed?

##### SCAMPER Generation Requirements

- Generate at least 2 solutions per HMW per dimension
- Solutions should directly respond to the HMW statement's question
- Reflect the core idea of the corresponding SCAMPER dimension
- Have a certain degree of novelty and differentiation

##### Solution Deduplication and Clustering

1. **Semantic deduplication**: Identify semantically identical or highly similar solutions, merge or delete duplicates
2. **Dimension validation**: Ensure the same solution is not repeatedly classified under different dimensions
3. **Clustering algorithm**: Cluster based on goal similarity, method similarity, user value similarity, and implementation complexity similarity

##### SCAMPER Initial Scoring

Score each solution from 4 dimensions:

1. **Innovation** 1-5 points
2. **Feasibility** 1-5 points
3. **Impact** 1-5 points
4. **Risk** 1-5 points (reverse scoring, 5 points = almost no risk)

#### 2B: Reverse Thinking Analysis

Based on product/feature goals, generate failure paths and reverse-transform them into success conditions and design constraints.

##### Generate Failure Paths

Based on product/feature goals, generate 10-15 potential failure paths covering 5 levels:

1. **User behavior level**: Users don't use, misunderstand value, steep learning curve
2. **Technical implementation level**: Feature instability, performance issues, security vulnerabilities
3. **Business operations level**: Cost overruns, compliance issues, poor market timing
4. **Value perception level**: Users don't perceive value, competitor substitution
5. **Ecosystem level**: Partner non-cooperation, third-party dependency risks

Each failure path includes:
- **Failure Mode**: Clear description of the specific failure manifestation
- **Severity** 1-5 points
- **Likelihood** 1-5 points
- **Priority** = Severity x Likelihood (Critical >= 15, High 10-14, Medium 6-9, Low < 6)

##### Reverse-Transform into Success Conditions

Reverse-think each failure path into corresponding success conditions:
- Not "how to avoid failure", but "under what conditions this failure won't occur"
- Success conditions must be specific and clear, observable and verifiable, directly related to the failure path, and not presume specific implementation methods

##### Transform into Design Constraints

Transform high-priority success conditions into specific, actionable design constraints, classified as:

1. **Functional constraints**: Features that must be provided or prohibited
2. **Interaction constraints**: Interaction patterns that must be followed or avoided
3. **Visual constraints**: Visual designs that must be observed or avoided
4. **Performance constraints**: Performance metrics that must be met
5. **Content constraints**: Content elements that must be included or avoided
6. **Technical constraints**: Technical solutions that must be adopted or avoided

Each design constraint must have a clear verification method.

#### Parallel Divergence Output Structure

```json
{
  "scamper_ideas": {
    "solutions": [
      {
        "id": "solution_001",
        "source_hmw": {
          "id": "hmw_001",
          "statement": "How might we eliminate the friction points that cause users to abandon checkout?"
        },
        "scamper_dimension": "eliminate",
        "solution": "Remove mandatory registration requirement, allow guest checkout",
        "description": "Allow users to complete purchases without creating an account, only providing necessary shipping and payment information",
        "innovation_score": 3,
        "feasibility_score": 5,
        "impact_score": 4,
        "risk_score": 4,
        "key_assumption": "Users are willing to provide payment information without logging in",
        "cluster": "cluster_001"
      }
    ],
    "clusters": [
      {
        "cluster_id": "cluster_001",
        "cluster_name": "Process Simplification",
        "description": "Simplify the checkout process by reducing steps and fields",
        "solution_ids": ["solution_001", "solution_004", "solution_007"],
        "cluster_potential": 4.2,
        "dominant_dimension": "eliminate"
      }
    ],
    "summary": {
      "total_solutions": 42,
      "total_clusters": 8,
      "average_scores": {
        "innovation": 3.4,
        "feasibility": 3.8,
        "impact": 3.6,
        "risk": 3.5
      },
      "dimension_distribution": {
        "substitute": 6,
        "combine": 5,
        "adapt": 6,
        "modify": 6,
        "put_to_other_use": 6,
        "eliminate": 7,
        "reverse": 6
      }
    }
  },
  "inversion_ideas": {
    "inversion_analysis": [
      {
        "id": "inversion_001",
        "failure_mode": "Users abandon on checkout page",
        "severity": 5,
        "likelihood": 4,
        "risk_score": 20,
        "priority": "critical",
        "success_condition": "Users can smoothly complete the checkout process without any obstacles",
        "design_constraints": [
          {
            "constraint": "Checkout process has at most 3 steps",
            "category": "Functional constraint",
            "verifiable": true,
            "verification_method": "Functional test verifying step count"
          },
          {
            "constraint": "No more than 5 fields per step",
            "category": "Interaction constraint",
            "verifiable": true,
            "verification_method": "UI review verifying field count"
          }
        ]
      }
    ],
    "summary": {
      "total_failure_modes": 12,
      "priority_distribution": {
        "critical": 3,
        "high": 4,
        "medium": 3,
        "low": 2
      },
      "total_design_constraints": 38,
      "constraints_by_category": {
        "Functional constraint": 8,
        "Interaction constraint": 12,
        "Performance constraint": 6,
        "Visual constraint": 4,
        "Content constraint": 5,
        "Technical constraint": 3
      },
      "critical_success_conditions": 3,
      "high_priority_constraints": 15
    }
  }
}
```

---

### Step 3: Creative Convergence [Core]

From SCAMPER solution list and reverse thinking constraints, filter high-quality candidates, and provide support for human decision-making through deepening and comparison matrix.

#### 3.1 Solution Filtering

AI automatically filters high-quality candidate solutions:

1. **Feasibility filtering**: Exclude solutions with feasibility score < 2
2. **Design constraint conflict detection**: Exclude solutions conflicting with Critical/High level design constraints
3. **Basic quality threshold**: Composite score = (Innovation + Feasibility + Impact + (6 - Risk)) / 4 >= 3.5, or exceptionally outstanding in one dimension (score >= 4.5)
4. **Multi-dimensional consideration**: Balance, differentiation, coverage

#### 3.2 Solution Deepening

Deep analysis and refinement of Top 5-10 filtered solutions:

1. **Detailed solution description**: Complete solution narrative, core features, user experience flow, differentiation
2. **Interaction flow design**: Interaction steps for main user scenarios, key pages and components, exception handling
3. **Key assumptions**: Technical assumptions, user assumptions, business assumptions, data assumptions
4. **Risk identification**: Technical risks, user risks, business risks, market risks
5. **MVP scope definition**: Core MVP / Extended MVP / Excluded
6. **Success metrics**: Primary Metrics / Secondary Metrics / Guardrail Metrics

#### 3.3 Solution Comparison Matrix

Build a 6-dimension solution comparison matrix:

1. **User Value** 1-5 points, weight 0.25
2. **Implementation Complexity** 1-5 points (reverse), weight 0.15
3. **Innovation** 1-5 points, weight 0.15
4. **Risk** 1-5 points (reverse), weight 0.15
5. **Strategic Alignment** 1-5 points, weight 0.15
6. **Scalability** 1-5 points, weight 0.15

AI provides recommendations based on weighted total score method, dimension-optimal method, comprehensive trade-off method, and scenario-fit method, clearly marking confidence and recommendation reasons.

#### Creative Convergence Output Structure

```json
{
  "converged_ideas": {
    "converged_solutions": [
      {
        "id": "solution_001",
        "title": "Allow Guest Checkout",
        "detailed_description": {
          "overview": "Allow users to complete purchases without creating an account...",
          "key_features": ["Feature 1", "Feature 2", "Feature 3"],
          "user_experience": "Users can directly enter shipping and payment information...",
          "differentiation": "Compared to the existing solution, we eliminate the registration barrier..."
        },
        "interaction_flow": {
          "steps": [
            {
              "step": 1,
              "action": "User clicks purchase button",
              "ui_elements": ["Purchase button", "Product info"],
              "user_goal": "Start purchase flow"
            }
          ],
          "main_scenarios": ["Standard purchase flow", "Interrupt recovery flow", "Payment failure retry"]
        },
        "assumptions": {
          "technical": ["Users are willing to provide payment information without logging in"],
          "user": ["New users prefer to experience before registering"],
          "business": ["Short-term order completion rate increase can offset registration rate decrease"]
        },
        "risks": {
          "technical": {
            "description": "Payment information security requires additional safeguards",
            "severity": "medium",
            "mitigation": "Use third-party payment platform to handle sensitive information"
          }
        },
        "mvp_scope": {
          "core": ["Product display", "Shopping cart", "Simplified checkout", "Basic payment"],
          "extended": ["Account creation guidance", "Order tracking", "Personalized recommendations"],
          "excluded": ["Complex membership system", "Points system", "Multi-address management"]
        },
        "success_metrics": {
          "primary": ["Order completion rate", "Conversion rate"],
          "secondary": ["User satisfaction", "Average order value"],
          "guardrails": ["Refund rate", "Fraud rate"]
        }
      }
    ],
    "comparison_matrix": {
      "dimensions": [
        {
          "name": "User Value",
          "weight": 0.25,
          "description": "Degree of user need satisfaction"
        },
        {
          "name": "Implementation Complexity",
          "weight": 0.15,
          "description": "Technical implementation difficulty (reverse)",
          "reverse": true
        },
        {
          "name": "Innovation",
          "weight": 0.15,
          "description": "Novelty and differentiation of the solution"
        },
        {
          "name": "Risk",
          "weight": 0.15,
          "description": "Implementation and operational risk (reverse)",
          "reverse": true
        },
        {
          "name": "Strategic Alignment",
          "weight": 0.15,
          "description": "Consistency with company strategy"
        },
        {
          "name": "Scalability",
          "weight": 0.15,
          "description": "Future expansion flexibility"
        }
      ],
      "solutions": [
        {
          "solution_id": "solution_001",
          "title": "Allow Guest Checkout",
          "scores": {
            "User Value": 4,
            "Implementation Complexity": 5,
            "Innovation": 3,
            "Risk": 4,
            "Strategic Alignment": 4,
            "Scalability": 4
          },
          "weighted_score": 4.05,
          "pros": ["Directly lowers checkout barrier", "Simple implementation, controllable risk"],
          "cons": ["Moderate innovation", "May affect subsequent user operations"],
          "recommendation": "Strongly recommended",
          "ai_confidence": 0.85
        }
      ],
      "recommendations": {
        "overall_top": "solution_001",
        "by_dimension": {
          "User Value": "solution_003",
          "Implementation Complexity": "solution_001",
          "Innovation": "solution_007",
          "Risk": "solution_001",
          "Strategic Alignment": "solution_004",
          "Scalability": "solution_002"
        }
      }
    },
    "human_decision_package": {
      "summary": "Solution convergence summary",
      "ai_recommendation": "AI recommendation explanation",
      "decision_factors": ["Decision consideration factors"],
      "next_steps": ["Next action items"],
      "approval_required": true,
      "decision_maker": "Product Owner"
    }
  }
}
```

---

### Output Depth Grading

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | top ideas and evaluation matrix only | Core conclusions + minimum viable deliverable |
| standard | Full deliverables (default) | Complete output including all Steps |
| deep | Full workshop + concept validation + feasibility assessment + innovation roadmap | Full deliverables + extended analysis + deep simulation |

## Output

**Storage Path**: `output/pm-design/ideation-workshop/`
**Output Files**: ideation-workshop.json + ideation-workshop.md

### ideation-workshop.json Complete Data Structure

```json
{
  "hmw_ideas": {
    "hmw_statements": ["... (see Step 1 output structure)"],
    "summary": {}
  },
  "scamper_ideas": {
    "solutions": ["... (see Step 2A output structure)"],
    "clusters": [],
    "summary": {}
  },
  "inversion_ideas": {
    "inversion_analysis": ["... (see Step 2B output structure)"],
    "summary": {}
  },
  "converged_ideas": {
    "converged_solutions": ["... (see Step 3 output structure)"],
    "comparison_matrix": {},
    "human_decision_package": {}
  }
}
```

### ideation-workshop.md

Markdown format creative workshop report, including:
1. HMW problem reframing summary
2. SCAMPER solution list and clustering
3. Reverse thinking analysis summary
4. Converged solution comparison matrix
5. Human decision recommendations

---

## Output Validation Rules

| Field Path | Type | Required | Description |
|------------|------|----------|-------------|
| hmw_ideas | object | Yes | HMW output |
| hmw_ideas.hmw_statements | array | Yes | HMW statement list |
| hmw_ideas.hmw_statements[].id | string | Yes | HMW unique identifier |
| hmw_ideas.hmw_statements[].statement | string | Yes | HMW statement text |
| hmw_ideas.hmw_statements[].dimension | string | Yes | Belonging dimension (remove/reduce/accelerate/amplify/expand/rethink) |
| hmw_ideas.hmw_statements[].source_problem | string | Yes | Associated core problem |
| hmw_ideas.hmw_statements[].source_data | object | Yes | Source user research data |
| hmw_ideas.hmw_statements[].divergence_potential | integer | Yes | Divergence potential score (1-5) |
| hmw_ideas.hmw_statements[].quality_check | string | Yes | Quality check result (passed/failed) |
| hmw_ideas.hmw_statements[].quality_issues | array | Yes | Quality issue list |
| hmw_ideas.hmw_statements[].related_dimensions | array | Yes | Related other dimensions |
| hmw_ideas.summary | object | Yes | HMW statistical summary |
| scamper_ideas | object | Yes | SCAMPER output |
| scamper_ideas.solutions | array | Yes | Solution list, at least 10 |
| scamper_ideas.solutions[].id | string | Yes | Solution unique identifier |
| scamper_ideas.solutions[].source_hmw | object | Yes | Source HMW statement |
| scamper_ideas.solutions[].scamper_dimension | string | Yes | SCAMPER dimension |
| scamper_ideas.solutions[].solution | string | Yes | Solution title |
| scamper_ideas.solutions[].description | string | Yes | Detailed solution description |
| scamper_ideas.solutions[].innovation_score | integer | Yes | Innovation score (1-5) |
| scamper_ideas.solutions[].feasibility_score | integer | Yes | Feasibility score (1-5) |
| scamper_ideas.solutions[].impact_score | integer | Yes | Impact score (1-5) |
| scamper_ideas.solutions[].risk_score | integer | Yes | Risk score (1-5) |
| scamper_ideas.solutions[].key_assumption | string | Yes | Key assumption |
| scamper_ideas.solutions[].cluster | string | Yes | Belonging cluster ID |
| scamper_ideas.clusters | array | Yes | Cluster list |
| scamper_ideas.clusters[].cluster_id | string | Yes | Cluster ID |
| scamper_ideas.clusters[].cluster_name | string | Yes | Cluster name |
| scamper_ideas.clusters[].solution_ids | array | Yes | Solution ID list within cluster |
| scamper_ideas.summary | object | Yes | SCAMPER statistical summary |
| inversion_ideas | object | Yes | Reverse thinking output |
| inversion_ideas.inversion_analysis | array | Yes | Inversion analysis list, at least 10 |
| inversion_ideas.inversion_analysis[].id | string | Yes | Unique identifier |
| inversion_ideas.inversion_analysis[].failure_mode | string | Yes | Failure mode description |
| inversion_ideas.inversion_analysis[].severity | integer | Yes | Severity (1-5) |
| inversion_ideas.inversion_analysis[].likelihood | integer | Yes | Likelihood (1-5) |
| inversion_ideas.inversion_analysis[].risk_score | integer | Yes | Risk score (severity x likelihood) |
| inversion_ideas.inversion_analysis[].priority | string | Yes | Priority (critical/high/medium/low) |
| inversion_ideas.inversion_analysis[].success_condition | string | Yes | Success condition |
| inversion_ideas.inversion_analysis[].design_constraints | array | Yes | Design constraint array |
| inversion_ideas.inversion_analysis[].design_constraints[].constraint | string | Yes | Constraint description |
| inversion_ideas.inversion_analysis[].design_constraints[].category | string | Yes | Constraint category |
| inversion_ideas.inversion_analysis[].design_constraints[].verifiable | boolean | Yes | Whether verifiable |
| inversion_ideas.inversion_analysis[].design_constraints[].verification_method | string | Yes | Verification method |
| inversion_ideas.summary | object | Yes | Reverse thinking statistical summary |
| converged_ideas | object | Yes | Convergence output |
| converged_ideas.converged_solutions | array | Yes | Converged solution list, at least 3 |
| converged_ideas.converged_solutions[].id | string | Yes | Solution unique identifier |
| converged_ideas.converged_solutions[].title | string | Yes | Solution title |
| converged_ideas.converged_solutions[].detailed_description | object | Yes | Detailed solution description |
| converged_ideas.converged_solutions[].interaction_flow | object | Yes | Interaction flow design |
| converged_ideas.converged_solutions[].assumption | object | Yes | Key assumptions |
| converged_ideas.converged_solutions[].risk | object | Yes | Risk identification |
| converged_ideas.converged_solutions[].mvp_scope | object | Yes | MVP scope definition |
| converged_ideas.converged_solutions[].success_metrics | object | Yes | Success metrics |
| converged_ideas.comparison_matrix | object | Yes | Comparison matrix |
| converged_ideas.comparison_matrix.dimensions | array | Yes | Comparison dimension definitions, 6 dimensions |
| converged_ideas.comparison_matrix.solutions | array | Yes | Per-solution comparison data |
| converged_ideas.comparison_matrix.recommendations | object | Yes | AI recommendation results |
| converged_ideas.human_decision_package | object | Yes | Human decision package |
| converged_ideas.human_decision_package.approval_required | boolean | Yes | Whether human approval is required |

## Decision Rules

### Step 1 HMW Pass Conditions

1. **Quality check**: All HMWs must pass quality check
2. **Dimension coverage**: All 6 dimensions must have HMW coverage
3. **Data support**: Each HMW must have corresponding user research data support
4. **Scoring complete**: All HMWs must have completed divergence potential scoring

### Step 2 Parallel Divergence Pass Conditions

1. **SCAMPER solution count**: At least 10 candidate solutions generated
2. **SCAMPER dimension coverage**: All 7 SCAMPER dimensions must have solution coverage
3. **SCAMPER scoring completeness**: Each solution must have scores from 4 dimensions
4. **SCAMPER clustering completeness**: All solutions must belong to a cluster
5. **Reverse thinking failure paths**: 10-15 failure paths generated, covering 5 dimensions
6. **Reverse thinking constraint transformation**: Each success condition transformed into specific design constraints

### Step 3 Convergence Pass Conditions

1. **Solution filtering**: Exclude solutions with feasibility < 2, exclude solutions conflicting with Critical/High constraints
2. **Solution deepening**: Top 5 solutions deepened, each solution includes all 6 dimensions
3. **Comparison matrix**: 6 dimensions complete, scoring standards unified
4. **Human decision**: Final solution selection must be decided by humans

### Failure Handling

| Failure Scenario | Handling Flow |
|-----------------|---------------|
| HMW fails quality check | Identify quality issue type, targeted regeneration, re-quality check |
| HMW dimension coverage incomplete | Check HMW count per dimension, supplement generation for missing dimensions |
| HMW lacks data support | Link existing data or return to input stage to supplement user research data |
| SCAMPER solution count insufficient | Supplement generation for scarce dimensions, lower similarity threshold |
| SCAMPER dimension coverage incomplete | Return to Step 2A, supplement generation for missing dimensions |
| Reverse thinking failure paths insufficient | Check failure path classification completeness, supplement missing dimensions |
| Design constraints too abstract | Review constraint descriptions, transform into specific actionable descriptions and define verification methods |
| Converged solutions insufficiently deepened | Supplement missing deepening dimensions |
| Comparison matrix dimension missing | Supplement missing dimension scores; if scoring impossible, mark "Insufficient data" |

---

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] HMW dimension coverage (All 6 dimensions covered)
- [ ] HMW count (At least 6 HMW statements per dimension)

### P1 Checks (must pass for standard/deep)

- [ ] HMW data support (Each HMW has user research data support)
- [ ] HMW divergence potential scoring (All HMWs have completed divergence potential scoring)
- [ ] HMW broadness (No overly broad HMWs)
- [ ] HMW solution-presuming (No solution-presuming HMWs)
- [ ] SCAMPER dimension coverage (All 7 SCAMPER dimensions covered)
- [ ] SCAMPER solution count (At least 3 solutions per dimension, at least 10 total)
- [ ] SCAMPER deduplication (Solution deduplication complete, no obvious duplicates)
- [ ] SCAMPER clustering (All solutions have cluster attribution)
- [ ] Reverse thinking failure path count (10-15 failure paths generated)
- [ ] Reverse thinking failure path scoring (Each failure path has severity and likelihood scores)
- [ ] Reverse thinking success condition correspondence (Each failure path has a corresponding success condition)
- [ ] Reverse thinking design constraint actionability (Each design constraint is specific and actionable)
- [ ] Reverse thinking constraint verification method (Design constraints have clear verification methods)
- [ ] Converged solution filtering (Exclude solutions with feasibility < 2 and constraint conflicts)
- [ ] Converged solution deepening (Top 5 solutions deepened, including all 6 dimensions)
- [ ] Converged comparison matrix (6 dimensions complete, scoring standards unified)
- [ ] Unique IDs (All entries have unique IDs)
- [ ] Output format (Output format complies with specification)
- [ ] Statistical accuracy (Statistical data is accurate)

### P2 Checks (must pass for deep only)

- [ ] Extended analysis complete (deep simulation and roadmap generated)
- [ ] Decision records complete (key decisions have rationale and alternatives)

---

## Degradation Strategy

| Missing Upstream Input | Degradation Plan | Output Impact | Data Acquisition Instructions |
|------------------------|-----------------|---------------|----------|
| Problem Statement missing | User describes problem, generate HMW directly | Lacks structured Problem Statement, HMW may be less focused | Request user to describe the core problem and context, or upload problem-statement.json |
| User research data missing | User describes problem, generate HMW directly | Lacks user research data support, HMW may deviate from user needs | Request user to describe user needs and pain points, or upload persona.json / voice-analysis.json |
| Both Problem Statement and user research data missing | User describes problem, generate HMW directly | Overall confidence reduced, HMW may be too broad | Request user to describe problem and user context, or execute user-research and opportunity-definition first |
| Current solution description missing | Generate solutions directly based on HMW, no improvement baseline | Lacks current solution reference, substitute/modify dimension solutions may be less precise | Request user to describe current solution and its limitations |
| Competitor solution data missing | Skip competitor borrowing, generate based on HMW and current solution | Lacks competitor solution reference, adapt dimension solutions may be less rich | Request user to provide competitor names and their solutions, or upload competitor-analysis.json |
| All upstream files missing | Prompt user to execute prior stages first, or generate directly based on user verbal description | Output is only basic HMW list and solution framework | Request user to describe problem, users, and current solutions, or execute pm-01-discovery skills first |

## Upstream Change Response

### Upstream Change Impact

| Upstream Change | Impact Scope | Response Strategy |
|-----------------|-------------|-------------------|
| Problem Statement change | HMW statement focus direction | Mark affected HMWs, suggest human confirmation on whether to regenerate |
| User research data update | HMW data support, source_data linkage | Mark affected HMWs, suggest human confirmation on whether to supplement data linkage |
| Current solution change | SCAMPER substitute/modify dimension solutions | Mark affected dimension solutions, suggest human confirmation on whether to regenerate |
| Competitor solution data update | SCAMPER adapt dimension solutions | Mark affected adapt solutions, suggest human confirmation on whether to supplement |
| Product context change | Reverse thinking failure path priorities, convergence strategic alignment scores | Mark affected scoring dimensions, suggest human confirmation on whether to re-score |

### Downstream Notification Mechanism

| Change Type | Notification Scope | Notification Method |
|------------|-------------------|---------------------|
| Converged solution selection change | design-prd, validation-assumption-map | Mark solution change, trigger PRD and assumption map updates |
| Converged solution deepening content change | design-prd | Mark deepening content change, trigger PRD feature specification update |
| Comparison matrix scoring change | design-prd | Mark scoring change, trigger PRD priority adjustment |
| MVP scope change | validation-mvp | Mark MVP scope change, trigger MVP definition update |
