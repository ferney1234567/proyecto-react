'use client';

import { FaBuilding,FaChevronDown,FaAlignLeft,FaSave,FaArrowLeft, FaFileAlt, FaIdCard, FaMapMarkerAlt, FaCity, FaBriefcase, FaGlobe, FaPhone, FaUsers, FaIndustry, FaClock, FaFileContract, FaUserTie, FaUser, FaPhoneAlt, FaMobileAlt, FaEnvelope, FaTimes } from 'react-icons/fa';
import { Empresa } from './Empresa';

interface EmpresaModalProps {
  mostrarModal: boolean;
  cerrarModal: () => void;
  nuevaEmpresa: Empresa;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCrear: () => void;
  editandoId: string | null;
}

export default function EmpresaModal({
  mostrarModal,
  cerrarModal,
  nuevaEmpresa,
  handleChange,
  handleCrear,
  editandoId
}: EmpresaModalProps) {
  if (!mostrarModal) return null;

  return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden transform transition-all duration-300 scale-95 hover:scale-100">
      {/* Header con efecto gradiente */}
      <div className="bg-gradient-to-r from-[#39A900] to-[#2d8500] p-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-full">
            <FaBuilding className="text-white text-xl" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            {editandoId ? 'Editar Empresa' : 'Crear Nueva Empresa'}
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
      <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
        {/* Primera fila - 2 columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
{/* Nombre */}
<div className="space-y-2">
  <label htmlFor="nombre" className="text-sm font-medium text-gray-700">
    Nombre*
  </label>
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <FaFileAlt className="text-gray-400" />
    </div>
    <input
      type="text"
      name="nombre"
      id="nombre"
      className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2 
                 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] 
                 hover:shadow-md text-gray-800"
      placeholder="Nombre de la empresa"
      value={nuevaEmpresa.nombre}
      onChange={handleChange}
      required
    />
  </div>
</div>

{/* NIT */}
<div className="space-y-2">
  <label htmlFor="nit" className="text-sm font-medium text-gray-700">
    NIT*
  </label>
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <FaIdCard className="text-gray-400" />
    </div>
    <input
      type="text"
      name="nit"
      id="nit"
      className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2 
                 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] 
                 hover:shadow-md text-gray-800"
      placeholder="NIT de la empresa"
      value={nuevaEmpresa.nit}
      onChange={handleChange}
      required
    />
  </div>
</div>

{/* Dirección */}
<div className="space-y-2">
  <label htmlFor="direccion" className="text-sm font-medium text-gray-700">
    Dirección*
  </label>
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <FaMapMarkerAlt className="text-gray-400" />
    </div>
    <input
      type="text"
      name="direccion"
      id="direccion"
      className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2 
                 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] 
                 hover:shadow-md text-gray-800"
      placeholder="Dirección de la empresa"
      value={nuevaEmpresa.direccion}
      onChange={handleChange}
      required
    />
  </div>
</div>

{/* Ciudad (select) */}
<div className="space-y-2">
  <label htmlFor="ciudad" className="text-sm font-medium text-gray-700">
    Ciudad*
  </label>
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <FaCity className="text-gray-400" />
    </div>
    <select
      name="ciudad"
      id="ciudad"
      className="w-full border border-gray-300 rounded-xl pl-10 pr-10 py-2 
                 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] 
                 hover:shadow-md appearance-none text-gray-800"
      value={nuevaEmpresa.ciudad}
      required
    >
      <option value="">Seleccione una ciudad</option>
      <option value="Bogotá">Bogotá</option>
      <option value="Medellín">Medellín</option>
      <option value="Cali">Cali</option>
    </select>
    <FaChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
  </div>
</div>

{/* Razón Social */}
<div className="space-y-2">
  <label htmlFor="razonSocial" className="text-sm font-medium text-gray-700">
    Razón Social
  </label>
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <FaBriefcase className="text-gray-400" />
    </div>
    <input
      type="text"
      name="razonSocial"
      id="razonSocial"
      className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2 
                 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] 
                 hover:shadow-md text-gray-800"
      placeholder="Razón social de la empresa"
      value={nuevaEmpresa.razonSocial}
      onChange={handleChange}
    />
  </div>
</div>

