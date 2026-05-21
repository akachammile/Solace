# CHANGELOG

记录当前工作区近期代码改动摘要。只记录“改了什么”和“为什么改”，不再逐行记录修改前后代码。

更新时间：2026-05-21 10:08:30

## 维护规则

- 新记录放在上方。
- 每条记录保持简洁，写清时间、涉及范围、变更摘要和原因。
- 不需要记录每个文件的修改前内容、修改后内容或精确行号。
- 所有文件读取按 UTF-8 处理，除非文件显式声明其他编码。

## 修改记录

### 2026-05-21 18:00

- 涉及范围：`src/renderer/assets/styles.css`、`src/renderer/pages/Main`、`src/renderer/i18n/locales`
- 变更摘要：将右侧栏改为占位区域，移除右侧真实 Agent 状态、工具事件和内部交接渲染；浅色主题基础背景统一为纯白。
- 修改原因：按当前界面方向先保留右侧空间，并修正浅色主题仍偏灰绿的问题。

### 2026-05-21 17:47

- 涉及范围：`src/renderer/assets/styles.css`、`src/renderer/pages/Main/main.css`
- 变更摘要：移除 AppRail 左侧的内容区边框和左侧内缩，使 AppRail 贴齐应用左边缘。
- 修改原因：修正 AppRail 左侧仍有线条的问题。

### 2026-05-21 17:46

- 涉及范围：`src/renderer/assets/styles.css`、`src/renderer/pages/Main/main.css`
- 变更摘要：将 AppRail 改为直上直下的矩形栏，移除 rail 按钮圆角和圆角容器感，active 状态改为直角侧边强调。
- 修改原因：按设计反馈取消 AppRail 的圆角容器形态。

### 2026-05-21 17:44

- 涉及范围：`src/renderer/App.tsx`、`src/renderer/assets/styles.css`、`src/renderer/pages/Main`
- 变更摘要：将 AppRail 从 topbar 下方的独立 shell 栏移入主页左侧栏，形成 AppRail/center content/right sidebar 的 2:6:2 三段式布局，并让 topbar 独立显示分割线。
- 修改原因：按新的界面方向取消 apprail 与 topbar 的一体化视觉关系，改为主页自身三栏比例布局。

### 2026-05-21 17:37

- 涉及范围：`src/renderer/pages/Main`、`src/renderer/App.tsx`、`src/renderer/i18n/locales`
- 变更摘要：将主页面重构为左侧会话列表、中间对话工作区、右侧 Agent 状态的三段式 workspace，并补齐中英文文案。
- 修改原因：让主页更符合“用户与 Agent 聊天协作 workspace”的核心使用场景。

### 2026-05-21 17:20

- 涉及范围：`src/renderer/components/layout/AppTopBar.tsx`、`src/renderer/assets/styles.css`、`src/renderer/pages/Settings`
- 变更摘要：将主窗口和 Settings 的窗口控制按钮移动到右侧，改为 Windows 风格，并按最小化、最大化、关闭排序。
- 修改原因：按设计要求撤回左侧 traffic light 形态，统一为右侧 Windows 窗口控制区。

### 2026-05-21 17:14

- 涉及范围：`src/renderer/pages/Settings/index.ts`
- 变更摘要：将 Settings 弹窗外层容器圆角改为 0，使设置页面外框与 application 一样恢复为直角矩形。
- 修改原因：统一 application 与 setting 页面外框的直角设计。

### 2026-05-21 17:13

- 涉及范围：`src/renderer/assets/styles.css`
- 变更摘要：将最外层 `.app-shell` 的圆角改为 0，使 application 外框恢复为直角矩形。
- 修改原因：按设计要求取消 application 外层圆角，回归直角窗口形态。

### 2026-05-21 17:08

- 涉及范围：`src/renderer/pages/Settings/index.ts`
- 变更摘要：将 ModelPanel 中 model/provider list 与 model detail 之间的分割线改为左侧列表列的右边框，并让列表列随 grid 高度拉满。
- 修改原因：确保分割线位于 modellist 右侧、modeldetail 左侧，并铺满整个面板高度。

