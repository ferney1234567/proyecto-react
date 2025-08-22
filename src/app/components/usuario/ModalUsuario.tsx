'use client';
import { FaUserPlus, FaTimes, FaUser, FaEnvelope, FaLock, FaPhone, FaUserCheck, FaSave } from 'react-icons/fa';
import { Usuario } from './Usuario';

interface ModalUsuarioProps {
  nuevoUsuario: Usuario;
  editandoId: string | null;
  manejarCambio: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  cerrarModal: () => void;
  guardarUsuario: () => void;
}

export default function ModalUsuario({
  nuevoUsuario,
  editandoId,
  manejarCambio,
  cerrarModal,
  guardarUsuario
}: ModalUsuarioProps) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all duration-300 animate-pulse-once">
        {/* Header con diseño mejorado */}
        <div className="bg-gradient-to-r from-[#39A900] via-[#45b800] to-[#2d8500] p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl border border-white/30 backdrop-blur-sm">
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
              className="text-white hover:text-red-200 transition-all duration-200 p-2 rounded-full hover:bg-red-500/20 border border-white/20"
              onClick={cerrarModal}
            >
              <FaTimes size={20} />
            </button>
          </div>
        </div>

        {/* Body con inputs mejorados */}
        <div className="p-8 space-y-6 bg-gradient-to-b from-gray-50 to-white">
          <div className="grid grid-cols-1 gap-6">
            {/* Nombre con icono interno */}
            <div className="space-y-2">
              <label htmlFor="nombre" className="block text-sm font-semibold text-gray-700">
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
                  className="w-full border-2 border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900]/30 focus:border-[#39A900] text-base transition-all duration-200 hover:border-[#39A900]/50  text-gray-800"
                  placeholder="Ingrese el nombre completo"
                  value={nuevoUsuario.nombre}
                  onChange={manejarCambio}
                />
              </div>
            </div>

            {/* Correo con icono interno */}
            <div className="space-y-2">
              <label htmlFor="correo" className="block text-sm font-semibold text-gray-700">
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
                  className="w-full border-2 border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900]/30 focus:border-[#39A900] text-base transition-all duration-200 hover:border-[#39A900]/50  text-gray-800"
                  placeholder="usuario@ejemplo.com"
                  value={nuevoUsuario.correo}
                  onChange={manejarCambio}
                />
              </div>
            </div>

            {/* Contraseña con icono interno */}
            <div className="space-y-2">
              <label htmlFor="contraseña" className="block text-sm font-semibold text-gray-700">
                {editandoId ? 'Nueva contraseña' : 'Contraseña'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaLock className="text-[#39A900] text-lg" />
                </div>
                <input
                  type="password"
                  id="contraseña"
                  name="contraseña"
                  className="w-full border-2 border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900]/30 focus:border-[#39A900] text-base transition-all duration-200 hover:border-[#39A900]/50  text-gray-800"
                  placeholder={editandoId ? 'Dejar vacío para mantener la actual' : 'Mínimo 8 caracteres'}
                  value={nuevoUsuario.contraseña}
                  onChange={manejarCambio}
                />
              </div>
            </div>

            {/* Teléfono con icono interno */}
            <div className="space-y-2">
              <label htmlFor="telefono" className="block text-sm font-semibold text-gray-700">
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
                  className="w-full border-2 border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900]/30 focus:border-[#39A900] text-base transition-all duration-200 hover:border-[#39A900]/50  text-gray-800"
                  placeholder="Ej: 3001234567"
                  value={nuevoUsuario.telefono}
                  onChange={manejarCambio}
                />
              </div>
            </div>

            {/* Estado con icono interno */}
            <div className="space-y-2">
              <label htmlFor="estado" className="block text-sm font-semibold text-gray-700">
                Estado del usuario
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <FaUserCheck className="text-[#39A900] text-lg" />
                </div>
                <select
                  id="estado"
                  name="estado"
                  className="w-full border-2 border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900]/30 focus:border-[#39A900] text-base appearance-none transition-all duration-200 hover:border-[#39A900]/50 cursor-pointer text-gray-800"
                  value={nuevoUsuario.estado}
                  onChange={manejarCambio}
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer mejorado */}
        <div className="bg-white px-8 py-6 flex justify-between items-center border-t border-gray-100 shadow-inner">
          <button
            className="flex items-center gap-3 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
            onClick={cerrarModal}
          >
            <FaTimes size={16} />
            <span>Cancelar</span>
          </button>
          <button
            className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#39A900] to-[#2d8500] text-white rounded-xl hover:from-[#2d8500] hover:to-[#1f5c00] transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
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