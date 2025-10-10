"use client";

import { useEffect, useState } from "react";
import {
  FaTimes,
  FaSave,
  FaUser,
  FaTag,
  FaChevronDown,
  FaEdit,
} from "react-icons/fa";

interface ModalEditarUserInterestProps {
  visible: boolean;
  onClose: () => void;
  onSave: (editado: any) => void;
  userInterest: any;
  setUserInterest: (val: any) => void;
  modoOscuro: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;


export default function ModalEditarUserInterest({
  visible,
  onClose,
  onSave,
  userInterest,
  setUserInterest,
  modoOscuro,
}: ModalEditarUserInterestProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [interests, setInterests] = useState<any[]>([]);

  useEffect(() => {
    if (visible) {
      const fetchData = async () => {
        try {
          const resUsers = await fetch(`${API_URL}/users`);
          const resInterests = await fetch(`${API_URL}/interests`);
          const usersData = await resUsers.json();
          const interestsData = await resInterests.json();
          setUsers(usersData.data || []);
          setInterests(interestsData.data || []);
        } catch (error) {
          console.error("❌ Error cargando catálogos:", error);
        }
      };
      fetchData();
    }
  }, [visible]);

  if (!visible) return null;

  const handleSave = () => {
    onSave(userInterest);
  };

  // 🎨 estilos
  const modalBg = modoOscuro ? "bg-[#1a0526] text-white" : "bg-white text-gray-900";
  const inputBg = modoOscuro
    ? "bg-gray-800 border-gray-600 text-white"
    : "bg-white border-gray-300 text-gray-800";
  const footerBg = modoOscuro ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200";
  const cancelBtn = modoOscuro
    ? "border-gray-600 text-gray-300 hover:bg-gray-700"
    : "border-gray-300 text-gray-700 hover:bg-gray-100";

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className={`${modalBg} rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FaEdit /> Editar UserInterest
          </h2>
          <button
            className="text-white hover:text-gray-200 p-1 rounded-full hover:bg-white/10"
            onClick={onClose}
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          {/* Usuario */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Usuario *</label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600" />
              <select
                value={userInterest.userId}
                onChange={(e) =>
                  setUserInterest({ ...userInterest, userId: Number(e.target.value) })
                }
                className={`w-full border rounded-xl pl-10 pr-10 py-3 appearance-none ${inputBg}`}
              >
                <option value="">Seleccione un usuario</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
              <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Interés */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Interés *</label>
            <div className="relative">
              <FaTag className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600" />
              <select
                value={userInterest.interestId}
                onChange={(e) =>
                  setUserInterest({ ...userInterest, interestId: Number(e.target.value) })
                }
                className={`w-full border rounded-xl pl-10 pr-10 py-3 appearance-none ${inputBg}`}
              >
                <option value="">Seleccione un interés</option>
                {interests.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name}
                  </option>
                ))}
              </select>
              <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`${footerBg} px-8 py-6 flex justify-between items-center border-t`}>
          <button
            onClick={onClose}
            className={`flex items-center gap-2 px-6 py-3 border rounded-xl ${cancelBtn}`}
          >
            <FaTimes /> Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            <FaSave /> Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}
