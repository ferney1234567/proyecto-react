'use client';
import { useEffect, useState } from "react";
import { Edit, Trash2, Plus, Search } from "lucide-react";
import { FaCity } from "react-icons/fa";
import CiudadModal from "./crearCiudad";
import EditarModal from "./editarCuidad";
import Swal from "sweetalert2";

// 🔹 Servicios
import {
  fetchCiudades,
  crearCiudad,
  editarCiudad,
  eliminarCiudad,
} from "../../api/cuidad/route";

interface CiudadProps {
  modoOscuro: boolean;
}

interface Ciudad {
  id: string;
  nombreCiudad: string;
  departamentoNombre: string;
  departamentoId: string;
}

export default function Ciudad({ modoOscuro }: CiudadProps) {
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [nombreCiudad, setNombreCiudad] = useState("");
  const [departamentoId, setDepartamentoId] = useState("");
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");

  // Estados modales
  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);

  // === ALERTAS ===
  const showSuccess = (mensaje: string) => {
    Swal.fire({
      icon: "success",
      title: "¡Éxito!",
      text: mensaje,
      confirmButtonColor: "#39A900",
      timer: 2000,
      background: modoOscuro ? "#1a0526" : "#fff",
      color: modoOscuro ? "#fff" : "#333",
    });
  };

  const showWarning = (mensaje: string) => {
    Swal.fire({
      icon: "warning",
      title: "Atención",
      text: mensaje,
      confirmButtonColor: "#39A900",
      background: modoOscuro ? "#1a0526" : "#fff",
      color: modoOscuro ? "#fff" : "#333",
    });
  };

  // === CARGAR DATOS ===
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const data = await fetchCiudades();

        const resDeps = await fetch("http://localhost:4000/api/v1/departments");
        const jsonDeps = await resDeps.json();
        const departamentos = jsonDeps.data || [];

        const items = (data.data || data || []).map((c: any) => {
          const depName =
            c.department?.name ||
            departamentos.find((d: any) => d.id === c.departmentId)?.name ||
            "";

          return {
            id: String(c.id),
            nombreCiudad: c.name,
            departamentoNombre: depName,
            departamentoId: String(c.departmentId || c.department?.id || ""),
          };
        });

        setCiudades(items);
      } catch (e) {
        Swal.fire("Error", "No se pudieron cargar las ciudades", "error");
      }
    };
    cargarDatos();
  }, []);

  // === GUARDAR ===
  const handleGuardar = async (data?: { nombreCiudad: string; departamentoId: string }) => {
    const ciudadNombre = data?.nombreCiudad ?? nombreCiudad;
    const depId = data?.departamentoId ?? departamentoId;

    if (!ciudadNombre.trim() || !depId.trim()) {
      showWarning("Debes ingresar ciudad y departamento.");
      return;
    }

    try {
      if (editandoId) {
        const res = await editarCiudad(editandoId, {
          name: ciudadNombre,
          departmentId: Number(depId),
        });
        const actualizado = res.data || res;

        const item = {
          id: String(actualizado.id),
          nombreCiudad: actualizado.name,
          departamentoNombre:
            actualizado.department?.name || "Sin departamento",
          departamentoId: String(
            actualizado.departmentId || actualizado.department?.id || ""
          ),
        };

        setCiudades((prev) =>
          prev.map((c) => (c.id === editandoId ? item : c))
        );
        showSuccess("Ciudad actualizada correctamente.");
        setMostrarModalEditar(false);
      } else {
        const res = await crearCiudad({
          name: ciudadNombre,
          departmentId: Number(depId),
        });
        const nuevo = res.data || res;

        const item = {
          id: String(nuevo.id),
          nombreCiudad: nuevo.name,
          departamentoNombre: nuevo.department?.name || "Sin departamento",
          departamentoId: String(
            nuevo.departmentId || nuevo.department?.id || ""
          ),
        };

        setCiudades((prev) => [...prev, item]);
        showSuccess("Ciudad agregada exitosamente.");
        setMostrarModalCrear(false);
      }
    } catch {
      Swal.fire("Error", "No se pudo guardar la ciudad", "error");
    }

    setNombreCiudad("");
    setDepartamentoId("");
    setEditandoId(null);
  };

  // === EDITAR ===
  const handleEditar = (id: string) => {
    const ciudad = ciudades.find((c) => c.id === id);
    if (ciudad) {
      setNombreCiudad(ciudad.nombreCiudad);
      setDepartamentoId(ciudad.departamentoId);
      setEditandoId(id);
      setMostrarModalEditar(true);
    }
  };

  // === ELIMINAR ===
  const handleEliminar = (id: string) => {
    Swal.fire({
      title: "¿Eliminar esta ciudad?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: modoOscuro ? "#1a0526" : "#fff",
      color: modoOscuro ? "#fff" : "#333",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await eliminarCiudad(id);
          setCiudades((prev) => prev.filter((c) => c.id !== id));
          showSuccess("Ciudad eliminada correctamente.");
        } catch {
          Swal.fire("Error", "No se pudo eliminar la ciudad", "error");
        }
      }
    });
  };

  // === FILTRO ===
  const ciudadesFiltradas = ciudades.filter(
    (c) =>
      c.nombreCiudad.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.departamentoNombre.toLowerCase().includes(busqueda.toLowerCase())
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
  const iconBg = modoOscuro ? "bg-[#39A900]/20" : "bg-[#39A900]/10";
  const secondaryText = modoOscuro ? "text-gray-300" : "text-gray-600";
  const titleColor = modoOscuro ? "text-white" : "text-gray-800";

  return (
    <>
      <div className={`rounded-3xl p-10 max-w-9xl mx-auto my-12 ${bgColor} ${textColor}`}>
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className={`text-4xl font-extrabold mb-2 ${titleColor}`}>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
              Gestión de Ciudades
            </span>
          </h2>
          <p className={`text-lg ${secondaryText}`}>
            Administra las ciudades y departamentos
          </p>
        </div>

        {/* Buscador + Botón */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="Buscar ciudad o departamento..."
              className={`border rounded-2xl px-5 py-3 text-lg pl-12 focus:outline-none focus:ring-2 w-full transition-all duration-300 hover:shadow-md ${searchBg} ${textColor} ${searchBorder} ${searchFocus} ${placeholderColor}`}
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <button
            onClick={() => setMostrarModalCrear(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#39A900] text-white text-lg font-medium rounded-2xl hover:bg-[#2d8500] transition-all shadow-md hover:shadow-xl transform hover:scale-105 duration-300 w-full sm:w-auto justify-center"
          >
            <Plus size={20} />
            Agregar Ciudad
          </button>
        </div>

        {/* Lista */}
        <div className="space-y-5">
          {ciudadesFiltradas.length === 0 ? (
            <div className={`text-center py-16 rounded-2xl border ${emptyStateBg}`}>
              <p className={`${secondaryText} text-lg`}>
                No se encontraron ciudades
              </p>
            </div>
          ) : (
            ciudadesFiltradas.map((c) => (
              <div
                key={c.id}
                className={`p-6 rounded-2xl border shadow-md hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row justify-between items-center gap-5 transform hover:-translate-y-1 ${cardBg} ${borderColor}`}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className={`p-4 rounded-xl transition-colors ${iconBg} text-[#39A900]`}>
                    <FaCity size={24} />
                  </div>
                  <div>
                    <h3 className={`text-xl font-semibold ${modoOscuro ? "text-white hover:text-[#39A900]" : "text-gray-800 hover:text-[#39A900]"}`}>
                      {c.nombreCiudad}
                    </h3>
                    <p className={`text-sm ${secondaryText}`}>
                      Departamento: {c.departamentoNombre}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEditar(c.id)}
                    className={`p-3 rounded-xl ${modoOscuro ? "bg-blue-900/30 text-blue-400" : "bg-blue-50 text-blue-600"} hover:scale-110 transition`}
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => handleEliminar(c.id)}
                    className={`p-3 rounded-xl ${modoOscuro ? "bg-red-900/30 text-red-400" : "bg-red-50 text-red-600"} hover:scale-110 transition`}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modales */}
      {mostrarModalCrear && (
        <CiudadModal
          mostrar={mostrarModalCrear}
          onClose={() => setMostrarModalCrear(false)}
          onSave={handleGuardar}
          nombreCiudad={nombreCiudad}
          setNombreCiudad={setNombreCiudad}
          departamentoId={departamentoId} // ✅ Nombre corregido
          setDepartamentoId={setDepartamentoId} // ✅ Nombre corregido
          modoOscuro={modoOscuro}
          editandoId={null}
        />
      )}

      {mostrarModalEditar && (
        <EditarModal
          mostrar={mostrarModalEditar}
          onClose={() => setMostrarModalEditar(false)}
          onSave={handleGuardar}
          editandoId={editandoId}
          nombreCiudad={nombreCiudad}
          setNombreCiudad={setNombreCiudad}
          departamentoId={departamentoId} // ✅ Nombre corregido
          setDepartamentoId={setDepartamentoId} // ✅ Nombre corregido
          modoOscuro={modoOscuro}
        />
      )}
    </>
  );
}
