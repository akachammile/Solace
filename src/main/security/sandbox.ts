import path from 'node:path'
import { homedir, tmpdir } from 'node:os'
import type { AgentConfig, SandboxPolicy, PermissionRequest } from '@shared/types/acp'

const DEFAULT_ALLOWED_COMMANDS = [
  'node',
  'npm',
  'npx',
  'pnpm',
  'yarn',
  'bun',
  'claude',
  'codex',
  'gemini',
  'opencode',
  'qwen',
  'uv',
  'python',
  'python3',
]

const DEFAULT_DENIED_COMMANDS = [
  'bash',
  'cmd',
  'cscript',
  'powershell',
  'pwsh',
  'reg',
  'sh',
  'wscript',
]

const SAFE_ENV_KEYS = [
  'APPDATA',
  'HOME',
  'LOCALAPPDATA',
  'NUMBER_OF_PROCESSORS',
  'OS',
  'PATH',
  'PATHEXT',
  'PROCESSOR_ARCHITECTURE',
  'ProgramData',
  'ProgramFiles',
  'ProgramFiles(x86)',
  'SystemDrive',
  'SystemRoot',
  'TEMP',
  'TMP',
  'USERDOMAIN',
  'USERNAME',
  'USERPROFILE',
  'windir',
]

const PATH_FIELD_PATTERN = /(^|_)(cwd|dir|directory|file|filename|path|root|source|target|workspace)(_|$)/i

export class SandboxViolationError extends Error {
  readonly code = 'SANDBOX_VIOLATION'

  constructor(message: string) {
    super(message)
    this.name = 'SandboxViolationError'
  }
}

export interface AgentSandboxScope {
  enabled: boolean
  command: string
  args: string[]
  cwd: string
  roots: string[]
  env: NodeJS.ProcessEnv
  maxPromptLength: number
  config: AgentConfig
}

export function createAgentSandbox(config: AgentConfig): AgentSandboxScope {
  const cwd = resolveUserPath(config.cwd || process.cwd())
  const policy = normalizePolicy(config.sandbox, cwd)

  if (!policy.enabled) {
    return {
      enabled: false,
      command: config.command,
      args: config.args,
      cwd,
      roots: policy.allowedRoots,
      env: {
        ...process.env,
        ...(policy.env ?? {}),
      },
      maxPromptLength: policy.maxPromptLength,
      config: {
        ...config,
        cwd,
        sandbox: policy,
      },
    }
  }

  assertCommandAllowed(config.command, policy)
  assertPathInsideRoots(cwd, policy.allowedRoots, 'Agent working directory')

  return {
    enabled: true,
    command: config.command,
    args: config.args,
    cwd,
    roots: policy.allowedRoots,
    env: createSandboxEnv(policy),
    maxPromptLength: policy.maxPromptLength,
    config: {
      ...config,
      cwd,
      sandbox: policy,
    },
  }
}

export function resolveSandboxCwd(cwd: string, sandbox: AgentSandboxScope) {
  const resolvedCwd = resolveUserPath(cwd)
  if (sandbox.enabled) {
    assertPathInsideRoots(resolvedCwd, sandbox.roots, 'Session working directory')
  }
  return resolvedCwd
}

export function assertPromptAllowed(promptText: string, sandbox: AgentSandboxScope) {
  if (!sandbox.enabled) return
  if (promptText.length > sandbox.maxPromptLength) {
    throw new SandboxViolationError(`Prompt exceeds sandbox limit of ${sandbox.maxPromptLength} characters`)
  }
}

export function assertPermissionAllowed(request: PermissionRequest, sandbox: AgentSandboxScope, sessionCwd?: string) {
  if (!sandbox.enabled) return

  const candidatePaths = collectPathValues(request.toolInput)
  for (const candidate of candidatePaths) {
    const resolvedPath = path.isAbsolute(candidate)
      ? resolveUserPath(candidate)
      : path.resolve(sessionCwd ?? sandbox.cwd, candidate)
    assertPathInsideRoots(resolvedPath, sandbox.roots, `Permission path "${candidate}"`)
  }
}

