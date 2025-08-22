'use client';

import React, { useState } from 'react';
import {
  User, Users, FileText, Building, UserCog, CheckSquare,
  Tag, Megaphone, Briefcase, Globe2, MapPin, Landmark, Star,LogOut,
  Moon, Sun
} from 'lucide-react';
import { FaCogs } from "react-icons/fa";

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

// 👇 Modal simple embebido
const Modal = ({ isOpen, onClose, children }: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;
  return (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-xl w-full max-w-7xl p-4 relative shadow-lg max-h-[100vh] overflow-y-auto">
      
      {/* Botón de cerrar en la esquina */}
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl font-bold"
      >
        ×
      </button>

      {/* Contenido del modal */}
      {children}

      {/* Botón Cancelar */}
      <div className="mt-6 flex justify-end">
        <button 
          onClick={onClose} 
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
        >
          Cancelar
        </button>
      </div>

    </div>
  </div>
);

};

const ComponentCards = () => {
  const [activeComponent, setActiveComponent] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [modoOscuro, setModoOscuro] = useState(false);
   const toggleProfileModal = () => setShowProfileModal(!showProfileModal);
  const toggleLogoutModal = () => setShowLogoutModal(!showLogoutModal);
 const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const toggleModoOscuro = () => setModoOscuro(!modoOscuro);

  const components = [
    { id: 'linea', icon: User, name: 'Línea', records: '12,450', queries: '8', value: '2,368', component: <Linea /> },
    { id: 'publico', icon: Users, name: 'Público Objetivo', records: '8,932', queries: '12', value: '1,868', component: <PublicoObjetivo /> },
    { id: 'requisitos', icon: FileText, name: 'Requisitos', records: '45,672', queries: '3', value: '5,268', component: <Requisitos /> },
    { id: 'entidad', icon: Building, name: 'Entidad Institución', records: '892,340', queries: '24', value: '12,868', component: <EntidadInstitucion /> },
    { id: 'rol', icon: UserCog, name: 'Rol', records: '2,340,567', queries: '1', value: '28,468', component: <Rol /> },
    { id: 'requisitos-sel', icon: CheckSquare, name: 'Requisitos Selección', records: '5,643', queries: '15', value: '890', component: <RequisitoSeleccion /> },
    { id: 'tipo', icon: Tag, name: 'Tipo', records: '12,450', queries: '8', value: '2,368', component: <Tipo /> },
    { id: 'convocatorias', icon: Megaphone, name: 'Convocatorias', records: '8,932', queries: '12', value: '1,868', component: <Convocatorias /> },
    { id: 'empresa', icon: Briefcase, name: 'Empresa', records: '45,672', queries: '3', value: '5,268', component: <Empresa /> },
    { id: 'usuario', icon: Globe2, name: 'Usuario', records: '892,340', queries: '24', value: '12,868', component: <Usuario /> },
    { id: 'ciudad', icon: MapPin, name: 'Ciudad', records: '2,340,567', queries: '1', value: '28,468', component: <Ciudad /> },
    { id: 'departamento', icon: Landmark, name: 'Departamento', records: '5,643', queries: '15', value: '890', component: <Departamento /> },
    { id: 'interes', icon: Star, name: 'Interés', records: '12,450', queries: '8', value: '2,368', component: <Interes /> }
  ];

  const handleCardClick = (id: string) => setActiveComponent(id);
  const handleCloseModal = () => setActiveComponent(null);

  const filteredComponents = components.filter(component =>
    component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    component.id.toLowerCase().includes(searchTerm.toLowerCase())
  );
// Reemplaza estos valores por los siguientes dentro de tu componente:
  /* Colores del modo oscuro inspirados en la imagen
  const bgColor = modoOscuro
    ? 'bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900'
    : 'bg-gray-50';

  const textColor = modoOscuro ? 'text-white' : 'text-gray-900';
  const cardBg = modoOscuro
    ? 'bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 text-white'
    : 'bg-white border border-gray-100 text-gray-800 shadow-sm';

  const sectionBg = modoOscuro
    ? 'bg-gray-900/80 backdrop-blur-sm border-gray-800 text-white'
    : 'bg-white border border-gray-200 text-gray-800';
*/

const bgColor = modoOscuro
  ? 'bg-gradient-to-br from-[#1D1D51FF] to-[#191939FF]'
  : 'bg-gray-50';


const textColor = modoOscuro ? 'text-white' : 'text-gray-900';
const cardBg = modoOscuro
  ? 'bg-white/5 backdrop-blur-md border border-white/10 shadow-md text-white'
  : 'bg-white border border-gray-100 text-gray-800 shadow-sm';


const sectionBg = modoOscuro
  ? 'bg-white/5 backdrop-blur-sm border border-white/10 text-white'
  : 'bg-white border border-gray-200 text-gray-800';


  
  return (
    <div className={`min-h-screen flex flex-col ${bgColor} ${textColor}`}>
      {/* Modal */}
      <Modal isOpen={!!activeComponent} onClose={handleCloseModal}>
        {components.find(c => c.id === activeComponent)?.component}
      </Modal>

      {/* Header */}
      <div className={`${sectionBg} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
    <span className=" text-white rounded-lg px-3 py-1 mr-3 text-sm">
      
    </span>
    <FaCogs className="text-[#39A900] mr-2" /> 
    Panel de Administración
  </h1>

          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar módulos..."
                className="pl-10 pr-4 py-2 rounded-lg border outline-none transition-all w-64 bg-white text-gray-800 focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#39A900] flex items-center justify-center text-white font-bold shadow-md overflow-hidden">
  A
</div>

            <button
              onClick={toggleModoOscuro}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
              title="Cambiar modo"
            >
              {modoOscuro ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-gray-600" />}
            </button>
             <button 
                      onClick={() => {
                        toggleProfileModal();
                        toggleLogoutModal();
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center text-red-500"
                    >
                      <LogOut className="h-4 w-4 mr-2" /> Cerrar sesión
                    </button>
          </div>
        </div>

      </div>
 {/* Modal de cierre de sesión */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg shadow-xl max-w-md w-full mx-4 ${modoOscuro ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-xl font-bold mb-4">Cerrar sesión</h3>
            <p className="mb-6">¿Estás seguro que deseas cerrar tu sesión?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={toggleLogoutModal}
                className={`px-4 py-2 rounded-lg border ${
                  modoOscuro 
                    ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
                    : 'bg-gray-100 border-gray-200 hover:bg-gray-200'
                }`}
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  // Aquí iría la lógica para cerrar sesión
                  toggleLogoutModal();
                }}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
      
  

      {/* Contenido */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {['1.2M', '48', '328', '3'].map((value, idx) => {
            const labels = ['Total Registros', 'Total Convocatorias', 'Nuevos Hoy', 'Alertas'];
            const icons = [FileText, Users, Star, Megaphone];
            const changes = ['12% vs último mes', '5% vs último mes', '8% vs ayer', '2 nuevas hoy'];
            const changeColor = idx === 3 ? 'text-red-500' : 'text-green-600';
            const Icon = icons[idx];

            return (
              <div key={idx} className={`${cardBg} p-6 rounded-xl shadow-sm border hover:shadow-md transition-all transform hover:-translate-y-1`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm opacity-70">{labels[idx]}</p>
                    <h3 className="text-2xl font-bold mt-1">{value}</h3>
                  </div>
                  <div className="p-3 bg-[#39A900]/10 rounded-lg">
                    <Icon className="text-[#39A900]" size={20} />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200/30">
                  <p className={`text-sm flex items-center ${changeColor}`}>
                    <span className="inline-block mr-1">{idx === 3 ? '↓' : '↑'}</span>
                    <span>{changes[idx]}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Módulos */}
        <h2 className="text-xl font-semibold mb-6">Módulos del Sistema</h2>
        {filteredComponents.length === 0 ? (
          <div className={`${cardBg} p-8 text-center shadow-sm rounded-xl`}>
            <p className="opacity-70">No se encontraron módulos que coincidan con "{searchTerm}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredComponents.map((component) => {
              const Icon = component.icon;
              return (
                <div
                  key={component.id}
                  onClick={() => handleCardClick(component.id)}
                  className={`${cardBg} rounded-xl border p-6 shadow-sm hover:shadow-lg transition-all cursor-pointer hover:border-[#39A900] hover:scale-105 transform duration-300 group`}
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-[#39A900]/10 rounded-lg mr-4 group-hover:bg-[#39A900]/20 transition-colors">
                      <Icon className="text-[#39A900] group-hover:scale-110 transform duration-300" size={22} />
                    </div>
                    <h3 className="font-semibold group-hover:text-[#39A900] transition-colors">{component.name}</h3>
                  </div>
                  <div className="space-y-2 text-sm opacity-80">
                    <p className="flex items-center">
                      <FileText className="w-4 h-4 mr-2" /> {component.records} registros
                    </p>
                    <p className="flex items-center">
                      <Users className="w-4 h-4 mr-2" /> {component.queries} consultas activas
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200/30 group-hover:border-[#39A900]/30">
                    <p className="text-xl font-semibold text-[#39A900] group-hover:scale-105 transform duration-300 inline-block">
                      ${component.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        
      </div>

      {/* Footer */}
      <footer className={`${sectionBg} py-6`}>
        <div className="max-w-7xl mx-auto px-6 text-sm text-center opacity-70">
          <p>© {new Date().getFullYear()} Sistema de Administración. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>

    
  );
};

export default ComponentCards;



