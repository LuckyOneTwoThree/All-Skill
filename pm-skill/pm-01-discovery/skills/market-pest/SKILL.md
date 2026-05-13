---
name: market-pest
description: 当需要扫描目标市场的政策法规、经济指标、社会趋势、技术动态时使用。PEST自动扫描，输出四维度趋势摘要与影响评估，信号分级告警，重大变化实时告警。关键词：PEST分析、政策法规、经济指标、社会趋势、技术动态、环境扫描、信号分级告警、外部环境、政策影响、市场趋势。
metadata:
  module: "产品探索与发现"
  sub-module: "市场竞品"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["金融", "医疗", "通用"]
  trigger_examples:
    - "市场环境有什么变化"
    - "政策对我们有什么影响"
    - "帮我扫描一下外部环境"
  interaction_mode: "ai_auto"
---

# PEST自动扫描

## 核心原则

1. **四维度缺一不可**——PEST四个维度必须全部扫描，缺失任一维度的分析都是片面的，数据不足时用行业基准值填充并标注"推断值"
2. **信号分级而非平铺**——不是所有趋势都同等重要，影响程度≥4的信号触发告警，<3的信号归入常规监控，资源聚焦在高影响信号
3. **时效性标注**——每个信号标注"已发生/正在发生/预计发生"，不同时效的信号应对策略完全不同，已发生的需立即响应，预计的需提前准备
4. **影响路径可追溯**——每个趋势必须关联品类影响路径（如"合规成本上升→中小企业准入门槛提高"），不关联影响路径的趋势是噪音

## 交互模式

🤖 AI自动执行

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| category_keywords | string | 是 | 用户提供 | 品类关键词，如"在线教育""SaaS CRM" |
| target_market | string | 是 | 用户提供 | 目标市场，如"中国大陆""东南亚" |

## 执行步骤

### Step 1: 定时扫描

按四个维度进行信息采集与监控：

| 维度 | 扫描范围 | 数据源 |
|------|---------|--------|
| 政策法规（Political） | 行业监管政策、准入许可、合规要求、数据隐私法规、税收政策、补贴政策 | 政府官网、法规数据库、行业协会公告、政策解读媒体 |
| 经济指标（Economic） | GDP增速、行业增长率、消费支出、融资环境、汇率波动、通胀率 | 统计局数据、央行报告、第三方经济数据库 |
| 社会趋势（Social） | 人口结构变化、消费习惯迁移、文化趋势、用户偏好演变、生活方式变化 | 社交媒体趋势、用户调研报告、人口普查数据、生活方式研究 |
| 技术动态（Technological） | 新技术成熟度、技术采用曲线、基础设施演进、技术标准变化、专利趋势 | 技术媒体、专利数据库、Gartner/IDC技术报告、开源社区动态 |

### Step 2: 趋势摘要

对每个维度采集的信息进行结构化摘要：

- 提取核心趋势（每维度3-5条）
- 标注趋势方向（上升/下降/平稳/新兴）
- 标注趋势强度（强/中/弱）
- 关联品类影响路径

### Step 3: 关键变化信号

从趋势摘要中识别关键变化信号：

- 信号类型：新政策发布 / 指标突变 / 趋势转折 / 技术突破
- 信号时效：已发生 / 正在发生 / 预计发生
- 信号来源与可验证性

### Step 4: 影响评估

对每个关键变化信号进行影响评估：

| 评估维度 | 说明 |
|---------|------|
| 影响方向 | 正面（机会）/ 负面（威胁）/ 中性 |
| 影响程度 | 1-5分（1=微小影响，5=颠覆性影响） |
| 影响时间窗口 | 短期（<6月）/ 中期（6-18月）/ 长期（>18月） |
| 影响范围 | 仅影响品类 / 影响整个行业 / 跨行业影响 |
| 应对建议 | 利用策略 / 规避策略 / 监控策略 |

### Step 5: 重大变化告警

对高影响信号触发告警：

- 筛选影响程度≥4的信号
- 生成告警摘要：信号描述 + 影响评估 + 应对建议
- 实时推送给人类PM

## 输出

输出文件：`output/pm-discovery/market-pest/pest.json`

**输出Schema**：

