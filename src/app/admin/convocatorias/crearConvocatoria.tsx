"use client";

import React, { useEffect, useState } from "react";
import { FaUserPlus, FaTimes, FaSave } from "react-icons/fa";

// APIs de catálogos
import { getInstituciones } from "../../api/entidadInstitucion/route";
import { getLineas } from "../../api/linea/routes";
import { getPublicos } from "../../api/publicoObjetivo/routes";
import { getIntereses } from "../../api/intereses/routes";
import { getUsers } from "../../api/usuarios/route";

interface ConvocatoriaForm {
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

interface Props {
  mostrarModal: boolean;
  cerrarModal: () => void;
  onSave: (formData: ConvocatoriaForm) => void;
  modoOscuro: boolean;
}

export default function ConvocatoriaModal({
  mostrarModal,
  cerrarModal,
  onSave,
  modoOscuro,
}: Props) {
  if (!mostrarModal) return null;

  const [formData, setFormData] = useState<ConvocatoriaForm>({
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
        setUsuarios((u?.data ?? u) || []);
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!formData.nombre.trim() || !formData.linea || !formData.entidad) {
      alert("⚠️ Debes completar: Nombre, Línea e Institución.");
      return;
    }
    onSave(formData);
    cerrarModal();
  };

  // estilos
  const modalBg = modoOscuro ? "bg-[#1a0526] text-white" : "bg-white text-gray-900";
  const inputBg = modoOscuro
    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-emerald-400/30 focus:border-emerald-400/60"
    : "bg-white border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-emerald-200 focus:border-emerald-500";
  const footerBg = modoOscuro ? "bg-gray-900/70 border-gray-700" : "bg-gray-50 border-gray-200";
  const cancelBtn = modoOscuro
    ? "border-gray-600 text-gray-300 hover:bg-gray-700"
    : "border-gray-300 text-gray-700 hover:bg-gray-100";
  const labelColor = modoOscuro ? "text-gray-300" : "text-gray-700";

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-6 backdrop-blur-sm overflow-y-auto">
      <div
        className={`${modalBg} rounded-2xl shadow-2xl w-full max-w-7xl transform transition-all duration-300 scale-95 hover:scale-100`}
      >
        {/* Header (ya no sticky) */}
        <div className="bg-gradient-to-r from-[#39A900] to-[#2d8500] p-8 flex justify-between items-center rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-full">
              <FaUserPlus className="text-white text-2xl" />
            </div>
            <h2 className="text-3xl font-bold text-white">Publicar Nueva Convocatoria</h2>
          </div>
          <button
            className="text-white hover:text-gray-200 transition-colors p-2 rounded-full hover:bg-white/10"
            onClick={cerrarModal}
          >
            <FaTimes size={28} />
          </button>
        </div>

        {/* Body */}
        <div className="p-10 space-y-8">
          {/* Nombre */}
          <div className="space-y-2">
            <label className={`block text-lg font-semibold ${labelColor}`}>
              Nombre Convocatoria
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              className={`w-full border rounded-xl px-5 py-3 text-lg ${inputBg}`}
              placeholder="Nombre de la convocatoria"
              required
            />
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <label className={`block text-lg font-semibold ${labelColor}`}>Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              className={`w-full border rounded-xl px-5 py-3 text-lg min-h-[120px] ${inputBg}`}
              placeholder="Descripción detallada"
              required
            />
          </div>

          {/* Objetivos */}
          <div className="space-y-2">
            <label className={`block text-lg font-semibold ${labelColor}`}>Objetivos</label>
            <textarea
              name="objetivos"
              value={formData.objetivos}
              onChange={handleInputChange}
              className={`w-full border rounded-xl px-5 py-3 text-lg min-h-[120px] ${inputBg}`}
              placeholder="Objetivos principales"
            />
          </div>

          {/* Observaciones */}
          <div className="space-y-2">
            <label className={`block text-lg font-semibold ${labelColor}`}>Observaciones</label>
            <textarea
              name="observaciones"
              value={formData.observaciones}
              onChange={handleInputChange}
              className={`w-full border rounded-xl px-5 py-3 text-lg min-h-[120px] ${inputBg}`}
              placeholder="Observaciones adicionales"
            />
          </div>

          {/* Selects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className={`block text-lg font-semibold ${labelColor}`}>Entidad</label>
              <select
                name="entidad"
                value={formData.entidad}
                onChange={handleInputChange}
                className={`w-full border rounded-xl px-5 py-3 text-lg ${inputBg}`}
                required
              >
                <option value="">Selecciona una entidad</option>
                {entidades.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className={`block text-lg font-semibold ${labelColor}`}>Línea</label>
              <select
                name="linea"
                value={formData.linea}
                onChange={handleInputChange}
                className={`w-full border rounded-xl px-5 py-3 text-lg ${inputBg}`}
                required
              >
                <option value="">Selecciona una línea</option>
                {lineas.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Público, Interés y Usuario */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className={`block text-lg font-semibold ${labelColor}`}>Público</label>
              <select
                name="publicoObjetivo"
                value={formData.publicoObjetivo}
                onChange={handleInputChange}
                className={`w-full border rounded-xl px-5 py-3 text-lg ${inputBg}`}
              >
                <option value="">Selecciona público</option>
                {publicos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className={`block text-lg font-semibold ${labelColor}`}>
                Área de Interés
              </label>
              <select
                name="interes"
                value={formData.interes}
                onChange={handleInputChange}
                className={`w-full border rounded-xl px-5 py-3 text-lg ${inputBg}`}
              >
                <option value="">Selecciona un área</option>
                {intereses.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className={`block text-lg font-semibold ${labelColor}`}>
                Usuario Responsable
              </label>
              <select
                name="usuario"
                value={formData.usuario}
                onChange={handleInputChange}
                className={`w-full border rounded-xl px-5 py-3 text-lg ${inputBg}`}
              >
                <option value="">Selecciona usuario</option>
                {usuarios.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className={`block text-lg font-semibold ${labelColor}`}>Fecha Apertura</label>
              <input
                type="date"
                name="fechaApertura"
                value={formData.fechaApertura}
                onChange={handleInputChange}
                className={`w-full border rounded-xl px-5 py-3 text-lg ${inputBg}`}
                required
              />
            </div>
            <div className="space-y-2">
              <label className={`block text-lg font-semibold ${labelColor}`}>Fecha Cierre</label>
              <input
                type="date"
                name="fechaCierre"
                value={formData.fechaCierre}
                onChange={handleInputChange}
                className={`w-full border rounded-xl px-5 py-3 text-lg ${inputBg}`}
                required
              />
            </div>
          </div>

          {/* Recursos y Link */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className={`block text-lg font-semibold ${labelColor}`}>Recursos</label>
              <input
                type="text"
                name="recursos"
                value={formData.recursos}
                onChange={handleInputChange}
                className={`w-full border rounded-xl px-5 py-3 text-lg ${inputBg}`}
                placeholder="Ej: $50,000"
              />
            </div>
            <div className="space-y-2">
              <label className={`block text-lg font-semibold ${labelColor}`}>Link</label>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleInputChange}
                className={`w-full border rounded-xl px-5 py-3 text-lg ${inputBg}`}
                placeholder="https://convocatoria.com"
              />
            </div>
          </div>

          {/* Página */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className={`block text-lg font-semibold ${labelColor}`}>Nombre Página</label>
              <input
                type="text"
                name="nombrePagina"
                value={formData.nombrePagina}
                onChange={handleInputChange}
                className={`w-full border rounded-xl px-5 py-3 text-lg ${inputBg}`}
                placeholder="Nombre de la página"
              />
            </div>
            <div className="space-y-2">
              <label className={`block text-lg font-semibold ${labelColor}`}>URL Página</label>
              <input
                type="url"
                name="pagina"
                value={formData.pagina}
                onChange={handleInputChange}
                className={`w-full border rounded-xl px-5 py-3 text-lg ${inputBg}`}
                placeholder="https://pagina.com"
              />
            </div>
          </div>

          {/* Imagen */}
          <div className="space-y-2">
            <label className={`block text-lg font-semibold ${labelColor}`}>Ruta Imagen</label>
            <input
              type="text"
              name="imagen"
              value={formData.imagen}
              onChange={handleInputChange}
              className={`w-full border rounded-xl px-5 py-3 text-lg ${inputBg}`}
              placeholder="Ej: /img/mi-imagen.jpg o https://..."
            />
            {formData.imagen && (
              <img
                src={formData.imagen}
                alt="preview"
                className="mt-3 max-h-48 rounded-lg border border-white/10 shadow-md"
              />
            )}
          </div>
        </div>

        {/* Footer (ya no sticky) */}
        <div
          className={`${footerBg} px-10 py-5 flex justify-between items-center border-t rounded-b-2xl`}
        >
          <button
            className={`flex items-center gap-2 px-6 py-3 border rounded-xl text-lg transition-colors ${cancelBtn}`}
            onClick={cerrarModal}
          >
            <FaTimes size={18} />
            <span>Cancelar</span>
          </button>
          <button
            className="flex items-center gap-2 px-6 py-3 bg-[#39A900] text-white text-lg font-semibold rounded-xl hover:bg-[#2d8500] transition-colors shadow-md"
            onClick={handleSave}
          >
            <FaSave size={18} />
            <span>Publicar Convocatoria</span>
          </button>
        </div>
      </div>
    </div>
  );
}
