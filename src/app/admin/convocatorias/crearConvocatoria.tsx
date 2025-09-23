"use client";

import React, { useEffect, useState } from "react";
import {
  FaUserPlus, FaTimes, FaSave,
} from "react-icons/fa";

// Helpers API (cliente)
import { createConvocatoria } from "../../api/convocatorias/routes";

// APIs de catálogos
import { getInstituciones } from "../../api/entidadInstitucion/route";
import { getLineas } from "../../api/linea/routes";
import { getPublicos } from "../../api/publicoObjetivo/routes";
import { getIntereses } from "../../api/intereses/routes";
import { getUsers } from "../../api/usuarios/route";

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
  entidad: string;         // id
  linea: string;           // id
  publicoObjetivo: string; // id
  interes: string;         // id
  usuario: string;         // id
  imagen?: string;         // vista previa (base64)
}

interface ConvocatoriaModalProps {
  mostrarModal: boolean;
  cerrarModal: () => void;
  onSave: (conv: any) => void;
  modoOscuro: boolean;
}

export default function ConvocatoriaModal({
  mostrarModal,
  cerrarModal,
  onSave,
  modoOscuro,
}: ConvocatoriaModalProps) {
  if (!mostrarModal) return null;

  const [formData, setFormData] = useState<Convocatoria>({
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

  // archivo real
  const [file, setFile] = useState<File | null>(null);

  // catálogos BD
  const [entidades, setEntidades] = useState<any[]>([]);
  const [lineas, setLineas] = useState<any[]>([]);
  const [publicos, setPublicos] = useState<any[]>([]);
  const [intereses, setIntereses] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);

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
        setUsuarios((u?.data ?? u) || []); // por si tu helper devuelve {data:[]}
      } catch (err) {
        console.error("❌ Error cargando catálogos:", err);
      }
    };
    cargarCatalogos();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    // solo vista previa (sin enviar base64)
    const reader = new FileReader();
    reader.onloadend = () => setFormData(prev => ({ ...prev, imagen: reader.result as string }));
    reader.readAsDataURL(f);
  };

