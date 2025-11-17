"use client";

import React, { useState, useEffect } from "react";
import { FiHeart, FiX, FiTrendingUp, FiCalendar } from "react-icons/fi";
import { getFavoritos } from "../../app/api/favoritos/routes";

export default function ModalFavoritosStats({
  isOpen,
  onClose,
  modoOscuro = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  modoOscuro: boolean;
}) {
  const [animado, setAnimado] = useState(false);
  const [favoritosPorMes, setFavoritosPorMes] = useState<any[]>([]);

  const MESES = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
  ];

  // CARGAR DATOS REALES
  const cargarEstadisticas = async () => {
    try {
      const response = await getFavoritos();
      const favoritos = Array.isArray(response?.data) ? response.data : [];

      const conteoMensual = Array(12).fill(0);

      favoritos.forEach((fav: any) => {
        const fecha = fav?.favoritedAt || fav?.createdAt;
        if (!fecha) return;
        const mes = new Date(fecha).getMonth();
        conteoMensual[mes] += 1;
      });

      const totalFavoritos = conteoMensual.reduce((sum, c) => sum + c, 0);

      // MISMA LÓGICA DE COLORES DEL MODAL DE USUARIOS
      const datos = MESES.map((mes, i) => {
        const favoritosMes = conteoMensual[i];
        const porcentaje = totalFavoritos > 0 ? (favoritosMes / totalFavoritos) * 100 : 0;

        let colorClase = "";
        if (porcentaje === 0) colorClase = "from-gray-300 to-gray-400";
        else if (porcentaje <= 5) colorClase = "from-green-200 to-green-300";
        else if (porcentaje <= 10) colorClase = "from-green-300 to-green-400";
        else if (porcentaje <= 15) colorClase = "from-green-400 to-green-500";
        else if (porcentaje <= 20) colorClase = "from-green-500 to-green-600";
        else colorClase = "from-green-600 to-green-700";

        return { mes, favoritos: favoritosMes, porcentaje, color: colorClase };
      });

      setFavoritosPorMes(datos);
    } catch (error) {
      console.error("Error cargando favoritos:", error);
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

  if (!isOpen) return null;

  const totalFavoritos = favoritosPorMes.reduce((s, d) => s + d.favoritos, 0);
  const promedioMensual = Math.round(totalFavoritos / 12);
  const maxFavoritos = Math.max(...favoritosPorMes.map((d) => d.favoritos), 1);

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

        <div
          className="overflow-y-auto pr-2 -mr-2 [&::-webkit-scrollbar]:hidden"
          style={{ maxHeight: "calc(95vh - 4rem)", scrollbarWidth: "none" }}
        >

          {/* HEADER */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold mb-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
                Favoritos por Mes
              </span>
            </h1>
            <p className={`text-lg ${modoOscuro ? "text-gray-300" : "text-gray-600"}`}>
              Estadísticas reales mensuales
            </p>
          </div>

          {/* TARJETAS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

            {/* Total */}
            <div className={`group p-6 rounded-2xl border shadow-md flex flex-col items-center text-center gap-3 transition-all hover:-translate-y-1 hover:scale-105 hover:shadow-xl ${
              modoOscuro ? "bg-white/10 border-white/20" : "bg-white border-gray-200"
            }`}>
              <div className="p-4 rounded-xl bg-green-500/10 text-green-500 mb-1">
                <FiHeart className="text-3xl" />
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-100">
                Total favoritos
              </span>
              <p className="text-4xl font-black">{totalFavoritos}</p>
            </div>

            {/* Promedio */}
            <div className={`group p-6 rounded-2xl border shadow-md flex flex-col items-center text-center gap-3 transition-all hover:-translate-y-1 hover:scale-105 hover:shadow-xl ${
              modoOscuro ? "bg-white/10 border-white/20" : "bg-white border-gray-200"
            }`}>
              <div className="p-4 rounded-xl bg-blue-500/10 text-blue-500 mb-1">
                <FiTrendingUp className="text-3xl" />
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                Promedio mensual
              </span>
              <p className="text-4xl font-black">{promedioMensual}</p>
            </div>

            {/* Mejor mes */}
            <div className={`group p-6 rounded-2xl border shadow-md flex flex-col items-center text-center gap-3 transition-all hover:-translate-y-1 hover:scale-105 hover:shadow-xl ${
              modoOscuro ? "bg-white/10 border-white/20" : "bg-white border-gray-200"
            }`}>
              <div className="p-4 rounded-xl bg-purple-500/10 text-purple-500 mb-1">
                <FiCalendar className="text-3xl" />
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300">
                Mejor mes
              </span>
              <p className="text-4xl font-black">{maxFavoritos}</p>
            </div>

          </div>

          {/* GRÁFICO */}
          <div className={`p-8 rounded-3xl border shadow-lg transition-all hover:-translate-y-1 hover:shadow-2xl ${
            modoOscuro ? "bg-white/10 border-white/20" : "bg-white border-gray-200"
          }`}>
            <h2 className="text-2xl font-bold mb-6 text-center">
              Favoritos Mensuales - Porcentaje
            </h2>

            <div className="w-full h-[350px] flex items-end justify-between gap-4 px-4">
              {favoritosPorMes.map((d, i) => (
                <div key={i} className="flex flex-col items-center flex-1">
                  
                  {/* Porcentaje */}
                  <span className="text-sm font-semibold mb-2 opacity-80">
                    {d.porcentaje.toFixed(1)}%
                  </span>

                  {/* Barra */}
                  <div
                    className={`relative w-full max-w-[45px] rounded-t-xl overflow-hidden shadow-lg transition-all duration-700 ${
                      animado ? "opacity-100" : "opacity-0"
                    }`}
                    style={{
                      height: animado ? `${d.porcentaje * 2.8}px` : "0px",
                      transitionDelay: `${i * 120}ms`,
                    }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-t ${d.color}`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent"></div>
                  </div>

                  {/* Mes */}
                  <span className="mt-3 text-sm font-semibold">
                    {d.mes.substring(0, 3)}
                  </span>

                  {/* Valor */}
                  <span className="text-xs opacity-70">
                    {d.favoritos} favoritos
                  </span>
                </div>
              ))}
            </div>

            {/* LEYENDA */}
            <div className={`mt-8 pt-6 border-t ${modoOscuro ? "border-white/10" : "border-gray-200"}`}>
              <div className="flex flex-wrap gap-4 justify-center">
                {[
                  ["from-green-200 to-green-300", "0-5%"],
                  ["from-green-300 to-green-400", "5-10%"],
                  ["from-green-400 to-green-500", "10-15%"],
                  ["from-green-500 to-green-600", "15-20%"],
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
