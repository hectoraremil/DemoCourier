import { type FormEvent, useEffect, useState } from 'react'
import {
  Bell, Box, CalendarDays, Check, ChevronRight, CircleDollarSign, Clipboard, Copy,
  FileText, Headphones, Home, LogOut, MapPin, Menu, Package, PackageCheck,
  Plus, ReceiptText, Search, Send, ShoppingBag, Truck, UserRound, X,
} from 'lucide-react'
import { BrandLogo, MetricCard, Modal, PageHeading, StatusBadge, Toast } from '../components/Shared'
import { packages, timeline } from '../data'
import type { CourierPackage } from '../types'

type View = 'dashboard' | 'locker' | 'prealert' | 'packages' | 'detail'

const navItems = [
  { id: 'dashboard' as View, label: 'Inicio', icon: Home },
  { id: 'locker' as View, label: 'Mi casillero', icon: Box },
  { id: 'prealert' as View, label: 'Crear prealerta', icon: Plus },
  { id: 'packages' as View, label: 'Mis paquetes', icon: Package },
]

const address = `María Santos / BOX-000001\n7801 NW 37th St, Suite BP-000001\nDoral, FL 33195\nTel: (305) 555-0198`

export default function ClientPortal({ onLogout }: { onLogout: () => void }) {
  const [view, setView] = useState<View>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [modal, setModal] = useState<'invoice' | 'delivery' | null>(null)
  const [deliveryRequested, setDeliveryRequested] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<CourierPackage>(packages[0])
  const myPackages = packages.filter((item) => item.client === 'María Santos')

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 3500)
    return () => window.clearTimeout(timer)
  }, [toast])

  const goTo = (next: View) => {
    setView(next)
    setSidebarOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const copyAddress = async () => {
    try { await navigator.clipboard.writeText(address) } catch { /* clipboard can be blocked in preview */ }
    setToast('Dirección de Miami copiada al portapapeles.')
  }

  const showDetail = (item: CourierPackage) => {
    setSelectedPackage(item)
    goTo('detail')
  }

  return (
    <div className="portal-shell client-shell">
      <aside className={`client-sidebar ${sidebarOpen ? 'is-open' : ''}`}>
        <div className="sidebar-head"><BrandLogo /><button className="icon-btn sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Cerrar menú"><X size={20} /></button></div>
        <div className="client-profile">
          <div className="avatar">MS</div>
          <div><strong>María Santos</strong><span>BOX-000001</span></div>
        </div>
        <nav aria-label="Portal del cliente">
          {navItems.map((item) => {
            const Icon = item.icon
            return <button key={item.id} className={view === item.id ? 'active' : ''} onClick={() => goTo(item.id)}><Icon size={19} /><span>{item.label}</span>{item.id === 'packages' && <b>2</b>}</button>
          })}
        </nav>
        <div className="sidebar-support"><span><Headphones size={18} /></span><strong>¿Necesitas ayuda?</strong><p>Estamos disponibles de 8:00 AM a 6:00 PM.</p><button>Contactar soporte</button></div>
        <button className="logout-btn" onClick={onLogout}><LogOut size={18} /> Cerrar sesión</button>
      </aside>
      {sidebarOpen && <button className="sidebar-scrim" onClick={() => setSidebarOpen(false)} aria-label="Cerrar menú" />}

      <div className="portal-main">
        <header className="client-topbar">
          <button className="icon-btn mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="Abrir menú"><Menu size={21} /></button>
          <div className="topbar-location"><MapPin size={16} /><span>Sucursal preferida</span><strong>Santo Domingo Este</strong></div>
          <div className="topbar-actions"><button className="icon-btn notification-btn" aria-label="Notificaciones"><Bell size={20} /><i /></button><div className="topbar-avatar">MS</div></div>
        </header>

        <main className="client-content">
          {view === 'dashboard' && <ClientDashboard copyAddress={copyAddress} goTo={goTo} showDetail={showDetail} />}
          {view === 'locker' && <LockerView copyAddress={copyAddress} />}
          {view === 'prealert' && <PrealertView onSuccess={() => { setToast('Prealerta registrada. Te avisaremos al recibir el paquete.'); goTo('packages') }} />}
          {view === 'packages' && <PackagesView items={myPackages} showDetail={showDetail} />}
          {view === 'detail' && <PackageDetail item={selectedPackage} deliveryRequested={deliveryRequested} onBack={() => goTo('packages')} onInvoice={() => setModal('invoice')} onDelivery={() => setModal('delivery')} />}
        </main>
      </div>

      {modal === 'invoice' && <InvoiceModal onClose={() => setModal(null)} />}
      {modal === 'delivery' && <DeliveryModal onClose={() => setModal(null)} onSubmit={() => { setModal(null); setDeliveryRequested(true); setToast('Solicitud de domicilio creada para el 16 de octubre.') }} />}
      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  )
}

