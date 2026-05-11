---
name: planning-swot
description: 当需要进行战略定位、竞争优势分析、战略方向选择时使用。SWOT自动分析。对内部优势/劣势、外部机会/威胁进行系统分析，并生成SO/ST/WO/WT战略方向。关键词：SWOT分析、战略定位、竞争优势、战略方向、机会威胁。
metadata:
  module: "产品商业与战略"
  sub-module: "战略规划与路线图"
  type: "pipeline"
  version: "2.0"
  interaction_mode: "ai_suggest_human_approve"
---

# Pipeline 7: SWOT自动分析

## 核心原则

1. **内外交叉验证**——S/W来自内部能力评估，O/T来自外部数据，不可混淆来源
2. **证据强制标注**——每项SWOT条目必须有数据或事实支撑，标注置信度
3. **四策略必生成**——SO/ST/WO/WT四种战略方向缺一不可，交叉分析是核心
4. **低置信度升级**——置信度<0.6的条目自动升级人类校准

## 交互模式
🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 探索阶段输出 | JSON | 是 | user-research-user-modeling / opportunity-brief | 用户痛点、需求洞察 |
| 竞品分析数据 | JSON | 是 | output/pm-discovery/market-competitor-intel/competitor-intel.json | 竞品定位、功能对比 |
| BMC商业模式画布 | JSON | 是 | output/pm-strategy/business-model-canvas/bmc.json | 价值主张、核心资源 |
| 内部能力评估 | JSON | ○ | 用户提供 | 技术/品牌/资源/财务能力 |

## 执行步骤

### Step 1: 内部优势识别 (Strengths)
分析企业内部优势，包括：
- 核心技术和专利
- 品牌知名度和声誉
- 用户基础和忠诚度
- 渠道和网络资源
- 人才和组织能力
- 财务资源和现金流

### Step 2: 内部劣势识别 (Weaknesses)
分析企业内部劣势，包括：
- 技术或产品差距
- 品牌认知不足
- 资源或能力缺陷
- 组织结构问题
- 财务限制

### Step 3: 外部机会识别 (Opportunities)
分析外部市场机会，包括：
- 市场规模和增长
- 政策支持
- 技术变革带来的机会
- 细分市场空白
- 合作伙伴机会
- 用户需求变化

### Step 4: 外部威胁识别 (Threats)
分析外部市场威胁，包括：
- 竞争对手动作
- 替代品威胁
- 政策法规风险
- 技术颠覆风险
- 市场萎缩
- 经济环境变化

### Step 5: 战略方向生成
基于SWOT交叉分析生成4种战略：

**SO策略 (Strengths-Opportunities)**
- 利用优势抓住机会

**ST策略 (Strengths-Threats)**
- 利用优势规避威胁

**WO策略 (Weaknesses-Opportunities)**
- 利用机会弥补劣势

**WT策略 (Weaknesses-Threats)**
- 收缩防御，最小化劣势和威胁

## 输出

**存储路径**：`output/pm-strategy/planning-swot/`

**输出文件**：swot.json

### 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| swot.strengths | array | 是 | 优势列表，每项含item、confidence、evidence |
| swot.weaknesses | array | 是 | 劣势列表，每项含item、confidence、evidence |
| swot.opportunities | array | 是 | 机会列表，每项含item、confidence、evidence |
| swot.threats | array | 是 | 威胁列表，每项含item、confidence、evidence |
| swot.strategies | array | 是 | 4种战略方向 |
| swot.strategies[].type | string | 是 | SO/ST/WO/WT |
| swot.strategies[].strategy | string | 是 | 战略名称 |
| swot.strategies[].key_actions | array | 是 | 关键行动列表 |
| swot.strategies[].expected_outcome | string | 是 | 预期成果 |

