'use client';

import { FaBuilding, FaChevronDown, FaAlignLeft, FaSave, FaArrowLeft, FaFileAlt, FaIdCard, FaMapMarkerAlt, FaCity, FaBriefcase, FaGlobe, FaPhone, FaUsers, FaIndustry, FaClock, FaFileContract, FaUserTie, FaUser, FaPhoneAlt, FaMobileAlt, FaEnvelope, FaTimes } from 'react-icons/fa';

interface Empresa {
  id: string;
  nombre: string;
  nit: string;
  direccion: string;
  razonSocial: string;
  paginaWeb: string;
  telefono: string;
  empleados: string;
  sector: string;
  tiempo: string;
  descripcion: string;
  documentoLegal: string;
  nombreLegal: string;
  apellidoLegal: string;
  telefonoFijo: string;
  celular: string;
  email: string;
  cargoLegal: string;
  ciudad: string;
}

interface EmpresaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  empresa: Empresa;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  modoOscuro: boolean;
}

export default function EmpresaModal({
  isOpen,
  onClose,
  onSave,
  empresa,
  onChange,
  modoOscuro,
}: EmpresaModalProps) {
  if (!isOpen) return null;

  // 🔹 estilos dinámicos
  const modalBg = modoOscuro ? 'bg-[#1a0526] text-white' : 'bg-white text-gray-900';
  const inputBg = modoOscuro ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500';
  const footerBg = modoOscuro ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200';
  const cancelBtn = modoOscuro ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100';
  const labelColor = modoOscuro ? 'text-gray-200' : 'text-gray-700';
  const selectBg = modoOscuro ? 'bg-gray-800 text-white' : 'bg-white text-gray-800';
  const iconColor = modoOscuro ? 'text-[#39A900]' : 'text-[#39A900]';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className={`${modalBg} rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-95 hover:scale-100`}>
        {/* Header con efecto gradiente */}
        <div className="bg-gradient-to-r from-[#39A900] to-[#2d8500] p-6 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full">
              <FaBuilding className="text-white text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Crear Nueva Empresa
            </h2>
          </div>
          <button
            className="text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-white/10"
            onClick={onClose}
          >
            <FaTimes size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Body */}
          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            {/* Primera fila - 2 columnas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre */}
              <div className="space-y-2">
                <label htmlFor="nombre" className={`text-sm font-medium ${labelColor}`}>
                  Nombre*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaFileAlt className={iconColor} />
                  </div>
                  <input
                    type="text"
                    name="nombre"
                    id="nombre"
                    className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] ${inputBg}`}
                    placeholder="Nombre de la empresa"
                    value={empresa.nombre}
                    onChange={onChange}
                    required
                  />
                </div>
              </div>

              {/* NIT */}
              <div className="space-y-2">
                <label htmlFor="nit" className={`text-sm font-medium ${labelColor}`}>
                  NIT*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaIdCard className={iconColor} />
                  </div>
                  <input
                    type="text"
                    name="nit"
                    id="nit"
                    className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] ${inputBg}`}
                    placeholder="NIT de la empresa"
                    value={empresa.nit}
                    onChange={onChange}
                    required
                  />
                </div>
              </div>

              {/* Dirección */}
              <div className="space-y-2">
                <label htmlFor="direccion" className={`text-sm font-medium ${labelColor}`}>
                  Dirección*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaMapMarkerAlt className={iconColor} />
                  </div>
                  <input
                    type="text"
                    name="direccion"
                    id="direccion"
                    className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] ${inputBg}`}
                    placeholder="Dirección de la empresa"
                    value={empresa.direccion}
                    onChange={onChange}
                    required
                  />
                </div>
              </div>

              {/* Ciudad (select) */}
              <div className="space-y-2">
                <label htmlFor="ciudad" className={`text-sm font-medium ${labelColor}`}>
                  Ciudad*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCity className={iconColor} />
                  </div>
                  <select
                    name="ciudad"
                    id="ciudad"
                    className={`w-full border rounded-xl pl-10 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] appearance-none ${selectBg} ${modoOscuro ? 'border-gray-600' : 'border-gray-300'}`}
                    value={empresa.ciudad}
                    onChange={onChange}
                    required
                  >
                    <option value="">Seleccione una ciudad</option>
                    <option value="Bogotá">Bogotá</option>
                    <option value="Medellín">Medellín</option>
                    <option value="Cali">Cali</option>
                    <option value="Barranquilla">Barranquilla</option>
                    <option value="Cartagena">Cartagena</option>
                  </select>
                  <FaChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Razón Social */}
              <div className="space-y-2">
                <label htmlFor="razonSocial" className={`text-sm font-medium ${labelColor}`}>
                  Razón Social
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaBriefcase className={iconColor} />
                  </div>
                  <input
                    type="text"
                    name="razonSocial"
                    id="razonSocial"
                    className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] ${inputBg}`}
                    placeholder="Razón social de la empresa"
                    value={empresa.razonSocial}
                    onChange={onChange}
                  />
                </div>
              </div>

              {/* Página Web */}
              <div className="space-y-2">
                <label htmlFor="paginaWeb" className={`text-sm font-medium ${labelColor}`}>
                  Página Web
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaGlobe className={iconColor} />
                  </div>
                  <input
                    type="url"
                    name="paginaWeb"
                    id="paginaWeb"
                    className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] ${inputBg}`}
                    placeholder="https://ejemplo.com"
                    value={empresa.paginaWeb}
                    onChange={onChange}
                  />
                </div>
              </div>
            </div>

            {/* Cuarta fila - 2 columnas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Teléfono */}
              <div className="space-y-2">
                <label htmlFor="telefono" className={`text-sm font-medium ${labelColor}`}>
                  Teléfono*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className={iconColor} />
                  </div>
                  <input
                    type="tel"
                    name="telefono"
                    id="telefono"
                    className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] ${inputBg}`}
                    placeholder="Teléfono de contacto"
                    value={empresa.telefono}
                    onChange={onChange}
                    required
                  />
                </div>
              </div>

              {/* Empleados */}
              <div className="space-y-2">
                <label htmlFor="empleados" className={`text-sm font-medium ${labelColor}`}>
                  N° Empleados
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUsers className={iconColor} />
                  </div>
                  <input
                    type="number"
                    name="empleados"
                    id="empleados"
                    className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] ${inputBg}`}
                    placeholder="Número de empleados"
                    value={empresa.empleados}
                    onChange={onChange}
                  />
                </div>
              </div>
            </div>

            {/* Quinta fila - 2 columnas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sector */}
              <div className="space-y-2">
                <label htmlFor="sector" className={`text-sm font-medium ${labelColor}`}>
                  Sector*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaIndustry className={iconColor} />
                  </div>
                  <input
                    type="text"
                    name="sector"
                    id="sector"
                    className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] ${inputBg}`}
                    placeholder="Sector económico"
                    value={empresa.sector}
                    onChange={onChange}
                    required
                  />
                </div>
              </div>

              {/* Tiempo */}
              <div className="space-y-2">
                <label htmlFor="tiempo" className={`text-sm font-medium ${labelColor}`}>
                  Tiempo Operando
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaClock className={iconColor} />
                  </div>
                  <input
                    type="text"
                    name="tiempo"
                    id="tiempo"
                    className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] ${inputBg}`}
                    placeholder="Ej: 5 años"
                    value={empresa.tiempo}
                    onChange={onChange}
                  />
                </div>
              </div>
            </div>

            {/* Sexta fila - 2 columnas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Documento Legal */}
              <div className="space-y-2">
                <label htmlFor="documentoLegal" className={`text-sm font-medium ${labelColor}`}>
                  Documento Legal
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaFileContract className={iconColor} />
                  </div>
                  <input
                    type="text"
                    name="documentoLegal"
                    id="documentoLegal"
                    className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] ${inputBg}`}
                    placeholder="Documento legal"
                    value={empresa.documentoLegal}
                    onChange={onChange}
                  />
                </div>
              </div>

              {/* Cargo Legal */}
              <div className="space-y-2">
                <label htmlFor="cargoLegal" className={`text-sm font-medium ${labelColor}`}>
                  Cargo Representante
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUserTie className={iconColor} />
                  </div>
                  <input
                    type="text"
                    name="cargoLegal"
                    id="cargoLegal"
                    className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] ${inputBg}`}
                    placeholder="Cargo del representante"
                    value={empresa.cargoLegal}
                    onChange={onChange}
                  />
                </div>
              </div>
            </div>

            {/* Séptima fila - 2 columnas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre Representante */}
              <div className="space-y-2">
                <label htmlFor="nombreLegal" className={`text-sm font-medium ${labelColor}`}>
                  Nombre Representante*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className={iconColor} />
                  </div>
                  <input
                    type="text"
                    name="nombreLegal"
                    id="nombreLegal"
                    className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] ${inputBg}`}
                    placeholder="Nombre del representante"
                    value={empresa.nombreLegal}
                    onChange={onChange}
                    required
                  />
                </div>
              </div>

              {/* Apellido Representante */}
              <div className="space-y-2">
                <label htmlFor="apellidoLegal" className={`text-sm font-medium ${labelColor}`}>
                  Apellido Representante*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className={iconColor} />
                  </div>
                  <input
                    type="text"
                    name="apellidoLegal"
                    id="apellidoLegal"
                    className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] ${inputBg}`}
                    placeholder="Apellido del representante"
                    value={empresa.apellidoLegal}
                    onChange={onChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Octava fila - 2 columnas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Teléfono Fijo */}
              <div className="space-y-2">
                <label htmlFor="telefonoFijo" className={`text-sm font-medium ${labelColor}`}>
                  Teléfono Fijo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhoneAlt className={iconColor} />
                  </div>
                  <input
                    type="tel"
                    name="telefonoFijo"
                    id="telefonoFijo"
                    className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] ${inputBg}`}
                    placeholder="Teléfono fijo"
                    value={empresa.telefonoFijo}
                    onChange={onChange}
                  />
                </div>
              </div>

              {/* Celular */}
              <div className="space-y-2">
                <label htmlFor="celular" className={`text-sm font-medium ${labelColor}`}>
                  Celular*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaMobileAlt className={iconColor} />
                  </div>
                  <input
                    type="tel"
                    name="celular"
                    id="celular"
                    className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] ${inputBg}`}
                    placeholder="Número celular"
                    value={empresa.celular}
                    onChange={onChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Novena fila - Email */}
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label htmlFor="email" className={`text-sm font-medium ${labelColor}`}>
                  Email*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className={iconColor} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] ${inputBg}`}
                    placeholder="Correo electrónico"
                    value={empresa.email}
                    onChange={onChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <label htmlFor="descripcion" className={`text-sm font-medium ${labelColor}`}>
                Descripción
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3">
                  <FaAlignLeft className={iconColor} />
                </div>
                <textarea
                  name="descripcion"
                  id="descripcion"
                  className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] min-h-[100px] ${inputBg}`}
                  placeholder="Descripción de la empresa"
                  value={empresa.descripcion}
                  onChange={onChange}
                />
              </div>
            </div>
          </div>

          {/* Footer con botones mejorados */}
          <div className={`${footerBg} px-8 py-4 flex justify-between items-center border-t`}>
            <button
              type="button"
              className={`flex items-center gap-2 px-6 py-3 border rounded-xl transition-colors hover:shadow-md ${cancelBtn}`}
              onClick={onClose}
            >
              <FaArrowLeft size={16} />
              <span>Cancelar</span>
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-[#39A900] text-white rounded-xl hover:bg-[#2d8500] transition-colors shadow-md hover:shadow-lg"
            >
              <FaSave size={16} />
              <span>Guardar Empresa</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}