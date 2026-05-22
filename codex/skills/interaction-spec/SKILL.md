---
name: interaction-spec
description: "Use when translating user flows and prototype designs into interaction design specifications. Generates interaction spec documents including state machines, animation specifications, gesture operations, feedback mechanisms, accessibility interactions, and exception state handling. Keywords: interaction design specification, interaction spec, state machine, animation specification, gesture operations, interaction feedback, accessibility interaction, motion design specification."
metadata:
  module: "Product Ideation & Design"
  sub-module: "Product Design & Prototyping"
  type: "pipeline"
  version: "3.0"
  domain_tags: ["Internet", "Software", "General"]
  trigger_examples:
    - "How to write interaction specifications"
    - "Help me write an interaction design document"
    - "How to define animations and gestures"
  interaction_mode: "ai_suggest_human_approve"
execution_depth:
  default: standard
  quick_description: "Output interaction specifications and state design"
  deep_description: "Full spec + state machine full coverage + motion design specs + accessibility interaction design"
---

# Interaction Design Specification Document Generation

## Core Principles

**Interaction specifications are the constitution of user experience**

Interaction design specifications ensure that every interaction behavior in the product has a consistent, predictable, and accessible experience. Specifications are not about limiting creativity, but about guaranteeing the baseline quality of foundational experiences, allowing designers to focus on innovation rather than repeatedly defining basic interactions.

## Interaction Mode

AI->Human AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|------------|------|----------|--------|-------------|
| User Flow | JSON | Yes | design-userflow | User flow diagrams, state transitions, decision nodes |
| Prototype Specification | JSON | Yes | design-prototype | Prototype design, interaction annotations, component specifications |
| Design Handoff Document | markdown | No | design-handoff-spec | Design tokens, component specifications, responsive breakpoints |
| Brand Guidelines | text | No | User input | Brand tone, animation style preferences |

### Degradation Strategy

| Missing Upstream Input | Degradation Plan | Output Impact | Data Acquisition Instructions |
|------------------------|-----------------|---------------|-------------------------------|
| User flow missing | Derive interaction flow from prototype | Flow pending confirmation, interaction state machine may be less complete | Request user to describe user tasks and flow, or upload design-userflow output file |
| Prototype specification missing | Generate interaction spec framework based on user flow | Pending prototype validation, component interaction specs may be less precise | Request user to describe page layouts and components, or upload design-prototype output file |
| Design handoff document missing | Interaction spec uses independent numbering | Subsequent alignment with handoff document needed, token references may be inconsistent | Request user to provide design tokens and component specs, or upload design-handoff-spec output file |
| Brand guidelines missing | Adopt neutral interaction style | Pending brand confirmation, animation style may need adjustment | Request user to provide brand tone and animation style preferences |

## Execution Steps

### Step 1: Interaction State Machine Definition [Core]

Define interaction state machines for each core component and page:

1. **State Enumeration**: Default / Hover / Active / Focus / Disabled / Loading / Error / Empty / Success
2. **State Transition Table**: Trigger conditions, transition actions, transition intents
3. **State Priority**: Priority rules when multiple states overlap (e.g., Disabled + Error)
4. **State Persistence**: Rules for transient vs. persistent state retention

### Step 2: Animation and Transition Intents [Core]

Define the **intents** of animations and transitions in the product; specific implementation parameters are determined by UI Skill (ext-interaction-design + page-builder) based on visual_direction:

1. **Transition Intents** (does not define specific easing functions or durations):
   - General transitions: Should feel natural and smooth
   - Enter animations: Should have a deceleration feel, elements approaching from a distance
   - Exit animations: Should have an acceleration feel, elements moving away into the distance
   - Frequent toggles: Should be crisp and decisive, no lingering
2. **Animation Intent Standards** (does not define specific millisecond values):
   - Micro-interactions (button feedback, toggle switches): Should be immediately perceptible
   - Small transitions (dropdown expand, lightweight feedback): Should complete quickly
   - Large transitions (page switches, modals): Should have rhythm
   - Complex animations (data visualization, 3D transforms): Should have narrative quality
3. **Animation Performance**: Only use transform and opacity; avoid triggering layout and paint
4. **Reduced Motion**: `prefers-reduced-motion` adaptation rules

### Step 3: Gesture and Operation Intents [Core]

Define **intents and constraints** for gesture operations across platforms; specific thresholds are determined by UI Skill based on platform specifications and visual_direction:

1. **Tap/Press**:
   - Touch targets should meet platform accessibility standards (iOS/Android/Web each have specifications)
   - Long-press operations need haptic or visual feedback
   - Double-tap operations need a reasonable time window
2. **Swipe/Drag**:
   - Swipe operations should have reasonable trigger sensitivity (avoid accidental triggers)
   - Swipes should have inertia and deceleration effects
   - Edge swipes must preserve system gestures
3. **Pinch/Rotate**:
   - Zoom range should have reasonable upper and lower limits
   - Rotation operations should have snap assist
