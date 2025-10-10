'use client';

import { useState, useEffect } from 'react';
import {
  FaTimes,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaUserCheck,
  FaSave,
  FaImage,
} from 'react-icons/fa';

interface Usuario {
  id: string;
  name: string;
  email: string;
  phone: string;
  is_active: boolean;
  imgUser?: string | null;
}

interface EditarUsuarioProps {
  usuario: Usuario;
  onClose: () => void;
  actualizarUsuario: (usuario: Usuario) => void;
  modoOscuro?: boolean;
}

export default function EditarUsuario({
  usuario,
  onClose,
  actualizarUsuario,
  modoOscuro = false,
}: EditarUsuarioProps) {
  const [formData, setFormData] = useState<Usuario>({
    id: '',
    name: '',
    email: '',
    phone: '',
    is_active: true,
    imgUser: '',
  });
  const [previewImg, setPreviewImg] = useState<string>('/img/eco.jpeg');

  useEffect(() => {
    if (usuario) {
      setFormData({
        id: usuario.id || '',
        name: usuario.name || '',
        email: usuario.email || '',
        phone: usuario.phone || '',
        is_active: usuario.is_active ?? true,
        imgUser: usuario.imgUser || '',
      });
      setPreviewImg(usuario.imgUser || '/img/eco.jpeg');
    }
  }, [usuario]);

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'is_active') {
      setFormData((prev) => ({ ...prev, is_active: value === 'true' }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (name === 'imgUser') setPreviewImg(value || '/img/eco.jpeg');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    actualizarUsuario(formData);
    onClose();
  };

  // 🎨 Estilos condicionales
  const modalBg = modoOscuro ? 'bg-[#1a0526] text-white' : 'bg-white text-gray-900';
  const inputBg = modoOscuro
    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
    : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500';
  const footerBg = modoOscuro ? 'bg-gray-800 border-gray-600' : 'bg-gray-100 border-gray-200';
  const cancelBtn = modoOscuro
    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
    : 'border-gray-300 text-gray-700 hover:bg-gray-200';
  const labelColor = modoOscuro ? 'text-gray-300' : 'text-gray-700';

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className={`${modalBg} rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]`}>
        {/* 🟢 Header */}
        <div className="bg-gradient-to-r from-[#39A900] to-[#2d8500] p-6 flex justify-between items-center flex-shrink-0">
          <h2 className="text-2xl font-bold text-white">Editar Usuario</h2>
          <button
            className="text-white hover:text-red-200 p-2 rounded-full hover:bg-red-500/20 border border-white/20"
            onClick={onClose}
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* 📝 Formulario */}
        <form
          id="editarUsuarioForm"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-8 py-6 space-y-6 [scrollbar-width:none] [-ms-overflow-style:none]"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style jsx>{`
            form::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {/* Imagen vista previa */}
          <div className="flex flex-col items-center gap-3">
            {previewImg ? (
              <img
                src={previewImg || '/img/eco.jpeg'}
                alt="Vista previa"
                className="w-24 h-24 rounded-full object-cover border-4 border-[#39A900] shadow-md"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm">
                Sin imagen
              </div>
            )}
            <p className="text-sm text-gray-400">Vista previa de imagen</p>
          </div>

          {/* URL Imagen */}
          <div>
            <label className={`block text-sm font-semibold ${labelColor}`}>URL de Imagen</label>
            <div className="relative mt-1">
              <FaImage className="absolute left-4 top-3 text-[#39A900]" />
              <input
                type="text"
                name="imgUser"
                value={formData.imgUser || ''}
                onChange={manejarCambio}
                className={`w-full border rounded-xl pl-12 pr-4 py-3 ${inputBg}`}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>
          </div>

          {/* Nombre */}
          <div>
            <label className={`block text-sm font-semibold ${labelColor}`}>Nombre</label>
            <div className="relative mt-1">
              <FaUser className="absolute left-4 top-3 text-[#39A900]" />
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={manejarCambio}
                className={`w-full border rounded-xl pl-12 pr-4 py-3 ${inputBg}`}
                placeholder="Ingrese el nombre"
              />
            </div>
          </div>

          {/* Correo */}
          <div>
            <label className={`block text-sm font-semibold ${labelColor}`}>Correo</label>
            <div className="relative mt-1">
              <FaEnvelope className="absolute left-4 top-3 text-[#39A900]" />
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={manejarCambio}
                className={`w-full border rounded-xl pl-12 pr-4 py-3 ${inputBg}`}
                placeholder="usuario@correo.com"
              />
            </div>
          </div>

          {/* Teléfono */}
          <div>
            <label className={`block text-sm font-semibold ${labelColor}`}>Teléfono</label>
            <div className="relative mt-1">
              <FaPhone className="absolute left-4 top-3 text-[#39A900]" />
              <input
                type="tel"
                name="phone"
                value={formData.phone || ''}
                onChange={manejarCambio}
                className={`w-full border rounded-xl pl-12 pr-4 py-3 ${inputBg}`}
                placeholder="Ingrese el número de teléfono"
              />
            </div>
          </div>

          {/* Estado */}
          <div>
            <label className={`block text-sm font-semibold ${labelColor}`}>Estado</label>
            <div className="relative mt-1">
              <FaUserCheck className="absolute left-4 top-3 text-[#39A900]" />
              <select
                name="is_active"
                value={formData.is_active ? 'true' : 'false'}
                onChange={manejarCambio}
                className={`w-full border rounded-xl pl-12 pr-4 py-3 ${inputBg}`}
              >
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </div>
          </div>
        </form>

        {/* 🟢 Footer */}
        <div
          className={`${footerBg} px-8 py-6 flex justify-between items-center border-t flex-shrink-0`}
        >
          <button
            type="button"
            className={`flex items-center gap-3 px-6 py-3 rounded-xl ${cancelBtn}`}
            onClick={onClose}
          >
            <FaTimes size={16} /> Cancelar
          </button>
          <button
            type="submit"
            form="editarUsuarioForm"
            className="flex items-center gap-3 px-6 py-3 bg-[#39A900] text-white rounded-xl font-bold hover:scale-105 transition"
          >
            <FaSave size={16} /> Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}
