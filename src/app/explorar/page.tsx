'use client';

import { useState } from 'react';
import {
  FaTags, FaSearchLocation, FaRegBookmark, FaSearch, FaSignOutAlt, FaStar, FaRegStar,
  FaCheckCircle, FaCalendarAlt, FaCalendarTimes, FaMobileAlt, FaGraduationCap,
  FaClock, FaFileAlt, FaImage, FaCog, FaInfoCircle, FaUserTie, FaRegFileAlt,
  FaTrashAlt
} from 'react-icons/fa';

import Link from 'next/link';
import ModalConvocatoria from '../components/detalleConvo/detalleConvo'; // Ajusta la ruta
import { Calendar, ChevronLeft, ChevronRight, LayoutGrid, MapPin, SlidersHorizontal, View } from 'lucide-react';
const imagenesEje = [
 'img/jove.jpg',
  'img/maxresdefault.jpg',
  'img/produ.jpg',
  'img/ejeq.png',
  'img/eco.png',
  'img/eco2.png',
  'img/ej.jpg',
  'img/fabricas.jpg',
  'img/R.jpg'
];

export default function HomePage() {

  const [paginaActual, setPaginaActual] = useState(1);

  const [vista, setVista] = useState("Tarjeta");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [pestanaActiva, setPestanaActiva] = useState("descripcion");
  const [destacado, setDestacado] = useState(false);


  return (
    <div className="min-h-[90vh] bg-white"> {/* Aumenta el alto mínimo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border border-solid border-gray-200 rounded-lg shadow-sm bg-white">
        {/* HEADER */}
        <header className="p-4 ">
          <div className="flex justify-between items-start md:items-center flex-col md:flex-row">
            {/* CONTENEDOR LOGO + BUSCADOR */}
            <div className="flex flex-col gap-4 w-full">

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

            {/* DERECHA: Cerrar sesión + BR + Navegación */}
            <div className="flex flex-col items-end space-y-3 mt-4 md:mt-0">
              <div className="flex items-center space-x-3">
              </div>

              <nav className="flex items-center space-x-6 border-t pt-3">
                <Link
                  href="/menu"
                  className="flex items-center  space-x-1 hover:text-[#39A900] cursor-pointer transition"
                >
                  <FaTags className="text-sm" />
                  <span>Descubrir</span>
                </Link>
                <Link
                  href="/explorar/"
                  className="flex items-center space-x-1 text-[#39A900]   border-b-2 border-[#39A900] pb-1"
                >
                  <FaSearchLocation className="text-sm" />
                  <span>Explorar</span>
                </Link>
                <Link
                  href="/favoritos"
                  className="flex items-center space-x-1 hover:text-[#39A900] cursor-pointer transition"
                >
                  <FaRegBookmark className="text-sm" />
                  <span>Favoritos</span>
                </Link>
                <Link href="/perfilUser">
                      <div className="h-10 w-10 rounded-full bg-[#8f928f] flex items-center justify-center text-white font-bold shadow-md">
                    f
                  </div>
                </Link>
              </nav>
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
            className="w-full appearance-none bg-gray-50/70 border border-gray-200/90 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 cursor-pointer"
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
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
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
            className="w-full appearance-none bg-gray-50/70 border border-gray-200/90 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 cursor-pointer"
          >
            <option>Todo el país</option>
            <option>Bogotá</option>
            <option>Medellín</option>
            <option>Cali</option>
            <option>Barranquilla</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
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
            className="w-full appearance-none bg-gray-50/70 border border-gray-200/90 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 cursor-pointer"
          >
            <option>Cualquier fecha</option>
            <option>Julio 2025</option>
            <option>Agosto 2025</option>
            <option>Septiembre 2025</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
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
            className="w-full appearance-none bg-gray-50/70 border border-gray-200/90 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 cursor-pointer"
            value={vista}
            onChange={(e) => setVista(e.target.value)}
          >
            <option value="Tarjeta">Tarjeta</option>
            <option value="Lista">Lista</option>
            <option value="Tabla">Tabla</option>
            <option value="Mosaico">Mosaico</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>

   {vista === "Tarjeta" && (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 mb-8">
    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i, index) => (
      <div
        key={i}
        className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col"
      >
        {/* Imagen */}
        <div className="overflow-hidden">
          <img
            onClick={() => setModalAbierto(true)}
            src={imagenesEje[index]}
            alt={`Imagen ${i}`}
            className="w-full h-[180px] sm:h-[200px] md:h-[220px] object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Contenido */}
        <div className="p-4 sm:p-5 flex flex-col justify-between flex-grow">
          <div>
            {/* Título */}
            <h4 className="font-bold text-lg text-[#00324D] mb-3 flex items-center gap-2">
              <FaMobileAlt className="text-[#00324D]" />
              Curso de Tecnología {i}
            </h4>

            {/* Descripción */}
            <p className="text-gray-600 mb-4 flex items-start gap-3">
              <FaGraduationCap className="text-lg sm:text-xl text-[#00324D] mt-0.5 flex-shrink-0" />
              <span className="text-sm">
                Dirigido a estudiantes y profesionales interesados en el área.
              </span>
            </p>

            {/* Fechas */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-gray-700 mb-4">
              <span className="flex items-center gap-1.5">
                <FaCalendarAlt className="text-[#00324D]" />
                <strong>Apertura:</strong> 01/08/2025
              </span>
              <span className="flex items-center gap-1.5">
                <FaCalendarTimes className="text-[#00324D]" />
                <strong>Cierre:</strong> 30/08/2025
              </span>
            </div>
          </div>

          {/* Botones */}
          <div className="pt-4 mt-auto border-t border-gray-200 flex items-center gap-2">
            <button
              onClick={() => setModalAbierto(true)}
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
    <FaStar 
      className="text-yellow-400 text-2xl transition-all duration-300 transform group-hover:scale-125 group-hover:rotate-[360deg]" 
    />
  ) : (
    <FaRegStar 
      className="text-gray-400 text-2xl transition-all duration-300 group-hover:text-yellow-400 group-hover:scale-125 group-hover:rotate-[360deg]"
    />
  )}
</button>
          </div>
        </div>
      </div>
    ))}

    {/* Modal */}
    <ModalConvocatoria
      modalAbierto={modalAbierto}
      cerrarModal={() => setModalAbierto(false)}
    />
  </div>
)}

