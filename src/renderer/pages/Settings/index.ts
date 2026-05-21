import styled from 'styled-components'

export const SettingsRotatingIcon = styled.div`
  display: grid;
  place-items: center;
  animation: settings-spin 1s linear infinite;

  @keyframes settings-spin {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }
`

export const SettingsOverlayBackdrop = styled.div`
  position: absolute;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: clamp(12px, 4vh, 52px) clamp(16px, 5vw, 72px);
  background: rgba(15, 23, 42, 0.28);
  backdrop-filter: blur(8px);

  @media (max-height: 640px) {
    padding: 12px 16px;
  }

  @media (max-width: 860px) {
    padding: 16px;
  }

  @media (max-width: 760px) {
    padding: 8px;
  }
`

export const SettingsOverlayContainer = styled.div`
  position: relative;
  display: flex;
  width: clamp(760px, 84vw, 1040px);
  max-width: calc(100vw - 32px);
  height: clamp(440px, 76vh, 640px);
  max-height: calc(100vh - 32px);
  min-height: 0;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 0;
  background: color-mix(in srgb, var(--color-bg-elevated) 94%, transparent);
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.16);

  svg {
    width: var(--settings-icon-size);
    height: var(--settings-icon-size);
  }

  @media (max-height: 640px) {
    height: clamp(400px, 72vh, 500px);
    max-height: calc(100vh - 24px);
  }

  @media (max-width: 1180px) {
    width: min(960px, calc(100vw - 32px));
  }

  @media (max-width: 920px) {
    height: clamp(420px, 78vh, 600px);
  }

  @media (max-width: 720px) {
    max-width: calc(100vw - 16px);
    max-height: calc(100vh - 16px);
  }

  @media (max-height: 620px) {
    height: min(500px, calc(100vh - 18px));
    max-height: calc(100vh - 18px);
  }
`

export const SettingsWindowControls = styled.div`
  position: absolute;
  z-index: 20;
  right: 0;
  top: 0;
  display: flex;
  height: 34px;
  align-items: stretch;
  gap: 0;
  -webkit-app-region: no-drag;
`

const SettingsTrafficButton = styled.div`
  position: relative;
  display: grid;
  width: 42px;
  height: 100%;
  flex-shrink: 0;
  place-items: center;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  color: var(--color-text-muted);
  transition: color var(--transition-fast), background var(--transition-fast);
`

export const SettingsCloseTrafficButton = styled(SettingsTrafficButton)`
  cursor: pointer;

  &::before,
  &::after {
    position: absolute;
    width: 12px;
    height: 1px;
    background: currentColor;
    content: "";
  }

  &::before {
    transform: rotate(45deg);
  }

  &::after {
    transform: rotate(-45deg);
  }

  &:hover {
    background: #c42b1c;
    color: #ffffff;
  }
`

export const SettingsMinimizeTrafficButton = styled(SettingsTrafficButton)`
  &::before {
    width: 10px;
    height: 1px;
    background: currentColor;
    content: "";
  }

  &:hover {
    background: var(--color-hover-soft);
    color: var(--color-text);
  }
`

export const SettingsZoomTrafficButton = styled(SettingsTrafficButton)`
  &::before {
    width: 10px;
    height: 10px;
    border: 1px solid currentColor;
    content: "";
  }

  &:hover {
    background: var(--color-hover-soft);
    color: var(--color-text);
  }
`

export const SettingsBody = styled.div`
  display: flex;
  min-height: 0;
  flex: 1;
  overflow: hidden;
  font-size: var(--settings-text-sm);
  line-height: 1.35;

  @media (max-width: 760px) {
    flex-direction: column;
  }
`

export const SettingsContent = styled.div`
  position: relative;
  display: flex;
  min-width: 0;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  gap: var(--settings-panel-gap);
  overflow: hidden;
  padding: 12px;
  background: var(--color-bg);
`

