---
name: product-sunset-plan
description: 当需要制定产品或功能下线计划时使用。产品下线方案自动生成，包含下线决策评估、用户迁移方案、数据处置策略、时间线和沟通计划。关键词：产品下线、功能下线、产品退役、Sunset、下线方案、用户迁移、数据处置。
metadata:
  module: "产品监控与迭代"
  sub-module: "问题诊断"
  type: "pipeline"
  version: "1.0"
  interaction_mode: "ai_suggest_human_approve"
  upstream:
    - diagnosis-health
    - retention-churn
---

# 产品下线方案生成

## 核心原则

**下线是对用户最后的尊重**

产品下线方案的核心价值在于确保产品退役过程对用户的影响最小化。好的下线不是突然消失，而是有序过渡。用户投入的时间和数据值得被认真对待。

## 输入

| 输入项 | 来源 | 必需 | 说明 |
|--------|------|------|------|
| 健康度诊断 | output/pm-monitoring/diagnosis-health | ⬜ | 产品健康度评分、趋势 |
| 留存数据 | output/pm-growth/retention-churn | ⬜ | 用户留存、流失趋势 |
| 下线对象 | 用户提供 | ✅ | 需要下线的产品/功能名称和范围 |
| 下线原因 | 用户提供 | ✅ | 业务决策原因 |

### 降级策略

| 缺失输入 | 降级方案 |
|----------|----------|
| 无健康度诊断 | 基于用户提供信息评估下线影响，标注"待健康度诊断" |
| 无留存数据 | 基于用户提供信息估算受影响用户数，标注"待留存数据验证" |
| 无下线对象/原因 | 无法生成，要求用户提供基本信息 |

## 执行步骤

### Step 1：下线决策评估

评估下线决策的合理性和影响：

1. **下线理由验证**：
   - 业务指标持续下滑（收入/用户/活跃度）
   - 战略方向调整（不再符合产品定位）
   - 技术成本过高（维护成本 > 产出价值）
   - 合规要求（法规变更）
2. **替代方案评估**：是否有不下线的替代方案
3. **影响范围评估**：
   - 受影响用户数及占比
   - 受影响收入及占比
   - 受影响合作伙伴
   - 品牌影响评估

### Step 2：用户迁移方案

制定用户从下线产品到替代方案的迁移策略：

1. **替代方案识别**：
   - 自有替代产品/功能
   - 第三方替代方案
   - 无替代（需明确告知）
2. **迁移路径设计**：
   - 数据导出→导入流程
   - 功能映射表（旧功能→新功能）
   - 迁移工具/脚本
3. **迁移激励**：
   - 迁移优惠/折扣
   - 专属迁移支持
   - 数据迁移保障承诺
4. **特殊用户处理**：
   - 企业客户：1对1迁移支持
   - 高价值用户：专属迁移方案
   - 长期用户：感恩回馈

### Step 3：数据处置策略

制定用户数据的处置方案：

1. **数据分类**：
   - 用户生成内容（UGC）
   - 用户配置/设置
   - 使用历史/行为数据
   - 付费/交易记录
2. **处置方式**：
   - 可导出：提供标准格式导出工具
   - 可迁移：自动迁移到替代产品
   - 需保留：法定保留期限和访问方式
   - 需删除：删除时间线和确认机制
3. **数据保留期限**：
   - 法定保留（交易记录≥5年）
   - 用户自选保留期
   - 最终删除时间线

### Step 4：下线时间线

制定分阶段下线时间线：

1. **预告期**（T-90天）：
   - 发布下线公告
   - 开启数据导出
   - 停止新用户注册
2. **过渡期**（T-60天）：
   - 停止付费续订
   - 推送迁移引导
   - 提供迁移支持
3. **只读期**（T-30天）：
   - 功能只读，不可新建/修改
   - 最后数据导出窗口
   - 客服专项支持
4. **下线日**（T-0）：
   - 服务停止
   - 数据进入保留期
   - 下线页面上线
5. **清理期**（T+30天）：
   - 数据按策略删除/归档
   - 最终确认报告

