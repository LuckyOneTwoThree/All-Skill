# 模块：UI设计系统

## 定位

UI与前端一体化流程的起点。在需要建立设计系统或统一视觉规范时使用。目标是**从品牌基因推导视觉方向，建立令牌驱动的组件化设计系统，同步初始化项目脚手架**。

## 何时使用

- 从零开始建立产品，需要统一设计规范
- 现有设计不统一，需要建立设计系统收拢
- 品牌升级，需要更新设计令牌和组件库
- 需要为UI组件生成提供设计约束基础

## Pipeline Skill 清单

### 项目初始化与视觉定义（1个）

| Skill | 作用 | 输入 | 输出 |
|-------|------|------|------|
| project-init | 从品牌规范推导视觉方向，选择组件库并定制主题，同步生成项目脚手架和设计上下文文件 | 品牌规范、产品定位、目标平台、目标语言、framework、project_dir、PRD(可选)、handoff-spec(可选) | project-init.json（含visual_direction/tokens/component_library/scaffold/anchor_overrides）+ PRODUCT.md + DESIGN.md + 项目骨架 |

> 💡 **合并说明**：v2.0 将原 project-scaffold + design-system 合并为 project-init 一个 Skill，减少阶段交接开销。新增视觉风格定义步骤（Step 2），ext-frontend-design 改为必调（每个项目必须经过美学方向审视），新增 PRODUCT.md/DESIGN.md 生成供后续 Skill 和 ext-impeccable 消费，新增 anchor_overrides（页面级视觉锚点覆盖机制），新增 visual_direction 语义一致性校验（6条维度间逻辑约束）。暗色模式推导、语言适配等能力已内建（见 [extensions/README.md](../extensions/README.md) 已内建能力表），视觉差异化、质量打磨等通过外部 Skill（ext-frontend-design、ext-impeccable、ext-ui-ux-pro-max）增强。

## 执行顺序

```
┌───────────────────────────────────────────────────────────────────┐
│                    project-init 一体化生成                         │
│  Step1: 品牌基因+色彩 → Step2: 视觉风格定义(必调ext-frontend-design)│
│  → Step3: 组件库选择+主题定制 → Step4: 项目脚手架初始化+令牌文件输出  │
│  → Step5: 上下文文件(PRODUCT.md/DESIGN.md)输出                       │
└───────────────────────────────────────────────────────────────────┘
```

- 视觉方向优先——先定义"长什么样"，再生成令牌和代码
- 品牌基因是基础，所有视觉决策从品牌推导
- 令牌驱动一切，组件基于令牌定义
- 上下文即代码，PRODUCT.md/DESIGN.md 与代码同步生成

## 输出路径

```
output/ui-project-init/
└── project-init/

{project_dir}/
├── PRODUCT.md
├── DESIGN.md
└── src/styles/
    ├── tokens.css
    └── tokens.json
```

## 阶段卡口

### 进入下一模块（UI前端生成）前需满足：
- visual_direction 10个维度均有明确定义
- ext-frontend-design 已调用且输出不含AI同质化特征
- PRODUCT.md 和 DESIGN.md 已生成且内容非占位符
- 设计令牌人类已确认
- WCAG AA对比度100%达标
- npm run dev 启动成功

## 人类决策点

| 决策点 | 说明 |
|--------|------|
| 品牌色确认 | AI生成色彩体系，人类确认品牌主色和辅助色 |
| 视觉风格确认 | AI定义美学方向/色彩策略/视觉禁忌，人类确认视觉方向 |
| 组件库选择 | AI推荐组件库，人类确认选择（轻量路径/完整路径） |
| 令牌命名规范 | AI建议语义命名，人类确认命名体系 |

## 外部 Skill 扩展

> **命名规范**：外部 Skill 统一使用 `ext-` 前缀（如 `ext-frontend-design`），与核心自建 Skill 区分。核心 Skill 通过 `Skill: ext-xxx` 定向调用，核心增强类（ext-frontend-design/ext-ui-ux-pro-max）失败阻断下游，可选增强类失败标注不阻断。详见 [extensions/README.md](../extensions/README.md)。

| 外部 Skill 名称 | 增强能力 | 编排器阶段 | 输入 | 输出 |
|----------------|---------|-----------|------|------|
| `ext-frontend-design` | 视觉差异化，避免AI同质化 | stage-2（**必调**） | 品牌规范+产品定位+目标语言 | 差异化美学方向建议 |
| `ext-ui-ux-pro-max` `--design-system` | 数据驱动设计决策（配色/字体/风格推荐） | stage-2 | 品牌规范+产品定位 | 设计推荐数据 |
| `ext-impeccable` `colorize` | 战略性色彩增强 | stage-2 | 令牌草案+品牌色占比 | 增强后的色彩方案 |
| `ext-impeccable` `typeset` | 排版层级增强 | stage-2 | 字号/字重层级 | 增强后的排版方案 |
| `ext-impeccable` `extract` | 从现有代码逆向提取设计系统 | stage-2 | 现有组件库/项目代码 | 逆向提取的设计令牌 |

## 核心信念

- 视觉方向优先，先定义"长什么样"再生成令牌和代码
- 设计系统是约束不是限制，一致性释放创造力
- 令牌驱动一切，硬编码是技术债
- 文档即代码，变更同步
- 可访问性不是可选项，是默认项
