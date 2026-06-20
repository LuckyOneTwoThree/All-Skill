---
name: validation-usability
description: 当需要辅助可用性测试时使用。可用性测试辅助工具，在测试前、中、后各阶段提供AI辅助支持：测试前生成任务脚本和招募问卷，测试后整理数据并生成洞察报告。注意：实际测试执行必须由人类研究员主持。关键词：可用性测试、任务脚本、招募筛选、问题聚类、洞察提炼、用户体验测试、测试任务。本Skill消费 validation-experiment 的方法选择（当方法=可用性测试时），生成具体测试任务脚本、招募问卷、测试报告。
metadata:
  module: "产品构思与设计"
  sub-module: "方案验证"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["互联网", "软件", "通用"]
  trigger_examples:
    - "怎么做可用性测试"
    - "帮我设计测试任务"
    - "用户体验测试怎么做"
  interaction_mode: "human_ai_collaborate"
execution_depth:
  default: standard
  quick_description: "直接输出可用性问题和改进建议"
  deep_description: "完整评估 + 可用性评分体系 + 优先级排序 + 改进路线图"
---

# 可用性测试辅助

## 核心原则

1. **用户行为比用户意见更真实**——观察用户做了什么，而非听用户说了什么
2. **5个用户发现85%的问题**——可用性测试不需要大样本，5-8人即可发现主要问题
3. **严重程度决定修复优先级**——致命问题必须修复，次要问题可以排期
4. **测试报告必须可行动**——每个发现必须对应一个改进建议，不可行动的发现是噪音

### 基本信息

| 属性 | 值 |
|------|-----|
| Pipeline ID | 13 |
| 名称 | 可用性测试辅助 |
| 执行模式 | 👤→🤖 人类执行，AI辅助 |
| 输入 | 假设地图 + MVP功能 + 测试目标 |

## 交互模式

👤→🤖 人类执行，AI辅助

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 可用性测试计划 | object | 是 | output/pm-design/validation-assumption-map/assumption_map.json | 测试目标、假设地图、MVP功能 |
| 测试参与者 | object | 是 | 用户提供 | 目标用户画像、招募筛选标准 |
| 测试任务场景 | object | 是 | output/pm-design/design-prototype/prototype_spec.json | 待验证的可用性假设与任务脚本 |
| 实验方法选择 | object | ○ | output/pm-design/validation-experiment/experiment_plan.json | 当方法=可用性测试时，消费 validation-experiment 的方法选择和实验框架 |

## 执行步骤

### ⚠️ 重要说明

可用性测试是唯一必须由**人类研究员主持执行**的环节。AI在此流程中提供辅助支持：

| 阶段 | 执行者 | AI辅助内容 |
|------|--------|------------|
| 测试前 | 👤准备 | 生成任务脚本、招募问卷、观察记录表 |
| 测试中 | 👤执行 | 人类研究员主持测试 |
| 测试后 | 👤+🤖 | AI整理分析，人类审核确认 |

### 测试前 AI 辅助

#### Step 1: 确定测试目标

根据假设地图确定可用性测试目标：

```json
{
  "test_goals": [
    {
      "goal_id": "TG001",
      "related_assumption": "A001",
      "goal_description": "验证用户能否顺利完成推荐内容浏览"
    }
  ]
}
```

#### Step 2: 生成任务脚本

**规则**: 每个任务对应一个待验证的可用性假设

> 🔗 **上游消费**：当 experiment_method 输入存在且 selected_method=usability_test 时，基于 experiment_framework（假设、指标、样本量、时长）设计具体测试任务脚本；否则基于假设地图和测试目标独立设计。

```json
{
  "task_script": [
    {
      "task_id": "T001",
      "task_description": "在3秒内找到一条感兴趣的推荐内容",
      "related_assumption": "A002",
      "success_criteria": "3秒内完成点击",
      "hints": ["提示信息（如需要）"]
    }
    // ... 同结构可扩展
  ]
}
```

#### Step 3: 生成招募筛选问卷

**筛选标准**:
- 目标用户画像匹配
- 产品使用经验要求
- 无利益冲突

```json
{
  "recruitment_survey": {
    "screening_questions": [
      {
        "question_id": "SQ001",
        "question": "您是否使用过类似推荐功能的产品？",
        "options": ["经常使用", "偶尔使用", "从未使用"],
        "correct_answer": "经常使用|偶尔使用"
      }
      // ... 同结构可扩展
    ],
    "target_sample_size": 8,
    "oversample_ratio": 1.25
  }
}
```

#### Step 4: 生成观察记录表模板

