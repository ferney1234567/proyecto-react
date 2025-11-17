"use client";

import React, { useState, useEffect } from "react";
import {
  FiBarChart2,
  FiX,
  FiTrendingUp,
  FiCalendar,
} from "react-icons/fi";

import { getConvocatorias } from "../../app/api/convocatorias/routes";

export default function ModalConvocatoriasStats({
  isOpen,
  onClose,
  modoOscuro = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  modoOscuro: boolean;
}) {
  const [animado, setAnimado] = useState(false);
  const [convocatoriasPorMes, setConvocatoriasPorMes] = useState<any[]>([]);

  const MESES = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
  ];

  // COLORES SEGÚN % IGUAL AL MODAL DE USUARIOS
  const obtenerColor = (pct: number) => {
    if (pct === 0) return "from-gray-300 to-gray-400";
    if (pct <= 5) return "from-green-200 to-green-300";
    if (pct <= 10) return "from-green-300 to-green-400";
    if (pct <= 15) return "from-green-400 to-green-500";
    if (pct <= 20) return "from-green-500 to-green-600";
    return "from-green-600 to-green-700";
  };

  // CARGAR DATOS REALES
  const cargarEstadisticas = async () => {
    try {
      const response = await getConvocatorias();
      const convocatorias = Array.isArray(response.data) ? response.data : [];

      const conteoMensual = Array(12).fill(0);

      convocatorias.forEach((c: any) => {
        const fecha = c.openDate || c.createdAt;
        if (!fecha) return;
        const mes = new Date(fecha).getMonth();
        conteoMensual[mes] += 1;
      });

      const total = conteoMensual.reduce((a, b) => a + b, 0);

      const datos = MESES.map((mes, i) => {
        const valor = conteoMensual[i];
        const porcentaje = total > 0 ? (valor / total) * 100 : 0;

        return {
          mes,
          convocatorias: valor,
          porcentaje,
          color: obtenerColor(porcentaje),
        };
      });

      setConvocatoriasPorMes(datos);

    } catch (error) {
      console.error("Error cargando estadísticas:", error);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setAnimado(false);
      return;
    }
    cargarEstadisticas();
    setTimeout(() => setAnimado(true), 200);
  }, [isOpen]);

  const totalConvocatorias = convocatoriasPorMes.reduce((sum, d) => sum + d.convocatorias, 0);
  const promedioMensual = Math.round(totalConvocatorias / 12);
  const maxConvocatorias = Math.max(...convocatoriasPorMes.map((d) => d.convocatorias), 1);

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

        {/* BOTÓN CERRAR */}
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

        {/* CONTENIDO SCROLLEABLE */}
        <div
          className="overflow-y-auto pr-2 -mr-2 [&::-webkit-scrollbar]:hidden"
          style={{ maxHeight: "calc(95vh - 4rem)", scrollbarWidth: "none" }}
        >

          {/* HEADER */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold mb-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
                Estadísticas de Convocatorias
              </span>
            </h1>
            <p className={`text-lg ${modoOscuro ? "text-gray-300" : "text-gray-600"}`}>
              Registros mensuales basados en datos reales
            </p>
          </div>

          {/* TARJETAS DE RESUMEN — IGUAL AL DISEÑO DE USUARIOS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

            {/* Total */}
            <div className={`${modoOscuro ? "bg-white/10 border-white/20" : "bg-white border-gray-200"}
              group p-6 rounded-2xl border shadow-md flex flex-col items-center text-center gap-3 
              transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-xl`}>
              <div className="p-4 rounded-xl bg-green-500/10 text-green-500 mb-1">
                <FiBarChart2 className="text-3xl" />
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 dark:bg-white/10">Total Convocatorias</span>
              <p className="text-4xl font-black">{totalConvocatorias}</p>
              <p className="text-sm opacity-70">Registradas en total</p>
            </div>

            {/* Promedio */}
            <div className={`${modoOscuro ? "bg-white/10 border-white/20" : "bg-white border-gray-200"}
              group p-6 rounded-2xl border shadow-md flex flex-col items-center text-center gap-3 
              transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-xl`}>
              <div className="p-4 rounded-xl bg-blue-500/10 text-blue-500 mb-1">
                <FiTrendingUp className="text-3xl" />
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10">Promedio Mensual</span>
              <p className="text-4xl font-black">{promedioMensual}</p>
              <p className="text-sm opacity-70">Promedio por mes</p>
            </div>

            {/* Mejor mes */}
            <div className={`${modoOscuro ? "bg-white/10 border-white/20" : "bg-white border-gray-200"}
              group p-6 rounded-2xl border shadow-md flex flex-col items-center text-center gap-3 
              transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-xl`}>
              <div className="p-4 rounded-xl bg-purple-500/10 text-purple-500 mb-1">
                <FiCalendar className="text-3xl" />
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-500/10">Mejor mes</span>
              <p className="text-4xl font-black">{maxConvocatorias}</p>
              <p className="text-sm opacity-70">Mes con más registros</p>
            </div>
          </div>

          {/* GRÁFICO VERTICAL — IGUAL AL DISEÑO DE USUARIOS */}
          <div className={`p-10 rounded-3xl border shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
            modoOscuro ? "bg-white/10 border-white/20" : "bg-white border-gray-200"
          }`}>
            <h2 className="text-2xl font-bold mb-10 text-center">
              Convocatorias por Mes ({totalConvocatorias} total)
            </h2>

            {(() => {
              const MESES_CORTOS = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

              return (
                <div className="w-full flex flex-col items-center">
                  
                  <div className="w-full flex justify-between items-end px-4 pb-6 h-[400px]">

                    {convocatoriasPorMes.map((d, i) => {
                      const altura = (d.porcentaje * 2.8); // igual que en usuarios

                      return (
                        <div key={i} className="flex flex-col items-center flex-1 relative group">

                          <span className="text-sm font-semibold mb-2 opacity-80">
                            {d.porcentaje.toFixed(1)}%
                          </span>

                          {/* Barra */}
                          <div
                            className={`relative w-full max-w-[45px] rounded-t-xl overflow-hidden shadow-lg transition-all duration-700 ${animado ? "opacity-100" : "opacity-0"}`}
                            style={{
                              height: animado ? `${altura}px` : "0px",
                              transitionDelay: `${i * 120}ms`,
                            }}
                          >
                            <div className={`absolute inset-0 bg-gradient-to-t ${d.color}`} />
                            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent"></div>

                            {d.porcentaje > 15 && (
                              <span className="absolute bottom-2 left-0 w-full text-center text-xs font-bold text-white drop-shadow-md">
                                {d.porcentaje.toFixed(0)}%
                              </span>
                            )}
                          </div>

                          <span className="mt-3 text-sm font-semibold">
                            {MESES_CORTOS[i]}
                          </span>

                          <span className="text-xs opacity-70">
                            {d.convocatorias} registros
                          </span>

                        </div>
                      );
                    })}
                  </div>

                  {/* LEYENDA */}
                  <div className={`mt-8 pt-6 border-t ${modoOscuro ? "border-white/10" : "border-gray-200"}`}>
                    <div className="flex flex-wrap gap-4 justify-center">
                      {[ 
                        ["from-green-200 to-green-300","0-5%"],
                        ["from-green-300 to-green-400","5-10%"],
                        ["from-green-400 to-green-500","10-15%"],
                        ["from-green-500 to-green-600","15-20%"],
                        ["from-green-600 to-green-700","+20%"],
                      ].map(([color,label],i)=>(
                        <div key={i} className="flex items-center gap-2">
                          <div className={`w-4 h-4 bg-gradient-to-r ${color} rounded`} />
                          <span className="text-sm opacity-70">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              );
            })()}
          </div>

        </div>
      </div>
    </div>
  );
}
