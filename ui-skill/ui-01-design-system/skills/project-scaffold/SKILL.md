---
name: project-scaffold
description: 当需要初始化前端项目时使用。项目脚手架自动生成，根据技术栈初始化可运行的前端项目骨架，包含目录结构、基础依赖、配置文件和开发服务器，确保后续Skill生成的代码直接写入可运行项目。关键词：项目初始化、脚手架、创建项目、初始化项目、新建前端项目、搭项目、起项目。
metadata:
  module: "UI设计与前端开发"
  sub-module: "设计系统"
  type: "pipeline"
  version: "1.0"
  domain_tags: ["互联网", "通用"]
  trigger_examples:
    - "初始化前端项目"
    - "创建一个新项目"
    - "搭个项目骨架"
    - "起一个React项目"
  interaction_mode: "ai_auto"
---

# Pipeline 0: 项目脚手架自动生成

## 核心原则

1. **可运行优先**——初始化完成后 `npm run dev` 必须能启动，零额外操作
2. **约定优于配置**——采用框架推荐的标准目录结构，不自行发明
3. **增量友好**——后续Skill写入代码后项目仍可运行，不破坏已有结构
4. **类型安全**——TypeScript为默认选项，不提供纯JS选项

## 交互模式

🤖 AI自动执行

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| project_name | string | 是 | 用户提供 | 项目名称，用于package.json的name字段和目录名 |
| project_dir | string | 是 | 用户提供 | 项目根目录的绝对路径，所有代码写入此目录 |
| framework | string | 是 | 用户提供 | React / Vue / Svelte / Next.js / Nuxt.js |
| package_manager | string | ○ | 用户提供 | pnpm / npm / yarn（默认pnpm） |
| target_language | string | ○ | 上游编排器传递 / 用户提供（默认zh-CN） | 目标界面语言 |

### framework 枚举说明

| framework | 初始化命令 | 目录结构 |
|-----------|----------|---------|
| React | `npm create vite@latest -- --template react-ts` | src/components, src/hooks, src/utils, src/styles |
| Vue | `npm create vite@latest -- --template vue-ts` | src/components, src/composables, src/utils, src/styles |
| Svelte | `npm create vite@latest -- --template svelte-ts` | src/lib, src/routes, src/styles |
| Next.js | `npx create-next-app@latest --typescript` | src/app, src/components, src/lib, src/styles |
| Nuxt.js | `npx nuxi@latest init` | pages/, components/, composables/, server/ |

## 执行步骤

### Step 1: 项目初始化

根据framework执行对应的初始化命令：

- 在 `project_dir` 目录下执行初始化
- 安装基础依赖
- 确认 `npm run dev` 可启动

**基础依赖安装**（所有框架通用）：

```
typescript @types/react @types/node
eslint prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

**按需依赖**：

| 条件 | 安装依赖 |
|------|---------|
| framework=React | react react-dom react-router-dom |
| framework=Vue | vue vue-router pinia |
| framework=Svelte | svelte @sveltejs/kit |
| framework=Next.js | next react react-dom |
| framework=Nuxt.js | nuxt |

### Step 2: 目录结构创建

在初始化项目基础上，创建后续Skill需要的标准目录：

**React/Vue 通用目录结构**：

```
{project_dir}/
├── src/
│   ├── components/       ← ui-component-gen 写入
│   │   └── ui/           ← 基础UI组件
│   ├── pages/            ← page-assembly 写入
│   ├── api/              ← api-contract-consume 写入
│   │   ├── client.ts     ← HTTP客户端封装
│   │   ├── types.ts      ← API类型定义
│   │   └── hooks/        ← 数据请求Hooks
│   ├── styles/
│   │   └── tokens.css    ← design-system 写入
│   ├── hooks/            ← 自定义Hooks
│   ├── utils/            ← 工具函数
│   ├── types/            ← 全局类型定义
│   ├── i18n/             ← 国际化资源
│   ├── App.tsx
│   └── main.tsx
├── public/
├── tests/                ← frontend-test 写入
├── .env.development
├── .env.staging
├── .env.production
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

**Next.js 目录结构**：

```
{project_dir}/
├── src/
│   ├── app/              ← Next.js App Router
│   ├── components/       ← ui-component-gen 写入
│   ├── lib/
│   │   ├── api/          ← api-contract-consume 写入
│   │   └── utils.ts
│   ├── styles/
│   │   └── tokens.css    ← design-system 写入
│   └── types/
├── public/
├── tests/
├── next.config.js
├── package.json
└── tsconfig.json
```

### Step 3: 基础配置文件生成

生成项目基础配置：