```json
{
  "observation_template": {
    "participant_id": "",
    "test_date": "",
    "tasks": [
      {
        "task_id": "T001",
        "time_on_task": "秒",
        "success": true/false,
        "errors": ["错误描述"],
        "observations": "观察记录",
        "quotes": ["用户原话"]
      }
    ],
    "overall_notes": "整体观察"
  }
}
```

### 测试后 AI 辅助

#### Step 5: 测试记录结构化整理

将原始测试记录转换为结构化数据：

```json
{
  "structured_records": [
    {
      "participant_id": "P001",
      "task_results": [
        {
          "task_id": "T001",
          "time_seconds": 5,
          "completed": true,
          "errors": [],
          "critical_incidents": []
        }
      ]
    }
  ]
}
```

#### Step 6: 问题自动聚类

**聚类维度**:

| 维度 | 说明 |
|------|------|
| 严重程度 | 致命/严重/一般/轻微 |
| 频率 | 高频/中频/低频 |
| 影响环节 | 导航/操作/反馈/内容 |

**严重程度定义**:

| 等级 | 定义 | 影响 |
|------|------|------|
| 致命 (P0) | 任务无法完成 | 导致用户放弃 |
| 严重 (P1) | 任务需大量帮助 | 严重影响效率 |
| 一般 (P2) | 任务有困难但完成 | 影响用户体验 |
| 轻微 (P3) | 操作不便但可接受 | 优化项 |

```json
{
  "problem_clusters": [
    {
      "cluster_id": "PC001",
      "severity": "P1",
      "frequency": "3/8 用户",
      "affected_element": "推荐列表",
      "problem_description": "用户难以理解推荐内容的相关性",
      "evidence": ["证据1", "证据2"]
    }
  ]
}
```

#### Step 7: 洞察提炼

**三类洞察**:

| 类型 | 说明 | 示例 |
|------|------|------|
| 假设验证 | 假设是否被验证 | A001假设成立/不成立/部分成立 |
| 设计修改 | 需要调整的设计点 | 推荐展示位置调整 |
| 未预期发现 | 测试中发现的新问题/机会 | 发现新的用户场景 |

```json
{
  "insights": [
    {
      "type": "assumption_validation",
      "assumption_id": "A001",
      "result": "confirmed|rejected|partial",
      "evidence": "支持/反对的证据"
    }
    // ... 同结构可扩展，type 可为 design_changes / unexpected_findings
  ]
}
```

#### Step 8: 生成改进建议

**优先级排序规则**:

1. P0问题 → 立即修复
2. P1问题 → 高优先级
3. P2问题 → 中优先级
4. P3问题 → 低优先级

```json
{
  "improvement_suggestions": [
    {
      "suggestion_id": "IS001",
      "suggestion": "在推荐内容旁增加「为什么推荐」的解释文案",
      "priority": "P1",
      "problem_ref": "PC001",
      "effort_estimate": "中",
      "expected_impact": "高"
    }
  ]
}
```

### 输出深度分级

| 深度级别 | 输出范围 | 说明 |
|----------|----------|------|
| quick | 可用性问题和改进建议 | 核心结论 + 最小可行产物 |
| standard | 完整产物（当前默认） | 完整产物，包含全部Step输出 |
| deep | 完整评估 + 可用性评分体系 + 优先级排序 + 改进路线图 | 完整产物 + 扩展分析 + 深度推演 |

## 输出

**存储路径**：`output/pm-design/validation-usability/`
**输出文件**：usability_report.json

```json
{
  "usability_report": {
    "test_summary": {
      "test_date": "2024-01-15",
      "participant_count": 8,
      "test_duration_minutes": 60,
      "test_goals": ["验证学员能否快速找到适合的课程"]
    },
    "problems": [
      {
        "problem_id": "P001",
        "severity": "P1",
        "frequency": "3/8",
        "affected_element": "课程推荐列表",
        "description": "学员无法理解推荐课程与自身学习进度的关联",
        "evidence": ["6/8学员表示不确定推荐依据"]
      }
      // ... 同结构可扩展
    ],
    "insights": [
      {
        "type": "assumption_validation",
        "assumption_id": "A001",
        "result": "confirmed",
        "description": "假设A001部分成立"
      }
      // ... 同结构可扩展，type 可为 design_changes / unexpected_findings
    ],
    "improvement_suggestions": [
      {
        "suggestion": "在课程推荐卡片增加推荐理由和学习进度匹配度展示",
        "priority": "P1",
        "problem_ref": "P001",
        "effort": "中",
        "impact": "高"
      }
      // ... 同结构可扩展
    ]
  }
}
```

