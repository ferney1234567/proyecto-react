"use client";

import { useState, useEffect } from "react";
import {
  X, Upload, Save, FileText
} from "lucide-react";

interface ConvocatoriaAPI {
  id: number;
  title: string;
  description: string;
  resources: string;
  callLink: string;
  openDate: string;
  closeDate: string;
  pageName: string;
  pageUrl: string;
  objective: string;
  notes: string;
  institutionId: number;
  lineId: number;
  targetAudienceId: number;
  interestId: number;
  userId: number;
  clickCount: number;
  imageUrl?: string;
}

interface ConvocatoriaForm {
  id: number;
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
  convocatoria: ConvocatoriaAPI;   // 👉 recibes datos en formato API
  onSave: (conv: ConvocatoriaForm) => void;
  modoOscuro: boolean;
}

export default function EditarConvocatoriaModal({
  mostrarModal,
  cerrarModal,
  convocatoria,
  onSave,
  modoOscuro
}: EditarConvocatoriaModalProps) {
  const [formData, setFormData] = useState<ConvocatoriaForm | null>(null);
  const [imagenPreview, setImagenPreview] = useState<string | undefined>(undefined);

  // 🔹 Cuando recibo la convocatoria, la adapto al formulario
  useEffect(() => {
    if (mostrarModal && convocatoria) {
      const mapped: ConvocatoriaForm = {
        id: convocatoria.id,
        nombre: convocatoria.title,
        descripcion: convocatoria.description,
        recursos: convocatoria.resources,
        link: convocatoria.callLink,
        fechaApertura: convocatoria.openDate,
        fechaCierre: convocatoria.closeDate,
        nombrePagina: convocatoria.pageName,
        pagina: convocatoria.pageUrl,
        objetivos: convocatoria.objective,
        observaciones: convocatoria.notes,
        entidad: String(convocatoria.institutionId || ""),
        linea: String(convocatoria.lineId || ""),
        publicoObjetivo: String(convocatoria.targetAudienceId || ""),
        interes: String(convocatoria.interestId || ""),
        usuario: String(convocatoria.userId || ""),
        imagen: convocatoria.imageUrl,
      };
      setFormData(mapped);
      setImagenPreview(convocatoria.imageUrl);
    }
  }, [mostrarModal, convocatoria]);

  if (!mostrarModal || !formData) return null;

  // 🔹 Manejo de inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  // 🔹 Manejo de imagen
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagenPreview(result);
        setFormData((prev) => (prev ? { ...prev, imagen: result } : prev));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // 🔹 Guardar cambios (devuelvo en formato formulario → luego mapeas en handleUpdate)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) onSave(formData);
  };

  // 🎨 Estilos dinámicos
  const modalBg = modoOscuro ? "bg-[#1a0526] text-white" : "bg-white text-gray-900";
  const inputBg = modoOscuro
    ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
    : "bg-white border-gray-300 text-gray-800 placeholder-gray-500";
  const footerBg = modoOscuro ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200";
  const cancelBtn = modoOscuro
    ? "border-gray-600 text-gray-300 hover:bg-gray-700"
    : "border-gray-300 text-gray-700 hover:bg-gray-100";
  const labelColor = modoOscuro ? "text-gray-300" : "text-gray-700";
  const uploadBorder = modoOscuro ? "border-gray-600" : "border-gray-300";

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className={`${modalBg} rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-[#39A900] to-[#2d8500] p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FileText className="text-white" size={22} />
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
          {/* Nombre + Entidad */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={`block text-sm font-medium ${labelColor}`}>Nombre *</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className={`w-full border rounded-xl px-4 py-2 ${inputBg}`}
                required
              />
            </div>
            <div className="space-y-2">
              <label className={`block text-sm font-medium ${labelColor}`}>Entidad *</label>
              <input
                type="text"
                name="entidad"
                value={formData.entidad}
                onChange={handleInputChange}
                className={`w-full border rounded-xl px-4 py-2 ${inputBg}`}
                required
              />
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <label className={`block text-sm font-medium ${labelColor}`}>Descripción *</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              className={`w-full border rounded-xl px-4 py-2 min-h-[100px] ${inputBg}`}
              required
            />
          </div>

          {/* Imagen */}
          <div className="space-y-2">
            <label className={`block text-sm font-medium ${labelColor}`}>Imagen</label>
            <div className="flex items-center gap-4">
              <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer ${uploadBorder} hover:border-[#39A900]`}>
                <Upload size={22} className="mb-2 text-[#39A900]" />
                <p className="text-sm">Subir imagen</p>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
              {imagenPreview && (
                <div className="w-32 h-32 rounded-xl overflow-hidden border shadow-md">
                  <img src={imagenPreview} alt="Vista previa" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className={`${footerBg} px-6 py-4 flex justify-between items-center border-t mt-6`}>
            <button
              type="button"
              onClick={cerrarModal}
              className={`flex items-center gap-2 px-6 py-3 border rounded-xl ${cancelBtn}`}
            >
              <X size={18} />
              <span>Cancelar</span>
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-[#39A900] text-white rounded-xl hover:bg-[#2d8500] shadow-md"
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
