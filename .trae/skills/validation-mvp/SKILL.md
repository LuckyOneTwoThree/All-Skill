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

### Step 1: 核心假设提取与 Must Have 识别

**定义**: 与最大风险假设直接相关的功能 = 必须包含

**判断逻辑**:
1. 找出所有 is_max_risk = true 的假设
2. 提取核心假设列表
3. 识别与这些假设关联的功能
4. 标记为 Must Have

**输出格式**:
```json
{
  "core_hypothesis": [
    {
      "id": "A001",
      "description": "假设描述",
      "risk_score": 20
    }
  ],
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

### Step 2: 裁剪功能识别

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
  "cut_features": [
    {
      "feature": "功能名称",
      "rationale": "排除的理由（干扰核心假设验证）"
    }
  ]
}
```

### Step 3: Nice to Have 归类

**定义**: 既非Must Have也非裁剪功能的功能

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

### Step 5: 时间规划

**定义**: 基于MVP功能工作量与资源约束，制定时间规划

**规划逻辑**:
1. 汇总 Must Have 功能工作量
2. 结合资源约束中的 timeline_weeks 和 team_size
3. 确保总周数 ≤ 2（MVP时间红线）
4. 拆分里程碑节点

**输出格式**:
```json
{
  "timeline": {
    "total_weeks": 2,
    "milestones": [
      {
        "name": "里程碑名称",
        "week": 1,
        "deliverables": ["交付物1", "交付物2"]
      }
    ]
  }
}
```

### Step 6: 资源估算

**定义**: 基于MVP功能工作量与时间规划，估算所需资源

**估算逻辑**:
1. 根据 Must Have 功能工作量计算人力需求
2. 结合 timeline.total_weeks 推算团队配置
3. 评估是否需要外部资源支持

**输出格式**:
```json
{
  "resource_estimate": {
    "team_size": 3,
    "roles": [
      {
        "role": "角色名称",
        "count": 1,
        "rationale": "配置理由"
      }
    ],
    "external_dependencies": []
  }
}
```

### Step 7: 成功标准与风险缓解

**定义**: 定义MVP验证的成功标准，并识别风险及缓解措施

**成功标准逻辑**:
1. 将核心假设转化为可量化的验证指标
2. 每个核心假设至少对应1个成功标准
3. 成功标准必须可量化（含具体数值或阈值）

**风险缓解逻辑**:
1. 识别MVP执行过程中的关键风险
2. 为每个风险制定缓解措施
3. 评估风险影响等级

**输出格式**:
```json
{
  "success_criteria": [
    {
      "criterion": "成功标准描述",
      "metric": "量化指标",
      "target_value": "目标值",
      "linked_hypothesis": "关联假设ID"
    }
  ],
  "risk_mitigation": [
    {
      "risk": "风险描述",
      "impact": "high/medium/low",
      "mitigation": "缓解措施"
    }
  ]
}
```

### Step 8: Go/No-Go决策框架

**定义**: 基于成功标准构建Go/No-Go决策框架，metrics直接引用success_criteria中的量化指标

**决策逻辑**:
1. 从 success_criteria 中提取关键决策指标（每个核心假设选取1个主指标）
2. 为每个指标定义 Go/No-Go 阈值（基于success_criteria.target_value上下浮动）
3. 至少包含2个 metrics 和对应 thresholds
4. metrics 不重复定义指标，通过 linked_criterion 引用 success_criteria

**输出格式**:
```json
{
  "go_no_go": {
    "metrics": [
      {
        "name": "指标名称",
        "linked_criterion": "关联的success_criteria索引",
        "description": "指标描述"
      }
    ],
    "thresholds": {
      "go": "Go条件描述",
      "no_go": "No-Go条件描述",
      "needs_more_data": "需更多数据条件描述"
    }
  }
}
```

## 输出

**存储路径**：`output/pm-design/validation-mvp/`
**输出文件**：mvp_definition.json

