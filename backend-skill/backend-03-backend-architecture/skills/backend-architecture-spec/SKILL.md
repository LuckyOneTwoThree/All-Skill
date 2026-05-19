---
name: backend-architecture-spec
description: 当需要设计后端架构时使用。后端架构设计规范产出，基于业务规模自动评估架构模式、设计服务拆分方案、执行架构审查，内建架构决策记录(ADR)和技术债登记确保决策可追溯。产出经人类审查后，交由backend-architecture-impl生成代码。关键词：架构模式、微服务、单体架构、Serverless、服务设计、DDD、限界上下文、架构审查、技术债、架构决策。
metadata:
  module: "后端架构与开发"
  sub-module: "后端架构"
  type: "pipeline"
  version: "5.0"
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
5. **架构约束先行**：架构决策约束后续数据模型和API设计，服务数据归属和技术栈决策必须明确

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| PRD | markdown | 是 | output/pm-design/design-prd/prd.md | 业务领域和流程 |
| PRD结构化数据 | JSON | 是 | output/pm-design/design-prd/prd.json | PRD机器可消费版本，供架构审查对齐检查 |
| 业务规模 | JSON | 是 | 用户提供 | 用户量、QPS、数据量、团队规模 |
| 技术约束 | JSON | ○ | 用户提供 | 技术栈偏好、运维能力、预算 |

## 执行步骤

### Step 1: 架构模式评估与选择

基于多维度评估推荐架构模式（单体/微服务/Serverless），生成系统拓扑图。

**架构评估量化矩阵**：

对每个候选架构模式按以下维度评分（1-5分），量化比较后推荐最优方案。

| 评估维度 | 1分 | 2分 | 3分 | 4分 | 5分 |
|---------|-----|-----|-----|-----|-----|
| 可扩展性 | 无法水平扩展，单点瓶颈 | 有限扩展，需停机扩容 | 支持垂直扩展，有限水平扩展 | 较好的水平扩展能力 | 无限水平扩展，自动弹性伸缩 |
| 可维护性 | 强耦合，修改影响范围大 | 部分解耦，核心模块耦合 | 模块化设计，边界较清晰 | 良好解耦，独立可修改 | 完全解耦，服务独立部署和演进 |
| 性能预期 | 单点性能瓶颈明显 | 基本满足低负载需求 | 满足中等负载，高峰有压力 | 满足高负载，局部可优化 | 满足极高负载，全链路可优化 |
| 安全性 | 无隔离，攻击面大 | 基础隔离，边界模糊 | 服务级隔离，边界清晰 | 细粒度隔离+独立安全策略 | 零信任架构+纵深防御 |
| 部署复杂度 | 极简部署，单进程 | 简单部署，少量依赖 | 中等复杂，需编排工具 | 复杂，需完整DevOps体系 | 极复杂，需专业运维团队（此维度低分更优） |
| 团队适配度 | 团队无法驾驭 | 需大量培训才能上手 | 团队有部分经验 | 团队有较丰富经验 | 团队精通，有最佳实践 |

**综合评分计算公式**：

```
综合评分 = 可扩展性 × W1 + 可维护性 × W2 + 性能预期 × W3 + 安全性 × W4 + (6 - 部署复杂度) × W5 + 团队适配度 × W6
```

**默认权重**（可根据业务类型调整）：

| 业务类型 | W1(扩展性) | W2(维护性) | W3(性能) | W4(安全) | W5(部署) | W6(团队) |
|---------|-----------|-----------|---------|---------|---------|---------|
| 通用/SaaS | 0.25 | 0.20 | 0.20 | 0.10 | 0.10 | 0.15 |
| 电商 | 0.30 | 0.15 | 0.25 | 0.10 | 0.10 | 0.10 |
| 金融 | 0.15 | 0.15 | 0.20 | 0.25 | 0.10 | 0.15 |

**评分结果解读**：

| 综合评分 | 推荐策略 |
|---------|---------|
| ≥4.0 | 推荐采用，风险低 |
| 3.0-3.9 | 可采用，需关注低分维度并制定补偿措施 |
| 2.0-2.9 | 不推荐，需调整方案或补充能力后再评估 |
| <2.0 | 否决，方案不可行 |

**阶段卡口**：架构模式和演进路线人类已确认

### Step 2: 架构决策记录

为每个架构决策生成ADR：
- 决策背景和驱动力
- 备选方案及评估
- 决策结果和理由
- 影响范围和后果

**ADR模板**：

