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
| 产品定位与差异化 | positioning-orchestrator | 定义定位陈述、构建价值曲线、评估差异化、做出排他决策 | 需要明确产品在市场中的独特位置时 |
| 战略规划与路线图 | planning-orchestrator | SWOT分析、行业分析、OKR设定、北极星确认、路线图制定、增长路径选择 | 需要制定战略方向和执行计划时 |
| Stakeholder对齐 | stakeholder-orchestrator | 绘制Stakeholder地图、编写战略文档、生成战略简报 | 需要对齐各方利益和期望时 |

## Pipeline Skill 清单

### 商业模式设计（4个）

| Skill | 作用 | 输入 | 输出 |
|-------|------|------|------|
| business-model-canvas | 生成商业模式画布（BMC 9格），标注关键假设 | 机会简报、用户研究输出 | bmc.json |
| business-value-fit | 验证价值主张与客户需求的匹配度 | BMC、用户洞察 | value-fit.json |
| business-pricing | 生成多个定价方案（成本加成/价值定价/竞争定价） | BMC、竞品情报、价值匹配结果 | pricing.json |
| business-strategy-report | 商业战略规划报告：整合商业画布、SWOT、OKR、路线图、定位和利益相关者数据，补充战略推演和执行路径 | 商业画布、SWOT、OKR、路线图、定位 | business-strategy-report.json |

### 产品定位与差异化（4个）

| Skill | 作用 | 输入 | 输出 |
|-------|------|------|------|
| positioning-statement | 生成定位陈述候选，执行质量检查 | BMC、竞品分析、用户洞察 | positioning-statement.json |
| positioning-value-curve | 构建价值曲线，量化差异化强度 | 定位陈述、竞品价值曲线 | value-curve.json |
| positioning-differentiation | 从5个维度评估差异化程度 | 价值曲线、竞品情报 | differentiation.json |
| positioning-exclusion | 生成排他建议，明确不为谁服务 | 差异化评估、用户研究 | exclusion.json |

### 战略规划与路线图（6个）

| Skill | 作用 | 输入 | 输出 |
|-------|------|------|------|
| planning-swot | SWOT分析，生成SO/ST/WO/WT四种战略方向 | 市场分析、竞品情报、内部资源 | swot.json |
| planning-porter-five-forces | 波特五力分析，评估行业竞争格局 | 行业数据、竞品情报 | porter-five-forces.json |
| planning-okr | 生成OKR候选，对齐战略方向 | SWOT方向、北极星指标 | okr.json |
| planning-north-star | 推荐北极星指标候选 | OKR、业务目标 | north-star.json |
| planning-roadmap | 生成产品路线图，RICE评分排序 | OKR、需求列表、资源约束 | roadmap.json |
| planning-ansoff | Ansoff增长矩阵分析，选择增长路径 | 市场分析、产品现状 | ansoff.json |

### Stakeholder对齐（3个）

| Skill | 作用 | 输入 | 输出 |
|-------|------|------|------|
| stakeholder-map | 绘制Stakeholder地图，评估影响力和利益 | 项目信息、组织架构 | stakeholder-map.json |
| stakeholder-strategy-doc | 编写战略文档，质量检查 | SWOT、OKR、路线图、定位 | strategy-doc.json |
| stakeholder-brief | 生成战略简报，可执行性检查 | 战略文档、Stakeholder地图 | stakeholder-brief.json |

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
- stakeholder-brief 是本模块的最终汇总产出

## 输出路径

```
output/pm-strategy/
├── business-model-canvas/
├── business-value-fit/
├── business-pricing/
├── business-strategy-report/
├── positioning-statement/
├── positioning-value-curve/
├── positioning-differentiation/
├── positioning-exclusion/
├── planning-swot/
├── planning-porter-five-forces/
├── planning-okr/
├── planning-north-star/
├── planning-roadmap/
├── planning-ansoff/
├── stakeholder-map/
├── stakeholder-strategy-doc/
├── stakeholder-brief/
└── product-proposal/
```

## 阶段卡口

进入下一模块（产品构思与设计）前需满足：

- BMC生成完成：BMC 9格全部填充、假设已标注
- 价值主张匹配完成：价值主张匹配度≥3.0
- 定价方案完成：3个定价方案已生成
- 定位陈述完成：质量检查5项全部通过
- 价值曲线完成：差异化强度≥0.5
- 差异化评估完成：5个维度都已评估
- 排他决策完成：排他陈述已生成
- SWOT完成：SWOT战略方向人类已选择
- 行业分析完成：波特五力评分完成
- OKR完成：OKR人类已确认
- 北极星确认：北极星指标人类已选择
- 路线图完成：路线图资源人类已审批
- 增长路径确认：Ansoff增长路径已选择
- Stakeholder地图完成：Stakeholder地图人类已校准
- 战略文档完成：战略文档质量检查通过
- 战略简报完成：简报可执行性检查通过

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
