import { app } from 'electron'
import fs from 'node:fs'
import path from 'node:path'
import initSqlJs from 'sql.js'
import type { BuiltinAgentId, AgentMessageRole } from '@shared/types/agent'
import type {
  DatabaseInfo,
  StoredChatMessage,
  StoredConversation,
  StoredSwarmMessage,
} from '@shared/types/storage'
import type { SwarmMessageVisibility, SwarmMessageKind, SwarmMessageSendRequest } from '@shared/types/agent'

type SqlDatabase = initSqlJs.Database

interface StoredMessage {
  id: string
  conversationId: string
  role: 'user' | 'assistant'
  content: string
  agentId?: string
  status?: 'streaming' | 'complete' | 'error'
}

class SolaceDatabase {
  private db: SqlDatabase | null = null
  private initPromise: Promise<SqlDatabase> | null = null

  async init(): Promise<SqlDatabase> {
    if (this.db) return this.db
    if (this.initPromise) return this.initPromise

    this.initPromise = this.open()
    this.db = await this.initPromise
    return this.db
  }

  async ensureConversation(conversationId: string) {
    const db = await this.init()
    const now = Date.now()

    db.run(
      `INSERT INTO conversations (id, title, created_at, updated_at)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         updated_at = excluded.updated_at`,
      [conversationId, 'Untitled conversation', now, now],
    )

    this.persist()
  }

  async upsertMessage(message: StoredMessage) {
    const db = await this.init()
    const now = Date.now()

    db.run(
      `INSERT INTO messages (id, conversation_id, role, agent_id, content, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         content = excluded.content,
         status = excluded.status,
         updated_at = excluded.updated_at`,
      [
        message.id,
        message.conversationId,
        message.role,
        message.agentId ?? null,
        message.content,
        message.status ?? 'complete',
        now,
        now,
      ],
    )

    db.run(
      'UPDATE conversations SET updated_at = ? WHERE id = ?',
      [now, message.conversationId],
    )

    this.persist()
  }

  async getInfo(): Promise<DatabaseInfo> {
    await this.init()

    return {
      path: this.getDbPath(),
      initialized: true,
    }
  }

  async listConversations(): Promise<StoredConversation[]> {
    const db = await this.init()
    const result = db.exec(`
      SELECT
        conversations.id,
        conversations.title,
        conversations.created_at,
        conversations.updated_at,
        COUNT(messages.id) AS message_count
      FROM conversations
      LEFT JOIN messages ON messages.conversation_id = conversations.id
      GROUP BY conversations.id
      ORDER BY conversations.updated_at DESC
    `)

    return (result[0]?.values ?? []).map((row) => ({
      id: String(row[0]),
      title: String(row[1]),
      createdAt: Number(row[2]),
      updatedAt: Number(row[3]),
      messageCount: Number(row[4]),
    }))
  }

  async listMessages(conversationId: string): Promise<StoredChatMessage[]> {
    const db = await this.init()
    const statement = db.prepare(`
      SELECT id, conversation_id, role, agent_id, content, status, created_at, updated_at
      FROM messages
      WHERE conversation_id = ?
      ORDER BY created_at ASC
    `)
    const rows: StoredChatMessage[] = []

    try {
      statement.bind([conversationId])
      while (statement.step()) {
        const row = statement.get()
        rows.push({
          id: String(row[0]),
          conversationId: String(row[1]),
          role: row[2] as AgentMessageRole,
          agentId: row[3] ? row[3] as BuiltinAgentId : undefined,
          content: String(row[4]),
          status: row[5] as StoredChatMessage['status'],
          createdAt: Number(row[6]),
          updatedAt: Number(row[7]),
        })
      }
    } finally {
      statement.free()
    }

    return rows
  }

