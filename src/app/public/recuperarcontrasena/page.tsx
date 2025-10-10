"use client";

import { useState, useRef, useEffect, RefObject } from "react";
import Link from "next/link";
import { Mail, Send, ArrowLeft, Moon, Sun, Eye, EyeOff, ZoomOut, RefreshCcw, ZoomIn } from "lucide-react";
import { useTheme } from "../../ThemeContext";
import { getThemeStyles } from "../../themeStyles";
import Swal from "sweetalert2";
import { useFontSize } from "../../../../FontSizeContext";
import { MdAccessibility } from "react-icons/md";

export default function RecuperarContrasenaPage() {
  const { modoOscuro, toggleModoOscuro } = useTheme();
  const estilos = getThemeStyles(modoOscuro);
   const { fontSize, aumentarTexto, disminuirTexto, resetTexto } = useFontSize();

  const [mostrarZoom, setMostrarZoom] = useState(false);
  const toggleZoomMenu = () => setMostrarZoom(!mostrarZoom);


  const [correo, setCorreo] = useState<string>("");
  const [codigo, setCodigo] = useState<string[]>(["", "", "", "", "", ""]);
  const [password, setPassword] = useState<string>("");
  const [confirmarPassword, setConfirmarPassword] = useState<string>("");
  const [mostrarPassword, setMostrarPassword] = useState<boolean>(false);
  const [mostrarConfirmarPassword, setMostrarConfirmarPassword] = useState<boolean>(false);
  const [mostrarCodigo, setMostrarCodigo] = useState<boolean>(false);
  const [mostrarReset, setMostrarReset] = useState<boolean>(false);
  const [cargando, setCargando] = useState<boolean>(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 👉 Manejar cambio en inputs de código
  const manejarCambioCodigo = (index: number, valor: string) => {
    if (!/^\d?$/.test(valor)) return;

    const nuevoCodigo = [...codigo];
    nuevoCodigo[index] = valor;
    setCodigo(nuevoCodigo);

    // Auto-focus al siguiente input
    if (valor !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // 👉 Manejar teclas en inputs de código
  const manejarKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && codigo[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // 👉 Obtener código completo como string
  const obtenerCodigoCompleto = () => codigo.join("");

  // 👉 Enviar correo con código
  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    
    try {
      const res = await fetch("http://localhost:4000/api/v1/auths/forgotPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: correo }),
      });

      const data = await res.json();
      if (res.ok) {
        Swal.fire("✅ Código enviado", "Revisa tu correo electrónico", "success");
        setMostrarCodigo(true);
      } else {
        Swal.fire("⚠️ Error", data.message || "No se pudo enviar el código", "warning");
      }
    } catch (err) {
      Swal.fire("❌ Error", "Problema de conexión con el servidor", "error");
    } finally {
      setCargando(false);
    }
  };

  // 👉 Verificar código
  const manejarVerificarCodigo = async () => {
    const codigoCompleto = obtenerCodigoCompleto();
    if (codigoCompleto.length !== 6) {
      Swal.fire("⚠️ Atención", "El código debe tener 6 dígitos", "warning");
      return;
    }
    
    setCargando(true);
    try {
      const res = await fetch("http://localhost:4000/api/v1/auths/verifyCode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: correo, code: codigoCompleto }),
      });

      const data = await res.json();
      if (res.ok) {
        Swal.fire("✅ Código válido", "Ahora ingresa tu nueva contraseña", "success");
        setMostrarCodigo(false);
        setMostrarReset(true);
      } else {
        Swal.fire("⚠️ Error", data.message || "Código inválido o expirado", "error");
      }
    } catch (err) {
      Swal.fire("❌ Error", "No se pudo verificar el código", "error");
    } finally {
      setCargando(false);
    }
  };

  // 👉 Resetear contraseña
  const manejarReset = async () => {
    if (password.length < 6) {
      Swal.fire("⚠️ Atención", "La contraseña debe tener al menos 6 caracteres", "warning");
      return;
    }

    if (password !== confirmarPassword) {
      Swal.fire("⚠️ Atención", "Las contraseñas no coinciden", "warning");
      return;
    }
    
    setCargando(true);
    try {
      const res = await fetch("http://localhost:4000/api/v1/auths/resetPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: correo,
          code: obtenerCodigoCompleto(),
          newPassword: password
        }),
      });

      const data = await res.json();
      if (res.ok) {
        Swal.fire("✅ Éxito", "Tu contraseña fue actualizada correctamente", "success");
        setCorreo("");
        setCodigo(["", "", "", "", "", ""]);
        setPassword("");
        setConfirmarPassword("");
        setMostrarReset(false);
      } else {
        Swal.fire("⚠️ Error", data.message || "No se pudo actualizar la contraseña", "error");
      }
    } catch (err) {
      Swal.fire("❌ Error", "No se pudo conectar con el servidor", "error");
    } finally {
      setCargando(false);
    }
  };

  // 👉 Cargador moderno con mejoras visuales
  const Cargador = () => (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className={`rounded-2xl p-8 flex flex-col items-center justify-center shadow-2xl ${modoOscuro ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="loader-modern mb-4">
          <div className="loader-circle"></div>
        </div>
        <p className={`text-lg font-medium mt-4 ${modoOscuro ? 'text-gray-200' : 'text-gray-700'}`}>
          Procesando...
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Página principal - Más compacta */}
      <div
        className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-500 ${modoOscuro
            ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black"
            : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
          }`}
      >
        <div
          className={`w-full max-w-md rounded-2xl p-8 shadow-xl border backdrop-blur-md ${modoOscuro
              ? "bg-gray-800/90 border-gray-600 text-gray-100 shadow-[0_0_25px_rgba(0,255,128,0.1)]"
              : "bg-white/90 border-gray-200 text-gray-800 shadow-[0_0_25px_rgba(57,169,0,0.1)]"
            }`}
        >
          {/* Logo más compacto */}
          <div className="flex flex-col items-center mb-6">
            <img
              src="/img/convo2.png"
              alt="Logo Convocatorias"
              className="w-45 h-auto mb-3 drop-shadow-lg"
            />
            <h1
              className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${modoOscuro
                  ? 'from-green-400 to-cyan-400'
                  : 'from-[#39A900] to-[#2d8a00]'
                }`}
            >
              Recuperar Contraseña
            </h1>
            <p className={`text-sm mt-2 text-center ${modoOscuro ? "text-gray-400" : "text-gray-600"}`}>
              Ingresa tu correo y te enviaremos un código de verificación.
            </p>
          </div>

          <form onSubmit={manejarEnvio} className="space-y-6">
            <div className="relative group">
              <div className="flex items-center">
                <Mail
                  className={`absolute left-3 text-lg ${modoOscuro ? "text-gray-400" : "text-gray-500"
                    }`}
                />
                <input
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  placeholder="Correo electrónico"
                  required
                  className={`peer w-full pt-4 pb-2 px-3 pl-10 text-sm font-medium bg-transparent border-0 border-b-2 outline-none transition-all duration-300
    ${modoOscuro
                      ? "border-gray-600 text-white focus:border-green-400 focus:shadow-[0_2px_8px_rgba(0,255,128,0.2)]"
                      : "border-gray-300 text-gray-900 focus:border-[#39A900] focus:shadow-[0_2px_8px_rgba(57,169,0,0.2)]"
                    }`}
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={cargando}
              className="w-full py-3 bg-gradient-to-r from-[#39A900] to-[#2d8a00] text-white text-base font-semibold rounded-lg hover:from-[#2d8a00] hover:to-[#39A900] transition-all duration-300 hover:scale-[1.02] shadow-lg flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {cargando ? (
                <>
                  <div className="loader-button mr-2"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Send size={18} className="mr-2" />
                  Enviar Código
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <Link
              href="/"
              className="text-sm font-medium text-[#39A900] hover:text-[#2d8a00] hover:underline inline-flex items-center gap-2 transition-colors"
            >
              <ArrowLeft size={14} /> Volver al inicio de sesión
            </Link>
          </div>
        </div>

        {/* ☀️🌙 Botón modo oscuro */}
        <div className="fixed top-4 right-4 z-50 flex flex-col space-y-3 items-end">
          <button
            onClick={toggleModoOscuro}
            className={`p-3 rounded-full transition-all duration-500 hover:scale-110 shadow-lg ${
              modoOscuro
                ? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
                : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
            }`}
            title="Cambiar modo"
          >
            {modoOscuro ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <button
            onClick={toggleZoomMenu}
            className={`p-3 rounded-full transition-all duration-500 hover:scale-110 shadow-lg ${
              modoOscuro
                ? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
                : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
            }`}
            title="Opciones de texto"
          >
            <MdAccessibility className="h-5 w-5" />
          </button>

          {mostrarZoom && (
            <div className="flex flex-col space-y-3 mt-2 animate-fade-in">
              <button
                onClick={aumentarTexto}
                className={`p-3 rounded-full transition-all duration-500 hover:scale-110 shadow-lg ${
                  modoOscuro
                    ? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
                    : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
                }`}
                title="Aumentar texto"
              >
                <ZoomIn className="h-5 w-5" />
              </button>

              <button
                onClick={resetTexto}
                className={`p-3 rounded-full transition-all duration-500 hover:scale-110 shadow-lg ${
                  modoOscuro
                    ? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
                    : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
                }`}
                title="Restablecer tamaño"
              >
                <RefreshCcw className="h-5 w-5" />
              </button>

              <button
                onClick={disminuirTexto}
                className={`p-3 rounded-full transition-all duration-500 hover:scale-110 shadow-lg ${
                  modoOscuro
                    ? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
                    : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
                }`}
                title="Disminuir texto"
              >
                <ZoomOut className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    

      {/* Modal Código - Más compacto */}
      {mostrarCodigo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl shadow-2xl p-8 w-full max-w-md ${modoOscuro ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            }`}>
            <div className="flex flex-col items-center mb-6">
              <img
                src="/img/convo2.png"
                alt="Logo Convocatorias"
                className="w-32 h-auto mb-3 drop-shadow-lg"
              />
              <h2 className="text-xl font-bold text-center mb-2">
                Verificar Código
              </h2>
              <p className="text-sm text-center text-gray-500 mb-6">
                Ingresa el código de 6 dígitos que enviamos a tu correo
              </p>
            </div>

            <div className="flex justify-center gap-2 mb-8">
              {codigo.map((digit, index) => (
                <input
                  key={index}
                  ref={(el: HTMLInputElement | null) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => manejarCambioCodigo(index, e.target.value)}
                  onKeyDown={(e) => manejarKeyDown(index, e)}
                  className={`w-12 h-12 text-center text-xl font-bold border-2 rounded-lg focus:outline-none transition-all ${modoOscuro
                      ? "bg-gray-700 border-gray-600 focus:border-green-400 focus:ring-2 focus:ring-green-500"
                      : "bg-white border-gray-300 focus:border-[#39A900] focus:ring-2 focus:ring-[#39A900]"
                    }`}
                />
              ))}
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setMostrarCodigo(false)}
                className={`px-5 py-2.5 rounded-lg font-medium text-sm transition ${modoOscuro
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                  }`}
              >
                Cancelar
              </button>
              <button
                onClick={manejarVerificarCodigo}
                disabled={cargando}
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#39A900] to-[#2d8a00] hover:from-[#2d8a00] hover:to-[#39A900] text-white text-sm transition font-semibold flex items-center gap-2 disabled:opacity-70"
              >
                {cargando && <div className="loader-button-small"></div>}
                Verificar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Reset Password - Más compacto */}
      {mostrarReset && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl shadow-2xl p-8 w-full max-w-md ${modoOscuro ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            }`}>
            <div className="flex flex-col items-center mb-6">
              <img
                src="/img/convo2.png"
                alt="Logo Convocatorias"
                className="w-32 h-auto mb-3 drop-shadow-lg"
              />
              <h2 className="text-xl font-bold text-center mb-4">
                Nueva Contraseña
              </h2>
            </div>

            <div className="space-y-4 mb-6">
              <div className="relative">
                <input
                  type={mostrarPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nueva contraseña"
                  className={`w-full pl-4 pr-12 py-3 text-sm border rounded-lg focus:outline-none transition-all ${modoOscuro
                      ? "bg-gray-700 border-gray-600 text-white focus:border-green-400 focus:ring-2 focus:ring-green-500"
                      : "bg-white border-gray-300 text-gray-900 focus:border-[#39A900] focus:ring-2 focus:ring-[#39A900]"
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                  className={`absolute right-3 top-3 ${modoOscuro ? "text-gray-400" : "text-gray-500"
                    }`}
                >
                  {mostrarPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="relative">
                <input
                  type={mostrarConfirmarPassword ? "text" : "password"}
                  value={confirmarPassword}
                  onChange={(e) => setConfirmarPassword(e.target.value)}
                  placeholder="Confirmar contraseña"
                  className={`w-full pl-4 pr-12 py-3 text-sm border rounded-lg focus:outline-none transition-all ${modoOscuro
                      ? "bg-gray-700 border-gray-600 text-white focus:border-green-400 focus:ring-2 focus:ring-green-500"
                      : "bg-white border-gray-300 text-gray-900 focus:border-[#39A900] focus:ring-2 focus:ring-[#39A900]"
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setMostrarConfirmarPassword(!mostrarConfirmarPassword)}
                  className={`absolute right-3 top-3 ${modoOscuro ? "text-gray-400" : "text-gray-500"
                    }`}
                >
                  {mostrarConfirmarPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setMostrarReset(false)}
                className={`px-5 py-2.5 rounded-lg font-medium text-sm transition ${modoOscuro
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                  }`}
              >
                Cancelar
              </button>
              <button
                onClick={manejarReset}
                disabled={cargando}
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#39A900] to-[#2d8a00] hover:from-[#2d8a00] hover:to-[#39A900] text-white text-sm transition font-semibold flex items-center gap-2 disabled:opacity-70"
              >
                {cargando && <div className="loader-button-small"></div>}
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mostrar cargador global */}
      {cargando && <Cargador />}

      <style jsx>{`
        /* Loader moderno con animación suave */
        .loader-modern {
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loader-circle {
          width: 40px;
          height: 40px;
          border: 3px solid ${modoOscuro ? 'rgba(74, 222, 128, 0.2)' : 'rgba(57, 169, 0, 0.2)'};
          border-top: 3px solid ${modoOscuro ? '#4ade80' : '#39A900'};
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        /* Loader pequeño para botones */
        .loader-button, .loader-button-small {
          border: 2px solid transparent;
          border-top: 2px solid #ffffff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .loader-button {
          width: 16px;
          height: 16px;
        }

        .loader-button-small {
          width: 14px;
          height: 14px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Mejoras de transición para inputs */
        input {
          transition: all 0.3s ease;
        }

        input:focus {
          transform: translateY(-1px);
        }
      `}</style>
    </>
  );
}