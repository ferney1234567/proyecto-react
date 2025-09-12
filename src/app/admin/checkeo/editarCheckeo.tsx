'use client';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { FaTimes, FaBuilding, FaClipboardCheck, FaCheckCircle, FaTimesCircle, FaSave } from 'react-icons/fa';

interface ModalEditarChequeoProps {
  abierto: boolean;
  editando: boolean;
  chequeo: {
    chequeo: number; // 0 = no aprobado, 1 = aprobado
    empresa: string;
    requisito: string;
  };
  onCerrar: () => void;
  onGuardar: () => void;
  onChange: (field: string, value: string | number) => void;
  modoOscuro: boolean;
}

export default function ModalEditarChequeo({
  abierto,
  editando,
  chequeo,
  onCerrar,
  onGuardar,
  onChange,
  modoOscuro
}: ModalEditarChequeoProps) {
  const [errors, setErrors] = useState({ empresa: '', requisito: '' });
  const [animacion, setAnimacion] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (abierto) {
      setVisible(true);
      setTimeout(() => setAnimacion(true), 10);
      setErrors({ empresa: '', requisito: '' });
    } else {
      setAnimacion(false);
      setTimeout(() => setVisible(false), 300);
    }
  }, [abierto]);

  if (!visible) return null;

  const validarCampos = () => {
    const nuevosErrores = {
      empresa: chequeo.empresa.trim() === '' ? 'La empresa es obligatoria' : '',
      requisito: chequeo.requisito.trim() === '' ? 'El requisito es obligatorio' : ''
    };
    setErrors(nuevosErrores);
    return nuevosErrores.empresa === '' && nuevosErrores.requisito === '';
  };

  const handleGuardar = () => {
    if (validarCampos()) {
      onGuardar();
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, complete todos los campos obligatorios.',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#39A900',
        background: modoOscuro ? '#1a0526' : '#fff',
        color: modoOscuro ? '#fff' : '#333',
      });
    }
  };

  // Estilos dinámicos
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
    <div
      className={`fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-300 ${
        animacion ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`${modalBg} rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all duration-300 ${
          animacion ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-[#39A900] to-[#2d8500] p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">
            {editando ? 'Editar Chequeo' : 'Nuevo Chequeo'}
          </h2>
          <button
            onClick={onCerrar}
            className="p-1 rounded-full hover:bg-white/10 transition-colors text-white"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Formulario */}
        <div className="p-8 space-y-6">
          {/* Empresa */}
          <div className="space-y-2">
            <label className={`block text-sm font-medium ${labelColor}`}>Empresa *</label>
            <div className="relative">
              <FaBuilding
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]"
                size={18}
              />
              <input
                type="text"
                value={chequeo.empresa}
                onChange={(e) => onChange('empresa', e.target.value)}
                className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md ${inputBg}`}
                placeholder="Nombre de la empresa"
              />
            </div>
            {errors.empresa && <p className="text-red-500 text-sm">{errors.empresa}</p>}
          </div>

          {/* Requisito */}
          <div className="space-y-2">
            <label className={`block text-sm font-medium ${labelColor}`}>Requisito *</label>
            <div className="relative">
              <FaClipboardCheck
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]"
                size={18}
              />
              <input
                type="text"
                value={chequeo.requisito}
                onChange={(e) => onChange('requisito', e.target.value)}
                className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md ${inputBg}`}
                placeholder="Descripción del requisito"
              />
            </div>
            {errors.requisito && <p className="text-red-500 text-sm">{errors.requisito}</p>}
          </div>

          {/* Estado como botones */}
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
            <FaTimes size={18} />
            <span>Cancelar</span>
          </button>
          <button
            onClick={handleGuardar}
            className="flex items-center gap-2 px-6 py-3 bg-[#39A900] text-white rounded-xl hover:bg-[#2d8500] transition-colors shadow-md hover:shadow-lg transform hover:scale-105 duration-200"
          >
            <FaSave size={18} />
            <span>{editando ? 'Actualizar' : 'Agregar'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
