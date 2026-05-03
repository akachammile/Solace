import { X } from 'lucide-react'
import type { PermissionRequest } from '@shared/types/acp'

interface PermissionDialogProps {
  request: PermissionRequest | null
  onAllow: (requestId: string) => void
  onDeny: (requestId: string) => void
}

export function PermissionDialog({ request, onAllow, onDeny }: PermissionDialogProps) {
  if (!request) return null

  return (
    <div className="permission-overlay">
      <div className="permission-dialog">
        <div className="permission-dialog__header">
          <h3>Permission Required</h3>
          <button className="permission-dialog__close" onClick={() => onDeny(request.requestId)} type="button">
            <X size={16} />
          </button>
        </div>
        <p className="permission-dialog__tool">
          Agent wants to run <strong>{request.toolName}</strong>
        </p>
        {Object.keys(request.toolInput).length > 0 && (
          <pre className="permission-dialog__input">
            {JSON.stringify(request.toolInput, null, 2)}
          </pre>
        )}
        <div className="permission-dialog__actions">
          <button
            className="permission-dialog__deny"
            onClick={() => onDeny(request.requestId)}
            type="button"
          >
            Deny
          </button>
          <button
            className="permission-dialog__allow"
            onClick={() => onAllow(request.requestId)}
            type="button"
          >
            Allow
          </button>
        </div>
      </div>
    </div>
  )
}
