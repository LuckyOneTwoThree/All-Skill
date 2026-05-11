---
name: tracking-plan
description: 当需要生成埋点方案时使用。埋点方案自动生成，包含从指标体系反推埋点需求、PRD功能埋点提取、埋点质量检查、PRD一致性校验。关键词：埋点方案、事件设计、属性设计、埋点规范、Tracking Plan、数据采集。
metadata:
  module: "产品度量设计"
  sub-module: "埋点方案"
  type: "pipeline"
  version: "1.0"
  interaction_mode: "ai_suggest_human_approve"
---

# Pipeline 2: 埋点方案自动生成

## 核心原则

1. **全量分析**：对所有可用数据进行系统性分析，不遗漏关键维度
2. **实时感知**：指标体系设计支持实时监控和快速响应
3. **自动归因**：异常波动自动归因到具体原因，减少人工排查
4. **决策规则显式化**：每个告警和升级条件都有明确的量化规则

## 交互模式

**🤖→👤 AI建议，人类审批**

本Pipeline由AI自动生成埋点方案，但关键决策点需要人类审批：
- **必须审批**：埋点业务逻辑正确性
- **必须审批**：隐私合规性
- **建议审批**：埋点优先级调整

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| PRD | string/文件 | 是 | 用户提供 | PRD文档内容（含功能描述、用户流程、核心路径、业务规则） |
| 指标体系 | JSON | 是 | output/pm-metrics-design/metrics-system/metric_system.json | 北极星指标、L1/L2/行动指标 |
| 现有埋点清单 | JSON数组 | ○ | 用户提供 | 已有埋点事件清单 |

### PRD（必填）

**PRD文档内容**，包含：
- 产品功能描述
- 用户流程说明
- 核心路径定义
- 业务规则说明

**格式支持**：
- Markdown格式
- Word文档
- 结构化JSON
- 原型图+说明

---

### 指标体系（来自Pipeline 1）

```json
{
  "north_star": {
    "name": "string",
    "calculation": "string"
  },
  "l1_metrics": [...],
  "l2_metrics": [...],
  "actionable_metrics": [...]
}
```

---

### 现有埋点清单（可选）

```json
[
  {
    "event_name": "string",
    "trigger": "string",
    "properties": [
      {
        "name": "string",
        "type": "string"
      }
    ],
    "last_modified": "2026-01-01"
  }
]
```

---

## 执行步骤

### Step 1: 从指标体系反推埋点需求

**🤖 AI处理**

**处理逻辑**：

```
FOR each metric in metric_system:
  1. 分析指标计算所需的数据要素
  2. 识别需要采集的用户行为
  3. 定义对应的埋点事件
  4. 列出必需的埋点属性
```

**反推映射表**：

| 指标类型 | 所需行为数据 | 埋点事件示例 |
|---------|------------|-------------|
| 转化率指标 | 页面/功能曝光+点击 | page_view + button_click |
| 频次指标 | 行为发生次数 | feature_use |
| 时长指标 | 行为开始+结束时间 | session_start + session_end |
| 质量指标 | 行为结果+评价 | action_result + feedback |
| 覆盖率指标 | 功能使用+未使用对比 | feature_use vs non_use |

**输出**：

```json
{
  "metrics_to_track": [
    {
      "metric_name": "string",
      "required_behavior": "string",
      "proposed_event": {
        "event_name": "string",
        "trigger": "string",
        "required_properties": ["string"]
      }
    }
  ]
}
```

---

### Step 2: 从PRD提取功能埋点需求

**🤖 AI处理**

**处理逻辑**：

```
1. 解析PRD文档结构
2. 识别功能模块列表
3. 提取核心用户路径
4. 识别关键交互节点
5. 定义功能埋点事件
```

**PRD解析维度**：

#### 2.1 功能模块识别

```
识别PRD中的功能模块 → 定义模块级埋点
```

**示例**：

| PRD功能模块 | 埋点命名空间 | 埋点事件示例 |
|-----------|------------|-------------|
| 用户认证 | user_auth | login_success, logout, register_complete |
| 商品浏览 | product_browse | product_view, product_list_view, search |
| 购物车 | cart | add_to_cart, remove_from_cart, cart_view |
| 订单流程 | order | checkout_start, payment_success, order_complete |
| 用户中心 | user_center | profile_view, settings_view |

