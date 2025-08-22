'use client';

import { useState, useCallback, useMemo } from "react";
import dynamic from 'next/dynamic';
import { FaEnvelope, FaLock, FaSignInAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import type { Container, Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";

// Import dinámico para el componente de partículas (mejora el rendimiento)
const Particles = dynamic(() => import('react-tsparticles'), { ssr: false });

export default function Home() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí tu lógica de autenticación
    alert(`Correo: ${correo}\nContraseña: ${contrasena}`);
  };
  
  // --- CONFIGURACIÓN MEJORADA DE PARTÍCULAS ---
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

const particlesOptions = useMemo(() => ({
  background: {
    color: {
      value: "#f0fdf4", // Mantenemos el fondo verde muy claro
    },
  },
  fpsLimit: 120,
  interactivity: {
    events: {
      onClick: {
        enable: true,
        mode: "repulse", // Cambiado a 'repulse' para un efecto más impactante al hacer clic
      },
      onHover: {
        enable: true,
        mode: "grab", // Cambiado a 'grab' para que las partículas se conecten al cursor
      },
      resize: true,
    },
    modes: {
      grab: {
        distance: 200, // Distancia para que el 'grab' haga efecto
        links: {
          opacity: 0.8,
          color: "#39A900" // Un verde más brillante para los enlaces al interactuar
        }
      },
      bubble: {
        distance: 250,
        size: 15,
        duration: 2,
        opacity: 0.8,
      },
      repulse: {
        distance: 150,
        duration: 0.6, // Duración ajustada para una repulsión más rápida
      },
      push: {
        quantity: 4,
      },
    },
  },
  particles: {
    color: {
      value: ["#39A900", "#2e7d00", "#1e5a00"], // Tu paleta de verdes
    },
    links: {
      color: {
        value: "#2e7d00" // Enlaces con un color base verde oscuro
      },
      distance: 150,
      enable: true,
      opacity: 0.4,
      width: 1,
      triangles: { // NUEVO: Añade triángulos entre partículas para más complejidad visual
        enable: true,
        opacity: 0.05,
        color: {
          value: "#1e5a00"
        }
      }
    },
    move: {
      direction: "none",
      enable: true,
      outModes: {
        default: "bounce", // Las partículas rebotan en los bordes
      },
      random: true, // Movimiento aleatorio
      speed: 2, // Velocidad ligeramente aumentada para más dinamismo
      straight: false,
      attract: { // NUEVO: Las partículas se atraen entre sí, creando cúmulos orgánicos
        enable: true,
        rotate: {
          x: 600,
          y: 1200,
        },
      },
    },
    number: {
      density: {
        enable: true,
        area: 800,
      },
      value: 80, // Ligeramente reducido para no sobrecargar con los nuevos efectos
    },
    opacity: {
      value: {
        min: 0.1,
        max: 0.6
      }, // Rango de opacidad
      animation: {
        enable: true,
        speed: 0.5, // Animación de opacidad más sutil
        sync: false,
      },
    },
    shape: {
      type: "circle", // Simplificado a 'circle' para un look más limpio y moderno
    },
    size: {
      value: {
        min: 1,
        max: 5
      }, // Tamaño máximo reducido para un aspecto más delicado
      animation: {
        enable: true,
        speed: 3,
        sync: false,
      },
    },
    twinkle: { // NUEVO: Añade un sutil efecto de parpadeo a algunas partículas
      particles: {
        enable: true,
        frequency: 0.05,
        opacity: 1
      }
    }
  },
  detectRetina: true,
}), []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 overflow-hidden relative">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions as any}
        className="absolute inset-0 z-0"
      />
      
      <div 
        className="relative z-10 w-full max-w-md bg-white/90 rounded-2xl p-8 shadow-2xl backdrop-blur-sm border border-white/30 animate-fade-in-up transition-all duration-500 hover:backdrop-blur-md hover:shadow-3xl hover:bg-white/95"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        
        <div 
          className="flex flex-col items-center mb-8 animate-fade-in-up transition-transform duration-500" 
          style={{ animationDelay: '100ms', transform: isHovering ? 'translateY(-5px)' : 'translateY(0)' }}
        >
          <img
            className="w-48 h-auto object-contain mb-4 transition-transform duration-500 hover:scale-105"
            src="img/convo2.png"
            alt="Logo Convocatorias"
          />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-[#39A900] bg-clip-text text-transparent">
            Iniciar Sesión
            <span className="block h-1 mt-2 bg-gradient-to-r from-[#39A900] to-transparent rounded-full transition-all duration-500 origin-left scale-x-0 group-hover:scale-x-100"></span>
          </h1>
        </div>
    
        <form onSubmit={manejarEnvio}>
          <div 
            className="relative mb-6 animate-fade-in-up transition-transform duration-500" 
            style={{ animationDelay: '200ms', transform: isHovering ? 'translateX(5px)' : 'translateX(0)' }}
          >
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-4 text-lg text-slate-400 peer-focus:text-[#39A900] transition-all duration-300 group-hover:scale-110" />
              <input
                type="email"
                className="peer w-full pt-5 pb-2 px-3 pl-10 text-base font-medium text-gray-800 bg-transparent border-0 border-b-2 border-slate-200 outline-none focus:border-[#39A900] transition-all duration-300 group-hover:border-[#39A900]/50"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder=" "
                required
              />
              <label className="absolute top-4 left-10 text-base text-slate-500 pointer-events-none transition-all duration-300 ease-in-out peer-focus:top-[-0.5rem] peer-focus:text-xs peer-focus:text-[#39A900] peer-[&:not(:placeholder-shown)]:top-[-0.5rem] peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:text-[#39A900] group-hover:text-[#39A900]/70">
                Correo Electrónico
              </label>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#39A900] transition-all duration-500 peer-focus:w-full"></span>
            </div>
          </div>
    
          <div 
            className="relative mb-8 animate-fade-in-up transition-transform duration-500" 
            style={{ animationDelay: '300ms', transform: isHovering ? 'translateX(-5px)' : 'translateX(0)' }}
          >
            <div className="relative">
              <FaLock className="absolute left-3 top-4 text-lg text-slate-400 peer-focus:text-[#39A900] transition-all duration-300 group-hover:scale-110" />
              <input
                type={mostrarContrasena ? "text" : "password"}
                className="peer w-full pt-5 pb-2 px-3 pl-10 text-base font-medium text-gray-800 bg-transparent border-0 border-b-2 border-slate-200 outline-none focus:border-[#39A900] transition-all duration-300 group-hover:border-[#39A900]/50"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                placeholder=" "
                required
              />
              <label className="absolute top-4 left-10 text-base text-slate-500 pointer-events-none transition-all duration-300 ease-in-out peer-focus:top-[-0.5rem] peer-focus:text-xs peer-focus:text-[#39A900] peer-[&:not(:placeholder-shown)]:top-[-0.5rem] peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:text-[#39A900] group-hover:text-[#39A900]/70">
                Contraseña
              </label>
              <button
                type="button"
                onClick={() => setMostrarContrasena(!mostrarContrasena)}
                className="absolute right-3 top-4 text-slate-400 hover:text-[#39A900] transition-all duration-300 hover:scale-125"
              >
                {mostrarContrasena ? <FaEyeSlash /> : <FaEye />}
              </button>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#39A900] transition-all duration-500 peer-focus:w-full"></span>
            </div>
          </div>
    
          <div 
            className="animate-fade-in-up transition-transform duration-500" 
            style={{ animationDelay: '400ms', transform: isHovering ? 'scale(1.02)' : 'scale(1)' }}
          >
            <button 
              type="submit" 
              className="relative w-full py-3.5 text-base font-bold bg-gradient-to-r from-[#39A900] to-[#2e7d00] text-white rounded-xl cursor-pointer overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-[#39A900]/40 group active:scale-95"
            >
              <span className="relative z-10 inline-flex items-center gap-2">
                <FaSignInAlt className="transition-transform duration-300 group-hover:translate-x-1" />
                Ingresar
              </span>

            </button>
          </div>
        </form>
    
        <div 
          className="text-center mt-6 text-sm text-slate-600 animate-fade-in-up transition-all duration-500 hover:text-slate-800" 
          style={{ animationDelay: '500ms' }}
        >
          ¿No tienes una cuenta?{" "}
          <a href="/registro" className="font-semibold text-[#39A900] no-underline hover:underline hover:text-[#2e7d00] transition-all duration-300">
            Regístrate aquí
          </a>
        </div>
        <div 
          className="text-center mt-3 text-sm text-slate-600 animate-fade-in-up transition-all duration-500 hover:text-slate-800" 
          style={{ animationDelay: '600ms' }}
        >
          <a href="/recuperarcontrasena" className="font-semibold text-[#39A900] no-underline hover:underline hover:text-[#2e7d00] transition-all duration-300">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </div>
    </div>
  );
}