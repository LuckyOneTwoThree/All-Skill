# 模块：前端集成

## 定位

前后端联调与上线的桥梁。将前端代码与后端API对接，完成构建部署和性能优化，确保产品可上线。目标是**通过契约驱动和自动化保障，实现前后端无缝联调和高质量上线**。

## 何时使用

- UI前端代码已生成，需要与后端API联调
- 后端API契约已定义，需要生成前端请求层
- 需要配置前端构建、部署和CI/CD流水线
- 需要优化前端性能，确保上线质量

## Pipeline Skill 清单

### API集成自动生成（1个）

| Skill | 作用 | 输入 | 输出 |
|-------|------|------|------|
| api-integration | 基于API契约自动生成前端请求层代码，包含类型安全的API客户端、拦截器、错误处理和Mock数据 | API契约、页面数据流、目标框架、project_dir | api-integration.json（含endpoints/types/mock_data）+ API客户端代码 |

> 💡 **变更说明**：v2.0 将原 api-contract-consume 更名为 api-integration，输入来源更新为 page-builder 输出的页面数据流，强化与上游模块的衔接。

### 生产就绪一体化（1个）

| Skill | 作用 | 输入 | 输出 |
|-------|------|------|------|
| production-ready | 集成构建配置、测试生成和性能优化，确保前端项目可部署、可测试、高性能 | 前端代码、API集成、目标框架、部署目标、project_dir | production-ready.json（含build_config/test_report/performance_report/performance_budget）+ 构建配置 + 测试代码 + CI配置 |

> 💡 **合并说明**：v2.0 将原 frontend-build-deploy + frontend-performance + frontend-test 合并为 production-ready 一个 Skill，构建+测试+性能一体化，消除阶段交接开销。

## 执行顺序

```
┌────────────────────────────┐     ┌──────────────────────────────────────────────┐
│   api-integration          │     │   production-ready                           │
│  Step1: API客户端代码生成   │     │  Step1: 构建配置与优化                        │
│  Step2: Mock数据+并行开发   │ ──→ │  Step2: 测试生成(单元+集成+E2E+无障碍)        │
│  Step3: 数据流对接          │     │  Step3: 性能优化                              │
└────────────────────────────┘     │  Step4: 性能预算与CI配置                      │
                                   └──────────────────────────────────────────────┘
```

- API集成先行，Mock数据支持前后端并行开发
- 生产就绪一体化：构建即验证，测试内建，性能预算写入CI
- 渐进优化：先解决最大瓶颈，再逐步优化

## 输出路径

```
output/ui-frontend-integration/
├── api-integration/
└── production-ready/

{project_dir}/
├── src/api/
└── (构建配置+测试文件+CI配置)
```

> 💡 **project_dir 双输出模式**：API请求层代码直接写入 `{project_dir}/src/api/`，构建配置和测试文件直接写入 `{project_dir}/`，元数据写入 `output/` 目录供下游 Skill 消费。

## 阶段卡口

### 进入 production-ready 前需满足：
- 100%接口有类型定义+Mock数据

### 上线前需满足：
- 构建成功，无TypeScript错误
- 组件单元测试覆盖率≥80%
- 核心用户流程E2E测试100%通过
- 无障碍测试覆盖WCAG 2.1 AA
- LCP≤2.5s
- 首屏JS≤200KB
- CLS≤0.1
- P0性能问题=0

## 人类决策点

| 决策点 | 说明 |
|--------|------|
| API契约确认 | AI消费API契约后，人类确认接口理解是否正确 |
| 部署目标选择 | 人类确认部署平台和环境配置 |
| 性能预算调整 | 人类确认性能预算阈值是否合理 |

## 外部 Skill 扩展

> **命名规范**：外部 Skill 统一使用 `ext-` 前缀（如 `ext-impeccable`），与核心自建 Skill 区分。核心 Skill 通过 `Skill: ext-xxx` 定向调用，核心增强类失败阻断下游，可选增强类失败标注不阻断。详见 [extensions/README.md](../extensions/README.md)。

| 外部 Skill 名称 | 增强能力 | 调用时机 | 输入 | 输出 |
|----------------|---------|---------|------|------|
| `ext-impeccable` `optimize` | UI渲染性能专项诊断和修复 | production-ready Step 3 | LCP数据+渲染瓶颈 | 优化后的渲染代码 |

## 核心信念

- 前后端通过契约解耦，集成通过自动化保障
- Mock先行，后端未就绪不阻塞前端开发
- 构建即验证，测试内建不是事后补充
- 性能预算写入CI，超标自动拦截
- 构建可复现，回滚秒级
