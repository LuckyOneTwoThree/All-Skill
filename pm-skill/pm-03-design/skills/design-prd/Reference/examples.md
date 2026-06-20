# PRD生成器 示例数据

> 本文档提供 design-prd Skill 的完整 prd.json 示例，供下游 Backend/UI Skill 编程式消费参考。示例场景为"课程推荐功能"的 PRD-S 级别完整产物。

## 完整 prd.json 示例

场景：在线学习平台的"课程推荐功能"PRD-S 级别文档，包含全部 7 个顶层数组（features、pages、entities、user_flows、non_functional_requirements、tracking_plan、traceability）的真实数据。

```json
{
  "prd_id": "PRDS-2025-06-001",
  "version": "v1.0",
  "level": "S",
  "status": "approved",
  "meta": {
    "title": "课程推荐功能 PRD",
    "owner": "张三（产品经理）",
    "created_at": "2025-06-01T09:00:00+08:00",
    "updated_at": "2025-06-15T16:30:00+08:00"
  },
  "goals": [
    {
      "goal_id": "G001",
      "description": "提升学员课程发现效率与学习参与度",
      "okr_alignment": "O2-提升用户学习参与度",
      "success_metrics": [
        {
          "metric_name": "推荐课程点击率",
          "target_value": "25",
          "current_value": "12",
          "unit": "%"
        },
        {
          "metric_name": "推荐课程完课率",
          "target_value": "60",
          "current_value": "45",
          "unit": "%"
        }
      ]
    }
  ],
  "features": [
    {
      "feature_id": "F001",
      "name": "个性化推荐",
      "description": "基于学员学习历史、兴趣标签和行为数据，在推荐首页展示个性化课程列表，支持刷新和反馈",
      "priority": "must",
      "status": "planned",
      "goal_id": "G001",
      "driven_by": {
        "north_star_metric": "学员周活跃学习时长",
        "okr_objective": "O2-提升用户学习参与度",
        "kr_id": "KR2.1",
        "expected_lift": "推荐点击率从12%提升至25%"
      },
      "acceptance_criteria": [
        {
          "criterion_id": "AC001",
          "given": "学员已登录且存在学习历史",
          "when": "学员进入推荐首页",
          "then": "3秒内展示不少于10条个性化推荐课程，且每条课程附带推荐理由"
        },
        {
          "criterion_id": "AC002",
          "given": "学员在推荐首页点击「不感兴趣」",
          "when": "学员对某条推荐课程反馈不感兴趣",
          "then": "该课程立即从列表移除，并在30天内不再推荐"
        }
      ],
      "dependencies": [],
      "related_pages": ["P001", "P002"],
      "related_entities": ["E001", "E002"]
    },
    {
      "feature_id": "F002",
      "name": "学习路径推荐",
      "description": "根据学员选择的职业方向和当前水平，生成结构化学习路径，按阶段推荐课程组合",
      "priority": "should",
      "status": "planned",
      "goal_id": "G001",
      "driven_by": {
        "north_star_metric": "学员周活跃学习时长",
        "okr_objective": "O2-提升用户学习参与度",
        "kr_id": "KR2.2",
        "expected_lift": "完课率从45%提升至60%"
      },
      "acceptance_criteria": [
        {
          "criterion_id": "AC003",
          "given": "学员已选择职业方向「前端工程师」",
          "when": "学员查看学习路径推荐",
          "then": "展示按基础-进阶-实战三阶段排列的课程路径，每阶段3-5门课程"
        }
      ],
      "dependencies": ["F001"],
      "related_pages": ["P001"],
      "related_entities": ["E001"]
    }
  ],
  "pages": [
    {
      "page_id": "P001",
      "name": "推荐首页",
      "route": "/recommend",
      "description": "展示个性化推荐课程和学习路径入口，支持刷新、反馈和分类筛选",
      "data_requirements": [
        {
          "data_name": "个性化推荐课程列表",
          "source": "api",
          "data_operations": ["read"],
          "related_entity": "E001",
          "fields": ["course_id", "title", "cover_url", "duration", "level", "match_score", "recommend_reason"],
          "description": "从推荐服务获取个性化课程列表，按匹配度降序排列"
        },
        {
          "data_name": "学习路径列表",
          "source": "api",
          "data_operations": ["read"],
          "related_entity": "E001",
          "fields": ["path_id", "path_name", "stage_count", "course_count", "progress"],
          "description": "获取学员已订阅和推荐的学习路径列表"
        },
        {
          "data_name": "学员偏好标签",
          "source": "cache",
          "data_operations": ["read"],
          "related_entity": "E002",
          "fields": ["user_id", "interest_tags", "career_goal", "current_level"],
          "description": "从本地缓存读取学员偏好，用于推荐解释展示"
        }
      ],
      "functional_areas": ["推荐课程瀑布流", "学习路径入口", "分类筛选", "反馈操作"],
      "user_flows": ["UF001"],
      "states": [
        {
          "state_name": "加载中",
          "description": "首次进入或刷新时展示骨架屏",
          "triggers": ["页面进入", "下拉刷新"]
        },
        {
          "state_name": "推荐为空",
          "description": "学员无学习历史时展示引导内容",
          "triggers": ["推荐结果为空"]
        },
        {
          "state_name": "正常展示",
          "description": "展示推荐课程列表和学习路径",
          "triggers": ["推荐数据加载完成"]
        }
      ]
    },
    {
      "page_id": "P002",
      "name": "课程详情页",
      "route": "/courses/:courseId",
      "description": "展示课程完整信息、章节目录、讲师介绍，支持立即学习和加入路径",
      "data_requirements": [
        {
          "data_name": "课程详情",
          "source": "api",
          "data_operations": ["read"],
          "related_entity": "E001",
          "fields": ["course_id", "title", "description", "cover_url", "duration", "level", "price", "instructor", "chapters", "rating", "enrolled_count"],
          "description": "获取课程完整信息，包含章节目录和讲师信息"
        },
        {
          "data_name": "学员学习进度",
          "source": "api",
          "data_operations": ["read", "update"],
          "related_entity": "E002",
          "fields": ["user_id", "course_id", "progress", "last_lesson_id", "completed_lessons"],
          "description": "获取学员在该课程的学习进度，支持更新"
        }
      ],
      "functional_areas": ["课程信息展示", "章节目录", "讲师介绍", "学习操作", "相关推荐"],
      "user_flows": ["UF001"],
      "states": [
        {
          "state_name": "未开始学习",
          "description": "展示「开始学习」按钮",
          "triggers": ["学员未学习该课程"]
        },
        {
          "state_name": "学习中",
          "description": "展示「继续学习」按钮和上次学习位置",
          "triggers": ["学员已开始但未完成"]
        },
        {
          "state_name": "已完成",
          "description": "展示「复习」按钮和完课证书入口",
          "triggers": ["学员已完成全部章节"]
        }
      ]
    }
  ],
  "entities": [
    {
      "entity_id": "E001",
      "name": "Course",
      "description": "课程实体，包含课程基本信息、章节、难度和推荐元数据",
      "fields": [
        {
          "field_name": "course_id",
          "type": "string",
          "required": true,
          "description": "课程唯一标识",
          "constraints": "UUID格式"
        },
        {
          "field_name": "title",
          "type": "string",
          "required": true,
          "description": "课程标题",
          "constraints": "最大长度100字符"
        },
        {
          "field_name": "description",
          "type": "text",
          "required": true,
          "description": "课程描述",
          "constraints": "最大长度2000字符"
        },
        {
          "field_name": "cover_url",
          "type": "string",
          "required": true,
          "description": "课程封面图URL",
          "constraints": "HTTPS链接"
        },
        {
          "field_name": "duration",
          "type": "integer",
          "required": true,
          "description": "课程总时长（分钟）",
          "constraints": "大于0"
        },
        {
          "field_name": "level",
          "type": "enum",
          "required": true,
          "description": "课程难度",
          "constraints": "枚举值：beginner/intermediate/advanced"
        },
        {
          "field_name": "status",
          "type": "enum",
          "required": true,
          "description": "课程状态",
          "constraints": "枚举值：draft/published/offline"
        },
        {
          "field_name": "instructor_id",
          "type": "string",
          "required": true,
          "description": "讲师ID",
          "constraints": "关联讲师表"
        },
        {
          "field_name": "tags",
          "type": "array",
          "required": false,
          "description": "课程标签",
          "constraints": "字符串数组，最多10个"
        },
        {
          "field_name": "match_score",
          "type": "number",
          "required": false,
          "description": "推荐匹配度评分",
          "constraints": "0-1.0，由推荐服务计算"
        }
      ],
      "relationships": [
        {
          "target_entity_id": "E002",
          "type": "many_to_many",
          "description": "一个课程可被多个学员学习，一个学员可学习多个课程"
        }
      ],
      "api_endpoints": [
        {
          "method": "GET",
          "path": "/api/v1/courses/:courseId",
          "description": "获取课程详情"
        },
        {
          "method": "GET",
          "path": "/api/v1/recommend/courses",
          "description": "获取个性化推荐课程列表"
        },
        {
          "method": "POST",
          "path": "/api/v1/recommend/feedback",
          "description": "提交推荐反馈（不感兴趣等）"
        }
      ]
    },
    {
      "entity_id": "E002",
      "name": "User",
      "description": "学员实体，包含学员基本信息、学习偏好和学习进度",
      "fields": [
        {
          "field_name": "user_id",
          "type": "string",
          "required": true,
          "description": "学员唯一标识",
          "constraints": "UUID格式"
        },
        {
          "field_name": "nickname",
          "type": "string",
          "required": true,
          "description": "学员昵称",
          "constraints": "最大长度30字符"
        },
        {
          "field_name": "career_goal",
          "type": "string",
          "required": false,
          "description": "职业方向",
          "constraints": "如：前端工程师/产品经理"
        },
        {
          "field_name": "current_level",
          "type": "enum",
          "required": false,
          "description": "当前学习水平",
          "constraints": "枚举值：beginner/intermediate/advanced"
        },
        {
          "field_name": "interest_tags",
          "type": "array",
          "required": false,
          "description": "兴趣标签",
          "constraints": "字符串数组，最多20个"
        },
        {
          "field_name": "status",
          "type": "enum",
          "required": true,
          "description": "学员状态",
          "constraints": "枚举值：active/inactive/banned"
        },
        {
          "field_name": "registered_at",
          "type": "datetime",
          "required": true,
          "description": "注册时间",
          "constraints": "ISO8601格式"
        },
        {
          "field_name": "last_active_at",
          "type": "datetime",
          "required": true,
          "description": "最后活跃时间",
          "constraints": "ISO8601格式"
        }
      ],
      "relationships": [
        {
          "target_entity_id": "E001",
          "type": "many_to_many",
          "description": "一个学员可学习多个课程，一个课程可被多个学员学习"
        }
      ],
      "api_endpoints": [
        {
          "method": "GET",
          "path": "/api/v1/users/:userId/profile",
          "description": "获取学员画像信息"
        },
        {
          "method": "PATCH",
          "path": "/api/v1/users/:userId/preferences",
          "description": "更新学员偏好（职业方向、兴趣标签）"
        }
      ]
    }
  ],
  "user_flows": [
    {
      "flow_id": "UF001",
      "name": "查看推荐课程",
      "description": "学员从推荐首页浏览个性化推荐课程，进入课程详情页查看完整信息并开始学习",
      "entry_page": "P001",
      "steps": [
        {
          "step_id": "S001",
          "action": "进入推荐首页",
          "page_id": "P001",
          "expected_outcome": "展示个性化推荐课程列表和学习路径入口",
          "error_handling": "网络异常时展示缓存数据并提示「网络异常，展示为历史数据」"
        },
        {
          "step_id": "S002",
          "action": "浏览推荐课程并点击感兴趣的卡片",
          "page_id": "P001",
          "expected_outcome": "跳转到课程详情页",
          "error_handling": null
        },
        {
          "step_id": "S003",
          "action": "查看课程详情、章节目录",
          "page_id": "P002",
          "expected_outcome": "展示课程完整信息和章节列表",
          "error_handling": "课程已下线时展示「课程已下线」提示并返回推荐首页"
        },
        {
          "step_id": "S004",
          "action": "点击「开始学习」或「继续学习」",
          "page_id": "P002",
          "expected_outcome": "进入课程学习页开始或继续学习",
          "error_handling": "未登录时跳转登录页，登录后返回原页面"
        }
      ],
      "alternative_paths": [
        {
          "condition": "学员对推荐课程不感兴趣",
          "steps": ["S002"]
        },
        {
          "condition": "学员选择学习路径而非单门课程",
          "steps": ["S001"]
        }
      ]
    }
  ],
  "non_functional_requirements": {
    "performance": [
      {
        "requirement": "推荐列表接口响应时间",
        "metric": "P95响应时间",
        "target": "≤500ms"
      },
      {
        "requirement": "推荐首页首屏渲染时间",
        "metric": "首屏FCP",
        "target": "≤1.5s"
      }
    ],
    "availability": [
      {
        "requirement": "推荐服务可用性",
        "metric": "服务可用率",
        "target": "≥99.9%",
        "measurement": "按月统计，监控API成功率"
      },
      {
        "requirement": "推荐服务降级能力",
        "metric": "降级触发时间",
        "target": "推荐服务异常时3秒内降级为热门课程",
        "measurement": "故障演练验证"
      }
    ],
    "security": [
      {
        "category": "authorization",
        "requirement": "学员只能查看自己的学习进度和推荐",
        "implementation": "基于JWT的鉴权，接口层校验user_id与token一致性"
      },
      {
        "category": "compliance",
        "requirement": "推荐算法需符合个人信息保护法",
        "implementation": "不收集非必要个人信息，提供推荐偏好关闭入口"
      }
    ],
    "observability": [
      {
        "dimension": "metrics",
        "indicator": "推荐点击率、推荐转化率、推荐服务错误率",
        "alert_threshold": "错误率>1%持续5分钟触发告警"
      },
      {
        "dimension": "logs",
        "indicator": "推荐请求与响应日志",
        "alert_threshold": "异常响应（非200）数量>50/分钟触发告警"
      }
    ]
  },
  "tracking_plan": {
    "events": [
      {
        "event_id": "EV001",
        "event_name": "recommend_click",
        "trigger": "学员点击推荐首页的课程卡片",
        "properties": [
          {
            "property_name": "course_id",
            "type": "string",
            "required": true
          },
          {
            "property_name": "recommend_reason",
            "type": "string",
            "required": true
          },
          {
            "property_name": "match_score",
            "type": "number",
            "required": true
          },
          {
            "property_name": "position",
            "type": "integer",
            "required": true
          }
        ],
        "related_metric": "推荐课程点击率"
      },
      {
        "event_id": "EV002",
        "event_name": "course_view",
        "trigger": "学员进入课程详情页",
        "properties": [
          {
            "property_name": "course_id",
            "type": "string",
            "required": true
          },
          {
            "property_name": "source",
            "type": "string",
            "required": true
          },
          {
            "property_name": "view_duration",
            "type": "integer",
            "required": false
          }
        ],
        "related_metric": "课程详情页浏览量"
      },
      {
        "event_id": "EV003",
        "event_name": "recommend_feedback",
        "trigger": "学员对推荐课程提交「不感兴趣」反馈",
        "properties": [
          {
            "property_name": "course_id",
            "type": "string",
            "required": true
          },
          {
            "property_name": "feedback_type",
            "type": "string",
            "required": true
          }
        ],
        "related_metric": "推荐满意度"
      }
    ],
    "validation": {
      "coverage_target": 0.95,
      "data_delay_threshold": "T+1天"
    }
  },
  "traceability": [
    {
      "feature_id": "F001",
      "goal_id": "G001",
      "upstream_source": "opportunity_definition",
      "upstream_artifact_id": "OPP-2025-05-003"
    },
    {
      "feature_id": "F002",
      "goal_id": "G001",
      "upstream_source": "insight_analysis",
      "upstream_artifact_id": "INS-2025-05-007"
    },
    {
      "feature_id": "F001",
      "goal_id": "G001",
      "upstream_source": "okr_candidates",
      "upstream_artifact_id": "KR2.1"
    }
  ]
}
```

