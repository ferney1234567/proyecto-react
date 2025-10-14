'use client';

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
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
import DetalleConvocatoriaModal from "./detalleConvocatoria";

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
  const [convocatoriaEditando, setConvocatoriaEditando] = useState<Convocatoria | null>(null);
  const [detalleModal, setDetalleModal] = useState<Convocatoria | null>(null);

  const [entidades, setEntidades] = useState<any[]>([]);
  const [lineas, setLineas] = useState<any[]>([]);
  const [publicos, setPublicos] = useState<any[]>([]);
  const [intereses, setIntereses] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);

  // ✅ Alertas estilizadas
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

  // === Cargar datos iniciales ===
  useEffect(() => {
    const cargar = async () => {
      try {
        const [conv, e, l, p, i, u] = await Promise.all([
          getConvocatorias(),
          getInstituciones(),
          getLineas(),
          getPublicos(),
          getIntereses(),
          getUsers(),
        ]);
        setConvocatorias(conv.data || []);
        setEntidades(e.data || []);
        setLineas(l.data || []);
        setPublicos(p.data || []);
        setIntereses(i.data || []);
        setUsuarios(u || []);
      } catch {
        showError("Error cargando convocatorias o catálogos");
      }
    };
    cargar();
  }, []);

  // === CRUD ===
  const handleCreate = async (formData: any) => {
    try {
      await createConvocatoria(formData);
      showSuccess("Convocatoria creada correctamente");
      setMostrarModal(false);
      const data = await getConvocatorias();
      setConvocatorias(data.data || []);
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleUpdate = async (formData: any) => {
    try {
      await updateConvocatoria(formData.id, formData);
      showSuccess("Convocatoria actualizada correctamente");
      setEditarModal(false);
      setConvocatoriaEditando(null);
      const data = await getConvocatorias();
      setConvocatorias(data.data || []);
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleDelete = (id: number) => {
    Swal.fire({
      title: "¿Eliminar convocatoria?",
      text: "Esta acción no se puede deshacer.",
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
          showSuccess("Convocatoria eliminada");
          const data = await getConvocatorias();
          setConvocatorias(data.data || []);
        } catch (err: any) {
          showError(err.message);
        }
      }
    });
  };

  const filtered = convocatorias.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  // === Estilos del tema ===
  const bgColor = modoOscuro ? "bg-[#1a0526]" : "bg-white";
  const textColor = modoOscuro ? "text-white" : "text-gray-900";
  const borderColor = modoOscuro ? "border-white/20" : "border-gray-200";
  const cardBg = modoOscuro ? "bg-white/10" : "bg-white";
  const placeholderColor = modoOscuro ? "placeholder-gray-400" : "placeholder-gray-500";
  const searchBg = modoOscuro ? "bg-white/10" : "bg-white";
  const searchBorder = modoOscuro ? "border-white/20" : "border-gray-300";
  const searchFocus = "focus:ring-[#39A900] focus:border-[#39A900]";
  const secondaryText = modoOscuro ? "text-gray-300" : "text-gray-600";

  return (
    <div className={`rounded-3xl p-10 max-w-9xl mx-auto my-12 ${bgColor} ${textColor}`}>
      {/* HEADER */}
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold mb-2">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
            Gestión de Convocatorias
          </span>
        </h2>
        <p className={`text-lg ${secondaryText}`}>Administra las convocatorias publicadas</p>
      </div>

      {/* BUSCADOR + BOTÓN */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="Buscar convocatorias..."
            className={`border rounded-2xl px-5 py-3 text-lg pl-12 focus:outline-none focus:ring-2 w-full transition-all duration-300 hover:shadow-md ${searchBg} ${textColor} ${searchBorder} ${searchFocus} ${placeholderColor}`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <button
          onClick={() => setMostrarModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#39A900] text-white text-lg font-medium rounded-2xl hover:bg-[#2d8500] transition-all shadow-md hover:shadow-xl transform hover:scale-105 duration-300 w-full sm:w-auto justify-center"
        >
          <Plus size={20} /> Crear Convocatoria
        </button>
      </div>

      {/* TARJETAS */}
      {filtered.length === 0 ? (
        <div className={`text-center py-20 rounded-2xl border ${borderColor}`}>
          <p className={`${secondaryText} text-lg`}>No hay convocatorias publicadas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((conv) => (
            <div
              key={conv.id}
              className={`flex flex-col h-[520px] sm:h-[500px] justify-between rounded-3xl border ${borderColor} shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden ${cardBg}`}
            >
              {/* Imagen superior */}
              {conv.imageUrl && (
                <img
                  src={conv.imageUrl}
                  alt={conv.title}
                  className="w-full h-56 object-cover cursor-pointer"
                  onClick={() => setDetalleModal(conv)}
                />
              )}

              {/* Contenido textual */}
              <div className="flex flex-col flex-grow p-6 space-y-4">
                <div className="flex justify-between items-start">
                  {/* Título con espacio fijo */}
                  <h3
                    className={`text-2xl font-semibold leading-snug ${
                      modoOscuro
                        ? "text-white hover:text-[#39A900]"
                        : "text-gray-800 hover:text-[#39A900]"
                    }`}
                    style={{
                      minHeight: "3.4em",
                      lineHeight: "1.7em",
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 2,
                      textOverflow: "ellipsis",
                    }}
                    title={conv.title}
                  >
                    {conv.title}
                  </h3>

                  {/* Botones */}
                  <div className="flex gap-3 ml-2">
                    <button
                      onClick={() => {
                        setConvocatoriaEditando(conv);
                        setEditarModal(true);
                      }}
                      className={`p-2 rounded-xl ${
                        modoOscuro
                          ? "bg-blue-900/30 text-blue-400"
                          : "bg-blue-50 text-blue-600"
                      } hover:scale-110 transition`}
                      title="Editar"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(conv.id)}
                      className={`p-2 rounded-xl ${
                        modoOscuro
                          ? "bg-red-900/30 text-red-400"
                          : "bg-red-50 text-red-600"
                      } hover:scale-110 transition`}
                      title="Eliminar"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Descripción */}
                <p
                  className={`text-base ${secondaryText}`}
                  style={{
                    minHeight: "4.8em",
                    lineHeight: "1.6em",
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 3,
                    textOverflow: "ellipsis",
                  }}
                >
                  {conv.description || "Sin descripción disponible."}
                </p>

                {/* Fechas */}
                <div className="text-sm space-y-1 mt-auto">
                  <p>
                    <b>Apertura:</b> {new Date(conv.openDate).toLocaleDateString()}
                  </p>
                  <p>
                    <b>Cierre:</b> {new Date(conv.closeDate).toLocaleDateString()}
                  </p>
                </div>

                {/* Botón Ver más */}
                <div className="mt-4">
                  <button
                    onClick={() => setDetalleModal(conv)}
                    className="w-full px-4 py-2 bg-[#39A900] text-white rounded-xl hover:bg-[#2d8500] transition-all font-medium"
                  >
                    Ver más
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODALES */}
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
      {detalleModal && (
        <DetalleConvocatoriaModal
          convocatoria={detalleModal}
          cerrarModal={() => setDetalleModal(null)}
          modoOscuro={modoOscuro}
          nombresRelacionados={{
            entidad:
              entidades.find((e) => e.id === detalleModal.institutionId)?.name ||
              entidades.find((e) => e.id === detalleModal.institutionId)?.nombre ||
              "Sin asignar",
            linea:
              lineas.find((l) => l.id === detalleModal.lineId)?.name ||
              lineas.find((l) => l.id === detalleModal.lineId)?.nombre ||
              "Sin asignar",
            publico:
              publicos.find((p) => p.id === detalleModal.targetAudienceId)?.name ||
              publicos.find((p) => p.id === detalleModal.targetAudienceId)?.nombre ||
              "Sin asignar",
            interes:
              intereses.find((i) => i.id === detalleModal.interestId)?.name ||
              intereses.find((i) => i.id === detalleModal.interestId)?.nombre ||
              "Sin asignar",
            usuario:
              usuarios.find((u) => u.id === detalleModal.userId)?.name ||
              usuarios.find((u) => u.id === detalleModal.userId)?.username ||
              "Sin asignar",
          }}
        />
      )}
    </div>
  );
}
