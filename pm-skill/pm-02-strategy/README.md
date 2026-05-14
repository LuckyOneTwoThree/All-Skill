# 模块2：产品商业与战略

## 定位

承接探索阶段的洞察与机会，将发现转化为可执行的商业策略。目标是**确保做正确的事，而非正确地做事**。

## 何时使用

- 已完成产品探索，需要设计商业模式和定价策略
- 需要明确产品定位与差异化策略
- 需要制定战略规划、OKR和产品路线图
- 需要对齐各Stakeholder的期望与利益

## 子模块与编排器

| 子模块 | 编排器 | 作用 | 何时调用 |
|--------|--------|------|----------|
| 商业模式设计 | business-orchestrator | 设计商业模式画布、验证价值匹配、制定定价方案 | 需要系统化设计商业模式时 |
| 产品定位与差异化 | positioning-orchestrator | 整合定位陈述、价值曲线、差异化评估和排除策略 | 需要明确产品在市场中的独特位置时 |
| 战略规划与路线图 | planning-orchestrator | 战略分析、OKR设定、北极星确认、路线图制定 | 需要制定战略方向和执行计划时 |
| Stakeholder对齐 | stakeholder-orchestrator | 整合利益相关者地图、沟通策略和战略简报 | 需要对齐各方利益和期望时 |

## Pipeline Skill 清单

### 商业模式设计（4个）

| Skill | 作用 | 输入 | 输出 |
|-------|------|------|------|
| business-model-canvas | 生成商业模式画布（BMC 9格），标注关键假设 | 机会简报、用户研究输出 | bmc.json |
| business-value-fit | 验证价值主张与客户需求的匹配度 | BMC、用户洞察 | value-fit.json |
| business-pricing | 生成多个定价方案（成本加成/价值定价/竞争定价） | BMC、竞品情报、价值匹配结果 | pricing.json |
| business-strategy-report | 商业战略规划报告：整合商业画布、SWOT、OKR、路线图、定位和利益相关者数据，补充战略推演和执行路径 | 商业画布、SWOT、OKR、路线图、定位 | business-strategy-report.json |

### 产品定位与差异化（1个）

| Skill | 作用 | 输入 | 输出 |
|-------|------|------|------|
| positioning-strategy | 整合定位陈述、价值曲线、差异化评估和排除策略 | BMC、竞品分析、用户洞察 | positioning-strategy.json |

### 战略规划与路线图（4个）

| Skill | 作用 | 输入 | 输出 |
|-------|------|------|------|
| strategic-analysis | 战略分析，自动选择战略分析框架（SWOT/波特五力/Ansoff矩阵） | 市场分析、竞品情报、内部资源 | strategic-analysis.json |
| planning-okr | 生成OKR候选，对齐战略方向 | SWOT方向、北极星指标 | okr.json |
| planning-north-star | 推荐北极星指标候选 | OKR、业务目标 | north-star.json |
| planning-roadmap | 生成产品路线图，RICE评分排序 | OKR、需求列表、资源约束 | roadmap.json |

### Stakeholder对齐（1个）

| Skill | 作用 | 输入 | 输出 |
|-------|------|------|------|
| stakeholder-analysis | 绘制Stakeholder地图、编写战略文档、生成战略简报 | 项目信息、组织架构、SWOT、OKR、路线图、定位 | stakeholder-analysis.json |

### 产品提案（1个）

| Skill | 作用 | 输入 | 输出 |
|-------|------|------|------|
| product-proposal | 产品提案书：整合市场机会、用户需求、竞品格局和资源评估，产出结构化的产品提案文档供决策层审批 | 竞品报告、市场规模、用户研究、定位陈述 | product-proposal.json |

## 执行顺序

```
阶段1（并行）              阶段2（并行）              阶段3
┌─────────────┐      ┌─────────────┐      ┌──────────────┐
│ 商业模式设计 │      │ 产品定位与   │      │ Stakeholder  │
│             │ ──→  │ 差异化       │ ──→  │ 对齐         │
│             │      │             │      │              │
│ 战略规划与   │ ──→  │             │ ──→  │              │
│ 路线图      │      │             │      │              │
└─────────────┘      └─────────────┘      └──────────────┘
```

- 商业模式设计和战略规划可并行启动
- 产品定位与差异化依赖商业模式设计的输出
- Stakeholder对齐依赖定位和战略规划的输出
- stakeholder-analysis 是本模块的最终汇总产出

## 输出路径

```
output/pm-strategy/
├── business-model-canvas/
├── business-value-fit/
├── business-pricing/
├── business-strategy-report/
├── positioning-strategy/
├── strategic-analysis/
├── planning-okr/
├── planning-north-star/
├── planning-roadmap/
├── stakeholder-analysis/
└── product-proposal/
```

## 阶段卡口

进入下一模块（产品构思与设计）前需满足：

- BMC生成完成：BMC 9格全部填充、假设已标注
- 价值主张匹配完成：价值主张匹配度≥3.0
- 定价方案完成：3个定价方案已生成
- 定位策略完成：定位陈述质量检查5项全部通过，差异化强度≥0.5，排他陈述已生成
- 战略分析完成：strategic-analysis.json已生成，战略结论整合完成
- OKR完成：OKR人类已确认
- 北极星确认：北极星指标人类已选择
- 路线图完成：路线图资源人类已审批
- Stakeholder分析完成：Stakeholder分析人类已校准

## 人类决策点

| 决策点 | 说明 |
|--------|------|
| 收入模型选择 | AI生成多个收入模式选项，人类选择最终方案 |
| 定价数字拍板 | AI提供定价分析和方案，人类决定具体定价数字 |
| 定位陈述最终选择 | AI生成3-5个候选，人类选择最终定位陈述 |
| 排他决策 | AI提供排他建议，人类决定不为哪些用户服务 |
| 战略方向选择 | AI生成SO/ST/WO/WT四种战略方向，人类选择最终方向 |
| OKR确认 | AI生成OKR候选，人类确认最终OKR |
| 路线图优先级 | AI计算RICE评分并排序，人类决定最终优先级和资源分配 |
| 影响力评估校准 | AI评估影响力评分，人类校准涉及人际判断的最终结果 |
| 战略文档审核 | AI组装战略文档，人类审核内容准确性和表达方式 |

## 核心信念

- 商业模式不是设计出来的，是验证出来的
- 定位的本质是选择不为谁服务
- 确保做正确的事，而非正确地做事
- 对齐不是说服，是共创
