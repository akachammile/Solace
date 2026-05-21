import { useTranslation } from 'react-i18next'
import type { ArtifactConfig } from './types'

interface AdaptiveCanvasProps {
  artifact: ArtifactConfig
}

export function AdaptiveCanvas({ artifact }: AdaptiveCanvasProps) {
  const { t } = useTranslation()

  return (
    <section className="editor-canvas-shell">
      <div className="editor-canvas-card">
        {artifact.type === 'md' && (
          <article className="editor-canvas-document">
            {artifact.content ? (
              artifact.content.split('\n').map((line) => <p key={line}>{line}</p>)
            ) : (
              <p className="editor-canvas-placeholder">{t('editor.blankCanvasHint')}</p>
            )}
          </article>
        )}

        {artifact.type === 'canvas' && (
          <div className="editor-canvas-map">
            {artifact.content.split(' -> ').map((node, index) => (
              <div className="editor-canvas-node" key={node}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{node}</strong>
              </div>
            ))}
          </div>
        )}

        {artifact.type === 'slides' && (
          <div className="editor-canvas-slides">
            {artifact.content.split(' / ').map((slide, index) => (
              <div className="editor-slide-card" key={slide}>
                <span>{t('editor.slide', { number: index + 1 })}</span>
                <strong>{slide}</strong>
              </div>
            ))}
          </div>
        )}

        {artifact.type === 'code' && (
          <pre className="editor-canvas-code">
            <code>{artifact.content}</code>
          </pre>
        )}
      </div>
    </section>
  )
}