export const SettingsSidebarShell = styled.div`
  display: flex;
  width: 168px;
  min-height: 0;
  flex-shrink: 0;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
  border-right: 1px solid var(--color-border);
  background: transparent;
  padding: 40px 8px 12px;

  @media (max-width: 760px) {
    width: 100%;
    flex-direction: row;
    overflow-x: auto;
    overflow-y: hidden;
    border-right: 0;
    border-bottom: 1px solid var(--color-border);
    padding: 12px 8px 8px 80px;
  }
`

export const SettingsSidebarTab = styled.div<{ $active?: boolean }>`
  position: relative;
  display: grid;
  width: 100%;
  min-height: 34px;
  cursor: pointer;
  grid-template-columns: var(--settings-icon-size) minmax(0, 1fr);
  align-items: center;
  gap: var(--chrome-icon-gap);
  border: 1px solid transparent;
  border-radius: 6px;
  background: ${({ $active }) => ($active ? 'color-mix(in srgb, var(--color-hover-soft) 70%, transparent)' : 'transparent')};
  color: ${({ $active }) => ($active ? 'var(--color-primary-text)' : 'var(--color-text-muted)')};
  padding: 0 8px;
  text-align: left;
  transition: all var(--transition-fast);

  &::before {
    position: absolute;
    top: 9px;
    bottom: 9px;
    left: 0;
    width: 2px;
    border-radius: 999px;
    background: ${({ $active }) => ($active ? 'var(--color-primary-text)' : 'transparent')};
    content: "";
  }

  &:hover {
    background: color-mix(in srgb, var(--color-hover-soft) 70%, transparent);
    box-shadow: none;
  }

  @media (max-width: 760px) {
    min-width: 136px;
  }

  @media (max-width: 560px) {
    min-width: 118px;
  }
`

export const SettingsSidebarTabIcon = styled.div`
  display: grid;
  width: var(--settings-icon-size);
  height: var(--settings-icon-size);
  place-items: center;
  border-radius: 6px;
  background: transparent;
  color: inherit;
`

export const SettingsSidebarTabCopy = styled.div<{ $active?: boolean }>`
  display: block;
  min-width: 0;
  overflow: hidden;
  color: ${({ $active }) => ($active ? 'var(--color-primary-text)' : 'var(--color-text)')};
  font-size: var(--settings-text-xs);
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const SettingPanel = styled.div`
  min-height: 0;
  overflow-y: auto;
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-bg-elevated);
  box-shadow: var(--shadow-soft);
`

export const SettingPanelHeader = styled.div`
  margin-bottom: 10px;
`

export const SettingPanelHeaderRow = styled(SettingPanelHeader)`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 760px) {
    flex-direction: column;
  }
`

export const SettingPanelHeaderText = styled.div`
  min-width: 0;
`

export const SettingPageTitle = styled.div`
  margin-top: 2px;
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: 16px;
  font-weight: 600;
  line-height: 1.25;
`

export const SettingPageDescription = styled.div`
  max-width: 520px;
  margin-top: 4px;
  color: var(--color-text-muted);
  font-size: var(--settings-text-xs);
  line-height: 20px;
`

export const SettingSectionGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--settings-panel-gap);
`

export const SettingBlock = styled.div`
  display: grid;
  gap: var(--settings-panel-gap);
  padding: 10px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
`

export const SettingRow = styled.div<{ $active?: boolean }>`
  display: grid;
  width: 100%;
  min-width: 0;
  min-height: 52px;
  grid-template-columns: var(--settings-icon-shell-size) minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--chrome-icon-gap);
  padding: 10px;
  border: 1px solid ${({ $active }) => ($active ? 'transparent' : 'var(--color-border)')};
  border-radius: 8px;
  background: ${({ $active }) => ($active ? 'var(--color-hover-soft)' : 'var(--color-surface)')};
  color: var(--color-text);
  text-align: left;
  transition: background var(--transition-fast), border-color var(--transition-fast), opacity var(--transition-fast);
`

export const SettingStartRow = styled(SettingRow)`
  align-items: start;
`

export const SettingProviderRow = styled(SettingRow)`
  min-height: 40px;
  cursor: pointer;
  grid-template-columns: var(--settings-provider-icon-size) minmax(0, 1fr) 8px;
  border-color: transparent;
  background: ${({ $active }) => ($active ? 'var(--color-hover-soft)' : 'transparent')};
  padding: 6px 8px;

  &:hover,
  &:focus-visible {
    background: var(--color-hover-soft);
  }
`