```json
{
  "id": "ADR-001",
  "title": "决策标题",
  "status": "proposed | accepted | deprecated | superseded",
  "date": "2025-01-01",
  "context": "决策背景：描述驱动力、约束条件和问题陈述",
  "alternatives": [
    {
      "name": "方案名称",
      "description": "方案描述",
      "pros": ["优势1", "优势2"],
      "cons": ["劣势1", "劣势2"],
      "evaluation_scores": {
        "scalability": 0,
        "maintainability": 0,
        "performance": 0,
        "security": 0,
        "deployment_complexity": 0,
        "team_fitness": 0
      }
    }
  ],
  "decision": "最终决策结果",
  "rationale": "决策理由：为什么选择此方案而非其他",
  "consequences": {
    "positive": ["正面影响1"],
    "negative": ["负面影响1"],
    "risks": ["风险1"]
  },
  "affected_services": ["受影响的服务列表"],
  "related_adrs": ["ADR-000"],
  "supersedes": null,
  "superseded_by": null
}
```

**ADR编号规则**：按架构决策顺序递增（ADR-001, ADR-002, ...），核心架构决策优先编号。

**ADR状态流转**：proposed → accepted →（deprecated / superseded），状态变更需人类确认。

**阶段卡口**：核心架构决策100%有ADR

### Step 3: 服务设计

基于领域驱动设计识别限界上下文，设计服务拆分和通信方案。

**限界上下文识别方法**：

按以下三条规则识别限界上下文，优先级从高到低：

| 识别规则 | 划分依据 | 识别信号 | 示例 |
|---------|---------|---------|------|
| 业务领域 | 同一业务领域的实体聚合在一起 | 同一业务流程中的实体、相同的业务规则和不变量 | 订单域（Order/OrderItem/Payment）、用户域（User/Profile/Role） |
| 数据所有权 | 同一数据只能由一个上下文拥有和修改 | 同一实体在不同上下文中有不同的属性子集和生命周期 | 商品目录上下文拥有商品基础信息，库存上下文拥有库存数量 |
| 变更频率 | 变更频率和原因相同的实体归入同一上下文 | 需求变更时总是一起修改的模块 | 营销规则变更频繁，与稳定的商品基础信息分离 |

**限界上下文映射模板**：

```json
{
  "contexts": [
    {
      "name": "上下文名称",
      "description": "上下文职责描述",
      "core_entities": ["拥有的核心实体列表"],
      "ubiquitous_language": ["通用语言关键词列表"],
      "incoming_relations": [
        {
          "from_context": "上游上下文",
          "relationship_type": "上下游|客户-供应商|遵奉者|开放主机服务|防腐层",
          "data_flow": "数据流向描述"
        }
      ]
    }
  ],
  "context_map_summary": "上下文映射总览描述"
}
```

**上下文间通信模式选择**：

| 通信模式 | 适用场景 | 一致性 | 复杂度 | 示例 |
|---------|---------|--------|--------|------|
| 同步调用（HTTP/gRPC） | 需要实时响应，调用频率低 | 强一致 | 低 | 用户服务查询订单服务获取订单列表 |
| 异步消息（MQ） | 不需要实时响应，需要解耦 | 最终一致 | 中 | 订单创建后通知库存服务扣减 |
| 事件驱动（Event Sourcing） | 需要完整审计追踪，多下游消费 | 最终一致 | 高 | 支付完成后触发订单状态变更+通知+积分 |
| 共享数据库 | 团队规模小，服务间数据强依赖 | 强一致 | 低（短期） | 单体架构内模块间共享数据库 |
| CQRS | 读写模型差异大，读远多于写 | 最终一致 | 高 | 商品列表查询与商品详情使用不同模型 |

**阶段卡口**：每个限界上下文有明确的实体归属和通信模式

**新增产出**：
- **服务数据归属**（service_data_ownership.json）：明确每个服务/限界上下文拥有的数据实体，供 data-architecture-spec 按服务边界划分数据模型
- **技术栈决策**（tech_stack_decision.json）：统一技术栈决策（语言/框架/ORM/数据库/缓存），供所有 impl Skill 统一消费，避免各自默认不同技术栈

**阶段卡口**：服务间无循环依赖，数据归属明确，技术栈决策完整

### Step 4: 后端审查

审查性能、安全、可维护性和可扩展性，输出问题清单和修复建议。

