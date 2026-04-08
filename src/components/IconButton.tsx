import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  icon: ReactNode
  isActive?: boolean
  isCompact?: boolean
}

export function IconButton({
  label,
  icon,
  isActive = false,
  isCompact = false,
  className = '',
  ...props
}: IconButtonProps) {
  const classes = [
    'icon-button',
    isActive ? 'icon-button--active' : '',
    isCompact ? 'icon-button--compact' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button aria-label={label} className={classes} type="button" {...props}>
      <span className="icon-button__icon">{icon}</span>
      {!isCompact && <span className="icon-button__label">{label}</span>}
    </button>
  )
}
