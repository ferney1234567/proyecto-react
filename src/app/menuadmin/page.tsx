
'use client';

import React, { useState } from 'react';
import {
  User, Users, FileText, Building, UserCog, CheckSquare,
  Tag, Megaphone, Briefcase, Globe2, MapPin, Landmark, Star, LogOut,
  Moon, Sun, Search, Settings, Bell, Activity, TrendingUp
} from 'lucide-react';
import { FaCheckCircle, FaClipboardList } from 'react-icons/fa';
import Linea from '../components/linea/linea';
import PublicoObjetivo from '../components/publicoObjetivo/PublicoObjetivo';
import Requisitos from '../components/requisitos/Requisitos';
import EntidadInstitucion from '../components/entidadInstitucion/EntidadInstitucion';
import Rol from '../components/rol/rol';
import RequisitoSeleccion from '../components/requisitosSeleccion/RequisitoSeleccion';
import Tipo from '../components/tipo/Tipo';
import Convocatorias from '../components/convocatorias/convocatorias';
import Empresa from '../components/empresa/Empresa';
import Usuario from '../components/usuario/Usuario';
import Ciudad from '../components/cuidad/Cuidad';
import Departamento from '../components/departamento/Departamento';
import Interes from '../components/intereses/Intereses';
import Chequeo from '../components/checkeo/checkeo';
import ConvocatoriaHistorial from '../components/convocatoriaHistorial/convocatoriaHistorial';
import ProfileAvatar from '../components/modaluserAdmin/modalAdmin';