**注意**：本阶段不审查API和数据模型的对齐（它们尚未设计），重点审查架构模式选择和服务边界划分的合理性。

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
- service_data_ownership.json — 每个服务/限界上下文拥有的数据实体，供data-architecture-spec消费
- tech_stack_decision.json — 统一技术栈决策（语言/框架/ORM/数据库/缓存），供所有impl Skill消费
- review_report.json — 审查问题清单+修复建议
- tech_debt_register.json — 技术债登记册

**service_data_ownership.json Schema**：

```json
{
  "type": "object",
  "required": ["services"],
  "properties": {
    "services": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["name", "bounded_context", "owned_entities"],
        "properties": {
          "name": { "type": "string" },
          "bounded_context": { "type": "string" },
          "owned_entities": { "type": "array", "items": { "type": "string" } },
          "database_strategy": { "type": "string", "enum": ["shared", "separate"] }
        }
      }
    }
  }
}
```

**tech_stack_decision.json Schema**：

```json
{
  "type": "object",
  "required": ["language", "framework", "orm", "database", "cache"],
  "properties": {
    "language": { "type": "object", "required": ["name", "version"], "properties": { "name": { "type": "string" }, "version": { "type": "string" } } },
    "framework": { "type": "object", "required": ["name", "version"], "properties": { "name": { "type": "string" }, "version": { "type": "string" } } },
    "orm": { "type": "object", "required": ["name", "version"], "properties": { "name": { "type": "string" }, "version": { "type": "string" } } },
    "database": { "type": "object", "required": ["name", "version"], "properties": { "name": { "type": "string" }, "version": { "type": "string" } } },
    "cache": { "type": "object", "required": ["name", "version"], "properties": { "name": { "type": "string" }, "version": { "type": "string" } } },
    "message_queue": { "type": "object", "properties": { "name": { "type": "string" }, "version": { "type": "string" } } }
  }
}
```

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
- [ ] 架构评估量化矩阵已填写，综合评分≥3.0
- [ ] 核心架构决策100%有ADR
- [ ] ADR包含备选方案评估分数
- [ ] 限界上下文按业务领域/数据所有权/变更频率三规则识别
- [ ] 每个限界上下文有明确的实体归属和通信模式
- [ ] 服务间无循环依赖
- [ ] P0问题=0
- [ ] 技术债登记册已生成
- [ ] 每个服务有明确的数据归属

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 | 数据获取说明 |
|---------------|---------|---------|-------------|
| PRD缺失 | 无法设计架构 | 输出为空 | 要求用户提供PRD，或从用户口述的业务需求中提取最小PRD |
| 业务规模未指定 | 默认中等规模（用户量1万，QPS 100，数据量10GB，团队5人） | 架构模式可能不匹配实际规模 | 提示用户提供业务规模，或在架构决策中标注"规模待确认" |
| API设计缺失 | 架构设计不依赖API设计，按PRD推导服务间交互需求 | 服务间通信方案可能需后续调整 | 正常情况，API尚未设计，架构设计完成后由api-design-spec消费架构产出 |
| 数据架构缺失 | 从PRD推导核心数据实体，标注"数据归属待data-architecture-spec确认" | service_data_ownership.json中实体归属基于推导 | 正常情况，数据架构尚未设计，架构设计完成后由data-architecture-spec消费服务数据归属 |
| 非功能需求缺失 | 按业务规模推导默认非功能指标（可用性99.9%，响应时间<500ms，RTO<1h） | 性能和可靠性设计可能不满足实际要求 | 提示用户提供非功能需求，或在ADR中记录假设条件和待确认项 |
| 技术约束缺失 | 不限制技术栈选择，按团队适配度评分最优方案推荐 | 推荐的技术栈可能不符合组织约束 | 提示用户提供技术约束（技术栈偏好、运维能力、预算），或在架构决策中标注"技术约束待确认" |

## 上游变更响应

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| PRD业务领域变更 | 服务拆分 | 标注受影响的服务边界，评估是否需要重新划分 |
| PRD业务规模变更 | 架构模式 | 重新评估架构模式是否匹配 |

| 变更类型 | 影响范围 | 通知方式 |
|----------|----------|----------|
| 架构方案变更 | data-architecture-spec, api-design-spec, 所有impl Skill | 标注受影响的下游Skill，更新architecture_decision.json |
| 服务设计变更 | data-architecture-spec, api-design-spec, backend-architecture-impl | 标注受影响的服务边界，更新service_design.json |
| 技术栈决策变更 | 所有impl Skill | 标注受影响的代码生成，更新tech_stack_decision.json |
| 服务数据归属变更 | data-architecture-spec | 标注受影响的数据实体归属，更新service_data_ownership.json |
