'use client';

import React, { useState } from 'react';
import {
  FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUserPlus,
  FaSun, FaMoon
} from 'react-icons/fa';
import { useTheme } from '../../ThemeContext';
import { getThemeStyles } from '../../themeStyles';

export default function FormularioRegistro() {
  // =============================
  // 🎨 Usar el ThemeContext global
  // =============================
  const { modoOscuro, toggleModoOscuro } = useTheme();
  const estilos = getThemeStyles(modoOscuro);

  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ nombre, correo, contrasena });
    alert('¡Registro exitoso!');
  };

  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center p-4 overflow-hidden relative transition-colors duration-500 ${estilos.fondo}`}
    >
      {/* ☀️🌙 Botón modo oscuro */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={toggleModoOscuro}
          className={`p-4 rounded-full transition-all duration-500 hover:scale-110 shadow-lg ${
            modoOscuro
              ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600'
              : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
          }`}
          title="Cambiar modo"
        >
          {modoOscuro ? <FaSun className="h-6 w-6" /> : <FaMoon className="h-6 w-6" />}
        </button>
      </div>

      {/* 📋 Formulario */}
      <div
        className={`relative z-10 w-full max-w-md rounded-2xl p-8 shadow-2xl backdrop-blur-md border transition-colors duration-500 ${estilos.card}`}
      >
        {/* Logo + título */}
        <div className="flex flex-col items-center mb-8">
          <img
            className="w-48 h-auto object-contain mb-4"
            src="/img/convo2.png"
            alt="Logo Convocatorias"
          />
          <h1
            className={`text-3xl font-bold bg-clip-text text-transparent ${estilos.titulo}`}
          >
            Crear Cuenta
          </h1>
        </div>

        {/* Inputs */}
        <form onSubmit={handleSubmit}>
          {/* Nombre */}
          <div className="relative mb-6">
            <FaUser className={`absolute left-3 top-4 text-lg ${estilos.icono}`} />
            <input
              type="text"
              className={`peer w-full pt-5 pb-2 px-3 pl-10 text-base font-medium bg-transparent border-0 border-b-2 outline-none transition-colors duration-300 ${estilos.input}`}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder=" "
              required
            />
            <label
              className={`absolute top-4 left-10 text-base pointer-events-none transition-all duration-300 ease-in-out
                peer-focus:top-[-0.5rem] peer-focus:text-xs peer-focus:text-[#39A900]
                peer-[&:not(:placeholder-shown)]:top-[-0.5rem]
                peer-[&:not(:placeholder-shown)]:text-xs ${estilos.icono}`}
            >
              Nombre Completo
            </label>
          </div>

          {/* Correo */}
          <div className="relative mb-6">
            <FaEnvelope className={`absolute left-3 top-4 text-lg ${estilos.icono}`} />
            <input
              type="email"
              className={`peer w-full pt-5 pb-2 px-3 pl-10 text-base font-medium bg-transparent border-0 border-b-2 outline-none transition-colors duration-300 ${estilos.input}`}
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder=" "
              required
            />
            <label
              className={`absolute top-4 left-10 text-base pointer-events-none transition-all duration-300 ease-in-out
                peer-focus:top-[-0.5rem] peer-focus:text-xs peer-focus:text-[#39A900]
                peer-[&:not(:placeholder-shown)]:top-[-0.5rem]
                peer-[&:not(:placeholder-shown)]:text-xs ${estilos.icono}`}
            >
              Correo Electrónico
            </label>
          </div>

          {/* Contraseña */}
          <div className="relative mb-8">
            <FaLock className={`absolute left-3 top-4 text-lg ${estilos.icono}`} />
            <input
              type={mostrarContrasena ? 'text' : 'password'}
              className={`peer w-full pt-5 pb-2 px-3 pl-10 text-base font-medium bg-transparent border-0 border-b-2 outline-none transition-colors duration-300 ${estilos.input}`}
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              placeholder=" "
              required
            />
            <button
              type="button"
              onClick={() => setMostrarContrasena(!mostrarContrasena)}
              className="absolute right-3 top-4 text-slate-400 hover:text-[#39A900] transition-colors"
            >
              {mostrarContrasena ? <FaEyeSlash /> : <FaEye />}
            </button>
            <label
              className={`absolute top-4 left-10 text-base pointer-events-none transition-all duration-300 ease-in-out
                peer-focus:top-[-0.5rem] peer-focus:text-xs peer-focus:text-[#39A900]
                peer-[&:not(:placeholder-shown)]:top-[-0.5rem]
                peer-[&:not(:placeholder-shown)]:text-xs ${estilos.icono}`}
            >
              Contraseña
            </label>
          </div>

          {/* Botón */}
          <div>
            <button
              type="submit"
              className={`relative w-full py-3.5 text-base font-bold text-white rounded-xl cursor-pointer overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg flex justify-center items-center gap-2 ${estilos.boton}`}
            >
              <FaUserPlus /> Registrarme
            </button>
          </div>
        </form>

        {/* Link login */}
        <div className={`text-center mt-6 text-sm ${estilos.textoSecundario}`}>
          ¿Ya tienes una cuenta?{' '}
          <a href="/" className={`font-semibold ${estilos.link} hover:underline`}>
            Inicia Sesión
          </a>
        </div>
      </div>
    </div>
  );
}
