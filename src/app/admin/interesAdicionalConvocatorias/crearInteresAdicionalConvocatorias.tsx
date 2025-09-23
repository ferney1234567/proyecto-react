"use client";

import { useState, useEffect } from "react";
import { FaTimes, FaSave, FaPhone, FaTag, FaChevronDown } from "react-icons/fa";

interface Props {
  onClose: () => void;
  onSave: (nuevo: any) => void;
  modoOscuro: boolean;
}

export default function ModalCrearCallAdditionalInterest({
  onClose,
  onSave,
  modoOscuro,
}: Props) {
  const [callId, setCallId] = useState("");
  const [interestId, setInterestId] = useState("");
  const [calls, setCalls] = useState<any[]>([]);
  const [interests, setInterests] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resCalls = await fetch("http://localhost:4000/api/v1/calls");
        const resInterests = await fetch("http://localhost:4000/api/v1/interests");
        const callsData = await resCalls.json();
        const interestsData = await resInterests.json();
        setCalls(callsData.data || []);
        setInterests(interestsData.data || []);
      } catch (error) {
        console.error("❌ Error cargando catálogos:", error);
      }
    };
    fetchData();
  }, []);

  const handleSave = () => {
    if (!callId || !interestId) return;
    onSave({ callId: Number(callId), interestId: Number(interestId) });
  };

  // 🎨 estilos
  const modalBg = modoOscuro ? "bg-[#1a0526] text-white" : "bg-white text-gray-900";
  const inputBg = modoOscuro
    ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
    : "bg-white border-gray-300 text-gray-800 placeholder-gray-500";
  const footerBg = modoOscuro ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200";
  const cancelBtn = modoOscuro
    ? "border-gray-600 text-gray-300 hover:bg-gray-700"
    : "border-gray-300 text-gray-700 hover:bg-gray-100";

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className={`${modalBg} rounded-2xl shadow-2xl w-full max-w-2xl`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-[#39A900] to-[#2d8500] p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FaPhone /> Crear Interés Adicional en Convocatoria
          </h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <FaTimes size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          {/* Call */}
          {/* Call */}
<div className="space-y-2">
  <label className="block text-sm font-medium">Convocatoria *</label>
  <div className="relative">
    <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" />
    <select
      value={callId}
      onChange={(e) => setCallId(e.target.value)}
      className={`w-full border rounded-xl pl-10 pr-10 py-3 appearance-none ${inputBg}`}
    >
      <option value="">Seleccione una convocatoria</option>
      {calls.map((c) => (
        <option key={c.id} value={c.id}>
          {c.title} {/* 🔹 aquí va el título de la convocatoria */}
        </option>
      ))}
    </select>
    <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
  </div>
</div>

          {/* Interest */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Interés *</label>
            <div className="relative">
              <FaTag className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" />
              <select
                value={interestId}
                onChange={(e) => setInterestId(e.target.value)}
                className={`w-full border rounded-xl pl-10 pr-10 py-3 appearance-none ${inputBg}`}
              >
                <option value="">Seleccione un interés</option>
                {interests.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name} – {i.description}
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
            className="flex items-center gap-2 px-6 py-3 bg-[#39A900] text-white rounded-xl hover:bg-[#2d8500]"
          >
            <FaSave /> Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
