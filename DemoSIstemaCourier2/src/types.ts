export type PackageStatus =
  | 'Prealertado'
  | 'Recibido en USA'
  | 'Contenerizado'
  | 'Embarcado'
  | 'En tránsito a RD'
  | 'Recibido en RD'
  | 'En transferencia'
  | 'Disponible para retiro'
  | 'Solicitado a domicilio'
  | 'Entregado'
  | 'Con incidencia'

export type CourierPackage = {
  id: string
  tracking: string
  store: string
  description: string
  client: string
  locker: string
  weight: string
  amount: number
  branch: string
  date: string
  status: PackageStatus
}

export type TimelineEvent = {
  id: string
  title: string
  detail: string
  date: string
  complete: boolean
  current?: boolean
}
