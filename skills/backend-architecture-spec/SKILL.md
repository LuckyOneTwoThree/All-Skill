---
name: backend-architecture-spec
description: 当需要设计后端架构时使用。后端架构设计规范产出，基于业务规模自动评估架构模式、设计服务拆分方案、执行架构审查，内建架构决策记录(ADR)和技术债登记确保决策可追溯。产出经人类审查后，交由backend-architecture-impl生成代码。关键词：架构模式、微服务、单体架构、Serverless、服务设计、DDD、限界上下文、架构审查、技术债、架构决策。
metadata:
  module: "后端架构与开发"
  sub-module: "后端架构"
  type: "pipeline"
  version: "4.0"
  domain_tags: ["电商", "SaaS", "金融", "通用"]
  trigger_examples:
    - "选什么架构模式"
    - "要不要上微服务"
    - "服务怎么拆分"
    - "后端代码审查"
    - "架构有没有问题"
  interaction_mode: "ai_suggest_human_approve"
---

# 后端架构设计规范

## 核心原则

1. **适度架构**：架构服务于业务，不追求技术先进性
2. **演进式架构**：从简单开始，按需演进，不一步到位
3. **决策可追溯**：每个架构决策有明确的理由和上下文，自动生成ADR
4. **技术债可见**：技术债显式登记和管理，不隐藏

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| PRD | markdown | 是 | output/pm-design/design-prd/prd.md | 业务领域和流程 |
| PRD结构化数据 | JSON | 是 | output/pm-design/design-prd/prd.json | PRD机器可消费版本，供架构审查对齐检查 |
| 数据模型 | JSON | 是 | output/backend-data-architecture/data-architecture-spec/er_model.json | 数据实体和关系 |
| 业务数据字典 | JSON | ○ | output/backend-data-architecture/data-architecture-spec/data_dictionary.json | 业务数据标准和实体定义，供服务拆分和限界上下文划分参考 |
| API契约 | YAML/JSON | 是 | output/backend-api-design/api-design-spec/openapi.yaml | 接口定义 |
| 业务规模 | JSON | 是 | 用户提供 | 用户量、QPS、数据量、团队规模 |
| 技术约束 | JSON | ○ | 用户提供 | 技术栈、运维能力、预算 |
| 缓存策略 | JSON | ○ | output/backend-data-architecture/data-architecture-spec/cache_strategy.json | 缓存方案 |

## 执行步骤

### Step 1: 架构模式评估与选择

基于多维度评估推荐架构模式（单体/微服务/Serverless），生成系统拓扑图。

**阶段卡口**：架构模式和演进路线人类已确认

### Step 2: 架构决策记录

为每个架构决策生成ADR：
- 决策背景和驱动力
- 备选方案及评估
- 决策结果和理由
- 影响范围和后果

**阶段卡口**：核心架构决策100%有ADR

### Step 3: 服务设计

基于领域驱动设计识别限界上下文，设计服务拆分和通信方案。

**阶段卡口**：服务间无循环依赖，数据归属明确

### Step 4: 后端审查

审查性能、安全、可维护性和可扩展性，输出问题清单和修复建议。

**阶段卡口**：P0问题=0，架构决策记录完整

### Step 5: 技术债登记

识别并登记技术债：
- 从审查问题中提取技术债
- 评估影响范围和修复优先级
- 生成技术债登记册
- 建议修复节奏

**阶段卡口**：P0技术债=0，技术债登记册已生成

## 输出

**元数据输出**：output/backend-architecture/backend-architecture-spec/

**输出文件**：
- architecture_decision.json — 架构方案+拓扑图
- adr.json — 架构决策记录
- service_design.json — 服务划分+上下文映射
- review_report.json — 审查问题清单+修复建议
- tech_debt_register.json — 技术债登记册

## 决策规则

| 条件 | 决策 |
|------|------|
| 团队规模<5人 | 单体架构优先 |
| 团队规模5-20人 | 微服务架构 |
| QPS<1000 | 单体或Serverless |
| 核心业务实体跨子域 | 按限界上下文拆分服务 |
| 审查P0问题>0 | 阻塞发布，必须修复 |
| 技术债影响核心功能 | P0优先级，本迭代修复 |

## 质量检查

- [ ] 架构模式与业务规模匹配
- [ ] 核心架构决策100%有ADR
- [ ] 服务间无循环依赖
- [ ] P0问题=0
- [ ] 技术债登记册已生成
- [ ] 每个服务有明确的数据归属

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| PRD缺失 | 基于数据模型和API契约推导业务领域 | 服务划分可能不准确 |
| 数据模型缺失 | 无法设计服务 | 输出为空 |
| API契约缺失 | 审查范围受限 | 无法做接口级审查 |
| 业务规模未指定 | 默认中等规模 | 架构模式可能不匹配 |

## 上游变更响应

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| PRD业务领域变更 | 服务拆分 | 标注受影响的服务边界，评估是否需要重新划分 |
| 数据模型变更 | 服务数据归属 | 标注受影响的服务，评估数据迁移需求 |
| API契约变更 | 审查结果 | 重新评估受影响接口的安全和性能 |
