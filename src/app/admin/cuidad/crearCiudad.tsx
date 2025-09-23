'use client';

import { useEffect, useState } from 'react';
import {
  FaCity,
  FaTimes,
  FaMapMarkerAlt,
  FaMapMarked,
  FaSave,
} from 'react-icons/fa';

interface CiudadModalProps {
  mostrar: boolean;
  onClose: () => void;
  onSave: () => void;
  editandoId: string | null;
  nombreCiudad: string;
  setNombreCiudad: (value: string) => void;
  nombreDepartamento: string; // aquí se guarda el ID
  setNombreDepartamento: (value: string) => void;
  modoOscuro: boolean;
}

interface Departamento {
  id: number;
  name: string;
}

export default function CiudadModal({
  mostrar,
  onClose,
  onSave,
  editandoId,
  nombreCiudad,
  setNombreCiudad,
  nombreDepartamento,
  setNombreDepartamento,
  modoOscuro,
}: CiudadModalProps) {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);

  // 🔹 cargar departamentos de la API
  useEffect(() => {
    if (mostrar) {
      const fetchDepartamentos = async () => {
        try {
          const res = await fetch('http://localhost:4000/api/v1/departments');
          if (!res.ok) throw new Error('Error al obtener departamentos');
          const json = await res.json();
          setDepartamentos(json.data || []);
        } catch (error) {
          console.error('❌ Error cargando departamentos:', error);
          setDepartamentos([]);
        }
      };
      fetchDepartamentos();
    }
  }, [mostrar]);

  if (!mostrar) return null;

  // 🔹 estilos condicionales
  const modalBg = modoOscuro ? 'bg-[#1a0526] text-white' : 'bg-white text-gray-900';
  const inputBg = modoOscuro
    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
    : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500';
  const footerBg = modoOscuro ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200';
  const cancelBtn = modoOscuro
    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
    : 'border-gray-300 text-gray-700 hover:bg-gray-100';
  const labelColor = modoOscuro ? 'text-gray-300' : 'text-gray-700';

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div
        className={`${modalBg} rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all duration-300 scale-95 hover:scale-100`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#39A900] to-[#2d8500] p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full">
              <FaCity className="text-white text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              {editandoId ? 'Editar Ciudad' : 'Crear Nueva Ciudad'}
            </h2>
          </div>
          <button
            className="text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-white/10"
            onClick={onClose}
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          {/* Ciudad */}
          <div className="space-y-2">
            <label
              htmlFor="nombreCiudad"
              className={`block text-sm font-medium ${labelColor}`}
            >
              Ciudad
            </label>
            <div className="relative">
              <FaMapMarkerAlt
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]"
                size={18}
              />
              <input
                type="text"
                id="nombreCiudad"
                className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md ${inputBg}`}
                placeholder="Ingrese una ciudad"
                value={nombreCiudad}
                onChange={(e) => setNombreCiudad(e.target.value)}
              />
            </div>
          </div>

          {/* Departamento */}
          <div className="space-y-2">
            <label
              htmlFor="nombreDepartamento"
              className={`block text-sm font-medium ${labelColor}`}
            >
              Departamento
            </label>
            <div className="relative">
              <FaMapMarked
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]"
                size={18}
              />
              <select
                id="nombreDepartamento"
                className={`w-full border rounded-xl pl-10 pr-8 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md appearance-none ${inputBg}`}
                value={nombreDepartamento}
                onChange={(e) => setNombreDepartamento(e.target.value)}
              >
                <option value="">Seleccione un departamento</option>
                {departamentos.map((dep) => (
                  <option key={dep.id} value={dep.id}>
                    {dep.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`${footerBg} px-8 py-6 flex justify-between items-center border-t`}>
          <button
            className={`flex items-center gap-2 px-6 py-3 border rounded-xl transition-colors hover:shadow-md ${cancelBtn}`}
            onClick={onClose}
          >
            <FaTimes size={18} />
            <span>Cancelar</span>
          </button>
          <button
            className="flex items-center gap-2 px-6 py-3 bg-[#39A900] text-white rounded-xl hover:bg-[#2d8500] transition-colors shadow-md hover:shadow-lg transform hover:scale-105 duration-200"
            onClick={onSave}
          >
            <FaSave size={18} />
            <span>{editandoId ? 'Actualizar' : 'Guardar Ciudad'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
