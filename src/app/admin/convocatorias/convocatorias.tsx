'use client';

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search, Eye } from "lucide-react";
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
  const [convocatoriaEditando, setConvocatoriaEditando] =
    useState<Convocatoria | null>(null);
  const [detalleModal, setDetalleModal] = useState<Convocatoria | null>(null);

  const [entidades, setEntidades] = useState<any[]>([]);
  const [lineas, setLineas] = useState<any[]>([]);
  const [publicos, setPublicos] = useState<any[]>([]);
  const [intereses, setIntereses] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);

  // ✅ Alertas
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

  // === Cargar datos ===
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

  // === Estilos dinámicos ===
  const bgColor = modoOscuro ? "bg-[#1a0526]" : "bg-white-100";
  const textColor = modoOscuro ? "text-white" : "text-gray-900";
  const secondaryText = modoOscuro ? "text-gray-400" : "text-gray-600";

  return (
    <div className={`rounded-3xl p-10 max-w-7xl mx-auto my-12 ${bgColor} ${textColor}`}>
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold mb-3">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-blue-500">
            Gestión de Convocatorias
          </span>
        </h2>
        <p className={`text-lg ${secondaryText}`}>
          Crea, edita y administra las convocatorias publicadas
        </p>
      </div>

      {/* Buscador + Crear */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="Buscar convocatorias..."
            className={`border rounded-2xl px-5 py-3 text-lg pl-12 w-full transition-all duration-300 hover:shadow-md ${
              modoOscuro
                ? "bg-[#1e293b] text-gray-200 border-gray-700"
                : "bg-white text-gray-800 border-gray-300"
            } focus:ring-2 focus:ring-green-500 outline-none`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        <button
  onClick={() => setMostrarModal(true)}
  className="flex items-center gap-2 px-6 py-3 
             bg-gradient-to-r from-[#39A900] to-[#2d8500]
             text-white text-lg font-semibold rounded-2xl
             hover:from-[#2d8500] hover:to-[#39A900]
             transition-all shadow-lg hover:shadow-2xl
             transform hover:scale-105 duration-300"
>
  <Plus size={20} /> Crear Convocatoria
</button>

      </div>

      {/* Tarjetas */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 border border-gray-500/20 rounded-2xl">
          <p className={secondaryText}>No hay convocatorias registradas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((conv) => (
            <div
              key={conv.id}
              className={`rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-2 ${
                modoOscuro ? "bg-[#1e293b]" : "bg-white"
              }`}
            >
              {/* Imagen superior (abre modal) */}
              <div
                className="relative cursor-pointer group"
                onClick={() => setDetalleModal(conv)}
              >
                {conv.imageUrl ? (
                  <img
                    src={conv.imageUrl}
                    alt={conv.title}
                    className="w-full h-48 object-cover group-hover:brightness-90 transition-all duration-300"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-500">
                    Sin imagen
                  </div>
                )}
              </div>

              {/* Contenido */}
              <div className="p-6 space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold line-clamp-2 hover:text-green-600 transition-colors">
                    {conv.title}
                  </h3>

                  {/* Botones */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDetalleModal(conv)}
                      className="p-2 rounded-full bg-green-500/10 text-green-600 hover:bg-green-600 hover:text-white transition"
                      title="Ver más"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => {
                        setConvocatoriaEditando(conv);
                        setEditarModal(true);
                      }}
                      className="p-2 rounded-full bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition"
                      title="Editar"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(conv.id)}
                      className="p-2 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition"
                      title="Eliminar"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <p className={`text-sm ${secondaryText} line-clamp-3`}>
                  {conv.description || "Sin descripción disponible."}
                </p>

                <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1 mt-3">
                  <p>
                    <b>Apertura:</b> {new Date(conv.openDate).toLocaleDateString()}
                  </p>
                  <p>
                    <b>Cierre:</b> {new Date(conv.closeDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
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
      {detalleModal && (
        <DetalleConvocatoriaModal
          convocatoria={detalleModal}
          cerrarModal={() => setDetalleModal(null)}
          modoOscuro={modoOscuro}
          nombresRelacionados={{
            entidad:
              entidades.find((e) => e.id === detalleModal.institutionId)?.name ||
              "Sin asignar",
            linea:
              lineas.find((l) => l.id === detalleModal.lineId)?.name ||
              "Sin asignar",
            publico:
              publicos.find((p) => p.id === detalleModal.targetAudienceId)?.name ||
              "Sin asignar",
            interes:
              intereses.find((i) => i.id === detalleModal.interestId)?.name ||
              "Sin asignar",
            usuario:
              usuarios.find((u) => u.id === detalleModal.userId)?.name ||
              "Sin asignar",
          }}
        />
      )}
    </div>
  );
}
