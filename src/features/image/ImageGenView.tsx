import { Plus, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { TwoTierLayout } from '../../components/TwoTierLayout'
import './image-gen.css'

const imageItems = [
  { id: '1', name: 'Cinematic landscape' },
  { id: '2', name: 'Abstract minimalism' },
  { id: '3', name: 'Character concept' },
  { id: '4', name: 'Product photography' },
  { id: '5', name: 'Pixel art sprite' },
]

export function ImageGenView() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = imageItems.find((s) => s.id === selectedId)

  return (
    <TwoTierLayout
      sidebar={
        <>
          <div className="two-tier-sidebar-header">
            <button className="two-tier-action-btn" type="button">
              <Plus size={16} />
              <span>New Prompt</span>
            </button>
          </div>
          <div className="two-tier-list">
            {imageItems.map((item) => (
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
        <div className="image-detail">
          <h2>{selected.name}</h2>
          <p>Image generation area will go here.</p>
        </div>
      ) : undefined}
      emptyState={<><Sparkles size={20} /><span>Select or create a prompt</span></>}
    />
  )
}