4. **Keyboard Operations**:
   - Tab order and focus management rules
   - Keyboard shortcut mapping table
   - Enter/Space activation rules

### Step 4: Feedback Mechanism Specification [Core]

Define feedback standards for user operations:

1. **Immediate Feedback**:
   - After user operation, immediately perceive that the system has received it
   - Button pressed state, link hover state
   - Input field focus state, toggle switch state
2. **Progress Feedback**:
   - Long operations need to provide progress awareness
   - Loading states need visual placeholders to avoid page jumps
   - Quantifiable operations like upload/download need progress indicators
3. **Result Feedback** (after operation completion):
   - Success: Operation results must be clearly fed back to users; success state must be distinguishable
   - Warning: Must attract user attention but not block operations; users must be able to actively confirm or wait for auto-dismissal
   - Error: Error state must be clearly distinguishable from normal state; users must be able to quickly identify and understand the error cause
   - Information: Must provide supplementary explanation without interfering with the main flow
4. **No Feedback Scenarios**: Explicitly list operations that don't need feedback and the reasons

### Step 5: Exception State Interactions [Core]

Define interaction handling for exception scenarios:

1. **Network Error**: Must clearly inform users that the network is unavailable, provide retry opportunity and locally available content
2. **Empty Data**: Must avoid blank pages, provide ways to guide users to generate content
3. **Insufficient Permissions**: Must explain permission restriction reasons, provide ways to apply or alternative operations
4. **Data Overflow**: Must reasonably display truncated content, provide ways to view complete content
5. **Concurrent Conflicts**: Must detect and inform of conflicts, provide user decision paths

### Step 6: Accessibility Interaction Specification [Core]

Ensure interactions meet accessibility standards:

1. **WCAG 2.1 AA Compliance**:
   - Perceivable: Text alternatives, time-based media alternatives, adaptability, distinguishability
   - Operable: Keyboard operable, sufficient time, seizure safety, navigability
   - Understandable: Readability, predictability, input assistance
   - Robust: Compatible with assistive technologies
2. **Focus Management**: Focus trap (Modal), focus restoration (after closing Modal), focus order
3. **ARIA Labels**: Role (role), state (aria-state), property (aria-property) usage specifications
4. **Screen Readers**: Read-aloud text and read-aloud order for key interactions

### Step 7: Report Assembly [Core]

Assemble the above content into a complete interaction design specification document.

### Output Depth Grading

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | interaction specifications and state design | Core conclusions + minimum viable deliverable |
| standard | Full deliverables (default) | Complete output including all Steps |
| deep | Full spec + state machine full coverage + motion design specs + accessibility interaction design | Full deliverables + extended analysis + deep simulation |

## Output

### Output Files

| File | Path | Description |
|------|------|-------------|
| Interaction Design Specification | `output/pm-design/interaction-spec/interaction-spec.md` | Human-readable complete specification |
| Structured Data | `output/pm-design/interaction-spec/interaction-spec.json` | Machine-consumable structured data |

### Markdown Report Structure

```markdown
# Interaction Design Specification: <Product Name>

**Output Validation Rules**: See Output Validation Rules section below

## 1. Interaction State Machine
- State enumeration and definitions
- State transition table
- State priority rules
- State persistence rules

## 2. Animation and Transition Intents
- Transition intents (natural and smooth/deceleration feel/acceleration feel/crisp and decisive)
- Animation duration intents (immediately perceptible/quickly complete/rhythmic/narrative)
- Performance constraints
- Reduced motion adaptation

## 3. Gesture and Operation Intents
- Tap/press intents
- Swipe/drag intents
- Pinch/rotate intents
- Keyboard operation specifications

## 4. Feedback Mechanism Specification
- Immediate feedback
- Progress feedback
- Result feedback (success/warning/error/information)
- No feedback scenarios

## 5. Exception State Interactions
- Network error
- Empty data
- Insufficient permissions
- Data overflow
- Concurrent conflicts

## 6. Accessibility Interaction Specification
- WCAG 2.1 AA compliance check
- Focus management rules
- ARIA label specifications
- Screen reader adaptation

## 7. Interaction Specification Index
- Component x State cross-reference table
- Animation x Scenario cross-reference table
```

### JSON Structure

```json
{
  "product_name": "",
  "report_date": "",
  "state_machines": {
    "states": [],
    "transitions": [
      {
        "from": "",
        "to": "",
        "trigger": "",
        "transition_intent": "",
        "completeness_check": ""
      }
    ],
    "priority_rules": [],
    "persistence_rules": []
  },
  "animation": {
    "transition_intents": [],
    "duration_intents": [],
    "performance_constraints": [],
    "reduced_motion": {}
  },
  "gestures": {
    "tap_press_intents": {},
    "swipe_drag_intents": {},
    "pinch_rotate_intents": {},
    "keyboard": {}
  },
  "feedback": {
    "immediate": [
      {
        "trigger": "",
        "intent": "",
        "completeness_check": ""
      }
    ],
    "progress": [
      {
        "trigger": "",
        "intent": "",
        "completeness_check": ""
      }
    ],
    "result": [
      {
        "trigger": "",
        "intent": "",
        "completeness_check": ""
      }
    ],
    "no_feedback_scenarios": []
  },
  "error_states": {
    "network_error": {
      "intent": "",
      "completeness_check": ""
    },
    "empty_state": {
      "intent": "",
      "completeness_check": ""
    },
    "permission_denied": {
      "intent": "",
      "completeness_check": ""
    },
    "data_overflow": {
      "intent": "",
      "completeness_check": ""
    },
    "concurrent_conflict": {
      "intent": "",
      "completeness_check": ""
    }
  },
  "accessibility": {
    "wcag_compliance": [],
    "focus_management": [],
    "aria_specifications": [],
    "screen_reader": []
  }
}
```

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] State machine complete (All 8 basic states covered)
- [ ] Animation performance compliant (Only uses transform/opacity)

