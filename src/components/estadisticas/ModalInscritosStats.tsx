"use client";

import React, { useState, useEffect } from "react";
import {
  FiUserCheck,
  FiX,
  FiTrendingUp,
  FiCalendar,
  FiUsers,
} from "react-icons/fi";

import { getConvocatorias } from "../../app/api/convocatorias/routes";

export default function ModalInscritosStats({
  isOpen,
  onClose,
  modoOscuro = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  modoOscuro: boolean;
}) {
  const [animado, setAnimado] = useState(false);
  const [inscritosPorMes, setInscritosPorMes] = useState<any[]>([]);

  const MESES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
  ];

  // COLORES EXACTOS IGUAL AL MODAL DE USUARIOS
  const rangoColor = (porcentaje: number) => {
    if (porcentaje === 0) return "from-gray-300 to-gray-400";
    if (porcentaje <= 5) return "from-green-200 to-green-300";
    if (porcentaje <= 10) return "from-green-300 to-green-400";
    if (porcentaje <= 15) return "from-green-400 to-green-500";
    if (porcentaje <= 20) return "from-green-500 to-green-600";
    return "from-green-600 to-green-700";
  };

  const cargarEstadisticas = async () => {
    try {
      const convocatorias = await getConvocatorias();
      const data = Array.isArray(convocatorias) ? convocatorias : [];

      const conteoMensual = Array(12).fill(0);

      data.forEach((c: any) => {
        const fecha = c.createdAt;
        if (!fecha) return;
        const mes = new Date(fecha).getMonth();
        conteoMensual[mes] += 1;
      });

      const total = conteoMensual.reduce((a, b) => a + b, 0);

      const datos = MESES.map((mes, i) => {
        const inscritos = conteoMensual[i];
        const porcentaje = total > 0 ? (inscritos / total) * 100 : 0;

        return {
          mes,
          inscritos,
          porcentaje,
          color: rangoColor(porcentaje),
        };
      });

      setInscritosPorMes(datos);
    } catch (error) {
      console.error("Error cargando inscritos:", error);
    }
  };

  useEffect(() => {
    if (!isOpen) return setAnimado(false);
    cargarEstadisticas();
    setTimeout(() => setAnimado(true), 200);
  }, [isOpen]);

  const totalInscritos = inscritosPorMes.reduce((sum, d) => sum + d.inscritos, 0);
  const promedioMensual = Math.round(totalInscritos / 12);
  const maxInscritos = Math.max(...inscritosPorMes.map((d) => d.inscritos), 1);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-7xl rounded-3xl p-10 relative shadow-2xl border transition-all duration-300 ${
          modoOscuro
            ? "bg-[#1a0526] border-white/10 text-white"
            : "bg-white border-gray-200 text-gray-900"
        }`}
        style={{ maxHeight: "95vh" }}
      >
        {/* CERRAR */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full text-xl transition-all ${
            modoOscuro
              ? "bg-white/10 text-white hover:bg-white/20"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <FiX />
        </button>

        {/* CONTENIDO */}
        <div
          className="overflow-y-auto pr-2 -mr-2 [&::-webkit-scrollbar]:hidden"
          style={{ maxHeight: "calc(95vh - 4rem)" }}
        >
          {/* HEADER */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold mb-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-blue-600">
                Inscritos por Mes
              </span>
            </h1>
            <p className={modoOscuro ? "text-gray-300" : "text-gray-600"}>
              Usuarios inscritos en convocatorias
            </p>
          </div>

          {/* CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

            {/* TOTAL */}
            <div
              className={`group p-6 rounded-2xl border shadow-md flex flex-col items-center text-center 
              transform transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-xl
              ${modoOscuro ? "bg-white/10 border-white/20" : "bg-white border-gray-200"}`}
            >
              <div className="p-4 rounded-xl bg-green-500/10 text-green-500">
                <FiUsers className="text-3xl" />
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100">
                Total inscritos
              </span>
              <p className="text-4xl font-black">{totalInscritos}</p>
              <p className="text-sm opacity-70">Inscritos acumulados</p>
            </div>

            {/* PROMEDIO */}
            <div
              className={`group p-6 rounded-2xl border shadow-md flex flex-col items-center text-center 
              transform transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-xl
              ${modoOscuro ? "bg-white/10 border-white/20" : "bg-white border-gray-200"}`}
            >
              <div className="p-4 rounded-xl bg-blue-500/10 text-blue-500">
                <FiTrendingUp className="text-3xl" />
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700">
                Promedio mensual
              </span>
              <p className="text-4xl font-black">{promedioMensual}</p>
              <p className="text-sm opacity-70">Promedio por mes</p>
            </div>

            {/* MEJOR MES */}
            <div
              className={`group p-6 rounded-2xl border shadow-md flex flex-col items-center text-center 
              transform transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-xl
              ${modoOscuro ? "bg-white/10 border-white/20" : "bg-white border-gray-200"}`}
            >
              <div className="p-4 rounded-xl bg-purple-500/10 text-purple-500">
                <FiCalendar className="text-3xl" />
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-50 text-purple-700">
                Mejor mes
              </span>
              <p className="text-4xl font-black">{maxInscritos}</p>
              <p className="text-sm opacity-70">Mes con más inscritos</p>
            </div>
          </div>

          {/* GRAFICO CON DISEÑO IGUAL A LOS OTROS */}
          <div
            className={`p-10 rounded-3xl border shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl
            ${modoOscuro ? "bg-white/10 border-white/20" : "bg-white border-gray-200"}`}
          >
            <h2 className="text-2xl font-bold mb-10 text-center">
              Inscritos por mes ({totalInscritos} total)
            </h2>

            {/* ------ BARRAS ------ */}
            <div className="w-full h-[350px] flex items-end justify-between gap-4 px-4">
              {inscritosPorMes.map((d, i) => (
                <div key={i} className="flex flex-col items-center flex-1">

                  {/* Porcentaje arriba */}
                  <span className="text-sm font-semibold mb-2 opacity-80">
                    {d.porcentaje.toFixed(1)}%
                  </span>

                  {/* Barra */}
                  <div
                    className={`relative w-full max-w-[45px] rounded-t-xl overflow-hidden shadow-lg transition-all duration-700
                    ${animado ? "opacity-100" : "opacity-0"}`}
                    style={{
                      height: animado ? `${d.porcentaje * 2.8}px` : "0px",
                      transitionDelay: `${i * 120}ms`,
                    }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-t ${d.color}`} />

                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent"></div>
                  </div>

                  <span className="mt-3 text-sm font-semibold">{d.mes.slice(0, 3)}</span>
                  <span className="text-xs opacity-70">{d.inscritos} inscritos</span>
                </div>
              ))}
            </div>

            {/* LEYENDA */}
            <div className={`mt-8 pt-6 border-t ${modoOscuro ? "border-white/10" : "border-gray-200"}`}>
              <div className="flex flex-wrap gap-4 justify-center">
                {[
                  ["from-green-200 to-green-300", "0–5%"],
                  ["from-green-300 to-green-400", "5–10%"],
                  ["from-green-400 to-green-500", "10–15%"],
                  ["from-green-500 to-green-600", "15–20%"],
                  ["from-green-600 to-green-700", "+20%"],
                ].map(([color, label], i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`w-4 h-4 bg-gradient-to-r ${color} rounded`} />
                    <span className="text-sm opacity-70">{label}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