function ClientDashboard({ copyAddress, goTo, showDetail }: { copyAddress: () => void; goTo: (view: View) => void; showDetail: (item: CourierPackage) => void }) {
  return (
    <>
      <PageHeading eyebrow="Miércoles, 14 de octubre" title="Hola, María" description="Tu paquete está listo. Esto es lo más importante de tu casillero hoy." actions={<button className="btn btn--primary" onClick={() => goTo('prealert')}><Plus size={18} /> Nueva prealerta</button>} />
      <section className="locker-hero">
        <div className="locker-hero__copy"><span className="eyebrow eyebrow--light">Tu dirección en Miami</span><h2>Compra en USA.<br />Nosotros hacemos el resto.</h2><div className="locker-code"><small>Código de casillero</small><strong>BOX-000001</strong></div></div>
        <div className="address-card"><div><MapPin size={21} /><span><strong>María Santos / BOX-000001</strong>7801 NW 37th St, Suite BP-000001<br />Doral, FL 33195 · (305) 555-0198</span></div><button onClick={copyAddress}><Copy size={17} /> Copiar dirección</button></div>
        <div className="hero-watermark">BP</div>
      </section>

      <section className="metrics-grid metrics-grid--client">
        <MetricCard icon={Package} label="Paquetes activos" value="2" detail="1 llegando a RD" tone="blue" />
        <MetricCard icon={PackageCheck} label="Listos para retirar" value="1" detail="Disponible desde hoy" tone="green" />
        <MetricCard icon={CircleDollarSign} label="Balance pendiente" value="RD$475" detail="En tu próximo retiro" tone="amber" />
      </section>

      <div className="content-grid content-grid--client">
        <section className="panel current-package">
          <div className="panel-heading"><div><span className="eyebrow">En este momento</span><h2>Tu paquete más reciente</h2></div><button className="text-btn" onClick={() => showDetail(packages[0])}>Ver seguimiento <ChevronRight size={16} /></button></div>
          <div className="package-highlight">
            <div className="store-mark">a<span>→</span></div>
            <div className="package-highlight__main"><StatusBadge status="Disponible para retiro" /><h3>Audífonos Bluetooth</h3><p>Amazon · <span>1Z999AA10123456784</span></p></div>
            <div className="package-price"><small>Total a pagar</small><strong>RD$475.00</strong><span>2.5 lb</span></div>
          </div>
          <div className="mini-route">
            {['Miami', 'En vuelo', 'Almacén RD', 'Sucursal SDE'].map((label, index) => <div key={label} className={index === 3 ? 'current' : ''}><i><Check size={12} /></i><span>{label}</span></div>)}
          </div>
        </section>

        <section className="panel quick-actions">
          <div className="panel-heading"><div><span className="eyebrow">Accesos rápidos</span><h2>¿Qué deseas hacer?</h2></div></div>
          <button onClick={() => goTo('prealert')}><span><Plus size={20} /></span><div><strong>Prealertar compra</strong><small>Avísanos qué viene en camino</small></div><ChevronRight size={18} /></button>
          <button onClick={() => goTo('packages')}><span><Search size={20} /></span><div><strong>Rastrear paquete</strong><small>Consulta movimientos y cargos</small></div><ChevronRight size={18} /></button>
          <button onClick={() => goTo('locker')}><span><Clipboard size={20} /></span><div><strong>Copiar casillero</strong><small>Datos listos para tu tienda</small></div><ChevronRight size={18} /></button>
        </section>
      </div>
    </>
  )
}

