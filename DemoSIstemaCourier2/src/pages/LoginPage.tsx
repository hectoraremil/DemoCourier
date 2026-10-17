import { useState } from 'react'
import { ArrowRight, Boxes, Building2, CircleDollarSign, MapPin, PackageCheck, ShieldCheck, UserRound } from 'lucide-react'
import { BrandLogo } from '../components/Shared'

type LoginPageProps = { onLogin: (destination: 'cliente' | 'admin', role: string) => void }

const roles = [
  { id: 'admin', label: 'Administrador general', description: 'Vista completa de operación', icon: ShieldCheck, destination: 'admin' as const },
  { id: 'usa', label: 'Almacén USA', description: 'Recepción y valijas', icon: Boxes, destination: 'admin' as const },
  { id: 'rd', label: 'Almacén RD', description: 'Recepción y transferencias', icon: PackageCheck, destination: 'admin' as const },
  { id: 'branch', label: 'Encargado de sucursal', description: 'Operación local', icon: Building2, destination: 'admin' as const },
  { id: 'cash', label: 'Cajero', description: 'Entrega, cobro y cuadre', icon: CircleDollarSign, destination: 'admin' as const },
]

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [selectedRole, setSelectedRole] = useState('admin')
  const selected = roles.find((role) => role.id === selectedRole) ?? roles[0]

  return (
    <main className="login-page">
      <section className="login-story">
        <div className="login-story__inner">
          <BrandLogo inverse />
          <div className="login-copy">
            <span className="login-kicker"><i /> Demo interactiva</span>
            <h1>Logística clara.<br /><em>Entregas sin fricción.</em></h1>
            <p>Una sola plataforma para seguir cada paquete desde Miami hasta las manos de tu cliente.</p>
          </div>
          <div className="route-visual" aria-label="Ruta Miami a República Dominicana">
            <div className="route-point"><span>MIA</span><small>Almacén USA</small></div>
            <div className="route-line"><i /><i /><i /><i /></div>
            <div className="route-point route-point--active"><span>SDQ</span><small>Rep. Dominicana</small></div>
          </div>
          <div className="login-trust"><ShieldCheck size={19} /><span><strong>Operación centralizada</strong> · Trazabilidad en cada etapa</span></div>
        </div>
      </section>

      <section className="login-access">
        <div className="login-panel">
          <div className="mobile-brand"><BrandLogo /></div>
          <span className="eyebrow">Acceso de demostración</span>
          <h2>¿Cómo deseas explorar?</h2>
          <p className="login-intro">Selecciona un perfil. No necesitas contraseña.</p>

          <button className="client-entry" onClick={() => onLogin('cliente', 'Cliente')}>
            <span className="role-icon"><UserRound size={22} /></span>
            <span><strong>Entrar como cliente</strong><small>Casillero, paquetes y prealertas</small></span>
            <ArrowRight size={19} />
          </button>

          <div className="access-divider"><span>o explora la operación</span></div>

          <div className="role-grid" role="radiogroup" aria-label="Seleccionar rol operativo">
            {roles.map((role) => {
              const Icon = role.icon
              return (
                <button key={role.id} className={`role-option ${selectedRole === role.id ? 'is-selected' : ''}`} role="radio" aria-checked={selectedRole === role.id} onClick={() => setSelectedRole(role.id)}>
                  <Icon size={18} /><span><strong>{role.label}</strong><small>{role.description}</small></span>
                </button>
              )
            })}
          </div>

          <button className="btn btn--primary btn--block" onClick={() => onLogin(selected.destination, selected.label)}>
            Acceder como {selected.label} <ArrowRight size={18} />
          </button>
          <p className="demo-note"><MapPin size={14} /> Entorno demo · Datos simulados · BrodPaq Courier</p>
        </div>
      </section>
    </main>
  )
}
