'use client';

import {
  FaBuilding, FaChevronDown, FaAlignLeft, FaSave, FaArrowLeft, FaFileAlt,
  FaIdCard, FaMapMarkerAlt, FaCity, FaBriefcase, FaGlobe, FaPhone, FaUsers,
  FaIndustry, FaClock, FaFileContract, FaUserTie, FaUser, FaPhoneAlt,
  FaMobileAlt, FaEnvelope, FaTimes
} from 'react-icons/fa';
import { useState, useEffect } from 'react';

interface Ciudad {
  id: number;
  name: string;
}

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
  ciudad: string; // nombre
  cityId: string; // id real
}

interface EditarEmpresaProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  empresa: Partial<Empresa>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  modoOscuro: boolean;
}

export default function EditarEmpresa({
  isOpen,
  onClose,
  onSave,
  empresa,
  onChange,
  modoOscuro,
}: EditarEmpresaProps) {
  const [visible, setVisible] = useState(false);
  const [animacion, setAnimacion] = useState(false);
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setTimeout(() => setAnimacion(true), 50);

      // 🔹 Cargar ciudades desde la API
      fetch("http://localhost:4000/api/v1/cities")
        .then((res) => res.json())
        .then((data) => setCiudades(data.data || data || []))
        .catch((err) => {
          console.error("❌ Error cargando ciudades:", err);
          setCiudades([]);
        });
    } else {
      setAnimacion(false);
      setTimeout(() => setVisible(false), 200);
    }
  }, [isOpen]);

  if (!visible) return null;

  // 🎨 Estilos
  const modalBg = modoOscuro ? 'bg-[#1a0526] text-white' : 'bg-white text-gray-900';
  const inputBg = modoOscuro ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500';
  const footerBg = modoOscuro ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200';
  const cancelBtn = modoOscuro ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100';
  const labelColor = modoOscuro ? 'text-gray-200' : 'text-gray-700';
  const selectBg = modoOscuro ? 'bg-gray-800 text-white' : 'bg-white text-gray-800';
  const iconColor = 'text-[#39A900]';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <div className={`fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-all ${animacion ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`${modalBg} rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-y-auto transform transition-all ${animacion ? 'scale-100' : 'scale-95'}`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-[#39A900] to-[#2d8500] p-6 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full">
              <FaBuilding className="text-white text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-white">Editar Empresa</h2>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-white/10">
            <FaTimes size={24} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto">
            {/* === Fila 1 === */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre */}
              <div className="space-y-2">
                <label className={labelColor}>Nombre*</label>
                <div className="relative">
                  <FaFileAlt className={`absolute left-3 top-3 ${iconColor}`} />
                  <input type="text" name="nombre" value={empresa.nombre || ''} onChange={onChange}
                    placeholder="Nombre de la empresa" required className={`w-full border rounded-xl pl-10 pr-4 py-3 ${inputBg}`} />
                </div>
              </div>
              {/* NIT */}
              <div className="space-y-2">
                <label className={labelColor}>NIT*</label>
                <div className="relative">
                  <FaIdCard className={`absolute left-3 top-3 ${iconColor}`} />
                  <input type="text" name="nit" value={empresa.nit || ''} onChange={onChange}
                    placeholder="NIT" required className={`w-full border rounded-xl pl-10 pr-4 py-3 ${inputBg}`} />
                </div>
              </div>
            </div>

            {/* === Descripción === */}
            <div className="space-y-2">
              <label className={labelColor}>Descripción</label>
              <div className="relative">
                <FaAlignLeft className={`absolute top-3 left-3 ${iconColor}`} />
                <textarea name="descripcion" value={empresa.descripcion || ''} onChange={onChange}
                  placeholder="Descripción de la empresa" className={`w-full border rounded-xl pl-10 pr-4 py-3 min-h-[100px] ${inputBg}`} />
              </div>
            </div>

            {/* === Fila 2 === */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dirección */}
              <div className="space-y-2">
                <label className={labelColor}>Dirección*</label>
                <div className="relative">
                  <FaMapMarkerAlt className={`absolute left-3 top-3 ${iconColor}`} />
                  <input type="text" name="direccion" value={empresa.direccion || ''} onChange={onChange}
                    placeholder="Dirección" required className={`w-full border rounded-xl pl-10 pr-4 py-3 ${inputBg}`} />
                </div>
              </div>
              {/* Ciudad */}
              <div className="space-y-2">
                <label className={labelColor}>Ciudad*</label>
                <div className="relative">
                  <FaCity className={`absolute left-3 top-3 ${iconColor}`} />
                  <select name="cityId" value={empresa.cityId || ''} onChange={onChange}
                    required className={`w-full border rounded-xl pl-10 pr-10 py-3 appearance-none ${selectBg}`}>
                    <option value="">Seleccione una ciudad</option>
                    {ciudades.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <FaChevronDown className="absolute right-3 top-3 text-gray-400" />
                </div>
              </div>
            </div>

            {/* === Fila 3 === */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Razón Social */}
              <div className="space-y-2">
                <label className={labelColor}>Razón Social</label>
                <div className="relative">
                  <FaBriefcase className={`absolute left-3 top-3 ${iconColor}`} />
                  <input type="text" name="razonSocial" value={empresa.razonSocial || ''} onChange={onChange}
                    placeholder="Razón social" className={`w-full border rounded-xl pl-10 pr-4 py-3 ${inputBg}`} />
                </div>
              </div>
              {/* Página Web */}
              <div className="space-y-2">
                <label className={labelColor}>Página Web</label>
                <div className="relative">
                  <FaGlobe className={`absolute left-3 top-3 ${iconColor}`} />
                  <input type="url" name="paginaWeb" value={empresa.paginaWeb || ''} onChange={onChange}
                    placeholder="https://ejemplo.com" className={`w-full border rounded-xl pl-10 pr-4 py-3 ${inputBg}`} />
                </div>
              </div>
            </div>

            {/* === Fila 4 === */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Teléfono */}
              <div className="space-y-2">
                <label className={labelColor}>Teléfono*</label>
                <div className="relative">
                  <FaPhone className={`absolute left-3 top-3 ${iconColor}`} />
                  <input type="tel" name="telefono" value={empresa.telefono || ''} onChange={onChange}
                    placeholder="Teléfono" required className={`w-full border rounded-xl pl-10 pr-4 py-3 ${inputBg}`} />
                </div>
              </div>
              {/* Empleados */}
              <div className="space-y-2">
                <label className={labelColor}>N° Empleados</label>
                <div className="relative">
                  <FaUsers className={`absolute left-3 top-3 ${iconColor}`} />
                  <input type="number" name="empleados" value={empresa.empleados || ''} onChange={onChange}
                    placeholder="Número de empleados" className={`w-full border rounded-xl pl-10 pr-4 py-3 ${inputBg}`} />
                </div>
              </div>
            </div>

            {/* === Fila 5 === */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sector */}
              <div className="space-y-2">
                <label className={labelColor}>Sector*</label>
                <div className="relative">
                  <FaIndustry className={`absolute left-3 top-3 ${iconColor}`} />
                  <input type="text" name="sector" value={empresa.sector || ''} onChange={onChange}
                    placeholder="Sector económico" required className={`w-full border rounded-xl pl-10 pr-4 py-3 ${inputBg}`} />
                </div>
              </div>
              {/* Antigüedad */}
              <div className="space-y-2">
                <label className={labelColor}>Tiempo Operando</label>
                <div className="relative">
                  <FaClock className={`absolute left-3 top-3 ${iconColor}`} />
                  <input type="text" name="tiempo" value={empresa.tiempo || ''} onChange={onChange}
                    placeholder="Ej: 5 años" className={`w-full border rounded-xl pl-10 pr-4 py-3 ${inputBg}`} />
                </div>
              </div>
            </div>

            {/* === Representante === */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre */}
              <div className="space-y-2">
                <label className={labelColor}>Nombre Representante*</label>
                <div className="relative">
                  <FaUser className={`absolute left-3 top-3 ${iconColor}`} />
                  <input type="text" name="nombreLegal" value={empresa.nombreLegal || ''} onChange={onChange}
                    placeholder="Nombre" required className={`w-full border rounded-xl pl-10 pr-4 py-3 ${inputBg}`} />
                </div>
              </div>
              {/* Apellido */}
              <div className="space-y-2">
                <label className={labelColor}>Apellido Representante*</label>
                <div className="relative">
                  <FaUser className={`absolute left-3 top-3 ${iconColor}`} />
                  <input type="text" name="apellidoLegal" value={empresa.apellidoLegal || ''} onChange={onChange}
                    placeholder="Apellido" required className={`w-full border rounded-xl pl-10 pr-4 py-3 ${inputBg}`} />
                </div>
              </div>
            </div>

            {/* === Contacto Representante === */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Documento Legal */}
              <div className="space-y-2">
                <label className={labelColor}>Documento Legal</label>
                <div className="relative">
                  <FaFileContract className={`absolute left-3 top-3 ${iconColor}`} />
                  <input type="text" name="documentoLegal" value={empresa.documentoLegal || ''} onChange={onChange}
                    placeholder="Documento legal" className={`w-full border rounded-xl pl-10 pr-4 py-3 ${inputBg}`} />
                </div>
              </div>
              {/* Cargo */}
              <div className="space-y-2">
                <label className={labelColor}>Cargo Representante</label>
                <div className="relative">
                  <FaUserTie className={`absolute left-3 top-3 ${iconColor}`} />
                  <input type="text" name="cargoLegal" value={empresa.cargoLegal || ''} onChange={onChange}
                    placeholder="Cargo" className={`w-full border rounded-xl pl-10 pr-4 py-3 ${inputBg}`} />
                </div>
              </div>
            </div>

            {/* === Teléfonos === */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Teléfono fijo */}
              <div className="space-y-2">
                <label className={labelColor}>Teléfono Fijo</label>
                <div className="relative">
                  <FaPhoneAlt className={`absolute left-3 top-3 ${iconColor}`} />
                  <input type="tel" name="telefonoFijo" value={empresa.telefonoFijo || ''} onChange={onChange}
                    placeholder="Teléfono fijo" className={`w-full border rounded-xl pl-10 pr-4 py-3 ${inputBg}`} />
                </div>
              </div>
              {/* Celular */}
              <div className="space-y-2">
                <label className={labelColor}>Celular*</label>
                <div className="relative">
                  <FaMobileAlt className={`absolute left-3 top-3 ${iconColor}`} />
                  <input type="tel" name="celular" value={empresa.celular || ''} onChange={onChange}
                    placeholder="Celular" required className={`w-full border rounded-xl pl-10 pr-4 py-3 ${inputBg}`} />
                </div>
              </div>
            </div>

            {/* === Email === */}
            <div className="space-y-2">
              <label className={labelColor}>Email*</label>
              <div className="relative">
                <FaEnvelope className={`absolute left-3 top-3 ${iconColor}`} />
                <input type="email" name="email" value={empresa.email || ''} onChange={onChange}
                  placeholder="Correo electrónico" required className={`w-full border rounded-xl pl-10 pr-4 py-3 ${inputBg}`} />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className={`${footerBg} px-8 py-4 flex justify-between items-center border-t`}>
            <button type="button" onClick={onClose}
              className={`flex items-center gap-2 px-6 py-3 border rounded-xl ${cancelBtn}`}>
              <FaArrowLeft size={16} />
              <span>Cancelar</span>
            </button>
            <button type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-[#39A900] text-white rounded-xl hover:bg-[#2d8500]">
              <FaSave size={16} />
              <span>Guardar Cambios</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
