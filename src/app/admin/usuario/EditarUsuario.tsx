'use client';

import { useState, useEffect } from 'react';
import { FaUserPlus, FaTimes, FaUser, FaEnvelope, FaLock, FaPhone, FaUserCheck, FaSave } from 'react-icons/fa';

// Definimos la interfaz Usuario
interface Usuario {
  id: string;
  nombre: string;
  correo: string;
  contraseña: string;
  telefono: string;
  estado: string;
}

interface ModalUsuarioProps {
  usuario?: Usuario | null;
  onClose: () => void;   // ✅ Solo usamos esta
  guardarUsuario: (usuario: Usuario) => void;
  modoOscuro?: boolean;
}

export default function ModalUsuario({
  usuario,
  onClose,   
  guardarUsuario,
  modoOscuro = false,
}: ModalUsuarioProps) {
  const [nuevoUsuario, setNuevoUsuario] = useState<Usuario>({
    id: '',
    nombre: '',
    correo: '',
    contraseña: '',
    telefono: '',
    estado: 'Activo',
  });

  // Establecer datos del usuario cuando se pasa por props
  useEffect(() => {
    if (usuario) {
      setNuevoUsuario(usuario);
    } else {
      setNuevoUsuario({
        id: '',
        nombre: '',
        correo: '',
        contraseña: '',
        telefono: '',
        estado: 'Activo',
      });
    }
  }, [usuario]);

  // Manejar cambios en los inputs
  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNuevoUsuario((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejar envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    guardarUsuario(nuevoUsuario);
    onClose(); // ✅ Cerramos modal al guardar
  };

  // Estilos condicionales
  const modalBg = modoOscuro ? 'bg-[#1a0526] text-white' : 'bg-white text-gray-900';
  const inputBg = modoOscuro
    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
    : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500';
  const footerBg = modoOscuro ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-100';
  const cancelBtn = modoOscuro
    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
    : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400';
  const labelColor = modoOscuro ? 'text-gray-300' : 'text-gray-700';

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div
        className={`${modalBg} rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all duration-300 animate-pulse-once`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#39A900] via-[#45b800] to-[#2d8500] p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl border border-white/30 backdrop-blur-sm">
                <FaUserPlus className="text-white text-2xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {usuario ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
                </h2>
                <p className="text-white/80 text-sm mt-1">
                  {usuario
                    ? 'Modifica la información del usuario'
                    : 'Completa los datos del nuevo usuario'}
                </p>
              </div>
            </div>
            <button
              className="text-white hover:text-red-200 transition-all duration-200 p-2 rounded-full hover:bg-red-500/20 border border-white/20"
              onClick={onClose}
            >
              <FaTimes size={20} />
            </button>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          {/* Body */}
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Nombre */}
              <div className="space-y-2">
                <label htmlFor="nombre" className={`block text-sm font-semibold ${labelColor}`}>
                  Nombre completo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaUser className="text-[#39A900] text-lg" />
                  </div>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    className={`w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900]/30 focus:border-[#39A900] text-base transition-all duration-200 ${inputBg}`}
                    placeholder="Ingrese el nombre completo"
                    value={nuevoUsuario.nombre}
                    onChange={manejarCambio}
                    required
                  />
                </div>
              </div>

              {/* Correo */}
              <div className="space-y-2">
                <label htmlFor="correo" className={`block text-sm font-semibold ${labelColor}`}>
                  Correo electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaEnvelope className="text-[#39A900] text-lg" />
                  </div>
                  <input
                    type="email"
                    id="correo"
                    name="correo"
                    className={`w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900]/30 focus:border-[#39A900] text-base transition-all duration-200 ${inputBg}`}
                    placeholder="usuario@ejemplo.com"
                    value={nuevoUsuario.correo}
                    onChange={manejarCambio}
                    required
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div className="space-y-2">
                <label htmlFor="contraseña" className={`block text-sm font-semibold ${labelColor}`}>
                  {usuario ? 'Nueva contraseña' : 'Contraseña'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="text-[#39A900] text-lg" />
                  </div>
                  <input
                    type="password"
                    id="contraseña"
                    name="contraseña"
                    className={`w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900]/30 focus:border-[#39A900] text-base transition-all duration-200 ${inputBg}`}
                    placeholder={usuario ? 'Dejar vacío para mantener la actual' : 'Mínimo 8 caracteres'}
                    value={nuevoUsuario.contraseña}
                    onChange={manejarCambio}
                    minLength={!usuario ? 8 : undefined}
                    required={!usuario}
                  />
                </div>
              </div>

              {/* Teléfono */}
              <div className="space-y-2">
                <label htmlFor="telefono" className={`block text-sm font-semibold ${labelColor}`}>
                  Teléfono
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaPhone className="text-[#39A900] text-lg" />
                  </div>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    className={`w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900]/30 focus:border-[#39A900] text-base transition-all duration-200 ${inputBg}`}
                    placeholder="Ej: 3001234567"
                    value={nuevoUsuario.telefono}
                    onChange={manejarCambio}
                  />
                </div>
              </div>

              {/* Estado */}
              <div className="space-y-2">
                <label htmlFor="estado" className={`block text-sm font-semibold ${labelColor}`}>
                  Estado del usuario
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <FaUserCheck className="text-[#39A900] text-lg" />
                  </div>
                  <select
                    id="estado"
                    name="estado"
                    className={`w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900]/30 focus:border-[#39A900] text-base appearance-none transition-all duration-200 cursor-pointer ${inputBg}`}
                    value={nuevoUsuario.estado}
                    onChange={manejarCambio}
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className={`${footerBg} px-8 py-6 flex justify-between items-center border-t`}>
            <button
              type="button"
              className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-200 font-medium ${cancelBtn}`}
              onClick={onClose}
            >
              <FaTimes size={16} />
              <span>Cancelar</span>
            </button>
            <button
              type="submit"
              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#39A900] to-[#2d8500] text-white rounded-xl hover:from-[#2d8500] hover:to-[#1f5c00] transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <FaSave size={16} />
              <span>{usuario ? 'Actualizar Usuario' : 'Guardar Usuario'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
