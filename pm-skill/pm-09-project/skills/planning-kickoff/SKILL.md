---
name: planning-kickoff
description: 当需要准备和执行项目Kickoff会议时使用。Kickoff会议自动化，包含会前AI准备（议程生成、背景材料整理、问题清单预准备）、会中人类主持、会后AI处理（纪要生成、行动项提取、跟进提醒设置）。关键词：Kickoff、项目启动、启动会议、行动项、项目启动会、启动会、项目开张。
metadata:
  module: "项目管理与执行"
  sub-module: "项目规划"
  type: "pipeline"
  version: "3.1"
  domain_tags: ["互联网", "SaaS", "通用"]
  trigger_examples:
    - "项目要启动了怎么开会"
    - "kickoff会议怎么准备"
    - "项目启动会怎么开"
  interaction_mode: "human_ai_collaborate"
---

# Kickoff会议自动化

## 核心原则

1. **透明度即协作**：会议议程、背景材料、行动项全员可见，确保信息同步
2. **风险前置**：会前预识别潜在问题和风险，确保会议高效讨论关键议题
3. **自动化追踪**：行动项提取、跟进提醒、完成状态自动追踪

## 交互模式

**🤖 AI辅助（Kickoff需要人类主持）**

- **会前**：AI自动完成所有准备工作（Step 1-3）
- **会中**：人类主持会议，AI提供实时辅助（如实时问答建议）
- **会后**：AI自动完成纪要和跟进（Step 4-6）

---

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| project_charter | object | 是 | output/pm-project/planning-project-charter/project_charter | 项目宪章 |
| resource_plan | object | 是 | output/pm-project/planning-resource/resource_plan | 资源计划 |
| meeting_attendees | string[] | 是 | 用户提供 | 会议参与者名单 |
| preferred_meeting_time | string | ○ | 用户提供 | 首选会议时间 |

---

## 执行步骤

### 会前AI：准备阶段

#### Step 1: 议程自动生成

**动作**：
- 基于项目宪章和资源计划生成会议议程
- 分配每个议题的时间
- 标注每个议题的负责人
- 确保关键信息不被遗漏

**输出**：
```json
{
  "agenda": {
    "meeting_title": "string",
    "duration_minutes": number,
    "items": [{
      "order": 1,
      "topic": "string",
      "duration_minutes": number,
      "presenter": "string",
      "key_points": ["string"],
      "decision_needed": boolean
    }],
    "buffer_minutes": number
  }
}
```

#### Step 2: 背景材料自动整理

**动作**：
- 汇总项目宪章核心内容为1页摘要
- 整理资源计划要点
- 收集相关文档链接
- 生成可视化的项目概览

**输出**：
```json
{
  "background_materials": {
    "executive_summary": "string (< 500 words)",
    "project_overview": {
      "objectives": ["string"],
      "scope": ["string"],
      "timeline": "string",
      "team": ["string"]
    },
    "key_risks": ["string"],
    "success_criteria": ["string"],
    "document_links": [{
      "title": "string",
      "url": "string",
      "description": "string"
    }]
  }
}
```

#### Step 3: 问题清单预准备

**动作**：
- 基于项目背景识别常见问题
- 预测利益相关方可能关心的问题
- 预先准备答案要点
- 标记需要特定人回答的问题

**输出**：
```json
{
  "prepared_questions": [{
    "question": "string",
    "likely_from": "string",
    "prepared_answer": "string",
    "answer_owner": "string",
    "priority": "high | medium | low"
  }]
}
```

### 会中人类：会议主持

**人类主持要点**：
- 按议程推进会议
- 确保每个关键决策有结论
- 记录会上提出的新问题
- 控制时间，避免超时

### 会后AI：跟进阶段

#### Step 4: 会议纪要自动生成

**动作**：
- 接收会议记录（或录音转写）
- 提取关键讨论点和结论
- 整理未解决的问题
- 生成格式化的会议纪要

**输出**：
```json
{
  "minutes": {
    "meeting_info": {
      "title": "string",
      "date": "ISO date",
      "attendees": ["string"],
      "absentees": ["string"]
    },
    "key_decisions": [{
      "decision": "string",
      "decision_maker": "string",
      "date": "ISO date"
    }],
    "discussion_summary": "string",
    "unresolved_issues": ["string"],
    "next_steps": ["string"]
  }
}
```

#### Step 5: 行动项自动提取

**动作**：
- 从会议纪要中识别行动项
- 提取每个行动项的：负责人、内容、截止日期
- 分配行动项ID
- 建立行动项追踪

**输出**：
```json
{
  "action_items": [{
    "id": "AI-001",
    "description": "string",
    "owner": "string",
    "due_date": "ISO date",
    "status": "open | in_progress | completed",
    "priority": "high | medium | low",
    "related_decision": "string | null"
  }]
}
```

