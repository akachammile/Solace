import { DatabaseZap, FolderOpen } from 'lucide-react'
import './knowledge.css'

export function KnowledgeView() {
  return (
    <section className="view-shell">
      <header className="view-header">
        <div className="view-header__copy">
          <p className="view-header__eyebrow">Knowledge</p>
          <h1>Knowledge Base</h1>
          <p>Stage the ingestion pipeline here before wiring local files, embeddings, or search.</p>
        </div>
        <span className="knowledge-badge">
          <DatabaseZap size={16} />
          Local-first
        </span>
      </header>

      <div className="info-grid">
        <article className="info-card knowledge-card">
          <FolderOpen className="knowledge-card__icon" size={28} />
          <h3>Source folders</h3>
          <p>Start with Markdown or text folders, then expand to richer ingestion when the UX proves out.</p>
        </article>
        <article className="info-card">
          <h4>Index strategy</h4>
          <p>Keep metadata and indexing decisions in the main process once file access becomes necessary.</p>
        </article>
        <article className="info-card">
          <h4>Retrieval mode</h4>
          <p>Defer vector database decisions until the local file workflow and note volume are clear.</p>
        </article>
      </div>
    </section>
  )
}
