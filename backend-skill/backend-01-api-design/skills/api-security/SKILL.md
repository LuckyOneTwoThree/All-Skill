---
name: api-security
description: 当需要设计API安全策略时使用。API安全自动设计，为API接口设计安全策略，包含限流规则、数据加密、输入校验、CORS策略和安全头配置，确保API安全合规。关键词：API安全、限流、加密、CORS、输入校验、安全头。
metadata:
  module: "后端架构与开发"
  sub-module: "API设计"
  type: "pipeline"
  version: "1.0"
  interaction_mode: "ai_suggest_human_approve"
---

# Pipeline 13: API安全自动设计

## 核心原则

1. **最小权限**：每个接口只暴露必要的操作和数据
2. **纵深防御**：多层安全措施叠加，不依赖单一防护
3. **默认拒绝**：未明确允许的请求一律拒绝
4. **可审计**：所有安全事件有日志可追溯

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| API契约 | YAML/JSON | 是 | output/backend-api-design/api-contract/openapi.yaml | 接口定义 |
| 安全等级 | string | 是 | 用户提供 | 标准 / 高安全（金融/医疗） |
| 合规要求 | string | ○ | 用户提供 | GDPR / 等保 / PCI-DSS |

## 执行步骤

### Step 1: 接口分级与访问控制

按敏感度对接口分级：

| 级别 | 接口类型 | 访问控制 | 审计要求 |
|------|---------|---------|---------|
| L1-公开 | 健康检查、公开文档 | 无鉴权 | 无 |
| L2-认证 | 用户个人信息、业务查询 | Token鉴权 | 查询日志 |
| L3-授权 | 写操作、管理功能 | Token+权限校验 | 操作日志+变更记录 |
| L4-敏感 | 支付、密钥、数据导出 | Token+权限+二次验证 | 全量审计+告警 |

### Step 2: 限流策略设计

为每个接口级别设计限流规则：

| 接口级别 | 限流规则 | 窗口 | 超限响应 |
|----------|---------|------|---------|
| L1-公开 | 1000次/分钟/IP | 滑动窗口 | 429 + Retry-After |
| L2-认证 | 300次/分钟/用户 | 滑动窗口 | 429 + Retry-After |
| L3-授权 | 100次/分钟/用户 | 滑动窗口 | 429 + Retry-After |
| L4-敏感 | 20次/分钟/用户 | 固定窗口 | 429 + 告警 |

**限流实现**：
- 优先使用Redis + 令牌桶算法
- 返回Header：`X-RateLimit-Limit` / `X-RateLimit-Remaining` / `X-RateLimit-Reset`
- 突发流量允许2倍突发容量

### Step 3: 数据安全设计

设计数据传输和存储安全策略：

| 安全措施 | 适用场景 | 实现方式 |
|----------|---------|---------|
| HTTPS强制 | 所有接口 | HSTS + 301重定向 |
| 请求签名 | L3+接口 | HMAC-SHA256签名 |
| 敏感字段加密 | 身份证/手机号/银行卡 | AES-256-GCM加密存储 |
| 响应脱敏 | 列表接口中的敏感字段 | 手机号中间4位*、身份证保留前3后4 |
| 请求体大小限制 | 所有POST/PUT | 默认1MB，文件上传单独配置 |
| SQL注入防护 | 所有数据库查询 | 参数化查询 + ORM |
| XSS防护 | 所有用户输入 | 输入过滤 + 输出转义 |

### Step 4: CORS与安全头

配置CORS策略和安全响应头：

**CORS策略**：
| 来源 | 允许方法 | 允许头 | 凭证 |
|------|---------|--------|------|
| 同域名 | 全部 | 全部 | 是 |
| 已知第三方 | GET/POST | Content-Type/Authorization | 否 |
| 其他 | 拒绝 | - | - |

**安全响应头**：
| Header | 值 | 作用 |
|--------|---|------|
| X-Content-Type-Options | nosniff | 防止MIME嗅探 |
| X-Frame-Options | DENY | 防止点击劫持 |
| X-XSS-Protection | 1; mode=block | XSS过滤 |
| Content-Security-Policy | default-src 'self' | 资源加载白名单 |
| Strict-Transport-Security | max-age=31536000; includeSubDomains | 强制HTTPS |

### Step 5: 输入校验规则

为每个接口生成输入校验规则：

- **类型校验**：string/number/boolean/array/object
- **格式校验**：email/url/uuid/date/phone
- **范围校验**：min/max/minLength/maxLength
- **业务校验**：枚举值/关联存在性/唯一性
- **批量操作限制**：单次批量≤100条

## 输出

**存储路径**：`output/backend-api-design/api-security/`

**输出文件**：security-policy.json

```json
{
  "security_policy": {
    "levels": { "L1": 5, "L2": 12, "L3": 6, "L4": 2 },
    "rate_limiting": {
      "algorithm": "token_bucket",
      "storage": "redis",
      "rules": 4
    },
    "encryption": {
      "transit": "TLS 1.3",
      "at_rest": "AES-256-GCM",
      "sensitive_fields": ["phone", "id_card", "bank_card"]
    },
    "cors": {
      "allowed_origins": ["https://app.example.com"],
      "allowed_methods": ["GET", "POST", "PUT", "DELETE"],
      "credentials": true
    },
    "security_headers": 5,
    "validation_rules": 25
  }
}
```

## 决策规则

| 条件 | 决策 |
|------|------|
| 安全等级=高安全（金融/医疗） | L3+接口全部请求签名 + 全量审计 |
| 安全等级=标准 | L4接口请求签名 + L3+审计 |
| 接口涉及个人隐私数据 | 强制脱敏 + 加密存储 |
| 接口允许跨域访问 | 严格限制Origin白名单 |
| 批量操作接口 | 单次≤100条 + 异步处理 |
| 合规要求含GDPR | 数据导出接口 + 数据删除接口 |

## 质量检查

- [ ] 100%的接口有安全级别标注
- [ ] L2+接口100%有鉴权要求
- [ ] 限流规则覆盖全部接口级别
- [ ] 敏感字段100%有脱敏或加密策略
- [ ] 安全响应头覆盖5项标准头
- [ ] 输入校验规则覆盖全部接口参数

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| API契约缺失 | 无法设计安全策略 | 输出为空 |
| 安全等级未指定 | 默认标准等级 | 可能不满足高安全要求 |
| 合规要求未指定 | 不生成合规相关接口 | 后续需补充合规接口 |

数据获取说明：
- 本Skill需要API契约和安全等级，请通过以下方式之一提供：
  1. 上传openapi.yaml文件并说明安全等级
  2. 描述接口列表和敏感数据类型
  3. 提供合规要求文档