{/* Vista Lista MEJORADA y UNIFORME */}
{vista === "Lista" && (
  <div className="w-full p-4 sm:p-6 lg:p-8">
    <div className="flex flex-col gap-6">
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className="relative flex flex-col md:flex-row bg-white rounded-lg border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
        >
          {/* Contenedor de Imagen (más grande y uniforme) */}
         {/* Contenedor de Imagen (más grande y uniforme con enfoque a la izquierda) */}
<div className="w-full md:w-[400px] h-[260px] flex-shrink-0 bg-gray-100 overflow-hidden">
  <img
    onClick={() => setModalAbierto(true)}
    src={imagenesEje[index]}
    alt={`Convocatoria ${index}`}
    className="w-full h-full object-cover object-[20%] cursor-pointer transition-transform duration-300 hover:scale-110"
  />
</div>


          {/* Contenido */}
          <div className="flex flex-col flex-grow p-6">
            <div className="flex-grow">
              <h4 className="text-xl font-bold text-[#00324D] flex items-center gap-3">
                <FaMobileAlt className="text-[#00324D]" />
                Técnico en Desarrollo de Aplicaciones Web
              </h4>

              <div className="border-t border-gray-200 my-4"></div>

              <div className="space-y-4">
                {/* Párrafo con altura consistente */}
                <p className="text-sm text-gray-700 flex items-start gap-3 min-h-[40px]">
                  <FaGraduationCap className="text-xl text-[#00324D] flex-shrink-0 mt-0.5" />
                  <span className="line-clamp-2">
                    Aprende a crear aplicaciones web modernas con las últimas tecnologías del mercado. 
                    Este texto puede ser más largo para demostrar cómo se corta automáticamente.
                  </span>
                </p>

                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-800">
                  <span className="flex items-center gap-2">
                    <FaCalendarAlt className="text-[#00324D]" />
                    <strong>Apertura:</strong> 15 julio
                  </span>
                  <span className="flex items-center gap-2">
                    <FaCalendarTimes className="text-[#00324D]" />
                    <strong>Cierre:</strong> 31 julio
                  </span>
                </div>
              </div>
            </div>

            {/* Botones con línea separadora */}
            <div className="flex flex-wrap items-center gap-3 pt-4 mt-auto border-t border-gray-200">
              <button
                onClick={() => setModalAbierto(true)}
                className="flex items-center gap-2 px-5 py-2 rounded-md font-semibold text-sm bg-[#00324D] text-white hover:bg-[#004267] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <FaFileAlt /> Detalles
              </button>

              <button className="flex items-center gap-2 px-5 py-2 rounded-md font-semibold text-sm bg-[#39A900] text-white hover:bg-lime-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                <FaCheckCircle /> Inscribirse
              </button>

              <button
                onClick={() => setDestacado(!destacado)}
                className="group ml-auto p-2 rounded-md hover:bg-gray-100 transition-colors"
                title="Marcar como favorita"
              >
                {destacado ? (
                  <FaStar 
                    className="text-yellow-400 text-2xl transition-all duration-300 transform group-hover:scale-125 group-hover:rotate-[360deg]" 
                  />
                ) : (
                  <FaRegStar 
                    className="text-gray-400 text-2xl transition-all duration-300 group-hover:text-yellow-400 group-hover:scale-125 group-hover:rotate-[360deg]"
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      ))}

      <ModalConvocatoria
        modalAbierto={modalAbierto}
        cerrarModal={() => setModalAbierto(false)}
      />
    </div>
  </div>
)}


    
       {vista === "Tabla" && (
  // El contenedor sigue gestionando el scroll, lo que permite que la tabla de adentro sea más ancha.
  <div className="bg-white rounded-2xl shadow-lg mt-6 border border-gray-200 max-h-[80vh] overflow-auto">
    {/* 
      Tabla con un ancho mínimo aumentado para que sea más larga hacia los lados.
      Cambiado de min-w-[900px] a min-w-[1200px].
    */}
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
        {[...Array(8)].map((_, index) => (
          <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
            
            <td className="px-6 py-4 align-middle border border-gray-200">
              <div className="flex items-center gap-4">
                <img
                  onClick={() => setModalAbierto(true)}
                  src={imagenesEje[index]}
                  alt={`Convocatoria ${index}`}
                  className="w-48 h-28 object-cover rounded-md flex-shrink-0 cursor-pointer"
                />
                <span className="font-semibold text-[#00324D] text-base">
                  Técnico en desarrollo de Aplicaciones Web
                </span>
              </div>
            </td>
            
            <td className="px-6 py-4 text-gray-600 align-middle border border-gray-200">
              Aprende a crear aplicaciones web modernas con tecnologías del mercado.
            </td>
            
            <td className="px-6 py-4 text-gray-600 whitespace-nowrap align-middle border border-gray-200">
              15 julio
            </td>
            
            <td className="px-6 py-4 text-gray-600 whitespace-nowrap align-middle border border-gray-200">
              31 julio
            </td>
            
            <td className="px-6 py-4 align-middle border border-gray-200">
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setModalAbierto(true)}
                  className="flex items-center gap-2 px-3 py-2 bg-[#00324D] text-white rounded-lg hover:bg-[#005072] transition-colors text-sm font-semibold"
                >
                  <FaFileAlt />
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
    <FaStar 
      className="text-yellow-400 text-2xl transition-all duration-300 transform group-hover:scale-125 group-hover:rotate-[360deg]" 
    />
  ) : (
    <FaRegStar 
      className="text-gray-400 text-2xl transition-all duration-300 group-hover:text-yellow-400 group-hover:scale-125 group-hover:rotate-[360deg]"
    />
  )}
</button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    
    <ModalConvocatoria
      modalAbierto={modalAbierto}
      cerrarModal={() => setModalAbierto(false)}
    />
  </div>
)}