#### Step 6: 后续跟进提醒设置

**动作**：
- 基于行动项截止日期设置提醒
- 为关键里程碑设置提醒
- 配置提醒接收人
- 生成跟进计划摘要

**输出**：
```json
{
  "follow_up_reminders": [{
    "id": "REM-001",
    "type": "action_item | milestone | check_in",
    "title": "string",
    "due_date": "ISO date",
    "notify": ["string"],
    "reminder_timing": "1 day before | 3 days before | 1 week before",
    "auto_follow_up": boolean
  }],
  "follow_up_schedule": {
    "next_check_in": "ISO date",
    "next_status_review": "ISO date",
    "project_phase_end": "ISO date"
  }
}
```

---

## 输出

**存储路径**：`output/pm-project/planning-kickoff/`

**输出文件**：kickoff.json、metadata.json

**输出Schema**：

```json
{
  "type": "object",
  "required": ["kickoff", "metadata"],
  "properties": {
    "kickoff": {"type": "object", "description": "启动会数据，包含议程、背景材料、预判问题和会议纪要"},
    "metadata": {"type": "object", "description": "元数据，包含会议安排和准备状态"}
  }
}
```

### 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| kickoff.agenda.meeting_title | string | 是 | 会议标题，须包含项目名称 |
| kickoff.agenda.duration_minutes | number | 是 | 会议时长（分钟），须>0 |
| kickoff.agenda.items | array | 是 | 议程项列表，每项须含order、topic、duration_minutes |
| kickoff.agenda.items[].decision_needed | boolean | 是 | 是否需要决策 |
| kickoff.background_materials.executive_summary | string | 是 | 项目摘要，须<500字 |
| kickoff.background_materials.project_overview.objectives | array | 是 | 项目目标列表，至少1项 |
| kickoff.background_materials.key_risks | array | 否 | 关键风险列表 |
| kickoff.background_materials.success_criteria | array | 是 | 成功标准列表，至少1项 |
| kickoff.prepared_questions[].priority | string | 是 | 问题优先级，枚举值high/medium/low |
| kickoff.minutes.meeting_info.date | string | 是 | 会议日期，ISO 8601格式 |
| kickoff.minutes.key_decisions | array | 是 | 关键决策列表，每项须含decision、decision_maker、date |
| kickoff.action_items[].owner | string | 是 | 行动项负责人 |
| kickoff.action_items[].due_date | string | 是 | 行动项截止日期，ISO 8601格式 |
| kickoff.action_items[].status | string | 是 | 行动项状态，枚举值open/in_progress/completed |
| kickoff.follow_up_reminders[].type | string | 是 | 提醒类型，枚举值action_item/milestone/check_in |
| metadata.meeting_scheduled | boolean | 是 | 会议是否已安排 |
| metadata.preparation_completed_at | string | 是 | 准备完成时间，ISO 8601格式 |

```json
{
  "kickoff": {
    "agenda": {
      "meeting_title": "在线课堂互动功能项目启动会",
      "duration_minutes": 90,
      "items": [
        {
          "order": 1,
          "topic": "项目背景与目标",
          "duration_minutes": 15,
          "presenter": "张明（产品负责人）",
          "key_points": ["提升课堂互动率至60%", "支持实时问答和投票功能"],
          "decision_needed": false
        }
      ],
      "buffer_minutes": 10
    },
    "background_materials": {
      "executive_summary": "本项目旨在为在线教育平台增加实时课堂互动功能，包括学生举手提问、实时投票和弹幕互动，以提升学员参与度和课程完课率。",
      "project_overview": {
        "objectives": ["课堂互动率提升至60%", "课程完课率提升15%"],
        "scope": ["实时问答模块", "课堂投票模块", "弹幕互动模块"],
        "timeline": "2024-Q2（10周）",
        "team": ["张明（PM）", "李伟（前端Lead）", "王芳（后端Lead）", "陈刚（QA Lead）"]
      },
      "key_risks": ["WebSocket并发性能风险", "与现有播放器集成复杂度"],
      "success_criteria": ["互动功能上线后课堂互动率≥60%", "P0缺陷数=0"],
      "document_links": [
        {
          "title": "课堂互动PRD",
          "url": "https://wiki.example.com/class-interaction-prd",
          "description": "课堂互动功能产品需求文档"
        }
      ]
    },
    "prepared_questions": [
      {
        "question": "互动功能是否需要支持回放场景？",
        "likely_from": "李伟（前端Lead）",
        "prepared_answer": "一期仅支持直播场景，回放场景列入二期规划",
        "answer_owner": "张明",
        "priority": "high"
      }
    ],
    "minutes": {
      "meeting_info": {
        "title": "在线课堂互动功能项目启动会",
        "date": "2024-04-01",
        "attendees": ["张明", "李伟", "王芳", "陈刚"],
        "absentees": []
      },
      "key_decisions": [
        {
          "decision": "一期仅支持直播场景互动，回放互动列入二期",
          "decision_maker": "张明",
          "date": "2024-04-01"
        }
      ],
      "discussion_summary": "团队对课堂互动功能目标达成一致，确认一期聚焦直播场景，技术方案采用WebSocket+Redis架构",
      "unresolved_issues": ["弹幕消息的审核机制待确认"],
      "next_steps": ["李伟完成技术方案设计", "王芳完成接口定义", "陈刚准备测试环境"]
    },
    "action_items": [
      {
        "id": "AI-001",
        "description": "完成课堂互动技术方案设计文档",
        "owner": "李伟",
        "due_date": "2024-04-08",
        "status": "open",
        "priority": "high",
        "related_decision": null
      }
    ],
    "follow_up_reminders": [
      {
        "id": "REM-001",
        "type": "action_item",
        "title": "技术方案设计文档截止提醒",
        "due_date": "2024-04-08",
        "notify": ["李伟", "张明"],
        "reminder_timing": "1 day before",
        "auto_follow_up": true
      }
    ]
  },
  "metadata": {
    "meeting_scheduled": true,
    "meeting_date": "2024-04-01",
    "attendees_confirmed": ["张明", "李伟", "王芳", "陈刚"],
    "preparation_completed_at": "2024-03-31T18:00:00+08:00",
    "follow_up_enabled": true
  }
}
```

