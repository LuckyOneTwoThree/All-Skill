---
name: data-dictionary
description: 当需要从PRD和SRS中提取数据实体定义或建立产品数据标准时使用。数据字典文档自动生成，包含数据实体定义、字段规格、数据关系、枚举值和业务规则。关键词：数据字典、数据定义、字段规格、数据实体、枚举值、业务规则。
metadata:
  module: "产品开发与上线"
  sub-module: "开发交付"
  type: "pipeline"
  version: "1.0"
  interaction_mode: "ai_suggest_human_approve"
  upstream:
    - design-prd
    - requirements-srs
---

# 数据字典文档生成

## 核心原则

**数据字典是产品与技术之间的共同语言**

数据字典的核心价值在于消除产品需求与技术实现之间的歧义。当产品说"用户状态"时，技术需要知道是枚举值还是布尔值、有哪些合法取值、默认值是什么。数据字典就是这种精确性的保障。

## 输入

| 输入项 | 来源 | 必需 | 说明 |
|--------|------|------|------|
| PRD | design-prd | ✅ | 产品功能需求、业务规则、用户场景 |
| SRS | requirements-srs | ⬜ | 功能需求编号、数据需求、接口需求 |
| 数据模型 | 用户提供 | ⬜ | 已有的ER模型或数据库Schema |

### 降级策略

| 缺失输入 | 降级方案 |
|----------|----------|
| 无PRD | 无法生成，要求用户提供产品信息 |
| 无SRS | 基于PRD推导数据实体，标注"待SRS确认" |
| 无数据模型 | 从PRD业务逻辑推导数据实体和关系，标注"待数据模型验证" |

## 执行步骤

### Step 1：数据实体识别

从PRD和SRS中识别所有数据实体：

1. **核心实体**：产品核心业务对象（如用户、订单、商品）
2. **支撑实体**：配置、字典、日志等支撑性对象
3. **关系实体**：多对多关系的中间表
4. **枚举定义**：状态、类型、等级等有限取值集合

### Step 2：字段规格定义

为每个数据实体的字段定义精确规格：

1. **字段基本信息**：
   - 字段名（中文/英文）
   - 数据类型（string/integer/decimal/boolean/datetime/json/array）
   - 长度/精度
   - 是否必填
   - 默认值
   - 是否唯一
2. **业务规则**：
   - 取值范围
   - 格式校验规则
   - 业务计算逻辑
   - 依赖关系
3. **敏感度标注**：
   - 🔴 敏感数据（身份证、银行卡、密码）
   - 🟡 内部数据（手机号、邮箱、地址）
   - 🟢 公开数据（昵称、头像、公开内容）

### Step 3：数据关系定义

定义数据实体之间的关系：

1. **一对一关系**：实体A的每条记录唯一对应实体B的一条记录
2. **一对多关系**：实体A的每条记录对应实体B的多条记录
3. **多对多关系**：通过中间实体关联
4. **关系属性**：关系名称、基数、级联规则、删除策略

### Step 4：枚举值定义

定义所有枚举类型及其取值：

1. **枚举名称**：中英文命名
2. **取值列表**：每个取值的编码、显示名、描述
3. **状态机**：枚举值之间的合法转换路径
4. **扩展策略**：预留扩展取值还是封闭枚举

### Step 5：数据生命周期

定义核心数据的生命周期规则：

1. **创建规则**：数据创建的触发条件和初始状态
2. **更新规则**：数据更新的触发条件和校验规则
3. **归档规则**：数据归档的条件和存储策略
4. **删除规则**：数据删除的条件和级联策略（软删除/硬删除）
5. **保留期限**：各敏感度数据的法定保留期限

### Step 6：报告组装

将以上内容组装为完整数据字典文档。

## 输出

### 输出文件

| 文件 | 路径 | 说明 |
|------|------|------|
| 数据字典 | `output/pm-development/data-dictionary/data-dictionary.md` | 人类可读的完整字典 |
| 结构化数据 | `output/pm-development/data-dictionary/data-dictionary.json` | 机器可消费的结构化数据 |

**输出Schema**：

```json
{
  "type": "object",
  "required": ["product_name", "entities"],
  "properties": {
    "product_name": {"type": "string", "description": "产品名称"},
    "report_date": {"type": "string", "description": "报告生成日期"},
    "entities": {"type": "array", "description": "数据实体列表，包含字段定义和业务规则"},
    "relationships": {"type": "array", "description": "数据关系列表，包含实体间关联和级联规则"},
    "enums": {"type": "array", "description": "枚举值定义列表，包含取值和状态转换"},
    "lifecycle_rules": {"type": "array", "description": "数据生命周期规则列表"}
  }
}
```

### Markdown 报告结构

```markdown
# 数据字典：{产品名称}

## 1. 概述
- 数据实体总览表
- 命名规范
- 数据类型规范

## 2. 数据实体定义
### 2.1 {实体名称}
- 实体描述
- 字段列表（名称/类型/必填/默认值/说明）
- 业务规则
- 敏感度标注

## 3. 数据关系
- ER关系图（Mermaid）
- 关系明细表

## 4. 枚举值定义
### 4.1 {枚举名称}
- 取值列表（编码/显示名/描述）
- 状态转换图

## 5. 数据生命周期
- 创建/更新/归档/删除规则
- 保留期限

## 6. 附录
- 术语表
- 变更日志
```

### JSON 结构

```json
{
  "product_name": "",
  "report_date": "",
  "entities": [
    {
      "name": "",
      "name_cn": "",
      "description": "",
      "fields": [
        {
          "name": "",
          "name_cn": "",
          "type": "",
          "length": 0,
          "required": true,
          "default_value": "",
          "unique": false,
          "sensitivity": "public|internal|sensitive",
          "description": ""
        }
      ],
      "business_rules": []
    }
  ],
  "relationships": [
    {
      "from_entity": "",
      "to_entity": "",
      "type": "one_to_one|one_to_many|many_to_many",
      "name": "",
      "cascade_delete": false
    }
  ],
  "enums": [
    {
      "name": "",
      "name_cn": "",
      "values": [],
      "state_transitions": [],
      "extensible": true
    }
  ],
  "lifecycle_rules": []
}
```

## 质量检查

| 检查项 | 标准 | 不通过处理 |
|--------|------|------------|
| 实体覆盖完整 | PRD中提及的核心业务对象均有实体定义 | 补充缺失实体 |
| 字段规格精确 | 每个字段有类型、必填、默认值 | 补充缺失规格 |
| 敏感数据已标注 | 所有含个人信息的字段标注敏感度 | 补充敏感度标注 |
| 枚举值完整 | 所有状态/类型字段有枚举定义 | 补充缺失枚举 |