### 2026-05-21 17:05

- 涉及范围：`src/renderer/pages/Settings/index.ts`
- 变更摘要：将模型设置详情区左侧分割线从父级布局伪元素改为 `SettingsProviderDetails` 自身左边框。
- 修改原因：确保详情容器左侧分割线随容器高度铺满，避免列宽计算导致线条显示不完整。

### 2026-05-21 17:02

- 涉及范围：`src/renderer/assets/styles.css`、`src/renderer/pages/Main/main.css`、`src/renderer/pages/Settings/index.ts`
- 变更摘要：为白色浅色主题新增 `--color-primary-text`，将浅色模式下依赖主色的文字和图标改为深色主文字变量。
- 修改原因：修复 `--color-primary` 改为白色后，浅色主题中激活态文字、图标和按钮文字对比度不足的问题。

### 2026-05-21 16:51

- 涉及范围：`src/renderer/assets/styles.css`、`src/renderer/pages/Main/main.css`、`src/renderer/pages/Settings/index.ts`
- 变更摘要：将浅色主题主色改为白色系，并整体上调工作台、主页和 Settings 的小字号，使字体尺寸更统一。
- 修改原因：满足白色主题色要求，同时提升浅色模式下的文字可读性和界面一致性。

### 2026-05-21 16:45

- 涉及范围：`src/renderer/pages/Settings/index.ts`
- 变更摘要：移除模型 sticky stacking cards 的阴影和 hover 抬升效果，改为扁平式边框与背景层级。
- 修改原因：让模型列表符合扁平化视觉风格。

### 2026-05-21 16:43

- 涉及范围：`src/renderer/pages/Settings`
- 变更摘要：将模型 series 分组调整为 sticky stacking cards，外层滚动负责 series 切换，分组卡片内部可独立滚动具体模型。
- 修改原因：让模型详情页在多个模型系列之间滚动时形成卡片堆叠效果，同时保留单个系列内模型列表的可浏览性。

### 2026-05-21 16:39

- 涉及范围：`src/renderer/assets/styles.css`
- 变更摘要：加深浅色主题下的主文字、次级文字和弱提示文字颜色。
- 修改原因：提高莫兰迪绿灰浅色主题的文字对比度，让字体更接近黑色、更易读。

### 2026-05-21 16:37

- 涉及范围：`src/renderer/assets/styles.css`
- 变更摘要：将浅色主题从米黄色改为莫兰迪绿灰色系，补充主色 hover/active、副色和语义色变量，并清理米黄主题残留色值。
- 修改原因：让浅色模式更贴合当前 Electron 工作台界面，降低刺眼感并提升主按钮/激活态一致性。

### 2026-05-21 16:23

- 涉及范围：`src/renderer/assets/styles.css`
- 变更摘要：将浅色主题从石墨浅灰调整为米黄色系，并将浅色主题主按钮/强调色设置为淡 `#FFB783`。
- 修改原因：改善浅色模式观感，让默认浅色主题更温和。

### 2026-05-21 16:19

- 涉及范围：`src/renderer/pages/Settings`
- 变更摘要：将模型详情页的模型系列分组改为带 label 的中空容器，header 中展示 provider 图标和模型系列名，容器内承载该系列模型卡片。
- 修改原因：让 GPT、Claude 等模型系列与具体模型列表的层级关系更清晰。

### 2026-05-21 16:03

- 涉及范围：`src/renderer/pages/Settings/index.ts`
- 变更摘要：调整 Settings 模型卡片之间的间距，取消贴合叠压，让每个模型条目保留明确空白。
- 修改原因：提升模型列表可读性，避免卡片堆叠过密。

### 2026-05-21 15:59

