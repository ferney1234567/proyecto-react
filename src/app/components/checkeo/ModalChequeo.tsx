'use client';

import { Check, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface ModalChequeoProps {
  abierto: boolean;
  editando: boolean;
  chequeo: {
    chequeo: number;
    idEmpresa: number;
    idRequisito: number;
  };
  empresas?: Array<{ id: number; nombre: string }>;
  requisitos?: Array<{ id: number; nombre: string }>;
  onCerrar: () => void;
  onGuardar: () => void;
  onChange: (field: keyof typeof chequeo, value: number) => void;
  modoOscuro: boolean; // 🔹 agregado
}

export default function ModalChequeo({
  abierto,
  editando,
  chequeo,
  empresas = [],
  requisitos = [],
  onCerrar,
  onGuardar,
  onChange,
  modoOscuro
}: ModalChequeoProps) {
  const [mostrarEmpresas, setMostrarEmpresas] = useState(false);
  const [mostrarRequisitos, setMostrarRequisitos] = useState(false);

  if (!abierto) return null;

  const empresaSeleccionada = empresas.find(e => e.id === chequeo.idEmpresa);
  const requisitoSeleccionado = requisitos.find(r => r.id === chequeo.idRequisito);

  // 🔹 estilos condicionales
  const modalBg = modoOscuro ? 'bg-[#1a0526] text-white' : 'bg-white text-gray-900';
  const inputBg = modoOscuro
    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
    : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500';
  const dropdownBg = modoOscuro ? 'bg-gray-800 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-800';
  const optionHover = modoOscuro ? 'hover:bg-gray-700' : 'hover:bg-gray-100';
  const footerBg = modoOscuro ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200';
  const cancelBtn = modoOscuro
    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
    : 'border-gray-300 text-gray-700 hover:bg-gray-100';
  const labelColor = modoOscuro ? 'text-gray-300' : 'text-gray-700';

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className={`${modalBg} rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden transform transition-all duration-300 scale-95 hover:scale-100`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-[#39A900] to-[#2d8500] p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full">
              <Check className="text-white text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              {editando ? 'Editar Chequeo' : 'Agregar Nuevo Chequeo'}
            </h2>
          </div>
          <button
            className="text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-white/10"
            onClick={onCerrar}
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          {/* Selección de Empresa */}
          <div className="space-y-2 relative">
            <label className={`block text-sm font-medium ${labelColor}`}>Empresa</label>
            <div
              className={`w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md flex justify-between items-center cursor-pointer ${inputBg}`}
              onClick={() => setMostrarEmpresas(!mostrarEmpresas)}
            >
              <span>{empresaSeleccionada?.nombre || 'Seleccione una empresa'}</span>
              <ChevronDown size={20} className={`transition-transform ${mostrarEmpresas ? 'rotate-180' : ''}`} />
            </div>

            {mostrarEmpresas && (
              <div className={`absolute z-10 mt-1 w-full rounded-xl shadow-lg max-h-60 overflow-auto ${dropdownBg}`}>
                {empresas.map(empresa => (
                  <div
                    key={empresa.id}
                    className={`px-4 py-3 cursor-pointer ${optionHover} ${chequeo.idEmpresa === empresa.id ? 'bg-[#39A900]/10 text-[#39A900]' : ''}`}
                    onClick={() => {
                      onChange('idEmpresa', empresa.id);
                      setMostrarEmpresas(false);
                    }}
                  >
                    {empresa.nombre}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selección de Requisito */}
          <div className="space-y-2 relative">
            <label className={`block text-sm font-medium ${labelColor}`}>Requisito</label>
            <div
              className={`w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md flex justify-between items-center cursor-pointer ${inputBg}`}
              onClick={() => setMostrarRequisitos(!mostrarRequisitos)}
            >
              <span>{requisitoSeleccionado?.nombre || 'Seleccione un requisito'}</span>
              <ChevronDown size={20} className={`transition-transform ${mostrarRequisitos ? 'rotate-180' : ''}`} />
            </div>

            {mostrarRequisitos && (
              <div className={`absolute z-10 mt-1 w-full rounded-xl shadow-lg max-h-60 overflow-auto ${dropdownBg}`}>
                {requisitos.map(requisito => (
                  <div
                    key={requisito.id}
                    className={`px-4  py-3 cursor-pointer ${optionHover} ${chequeo.idRequisito === requisito.id ? 'bg-[#39A900]/10 text-[#39A900]' : ''}`}
                    onClick={() => {
                      onChange('idRequisito', requisito.id);
                      setMostrarRequisitos(false);
                    }}
                  >
                    {requisito.nombre}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Estado */}
          <div className="space-y-2">
            <label className={`block text-sm font-medium ${labelColor}`}>Estado</label>
            <div className="flex gap-4">
              <button
                type="button"
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-lg transition-colors ${chequeo.chequeo ? 'bg-[#39A900]/10 text-[#39A900]' : modoOscuro ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}
                onClick={() => onChange('chequeo', 1)}
              >
                <Check size={20} />
                Aprobado
              </button>
              <button
                type="button"
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-lg transition-colors ${!chequeo.chequeo ? 'bg-red-100 text-red-600' : modoOscuro ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}
                onClick={() => onChange('chequeo', 0)}
              >
                <X size={20} />
                Pendiente
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`${footerBg} px-8 py-6 flex justify-between items-center border-t`}>
          <button
            className={`flex items-center gap-2 px-6 py-3 border rounded-xl transition-colors hover:shadow-md ${cancelBtn}`}
            onClick={onCerrar}
          >
            <X size={18} />
            <span>Cancelar</span>
          </button>
          <button
            className="flex items-center gap-2 px-6 py-3 bg-[#39A900] text-white rounded-xl hover:bg-[#2d8500] transition-colors shadow-md hover:shadow-lg transform hover:scale-105 duration-200"
            onClick={onGuardar}
          >
            <Check size={18} />
            <span>{editando ? 'Actualizar Chequeo' : 'Guardar Chequeo'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
