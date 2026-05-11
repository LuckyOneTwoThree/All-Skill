---
name: design-prototype
description: 当需要基于IA和用户流程生成原型时使用。原型自动生成，基于IA方案和User Flow自动生成低保真和中保真原型，包含设计规范检查和可用性启发式评估。适用于快速原型验证和设计稿生成。关键词：原型设计、低保真原型、中保真原型、设计规范、原型生成。
metadata:
  module: "产品构思与设计"
  sub-module: "产品设计与原型"
  type: "pipeline"
  version: "2.0"
  interaction_mode: "ai_suggest_human_approve"
---

# Pipeline 11: 原型自动生成

## 核心原则

1. **原型是沟通工具，不是最终产品**：原型的价值在于快速验证假设，而非像素级还原
2. **保真度按需递进**：先低保真验证结构，再中保真验证交互，不跳步
3. **批量生成人类筛选**：AI批量生成原型方案，人类做最终筛选和判定
4. **一致性可量化**：设计规范一致性用分数衡量，<85%需人类确认

🤖→👤 AI建议 → 人类审批

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| IA方案 | JSON | 是 | output/pm-design/design-ia/ia_proposals.json | Pipeline 9输出的信息架构方案 |
| User Flow | JSON | 是 | output/pm-design/design-userflow/userflow.json | Pipeline 10输出的用户流程 |
| 设计系统规范 | JSON/object | ○ | 用户提供 | 设计系统组件和规范定义 |
| 设计令牌 | JSON | ○ | output/pm-design/design-token/tokens.json | 设计变量定义，用于设计规范一致性检查 |

## 执行步骤

### Step 1: 低保真原型生成

生成线框图级别的原型描述：

- **布局**: 页面结构与区域划分
- **组件类型**: 按钮、表单、列表等
- **文案**: 关键文字内容
- **交互说明**: 基本交互行为

### Step 2: 中保真原型生成

在低保真基础上增加：

- **交互逻辑**: 点击、滑动等行为定义
- **状态变化**: normal/hover/active/disabled等
- **数据展示**: 列表数据、空状态、加载状态
- **过渡动画**: 页面切换和元素动画

### Step 3: 设计规范一致性检查

对照设计系统验证原型：

| 检查维度 | 说明 |
|----------|------|
| 组件来源 | 是否使用规范组件库 |
| 间距字号 | 间距和字体是否符合规范 |
| 颜色 | 色彩使用是否合规 |
| 交互模式 | 通用交互是否一致 |
| 文案风格 | 文案语气是否符合规范 |

生成一致性得分和violations列表。

### Step 4: 可用性启发式评估

基于Nielsen十大可用性原则评估：

1. 系统状态可见性
2. 系统与现实世界匹配
3. 用户控制与自由
4. 一致性与标准
5. 错误预防
6. 识别而非回忆
7. 使用的灵活性与效率
8. 美观且最小化设计
9. 帮助用户识别和恢复错误
10. 帮助与文档

评分范围0-10，**评分<3的弱项需提供改进建议**。

## 输出

**存储路径**：`output/pm-design/design-prototype/`

**输出文件**：`prototype_spec.json`

```json
{
  "prototype": {
    "fidelity": "medium",
    "pages": [
      {
        "name": "页面名称",
        "layout": {...},
        "components": [...],
        "interactions": [...],
        "states": {
          "default": {...},
          "loading": {...},
          "empty": {...},
          "error": {...}
        }
      }
    ],
    "design_system_compliance": {
      "score": 0.92,
      "violations": [
        {"item": "按钮颜色", "severity": "low"}
      ]
    },
    "heuristic_evaluation": {
      "overall_score": 8.5,
      "weak_areas": [
        {
          "principle": "系统状态可见性",
          "score": 2,
          "suggestion": "增加加载进度指示器"
        }
      ]
    }
  }
}
```

## 决策规则

- **设计规范一致性 < 0.85** 需人类确认violations
- **启发式评估弱项**（评分<3）需人类判断是否修改
- 弱项有具体改进建议才能通过

## 质量检查