- 涉及范围：`src/renderer/pages/Settings/index.ts`
- 变更摘要：将 Settings 模型详情区域的模型滚动列表调整为堆叠式卡片样式，增加卡片边框、阴影、选中侧标和轻微层叠间距。
- 修改原因：提升 model detail 中模型列表的层级感，让滚动内容更像可选择的模型卡片。

### 2026-05-21 15:54

- 涉及范围：`src/renderer/assets/styles.css`
- 变更摘要：将浅色主题从偏亮灰白调整为更低亮度的石墨浅灰，并同步收敛边框、hover、玻璃层和阴影变量。
- 修改原因：降低浅色模式的刺眼感，让黑灰主题切换下的整体观感更统一。

### 2026-05-21 15:46

- 涉及范围：`src/renderer/pages/Settings`
- 变更摘要：删除 Settings 目录下的独立 CSS 文件，将 Settings 弹窗、侧栏、表单、MCP、技能、模型 provider/list/detail 等样式统一迁移到 `index.ts` 的 styled div 组件，并移除页面中的样式 className。
- 修改原因：让 Settings 页面只通过固定样式组件组合 UI，避免 CSS 文件和 className 分散维护。

### 2026-05-21 14:27

- 涉及范围：`src/renderer/pages/Settings`
- 变更摘要：将 Settings 子页面中通用的 panel、heading、section grid、block 和 label 样式改为使用 `index.ts` 导出的 styled div 组件，并移除对应的旧公共 CSS class。
- 修改原因：减少 Settings 公共样式在 CSS 和组件入口之间重复维护，让页面结构样式统一由 `index.ts` 承担。

### 2026-05-21 14:16

- 涉及范围：`src/renderer/pages/Settings/ProviderSettings/model-settings.css`
- 变更摘要：将模型设置页左右分割线从左侧列表的 `border-r` 调整为父级布局伪元素绘制。
- 修改原因：避免分割线受子容器 padding 和内部布局影响，确保视觉上贯穿 model detail 容器高度。

### 2026-05-21 14:09

- 涉及范围：`src/renderer/assets/styles.css`
- 变更摘要：将中文字体栈调整为优先匹配 Cherry Studio 文档示例和推荐字体，前置 `Hanyi Tang Meiren`、`MiSans Global`、`MiSans`。
- 修改原因：让 Solace 的中文字体选择与 Cherry Studio 的公开字体配置方向保持一致。

### 2026-05-21 14:03

- 涉及范围：`src/renderer/assets/styles.css`
- 变更摘要：调整全局字体栈，为中文优先加入 `Noto Sans SC`、`Microsoft YaHei UI`、`HarmonyOS Sans SC`、`MiSans` 等更稳重的中文字体回退，并加载更完整字重。
- 修改原因：改善中文默认回退字体观感，让应用中文字形更厚重统一。

### 2026-05-21 13:49

- 涉及范围：`src/renderer/data/model-catalog.ts`、`src/renderer/assets/model-icons`
- 变更摘要：精简 Settings 模型服务商列表，移除冷门或重复聚合入口，并补齐当前保留 provider 的本地彩色 SVG 图标。
- 修改原因：降低模型配置页噪声，让 provider 列表更聚焦且图标识别更清楚。

### 2026-05-21 13:34

- 涉及范围：`src/renderer/pages/Settings`
- 变更摘要：将 Settings 的通用样式组件从 `SettingsOption*` 重命名为更贴近页面结构的 `SettingRow`、`SettingContent`、`SettingTitle`、`SettingControl` 等命名。
- 修改原因：提升 Settings 内部组件语义清晰度，避免 `Option` 命名混淆样式容器和业务选项。

### 2026-05-21 13:23

- 涉及范围：`src/renderer/pages/Settings/index.ts`、Settings 子页面、依赖配置
- 变更摘要：移除 Settings 样式组件中对 Ant Design 和非 div 语义元素的封装，统一改为 styled-components 的 `div` 容器样式组件，并卸载 `antd`。
- 修改原因：保持 Settings 样式入口只提供单纯容器样式，不封装第三方组件或状态语义。

### 2026-05-21 13:16

