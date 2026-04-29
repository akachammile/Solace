import { Plus, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { TwoTierLayout } from '../../components/TwoTierLayout'
import './scale.css'

const scaleItems = [
  { id: '1', name: 'Likert 5-Point Scale' },
  { id: '2', name: 'Binary Rating (Yes/No)' },
  { id: '3', name: 'Semantic Differential' },
  { id: '4', name: 'Guttman Scale' },
  { id: '5', name: 'NPS (Net Promoter Score)' },
]

export function ScaleView() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = scaleItems.find((s) => s.id === selectedId)

  return (
    <TwoTierLayout
      sidebar={
        <>
          <div className="two-tier-sidebar-header">
            <button className="two-tier-action-btn" type="button">
              <Plus size={16} />
              <span>New Scale</span>
            </button>
          </div>
          <div className="two-tier-list">
            {scaleItems.map((item) => (
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
        <div className="scale-detail">
          <h2>{selected.name}</h2>
          <p>Scale configuration will go here.</p>
        </div>
      ) : undefined}
      emptyState={<><Sparkles size={20} /><span>Select a scale</span></>}
    />
  )
}