---

#### 2.2 核心用户路径提取

```
识别PRD描述的用户流程 → 定义路径埋点
```

**示例流程**（电商）：

```
注册/登录 → 首页浏览 → 商品搜索/分类 → 商品详情 → 加入购物车 → 结算支付 → 订单完成
```

**路径埋点设计**：
```json
{
  "user_journey": "注册→浏览→搜索→详情→加购→结算→支付→完成",
  "touchpoints": [
    "register_success",
    "homepage_view",
    "product_list_view",
    "product_detail_view",
    "add_to_cart",
    "cart_view",
    "checkout_start",
    "payment_page_view",
    "payment_success",
    "order_complete"
  ]
}
```

---

#### 2.3 关键交互节点识别

```
识别PRD中的交互细节 → 定义交互埋点
```

**交互类型**：

| 交互类型 | 触发时机 | 埋点属性 |
|---------|---------|---------|
| 按钮点击 | 点击动作发生时 | button_name, page_name, position |
| 表单提交 | 表单提交成功时 | form_name, submit_result, error_type |
| 滑动手势 | 滑动结束时 | swipe_direction, swipe_distance |
| 输入行为 | 输入完成时 | input_field, input_length, input_type |
| 切换操作 | 切换完成时 | switch_from, switch_to, switch_type |

---

### Step 3: 与现有埋点去重

**🤖 AI处理**

**去重逻辑**：

```
FOR each proposed_event:
  1. 在现有埋点清单中查找相似事件
  2. 计算相似度得分
  3. IF 相似度 > 0.8 THEN 标记为重复
  4. ELSE IF 相似度 > 0.5 THEN 标记为需人工确认
  5. ELSE 标记为新增埋点
```

**相似度计算规则**：

```
相似度 = α × 命名相似度 + β × 触发时机相似度 + γ × 属性相似度

其中：
  - 命名相似度：基于字符串匹配和语义分析
  - 触发时机相似度：基于trigger描述的语义距离
  - 属性相似度：基于共同属性的Jaccard系数

权重建议：
  - α = 0.4
  - β = 0.3
  - γ = 0.3
```

**去重结果输出**：

```json
{
  "deduplication_result": {
    "new_events": [...],        // 新增埋点
    "duplicate_events": [...],   // 重复埋点（可复用现有）
    "similar_events": [...],     // 相似埋点（需人工确认）
    "updated_events": [...]      // 现有埋点需更新属性
  }
}
```

---

### Step 4: 埋点质量检查

**🤖 AI处理**

#### 4.1 命名规范检查

**命名规则**：

```
事件命名：全部小写 + 下划线分隔
  示例：user_login_success, product_add_to_cart

属性命名：全部小写 + 下划线分隔
  示例：user_id, product_price, page_name
```

**检查项**：

| 检查项 | 规则 | 通过条件 |
|-------|------|---------|
| 字母规范 | 仅允许a-z、0-9、下划线 | 无大写字母、无特殊字符 |
| 分隔规范 | 使用下划线分隔语义单元 | 非驼峰、非连字符 |
| 完整性 | 包含主体_动作_对象 | 至少3个语义单元 |
| 无缩写 | 避免不规范的缩写 | 常见缩写需在规范中定义 |

**检查输出**：

```json
{
  "naming_check": {
    "total_events": 100,
    "passed": 95,
    "failed": 5,
    "issues": [
      {
        "event_name": "UserLoginSuccess",
        "issue": "包含大写字母",
        "suggestion": "user_login_success"
      }
    ]
  }
}
```

---

#### 4.2 属性完整性检查

**核心属性定义**：

| 属性类型 | 属性名 | 必需 | 说明 |
|---------|-------|------|------|
| 通用属性 | user_id | 是 | 用户唯一标识 |
| 通用属性 | session_id | 是 | 会话唯一标识 |
| 通用属性 | timestamp | 是 | 事件发生时间 |
| 通用属性 | platform | 是 | 平台类型 |
| 通用属性 | app_version | 是 | App版本号 |
| 页面属性 | page_name | 是 | 页面名称 |
| 页面属性 | page_url | 是 | 页面URL |
| 设备属性 | device_type | 是 | 设备类型 |
| 设备属性 | os_version | 是 | 操作系统版本 |

