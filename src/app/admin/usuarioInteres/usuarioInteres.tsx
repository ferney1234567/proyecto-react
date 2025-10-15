"use client";

import { useState, useEffect } from "react";
import { Edit, Trash2, Plus, Search, Loader2, User, Heart } from "lucide-react";
import Swal from "sweetalert2";

// ✅ API — conexión con tu archivo: src/app/api/usuarioInteres/route.js
import {
  getUserInterests,
  createUserInterest,
  updateUserInterest,
  deleteUserInterest,
} from "../../api/usuarioInteres/route";

// ✅ Modales
import ModalCrearUserInterest from "./crearUserInteres";
import ModalEditarUserInterest from "./editarUserInteres";

// ==============================
// 🔹 Tipos e Interfaces
// ==============================
interface UserInterest {
  userId: number;
  interestId: number;
  userName: string;
  userEmail: string;
  interestName: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  modoOscuro: boolean;
}

// ==============================
// 🔹 Componente principal
// ==============================
export default function UserInterests({ modoOscuro }: Props) {
  const [data, setData] = useState<UserInterest[]>([]);
  const [buscar, setBuscar] = useState("");
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const [seleccionado, setSeleccionado] = useState<UserInterest | null>(null);

  // ============================
  // 🔹 Cargar datos
  // ============================
  const cargarDatos = async () => {
    try {
      setLoading(true);
      console.log("📡 Cargando UserInterests...");
      const res = await getUserInterests();
      const arr = res?.data || [];

      const mapped = arr.map((item: any) => ({
        userId: item.userId,
        interestId: item.interestId,
        userName: item.user?.name ?? "Sin nombre",
        userEmail: item.user?.email ?? "Sin email",
        interestName: item.interest?.name ?? "Sin interés",
        description: item.interest?.description ?? "",
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }));

      setData(mapped);
    } catch (error) {
      console.error("❌ Error al cargar UserInterests:", error);
      Swal.fire("Error", "No se pudieron cargar los datos", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // ============================
  // 🔹 Crear nuevo registro
  // ============================
  const guardarNuevo = async (nuevo: any) => {
    try {
      await createUserInterest(nuevo);
      Swal.fire("Éxito", "UserInterest creado correctamente", "success");
      setMostrarModal(false);
      cargarDatos();
    } catch (error) {
      console.error("❌ Error al crear:", error);
      Swal.fire("Error", "No se pudo crear el registro", "error");
    }
  };

  // ============================
  // 🔹 Editar registro
  // ============================
  const guardarCambios = async (editado: any) => {
    try {
      await updateUserInterest(editado.userId, editado.interestId, editado);
      Swal.fire("Éxito", "UserInterest actualizado correctamente", "success");
      setMostrarEditar(false);
      setSeleccionado(null);
      cargarDatos();
    } catch (error) {
      console.error("❌ Error al actualizar:", error);
      Swal.fire("Error", "No se pudo actualizar el registro", "error");
    }
  };

  // ============================
  // 🔹 Eliminar registro
  // ============================
  const eliminar = async (userId: number, interestId: number) => {
    Swal.fire({
      title: "¿Eliminar relación?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteUserInterest(userId, interestId);
          Swal.fire("Éxito", "Eliminado correctamente", "success");
          cargarDatos();
        } catch (error) {
          console.error("❌ Error al eliminar:", error);
          Swal.fire("Error", "No se pudo eliminar", "error");
        }
      }
    });
  };

  // ============================
  // 🔹 Filtro de búsqueda
  // ============================
  const filtrados = data.filter(
    (d) =>
      d.userName.toLowerCase().includes(buscar.toLowerCase()) ||
      d.interestName.toLowerCase().includes(buscar.toLowerCase())
  );

  // ============================
  // 🔹 Estilos condicionales
  // ============================
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

  // ============================
  // 🔹 Render
  // ============================
  return (
    <div className={`rounded-3xl p-10 max-w-9xl mx-auto my-12 ${bgColor} ${textColor}`}>
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className={`text-4xl font-extrabold mb-2 ${titleColor}`}>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
            Gestión de UserInterests
          </span>
        </h2>
        <p className={`text-lg ${secondaryText}`}>
          Relación de Usuarios con Intereses
        </p>
      </div>

      {/* Buscar + Botón */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="Buscar por usuario o interés..."
            className={`border rounded-2xl px-5 py-3 text-lg pl-12 focus:outline-none focus:ring-2 w-full transition-all duration-300 hover:shadow-md ${searchBg} ${textColor} ${searchBorder} ${searchFocus} ${placeholderColor}`}
            value={buscar}
            onChange={(e) => setBuscar(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
     
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
                No se encontraron datos
              </p>
            </div>
          ) : (
            filtrados.map((item) => (
              <div
                key={`${item.userId}-${item.interestId}`}
                className={`p-6 rounded-2xl border shadow-md hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row justify-between items-center gap-5 transform hover:-translate-y-1 ${cardBg} ${borderColor}`}
              >
                <div className="flex items-center gap-3 w-full">
                  <div
                    className={`p-4 rounded-xl transition-colors ${iconBg} text-[#39A900]`}
                  >
                    <User size={24} />
                  </div>
                  <div>
                    <h3
                      className={`text-xl font-semibold ${
                        modoOscuro
                          ? "text-white hover:text-[#39A900]"
                          : "text-gray-800 hover:text-[#39A900]"
                      }`}
                    >
                      {item.userName}
                    </h3>
                    <p className={`text-sm ${secondaryText}`}>{item.userEmail}</p>
                    <p
                      className={`text-sm ${secondaryText} flex items-center gap-1`}
                    >
                      <Heart
                        size={14}
                        className="text-pink-500"
                      />{" "}
                      {item.interestName} - {item.description}
                    </p>
                    <p className={`text-xs ${secondaryText}`}>
                      Creado: {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
               
              </div>
            ))
          )}
        </div>
      )}

      {/* Modales */}
      {mostrarModal && (
        <ModalCrearUserInterest
          onClose={() => setMostrarModal(false)}
          onSave={guardarNuevo}
          modoOscuro={modoOscuro}
        />
      )}

      {mostrarEditar && seleccionado && (
        <ModalEditarUserInterest
          visible={mostrarEditar}
          onClose={() => setMostrarEditar(false)}
          onSave={guardarCambios}
          userInterest={seleccionado}
          setUserInterest={setSeleccionado}
          modoOscuro={modoOscuro}
        />
      )}
    </div>
  );
}
