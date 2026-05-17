---
name: skill-finder
description: 当需要找到合适的Skill解决问题时使用。基于索引驱动的两阶段匹配，从122个Skill中智能推荐最匹配的Skill。支持自然语言意图识别、同义词扩展、上下文感知推荐。关键词：找Skill、推荐Skill、用哪个Skill、做什么用哪个、不知道用哪个、技能推荐、Skill匹配、Skill搜索。
metadata:
  module: "跨领域协调"
  sub-module: "技能发现"
  type: "guide"
  version: "1.0"
  trigger_examples:
    - "我不知道该用哪个Skill"
    - "帮我推荐一个适合的Skill"
    - "我想做竞品分析用什么Skill"
    - "用户留存低怎么解决"
    - "怎么从0到1做产品"
    - "数据异常怎么排查"
  interaction_mode: "ai_suggest_human_approve"
---

# Skill Finder — 通用技能发现与推荐

## 核心原则

1. **Index-Driven 两阶段匹配**：先查紧凑CSV索引（Phase 1），再按需加载完整SKILL.md（Phase 2），避免全量扫描浪费token
2. **五维评分 + 动态权重**：domain/lifecycle/trigger/keyword/type 五维度打分，根据意图清晰度动态调整权重
3. **语义扩展兜底**：synonym-map 处理否定表达、口语化、行业术语等用户视角表达
4. **上下文感知**：检测output/目录推断项目阶段，提升推荐相关性
5. **推荐即路由**：推荐结果直接指向可执行的Skill路径

## 执行步骤

### Phase 1: 索引匹配（~9.5k tokens）

**加载索引文件**（按优先级从高到低，均位于 `index/` 目录）：

| 文件 | 用途 | 大小 |
|------|------|------|
| `index/skill-index.csv` | 122个Skill核心索引 | ~6.5k tk |
| `index/synonym-map.csv` | 同义词/否定表达映射 | ~0.7k tk |
| `index/domain-lifecycle-map.csv` | 领域-生命周期对照 | ~0.3k tk |
| `index/execution-templates.csv` | 常见场景执行序列 | ~0.3k tk |
| `index/skill-relationships.csv` | Skill间编排/数据契约关系 | ~2.6k tk |

#### Step 1: 同义词扩展

读取 `index/synonym-map.csv`，将用户输入中的非标准表达映射为标准触发词和领域：

```
用户输入 → 扫描 synonym-map.csv 的 user_expression 列
  命中 → 扩展为 mapped_trigger + mapped_domain
  未命中 → 保留原始输入
```

**匹配规则**：
- 否定表达自动翻转："用户不活跃" → "留存下降/用户流失" + domain=growth
- 口语化映射："做竞品分析" → "竞品调研/竞争对手分析" + domain=strategy
- 行业术语映射："DAU掉了" → "DAU下降/用户流失" + domain=growth

#### Step 2: 五维评分

对 `index/skill-index.csv` 中每个Skill计算匹配分：

| 维度 | 权重(明确意图) | 权重(模糊意图) | 匹配规则 |
|------|-------------|-------------|---------|
| **trigger** | +3 | +2 | 用户输入含trigger_examples中的任一短语 |
| **domain** | +2 | +3 | 用户意图匹配skill的domain字段 |
| **lifecycle** | +2 | +2 | 用户处于的产品阶段匹配skill的lifecycle |
| **keyword** | +2 | +1 | 用户输入含keywords中的任一关键词 |
| **type** | +1 | +1 | 优先级: guide=0 > orchestrator=1 > pipeline=2 (分值 = 3-type_order) |

**意图清晰度判定**：
- 明确意图：用户提到了具体操作/工具/产出物（如"写PRD""做漏斗分析""设计API"）
- 模糊意图：用户只描述问题/状态（如"数据不好""没人用""增长慢"）

**计算方式**：
```
score = trigger_match * trigger_w
      + domain_match * domain_w
      + lifecycle_match * lifecycle_w
      + keyword_match * keyword_w
      + type_score * type_w
```

