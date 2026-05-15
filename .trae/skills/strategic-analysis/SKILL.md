---
name: strategic-analysis
description: 战略分析，根据产品阶段和行业特征自动选择适用的战略框架（SWOT/Ansoff/波特五力）。关键词：战略分析、SWOT、Ansoff矩阵、波特五力、战略规划。
metadata:
  module: "产品商业与战略"
  sub-module: "战略规划与路线图"
  type: "pipeline"
  version: "3.0"
  domain_tags: ["通用"]
  trigger_examples:
    - "帮我分析一下优劣势"
    - "我们的机会和威胁是什么"
    - "我们该怎么扩张市场"
    - "下一步增长方向在哪"
    - "这个行业值得进入吗"
    - "分析一下行业竞争格局"
    - "做一下战略分析"
  interaction_mode: "ai_suggest_human_approve"
---

# Strategic Analysis — 战略分析

## 核心原则

1. **框架选择先于执行**——根据产品阶段和行业特征自动选择1-2个最适用的战略框架，不是所有框架都适用所有场景
2. **内外交叉验证**——SWOT的S/W来自内部能力评估，O/T来自外部数据，不可混淆来源；Ansoff路径必须与SWOT优势/劣势交叉验证
3. **证据强制标注**——每项分析条目必须有数据或事实支撑，标注置信度，低置信度自动升级人类校准
4. **风险递增原则**——从市场渗透到多元化，风险递增需显式标注；五力评分中行业吸引力总评必须人类决策
5. **双路径推演**——Ansoff至少推荐2条增长路径，含风险等级和可行性评估
6. **五力全覆盖**——新进入者、替代品、供应商、买家、同业竞争五种力量缺一不可

## 交互模式

🤖→👤 AI 建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 探索阶段输出 | JSON | 是 | user-research-user-modeling / opportunity-definition | 用户痛点、需求洞察 |
| 竞品分析数据 | JSON | 是 | output/pm-discovery/market-competitor-analysis/competitor-analysis.json | 竞品定位、功能对比 |
| BMC商业模式画布 | JSON | ○ | output/pm-strategy/business-model-canvas/bmc.json | 价值主张、核心资源 |
| 市场数据 | JSON | ○ | output/pm-discovery/market-tam-som/tam-som.json | 市场规模、增长率 |
| 行业信息 | JSON | ○ | output/pm-discovery/market-pest/pest.json | 政策法规、技术动态 |
| 内部能力评估 | JSON | ○ | 用户提供 | 技术/品牌/资源/财务能力 |
| 当前产品定义 | string | ○ | 用户提供 | 产品核心功能和价值主张描述 |
| 当前市场定义 | string | ○ | 用户提供 | 目标市场、用户群体描述 |
| 增长目标 | string | ○ | output/pm-strategy/planning-okr/okr.json | 期望的增长方向和目标 |

## 执行步骤

### Step 1: 框架选择

根据输入的产品阶段和行业特征，自动选择1-2个最适用的战略框架。

**框架选择规则**：

| 场景特征 | 推荐框架 | 选择理由 |
|----------|----------|----------|
| 新产品/新市场进入 | SWOT + 波特五力 | 需要同时评估内部能力和外部行业吸引力 |
| 现有产品增长决策 | SWOT + Ansoff | 需要评估优劣势并确定增长路径 |
| 行业竞争格局分析 | 波特五力 | 聚焦行业结构和竞争强度 |
| 战略定位与方向选择 | SWOT | 聚焦内外交叉分析生成战略方向 |
| 市场扩张决策 | Ansoff + 波特五力 | 需要评估增长路径和目标市场吸引力 |
| 完整战略规划 | SWOT + Ansoff + 波特五力 | 全方位战略分析 |

**选择逻辑**：

1. 若用户提供内部能力评估 → SWOT适用
2. 若用户提供产品/市场定义 → Ansoff适用
3. 若用户提供竞品和市场数据 → 波特五力适用
4. 默认推荐：SWOT（通用性最强）
5. 最多选择2个框架（避免分析过度），若3个均适用则优先SWOT + Ansoff

### Step 2: 执行分析

