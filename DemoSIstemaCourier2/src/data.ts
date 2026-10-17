import type { CourierPackage, TimelineEvent } from './types'

export const branches = [
  { name: 'Santo Domingo Este', code: 'SDE', packages: 186, revenue: 182400 },
  { name: 'Santiago', code: 'STI', packages: 143, revenue: 149800 },
  { name: 'Punta Cana', code: 'PUJ', packages: 92, revenue: 117300 },
  { name: 'La Romana', code: 'LRM', packages: 68, revenue: 86400 },
  { name: 'San Pedro de Macorís', code: 'SPM', packages: 54, revenue: 69100 },
]

export const packages: CourierPackage[] = [
  { id: 'PKG-001', tracking: '1Z999AA10123456784', store: 'Amazon', description: 'Audífonos Bluetooth', client: 'María Santos', locker: 'BOX-000001', weight: '2.5 lb', amount: 475, branch: 'Santo Domingo Este', date: '14 oct, 2026', status: 'Disponible para retiro' },
  { id: 'PKG-002', tracking: 'TBA308476125000', store: 'Amazon', description: 'Organizador de escritorio', client: 'María Santos', locker: 'BOX-000001', weight: '1.2 lb', amount: 285, branch: 'Santo Domingo Este', date: '12 oct, 2026', status: 'En tránsito a RD' },
  { id: 'PKG-003', tracking: '9400111899223856928499', store: 'Shein', description: 'Ropa y accesorios', client: 'Laura Peña', locker: 'BOX-002184', weight: '4.8 lb', amount: 890, branch: 'Santiago', date: '14 oct, 2026', status: 'Recibido en USA' },
  { id: 'PKG-004', tracking: '9274890241053657801246', store: 'Apple', description: 'Accesorios electrónicos', client: 'Carlos Méndez', locker: 'BOX-001289', weight: '1.7 lb', amount: 365, branch: 'Punta Cana', date: '14 oct, 2026', status: 'Con incidencia' },
  { id: 'PKG-005', tracking: '1Z84V77E0327458219', store: 'eBay', description: 'Repuesto automotriz', client: 'José Ramírez', locker: 'BOX-000984', weight: '7.4 lb', amount: 1320, branch: 'La Romana', date: '13 oct, 2026', status: 'En transferencia' },
  { id: 'PKG-006', tracking: '4203310192748901245897', store: 'Walmart', description: 'Artículos del hogar', client: 'Ana Guzmán', locker: 'BOX-003102', weight: '3.1 lb', amount: 590, branch: 'San Pedro de Macorís', date: '13 oct, 2026', status: 'Entregado' },
]

export const timeline: TimelineEvent[] = [
  { id: 't1', title: 'Prealerta creada', detail: 'Factura y datos de compra registrados', date: '08 oct · 9:42 AM', complete: true },
  { id: 't2', title: 'Recibido en almacén USA', detail: 'Miami, FL · Peso verificado: 2.5 lb', date: '10 oct · 2:18 PM', complete: true },
  { id: 't3', title: 'Embarcado hacia RD', detail: 'Vuelo BP-241 · Valija VJ-1048', date: '11 oct · 7:30 PM', complete: true },
  { id: 't4', title: 'Procesado en almacén RD', detail: 'Validación aduanal completada', date: '13 oct · 11:05 AM', complete: true },
  { id: 't5', title: 'Disponible para retiro', detail: 'Sucursal Santo Domingo Este', date: '14 oct · 8:35 AM', complete: true, current: true },
]

export const customers = [
  { id: 'BOX-000001', name: 'María Santos', phone: '809-555-0101', email: 'maria.demo@email.com', branch: 'Santo Domingo Este', active: 2, status: 'Activo' },
  { id: 'BOX-002184', name: 'Laura Peña', phone: '809-555-0184', email: 'laura.p@email.com', branch: 'Santiago', active: 1, status: 'Activo' },
  { id: 'BOX-001289', name: 'Carlos Méndez', phone: '829-555-0289', email: 'carlos.m@email.com', branch: 'Punta Cana', active: 1, status: 'Activo' },
  { id: 'BOX-000984', name: 'José Ramírez', phone: '849-555-0984', email: 'j.ramirez@email.com', branch: 'La Romana', active: 3, status: 'Activo' },
  { id: 'BOX-003102', name: 'Ana Guzmán', phone: '809-555-3102', email: 'ana.g@email.com', branch: 'San Pedro de Macorís', active: 0, status: 'Activo' },
]