{/* Página Web */}
<div className="space-y-2">
  <label htmlFor="paginaWeb" className="text-sm font-medium text-gray-700">
    Página Web
  </label>
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <FaGlobe className="text-gray-400" />
    </div>
    <input
      type="url"
      name="paginaWeb"
      id="paginaWeb"
      className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2 
                 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] 
                 hover:shadow-md text-gray-800"
      placeholder="https://ejemplo.com"
      value={nuevaEmpresa.paginaWeb}
      onChange={handleChange}
    />
  </div>
</div>
</div>
{/* Tercera fila - 2 columnas */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Razón Social */}
  <div className="space-y-2">
    <label htmlFor="razonSocial" className="text-sm font-medium text-gray-700">
      Razón Social
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FaBriefcase className="text-gray-400" />
      </div>
      <input
        type="text"
        name="razonSocial"
        id="razonSocial"
        className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2 
                   focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] 
                   hover:shadow-md text-gray-800"
        placeholder="Razón social de la empresa"
        value={nuevaEmpresa.razonSocial}
        onChange={handleChange}
      />
    </div>
  </div>

  {/* Página Web */}
  <div className="space-y-2">
    <label htmlFor="paginaWeb" className="text-sm font-medium text-gray-700">
      Página Web
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FaGlobe className="text-gray-400" />
      </div>
      <input
        type="url"
        name="paginaWeb"
        id="paginaWeb"
        className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2 
                   focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] 
                   hover:shadow-md text-gray-800"
        placeholder="https://ejemplo.com"
        value={nuevaEmpresa.paginaWeb}
        onChange={handleChange}
      />
    </div>
  </div>
</div>

{/* Cuarta fila - 2 columnas */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Teléfono */}
  <div className="space-y-2">
    <label htmlFor="telefono" className="text-sm font-medium text-gray-700">
      Teléfono*
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FaPhone className="text-gray-400" />
      </div>
      <input
        type="tel"
        name="telefono"
        id="telefono"
        className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2 
                   focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] 
                   hover:shadow-md text-gray-800"
        placeholder="Teléfono de contacto"
        value={nuevaEmpresa.telefono}
        onChange={handleChange}
        required
      />
    </div>
  </div>

  {/* Empleados */}
  <div className="space-y-2">
    <label htmlFor="empleados" className="text-sm font-medium text-gray-700">
      N° Empleados
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FaUsers className="text-gray-400" />
      </div>
      <input
        type="number"
        name="empleados"
        id="empleados"
        className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2 
                   focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] 
                   hover:shadow-md text-gray-800"
        placeholder="Número de empleados"
        value={nuevaEmpresa.empleados}
        onChange={handleChange}
      />
    </div>
  </div>
</div>

{/* Quinta fila - 2 columnas */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Sector */}
  <div className="space-y-2">
    <label htmlFor="sector" className="text-sm font-medium text-gray-700">
      Sector*
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FaIndustry className="text-gray-400" />
      </div>
      <input
        type="text"
        name="sector"
        id="sector"
        className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2 
                   focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] 
                   hover:shadow-md text-gray-800"
        placeholder="Sector económico"
        value={nuevaEmpresa.sector}
        onChange={handleChange}
        required
      />
    </div>
  </div>

  {/* Tiempo */}
  <div className="space-y-2">
    <label htmlFor="tiempo" className="text-sm font-medium text-gray-700">
      Tiempo Operando
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FaClock className="text-gray-400" />
      </div>
      <input
        type="text"
        name="tiempo"
        id="tiempo"
        className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2 
                   focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] 
                   hover:shadow-md text-gray-800"
        placeholder="Ej: 5 años"
        value={nuevaEmpresa.tiempo}
        onChange={handleChange}
      />
    </div>
  </div>
</div>

{/* Sexta fila - 2 columnas */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Documento Legal */}
  <div className="space-y-2">
    <label htmlFor="documentoLegal" className="text-sm font-medium text-gray-700">
      Documento Legal
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FaFileContract className="text-gray-400" />
      </div>
      <input
        type="text"
        name="documentoLegal"
        id="documentoLegal"
        className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2 
                   focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] 
                   hover:shadow-md text-gray-800"
        placeholder="Documento legal"
        value={nuevaEmpresa.documentoLegal}
        onChange={handleChange}
      />
    </div>
  </div>

  {/* Cargo Legal */}
  <div className="space-y-2">
    <label htmlFor="cargoLegal" className="text-sm font-medium text-gray-700">
      Cargo Representante
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FaUserTie className="text-gray-400" />
      </div>
      <input
        type="text"
        name="cargoLegal"
        id="cargoLegal"
        className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2 
                   focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] 
                   hover:shadow-md text-gray-800"
        placeholder="Cargo del representante"
        value={nuevaEmpresa.cargoLegal}
        onChange={handleChange}
      />
    </div>
  </div>
