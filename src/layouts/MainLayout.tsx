import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import clsx from 'clsx';
import { FaTachometerAlt, FaUser, FaCog, FaChevronDown, FaBuilding } from 'react-icons/fa';
import { useAuthStore } from '../store/authStore';

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState<{ [key: string]: boolean }>({});
  const { user, logout } = useAuthStore();

  const handleLogout = () => logout();

  // Menú con iconos pequeños
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: () => <FaTachometerAlt size={16} /> as React.ReactElement },
    { name: 'Perfil', path: '/perfil', icon: () => <FaUser size={16} /> as React.ReactElement },
    {
      name: 'Modulo de Seguros',
      icon: () => <FaCog size={16} /> as React.ReactElement,
      submenu: [
        { name: 'Seguros Colectivos', path: '/seguros/operaciones', icon: () => <FaBuilding size={16} /> as React.ReactElement },
      ],
    },
    {
      name: 'Configuración',
      icon: () => <FaCog size={16} /> as React.ReactElement,
      submenu: [
        { name: 'Usuarios', path: '/configuracion/usuarios' },
        { name: 'Roles', path: '/configuracion/roles' },
        { name: 'Empresas Aseguradoras', path: '/configuracion/empresas', icon: () => <FaBuilding size={16} /> as React.ReactElement },
        { name: 'Productos Colectivos', path: '/configuracion/productos', icon: () => <FaBuilding size={16} /> as React.ReactElement },
        { name: 'Cuestionario Producto', path: '/configuracion/bloques', icon: () => <FaBuilding size={16} /> as React.ReactElement },
        { name: 'Preguntas Cuestionario', path: '/configuracion/preguntas', icon: () => <FaBuilding size={16} /> as React.ReactElement },
        { name: 'Certificados Productos', path: '/configuracion/certificados', icon: () => <FaBuilding size={16} /> as React.ReactElement },
      ],
    },
  ];

  const toggleSubmenu = (name: string) => {
    setSubmenuOpen((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={clsx(
          'bg-gradient-to-b from-gray-800 to-gray-900 text-white w-64 py-5 px-3 absolute inset-y-0 left-0 transform transition-transform duration-300 ease-in-out z-50 shadow-lg',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'md:relative md:translate-x-0'
        )}
      >
        <h1 className="text-sm md:text-sm font-bold text-center mb-5 tracking-wide">Seguros</h1>
        <nav>
          {menuItems.map((item) => (
            <div key={item.name} className="mb-1">
              {!item.submenu ? (
                <NavLink
                  to={item.path!}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center py-2 px-3 rounded transition-all duration-300 text-sm',
                      isActive
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 font-semibold shadow-md'
                        : 'hover:bg-gradient-to-r hover:from-purple-500 hover:to-indigo-500 hover:shadow-md'
                    )
                  }
                >
                  <span className="mr-2">{item.icon()}</span>
                  {item.name}
                </NavLink>
              ) : (
                <>
                  <button
                    onClick={() => toggleSubmenu(item.name)}
                    className="flex items-center w-full justify-between py-2 px-3 rounded text-sm hover:bg-gray-700 transition-all duration-200"
                  >
                    <div className="flex items-center">
                      <span className="mr-2">{item.icon()}</span>
                      {item.name}
                    </div>
                    <FaChevronDown
                      className={clsx('transition-transform duration-200', submenuOpen[item.name] ? 'rotate-180' : '')}
                    />
                  </button>
                  {submenuOpen[item.name] && (
                    <div className="ml-6 mt-1 flex flex-col space-y-1">
                      {item.submenu.map((sub) => (
                        <NavLink
                          key={sub.name}
                          to={sub.path}
                          className={({ isActive }) =>
                            clsx(
                              'py-1 px-2 rounded text-sm transition-all duration-200',
                              isActive
                                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 font-semibold shadow-md'
                                : 'hover:bg-gradient-to-r hover:from-purple-500 hover:to-indigo-500 hover:shadow-md'
                            )
                          }
                        >
                          {sub.name}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Overlay móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Contenido principal */}
      {/* Contenido principal */}
      <div
        className={clsx(
          'flex-1 flex flex-col transition-all duration-300',
          sidebarOpen ? 'ml-64' : 'ml-0'
        )}
      >
        <header className="flex justify-between items-center bg-white shadow p-2 md:p-3 transition-all duration-300">
          <button
            className="md:hidden text-gray-700 text-lg hover:scale-105 transition-transform"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>

          <div>
            {user && (
              <span className="font-medium text-sm">
                {user.nombre} {user.apellido} ({user.perfil})
              </span>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors duration-200 text-sm"
          >
            Logout
          </button>
        </header>

        {/* Área de páginas */}
        <main className="flex-1 p-3 md:p-4 overflow-auto transition-all duration-300">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default MainLayout;