### P1 Checks (must pass for standard/deep)

- [ ] Accessibility compliant (WCAG 2.1 AA fully covered)
- [ ] Feedback fully covered (Every user operation has corresponding feedback)

### P2 Checks (must pass for deep only)

- [ ] Extended analysis complete (deep simulation and roadmap generated)
- [ ] Decision records complete (key decisions have rationale and alternatives)

## Output Validation Rules

| Field Path | Type | Required | Description |
|------------|------|----------|-------------|
| product_name | string | Yes | Product name |
| report_date | string | Yes | Report date (ISO8601) |
| state_machines | object | Yes | Interaction state machine |
| state_machines.states | array | Yes | State enumeration, at least 8 |
| state_machines.transitions | array | Yes | State transition table, each item includes from/to/trigger/transition_intent/completeness_check |
| state_machines.priority_rules | array | Yes | State priority rules |
| animation | object | Yes | Animation and transition intents |
| animation.transition_intents | array | Yes | Transition intent list |
| animation.duration_intents | array | Yes | Animation duration intent list |
| gestures | object | Yes | Gesture and operation intents |
| feedback | object | Yes | Feedback mechanism specification |
| feedback.immediate | array | Yes | Immediate feedback list, each item includes trigger/intent/completeness_check |
| feedback.result | array | Yes | Result feedback list, each item includes trigger/intent/completeness_check |
| error_states | object | Yes | Exception state interactions |
| accessibility | object | Yes | Accessibility interaction specification |
| accessibility.wcag_compliance | array | Yes | WCAG compliance check items |

## Decision Rules

- When both user flow and prototype specification are complete, generate full interaction specification (state machine + animation + gestures + feedback + accessibility)
- When only user flow is available, generate interaction specification framework; animation and gesture specifications marked "Pending prototype validation"
- When platform differences exist (iOS/Android/Web), define platform-specific interaction specifications separately
- Decision points requiring human confirmation: Animation style preferences, accessibility compliance level (AA/AAA), gesture conflict resolution strategy

## Degradation Strategy

- When user flow is missing: Derive interaction flow from prototype; state machine may be less complete
- When prototype specification is missing: Generate interaction specification framework based on user flow; component interaction specs pending prototype validation
- When design handoff document is missing: Interaction specification uses independent numbering; subsequent alignment with handoff document needed
- When data is unavailable: Generate generic interaction specification template; all specific values marked "Pending product confirmation"

## Upstream Change Response

### Upstream Change Impact

| Upstream Change | Impact Scope | Response Strategy |
|-----------------|-------------|-------------------|
| User flow change (path/branch modification) | Interaction state machine, feedback mechanisms | Mark affected state transitions, suggest human confirmation on whether to update interaction specification |
| Prototype specification change (component/interaction modification) | Gesture operations, feedback mechanisms, exception states | Mark affected interaction definitions, suggest human confirmation on whether to update |
| Design handoff document change (token/component adjustment) | Token references in animation specifications | Mark affected token references, suggest human confirmation on whether to update |
| Brand guidelines change | Animation style, easing functions | Mark affected animation definitions, suggest human confirmation on whether to adjust style |

### Downstream Notification Mechanism

| Interaction Specification Change Type | Notification Scope | Notification Method |
|--------------------------------------|-------------------|---------------------|
| State machine change | design-handoff-spec | Mark state machine change, trigger handoff document update |
| Animation specification change | design-handoff-spec | Mark animation change, trigger handoff document interaction rule update |
| Gesture specification change | design-handoff-spec | Mark gesture change, trigger handoff document update |
| Accessibility specification change | design-handoff-spec | Mark accessibility change, trigger handoff document update |

## Alignment with prd.json Data Contract

| This Skill's Output Field | prd.json Corresponding Field | Alignment Rule |
|--------------------------|----------------------------|----------------|
| state_machines[].name | prd.json.pages[].name | State machine name corresponds to PRD page name |
| state_machines[].states[] | prd.json.pages[].states[] | State machine states must cover the 5 special states defined in PRD (empty/loading/error/partial/permission) |
| state_machines[].states[].triggers | prd.json.pages[].states[].triggers | State trigger conditions must be consistent with PRD definitions |
