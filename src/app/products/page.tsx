'use client';
import { useState } from "react";
import { Mail, Lock, LogIn, Eye, EyeOff, Sun, Moon } from "lucide-react";
import { useTheme } from "../ThemeContext";
import { getThemeStyles } from "../themeStyles";

export default function Home() {
  const { modoOscuro, toggleModoOscuro } = useTheme();
  const estilos = getThemeStyles(modoOscuro);

  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Correo: ${correo}\nPassword: ${contrasena}`);
  };

  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-4 transition-colors duration-500 ${estilos.fondo}`}>
      
      {/* Botón modo oscuro */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={toggleModoOscuro}
          className={`p-4 rounded-full transition-all duration-500 hover:scale-110 shadow-lg ${
            modoOscuro ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
          }`}
          title="Cambiar modo"
        >
          {modoOscuro ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
        </button>
      </div>

      {/* Card de Login */}
      <div className={`relative z-10 w-full max-w-md rounded-2xl p-8 shadow-2xl backdrop-blur-md border transition-colors duration-500 ${estilos.card}`}>
        <div className="flex flex-col items-center mb-8">
          <img src="img/convo2.png" alt="Logo Convocatorias" className="w-48 h-auto mb-4" />
          <h1 className={`text-3xl font-bold bg-clip-text text-transparent ${estilos.titulo}`}>Iniciar Sesión</h1>
        </div>

        <form onSubmit={manejarEnvio}>
          {/* Correo */}
          <div className="relative mb-6">
            <Mail className={`absolute left-3 top-4 text-lg ${estilos.icono}`} />
            <input 
              type="email"
              value={correo}
              onChange={e => setCorreo(e.target.value)}
              placeholder=" "
              required
              className={`peer w-full pt-5 pb-2 px-3 pl-10 text-base font-medium outline-none transition-colors duration-300 ${estilos.input}`}
            />
            <label className={`absolute top-4 left-10 text-base pointer-events-none transition-all duration-300 ease-in-out peer-focus:top-[-0.5rem] peer-focus:text-xs peer-focus:text-[#39A900] peer-[&:not(:placeholder-shown)]:top-[-0.5rem] peer-[&:not(:placeholder-shown)]:text-xs ${estilos.icono}`}>
              Correo Electrónico
            </label>
          </div>

          {/* Contraseña */}
          <div className="relative mb-8">
            <Lock className={`absolute left-3 top-4 text-lg ${estilos.icono}`} />
            <input 
              type={mostrarContrasena ? "text" : "password"}
              value={contrasena}
              onChange={e => setContrasena(e.target.value)}
              placeholder=" "
              required
              className={`peer w-full pt-5 pb-2 px-3 pl-10 text-base font-medium outline-none transition-colors duration-300 ${estilos.input}`}
            />
            <button 
              type="button" 
              onClick={() => setMostrarContrasena(!mostrarContrasena)}
              className="absolute right-3 top-4 text-slate-400 hover:text-[#39A900] transition-colors"
            >
              {mostrarContrasena ? <EyeOff /> : <Eye />}
            </button>
            <label className={`absolute top-4 left-10 text-base pointer-events-none transition-all duration-300 ease-in-out peer-focus:top-[-0.5rem] peer-focus:text-xs peer-focus:text-[#39A900] peer-[&:not(:placeholder-shown)]:top-[-0.5rem] peer-[&:not(:placeholder-shown)]:text-xs ${estilos.icono}`}>
              Contraseña
            </label>
          </div>

          <button 
            type="submit"
            className={`w-full py-3.5 text-base font-bold text-white rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg flex justify-center items-center gap-2 ${estilos.boton}`}
          >
            <LogIn /> Ingresar
          </button>
        </form>

        <div className={`text-center mt-6 text-sm ${estilos.textoSecundario}`}>
          ¿No tienes una cuenta? <a href="/public/registro" className={`font-semibold ${estilos.link} hover:underline`}>Regístrate aquí</a>
        </div>

        <div className={`text-center mt-3 text-sm ${estilos.textoSecundario}`}>
          <a href="/public/recuperarcontrasena" className={`font-semibold ${estilos.link} hover:underline`}>¿Olvidaste tu contraseña?</a>
        </div>
      </div>
    </div>
  );
}