export const SettingModelRow = styled(SettingRow)`
  position: relative;
  min-height: 46px;
  cursor: pointer;
  grid-template-columns: minmax(0, 1fr) auto;
  border-color: ${({ $active }) => ($active ? 'color-mix(in srgb, var(--color-primary) 24%, var(--color-border))' : 'var(--color-border)')};
  background: ${({ $active }) => ($active ? 'color-mix(in srgb, var(--color-bg-elevated) 72%, var(--color-hover-strong))' : 'var(--color-surface)')};
  padding: 9px 10px;

  &::before {
    position: absolute;
    top: 9px;
    bottom: 9px;
    left: 0;
    width: 2px;
    border-radius: 999px;
    background: ${({ $active }) => ($active ? 'var(--color-primary-text)' : 'transparent')};
    content: "";
  }

  &:hover,
  &:focus-visible {
    border-color: color-mix(in srgb, var(--color-primary) 18%, var(--color-border));
    background: color-mix(in srgb, var(--color-surface) 78%, var(--color-hover-soft));
  }

  & + & {
    margin-top: 6px;
  }
`

export const SettingContent = styled.div`
  display: block;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const SettingMeta = styled.div`
  display: block;
  min-width: 0;
  overflow: hidden;
  color: var(--color-text-dim);
  font-family: var(--font-mono);
  font-size: var(--settings-label-size);
  font-weight: 700;
  letter-spacing: 0.12em;
  text-overflow: ellipsis;
  text-transform: uppercase;
  white-space: nowrap;
`

export const SettingTitle = styled.div`
  display: block;
  min-width: 0;
  overflow: hidden;
  color: var(--color-text);
  font-size: var(--settings-text-sm);
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const SettingHint = styled.div`
  display: block;
  min-width: 0;
  margin-top: 2px;
  overflow: hidden;
  color: var(--color-text-muted);
  font-size: var(--settings-text-xs);
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: normal;
`

export const SettingControl = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
`

export const SettingIconSlot = styled.div`
  display: grid;
  width: var(--settings-icon-shell-size);
  height: var(--settings-icon-shell-size);
  flex-shrink: 0;
  place-items: center;
  border-radius: 8px;
  background: var(--color-primary-container);
  color: var(--color-primary-text);

  svg {
    width: var(--settings-icon-size);
    height: var(--settings-icon-size);
  }
`

export const SettingBadge = styled.div`
  max-width: 150px;
  overflow: hidden;
  padding: 0 8px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface);
  color: var(--color-text-muted);
  font-size: var(--settings-label-size);
  line-height: 18px;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const SettingStatusDot = styled.div<{ $online?: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: ${({ $online }) => ($online ? 'var(--color-primary-text)' : 'var(--color-outline-variant)')};
  box-shadow: ${({ $online }) => ($online ? '0 0 0 4px var(--color-primary-container)' : 'none')};
`

export const SettingActionButton = styled.div`
  display: inline-flex;
  min-height: var(--settings-control-height);
  cursor: pointer;
  align-items: center;
  justify-content: center;
  gap: var(--chrome-icon-gap);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-bg-elevated);
  color: var(--color-text-muted);
  padding: 0 10px;
  font-size: var(--settings-text-sm);
  font-weight: 600;
  transition: all var(--transition-fast);
  -webkit-app-region: no-drag;

  &:hover:not(:disabled) {
    border-color: color-mix(in srgb, var(--color-accent) 30%, var(--color-border));
    color: var(--color-primary-text);
    box-shadow: var(--shadow-soft);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }
`

export const SettingPrimaryButton = styled(SettingActionButton)`
  border-color: var(--color-primary);
  background: var(--color-primary);
  color: var(--color-on-primary);

  &:hover:not(:disabled) {
    color: var(--color-on-primary);
    box-shadow: 0 16px 30px rgba(24, 24, 27, 0.14);
  }
