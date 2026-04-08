# Solace 实现方案修订稿

## 1. 目标与边界

本次实现聚焦 Renderer 骨架，完成可用的桌面应用壳层与四个一级视图：

- Chat
- Pet
- Knowledge
- Settings

本阶段不接入真实 LLM、不实现知识库索引、不改造 Electron 主进程窗口行为。重点是先把目录、状态边界、视图切换和样式体系搭稳，避免后续接入 IPC 和业务能力时返工。

---

## 2. 设计原则

| 原则 | 落地方式 |
| --- | --- |
| 高内聚 | 以 feature 为单位组织 UI、样式和局部逻辑 |
| 低耦合 | 跨层共享的类型、常量、IPC channel 下沉到 `shared/` |
| 最小可演进 | 当前不用重型状态库，但预留 Context 分层 |
| 状态可保留 | 视图切换后，Chat 会话和设置不应因为组件卸载而丢失 |

---

## 3. 推荐布局

不建议默认采用“56px hover 展开到 200px”的侧栏。更稳的方案是：

- 左侧 `56px` Activity Bar，固定图标导航
- 右侧主内容区 `flex: 1`
- 如后续需要二级导航，再在 Activity Bar 右侧增加可固定展开的 Panel

原因：

- hover 展开容易引发布局抖动
- 键盘导航和可访问性更差
- 桌面端长期使用时误触成本高

当前阶段直接采用两栏结构即可：

```txt
┌──────────────┬─────────────────────────────┐
│ Activity Bar │ Content Area                │
│ 56px         │ Header + View Content       │
└──────────────┴─────────────────────────────┘
```

---

## 4. 目录结构

```txt
electron/
├── main.ts
└── preload.ts

src/
├── main.tsx
├── App.tsx
├── App.css
├── index.css
├── components/
│   └── IconButton.tsx
├── features/
│   ├── navigation/
│   │   ├── ActivityBar.tsx
│   │   └── ActivityBar.css
│   ├── chat/
│   │   ├── ChatView.tsx
│   │   ├── MessageList.tsx
│   │   ├── ChatInput.tsx
│   │   └── chat.css
│   ├── pet/
│   ├── knowledge/
│   └── settings/
├── state/
│   ├── app-context.tsx
│   ├── chat-context.tsx
│   └── settings-context.tsx
└── types/
    └── ui.ts

shared/
├── constants/
│   └── ipc-channels.ts
└── types/
    └── ipc.ts
```

说明：

- `src/` 只放 Renderer 代码
- `shared/` 放跨 `main / preload / renderer` 共用内容
- `features/` 暴露顶层 `*View.tsx`，内部细节不向外泄漏

---

## 5. 状态边界

当前方案需要从一开始就明确 3 类状态：

| 状态 | 存放位置 | 原因 |
| --- | --- | --- |
| `activeView` | `App.tsx` 或 `app-context.tsx` | 全局导航状态 |
| `messages`、会话元数据 | `chat-context.tsx` | 切换视图后仍需保留 |
| 设置项 | `settings-context.tsx` | 后续会被 Chat 与 IPC 消费 |

不建议把 `messages` 只放在 `ChatView.tsx`。如果继续使用条件渲染：

```tsx
{activeView === 'chat' && <ChatView />}
```

那么切走视图时 Chat 会被卸载，本地状态会丢失。桌面应用里这通常不是预期行为。

---

## 6. 组件职责

### `App.tsx`

- 负责整体布局
- 读取 `activeView`
- 根据视图渲染对应 `*View`

### `ActivityBar.tsx`

- 只负责一级导航
- 不承载业务逻辑
- 使用 `data-active` 控制选中态

### `ChatView.tsx`

- 负责拼装 `MessageList` 和 `ChatInput`
- 只消费 chat state，不自己拥有长期消息状态

### `ChatInput.tsx`

- 仅保留输入框临时状态
- 支持 `Enter` 发送、`Shift+Enter` 换行
- 工具按钮状态可先放 chat context，避免后续和发送逻辑脱节

---

## 7. Electron 分层约束

当前阶段不改 `electron/main.ts` 和 `electron/preload.ts`，但后续接入能力时必须遵守：

- Renderer 不直接调用 Node 或 Electron API
- 通过 `preload` 暴露最小必要接口
- IPC channel 名和 payload 类型统一放在 `shared/`

是否所有 LLM 请求都走 `main`，不要现在写死。建议规则如下：

- 纯 UI 请求、无敏感信息时，可由 Renderer 发起
- 涉及 API Key、本地文件、系统权限、流式桥接时，走 `preload -> main`

---

## 8. 样式策略

保留 Design Tokens，但建议把主题定义写得更中性，不要过早锁死“暗紫色”。

最小必备变量：

```css
:root {
  --color-bg: #101215;
  --color-surface: #171a1f;
  --color-border: #2a2f38;
  --color-text: #eef2f7;
  --color-text-muted: #98a2b3;
  --color-accent: #4f8cff;
  --sidebar-width: 56px;
  --content-padding: 24px;
}
```

---

## 9. 实施顺序

### Phase 1: 骨架

1. 清理模板代码，重写 `src/App.tsx`、`src/App.css`、`src/index.css`
2. 新建 `features/navigation`、`features/chat`、`features/pet`、`features/knowledge`、`features/settings`
3. 新建 `state/`，先实现 `app-context`、`chat-context`、`settings-context`
4. 完成占位视图与 Chat 基础交互

### Phase 2: Electron 接入

1. 新建 `shared/constants/ipc-channels.ts`
2. 定义共享 payload 类型
3. 在 `preload.ts` 暴露最小 API
4. 按需在 `main.ts` 增加 IPC handler

### Phase 3: 业务接入

1. 接入 LLM
2. 实现设置持久化
3. 接入知识库索引
4. 完成 Pet 模块设计

---

## 10. 验证标准

### 自动检查

```bash
npm run lint
npm run build
```

### 手动验证

- 4 个一级导航可以切换
- 切到其他视图再返回 Chat，消息仍保留
- 设置修改后不会因为视图切换而丢失
- 窗口缩放时布局不破坏
- 当前版本不依赖 `electron/main.ts` 额外改动也能运行

---

## 11. 待确认事项

1. 是否需要常驻宽侧栏，而不是仅保留 `56px` Activity Bar
2. Knowledge 后续是本地 Markdown 方案还是向量库方案
3. 是否需要 frameless window；若需要，应单独立项处理标题栏和拖拽区
