---
name: validation-usability
description: 当需要辅助可用性测试时使用。可用性测试辅助工具，在测试前、中、后各阶段提供AI辅助支持：测试前生成任务脚本和招募问卷，测试后整理数据并生成洞察报告。注意：实际测试执行必须由人类研究员主持。关键词：可用性测试、任务脚本、招募筛选、问题聚类、洞察提炼。
metadata:
  module: "产品构思与设计"
  sub-module: "方案验证"
  type: "pipeline"
  version: "1.0"
  interaction_mode: "ai_suggest_human_approve"
---

# Pipeline 15: 可用性测试辅助

## 核心原则

1. **批量生成人类筛选**：AI批量生成分类/排序建议，人类做最终筛选和判定
2. **结构化发散**：用固定模板和框架引导需求拆解，避免遗漏和随意性
3. **假设驱动而非功能驱动**：每个需求背后必须还原为用户假设，而非直接进入功能设计
4. **设计规范即约束**：需求分析阶段就引入设计规范约束，避免后期返工

### 基本信息

| 属性 | 值 |
|------|-----|
| Pipeline ID | 15 |
| 名称 | 可用性测试辅助 |
| 执行模式 | 👤→🤖 人类执行，AI辅助 |
| 输入 | 假设地图 + MVP功能 + 测试目标 |

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 可用性测试计划 | object | 是 | output/pm-design/validation-assumption-map/assumption-map.json | 测试目标、假设地图、MVP功能 |
| 测试参与者 | object | 是 | 用户提供 | 目标用户画像、招募筛选标准 |
| 测试任务场景 | object | 是 | output/pm-design/design-prototype/prototype.json | 待验证的可用性假设与任务脚本 |

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

```json
{
  "task_script": [
    {
      "task_id": "T001",
      "task_description": "在3秒内找到一条感兴趣的推荐内容",
      "related_assumption": "A002",
      "success_criteria": "3秒内完成点击",
      "hints": ["提示信息（如需要）"]
    },
    {
      "task_id": "T002",
      "task_description": "将推荐内容分享给好友",
      "related_assumption": "A003",
      "success_criteria": "成功分享",
      "hints": []
    }
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
      },
      {
        "question_id": "SQ002",
        "question": "您每周使用推荐类产品的频率是？",
        "options": ["每天多次", "每天一次", "每周几次", "很少"],
        "correct_answer": "每天多次|每天一次|每周几次"
      }
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
    },
    {
      "type": "design_changes",
      "element": "推荐列表",
      "change_needed": "需要增加解释文案"
    },
    {
      "type": "unexpected_findings",
      "description": "用户希望有筛选功能",
      "opportunity": "可作为后续迭代点"
    }
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
      "test_goals": ["验证学员能否快速找到适合的课程", "验证课程播放器操作是否流畅"]
    },
    "problems": [
      {
        "problem_id": "P001",
        "severity": "P1",
        "frequency": "3/8",
        "affected_element": "课程推荐列表",
        "description": "学员无法理解推荐课程与自身学习进度的关联",
        "evidence": ["6/8学员表示不确定推荐依据", "3名学员跳过推荐直接搜索"]
      }
    ],
    "insights": [
      {
        "type": "assumption_validation",
        "assumption_id": "A001",
        "result": "confirmed",
        "description": "假设A001部分成立：学员关注推荐课程但需更多上下文信息"
      },
      {
        "type": "design_changes",
        "element": "课程推荐卡片",
        "change_needed": "在推荐卡片上增加「基于你的学习进度推荐」标签说明"
      },
      {
        "type": "unexpected_findings",
        "description": "学员期望按学习目标筛选课程而非仅看推荐",
        "notes": "可作为后续迭代增加学习目标筛选功能的依据"
      }
    ],
    "improvement_suggestions": [
      {
        "suggestion": "在课程推荐卡片增加推荐理由和学习进度匹配度展示",
        "priority": "P1",
        "problem_ref": "P001",
        "effort": "中",
        "impact": "高"
      }
    ]
  }
}
```

## 决策规则

| 情况 | 处理方式 |
|------|----------|
| P0问题（任务无法完成） | 立即修复，阻塞发布 |
| 同一问题3/8以上用户遇到 | 标记为高频问题，优先处理 |
| 假设被推翻 | 更新假设地图，调整设计方向 |
| 测试参与者<5人 | 结果仅供参考，建议补充测试 |

## 质量检查

| 检查项 | 通过条件 | 检查结果 |
|--------|----------|----------|
| 问题严重程度分级 | P0/P1/P2/P3分级合理 | pass/fail |
| 洞察假设关联 | 洞察与假设地图有对应关系 | pass/fail |
| 改进建议可执行 | 建议明确、可操作 | pass/fail |
| 数据完整性 | 测试数据完整无遗漏 | pass/fail |

---

## 降级策略

当上游文件不存在时，本Skill仍可独立执行：

| 缺失的上游文件 | 降级方案 |
|---------------|---------|
| 原型数据（prototype.json） | 用户提供设计描述 → 生成测试脚本，标注"缺乏原型数据" |
| assumption-map.json（假设地图） | 用户提供设计描述 → 生成测试脚本，标注"缺乏假设地图数据" |
| 原型 + 假设地图 | 用户提供设计描述 → 生成测试脚本，整体置信度降低 |
| 所有上游文件均缺失 | 提示用户先执行前序阶段，或基于用户提供的设计描述生成测试脚本 |

数据获取说明：
- 本Skill需要原型和假设地图数据，请通过以下方式之一提供：
  1. 直接描述设计功能和测试目标
  2. 上传prototype.json / assumption-map.json文件
  3. 提供数据文件路径
- AI不负责外部数据采集，仅负责分析

---

## 使用示例

**测试执行**: 人类研究员主持，8名用户参与

**AI辅助输出**:

```json
{
  "usability_report": {
    "test_summary": {
      "participant_count": 8,
      "test_goals": ["验证推荐内容发现性"]
    },
    "problems": [
      {
        "problem_id": "P001",
        "severity": "P1",
        "affected_element": "推荐列表",
        "description": "用户不清楚推荐内容的相关性"
      }
    ],
    "insights": [
      {
        "type": "assumption_validation",
        "assumption_id": "A002",
        "result": "rejected",
        "description": "假设被推翻：用户无法快速理解推荐逻辑"
      }
    ],
    "improvement_suggestions": [
      {
        "suggestion": "增加『为你推荐』的解释文案",
        "priority": "P1",
        "problem_ref": "P001"
      }
    ]
  }
}
```
