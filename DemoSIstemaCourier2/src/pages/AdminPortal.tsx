import { type FormEvent, useEffect, useState } from 'react'
import {
  AlertCircle, ArrowRight, BarChart3, Bell, Box, Boxes, Building2, CalendarDays,
  Check, ChevronDown, ChevronRight, CircleDollarSign, ClipboardCheck, Container,
  FileBarChart, FileText, LayoutDashboard, LogOut, MapPin, Menu, MoreHorizontal,
  Package, PackageCheck, Plane, Plus, Printer, ReceiptText, RefreshCw, ScanLine,
  Search, Settings, ShipWheel, ShoppingBag, SlidersHorizontal, Truck, UserPlus,
  Users, WalletCards, Warehouse, X, Zap,
} from 'lucide-react'
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { BrandLogo, MetricCard, Modal, PageHeading, StatusBadge, Toast } from '../components/Shared'
import { branches, customers, packages } from '../data'
import type { CourierPackage } from '../types'

type AdminView = 'dashboard' | 'customers' | 'packages' | 'usa' | 'containers' | 'shipments' | 'rd' | 'transfers' | 'branches' | 'counter' | 'billing' | 'cash' | 'reports'

const navGroups = [
  { label: 'General', items: [{ id: 'dashboard', label: 'Resumen operativo', icon: LayoutDashboard }, { id: 'customers', label: 'Clientes', icon: Users }, { id: 'packages', label: 'Paquetes', icon: Package }] },
  { label: 'Logística', items: [{ id: 'usa', label: 'Recepción USA', icon: ScanLine }, { id: 'containers', label: 'Contenedores', icon: Container }, { id: 'shipments', label: 'Embarques', icon: Plane }, { id: 'rd', label: 'Almacén RD', icon: Warehouse }, { id: 'transfers', label: 'Transferencias', icon: Truck }] },
  { label: 'Operación local', items: [{ id: 'branches', label: 'Sucursales', icon: Building2 }, { id: 'counter', label: 'Entrega counter', icon: PackageCheck }, { id: 'billing', label: 'Facturación', icon: ReceiptText }, { id: 'cash', label: 'Caja', icon: WalletCards }] },
  { label: 'Análisis', items: [{ id: 'reports', label: 'Reportes', icon: FileBarChart }] },
] as const

const statusData = [
  { name: 'USA', value: 286, color: '#5b5bd6' },
  { name: 'En tránsito', value: 148, color: '#1688c9' },
  { name: 'En RD', value: 194, color: '#14a3a1' },
  { name: 'Disponibles', value: 122, color: '#31a36b' },
  { name: 'Incidencias', value: 18, color: '#e35d6a' },
]

const weeklyData = [
  { day: 'Jue', packages: 152, revenue: 68500 }, { day: 'Vie', packages: 184, revenue: 79200 },
  { day: 'Sáb', packages: 96, revenue: 42800 }, { day: 'Dom', packages: 48, revenue: 21100 },
  { day: 'Lun', packages: 218, revenue: 96400 }, { day: 'Mar', packages: 246, revenue: 108700 },
  { day: 'Mié', packages: 274, revenue: 124850 },
]