`

export const SettingIconButton = styled.div`
  display: grid;
  width: var(--settings-icon-shell-size);
  height: var(--settings-icon-shell-size);
  flex-shrink: 0;
  cursor: pointer;
  place-items: center;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-bg-elevated);
  color: var(--color-text-muted);
  transition: all var(--transition-fast);
  -webkit-app-region: no-drag;

  &:hover:not(:disabled) {
    border-color: color-mix(in srgb, var(--color-accent) 30%, var(--color-border));
    color: var(--color-primary-text);
    box-shadow: var(--shadow-soft);
  }
`

export const SettingSwitch = styled.div`
  position: relative;
  display: inline-flex;
  width: 36px;
  height: 20px;
  flex-shrink: 0;
  cursor: pointer;
  align-items: center;

  input {
    width: 0;
    height: 0;
    opacity: 0;
  }

  span {
    position: absolute;
    inset: 0;
    border-radius: 999px;
    background: var(--color-outline-variant);
    transition: all var(--transition-fast);
  }

  span::before {
    position: absolute;
    bottom: 3px;
    left: 3px;
    width: 14px;
    height: 14px;
    border-radius: 999px;
    background: #fff;
    box-shadow: 0 2px 6px rgba(15, 23, 42, 0.18);
    content: "";
    transition: all var(--transition-fast);
  }

  input:checked + span {
    background: var(--color-primary);
  }

  input:checked + span::before {
    transform: translateX(16px);
  }
`

export const SettingField = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 6px;

  > span {
    color: var(--color-text-dim);
    font-family: var(--font-mono);
    font-size: var(--settings-label-size);
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  input,
  textarea {
    min-width: 0;
    min-height: var(--settings-control-height);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background: var(--color-bg-elevated);
    color: var(--color-text);
    padding: 0 10px;
    font-family: var(--font-body);
    font-size: var(--settings-text-sm);
    transition: all var(--transition-fast);
  }

  input::placeholder,
  textarea::placeholder {
    color: var(--color-text-dim);
  }

  input:focus,
  textarea:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px var(--color-primary-container);
    outline: none;
  }
`

export const SettingCompactField = styled(SettingField)`
  input {
    min-height: 32px;
    font-size: var(--settings-text-xs);
  }
`

export const SettingFormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--settings-panel-gap);

  @media (max-width: 860px) {
    grid-template-columns: minmax(0, 1fr);
  }
`

export const SettingInlineField = styled.div`
  display: grid;
  min-width: 0;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 8px;
`

export const SettingList = styled.div`
  display: grid;
  gap: var(--settings-panel-gap);
`

export const SettingSkillGrid = styled(SettingList)`
  grid-template-columns: repeat(2, minmax(0, 1fr));

  @media (max-width: 860px) {
    grid-template-columns: minmax(0, 1fr);
  }
`

export const SettingCard = styled.div`
  display: grid;
  gap: var(--settings-panel-gap);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  padding: 10px;
`

export const SettingCardHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--settings-panel-gap);
`

export const SettingEmptyState = styled.div`
  display: grid;
  min-height: 112px;
  place-items: center;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  color: var(--color-text-muted);
  padding: 10px;
  text-align: center;

  svg {
    color: var(--color-primary-text);
  }

  strong {
    margin-top: 8px;
    color: var(--color-text);
    font-size: var(--settings-text-sm);
    font-weight: 600;
  }

  small {
    margin-top: 2px;
    color: var(--color-text-muted);
    font-size: var(--settings-text-xs);
  }
`

export const SettingsModelsPanel = styled.div`
  display: flex;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
  background: transparent;
`

export const SettingsModelsLayout = styled.div`
  position: relative;
  display: grid;
  align-items: stretch;
  min-height: 0;
  flex: 1;
  gap: 0;
  grid-template-columns: minmax(180px, 0.72fr) minmax(0, 1.62fr);

  @media (max-width: 860px) {
    grid-template-columns: minmax(0, 1fr);
  }
`

export const SettingsProviderBrowser = styled.div`
  display: flex;
  height: 100%;
  min-height: 0;
  flex-direction: column;
  overflow: hidden;
  border-right: 1px solid var(--color-border);
  padding-right: 8px;
  background: transparent;

  @media (max-width: 860px) {
    border-right: 0;
    border-bottom: 1px solid var(--color-border);
    padding-right: 0;
    padding-bottom: 8px;
  }
`

