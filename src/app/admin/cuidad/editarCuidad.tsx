'use client';

import { useEffect, useState } from 'react';
import { X, Save, Building2 } from 'lucide-react';

interface EditarModalProps {
  mostrar: boolean;
  onClose: () => void;
  onSave: (data: { nombreCiudad: string; departamentoId: string }) => void;
  editandoId: string | null;
  nombreCiudad: string;
  setNombreCiudad: (value: string) => void;
  departamentoId: string; // ✅ nombre coherente con el resto del sistema
  setDepartamentoId: (value: string) => void; // ✅ coherente
  modoOscuro: boolean;
}

interface Departamento {
  id: number;
  name: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;


export default function EditarModal({
  mostrar,
  onClose,
  onSave,
  editandoId,
  nombreCiudad,
  setNombreCiudad,
  departamentoId,
  setDepartamentoId,
  modoOscuro,
}: EditarModalProps) {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);

  // 🔹 Cargar departamentos desde la API
  useEffect(() => {
    if (mostrar) {
      const fetchDepartamentos = async () => {
        try {
          const res = await fetch(`${API_URL}/departments`);
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

  // 🔹 Manejar guardado
  const handleGuardar = () => {
    if (!nombreCiudad.trim() || !departamentoId) {
      alert('Por favor, complete todos los campos antes de guardar.');
      return;
    }
    onSave({ nombreCiudad, departamentoId });
  };

  // 🔹 Estilos dinámicos
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
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 size={20} />
            Editar Ciudad
          </h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Campo ciudad */}
          <div>
            <label className={`block text-sm mb-2 font-medium ${labelColor}`}>
              Ciudad
            </label>
            <input
              type="text"
              value={nombreCiudad}
              onChange={(e) => setNombreCiudad(e.target.value)}
              placeholder="Ingrese el nombre de la ciudad"
              className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] text-lg transition-all hover:shadow-md ${inputBg}`}
            />
          </div>

          {/* Campo departamento */}
          <div>
            <label className={`block text-sm mb-2 font-medium ${labelColor}`}>
              Departamento
            </label>
            <select
              value={departamentoId}
              onChange={(e) => setDepartamentoId(e.target.value)}
              className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] text-lg transition-all hover:shadow-md ${inputBg}`}
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

        {/* Footer */}
        <div className={`${footerBg} px-8 py-6 flex justify-between items-center border-t`}>
          <button
            onClick={onClose}
            className={`flex items-center gap-2 px-6 py-3 border rounded-xl transition-colors hover:shadow-md ${cancelBtn}`}
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            className="flex items-center gap-2 px-6 py-3 bg-[#39A900] text-white rounded-xl hover:bg-[#2d8500] transition-colors shadow-md hover:shadow-lg transform hover:scale-105 duration-200"
          >
            <Save size={18} />
            Actualizar
          </button>
        </div>
      </div>
    </div>
  );
}