**检查规则**：

```
FOR each event:
  1. 验证核心通用属性是否完整
  2. 验证特定事件类型的必需属性
  3. 计算属性完整率
  4. IF 完整率 < 80% THEN 标记为不通过
```

**检查输出**：

```json
{
  "completeness_check": {
    "total_events": 100,
    "core_attributes_coverage": 0.95,
    "events_with_full_attributes": 92,
    "events_needing_review": [
      {
        "event_name": "product_view",
        "missing_attributes": ["product_category", "source_page"],
        "completeness_rate": 0.70
      }
    ]
  }
}
```

---

#### 4.3 核心路径覆盖检查

**核心路径定义**：

```
基于指标体系和PRD，定义必须覆盖的核心用户路径
```

**覆盖要求**：

```
核心路径覆盖率 ≥ 90%
```

**检查逻辑**：

```python
def check_core_path_coverage():
    core_paths = get_core_paths_from_prd()
    covered_paths = get_covered_paths_from_tracking()
    
    coverage_rate = len(covered_paths & core_paths) / len(core_paths)
    
    return {
        "total_core_paths": len(core_paths),
        "covered_paths": len(covered_paths & core_paths),
        "uncovered_paths": core_paths - covered_paths,
        "coverage_rate": coverage_rate,
        "pass": coverage_rate >= 0.9
    }
```

**检查输出**：

```json
{
  "core_path_coverage": {
    "total_paths": 10,
    "covered": 9,
    "uncovered": ["path_to_checkout"],
    "coverage_rate": 0.90,
    "status": "pass"
  }
}
```

---

#### 4.4 异常状态覆盖检查

**异常状态定义**：

| 异常类型 | 异常场景 | 埋点需求 |
|---------|---------|---------|
| 加载异常 | 页面/接口加载失败 | error_view, api_error |
| 表单异常 | 表单验证失败、提交失败 | form_error, submit_failed |
| 支付异常 | 支付失败、取消支付 | payment_failed, payment_cancelled |
| 权限异常 | 无权限访问 | permission_denied |
| 网络异常 | 断网、超时 | network_error, timeout |

**检查规则**：

```
FOR each core_flow:
  1. 识别该流程中的异常分支
  2. 检查是否有对应异常埋点
  3. IF 异常场景无埋点 THEN 添加警告
```

**检查输出**：

```json
{
  "anomaly_coverage": {
    "total_anomaly_scenarios": 15,
    "covered_scenarios": 14,
    "missing_scenarios": [
      {
        "scenario": "搜索结果为空",
        "flow": "search",
        "suggested_event": "search_no_result"
      }
    ],
    "coverage_rate": 0.93
  }
}
```

---

#### 4.5 冗余检测

**冗余规则**：

```
IF 存在以下任一情况 THEN 标记为冗余埋点：
  - 两个事件采集完全相同的数据
  - 父子事件数据重复（父事件已包含子事件数据）
  - 统计口径完全一致的事件重复定义
```

**检测输出**：

```json
{
  "redundancy_check": {
    "duplicates": [
      {
        "event_a": "page_view",
        "event_b": "screen_show",
        "reason": "两者采集相同数据（页面曝光）",
        "recommendation": "保留page_view，删除screen_show"
      }
    ],
    "total_redundant": 1
  }
}
```

---

### Step 5: 生成埋点文档

**🤖 AI处理**

**文档结构**：

```json
{
  "tracking_document": {
    "version": "1.0",
    "generated_date": "2026-05-08",
    "overview": {
      "total_events": 100,
      "new_events": 30,
      "updated_events": 10,
      "existing_events": 60
    },
    "events": [
      {
        "event_name": "string",
        "display_name": "string",
        "trigger": {
          "description": "string",
          "timing": "on_action|immediate|on_exit",
          "conditions": ["string"]
        },
        "properties": [
          {
            "name": "string",
            "type": "string|string[]|number|boolean",
            "required": true,
            "description": "string",
            "example": "string"
          }
        ],
        "analysis_purpose": "string",
        "linked_metric": "string",
        "priority": "high|medium|low",
        "status": "pending|approved|implemented",
        "source": "metrics_prd|existing|new"
      }
    ]
  }
}
```

