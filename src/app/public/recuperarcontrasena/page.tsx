'use client';
import { useState } from 'react';
import { FaEnvelope, FaPaperPlane, FaArrowLeft, FaMoon, FaSun } from 'react-icons/fa';
import { useTheme } from '../../ThemeContext';
import { getThemeStyles } from '../../themeStyles';

export default function RecuperarContrasena() {
  const { modoOscuro, toggleModoOscuro } = useTheme();
  const estilos = getThemeStyles(modoOscuro);

  const [correo, setCorreo] = useState('');
  const [mostrandoAlerta, setMostrandoAlerta] = useState(false);

  // 📩 Manejo del envío
  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!correo) return;

    setMostrandoAlerta(true);

    setTimeout(() => {
      setMostrandoAlerta(false);
      alert("Si el correo está registrado, recibirás un código de recuperación.");
      setCorreo('');
    }, 3000);
  };

  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center p-4 transition-colors duration-500 ${estilos.fondo}`}
    >
      {/* ☀️🌙 Botón modo oscuro */}
      <button
        onClick={toggleModoOscuro}
        className={`absolute top-4 right-4 z-20 p-3 rounded-full ${
          modoOscuro
            ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600'
            : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
        }`}
      >
        {modoOscuro ? <FaSun size={20} /> : <FaMoon size={20} />}
      </button>

      {/* 🔔 Alerta cargando */}
      {mostrandoAlerta && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div
            className={`p-10 rounded-xl text-center shadow-lg ${
              modoOscuro ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
            }`}
          >
            <div
              className={`w-20 h-20 border-8 rounded-full animate-spin mx-auto mb-4 ${
                modoOscuro
                  ? 'border-green-800 border-t-green-500'
                  : 'border-green-100 border-t-green-500'
              }`}
            ></div>
            <p
              className={`text-xl font-bold ${
                modoOscuro ? 'text-green-400' : 'text-green-600'
              }`}
            >
              ENVIANDO CÓDIGO...
            </p>
            <p
              className={`text-sm mt-2 ${
                modoOscuro ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              Por favor, espera un momento.
            </p>
          </div>
        </div>
      )}

      {/* 📋 Formulario */}
      <div
        className={`relative z-10 w-full max-w-md rounded-2xl p-8 shadow-2xl backdrop-blur-md border transition-colors duration-500 ${estilos.card}`}
      >
        {/* Logo y título */}
        <div className="flex flex-col items-center mb-8">
          <img
            src="/img/convo2.png"
            alt="Logo Convocatorias"
            className="w-48 h-auto mb-4"
          />
          <h1
            className={`text-3xl font-bold bg-clip-text text-transparent ${estilos.titulo}`}
          >
            Recuperar Contraseña
          </h1>
          <p
            className={`text-sm mt-2 text-center ${estilos.textoSecundario}`}
          >
            Ingresa tu correo y te enviaremos un código para restablecer tu
            contraseña.
          </p>
        </div>

        {/* Inputs */}
        <form onSubmit={manejarEnvio}>
          <div className="relative mb-8">
            <FaEnvelope className={`absolute left-3 top-4 text-lg ${estilos.icono}`} />
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder=" "
              required
              className={`peer w-full pt-5 pb-2 px-3 pl-10 text-base font-medium outline-none transition-colors duration-300 ${estilos.input}`}
            />
            <label
              className={`absolute top-4 left-10 text-base pointer-events-none transition-all duration-300 ease-in-out
              peer-focus:top-[-0.5rem] peer-focus:text-xs peer-focus:text-[#39A900]
              peer-[&:not(:placeholder-shown)]:top-[-0.5rem]
              peer-[&:not(:placeholder-shown)]:text-xs ${estilos.icono}`}
            >
              Correo electrónico
            </label>
          </div>

          {/* Botón */}
          <button
            type="submit"
            className={`w-full py-3.5 text-base font-bold text-white rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg flex justify-center items-center gap-2 ${estilos.boton}`}
          >
            <FaPaperPlane /> Enviar Código
          </button>
        </form>

        {/* Volver al login */}
        <div className="text-center mt-6">
          <a
            href="/"
            className={`text-sm font-semibold ${estilos.link} hover:underline inline-flex items-center gap-2`}
          >
            <FaArrowLeft /> Volver a inicio de sesión
          </a>
        </div>
      </div>
    </div>
  );
}
