"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  Sun,
  Moon,
  ZoomIn,
  ZoomOut,
  RefreshCcw,
} from "lucide-react";
import { useTheme } from "../../ThemeContext";
import { getThemeStyles } from "../../themeStyles";
import { useFontSize } from "../../../../FontSizeContext";
import { createUser } from "../../api/usuarios/route";
import { MdAccessibility } from "react-icons/md";

export default function FormularioRegistro() {
  // 🎨 Modo oscuro
  const { modoOscuro, toggleModoOscuro } = useTheme();
  const estilos = getThemeStyles(modoOscuro);

  // 🔠 Tamaño de texto global (contexto)
  const { fontSize, aumentarTexto, disminuirTexto, resetTexto } = useFontSize();
  const [mostrarZoom, setMostrarZoom] = useState(false);
  const toggleZoomMenu = () => setMostrarZoom(!mostrarZoom);

  const router = useRouter();

  // 📋 Formulario
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [cargando, setCargando] = useState(false);

  // 🚀 Envío de datos
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);

    try {
      const nuevoUsuario = {
        name: nombre,
        email: correo,
        password: contrasena,
        role_id: 1,
      };

      await createUser(nuevoUsuario);

      Swal.fire({
        icon: "success",
        title: "Registro exitoso",
        text: "Ahora puedes iniciar sesión",
        confirmButtonColor: "#39A900",
      }).then(() => router.push("/"));

      setNombre("");
      setCorreo("");
      setContrasena("");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al registrar",
        text:
          error instanceof Error
            ? error.message
            : "Ocurrió un error, intenta nuevamente",
        confirmButtonColor: "#d33",
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center p-6 relative transition-colors duration-500 ${modoOscuro
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black"
          : estilos.fondo
        }`}
      style={{ fontSize: `${fontSize}px` }}
    >
      {/* ☀️🌙 + 🔠 Botones flotantes */}
      <div className="fixed top-6 right-6 z-50 flex flex-col space-y-3 items-end">
        {/* Modo oscuro */}
        <button
          onClick={toggleModoOscuro}
          className={`p-3 rounded-full transition-all duration-500 hover:scale-110 shadow-lg ${modoOscuro
              ? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
              : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
            }`}
          title="Cambiar modo"
        >
          {modoOscuro ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
        </button>

        {/* Botón Zoom */}
        <button
          onClick={toggleZoomMenu}
          className={`p-4 rounded-full transition-all duration-500 hover:scale-110 shadow-lg ${modoOscuro
              ? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
              : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
            }`}
          title="Opciones de texto"
        >
          <MdAccessibility className="h-6 w-6" />
        </button>

        {/* Menú de Zoom */}
        {mostrarZoom && (
          <div className="flex flex-col space-y-3 mt-2 animate-fade-in">
            <button
              onClick={aumentarTexto}
              className={`p-4 rounded-full transition-all duration-500 hover:scale-110 shadow-lg ${modoOscuro
                  ? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
                  : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
                }`}
              title="Aumentar texto"
            >
              <ZoomIn className="h-6 w-6" />
            </button>

            <button
              onClick={resetTexto}
              className={`p-4 rounded-full transition-all duration-500 hover:scale-110 shadow-lg ${modoOscuro
                  ? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
                  : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
                }`}
              title="Restablecer tamaño"
            >
              <RefreshCcw className="h-6 w-6" />
            </button>

            <button
              onClick={disminuirTexto}
              className={`p-4 rounded-full transition-all duration-500 hover:scale-110 shadow-lg ${modoOscuro
                  ? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
                  : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
                }`}
              title="Disminuir texto"
            >
              <ZoomOut className="h-6 w-6" />
            </button>
          </div>
        )}
      </div>

      {/* 📋 Card Registro */}
      <div
        className={`relative z-10 w-full max-w-md rounded-2xl p-8 shadow-2xl backdrop-blur-md border transition-colors duration-500 ${modoOscuro
            ? "bg-gray-900/80 border border-gray-700 text-gray-100 shadow-[0_0_20px_rgba(0,255,128,0.15)]"
            : "bg-white border-gray-200 text-gray-900"
          }`}
      >
        {/* Logo + Título */}
        <div className="flex flex-col items-center mb-8">
          <img src="/img/convo2.png" alt="Logo" className="w-45 h-auto mb-6" />
          <h1
            className={`text-3xl font-bold bg-clip-text text-transparent ${estilos.titulo}`}
          >
            Crear Cuenta
          </h1>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Nombre */}
          <div className="relative group">
            <User className={`absolute left-3 top-4 text-lg ${estilos.icono}`} />
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder=" "
              required
              className={`peer w-full pt-5 pb-2 px-3 pl-10 text-base font-medium bg-transparent border-0 border-b-2 outline-none transition-colors duration-300 ${modoOscuro
                  ? "border-gray-600 text-white focus:border-green-400"
                  : "border-gray-300 text-gray-900 focus:border-[#39A900]"
                }`}
            />
            <label
              className={`absolute top-4 left-10 text-base pointer-events-none transition-all duration-300 ease-in-out ${modoOscuro
                  ? "text-gray-500 peer-focus:text-green-400"
                  : "text-gray-500 peer-focus:text-[#39A900]"
                } peer-focus:top-[-0.6rem] peer-focus:text-sm peer-[&:not(:placeholder-shown)]:top-[-0.6rem] peer-[&:not(:placeholder-shown)]:text-sm`}
            >
              Nombre Completo
            </label>
          </div>

          {/* Correo */}
          <div className="relative group">
            <Mail className={`absolute left-3 top-4 text-lg ${estilos.icono}`} />
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder=" "
              required
              className={`peer w-full pt-5 pb-2 px-3 pl-10 text-base font-medium bg-transparent border-0 border-b-2 outline-none transition-colors duration-300 ${modoOscuro
                  ? "border-gray-600 text-white focus:border-green-400"
                  : "border-gray-300 text-gray-900 focus:border-[#39A900]"
                }`}
            />
            <label
              className={`absolute top-4 left-10 text-base pointer-events-none transition-all duration-300 ease-in-out ${modoOscuro
                  ? "text-gray-500 peer-focus:text-green-400"
                  : "text-gray-500 peer-focus:text-[#39A900]"
                } peer-focus:top-[-0.6rem] peer-focus:text-sm peer-[&:not(:placeholder-shown)]:top-[-0.6rem] peer-[&:not(:placeholder-shown)]:text-sm`}
            >
              Correo Electrónico
            </label>
          </div>

          {/* Contraseña */}
          <div className="relative group">
            <Lock className={`absolute left-3 top-4 text-lg ${estilos.icono}`} />
            <input
              type={mostrarContrasena ? "text" : "password"}
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              placeholder=" "
              required
              className={`peer w-full pt-5 pb-2 px-3 pl-10 text-base font-medium bg-transparent border-0 border-b-2 outline-none transition-colors duration-300 ${modoOscuro
                  ? "border-gray-600 text-white focus:border-green-400"
                  : "border-gray-300 text-gray-900 focus:border-[#39A900]"
                }`}
            />
            <button
              type="button"
              onClick={() => setMostrarContrasena(!mostrarContrasena)}
              className={`absolute right-3 top-4 transition-colors ${modoOscuro
                  ? "text-gray-400 hover:text-green-400"
                  : "text-slate-400 hover:text-[#39A900]"
                }`}
            >
              {mostrarContrasena ? <EyeOff /> : <Eye />}
            </button>
            <label
              className={`absolute top-4 left-10 text-base pointer-events-none transition-all duration-300 ease-in-out ${modoOscuro
                  ? "text-gray-500 peer-focus:text-green-400"
                  : "text-gray-500 peer-focus:text-[#39A900]"
                } peer-focus:top-[-0.6rem] peer-focus:text-sm peer-[&:not(:placeholder-shown)]:top-[-0.6rem] peer-[&:not(:placeholder-shown)]:text-sm`}
            >
              Contraseña
            </label>
          </div>

          {/* Botón */}
          <button
            type="submit"
            disabled={cargando}
            className="relative w-full py-4 text-lg font-bold text-white rounded-xl cursor-pointer overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl flex justify-center items-center gap-2 bg-[#39A900] hover:bg-[#2d8a00]"
          >
            <UserPlus size={20} />
            {cargando ? "Registrando..." : "Registrarme"}
          </button>
        </form>

        {/* Link Login */}
        <div className="text-center mt-6 text-sm">
          <span className={modoOscuro ? "text-gray-400" : "text-gray-500"}>
            ¿Ya tienes una cuenta?{" "}
          </span>
          <a href="/" className="font-semibold text-[#39A900] hover:underline">
            Inicia Sesión
          </a>
        </div>
      </div>
    </div>
  );
}