</div>
{/* Séptima fila - 2 columnas */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Nombre Representante */}
  <div className="space-y-2">
    <label htmlFor="nombreLegal" className="text-sm font-medium text-gray-700">
      Nombre Representante*
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FaUser className="text-gray-400" />
      </div>
      <input
        type="text"
        name="nombreLegal"
        id="nombreLegal"
        className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2 
                   focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] 
                   hover:shadow-md text-gray-800"
        placeholder="Nombre del representante"
        value={nuevaEmpresa.nombreLegal}
        onChange={handleChange}
        required
      />
    </div>
  </div>

  {/* Apellido Representante */}
  <div className="space-y-2">
    <label htmlFor="apellidoLegal" className="text-sm font-medium text-gray-700">
      Apellido Representante*
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FaUser className="text-gray-400" />
      </div>
      <input
        type="text"
        name="apellidoLegal"
        id="apellidoLegal"
        className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2 
                   focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] 
                   hover:shadow-md text-gray-800"
        placeholder="Apellido del representante"
        value={nuevaEmpresa.apellidoLegal}
        onChange={handleChange}
        required
      />
    </div>
  </div>
</div>

{/* Octava fila - 2 columnas */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Teléfono Fijo */}
  <div className="space-y-2">
    <label htmlFor="telefonoFijo" className="text-sm font-medium text-gray-700">
      Teléfono Fijo
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FaPhoneAlt className="text-gray-400" />
      </div>
      <input
        type="tel"
        name="telefonoFijo"
        id="telefonoFijo"
        className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2 
                   focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] 
                   hover:shadow-md text-gray-800"
        placeholder="Teléfono fijo"
        value={nuevaEmpresa.telefonoFijo}
        onChange={handleChange}
      />
    </div>
  </div>

  {/* Celular */}
  <div className="space-y-2">
    <label htmlFor="celular" className="text-sm font-medium text-gray-700">
      Celular*
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FaMobileAlt className="text-gray-400" />
      </div>
      <input
        type="tel"
        name="celular"
        id="celular"
        className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2 
                   focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] 
                   hover:shadow-md text-gray-800"
        placeholder="Número celular"
        value={nuevaEmpresa.celular}
        onChange={handleChange}
        required
      />
    </div>
  </div>
</div>

{/* Novena fila - Email */}
<div className="grid grid-cols-1 gap-6">
  <div className="space-y-2">
    <label htmlFor="email" className="text-sm font-medium text-gray-700">
      Email*
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FaEnvelope className="text-gray-400" />
      </div>
      <input
        type="email"
        name="email"
        id="email"
        className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2 
                   focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] 
                   hover:shadow-md text-gray-800"
        placeholder="Correo electrónico"
        value={nuevaEmpresa.email}
        onChange={handleChange}
        required
      />
    </div>
  </div>
</div>

{/* Descripción */}
<div className="space-y-2">
  <label htmlFor="descripcion" className="text-sm font-medium text-gray-700">
    Descripción
  </label>
  <div className="relative">
    <div className="absolute top-2 left-0 pl-3 flex items-start pointer-events-none">
      <FaAlignLeft className="text-gray-400 mt-1" />
    </div>
    <textarea
      name="descripcion"
      id="descripcion"
      className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2 
                 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] 
                 hover:shadow-md min-h-[100px] text-gray-800"
      placeholder="Descripción de la empresa"
      value={nuevaEmpresa.descripcion}
      onChange={handleChange}
    />
  </div>
</div>
</div>
      {/* Footer con botones mejorados */}
      <div className="bg-gray-50 px-8 py-4 flex justify-between items-center border-t border-gray-200">
        <button
          className="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors hover:shadow-md"
          onClick={cerrarModal}
        >
          <FaArrowLeft size={16} />
          <span>Cancelar</span>
        </button>
        <button
          className="flex items-center gap-2 px-6 py-2 bg-[#39A900] text-white rounded-xl hover:bg-[#2d8500] transition-colors shadow-md hover:shadow-lg"
        
        >
          <FaSave size={16} />
          <span>{editandoId ? 'Actualizar Empresa' : 'Guardar Empresa'}</span>
        </button>
      </div>
    </div>
  </div>
)}
