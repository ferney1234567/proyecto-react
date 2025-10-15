"use client";
import { useState, useEffect } from "react";
import {
  Edit, Trash2, Plus, Search, Building2, Calendar, CheckCircle2, XCircle
} from "lucide-react";
import Swal from "sweetalert2";
import ModalChequeo from "./crearChequeo";
import ModalEditarChequeo from "./editarCheckeo";
import {
  createRequirementCheck,
  updateRequirementCheck,
  deleteRequirementCheck,
} from "../../api/requirementChecks/route";

// ====================== Tipos ======================
interface ChequeosProps {
  modoOscuro: boolean;
}
interface Company {
  id: number;
  name: string;
  legalRepresentativeName?: string | null;
}
interface Requirement {
  id: number;
  name: string;
  notes: string;
}
interface Chequeo {
  id: number;
  isChecked: boolean;
  companyId: number;
  requirementId: number;
  createdAt: string;
  updatedAt?: string;
  company: Company | null;
  requirement: Requirement | null;
}
interface Empresa {
  id: number;
  name: string;
}
interface Requisito {
  id: number;
  name: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

// ====================== Componente ======================
export default function Chequeos({ modoOscuro }: ChequeosProps) {
  const [token, setToken] = useState<string | null>(null);
  const [chequeos, setChequeos] = useState<Chequeo[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [requisitos, setRequisitos] = useState<Requisito[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);

  // Estado para nuevo chequeo
  const [nuevoChequeo, setNuevoChequeo] = useState({
    id: 0,
    isChecked: false,
    empresa: "",
    requisito: "",
    companyId: null as number | null,
    requirementId: null as number | null,
  });

  // ====================== Helpers ======================
  const showSuccess = (mensaje: string) =>
    Swal.fire({
      icon: "success",
      title: "¡Éxito!",
      text: mensaje,
      confirmButtonColor: "#39A900",
      background: modoOscuro ? "#1a0526" : "#fff",
      color: modoOscuro ? "#fff" : "#333",
    });

  const showWarning = (mensaje: string) =>
    Swal.fire({
      icon: "warning",
      title: "Atención",
      text: mensaje,
      confirmButtonColor: "#39A900",
      background: modoOscuro ? "#1a0526" : "#fff",
      color: modoOscuro ? "#fff" : "#333",
    });

  // ====================== Fetch inicial ======================
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) setToken(t);
  }, []);

  useEffect(() => {
    if (token) {
      cargarChequeos();
      cargarEmpresasRequisitos();
    }
  }, [token]);

  const cargarChequeos = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/requirementChecks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok && Array.isArray(data.data)) {
        setChequeos(data.data);
      } else {
        showWarning("No se pudieron obtener los chequeos");
      }
    } catch {
      showWarning("Error al cargar chequeos");
    }
  };

  const cargarEmpresasRequisitos = async () => {
    if (!token) return;
    try {
      const [resEmp, resReq] = await Promise.all([
        fetch(`${API_URL}/companies`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then((r) => r.json()),
        fetch(`${API_URL}/requirements`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then((r) => r.json()),
      ]);
      setEmpresas(resEmp.data || []);
      setRequisitos(resReq.data || []);
    } catch {
      showWarning("Error cargando empresas o requisitos");
    }
  };

  // ====================== Guardar / Editar ======================
  const handleGuardar = async () => {
    try {
      if (!nuevoChequeo.companyId || !nuevoChequeo.requirementId) {
        showWarning("Debes seleccionar una empresa y un requisito");
        return;
      }

      if (editandoId) {
        await updateRequirementCheck(
          editandoId,
          nuevoChequeo.isChecked,
          nuevoChequeo.companyId,
          nuevoChequeo.requirementId,
          null
        );
        showSuccess("Chequeo actualizado correctamente");
        setMostrarModalEditar(false);
      } else {
        await createRequirementCheck(
          nuevoChequeo.isChecked,
          nuevoChequeo.companyId,
          nuevoChequeo.requirementId,
          null
        );
        showSuccess("Chequeo agregado correctamente");
        setMostrarModal(false);
      }

      setEditandoId(null);
      await cargarChequeos();
    } catch (error: any) {
      showWarning(error.message);
    }
  };

  // ====================== Eliminar ======================
  const handleDeleteChequeo = (id: number) => {
    Swal.fire({
      title: "¿Eliminar este chequeo?",
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
          await deleteRequirementCheck(id);
          await cargarChequeos();
          showSuccess("Chequeo eliminado correctamente");
        } catch {
          showWarning("No se pudo eliminar");
        }
      }
    });
  };

  // ====================== Editar ======================
  const handleEditChequeo = (chequeo: Chequeo) => {
    setEditandoId(chequeo.id);
    setNuevoChequeo({
      id: chequeo.id,
      isChecked: chequeo.isChecked,
      empresa: chequeo.company?.name || "",
      requisito: chequeo.requirement?.name || "",
      companyId: chequeo.companyId,
      requirementId: chequeo.requirementId,
    });
    setMostrarModalEditar(true);
  };

  // ====================== Nuevo ======================
  const handleAddChequeo = () => {
    setEditandoId(null);
    setNuevoChequeo({
      id: 0,
      isChecked: false,
      empresa: "",
      requisito: "",
      companyId: null,
      requirementId: null,
    });
    setMostrarModal(true);
  };

  // ====================== Filtro ======================
  const filteredChequeos = chequeos.filter((c) => {
    const companyName = c.company?.name?.toLowerCase() || "";
    const requirementName = c.requirement?.name?.toLowerCase() || "";
    return (
      companyName.includes(searchTerm.toLowerCase()) ||
      requirementName.includes(searchTerm.toLowerCase())
    );
  });

  // ====================== Estilos dinámicos ======================
  const bgColor = modoOscuro ? "bg-[#1a0526]" : "bg-white";
  const textColor = modoOscuro ? "text-white" : "text-gray-900";
  const borderColor = modoOscuro ? "border-white/20" : "border-gray-200";
  const cardBg = modoOscuro ? "bg-white/10" : "bg-white";
  const secondaryText = modoOscuro ? "text-gray-300" : "text-gray-600";
  const titleColor = modoOscuro ? "text-white" : "text-gray-800";
  const iconBg = modoOscuro ? "bg-[#39A900]/20" : "bg-[#39A900]/10";
  const searchBg = modoOscuro ? "bg-white/10" : "bg-white";

  // ====================== Render ======================
  return (
    <div className={`rounded-3xl p-10 max-w-9xl mx-auto my-12 ${bgColor} ${textColor}`}>
      {/* Encabezado */}
      <div className="text-center mb-10">
        <h2 className={`text-4xl font-extrabold mb-2 ${titleColor}`}>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
            Gestión de Chequeos
          </span>
        </h2>
        <p className={`text-lg ${secondaryText}`}>
          Control de chequeos realizados por las empresas
        </p>
      </div>

      {/* Buscador */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="Buscar por empresa o requisito..."
            className={`border rounded-2xl px-5 py-3 text-lg pl-12 focus:outline-none focus:ring-2 w-full transition-all duration-300 hover:shadow-md ${searchBg} ${textColor} ${borderColor} focus:ring-[#39A900]`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <button
          onClick={handleAddChequeo}
          className="flex items-center gap-2 px-6 py-3 bg-[#39A900] text-white text-lg font-medium rounded-2xl hover:bg-[#2d8500] transition-all shadow-md hover:shadow-xl transform hover:scale-105 duration-300 w-full sm:w-auto justify-center"
        >
          <Plus size={20} /> Nuevo Chequeo
        </button>
      </div>

      {/* Lista de chequeos */}
      <div className="space-y-5">
        {filteredChequeos.length === 0 ? (
          <div className={`text-center py-16 rounded-2xl border ${borderColor}`}>
            <p className={`${secondaryText} text-lg`}>
              No se encontraron chequeos registrados
            </p>
          </div>
        ) : (
          filteredChequeos.map((chequeo) => (
            <div
              key={chequeo.id}
              className={`p-6 rounded-2xl border shadow-md hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row justify-between items-center gap-5 transform hover:-translate-y-1 ${cardBg} ${borderColor}`}
            >
              <div className="flex flex-col gap-4 w-full">
                {/* Empresa */}
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${iconBg} text-[#39A900]`}>
                    <Building2 size={22} />
                  </div>
                  <p className={`text-lg ${secondaryText}`}>
                    Empresa: {chequeo.company?.name || "Sin empresa"}
                  </p>
                </div>

                {/* Requisito */}
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${iconBg} text-[#39A900]`}>
                    <CheckCircle2 size={20} />
                  </div>
                  <p className={`text-lg ${secondaryText}`}>
                    Requisito: {chequeo.requirement?.name || "Sin requisito"}
                  </p>
                </div>

                {/* Estado */}
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${iconBg}`}>
                    {chequeo.isChecked ? (
                      <CheckCircle2 size={20} className="text-green-500" />
                    ) : (
                      <XCircle size={20} className="text-red-500" />
                    )}
                  </div>
                  <p className={`text-lg ${secondaryText}`}>
                    Estado: {chequeo.isChecked ? "Aprobado ✅" : "Pendiente ⏳"}
                  </p>
                </div>

                {/* Fecha */}
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${iconBg} text-[#39A900]`}>
                    <Calendar size={20} />
                  </div>
                  <p className={`text-lg ${secondaryText}`}>
                    Creado:{" "}
                    {new Date(chequeo.createdAt).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleEditChequeo(chequeo)}
                  className={`p-3 rounded-xl ${
                    modoOscuro
                      ? "bg-blue-900/30 text-blue-400"
                      : "bg-blue-50 text-blue-600"
                  } hover:scale-110 transition`}
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={() => handleDeleteChequeo(chequeo.id)}
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

      {/* Modales */}
      {mostrarModal && (
        <ModalChequeo
          abierto={mostrarModal}
          editando={false}
          chequeo={nuevoChequeo}
          empresas={empresas}
          requisitos={requisitos}
          usuarios={[]}
          onCerrar={() => setMostrarModal(false)}
          onGuardar={handleGuardar}
          onChange={(field, value) => setNuevoChequeo((prev) => ({ ...prev, [field]: value }))}
          modoOscuro={modoOscuro}
        />
      )}
      {mostrarModalEditar && (
        <ModalEditarChequeo
          abierto={mostrarModalEditar}
          editando
          chequeo={nuevoChequeo}
          empresas={empresas}
          requisitos={requisitos}
          usuarios={[]}
          onCerrar={() => setMostrarModalEditar(false)}
          onGuardar={handleGuardar}
          onChange={(field, value) => setNuevoChequeo((prev) => ({ ...prev, [field]: value }))}
          modoOscuro={modoOscuro}
        />
      )}
    </div>
  );
}