- 涉及范围：`src/renderer/pages/Settings/index.ts`、Settings 子页面
- 变更摘要：将 Settings 入口收敛为纯样式组件导出，移除 `SettingsOptionRow` 与 `RowStyleProps` 等封装逻辑，业务页面直接组合 styled-components/Ant Design 样式组件。
- 修改原因：保持 `index.ts` 只负责样式，不封装状态、内容拼装或业务判断。

### 2026-05-21 13:12

- 涉及范围：`package.json`、`src/renderer/pages/Settings/index.tsx`
- 变更摘要：引入 `antd` 与 `styled-components`，将 Settings option row 入口改为基于 Ant Design 基础组件和 styled-components 的样式组件封装。
- 修改原因：让 Settings 专用组件只负责样式与受控展示，不在组件内部维护业务状态。

### 2026-05-21 12:52

- 涉及范围：`src/renderer/pages/Settings/components`、Settings 子页面与相关 CSS
- 变更摘要：新增 Settings 专用 option row 组件入口，将 provider/model/skills/workspace 的选项行改为从 `components/index.tsx` 导出的 React 组件渲染，并移除对应 CSS 版 row 样式。
- 修改原因：让 Settings 选项行样式直接封装在 Settings 专用组件里，避免继续通过全局或页面 CSS 维护这类样式组合。

### 2026-05-21 11:26

- 涉及范围：`src/renderer/assets/styles.css`、`src/renderer/pages/Settings`
- 变更摘要：移除全局 `ui-option-row` 组合，将行项目样式改为 Settings 专用的 `settings-option-row` 体系，并把 model/provider/skills 条目统一接到 Settings 自己的样式组件上。
- 修改原因：Settings 的选项样式不应污染全局基础样式，保持全局只承载更基础的字体、颜色和应用壳层 token。

### 2026-05-21 11:21

- 涉及范围：`src/renderer/assets/styles.css`、`src/renderer/pages/Settings`
- 变更摘要：新增通用 `ui-option-row` 行项目样式组合，并让 settings 的 provider list、model list、skills 项接入统一的字号、颜色、icon、hover/active、状态点和 pill 组合。
- 修改原因：把可复用的行容器视觉协议抽到基础层，方便后续在外围页面复用，同时保留各页面自己的业务布局样式。

### 2026-05-21 10:56

- 涉及范围：`src/renderer` UI 文案与 `src/renderer/i18n/locales`
- 变更摘要：统一 MCP settings 组件命名为 `MCPSettings`，并将主界面、Settings、Launchpad、Editor 等 UI 文案迁移到 i18n 资源，通过 `t()` 渲染。
- 修改原因：修复 MCP import 命名报错，并让应用内展示文案集中由 i18n 管理。

### 2026-05-21 10:45

- 涉及范围：`src/renderer/pages/Settings/SettingsSidebar.tsx`、`src/renderer/pages/Settings/SettingsPage.tsx`
- 变更摘要：将 Settings 页面 sidebar 拆成独立组件，并修正 MCP settings import 的大小写路径。
- 修改原因：让 Settings 主页面只负责页面状态和内容切换，sidebar 结构单独维护。

### 2026-05-21 10:39

- 涉及范围：`src/renderer/pages/Settings/ProviderSettings`
- 变更摘要：将原 `ModelSettings` 目录改名为 `ProviderSettings`，并更新 `SettingsPage` 中的组件和样式引用。
- 修改原因：该设置页实际管理 provider 配置和模型选择，用 `ProviderSettings` 命名更贴近语义。

### 2026-05-21 10:34

- 涉及范围：`src/renderer/pages/Settings`
- 变更摘要：按 Settings 页面 tab 拆出 `ModelSettings`、`WorkspaceSettings`、`AgentSettings`、`McpSettings`、`SkillsSettings` 五个子模块，`SettingsPage` 只负责页面切换和共享状态。
- 修改原因：让每个 settings 页面有明确目录边界，减少 `SettingsPage.tsx` 内联页面代码。

