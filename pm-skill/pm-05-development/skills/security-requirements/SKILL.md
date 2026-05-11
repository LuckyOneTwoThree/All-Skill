---
name: security-requirements
description: 当需要从PRD和SRS中提取安全需求或制定产品安全标准时使用。产品安全需求清单自动生成，包含威胁建模、安全功能需求、数据保护需求、合规映射和安全验收标准。关键词：安全需求、威胁建模、数据保护、安全验收、安全合规、STRIDE。
metadata:
  module: "产品开发与上线"
  sub-module: "开发交付"
  type: "pipeline"
  version: "1.0"
  interaction_mode: "ai_suggest_human_approve"
  upstream:
    - design-prd
    - requirements-srs
    - privacy-compliance-assessment
---

# 产品安全需求清单生成

## 核心原则

**安全是需求，不是特性**

安全需求不是开发后追加的检查项，而是与功能需求同等重要的产品需求。安全需求清单确保在需求阶段就将安全内建到产品中，而非事后打补丁。

## 输入

| 输入项 | 来源 | 必需 | 说明 |
|--------|------|------|------|
| PRD | design-prd | ✅ | 产品功能需求、用户场景、数据流 |
| SRS | requirements-srs | ⬜ | 功能需求编号、非功能需求、接口需求 |
| 隐私合规评估 | privacy-compliance-assessment | ⬜ | 个人数据清单、合规差距、整改建议 |
| 安全标准 | 用户提供 | ⬜ | OWASP Top 10、CIS、行业安全标准 |

### 降级策略

| 缺失输入 | 降级方案 |
|----------|----------|
| 无PRD | 基于用户提供的产品描述推导安全需求，标注"需求来源待确认" |
| 无SRS | 安全需求独立编号，后续与SRS交叉引用，标注"待对齐SRS编号" |
| 无隐私合规评估 | 安全需求清单不含隐私专项，标注"建议补充隐私合规评估" |
| 无安全标准 | 默认采用OWASP Top 10 + CIS基准，标注"标准待确认" |

## 执行步骤

### Step 1：威胁建模

基于产品功能和数据流进行威胁建模：

1. **数据流图（DFD）**：识别信任边界、数据流、数据存储、外部实体
2. **STRIDE分析**：
   - **S**poofing（欺骗）：身份伪造场景
   - **T**ampering（篡改）：数据篡改场景
   - **R**epudiation（抵赖）：操作否认场景
   - **I**nformation Disclosure（信息泄露）：数据泄露场景
   - **D**enial of Service（拒绝服务）：可用性破坏场景
   - **E**levation of Privilege（权限提升）：越权场景
3. **威胁评级**：按影响×可能性矩阵评级（Critical/High/Medium/Low）
4. **攻击面清单**：所有可被攻击的入口点和攻击向量

### Step 2：安全功能需求

基于威胁建模生成安全功能需求：

1. **认证与授权需求**：
   - SEC-AUTH-001：多因素认证（MFA）要求
   - SEC-AUTH-002：会话管理与超时策略
   - SEC-AUTH-003：基于角色的访问控制（RBAC/ABAC）
   - SEC-AUTH-004：API认证机制
2. **数据保护需求**：
   - SEC-DATA-001：传输加密（TLS 1.2+）
   - SEC-DATA-002：存储加密（AES-256）
   - SEC-DATA-003：密钥管理策略
   - SEC-DATA-004：数据脱敏规则
3. **输入验证需求**：
   - SEC-VAL-001：输入校验规则（防注入/XSS）
   - SEC-VAL-002：文件上传安全策略
   - SEC-VAL-003：API参数校验
4. **审计与监控需求**：
   - SEC-AUD-001：安全事件日志记录
   - SEC-AUD-002：异常行为检测
   - SEC-AUD-003：安全告警与响应

### Step 3：数据保护需求

针对产品涉及的数据类型制定保护策略：

1. **数据分类**：公开 / 内部 / 机密 / 绝密
2. **数据生命周期**：采集→存储→处理→传输→销毁各阶段保护要求
3. **数据最小化**：仅采集必要数据，定期清理过期数据
4. **数据备份与恢复**：备份策略、恢复时间目标（RTO/RPO）

### Step 4：合规映射

将安全需求映射到合规框架：