const handleSave = async () => {
  try {
    const conv = {
      title: formData.nombre.trim(),
      description: formData.descripcion.trim(),
      resources: formData.recursos,
      callLink: formData.link,
      openDate: formData.fechaApertura,
      closeDate: formData.fechaCierre,
      pageName: formData.nombrePagina,
      pageUrl: formData.pagina,
      objective: formData.objetivos,
      notes: formData.observaciones,
      institutionId: formData.entidad ? Number(formData.entidad) : null,
      lineId: formData.linea ? Number(formData.linea) : null,
      targetAudienceId: formData.publicoObjetivo ? Number(formData.publicoObjetivo) : null,
      interestId: formData.interes ? Number(formData.interes) : null,
      userId: formData.usuario ? Number(formData.usuario) : null,
      imageUrl: formData.imagen || "",
    };

    if (!conv.title || !conv.lineId || !conv.institutionId) {
      alert("⚠️ Debes completar los campos obligatorios: Título, Línea e Institución.");
      return;
    }

    const saved = await createConvocatoria(conv);
    onSave(saved);
    cerrarModal();
  } catch (error) {
    console.error("❌ Error al guardar convocatoria:", error);
    alert("No se pudo guardar la convocatoria");
  }
};


   

  // estilos condicionales (conservados)
  const modalBg = modoOscuro ? "bg-[#1a0526] text-white" : "bg-white text-gray-900";
  const inputBg = modoOscuro
    ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
    : "bg-white border-gray-300 text-gray-800 placeholder-gray-500";
  const footerBg = modoOscuro ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200";
  const cancelBtn = modoOscuro
    ? "border-gray-600 text-gray-300 hover:bg-gray-700"
    : "border-gray-300 text-gray-700 hover:bg-gray-100";
  const labelColor = modoOscuro ? "text-gray-300" : "text-gray-700";

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
      <div className={`${modalBg} rounded-xl shadow-2xl w-full max-w-6xl transform transition-all duration-300 scale-95 hover:scale-100 max-h-[90vh] overflow-y-auto`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-[#39A900] to-[#2d8500] p-6 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full">
              <FaUserPlus className="text-white text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-white">Publicar Nueva Convocatoria</h2>
          </div>
          <button
            className="text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-white/10"
            onClick={cerrarModal}
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Nombre */}
          <div className="space-y-2">
            <label className={`block text-sm font-medium ${labelColor}`}>Nombre Convocatoria</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              className={`w-full border rounded-xl px-4 py-2 ${inputBg}`}
              placeholder="Nombre de la convocatoria"
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
              className={`w-full border rounded-xl px-4 py-2 min-h-[80px] ${inputBg}`}
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

          {/* Entidad */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={`block text-sm font-medium ${labelColor}`}>Entidad</label>
              <select
                name="entidad"
                value={formData.entidad}
                onChange={handleInputChange}
                className={`w-full border rounded-xl px-4 py-2 ${inputBg}`}
                required
              >
                <option value="">Selecciona una entidad</option>
                {entidades.map(e => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Línea + Público objetivo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={`block text-sm font-medium ${labelColor}`}>Línea</label>
              <select
                name="linea"
                value={formData.linea}
                onChange={handleInputChange}
                className={`w-full border rounded-xl px-4 py-2 ${inputBg}`}
                required
              >
                <option value="">Selecciona una línea</option>
                {lineas.map(l => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className={`block text-sm font-medium ${labelColor}`}>Público Objetivo</label>
              <select
                name="publicoObjetivo"
                value={formData.publicoObjetivo}
                onChange={handleInputChange}
                className={`w-full border rounded-xl px-4 py-2 ${inputBg}`}
                required
              >
                <option value="">Selecciona público</option>
                {publicos.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Interés + Usuario */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={`block text-sm font-medium ${labelColor}`}>Área de Interés</label>
              <select
                name="interes"
                value={formData.interes}
                onChange={handleInputChange}
                className={`w-full border rounded-xl px-4 py-2 ${inputBg}`}
                required
              >
                <option value="">Selecciona un área de interés</option>
                {intereses.map(i => (
                  <option key={i.id} value={i.id}>{i.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className={`block text-sm font-medium ${labelColor}`}>Usuario Responsable</label>
              <select
                name="usuario"
                value={formData.usuario}
                onChange={handleInputChange}
                className={`w-full border rounded-xl px-4 py-2 ${inputBg}`}
                required
              >
                <option value="">Selecciona usuario</option>
                {usuarios.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={`block text-sm font-medium ${labelColor}`}>Fecha Apertura</label>
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
              <label className={`block text-sm font-medium ${labelColor}`}>Fecha Cierre</label>
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
              <label className={`block text-sm font-medium ${labelColor}`}>Recursos</label>
              <input
                type="text"
                name="recursos"
                value={formData.recursos}
                onChange={handleInputChange}
                className={`w-full border rounded-xl px-4 py-2 ${inputBg}`}
                placeholder="Recursos disponibles (ej: $50,000)"
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
                placeholder="Nombre de la página"
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

          {/* Imagen */}
         {/* Imagen (ruta) */}
<div className="space-y-2">
  <label className={`block text-sm font-medium ${labelColor}`}>Ruta Imagen</label>
  <input
    type="text"
    name="imagen"
    value={formData.imagen}
    onChange={handleInputChange}
    className={`w-full border rounded-xl px-4 py-2 ${inputBg}`}
    placeholder="Ej: /img/mi-imagen.jpg o https://... "
  />
  {formData.imagen && (
    <img
      src={formData.imagen}
      alt="preview"
      className="mt-2 max-h-36 rounded-lg border border-white/10"
    />
  )}
</div>

        </div>

        {/* Footer */}
        <div className={`${footerBg} px-8 py-4 flex justify-between items-center border-t sticky bottom-0`}>
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
