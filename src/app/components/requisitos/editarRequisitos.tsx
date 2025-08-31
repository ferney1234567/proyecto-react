"use client";

import { useState, useEffect } from "react";
import { FaSave, FaTimes, FaClipboardList, FaStickyNote, FaBuilding, FaTag, FaChevronDown } from "react-icons/fa";

interface ModalEditarRequisitoProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  requisito: {
    id: string;
    nombre: string;
    observacion: string;
    entidad: string;
    tipo: string;
  };
  setRequisito: (req: any) => void;
  modoOscuro: boolean;
}

export default function ModalEditarRequisito({
  visible,
  onClose,
  onSave,
  requisito,
  setRequisito,
  modoOscuro,
}: ModalEditarRequisitoProps) {
  const [animar, setAnimar] = useState(false);
  const [visibleInterno, setVisibleInterno] = useState(false);

  // Opciones predefinidas para los selects
  const opcionesEntidad = [
    { valor: "", texto: "Seleccione una entidad" },
    { valor: "ministerio_educacion", texto: "Ministerio de Educación" },
    { valor: "ministerio_salud", texto: "Ministerio de Salud" },
    { valor: "registro_civil", texto: "Registro Civil" },
    { valor: "policia_nacional", texto: "Policía Nacional" },
    { valor: "alcaldia", texto: "Alcaldía" },
    { valor: "secretaria_hacienda", texto: "Secretaría de Hacienda" },
    { valor: "otra", texto: "Otra entidad" },
  ];

  const opcionesTipo = [
    { valor: "", texto: "Seleccione un tipo" },
    { valor: "documento_identidad", texto: "Documento de Identidad" },
    { valor: "certificado_academico", texto: "Certificado Académico" },
    { valor: "certificado_medico", texto: "Certificado Médico" },
    { valor: "comprobante_pago", texto: "Comprobante de Pago" },
    { valor: "formulario", texto: "Formulario" },
    { valor: "fotografia", texto: "Fotografía" },
    { valor: "carta_presentacion", texto: "Carta de Presentación" },
    { valor: "otro", texto: "Otro tipo" },
  ];

  useEffect(() => {
    if (visible) {
      setVisibleInterno(true);
      setTimeout(() => setAnimar(true), 10);
    } else {
      setAnimar(false);
      setTimeout(() => setVisibleInterno(false), 300);
    }
  }, [visible]);

  if (!visibleInterno) return null;

  // 🔹 estilos dinámicos
  const modalBg = modoOscuro ? 'bg-[#1a0526] text-white' : 'bg-white text-gray-900';
  const inputBg = modoOscuro
    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
    : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500';
  const footerBg = modoOscuro ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200';
  const cancelBtn = modoOscuro
    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
    : 'border-gray-300 text-gray-700 hover:bg-gray-100';
  const labelColor = modoOscuro ? 'text-gray-300' : 'text-gray-700';
  const selectBg = modoOscuro 
    ? 'bg-gray-800 text-white' 
    : 'bg-white text-gray-800';

  return (
    <div
      className={`fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-300 ${
        animar ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`${modalBg} rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all duration-300 ${
          animar ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Header con gradiente e icono */}
        <div className="bg-gradient-to-r from-[#39A900] to-[#2d8500] p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full">
              <FaClipboardList className="text-white text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-white">Editar Requisito</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-white/10"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Formulario */}
        <div className="p-8 space-y-6">
          {/* Campo Nombre */}
          <div className="space-y-2">
            <label className={`block text-sm font-medium ${labelColor}`}>
              Nombre del requisito
            </label>
            <div className="relative">
              <FaClipboardList
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]"
                size={18}
              />
              <input
                type="text"
                placeholder="Nombre del requisito"
                value={requisito.nombre}
                onChange={(e) => setRequisito({ ...requisito, nombre: e.target.value })}
                className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md ${inputBg}`}
              />
            </div>
          </div>

          {/* Campo Observación */}
          <div className="space-y-2">
            <label className={`block text-sm font-medium ${labelColor}`}>
              Observación
            </label>
            <div className="relative">
              <FaStickyNote
                className="absolute left-3 top-4 text-[#39A900]"
                size={18}
              />
              <textarea
                placeholder="Observación"
                value={requisito.observacion}
                onChange={(e) => setRequisito({ ...requisito, observacion: e.target.value })}
                className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] transition-all resize-none hover:shadow-md ${inputBg}`}
                rows={3}
              />
            </div>
          </div>

          {/* Campo Entidad */}
          <div className="space-y-2">
            <label className={`block text-sm font-medium ${labelColor}`}>
              Entidad
            </label>
            <div className="relative">
              <FaBuilding
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900] z-10"
                size={18}
              />
              <div className="relative">
                <select
                  value={requisito.entidad}
                  onChange={(e) => setRequisito({ ...requisito, entidad: e.target.value })}
                  className={`w-full border rounded-xl pl-10 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all appearance-none hover:shadow-md ${inputBg}`}
                >
                  {opcionesEntidad.map((opcion) => (
                    <option key={opcion.valor} value={opcion.valor}>
                      {opcion.texto}
                    </option>
                  ))}
                </select>
                <FaChevronDown 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" 
                  size={14}
                />
              </div>
            </div>
          </div>

          {/* Campo Tipo */}
          <div className="space-y-2">
            <label className={`block text-sm font-medium ${labelColor}`}>
              Tipo
            </label>
            <div className="relative">
              <FaTag
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900] z-10"
                size={18}
              />
              <div className="relative">
                <select
                  value={requisito.tipo}
                  onChange={(e) => setRequisito({ ...requisito, tipo: e.target.value })}
                  className={`w-full border rounded-xl pl-10 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all appearance-none hover:shadow-md ${inputBg}`}
                >
                  {opcionesTipo.map((opcion) => (
                    <option key={opcion.valor} value={opcion.valor}>
                      {opcion.texto}
                    </option>
                  ))}
                </select>
                <FaChevronDown 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" 
                  size={14}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer estilizado */}
        <div className={`${footerBg} px-8 py-6 flex justify-between items-center border-t`}>
          <button
            onClick={onClose}
            className={`flex items-center gap-2 px-6 py-3 border rounded-xl transition-colors hover:shadow-md ${cancelBtn}`}
          >
            <FaTimes size={18} />
            <span>Cancelar</span>
          </button>
          <button
            onClick={onSave}
            className="flex items-center gap-2 px-6 py-3 bg-[#39A900] text-white rounded-xl hover:bg-[#2d8500] transition-colors shadow-md hover:shadow-lg transform hover:scale-105 duration-200"
          >
            <FaSave size={18} />
            <span>Guardar Cambios</span>
          </button>
        </div>
      </div>
    </div>
  );
}