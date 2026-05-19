# 模块：数据架构

## 定位

后端数据层的设计与实现。基于PRD和架构约束设计业务数据字典、ER模型、表结构、索引策略、缓存方案和数据迁移方案，再基于设计产出生成可运行的Model、Migration、Repository和缓存层代码。目标是**架构约束先行，模型决定上限，缓存决定下限**。

## 何时使用

- 需要设计ER模型、表结构和索引策略
- 需要设计缓存架构和一致性策略
- 需要规划数据库Schema迁移方案
- 需要基于数据架构设计产出直接生成可运行代码

## 子模块与编排器

| 子模块 | 编排器 | 作用 | 何时调用 |
|--------|--------|------|----------|
| 数据架构 | data-architecture-orchestrator | 协调数据架构设计规范和代码实现的完整流程 | 需要设计并实现数据层架构时 |

## Pipeline Skill 清单

### 数据架构设计规范（1个）

| Skill | 作用 | 输入 | 输出 |
|-------|------|------|------|
| data-architecture-spec | 基于PRD和架构约束设计业务数据字典、ER模型、缓存策略和迁移方案 | PRD、架构方案、服务数据归属 | er_model.json + data_dictionary.json + cache_strategy.json |

### 数据层代码实现（1个）

| Skill | 作用 | 输入 | 输出 |
|-------|------|------|------|
| data-architecture-impl | 基于设计产出生成可运行的Model、Migration、Repository和缓存层代码 | ER模型、缓存策略、技术栈决策 | 项目代码 + impl-report.json |

## 执行顺序

```
阶段1                阶段2
┌──────────────┐  ┌──────────────┐
│ 数据架构设计  │→│ 数据层代码实现│
│ ER+DDL+缓存  │  │ Model+Repo   │
└──────────────┘  └──────────────┘
```

- 架构约束先行，数据模型在架构边界内设计
- 业务数据标准驱动，从PRD提取数据字典
- 设计先行，审查后实现
- 实现严格遵循设计产出，Model字段与DDL完全一致

## 输出路径

```
output/backend-data-architecture/
├── data-architecture-spec/  ← 设计规范产出
│   ├── data_dictionary.json
│   ├── er_model.json
│   ├── cache_strategy.json
│   ├── migration_plan.json
│   └── data-coverage.json
└── data-architecture-impl/  ← 实现报告产出
    └── impl-report.json

{project_dir}/src/           ← 代码文件直接写入项目目录
├── models/
├── repositories/
├── cache/
├── migrations/
├── config/
├── seeds/
└── __tests__/
    ├── models/
    └── repositories/
```

## 阶段卡口

### 进入代码实现前需满足：
- ER图+DDL+数据字典+缓存策略+迁移方案完整
- 人类审查设计产出通过

### 代码实现完成需满足：
- 代码可编译
- Migration可执行
- 代码自审P0=0

## 人类决策点

| 决策点 | 说明 |
|--------|------|
| 范式vs反范式 | 读写比决定，人类确认平衡点 |
| 分库分表策略 | 影响成本和复杂度，人类确认 |
| 缓存一致性级别 | 强一致vs最终一致，人类确认 |
| 迁移执行时间 | 低峰期窗口，人类确认 |
| 设计审查确认 | 审查数据架构设计是否满足需求，确认后才进入代码实现 |
| 数据迁移执行确认 | 迁移方案和回滚脚本生成完成，人类确认是否执行迁移 |

## 核心信念

- 数据是系统根基，模型决定上限
- 架构约束先行，数据模型在架构边界内设计
- 索引精准，每个索引有查询场景支撑
- 缓存有据，一致性显式定义
- 迁移可回滚，数据不丢失
