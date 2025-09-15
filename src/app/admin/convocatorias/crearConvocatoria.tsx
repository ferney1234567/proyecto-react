"use client";

import React from "react";
import {
  FaUserPlus,
  FaTimes,
  FaSave,
  FaAlignLeft,
  FaLink,
  FaCalendarAlt,
  FaBuilding,
  FaFileAlt,
  FaMoneyBillWave,
  FaExternalLinkAlt,
  FaHeart,
  FaBullseye,
  FaStickyNote,
  FaGlobe,
  FaUsers,
  FaUser,
} from "react-icons/fa";

interface Convocatoria {
  id?: string;
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
  onSave: (conv: Convocatoria) => void;
  modoOscuro: boolean;
}

export default function ConvocatoriaModal({
  mostrarModal,
  cerrarModal,
  onSave,
  modoOscuro,
}: ConvocatoriaModalProps) {
  if (!mostrarModal) return null;

  const [formData, setFormData] = React.useState<Convocatoria>({
    nombre: "",
    descripcion: "",
    recursos: "",
    link: "",
    fechaApertura: "",
    fechaCierre: "",
    nombrePagina: "",
    pagina: "",
    objetivos: "",
    observaciones: "",
    entidad: "",
    linea: "",
    publicoObjetivo: "",
    interes: "",
    usuario: "",
    imagen: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, imagen: reader.result as string }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSave = () => {
    onSave(formData);
  };

  // estilos condicionales
  const modalBg = modoOscuro
    ? "bg-[#1a0526] text-white"
    : "bg-white text-gray-900";
  const inputBg = modoOscuro
    ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
    : "bg-white border-gray-300 text-gray-800 placeholder-gray-500";
  const footerBg = modoOscuro
    ? "bg-gray-900 border-gray-700"
    : "bg-gray-50 border-gray-200";
  const cancelBtn = modoOscuro
    ? "border-gray-600 text-gray-300 hover:bg-gray-700"
    : "border-gray-300 text-gray-700 hover:bg-gray-100";
  const labelColor = modoOscuro ? "text-gray-300" : "text-gray-700";

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
      <div
        className={`${modalBg} rounded-xl shadow-2xl w-full max-w-4xl transform transition-all duration-300 scale-95 hover:scale-100 max-h-[90vh] overflow-y-auto`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#39A900] to-[#2d8500] p-6 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full">
              <FaUserPlus className="text-white text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Publicar Nueva Convocatoria
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
          {/* Nombre + Entidad */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={`text-sm font-medium ${labelColor}`}>Nombre*</label>
              <div className="relative">
                <FaFileAlt className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className={`w-full border rounded-xl pl-10 pr-4 py-2 ${inputBg}`}
                  placeholder="Nombre de la convocatoria"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-medium ${labelColor}`}>Entidad*</label>
              <div className="relative">
                <FaBuilding className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  name="entidad"
                  value={formData.entidad}
                  onChange={handleInputChange}
                  className={`w-full border rounded-xl pl-10 pr-4 py-2 ${inputBg}`}
                  placeholder="Entidad convocante"
                  required
                />
              </div>
            </div>
          </div>

          {/* Línea + Público objetivo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={`text-sm font-medium ${labelColor}`}>Línea*</label>
              <input
                type="text"
                name="linea"
                value={formData.linea}
                onChange={handleInputChange}
                className={`w-full border rounded-xl px-4 py-2 ${inputBg}`}
                placeholder="Ej: Innovación"
                required
              />
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-medium ${labelColor}`}>
                Público Objetivo*
              </label>
              <input
                type="text"
                name="publicoObjetivo"
                value={formData.publicoObjetivo}
                onChange={handleInputChange}
                className={`w-full border rounded-xl px-4 py-2 ${inputBg}`}
                placeholder="Ej: Investigadores"
                required
              />
            </div>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={`text-sm font-medium ${labelColor}`}>
                Fecha Apertura*
              </label>
              <input
                type="date"
                name="fechaApertura"
                value={formData.fechaApertura}
                onChange={handleInputChange}
                className={`w-full border rounded-xl px-4 py-2 ${inputBg}`}
                required
              />
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-medium ${labelColor}`}>
                Fecha Cierre*
              </label>
              <input
                type="date"
                name="fechaCierre"
                value={formData.fechaCierre}
                onChange={handleInputChange}
                className={`w-full border rounded-xl px-4 py-2 ${inputBg}`}
                required
              />
            </div>
          </div>

          {/* Recursos + Link */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={`text-sm font-medium ${labelColor}`}>Recursos</label>
              <input
                type="text"
                name="recursos"
                value={formData.recursos}
                onChange={handleInputChange}
                className={`w-full border rounded-xl px-4 py-2 ${inputBg}`}
                placeholder="Ej: $50,000"
              />
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-medium ${labelColor}`}>Enlace</label>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleInputChange}
                className={`w-full border rounded-xl px-4 py-2 ${inputBg}`}
                placeholder="https://convocatoria.com"
              />
            </div>
          </div>

          {/* Página */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={`text-sm font-medium ${labelColor}`}>Nombre Página</label>
              <input
                type="text"
                name="nombrePagina"
                value={formData.nombrePagina}
                onChange={handleInputChange}
                className={`w-full border rounded-xl px-4 py-2 ${inputBg}`}
              />
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-medium ${labelColor}`}>Página</label>
              <input
                type="url"
                name="pagina"
                value={formData.pagina}
                onChange={handleInputChange}
                className={`w-full border rounded-xl px-4 py-2 ${inputBg}`}
              />
            </div>
          </div>

          {/* Interés + Usuario */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={`text-sm font-medium ${labelColor}`}>Interés</label>
              <input
                type="text"
                name="interes"
                value={formData.interes}
                onChange={handleInputChange}
                className={`w-full border rounded-xl px-4 py-2 ${inputBg}`}
              />
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-medium ${labelColor}`}>Usuario</label>
              <input
                type="text"
                name="usuario"
                value={formData.usuario}
                onChange={handleInputChange}
                className={`w-full border rounded-xl px-4 py-2 ${inputBg}`}
              />
            </div>
          </div>

          {/* Textareas */}
          <div className="space-y-2">
            <label className={`text-sm font-medium ${labelColor}`}>Descripción*</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              className={`w-full border rounded-xl px-4 py-2 min-h-[100px] ${inputBg}`}
              required
            />
          </div>

          <div className="space-y-2">
            <label className={`text-sm font-medium ${labelColor}`}>Objetivos</label>
            <textarea
              name="objetivos"
              value={formData.objetivos}
              onChange={handleInputChange}
              className={`w-full border rounded-xl px-4 py-2 min-h-[80px] ${inputBg}`}
            />
          </div>

          <div className="space-y-2">
            <label className={`text-sm font-medium ${labelColor}`}>Observaciones</label>
            <textarea
              name="observaciones"
              value={formData.observaciones}
              onChange={handleInputChange}
              className={`w-full border rounded-xl px-4 py-2 min-h-[80px] ${inputBg}`}
            />
          </div>

          {/* Imagen */}
          <div className="space-y-2">
            <label className={`text-sm font-medium ${labelColor}`}>Imagen</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={`w-full border rounded-xl px-4 py-2 file:mr-4 file:py-1 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#39A900]/10 file:text-[#39A900] hover:file:bg-[#39A900]/20 ${inputBg}`}
            />
          </div>
        </div>

        {/* Footer */}
        <div
          className={`${footerBg} px-8 py-4 flex justify-between items-center border-t sticky bottom-0`}
        >
          <button
            className={`flex items-center gap-2 px-6 py-3 border rounded-xl transition-colors ${cancelBtn}`}
            onClick={cerrarModal}
          >
            <FaTimes size={18} />
            <span>Cancelar</span>
          </button>
          <button
            className="flex items-center gap-2 px-6 py-2 bg-[#39A900] text-white rounded-xl hover:bg-[#2d8500] transition-colors"
            onClick={handleSave}
          >
            <FaSave size={16} />
            <span>Publicar Convocatoria</span>
          </button>
        </div>
      </div>
    </div>
  );
}
