import type { ArtifactConfig } from '../types'

interface AdaptiveCanvasProps {
  artifact: ArtifactConfig
}

export function AdaptiveCanvas({ artifact }: AdaptiveCanvasProps) {
  return (
    <section className="bc-canvas-shell">
      <div className="bc-canvas-card">
        {artifact.type === 'md' && (
          <article className="bc-canvas-document">
            {artifact.content ? (
              artifact.content.split('\n').map((line) => <p key={line}>{line}</p>)
            ) : (
              <p className="bc-canvas-placeholder">一张白纸。输入内容，或者在右侧查看我的行动建议。</p>
            )}
          </article>
        )}

        {artifact.type === 'canvas' && (
          <div className="bc-canvas-map">
            {artifact.content.split(' -> ').map((node, index) => (
              <div className="bc-canvas-node" key={node}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{node}</strong>
              </div>
            ))}
          </div>
        )}

        {artifact.type === 'slides' && (
          <div className="bc-canvas-slides">
            {artifact.content.split(' / ').map((slide, index) => (
              <div className="bc-slide-card" key={slide}>
                <span>Slide {index + 1}</span>
                <strong>{slide}</strong>
              </div>
            ))}
          </div>
        )}

        {artifact.type === 'code' && (
          <pre className="bc-canvas-code">
            <code>{artifact.content}</code>
          </pre>
        )}
      </div>
    </section>
  )
}
