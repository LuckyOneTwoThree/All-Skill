---
name: release-notes
description: 当产品版本发布时使用。版本发布说明自动生成，基于变更记录和PRD差异，生成面向用户/客户的版本更新说明，支持多语言和多平台格式。关键词：版本发布说明、Release Notes、更新日志、版本更新、更新说明。
metadata:
  module: "开发与上线"
  sub-module: "发布上线"
  type: "pipeline"
  version: "2.0"
  interaction_mode: "ai_suggest_human_approve"
---

# 版本发布说明自动生成

## 核心原则

1. **用户视角**——用户关心"对我有什么影响"，不是"代码改了什么"
2. **分级呈现**——重要变更突出，次要变更不淹没
3. **诚实透明**——已知问题不隐瞒，破坏性变更提前告知
4. **行动导向**——用户需要做什么（升级/配置/注意）必须明确

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 需求变更记录 | Markdown/JSON | ○ | output/pm-development/requirements-change-log/requirements-change-log.md | 本版本的需求变更 |
| PRD文档 | Markdown | ○ | output/pm-design/design-prd/PRD-{产品名}.md | 产品需求参考 |
| SRS文档 | Markdown | ○ | output/pm-design/requirements-srs/SRS-{产品名}.md | 需求规格参考 |
| 版本号 | string | 是 | 用户提供 | 如 v2.3.0 |
| 发布日期 | string | 是 | 用户提供 | 如 2025-03-15 |
| 发布类型 | string | 是 | 用户提供 | major / minor / patch / hotfix |
| 目标受众 | string | ○ | 用户提供 | 终端用户 / 企业客户 / 开发者 / 内部团队 |

## 执行步骤

### Step 1: 变更收集与分类

收集本版本所有变更，按类型分类：

**变更分类体系**：

| 类别 | 图标 | 说明 | 示例 |
|------|------|------|------|
| 🆕 新功能 | ✨ | 新增的产品功能 | 新增社交分享功能 |
| 🔄 改进 | 🔧 | 已有功能的优化 | 搜索速度提升3倍 |
| 🐛 修复 | 🐛 | Bug修复 | 修复登录页面白屏问题 |
| ⚠️ 破坏性变更 | 💥 | 需要用户适配的变更 | API v1下线，请迁移至v2 |
| 🗑️ 下线 | 🗑️ | 功能/接口移除 | 移除旧版导出功能 |
| 🔒 安全 | 🔒 | 安全相关修复 | 修复XSS漏洞 |

**变更来源映射**：

| 变更来源 | 提取方式 |
|----------|---------|
| requirements-change-log | 从变更记录提取已批准的需求变更 |
| PRD差异 | 对比新旧PRD提取功能变更 |
| 用户提供 | 用户直接描述的变更内容 |

### Step 2: 用户影响评估

评估每个变更对用户的影响：

**影响等级**：

| 等级 | 定义 | 发布说明中的位置 |
|------|------|----------------|
| 🔴 高影响 | 改变用户核心工作流或需要用户操作 | 顶部"重要变更"区域 |
| 🟡 中影响 | 改善体验但不强制操作 | 按类别列出 |
| 🟢 低影响 | 用户无感知的优化 | 折叠区域 |

**用户行动项**：

| 行动类型 | 说明 | 示例 |
|----------|------|------|
| 必须操作 | 不做会影响使用 | 请重新配置API密钥 |
| 建议操作 | 做了体验更好 | 建议更新移动端至最新版 |
| 无需操作 | 自动生效 | 性能优化已自动生效 |

### Step 3: 多格式生成

根据目标受众生成不同风格的发布说明：

**格式A：终端用户版**（简洁、情感化）

```
## ✨ 新功能
- **社交分享**：一键分享到微信/微博，让好友也能用上好工具
- **暗黑模式**：深夜工作更护眼，设置中一键切换

## 🔧 改进
- 搜索速度提升3倍，输入即出结果
- 列表加载更流畅，告别卡顿

## 🐛 修复
- 修复偶尔登录失败的问题
- 修复导出文件名乱码的问题
```