**输出校验规则**：详见下方输出校验规则章节

## 决策规则

| 情况 | 处理方式 |
|------|----------|
| P0问题（任务无法完成） | 立即修复，阻塞发布 |
| 同一问题3/8以上用户遇到 | 标记为高频问题，优先处理 |
| 假设被推翻 | 更新假设地图，调整设计方向 |
| 测试参与者<5人 | 结果仅供参考，建议补充测试 |

## 质量检查

### P0 检查（quick/standard/deep 都必须通过）

- [ ] 问题严重程度分级（P0/P1/P2/P3分级合理）
- [ ] 洞察假设关联（洞察与假设地图有对应关系）

### P1 检查（standard/deep 必须通过）

- [ ] 改进建议可执行（建议明确、可操作）
- [ ] 数据完整性（测试数据完整无遗漏）

### P2 检查（仅 deep 必须通过）

- [ ] 扩展分析完整（深度推演和路线图已生成）
- [ ] 决策记录完整（关键决策有依据和替代方案）

---

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 | 数据获取说明 |
|---------------|---------|---------|------------|
| 原型数据缺失 | 用户提供设计描述，生成测试脚本 | 缺乏原型数据，测试任务可能不够精准 | 要求用户提供设计描述和页面截图或上传原型文件 |
| 假设地图缺失 | 用户提供设计描述，生成测试脚本 | 缺乏假设地图数据，测试目标可能不够聚焦 | 要求用户提供关键假设列表或上传assumption-map文件 |
| 原型+假设地图均缺失 | 用户提供设计描述，生成测试脚本 | 整体置信度降低，测试脚本可能不够完整 | 要求用户提供设计描述和关键假设 |
| 所有上游文件均缺失 | 提示用户先执行前序阶段，或基于用户描述生成测试脚本 | 输出仅为基本测试框架 | 要求用户提供设计描述、核心功能和测试目标 |

## 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| usability_report | object | 是 | 可用性测试报告 |
| usability_report.test_summary | object | 是 | 测试摘要 |
| usability_report.test_summary.participant_count | integer | 是 | 参与者数量 |
| usability_report.test_summary.test_goals | array | 是 | 测试目标列表 |
| usability_report.problems | array | 是 | 问题列表 |
| usability_report.problems[].problem_id | string | 是 | 问题唯一标识 |
| usability_report.problems[].severity | string | 是 | 严重程度（P0/P1/P2/P3） |
| usability_report.problems[].frequency | string | 是 | 出现频率 |
| usability_report.problems[].affected_element | string | 是 | 受影响元素 |
| usability_report.problems[].description | string | 是 | 问题描述 |
| usability_report.insights | array | 是 | 洞察列表 |
| usability_report.insights[].type | string | 是 | 洞察类型 |
| usability_report.improvement_suggestions | array | 是 | 改进建议列表 |
| usability_report.improvement_suggestions[].suggestion | string | 是 | 建议内容 |
| usability_report.improvement_suggestions[].priority | string | 是 | 优先级 |
| usability_report.improvement_suggestions[].problem_ref | string | 是 | 关联问题ID |

## 上游变更响应

### 上游变更影响

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| 原型变更（页面/交互修改） | 测试任务、测试脚本 | 标注受影响的测试任务，建议人类确认是否更新测试脚本 |
| 假设地图变更（假设增删/评分变更） | 测试目标、假设验证项 | 标注受影响的测试目标，建议人类确认是否调整测试重点 |
| MVP范围变更 | 测试范围 | 标注受影响的测试范围，建议人类确认是否调整测试覆盖 |

### 下游通知机制

| 可用性测试报告变更类型 | 通知范围 | 通知方式 |
|----------------------|----------|----------|
| 问题发现增删 | design-prototype、interaction-spec | 标记问题变更，触发原型和交互规范更新 |
| 假设验证结果变更 | validation-assumption-map、validation-mvp | 标记验证结果变更，触发假设地图和MVP范围更新 |
| 改进建议变更 | design-prototype | 标记建议变更，触发原型更新 |

---

## 使用示例

**测试执行**: 人类研究员主持，8名用户参与

**AI辅助输出**: 结构同上方输出 JSON，其中 `problems`/`insights`/`improvement_suggestions` 各数组按实际测试结果填充，字段含义与输出校验规则一致。

### 完整示例：课程推荐功能可用性测试报告

场景：对"课程推荐功能"进行 8 人可用性测试，验证学员能否快速找到适合的课程并理解推荐理由。以下为测试后 AI 整理产出的完整 `usability_report.json`。

