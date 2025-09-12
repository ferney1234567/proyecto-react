'use client';

import { useState, useEffect } from 'react';
import { Check, X, ChevronDown, Save } from 'lucide-react';
import { FaBuilding, FaClipboardCheck, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

interface ModalChequeoProps {
  abierto: boolean;
  editando: boolean;
  chequeo: {
    chequeo: number; // 0 = no aprobado, 1 = aprobado
    empresa: string;
    requisito: string;
  };
  empresas?: string[];
  requisitos?: string[];
  onCerrar: () => void;
  onGuardar: () => void;
  onChange: (field: string, value: string | number) => void;
  modoOscuro: boolean;
}

export default function ModalChequeo({
  abierto,
  editando,
  chequeo,
  empresas = [
    "TecnoSoluciones SAS",
    "Innovación Digital Ltda",
    "GlobalTech Colombia",
    "Servicios Integrales Tech",
    "Desarrollo Web Express"
  ],
  requisitos = [
    "Documento de identidad",
    "Certificado académico",
    "Hoja de vida actualizada",
    "Referencias laborales",
    "Portafolio de proyectos",
    "Certificación de ingresos",
    "Antecedentes judiciales",
    "Examen médico ocupacional"
  ],
  onCerrar,
  onGuardar,
  onChange,
  modoOscuro
}: ModalChequeoProps) {
  const [mostrarEmpresas, setMostrarEmpresas] = useState(false);
  const [mostrarRequisitos, setMostrarRequisitos] = useState(false);
  const [animacion, setAnimacion] = useState(false);
  const [visible, setVisible] = useState(false);

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

  // estilos condicionales
  const modalBg = modoOscuro ? 'bg-[#1a0526] text-white' : 'bg-white text-gray-900';
  const inputBg = modoOscuro
    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
    : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500';
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
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full">
              <FaCheckCircle className="text-white text-xl" />
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
          {/* Empresa */}
          <div className="space-y-2 relative">
            <label className={`block text-sm font-medium ${labelColor}`}>Empresa *</label>
            <div
              className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md flex justify-between items-center cursor-pointer ${inputBg}`}
              onClick={() => setMostrarEmpresas(!mostrarEmpresas)}
            >
              <span>{chequeo.empresa || 'Seleccione una empresa'}</span>
              <ChevronDown
                size={20}
                className={`transition-transform ${mostrarEmpresas ? 'rotate-180' : ''}`}
              />
            </div>

            {/* icono izquierdo */}
            <FaBuilding className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" size={18} />

            {mostrarEmpresas && (
              <div className={`absolute z-10 mt-1 w-full rounded-xl shadow-lg max-h-60 overflow-auto ${dropdownBg}`}>
                {empresas.map((empresa, index) => (
                  <div
                    key={index}
                    className={`px-4 py-3 cursor-pointer ${optionHover} ${
                      chequeo.empresa === empresa ? 'bg-[#39A900]/10 text-[#39A900]' : ''
                    }`}
                    onClick={() => {
                      onChange('empresa', empresa);
                      setMostrarEmpresas(false);
                    }}
                  >
                    {empresa}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Requisito */}
          <div className="space-y-2 relative">
            <label className={`block text-sm font-medium ${labelColor}`}>Requisito *</label>
            <div
              className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md flex justify-between items-center cursor-pointer ${inputBg}`}
              onClick={() => setMostrarRequisitos(!mostrarRequisitos)}
            >
              <span>{chequeo.requisito || 'Seleccione un requisito'}</span>
              <ChevronDown
                size={20}
                className={`transition-transform ${mostrarRequisitos ? 'rotate-180' : ''}`}
              />
            </div>

            {/* icono izquierdo */}
            <FaClipboardCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" size={18} />

            {mostrarRequisitos && (
              <div className={`absolute z-10 mt-1 w-full rounded-xl shadow-lg max-h-60 overflow-auto ${dropdownBg}`}>
                {requisitos.map((requisito, index) => (
                  <div
                    key={index}
                    className={`px-4 py-3 cursor-pointer ${optionHover} ${
                      chequeo.requisito === requisito ? 'bg-[#39A900]/10 text-[#39A900]' : ''
                    }`}
                    onClick={() => {
                      onChange('requisito', requisito);
                      setMostrarRequisitos(false);
                    }}
                  >
                    {requisito}
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
                onClick={() => onChange('chequeo', 1)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all border text-lg font-medium ${
                  chequeo.chequeo === 1
                    ? 'bg-[#39A900] text-white border-[#39A900] shadow-md scale-105'
                    : `${inputBg} hover:shadow-md`
                }`}
              >
                <FaCheckCircle />
                Aprobado
              </button>
              <button
                type="button"
                onClick={() => onChange('chequeo', 0)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all border text-lg font-medium ${
                  chequeo.chequeo === 0
                    ? 'bg-red-600 text-white border-red-600 shadow-md scale-105'
                    : `${inputBg} hover:shadow-md`
                }`}
              >
                <FaTimesCircle />
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
            <X size={18} />
            <span>Cancelar</span>
          </button>
          <button
            onClick={onGuardar}
            className="flex items-center gap-2 px-6 py-3 bg-[#39A900] text-white rounded-xl hover:bg-[#2d8500] transition-colors shadow-md hover:shadow-lg transform hover:scale-105 duration-200"
          >
            <Save size={18} />
            <span>{editando ? 'Actualizar' : 'Guardar'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
