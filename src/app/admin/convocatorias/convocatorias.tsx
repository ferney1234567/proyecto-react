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

  const [expanded, setExpanded] = useState<number[]>([]);
  const toggleExpand = (id: number) => {
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const [entidades, setEntidades] = useState<any[]>([]);
  const [lineas, setLineas] = useState<any[]>([]);
  const [publicos, setPublicos] = useState<any[]>([]);
  const [intereses, setIntereses] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);

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

  const handleCreate = async (formData: any) => {
    try {
      await createConvocatoria({ ...formData });
      showSuccess("Convocatoria creada.");
      setMostrarModal(false);
      cargarConvocatorias();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleUpdate = async (formData: any) => {
    try {
      await updateConvocatoria(formData.id, { ...formData });
      showSuccess("Convocatoria actualizada.");
      setEditarModal(false);
      setConvocatoriaEditando(null);
      cargarConvocatorias();
    } catch (err: any) {
      showError(err.message);
    }
  };

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

  const filteredConvocatorias = convocatorias.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  // === ESTILOS ===
  const bgColor = modoOscuro ? "bg-[#0b1220]" : "bg-white";
  const textColor = modoOscuro ? "text-white" : "text-gray-900";
  const borderColor = modoOscuro ? "border-gray-700" : "border-gray-200";
  const cardBg = modoOscuro ? "bg-gray-800/60" : "bg-white";
  const secondaryText = modoOscuro ? "text-gray-300" : "text-gray-600";
  const detailText = modoOscuro ? "text-gray-400" : "text-gray-700";
  const linkColor = "text-[#39A900] hover:text-[#2d8500]";

  return (
    <div className={`min-h-screen p-6 md:p-10 max-w-7xl mx-auto ${bgColor} ${textColor}`}>
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-2">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
            Gestión de Convocatorias
          </span>
        </h2>
        <p className={`text-lg ${secondaryText}`}>Administra las convocatorias publicadas</p>
      </div>

      {/* Search + button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
        <input
          type="text"
          placeholder="Buscar convocatorias..."
          className="border rounded-2xl px-5 py-3 text-lg focus:outline-none focus:ring-2 w-full sm:w-80 lg:w-96"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={() => setMostrarModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#39A900] text-white text-lg font-semibold rounded-2xl hover:bg-[#2d8500] transition-all shadow-md hover:shadow-xl transform hover:scale-105 duration-300"
        >
          <Plus size={20} /> Crear Convocatoria
        </button>
      </div>

      {/* Grid */}
      {filteredConvocatorias.length === 0 ? (
        <p className="text-center py-20 text-xl">No hay convocatorias publicadas</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredConvocatorias.map((conv) => {
            const isExpanded = expanded.includes(conv.id);
            return (
              <div
                key={conv.id}
                className={`flex flex-col rounded-3xl border ${borderColor} shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden ${cardBg}`}
              >
                {conv.imageUrl && (
                  <img src={conv.imageUrl} alt={conv.title} className="w-full h-56 object-cover" />
                )}
                <div className="flex flex-col flex-grow p-6 space-y-4">
                  <div className="flex flex-row justify-between items-start">
                    <h3 className="text-2xl font-bold hover:text-[#39A900] transition-colors">
                      {conv.title}
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setConvocatoriaEditando(conv);
                          setEditarModal(true);
                        }}
                        className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(conv.id)}
                        className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Descripción truncada en 3-4 líneas */}
                  {!isExpanded && (
                    <p className={`text-base ${detailText} line-clamp-4`}>
                      {conv.description}
                    </p>
                  )}

                  {/* Expansión completa */}
                  {isExpanded && (
                    <div className="text-sm space-y-2 border-t pt-3">
                      <p><b>Descripción:</b> {conv.description}</p>
                      <p><b>Recursos:</b> {conv.resources}</p>
                      <p><b>Objetivo:</b> {conv.objective}</p>
                      <p><b>Notas:</b> {conv.notes}</p>
                      <p><b>Entidad:</b> {getEntidadNombre(conv.institutionId)}</p>
                      <p><b>Línea:</b> {getLineaNombre(conv.lineId)}</p>
                      <p><b>Público:</b> {getPublicoNombre(conv.targetAudienceId)}</p>
                      <p><b>Interés:</b> {getInteresNombre(conv.interestId)}</p>
                      <p><b>Usuario:</b> {getUsuarioNombre(conv.userId)}</p>
                      <a href={conv.callLink} target="_blank" className={linkColor}>Ver Convocatoria</a>
                      <a href={conv.pageUrl} target="_blank" className={linkColor}>{conv.pageUrl}</a>
                      <p><b>Clicks:</b> {conv.clickCount}</p>
                    </div>
                  )}

                  <div className="mt-auto">
                    <p className="text-sm"><b>Apertura:</b> {new Date(conv.openDate).toLocaleDateString()}</p>
                    <p className="text-sm"><b>Cierre:</b> {new Date(conv.closeDate).toLocaleDateString()}</p>
                    <button
                      onClick={() => toggleExpand(conv.id)}
                      className="mt-3 px-4 py-2 w-full bg-[#39A900] text-white rounded-xl hover:bg-[#2d8500] transition-all font-medium"
                    >
                      {isExpanded ? "Ver menos" : "Ver más"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

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
