---
name: ext-interaction-design
description: Design and implement microinteractions, motion design, transitions, and user feedback patterns. Use when adding polish to UI interactions, implementing loading states, or creating delightful user experiences. Provides structured interaction patterns that integrate with design tokens and visual direction.
---

# Interaction Design

Create engaging, intuitive interactions through motion, feedback, and thoughtful state transitions that enhance usability and delight users.

## Register Awareness

| Register | Motion Philosophy | Typical Patterns |
|----------|------------------|-----------------|
| brand | Expressive, choreographed, memorable | Dramatic page transitions, staggered reveals, custom spring physics |
| product | Functional, efficient, trustworthy | Subtle feedback, smooth state transitions, consistent timing |

**Register determination**: Follow the same rules as ext-impeccable (see extensions/README.md → Register 感知). Default: product.

## Input Contract

When called by ui-orchestrator (on behalf of page-builder), accept the following structured input:

| Input Field | Type | Required | Description |
|-------------|------|----------|-------------|
| interaction_needs | string | yes | Component interaction requirements (drag/gesture/complex state transitions) |
| register | string | yes | "brand" or "product" |
| component_state_machine | object | no | Component states and transitions |
| visual_direction | object | no | Current visual_direction (tension_level, mood_keywords, aesthetic_direction) |
| design_tokens | object | no | Animation tokens (duration-instant/fast/normal/slow, easing-default/decelerate/accelerate) |
| target_framework | string | no | React / Vue / Svelte / HTML |
| express_design_anchor | object | no | Lightweight design anchor for express mode (register, color_direction, typography_direction, layout_direction, design_focus, visual_bans). Passed by ui-orchestrator when mode=express. Must be consumed as design direction constraints: layout_direction informs interaction pattern selection, visual_bans must be respected |

## Output Contract

When called by ui-orchestrator, MUST return structured output:

```json
{
  "type": "object",
  "required": ["patterns", "animation_tokens", "accessibility_adaptation"],
  "properties": {
    "patterns": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {"type": "string", "description": "Pattern name (e.g., 'staggered-fade-in', 'drag-to-dismiss')"},
          "trigger": {"type": "string", "description": "When to apply (e.g., 'page-load', 'state-change', 'user-drag')"},
          "implementation": {"type": "string", "description": "Code snippet using target framework and design tokens"},
          "token_references": {"type": "array", "items": {"type": "string"}, "description": "Design tokens used in this pattern"}
        }
      }
    },
    "animation_tokens": {
      "type": "object",
      "description": "Recommended animation token values if not already defined in design tokens",
      "properties": {
        "duration-instant": {"type": "string", "default": "100ms"},
        "duration-fast": {"type": "string", "default": "200ms"},
        "duration-normal": {"type": "string", "default": "300ms"},
        "duration-slow": {"type": "string", "default": "500ms"},
        "easing-default": {"type": "string", "default": "cubic-bezier(0.16, 1, 0.3, 1)"},
        "easing-decelerate": {"type": "string", "default": "cubic-bezier(0.16, 1, 0.3, 1)"},
        "easing-accelerate": {"type": "string", "default": "cubic-bezier(0.55, 0, 1, 0.45)"},
        "easing-spring": {"type": "string", "default": "cubic-bezier(0.34, 1.56, 0.64, 1)"}
      }
    },
    "accessibility_adaptation": {
      "type": "object",
      "properties": {
        "reduced_motion_strategy": {"type": "string", "description": "How to adapt when prefers-reduced-motion is active"},
        "focus_management": {"type": "string", "description": "Focus handling during transitions"}
      }
    }
  }
}
```

## Consumer Mapping

| 输出字段 | 消费方 Skill | 消费路径 | 合并规则 |
|---------|-------------|---------|---------|
| patterns[].implementation | page-builder | 组件交互代码 | 直接插入组件代码中 |
| animation_tokens | page-builder | design_tokens.animation | 合并到现有design tokens |
| accessibility_adaptation | page-builder | 组件无障碍属性 | 追加ARIA属性和键盘导航 |

## Verification Criteria

| Criterion | Check |
|-----------|-------|
| Token-driven | All durations and easings reference design tokens, no hardcoded values |
| Framework-aligned | Implementation uses correct framework APIs (React: Motion/Framer Motion; Vue: Vue transitions; Svelte: transition directives) |
| Accessibility | reduced_motion_strategy is defined and practical |
| Register-aligned | Motion ambition matches register (brand=expressive, product=functional) |
| No layout animation | Implementation does not animate CSS layout properties (width/height/top/left) |

## Degradation Strategy

| Scenario | Behavior | 编排器处理 |
|----------|----------|-----------|
| ext-interaction-design not deployed | Skip, annotate "交互动效待 ext-interaction-design 支持", use default animation tokens | 可选增强类，不阻断下游 |
| ext-interaction-design call fails | Apply default animation token values and basic CSS transitions, annotate "交互动效使用内置降级规则" | 可选增强类，不阻断下游 |
| Output validation fails | Use partial output (valid patterns only), annotate skipped patterns | 可选增强类，不阻断下游 |

## When to Use This Skill

