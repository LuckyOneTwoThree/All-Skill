---
name: ui-frontend-orchestrator
description: UI前端生成指挥官。协调UI组件生成、页面组装、交互设计、UI审查和前端测试的完整流程，确保UI+前端一体化产出质量。关键词：UI前端、组件生成、页面组装、交互设计、UI审查。
metadata:
  module: "UI设计与前端开发"
  sub-module: "UI前端生成"
  type: "orchestrator"
  version: "1.0"
---

# UI前端生成指挥官

## 核心原则

UI与前端一体化，设计即实现，实现即设计。

## 执行步骤

1. **组件先行**：先完成组件生成，再组装页面
2. **交互增强**：页面组装后添加交互设计
3. **审查闭环**：审查不通过则回退修复，不跳过
4. **测试保障**：测试覆盖核心流程，不盲目追求覆盖率

## 任务调度

```
ui-component-gen → page-assembly → interaction-design → ui-review → frontend-test
```

| 阶段 | 任务 | 执行模式 |
|------|------|----------|
| 1 | ui-component-gen | 🤖→👤 AI建议，人类审批 |
| 2 | page-assembly | 🤖→👤 AI建议，人类审批 |
| 3 | interaction-design | 🤖→👤 AI建议，人类审批 |
| 4 | ui-review | 🤖 AI自动执行 |
| 5 | frontend-test | 🤖 AI自动执行 |

### 数据流转

```
[设计令牌 + 组件库 + 页面需求 + 原型规格]
       ↓
ui-component-gen
       ↓ components (code / props_types / story / test_skeleton / design_token_compliance)
page-assembly
       ↓ pages (page_code / route_config / state_management / component_tree / data_flow)
interaction-design
       ↓ interaction (state_machine / animations / gestures / feedback_patterns / loading_states)
ui-review
       ↓ review_report (compliance / accessibility / interaction / responsive / issues / severity)
frontend-test
       ↓ test_results (unit_tests / visual_regression / e2e_tests / accessibility_tests / coverage)
```

### 调度逻辑

| 触发事件 | 调度动作 |
|----------|----------|
| 设计令牌+组件库就绪 | → ui-component-gen（组件代码生成） |
| 组件代码人类确认完成 | → page-assembly（页面组装） |
| 页面布局人类确认完成 | → interaction-design（交互设计） |
| 交互方案人类确认完成 | → ui-review（UI自动审查） |
| UI审查P0问题=0 | → frontend-test（前端测试） |
| UI审查P0问题>0 | → 回退到对应阶段修复 |
| 前端测试核心流程不通过 | → 回退到组件生成阶段修复 |

## 调度规则

- 每次只加载当前阶段需要的子Skill，完成后再加载下一阶段，不要一次性加载所有子Skill
- 每个阶段完成后，将中间结果写入 `output/ui-frontend/{skill-name}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 组件生成完成 | Design Token引用率100% | 硬编码值必须替换为Token引用 |
| 页面组装完成 | 组件树层级≤4层 | 层级过深需重构后才能进入交互阶段 |
| 交互设计完成 | 所有异步操作有loading状态 | 缺失loading状态必须补充 |
| UI审查完成 | P0问题=0 | P0问题必须修复后才能进入测试阶段 |
| 前端测试完成 | 核心流程E2E测试100%通过 | 不通过则回退到组件生成阶段修复 |

## 人类决策点

| 决策点 | 说明 |
|--------|------|
| 组件方案确认 | AI生成组件清单，人类确认组件边界和Props设计 |
| 页面布局确认 | AI生成页面布局方案，人类确认布局选择 |
| 交互方案确认 | AI生成交互状态机，人类确认交互行为 |
| UI审查P1问题处理 | P1问题修复还是接受为技术债务 |
| 测试策略确认 | AI生成测试方案后，人类确认测试范围和优先级 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 设计令牌缺失 | 降级使用默认设计令牌，标注"缺乏品牌定制" |
| 组件库不完整 | 基于已有组件组装，缺失组件标注"待补充" |
| UI审查P0问题 | 必须修复后才能进入测试阶段 |
| E2E测试环境不可用 | 跳过E2E测试，标注"E2E待执行"，不阻塞发布 |
| 组件树层级过深 | 标注"需重构"，人类确认是否立即重构或标记为技术债务 |