---

## 会议时长建议

| 项目规模 | 建议时长 |
|----------|----------|
| 小型项目（< 5人，< 4周） | 30-45分钟 |
| 中型项目（5-15人，1-3月） | 60-90分钟 |
| 大型项目（> 15人，> 3月） | 90-120分钟 |

---

## 决策规则

| 条件 | 动作 |
|------|------|
| 关键利益相关方无法参加 | 升级至人类协调时间 |
| 会议中产生重大范围变更 | 触发宪章更新流程（Pipeline 1） |
| 行动项无法分配负责人 | 升级至项目经理决策 |
| 会议未能按计划召开 | 重新调度，发送通知 |

## 质量检查

- [ ] 议程覆盖项目目标、范围、角色、时间线
- [ ] 关键利益相关方确认参会
- [ ] 行动项有明确负责人和截止日期
- [ ] 会议材料提前发送至参会者

## 降级策略

### 上游文件缺失降级方案

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 项目宪章 | 用户描述项目目标和范围，AI基于描述生成Kickoff议程 | 基于用户描述生成Kickoff议程，缺少结构化宪章数据支撑 |
| 资源规划 | 跳过资源配置讨论环节，议程中标注"资源规划待确认" | Kickoff材料含待确认资源项，需会后补充 |
| 会议参与者 | 用户提供参会人员名单，AI据此调整议程和问题准备 | 基于用户输入的参会配置，议程和问题预准备可能不完整 |
| 首选会议时间 | 若用户未提供首选会议时间，提示用户提供或跳过该输入相关步骤 | 会议安排缺少时间信息，需人工补充 |

### 数据获取说明

当上游文件缺失时，通过以下方式获取必要数据：

1. **项目宪章缺失**：请用户描述项目目标、范围和关键里程碑，AI将基于描述生成Kickoff议程和背景材料摘要
2. **资源规划缺失**：Kickoff议程中跳过资源配置讨论环节，标注"资源规划待确认"，建议在会议中增加资源讨论议题
3. **会议参与者缺失**：请用户提供参会人员名单和角色，AI将据此调整议程时间分配和问题预准备

## 上游变更响应

### 上游变更影响表

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| 项目宪章变更（目标/范围/成功标准调整） | 议程内容、背景材料、问题预准备 | 重新生成议程和背景材料，更新问题清单 |
| 资源规划变更（人员/预算调整） | 资源配置讨论环节、团队信息 | 更新背景材料中的资源要点，调整议程相关环节 |
| 参会人员变更（增减/角色变化） | 议程时间分配、问题预准备、提醒配置 | 重新调整议程和问题准备，更新提醒接收人 |

### 下游通知机制表

| 变更类型 | 影响范围 | 通知方式 |
|----------|----------|----------|
| 会议议程变更 | 所有参会者、会议安排 | 更新kickoff.json，发送议程变更通知 |
| 行动项变更（新增/修改/完成） | 行动项负责人、项目经理 | 更新kickoff.json，通知相关责任人和项目经理 |
| 关键决策变更 | 项目宪章、后续规划Pipeline | 更新kickoff.json，通知planning-project-charter |
