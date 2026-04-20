import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import '../estilos.css'

export const Route = createRootRoute({
  component: () => (
    <>
      <nav className="navbar">
        <Link to="/" className="nav-link">Inicio</Link>
        <Link to="/club" className="nav-link">El Club</Link>
        <Link to="/contacto" className="nav-link">Contacto</Link>
      </nav>

      <main className="contenedor-principal">
        <Outlet />
      </main>
    </>
  ),
})