按选择的框架执行战略分析。

#### 2a: SWOT分析

**Step 2a-1: 内部优势识别 (Strengths)**

分析企业内部优势：核心技术和专利、品牌知名度和声誉、用户基础和忠诚度、渠道和网络资源、人才和组织能力、财务资源和现金流

**Step 2a-2: 内部劣势识别 (Weaknesses)**

分析企业内部劣势：技术或产品差距、品牌认知不足、资源或能力缺陷、组织结构问题、财务限制

**Step 2a-3: 外部机会识别 (Opportunities)**

分析外部市场机会：市场规模和增长、政策支持、技术变革带来的机会、细分市场空白、合作伙伴机会、用户需求变化

**Step 2a-4: 外部威胁识别 (Threats)**

分析外部市场威胁：竞争对手动作、替代品威胁、政策法规风险、技术颠覆风险、市场萎缩、经济环境变化

**Step 2a-5: 战略方向生成**

基于SWOT交叉分析生成4种战略：

| 策略类型 | 含义 |
|----------|------|
| SO策略 (Strengths-Opportunities) | 利用优势抓住机会 |
| ST策略 (Strengths-Threats) | 利用优势规避威胁 |
| WO策略 (Weaknesses-Opportunities) | 利用机会弥补劣势 |
| WT策略 (Weaknesses-Threats) | 收缩防御，最小化劣势和威胁 |

#### 2b: Ansoff矩阵分析

**Step 2b-1: 当前象限判断**

```
                    │ 现有产品      │ 新产品
────────────────────┼───────────────┼──────────────
    现有市场        │ 市场渗透      │ 产品开发
                    │ (Penetration) │ (Development)
────────────────────┼───────────────┼──────────────
    新市场          │ 市场开发      │ 多元化
                    │ (Development) │ (Diversification)
```

**Step 2b-2: 增长路径推荐**

基于SWOT和增长目标，推荐1-2条增长路径，每条路径包含：
- 路径名称和类型
- 风险等级 (High/Medium/Low)
- 资源需求 (High/Medium/Low)
- 预期回报 (High/Medium/Low)
- 时间线 (周期)
- 可行性评估（市场吸引力、能力匹配度、资源可获得性、风险可控性）

**Step 2b-3: 路径可行性评估**

评估每条路径的可行性：市场吸引力、能力匹配度、资源可获得性、风险可控性

#### 2c: 波特五力分析

**Force 1: 新进入者威胁**

| 得分 | 标准 |
|------|------|
| 1 | 进入壁垒极高，几乎不可能进入 |
| 2 | 进入壁垒较高，新进入者困难 |
| 3 | 中等壁垒，存在一定进入可能 |
| 4 | 进入壁垒较低，容易进入 |
| 5 | 进入壁垒很低，极易进入 |

评估因素：进入门槛高低、品牌忠诚度、规模经济要求、转换成本、资本要求、分销渠道控制

**Force 2: 替代品威胁**

| 得分 | 标准 |
|------|------|
| 1 | 几乎没有替代品 |
| 2 | 替代品较少，转换成本高 |
| 3 | 存在一定替代品 |
| 4 | 替代品较多，价格优势明显 |
| 5 | 大量替代品，威胁极大 |

评估因素：替代品数量和质量、转换成本、替代品价格优势、用户对替代品的接受度

**Force 3: 供应商议价能力**

| 得分 | 标准 |
|------|------|
| 1 | 供应商分散，议价能力弱 |
| 2 | 供应商较多，选择余地大 |
| 3 | 供应商能力中等 |
| 4 | 供应商集中，议价能力强 |
| 5 | 供应商垄断，议价能力极强 |

评估因素：供应商数量和集中度、切换供应商成本、前向整合可能性、供应商产品差异化、供应商规模

**Force 4: 买家议价能力**

| 得分 | 标准 |
|------|------|
| 1 | 买家分散，议价能力弱 |
| 2 | 买家较多，选择余地大 |
| 3 | 买家能力中等 |
| 4 | 买家集中，议价能力强 |
| 5 | 买家垄断，议价能力极强 |