| 合规框架 | 映射需求 | 覆盖状态 |
|----------|----------|----------|
| OWASP Top 10 | SEC-AUTH/VAL/DATA系列 | 逐项映射 |
| PIPL（个人信息保护法） | SEC-DATA/PRIV系列 | 逐项映射 |
| GDPR | SEC-DATA/PRIV系列 | 逐项映射 |
| SOC 2 | SEC-AUD系列 | 逐项映射 |
| 行业标准 | 按行业补充 | 逐项映射 |

### Step 5：安全验收标准

为每个安全需求定义可验证的验收标准：

1. **自动化测试标准**：可通过SAST/DAST/SCA工具验证的标准
2. **渗透测试标准**：需要人工渗透测试验证的标准
3. **安全审查标准**：需要安全团队审查的标准
4. **安全卡口**：P0安全需求未通过 = 阻止上线

### Step 6：报告组装

将以上内容组装为完整安全需求清单。

## 输出

### 输出文件

| 文件 | 路径 | 说明 |
|------|------|------|
| 安全需求清单 | `output/pm-development/security-requirements/security-requirements.md` | 人类可读的完整清单 |
| 结构化数据 | `output/pm-development/security-requirements/security-requirements.json` | 机器可消费的结构化数据 |

**输出Schema**：

```json
{
  "type": "object",
  "required": ["product_name", "threat_model", "security_requirements"],
  "properties": {
    "product_name": {"type": "string", "description": "产品名称"},
    "report_date": {"type": "string", "description": "报告日期"},
    "threat_model": {"type": "object", "description": "威胁建模，包含STRIDE威胁、攻击面和信任边界"},
    "security_requirements": {"type": "object", "description": "安全功能需求，包含认证/数据保护/输入验证/审计"},
    "data_protection": {"type": "object", "description": "数据保护需求，包含分类、生命周期和备份策略"},
    "compliance_mapping": {"type": "object", "description": "合规映射，包含OWASP/PIPL/GDPR/SOC2"},
    "acceptance_criteria": {"type": "array", "description": "安全验收标准列表"},
    "traceability_matrix": {"type": "array", "description": "安全需求追踪矩阵"}
  }
}
```

### Markdown 报告结构

```markdown
# 产品安全需求清单：{产品名称}

## 1. 威胁建模
- 数据流图（DFD）
- STRIDE分析表
- 威胁评级矩阵
- 攻击面清单

## 2. 安全功能需求
- 认证与授权（SEC-AUTH-xxx）
- 数据保护（SEC-DATA-xxx）
- 输入验证（SEC-VAL-xxx）
- 审计与监控（SEC-AUD-xxx）

## 3. 数据保护需求
- 数据分类与分级
- 生命周期保护策略
- 数据最小化原则
- 备份与恢复

## 4. 合规映射
- OWASP Top 10映射
- PIPL/GDPR映射
- SOC 2映射
- 行业标准映射

## 5. 安全验收标准
- 自动化测试标准
- 渗透测试标准
- 安全审查标准
- 安全卡口定义

## 6. 安全需求追踪矩阵
- 需求ID / 威胁来源 / 优先级 / 验收标准 / 状态
```

### JSON 结构

```json
{
  "product_name": "",
  "report_date": "",
  "threat_model": {
    "stride_threats": [],
    "attack_surface": [],
    "trust_boundaries": []
  },
  "security_requirements": {
    "auth": [],
    "data_protection": [],
    "input_validation": [],
    "audit": []
  },
  "data_protection": {
    "classification": [],
    "lifecycle_policies": [],
    "minimization_rules": [],
    "backup_recovery": {}
  },
  "compliance_mapping": {
    "owasp_top10": [],
    "pipl": [],
    "gdpr": [],
    "soc2": []
  },
  "acceptance_criteria": [],
  "traceability_matrix": []
}
```

## 质量检查

| 检查项 | 标准 | 不通过处理 |
|--------|------|------------|
| STRIDE全覆盖 | 6类威胁均有分析 | 补充缺失威胁类型 |
| 安全需求可追溯 | 每个安全需求关联到具体威胁 | 补充威胁关联 |
| 合规映射完整 | OWASP Top 10全部映射 | 补充缺失映射项 |
| 验收标准可验证 | 每个需求有明确的验证方法 | 补充验证方法 |
