"use client";
import React, { useEffect, useState } from "react";
import {
  User,
  Lock,
  Mail,
  Check,
  X,
  Shield,
  KeyRound,
  Save,
  Image as ImageIcon,
} from "lucide-react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

interface ProfileAvatarProps {
  isOpen: boolean;
  onClose: () => void;
  modoOscuro: boolean;
}
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_URL = `${BASE_URL}/users`;

export default function ProfileAvatar({
  isOpen,
  onClose,
  modoOscuro,
}: ProfileAvatarProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [admin, setAdmin] = useState({
    id: 0,
    nombreUsuario: "",
    correo: "",
    rol: "Administrador",
    imgUser: "",
    password: "",
    confirmarPassword: "",
  });
  const [previewImg, setPreviewImg] = useState<string>("/img/eco.jpeg");

  // 🧩 Cargar datos del admin con rol 2
  useEffect(() => {
    if (isOpen) fetchAdminData();
  }, [isOpen]);

  const fetchAdminData = async () => {
    try {
      const res = await fetch(API_URL);
      const json = await res.json();
      if (json?.data) {
        const adminUser = json.data.find(
          (u: any) => u.role_id === 2 || u.roleId === 2
        );
        if (adminUser) {
          setAdmin({
            id: adminUser.id,
            nombreUsuario: adminUser.name || "",
            correo: adminUser.email || "",
            rol: "Administrador",
            imgUser: adminUser.imgUser || "",
            password: "",
            confirmarPassword: "",
          });
          setPreviewImg(adminUser.imgUser || "/img/eco.jpeg");
        }
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al cargar datos",
        text: "No se pudo obtener la información del administrador.",
        confirmButtonColor: "#39A900",
      });
    }
  };

  // ✏️ Manejar cambios
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdmin((prev) => ({ ...prev, [name]: value }));
    if (name === "imgUser") setPreviewImg(value || "/img/eco.jpeg");
  };

  // 💾 Guardar cambios
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (admin.password && admin.password !== admin.confirmarPassword) {
      Swal.fire({
        icon: "warning",
        title: "Contraseñas no coinciden",
        text: "Por favor verifica que ambas contraseñas sean iguales.",
        confirmButtonColor: "#39A900",
      });
      return;
    }

    setIsLoading(true);
    Swal.fire({
      title: "Guardando cambios...",
      text: "Por favor espera un momento.",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const res = await fetch(`${API_URL}/${admin.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: admin.nombreUsuario,
          email: admin.correo,
          password: admin.password || undefined,
          imgUser: admin.imgUser,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Error al actualizar");

      Swal.fire({
        icon: "success",
        title: "Perfil actualizado",
        text: "Los cambios se guardaron correctamente.",
        confirmButtonColor: "#39A900",
      }).then(() => onClose());
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error al guardar",
        text: "No se pudieron aplicar los cambios. Intenta nuevamente.",
        confirmButtonColor: "#39A900",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 🎨 Estilos dinámicos
  const overlayBg = "bg-black/70";
  const modalBg = modoOscuro
    ? "bg-gradient-to-br from-[#1a0526] to-[#2a083a] text-white"
    : "bg-gradient-to-br from-white to-gray-50 text-gray-900";
  const footerBg = modoOscuro ? "border-white/20" : "border-gray-200";
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

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 ${overlayBg} z-50 flex items-center justify-center p-4 backdrop-blur-sm`}
      onClick={onClose}
    >
      <div
        className={`${modalBg} rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden transform transition-all duration-300`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-[#39A900] border-b border-white/20 relative flex justify-center items-center">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <User className="text-white" size={22} />
            Perfil del Administrador
          </h2>
          <button
            className="absolute right-4 top-4 rounded-full p-2 hover:bg-white/20 text-white transition-all"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-8 space-y-8">
          {/* Imagen de perfil */}
          <div className="flex flex-col items-center text-center">
            <img
              src={previewImg || "/img/eco.jpeg"}
              alt="Avatar"
              className="w-28 h-28 rounded-full object-cover border-4 border-[#39A900] shadow-md hover:scale-105 transition-transform duration-300"
            />
           
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 mt-3 rounded-full ${badgeBg}`}
            >
              <Shield className="w-4 h-4" />
              <span className="font-medium text-sm">{admin.rol}</span>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Imagen URL */}
              <div className="space-y-2">
                <label className="text-sm font-semibold">URL de Imagen</label>
                <div className="relative">
                  <ImageIcon
                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconInputColor}`}
                    size={18}
                  />
                  <input
                    type="text"
                    name="imgUser"
                    value={admin.imgUser || ""}
                    onChange={handleChange}
                    placeholder="https://ejemplo.com/foto.jpg"
                    className={`w-full border rounded-xl pl-10 pr-4 py-3 ${inputBg}`}
                  />
                </div>
              </div>

              {/* Nombre */}
              <div className="space-y-2">
                <label className="text-sm font-semibold">Nombre de Usuario</label>
                <div className="relative">
                  <User
                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconInputColor}`}
                    size={18}
                  />
                  <input
                    type="text"
                    name="nombreUsuario"
                    value={admin.nombreUsuario}
                    onChange={handleChange}
                    className={`w-full border rounded-xl pl-10 pr-4 py-3 ${inputBg}`}
                  />
                </div>
              </div>

              {/* Correo */}
              <div className="space-y-2">
                <label className="text-sm font-semibold">Correo Electrónico</label>
                <div className="relative">
                  <Mail
                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconInputColor}`}
                    size={18}
                  />
                  <input
                    type="email"
                    name="correo"
                    value={admin.correo}
                    onChange={handleChange}
                    className={`w-full border rounded-xl pl-10 pr-24 py-3 ${inputBg}`}
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
                <label className="text-sm font-semibold">Nueva Contraseña</label>
                <div className="relative">
                  <Lock
                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconInputColor}`}
                    size={18}
                  />
                  <input
                    type="password"
                    name="password"
                    value={admin.password}
                    onChange={handleChange}
                    placeholder="Escribe la nueva contraseña"
                    className={`w-full border rounded-xl pl-10 pr-4 py-3 ${inputBg}`}
                  />
                </div>
              </div>

              {/* Confirmar contraseña */}
              <div className="space-y-2">
                <label className="text-sm font-semibold">Confirmar Contraseña</label>
                <div className="relative">
                  <KeyRound
                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconInputColor}`}
                    size={18}
                  />
                  <input
                    type="password"
                    name="confirmarPassword"
                    value={admin.confirmarPassword}
                    onChange={handleChange}
                    placeholder="Repite la contraseña"
                    className={`w-full border rounded-xl pl-10 pr-4 py-3 ${inputBg}`}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              className={`pt-6 flex flex-col sm:flex-row justify-between items-center border-t gap-4 mt-8 ${footerBg}`}
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
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-white bg-[#39A900] shadow-md transition-all transform hover:scale-[1.02]"
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