评估因素：买家数量和集中度、转换成本、价格敏感度、买家信息透明度、购买量大小

**Force 5: 同业竞争强度**

| 得分 | 标准 |
|------|------|
| 1 | 竞争温和，市场稳定 |
| 2 | 竞争适中，有序发展 |
| 3 | 竞争中等，波动明显 |
| 4 | 竞争激烈，价格战常见 |
| 5 | 竞争白热化，淘汰频繁 |

评估因素：竞争者数量和规模、行业增长率、产品差异化程度、退出壁垒高低、竞争策略多样性

### Step 3: 战略结论整合

将各框架的分析结论进行整合，生成统一的战略建议。

**整合规则**：

1. SWOT战略方向 + Ansoff增长路径交叉验证：SO策略与Ansoff推荐路径是否一致
2. 波特五力行业吸引力 + Ansoff路径可行性：行业吸引力低时，增长路径风险需上调
3. SWOT优势 + 波特五力竞争壁垒：优势是否构成竞争壁垒，壁垒是否可维持
4. 生成整合后的战略建议列表，按优先级排序

## 输出

输出路径：`output/pm-strategy/strategic-analysis/`

输出文件：strategic-analysis.json + strategic-analysis.md

### 输出Schema

```json
{
  "type": "object",
  "required": ["framework_selection", "swot", "ansoff", "porter", "strategic_conclusions", "metadata"],
  "properties": {
    "framework_selection": {"type": "object", "description": "框架选择结果及理由"},
    "swot": {"type": "object", "description": "SWOT分析结果，未选择时为null"},
    "ansoff": {"type": "object", "description": "Ansoff矩阵分析结果，未选择时为null"},
    "porter": {"type": "object", "description": "波特五力分析结果，未选择时为null"},
    "strategic_conclusions": {"type": "object", "description": "整合后的战略结论"},
    "metadata": {"type": "object", "description": "元数据，含版本、时间戳和来源文件"}
  }
}
```

### 输出校验规则

#### framework_selection 校验

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| `framework_selection.selected_frameworks` | array | 是 | 选择的框架列表，1-2个，必须为swot/ansoff/porter之一 |
| `framework_selection.selection_rationale` | string | 是 | 选择理由，不可为空 |

#### swot 校验（选择时必填）

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| `swot.strengths` | array | 是 | 优势列表，每项含item、confidence、evidence |
| `swot.weaknesses` | array | 是 | 劣势列表，每项含item、confidence、evidence |
| `swot.opportunities` | array | 是 | 机会列表，每项含item、confidence、evidence |
| `swot.threats` | array | 是 | 威胁列表，每项含item、confidence、evidence |
| `swot.strategies` | array | 是 | 4种战略方向 |
| `swot.strategies[].type` | string | 是 | SO/ST/WO/WT |
| `swot.strategies[].strategy` | string | 是 | 战略名称 |
| `swot.strategies[].key_actions` | array | 是 | 关键行动列表 |
| `swot.strategies[].expected_outcome` | string | 是 | 预期成果 |

#### ansoff 校验（选择时必填）

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| `ansoff.current_position.quadrant` | string | 是 | 当前象限 |
| `ansoff.current_position.description` | string | 是 | 当前定位描述 |
| `ansoff.current_position.rationale` | array | 是 | 定位理由列表 |
| `ansoff.growth_paths` | array | 是 | 至少2条增长路径 |
| `ansoff.growth_paths[].path` | string | 是 | 路径名称 |
| `ansoff.growth_paths[].quadrant` | string | 是 | 目标象限 |
| `ansoff.growth_paths[].risk_level` | string | 是 | high/medium/low |
| `ansoff.growth_paths[].feasibility.overall` | number | 是 | 可行性综合评分0-1 |
| `ansoff.growth_paths[].key_actions` | array | 是 | 关键行动列表 |
| `ansoff.growth_paths[].risks` | array | 是 | 风险列表，含mitigation |
| `ansoff.recommendations.primary` | string | 是 | 推荐主路径 |
| `ansoff.recommendations.rationale` | string | 是 | 推荐理由 |

