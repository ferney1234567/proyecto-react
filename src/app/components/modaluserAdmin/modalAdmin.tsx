'use client';
import React, { useEffect, useState } from 'react';
import { 
  User, Lock, Mail, Check, X, Shield, Camera, KeyRound, Verified 
} from 'lucide-react';

interface ProfileAvatarProps {
  isOpen: boolean;
  onClose: () => void;
  modoOscuro: boolean;
}

const adminData = {
  nombreUsuario: 'alex_admin',
  correo: 'alex.doe@example.com',
  rol: 'Super Administrador',
  avatarUrl: 'img/convo2.png',
};

export default function ProfileAvatar({ isOpen, onClose, modoOscuro }: ProfileAvatarProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Evita scroll cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  // 🔹 Estilos dinámicos
  const overlayBg = modoOscuro ? 'bg-black/70' : 'bg-black/50';
  const modalBg = modoOscuro ? 'bg-gray-900 text-white' : 'bg-white text-gray-900';
  const headerBg = modoOscuro ? 'bg-gradient-to-r from-green-700 to-green-900' : 'bg-gradient-to-r from-[#39A900] to-[#2d8500]';
  const inputBg = modoOscuro 
    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
    : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500';
  const footerBg = modoOscuro ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200';
  const cancelBtn = modoOscuro 
    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
    : 'border-gray-300 text-gray-700 hover:bg-gray-100';
  const badgeBg = modoOscuro 
    ? 'bg-gray-700 border-gray-600 text-gray-200' 
    : 'bg-[#e8f8e0] text-[#39A900] border border-green-200';
  const iconColor = modoOscuro ? 'text-white' : 'text-gray-800';
  const mainBtnBg = modoOscuro ? 'bg-green-700 hover:bg-green-800' : 'bg-[#39A900] hover:bg-[#2d8500]';
  const iconInputColor = modoOscuro ? 'text-green-400' : 'text-[#39A900]';

  return (
    <div className={`fixed inset-0 ${overlayBg} z-50 flex items-center justify-center p-4 backdrop-blur-sm`}>
      <div className={`${modalBg} rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden transform transition-all duration-300 scale-95 hover:scale-100`}>
        
        {/* Header */}
        <div className={`p-6 flex justify-between items-center ${headerBg}`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full">
              <User className={`${iconColor} text-xl`} />
            </div>
            <h2 className="text-2xl font-bold text-white">Perfil de Usuario</h2>
          </div>
          <button
            className="text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-white/10"
            onClick={onClose}
          >
            <X size={24} className={iconColor} />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-8">
          {/* Avatar e info */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative group mb-4">
              <div className={`w-28 h-28 rounded-full p-1 shadow-2xl ${modoOscuro ? 'bg-gradient-to-br from-green-700 to-green-900' : 'bg-gradient-to-br from-[#39A900] to-[#2d8900]'}`}>
                <img
                  src={adminData.avatarUrl}
                  alt="Avatar"
                  className={`w-full h-full rounded-full object-cover ${modoOscuro ? 'bg-gray-800' : 'bg-white'}`}
                />
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-[#39A900] rounded-full shadow-lg">
                <Camera className="w-5 h-5 text-white" />
              </button>
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-[#39A900] border-4 border-white rounded-full shadow-lg flex items-center justify-center">
                <Verified className="w-3 h-3 text-white" fill="currentColor" />
              </div>
            </div>

            <h3 className="text-xl font-bold mb-2">{adminData.nombreUsuario}</h3>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full shadow-sm ${badgeBg}`}>
              <Shield className="w-4 h-4 text-[#39A900]" />
              <span className="font-medium text-sm">{adminData.rol}</span>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Nombre de Usuario */}
              <div className="space-y-2">
                <label className={`block text-sm font-medium ${modoOscuro ? 'text-gray-200' : 'text-gray-800'}`}>Nombre de Usuario</label>
                <div className="relative">
                  <User className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconInputColor}`} size={18} />
                  <input
                    type="text"
                    defaultValue={adminData.nombreUsuario}
                    className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${inputBg}`}
                  />
                </div>
              </div>

              {/* Correo */}
              <div className="space-y-2">
                <label className={`block text-sm font-medium ${modoOscuro ? 'text-gray-200' : 'text-gray-800'}`}>Correo Electrónico</label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconInputColor}`} size={18} />
                  <input
                    type="email"
                    defaultValue={adminData.correo}
                    className={`w-full border rounded-xl pl-10 pr-24 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${inputBg}`}
                  />
                  <div className={`absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs px-2 py-1 rounded-full ${badgeBg}`}>
                    <Check size={12} strokeWidth={3} />
                    <span>Verificado</span>
                  </div>
                </div>
              </div>

              {/* Nueva contraseña */}
              <div className="space-y-2">
                <label className={`block text-sm font-medium ${modoOscuro ? 'text-gray-200' : 'text-gray-800'}`}>Nueva Contraseña</label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconInputColor}`} size={18} />
                  <input
                    type="password"
                    placeholder="Escribe tu nueva contraseña"
                    className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${inputBg}`}
                  />
                </div>
              </div>

              {/* Confirmar contraseña */}
              <div className="space-y-2">
                <label className={`block text-sm font-medium ${modoOscuro ? 'text-gray-200' : 'text-gray-800'}`}>Confirmar Contraseña</label>
                <div className="relative">
                  <KeyRound className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconInputColor}`} size={18} />
                  <input
                    type="password"
                    placeholder="Repite tu nueva contraseña"
                    className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${inputBg}`}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className={`${footerBg} px-0 pt-6 flex justify-between items-center border-t mt-8`}>
              <button
                className={`flex items-center gap-2 px-6 py-3 border rounded-xl transition-colors hover:shadow-md ${cancelBtn}`}
                onClick={onClose}
                disabled={isLoading}
              >
                <X size={18} />
                <span>Cancelar</span>
              </button>
              <button
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-white transition-colors shadow-md hover:shadow-lg transform hover:scale-105 duration-200 ${mainBtnBg}`}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    <span>Guardar Cambios</span>
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