```json
{
  "usability_report": {
    "test_summary": {
      "test_date": "2025-06-18",
      "participant_count": 8,
      "test_duration_minutes": 75,
      "test_goals": [
        "验证学员能否在推荐首页快速找到感兴趣的课程",
        "验证学员能否理解推荐课程与自身学习进度的关联",
        "验证学员能否顺利完成从推荐首页到课程详情页的跳转"
      ]
    },
    "problems": [
      {
        "problem_id": "P001",
        "severity": "P1",
        "frequency": "5/8",
        "affected_element": "课程推荐列表",
        "affected_users": 5,
        "task_id": "T001",
        "description": "学员无法理解推荐课程与自身学习进度的关联，推荐理由展示不清晰，导致学员对推荐内容信任度低",
        "evidence": [
          "5/8学员在访谈中表示「不确定为什么推荐这门课」",
          "3/8学员在推荐列表停留超过15秒仍未点击",
          "学员P003原话：「这些课程看起来和我学的没什么关系」"
        ]
      },
      {
        "problem_id": "P002",
        "severity": "P2",
        "frequency": "3/8",
        "affected_element": "推荐首页「不感兴趣」反馈入口",
        "affected_users": 3,
        "task_id": "T002",
        "description": "「不感兴趣」反馈按钮位置隐蔽，学员难以发现，导致反馈功能使用率低",
        "evidence": [
          "3/8学员在任务完成后才注意到反馈按钮",
          "2/8学员表示「以为那个图标是收藏」",
          "眼动数据显示反馈按钮注视率仅25%"
        ]
      }
    ],
    "insights": [
      {
        "type": "assumption_validation",
        "assumption_id": "A001",
        "result": "partial",
        "description": "假设A001「学员能快速找到适合的课程」部分成立：学员能找到课程，但因推荐理由不清晰导致决策时间过长",
        "insight_text": "推荐理由的可解释性比推荐准确性更影响学员的点击决策，学员需要明确知道「为什么推荐」才会产生信任",
        "evidence": "5/8学员在看到推荐理由后点击率提升40%，但默认展示的推荐理由过于笼统（如「基于你的学习历史」）",
        "confidence": 0.85
      },
      {
        "type": "design_changes",
        "assumption_id": "A002",
        "result": "confirmed",
        "description": "假设A002「学员希望看到学习路径推荐」成立，学员对结构化学习路径有明确需求",
        "insight_text": "学员更倾向于按职业目标组织的学习路径，而非零散的单门课程推荐，路径推荐应作为推荐首页的核心模块",
        "evidence": "6/8学员主动询问「有没有按方向的学习路径」，2/8学员表示愿意为路径推荐付费",
        "confidence": 0.9
      }
    ],
    "improvement_suggestions": [
      {
        "suggestion_id": "IS001",
        "suggestion": "在课程推荐卡片显著位置增加具体推荐理由（如「因为你学完了《JS基础》，推荐进阶课程《React实战》」），替代笼统的「基于学习历史」",
        "priority": "P1",
        "problem_ref": "P001",
        "effort": "中",
        "estimated_effort": "3人天",
        "impact": "高"
      },
      {
        "suggestion_id": "IS002",
        "suggestion": "将「不感兴趣」反馈按钮从卡片右下角移至卡片右上角，并增加文字标签和悬停提示，提升可发现性",
        "priority": "P2",
        "problem_ref": "P002",
        "effort": "低",
        "estimated_effort": "1人天",
        "impact": "中"
      },
      {
        "suggestion_id": "IS003",
        "suggestion": "在推荐首页顶部增加「学习路径」独立模块，按学员职业目标展示结构化路径，每条路径展示阶段进度",
        "priority": "P1",
        "problem_ref": "P001",
        "effort": "高",
        "estimated_effort": "8人天",
        "impact": "高"
      }
    ]
  }
}
```

### 示例说明

| 字段类别 | 示例数量 | 关键字段 |
|----------|----------|----------|
| problems | 2 | severity（P1/P2）、description、affected_users、task_id、evidence |
| insights | 2 | insight_text、evidence、confidence（0.85/0.9）、type（assumption_validation/design_changes） |
| improvement_suggestions | 3 | suggestion、priority（P1/P2）、estimated_effort（人天）、problem_ref |

**优先级处理**：P1 问题（P001）对应 2 条改进建议（IS001、IS003），其中 IS003 为高投入高收益项，建议排入下个迭代；P2 问题（P002）对应低投入建议（IS002），可快速修复。
