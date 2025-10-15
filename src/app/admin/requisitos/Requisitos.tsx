"use client";
import { useState, useEffect } from "react";
import {
  Edit, Trash2, Plus, Search, Loader2,
  FileText, Building2, FolderGit2, StickyNote
} from "lucide-react";
import Swal from "sweetalert2";

// API
import {
  getRequisitos,
  createRequisito,
  updateRequisito,
  deleteRequisito,
} from "../../api/requisitos/routes";
import { getInstituciones } from "../../api/entidadInstitucion/route";
import { getRequirementGroups } from "../../api/tipoRequisitos/routes";

// Modales
import ModalRequisito from "./crearRequisito";
import ModalEditarRequisito from "./editarRequisitos";

interface RequisitosProps {
  modoOscuro: boolean;
}

interface Requisito {
  id: number | string;
  nombre: string;
  observacion: string;
  entidad: string;
  tipo: string;
  entidadId?: number;
  tipoId?: number;
}

export default function Requisitos({ modoOscuro }: RequisitosProps) {
  const [requisitos, setRequisitos] = useState<Requisito[]>([]);
  const [buscar, setBuscar] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const [instituciones, setInstituciones] = useState<any[]>([]);
  const [grupos, setGrupos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [nuevoRequisito, setNuevoRequisito] = useState<Requisito>({
    id: 0,
    nombre: "",
    observacion: "",
    entidad: "",
    tipo: "",
  });
  const [requisitoSeleccionado, setRequisitoSeleccionado] = useState<Requisito | null>(null);

  // === CARGAR DATOS ===
  const cargarRequisitos = async () => {
    setLoading(true);
    const data = await getRequisitos();
    const arr = Array.isArray(data) ? data : data?.data || [];

    const mapped = arr.map((r: any) => ({
      id: r.id,
      nombre: r.name,
      observacion: r.notes || "Sin observación",
      entidad: r.institution?.name || "Sin institución",
      tipo: r.requirementGroup?.name || "Sin grupo",
      entidadId: r.institution?.id,
      tipoId: r.requirementGroup?.id,
    }));

    setRequisitos(mapped);
    setLoading(false);
  };

  const cargarCatalogos = async () => {
    try {
      const [inst, grp] = await Promise.all([getInstituciones(), getRequirementGroups()]);
      setInstituciones(inst?.data || inst || []);
      setGrupos(grp?.data || grp || []);
    } catch (err) {
      console.error("❌ Error cargando catálogos:", err);
    }
  };

  useEffect(() => {
    cargarRequisitos();
    cargarCatalogos();
  }, []);

  // === ALERTAS ===
  const showSuccess = (mensaje: string) =>
    Swal.fire({
      icon: "success",
      title: "¡Éxito!",
      text: mensaje,
      confirmButtonColor: "#39A900",
      background: modoOscuro ? "#1a0526" : "#fff",
      color: modoOscuro ? "#fff" : "#333",
    });

  // === ELIMINAR ===
  const eliminarRequisito = async (id: number | string) => {
    Swal.fire({
      title: "¿Eliminar este requisito?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      background: modoOscuro ? "#1a0526" : "#fff",
      color: modoOscuro ? "#fff" : "#333",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteRequisito(id);
          setRequisitos(requisitos.filter((r) => r.id !== id));
          showSuccess("El requisito fue eliminado correctamente");
        } catch {
          Swal.fire("Error", "No se pudo eliminar", "error");
        }
      }
    });
  };

  // === CREAR ===
  const abrirModal = () => {
    setNuevoRequisito({ id: 0, nombre: "", observacion: "", entidad: "", tipo: "" });
    setMostrarModal(true);
  };

  const cerrarModal = () => setMostrarModal(false);

  const guardarRequisito = async () => {
    try {
      await createRequisito({
        name: nuevoRequisito.nombre,
        notes: nuevoRequisito.observacion || "Sin observación",
        institutionId: Number(nuevoRequisito.entidad),
        groupId: Number(nuevoRequisito.tipo),
      });

      await cargarRequisitos();
      cerrarModal();
      showSuccess("El requisito fue agregado correctamente");
    } catch (error) {
      Swal.fire("Error", "No se pudo guardar el requisito", "error");
    }
  };

  // === EDITAR ===
  const editarRequisito = (req: Requisito) => {
    setRequisitoSeleccionado(req);
    setMostrarEditar(true);
  };

  const guardarCambiosRequisito = async () => {
    if (!requisitoSeleccionado) return;
    try {
      await updateRequisito(requisitoSeleccionado.id, {
        name: requisitoSeleccionado.nombre,
        notes: requisitoSeleccionado.observacion || "Sin observación",
        institutionId: Number(requisitoSeleccionado.entidadId),
        groupId: Number(requisitoSeleccionado.tipoId),
      });

      const inst = instituciones.find((i) => i.id === requisitoSeleccionado.entidadId);
      const grp = grupos.find((g) => g.id === requisitoSeleccionado.tipoId);

      setRequisitos((prev) =>
        prev.map((r) =>
          r.id === requisitoSeleccionado.id
            ? {
                ...requisitoSeleccionado,
                observacion: requisitoSeleccionado.observacion || "Sin observación",
                entidad: inst?.name || "Sin institución",
                tipo: grp?.name || "Sin grupo",
              }
            : r
        )
      );

      setMostrarEditar(false);
      setRequisitoSeleccionado(null);
      showSuccess("El requisito fue actualizado correctamente");
    } catch {
      Swal.fire("Error", "No se pudo actualizar", "error");
    }
  };

  // === FILTRO (busca por requisito y observación) ===
  const term = (buscar || "").toLowerCase();
  const filtrados = requisitos.filter(
    (r) =>
      (r.nombre && r.nombre.toLowerCase().includes(term)) ||
      (r.observacion && r.observacion.toLowerCase().includes(term))
  );

  // === ESTILOS ===
  const bgColor = modoOscuro ? "bg-[#1a0526]" : "bg-white";
  const textColor = modoOscuro ? "text-white" : "text-gray-900";
  const borderColor = modoOscuro ? "border-white/20" : "border-gray-200";
  const cardBg = modoOscuro ? "bg-white/10" : "bg-white";
  const placeholderColor = modoOscuro ? "placeholder-gray-400" : "placeholder-gray-500";
  const searchBg = modoOscuro ? "bg-white/10" : "bg-white";
  const searchBorder = modoOscuro ? "border-white/20" : "border-gray-300";
  const searchFocus = "focus:ring-[#39A900] focus:border-[#39A900]";
  const emptyStateBg = modoOscuro ? "bg-gray-800/30" : "bg-gray-50";
  const secondaryText = modoOscuro ? "text-gray-300" : "text-gray-600";
  const titleColor = modoOscuro ? "text-white" : "text-gray-800";
  const iconBg = modoOscuro ? "bg-[#39A900]/20" : "bg-[#39A900]/10";

  return (
    <div className={`rounded-3xl p-10 max-w-9xl mx-auto my-12 ${bgColor} ${textColor}`}>
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className={`text-4xl font-extrabold mb-2 ${titleColor}`}>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
            Gestión de Requisitos
          </span>
        </h2>
        <p className={`text-lg ${secondaryText}`}>
          Administra los requisitos 
        </p>
      </div>

      {/* Buscar + Botón */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="Buscar por nombre u observación..."
            className={`border rounded-2xl px-5 py-3 text-lg pl-12 focus:outline-none focus:ring-2 w-full transition-all duration-300 hover:shadow-md ${searchBg} ${textColor} ${searchBorder} ${searchFocus} ${placeholderColor}`}
            value={buscar}
            onChange={(e) => setBuscar(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <button
          onClick={abrirModal}
          className="flex items-center gap-2 px-6 py-3 bg-[#39A900] text-white text-lg font-medium rounded-2xl hover:bg-[#2d8500] transition-all shadow-md hover:shadow-xl transform hover:scale-105 duration-300 w-full sm:w-auto justify-center"
        >
          <Plus size={20} /> Nuevo Requisito
        </button>
      </div>

      {/* Loader */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin h-10 w-10 text-green-600" />
        </div>
      ) : (
        <div className="space-y-5">
          {filtrados.length === 0 ? (
            <div className={`text-center py-16 rounded-2xl border ${emptyStateBg}`}>
              <p className={`${secondaryText} text-lg`}>
                No se encontraron requisitos
              </p>
            </div>
          ) : (
            filtrados.map((req) => (
              <div
                key={req.id}
                className={`p-6 rounded-2xl border shadow-md hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row justify-between items-center gap-5 transform hover:-translate-y-1 ${cardBg} ${borderColor}`}
              >
                {/* Info */}
                <div className="flex flex-col gap-4 w-full">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${iconBg} text-[#39A900]`}>
                      <FileText size={22} />
                    </div>
                    <p className={`text-lg hover:text-[#39A900] ${secondaryText}`}>
                      Requisito: {req.nombre}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${iconBg} text-[#39A900]`}>
                      <StickyNote size={20} />
                    </div>
                    <p className={`text-lg ${secondaryText}`}>
                      Observación: {req.observacion}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${iconBg} text-[#39A900]`}>
                      <Building2 size={20} />
                    </div>
                    <p className={`text-lg ${secondaryText}`}>
                      Entidad: {req.entidad}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${iconBg} text-[#39A900]`}>
                      <FolderGit2 size={20} />
                    </div>
                    <p className={`text-lg ${secondaryText}`}>
                      Grupo: {req.tipo}
                    </p>
                  </div>
                </div>

                {/* Botones */}
                <div className="flex gap-3">
                  <button
                    onClick={() => editarRequisito(req)}
                    className={`p-3 rounded-xl ${
                      modoOscuro
                        ? "bg-blue-900/30 text-blue-400"
                        : "bg-blue-50 text-blue-600"
                    } hover:scale-110 transition`}
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => eliminarRequisito(req.id)}
                    className={`p-3 rounded-xl ${
                      modoOscuro
                        ? "bg-red-900/30 text-red-400"
                        : "bg-red-50 text-red-600"
                    } hover:scale-110 transition`}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modales */}
      {mostrarModal && (
        <ModalRequisito
          requisito={nuevoRequisito}
          setRequisito={setNuevoRequisito}
          onClose={cerrarModal}
          onSave={guardarRequisito}
          modoOscuro={modoOscuro}
        />
      )}

      {mostrarEditar && requisitoSeleccionado && (
        <ModalEditarRequisito
          visible={mostrarEditar}
          onClose={() => setMostrarEditar(false)}
          onSave={guardarCambiosRequisito}
          requisito={requisitoSeleccionado}
          setRequisito={setRequisitoSeleccionado}
          modoOscuro={modoOscuro}
        />
      )}
    </div>
  );
}