### 2026-05-21 10:27

- 涉及范围：`src/renderer/pages/Settings/ModelSettings`
- 变更摘要：将模型/provider 设置子页面和对应 CSS 移入 `ModelSettings` 目录，并移除空的 `components` 目录。
- 修改原因：让 Settings 下的模型设置模块位置更清晰，不再放在泛化的 components 目录里。

### 2026-05-21 10:21

- 涉及范围：`src/renderer/types/ui.ts`
- 变更摘要：恢复 `ui.ts` 作为 renderer 公共 UI 类型入口，并把 `ModelProvider` 引用切回该文件。
- 修改原因：保留后续沉淀 UI 类型或样式相关类型的扩展位置。

### 2026-05-21 10:18

- 涉及范围：`src/renderer/types/ui.ts`、`src/renderer/data/model-catalog.ts`
- 变更摘要：删除只包含一行 `ModelProvider` 类型的 `ui.ts`，将该类型合并到模型目录数据文件中导出。
- 修改原因：避免为单行类型单独建文件，减少无意义的目录碎片。

### 2026-05-21 10:13

- 涉及范围：`src/renderer/pages/Settings/components`
- 变更摘要：将 settings 模型面板从多个过细组件文件收敛为单个 `ModelsPanel.tsx`，删除仅供内部使用的 browser、details、list、icon 和类型文件。
- 修改原因：减少 Settings 目录下过度拆分，保持模型设置区域的代码边界更直接。

### 2026-05-21 10:08

- 涉及范围：`CHANGELOG.md`
- 变更摘要：将 changelog 从逐行审计格式改为简洁摘要格式。
- 修改原因：用户明确要求不需要事事记录，只需要总结改了什么。

### 2026-05-21 10:07

- 涉及范围：`src/renderer/assets/styles.css`、`src/renderer/pages/Chat/chat.css`
- 变更摘要：补齐样式拆分后遗漏的 `sidebar-section`、`custom-scrollbar` 和 `chat-message__content` 样式。
- 修改原因：修复样式拆分后部分 class 无对应 CSS 导致的布局或显示异常。

### 2026-05-21 10:06

- 涉及范围：`src/renderer/main.tsx`、`src/renderer/pages/Main/main.css`
- 变更摘要：调整基础样式导入顺序，并补回主页初始化按钮的主体样式。
- 修改原因：修复样式拆分后主页按钮和基础样式加载顺序引起的视觉错乱。

### 2026-05-21 09:58

- 涉及范围：`src/renderer/assets/styles.css`、`src/renderer/pages/Main`、`src/renderer/pages/Chat`、`src/renderer/pages/Settings`、`src/renderer/pages/Workspace`
- 变更摘要：把具体页面样式从全局样式中拆到各页面目录，保留全局样式作为基础设计系统和应用壳层样式。
- 修改原因：降低全局样式复杂度，让页面级样式归属更清晰。

### 2026-05-21 09:52

- 涉及范围：`src/renderer/pages/Settings`
- 变更摘要：将 settings 的模型区域拆分为独立组件，并把 model/provider 相关样式迁移到 Settings 页面目录。
- 修改原因：减少 `SettingsPage` 复杂度，便于继续维护模型列表、provider 详情和滚动条样式。

### 2026-05-21 09:44

- 涉及范围：Settings provider/model 列表样式
- 变更摘要：为 settings 下的 provider 和 model list 添加局部圆角滚动条样式。
- 修改原因：让设置页滚动条符合当前 UI 的圆角、窄条设计。

### 2026-05-20 至 2026-05-21

- 涉及范围：应用壳层、设置页、主页面、Electron 主进程、依赖配置
- 变更摘要：持续调整应用圆角化、黑灰主题、AppRail、TopBar、settings 页面布局、OpenAI/AI SDK 依赖和后端沙盒相关代码。
- 修改原因：推进 Solace 桌面应用的视觉统一、模型配置能力和 agent 运行安全边界。
