import { Plus, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TwoTierLayout } from '@/components/TwoTierLayout'
import './pet.css'

const petItems = [
  { id: '1' },
  { id: '2' },
  { id: '3' },
  { id: '4' },
  { id: '5' },
]

export function PetView() {
  const { t } = useTranslation()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = petItems.find((s) => s.id === selectedId)

  return (
    <TwoTierLayout
      sidebar={
        <>
          <div className="two-tier-sidebar-header">
            <button className="two-tier-action-btn" type="button">
              <Plus size={16} />
              <span>{t('pet.newCompanion')}</span>
            </button>
          </div>
          <div className="two-tier-list">
            {petItems.map((item) => (
              <div
                key={item.id}
                className={`two-tier-capsule ${selectedId === item.id ? 'two-tier-capsule--active' : ''}`}
              >
                <button
                  className="two-tier-capsule__label"
                  onClick={() => setSelectedId(item.id)}
                  type="button"
                >
                  <span className="two-tier-capsule__title">{t(`pet.items.${item.id}`)}</span>
                </button>
              </div>
            ))}
          </div>
        </>
      }
      detail={selected ? (
        <div className="pet-detail">
          <h2>{t(`pet.items.${selected.id}`)}</h2>
          <p>{t('pet.configDesc')}</p>
        </div>
      ) : undefined}
      emptyState={<><Sparkles size={20} /><span>{t('pet.selectCompanion')}</span></>}
    />
  )
}
