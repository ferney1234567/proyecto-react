// components/editarConvocatoriaModal.tsx
'use client';

import { useState, useEffect } from "react";
import { X, Upload, ImageIcon, Save, FileText, Calendar, Globe, Users, Target, Building, LinkIcon, BookOpen } from "lucide-react";

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

interface EditarConvocatoriaModalProps {
  mostrarModal: boolean;
  cerrarModal: () => void;
  convocatoria: Convocatoria;
  onSave: (convocatoria: Convocatoria) => void;
  modoOscuro: boolean;
}

export default function EditarConvocatoriaModal({
  mostrarModal,
  cerrarModal,
  convocatoria,
  onSave,
  modoOscuro
}: EditarConvocatoriaModalProps) {
  const [formData, setFormData] = useState<Convocatoria>(convocatoria);
  const [imagenPreview, setImagenPreview] = useState<string | undefined>(convocatoria.imagen);
  const [animacion, setAnimacion] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (mostrarModal) {
      setVisible(true);
      setTimeout(() => setAnimacion(true), 10);
    } else {
      setAnimacion(false);
      setTimeout(() => setVisible(false), 300);
    }
  }, [mostrarModal]);

  useEffect(() => {
    setFormData(convocatoria);
    setImagenPreview(convocatoria.imagen);
  }, [convocatoria]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagenPreview(result);
        setFormData({ ...formData, imagen: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

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
  const uploadBorder = modoOscuro ? 'border-gray-600' : 'border-gray-300';

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-300 ${
        animacion ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`${modalBg} rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden transform transition-all duration-300 max-h-[90vh] overflow-y-auto ${
          animacion ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Header con gradiente e icono */}
        <div className="bg-gradient-to-r from-[#39A900] to-[#2d8500] p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full">
              <FileText className="text-white text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-white">Editar Convocatoria</h2>
          </div>
          <button
            onClick={cerrarModal}
            className="p-1 rounded-full hover:bg-white/10 transition-colors text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna izquierda */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className={`block text-sm font-medium ${labelColor}`}>
                  Nombre de la convocatoria *
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" size={18} />
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md ${inputBg}`}
                    placeholder="Nombre de la convocatoria"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={`block text-sm font-medium ${labelColor}`}>
                  Descripción *
                </label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-4 text-[#39A900]" size={18} />
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] transition-all resize-none hover:shadow-md ${inputBg}`}
                    placeholder="Describe la convocatoria"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={`block text-sm font-medium ${labelColor}`}>
                  Recursos ofrecidos
                </label>
                <div className="relative">
                  <Target className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" size={18} />
                  <input
                    type="text"
                    name="recursos"
                    value={formData.recursos}
                    onChange={handleInputChange}
                    className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] transition-all hover:shadow-md ${inputBg}`}
                    placeholder="Recursos ofrecidos"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={`block text-sm font-medium ${labelColor}`}>
                  Enlace a la convocatoria
                </label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" size={18} />
                  <input
                    type="url"
                    name="link"
                    value={formData.link}
                    onChange={handleInputChange}
                    className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] transition-all hover:shadow-md ${inputBg}`}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className={`block text-sm font-medium ${labelColor}`}>
                    Fecha de apertura
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" size={18} />
                    <input
                      type="date"
                      name="fechaApertura"
                      value={formData.fechaApertura}
                      onChange={handleInputChange}
                      className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] transition-all hover:shadow-md ${inputBg}`}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className={`block text-sm font-medium ${labelColor}`}>
                    Fecha de cierre
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" size={18} />
                    <input
                      type="date"
                      name="fechaCierre"
                      value={formData.fechaCierre}
                      onChange={handleInputChange}
                      className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] transition-all hover:shadow-md ${inputBg}`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Columna derecha */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className={`block text-sm font-medium ${labelColor}`}>
                  Entidad convocante *
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" size={18} />
                  <input
                    type="text"
                    name="entidad"
                    value={formData.entidad}
                    onChange={handleInputChange}
                    className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] transition-all hover:shadow-md ${inputBg}`}
                    placeholder="Entidad convocante"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={`block text-sm font-medium ${labelColor}`}>
                  Línea de la convocatoria
                </label>
                <div className="relative">
                  <Target className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" size={18} />
                  <input
                    type="text"
                    name="linea"
                    value={formData.linea}
                    onChange={handleInputChange}
                    className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] transition-all hover:shadow-md ${inputBg}`}
                    placeholder="Línea de la convocatoria"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={`block text-sm font-medium ${labelColor}`}>
                  Público objetivo
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" size={18} />
                  <input
                    type="text"
                    name="publicoObjetivo"
                    value={formData.publicoObjetivo}
                    onChange={handleInputChange}
                    className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] transition-all hover:shadow-md ${inputBg}`}
                    placeholder="Público objetivo"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={`block text-sm font-medium ${labelColor}`}>
                  Área de interés
                </label>
                <div className="relative">
                  <Target className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" size={18} />
                  <input
                    type="text"
                    name="interes"
                    value={formData.interes}
                    onChange={handleInputChange}
                    className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] transition-all hover:shadow-md ${inputBg}`}
                    placeholder="Área de interés"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={`block text-sm font-medium ${labelColor}`}>
                  Imagen de la convocatoria
                </label>
                <div className="flex items-center space-x-4">
                  <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer ${uploadBorder} hover:border-[#39A900] transition-colors hover:shadow-md`}>
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload size={24} className="mb-2 text-[#39A900]" />
                      <p className={`text-sm ${modoOscuro ? 'text-gray-400' : 'text-gray-500'}`}>Subir imagen</p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                  
                  {imagenPreview && (
                    <div className="w-32 h-32 rounded-xl overflow-hidden border shadow-md">
                      <img 
                        src={imagenPreview} 
                        alt="Vista previa" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Campos de texto largos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={`block text-sm font-medium ${labelColor}`}>
                Objetivos
              </label>
              <div className="relative">
                <Target className="absolute left-3 top-4 text-[#39A900]" size={18} />
                <textarea
                  name="objetivos"
                  value={formData.objetivos}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] transition-all resize-none hover:shadow-md ${inputBg}`}
                  placeholder="Objetivos de la convocatoria"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className={`block text-sm font-medium ${labelColor}`}>
                Observaciones
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-4 text-[#39A900]" size={18} />
                <textarea
                  name="observaciones"
                  value={formData.observaciones}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] transition-all resize-none hover:shadow-md ${inputBg}`}
                  placeholder="Observaciones adicionales"
                />
              </div>
            </div>
          </div>

          {/* Información de la página web */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={`block text-sm font-medium ${labelColor}`}>
                Nombre de la página web
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" size={18} />
                <input
                  type="text"
                  name="nombrePagina"
                  value={formData.nombrePagina}
                  onChange={handleInputChange}
                  className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] transition-all hover:shadow-md ${inputBg}`}
                  placeholder="Nombre de la página web"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className={`block text-sm font-medium ${labelColor}`}>
                URL de la página web
              </label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" size={18} />
                <input
                  type="url"
                  name="pagina"
                  value={formData.pagina}
                  onChange={handleInputChange}
                  className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] transition-all hover:shadow-md ${inputBg}`}
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          {/* Footer estilizado */}
          <div className={`${footerBg} px-6 py-4 flex justify-between items-center border-t mt-6`}>
            <button
              type="button"
              onClick={cerrarModal}
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