export default function AdminPortal({ role, onLogout }: { role: string; onLogout: () => void }) {
  const initialView: AdminView = role.includes('USA') ? 'usa' : role.includes('RD') ? 'rd' : role.includes('Sucursal') ? 'branches' : role.includes('Cajero') ? 'counter' : 'dashboard'
  const [view, setView] = useState<AdminView>(initialView)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 3600)
    return () => window.clearTimeout(timer)
  }, [toast])

  const goTo = (next: AdminView) => { setView(next); setSidebarOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${sidebarOpen ? 'is-open' : ''}`}>
        <div className="admin-brand"><BrandLogo inverse /><button className="icon-btn sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Cerrar menú"><X size={20} /></button></div>
        <div className="workspace-switch"><span>BP</span><div><small>Espacio de trabajo</small><strong>BrodPaq Central</strong></div><ChevronDown size={16} /></div>
        <nav aria-label="Panel administrativo">
          {navGroups.map((group) => <div className="nav-group" key={group.label}><span>{group.label}</span>{group.items.map((item) => { const Icon = item.icon; return <button key={item.id} className={view === item.id ? 'active' : ''} onClick={() => goTo(item.id as AdminView)}><Icon size={18} /><span>{item.label}</span>{item.id === 'usa' && <b>24</b>}{item.id === 'counter' && <b>8</b>}</button> })}</div>)}
        </nav>
        <div className="admin-user"><div className="avatar avatar--sm">AR</div><div><strong>Ana Rodríguez</strong><span>{role}</span></div><button onClick={onLogout} aria-label="Cerrar sesión"><LogOut size={17} /></button></div>
      </aside>
      {sidebarOpen && <button className="sidebar-scrim" onClick={() => setSidebarOpen(false)} aria-label="Cerrar menú" />}

      <div className="admin-main">
        <header className="admin-topbar">
          <button className="icon-btn mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="Abrir menú"><Menu size={21} /></button>
          <div className="global-search"><Search size={18} /><input aria-label="Búsqueda global" placeholder="Buscar cliente, tracking o factura..." /><kbd>Ctrl K</kbd></div>
          <div className="topbar-actions"><div className="system-status"><i /> Operación en línea</div><button className="icon-btn notification-btn" aria-label="Notificaciones"><Bell size={19} /><i /></button><button className="icon-btn" aria-label="Configuración"><Settings size={19} /></button></div>
        </header>
        <main className="admin-content">
          {view === 'dashboard' && <AdminDashboard goTo={goTo} />}
          {view === 'customers' && <CustomersView notify={setToast} />}
          {view === 'packages' && <AdminPackagesView />}
          {view === 'usa' && <OperationView type="usa" notify={setToast} />}
          {view === 'containers' && <OperationView type="containers" notify={setToast} />}
          {view === 'shipments' && <OperationView type="shipments" notify={setToast} />}
          {view === 'rd' && <OperationView type="rd" notify={setToast} />}
          {view === 'transfers' && <OperationView type="transfers" notify={setToast} />}
          {view === 'branches' && <BranchesView notify={setToast} />}
          {view === 'counter' && <CounterView notify={setToast} />}
          {view === 'billing' && <BillingView />}
          {view === 'cash' && <CashView notify={setToast} />}
          {view === 'reports' && <ReportsView />}
        </main>
      </div>
      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  )
}

function AdminDashboard({ goTo }: { goTo: (view: AdminView) => void }) {
  return (
    <>
      <PageHeading eyebrow="Centro de control · 14 octubre 2026" title="Buenos días, Ana" description="La operación está estable. Hay 18 incidencias que requieren atención." actions={<><button className="btn btn--secondary"><CalendarDays size={17} /> Hoy</button><button className="btn btn--primary" onClick={() => goTo('usa')}><ScanLine size={17} /> Recibir paquete</button></>} />
      <section className="metrics-grid metrics-grid--admin">
        <MetricCard icon={Boxes} label="Recibidos hoy" value="274" detail="+12.4% vs. ayer" tone="blue" />
        <MetricCard icon={Plane} label="En tránsito" value="148" detail="3 embarques activos" tone="purple" />
        <MetricCard icon={PackageCheck} label="Listos para retiro" value="122" detail="En 5 sucursales" tone="green" />
        <MetricCard icon={CircleDollarSign} label="Ingresos del día" value="RD$124.8K" detail="+8.2% vs. ayer" tone="amber" />
      </section>

      <div className="dashboard-grid">
        <section className="panel chart-panel chart-panel--wide">
          <div className="panel-heading"><div><span className="eyebrow">Volumen semanal</span><h2>Paquetes procesados</h2></div><div className="chart-summary"><strong>1,218</strong><span>esta semana</span></div></div>
          <div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={weeklyData} margin={{ top: 12, right: 4, left: -24, bottom: 0 }}><defs><linearGradient id="blueArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1688c9" stopOpacity={0.25} /><stop offset="100%" stopColor="#1688c9" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e8edf2" /><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6b7887', fontSize: 12 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7887', fontSize: 11 }} /><Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #dfe6ed', boxShadow: '0 8px 30px rgba(9,30,52,.1)' }} /><Area type="monotone" dataKey="packages" stroke="#1688c9" strokeWidth={2.5} fill="url(#blueArea)" activeDot={{ r: 5, fill: '#1688c9', stroke: '#fff', strokeWidth: 3 }} /></AreaChart></ResponsiveContainer></div>
        </section>
        <section className="panel chart-panel status-chart">
          <div className="panel-heading"><div><span className="eyebrow">Distribución</span><h2>Estado de paquetes</h2></div><button className="icon-btn"><MoreHorizontal size={19} /></button></div>
          <div className="donut-wrap"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={statusData} dataKey="value" innerRadius={58} outerRadius={78} paddingAngle={3}>{statusData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer><div><strong>768</strong><span>activos</span></div></div>
          <div className="chart-legend">{statusData.map((item) => <span key={item.name}><i style={{ background: item.color }} />{item.name}<strong>{item.value}</strong></span>)}</div>
        </section>
      </div>

      <div className="dashboard-grid dashboard-grid--bottom">
        <section className="panel table-panel">
          <div className="panel-heading"><div><span className="eyebrow">Actividad reciente</span><h2>Últimos paquetes</h2></div><button className="text-btn" onClick={() => goTo('packages')}>Ver todos <ArrowRight size={16} /></button></div>
          <PackageTable items={packages.slice(0, 5)} />
        </section>
        <section className="panel alert-panel">
          <div className="panel-heading"><div><span className="eyebrow">Atención requerida</span><h2>Alertas operativas</h2></div><span className="alert-count">18</span></div>
          <button><span className="alert-icon alert-icon--danger"><AlertCircle size={18} /></span><div><strong>4 paquetes sin cliente</strong><small>Recepción USA · hace 12 min</small></div><ChevronRight size={17} /></button>
          <button><span className="alert-icon alert-icon--warning"><Plane size={18} /></span><div><strong>Embarque BP-241 demorado</strong><small>Miami → Santo Domingo</small></div><ChevronRight size={17} /></button>
          <button><span className="alert-icon alert-icon--blue"><Warehouse size={18} /></span><div><strong>8 paquetes sin ubicación</strong><small>Almacén central RD</small></div><ChevronRight size={17} /></button>
        </section>
      </div>
    </>
  )
}

function PackageTable({ items }: { items: CourierPackage[] }) {
  return <div className="table-scroll"><table className="data-table"><thead><tr><th>Paquete</th><th>Cliente</th><th>Destino</th><th>Estado</th><th>Peso</th><th /></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td><strong>{item.tracking}</strong><small>{item.store} · {item.description}</small></td><td><strong>{item.client}</strong><small>{item.locker}</small></td><td>{item.branch}</td><td><StatusBadge status={item.status} /></td><td>{item.weight}</td><td><button className="icon-btn" aria-label={`Opciones para ${item.tracking}`}><MoreHorizontal size={18} /></button></td></tr>)}</tbody></table></div>
}

function CustomersView({ notify }: { notify: (message: string) => void }) {
  const [modal, setModal] = useState(false)
  return <><PageHeading eyebrow="Directorio" title="Clientes" description="Administra casilleros, preferencias y actividad de tus clientes." actions={<button className="btn btn--primary" onClick={() => setModal(true)}><UserPlus size={17} /> Nuevo cliente</button>} /><section className="panel table-panel"><div className="table-toolbar"><div className="search-field"><Search size={17} /><input placeholder="Buscar nombre, teléfono o casillero" /></div><button className="btn btn--secondary"><SlidersHorizontal size={16} /> Filtros</button><span>2,486 clientes</span></div><div className="table-scroll"><table className="data-table"><thead><tr><th>Cliente</th><th>Contacto</th><th>Sucursal</th><th>Paquetes activos</th><th>Estado</th><th /></tr></thead><tbody>{customers.map((client) => <tr key={client.id}><td><div className="person-cell"><span>{client.name.split(' ').map((part) => part[0]).join('')}</span><div><strong>{client.name}</strong><small>{client.id}</small></div></div></td><td><strong>{client.phone}</strong><small>{client.email}</small></td><td>{client.branch}</td><td><b className="count-pill">{client.active}</b></td><td><span className="status status--success"><i />{client.status}</span></td><td><button className="icon-btn"><MoreHorizontal size={18} /></button></td></tr>)}</tbody></table></div></section>{modal && <Modal title="Registrar nuevo cliente" onClose={() => setModal(false)}><form className="modal-form" onSubmit={(event) => { event.preventDefault(); setModal(false); notify('Cliente registrado con el casillero BOX-003103.') }}><div className="form-grid"><label className="field"><span>Nombre</span><input required placeholder="Nombre completo" /></label><label className="field"><span>Cédula</span><input required placeholder="000-0000000-0" /></label><label className="field"><span>Teléfono</span><input required placeholder="809-000-0000" /></label><label className="field"><span>Email</span><input type="email" required placeholder="cliente@email.com" /></label></div><label className="field"><span>Sucursal preferida</span><select>{branches.map((branch) => <option key={branch.code}>{branch.name}</option>)}</select></label><div className="modal-actions"><button type="button" className="btn btn--secondary" onClick={() => setModal(false)}>Cancelar</button><button className="btn btn--primary">Crear cliente</button></div></form></Modal>}</>
}

function AdminPackagesView() {
  return <><PageHeading eyebrow="Control de inventario" title="Todos los paquetes" description="Localiza y consulta el historial operativo de cualquier paquete." actions={<button className="btn btn--secondary"><FileText size={17} /> Exportar</button>} /><section className="panel table-panel"><div className="table-toolbar"><div className="search-field"><Search size={17} /><input placeholder="Tracking, cliente o descripción" /></div><select><option>Todos los estados</option><option>En USA</option><option>En tránsito</option><option>En RD</option><option>Disponibles</option></select><select><option>Todas las sucursales</option>{branches.map((branch) => <option key={branch.code}>{branch.name}</option>)}</select></div><PackageTable items={packages} /><div className="table-footer"><span>Mostrando 6 de 3,142 paquetes</span><div><button disabled>Anterior</button><button className="active">1</button><button>2</button><button>3</button><button>Siguiente</button></div></div></section></>
}

type OperationType = 'usa' | 'containers' | 'shipments' | 'rd' | 'transfers'
const operationConfig = {
  usa: { eyebrow: 'Miami · Recepción', title: 'Recepción USA', description: 'Escanea, identifica y registra paquetes en segundos.', icon: ScanLine, action: 'Procesar paquete', success: 'Paquete recibido y asignado a María Santos.', code: '1Z999AA10123456784' },
  containers: { eyebrow: 'Preparación de carga', title: 'Contenerización', description: 'Agrupa paquetes validados en la valija VJ-1048.', icon: Container, action: 'Agregar a valija', success: 'Paquete agregado a la valija VJ-1048.', code: 'VJ-1048 · Destino SDQ' },
  shipments: { eyebrow: 'Salida internacional', title: 'Embarque BP-242', description: 'Prepara y despacha las valijas del próximo vuelo a RD.', icon: Plane, action: 'Enviar a RD', success: 'Embarque BP-242 despachado hacia República Dominicana.', code: 'MAWB 932-78451026' },
  rd: { eyebrow: 'Centro logístico SDQ', title: 'Recepción almacén RD', description: 'Concilia la carga esperada con los paquetes recibidos.', icon: Warehouse, action: 'Registrar recepción', success: 'Paquete conciliado correctamente en almacén RD.', code: 'BP-241 · 186 esperados' },
  transfers: { eyebrow: 'Distribución nacional', title: 'Transferencia a sucursal', description: 'Crea y despacha valijas hacia las sucursales destino.', icon: Truck, action: 'Enviar a sucursal', success: 'Transferencia TR-1089 enviada a Santo Domingo Este.', code: 'TR-1089 · Sucursal SDE' },
}

function OperationView({ type, notify }: { type: OperationType; notify: (message: string) => void }) {
  const config = operationConfig[type]
  const Icon = config.icon
  const [scanned, setScanned] = useState(type === 'shipments')
  const submit = (event: FormEvent) => { event.preventDefault(); setScanned(true) }
  const complete = () => { notify(config.success); setScanned(false) }
  const counters = type === 'rd' ? [['Esperados', '186'], ['Recibidos', scanned ? '179' : '178'], ['Faltantes', scanned ? '7' : '8'], ['Sobrantes', '0']] : type === 'containers' ? [['Paquetes', '48'], ['Peso total', '126.4 lb'], ['Capacidad', '78%'], ['Incidencias', '1']] : [['Procesados hoy', '274'], ['Pendientes', '24'], ['Sin identificar', '4'], ['Incidencias', '2']]
  return <><PageHeading eyebrow={config.eyebrow} title={config.title} description={config.description} actions={<span className="live-chip"><i /> Turno activo · Ana R.</span>} /><section className="operation-stats">{counters.map(([label, value], index) => <article key={label}><span>{label}</span><strong>{value}</strong><i className={`stat-line stat-line--${index}`} /></article>)}</section><div className="operation-grid"><section className="panel scanner-panel"><div className="scanner-title"><span><Icon size={22} /></span><div><h2>{type === 'shipments' ? 'Resumen del embarque' : 'Escanear código'}</h2><p>{type === 'shipments' ? 'Confirma la documentación antes de despachar.' : 'El cursor permanece listo para el siguiente paquete.'}</p></div></div><form onSubmit={submit}><div className={`scan-input ${scanned ? 'is-success' : ''}`}><ScanLine size={24} /><input aria-label="Código de escaneo" defaultValue={type === 'usa' ? '1Z999AA10123456784' : ''} placeholder={config.code} autoFocus /><span>{scanned ? <Check size={20} /> : 'ENTER'}</span></div></form>{scanned ? <div className="scan-result"><header><div className="store-mark">a<span>→</span></div><div><span className="status status--success"><i />Identificado</span><h3>{type === 'shipments' ? 'Embarque BP-242' : 'Audífonos Bluetooth'}</h3><p>{config.code}</p></div></header><div className="result-details"><div><span>Cliente</span><strong>María Santos</strong></div><div><span>Casillero</span><strong>BOX-000001</strong></div><div><span>Peso</span><strong>2.5 lb</strong></div><div><span>Destino</span><strong>Santo Domingo Este</strong></div></div><button className="btn btn--primary btn--block" onClick={complete}><Icon size={18} /> {config.action}</button></div> : <div className="scan-empty"><div><ScanLine size={33} /></div><strong>Listo para escanear</strong><p>Ingresa un tracking o utiliza el lector conectado.</p></div>}</section><section className="panel activity-panel"><div className="panel-heading"><div><span className="eyebrow">Sesión actual</span><h2>Últimos movimientos</h2></div><button className="icon-btn"><RefreshCw size={17} /></button></div>{packages.slice(0, 4).map((item, index) => <div className="activity-item" key={item.id}><span className={index === 3 ? 'warning' : ''}>{index === 3 ? <AlertCircle size={16} /> : <Check size={16} />}</span><div><strong>{item.tracking}</strong><small>{item.client} · {index + 1}.8 lb</small></div><time>10:{42 - index * 7}</time></div>)}</section></div></>
}

function BranchesView({ notify }: { notify: (message: string) => void }) {
  return <><PageHeading eyebrow="Red nacional" title="Sucursales" description="Monitorea inventario, entregas e ingresos de cada ubicación." actions={<button className="btn btn--primary" onClick={() => notify('Transferencia TR-1089 marcada como recibida en SDE.')}><ClipboardCheck size={17} /> Recibir transferencia</button>} /><section className="branch-grid">{branches.map((branch, index) => <article className="panel branch-card" key={branch.code}><header><span>{branch.code}</span><div><i /> Abierta</div></header><h2>{branch.name}</h2><p><MapPin size={14} /> República Dominicana</p><div className="branch-metrics"><div><span>Paquetes</span><strong>{branch.packages}</strong></div><div><span>Entregados hoy</span><strong>{42 - index * 5}</strong></div><div><span>Ingresos</span><strong>RD${(branch.revenue / 1000).toFixed(1)}K</strong></div></div><button>Ver operación <ArrowRight size={16} /></button></article>)}</section></>
}

function CounterView({ notify }: { notify: (message: string) => void }) {
  const [selected, setSelected] = useState(true)
  const [modal, setModal] = useState(false)
  return <><PageHeading eyebrow="Sucursal Santo Domingo Este" title="Entrega counter" description="Busca al cliente, valida sus paquetes y completa el cobro." /><div className="counter-search"><Search size={21} /><input defaultValue="BOX-000001" placeholder="Nombre, teléfono, casillero o tracking" /><button className="btn btn--primary">Buscar</button></div><div className="counter-grid"><section className="panel counter-customer"><header><div className="avatar">MS</div><div><span className="eyebrow">Cliente identificado</span><h2>María Santos</h2><p>BOX-000001 · 809-555-0101</p></div><span className="status status--success"><i />Validado</span></header><div className="available-label"><strong>Paquetes disponibles</strong><span>1 paquete</span></div><button className={`select-package ${selected ? 'selected' : ''}`} onClick={() => setSelected(!selected)}><span className="checkbox">{selected && <Check size={15} />}</span><div className="store-mark">a<span>→</span></div><div><strong>Audífonos Bluetooth</strong><small>1Z999AA10123456784 · 2.5 lb</small></div><b>RD$475.00</b></button><div className="authorized"><UserPlus size={17} /><div><strong>Retira el titular</strong><small>Identidad validada con cédula terminada en 0042</small></div></div></section><aside className="panel checkout-card"><span className="eyebrow">Resumen de cobro</span><h2>Finalizar entrega</h2><div className="checkout-row"><span>Flete (2.5 lb)</span><strong>RD$425.00</strong></div><div className="checkout-row"><span>Manejo</span><strong>RD$50.00</strong></div><div className="checkout-total"><span>Total</span><strong>{selected ? 'RD$475.00' : 'RD$0.00'}</strong></div><label className="field"><span>Método de pago</span><select><option>Tarjeta débito/crédito</option><option>Efectivo</option><option>Transferencia</option></select></label><button className="btn btn--primary btn--block" disabled={!selected} onClick={() => setModal(true)}><CircleDollarSign size={18} /> Facturar y entregar</button><p><Check size={14} /> Se generará la factura interna BP-10482.</p></aside></div>{modal && <Modal title="Confirmar entrega" onClose={() => setModal(false)}><div className="confirmation-state"><span><PackageCheck size={30} /></span><h3>Todo listo para entregar</h3><p>Confirma que María Santos recibió el paquete y que el pago de <strong>RD$475.00</strong> fue procesado.</p></div><div className="modal-actions"><button className="btn btn--secondary" onClick={() => setModal(false)}>Cancelar</button><button className="btn btn--primary" onClick={() => { setModal(false); notify('Entrega completada. El paquete ahora figura como entregado.') }}>Confirmar entrega</button></div></Modal>}</>
}

function BillingView() {
  const invoices = [{ id: 'BP-10482', client: 'María Santos', amount: 'RD$475.00', method: 'Tarjeta', time: '11:42 AM' }, { id: 'BP-10481', client: 'José Ramírez', amount: 'RD$1,320.00', method: 'Efectivo', time: '11:18 AM' }, { id: 'BP-10480', client: 'Laura Peña', amount: 'RD$890.00', method: 'Transferencia', time: '10:54 AM' }]
  return <><PageHeading eyebrow="Documentos internos" title="Facturación" description="Consulta las facturas simuladas emitidas por la operación." actions={<button className="btn btn--secondary"><Printer size={17} /> Imprimir reporte</button>} /><section className="billing-summary"><article><ReceiptText size={21} /><span>Facturado hoy<strong>RD$124,850.00</strong></span></article><article><CircleDollarSign size={21} /><span>Transacciones<strong>186</strong></span></article><article><RefreshCw size={21} /><span>Pendiente de cobro<strong>RD$18,420.00</strong></span></article></section><section className="panel table-panel"><div className="panel-heading"><div><span className="eyebrow">14 de octubre</span><h2>Facturas recientes</h2></div></div><div className="table-scroll"><table className="data-table"><thead><tr><th>Factura</th><th>Cliente</th><th>Hora</th><th>Método</th><th>Total</th><th>Estado</th></tr></thead><tbody>{invoices.map((invoice) => <tr key={invoice.id}><td><strong>{invoice.id}</strong></td><td>{invoice.client}</td><td>{invoice.time}</td><td>{invoice.method}</td><td><strong>{invoice.amount}</strong></td><td><span className="status status--success"><i />Pagada</span></td></tr>)}</tbody></table></div></section><p className="fiscal-banner"><AlertCircle size={17} /><span><strong>Demo no fiscal.</strong> La integración NCF/e-CF está contemplada para la fase de producción.</span></p></>
}

function CashView({ notify }: { notify: (message: string) => void }) {
  const [closed, setClosed] = useState(false)
  return <><PageHeading eyebrow="Sucursal Santo Domingo Este" title="Cuadre de caja" description="Resumen del turno actual de Ana Rodríguez." actions={<span className={`cash-status ${closed ? 'closed' : ''}`}><i />{closed ? 'Caja cerrada' : 'Caja abierta desde 8:02 AM'}</span>} /><div className="cash-grid"><section className="panel cash-balance"><span className="eyebrow">Balance del turno</span><small>Total facturado</small><strong>RD$124,850.00</strong><div className="cash-methods"><div><span>Efectivo</span><strong>RD$42,350.00</strong><i style={{ width: '34%' }} /></div><div><span>Tarjetas</span><strong>RD$61,200.00</strong><i style={{ width: '49%' }} /></div><div><span>Transferencias</span><strong>RD$21,300.00</strong><i style={{ width: '17%' }} /></div></div></section><section className="panel cash-close"><span className="eyebrow">Cierre de caja</span><div className="summary-row"><span>Efectivo inicial</span><strong>RD$5,000.00</strong></div><div className="summary-row"><span>Efectivo esperado</span><strong>RD$47,350.00</strong></div><label className="field"><span>Efectivo contado</span><input defaultValue="47350.00" disabled={closed} /></label><div className="cash-difference"><span>Diferencia</span><strong>RD$0.00</strong></div><button className="btn btn--primary btn--block" disabled={closed} onClick={() => { setClosed(true); notify('Caja cerrada sin diferencias. Cuadre BP-CJ-328 generado.') }}><WalletCards size={18} />{closed ? 'Caja cerrada' : 'Cerrar caja'}</button></section></div></>
}

function ReportsView() {
  return <><PageHeading eyebrow="Inteligencia operativa" title="Reportes" description="Indicadores para decidir con datos y detectar cuellos de botella." actions={<><button className="btn btn--secondary"><CalendarDays size={17} /> Últimos 7 días</button><button className="btn btn--primary"><FileText size={17} /> Exportar</button></>} /><div className="report-tabs"><button className="active">Operación</button><button>Ingresos</button><button>Sucursales</button><button>Clientes</button></div><div className="reports-grid"><section className="panel chart-panel chart-panel--wide"><div className="panel-heading"><div><span className="eyebrow">Tendencia diaria</span><h2>Ingresos procesados</h2></div><div className="chart-summary"><strong>RD$541.5K</strong><span>+14.2% semanal</span></div></div><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><BarChart data={weeklyData} margin={{ top: 8, right: 0, left: -15, bottom: 0 }}><CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e8edf2" /><XAxis dataKey="day" axisLine={false} tickLine={false} /><YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${value / 1000}K`} /><Tooltip formatter={(value) => `RD$${Number(value).toLocaleString()}`} /><Bar dataKey="revenue" fill="#1688c9" radius={[5, 5, 0, 0]} maxBarSize={38} /></BarChart></ResponsiveContainer></div></section><section className="panel branch-ranking"><div className="panel-heading"><div><span className="eyebrow">Desempeño</span><h2>Ingresos por sucursal</h2></div></div>{branches.map((branch, index) => <div key={branch.code}><span>{index + 1}</span><div><strong>{branch.name}</strong><i><b style={{ width: `${100 - index * 13}%` }} /></i></div><b>RD${(branch.revenue / 1000).toFixed(1)}K</b></div>)}</section></div><section className="report-kpis"><article><Zap size={20} /><span>Tiempo medio USA → RD<strong>2.4 días</strong><small>-0.3 días vs. período anterior</small></span></article><article><PackageCheck size={20} /><span>Entregas a tiempo<strong>96.8%</strong><small>Meta operativa: 95%</small></span></article><article><AlertCircle size={20} /><span>Tasa de incidencias<strong>1.7%</strong><small>18 casos abiertos</small></span></article><article><Users size={20} /><span>Clientes activos<strong>2,486</strong><small>+128 este mes</small></span></article></section></>
}
