'use client';

import { FaUserPlus, FaTimes, FaUser, FaEnvelope, FaLock, FaPhone, FaUserCheck, FaSave } from 'react-icons/fa';
import { Usuario } from './Usuario';

interface ModalUsuarioProps {
  nuevoUsuario: Usuario;
  editandoId: string | null;
  manejarCambio: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  cerrarModal: () => void;
  guardarUsuario: () => void;
  modoOscuro?: boolean;
}

export default function ModalUsuario({
  nuevoUsuario,
  editandoId,
  manejarCambio,
  cerrarModal,
  guardarUsuario,
  modoOscuro = false
}: ModalUsuarioProps) {
  // 🔹 estilos condicionales
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
      <div className={`${modalBg} rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-[#39A900] via-[#45b800] to-[#2d8500] p-6 relative overflow-hidden">
          <div className="relative flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl border border-white/30">
                <FaUserPlus className="text-white text-2xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {editandoId ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
                </h2>
                <p className="text-white/80 text-sm mt-1">
                  {editandoId ? 'Modifica la información del usuario' : 'Completa los datos del nuevo usuario'}
                </p>
              </div>
            </div>
            <button
              className="text-white hover:text-red-200 p-2 rounded-full hover:bg-red-500/20 border border-white/20"
              onClick={cerrarModal}
            >
              <FaTimes size={20} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Nombre */}
            <div>
              <label htmlFor="name" className={`block text-sm font-semibold ${labelColor}`}>
                Nombre completo
              </label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#39A900]" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={`w-full border rounded-xl pl-12 pr-4 py-3 ${inputBg}`}
                  placeholder="Ingrese el nombre completo"
                  value={nuevoUsuario.name}
                  onChange={manejarCambio}
                />
              </div>
            </div>

            {/* Correo */}
            <div>
              <label htmlFor="email" className={`block text-sm font-semibold ${labelColor}`}>
                Correo electrónico
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-[#39A900]" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`w-full border rounded-xl pl-12 pr-4 py-3 ${inputBg}`}
                  placeholder="usuario@ejemplo.com"
                  value={nuevoUsuario.email}
                  onChange={manejarCambio}
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label htmlFor="password" className={`block text-sm font-semibold ${labelColor}`}>
                {editandoId ? 'Nueva contraseña' : 'Contraseña'}
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#39A900]" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  className={`w-full border rounded-xl pl-12 pr-4 py-3 ${inputBg}`}
                  placeholder={editandoId ? 'Dejar vacío para mantener la actual' : 'Mínimo 8 caracteres'}
                  value={nuevoUsuario.password}
                  onChange={manejarCambio}
                />
              </div>
            </div>

            {/* Teléfono */}
            <div>
              <label htmlFor="phone" className={`block text-sm font-semibold ${labelColor}`}>
                Teléfono
              </label>
              <div className="relative">
                <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#39A900]" />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className={`w-full border rounded-xl pl-12 pr-4 py-3 ${inputBg}`}
                  placeholder="Ej: 3001234567"
                  value={nuevoUsuario.phone}
                  onChange={manejarCambio}
                />
              </div>
            </div>

            {/* Estado */}
            <div>
              <label htmlFor="is_active" className={`block text-sm font-semibold ${labelColor}`}>
                Estado del usuario
              </label>
              <div className="relative">
                <FaUserCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-[#39A900]" />
                <select
                  id="is_active"
                  name="is_active"
                  className={`w-full border rounded-xl pl-12 pr-4 py-3 ${inputBg}`}
                  value={nuevoUsuario.is_active ? 'true' : 'false'}
                  onChange={(e) => manejarCambio({
                    ...e,
                    target: {
                      ...e.target,
                      name: 'is_active',
                      value: e.target.value === 'true'
                    }
                  } as any)}
                >
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`${footerBg} px-8 py-6 flex justify-between items-center border-t`}>
          <button
            className={`flex items-center gap-3 px-6 py-3 rounded-xl ${cancelBtn}`}
            onClick={cerrarModal}
          >
            <FaTimes size={16} />
            <span>Cancelar</span>
          </button>
          <button
            className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#39A900] to-[#2d8500] text-white rounded-xl"
            onClick={guardarUsuario}
          >
            <FaSave size={16} />
            <span>{editandoId ? 'Actualizar Usuario' : 'Guardar Usuario'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
