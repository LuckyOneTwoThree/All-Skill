# 模块1：产品探索与发现

## 定位

产品全流程的起点。在不知道用户是谁、问题是什么、市场长什么样的阶段使用。目标是**发现真实需求，而非验证预设假设**。

## 何时使用

- 从 0 开始做新产品，不确定目标用户和核心问题
- 需要了解用户声音、行为模式、深层需求
- 需要评估市场规模和竞争格局
- 需要从洞察中提炼机会点并排序

## 子模块与编排器

| 子模块 | 编排器 | 作用 | 何时调用 |
|--------|--------|------|----------|
| 用户研究 | user-research-orchestrator | 理解用户是谁、说什么、做什么、需要什么 | 需要系统化用户研究时 |
| 需求洞察 | insight-orchestrator | 从用户研究中提炼深层需求和价值 | 已有用户数据，需要挖掘洞察时 |
| 市场分析 | market-orchestrator | 评估市场规模、竞争格局、宏观环境 | 需要了解市场全貌时 |
| 机会识别 | opportunity-orchestrator | 将洞察转化为可执行的机会点并排序 | 需要确定做什么时 |

## Pipeline Skill 清单

### 用户研究（5个）

| Skill | 作用 | 输入 | 输出 |
|-------|------|------|------|
| user-research-voice-analysis | 用户声音分析：从反馈中提取主题和情感 | 用户反馈文本 | voice-analysis.json |
| user-research-behavior-analysis | 用户行为分析：从行为数据中发现模式 | 行为数据 | behavior-analysis.json |
| user-research-user-modeling | 用户建模：生成 Persona 和 JTBD | 声音+行为分析结果 | persona.json |
| user-research-interview-assist | 访谈辅助：生成访谈提纲、记录分析 | 访谈目标/记录 | interview-output.json |
| user-research-report | 用户研究报告：整合声音分析、行为分析、用户建模和访谈数据，补充研究方法论和行动建议 | 用户研究各输出 | user-research-report.json |

### 需求洞察（5个）

| Skill | 作用 | 输入 | 输出 |
|-------|------|------|------|
| insight-jtbd | Jobs-to-be-Done 分析 | 用户研究输出 | jtbd.json |
| insight-5whys | 5 Whys 根因分析 | 问题描述 | 5whys-result.json |
| insight-requirement-layers | 需求层次分析（表层/功能/情感/价值观） | 需求描述 | requirement-layers.json |
| insight-kano | Kano 需求分类（基本/期望/兴奋） | 需求列表 | kano.json |
| insight-priority-scoring | 需求优先级评分 | 洞察结果 | priority-scoring.json |

### 市场分析（5个）

| Skill | 作用 | 输入 | 输出 |
|-------|------|------|------|
| market-tam-som | 市场规模估算（TAM/SAM/SOM） | 行业数据 | tam-som.json |
| market-pest | PEST 宏观环境分析 | 行业信息 | pest.json |
| market-competitor-intel | 竞品情报收集 | 竞品信息 | competitor-intel.json |
| market-competitor-quadrant | 竞品象限分析 | 竞品情报 | competitor-quadrant.json |
| market-competitor-report | 竞品分析报告：整合竞品情报和四象限数据，补充SWOT分析、竞争定位图、护城河评估和差异化策略 | 竞品情报+四象限数据 | competitor-report.json |

### 机会识别（4个）

| Skill | 作用 | 输入 | 输出 |
|-------|------|------|------|
| opportunity-scoring | 机会评分排序 | 洞察+市场分析 | opportunity-scoring.json |
| opportunity-hmw | How Might We 问题重构 | 问题陈述 | hmw.json |
| opportunity-problem-statement | 问题陈述定义 | 用户研究+洞察 | problem-statement.json |
| opportunity-brief | 机会简报汇总 | 所有上游输出 | opportunity-brief.json |

## 执行顺序

```
阶段1（并行）              阶段2（并行）              阶段3
┌─────────────┐      ┌─────────────┐      ┌──────────────┐
│  用户研究    │      │  需求洞察    │      │  机会识别     │
│  市场分析    │ ──→  │             │ ──→  │              │
└─────────────┘      └─────────────┘      └──────────────┘
```

- 用户研究和市场分析可并行
- 需求洞察依赖用户研究的输出
- 机会识别依赖洞察和市场分析的输出
- opportunity-brief 是本模块的最终汇总产出

## 输出路径

```
output/pm-discovery/
├── user-research-voice-analysis/
├── user-research-behavior-analysis/
├── user-research-user-modeling/
├── user-research-interview-assist/
├── user-research-report/
├── insight-jtbd/
├── insight-5whys/
├── insight-requirement-layers/
├── insight-kano/
├── insight-priority-scoring/
├── market-tam-som/
├── market-pest/
├── market-competitor-intel/
├── market-competitor-quadrant/
├── market-competitor-report/
├── opportunity-scoring/
├── opportunity-hmw/
├── opportunity-problem-statement/
└── opportunity-brief/
```

## 阶段卡口

进入下一模块（产品商业与战略）前需满足：
- 至少 1 个 Persona 置信度 ≥ 0.7
- 问题陈述已人类确认
- 机会简报已人类审批

## 人类决策点

| 决策点 | 说明 |
|--------|------|
| Persona 确认 | AI 生成 Persona，人类确认最终版本 |
| 问题陈述确认 | AI 提炼问题，人类判断是否是真问题 |
| 机会排序确认 | AI 评分排序，人类决定最终优先级 |
| 机会简报审批 | AI 汇总简报，人类审批是否进入战略阶段 |

## 核心信念

- 用户说的和做的不一样，两者都必须被听见
- 发现需求，而非验证假设
- 数据优先，人工补充；显式规则，拒绝模糊