#### porter 校验（选择时必填）

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| `porter.new_entrant_threat.score` | number | 是 | 1-5分 |
| `porter.new_entrant_threat.key_factors` | array | 是 | 关键影响因素列表 |
| `porter.substitutes_threat.score` | number | 是 | 1-5分 |
| `porter.substitutes_threat.key_factors` | array | 是 | 关键影响因素列表 |
| `porter.supplier_power.score` | number | 是 | 1-5分 |
| `porter.supplier_power.key_factors` | array | 是 | 关键影响因素列表 |
| `porter.buyer_power.score` | number | 是 | 1-5分 |
| `porter.buyer_power.key_factors` | array | 是 | 关键影响因素列表 |
| `porter.competitive_rivalry.score` | number | 是 | 1-5分 |
| `porter.competitive_rivalry.key_factors` | array | 是 | 关键影响因素列表 |
| `porter.industry_attractiveness.overall_score` | number | 是 | 综合评分 |
| `porter.industry_attractiveness.rating` | string | 是 | 吸引力等级 |
| `porter.key_recommendations` | array | 是 | 战略建议列表 |

#### strategic_conclusions 校验

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| `strategic_conclusions.integrated_recommendations` | array | 是 | 整合后的战略建议列表，不可为空 |
| `strategic_conclusions.integrated_recommendations[].recommendation` | string | 是 | 战略建议 |
| `strategic_conclusions.integrated_recommendations[].priority` | string | 是 | 优先级：high/medium/low |
| `strategic_conclusions.integrated_recommendations[].supporting_frameworks` | array | 是 | 支撑该建议的框架列表 |
| `strategic_conclusions.integrated_recommendations[].evidence` | string | 是 | 证据依据 |
| `strategic_conclusions.cross_validation_notes` | array | 是 | 跨框架交叉验证说明 |
| `strategic_conclusions.human_decisions_needed` | array | 是 | 需人类决策的事项列表 |

### Output JSON 示例

