"use client";
import React, { useEffect, useState } from "react";
import {User,Lock,Mail,Check,X,Shield,Camera,KeyRound,Verified,Save,
} from "lucide-react";

interface ProfileAvatarProps {
  isOpen: boolean;
  onClose: () => void;
  modoOscuro: boolean;
}

const adminData = {
  nombreUsuario: "alex_admin",
  correo: "alex.doe@example.com",
  rol: "Super Administrador",
  avatarUrl: "img/convo2.png",
};

export default function ProfileAvatar({
  isOpen,
  onClose,
  modoOscuro,
}: ProfileAvatarProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);

  // Evita scroll cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  // 🎨 Estilos dinámicos mejorados
  const overlayBg = "bg-black/70";
  const modalBg = modoOscuro 
    ? "bg-gradient-to-br from-[#1a0526] to-[#2a083a] text-white" 
    : "bg-gradient-to-br from-white to-gray-50 text-gray-900";
    
  const headerBg = modoOscuro 
    ? "bg-gradient-to-r from-[#2a083a] to-[#1a0526]" 
    : "bg-gradient-to-r from-gray-50 to-gray-100";
    
  const footerBg = modoOscuro 
    ? "border-white/20" 
    : "border-gray-200";

  const badgeBg = modoOscuro
    ? "bg-[#39A900]/20 border border-[#39A900]/40 text-[#8eff5e]"
    : "bg-[#e8f8e0] border border-green-300 text-[#2d8500]";

  const inputBg = modoOscuro
    ? "bg-[#2a083a]/80 border-white/30 text-white placeholder-gray-400 focus:border-[#39A900]"
    : "bg-white border-gray-300 text-gray-800 placeholder-gray-500 focus:border-[#39A900]";

  const iconInputColor = modoOscuro ? "text-[#8eff5e]" : "text-[#39A900]";

  const cancelBtn = modoOscuro
    ? "border-white/30 text-gray-200 hover:bg-white/10 hover:border-white/40"
    : "border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400";

  const mainBtnBg = modoOscuro
    ? "bg-gradient-to-r from-green-700 to-green-800 hover:from-green-800 hover:to-green-900"
    : "bg-gradient-to-r from-[#39A900] to-[#2d8500] hover:from-[#2d8500] hover:to-[#236700]";

  return (
    <div
      className={`fixed inset-0 ${overlayBg} z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      <div
        className={`${modalBg} rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden transform transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
      >
        {/* Header */}
        <div className={`p-6 flex justify-between items-center ${headerBg} border-b ${modoOscuro ? 'border-white/20' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${modoOscuro ? 'bg-white/10' : 'bg-[#39A900]/10'}`}>
              <User className={`text-xl ${modoOscuro ? 'text-[#8eff5e]' : 'text-[#39A900]'}`} />
            </div>
            <h2 className="text-2xl font-bold">Perfil de Usuario</h2>
          </div>
          <button
            className={`rounded-full p-2 transition-all ${modoOscuro ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-200 text-gray-700'}`}
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-8">
          {/* Avatar e info */}
          <div className="flex flex-col items-center mb-8">
            <div 
              className="relative group mb-4"
              onMouseEnter={() => setIsHoveringAvatar(true)}
              onMouseLeave={() => setIsHoveringAvatar(false)}
            >
            
            </div>

            <h3 className="text-xl font-bold mb-2">{adminData.nombreUsuario}</h3>
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${badgeBg} shadow-sm`}
            >
              <Shield className="w-4 h-4" />
              <span className="font-medium text-sm">{adminData.rol}</span>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre de Usuario */}
              <div className="space-y-2">
                <label
                  className={`block text-sm font-medium ${modoOscuro ? "text-gray-200" : "text-gray-700"}`}
                >
                  Nombre de Usuario
                </label>
                <div className="relative">
                  <User
                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconInputColor}`}
                    size={18}
                  />
                  <input
                    type="text"
                    defaultValue={adminData.nombreUsuario}
                    className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-[#39A900] focus:outline-none transition-colors ${inputBg}`}
                  />
                </div>
              </div>

              {/* Correo */}
              <div className="space-y-2">
                <label
                  className={`block text-sm font-medium ${modoOscuro ? "text-gray-200" : "text-gray-700"}`}
                >
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail
                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconInputColor}`}
                    size={18}
                  />
                  <input
                    type="email"
                    defaultValue={adminData.correo}
                    className={`w-full border rounded-xl pl-10 pr-24 py-3 focus:ring-2 focus:ring-[#39A900] focus:outline-none transition-colors ${inputBg}`}
                  />
                  <div
                    className={`absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs px-2 py-1 rounded-full ${badgeBg}`}
                  >
                    <Check size={12} strokeWidth={3} />
                    <span>Verificado</span>
                  </div>
                </div>
              </div>

              {/* Nueva contraseña */}
              <div className="space-y-2">
                <label
                  className={`block text-sm font-medium ${modoOscuro ? "text-gray-200" : "text-gray-700"}`}
                >
                  Nueva Contraseña
                </label>
                <div className="relative">
                  <Lock
                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconInputColor}`}
                    size={18}
                  />
                  <input
                    type="password"
                    placeholder="Escribe tu nueva contraseña"
                    className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-[#39A900] focus:outline-none transition-colors ${inputBg}`}
                  />
                </div>
              </div>

              {/* Confirmar contraseña */}
              <div className="space-y-2">
                <label
                  className={`block text-sm font-medium ${modoOscuro ? "text-gray-200" : "text-gray-700"}`}
                >
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <KeyRound
                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconInputColor}`}
                    size={18}
                  />
                  <input
                    type="password"
                    placeholder="Repite tu nueva contraseña"
                    className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-[#39A900] focus:outline-none transition-colors ${inputBg}`}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              className={`px-0 pt-6 flex flex-col sm:flex-row justify-between items-center border-t gap-4 mt-8 ${footerBg}`}
            >
              <button
                type="button"
                className={`flex items-center gap-2 px-6 py-3 border rounded-xl transition-all ${cancelBtn}`}
                onClick={onClose}
                disabled={isLoading}
              >
                <X size={18} />
                <span>Cancelar</span>
              </button>
              <button
                type="submit"
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-white ${mainBtnBg} shadow-md transition-all transform hover:scale-[1.02]`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
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