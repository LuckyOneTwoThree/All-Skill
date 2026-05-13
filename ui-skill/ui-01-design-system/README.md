# 模块：UI设计系统

## 定位

UI与前端一体化流程的起点。在需要建立设计系统或统一视觉规范时使用。目标是**从品牌基因推导设计变量，建立令牌驱动的组件化设计系统**。

## 何时使用

- 从零开始建立产品，需要统一设计规范
- 现有设计不统一，需要建立设计系统收拢
- 品牌升级，需要更新设计令牌和组件库
- 需要为UI组件生成提供设计约束基础

## 子模块与编排器

| 子模块 | 编排器 | 作用 | 何时调用 |
|--------|--------|------|----------|
| 设计系统建立 | design-system-orchestrator | 协调设计系统一体化生成的完整流程 | 需要从零建立或更新设计系统时 |

## Pipeline Skill 清单

### 设计系统一体化生成（1个）

| Skill | 作用 | 输入 | 输出 |
|-------|------|------|------|
| design-system | 从品牌规范推导设计令牌，按原子设计规划组件库，同步生成文档 | 品牌规范、产品定位、目标平台、PRD(可选) | design-system.json |

> 💡 **合并说明**：v2.0 将原 design-token + component-library + design-system-doc 三个 Skill 合并为 design-system 一个 Skill，减少阶段交接开销。暗色模式推导、Figma同步等能力已内建（见 [extensions/README.md](../extensions/README.md) 已内建能力表），视觉差异化、质量打磨等通过外部 Skill（ext-frontend-design、ext-impeccable、ext-ui-ux-pro-max）增强。

## 执行顺序

```
┌──────────────────────────────────────────┐
│         design-system 一体化生成          │
│  Step1: 品牌基因+色彩 → Step2: 字体/间距 │
│  → Step3: 组件规划 → Step4: 规格输出+文档 │
└──────────────────────────────────────────┘
```

- 品牌基因是基础，所有视觉决策从品牌推导
- 令牌驱动一切，组件基于令牌定义
- 文档与组件同步生成，避免文档债务

## 输出路径

```
output/ui-design-system/
└── design-system/
```

## 阶段卡口

### 进入下一模块（UI前端生成）前需满足：
- 设计令牌人类已确认
- 组件层级划分人类已确认
- WCAG AA对比度100%达标
- 组件依赖图无循环

## 人类决策点

| 决策点 | 说明 |
|--------|------|
| 品牌色确认 | AI生成色彩体系，人类确认品牌主色和辅助色 |
| 组件层级划分 | AI建议原子/分子/组织分类，人类确认边界 |
| 令牌命名规范 | AI建议语义命名，人类确认命名体系 |

## 外部 Skill 扩展

> **命名规范**：外部 Skill 统一使用 `ext-` 前缀（如 `ext-frontend-design`），与核心自建 Skill 区分。核心 Skill 通过 `Skill: ext-xxx` 定向调用，未安装时自动降级不阻塞流程。详见 [extensions/README.md](../extensions/README.md)。

| 外部 Skill 名称 | 增强能力 | 调用时机 | 输入 | 输出 |
|----------------|---------|---------|------|------|
| `ext-ui-ux-pro-max` `--design-system` | 数据驱动设计决策（配色/字体/风格推荐） | design-system Step 1 | 品牌规范+产品定位 | 设计推荐数据 |
| `ext-frontend-design` | 视觉差异化，避免AI同质化 | design-system Step 1 | 品牌规范+产品定位+目标语言 | 差异化美学方向建议 |
| `ext-impeccable` `colorize` | 战略性色彩增强 | design-system Step 1 | 令牌草案+品牌色占比 | 增强后的色彩方案 |
| `ext-impeccable` `typeset` | 排版层级增强 | design-system Step 2 | 字号/字重层级 | 增强后的排版方案 |
| `ext-impeccable` `extract` | 从现有代码逆向提取设计系统 | design-system Step 3 | 现有组件库/项目代码 | 逆向提取的设计令牌 |

## 核心信念

- 设计系统是约束不是限制，一致性释放创造力
- 令牌驱动一切，硬编码是技术债
- 文档即代码，变更同步
- 可访问性不是可选项，是默认项
