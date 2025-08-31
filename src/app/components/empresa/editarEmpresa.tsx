// components/editarEmpresaModal.tsx
'use client';

import { X, Save, Building, Hash, MapPin, Globe, Phone, Users, Clock, FileText, User, Mail, Briefcase } from 'lucide-react';
import { useState, useEffect } from 'react';

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

interface EditarEmpresaModalProps {
  isOpen: boolean;
  onClose: () => void;
  empresa: Empresa;
  onSave: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  modoOscuro: boolean;
}

export default function EditarEmpresaModal({
  isOpen,
  onClose,
  empresa,
  onSave,
  onChange,
  modoOscuro
}: EditarEmpresaModalProps) {
  const [formData, setFormData] = useState<Empresa>(empresa);
  const [animacion, setAnimacion] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setTimeout(() => setAnimacion(true), 10);
    } else {
      setAnimacion(false);
      setTimeout(() => setVisible(false), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    setFormData(empresa);
  }, [empresa]);

  // 🔹 estilos dinámicos
  const modalBg = modoOscuro ? 'bg-[#1a0526] text-white' : 'bg-white text-gray-900';
  const inputBg = modoOscuro
    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
    : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500';
  const footerBg = modoOscuro ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200';
  const cancelBtn = modoOscuro
    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
    : 'border-gray-300 text-gray-700 hover:bg-gray-100';
  const labelColor = modoOscuro ? 'text-gray-300' : 'text-gray-700';

  if (!visible) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <div
      className={`fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-300 ${animacion ? 'opacity-100' : 'opacity-0'
        }`}
    >
      <div
        className={`${modalBg} rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden transform transition-all duration-300 max-h-[90vh] overflow-y-auto ${animacion ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
      >
        {/* Header con gradiente e icono */}
        <div className="bg-gradient-to-r from-[#39A900] to-[#2d8500] p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full">
              <Building className="text-white text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-white">Editar Empresa</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 transition-colors text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna izquierda - Información básica */}
            <div className="space-y-4">
              <h3 className={`text-lg font-semibold ${labelColor} border-b pb-2`}>Información Básica</h3>

              <div className="space-y-2">
                <label className={`block text-sm font-medium ${labelColor}`}>
                  Nombre *
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" size={18} />
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={onChange}
                    className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] transition-all hover:shadow-md ${inputBg}`}
                    placeholder="Nombre de la empresa"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={`block text-sm font-medium ${labelColor}`}>
                  NIT *
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" size={18} />
                  <input
                    type="text"
                    name="nit"
                    value={formData.nit}
                    onChange={onChange}
                    className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] transition-all hover:shadow-md ${inputBg}`}
                    placeholder="Número de identificación tributaria"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={`block text-sm font-medium ${labelColor}`}>
                  Razón Social
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" size={18} />
                  <input
                    type="text"
                    name="razonSocial"
                    value={formData.razonSocial}
                    onChange={onChange}
                    className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] transition-all hover:shadow-md ${inputBg}`}
                    placeholder="Razón social"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={`block text-sm font-medium ${labelColor}`}>
                  Sector
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" size={18} />
                  <input
                    type="text"
                    name="sector"
                    value={formData.sector}
                    onChange={onChange}
                    className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] transition-all hover:shadow-md ${inputBg}`}
                    placeholder="Sector empresarial"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={`block text-sm font-medium ${labelColor}`}>
                  Tiempo de operación
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" size={18} />
                  <input
                    type="text"
                    name="tiempo"
                    value={formData.tiempo}
                    onChange={onChange}
                    className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] transition-all hover:shadow-md ${inputBg}`}
                    placeholder="Años de operación"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={`block text-sm font-medium ${labelColor}`}>
                  Número de empleados
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" size={18} />
                  <input
                    type="text"
                    name="empleados"
                    value={formData.empleados}
                    onChange={onChange}
                    className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] transition-all hover:shadow-md ${inputBg}`}
                    placeholder="Cantidad de empleados"
                  />
                </div>
              </div>
            </div>

            {/* Columna derecha - Información de contacto */}
            <div className="space-y-4">
              <h3 className={`text-lg font-semibold ${labelColor} border-b pb-2`}>Información de Contacto</h3>

              <div className="space-y-2">
                <label className={`block text-sm font-medium ${labelColor}`}>
                  Dirección
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" size={18} />
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={onChange}
                    className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] transition-all hover:shadow-md ${inputBg}`}
                    placeholder="Dirección completa"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={`block text-sm font-medium ${labelColor}`}>
                  Ciudad
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" size={18} />
                  <input
                    type="text"
                    name="ciudad"
                    value={formData.ciudad}
                    onChange={onChange}
                    className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] transition-all hover:shadow-md ${inputBg}`}
                    placeholder="Ciudad"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={`block text-sm font-medium ${labelColor}`}>
                  Página Web
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" size={18} />
                  <input
                    type="url"
                    name="paginaWeb"
                    value={formData.paginaWeb}
                    onChange={onChange}
                    className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] transition-all hover:shadow-md ${inputBg}`}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={`block text-sm font-medium ${labelColor}`}>
                  Teléfono
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" size={18} />
                  <input
                    type="text"
                    name="telefono"
                    value={formData.telefono}
                    onChange={onChange}
                    className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] transition-all hover:shadow-md ${inputBg}`}
                    placeholder="Teléfono principal"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={`block text-sm font-medium ${labelColor}`}>
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" size={18} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={onChange}
                    className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] transition-all hover:shadow-md ${inputBg}`}
                    placeholder="correo@empresa.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={`block text-sm font-medium ${labelColor}`}>
                  Descripción
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-4 text-[#39A900]" size={18} />
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={onChange}
                    rows={3}
                    className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] transition-all resize-none hover:shadow-md ${inputBg}`}
                    placeholder="Descripción de la empresa"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer estilizado */}
          <div className={`${footerBg} px-6 py-4 flex justify-between items-center border-t mt-6`}>
            <button
              type="button"
              onClick={onClose}
              className={`flex items-center gap-2 px-6 py-3 border rounded-xl transition-colors hover:shadow-md ${cancelBtn}`}
            >
              <X size={18} />
              <span>Cancelar</span>
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-[#39A900] text-white font-medium rounded-xl hover:bg-[#2d8500] transition-colors shadow-md hover:shadow-lg transform hover:scale-105 duration-200"
            >
              <Save size={18} />
              <span>Guardar Cambios</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}