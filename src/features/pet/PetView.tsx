import { HeartHandshake, Sparkles } from 'lucide-react'
import './pet.css'

export function PetView() {
  return (
    <section className="view-shell">
      <header className="view-header">
        <div className="view-header__copy">
          <p className="view-header__eyebrow">Companion</p>
          <h1>Pet Space</h1>
          <p>Reserve this view for a future companion system and emotional feedback loop.</p>
        </div>
        <span className="pet-badge">
          <HeartHandshake size={16} />
          Placeholder
        </span>
      </header>

      <div className="info-grid">
        <article className="info-card pet-hero">
          <Sparkles className="pet-hero__icon" size={28} />
          <h3>Interaction ideas</h3>
          <p>Presence indicator, contextual nudges, lightweight rituals, and progress-based reactions.</p>
        </article>
        <article className="info-card">
          <h4>Emotion layer</h4>
          <p>Map recent conversation energy to subtle visual feedback instead of chat spam.</p>
        </article>
        <article className="info-card">
          <h4>Task support</h4>
          <p>Turn the pet into a small planner that reflects streaks, reminders, and recovery state.</p>
        </article>
      </div>
    </section>
  )
}