---

### Step 6: PRD埋点方案一致性校验

**🤖 AI处理**

#### 6.1 双向校验机制

**正向校验**：PRD功能 → 埋点覆盖

```
FOR each functional_requirement in PRD:
  1. 识别该功能对应的埋点
  2. IF 埋点缺失 THEN 标记为未覆盖
  3. 计算正向覆盖率
```

**逆向校验**：埋点 → PRD功能

```
FOR each tracking_event:
  1. 识别该埋点支持的功能分析
  2. IF 功能不在PRD中 THEN 标记为额外埋点
  3. 计算逆向覆盖率
```

---

#### 6.2 PRD特征提取

**特征类型**：

| 特征类型 | 识别关键词 | 埋点需求 |
|---------|-----------|---------|
| 页面 | 页面、模块、Tab | page_view + 页面属性 |
| 按钮 | 点击、按下、触发 | button_click + 按钮属性 |
| 表单 | 填写、输入、提交 | input + form_submit |
| 列表 | 列表、浏览、翻页 | list_view + item_click |
| 详情 | 详情、查看、内容 | detail_view + 详情属性 |
| 流程 | 流程、步骤、完成 | flow_start + flow_complete |
| 异常 | 失败、错误、超时 | error + 错误详情 |

---

#### 6.3 一致性评分

**评分规则**：

```python
def calculate_prd_consistency_score():
    forward_coverage = calculate_forward_coverage()  # PRD→埋点
    backward_coverage = calculate_backward_coverage()  # 埋点→PRD
    
    consistency_score = (
        0.6 * forward_coverage +  # 正向权重60%
        0.4 * backward_coverage   # 逆向权重40%
    )
    
    return {
        "forward_coverage": forward_coverage,
        "backward_coverage": backward_coverage,
        "consistency_score": consistency_score,
        "status": "pass" if consistency_score >= 0.9 else "fail"
    }
```

---

#### 6.4 持续校验机制

**触发时机**：

| 触发类型 | 触发条件 | 校验内容 |
|---------|---------|---------|
| PRD变更触发 | PRD文档更新 | 新增功能是否已埋点 |
| 埋点变更触发 | 埋点方案更新 | 变更是否影响PRD覆盖 |
| 定期校验 | 每周/每月 | 全量一致性检查 |
| 上线前校验 | 发布前 | 变更部分专项校验 |

**校验输出**：

```json
{
  "prd_consistency": {
    "forward_coverage": 0.92,
    "backward_coverage": 0.88,
    "consistency_score": 0.90,
    "status": "pass",
    "discrepancies": [
      {
        "type": "uncovered_function",
        "description": "商品分享功能未配置埋点",
        "prd_reference": "PRD章节3.2",
        "severity": "high",
        "suggested_event": "product_share"
      }
    ]
  }
}
```

---

## 输出

**存储路径**：`output/pm-metrics-design/tracking-plan/`

**输出文件**：`tracking_plan.json`

**输出Schema**：

```json
{
  "type": "object",
  "required": ["tracking_plan", "quality_check"],
  "properties": {
    "tracking_plan": {"type": "array", "description": "埋点事件列表，包含事件定义、属性、触发条件等"},
    "quality_check": {"type": "object", "description": "质量检查结果，包含命名合规性、属性完整性、路径覆盖率等"}
  }
}
```

### tracking_plan

```json
{
  "tracking_plan": [
    {
      "event_name": "string",
      "display_name": "string",
      "trigger": {
        "description": "string",
        "timing": "on_action|immediate|on_exit",
        "conditions": ["string"]
      },
      "properties": [
        {
          "name": "string",
          "type": "string|string[]|number|boolean",
          "required": true,
          "description": "string",
          "example": "string"
        }
      ],
      "analysis_purpose": "string",
      "linked_metric": "string",
      "priority": "high|medium|low",
      "status": "pending|approved|implemented"
    }
  ],
  "quality_check": {
    "naming_compliance": true,
    "property_completeness": 0.95,
    "core_path_coverage": 0.92,
    "anomaly_coverage": true,
    "redundancy_detected": [],
    "prd_consistency": {
      "forward_coverage": 0.92,
      "backward_coverage": 0.88,
      "consistency_score": 0.90,
      "status": "pass"
    }
  }
}
```

