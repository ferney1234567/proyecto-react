'use client';

import { useState, useEffect } from 'react';
import {
  FaTimes,
  FaBuilding,
  FaClipboardCheck,
  FaCheckCircle,
  FaTimesCircle,
  FaSave,
} from 'react-icons/fa';
import { ChevronDown } from 'lucide-react';

interface Empresa {
  id: number;
  name: string;
}

interface Requisito {
  id: number;
  name: string;
}

interface ModalEditarChequeoProps {
  abierto: boolean;
  editando: boolean;
  chequeo: {
    id: number;
    is_checked: boolean; // ✅ ahora boolean
    empresa: string;
    requisito: string;
    companyId: number;
    requirementId: number;
  };
  empresas: Empresa[];
  requisitos: Requisito[];
  onCerrar: () => void;
  onGuardar: () => void;
  onChange: (field: string, value: string | number | boolean) => void;
  modoOscuro: boolean;
}

export default function ModalEditarChequeo({
  abierto,
  editando,
  chequeo,
  empresas,
  requisitos,
  onCerrar,
  onGuardar,
  onChange,
  modoOscuro,
}: ModalEditarChequeoProps) {
  const [animacion, setAnimacion] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mostrarEmpresas, setMostrarEmpresas] = useState(false);
  const [mostrarRequisitos, setMostrarRequisitos] = useState(false);

  useEffect(() => {
    if (abierto) {
      setVisible(true);
      setTimeout(() => setAnimacion(true), 10);
    } else {
      setAnimacion(false);
      setTimeout(() => setVisible(false), 300);
    }
  }, [abierto]);

  if (!visible) return null;

  // 🎨 Estilos dinámicos
  const modalBg = modoOscuro ? 'bg-[#1a0526] text-white' : 'bg-white text-gray-900';
  const inputBg = modoOscuro
    ? 'bg-gray-800 border-gray-600 text-white'
    : 'bg-white border-gray-300 text-gray-800';
  const dropdownBg = modoOscuro
    ? 'bg-gray-800 border-gray-600 text-gray-200'
    : 'bg-white border-gray-300 text-gray-800';
  const optionHover = modoOscuro ? 'hover:bg-gray-700' : 'hover:bg-gray-100';
  const footerBg = modoOscuro ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200';
  const cancelBtn = modoOscuro
    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
    : 'border-gray-300 text-gray-700 hover:bg-gray-100';
  const labelColor = modoOscuro ? 'text-gray-300' : 'text-gray-700';

  return (
    <div
      className={`fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-300 ${
        animacion ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`${modalBg} rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden transform transition-all duration-300 ${
          animacion ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#39A900] to-[#2d8500] p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FaClipboardCheck className="text-white" />
            {editando ? 'Editar Chequeo' : 'Nuevo Chequeo'}
          </h2>
          <button
            onClick={onCerrar}
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-white flex items-center justify-center"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Formulario */}
        <div className="p-8 space-y-6">
          {/* Empresa */}
          <div className="space-y-2 relative">
            <label className={`block text-sm font-medium ${labelColor}`}>Empresa *</label>
            <div
              className={`relative w-full border rounded-xl pl-10 pr-10 py-3 flex justify-between items-center cursor-pointer ${inputBg}`}
              onClick={() => setMostrarEmpresas(!mostrarEmpresas)}
            >
              <FaBuilding className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" />
              <span>{chequeo.empresa || 'Seleccione una empresa'}</span>
              <ChevronDown
                size={20}
                className={`absolute right-3 top-1/2 -translate-y-1/2 transition-transform ${
                  mostrarEmpresas ? 'rotate-180' : ''
                }`}
              />
            </div>

            {mostrarEmpresas && (
              <div
                className={`absolute z-10 mt-1 w-full rounded-xl shadow-lg max-h-60 overflow-auto ${dropdownBg}`}
              >
                {empresas.map((empresa) => (
                  <div
                    key={empresa.id}
                    className={`px-4 py-3 cursor-pointer flex items-center gap-2 ${optionHover} ${
                      chequeo.companyId === empresa.id ? 'bg-[#39A900]/10 text-[#39A900]' : ''
                    }`}
                    onClick={() => {
                      onChange('empresa', empresa.name);
                      onChange('companyId', empresa.id);
                      setMostrarEmpresas(false);
                    }}
                  >
                    <FaBuilding className="text-[#39A900]" size={16} />
                    {empresa.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Requisito */}
          <div className="space-y-2 relative">
            <label className={`block text-sm font-medium ${labelColor}`}>Requisito *</label>
            <div
              className={`relative w-full border rounded-xl pl-10 pr-10 py-3 flex justify-between items-center cursor-pointer ${inputBg}`}
              onClick={() => setMostrarRequisitos(!mostrarRequisitos)}
            >
              <FaClipboardCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" />
              <span>{chequeo.requisito || 'Seleccione un requisito'}</span>
              <ChevronDown
                size={20}
                className={`absolute right-3 top-1/2 -translate-y-1/2 transition-transform ${
                  mostrarRequisitos ? 'rotate-180' : ''
                }`}
              />
            </div>

            {mostrarRequisitos && (
              <div
                className={`absolute z-10 mt-1 w-full rounded-xl shadow-lg max-h-60 overflow-auto ${dropdownBg}`}
              >
                {requisitos.map((req) => (
                  <div
                    key={req.id}
                    className={`px-4 py-3 cursor-pointer flex items-center gap-2 ${optionHover} ${
                      chequeo.requirementId === req.id ? 'bg-[#39A900]/10 text-[#39A900]' : ''
                    }`}
                    onClick={() => {
                      onChange('requisito', req.name);
                      onChange('requirementId', req.id);
                      setMostrarRequisitos(false);
                    }}
                  >
                    <FaClipboardCheck className="text-[#39A900]" size={16} />
                    {req.name}
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
                onClick={() => onChange('is_checked', true)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-lg font-medium ${
                  chequeo.is_checked
                    ? 'bg-[#39A900] text-white border-[#39A900] shadow-md scale-105'
                    : `${inputBg}`
                }`}
              >
                <FaCheckCircle size={18} />
                Aprobado
              </button>
              <button
                type="button"
                onClick={() => onChange('is_checked', false)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-lg font-medium ${
                  !chequeo.is_checked
                    ? 'bg-red-600 text-white border-red-600 shadow-md scale-105'
                    : `${inputBg}`
                }`}
              >
                <FaTimesCircle size={18} />
                No Aprobado
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`${footerBg} px-8 py-6 flex justify-between items-center border-t`}>
          <button
            onClick={onCerrar}
            className={`flex items-center gap-2 px-6 py-3 border rounded-xl transition-colors hover:shadow-md ${cancelBtn}`}
          >
            <FaTimes size={18} />
            <span>Cancelar</span>
          </button>
          <button
            onClick={onGuardar}
            className="flex items-center gap-2 px-6 py-3 bg-[#39A900] text-white rounded-xl hover:bg-[#2d8500] transition-colors shadow-md hover:shadow-lg transform hover:scale-105 duration-200"
          >
            <FaSave size={18} />
            <span>{editando ? 'Actualizar' : 'Guardar'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