- Adding microinteractions to enhance user feedback
- Implementing smooth page and component transitions
- Designing loading states and skeleton screens
- Creating gesture-based interactions
- Building notification and toast systems
- Implementing drag-and-drop interfaces
- Adding scroll-triggered animations
- Designing hover and focus states

## Core Principles

### 1. Purposeful Motion

Motion should communicate, not decorate:

- **Feedback**: Confirm user actions occurred
- **Orientation**: Show where elements come from/go to
- **Focus**: Direct attention to important changes
- **Continuity**: Maintain context during transitions

### 2. Timing Guidelines

| Duration  | Use Case                                  | Token |
| --------- | ----------------------------------------- | ----- |
| 100-150ms | Micro-feedback (hovers, clicks)           | duration-instant |
| 200-300ms | Small transitions (toggles, dropdowns)    | duration-fast |
| 300-500ms | Medium transitions (modals, page changes) | duration-normal |
| 500ms+    | Complex choreographed animations          | duration-slow |

### 3. Easing Functions

Use design token references, not hardcoded values:

```css
--easing-default: cubic-bezier(0.16, 1, 0.3, 1);     /* Decelerate - entering */
--easing-accelerate: cubic-bezier(0.55, 0, 1, 0.45); /* Accelerate - exiting */
--easing-spring: cubic-bezier(0.34, 1.56, 0.64, 1);  /* Overshoot - playful */
```

## Interaction Patterns

### 1. Loading States

**Skeleton Screens**: Preserve layout while loading

```tsx
function CardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-48 bg-gray-200 rounded-lg" />
      <div className="mt-4 h-4 bg-gray-200 rounded w-3/4" />
      <div className="mt-2 h-4 bg-gray-200 rounded w-1/2" />
    </div>
  );
}
```

**Progress Indicators**: Show determinate progress using token-driven animation

```tsx
function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-neutral-200)' }}>
      <motion.div
        className="h-full"
        style={{ background: 'var(--color-brand-500)' }}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 'var(--duration-normal)', ease: 'var(--easing-decelerate)' }}
      />
    </div>
  );
}
```

### 2. State Transitions

**Toggle with smooth transition**:

```tsx
function Toggle({ checked, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative w-12 h-6 rounded-full"
      style={{
        background: checked ? 'var(--color-brand-500)' : 'var(--color-neutral-300)',
        transition: `background var(--duration-fast) var(--easing-default)`,
      }}
    >
      <motion.span
        className="absolute top-1 left-1 w-4 h-4 rounded-full shadow"
        style={{ background: 'var(--color-surface)' }}
        animate={{ x: checked ? 24 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}
```

### 3. Page Transitions

**Framer Motion layout animations**:

```tsx
import { AnimatePresence, motion } from "framer-motion";

function PageTransition({ children, key }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 300, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

### 4. Feedback Patterns

**Ripple effect on click**:

```tsx
function RippleButton({ children, onClick }) {
  const [ripples, setRipples] = useState([]);

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ripple = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      id: Date.now(),
    };
    setRipples((prev) => [...prev, ripple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
    }, 600);
    onClick?.(e);
  };

  return (
    <button onClick={handleClick} className="relative overflow-hidden">
      {children}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full animate-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            background: 'var(--color-surface-alpha-30)',
          }}
        />
      ))}
    </button>
  );
}
```

### 5. Gesture Interactions

**Swipe to dismiss**:

```tsx
function SwipeCard({ children, onDismiss }) {
  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(_, info) => {
        if (Math.abs(info.offset.x) > 100) {
          onDismiss();
        }
      }}
      className="cursor-grab active:cursor-grabbing"
    >
      {children}
    </motion.div>
  );
}
```

## CSS Animation Patterns

### Keyframe Animations

```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn var(--duration-fast) var(--easing-default);
}
```

### CSS Transitions

```css
.card {
  transition:
    transform var(--duration-fast) var(--easing-default),
    box-shadow var(--duration-fast) var(--easing-default);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px var(--shadow-md);
}
```

## Accessibility Considerations

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

```tsx
function AnimatedComponent() {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  return (
    <motion.div
      animate={{ opacity: 1 }}
      transition={{ duration: prefersReducedMotion ? 0 : 300 }}
    />
  );
}
```

## Best Practices

1. **Performance First**: Use `transform` and `opacity` for smooth 60fps
2. **Reduce Motion Support**: Always respect `prefers-reduced-motion`
3. **Token-Driven Timing**: Use animation tokens, never hardcode durations
4. **Natural Physics**: Prefer spring animations over linear for brand register
5. **Interruptible**: Allow users to cancel long animations
6. **Progressive Enhancement**: Work without JS animations
7. **Test on Devices**: Performance varies significantly

## Common Issues

- **Janky Animations**: Avoid animating `width`, `height`, `top`, `left`
- **Over-animation**: Too much motion causes fatigue
- **Blocking Interactions**: Never prevent user input during animations
- **Memory Leaks**: Clean up animation listeners on unmount
- **Flash of Content**: Use `will-change` sparingly for optimization
- **Hardcoded Values**: Always use design tokens for durations and easings
