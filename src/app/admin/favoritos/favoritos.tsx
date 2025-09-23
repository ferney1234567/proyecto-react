"use client";
import { useState, useEffect } from "react";
import { Trash2, Search, Star, User, FileText } from "lucide-react";
import Swal from "sweetalert2";
import { getFavoritos, deleteFavorito } from "../../api/favoritos/routes";
import { getUsers } from "../../api/usuarios/route";
import { getConvocatorias } from "../../api/convocatorias/routes";

interface Favorito {
  id: number;
  userId: number;
  callId: number;
  user?: { id: number; name: string };
  call?: { id: number; title: string };
}

interface Usuario {
  id: number;
  name: string;
}

interface Convocatoria {
  id: number;
  title: string;
}

export default function Favoritos({ modoOscuro }: { modoOscuro: boolean }) {
  const [favoritos, setFavoritos] = useState<Favorito[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [convocatorias, setConvocatorias] = useState<Convocatoria[]>([]);
  const [search, setSearch] = useState("");

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

  // === Cargar datos ===
  const cargarFavoritos = async () => {
    try {
      const data = await getFavoritos();
      setFavoritos(data.data || []);
    } catch (err: any) {
      showError(err.message);
    }
  };

  const cargarUsuarios = async () => {
    try {
      const data = await getUsers();
      setUsuarios(data.data || []);
    } catch (err: any) {
      showError(err.message);
    }
  };

  const cargarConvocatorias = async () => {
    try {
      const data = await getConvocatorias();
      setConvocatorias(data.data || []);
    } catch (err: any) {
      showError(err.message);
    }
  };

  useEffect(() => {
    cargarFavoritos();
    cargarUsuarios();
    cargarConvocatorias();
  }, []);

  // === Eliminar favorito ===
  const handleDeleteFavorito = (id: number) => {
    Swal.fire({
      title: "¿Eliminar favorito?",
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
          await deleteFavorito(id);
          showSuccess("Favorito eliminado.");
          cargarFavoritos();
        } catch (err: any) {
          showError(err.message);
        }
      }
    });
  };

  // === Helpers para mostrar nombres ===
  const getNombreUsuario = (fav: Favorito) =>
    fav.user?.name || usuarios.find((u) => u.id === fav.userId)?.name || `Usuario ${fav.userId}`;

  const getTituloConvocatoria = (fav: Favorito) =>
    fav.call?.title || convocatorias.find((c) => c.id === fav.callId)?.title || `Convocatoria ${fav.callId}`;

  // === FILTRAR ===
  const filteredFavoritos = favoritos.filter(
    (f) =>
      getNombreUsuario(f).toLowerCase().includes(search.toLowerCase()) ||
      getTituloConvocatoria(f).toLowerCase().includes(search.toLowerCase())
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
  const secondaryText = modoOscuro ? "text-gray-300" : "text-gray-600";
  const titleColor = modoOscuro ? "text-white" : "text-gray-800";
  const iconBg = modoOscuro ? "bg-[#39A900]/20" : "bg-[#39A900]/10";

  return (
    <div className={`rounded-3xl p-10 max-w-7xl mx-auto my-12 ${bgColor} ${textColor}`}>
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className={`text-4xl font-extrabold mb-2 ${titleColor}`}>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
            Gestión de Favoritos
          </span>
        </h2>
        <p className={`text-lg ${secondaryText}`}>Administra los favoritos de los usuarios</p>
      </div>

      {/* Buscador */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="Buscar por Usuario o Convocatoria..."
            className={`border rounded-2xl px-5 py-3 text-lg pl-12 focus:outline-none focus:ring-2 w-full transition-all duration-300 hover:shadow-md ${searchBg} ${textColor} ${searchBorder} ${searchFocus} ${placeholderColor}`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Lista */}
      <div className="space-y-5">
        {filteredFavoritos.length === 0 ? (
          <div className={`text-center py-16 rounded-2xl border ${borderColor}`}>
            <p className={`${secondaryText} text-lg`}>No se encontraron favoritos</p>
          </div>
        ) : (
          filteredFavoritos.map((fav) => (
            <div
              key={fav.id}
              className={`p-6 rounded-2xl border shadow-md hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row justify-between items-center gap-5 transform hover:-translate-y-1 ${cardBg} ${borderColor}`}
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${iconBg} text-[#39A900]`}>
                    <User size={20} />
                  </div>
                  <span className={`text-lg font-medium ${titleColor}`}>
                    {getNombreUsuario(fav)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${iconBg} text-[#39A900]`}>
                    <FileText size={20} />
                  </div>
                  <span className={`text-base ${secondaryText}`}>
                    {getTituloConvocatoria(fav)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleDeleteFavorito(fav.id)}
                className={`p-3 rounded-xl ${
                  modoOscuro ? "bg-red-900/30 text-red-400" : "bg-red-50 text-red-600"
                } hover:scale-110 transition`}
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