### Step 5：沟通计划

制定各利益相关方的沟通计划：

1. **用户沟通**：
   - 公告文案（各渠道版本）
   - FAQ文档
   - 迁移教程
   - 客服话术
2. **内部沟通**：
   - 团队通知
   - 客服培训
   - 销售话术更新
3. **外部沟通**：
   - 合作伙伴通知
   - 媒体口径
   - 社区公告

### Step 6：报告组装

将以上内容组装为完整下线方案。

## 输出

### 输出文件

| 文件 | 路径 | 说明 |
|------|------|------|
| 产品下线方案 | `output/pm-monitoring/product-sunset-plan/product-sunset-plan.md` | 人类可读的完整方案 |
| 结构化数据 | `output/pm-monitoring/product-sunset-plan/product-sunset-plan.json` | 机器可消费的结构化数据 |

**输出Schema**：

```json
{
  "type": "object",
  "required": ["product_name", "sunset_date", "decision_assessment", "migration_plan"],
  "properties": {
    "product_name": {"type": "string", "description": "产品名称"},
    "sunset_date": {"type": "string", "description": "下线日期"},
    "report_date": {"type": "string", "description": "报告日期"},
    "decision_assessment": {"type": "object", "description": "下线决策评估，包含理由、替代方案和影响"},
    "migration_plan": {"type": "object", "description": "用户迁移方案，包含替代方案、路径和激励"},
    "data_disposal": {"type": "object", "description": "数据处置策略，包含分类、方式和保留期限"},
    "timeline": {"type": "object", "description": "下线时间线，包含预告/过渡/只读/下线/清理"},
    "communication_plan": {"type": "object", "description": "沟通计划，包含用户/内部/外部沟通"},
    "risks": {"type": "array", "description": "风险清单"}
  }
}
```

### Markdown 报告结构

```markdown
# 产品下线方案：{产品/功能名称}

## 1. 下线决策评估
- 下线理由与验证
- 替代方案评估
- 影响范围评估

## 2. 用户迁移方案
- 替代方案
- 迁移路径与工具
- 迁移激励
- 特殊用户处理

## 3. 数据处置策略
- 数据分类
- 处置方式
- 保留期限
- 删除时间线

## 4. 下线时间线
- 预告期（T-90）
- 过渡期（T-60）
- 只读期（T-30）
- 下线日（T-0）
- 清理期（T+30）

## 5. 沟通计划
- 用户沟通（公告/FAQ/教程）
- 内部沟通（团队/客服/销售）
- 外部沟通（伙伴/媒体/社区）

## 6. 风险与应急
- 迁移失败预案
- 法律合规风险
- 品牌声誉风险
```

### JSON 结构

```json
{
  "product_name": "",
  "sunset_date": "",
  "report_date": "",
  "decision_assessment": {
    "reasons": [],
    "alternatives_evaluated": [],
    "impact": {
      "affected_users": 0,
      "affected_revenue": 0,
      "brand_impact": ""
    }
  },
  "migration_plan": {
    "alternatives": [],
    "migration_paths": [],
    "incentives": [],
    "special_handling": []
  },
  "data_disposal": {
    "categories": [],
    "disposal_methods": [],
    "retention_periods": [],
    "deletion_timeline": ""
  },
  "timeline": {
    "announcement": "",
    "transition": "",
    "read_only": "",
    "sunset": "",
    "cleanup": ""
  },
  "communication_plan": {
    "user_communication": [],
    "internal_communication": [],
    "external_communication": []
  },
  "risks": []
}
```

## 质量检查

| 检查项 | 标准 | 不通过处理 |
|--------|------|------------|
| 影响评估完整 | 用户/收入/品牌3维度均有评估 | 补充缺失维度 |
| 迁移方案可行 | 每类用户有明确迁移路径 | 补充迁移方案 |
| 数据处置合规 | 法定保留数据有保留方案 | 补充合规保留策略 |
| 时间线可执行 | 5个阶段有明确日期和交付物 | 补充时间细节 |