function LockerView({ copyAddress }: { copyAddress: () => void }) {
  return (
    <>
      <PageHeading eyebrow="Tu casillero personal" title="Compra en USA como si vivieras allá" description="Usa estos datos exactamente como aparecen al completar tu compra." actions={<button className="btn btn--primary" onClick={copyAddress}><Copy size={18} /> Copiar todo</button>} />
      <section className="panel locker-details">
        <div className="locker-pass"><span>BRODPAQ MEMBER</span><strong>BOX-000001</strong><small>María Santos</small><i>MIAMI · SANTO DOMINGO</i></div>
        <div className="address-fields">
          <div><span>Nombre completo</span><strong>María Santos / BOX-000001</strong></div><div><span>Dirección</span><strong>7801 NW 37th St, Suite BP-000001</strong></div><div><span>Ciudad, estado y ZIP</span><strong>Doral, FL 33195</strong></div><div><span>Teléfono</span><strong>(305) 555-0198</strong></div>
        </div>
      </section>
      <section className="how-to-grid">
        {[['01', 'Compra en tu tienda favorita', 'Coloca la dirección BrodPaq como dirección de envío.'], ['02', 'Incluye tu código', 'Tu BOX-000001 debe estar junto a tu nombre.'], ['03', 'Crea una prealerta', 'Registra el tracking y factura para agilizar el proceso.']].map(([number, title, text]) => <article key={number}><span>{number}</span><ShoppingBag size={22} /><h3>{title}</h3><p>{text}</p></article>)}
      </section>
    </>
  )
}

function PrealertView({ onSuccess }: { onSuccess: () => void }) {
  const [fileName, setFileName] = useState('')
  const submit = (event: FormEvent) => { event.preventDefault(); onSuccess() }
  return (
    <>
      <PageHeading eyebrow="Agiliza tu recepción" title="Crear prealerta" description="Cuéntanos sobre tu compra antes de que llegue a Miami." />
      <form className="panel form-panel" onSubmit={submit}>
        <div className="form-progress"><span className="active"><i>1</i> Datos del paquete</span><b /><span><i>2</i> Confirmación</span></div>
        <div className="form-section-title"><span><Package size={20} /></span><div><h2>Información de tu compra</h2><p>Todos los campos marcados son necesarios para identificarla.</p></div></div>
        <div className="form-grid">
          <label className="field field--wide"><span>Número de tracking</span><input required defaultValue="TBA308476125000" placeholder="Ej. 1Z999AA10123456784" /><small>Lo encuentras en el correo de confirmación de la tienda.</small></label>
          <label className="field"><span>Tienda</span><select required defaultValue="Amazon"><option>Amazon</option><option>Shein</option><option>eBay</option><option>Walmart</option><option>Otra</option></select></label>
          <label className="field"><span>Valor declarado (US$)</span><input type="number" required defaultValue="68" min="1" /></label>
          <label className="field field--wide"><span>Descripción del contenido</span><input required defaultValue="Organizador de escritorio" /></label>
          <label className="upload-field field--wide"><input type="file" accept="image/*,.pdf" onChange={(event) => setFileName(event.target.files?.[0]?.name ?? '')} /><FileText size={25} /><span><strong>{fileName || 'Adjunta tu factura'}</strong><small>PDF, JPG o PNG · Máximo 5 MB</small></span><b>Seleccionar</b></label>
          <label className="field field--wide"><span>Comentario (opcional)</span><textarea rows={3} placeholder="Algún detalle que debamos conocer..." /></label>
        </div>
        <div className="form-footer"><p><ShieldCheckIcon /> Tus datos se usan solo para procesar este paquete.</p><button className="btn btn--primary" type="submit">Crear prealerta <ArrowIcon /></button></div>
      </form>
    </>
  )
}

function ShieldCheckIcon() { return <Check size={15} /> }
function ArrowIcon() { return <ChevronRight size={17} /> }

function PackagesView({ items, showDetail }: { items: CourierPackage[]; showDetail: (item: CourierPackage) => void }) {
  return (
    <>
      <PageHeading eyebrow="Historial y seguimiento" title="Mis paquetes" description="Consulta el estado, los cargos y cada movimiento de tus compras." />
      <div className="filter-bar"><div className="search-field"><Search size={18} /><input aria-label="Buscar paquete" placeholder="Buscar por tracking o tienda" /></div><select aria-label="Filtrar por estado"><option>Todos los estados</option><option>Disponible para retiro</option><option>En tránsito a RD</option></select></div>
      <section className="package-list">
        {items.map((item) => <button className="client-package-card" key={item.id} onClick={() => showDetail(item)} aria-label={`Ver detalle de ${item.description}`}>
          <span className="store-mark">{item.store.charAt(0)}<span>→</span></span><span className="package-card__main"><StatusBadge status={item.status} /><strong className="package-card-title">{item.description}</strong><span className="package-card-tracking">{item.store} · {item.tracking}</span><span className="package-card-facts"><span><CalendarDays size={14} /> {item.date}</span><span><MapPin size={14} /> {item.branch}</span></span></span><span className="package-card__meta"><small>{item.weight}</small><strong>RD${item.amount.toFixed(2)}</strong><span className="package-card-open"><ChevronRight size={19} /></span></span>
        </button>)}
      </section>
    </>
  )
}

