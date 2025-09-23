"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, LogIn, Eye, EyeOff, Sun, Moon } from "lucide-react";
import { useTheme } from "../app/ThemeContext";
import { getThemeStyles } from "../app/themeStyles";

export default function LoginPage() {
  const { modoOscuro, toggleModoOscuro } = useTheme();
  const estilos = getThemeStyles(modoOscuro);

  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  const manejarEnvio = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(`Correo: ${correo}\nPassword: ${contrasena}`);
  };

  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center p-6 relative transition-colors duration-500 ${
    modoOscuro
      ? "bg-gray-900 border border-gray-700" // 👈 contenedor con borde gris
      : "bg-gray-100"
      }`}
    >
      {/* ☀️🌙 Botón modo oscuro */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={toggleModoOscuro}
          className={`p-3 rounded-full transition-all duration-500 hover:scale-110 shadow-lg ${
            modoOscuro
              ? "bg-gray-800 border border-gray-800 text-yellow-300 hover:bg-gray-700"
              : "bg-white text-gray-700  border border-gray-300 hover:bg-gray-100 shadow-md"
          }`}
          title="Cambiar modo"
        >
          {modoOscuro ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
        </button>
      </div>

      {/* 📋 Card Login */}
      <div
        className={`relative z-10 w-full max-w-md rounded-2xl p-8 shadow-2xl backdrop-blur-md border transition-colors duration-500 ${
          modoOscuro
            ? "bg-gray-800/80 border border-gray-600 text-gray-100"
            : "bg-white border-gray-200 text-gray-900"
        }`}
      >
        {/* Logo + título */}
        <div className="flex flex-col items-center mb-8">
          <img
            src="/img/convo2.png"
            alt="Logo Convocatorias"
            className="w-40 h-auto mb-6"
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
          <div className="relative">
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
                    ? "border-gray-600 text-white placeholder-transparent focus:border-[#39A900]"
                    : "border-gray-400 text-gray-900 placeholder-transparent focus:border-[#39A900]"
                }`}
            />
            <label
              className={`absolute top-4 left-10 text-base pointer-events-none transition-all duration-300 ease-in-out ${
                modoOscuro ? "text-gray-400" : "text-gray-500"
              }
                peer-focus:top-[-0.6rem] peer-focus:text-sm peer-focus:text-[#39A900]
                peer-[&:not(:placeholder-shown)]:top-[-0.6rem]
                peer-[&:not(:placeholder-shown)]:text-sm`}
            >
              Correo Electrónico
            </label>
          </div>

          {/* Contraseña */}
          <div className="relative">
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
                    ? "border-gray-600 text-white placeholder-transparent focus:border-[#39A900]"
                    : "border-gray-400 text-gray-900 placeholder-transparent focus:border-[#39A900]"
                }`}
            />
            <button
              type="button"
              onClick={() => setMostrarContrasena(!mostrarContrasena)}
              className="absolute right-3 top-4 text-slate-400 hover:text-[#39A900] transition-colors"
            >
              {mostrarContrasena ? <EyeOff /> : <Eye />}
            </button>
            <label
              className={`absolute top-4 left-10 text-base pointer-events-none transition-all duration-300 ease-in-out ${
                modoOscuro ? "text-gray-400" : "text-gray-500"
              }
                peer-focus:top-[-0.6rem] peer-focus:text-sm peer-focus:text-[#39A900]
                peer-[&:not(:placeholder-shown)]:top-[-0.6rem]
                peer-[&:not(:placeholder-shown)]:text-sm`}
            >
              Contraseña
            </label>
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="relative w-full py-4 text-lg font-bold text-white rounded-xl cursor-pointer overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl flex justify-center items-center gap-2 bg-[#39A900] hover:bg-[#2d8a00]"
          >
            <LogIn size={20} /> Ingresar
          </button>
        </form>

        {/* Links */}
        <div className="text-center mt-6 text-sm text-gray-400">
          ¿No tienes una cuenta?{" "}
          <Link
            href="/public/registro"
            className="font-semibold text-[#39A900] hover:underline"
          >
            Regístrate aquí
          </Link>
        </div>
        <div className="text-center mt-3 text-sm text-gray-400">
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
