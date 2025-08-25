'use client';

import { useState } from 'react';

import { 
  FaUserPlus, FaTimes, FaSave, FaAlignLeft, FaLink, FaCalendarAlt, 
  FaBuilding, FaFileAlt, FaImage, FaTag, FaUsers,FaUser, FaMoneyBillWave, 
  FaExternalLinkAlt, FaHeart, FaBullseye, FaStickyNote, FaChevronDown ,FaGlobe
} from 'react-icons/fa';

interface Convocatoria {
  id: string;
  nombre: string;
  descripcion: string;
  recursos: string;
  link: string;
  fechaApertura: string;
  fechaCierre: string;
  nombrePagina: string;
  pagina: string;
  objetivos: string;
  observaciones: string;
  entidad: string;
  linea: string;
  publicoObjetivo: string;
  interes: string;
  usuario: string;
  imagen?: string;
}

interface ConvocatoriaModalProps {
  mostrarModal: boolean;
  cerrarModal: () => void;
  convocatoria: Convocatoria;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSaveConvocatoria: () => void;
  editingId: string | null;
    modoOscuro: boolean; // 🔹 nueva prop
}

export default function ConvocatoriaModal({
  mostrarModal,
  cerrarModal,
  convocatoria,
  handleInputChange,
  handleImageChange,
  handleSaveConvocatoria,
  editingId,
  modoOscuro,
}: ConvocatoriaModalProps) {
  if (!mostrarModal) return null;


  // 🔹 estilos condicionales
  const modalBg = modoOscuro ? 'bg-[#1a0526] text-white' : 'bg-white text-gray-900';
  const inputBg = modoOscuro
    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
    : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500';
  const footerBg = modoOscuro ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200';
  const cancelBtn = modoOscuro
    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
    : 'border-gray-300 text-gray-700 hover:bg-gray-100';
  const labelColor = modoOscuro ? 'text-gray-300' : 'text-gray-700';


  return (
   
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
    <div className={`${modalBg}bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden transform transition-all duration-300 scale-95 hover:scale-100 max-h-[90vh] overflow-y-auto`}>
      {/* Header con efecto gradiente */}
      <div className="bg-gradient-to-r from-[#39A900] to-[#2d8500] p-6 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-full">
            <FaUserPlus className="text-white text-xl" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            {editingId ? 'Editar Convocatoria' : 'Publicar Nueva Convocatoria'}
          </h2>
        </div>
        <button 
          className="text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-white/10"
          onClick={cerrarModal}
        >
          <FaTimes size={24} />
        </button>
      </div>

   {/* Body */}
<div className="p-6 space-y-4">
  {/* Primera fila - 2 columnas */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Nombre */}
    <div className="space-y-2">
      <label htmlFor="nombre" className={`text-sm font-medium ${labelColor}`}>
        Nombre*
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaFileAlt className="text-gray-400" />
        </div>
        <input
          type="text"
          id="nombre"
          name="nombre"
          required
          className={`w-full border rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] hover:shadow-md ${inputBg}`}
          placeholder="Nombre de la convocatoria"
        />
      </div>
    </div>

    {/* Entidad (select) */}
    <div className="space-y-2">
      <label htmlFor="entidad" className={`text-sm font-medium ${labelColor}`}>
        Entidad*
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaBuilding className="text-gray-400" />
        </div>
        <select
          id="entidad"
          name="entidad"
          required
          className={`w-full border rounded-xl pl-10 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] hover:shadow-md appearance-none ${inputBg}`}
        >
          <option value="">Seleccione una entidad</option>
          <option value="Entidad 1">Entidad 1</option>
          <option value="Entidad 2">Entidad 2</option>
          <option value="Entidad 3">Entidad 3</option>
        </select>
        <FaChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
      </div>
    </div>
  </div>

  {/* Segunda fila - 2 columnas */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Línea (select) */}
    <div className="space-y-2">
      <label htmlFor="linea" className={`text-sm font-medium ${labelColor}`}>
        Línea*
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaTag className="text-gray-400" />
        </div>
        <select
          id="linea"
          name="linea"
          required
          className={`w-full border rounded-xl pl-10 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] hover:shadow-md appearance-none ${inputBg}`}
        >
          <option value="">Seleccione una línea</option>
          <option value="Investigación">Investigación</option>
          <option value="Desarrollo">Desarrollo</option>
          <option value="Innovación">Innovación</option>
        </select>
        <FaChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
      </div>
    </div>

    {/* Público objetivo (select) */}
    <div className="space-y-2">
      <label htmlFor="publicoObjetivo" className={`text-sm font-medium ${labelColor}`}>
        Público objetivo*
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaUsers className="text-gray-400" />
        </div>
        <select
          id="publicoObjetivo"
          name="publicoObjetivo"
          required
          className={`w-full border rounded-xl pl-10 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] hover:shadow-md appearance-none ${inputBg}`}
        >
          <option value="">Seleccione público objetivo</option>
          <option value="Estudiantes">Estudiantes</option>
          <option value="Docentes">Docentes</option>
          <option value="Investigadores">Investigadores</option>
          <option value="Empresarios">Empresarios</option>
        </select>
        <FaChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
      </div>
    </div>
  </div>

  {/* Tercera fila - 2 columnas */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Fecha Apertura */}
    <div className="space-y-2">
      <label htmlFor="fechaApertura" className={`text-sm font-medium ${labelColor}`}>
        Fecha Apertura*
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaCalendarAlt className="text-gray-400" />
        </div>
        <input
          type="date"
          id="fechaApertura"
          name="fechaApertura"
          required
          className={`w-full border rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] hover:shadow-md ${inputBg}`}
        />
      </div>
    </div>

    {/* Fecha Cierre */}
    <div className="space-y-2">
      <label htmlFor="fechaCierre" className={`text-sm font-medium ${labelColor}`}>
        Fecha Cierre*
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaCalendarAlt className="text-gray-400" />
        </div>
        <input
          type="date"
          id="fechaCierre"
          name="fechaCierre"
          required
          className={`w-full border rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] hover:shadow-md ${inputBg}`}
        />
      </div>
    </div>
  </div>


{/* Cuarta fila - 2 columnas */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Recursos */}
  <div className="space-y-2">
    <label htmlFor="recursos" className={`flex items-center gap-3 text-sm font-medium ${labelColor}`}>
      <span>Recursos</span>
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FaMoneyBillWave className="text-gray-400" />
      </div>
      <input
        type="text"
        id="recursos"
        name="recursos"
        className={`w-full border rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] hover:shadow-md ${inputBg}`}
        placeholder="Ej: $10,000,000"
      />
    </div>
  </div>

  {/* Link */}
  <div className="space-y-2">
    <label htmlFor="link" className={`flex items-center gap-3 text-sm font-medium ${labelColor}`}>
      <span>Enlace</span>
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FaLink className="text-gray-400" />
      </div>
      <input
        type="url"
        id="link"
        name="link"
        className={`w-full border rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] hover:shadow-md ${inputBg}`}
        placeholder="https://ejemplo.com"
      />
    </div>
  </div>
</div>

{/* Quinta fila - 2 columnas */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Nombre Página */}
  <div className="space-y-2">
    <label htmlFor="nombrePagina" className={`flex items-center gap-3 text-sm font-medium ${labelColor}`}>
      <span>Nombre Página</span>
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FaGlobe className="text-gray-400" />
      </div>
      <input
        type="text"
        id="nombrePagina"
        name="nombrePagina"
        className={`w-full border rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] hover:shadow-md ${inputBg}`}
        placeholder="Nombre de la página web"
      />
    </div>
  </div>

  {/* Página */}
  <div className="space-y-2">
    <label htmlFor="pagina" className={`flex items-center gap-3 text-sm font-medium ${labelColor}`}>
      <span>Página</span>
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FaExternalLinkAlt className="text-gray-400" />
      </div>
      <input
        type="url"
        id="pagina"
        name="pagina"
        className={`w-full border rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] hover:shadow-md ${inputBg}`}
        placeholder="https://pagina.com"
      />
    </div>
  </div>
</div>

{/* Sexta fila - 2 columnas */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Interés (select) */}
  <div className="space-y-2">
    <label htmlFor="interes" className={`flex items-center gap-3 text-sm font-medium ${labelColor}`}>
      <span>Interés</span>
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FaHeart className="text-gray-400" />
      </div>
      <select
        id="interes"
        name="interes"
        className={`w-full border rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] hover:shadow-md appearance-none ${inputBg}`}
      >
        <option value="">Nivel de interés</option>
        <option value="Bajo">Bajo</option>
        <option value="Medio">Medio</option>
        <option value="Alto">Alto</option>
      </select>
      <FaChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
    </div>
  </div>

  {/* Usuario */}
  <div className="space-y-2">
    <label htmlFor="usuario" className={`flex items-center gap-3 text-sm font-medium ${labelColor}`}>
      <span>Usuario</span>
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FaUser className="text-gray-400" />
      </div>
      <input
        type="text"
        id="usuario"
        name="usuario"
        className={`w-full border rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] hover:shadow-md ${inputBg}`}
        placeholder="Usuario responsable"
      />
    </div>
  </div>
</div>


      {/* Descripción */}
<div className="space-y-2">
  <label htmlFor="descripcion" className={`flex items-center gap-3 text-sm font-medium ${labelColor}`}>
    <span>Descripción*</span>
  </label>
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
      <FaAlignLeft className="text-gray-400" />
    </div>
    <textarea
      id="descripcion"
      name="descripcion"
      required
      className={`w-full border rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 
                  focus:ring-[#39A900] focus:border-[#39A900] hover:shadow-md min-h-[100px] ${inputBg}`}
      placeholder="Descripción detallada de la convocatoria"
    />
  </div>
</div>

{/* Objetivos */}
<div className="space-y-2">
  <label htmlFor="objetivos" className={`flex items-center gap-3 text-sm font-medium ${labelColor}`}>
    <span>Objetivos</span>
  </label>
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
      <FaBullseye className="text-gray-400" />
    </div>
    <textarea
      id="objetivos"
      name="objetivos"
      className={`w-full border rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 
                  focus:ring-[#39A900] focus:border-[#39A900] hover:shadow-md min-h-[80px] ${inputBg}`}
      placeholder="Objetivos de la convocatoria"
    />
  </div>
</div>

{/* Observaciones */}
<div className="space-y-2">
  <label htmlFor="observaciones" className={`flex items-center gap-3 text-sm font-medium ${labelColor}`}>
    <span>Observaciones</span>
  </label>
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
      <FaStickyNote className="text-gray-400" />
    </div>
    <textarea
      id="observaciones"
      name="observaciones"
      className={`w-full border rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 
                  focus:ring-[#39A900] focus:border-[#39A900] hover:shadow-md min-h-[80px] ${inputBg}`}
      placeholder="Observaciones adicionales"
    />
  </div>
</div>

{/* Imagen */}
<div className="space-y-2">
  <label className={`flex items-center gap-3 text-sm font-medium ${labelColor}`}>
    <span>Imagen</span>
  </label>
  <div className="relative">
    <input 
      type="file"
      accept="image/*"
      onChange={handleImageChange}
      className={`w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 
                  focus:ring-[#39A900] focus:border-[#39A900] hover:shadow-md 
                  file:mr-4 file:py-1 file:px-4 file:rounded-lg file:border-0 file:text-sm 
                  file:font-semibold file:bg-[#39A900]/10 file:text-[#39A900] 
                  hover:file:bg-[#39A900]/20 ${inputBg}`}
    />
  </div>
</div>
</div>
      {/* Footer con botones mejorados */}
      <div className={`${footerBg}bg-gray-50 px-8 py-4 flex justify-between items-center border-t border-gray-200 sticky bottom-0`}>
         <button
            className={`flex items-center gap-2 px-6 py-3 border rounded-xl transition-colors hover:shadow-md ${cancelBtn}`}
            onClick={cerrarModal}
          >
            <FaTimes size={18} />
            <span>Cancelar</span>
          </button>
        <button
          className="flex items-center gap-2 px-6 py-2 bg-[#39A900] text-white rounded-xl hover:bg-[#2d8500] transition-colors shadow-md hover:shadow-lg"
          onClick={handleSaveConvocatoria}
        >
          <FaSave size={16} />
          <span>{editingId ? 'Guardar Cambios' : 'Publicar Convocatoria'}</span>
        </button>
      </div>
    </div>
  </div>
)}
  