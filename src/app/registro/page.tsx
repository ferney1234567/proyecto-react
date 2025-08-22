'use client';

import React, { useState, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import {
  FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUserPlus
} from 'react-icons/fa';
import type { Container, Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";

// Import dinámico para el componente de partículas
const Particles = dynamic(() => import('react-tsparticles'), { ssr: false });

export default function FormularioRegistro() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí tu lógica de registro
    console.log({ nombre, correo, contrasena });
    alert('¡Registro exitoso!');
  };

  // --- CONFIGURACIÓN DE PARTÍCULAS ---
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
        id="tsparticles-register"
        init={particlesInit}
        options={particlesOptions as any}
        className="absolute inset-0 z-0"
      />
      
      <div className="relative z-10 w-full max-w-md bg-white/80 rounded-2xl p-8 shadow-2xl backdrop-blur-md border border-white/30 animate-fade-in-up">
        
        <div className="flex flex-col items-center mb-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <img
            className="w-48 h-auto object-contain mb-4"
            src="img/convo2.png"
            alt="Logo Convocatorias"
          />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-[#39A900] bg-clip-text text-transparent">
            Crear Cuenta
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="relative mb-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <FaUser className="absolute left-3 top-4 text-lg text-slate-400 peer-focus:text-[#39A900] transition-colors duration-300" />
            <input
              type="text"
              className="peer w-full pt-5 pb-2 px-3 pl-10 text-base font-medium text-gray-800 bg-transparent border-0 border-b-2 border-slate-200 outline-none focus:border-[#39A900] transition-colors duration-300"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder=" "
              required
            />
            <label className="absolute top-4 left-10 text-base text-slate-500 pointer-events-none transition-all duration-300 ease-in-out peer-focus:top-[-0.5rem] peer-focus:text-xs peer-focus:text-[#39A900] peer-[&:not(:placeholder-shown)]:top-[-0.5rem] peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:text-[#39A900]">
              Nombre Completo
            </label>
          </div>

          <div className="relative mb-6 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <FaEnvelope className="absolute left-3 top-4 text-lg text-slate-400 peer-focus:text-[#39A900] transition-colors duration-300" />
            <input
              type="email"
              className="peer w-full pt-5 pb-2 px-3 pl-10 text-base font-medium text-gray-800 bg-transparent border-0 border-b-2 border-slate-200 outline-none focus:border-[#39A900] transition-colors duration-300"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder=" "
              required
            />
            <label className="absolute top-4 left-10 text-base text-slate-500 pointer-events-none transition-all duration-300 ease-in-out peer-focus:top-[-0.5rem] peer-focus:text-xs peer-focus:text-[#39A900] peer-[&:not(:placeholder-shown)]:top-[-0.5rem] peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:text-[#39A900]">
              Correo Electrónico
            </label>
          </div>

          <div className="relative mb-8 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <FaLock className="absolute left-3 top-4 text-lg text-slate-400 peer-focus:text-[#39A900] transition-colors duration-300" />
            <input
              type={mostrarContrasena ? "text" : "password"}
              className="peer w-full pt-5 pb-2 px-3 pl-10 text-base font-medium text-gray-800 bg-transparent border-0 border-b-2 border-slate-200 outline-none focus:border-[#39A900] transition-colors duration-300"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              placeholder=" "
              required
            />
            <label className="absolute top-4 left-10 text-base text-slate-500 pointer-events-none transition-all duration-300 ease-in-out peer-focus:top-[-0.5rem] peer-focus:text-xs peer-focus:text-[#39A900] peer-[&:not(:placeholder-shown)]:top-[-0.5rem] peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:text-[#39A900]">
              Contraseña
            </label>
            <button
              type="button"
              onClick={() => setMostrarContrasena(!mostrarContrasena)}
              className="absolute right-3 top-4 text-slate-400 hover:text-[#39A900] transition-colors"
            >
              {mostrarContrasena ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '500ms' }}>
            <button 
              type="submit" 
              className="relative w-full py-3.5 text-base font-bold bg-gradient-to-r from-[#39A900] to-[#2e7d00] text-white rounded-xl cursor-pointer overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#39A900]/40 group"
            >
              <span className="inline-flex items-center gap-2">
                <FaUserPlus />
                Registrarme
              </span>
              {/* Efecto Shimmer */}
              <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shimmer" />
            </button>
          </div>
        </form>

        <div className="text-center mt-6 text-sm text-slate-600 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
          ¿Ya tienes una cuenta?{" "}
          <a href="/" className="font-semibold text-[#39A900] no-underline hover:underline">
            Inicia Sesión
          </a>
        </div>
      </div>
    </div>
  );
}