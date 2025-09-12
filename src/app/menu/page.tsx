'use client';

import { useState, useEffect } from 'react';
import {
  FaSearch, FaRegBookmark, FaSearchLocation, FaGlobe, FaBriefcase,
  FaGraduationCap, FaTools, FaCertificate, FaUserGraduate, FaPlane
  , FaTags, FaCalendarAlt, FaClock, FaRegFileAlt, FaCheckCircle,
  FaCalendarTimes, FaStar, FaRegStar, FaMobileAlt
} from 'react-icons/fa';
import { MdWorkspacePremium } from 'react-icons/md';
import Link from "next/link";
import Carousel from "../../components/carrucel/Carousel";
import ModalConvocatoria from '../../components/detalleConvo/detalleConvo'; // Ajusta la ruta
import { ChevronLeft, ChevronRight, Moon, Sun } from 'lucide-react';
import Swal from "sweetalert2";

export default function HomePage() {
  const [paginaActual, setPaginaActual] = useState(1);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [pestanaActiva, setPestanaActiva] = useState("descripcion");
  const [destacado, setDestacado] = useState(false);

const [modoOscuro, setModoOscuro] = useState(false);

// Alternar entre claro y oscuro
const toggleModoOscuro = () => {
  setModoOscuro((prev) => {
    const nuevo = !prev;
    // Guardar en localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("modoOscuro", nuevo.toString());
    }
    return nuevo;
  });
};  

  useEffect(() => {
    const linea = document.getElementById('lineaGradiente');

    function generarColorAleatorio() {
      const letras = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letras[Math.floor(Math.random() * 16)];
      }
      return color;
    }

    function actualizarColores() {
      if (!linea) return;
      const color1 = generarColorAleatorio();
      const color2 = generarColorAleatorio();
      const color3 = generarColorAleatorio();
      const color4 = generarColorAleatorio();

      linea.style.background = `linear-gradient(to right, ${color1}, ${color2}, ${color3}, ${color4})`;
    }


    const intervalo = setInterval(actualizarColores, 3000);
    return () => clearInterval(intervalo);
  }, []);

  const imagenesTarjetas3 = [
    'img/jove.jpg',
    'img/maxresdefault.jpg',
    'img/produ.jpg'
  ];

  const imagenesTarjetas4 = [
    'img/ejeq.png',
    'img/eco3.jpg',
    'img/zarca1.jpeg',
    'img/zasca2.jpg'
  ];

  const imagenesMosaico = [
    'img/ej.jpg',
    'img/im.png',
    'img/fabricas.jpg',
    'img/hq720.jpg'
  ];
