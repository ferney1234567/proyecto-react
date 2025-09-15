'use client';

import { useEffect, useState } from 'react';
import {
  FaTags, FaSearchLocation, FaRegBookmark, FaSearch, FaSignOutAlt, FaStar, FaRegStar,
  FaCheckCircle, FaCalendarAlt, FaCalendarTimes, FaMobileAlt, FaGraduationCap,
  FaClock, FaFileAlt, FaImage, FaCog, FaInfoCircle, FaUserTie, FaRegFileAlt,
  FaTrashAlt
} from 'react-icons/fa';
import { getConvocatorias } from "../../api/convocatorias/routes";
import Link from 'next/link';
import ModalConvocatoria from '../../../components/detalleConvo/detalleConvo'; // Ajusta la ruta
import { Calendar, ChevronLeft, ChevronRight, LayoutGrid, MapPin, Moon, SlidersHorizontal, Sun, View } from 'lucide-react';

const imagenesEje = [
  '/img/jove.jpg',
  '/img/maxresdefault.jpg',
  '/img/produ.jpg',
  '/img/ejeq.png',
  '/img/eco.png',
  '/img/eco2.png',
  '/img/ej.jpg',
  '/img/fabricas.jpg',
  '/img/R.jpg'
];

export default function HomePage() {
  // 👉 Estado de paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const convocatoriasPorPagina = 12;

  // 👉 Estado de convocatorias
  interface Convocatoria {
    id: number;
    title: string;
    description: string;
    resources: string;
    callLink: string;
    openDate: string;
    closeDate: string;
    pageName: string;
    pageUrl: string;
    objective: string;
    notes: string;
    institutionId: number;
    lineId: number;
    targetAudienceId: number;
    interestId: number;
    userId: number;
    clickCount: number;
    imageUrl?: string;
  }

  const [convocatorias, setConvocatorias] = useState<Convocatoria[]>([]);
  const totalPaginas = Math.ceil(convocatorias.length / convocatoriasPorPagina);

  // 👉 Calcular índice de inicio y fin según página actual
  const indiceInicio = (paginaActual - 1) * convocatoriasPorPagina;
  const indiceFin = indiceInicio + convocatoriasPorPagina;
  const convocatoriasPagina = convocatorias.slice(indiceInicio, indiceFin);

  // 👉 Otros estados
  const [vista, setVista] = useState("Tarjeta");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [pestanaActiva, setPestanaActiva] = useState("descripcion");
  const [destacado, setDestacado] = useState(false);
  const [modoOscuro, setModoOscuro] = useState(false);
  const [convocatoriaSeleccionada, setConvocatoriaSeleccionada] = useState<Convocatoria | null>(null);

  // 👉 Alternar entre claro y oscuro
  const toggleModoOscuro = () => {
    setModoOscuro((prev) => {
      const nuevo = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("modoOscuro", nuevo.toString());
      }
      return nuevo;
    });
  };

  // 👉 Cargar convocatorias desde la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getConvocatorias();
        setConvocatorias(data.data || []);
      } catch (err) {
        console.error("Error al cargar convocatorias", err);
      }
    };

    fetchData();
  }, []);







  return (
    <div className="min-h-[90vh] bg-white"> {/* Aumenta el alto mínimo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border border-solid border-gray-200 rounded-lg shadow-sm bg-white">
        {/* HEADER */}
      <header className="p-4">
  <div className="flex justify-between items-start md:items-center flex-col md:flex-row">
    {/* CONTENEDOR LOGO + BUSCADOR */}
    <div className="flex flex-col gap-4 w-full">
      {/* Logo arriba del buscador */}
      <div className="flex justify-start">
        <img
          src="/img/sena.png"
          alt="Logo Izquierdo"
          className="h-16 w-auto object-contain"
        />
      </div>

      {/* BUSCADOR - Parte inferior */}
      <div className="relative w-full max-w-xl">
        <input
          type="text"
          placeholder="Buscar convocatorias, programas, becas..."
          className="pl-12 pr-6 py-2 rounded-full border-2 border-gray-200 bg-white w-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 text-base"
        />
        <FaSearch className="absolute left-4 top-3.5 text-gray-500 text-xl" />
      </div>
    </div>

    {/* DERECHA: Logo + Navegación */}
    <div className="flex flex-col items-end space-y-3 mt-4 md:mt-0">
      {/* Logo derecho */}
      <div className="flex justify-end">
        <img
          src="/img/logo.png"
          alt="Logo Derecho"
          className="h-14 w-auto object-contain"
        />
      </div>

      {/* Navegación */}
      <nav className="flex items-center space-x-6 border-t pt-3">
        <Link
          href="/menu"
          className="flex items-center space-x-1 hover:text-[#39A900] cursor-pointer transition"
        >
          <FaTags className="text-sm" />
          <span>Descubrir</span>
        </Link>
        <Link
          href="/public/explorar/"
          className="flex items-center space-x-1 text-[#39A900] border-b-2 border-[#39A900] pb-1"
        >
          <FaSearchLocation className="text-sm" />
          <span>Explorar</span>
        </Link>
        <Link
          href="/usuario/favoritos"
          className="flex items-center space-x-1 hover:text-[#39A900] cursor-pointer transition"
        >
          <FaRegBookmark className="text-sm" />
          <span>Favoritos</span>
        </Link>
        <Link href="/usuario/perfilUser">
          <div className="h-10 w-10 rounded-full bg-[#8f928f] flex items-center justify-center text-white font-bold shadow-md">
            f
          </div>
        </Link>
      </nav>

      {/* Botón modo oscuro */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={toggleModoOscuro}
          className={`p-4 rounded-full transition-all duration-500 hover:scale-110 shadow-lg ${
            modoOscuro
              ? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
              : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
          }`}
          title="Cambiar modo"
        >
          {modoOscuro ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
        </button>
      </div>
    </div>
  </div>
</header>


        {/* ------------------- Panel de Filtros Moderno y Atractivo ------------------- */}
        <section className="bg-white/80 backdrop-blur-sm border border-gray-200/80 shadow-sm rounded-2xl p-6 mb-6">
          <div className="flex flex-wrap gap-x-6 gap-y-5 items-end">

            {/* Contenedor de los filtros */}
            <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5">

              {/* --- Filtro: Categoría --- */}
              <div className="flex flex-col">
                <label htmlFor="categoria" className="flex items-center text-sm font-medium mb-2 text-gray-600 gap-2">
                  <LayoutGrid className="w-4 h-4 text-gray-400" />
                  Categoría
                </label>
                <div className="relative">
                  <select
                    id="categoria"
                    className="w-full appearance-none bg-white border-2 border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md hover:border-gray-200"
                  >
                    <option>Todas las categorías</option>
                    <option>Empleo</option>
                    <option>Formación Técnica</option>
                    <option>Formación Tecnológica</option>
                    <option>Certificaciones</option>
                    <option>Prácticas</option>
                    <option>Internacional</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>

              {/* --- Filtro: Ubicación --- */}
              <div className="flex flex-col">
                <label htmlFor="ubicacion" className="flex items-center text-sm font-medium mb-2 text-gray-600 gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  Ubicación
                </label>
                <div className="relative">
                  <select
                    id="ubicacion"
                    className="w-full appearance-none bg-white border-2 border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md hover:border-gray-200"
                  >
                    <option>Todo el país</option>
                    <option>Bogotá</option>
                    <option>Medellín</option>
                    <option>Cali</option>
                    <option>Barranquilla</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>

              {/* --- Filtro: Fecha --- */}
              <div className="flex flex-col">
                <label htmlFor="fecha" className="flex items-center text-sm font-medium mb-2 text-gray-600 gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  Fecha de inicio
                </label>
                <div className="relative">
                  <select
                    id="fecha"
                    className="w-full appearance-none bg-white border-2 border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md hover:border-gray-200"
                  >
                    <option>Cualquier fecha</option>
                    <option>Julio 2025</option>
                    <option>Agosto 2025</option>
                    <option>Septiembre 2025</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>

              {/* --- Filtro: Visualización --- */}
              <div className="flex flex-col">
                <label htmlFor="visualizacion" className="flex items-center text-sm font-medium mb-2 text-gray-600 gap-2">
                  <View className="w-4 h-4 text-gray-400" />
                  Visualización
                </label>
                <div className="relative">
                  <select
                    id="visualizacion"
                    className="w-full appearance-none bg-white border-2 border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md hover:border-gray-200"
                    value={vista}
                    onChange={(e) => setVista(e.target.value)}
                  >
                    <option value="Tarjeta">Tarjeta</option>
                    <option value="Lista">Lista</option>
                    <option value="Tabla">Tabla</option>
                    <option value="Mosaico">Mosaico</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

     {vista === "Tarjeta" && (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-0 mb-8">
    {convocatoriasPagina.map((convocatoria, index) => (
      <div
        key={convocatoria.id || index}
        className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col"
      >
        {/* Imagen */}
        <div className="overflow-hidden">
          <img
            onClick={() => {
              setConvocatoriaSeleccionada(convocatoria); // ✅ guardamos
              setModalAbierto(true);
            }}
            src={convocatoria.imageUrl || "/img/default.jpg"}
            alt={convocatoria.title}
            className="w-full h-[180px] sm:h-[200px] md:h-[220px] object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Contenido */}
        <div className="p-4 sm:p-5 flex flex-col justify-between flex-grow">
          <div>
            {/* Título */}
            <h4 className="font-bold text-lg text-[#00324D] mb-3 flex items-center gap-2">
              <FaMobileAlt className="text-[#00324D]" />
              {convocatoria.title}
            </h4>

            {/* Descripción */}
            <p className="text-gray-600 mb-4 flex items-start gap-3">
              <FaGraduationCap className="text-lg sm:text-xl text-[#00324D] mt-0.5 flex-shrink-0" />
              <span className="text-sm">{convocatoria.description}</span>
            </p>

            {/* Fechas */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-gray-700 mb-4">
              <span className="flex items-center gap-1.5">
                <FaCalendarAlt className="text-[#00324D]" />
                <strong>Apertura:</strong>{" "}
                {convocatoria.openDate
                  ? new Date(convocatoria.openDate).toLocaleDateString()
                  : "—"}
              </span>
              <span className="flex items-center gap-1.5">
                <FaCalendarTimes className="text-[#00324D]" />
                <strong>Cierre:</strong>{" "}
                {convocatoria.closeDate
                  ? new Date(convocatoria.closeDate).toLocaleDateString()
                  : "—"}
              </span>
            </div>
          </div>

          {/* Botones */}
          <div className="pt-4 mt-auto border-t border-gray-200 flex items-center gap-2">
            <button
              onClick={() => {
                setConvocatoriaSeleccionada(convocatoria);
                setModalAbierto(true);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm bg-[#00324D] text-white hover:bg-[#004267] transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <FaRegFileAlt /> Detalles
            </button>

            <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm bg-[#39A900] text-white hover:bg-lime-600 transition-all duration-300 shadow-sm hover:shadow-md">
              <FaCheckCircle /> Inscribirse
            </button>

            {/* Favorito */}
            <button
              onClick={() => setDestacado(!destacado)}
              className="group ml-auto p-2 rounded-md hover:bg-gray-100 transition-colors"
              title="Marcar como favorita"
            >
              {destacado ? (
                <FaStar className="text-yellow-400 text-2xl transition-all duration-300 transform group-hover:scale-125 group-hover:rotate-[360deg]" />
              ) : (
                <FaRegStar className="text-gray-400 text-2xl transition-all duration-300 group-hover:text-yellow-400 group-hover:scale-125 group-hover:rotate-[360deg]" />
              )}
            </button>
          </div>
        </div>
      </div>
    ))}

    {/* Modal dinámico */}
    {convocatoriaSeleccionada && (
      <ModalConvocatoria
        modalAbierto={modalAbierto}
        cerrarModal={() => setModalAbierto(false)}
        convocatoria={convocatoriaSeleccionada}
      />
    )}
  </div>
)}


 

{/* Vista Lista MEJORADA y DINÁMICA */}
{vista === "Lista" && (
  <div className="w-full p-4 sm:p-0 lg:p-0">
    <div className="flex flex-col gap-6">
      {convocatoriasPagina.map((convocatoria, index) => (
        <div
          key={convocatoria.id || index}
          className="relative flex flex-col md:flex-row bg-white rounded-lg border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
        >
          {/* Imagen */}
          <div className="w-full md:w-[400px] h-[260px] flex-shrink-0 bg-gray-100 overflow-hidden">
            <img
              onClick={() => {
                setConvocatoriaSeleccionada(convocatoria);
                setModalAbierto(true);
              }}
              src={convocatoria.imageUrl || "/img/default.jpg"}
              alt={convocatoria.title}
              className="w-full h-full object-cover object-[20%] cursor-pointer transition-transform duration-300 hover:scale-110"
            />
          </div>

          {/* Contenido */}
          <div className="flex flex-col flex-grow p-6">
            <div className="flex-grow">
              <h4 className="text-xl font-bold text-[#00324D] flex items-center gap-3">
                <FaMobileAlt className="text-[#00324D]" />
                {convocatoria.title}
              </h4>

              <div className="border-t border-gray-200 my-4"></div>

              <div className="space-y-4">
                {/* Descripción */}
                <p className="text-sm text-gray-700 flex items-start gap-3 min-h-[40px]">
                  <FaGraduationCap className="text-xl text-[#00324D] flex-shrink-0 mt-0.5" />
                  <span className="line-clamp-2">
                    {convocatoria.description}
                  </span>
                </p>

                {/* Fechas */}
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-800">
                  <span className="flex items-center gap-2">
                    <FaCalendarAlt className="text-[#00324D]" />
                    <strong>Apertura:</strong>{" "}
                    {convocatoria.openDate
                      ? new Date(convocatoria.openDate).toLocaleDateString()
                      : "—"}
                  </span>
                  <span className="flex items-center gap-2">
                    <FaCalendarTimes className="text-[#00324D]" />
                    <strong>Cierre:</strong>{" "}
                    {convocatoria.closeDate
                      ? new Date(convocatoria.closeDate).toLocaleDateString()
                      : "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex flex-wrap items-center gap-3 pt-4 mt-auto border-t border-gray-200">
              <button
                onClick={() => {
                  setConvocatoriaSeleccionada(convocatoria);
                  setModalAbierto(true);
                }}
                className="flex items-center gap-2 px-5 py-2 rounded-md font-semibold text-sm bg-[#00324D] text-white hover:bg-[#004267] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <FaRegFileAlt /> Detalles
              </button>

              <button className="flex items-center gap-2 px-5 py-2 rounded-md font-semibold text-sm bg-[#39A900] text-white hover:bg-lime-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                <FaCheckCircle /> Inscribirse
              </button>

              {/* Favorito */}
              <button
                onClick={() => setDestacado(!destacado)}
                className="group ml-auto p-2 rounded-md hover:bg-gray-100 transition-colors"
                title="Marcar como favorita"
              >
                {destacado ? (
                  <FaStar className="text-yellow-400 text-2xl transition-all duration-300 transform group-hover:scale-125 group-hover:rotate-[360deg]" />
                ) : (
                  <FaRegStar className="text-gray-400 text-2xl transition-all duration-300 group-hover:text-yellow-400 group-hover:scale-125 group-hover:rotate-[360deg]" />
                )}
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Modal dinámico */}
      {convocatoriaSeleccionada && (
        <ModalConvocatoria
          modalAbierto={modalAbierto}
          cerrarModal={() => setModalAbierto(false)}
          convocatoria={convocatoriaSeleccionada}
        />
      )}
    </div>
  </div>
)}





   {vista === "Tabla" && (
  <div className="bg-white rounded-2xl shadow-lg mt-6 border border-gray-200 overflow-x-auto">
    <table className="w-full text-left border-collapse min-w-[1200px]">
      <thead className="sticky top-0 z-10 bg-[#00324D] text-white">
        <tr>
          <th className="px-6 py-4 text-sm font-medium uppercase tracking-wider border border-gray-300">
            <span className="flex items-center gap-2">
              <FaImage />
              Convocatoria
            </span>
          </th>
          <th className="px-6 py-4 text-sm font-medium uppercase tracking-wider border border-gray-300">
            <span className="flex items-center gap-2">
              <FaInfoCircle />
              Descripción
            </span>
          </th>
          <th className="px-6 py-4 text-sm font-medium uppercase tracking-wider border border-gray-300">
            <span className="flex items-center gap-2">
              <FaCalendarAlt />
              Apertura
            </span>
          </th>
          <th className="px-6 py-4 text-sm font-medium uppercase tracking-wider border border-gray-300">
            <span className="flex items-center gap-2">
              <FaCalendarTimes />
              Cierre
            </span>
          </th>
          <th className="px-6 py-4 text-sm font-medium uppercase tracking-wider text-center border border-gray-300">
            <span className="flex items-center justify-center gap-2">
              <FaCog />
              Acciones
            </span>
          </th>
        </tr>
      </thead>

      <tbody className="text-sm text-gray-700">
        {convocatoriasPagina.map((convocatoria, index) => (
          <tr
            key={convocatoria.id || index}
            className="hover:bg-gray-50 transition-colors duration-200"
          >
            {/* Convocatoria con imagen y título */}
            <td className="px-6 py-4 align-middle border border-gray-200">
              <div className="flex items-center gap-4">
                <img
                  onClick={() => {
                    setConvocatoriaSeleccionada(convocatoria);
                    setModalAbierto(true);
                  }}
                  src={convocatoria.imageUrl || "/img/default.jpg"}
                  alt={convocatoria.title}
                  className="w-48 h-28 object-cover rounded-md flex-shrink-0 cursor-pointer"
                />
                <span className="font-semibold text-[#00324D] text-base">
                  {convocatoria.title}
                </span>
              </div>
            </td>

            {/* Descripción */}
            <td className="px-6 py-4 text-gray-600 align-middle border border-gray-200">
              {convocatoria.description}
            </td>

            {/* Apertura */}
            <td className="px-6 py-4 text-gray-600 whitespace-nowrap align-middle border border-gray-200">
              {convocatoria.openDate
                ? new Date(convocatoria.openDate).toLocaleDateString()
                : "—"}
            </td>

            {/* Cierre */}
            <td className="px-6 py-4 text-gray-600 whitespace-nowrap align-middle border border-gray-200">
              {convocatoria.closeDate
                ? new Date(convocatoria.closeDate).toLocaleDateString()
                : "—"}
            </td>

            {/* Acciones */}
            <td className="px-6 py-4 align-middle border border-gray-200">
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => {
                    setConvocatoriaSeleccionada(convocatoria);
                    setModalAbierto(true);
                  }}
                  className="flex items-center gap-2 px-3 py-2 bg-[#00324D] text-white rounded-lg hover:bg-[#005072] transition-colors text-sm font-semibold"
                >
                  <FaRegFileAlt />
                  Detalles
                </button>

                <button className="flex items-center gap-2 px-3 py-2 bg-[#39A900] text-white rounded-lg hover:bg-[#2c8000] transition-colors text-sm font-semibold">
                  <FaCheckCircle />
                  Inscribirse
                </button>

                <button
                  onClick={() => setDestacado(!destacado)}
                  className="group ml-auto p-2 rounded-md hover:bg-gray-100 transition-colors"
                  title="Marcar como favorita"
                >
                  {destacado ? (
                    <FaStar className="text-yellow-400 text-2xl transition-all duration-300 transform group-hover:scale-125 group-hover:rotate-[360deg]" />
                  ) : (
                    <FaRegStar className="text-gray-400 text-2xl transition-all duration-300 group-hover:text-yellow-400 group-hover:scale-125 group-hover:rotate-[360deg]" />
                  )}
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* Modal dinámico */}
    {convocatoriaSeleccionada && (
      <ModalConvocatoria
        modalAbierto={modalAbierto}
        cerrarModal={() => setModalAbierto(false)}
        convocatoria={convocatoriaSeleccionada}
      />
    )}
  </div>
)}




{/* ---------------- Vista Mosaico MEJORADA Y RESPONSIVA ---------------- */}
{vista === "Mosaico" && (
  <>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 max-w-[2300px] mx-auto my-8 px-0">
      {convocatoriasPagina.map((convocatoria, index) => (
        <div
          key={convocatoria.id || index}
          className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-xl flex flex-col h-full min-h-[320px]"
        >
          {/* Imagen */}
          <div className="w-full h-[140px] sm:h-[160px] md:h-[180px] overflow-hidden">
            <img
              onClick={() => {
                setConvocatoriaSeleccionada(convocatoria); // ✅ guardamos
                setModalAbierto(true);
              }}
              src={convocatoria.imageUrl || "/img/default.jpg"}
              alt={convocatoria.title}
              className="w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Contenido compacto */}
          <div className="p-4 flex flex-col flex-grow">
            <div className="flex-grow space-y-2">
              <h4 className="text-[#00324D] text-base font-semibold flex items-center gap-2">
                <FaMobileAlt className="text-[#00324D]" />
                {convocatoria.title}
              </h4>

              <p className="text-sm text-gray-700 line-clamp-3">
                <FaGraduationCap className="float-left mr-2 mt-1 text-[#00324D]" />
                {convocatoria.description}
              </p>

              {/* Fechas compactas */}
              <div className="mt-3 flex items-center justify-between text-xs text-gray-600 bg-gray-50 p-2 rounded">
                <span className="flex items-center gap-1">
                  <FaCalendarAlt className="text-[#00324D]" />
                  <span>
                    {convocatoria.openDate
                      ? new Date(convocatoria.openDate).toLocaleDateString()
                      : "—"}
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <FaClock className="text-[#00324D]" />
                  <span>
                    {convocatoria.closeDate
                      ? new Date(convocatoria.closeDate).toLocaleDateString()
                      : "—"}
                  </span>
                </span>
              </div>
            </div>

            {/* Botones compactos */}
            <div className="mt-3 pt-3 border-t border-gray-200 flex items-center gap-2">
              <button
                onClick={() => {
                  setConvocatoriaSeleccionada(convocatoria); // ✅ guardamos
                  setModalAbierto(true);
                }}
                className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs bg-[#00324D] text-white hover:bg-[#004267]"
              >
                <FaRegFileAlt size={12} /> Detalles
              </button>
              <button className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs bg-[#39A900] text-white hover:bg-[#2d8a00]">
                <FaCheckCircle size={12} /> Inscribirse
              </button>
              <button
                onClick={() => setDestacado(!destacado)}
                className="group ml-auto p-2 rounded-md hover:bg-gray-100 transition-colors"
                title="Marcar como favorita"
              >
                {destacado ? (
                  <FaStar className="text-yellow-400 text-2xl transition-all duration-300 transform group-hover:scale-125 group-hover:rotate-[360deg]" />
                ) : (
                  <FaRegStar className="text-gray-400 text-2xl transition-all duration-300 group-hover:text-yellow-400 group-hover:scale-125 group-hover:rotate-[360deg]" />
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Modal dinámico */}
    {convocatoriaSeleccionada && (
      <ModalConvocatoria
        modalAbierto={modalAbierto}
        cerrarModal={() => setModalAbierto(false)}
        convocatoria={convocatoriaSeleccionada} // ✅ pasamos la seleccionada
      />
    )}
  </>
)}




        {/*-------------------------------- Paginación Moderna con Efecto Glow -----------------------------------*/}
      {/* ---------------- Paginación ---------------- */}
            <div className="flex justify-center items-center gap-3 mt-4 flex-wrap">
              {/* Botón Anterior */}
              <button
                className="flex items-center justify-center gap-2 px-4 py-2 font-semibold text-gray-700 bg-white border border-gray-200/80 rounded-xl shadow-sm transition-all hover:bg-gray-50 disabled:opacity-50"
                disabled={paginaActual === 1}
                onClick={() => setPaginaActual(paginaActual - 1)}
              >
                <ChevronLeft size={18} /> Anterior
              </button>

              {/* Números dinámicos */}
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  className={`flex items-center justify-center w-11 h-11 font-bold rounded-xl transition-all
        ${paginaActual === num
                      ? "bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg scale-110"
                      : "text-gray-700 bg-white border border-gray-200/80 shadow-sm hover:bg-gray-50"}`}
                  onClick={() => setPaginaActual(num)}
                >
                  {num}
                </button>
              ))}

              {/* Botón Siguiente */}
              <button
                className="flex items-center justify-center gap-2 px-4 py-2 font-semibold text-gray-700 bg-white border border-gray-200/80 rounded-xl shadow-sm transition-all hover:bg-gray-50 disabled:opacity-50"
                disabled={paginaActual === totalPaginas}
                onClick={() => setPaginaActual(paginaActual + 1)}
              >
                Siguiente <ChevronRight size={18} />
              </button>
            </div>



      </div>

    </div>

  )
}