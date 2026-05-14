---
name: validation-mvp
description: 当需要界定MVP功能范围时使用。MVP范围自动界定工具，基于假设地图和资源约束，智能识别Must Have、MUST NOT和Nice to Have功能，并评估MVP规模占比。关键词：MVP范围、最小可行产品、功能优先级、资源约束、最小产品、核心功能。
metadata:
  module: "产品构思与设计"
  sub-module: "方案验证"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["互联网", "软件", "通用"]
  trigger_examples:
    - "MVP应该包含哪些功能"
    - "最小产品怎么做"
    - "哪些功能可以先不做"
  interaction_mode: "ai_suggest_human_approve"
---

# MVP范围自动界定

## 核心原则

1. **MVP验证的是假设不是方案**——MVP的目标是学习而非交付，用最小成本获取最大置信度
2. **Must Have是MVP的底线**——Must Have功能不可裁剪，Nice to Have功能全部可裁剪
3. **2周是MVP的时间红线**——超过2周的MVP不是MVP，是完整产品
4. **验证结果只有三种**——验证通过/验证失败/需更多数据，不允许模糊结论

### 基本信息

| 属性 | 值 |
|------|-----|
| Pipeline ID | 13 |
| 名称 | MVP范围自动界定 |
| 执行模式 | 🤖→👤 AI建议，人类审批 |
| 输入 | 方案设计 + 假设地图 + 资源约束 |

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 方案设计 | JSON | 是 | output/pm-design/design-prototype / output/pm-design/design-userflow | 完整功能列表及描述 |
| 假设地图 | JSON | 是 | output/pm-design/validation-assumption-map/assumption-map.json | Pipeline 12输出的假设地图 |
| 资源约束 | JSON | ○ | 用户提供 | 时间、人力、预算限制 |

### 输入格式
```json
{
  "solution_design": {
    "features": [
      {
        "id": "F001",
        "name": "功能名称",
        "description": "功能描述",
        "effort_estimate": "工作量估算"
      }
    ]
  },
  "assumption_map": [...],
  "resource_constraints": {
    "timeline_weeks": 8,
    "team_size": 4,
    "budget": "预算限制"
  }
}
```

## 执行步骤

### Step 1: Must Have 识别

**定义**: 与最大风险假设直接相关的功能 = 必须包含

**判断逻辑**:
1. 找出所有 is_max_risk = true 的假设
2. 识别与这些假设关联的功能
3. 标记为 Must Have

**输出格式**:
```json
{
  "must_have": [
    {
      "feature": "功能名称",
      "linked_assumption": "关联的最大风险假设",
      "effort_estimate": "工作量估算",
      "rationale": "必须包含的理由"
    }
  ]
}
```

### Step 2: Must Not 识别

**定义**: 干扰核心假设验证的功能 = 排除

**排除标准**:

| 排除类型 | 说明 | 示例 |
|----------|------|------|
| 过于丰富 | 超出MVP验证需要的完整功能 | MVP验证需要列表，却做完整搜索+筛选+排序 |
| 过于精美 | 高保真设计非MVP必要 | 投入大量时间在交互动效 |
| 过多配置 | 复杂配置项非验证必要 | 多个维度的自定义设置 |

**输出格式**:
```json
{
  "must_not": [
    {
      "feature": "功能名称",
      "rationale": "排除的理由（干扰核心假设验证）"
    }
  ]
}
```

### Step 3: Nice to Have 归类

**定义**: 既非Must Have也非Must Not的功能

**优先级规则**:
1. 关联高风险假设但非直接相关的功能 → P1
2. 关联中风险假设的功能 → P2
3. 关联低风险假设的功能 → P3

**输出格式**:
```json
{
  "nice_to_have": [
    {
      "feature": "功能名称",
      "priority": "P1/P2/P3",
      "target_version": "v2.0/v3.0"
    }
  ]
}
```

### Step 4: MVP规模评估

**计算公式**:

```
MVP占比 = Must Have工作量 / 完整方案工作量 × 100%
```

**工作量单位**: 人天/人周/story point（根据团队习惯）

**评估标准**:

| MVP占比 | 评估结果 | 建议 |
|---------|----------|------|
| < 40% | ✅ 理想 | 可启动MVP开发 |
| 40-60% | ⚠️ 可接受 | 审视Nice to Have是否可精简 |
| > 60% | 🚨 需评审 | 升级人类判断，确认是否调整 |

## 输出

**存储路径**：`output/pm-design/validation-mvp/`
**输出文件**：mvp_definition.json