```json
{
  "type": "object",
  "required": ["category_keywords", "target_market", "scan_timestamp", "political", "economic", "social", "technological"],
  "properties": {
    "category_keywords": {"type": "string", "description": "品类关键词"},
    "target_market": {"type": "string", "description": "目标市场"},
    "scan_timestamp": {"type": "string", "description": "扫描时间戳"},
    "political": {"type": "object", "description": "政策法规维度趋势与信号"},
    "economic": {"type": "object", "description": "经济指标维度趋势与信号"},
    "social": {"type": "object", "description": "社会趋势维度趋势与信号"},
    "technological": {"type": "object", "description": "技术动态维度趋势与信号"},
    "alerts": {"type": "array", "description": "重大变化告警列表"}
  }
}
```

**输出校验规则**：

| 字段路径 | 类型 | 必填 | 说明 |
|---------|------|------|------|
| category_keywords | string | 是 | 品类关键词，不可为空字符串 |
| target_market | string | 是 | 目标市场，不可为空字符串 |
| scan_timestamp | string | 是 | ISO 8601格式的扫描时间戳 |
| political | object | 是 | 政策法规维度，不可缺失 |
| political.trends | array | 是 | 至少包含1条趋势，每条须含trend、direction、strength、impact_path |
| political.key_signals | array | 是 | 信号列表，每条须含signal、type、timing、source、impact |
| economic | object | 是 | 经济指标维度，不可缺失，数据不足时用行业基准值填充并标注"推断值" |
| economic.trends | array | 是 | 至少包含1条趋势，每条须含trend、direction、strength、impact_path |
| economic.key_signals | array | 是 | 信号列表，每条须含signal、type、timing、source、impact |
| social | object | 是 | 社会趋势维度，不可缺失，数据不足时用行业基准值填充并标注"推断值" |
| social.trends | array | 是 | 至少包含1条趋势，每条须含trend、direction、strength、impact_path |
| social.key_signals | array | 是 | 信号列表，每条须含signal、type、timing、source、impact |
| technological | object | 是 | 技术动态维度，不可缺失，数据不足时用行业基准值填充并标注"推断值" |
| technological.trends | array | 是 | 至少包含1条趋势，每条须含trend、direction、strength、impact_path |
| technological.key_signals | array | 是 | 信号列表，每条须含signal、type、timing、source、impact |
| alerts | array | 是 | 影响程度≥4的告警列表，无高影响信号时为空数组 |
| alerts[].signal | string | 是（alerts非空时） | 告警信号描述 |
| alerts[].dimension | string | 是（alerts非空时） | 所属PEST维度 |
| alerts[].impact_degree | integer | 是（alerts非空时） | 影响程度，≥4 |
| alerts[].impact_direction | string | 是（alerts非空时） | 影响方向 |
| alerts[].recommendation | string | 是（alerts非空时） | 应对建议 |
| alerts[].timestamp | string | 是（alerts非空时） | 告警时间戳 |

```json
{
  "category_keywords": "在线教育",
  "target_market": "中国大陆",
  "scan_timestamp": "2026-05-10T08:00:00Z",
  "political": {
    "trends": [
      {
        "trend": "数据隐私法规趋严，个人数据保护力度加大",
        "direction": "上升",
        "strength": "强",
        "impact_path": "合规成本上升→中小企业准入门槛提高"
      }
    ],
    "key_signals": [
      {
        "signal": "《个人信息保护法》实施细则发布",
        "type": "新政策发布",
        "timing": "已发生",
        "source": "国务院官网",
        "impact": {
          "direction": "负面",
          "degree": 5,
          "time_window": "中期",
          "scope": "行业",
          "recommendation": "加速合规体系建设，建立数据隐私保护机制"
        },
        "alert": false
      }
    ]
  },
  "economic": {
    "trends": [],
    "key_signals": []
  },
  "social": {
    "trends": [],
    "key_signals": []
  },
  "technological": {
    "trends": [],
    "key_signals": []
  },
  "alerts": [
    {
      "signal": "《个人信息保护法》实施细则发布",
      "dimension": "政策法规",
      "impact_degree": 5,
      "impact_direction": "负面",
      "recommendation": "加速合规体系建设，建立数据隐私保护机制",
      "timestamp": "2026-05-10T08:00:00Z"
    }
  ]
}
```