function normalizePolicy(policy: SandboxPolicy | undefined, cwd: string): Required<SandboxPolicy> {
  const enabled = policy?.enabled ?? true
  const allowedRoots = policy?.allowedRoots?.length
    ? policy.allowedRoots.map(resolveUserPath)
    : [cwd]

  return {
    enabled,
    allowedRoots,
    allowedCommands: policy?.allowedCommands?.length ? policy.allowedCommands : DEFAULT_ALLOWED_COMMANDS,
    deniedCommands: policy?.deniedCommands?.length ? policy.deniedCommands : DEFAULT_DENIED_COMMANDS,
    inheritEnv: policy?.inheritEnv ?? false,
    env: policy?.env ?? {},
    maxPromptLength: policy?.maxPromptLength ?? 200_000,
  }
}

function assertCommandAllowed(command: string, policy: Required<SandboxPolicy>) {
  const commandName = normalizeCommandName(command)
  const deniedCommands = new Set(policy.deniedCommands.map(normalizeCommandName))
  if (deniedCommands.has(commandName)) {
    throw new SandboxViolationError(`Command "${commandName}" is denied by sandbox policy`)
  }

  const allowedCommands = new Set(policy.allowedCommands.map(normalizeCommandName))
  if (!allowedCommands.has(commandName)) {
    throw new SandboxViolationError(`Command "${commandName}" is not allowed by sandbox policy`)
  }
}

function normalizeCommandName(command: string) {
  const normalized = command.trim()
  if (!normalized) {
    throw new SandboxViolationError('Agent command is required')
  }
  if (normalized.includes('\0') || /[\r\n]/.test(normalized)) {
    throw new SandboxViolationError('Agent command contains invalid characters')
  }

  const baseName = path.basename(normalized).toLowerCase()
  return baseName.replace(/\.(cmd|com|exe|ps1)$/i, '')
}

function createSandboxEnv(policy: Required<SandboxPolicy>): NodeJS.ProcessEnv {
  if (policy.inheritEnv) {
    return {
      ...process.env,
      ...policy.env,
      SOLACE_SANDBOX: '1',
    }
  }

  const env: NodeJS.ProcessEnv = {}
  for (const key of SAFE_ENV_KEYS) {
    const value = process.env[key]
    if (value !== undefined) {
      env[key] = value
    }
  }

  return {
    ...env,
    ...policy.env,
    SOLACE_SANDBOX: '1',
    SOLACE_SANDBOX_ROOTS: policy.allowedRoots.join(path.delimiter),
  }
}

function collectPathValues(value: unknown, fieldName = ''): string[] {
  if (typeof value === 'string') {
    return PATH_FIELD_PATTERN.test(fieldName) && value.trim() ? [value] : []
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => collectPathValues(item, fieldName))
  }

  if (typeof value !== 'object' || value === null) {
    return []
  }

  return Object.entries(value).flatMap(([key, child]) => collectPathValues(child, key))
}

function assertPathInsideRoots(targetPath: string, roots: string[], label: string) {
  if (roots.some((root) => isPathInsideRoot(targetPath, root))) {
    return
  }

  throw new SandboxViolationError(`${label} is outside the sandbox roots`)
}

function isPathInsideRoot(targetPath: string, root: string) {
  const normalizedRoot = normalizeForCompare(root)
  const normalizedTarget = normalizeForCompare(targetPath)
  const relative = path.relative(normalizedRoot, normalizedTarget)
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative))
}

function normalizeForCompare(value: string) {
  const resolved = path.resolve(value)
  return process.platform === 'win32' ? resolved.toLowerCase() : resolved
}

function resolveUserPath(value: string) {
  const expanded = value.startsWith('~')
    ? path.join(homedir(), value.slice(1).replace(/^[/\\]/, ''))
    : value
  return path.resolve(expanded || tmpdir())
}
