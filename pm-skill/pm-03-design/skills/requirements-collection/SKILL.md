---
name: requirements-collection
description: 当需要收集和分类分散的需求来源时使用。需求自动收集与分类，将分散的需求来源整合为结构化需求列表，包含采集、分类、可信度标注和去噪四个步骤。执行角色：🤖 AI自动执行。关键词：需求收集、需求分类、需求采集、可信度标注、需求去噪。
metadata:
  module: "产品构思与设计"
  sub-module: "需求管理"
  type: "pipeline"
  pipeline: "1"
  version: "1.0"
  interaction_mode: "ai_auto"
---

# Pipeline 1：需求自动收集与分类

## 核心原则

1. **批量生成人类筛选**：AI批量生成分类/排序建议，人类做最终筛选和判定
2. **结构化发散**：用固定模板和框架引导需求拆解，避免遗漏和随意性
3. **假设驱动而非功能驱动**：每个需求背后必须还原为用户假设，而非直接进入功能设计
4. **设计规范即约束**：需求分析阶段就引入设计规范约束，避免后期返工

### 基本信息

| 属性 | 值 |
|------|-----|
| 执行角色 | 🤖 AI自动执行 |
| 输入 | sources配置 |
| 输出 | requirements[] |
| 输出目录 | output/pm-design/requirements-collection/ |

---

## 交互模式

🤖 AI自动执行

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| sources配置 | YAML/JSON | 是 | 用户提供 | 需求采集渠道配置，含用户反馈、行为数据、业务需求、竞品更新、战略输入等数据源连接器及同步频率 |

### 输入格式

```yaml
sources:
  user_feedback:
    connector: "用户反馈系统连接器"
    sync_frequency: "daily"  # daily/weekly/realtime
  behavior_data:
    connector: "行为数据连接器"
    sync_frequency: "daily"
  business_requests:
    connector: "业务需求系统连接器"
    sync_frequency: "weekly"
  competitor_updates:
    connector: "竞品监控系统连接器"
    sync_frequency: "weekly"
  strategic_input:
    connector: "战略输入源连接器"
    sync_frequency: "monthly"
```

---

## 执行步骤

### Step 1: 需求采集

**动作**：
1. 自动拉取所有配置渠道的最新数据
2. 格式统一化处理
3. 时间去重（同一需求72小时内重复出现计为1次）

**输出**：`raw_requirements[]`

---

### Step 2: 需求自动分类

**分类维度**：

| 类别 | 定义 | 关键词示例 |
|------|------|------------|
| Bug类 | 现有功能无法正常使用 | 报错、崩溃、不能使用、无响应、错误 |
| 优化类 | 现有功能体验改进 | 优化、改进、提升、太慢、太复杂、希望能... |
| 新功能类 | 新增功能满足新需求 | 希望有、新增、想要、希望能增加 |
| 战略类 | 业务方向/市场机会驱动 | 战略、布局、竞争、增长、变现 |

**分类规则**：
- 基于关键词 + 语义分析双重判定
- 置信度 < 0.7 → 标记为 `pending_human_review: true`
- 边界case → 归类为"优化类"（保守策略）

**输出**：`classified_requirements[]`（含 category + classification_confidence）

---

### Step 3: 来源可信度标注

**可信度矩阵**：

| 来源类型 | 可信度 | 说明 |
|----------|--------|------|
| 数据驱动 | 0.9 | A/B测试、埋点数据、转化漏斗等客观数据 |
| 多用户 | 0.85 | 多个独立用户反馈同一问题 |
| 单用户 | 0.6 | 单个用户反馈 |
| 业务转述 | 0.5 | 一线业务人员转述 |
| 老板说 | 0.3 | 高层直接提出的需求（需还原真实诉求） |
| 竞品有 | 0.4 | 竞品新上线的功能（需还原用户期望） |

**标注规则**：
- 每个需求必须标注来源类型和可信度
- 同一来源多个反馈 → 叠加可信度（上限0.95）
- 来源不明确 → 默认0.5

**输出**：`classified_requirements[]`（含 source_credibility）

---

### Step 4: 需求去噪

**去噪规则**：

| 规则 | 条件 | 动作 |
|------|------|------|
| 语义相似度合并 | similarity > 0.85 | 合并，保留高频表述 |
| 已完成匹配 | 命中已完成需求库 | 标记 `already_implemented: true` |
| 无效过滤 | 纯情绪宣泄/技术不可行 | 标记 `invalid: true` + 原因 |

**相似度计算**：
- 文本向量化 + 余弦相似度
- 关键词匹配权重30%，语义匹配权重70%

**输出**：`requirements[]`（已去噪）

---

## 输出

**存储路径**：`output/pm-design/requirements-collection/`
**输出文件**：requirements.json

### requirements[] 数据结构

```json
{
  "requirements": [
    {
      "id": "REQ-2026-0001",
      "source": "user_feedback",
      "original_text": "支付按钮点击没反应",
      "category": "bug",
      "classification_confidence": 0.92,
      "source_credibility": 0.85,
      "duplicate_count": 3,
      "frequency_trend": "stable",
      "pending_human_review": false,
      "created_at": "2026-05-08T10:00:00Z"
    }
  ]
}
```

### 输出字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 唯一标识，格式：REQ-YYYY-NNNN |
| source | enum | 来源类型 |
| original_text | string | 原始需求文本 |
| category | enum | bug/optimization/new_feature/strategic |
| classification_confidence | float | 分类置信度，0-1 |
| source_credibility | float | 来源可信度，0-1 |
| duplicate_count | int | 重复出现次数 |
| frequency_trend | enum | rising/stable/declining |
| pending_human_review | boolean | 是否需要人工复核 |
| already_implemented | boolean | 是否已实现 |
| invalid | boolean | 是否为无效需求 |
| invalid_reason | string | 无效原因（可选） |

---

## 决策规则

### 分类置信度决策

| 置信度范围 | 动作 |
|------------|------|
| ≥ 0.7 | 自动分类通过，进入下一处理阶段 |
| < 0.7 | 标记 `pending_human_review: true`，等待人工分类 |

---

## 质量检查

质量检查必须在输出前完成：

| 检查项 | 标准 | 不通过动作 |
|--------|------|------------|
| 渠道同步完整性 | 所有配置渠道已完成同步 | 记录缺失渠道，等待补充 |
| 分类置信度标注 | 每个需求都有分类置信度 | 返回Step 2补充标注 |
| 去噪执行 | 去噪后需求列表已更新 | 返回Step 4重新执行 |
| 格式统一 | 所有输出符合Schema规范 | 返回对应Step修复格式 |

---

## 降级策略

当上游文件不存在时，本Skill仍可独立执行：

| 缺失的上游文件 | 降级方案 |
|---------------|---------|
| 无（本Skill为起始Skill） | 无上游依赖，但需要用户需求输入 |
| 所有数据源均缺失 | 提示用户提供需求文本/截图 → 直接分类整理 |

数据获取说明：
- 本Skill需要需求文本数据，请通过以下方式之一提供：
  1. 直接粘贴需求文本或截图描述
  2. 上传需求文档（Word/PDF/CSV/Excel）
  3. 提供数据文件路径
- AI不负责外部数据采集，仅负责分析