```json
{
  "mvp_scope": {
    "must_have": [
      {
        "feature": "功能名称",
        "linked_assumption": "关联假设ID",
        "effort_estimate": 8,
        "rationale": "必须包含的理由"
      }
    ],
    "must_not": [
      {
        "feature": "功能名称",
        "rationale": "排除理由"
      }
    ],
    "nice_to_have": [
      {
        "feature": "功能名称",
        "priority": "P1",
        "target_version": "v2.0"
      }
    ],
    "effort_summary": {
      "mvp_total": 24,
      "full_solution_total": 60,
      "mvp_ratio": "40%"
    }
  },
  "approval_status": "pending|approved|needs_discussion",
  "recommendation": "AI建议说明"
}
```

**输出校验规则**：详见下方输出校验规则章节

## 决策规则

| 规则 | 条件 | 动作 |
|------|------|------|
| 人工审批触发 | MVP占比 > 60% | 升级人类判断 |
| 审批触发 | Must Have无假设关联 | 需补充说明 |
| 审批触发 | Must Not理由不充分 | 需补充排除依据 |

## 质量检查

| 检查项 | 通过条件 | 检查结果 |
|--------|----------|----------|
| 假设关联 | Must Have功能都有假设关联 | pass/fail |
| 排除理由 | Must Not功能都有充分理由 | pass/fail |
| 占比计算 | MVP占比已计算 | pass/fail |
| 优先级完整 | Nice to Have都有优先级 | pass/fail |

---

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 假设地图缺失 | 用户描述关键假设，界定MVP | 缺乏结构化假设数据，MVP范围可能不够精准 |
| 方案设计数据缺失 | 用户描述方案，界定MVP | 缺乏方案数据，功能裁剪可能不够合理 |
| 资源约束数据缺失 | 用户描述资源约束，界定MVP | 缺乏资源约束数据，时间规划可能不够合理 |
| 假设地图+方案设计+资源约束均缺失 | 用户描述假设和方案，界定MVP | 整体置信度降低，MVP范围可能不够完整 |
| 所有上游文件均缺失 | 提示用户先执行前序阶段，或基于用户描述界定MVP | 输出仅为基本MVP框架 |

## 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| mvp_scope | object | 是 | MVP范围定义 |
| mvp_scope.core_hypothesis | array | 是 | 核心假设列表 |
| mvp_scope.must_have | array | 是 | Must Have功能列表 |
| mvp_scope.nice_to_have | array | 是 | Nice to Have功能列表 |
| mvp_scope.cut_features | array | 是 | 裁剪功能列表 |
| mvp_scope.timeline | object | 是 | 时间规划 |
| mvp_scope.timeline.total_weeks | number | 是 | 总周数（≤2） |
| mvp_scope.timeline.milestones | array | 是 | 里程碑列表 |
| mvp_scope.resource_estimate | object | 是 | 资源估算 |
| mvp_scope.success_criteria | array | 是 | 成功标准 |
| mvp_scope.risk_mitigation | array | 是 | 风险缓解措施 |
| mvp_scope.go_no_go | object | 是 | Go/No-Go决策框架 |
| mvp_scope.go_no_go.metrics | array | 是 | 决策指标 |
| mvp_scope.go_no_go.thresholds | object | 是 | 阈值定义 |

## 上游变更响应

### 上游变更影响

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| 假设地图变更（假设增删/风险评分变更） | 核心假设、Must Have功能 | 标注受影响的假设和功能，建议人类确认是否重新界定MVP |
| 方案设计变更 | 功能列表、裁剪决策 | 标注受影响的功能，建议人类确认是否调整MVP范围 |
| 资源约束变更 | 时间规划、资源估算 | 标注受影响的时间线，建议人类确认是否调整MVP范围 |
| 实验结果更新 | 核心假设验证状态 | 标注受影响的假设，建议人类确认是否调整MVP策略 |

### 下游通知机制

| MVP范围变更类型 | 通知范围 | 通知方式 |
|----------------|----------|----------|
| Must Have功能增删 | validation-experiment、validation-usability | 标记功能变更，触发实验设计和可用性测试更新 |
| 时间规划变更 | validation-experiment | 标记时间变更，触发实验周期调整 |
| 成功标准变更 | validation-experiment | 标记标准变更，触发实验指标更新 |
| Go/No-Go决策变更 | 所有下游Skill | 标记决策变更，触发全流程更新 |

---

## 使用示例

**假设地图中的最大风险假设**:
- A001: 用户认为推荐内容与兴趣匹配（风险分数: 20）

**方案设计中的功能**:
- F001: 智能推荐算法
- F002: 推荐结果展示
- F003: 收藏功能
- F004: 分享功能
- F005: 高保真动效

**AI分析**:
```
Must Have:
- F001 智能推荐算法（直接验证A001）
- F002 推荐结果展示（验证A001必需）

Must Not:
- F005 高保真动效（干扰核心验证，非MVP必要）

Nice to Have:
- F003 收藏功能（P2，v2.0）
- F004 分享功能（P3，v3.0）

MVP占比: 40% ✅ 理想
```