```yaml
swot:
  strengths:
    - item: "拥有自研AI自适应学习引擎，可根据学员知识图谱动态调整教学路径"
      confidence: 0.85
      evidence: "专利号ZL2023XXXXXX，内部A/B测试显示学习效率提升32%"
  weaknesses:
    - item: "K12学科内容资源不足，主要覆盖编程与职业培训领域"
      confidence: 0.75
      evidence: "内容SKU对比：竞品A覆盖12学科vs我方3学科，用户调研N=256"
  opportunities:
    - item: "职业教育政策红利期，企业培训数字化渗透率仅28%仍有巨大增长空间"
      confidence: 0.80
      evidence: "国务院2024年《职业教育改革实施方案》，艾瑞咨询2024企业培训市场报告"
  threats:
    - item: "互联网巨头以免费策略切入在线教育市场，价格战压缩利润空间"
      confidence: 0.70
      evidence: "竞品B 2024Q3推出免费基础版，我方新增线索量环比下降15%"
  strategies:
    - type: "SO"
      strategy: "AI引擎+企业培训市场渗透"
      key_actions:
        - "与50家中大型企业签订培训平台试点协议"
        - "推出企业版AI学习路径定制功能"
      expected_outcome: "6个月内企业客户数增长40%，ARR达到2000万元"
    - type: "ST"
      strategy: "技术壁垒防御与差异化定价"
      key_actions:
        - "加速AI引擎迭代，保持6个月技术领先窗口"
        - "推出按效果付费模式，降低客户决策门槛"
      expected_outcome: "客户留存率维持在85%以上，价格战影响降低至5%以内"
    - type: "WO"
      strategy: "内容生态补强与政策红利捕获"
      key_actions:
        - "与3家头部职业院校达成内容授权合作"
        - "申请职业教育数字化转型专项补贴"
      expected_outcome: "课程SKU从3学科扩展至8学科，补贴覆盖研发成本30%"
    - type: "WT"
      strategy: "聚焦核心赛道收缩防御"
      key_actions:
        - "暂停K12学科拓展，资源集中投入编程与职业培训"
        - "建立客户成功团队，提升存量客户续费率"
      expected_outcome: "核心赛道续费率提升至90%，运营成本降低20%"
```

## 决策规则

1. **置信度升级**：置信度 < 0.6的项目自动升级人类校准
2. **战略选择**：4种战略方向必须人类最终选择
3. **证据要求**：每项SWOT分析必须有数据支撑

## 质量检查

- [ ] 每项SWOT分析有数据支撑
- [ ] 4种战略方向都已生成
- [ ] 置信度评估已完成
- [ ] 关键行动具体可执行
- [ ] 预期成果可衡量

---

## 降级策略

当上游文件不存在时，本Skill仍可独立执行：

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| exploration_outputs（persona / opportunity-brief等） | 用户提供产品现状描述 → 基于描述生成SWOT | 缺乏探索阶段数据，O/T可能缺乏用户端实证 |
| competitor-intel.json | 用户提供产品现状描述 → 基于描述生成SWOT | 缺乏竞品分析数据，T和部分O缺乏竞品参照 |
| bmc.json | 用户提供产品现状描述 → 基于描述生成SWOT | 缺乏BMC数据，S/W与商业模型关联度可能偏弱 |
| 所有上游文件均缺失 | 提示用户先执行前序阶段，或基于用户提供的产品现状描述直接生成SWOT | 整体置信度显著降低，SWOT主要为AI推断 |
| 内部能力评估（用户提供） | 若用户未提供内部能力评估，提示用户提供或跳过该输入相关步骤 | S/W缺乏内部数据支撑，可能偏主观 |

数据获取说明：
- 本Skill需要探索输出、竞品分析和BMC数据，请通过以下方式之一提供：
  1. 直接描述产品现状、优势和挑战
  2. 上传competitor-intel.json / bmc.json / persona.json等文件
  3. 提供数据文件路径
- AI不负责外部数据采集，仅负责分析

---

## 上游变更响应

### 上游变更影响表

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| persona/opportunity-brief用户洞察更新 | O和T的评估 | 重新执行Step 3-4，更新机会和威胁 |
| competitor-intel竞品数据更新 | T和部分O | 重新执行Step 3-4，更新威胁评估 |
| bmc.json商业模式变更 | S和W的评估 | 重新执行Step 1-2，更新优势和劣势 |

### 下游通知机制表

| 变更类型 | 影响范围 | 通知方式 |
|----------|----------|----------|
| SWOT条目变更 | planning-okr、planning-ansoff、business-strategy-report | 输出文件版本号+变更摘要 |
| 战略方向调整 | planning-okr、planning-roadmap | 输出文件版本号+变更摘要 |
| 置信度变化 | planning-okr | 输出文件版本号+变更摘要 |
