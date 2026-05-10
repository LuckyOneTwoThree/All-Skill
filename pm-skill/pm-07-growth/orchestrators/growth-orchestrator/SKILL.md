---
name: growth-orchestrator
description: 当需要制定增长策略或系统化推进增长时使用。增长策略总指挥官，先诊断增长模式，再分发到获客/激活/留存/变现各环节。关键词：增长策略、增长模式、AARRR、增长飞轮、增长体系。
metadata:
  module: "产品增长与运营"
  sub-module: "增长模式"
  type: "orchestrator"
  version: "3.0"
---

# 增长策略总指挥官

## 核心原则

**先诊断模式，再分发执行**

增长不是盲目堆渠道，而是先搞清楚产品适合哪种增长模式，再把资源精准投入到最高杠杆的环节。增长模式决定了获客、激活、留存、变现的策略组合。

## 执行步骤

1. **模式先行**：先诊断增长模式（PLG/SLG/MLG/混合），再决定各环节策略
2. **杠杆优先**：基于飞轮模型识别当前最高杠杆环节，集中资源突破
3. **数据驱动归因**：从增长模式到各环节全链路归因，量化每个动作的贡献
4. **闭环迭代**：增长策略通过数据持续验证和迭代

## 任务调度

```
growth-model → [acquisition-orchestrator | activation-orchestrator | retention-orchestrator | revenue-orchestrator] → growth-strategy-report
```

### 附加调度（按需触发）

| 触发事件 | 调度动作 |
|----------|----------|
| 产品上市策略制定 | → gtm-strategy（Go-to-Market策略文档） |
| 运营手册制定 | → product-operations-manual（产品运营手册） |

### 调度逻辑

| 触发事件 | 调度动作 |
|----------|----------|
| 增长策略制定 / 增长模式未明确 | → growth-model（增长模式诊断） |
| 增长模式诊断完成 + 获客为瓶颈 | → acquisition-orchestrator（用户获取） |
| 增长模式诊断完成 + 激活为瓶颈 | → activation-orchestrator（用户激活） |
| 增长模式诊断完成 + 留存为瓶颈 | → retention-orchestrator（用户留存） |
| 增长模式诊断完成 + 变现为瓶颈 | → retention-orchestrator（商业化） |
| 多环节均为瓶颈 | → 按飞轮顺序依次调度（获客→激活→留存→变现） |
| 各环节优化方案完成 | → growth-strategy-report（增长策略报告汇总） |
| 新产品上市 / 市场拓展 | → gtm-strategy（Go-to-Market策略文档） |

### 数据流转

```
[产品特征 + 用户数据 + 商业模式]
       ↓
growth-model
       ↓ growth_diagnosis (model / flywheel / key_constraints / bottleneck)
       ↓
[瓶颈环节对应的子编排器]
       ↓ 各环节优化方案
growth-strategy-report
       ↓ growth_strategy (growth_model / aarrr_funnel / leverage_strategies / roadmap)
```

## 调度规则

- 每次只加载当前阶段需要的子Skill，完成后再加载下一阶段，不要一次性加载所有子Skill
- 每个阶段完成后，将中间结果写入 `output/pm-growth/{skill-name}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 增长模式诊断完成 | 增长模式已确定，飞轮模型已构建 | 补充产品特征和用户数据 |
| 瓶颈环节已识别 | 至少1个瓶颈环节已定位 | 延长分析周期或扩大数据范围 |

## 人类决策点

| 决策点 | 说明 |
|--------|------|
| 增长模式确认 | AI诊断增长模式后，人类确认最终增长模式（PLG/SLG/MLG/混合） |
| 瓶颈优先级确认 | AI识别瓶颈环节后，人类确认资源分配优先级 |
| 飞轮模型确认 | AI构建飞轮模型后，人类确认飞轮节点和因果关系 |
| 增长策略报告确认 | 增长策略报告生成后，人类确认策略方向和执行路线图 |
| GTM策略确认 | GTM策略文档生成后，人类确认上市路径和渠道策略 |
| 运营手册确认 | 运营手册生成后，人类确认运营SOP和应急流程 |

## 变更记录

- v1.0: 初始版本
- v2.0: 结构优化
- v3.0: 新增 growth-strategy-report（增长策略报告）、gtm-strategy（Go-to-Market策略）、product-operations-manual（产品运营手册）