```json
{
  "framework_selection": {
    "selected_frameworks": ["swot", "ansoff"],
    "selection_rationale": "用户提供内部能力评估和产品/市场定义，适合SWOT+Ansoff组合分析"
  },
  "swot": {
    "strengths": [
      { "item": "拥有自研AI自适应学习引擎", "confidence": 0.85, "evidence": "专利号ZL2023XXXXXX，A/B测试显示学习效率提升32%" }
    ],
    "weaknesses": [
      { "item": "K12学科内容资源不足", "confidence": 0.75, "evidence": "内容SKU对比：竞品A覆盖12学科vs我方3学科" }
    ],
    "opportunities": [
      { "item": "职业教育政策红利期", "confidence": 0.80, "evidence": "国务院2024年《职业教育改革实施方案》" }
    ],
    "threats": [
      { "item": "互联网巨头以免费策略切入市场", "confidence": 0.70, "evidence": "竞品B 2024Q3推出免费基础版" }
    ],
    "strategies": [
      { "type": "SO", "strategy": "AI引擎+企业培训市场渗透", "key_actions": ["与50家中大型企业签订培训平台试点协议", "推出企业版AI学习路径定制功能"], "expected_outcome": "6个月内企业客户数增长40%" },
      { "type": "ST", "strategy": "技术壁垒防御与差异化定价", "key_actions": ["加速AI引擎迭代，保持6个月技术领先窗口", "推出按效果付费模式"], "expected_outcome": "客户留存率维持在85%以上" },
      { "type": "WO", "strategy": "内容生态补强与政策红利捕获", "key_actions": ["与3家头部职业院校达成内容授权合作", "申请职业教育数字化转型专项补贴"], "expected_outcome": "课程SKU从3学科扩展至8学科" },
      { "type": "WT", "strategy": "聚焦核心赛道收缩防御", "key_actions": ["暂停K12学科拓展，资源集中投入编程与职业培训", "建立客户成功团队，提升存量客户续费率"], "expected_outcome": "核心赛道续费率提升至90%" }
    ]
  },
  "ansoff": {
    "current_position": {
      "quadrant": "市场渗透",
      "description": "当前定位于现有市场中的现有产品",
      "rationale": ["产品成熟稳定", "市场渗透率已达较高水平", "增长空间受限"]
    },
    "growth_paths": [
      {
        "path": "市场开发",
        "quadrant": "市场开发",
        "risk_level": "medium",
        "resource_requirement": "medium",
        "expected_return": "medium",
        "timeline": "6-12个月",
        "feasibility": { "overall": 0.70, "market_attractiveness": 0.75, "capability_match": 0.80, "resource_availability": 0.65, "risk_controllability": 0.60 },
        "key_actions": ["识别目标新市场细分", "调整产品适配新市场", "建立新渠道合作关系"],
        "risks": [{ "risk": "市场认知不足", "mitigation": "品牌联合推广" }]
      },
      {
        "path": "产品开发",
        "quadrant": "产品开发",
        "risk_level": "high",
        "resource_requirement": "high",
        "expected_return": "high",
        "timeline": "12-18个月",
        "feasibility": { "overall": 0.55, "market_attractiveness": 0.85, "capability_match": 0.50, "resource_availability": 0.40, "risk_controllability": 0.45 },
        "key_actions": ["新产品技术研发", "MVP快速验证", "用户测试迭代"],
        "risks": [{ "risk": "技术研发失败", "mitigation": "多方案并行" }]
      }
    ],
    "recommendations": {
      "primary": "市场开发",
      "rationale": "风险可控，资源需求适中，与现有能力匹配度高"
    }
  },
  "porter": null,
  "strategic_conclusions": {
    "integrated_recommendations": [
      { "recommendation": "优先执行市场开发策略，利用AI引擎优势开拓企业培训新市场", "priority": "high", "supporting_frameworks": ["swot", "ansoff"], "evidence": "SO策略与Ansoff市场开发路径一致，可行性评分0.70" },
      { "recommendation": "同步推进技术壁垒建设，保持差异化竞争优势", "priority": "medium", "supporting_frameworks": ["swot"], "evidence": "ST策略应对互联网巨头威胁" }
    ],
    "cross_validation_notes": [
      "SWOT SO策略与Ansoff市场开发路径方向一致，相互验证",
      "SWOT WT策略建议收缩聚焦，与Ansoff市场开发路径存在张力，建议优先执行市场开发但控制资源投入"
    ],
    "human_decisions_needed": [
      { "item": "战略方向选择", "context": "SO策略（市场渗透）vs WO策略（内容补强）vs 市场开发路径，需人类决策最终方向", "urgency": "高" },
      { "item": "资源分配优先级", "context": "市场开发与产品开发两条路径的资源分配需人类决策", "urgency": "高" }
    ]
  },
  "metadata": {
    "version": "3.0",
    "generated_at": "2026-05-14T21:00:00Z",
    "source_files": [
      "output/pm-discovery/market-competitor-analysis/competitor-analysis.json",
      "output/pm-strategy/business-model-canvas/bmc.json"
    ]
  }
}
```

## 决策规则

1. **SWOT置信度升级**：置信度 < 0.6的项目自动升级人类校准
2. **SWOT战略选择**：4种战略方向必须人类最终选择
3. **Ansoff增长路径选择**：必须人类最终决策
4. **Ansoff风险评估**：人类判断风险接受程度
5. **波特五力评分校准**：各力量评分需人类校准确认
6. **波特五力行业吸引力**：总评必须人类判断
7. **框架选择可覆盖**：AI自动选择的框架人类可调整，人类指定框架时优先执行

## 质量检查

| 检查项 | 通过条件 |
|--------|----------|
| 框架选择合理 | selected_frameworks非空且选择理由充分 |
| SWOT每项分析有数据支撑 | evidence字段非空 |
| SWOT 4种战略方向都已生成 | strategies包含SO/ST/WO/WT |
| SWOT置信度评估已完成 | 每项有confidence值 |
| Ansoff 4个象限都已分析 | 当前定位已确定 |
| Ansoff 1-2条增长路径已推荐 | growth_paths非空 |
| Ansoff 每条路径有风险等级标注 | risk_level非空 |
| Ansoff 可行性评估已完成 | feasibility非空 |
| 波特五力5种力量都已评估 | 5个force均有score |
| 波特五力评分有数据依据 | key_factors非空 |
| 波特五力行业吸引力总评已完成 | industry_attractiveness非空 |
| 战略结论已整合 | integrated_recommendations非空 |
| 跨框架交叉验证已完成 | cross_validation_notes非空 |
| 人类决策项已列出 | human_decisions_needed非空 |

