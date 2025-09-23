"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Send,
  ArrowLeft,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "../../ThemeContext";
import { getThemeStyles } from "../../themeStyles";

export default function RecuperarContrasenaPage() {
  const { modoOscuro, toggleModoOscuro } = useTheme();
  const estilos = getThemeStyles(modoOscuro);

  const [correo, setCorreo] = useState("");
  const [mostrandoAlerta, setMostrandoAlerta] = useState(false);

  const manejarEnvio = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!correo) return;

    setMostrandoAlerta(true);

    setTimeout(() => {
      setMostrandoAlerta(false);
      alert(
        "Si el correo está registrado, recibirás un código de recuperación."
      );
      setCorreo("");
    }, 2000);
  };

  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center p-6 relative transition-colors duration-500 ${
        modoOscuro ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      {/* ☀️🌙 Botón modo oscuro */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={toggleModoOscuro}
          className={`p-3 rounded-full transition-all duration-500 hover:scale-110 shadow-lg ${
            modoOscuro
              ? "bg-gray-800 text-yellow-300 hover:bg-gray-700"
              : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
          }`}
          title="Cambiar modo"
        >
          {modoOscuro ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
        </button>
      </div>

      {/* OVERLAY de envío */}
      {mostrandoAlerta && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div
            className={`p-10 rounded-xl text-center shadow-lg ${
              modoOscuro ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            }`}
          >
            <div
              className={`w-20 h-20 border-8 rounded-full animate-spin mx-auto mb-4 ${
                modoOscuro
                  ? "border-green-800 border-t-green-500"
                  : "border-green-100 border-t-green-500"
              }`}
            ></div>
            <p
              className={`text-xl font-bold ${
                modoOscuro ? "text-green-400" : "text-green-600"
              }`}
            >
              ENVIANDO CÓDIGO...
            </p>
            <p
              className={`text-sm mt-2 ${
                modoOscuro ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Por favor, espera un momento.
            </p>
          </div>
        </div>
      )}

      {/* Card Recuperar contraseña */}
      <div
        className={`relative z-10 w-full max-w-md rounded-2xl p-8 shadow-2xl backdrop-blur-md border transition-colors duration-500 ${
          modoOscuro
            ? "bg-gray-800/80 border border-gray-600 text-gray-100"
            : "bg-white border-gray-200 text-gray-900"
        }`}
      >
        {/* Logo y título */}
        <div className="flex flex-col items-center mb-8">
          <img
            src="/img/convo2.png"
            alt="Logo Convocatorias"
            className="w-40 h-auto mb-6"
          />
          <h1
            className={`text-3xl font-bold bg-clip-text text-transparent ${estilos.titulo}`}
          >
            Recuperar Contraseña
          </h1>
          <p
            className={`text-sm mt-2 text-center ${estilos.textoSecundario}`}
          >
            Ingresa tu correo y te enviaremos un código para restablecer tu contraseña.
          </p>
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

          {/* Botón */}
          <button
            type="submit"
            className="relative w-full py-4 text-lg font-bold text-white rounded-xl cursor-pointer overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl flex justify-center items-center gap-2 bg-[#39A900] hover:bg-[#2d8a00]"
          >
            <Send size={20} /> Enviar Código
          </button>
        </form>

        {/* Volver al login */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm font-semibold text-[#39A900] hover:underline inline-flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Volver a inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