| 配置文件 | 内容 |
|----------|------|
| tsconfig.json | 严格模式、路径别名（@/→src/）、ESNext |
| vite.config.ts | 路径别名、代理配置、构建优化 |
| .eslintrc.cjs | TypeScript规则、React/Vue插件 |
| .prettierrc | 统一格式化规则 |
| .env.development | `VITE_API_BASE_URL=http://localhost:3000` |
| .env.staging | `VITE_API_BASE_URL=https://staging-api.example.com` |
| .env.production | `VITE_API_BASE_URL=https://api.example.com` |
| .gitignore | node_modules, dist, .env.local |

### Step 4: 可运行验证

执行以下验证确保项目可运行：

- [ ] `npm install` 成功
- [ ] `npm run dev` 启动成功（HTTP 200）
- [ ] `npm run build` 构建成功
- [ ] `npm run lint` 无错误
- [ ] 目录结构完整（components/pages/api/styles 目录存在）

## 输出

**存储路径**：`output/ui-project-scaffold/`

**代码文件**：直接写入 `{project_dir}/` 目录

**元数据文件**：scaffold.json

**输出Schema**：

```json
{
  "type": "object",
  "required": ["project_name", "project_dir", "framework", "structure", "verification"],
  "properties": {
    "project_name": {"type": "string", "description": "项目名称"},
    "project_dir": {"type": "string", "description": "项目根目录绝对路径"},
    "framework": {"type": "string", "description": "前端框架"},
    "package_manager": {"type": "string", "description": "包管理器"},
    "structure": {"type": "object", "description": "项目目录结构，含各目录用途说明和后续Skill写入路径映射"},
    "verification": {"type": "object", "description": "可运行验证结果，含dev/build/lint三项状态"}
  }
}
```

**输出校验规则**：

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| project_name | string | 是 | 项目名称，不可为空 |
| project_dir | string | 是 | 项目根目录绝对路径，必须存在且可访问 |
| framework | string | 是 | 前端框架，枚举：React/Vue/Svelte/Next.js/Nuxt.js |
| structure.components_dir | string | 是 | 组件目录路径，如 src/components |
| structure.pages_dir | string | 是 | 页面目录路径，如 src/pages |
| structure.api_dir | string | 是 | API请求层目录路径，如 src/api |
| structure.styles_dir | string | 是 | 样式目录路径，如 src/styles |
| structure.tokens_file | string | 是 | 设计令牌文件路径，如 src/styles/tokens.css |
| verification.dev_server | boolean | 是 | npm run dev 是否启动成功 |
| verification.build | boolean | 是 | npm run build 是否构建成功 |
| verification.lint | boolean | 是 | npm run lint 是否通过 |

## 决策规则

| 条件 | 决策 |
|------|------|
| project_dir 已存在且有 package.json | 检测现有技术栈，仅补充缺失目录和配置，不覆盖已有文件 |
| project_dir 已存在但无 package.json | 在现有目录中初始化项目 |
| project_dir 不存在 | 创建目录后初始化项目 |
| framework=React | 使用 Vite + React + TypeScript 模板 |
| framework=Next.js | 使用 create-next-app --typescript |
| framework=Vue | 使用 Vite + Vue + TypeScript 模板 |
| package_manager 未指定 | 优先 pnpm，回退 npm |
| 目标语言=zh-CN | 默认文案使用中文 |
| 目标语言=en-US | 默认文案使用英文 |

## 质量检查

- [ ] `npm run dev` 启动成功
- [ ] `npm run build` 构建成功
- [ ] `npm run lint` 无错误
- [ ] components/ 目录存在
- [ ] pages/ 目录存在
- [ ] api/ 目录存在
- [ ] styles/ 目录存在
- [ ] tsconfig.json 存在且配置严格模式
- [ ] 路径别名 @/ 已配置

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| framework 未指定 | 默认 React + Vite + TypeScript | 技术栈可能与用户预期不符 |
| package_manager 未指定 | 使用 pnpm | 如系统无pnpm则回退npm |
| project_dir 路径无写权限 | 提示用户更换目录或检查权限 | 无法创建项目 |
| 初始化命令执行失败 | 手动创建最小项目结构（package.json + tsconfig.json + src/） | 项目可运行但缺少框架特定优化 |

## 上游变更响应

### 上游变更影响

本Skill为起始Skill，无上游文件依赖，不涉及上游变更影响。

### 下游通知机制

| 下游Skill | 通知触发条件 | 通知方式 | 通知内容 |
|-----------|------------|---------|---------|
| design-system | scaffold.json更新完成 | 写入output文件 | 通知项目目录路径、styles目录路径、tokens文件路径已就绪 |
| ui-component-gen | scaffold.json更新完成 | 写入output文件 | 通知项目目录路径、components目录路径已就绪 |
| page-assembly | scaffold.json更新完成 | 写入output文件 | 通知项目目录路径、pages目录路径已就绪 |
| api-contract-consume | scaffold.json更新完成 | 写入output文件 | 通知项目目录路径、api目录路径已就绪 |
| frontend-build-deploy | scaffold.json更新完成 | 写入output文件 | 通知项目目录路径、构建配置已就绪 |