// Modal recibe modoOscuro como prop
const Modal = ({ isOpen, onClose, children, modoOscuro }: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  modoOscuro: boolean;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div
        className={`rounded-xl w-full max-w-7xl p-4 relative shadow-lg max-h-[100vh] overflow-y-auto transition-colors duration-500 
          ${modoOscuro 
            ? 'bg-[#1a0526] text-white border border-white/20' 
            : 'bg-white text-gray-900 border border-gray-200'}`}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 text-2xl font-bold transition-colors ${
            modoOscuro ? 'text-gray-300 hover:text-red-400' : 'text-gray-500 hover:text-red-500'
          }`}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};


const ComponentesCards = () => {
  const [activeComponent, setActiveComponent] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [modoOscuro, setModoOscuro] = useState(false);
  const toggleProfileModal = () => setShowProfileModal(!showProfileModal);
  const toggleLogoutModal = () => setShowLogoutModal(!showLogoutModal);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const toggleModoOscuro = () => setModoOscuro(!modoOscuro);

const colorPalette = [
  'from-blue-500 to-blue-600',
  'from-purple-500 to-purple-600',
  'from-emerald-500 to-emerald-600',
  'from-orange-500 to-orange-600',
  'from-rose-500 to-rose-600',
  'from-teal-500 to-teal-600',
  'from-indigo-500 to-indigo-600',
  'from-pink-500 to-pink-600',
  'from-amber-500 to-amber-600',
  'from-cyan-500 to-cyan-600',
  'from-violet-500 to-violet-600',
  'from-lime-500 to-lime-600',
  'from-red-500 to-red-600',
  'from-green-500 to-green-600',
  'from-yellow-500 to-yellow-600',
  'from-fuchsia-500 to-fuchsia-600'
];

const components = [
{ 
    id: 'linea', icon: User,  name: 'Línea Aplicable',records: '8,932', queries: '12', value: '1,868', component: (m: boolean) => <Linea modoOscuro={m} /> },
  { id: 'publico', icon: Users, name: 'Público Objetivo', records: '8,932', queries: '12', value: '1,868', component: (m: boolean) => <PublicoObjetivo modoOscuro={m} /> },
  { id: 'requisitos', icon: FileText, name: 'Requisitos', records: '45,672', queries: '3', value: '5,268', component: (m: boolean) => <Requisitos modoOscuro={m} /> },
  { id: 'entidad', icon: Building, name: 'Entidad Institución', records: '892,340', queries: '24', value: '12,868', component: (m: boolean) => <EntidadInstitucion modoOscuro={m} /> },
  { id: 'rol', icon: UserCog, name: 'Rol', records: '2,340,567', queries: '1', value: '28,468', component:  (m: boolean) => <Rol modoOscuro={m} /> },
  { id: 'requisitos-sel', icon: CheckSquare, name: 'Requisitos Selección', records: '5,643', queries: '15', value: '890', component:  (m: boolean) => <RequisitoSeleccion modoOscuro={m} /> },
  { id: 'tipo', icon: Tag, name: 'Tipo Requisitos', records: '12,450', queries: '8', value: '2,368', component:  (m: boolean) => <Tipo modoOscuro={m} /> },
  { id: 'convocatorias', icon: Megaphone, name: 'Convocatorias', records: '8,932', queries: '12', value: '1,868', component:  (m: boolean) => <Convocatorias modoOscuro={m} /> },
  { id: 'empresa', icon: Briefcase, name: 'Empresa', records: '45,672', queries: '3', value: '5,268', component:  (m: boolean) => <Empresa modoOscuro={m} /> },
  { id: 'usuario', icon: Globe2, name: 'Usuario', records: '892,340', queries: '24', value: '12,868', component:  (m: boolean) => <Usuario modoOscuro={m} /> },
  { id: 'ciudad', icon: MapPin, name: 'Ciudad', records: '2,340,567', queries: '1', value: '28,468', component:  (m: boolean) => <Ciudad modoOscuro={m} /> },
  { id: 'departamento', icon: Landmark, name: 'Departamento', records: '5,643', queries: '15', value: '890', component:  (m: boolean) => <Departamento modoOscuro={m} /> },
  { id: 'interes', icon: Star, name: 'Interés', records: '12,450', queries: '8', value: '2,368',component:  (m: boolean) => <Interes modoOscuro={m} /> },
  { id: 'checkeo', icon: FaCheckCircle, name: 'checkeo', records: '5,643', queries: '15', value: '890',component:  (m: boolean) => <Chequeo modoOscuro={m} /> },
  { id: 'convocatoriaHistorial', icon: FaClipboardList, name: 'convocatoria Historial', records: '12,450', queries: '8', value: '2,368', component:  (m: boolean) => <ConvocatoriaHistorial modoOscuro={m} /> },
].map((component, index) => ({
  ...component,
  color: colorPalette[index % colorPalette.length]
}));
  
  const handleCardClick = (id: string) => setActiveComponent(id);
  const handleCloseModal = () => setActiveComponent(null);

  const filteredComponents = components.filter(component =>
    component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    component.id.toLowerCase().includes(searchTerm.toLowerCase())
  );
const bgColor = modoOscuro
  ? 'bg-gradient-to-br from-[#0C0212] via-[#1a0526] to-[#0C0212]'
  : 'bg-gray-50';

const textColor = modoOscuro ? 'text-white' : 'text-gray-900';
const cardBg = modoOscuro
  ? 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:border-[#39A900]/50'
  : 'bg-white border border-gray-100 text-gray-800 shadow-sm';


const sectionBg = modoOscuro
  ? 'bg-[#1F0C2AFF] border-[#1a0526] text-white'
  : 'bg-white border border-gray-200 text-gray-800';






  return (
    
  <div className={`min-h-screen transition-all duration-700 ${bgColor} ${textColor}`}>
    {/* Background pattern */}
    <div className="fixed inset-0 opacity-10">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-y-12 transform"></div>
    </div>

<Modal isOpen={!!activeComponent} onClose={handleCloseModal} modoOscuro={modoOscuro}>
  {(() => {
    const comp = components.find(c => c.id === activeComponent);
    if (!comp) return null;
    
    // Si el componente es una función, pasarle modoOscuro
    if (typeof comp.component === 'function') {
      return comp.component(modoOscuro);
    }
    
    // Si es un elemento JSX, renderizarlo directamente
    return comp.component;
  })()}
</Modal>


    {/* Header */}
    <header className={`${sectionBg} shadow-xl relative z-10 transition-all duration-500`}>
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex justify-between items-center">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-[#39A900] to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Settings className="text-white w-6 h-6" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#39A900] to-emerald-600 bg-clip-text text-transparent">
                Panel de Administración
              </h1>
              <p className="text-sm opacity-70">Sistema de gestión integral</p>
            </div>
          </div>

          {/* Search and Controls */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#39A900] transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Buscar módulos..."
                className={`pl-10 pr-4 py-2 rounded-lg border outline-none transition-all w-64 ${
                  modoOscuro 
                    ? 'bg-white/10 border-white/20 text-white focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900]' 
                    : 'bg-white text-gray-800 focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900]'
                }`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative group">
              <button
                onClick={() => setShowProfileModal(true)}
                className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#39A900] to-emerald-600 flex items-center justify-center text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group-hover:rotate-3"
              >
                A
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleModoOscuro}
              className={`p-3 rounded-2xl transition-all duration-500 hover:scale-110 ${
                modoOscuro 
                  ? 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400' 
                  : 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-600'
              }`}
              title="Cambiar modo"
            >
              {modoOscuro ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Logout Button */}
            <button 
              onClick={toggleLogoutModal}
              className="p-3 rounded-2xl bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-all duration-300 hover:scale-110"
              title="Cerrar sesión"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>

{/* Main Content */}
<main className="max-w-7xl mx-auto px-6 py-8 relative z-10">
  {/* Statistics Cards */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
    {[
      { value: '1.2M', label: 'Total Registros', icon: FileText, change: '+12%', changeType: 'increase', color: 'from-blue-500 to-cyan-500' },
      { value: '48', label: 'Total Convocatorias', icon: Users, change: '+5%', changeType: 'increase', color: 'from-purple-500 to-pink-500' },
      { value: '328', label: 'Nuevos Hoy', icon: Star, change: '+8%', changeType: 'increase', color: 'from-emerald-500 to-teal-500' },
      { value: '3', label: 'Alertas', icon: Bell, change: '+2', changeType: 'alert', color: 'from-orange-500 to-red-500' },
    ].map((stat, idx) => {
      const Icon = stat.icon;
      return (
        <div key={idx} className={`${cardBg} p-6 rounded-3xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 group relative overflow-hidden`}>
          {/* Background gradient effect */}
          <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} rounded-full -translate-y-8 translate-x-8 opacity-10 group-hover:opacity-20 transition-opacity duration-500`}></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm opacity-70 mb-1">{stat.label}</p>
                <h3 className={`text-3xl font-bold ${modoOscuro ? 'text-white' : 'text-gray-900'}`}>
                  {stat.value}
                </h3>
              </div>
              <div className={`p-4 bg-gradient-to-r ${stat.color} rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                <Icon className="text-white w-6 h-6" />
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-200/30 dark:border-white/10">
              <div className={`flex items-center text-sm ${
                stat.changeType === 'alert' ? 'text-red-500' : 'text-emerald-500'
              }`}>
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="font-medium">{stat.change}</span>
              </div>
              <span className="text-xs opacity-50">vs último período</span>
            </div>
          </div>
        </div>
      );
    })}
  </div>

      {/* Modules Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Módulos del Sistema</h2>
            <p className="opacity-70">Gestiona todos los componentes de la plataforma</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm opacity-70">
              <Activity className="w-4 h-4" />
              <span>{filteredComponents.length} módulos disponibles</span>
            </div>
          </div>
        </div>

        {filteredComponents.length === 0 ? (
          <div className={`${cardBg} p-12 text-center rounded-3xl`}>
            <Search className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <h3 className="text-xl font-semibold mb-2">No se encontraron módulos</h3>
            <p className="opacity-70">No hay módulos que coincidan con "{searchTerm}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredComponents.map((component) => {
              const Icon = component.icon;
              return (
                <div
                  key={component.id}
                  onClick={() => handleCardClick(component.id)}
                  className={`${cardBg} rounded-3xl p-6 hover:shadow-2xl transition-all duration-500 cursor-pointer hover:border-[#39A900]/50 transform hover:-translate-y-3 hover:scale-105 group relative overflow-hidden`}
                >
                  {/* Hover gradient effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${component.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                  
                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-center mb-6">
                      <div className={`p-4 bg-gradient-to-r ${component.color} rounded-2xl mr-4 shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                        <Icon className="text-white w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg group-hover:text-[#39A900] transition-colors duration-300">
                          {component.name}
                        </h3>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center opacity-70">
                          <FileText className="w-4 h-4 mr-2" />
                          <span>Registros</span>
                        </div>
                        <span className="font-semibold">{component.records}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center opacity-70">
                          <Activity className="w-4 h-4 mr-2" />
                          <span>Consultas activas</span>
                        </div>
                        <span className="font-semibold">{component.queries}</span>
                      </div>
                    </div>

                    {/* Value */}
                    <div className="pt-4 border-t border-gray-200/30 dark:border-white/10 group-hover:border-[#39A900]/30 transition-colors duration-300">
                      <div className="flex items-center justify-between">
                        <span className="text-sm opacity-70">Valor total</span>
                        <span className="text-2xl font-bold bg-gradient-to-r from-[#39A900] to-emerald-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                          ${component.value}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <ProfileAvatar isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
          </div>
        )}
      </div>
    </main>

    {/* Footer */}
    <footer className={`${sectionBg} py-8 relative z-10`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center">
          <p className="opacity-70 mb-2">© {new Date().getFullYear()} Sistema de Administración</p>
          <p className="text-sm opacity-50">Desarrollado con  para una gestión eficiente</p>
        </div>
      </div>
    </footer>
  </div>
  );
};

export default ComponentesCards;