import { type KeyboardEvent, type ReactNode, useEffect, useRef } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Check, X } from 'lucide-react'
import type { PackageStatus } from '../types'
import brandLogo from '../../logo brodpaq.png'

export function BrandLogo({ inverse = false }: { inverse?: boolean }) {
  return (
    <div className={`brand-logo ${inverse ? 'brand-logo--inverse' : ''}`}>
      <img src={brandLogo} alt="BrodPaq Courier" />
    </div>
  )
}

const statusTone: Record<PackageStatus, string> = {
  Prealertado: 'info',
  'Recibido en USA': 'purple',
  Contenerizado: 'purple',
  Embarcado: 'info',
  'En tránsito a RD': 'info',
  'Recibido en RD': 'success',
  'En transferencia': 'warning',
  'Disponible para retiro': 'success',
  'Solicitado a domicilio': 'warning',
  Entregado: 'neutral',
  'Con incidencia': 'danger',
}

export function StatusBadge({ status }: { status: PackageStatus }) {
  return <span className={`status status--${statusTone[status]}`}><i />{status}</span>
}

export function MetricCard({ icon: Icon, label, value, detail, tone = 'blue' }: { icon: LucideIcon; label: string; value: string; detail: string; tone?: string }) {
  return (
    <article className="metric-card">
      <div className={`metric-icon metric-icon--${tone}`}><Icon size={20} aria-hidden="true" /></div>
      <div className="metric-copy"><span>{label}</span><strong>{value}</strong><small>{detail}</small></div>
    </article>
  )
}

export function PageHeading({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description?: string; actions?: ReactNode }) {
  return (
    <header className="page-heading">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </header>
  )
}

export function Modal({ title, children, onClose, size = 'md' }: { title: string; children: ReactNode; onClose: () => void; size?: 'md' | 'lg' }) {
  const modalRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null
    modalRef.current?.querySelector<HTMLElement>('button, input, select, textarea')?.focus()
    return () => previousFocus?.focus()
  }, [])

  const trapFocus = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape') {
      onClose()
      return
    }
    if (event.key !== 'Tab') return
    const focusable = Array.from(modalRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])') ?? [])
    if (!focusable.length) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section ref={modalRef} className={`modal modal--${size}`} role="dialog" aria-modal="true" aria-labelledby="modal-title" onKeyDown={trapFocus} onMouseDown={(event) => event.stopPropagation()}>
        <header><div><span className="eyebrow">BrodPaq Courier</span><h2 id="modal-title">{title}</h2></div><button className="icon-btn" onClick={onClose} aria-label="Cerrar"><X size={20} /></button></header>
        {children}
      </section>
    </div>
  )
}

export function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="toast" role="status" aria-atomic="true">
      <span><Check size={17} /></span><div><strong>Acción completada</strong><p>{message}</p></div>
      <button onClick={onClose} aria-label="Cerrar notificación"><X size={16} /></button>
    </div>
  )
}

export function EmptyState({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return <div className="empty-state"><span><Icon size={24} /></span><strong>{title}</strong><p>{text}</p></div>
}
