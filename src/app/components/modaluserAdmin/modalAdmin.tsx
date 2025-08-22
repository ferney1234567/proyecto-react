'use client';
import React, { useEffect, useState } from 'react';
import { User, Lock, Mail, Check, X, Shield, Camera, KeyRound, Verified, Sparkles, PencilLine } from 'lucide-react';

interface ProfileAvatarProps {
  isOpen: boolean;
  onClose: () => void;
}

const adminData = {
  nombreUsuario: 'alex_admin',
  correo: 'alex.doe@example.com',
  rol: 'Super Administrador',
  avatarUrl: 'img/convo2.png',
  bannerUrl: 'https://images.pexels.com/photos/6985003/pexels-photo-6985003.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
};

export default function ProfileAvatar({ isOpen, onClose }: ProfileAvatarProps) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden border border-white/20 transform transition-all duration-300 hover:shadow-[0_30px_60px_-15px_rgba(57,169,0,0.3)]"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.2)',
          background: 'linear-gradient(to bottom right, #ffffff, #f0f9eb)'
        }}
      >
        {/* Banner */}
        <div className="relative h-40 w-full group">
          <img
            src={adminData.bannerUrl}
            alt="Banner"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />

          {/* Botón cerrar */}
          <button
            className="absolute top-6 right-6 text-white hover:text-gray-200 transition-all p-2 rounded-full bg-black/30 hover:bg-black/40 backdrop-blur-sm hover:scale-110"
            onClick={onClose}
          >
            <X size={22} strokeWidth={2.5} className="text-white/90" />
          </button>

          {/* Avatar */}
          <div className="absolute -bottom-14 left-1/2 -translate-x-1/2">
            <div className="relative group">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#39A900] to-[#2d8900] p-1 shadow-2xl animate-pulse-slow">
                <img
                  src={adminData.avatarUrl}
                  alt="Avatar"
                  className="w-full h-full rounded-full object-cover bg-white transition-all duration-500 group-hover:scale-95"
                />
              </div>
              <button className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[1px]">
                <div className="p-2 bg-white/90 rounded-full shadow-lg transform transition-all hover:scale-110">
                  <Camera size={24} className="text-gray-800" strokeWidth={2} />
                </div>
              </button>
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-[#39A900] border-4 border-white rounded-full shadow-lg flex items-center justify-center animate-bounce-slow">
                <Verified className="w-3 h-3 text-white" fill="currentColor" />
              </div>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="pt-20 px-8 pb-8 md:px-12 bg-gradient-to-br from-white via-[#f5fcf0] to-[#e8f8e0]">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-[#2d8900] bg-clip-text text-transparent mb-2">
              {adminData.nombreUsuario}
            </h2>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#e8f8e0] to-[#d0f0c0] border border-[#39A900]/30 rounded-full shadow-sm">
              <Shield className="w-4 h-4 text-[#39A900]" fill="currentColor" />
              <span className="text-[#2d8900] font-medium text-sm">{adminData.rol}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Nombre de Usuario */}
              <div className="space-y-3 group">
                <label htmlFor="nombreUsuario" className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <PencilLine className="w-4 h-4 text-[#39A900]" />
                  Nombre de Usuario
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-[#39A900]/10 rounded-lg z-10">
                    <User className="text-[#39A900]" size={18} strokeWidth={2.2} />
                  </div>
                  <input
                    type="text"
                    id="nombreUsuario"
                    defaultValue={adminData.nombreUsuario}
                    className="w-full border border-gray-200 rounded-2xl pl-14 pr-4 py-4 bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#39A900]/30 focus:border-[#39A900] transition-all text-gray-800 placeholder-gray-400 hover:border-[#39A900]/50"
                  />
                </div>
              </div>

              {/* Correo */}
              <div className="space-y-3 group">
                <label htmlFor="correo" className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#39A900]" />
                  Correo Electrónico
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-[#39A900]/10 rounded-lg z-10">
                    <Mail className="text-[#39A900]" size={18} strokeWidth={2.2} />
                  </div>
                  <input
                    type="email"
                    id="correo"
                    defaultValue={adminData.correo}
                    className="w-full border border-gray-200 rounded-2xl pl-14 pr-24 py-4 bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#39A900]/30 focus:border-[#39A900] transition-all text-gray-800 hover:border-[#39A900]/50"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-xs text-[#39A900] bg-[#e8f8e0] px-3 py-1.5 rounded-full border border-[#39A900]/20">
                    <Check size={12} strokeWidth={3} />
                    <span className="font-medium">Verificado</span>
                  </div>
                </div>
              </div>

              {/* Nueva contraseña */}
              <div className="space-y-3 group">
                <label htmlFor="nuevaContrasena" className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-[#39A900]" />
                  Nueva Contraseña
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-[#39A900]/10 rounded-lg z-10">
                    <Lock className="text-[#39A900]" size={18} strokeWidth={2.2} />
                  </div>
                  <input
                    type="password"
                    id="nuevaContrasena"
                    placeholder="Escribe tu nueva contraseña"
                    className="w-full border border-gray-200 rounded-2xl pl-14 pr-4 py-4 bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#39A900]/30 focus:border-[#39A900] text-gray-800 placeholder-gray-400 hover:border-[#39A900]/50"
                  />
                </div>
              </div>

              {/* Confirmar contraseña */}
              <div className="space-y-3 group">
                <label htmlFor="confirmarContrasena" className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-[#39A900]" />
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-[#39A900]/10 rounded-lg z-10">
                    <KeyRound className="text-[#39A900]" size={18} strokeWidth={2.2} />
                  </div>
                  <input
                    type="password"
                    id="confirmarContrasena"
                    placeholder="Repite tu nueva contraseña"
                    className="w-full border border-gray-200 rounded-2xl pl-14 pr-4 py-4 bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#39A900]/30 focus:border-[#39A900] text-gray-800 placeholder-gray-400 hover:border-[#39A900]/50"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-8 flex justify-end items-center gap-4">
              <button
                type="button"
                className="px-8 py-3 border border-gray-300 rounded-2xl text-gray-700 bg-white/80 hover:bg-gray-50 transition-all flex items-center gap-2 hover:shadow-sm transform hover:-translate-x-1"
                onClick={onClose}
                disabled={isLoading}
              >
                <X size={18} strokeWidth={2.2} />
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-10 py-3 bg-gradient-to-r from-[#39A900] to-[#2d8900] text-white rounded-2xl shadow-md hover:shadow-lg hover:shadow-[#39A900]/30 transition-all flex items-center gap-2 transform hover:translate-y-[-2px] hover:scale-[1.02]"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Check size={20} strokeWidth={2.2} />
                    Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}