---

## 决策规则

### 规则1：埋点方案需人类审核业务逻辑

**触发条件**：
- 所有埋点方案生成完成后
- 任何业务逻辑相关的埋点

**审核要点**：

#### 业务逻辑正确性

```
1. 埋点触发时机是否符合业务预期
2. 埋点属性是否准确反映业务语义
3. 埋点与分析目的是否匹配
4. 跨流程埋点逻辑是否一致
```

#### 特殊场景确认

```
1. 异步操作埋点时机
2. 重试/失败场景埋点
3. 边界条件埋点
4. A/B测试相关埋点
```

---

### 规则2：隐私合规性必须人类确认

**触发条件**：
- 埋点涉及用户个人信息
- 埋点涉及设备信息
- 埋点涉及行为数据

**审核清单**：

| 审核项 | 说明 | 通过条件 |
|-------|------|---------|
| 个人信息标识 | 埋点是否采集PII | 脱敏或匿名化处理 |
| 敏感信息 | 是否采集银行卡、密码等 | 明确禁止采集 |
| 数据保留 | 数据保留期限 | 符合法规要求 |
| 用户授权 | 是否获取用户同意 | 符合隐私政策 |

---

## 质量检查

### 质量检查清单

#### ✅ 命名规范通过

**检查标准**：
- [ ] 所有事件名使用小写+下划线
- [ ] 所有属性名使用小写+下划线
- [ ] 无驼峰命名
- [ ] 无特殊字符
- [ ] 语义单元完整

**失败处理**：
```
IF 命名规范未通过:
  1. 自动修复命名问题
  2. 生成命名修复报告
  3. 标记需人工确认
```

---

#### ✅ 核心路径覆盖≥90%

**检查标准**：
- [ ] 核心用户路径覆盖≥90%
- [ ] 关键转化节点覆盖完整
- [ ] 异常路径覆盖≥80%

**失败处理**：
```
IF 核心路径覆盖不足:
  1. 识别未覆盖的路径
  2. 补充推荐埋点方案
  3. 调整质量标准或补充埋点
```

---

#### ✅ PRD一致性≥90%

**检查标准**：
- [ ] 正向覆盖率≥90%（PRD→埋点）
- [ ] 逆向覆盖率≥85%（埋点→PRD）
- [ ] 综合一致性≥90%

**失败处理**：
```
IF PRD一致性不足:
  1. 列出所有不一致的功能点
  2. 评估不一致原因
  3. 补充缺失埋点或调整PRD
  4. 记录差异原因
```

---

## 降级策略

### 上游文件缺失降级方案

| 缺失范围 | 降级方案 | 输出影响 |
|----------|----------|----------|
| PRD缺失 | 提示用户提供功能列表，基于功能列表生成基础埋点方案 | 无法提取用户流程和交互细节，埋点覆盖可能不完整 |
| 指标体系缺失 | 跳过指标反推埋点步骤，仅基于PRD功能提取埋点需求 | 埋点与指标关联缺失，分析目的标注"待补充" |
| 现有埋点清单缺失 | 跳过去重步骤，所有埋点标记为新增 | 可能产生冗余埋点，需后续人工去重 |
| PRD + 指标体系 + 现有埋点清单均缺失 | 用户提供功能列表 → 基于功能生成基础埋点方案 | 输出基础埋点方案，标注"待补充"和"待确认" |

### 数据获取说明

当上游文件缺失时，需用户提供以下信息以支撑降级生成：
- **功能列表**：产品包含的核心功能模块和功能点
- **核心用户路径**（可选）：用户使用产品的主要流程步骤
- **关键交互节点**（可选）：需要追踪的用户交互行为

---

## 升级路径

### 升级触发条件