```json
{
  "mvp_scope": {
    "core_hypothesis": [
      {
        "id": "A001",
        "description": "用户认为推荐内容与兴趣匹配",
        "risk_score": 20
      }
    ],
    "must_have": [
      {
        "feature": "功能名称",
        "linked_assumption": "关联假设ID",
        "effort_estimate": 8,
        "rationale": "必须包含的理由"
      }
    ],
    "nice_to_have": [
      {
        "feature": "功能名称",
        "priority": "P1",
        "target_version": "v2.0"
      }
    ],
    "cut_features": [
      {
        "feature": "功能名称",
        "rationale": "排除理由"
      }
    ],
    "timeline": {
      "total_weeks": 2,
      "milestones": [
        {
          "name": "里程碑名称",
          "week": 1,
          "deliverables": ["交付物1", "交付物2"]
        }
      ]
    },
    "resource_estimate": {
      "team_size": 3,
      "roles": [
        {
          "role": "角色名称",
          "count": 1,
          "rationale": "配置理由"
        }
      ],
      "external_dependencies": []
    },
    "success_criteria": [
      {
        "criterion": "成功标准描述",
        "metric": "量化指标",
        "target_value": "目标值",
        "linked_hypothesis": "关联假设ID"
      }
    ],
    "risk_mitigation": [
      {
        "risk": "风险描述",
        "impact": "high/medium/low",
        "mitigation": "缓解措施"
      }
    ],
    "effort_summary": {
      "mvp_total": 24,
      "full_solution_total": 60,
      "mvp_ratio": "40%"
    },
    "go_no_go": {
      "metrics": [
        {
          "name": "指标名称",
          "linked_criterion": "success_criteria[0]",
          "description": "指标描述"
        }
      ],
      "thresholds": {
        "go": "Go条件描述",
        "no_go": "No-Go条件描述",
        "needs_more_data": "需更多数据条件描述"
      }
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
| 审批触发 | cut_features理由不充分 | 需补充排除依据 |

## 质量检查

| 检查项 | 通过条件 | 检查结果 |
|--------|----------|----------|
| 核心假设 | core_hypothesis非空且与must_have关联 | pass/fail |
| 假设关联 | Must Have功能都有假设关联 | pass/fail |
| 排除理由 | cut_features功能都有充分理由 | pass/fail |
| 占比计算 | MVP占比已计算 | pass/fail |
| 优先级完整 | Nice to Have都有优先级 | pass/fail |
| 时间红线 | timeline.total_weeks ≤ 2 | pass/fail |
| 成功标准可量化 | success_criteria包含量化指标和目标值 | pass/fail |
| Go/No-Go完整 | go_no_go包含至少2个metrics和对应thresholds | pass/fail |

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
| mvp_scope.effort_summary | object | 是 | 工作量汇总 |
| mvp_scope.effort_summary.mvp_total | number | 是 | MVP总工作量 |
| mvp_scope.effort_summary.full_solution_total | number | 是 | 完整方案总工作量 |
| mvp_scope.effort_summary.mvp_ratio | string | 是 | MVP占比 |
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
核心假设:
- A001: 用户认为推荐内容与兴趣匹配（风险分数: 20）

Must Have:
- F001 智能推荐算法（直接验证A001）
- F002 推荐结果展示（验证A001必需）

裁剪功能:
- F005 高保真动效（干扰核心验证，非MVP必要）

Nice to Have:
- F003 收藏功能（P2，v2.0）
- F004 分享功能（P3，v3.0）

时间规划:
- 总计2周，第1周完成核心算法，第2周完成展示与验证

资源估算:
- 3人：1后端+1前端+1数据

成功标准:
- 推荐匹配度 ≥ 60%（关联A001）

风险缓解:
- 算法精度不足（high）→ 降级为规则推荐

Go/No-Go:
- metrics: 推荐匹配度、用户点击率
- Go: 匹配度≥60%且点击率≥30%
- No-Go: 匹配度<40%或点击率<15%

MVP占比: 40% ✅ 理想
```