function PackageDetail({ item, deliveryRequested, onBack, onInvoice, onDelivery }: { item: CourierPackage; deliveryRequested: boolean; onBack: () => void; onInvoice: () => void; onDelivery: () => void }) {
  return (
    <>
      <button className="back-link" onClick={onBack}>← Volver a mis paquetes</button>
      <PageHeading eyebrow={item.id} title={item.description} description={`${item.store} · ${item.tracking}`} actions={<StatusBadge status={deliveryRequested ? 'Solicitado a domicilio' : item.status} />} />
      <div className="detail-grid">
        <section className="panel tracking-panel"><div className="panel-heading"><div><span className="eyebrow">Seguimiento</span><h2>Recorrido del paquete</h2></div><span className="updated-label">Actualizado hoy, 8:35 AM</span></div><div className="timeline">{timeline.map((event) => <div className={`timeline-event ${event.current ? 'current' : ''}`} key={event.id}><span className="timeline-dot"><Check size={13} /></span><div><strong>{event.title}</strong><p>{event.detail}</p></div><time>{event.date}</time></div>)}</div></section>
        <aside className="detail-summary">
          <section className="panel"><span className="eyebrow">Resumen</span><div className="summary-row"><span>Peso facturado</span><strong>{item.weight}</strong></div><div className="summary-row"><span>Flete internacional</span><strong>RD$425.00</strong></div><div className="summary-row"><span>Manejo</span><strong>RD$50.00</strong></div><div className="summary-total"><span>Total a pagar</span><strong>RD${item.amount.toFixed(2)}</strong></div><button className="btn btn--primary btn--block" onClick={onInvoice}><ReceiptText size={17} /> Ver factura</button><button className="btn btn--secondary btn--block" onClick={onDelivery} disabled={deliveryRequested}><Truck size={17} /> {deliveryRequested ? 'Domicilio solicitado' : 'Solicitar domicilio'}</button></section>
          <section className="panel pickup-card"><MapPin size={21} /><div><small>Sucursal de retiro</small><strong>Santo Domingo Este</strong><span>Av. San Vicente de Paúl #48</span></div></section>
        </aside>
      </div>
    </>
  )
}

function InvoiceModal({ onClose }: { onClose: () => void }) {
  return <Modal title="Factura interna BP-10482" onClose={onClose} size="lg"><div className="invoice"><div className="invoice-meta"><div><span>Cliente</span><strong>María Santos · BOX-000001</strong></div><div><span>Emitida</span><strong>14 oct, 2026</strong></div><div><span>Sucursal</span><strong>Santo Domingo Este</strong></div></div><table><thead><tr><th>Descripción</th><th>Peso</th><th>Tarifa</th><th>Total</th></tr></thead><tbody><tr><td><strong>Audífonos Bluetooth</strong><small>1Z999AA10123456784</small></td><td>2.5 lb</td><td>RD$170/lb</td><td>RD$425.00</td></tr><tr><td>Manejo logístico</td><td>—</td><td>—</td><td>RD$50.00</td></tr></tbody></table><div className="invoice-total"><span>Total pendiente</span><strong>RD$475.00</strong></div><p className="fiscal-note">Documento visual no fiscal. Preparado para integración NCF/e-CF en una fase futura.</p><div className="modal-actions"><button className="btn btn--secondary" onClick={onClose}>Cerrar</button><button className="btn btn--primary" onClick={() => window.print()}><FileText size={17} /> Imprimir</button></div></div></Modal>
}

function DeliveryModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: () => void }) {
  return <Modal title="Solicitar entrega a domicilio" onClose={onClose}><form className="modal-form" onSubmit={(event) => { event.preventDefault(); onSubmit() }}><label className="field"><span>Dirección</span><input required defaultValue="Calle 6 #18, Ens. Ozama" /></label><div className="form-grid"><label className="field"><span>Teléfono</span><input required defaultValue="809-555-0101" /></label><label className="field"><span>Fecha preferida</span><input type="date" required defaultValue="2026-10-16" /></label></div><label className="field"><span>Referencia</span><input required defaultValue="Casa crema, próximo al supermercado" /></label><div className="delivery-quote"><Truck size={20} /><span><small>Entrega estimada</small><strong>RD$250.00 · 1 a 2 días laborables</strong></span></div><div className="modal-actions"><button type="button" className="btn btn--secondary" onClick={onClose}>Cancelar</button><button className="btn btn--primary" type="submit">Confirmar solicitud</button></div></form></Modal>
}