| 检查项 | 标准 | 不达标处理 |
|--------|------|------------|
| 设计规范一致性 | ≥ 85% | 标注"一致性不足"，列出违规项供人工确认 |
| 启发式评估 | 已完成10项原则评估 | 标注"评估未完成"，补充缺失项评估 |
| 弱项改进建议 | 评分<3的弱项均有具体改进建议 | 标注"建议缺失"，补充改进方案后重新评估 |
| 核心页面覆盖 | 所有核心页面已覆盖 | 标注"覆盖不全"，列出未覆盖页面并补充 |
| 关键交互状态 | 包含default/loading/empty/error等关键状态 | 标注"状态不完整"，补充缺失的交互状态 |

---

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| IA方案缺失 | 用户提供功能描述，生成低保真原型 | 缺乏IA数据，页面结构可能不够合理 |
| UserFlow缺失 | 用户提供功能描述，生成低保真原型 | 缺乏UserFlow数据，交互流程可能不够完整 |
| 设计规范缺失 | 跳过设计规范一致性检查 | 无法验证设计规范合规性 |
| 设计令牌缺失 | 跳过令牌校验 | 无法验证颜色/间距/字号是否符合令牌规范 |
| IA+UserFlow+设计规范均缺失 | 基于用户功能描述生成低保真原型 | 整体置信度降低，仅产出低保真级别 |
| 所有上游文件均缺失 | 提示用户先执行前序阶段，或基于用户功能描述生成低保真原型 | 输出仅为低保真原型描述 |

## 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| prototype | object | 是 | 原型数据 |
| prototype.fidelity | string | 是 | 保真度级别（low/medium） |
| prototype.pages | array | 是 | 页面列表，不可为空 |
| prototype.pages[].name | string | 是 | 页面名称 |
| prototype.pages[].layout | object | 是 | 页面布局 |
| prototype.pages[].components | array | 是 | 组件列表 |
| prototype.pages[].interactions | array | 是 | 交互定义 |
| prototype.pages[].states | object | 是 | 交互状态（含default/loading/empty/error） |
| prototype.design_system_compliance | object | 是 | 设计规范合规性 |
| prototype.design_system_compliance.score | number | 是 | 合规性评分（0-1） |
| prototype.design_system_compliance.violations | array | 是 | 违规项列表 |
| prototype.heuristic_evaluation | object | 是 | 启发式评估 |
| prototype.heuristic_evaluation.overall_score | number | 是 | 整体评分（0-10） |
| prototype.heuristic_evaluation.weak_areas | array | 是 | 弱项列表 |

## 上游变更响应

### 上游变更影响

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| IA方案变更（页面增删/层级调整） | 页面清单、布局结构 | 标注受影响的页面，建议人类确认是否重新生成原型 |
| UserFlow变更（流程路径修改） | 交互逻辑、状态变化 | 标注受影响的交互流程，建议人类确认是否更新交互定义 |
| 设计规范变更（组件/间距/颜色调整） | 设计规范一致性检查结果 | 标注受影响的合规项，建议人类确认是否重新检查 |
| 设计令牌变更（变量调整） | 令牌校验结果 | 标注受影响的令牌引用，建议人类确认是否更新校验 |

### 下游通知机制

| 原型变更类型 | 通知范围 | 通知方式 |
|-------------|----------|----------|
| 页面增删 | interaction-spec、design-handoff-spec | 标记页面变更，触发交互规范和交接文档更新 |
| 交互逻辑变更 | interaction-spec、design-handoff-spec | 标记交互变更，触发交互规范和交接文档更新 |
| 组件规格变更 | design-handoff-spec | 标记组件变更，触发交接文档更新 |
| 设计规范合规性变更 | design-handoff-spec | 标记合规性变更，触发交接文档更新 |

数据获取说明：
- 本Skill需要IA、UserFlow和设计规范数据，请通过以下方式之一提供：
  1. 直接描述功能、页面结构和交互流程
  2. 上传ia_proposals.json / userflow.json / 设计规范文件
  3. 提供数据文件路径
- AI不负责外部数据采集，仅负责分析
