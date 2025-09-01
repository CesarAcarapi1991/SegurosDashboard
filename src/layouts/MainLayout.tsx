import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import clsx from 'clsx';
import { 
  FaUser, FaCog, FaChevronDown, FaBuilding,
  FaSignOutAlt, FaRegBell, FaBars, FaChartLine, FaUserShield, FaClipboardList, FaShieldAlt, 
  FaFileContract, FaQuestionCircle, FaCertificate
} from 'react-icons/fa';
import { useAuthStore } from '../store/authStore';
import logo from '../assets/logo.png';

const colors = {
  primary: {
    main: '#00A5B5',      // Versión más suave del #0097a6
    light: '#33C5D2',     // Tono claro más suave
    dark: '#007D87',      // Tono oscuro más suave
    bg: 'rgba(0, 165, 181, 0.08)', // Fondo más transparente
  },
  secondary: {
    main: '#2979BC',      // Versión más suave del #09589f
    light: '#4B9FE1',     // Tono claro más suave
    dark: '#1B5C94',      // Tono oscuro más suave
    bg: 'rgba(41, 121, 188, 0.08)', // Fondo más transparente
  },
  neutral: {
    800: '#2C3E50',       // Tono más suave para el header
    900: '#1E2A3B',       // Tono más suave para el sidebar
  },
  gradients: {
    sidebar: 'linear-gradient(180deg, #2C3E50 0%, #34495E 100%)',
    header: 'linear-gradient(90deg, rgba(41, 121, 188, 0.95) 0%, rgba(0, 165, 181, 0.95) 100%)',
    button: 'linear-gradient(135deg, #33C5D2 0%, #4B9FE1 100%)',
  },
  menu: {
    main: '#f5f5f5',
    active: '#0097a6',
    hover: 'rgba(0, 0, 0, 0.05)',
    text: '#4a5568',
    activeText: '#ffffff',
    border: '#e2e8f0',
    gradient: 'linear-gradient(110deg, #0097a6 0%, #09589f 100%)',
  }
};

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState<{ [key: string]: boolean }>({});
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuthStore();

  const handleLogout = () => logout();

  
  // Menú con iconos pequeños
  const menuItems = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: () => <FaChartLine size={20} className="text-primary-light" />
    },
    // { 
    //   name: 'Perfil', 
    //   path: '/perfil', 
    //   icon: () => <FaUserShield size={20} className="text-primary-light" />
    // },
    {
      name: 'Modulo de Seguros',
      icon: () => <FaClipboardList size={20} className="text-primary-light" />,
      submenu: [
        { 
          name: 'Seguros Colectivos', 
          path: '/seguros/operaciones', 
          icon: () => <FaShieldAlt size={18} className="text-primary-light" />
        },
      ],
    },
    {
      name: 'Modulo de Caja',
      icon: () => <FaClipboardList size={20} className="text-primary-light" />,
      submenu: [
        { 
          name: 'Cobro de Seguro', 
          path: '/cobro/cobro_seguro', 
          icon: () => <FaShieldAlt size={18} className="text-primary-light" />
        },
      ],
    },
    {
      name: 'Reportes',
      icon: () => <FaClipboardList size={20} className="text-primary-light" />,
      submenu: [
        { 
          name: 'Seguros Colectivos', 
          path: '/reportes/reporte_operaciones', 
          icon: () => <FaShieldAlt size={18} className="text-primary-light" />
        },
      ],
    },
    {
      name: 'Configuración',
      icon: () => <FaCog size={20} className="text-primary-light" />,
      submenu: [
        // { name: 'Usuarios', path: '/configuracion/usuarios', icon: () => <FaUser size={18} /> },
        // { name: 'Roles', path: '/configuracion/roles', icon: () => <FaUserShield size={18} /> },
        { name: 'Empresas Aseguradoras', path: '/configuracion/empresas', icon: () => <FaBuilding size={18} /> },
        { name: 'Productos Colectivos', path: '/configuracion/productos', icon: () => <FaFileContract size={18} /> },
        { name: 'Cuestionario Producto', path: '/configuracion/bloques', icon: () => <FaClipboardList size={18} /> },
        { name: 'Preguntas Cuestionario', path: '/configuracion/preguntas', icon: () => <FaQuestionCircle size={18} /> },
        { name: 'Certificados Productos', path: '/configuracion/certificados', icon: () => <FaCertificate size={18} /> },
      ],
    },
  ];

  const toggleSubmenu = (name: string) => {
    setSubmenuOpen((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  // Agregar función para cerrar menú en móvil
  const handleNavigation = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar con gradiente más suave */}
      <aside
        className={clsx(
          'w-56 fixed inset-y-0 left-0 transform transition-all duration-300 ease-in-out z-50',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'md:relative md:translate-x-0'
        )}
        style={{
          backgroundColor: colors.menu.main,
          borderRight: `1px solid ${colors.menu.border}`
        }}
      >
        {/* Logo Container */}
        <div className="flex items-center justify-center h-14 border-b bg-gray-700">
          <img
            src={logo}
            alt="Diaconía Logo"
            className="h-8 object-contain"
          />
        </div>

        {/* Menu Navigation con tipografía mejorada */}
        <nav className="py-1 px-1.5 font-sans">
          {menuItems.map((item) => (
            <div key={item.name} className="mb-0.5">
              {!item.submenu ? (
                <NavLink
                  to={item.path!}
                  onClick={handleNavigation}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center h-8 px-2.5 rounded-md transition-all duration-200',
                      'text-[13px] font-medium tracking-wide',
                      isActive
                        ? 'text-white font-medium shadow-sm bg-[#0097a6]'
                        : `text-gray-600 hover:bg-gray-200`
                    )}
                >
                  <span className="text-base mr-2">{item.icon()}</span>
                  <span className="font-medium tracking-wide">{item.name}</span>
                </NavLink>
              ) : (
                <>
                  <button
                    onClick={() => toggleSubmenu(item.name)}
                    className={clsx(
                      "w-full flex items-center justify-between h-8 px-2.5 rounded-md transition-colors text-xs",
                      submenuOpen[item.name]
                        ? 'bg-gray-200 text-gray-800'
                        : 'text-gray-600 hover:bg-gray-100'
                    )}
                  >
                    <div className="flex items-center">
                      <span className="text-base mr-2 opacity-90">{item.icon()}</span>
                      <span className="font-medium tracking-wide">{item.name}</span>
                    </div>
                    <FaChevronDown className={clsx('w-3 h-3 transform transition-transform opacity-75', 
                      submenuOpen[item.name] ? 'rotate-180' : ''
                    )} />
                  </button>
                  {submenuOpen[item.name] && (
                    <div className="ml-2 pl-2 mt-0.5 border-l border-gray-200">
                      {item.submenu.map((sub) => (
                        <NavLink
                          key={sub.name}
                          to={sub.path}
                          onClick={handleNavigation}
                          className={({ isActive }) =>
                            clsx(
                              'flex items-center h-7 px-2.5 rounded-md text-[11px] transition-colors',
                              isActive
                                ? 'text-white bg-[#0ea8b9] font-medium'
                                : 'text-gray-600 hover:bg-gray-100'
                            )
                          }
                        >
                          {sub.icon && (
                            <span className="text-sm mr-1.5 opacity-75">
                              {sub.icon()}
                            </span>
                          )}
                          <span className="tracking-wide">{sub.name}</span>
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

      {/* Overlay para cerrar menú en móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header con nuevo fondo */}
        <header className="h-14 shadow-sm z-30 bg-gray-700">
          <div className="flex items-center justify-end h-full px-4 mx-auto">
            <div className="flex items-center space-x-6">
              {/* Mobile menu button - moved to the left */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="absolute left-4 p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors md:hidden"
              >
                <FaBars className="h-5 w-5" />
              </button>

              {/* Notifications */}
              <button className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors relative">
                <FaRegBell className="h-5 w-5" />
                <span 
                  className="absolute top-1 right-1 w-2 h-2 rounded-full"
                  style={{ backgroundColor: colors.primary.light }}
                />
              </button>

              {/* Divider */}
              <div className="h-8 w-px bg-white/10" />

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
                >
                  <div className="hidden md:block text-right">
                    <div className="text-sm font-medium">{user?.nombre} {user?.apellido}</div>
                    <div className="text-xs text-white/70">{user?.perfil}</div>
                  </div>
                  <div 
                    className="w-9 h-9 rounded-full flex items-center justify-center shadow-sm text-white text-sm font-medium"
                    style={{ 
                      background: colors.gradients.button,
                    }}
                  >
                    {user?.nombre?.[0]}{user?.apellido?.[0]}
                  </div>
                  <FaChevronDown className={clsx(
                    'w-4 h-4 transition-transform duration-200',
                    showUserMenu ? 'rotate-180' : ''
                  )} />
                </button>

                {/* User Dropdown con nueva paleta de colores */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3 mb-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium"
                          style={{ 
                            background: `linear-gradient(135deg, #0097a6, #09589f)`
                          }}
                        >
                          {user?.nombre?.[0]}{user?.apellido?.[0]}
                        </div>
                        <div>
                          <div className="font-medium text-[#09589f]">{user?.nombre} {user?.apellido}</div>
                          <div className="text-sm text-[#0097a6]">{user?.correo}</div>
                        </div>
                      </div>
                      <div 
                        className="text-xs font-medium px-2 py-1 rounded text-white inline-block"
                        style={{ background: `linear-gradient(to right, #0097a6, #09589f)` }}
                      >
                        {user?.perfil}
                      </div>
                    </div>
                    <div className="px-4 py-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-3 py-2 text-sm text-white rounded-lg transition-colors"
                        style={{ 
                          background: `linear-gradient(to right, #0097a6, #09589f)`
                        }}
                      >
                        <FaSignOutAlt className="mr-2" />
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-gray-300/50 p-4"> 
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;