---

## 降级策略

当上游文件不存在时，本Skill仍可独立执行：

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|----------|
| exploration_outputs（persona / opportunity-definition等） | 用户提供产品现状描述 → 基于描述生成分析 | 缺乏探索阶段数据，O/T可能缺乏用户端实证 |
| competitor-analysis.json | 用户提供产品/行业现状描述 → 基于描述生成分析 | 缺乏竞品分析数据，T和部分O缺乏竞品参照，波特五力同业竞争评分可能不够精准 |
| bmc.json | 用户提供产品现状描述 → 基于描述生成分析 | 缺乏BMC数据，S/W与商业模型关联度可能偏弱 |
| 市场数据（tam-som / pest） | 用户提供行业信息 → 基于AI知识评估 | 缺乏市场数据，行业吸引力评估缺乏量化依据 |
| 内部能力评估（用户提供） | 提示用户提供或跳过该输入相关步骤 | S/W缺乏内部数据支撑，可能偏主观 |
| 当前产品/市场定义 | 用户提供产品现状 → 定位Ansoff象限 | 缺乏结构化产品市场定义，象限定位可能不够精准 |
| 所有上游文件均缺失 | 提示用户先执行前序阶段，或基于用户提供的产品现状描述直接生成分析 | 整体置信度显著降低，分析主要为AI推断 |

## 数据获取说明

本Skill需要探索输出、竞品分析和BMC数据，请通过以下方式之一提供：
  1. 直接描述产品现状、优势和挑战
  2. 上传competitor-analysis.json / bmc.json等文件
  3. 提供数据文件路径
- AI不负责外部数据采集，仅负责分析

## 上游变更响应

### 上游变更影响表

| 上游数据源 | 变更类型 | 影响维度 | 影响描述 | 响应策略 |
|-----------|----------|----------|----------|----------|
| persona/opportunity-definition | 用户洞察更新 | SWOT的O和T | 用户洞察变化影响机会和威胁评估 | 重新执行SWOT Step 3-4，更新机会和威胁 |
| competitor-analysis.json | 竞品数据更新 | SWOT的T和部分O / 波特五力Force1和Force5 | 竞品变化影响威胁评估和竞争分析 | 重新执行SWOT Step 3-4和波特五力Force1/5 |
| bmc.json | 商业模式变更 | SWOT的S和W | 商业模式变化影响优势和劣势 | 重新执行SWOT Step 1-2 |
| tam-som.json | 市场规模变更 | 波特五力行业吸引力 / Ansoff可行性 | 市场数据变化影响吸引力评估 | 重新计算行业吸引力综合评分和Ansoff可行性 |
| pest.json | 政策/技术环境变更 | 波特五力多项因素 | 环境变化影响多力评估 | 重新评估受影响的力 |
| okr.json | 增长目标调整 | Ansoff增长路径推荐 | 增长目标变化影响路径方向 | 重新执行Ansoff Step 2 |

### 下游通知机制表

| 下游消费者 | 通知字段 | 通知时机 | 通知内容 |
|-----------|----------|----------|----------|
| planning-okr | `strategic_conclusions.integrated_recommendations` | 战略结论变更后 | 通知战略方向调整及优先级变化 |
| planning-roadmap | `strategic_conclusions.integrated_recommendations` | 战略结论变更后 | 通知战略方向调整 |
| business-strategy-report | `swot.strategies` / `ansoff.growth_paths` / `porter.industry_attractiveness` | 各框架分析变更后 | 通知分析结果变化 |

## 变更记录

- v3.0: 合并 planning-swot + planning-ansoff + planning-porter-five-forces 为 strategic-analysis，新增框架自动选择逻辑和战略结论整合步骤