其中 match=1(命中)或0(未命中)，type_score=3-type_order。

#### Step 3: 上下文增强（可选）

检测用户项目目录下的 `output/` 目录：

```
检测规则:
  output/pm-design/ 存在 → lifecycle_boost("design", +1)
  output/pm-growth/ 存在 → lifecycle_boost("growth", +1)
  output/phase-reports/ 存在 → 读取最新阶段总结推断当前阶段
  无 output/ 目录 → 跳过上下文增强
```

#### Step 4: 歧义消歧

当 Top-3 候选分数差距 ≤ 1 时：
1. 读取 `index/skill-relationships.csv`，查看候选Skill间的上下游关系
2. 优先推荐上游Skill（先做前置步骤）
3. 如果当前处于某个orchestrator的中间阶段，优先推荐同阶段的pipeline skill

#### Step 5: 场景模板匹配

如果用户意图匹配 `index/execution-templates.csv` 中的场景：
- 直接推荐完整的编排器执行序列
- 告知用户这是端到端场景模板，可一键启动

### Phase 2: 精确加载（按需）

对 Phase 1 的 Top-3 推荐结果：
1. 读取每个推荐Skill的完整 `SKILL.md`（仅3个文件，~6-9k tokens）
2. 提取核心信息：描述、执行步骤、输入输出、交互模式
3. 向用户展示推荐理由和Skill摘要

## 输出

### 推荐结果格式

```
🎯 推荐Skill（Top-3）：

1. **{skill-name}** (置信度: {score})
   类型: {type} | 领域: {domain} | 阶段: {lifecycle}
   说明: {一句话描述}
   推荐理由: {匹配命中的维度}

2. **{skill-name}** (置信度: {score})
   ...

3. **{skill-name}** (置信度: {score})
   ...

📋 执行建议：
- 如果是orchestrator，它会自动编排子Skill
- 如果是pipeline，可直接独立执行
- 如果需要端到端流程，推荐场景模板: {template-id}
```

### 降级策略

| 场景 | 处理 |
|------|------|
| Top-3置信度均 ≤ 2 | 提示用户补充意图细节，提供domain列表供选择 |
| 完全无匹配 | 引导用户查看 pm-00-guide 获取全流程导航 |
| 多域命中（≥2个不同domain） | 分别展示各域推荐，让用户选择方向 |
| 匹配到guide类型 | 优先展示guide，guide内部会路由到具体orchestrator |

## 四层路由体系

```
Tier 0: skill-finder（本Skill）— 用户意图 → 推荐合适Skill
Tier 1: pm-00-guide — PM领域导航 → 路由到编排器
Tier 2: 33个orchestrator — 编排调度 → 调用pipeline
Tier 3: 88个pipeline — 具体执行 → 产出交付物
```

**与 pm-00-guide 的关系**：
- skill-finder 是全局入口，覆盖所有领域（PM/UI/Backend/Cross-domain）
- pm-00-guide 专注PM领域的深度导航，包含场景模板和业务映射
- 当用户意图明确指向PM领域时，skill-finder会路由到pm-00-guide

## 索引维护

### 自动生成

索引文件由 `scripts/build-skill-index.js` 自动从所有SKILL.md的frontmatter生成：

```bash
# 在项目根目录执行
node scripts/build-skill-index.js
```

### 何时重新生成

- 新增/删除/修改Skill时
- 修改SKILL.md的metadata字段时
- 特别注意：trigger_examples、domain_tags变更影响最大

### 不需要手动维护

- `index/skill-index.csv` → 自动从SKILL.md frontmatter提取
- `index/skill-relationships.csv` → 自动从orchestrator YAML + 手动数据契约生成
- `index/synonym-map.csv` → 需要手动补充（用户口语表达的映射）
- `index/execution-templates.csv` → 需要手动补充（新增场景模板时）
- `index/domain-lifecycle-map.csv` → 仅在新增领域时更新