// 👉 Función mejorada para manejar favorito con SweetAlert2 moderno y simple
const handleFavorito = () => {
  const nuevoEstado = !destacado;
  setDestacado(nuevoEstado);

  if (nuevoEstado) {
    // ✅ Alerta: agregado a favoritos (con botón OK)
    Swal.fire({
      icon: "success",
      title: "¡Agregado a favoritos!",
      text: "Este elemento ahora está en tu lista",
      position: "center",
      confirmButtonText: "OK", // Botón OK
      confirmButtonColor: "#3085d6",
      background: "#fff",
      customClass: {
        popup: "rounded-2xl shadow-lg",
        title: "text-gray-800 font-semibold",
        htmlContainer: "text-gray-600",
      },
      showClass: {
        popup: "animate__animated animate__zoomIn",
      },
      hideClass: {
        popup: "animate__animated animate__zoomOut",
      },
    });
  } else {
    // ❌ Alerta: eliminado de favoritos (diferente diseño)
    Swal.fire({
      icon: "warning",
      title: "Eliminado de favoritos",
      text: "Ya no está en tu lista",
      position: "center",
      confirmButtonText: "Entendido", // Botón diferente
      confirmButtonColor: "#d33",
      background: "#fff",
      customClass: {
        popup: "rounded-2xl shadow-lg",
        title: "text-gray-800 font-semibold",
        htmlContainer: "text-gray-600",
      },
      showClass: {
        popup: "animate__animated animate__fadeInDown",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp",
      },
    });
  }
};



  return (
    <div className="min-h-[90vh] bg-white"> {/* Aumenta el alto mínimo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border border-solid border-gray-200 rounded-lg shadow-sm bg-white">
        {/* HEADER */}
        <header className="p-4">
  <div className="flex justify-between items-start md:items-center flex-col md:flex-row">
    {/* CONTENEDOR LOGO + BUSCADOR */}
    <div className="flex flex-col gap-6 w-full">
      {/* Logo arriba del buscador */}
      <div className="flex justify-start -mt-2">
        <img
          src="/img/sena.png"
          alt="Logo Izquierdo"
          className="h-18 w-auto object-contain"
        />
      </div>

      {/* BUSCADOR */}
      <div className="relative w-full max-w-xl">
        <input
          type="text"
          placeholder="Buscar convocatorias, programas, becas..."
          className="pl-12 pr-6 py-2 rounded-full border-2 border-gray-200 bg-white w-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 text-base"
        />
        <FaSearch className="absolute left-4 top-3.5 text-gray-500 text-xl" />
      </div>
    </div>

    {/* DERECHA: Perfil + Navegación */}
    <div className="flex flex-col items-end space-y-3 mt-4 md:mt-0">
      {/* Logo arriba del perfil */}
      <div className="flex justify-end">
        <img
          src="/img/logo.png"
          alt="Logo Derecho"
          className="h-14 w-auto object-contain"
        />
      </div>

      <nav className="flex items-center space-x-6 border-t pt-3">
        <Link
          href="/menu"
          className="flex items-center space-x-1 text-[#39A900] border-b-2 border-[#39A900] pb-1"
        >
          <FaTags className="text-sm" />
          <span>Descubrir</span>
        </Link>
        <Link
          href="/public/explorar/"
          className="flex items-center space-x-1 hover:text-[#39A900] cursor-pointer transition"
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
        <Link href="/perfilUser">
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


        {/* MAIN */}
        <main className="p-4">
          {/* Carrusel */}
          <div className="mb-8">
            <Carousel />
          </div>
          <section className="group">
            {/* Título con efectos */}
            <h2 className="text-3xl font-bold mt-8 mb-2 flex items-center gap-2">
              <span className="group-hover:rotate-6 transition-transform duration-500 text-blue-500">
                <FaSearchLocation />
              </span>
              <span className="group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-green-500 group-hover:to-blue-500 transition-all duration-500">
                Descubre algo nuevo
              </span>
            </h2>

            {/* Línea gradiente animada */}
            <div id="lineaGradiente" className="h-1 w-full bg-gradient-to-r from-green-400 via-yellow-400 via-pink-400 to-blue-500 mb-6 rounded-full animate-[pulse_3s_ease-in-out_infinite]" />

            {/* Filtros con efectos mejorados */}
            <div className="flex flex-wrap gap-3 mb-4 text-sm">
              {[
                { nombre: "Todos", icono: <FaGlobe className="group-hover:scale-110 transition-transform" />, color: "from-gray-100 to-gray-200" },
                { nombre: "Empleo", icono: <FaBriefcase className="group-hover:scale-110 transition-transform" />, color: "from-blue-100 to-blue-200" },
                { nombre: "Formación Técnica", icono: <FaGraduationCap className="group-hover:scale-110 transition-transform" />, color: "from-green-100 to-green-200" },
                { nombre: "Formación Tecnológica", icono: <FaTools className="group-hover:scale-110 transition-transform" />, color: "from-purple-100 to-purple-200" },
                { nombre: "Certificaciones", icono: <FaCertificate className="group-hover:scale-110 transition-transform" />, color: "from-yellow-100 to-yellow-200" },
                { nombre: "Prácticas", icono: <FaUserGraduate className="group-hover:scale-110 transition-transform" />, color: "from-pink-100 to-pink-200" },
                { nombre: "Internacional", icono: <FaPlane className="group-hover:scale-110 transition-transform" />, color: "from-red-100 to-red-200" },
              ].map((filtro) => (
                <button
                  key={filtro.nombre}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gradient-to-r ${filtro.color} border border-gray-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:scale-95`}
                >
                  <span className="text-gray-600 group-hover:text-gray-800">{filtro.icono}</span>
                  <span className="font-medium">{filtro.nombre}</span>
                </button>
              ))}
            </div>


          </section>

          <section className="mt-10 space-y-8">


            {/*--------------------- Tarjeta destacada MEJORADA ----------------------- */}
            <div className="relative bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2 flex flex-col">
              {/* Etiqueta destacada mejorada */}
              <span className="absolute top-1 right-3 text-xs bg-yellow-400 text-black px-2 py-1 rounded-full font-bold z-10 flex items-center gap-1 shadow-md">
                <MdWorkspacePremium className="text-black text-sm -mt-0.5" />
                Destacada
              </span>

              <div className="flex flex-col md:flex-row items-stretch">
                {/* Contenedor de imagen para efecto de zoom */}
                <div className="w-full md:w-1/2 overflow-hidden">
                  <img
                    onClick={() => setModalAbierto(true)}
                    src="/img/cienciasSalud.jpg"
                    alt="Convocatoria Destacada"
                    className="w-full h-90 object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
                  />
                </div>

                {/* Contenido con más espaciado */}
                <div className="flex-1 p-2 md:p-8 flex flex-col">
                  <div className="flex-grow space-y-4">
                    <h3 className="text-xl md:text-2xl font-bold text-[#00324D] flex items-center gap-2">
                      <FaMobileAlt />
                      Convocatoria Nacional de talento digital 2025
                    </h3>

                    <div className="flex items-start gap-3">
                      {/* Ícono más pequeño */}
                      <FaGraduationCap className="text-2xl text-[#00324D] flex-shrink-0" />

                      <p className="text-base text-gray-700 leading-relaxed">
                        Forma parte de la nueva generación de profesionales de tecnologías de la información.
                        Accede a información de alta calidad y conecta con las mejores empresas del sector.
                      </p>
                    </div>


                    {/* Fechas con mejor formato */}
                    <div className="flex flex-col sm:flex-row gap-x-6 gap-y-2 pt-2 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-[#00324D]" />
                        <span><strong>Apertura:</strong> 15 Julio 2025</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaCalendarTimes className="text-[#00324D]" />
                        <span><strong>Cierre:</strong> 30 Agosto 2025</span>
                      </div>
                    </div>
                  </div>

                  {/* --- SECCIÓN DE BOTONES MEJORADA --- */}
                  <div className="mt-5 pt-5 border-t border-gray-200 flex items-center gap-3 flex-wrap">

                    {/* Botones más grandes y con el nuevo estilo */}
                    <button
                      onClick={() => setModalAbierto(true)}
                      className="flex items-center gap-2 bg-[#00324D] text-white px-5 py-2.5 rounded-md font-semibold text-base hover:bg-[#004267] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      <FaRegFileAlt /> Detalles
                    </button>

                    <button className="flex items-center gap-2 bg-[#39A900] text-white px-5 py-2.5 rounded-md font-semibold text-base hover:bg-lime-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                      <FaCheckCircle /> Inscribirse
                    </button>

                    {/* Botón favorito estandarizado */}
                    <button
                      onClick={handleFavorito}
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
            </div>

            {/* Modal fuera del card */}
            <ModalConvocatoria
              modalAbierto={modalAbierto}
              cerrarModal={() => setModalAbierto(false)}
            />
            {/* ------------------- 3 tarjetas con el botón azul sólido -------------- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {[1, 2, 3].map((i, index) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col"
                >
                  {/* Imagen */}
                  <div className="overflow-hidden">
                    <img
                      onClick={() => setModalAbierto(true)}
                      src={imagenesTarjetas3[index]}
                      alt={`Imagen ${i}`}
                      className="w-full h-[230px] object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
                    />
                  </div>

                  {/* Contenido */}
                  <div className="p-5 flex flex-col justify-between flex-grow">
                    <div>
                      {/* Título */}
                      <h4 className="font-bold text-lg text-[#00324D] mb-3 flex items-center gap-2">
                        <FaMobileAlt />
                        Curso de Tecnología {i}
                      </h4>

                      {/* Descripción */}
                      <p className="text-gray-600 mb-4 flex items-start gap-3">
                        <FaGraduationCap className="text-2xl text-[#00324D] mt-0.5 flex-shrink-0" />
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

                    {/* --- SECCIÓN DE BOTONES CON EL AJUSTE FINAL --- */}
                    <div className="pt-4 mt-auto border-t border-gray-200 flex items-center gap-2">

                      {/* Botón "Detalles": fondo azul oscuro, hover azul más claro */}
                      <button
                        onClick={() => setModalAbierto(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-sm bg-[#00324D] text-white hover:bg-[#004267] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      >
                        <FaRegFileAlt /> Detalles
                      </button>

                      {/* Botón primario "Inscribirse" */}
                      <button className="flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-sm bg-[#39A900] text-white hover:bg-lime-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                        <FaCheckCircle /> Inscribirse
                      </button>

                      <button
                        onClick={handleFavorito}
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

            {/* ------------------- 4 tarjetas MEJORADAS (con fechas más juntas) -------------- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 mb-8">
              {[4, 5, 6, 7].map((i, index) => (
                <div
                  key={i}
                  // Estilo de tarjeta mejorado: bordes, sombras y efectos de hover
                  className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl flex flex-col"
                >
                  {/* Contenedor de imagen simplificado con efecto de zoom */}
                  <div className="w-full h-[240px] overflow-hidden">
                    <img
                      onClick={() => setModalAbierto(true)}
                      src={imagenesTarjetas4[index]}
                      alt={`Convocatoria ${i}`}
                      className="w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
                    />
                  </div>

                  <div className="p-5 flex flex-col flex-grow">
                    {/* Contenido de texto con espaciado mejorado */}
                    <div className="flex-grow">
                      <h4 className="text-[#00324D] font-bold text-lg flex items-center gap-2 mb-3">
                        <FaMobileAlt />
                        Tecnólogo en desarrollo de apps móviles
                      </h4>
                      <p className="text-sm text-gray-700 flex items-start gap-3 mb-4">
                        <FaGraduationCap className="text-xl text-[#00324D] mt-0.5 flex-shrink-0" />
                        Becas para formación técnica y profesional.
                      </p>

                      {/* --- SECCIÓN DE FECHAS MODIFICADA --- */}
                      {/* Se eliminó 'justify-between' y se usa un gap para un espaciado controlado */}
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-800">
                        <p className="flex items-center gap-2">
                          <FaCalendarAlt className="text-[#00324D]" />
                          <strong>Apertura:</strong> 29/11/2025
                        </p>
                        <p className="flex items-center gap-2">
                          <FaCalendarTimes className="text-[#00324D]" />
                          <strong>Cierre:</strong> 29/11/2025
                        </p>
                      </div>
                    </div>

                    {/* --- SECCIÓN DE BOTONES MEJORADA --- */}
                    <div className="pt-4 mt-4 border-t border-gray-200 flex items-center gap-2">

                      {/* Botón "Detalles" con estilo sólido y moderno */}
                      <button
                        onClick={() => setModalAbierto(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-sm bg-[#00324D] text-white hover:bg-[#004267] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      >
                        <FaRegFileAlt />
                        Detalles
                      </button>

                      {/* Botón "Inscribirse" con el mismo estilo mejorado */}
                      <button className="flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-sm bg-[#39A900] text-white hover:bg-lime-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                        <FaCheckCircle />
                        Inscribirse
                      </button>

                      {/* Botón de favorito con mejor área de clic */}
                      <button
                        onClick={handleFavorito}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-[2800px] mx-auto my-8 px-0">
              {[1, 2, 3, 4].map((i, index) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 
                 transition-all duration-300 hover:shadow-2xl hover:scale-105 
                 flex flex-col h-full min-h-[320px]"
                >
                  {/* Imagen ancha pero no muy alta */}
                  <div className="w-full h-[140px] sm:h-[160px] md:h-[180px] overflow-hidden">
                    <img
                      onClick={() => setModalAbierto(true)}
                      src={imagenesMosaico[index]}
                      alt={`Convocatoria ${i}`}
                      className="w-full h-full object-cover object-[20%] cursor-pointer transition-transform duration-300 hover:scale-110"
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
                        onClick={handleFavorito}
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


          </section>
        </main>
      </div>{" "}
      {/* Cierra max-w-7xl */}
    </div> // Cierra min-h-screen
  );
}