当以下任一条件满足时，升级到人工处理：

1. **PRD解析失败**
   - PRD文档格式无法解析
   - PRD内容与结构化要求差距过大

2. **埋点冲突无法自动解决**
   - 相似埋点>5个无法判断
   - 命名冲突无法自动消解

3. **隐私合规风险**
   - 埋点涉及高敏感信息
   - 合规边界不明确

---

### 升级输出

```json
{
  "escalation": {
    "trigger": "string",
    "reason": "string",
    "affected_events": ["string"],
    "ai_recommendation": {},
    "requires_human_action": true,
    "human_decision_needed": [
      "业务逻辑确认",
      "隐私合规确认",
      "埋点优先级调整"
    ]
  }
}
```

---

## 执行示例

### 示例输入

```json
{
  "prd_document": "# 电商App PRD\n\n## 核心功能\n1. 用户登录注册\n2. 商品浏览与搜索\n3. 购物车管理\n4. 订单支付\n5. 个人信息管理\n\n## 核心路径\n新用户注册 → 商品浏览 → 加入购物车 → 结算支付 → 订单完成",
  "metric_system": {
    "north_star": {
      "name": "月GMV",
      "calculation": "sum(order_amount)"
    },
    "l1_metrics": [
      {
        "layer": "Activation",
        "name": "新用户激活",
        "l2_metrics": [
          {"name": "首次下单转化率"}
        ]
      }
    ]
  },
  "existing_tracking": [
    {
      "event_name": "user_login",
      "trigger": "登录成功"
    }
  ]
}
```

### 示例输出

```json
{
  "tracking_plan": [
    {
      "event_name": "register_success",
      "display_name": "注册成功",
      "trigger": {
        "description": "用户完成注册流程",
        "timing": "immediate",
        "conditions": ["注册表单提交成功"]
      },
      "properties": [
        {
          "name": "register_channel",
          "type": "string",
          "required": true,
          "description": "注册渠道",
          "example": "phone|email|third_party"
        },
        {
          "name": "register_source",
          "type": "string",
          "required": true,
          "description": "来源页面",
          "example": "splash|landing_page"
        }
      ],
      "analysis_purpose": "分析注册转化率和渠道效果",
      "linked_metric": "Activation",
      "priority": "high",
      "status": "pending"
    },
    {
      "event_name": "product_view",
      "display_name": "商品详情浏览",
      "trigger": {
        "description": "用户进入商品详情页",
        "timing": "immediate",
        "conditions": ["商品ID有效"]
      },
      "properties": [
        {
          "name": "product_id",
          "type": "string",
          "required": true,
          "description": "商品ID"
        },
        {
          "name": "product_name",
          "type": "string",
          "required": true,
          "description": "商品名称"
        },
        {
          "name": "category",
          "type": "string",
          "required": true,
          "description": "商品类目"
        },
        {
          "name": "price",
          "type": "number",
          "required": true,
          "description": "商品价格"
        }
      ],
      "analysis_purpose": "分析商品曝光和用户偏好",
      "linked_metric": "月GMV",
      "priority": "high",
      "status": "pending"
    }
  ],
  "quality_check": {
    "naming_compliance": true,
    "property_completeness": 0.95,
    "core_path_coverage": 0.90,
    "anomaly_coverage": true,
    "redundancy_detected": [],
    "prd_consistency": {
      "forward_coverage": 0.92,
      "backward_coverage": 0.88,
      "consistency_score": 0.90,
      "status": "pass"
    }
  }
}
```

---

## 性能指标

### 处理时间

- **Step 1（指标反推）**：≤10秒
- **Step 2（PRD提取）**：≤15秒
- **Step 3（去重处理）**：≤10秒
- **Step 4（质量检查）**：≤10秒
- **Step 5（文档生成）**：≤5秒
- **Step 6（一致性校验）**：≤10秒

**总处理时间**：≤60秒

### 准确性目标

- 埋点需求识别准确率：≥90%
- PRD功能覆盖率：≥90%
- 命名规范通过率：≥95%

### 覆盖率目标

- 核心路径覆盖：≥90%
- 异常状态覆盖：≥80%
- PRD一致性：≥90%