**格式B：企业客户版**（专业、结构化）

```
## 新功能
| 功能 | 说明 | 影响范围 |
|------|------|---------|
| 社交分享 | 支持分享至企业微信/钉钉 | 全平台 |
| 暗黑模式 | 系统级暗黑模式适配 | 桌面端 |

## 改进
| 改进项 | 优化内容 | 性能提升 |
|--------|---------|---------|
| 搜索引擎 | 重构索引算法 | 响应时间-70% |

## 安全修复
- CVE-2025-XXXX：修复XSS漏洞（高危）
- 更新依赖库版本，修复已知安全漏洞

## 破坏性变更
- API v1将于2025-06-30下线，请迁移至API v2
  迁移指南：[链接]

## 已知问题
- Safari 14下偶现样式错位，下个版本修复
```

**格式C：开发者版**（技术、详细）

```
## Breaking Changes
- `POST /api/v1/users` → `POST /api/v2/users`（新增必填字段`tenant_id`）
- 移除 `GET /api/v1/export`（使用 `GET /api/v2/export` 替代）

## New APIs
- `POST /api/v2/share` — 社交分享接口
- `GET /api/v2/preferences/theme` — 主题偏好接口

## Changelog
- feat: 新增社交分享模块
- perf: 搜索引擎索引重构，响应时间优化70%
- fix: 修复登录Token过期后未自动刷新的问题
- security: 修复XSS漏洞 CVE-2025-XXXX
```

### Step 4: 版本信息组装

**版本信息头**：

```
# {产品名} v{版本号} 发布说明

📅 发布日期：{日期}
🏷️ 版本类型：{major/minor/patch/hotfix}
🔗 升级指南：{链接}
📋 完整变更日志：{链接}
```

**版本号语义说明**：

| 类型 | 语义 | 用户预期 |
|------|------|---------|
| major | 重大更新，可能有破坏性变更 | 期待新体验，关注迁移成本 |
| minor | 功能更新，向后兼容 | 期待新功能 |
| patch | 问题修复，向后兼容 | 期待稳定性提升 |
| hotfix | 紧急修复 | 期待问题解决 |

### Step 5: 文档组装

**完整发布说明结构**：

```
# {产品名} v{版本号} 发布说明

## ⚠️ 重要变更（如有破坏性变更或必须操作）
- ...

## ✨ 新功能
- **功能名**：描述（影响等级）
- ...

## 🔧 改进
- 描述（影响等级）
- ...

## 🐛 修复
- 描述
- ...

## 🔒 安全修复（如有）
- 描述

## 🗑️ 下线通知（如有）
- 描述及替代方案

## ⚠️ 已知问题（如有）
- 描述及临时解决方案

## 📋 升级指引（如需要）
### 前置条件
### 升级步骤
### 回滚方案

## 致谢（可选）
```

## 输出

**存储路径**：`output/pm-development/release-notes/`

**输出文件**：

| 文件 | 格式 | 说明 |
|------|------|------|
| release-notes-v{版本号}.md | Markdown | 完整发布说明（终端用户版） |
| release-notes-v{版本号}-enterprise.md | Markdown | 企业客户版 |
| release-notes-v{版本号}-developer.md | Markdown | 开发者版 |
| release-notes-v{版本号}.json | JSON | 结构化数据 |

**输出Schema**：

```json
{
  "type": "object",
  "required": ["version", "release_date", "release_type", "changes"],
  "properties": {
    "version": {"type": "string", "description": "版本号"},
    "release_date": {"type": "string", "description": "发布日期"},
    "release_type": {"type": "string", "description": "发布类型：major/minor/patch/hotfix"},
    "target_audience": {"type": "string", "description": "目标受众"},
    "high_impact_changes": {"type": "array", "description": "高影响变更列表"},
    "changes": {"type": "array", "description": "变更列表，按类别分类"},
    "known_issues": {"type": "array", "description": "已知问题列表"},
    "breaking_changes": {"type": "array", "description": "破坏性变更列表"},
    "upgrade_guide": {"type": "object", "description": "升级指引"}
  }
}
```

