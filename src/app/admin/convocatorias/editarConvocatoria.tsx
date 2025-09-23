"use client";

import { useState, useEffect } from "react";

// APIs de catálogos
import { getInstituciones } from "../../api/entidadInstitucion/route";
import { getLineas } from "../../api/linea/routes";
import { getPublicos } from "../../api/publicoObjetivo/routes";
import { getIntereses } from "../../api/intereses/routes";
import { getUsers } from "../../api/usuarios/route";

import {
  X, Upload, Save, FileText, Building, Target, Users, Globe,
  StickyNote, Calendar, Link as LinkIcon, DollarSign, User,
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
  convocatoria: ConvocatoriaAPI;
  onSave: (conv: ConvocatoriaForm) => void;
  modoOscuro: boolean;
}

export default function EditarConvocatoriaModal({
  mostrarModal,
  cerrarModal,
  convocatoria,
  onSave,
  modoOscuro,
}: EditarConvocatoriaModalProps) {
  const [formData, setFormData] = useState<ConvocatoriaForm | null>(null);
  const [imagenPreview, setImagenPreview] = useState<string | undefined>(undefined);

  // Estados para catálogos
  const [entidades, setEntidades] = useState<any[]>([]);
  const [lineas, setLineas] = useState<any[]>([]);
  const [publicos, setPublicos] = useState<any[]>([]);
  const [intereses, setIntereses] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);

  // Cargar catálogos desde la BD
  useEffect(() => {
    const cargarCatalogos = async () => {
      try {
        const [e, l, p, i, u] = await Promise.all([
          getInstituciones(),
          getLineas(),
          getPublicos(),
          getIntereses(),
          getUsers(),
        ]);
        setEntidades(e.data || []);
        setLineas(l.data || []);
        setPublicos(p.data || []);
        setIntereses(i.data || []);
        setUsuarios(u || []);
      } catch (err) {
        console.error("❌ Error cargando catálogos:", err);
      }
    };
    cargarCatalogos();
  }, []);

  // Cargar datos de convocatoria
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) onSave(formData);
  };

  // 🎨 Estilos
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
          <button onClick={cerrarModal} className="p-1 rounded-full hover:bg-white/10 transition-colors text-white">
            <X size={24} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nombre */}
          <div className="space-y-2">
            <label className={`block text-sm font-medium ${labelColor}`}>Título</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              className={`w-full border rounded-xl px-4 py-2 ${inputBg}`}
              placeholder="Título de la convocatoria"
              required
            />
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <label className={`block text-sm font-medium ${labelColor}`}>Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              className={`w-full border rounded-xl px-4 py-2 min-h-[100px] ${inputBg}`}
              placeholder="Descripción detallada"
              required
            />
          </div>

          {/* Objetivos */}
          <div className="space-y-2">
            <label className={`block text-sm font-medium ${labelColor}`}>Objetivos</label>
            <textarea
              name="objetivos"
              value={formData.objetivos}
              onChange={handleInputChange}
              className={`w-full border rounded-xl px-4 py-2 min-h-[80px] ${inputBg}`}
              placeholder="Objetivos principales"
            />
          </div>

          {/* Observaciones */}
          <div className="space-y-2">
            <label className={`block text-sm font-medium ${labelColor}`}>Observaciones</label>
            <textarea
              name="observaciones"
              value={formData.observaciones}
              onChange={handleInputChange}
              className={`w-full border rounded-xl px-4 py-2 min-h-[80px] ${inputBg}`}
              placeholder="Observaciones adicionales"
            />
          </div>

          {/* Selects de catálogos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={`block text-sm font-medium ${labelColor}`}>Entidad</label>
              <select
                name="entidad"
                value={formData.entidad}
                onChange={handleInputChange}
                className={`w-full border rounded-xl px-4 py-2 ${inputBg}`}
              >
                <option value="">Selecciona una entidad</option>
                {entidades.map((e) => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className={`block text-sm font-medium ${labelColor}`}>Línea</label>
              <select
                name="linea"
                value={formData.linea}
                onChange={handleInputChange}
                className={`w-full border rounded-xl px-4 py-2 ${inputBg}`}
              >
                <option value="">Selecciona línea</option>
                {lineas.map((l) => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={`block text-sm font-medium ${labelColor}`}>Público Objetivo</label>
              <select
                name="publicoObjetivo"
                value={formData.publicoObjetivo}
                onChange={handleInputChange}
                className={`w-full border rounded-xl px-4 py-2 ${inputBg}`}
              >
                <option value="">Selecciona público</option>
                {publicos.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className={`block text-sm font-medium ${labelColor}`}>Área de Interés</label>
              <select
                name="interes"
                value={formData.interes}
                onChange={handleInputChange}
                className={`w-full border rounded-xl px-4 py-2 ${inputBg}`}
              >
                <option value="">Selecciona interés</option>
                {intereses.map((i) => (
                  <option key={i.id} value={i.id}>{i.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Usuario */}
          <div className="space-y-2">
            <label className={`block text-sm font-medium ${labelColor}`}>Usuario Responsable</label>
            <select
              name="usuario"
              value={formData.usuario}
              onChange={handleInputChange}
              className={`w-full border rounded-xl px-4 py-2 ${inputBg}`}
            >
              <option value="">Selecciona usuario</option>
              {usuarios.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>

          {/* Recursos + Link */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={`block text-sm font-medium ${labelColor}`}>Recursos</label>
              <input
                type="text"
                name="recursos"
                value={formData.recursos}
                onChange={handleInputChange}
                className={`w-full border rounded-xl px-4 py-2 ${inputBg}`}
                placeholder="Recursos disponibles"
              />
            </div>
            <div className="space-y-2">
              <label className={`block text-sm font-medium ${labelColor}`}>Link</label>
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

          {/* Fechas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={`block text-sm font-medium ${labelColor}`}>Fecha Apertura</label>
              <input
                type="date"
                name="fechaApertura"
                value={formData.fechaApertura?.split("T")[0]}
                onChange={handleInputChange}
                className={`w-full border rounded-xl px-4 py-2 ${inputBg}`}
              />
            </div>
            <div className="space-y-2">
              <label className={`block text-sm font-medium ${labelColor}`}>Fecha Cierre</label>
              <input
                type="date"
                name="fechaCierre"
                value={formData.fechaCierre?.split("T")[0]}
                onChange={handleInputChange}
                className={`w-full border rounded-xl px-4 py-2 ${inputBg}`}
              />
            </div>
          </div>

          {/* Página */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={`block text-sm font-medium ${labelColor}`}>Nombre Página</label>
              <input
                type="text"
                name="nombrePagina"
                value={formData.nombrePagina}
                onChange={handleInputChange}
                className={`w-full border rounded-xl px-4 py-2 ${inputBg}`}
                placeholder="Nombre página"
              />
            </div>
            <div className="space-y-2">
              <label className={`block text-sm font-medium ${labelColor}`}>URL Página</label>
              <input
                type="url"
                name="pagina"
                value={formData.pagina}
                onChange={handleInputChange}
                className={`w-full border rounded-xl px-4 py-2 ${inputBg}`}
                placeholder="https://pagina.com"
              />
            </div>
          </div>

        {/* Imagen (ruta) */}
<div className="space-y-2">
  <label className={`block text-sm font-medium ${labelColor}`}>Ruta Imagen</label>
  <input
    type="text"
    name="imagen"
    value={formData.imagen || ""}
    onChange={handleInputChange}
    className={`w-full border rounded-xl px-4 py-2 ${inputBg}`}
    placeholder="Ej: /img/mi-imagen.jpg o https://miweb.com/imagen.png"
  />
  {formData.imagen && (
    <div className="w-32 h-32 rounded-xl overflow-hidden border shadow-md mt-2">
      <img
        src={formData.imagen}
        alt="Vista previa"
        className="w-full h-full object-cover"
      />
    </div>
  )}
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
