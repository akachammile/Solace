export function minimizeWindow(): Promise<void> {
  return window.solace.window.minimize()
}

export function toggleMaximizeWindow(): Promise<void> {
  return window.solace.window.toggleMaximize()
}

export function toggleDimOverlay(): Promise<void> {
  return window.solace.window.toggleDimOverlay()
}

export function closeWindow(): Promise<void> {
  return window.solace.window.close()
}