  async saveSwarmMessage(message: SwarmMessageSendRequest): Promise<StoredSwarmMessage> {
    const db = await this.init()
    const now = Date.now()
    const id = `swarm-${Date.now()}-${Math.random().toString(16).slice(2)}`

    db.run(
      `INSERT INTO swarm_messages (
        id, conversation_id, thread_id, from_agent_id, to_agent_id, kind, visibility, content, context, created_at, updated_at
      )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        message.conversationId,
        message.threadId,
        message.fromAgentId,
        message.toAgentId ?? null,
        message.kind,
        message.visibility,
        message.content,
        message.context ?? null,
        now,
        now,
      ],
    )

    this.persist()

    return {
      id,
      conversationId: message.conversationId,
      threadId: message.threadId,
      fromAgentId: message.fromAgentId,
      toAgentId: message.toAgentId,
      kind: message.kind,
      visibility: message.visibility,
      content: message.content,
      context: message.context,
      createdAt: now,
      updatedAt: now,
    }
  }

  async listSwarmMessages(conversationId: string): Promise<StoredSwarmMessage[]> {
    const db = await this.init()
    const statement = db.prepare(`
      SELECT
        id, conversation_id, thread_id, from_agent_id, to_agent_id, kind, visibility, content, context, created_at, updated_at
      FROM swarm_messages
      WHERE conversation_id = ?
      ORDER BY created_at ASC
    `)
    const rows: StoredSwarmMessage[] = []

    try {
      statement.bind([conversationId])
      while (statement.step()) {
        const row = statement.get()
        rows.push({
          id: String(row[0]),
          conversationId: String(row[1]),
          threadId: String(row[2]),
          fromAgentId: row[3] as BuiltinAgentId,
          toAgentId: row[4] ? row[4] as BuiltinAgentId : undefined,
          kind: row[5] as SwarmMessageKind,
          visibility: row[6] as SwarmMessageVisibility,
          content: String(row[7]),
          context: row[8] ? String(row[8]) : undefined,
          createdAt: Number(row[9]),
          updatedAt: Number(row[10]),
        })
      }
    } finally {
      statement.free()
    }

    return rows
  }

  async deleteConversation(conversationId: string) {
    const db = await this.init()
    db.run('DELETE FROM conversations WHERE id = ?', [conversationId])
    this.persist()
  }

  private async open(): Promise<SqlDatabase> {
    const SQL = await initSqlJs({
      locateFile: (file) => this.resolveWasmPath(file),
    })

    const dbPath = this.getDbPath()
    const existing = fs.existsSync(dbPath) ? fs.readFileSync(dbPath) : undefined
    const db = new SQL.Database(existing)

    db.run('PRAGMA foreign_keys = ON')
    db.run('PRAGMA journal_mode = WAL')
    db.run(SCHEMA_SQL)
    fs.mkdirSync(path.dirname(dbPath), { recursive: true })
    fs.writeFileSync(dbPath, Buffer.from(db.export()))

    return db
  }

  private persist() {
    if (!this.db) return
    fs.writeFileSync(this.getDbPath(), Buffer.from(this.db.export()))
  }

  getDbPath() {
    return path.join(app.getPath('userData'), 'solace.sqlite')
  }

  private resolveWasmPath(file: string) {
    if (app.isPackaged) {
      return path.join(process.resourcesPath, file)
    }

    return path.join(process.env.APP_ROOT ?? process.cwd(), 'node_modules', 'sql.js', 'dist', file)
  }
}

  const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  agent_id TEXT,
  content TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'complete' CHECK (status IN ('streaming', 'complete', 'error')),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_created
ON messages(conversation_id, created_at);

CREATE TABLE IF NOT EXISTS swarm_messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  thread_id TEXT NOT NULL,
  from_agent_id TEXT NOT NULL,
  to_agent_id TEXT,
  kind TEXT NOT NULL CHECK (kind IN ('chat', 'note', 'handoff')),
  visibility TEXT NOT NULL CHECK (visibility IN ('public', 'internal')),
  content TEXT NOT NULL DEFAULT '',
  context TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_swarm_messages_conversation_created
ON swarm_messages(conversation_id, created_at);

CREATE INDEX IF NOT EXISTS idx_swarm_messages_thread_created
ON swarm_messages(thread_id, created_at);
`

export const solaceDatabase = new SolaceDatabase()
