---
name: data-migration
description: 当需要设计数据迁移方案时使用。数据迁移方案自动设计，设计数据库版本管理、Schema迁移、数据迁移和回滚方案，确保数据库变更安全可控。关键词：数据迁移、Schema迁移、版本管理、回滚、Flyway、Liquibase。
metadata:
  module: "后端架构与开发"
  sub-module: "数据架构"
  type: "pipeline"
  version: "1.0"
  interaction_mode: "ai_suggest_human_approve"
---

# Pipeline 16: 数据迁移方案自动设计

## 核心原则

1. **可回滚**：每个迁移必须有对应的回滚脚本
2. **向前兼容**：先部署兼容旧Schema的代码，再执行迁移
3. **零停机**：大表迁移使用在线DDL或双写策略
4. **数据不丢**：迁移前备份，迁移后校验

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 当前Schema | SQL/JSON | 是 | 用户提供 | 现有数据库表结构 |
| 目标Schema | SQL/JSON | 是 | output/backend-data-architecture/data-model | 新的数据库表结构 |
| 数据量 | JSON | ○ | 用户提供 | 各表数据量级 |

## 执行步骤

### Step 1: Schema差异分析

对比当前Schema和目标Schema，识别变更类型：

| 变更类型 | 风险等级 | 是否需要回滚脚本 |
|----------|---------|----------------|
| 新增表 | 低 | 是（DROP TABLE） |
| 新增列 | 低 | 是（DROP COLUMN） |
| 修改列类型 | 高 | 是（ALTER COLUMN） |
| 删除列 | 高 | 是（数据备份+恢复） |
| 删除表 | 极高 | 是（完整数据备份） |
| 重命名列 | 中 | 是（RENAME COLUMN） |
| 新增索引 | 低 | 是（DROP INDEX） |
| 删除索引 | 低 | 是（CREATE INDEX） |

### Step 2: 迁移脚本生成

按顺序生成迁移脚本：

**命名规范**：`V{version}__{description}.sql`

**脚本分类**：
- 结构变更脚本（DDL）
- 数据迁移脚本（DML）
- 回滚脚本（ROLLBACK）

**脚本内容规范**：
- 每个脚本只做一件事
- 脚本必须幂等（可重复执行不报错）
- 包含前置检查（IF NOT EXISTS / IF EXISTS）
- 包含执行时间预估

### Step 3: 大表迁移策略

针对大表（>100万行）的特殊迁移策略：

| 场景 | 策略 | 停机时间 |
|------|------|---------|
| 新增列（无默认值） | 直接ALTER TABLE | 0 |
| 新增列（有默认值） | 分步：先加列NULL→回填数据→加NOT NULL约束 | 0 |
| 修改列类型 | 双写+异步迁移+切换 | 0 |
| 删除列 | 先代码不引用→下个版本删列 | 0 |
| 重命名列 | 先加新列→双写→迁移→删旧列 | 0 |
| 分库分表 | 双写+异步迁移+校验+切换 | 0 |

### Step 4: 数据校验方案

设计迁移后的数据校验：

| 校验类型 | 方法 | 通过标准 |
|----------|------|---------|
| 行数校验 | COUNT(*)对比 | 源表=目标表 |
| 校验和 | CRC32/SUM对比 | 100%一致 |
| 抽样校验 | 随机抽取100行逐字段对比 | 100%一致 |
| 业务校验 | 核心业务流程端到端验证 | 全部通过 |

### Step 5: 回滚方案设计

为每个迁移步骤设计回滚方案：

- **自动回滚**：迁移脚本执行失败→自动回滚当前脚本
- **手动回滚**：迁移后发现问题→执行回滚脚本
- **数据恢复**：误删数据→从备份恢复
- **代码回滚**：Schema回滚→同步回滚应用代码

**回滚时间要求**：
- 结构回滚≤5分钟
- 数据回滚≤30分钟（取决于数据量）
- 全量恢复≤2小时

## 输出

**存储路径**：`output/backend-data-architecture/data-migration/`

**输出文件**：migration-plan.json

```json
{
  "migration_metadata": {
    "from_version": "1.0",
    "to_version": "2.0",
    "total_changes": 12,
    "risk_level": "medium",
    "estimated_downtime": "0min"
  },
  "changes": [
    { "type": "add_table", "table": "notifications", "risk": "low" },
    { "type": "add_column", "table": "courses", "column": "difficulty_level", "risk": "low" },
    { "type": "modify_column", "table": "users", "column": "phone", "risk": "high" }
  ],
  "scripts": [
    { "path": "migrations/V2.001__add_notifications_table.sql", "type": "ddl" },
    { "path": "migrations/V2.002__add_course_difficulty.sql", "type": "ddl" },
    { "path": "migrations/V2.003__migrate_user_phone.sql", "type": "dml" },
    { "path": "rollback/R2.001__drop_notifications_table.sql", "type": "rollback" },
    { "path": "rollback/R2.002__drop_course_difficulty.sql", "type": "rollback" },
    { "path": "rollback/R2.003__restore_user_phone.sql", "type": "rollback" }
  ],
  "validation": {
    "row_count_check": true,
    "checksum_check": true,
    "sample_check": 100,
    "business_check": ["用户登录", "课程报名", "支付流程"]
  }
}
```

## 决策规则

| 条件 | 决策 |
|------|------|
| 变更涉及删除列/表 | 风险=高，强制生成回滚脚本+数据备份 |
| 变更涉及修改列类型 | 风险=高，使用双写策略 |
| 单表数据量>100万行 | 使用在线DDL或分步迁移 |
| 单表数据量>1000万行 | 使用双写+异步迁移 |
| 迁移涉及核心业务表 | 安排在低峰期执行 |
| 迁移脚本执行失败 | 自动回滚当前脚本，不继续 |

## 质量检查

- [ ] 100%的变更有对应回滚脚本
- [ ] 大表迁移使用零停机策略
- [ ] 迁移脚本幂等可重复执行
- [ ] 数据校验覆盖行数+校验和+抽样3种
- [ ] 回滚时间有明确预估

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 当前Schema缺失 | 无法做差异分析 | 无法生成迁移脚本 |
| 目标Schema缺失 | 无法设计迁移 | 输出为空 |
| 数据量信息缺失 | 默认小表策略 | 大表可能需要调整迁移策略 |

数据获取说明：
- 本Skill需要当前Schema和目标Schema，请通过以下方式之一提供：
  1. 上传当前和目标的DDL文件
  2. 提供数据库连接信息（仅读取Schema）
  3. 描述需要变更的表和字段
