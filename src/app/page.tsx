"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  LogIn,
  Eye,
  EyeOff,
  Sun,
  Moon,
  ZoomIn,
  ZoomOut,
  RefreshCcw,
} from "lucide-react";
import { useTheme } from "../app/ThemeContext";
import { getThemeStyles } from "../app/themeStyles";
import Swal from "sweetalert2";
import { useFontSize } from "../../FontSizeContext";
import { MdAccessibility } from "react-icons/md";

// ✅ URL base dinámica desde .env
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_URL = `${BASE_URL}/auths/authenticate`;

export default function LoginPage() {
  // 🎨 Modo oscuro
  const { modoOscuro, toggleModoOscuro } = useTheme();
  const estilos = getThemeStyles(modoOscuro);

  // 🔠 Tamaño de texto global (contexto)
  const { fontSize, aumentarTexto, disminuirTexto, resetTexto } = useFontSize();
  const [mostrarZoom, setMostrarZoom] = useState(false);
  const toggleZoomMenu = () => setMostrarZoom(!mostrarZoom);

  // 🧾 Formulario
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [cargando, setCargando] = useState(false);

  const router = useRouter();

  // 🚀 Envío de formulario
  const manejarEnvio = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCargando(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: correo,
          password: contrasena,
        }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("usuario", JSON.stringify(data.user));

        // Guardamos rol
        const roleId =
          data.user.rolId ||
          data.user.role_id ||
          data.user.roleId ||
          data.user.role?.id ||
          null;

        const roleName =
          (data.user.rol || data.user.role?.name || "")
            .toString()
            .toLowerCase();

        localStorage.setItem("rol", roleName || roleId?.toString() || "");

        Swal.fire({
          icon: "success",
          title: `¡Bienvenido ${data.user.name}! 🎉`,
          text: "Has iniciado sesión correctamente",
          confirmButtonColor: "#39A900",
        }).then(() => {
          router.push("/menu");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Credenciales incorrectas",
          text: data.message || "❌ El correo o la contraseña no son válidos.",
          confirmButtonColor: "#d33",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "⚠️ No se pudo conectar con el servidor.",
        confirmButtonColor: "#d33",
      });
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center p-6 relative transition-colors duration-500 ${
        modoOscuro
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black"
          : estilos.fondo
      }`}
      style={{ fontSize: `${fontSize}px` }}
    >
      {/* ☀️🌙 Botón modo oscuro */}
      <div className="fixed top-6 right-6 z-50 flex flex-col space-y-3 items-end">
        <button
          onClick={toggleModoOscuro}
          className={`p-3 rounded-full transition-all duration-500 hover:scale-110 shadow-lg ${
            modoOscuro
              ? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
              : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
          }`}
          title="Cambiar modo"
        >
          {modoOscuro ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
        </button>

        {/* 🔍 Botón de menú zoom */}
        <button
          onClick={toggleZoomMenu}
          className={`p-4 rounded-full transition-all duration-500 hover:scale-110 shadow-lg ${
            modoOscuro
              ? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
              : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
          }`}
          title="Opciones de texto"
        >
          <MdAccessibility className="h-6 w-6" />
        </button>

        {/* 📏 Menú Zoom (aparece al presionar el botón) */}
        {mostrarZoom && (
          <div className="flex flex-col space-y-3 mt-2 animate-fade-in">
            <button
              onClick={aumentarTexto}
              className={`p-4 rounded-full transition-all duration-500 hover:scale-110 shadow-lg ${
                modoOscuro
                  ? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
                  : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
              }`}
              title="Aumentar texto"
            >
              <ZoomIn className="h-6 w-6" />
            </button>

            <button
              onClick={resetTexto}
              className={`p-4 rounded-full transition-all duration-500 hover:scale-110 shadow-lg ${
                modoOscuro
                  ? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
                  : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
              }`}
              title="Restablecer tamaño"
            >
              <RefreshCcw className="h-6 w-6" />
            </button>

            <button
              onClick={disminuirTexto}
              className={`p-4 rounded-full transition-all duration-500 hover:scale-110 shadow-lg ${
                modoOscuro
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

      {/* 📋 Card Login */}
      <div
        className={`relative z-10 w-full max-w-md rounded-2xl p-8 shadow-2xl backdrop-blur-md border transition-colors duration-500 ${
          modoOscuro
            ? "bg-gray-900/80 border border-gray-700 text-gray-100 shadow-[0_0_20px_rgba(0,255,128,0.15)]"
            : "bg-white border-gray-200 text-gray-900"
        }`}
      >
        {/* Logo + título */}
        <div className="flex flex-col items-center mb-8">
          <img
            src="/img/convo2.png"
            alt="Logo Convocatorias"
            className="w-45 h-auto mb-6 drop-shadow-lg"
          />
          <h1
            className={`text-3xl font-bold bg-clip-text text-transparent ${estilos.titulo}`}
          >
            Iniciar Sesión
          </h1>
        </div>

        {/* Formulario */}
        <form onSubmit={manejarEnvio} className="space-y-8">
          {/* Correo */}
          <div className="relative group">
            <Mail className={`absolute left-3 top-4 text-lg ${estilos.icono}`} />
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder=" "
              required
              className={`peer w-full pt-5 pb-2 px-3 pl-10 text-base font-medium bg-transparent border-0 border-b-2 outline-none transition-colors duration-300 
                ${
                  modoOscuro
                    ? "border-gray-600 text-white placeholder-transparent focus:border-green-400"
                    : "border-gray-300 text-gray-900 placeholder-transparent focus:border-[#39A900]"
                }`}
            />
            <label
              className={`absolute top-4 left-10 text-base pointer-events-none transition-all duration-300 ease-in-out ${
                modoOscuro
                  ? "text-gray-500 peer-focus:text-green-400"
                  : "text-gray-500 peer-focus:text-[#39A900]"
              }
                peer-focus:top-[-0.6rem] peer-focus:text-sm
                peer-[&:not(:placeholder-shown)]:top-[-0.6rem]
                peer-[&:not(:placeholder-shown)]:text-sm`}
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
              className={`peer w-full pt-5 pb-2 px-3 pl-10 text-base font-medium bg-transparent border-0 border-b-2 outline-none transition-colors duration-300
                ${
                  modoOscuro
                    ? "border-gray-600 text-white placeholder-transparent focus:border-green-400"
                    : "border-gray-300 text-gray-900 placeholder-transparent focus:border-[#39A900]"
                }`}
            />
            <button
              type="button"
              onClick={() => setMostrarContrasena(!mostrarContrasena)}
              className={`absolute right-3 top-4 transition-colors ${
                modoOscuro
                  ? "text-gray-400 hover:text-green-400"
                  : "text-slate-400 hover:text-[#39A900]"
              }`}
            >
              {mostrarContrasena ? <EyeOff /> : <Eye />}
            </button>
            <label
              className={`absolute top-4 left-10 text-base pointer-events-none transition-all duration-300 ease-in-out ${
                modoOscuro
                  ? "text-gray-500 peer-focus:text-green-400"
                  : "text-gray-500 peer-focus:text-[#39A900]"
              }
                peer-focus:top-[-0.6rem] peer-focus:text-sm
                peer-[&:not(:placeholder-shown)]:top-[-0.6rem]
                peer-[&:not(:placeholder-shown)]:text-sm`}
            >
              Contraseña
            </label>
          </div>

          {/* Botón */}
          <button
            type="submit"
            disabled={cargando}
            className={`relative w-full py-4 text-lg font-bold text-white rounded-xl cursor-pointer overflow-hidden transition-all duration-300 flex justify-center items-center gap-2 
              ${
                cargando
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#39A900] hover:scale-105 hover:shadow-xl hover:bg-[#2d8a00]"
              }`}
          >
            {cargando ? "Ingresando..." : (<><LogIn size={20} /> Ingresar</>)}
          </button>
        </form>

        {/* Links */}
        <div className="text-center mt-6 text-sm">
          <span className={modoOscuro ? "text-gray-400" : "text-gray-500"}>
            ¿No tienes una cuenta?{" "}
          </span>
          <Link
            href="/public/registro"
            className="font-semibold text-[#39A900] hover:underline"
          >
            Regístrate aquí
          </Link>
        </div>

        <div className="text-center mt-3 text-sm">
          <Link
            href="/public/recuperarcontrasena"
            className="font-semibold text-[#39A900] hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </div>
    </div>
  );
}