export const SettingsProviderBrowserHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--chrome-icon-gap);
  padding: 6px 8px 6px 0;
`

export const SettingsModelSearch = styled.div`
  display: grid;
  width: 100%;
  min-height: var(--settings-control-height);
  grid-template-columns: var(--settings-icon-size) minmax(0, 1fr);
  align-items: center;
  gap: var(--chrome-icon-gap);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-bg-elevated);
  color: var(--color-text-muted);
  padding: 0 8px;
  transition: all var(--transition-fast);

  &:focus-within {
    border-color: color-mix(in srgb, var(--color-primary) 28%, var(--color-border));
    color: var(--color-primary-text);
  }

  input {
    height: 100%;
    min-width: 0;
    border: 0;
    background: transparent;
    color: var(--color-text);
    padding: 0;
    font-size: var(--settings-text-sm);
    outline: none;
  }

  input::-webkit-search-cancel-button {
    -webkit-appearance: none;
  }
`

export const SettingsProviderBrowserList = styled.div`
  display: flex;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  gap: 6px;
  overflow-y: auto;
  padding: 4px 8px 4px 0;
  scrollbar-color: color-mix(in srgb, var(--color-primary) 38%, var(--color-outline)) transparent;
  scrollbar-width: thin;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    border-radius: 999px;
    background: transparent;
    margin-block: 6px;
  }

  &::-webkit-scrollbar-thumb {
    min-height: 28px;
    border: 2px solid transparent;
    border-radius: 999px;
    background: color-mix(in srgb, var(--color-primary) 34%, var(--color-outline));
    background-clip: content-box;
  }

  &::-webkit-scrollbar-thumb:hover {
    border: 2px solid transparent;
    background: color-mix(in srgb, var(--color-primary) 54%, var(--color-outline));
    background-clip: content-box;
  }
`

export const SettingsProviderDetails = styled.div`
  display: flex;
  min-height: 0;
  flex-direction: column;
  gap: 12px;
  overflow: hidden;
  padding: 4px 0 4px 12px;
  background: transparent;

  @media (max-height: 640px) {
    gap: var(--settings-panel-gap);
  }

  @media (max-width: 860px) {
    padding-left: 0;
  }
`

export const SettingsProviderHero = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--settings-panel-gap);
  padding-bottom: 4px;

  @media (max-width: 760px) {
    align-items: flex-start;
  }
`