## 决策规则

| 规则 | 触发条件 | 动作 |
|------|---------|------|
| 实时告警 | 影响程度 ≥ 4 | 实时告警给人类PM，推送信号描述+影响评估+应对建议 |
| 常规监控 | 影响程度 < 3 | 归入常规监控列表，不触发告警 |
| 信号升级 | 信号来源不可验证或矛盾 | 标注需人类确认，降低置信度 |
| 数据来源可信度 < 0.5 | 标注"数据来源不可靠"，建议人类验证或更换数据源 |
| PEST维度数据缺失 | 标注"维度数据不完整"，使用行业基准值填充并标注"推断值" |

## 质量检查

- [ ] 政策法规维度已扫描
- [ ] 经济指标维度已扫描
- [ ] 社会趋势维度已扫描
- [ ] 技术动态维度已扫描
- [ ] 每个维度至少3条趋势摘要
- [ ] 关键变化信号已识别
- [ ] 影响评估已完成（方向+程度+时间窗口）
- [ ] 重大变化（影响程度≥4）已告警
- [ ] 数据来源标注 | 每个PEST维度标注数据来源和可信度 | 未标注来源的维度标记"来源不明"

---

## 降级策略

当上游文件不存在时，本Skill仍可独立执行：

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 无强依赖 | 本Skill可独立运行，用户提供品类和目标市场即可执行 | 输出完整，无影响 |
| 所有上游文件均缺失 | 用户提供品类关键词和目标市场 → 基于AI知识库扫描PEST四维度趋势 | 趋势数据基于AI知识库推断，置信度标注为"推断值"，时效性可能滞后 |
| 若用户未提供category_keywords | 提示用户提供品类关键词，否则无法确定扫描范围 | 无法生成输出，流程中断 |
| 若用户未提供target_market | 提示用户提供目标市场，否则默认使用"中国大陆" | 目标市场默认为"中国大陆"，其他市场的趋势可能遗漏 |

## 数据获取说明`n本Skill需要品类关键词和目标市场信息，请通过以下方式之一提供：
  1. 直接输入品类关键词（如"在线教育""SaaS CRM"）和目标市场（如"中国大陆"）
  2. 上传行业分析数据文件
  3. 提供数据文件路径
- AI不负责外部数据采集，仅负责分析

## 上游变更响应

### 上游变更影响表

| 上游文件 | 变更类型 | 影响PEST维度 | 影响说明 |
|---------|---------|-------------|---------|
| tam-som.json | 市场规模数据变化 | 经济指标（Economic） | TAM/SAM/SOM规模调整直接影响经济指标中的行业增长率、市场容量等趋势判断 |
| competitor-intel.json | 竞品技术动态变化 | 技术动态（Technological） | 竞品新技术采用、专利布局等动态影响技术维度中技术成熟度和采用曲线的判断 |
| competitor-intel.json | 竞品合规策略变化 | 政策法规（Political） | 竞品应对监管的策略变化可反推政策法规执行力度和趋势方向 |
| tam-som.json | 区域市场数据变化 | 社会趋势（Social） | 区域市场用户规模和渗透率变化影响社会趋势中消费习惯和用户偏好的判断 |

### 下游通知机制表

| PEST变更类型 | 触发条件 | 通知下游 | 通知内容 |
|-------------|---------|---------|---------|
| 政策法规重大变化 | 政策法规维度出现影响程度≥4的信号 | competitor-report | 政策变化摘要、影响评估、竞品应对建议 |
| 政策法规重大变化 | 政策法规维度出现影响程度≥4的信号 | tam-som | 政策变化对市场准入和规模的影响评估，建议重新测算TAM/SAM/SOM |
| 经济指标重大变化 | 经济指标维度出现影响程度≥4的信号 | tam-som | 经济指标变化摘要，建议重新评估市场规模和增长率 |
| 技术动态重大变化 | 技术动态维度出现影响程度≥4的信号 | competitor-intel | 技术突破摘要、影响评估，建议更新竞品Feature Matrix中的技术维度 |
| 社会趋势重大变化 | 社会趋势维度出现影响程度≥4的信号 | tam-som | 社会趋势变化摘要，建议重新评估目标用户规模和渗透率 |
