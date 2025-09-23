'use client';

import { useEffect, useState } from 'react';
import { X, Save, Building2 } from 'lucide-react';

interface CiudadModalProps {
  mostrar: boolean;
  onClose: () => void;
  onSave: () => void;
  editandoId: string | null;
  nombreCiudad: string;
  setNombreCiudad: (value: string) => void;
  nombreDepartamento: string; // 👈 aquí guardamos el ID
  setNombreDepartamento: (value: string) => void;
  modoOscuro: boolean;
}

interface Departamento {
  id: number;
  name: string;
}

export default function EditarModal({
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

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className={`${modoOscuro ? 'bg-[#1a0526] text-white' : 'bg-white text-gray-900'} rounded-2xl shadow w-full max-w-2xl`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-[#39A900] to-[#2d8500] p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 size={20} />
            Editar Ciudad
          </h2>
          <button onClick={onClose} className="text-white">
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm mb-1">Ciudad</label>
            <input
              type="text"
              value={nombreCiudad}
              onChange={(e) => setNombreCiudad(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Departamento</label>
            <select
              value={nombreDepartamento} // 👈 ID
              onChange={(e) => setNombreDepartamento(e.target.value)}
              className="w-full border rounded px-3 py-2"
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
        <div className="p-6 flex justify-between border-t">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cancelar</button>
          <button onClick={onSave} className="px-4 py-2 bg-[#39A900] text-white rounded flex items-center gap-2">
            <Save size={18} />
            Actualizar
          </button>
        </div>
      </div>
    </div>
  );
}