export const SettingsProviderConfig = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 8px;
`

export const SettingsProviderIdentity = styled.div`
  display: flex;
  min-width: 0;
  align-items: center;
  gap: var(--chrome-icon-gap);

  strong {
    display: block;
    min-width: 0;
    overflow: hidden;
    color: var(--color-text);
    font-size: var(--settings-text-sm);
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

export const SettingsProviderIcon = styled.div`
  display: grid;
  width: var(--settings-provider-icon-size);
  height: var(--settings-provider-icon-size);
  flex-shrink: 0;
  place-items: center;

  img {
    width: var(--settings-provider-icon-size);
    height: var(--settings-provider-icon-size);
  }
`

export const SettingsProviderMonogram = styled(SettingsProviderIcon)`
  border-radius: 8px;
  background: var(--color-primary-container);
  color: var(--color-primary-text);
  font-family: var(--font-mono);
  font-size: var(--settings-label-size);
  font-weight: 700;
`

export const SettingsSecretControl = styled.div`
  display: grid;
  min-width: 0;
  grid-template-columns: minmax(0, 1fr) auto auto;
  align-items: center;
  gap: 4px;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-bg-elevated);
  padding: 4px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);

  &:focus-within {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px var(--color-primary-container);
  }

  input {
    min-height: 32px;
    border: 0;
    background: transparent;
    box-shadow: none;
    padding: 0 8px;
  }

  input:focus {
    box-shadow: none;
  }

  input::placeholder {
    color: var(--color-text-dim);
    font-family: var(--font-body);
    letter-spacing: 0;
  }

  @media (max-width: 760px) {
    grid-template-columns: minmax(0, 1fr);
  }
`

export const SettingsSecretIcon = styled.div`
  display: grid;
  width: calc(var(--settings-icon-shell-size) - 4px);
  height: calc(var(--settings-icon-shell-size) - 4px);
  flex-shrink: 0;
  cursor: pointer;
  place-items: center;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--color-text-muted);
  transition: color var(--transition-fast), background var(--transition-fast);

  &:hover:not(:disabled) {
    background: var(--color-hover-soft);
    color: var(--color-primary-text);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.35;
  }

  @media (max-width: 760px) {
    width: 100%;
  }
`

export const SettingsTestResult = styled.div<{ $ok?: boolean }>`
  display: inline-flex;
  min-height: 28px;
  max-width: 100%;
  align-items: center;
  gap: 6px;
  overflow: hidden;
  border: 1px solid ${({ $ok }) => ($ok ? 'rgba(52, 211, 153, 0.28)' : 'rgba(248, 113, 113, 0.28)')};
  border-radius: 8px;
  background: ${({ $ok }) => ($ok ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)')};
  color: ${({ $ok }) => ($ok ? '#34d399' : '#f87171')};
  padding: 0 8px;
  font-size: var(--settings-text-xs);
  font-weight: 600;
  text-overflow: ellipsis;
`

export const SettingsModelPicker = styled.div`
  display: grid;
  min-height: 0;
  flex: 1;
  gap: 8px;
  grid-template-rows: auto minmax(0, 1fr);
  overflow: hidden;
`

export const SettingsModelPickerHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--chrome-icon-gap);
`

export const SettingsModelListShell = styled.div`
  position: relative;
  min-height: 0;
  overflow: hidden;
`

export const SettingsModelList = styled.div`
  display: grid;
  height: 100%;
  min-height: 0;
  align-content: start;
  gap: 14px;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 2px 14px 64px 0;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
`

export const SettingsModelListScrollbar = styled.div`
  pointer-events: none;
  position: absolute;
  top: 4px;
  right: 0;
  bottom: 4px;
  width: 8px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-outline-variant) 36%, transparent);
`

export const SettingsModelListThumb = styled.div`
  position: absolute;
  left: 50%;
  display: block;
  width: 6px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-primary) 44%, var(--color-outline));
  transition: background var(--transition-fast);
  transform: translateX(-50%);

  ${SettingsModelListShell}:hover & {
    background: color-mix(in srgb, var(--color-primary) 62%, var(--color-outline));
  }
`

export const SettingsModelGroup = styled.div<{ $stackIndex?: number }>`
  position: sticky;
  top: ${({ $stackIndex = 0 }) => `${Math.min($stackIndex, 4) * 8}px`};
  z-index: ${({ $stackIndex = 0 }) => 20 + $stackIndex};
  display: grid;
  max-height: calc(100% - ${({ $stackIndex = 0 }) => `${Math.min($stackIndex, 4) * 8}px`});
  min-height: 0;
  gap: 8px;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--color-border) 82%, transparent);
  border-radius: 10px;
  background: color-mix(in srgb, var(--color-bg-elevated) 88%, var(--color-page-panel));
  padding: 8px;
`

export const SettingsModelGroupLabel = styled.div`
  display: flex;
  min-height: 28px;
  align-items: center;
  gap: var(--chrome-icon-gap);
  padding: 0 2px;
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: var(--settings-text-sm);
  font-weight: 600;
  letter-spacing: 0;
`

export const SettingsModelGroupBody = styled.div`
  display: grid;
  min-height: 0;
  max-height: clamp(148px, 34vh, 236px);
  gap: 6px;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding-right: 2px;
  scrollbar-color: color-mix(in srgb, var(--color-primary) 34%, var(--color-outline)) transparent;
  scrollbar-width: thin;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    border-radius: 999px;
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    min-height: 26px;
    border: 2px solid transparent;
    border-radius: 999px;
    background: color-mix(in srgb, var(--color-primary) 34%, var(--color-outline));
    background-clip: content-box;
  }
`