**release-notes.json 结构**：

```json
{
  "version": "2.3.0",
  "release_date": "2025-03-15",
  "release_type": "minor",
  "target_audience": "终端用户",
  "high_impact_changes": [],
  "changes": [
    {
      "category": "新功能/改进/修复/安全/下线/破坏性变更",
      "title": "变更标题",
      "description": "变更描述",
      "impact_level": "高/中/低",
      "user_action": "必须操作/建议操作/无需操作",
      "related_requirement": "FR-XXX"
    }
  ],
  "known_issues": [],
  "breaking_changes": [],
  "upgrade_guide": {}
}
```

## 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| release_notes | object | 是 | 发布说明根对象 |
| release_notes.version | string | 是 | 版本号 |
| release_notes.release_date | string | 是 | 发布日期 |
| release_notes.highlights | array | 是 | 核心亮点列表，至少1项 |
| release_notes.highlights[].title | string | 是 | 亮点标题 |
| release_notes.highlights[].description | string | 是 | 亮点描述 |
| release_notes.highlights[].target_audience | string | 是 | 目标受众 |
| release_notes.changes | object | 是 | 变更分类 |
| release_notes.changes.new_features | array | 是 | 新功能列表 |
| release_notes.changes.improvements | array | 是 | 改进列表 |
| release_notes.changes.bug_fixes | array | 是 | 修复列表 |
| release_notes.changes.breaking_changes | array | 否 | 破坏性变更列表 |
| release_notes.changes.deprecations | array | 否 | 废弃功能列表 |
| release_notes.upgrade_guide | object | 条件必填 | 升级指南，有breaking_changes时必填 |
| release_notes.known_issues | array | 否 | 已知问题列表 |
| release_notes.acknowledgments | array | 否 | 致谢列表 |

## 上游变更响应

当上游输入发生变更时，本Skill的响应策略：

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| PRD需求变更 | 新功能和改进描述 | 更新变更分类和描述，标记需人类确认 |
| 灰度发布结果 | 已知问题和升级指南 | 更新已知问题列表，补充升级注意事项 |
| 验收报告变更 | 变更分类和完整性 | 重新评估变更分类，确保所有变更已覆盖 |
| 检查清单变更 | 发布说明完整性 | 更新发布说明，确保与检查清单一致 |

当发布说明自身变更时，对下游的通知机制：

| 说明变更类型 | 通知范围 | 通知方式 |
|-------------|----------|----------|
| 破坏性变更新增 | 全部下游 | 标记破坏性变更，触发影响评估 |
| 已知问题新增 | retrospective-auto | 标记已知问题，触发复盘输入 |
| 版本号变更 | release-gradual | 标记版本变更，触发灰度配置更新 |

---

## 决策规则

| 条件 | 决策 |
|------|------|
| 有破坏性变更 | 必须在顶部"重要变更"区域突出显示 |
| 有安全修复 | 必须包含安全修复章节，标注CVE编号 |
| 变更条目>20 | 按影响等级排序，低影响折叠 |
| hotfix类型 | 只列出修复项，不列新功能和改进 |
| major版本 | 必须包含升级指引和回滚方案 |

## 质量检查

- [ ] 版本号和日期正确
- [ ] 变更按类别分类
- [ ] 破坏性变更已突出显示
- [ ] 用户行动项已明确
- [ ] 已知问题已列出
- [ ] 多格式已生成（用户版/企业版/开发者版）
- [ ] 无技术术语泄露到终端用户版

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 变更记录缺失 | 基于用户提供变更描述生成 | 变更可能不完整 |
| PRD缺失 | 无法自动提取功能变更 | 需人工补充功能描述 |
| 目标受众未指定 | 默认生成终端用户版 | 可能需要补充其他版本 |