## 示例说明

### 7 个顶层数组覆盖情况

| 顶层数组 | 示例数量 | 说明 |
|----------|----------|------|
| features | 2 | 个性化推荐（must）、学习路径推荐（should） |
| pages | 2 | 推荐首页、课程详情页 |
| entities | 2 | Course、User，均包含完整 fields 和 relationships |
| user_flows | 1 | 查看推荐课程（含 4 个步骤和 2 条替代路径） |
| non_functional_requirements | 4 维度 | performance（2）、availability（2）、security（2）、observability（2） |
| tracking_plan | 3 个事件 | recommend_click、course_view、recommend_feedback |
| traceability | 3 条追溯关系 | 功能点→目标、功能点→机会定义、功能点→OKR |

### 引用一致性自检

- `features[0].related_pages` 中的 `P001`、`P002` 在 `pages[]` 中存在 ✓
- `features[0].related_entities` 中的 `E001`、`E002` 在 `entities[]` 中存在 ✓
- `pages[0].user_flows` 中的 `UF001` 在 `user_flows[]` 中存在 ✓
- `user_flows[0].entry_page` 为 `P001`，在 `pages[]` 中存在 ✓
- `user_flows[0].steps[].page_id` 为 `P001`、`P002`，均在 `pages[]` 中存在 ✓
- `traceability[].feature_id` 为 `F001`、`F002`，均在 `features[]` 中存在 ✓
- `traceability[].goal_id` 为 `G001`，在 `goals[]` 中存在 ✓