{/* ---------------- Vista Mosaico MEJORADA Y RESPONSIVA ---------------- */}
{vista === "Mosaico" && (
  <>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 max-w-[1800px] mx-auto my-8 px-4">
      {[1, 2, 3, 4,5,6,7,8].map((i, index) => (
        <div
          key={i}
          className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-xl flex flex-col h-full min-h-[320px]"
        >
          {/* Imagen ancha pero no muy alta */}
          <div className="w-full h-[140px] sm:h-[160px] md:h-[180px] overflow-hidden">
            <img
              onClick={() => setModalAbierto(true)}
              src={imagenesEje[index]}
              alt={`Convocatoria ${i}`}
              className="w-full h-full object-cover object-[20%] cursor-pointer transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Contenido compacto */}
          <div className="p-4 flex flex-col flex-grow">
            <div className="flex-grow space-y-2">
              <h4 className="text-[#00324D] text-base font-semibold flex items-center gap-2">
                <FaMobileAlt className="text-[#00324D]" /> 
                Desarrollo apps móviles
              </h4>

              <p className="text-sm text-gray-700 line-clamp-3">
                <FaGraduationCap className="float-left mr-2 mt-1 text-[#00324D]" />
                Becas para formación técnica y profesional en diversas disciplinas relacionadas con desarrollo móvil.
              </p>

              {/* Fechas compactas en una sola línea */}
              <div className="mt-3 flex items-center justify-between text-xs text-gray-600 bg-gray-50 p-2 rounded">
                <span className="flex items-center gap-1">
                  <FaCalendarAlt className="text-[#00324D]" />
                  <span>01/11/2025</span>
                </span>
                <span className="flex items-center gap-1">
                  <FaClock className="text-[#00324D]" />
                  <span>29/11/2025</span>
                </span>
              </div>
            </div>

            {/* Botones en línea compactos */}
            <div className="mt-3 pt-3 border-t border-gray-200 flex items-center gap-2">
              <button
                onClick={() => setModalAbierto(true)}
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
    <FaStar 
      className="text-yellow-400 text-2xl transition-all duration-300 transform group-hover:scale-125 group-hover:rotate-[360deg]" 
    />
  ) : (
    <FaRegStar 
      className="text-gray-400 text-2xl transition-all duration-300 group-hover:text-yellow-400 group-hover:scale-125 group-hover:rotate-[360deg]"
    />
  )}
</button>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Modal */}
    <ModalConvocatoria
      modalAbierto={modalAbierto}
      cerrarModal={() => setModalAbierto(false)}
    />
  </>
)}

       
{/*-------------------------------- Paginación Moderna con Efecto Glow -----------------------------------*/}
<div className="flex justify-center items-center gap-3 mt-4 flex-wrap">
  {/* Botón Anterior */}
  <button
    className="flex items-center justify-center gap-2 px-4 py-2 font-semibold text-gray-700 bg-white border border-gray-200/80 rounded-xl shadow-sm transition-all duration-300 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md hover:-translate-y-px disabled:opacity-50 disabled:shadow-none disabled:transform-none disabled:cursor-not-allowed"
    disabled={paginaActual === 1}
    onClick={() => setPaginaActual(paginaActual - 1)}
  >
    <ChevronLeft size={18} strokeWidth={2.5} />
    Anterior
  </button>

  {/* Números de página */}
  {[1, 2, 3, 4].map((num) => (
    <button
      key={num}
      className={`flex items-center justify-center w-11 h-11 font-bold rounded-xl transition-all duration-300
      ${paginaActual === num
          ? "bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/40 scale-110 ring-2 ring-white/50"
          : "text-gray-700 bg-white border border-gray-200/80 shadow-sm hover:bg-gray-50 hover:shadow-md hover:-translate-y-px"}`}
      onClick={() => setPaginaActual(num)}
    >
      {num}
    </button>
  ))}

  {/* Botón Siguiente */}
  <button
    className="flex items-center justify-center gap-2 px-4 py-2 font-semibold text-gray-700 bg-white border border-gray-200/80 rounded-xl shadow-sm transition-all duration-300 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md hover:-translate-y-px disabled:opacity-50 disabled:shadow-none disabled:transform-none disabled:cursor-not-allowed"
    disabled={paginaActual === 4}
    onClick={() => setPaginaActual(paginaActual + 1)}
  >
    Siguiente
    <ChevronRight size={18} strokeWidth={2.5} />
  </button>
</div>



      </div>

    </div>

  )
}