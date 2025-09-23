'use client';

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import {
  getConvocatorias,
  createConvocatoria,
  updateConvocatoria,
  deleteConvocatoria,
} from "../../api/convocatorias/routes";
import { getInstituciones } from "../../api/entidadInstitucion/route";
import { getLineas } from "../../api/linea/routes";
import { getPublicos } from "../../api/publicoObjetivo/routes";
import { getIntereses } from "../../api/intereses/routes";
import { getUsers } from "../../api/usuarios/route";

import ConvocatoriaModal from "./crearConvocatoria";
import EditarConvocatoriaModal from "./editarConvocatoria";

interface Convocatoria {
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

export default function Convocatorias({ modoOscuro }: { modoOscuro: boolean }) {
  const [convocatorias, setConvocatorias] = useState<Convocatoria[]>([]);
  const [search, setSearch] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editarModal, setEditarModal] = useState(false);
  const [convocatoriaEditando, setConvocatoriaEditando] =
    useState<Convocatoria | null>(null);

  // === Catálogos ===
  const [entidades, setEntidades] = useState<any[]>([]);
  const [lineas, setLineas] = useState<any[]>([]);
  const [publicos, setPublicos] = useState<any[]>([]);
  const [intereses, setIntereses] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);

  // === ALERTAS ===
  const showSuccess = (msg: string) =>
    Swal.fire({
      icon: "success",
      title: "¡Éxito!",
      text: msg,
      confirmButtonColor: "#39A900",
      background: modoOscuro ? "#1a0526" : "#fff",
      color: modoOscuro ? "#fff" : "#333",
    });

  const showError = (msg: string) =>
    Swal.fire({
      icon: "error",
      title: "Error",
      text: msg,
      confirmButtonColor: "#d33",
      background: modoOscuro ? "#1a0526" : "#fff",
      color: modoOscuro ? "#fff" : "#333",
    });

  // === CARGAR DATOS ===
  const cargarConvocatorias = async () => {
    try {
      const data = await getConvocatorias();
      setConvocatorias(data.data || []);
    } catch (err: any) {
      showError(err.message);
    }
  };

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
    } catch (err: any) {
      showError("Error cargando catálogos");
    }
  };

  useEffect(() => {
    cargarConvocatorias();
    cargarCatalogos();
  }, []);

  // === Helpers: ID → Nombre ===
  const getEntidadNombre = (id: number) =>
    entidades.find((x) => x.id === id)?.name || `ID: ${id}`;

  const getLineaNombre = (id: number) =>
    lineas.find((x) => x.id === id)?.name || `ID: ${id}`;

  const getPublicoNombre = (id: number) =>
    publicos.find((x) => x.id === id)?.name || `ID: ${id}`;

  const getInteresNombre = (id: number) =>
    intereses.find((x) => x.id === id)?.name || `ID: ${id}`;

  const getUsuarioNombre = (id: number) =>
    usuarios.find((x) => x.id === id)?.name || `ID: ${id}`;

  // === CREAR ===
  const handleCreate = async (formData: any) => {
    try {
      const conv = {
  title: formData.nombre?.trim(),
  description: formData.descripcion?.trim(),
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
  clickCount: 0,
  imageUrl: formData.imagen || null,
};


      await createConvocatoria(conv);
      showSuccess("Convocatoria creada.");
      setMostrarModal(false);
      cargarConvocatorias();
    } catch (err: any) {
      showError(err.message);
    }
  };

  // === EDITAR ===
  const handleUpdate = async (formData: any) => {
    try {
      const conv = {
        title: formData.nombre,
        description: formData.descripcion,
        resources: formData.recursos,
        callLink: formData.link,
        openDate: formData.fechaApertura,
        closeDate: formData.fechaCierre,
        pageName: formData.nombrePagina,
        pageUrl: formData.pagina,
        objective: formData.objetivos,
        notes: formData.observaciones,
        institutionId: Number(formData.entidad) || 0,
        lineId: Number(formData.linea) || 0,
        targetAudienceId: Number(formData.publicoObjetivo) || 0,
        interestId: Number(formData.interes) || 0,
        userId: Number(formData.usuario) || 0,
        clickCount: formData.clickCount || 0,
        imageUrl: formData.imagen,
      };

      await updateConvocatoria(formData.id, conv);
      showSuccess("Convocatoria actualizada.");
      setEditarModal(false);
      setConvocatoriaEditando(null);
      cargarConvocatorias();
    } catch (err: any) {
      showError(err.message);
    }
  };

  // === ELIMINAR ===
  const handleDelete = (id: number) => {
    Swal.fire({
      title: "¿Eliminar convocatoria?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      background: modoOscuro ? "#1a0526" : "#fff",
      color: modoOscuro ? "#fff" : "#333",
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await deleteConvocatoria(id);
          showSuccess("Convocatoria eliminada.");
          cargarConvocatorias();
        } catch (err: any) {
          showError(err.message);
        }
      }
    });
  };

  // === NUEVA ===
  const handleAddConvocatoria = () => {
    setMostrarModal(true);
  };

  // === FILTRAR ===
  const filteredConvocatorias = convocatorias.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  // === ESTILOS ===
  const bgColor = modoOscuro ? "bg-[#1a0526]" : "bg-white";
  const textColor = modoOscuro ? "text-white" : "text-gray-900";
  const borderColor = modoOscuro ? "border-gray-700" : "border-gray-200";
  const cardBg = modoOscuro ? "bg-gray-800/50" : "bg-white";
  const secondaryText = modoOscuro ? "text-gray-300" : "text-gray-600";
  const titleColor = modoOscuro ? "text-white" : "text-gray-800";
  const detailText = modoOscuro ? "text-gray-400" : "text-gray-600";
  const borderLight = modoOscuro ? "border-gray-700" : "border-gray-200";
  const searchBg = modoOscuro ? "bg-gray-900" : "bg-white";
  const searchBorder = modoOscuro ? "border-gray-600" : "border-gray-300";
  const searchFocus =
    "focus:ring-[#39A900] focus:border-[#39A900] transition-all";
  const placeholderColor = modoOscuro
    ? "placeholder-gray-400"
    : "placeholder-gray-500";
  const linkColor = "text-[#39A900] hover:text-[#2d8500]";

  return (
    <div
      className={`min-h-screen rounded-3xl p-4 md:p-8 lg:p-10 max-w-7xl mx-auto my-4 md:my-8 ${bgColor} ${textColor}`}
    >
      {/* Header */}
      <div className="text-center mb-6 md:mb-10">
        <h2 className={`text-3xl md:text-4xl font-extrabold mb-2 ${titleColor}`}>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
            Gestión de Convocatorias
          </span>
        </h2>
        <p className={`text-base md:text-lg ${secondaryText}`}>
          Administra las convocatorias publicadas
        </p>
      </div>

      {/* Search + button */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6 md:mb-10">
        <input
          type="text"
          placeholder="Buscar convocatorias..."
          className={`border rounded-2xl px-4 py-2 md:px-5 md:py-3 text-base md:text-lg focus:outline-none focus:ring-2 w-full sm:w-80 lg:w-96 hover:shadow-md ${searchBg} ${textColor} ${searchBorder} ${searchFocus} ${placeholderColor}`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={handleAddConvocatoria}
          className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-[#39A900] text-white text-base md:text-lg font-medium rounded-2xl hover:bg-[#2d8500] transition-all shadow-md hover:shadow-xl transform hover:scale-105 duration-300 w-full sm:w-auto justify-center"
        >
          <Plus size={18} className="md:size-5" />
          Crear Convocatoria
        </button>
      </div>

      {/* Lista */}
      <div className="space-y-6">
        {filteredConvocatorias.length === 0 ? (
          <div
            className={`text-center py-12 md:py-20 rounded-2xl border ${borderLight}`}
          >
            <p className={`${secondaryText} text-base md:text-lg`}>
              {search
                ? `No se encontraron convocatorias que coincidan con "${search}"`
                : "Aún no hay convocatorias publicadas"}
            </p>
          </div>
        ) : (
          filteredConvocatorias.map((conv) => (
            <div
              key={conv.id}
              className={`rounded-2xl border shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${cardBg} ${borderColor} ${
                modoOscuro
                  ? "hover:border-[#39A900]/50"
                  : "hover:border-[#39A900]"
              }`}
            >
              {/* Imagen */}
              {conv.imageUrl && (
                <div className="w-full h-64 md:h-80 rounded-t-2xl overflow-hidden bg-gray-100">
                  <img
                    src={conv.imageUrl}
                    alt={conv.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Contenido */}
              <div className="p-4 md:p-6 space-y-4">
                {/* Título + botones */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <h3
                    className={`text-xl md:text-2xl font-bold transition-colors cursor-pointer ${
                      modoOscuro
                        ? "hover:text-[#39A900] text-white"
                        : "hover:text-[#39A900] text-gray-800"
                    }`}
                  >
                    {conv.title}
                  </h3>

                  {/* Botones */}
                  <div className="flex flex-row gap-2 self-start md:self-auto">
                    <button
                      onClick={() => {
                        setConvocatoriaEditando(conv);
                        setEditarModal(true);
                      }}
                      className={`p-2 md:p-3 rounded-xl ${
                        modoOscuro
                          ? "bg-blue-900/30 text-blue-400 hover:bg-blue-900/50"
                          : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                      }`}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(conv.id)}
                      className={`p-2 md:p-3 rounded-xl ${
                        modoOscuro
                          ? "bg-red-900/30 text-red-400 hover:bg-red-900/50"
                          : "bg-red-50 text-red-600 hover:bg-red-100"
                      }`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Descripción */}
                <p className={`text-sm md:text-base ${detailText}`}>
                  {conv.description}
                </p>

                {/* Sección de detalles */}
                <div
                  className={`grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-4 border-t ${borderLight}`}
                >
                  <div className="space-y-2">
                    <p><b>Recursos:</b> {conv.resources}</p>
                    <p><b>Objetivo:</b> {conv.objective}</p>
                    <p><b>Notas:</b> {conv.notes}</p>
                    <p><b>Página:</b> {conv.pageName}</p>
                  </div>
                  <div className="space-y-2">
                    <p><b>Entidad:</b> {getEntidadNombre(conv.institutionId)}</p>
                    <p><b>Línea:</b> {getLineaNombre(conv.lineId)}</p>
                    <p><b>Público Objetivo:</b> {getPublicoNombre(conv.targetAudienceId)}</p>
                    <p><b>Área de Interés:</b> {getInteresNombre(conv.interestId)}</p>
                    <p><b>Usuario:</b> {getUsuarioNombre(conv.userId)}</p>
                  </div>
                </div>

                {/* Fechas y enlaces */}
                <div
                  className={`flex flex-col sm:flex-row flex-wrap gap-4 pt-4 border-t ${borderLight} text-sm`}
                >
                  <p><b>Apertura:</b> {new Date(conv.openDate).toLocaleDateString()}</p>
                  <p><b>Cierre:</b> {new Date(conv.closeDate).toLocaleDateString()}</p>
                  <p>
                    <b>Convocatoria:</b>{" "}
                    <a href={conv.callLink} target="_blank" className={linkColor}>
                      Ver enlace
                    </a>
                  </p>
                  <p>
                    <b>Página web:</b>{" "}
                    <a href={conv.pageUrl} target="_blank" className={linkColor}>
                      {conv.pageUrl}
                    </a>
                  </p>
                  <p><b>Clicks:</b> {conv.clickCount}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modales */}
      {mostrarModal && (
        <ConvocatoriaModal
          mostrarModal={mostrarModal}
          cerrarModal={() => setMostrarModal(false)}
          onSave={handleCreate}
          modoOscuro={modoOscuro}
        />
      )}

      {editarModal && convocatoriaEditando && (
        <EditarConvocatoriaModal
          mostrarModal={editarModal}
          cerrarModal={() => setEditarModal(false)}
          convocatoria={convocatoriaEditando}
          onSave={handleUpdate}
          modoOscuro={modoOscuro}
        />
      )}
    </div>
  );
}
