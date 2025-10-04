"use client";

import { Settings, Search, Sun, Moon, LogOut } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

type HeaderProps = {
  sectionBg: string;
  modoOscuro: boolean;
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  toggleModoOscuro: () => void;
  setShowProfileModal: Dispatch<SetStateAction<boolean>>;
};

export default function Header({
  sectionBg,
  modoOscuro,
  searchTerm,
  setSearchTerm,
  toggleModoOscuro,
  setShowProfileModal,
}: HeaderProps) {
  const router = useRouter();

  // 🔑 Función para cerrar sesión
  const handleLogout = () => {
    Swal.fire({
      title: "¿Cerrar sesión?",
      text: "Tu sesión actual se cerrará",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#39A900",
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        // Eliminar token y usuario
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");

        Swal.fire({
          icon: "success",
          title: "Sesión cerrada",
          text: "Has cerrado sesión correctamente",
          showConfirmButton: false,
          timer: 1500,
        });

        // Redirigir al login
        router.push("/");
      }
    });
  };

  return (
    <header
      className={`${sectionBg} shadow-xl relative z-10 transition-all duration-500`}
    >
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex justify-between items-center">
          {/* Logo y título */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-[#39A900] to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Settings className="text-white w-8 h-8" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#39A900] to-emerald-600 bg-clip-text text-transparent">
                Sistemas de Gestión de Convocatorias
              </h1>
            </div>
          </div>

          {/* Barra de búsqueda y controles */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#39A900] transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Buscar módulos..."
                className={`pl-10 pr-4 py-2 rounded-lg border outline-none transition-all w-64 ${
                  modoOscuro
                    ? "bg-white/10 border-white/20 text-white focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900]"
                    : "bg-white text-gray-800 focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900]"
                }`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Perfil */}
            <div className="relative group">
              <button
                onClick={() => setShowProfileModal(true)}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group-hover:rotate-3 ${
                  modoOscuro
                    ? "bg-gradient-to-r from-green-700 to-green-900"
                    : "bg-gradient-to-r from-[#39A900] to-emerald-600"
                }`}
              >
                A
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleModoOscuro}
              className={`p-3 rounded-2xl transition-all duration-500 hover:scale-110 ${
                modoOscuro
                  ? "bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400"
                  : "bg-purple-500/20 hover:bg-purple-500/30 text-purple-600"
              }`}
              title="Cambiar modo"
            >
              {modoOscuro ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-3 rounded-2xl bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-all duration-300 hover:scale-110"
              title="Cerrar sesión"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
