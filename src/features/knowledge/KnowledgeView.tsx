import { Plus, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { TwoTierLayout } from '../../components/TwoTierLayout'
import './knowledge.css'

const knowledgeItems = [
  { id: '1', name: 'Project notes' },
  { id: '2', name: 'API documentation' },
  { id: '3', name: 'Meeting summaries' },
  { id: '4', name: 'Research papers' },
  { id: '5', name: 'Code snippets' },
]

export function KnowledgeView() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = knowledgeItems.find((s) => s.id === selectedId)

  return (
    <TwoTierLayout
      sidebar={
        <>
          <div className="two-tier-sidebar-header">
            <button className="two-tier-action-btn" type="button">
              <Plus size={16} />
              <span>Add Source</span>
            </button>
          </div>
          <div className="two-tier-list">
            {knowledgeItems.map((item) => (
              <div
                key={item.id}
                className={`two-tier-capsule ${selectedId === item.id ? 'two-tier-capsule--active' : ''}`}
              >
                <button
                  className="two-tier-capsule__label"
                  onClick={() => setSelectedId(item.id)}
                  type="button"
                >
                  <span className="two-tier-capsule__title">{item.name}</span>
                </button>
              </div>
            ))}
          </div>
        </>
      }
      detail={selected ? (
        <div className="knowledge-detail">
          <h2>{selected.name}</h2>
          <p>Document preview will go here.</p>
        </div>
      ) : undefined}
      emptyState={<><Sparkles size={20} /><span>Select a document</span></>}
    />
  )
}
