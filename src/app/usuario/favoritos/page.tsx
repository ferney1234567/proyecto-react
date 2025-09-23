'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  FaTags, FaSearchLocation, FaRegBookmark, FaSearch, FaStar, FaRegStar,
  FaCheckCircle, FaCalendarAlt, FaCalendarTimes, FaMobileAlt, FaGraduationCap,
  FaRegFileAlt, FaTrashAlt
} from 'react-icons/fa';
import { Calendar, ChevronLeft, ChevronRight, LayoutGrid, ListIcon, MapPin, Moon, Sun } from 'lucide-react';
import Swal from 'sweetalert2';

import ModalConvocatoria from '../../../components/detalleConvo/detalleConvo'; // ajusta si tu ruta real difiere

// Tema
import { useTheme } from '../../ThemeContext';
import { getThemeStyles } from '../../themeStyles';

interface FavoritoItem {
  id: number;
  title: string;
  description: string;
  openDate?: string;
  closeDate?: string;
  imageUrl?: string;
  lineId?: number; // 👈 agregado para asociar categoría
}

const imagenesEje = [
  '/img/jove.jpg','/img/maxresdefault.jpg','/img/produ.jpg',
  '/img/ejeq.png','/img/eco.png','/img/eco2.png',
  '/img/ej.jpg','/img/fabricas.jpg','/img/R.jpg'
];

export default function FavoritosPage() {
  // === Categorías ===
  const [categorias, setCategorias] = useState<{ id: number; name: string; description: string }[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number | ''>('');

  // Mock de favoritos (puedes reemplazar por tu data real de API)
  const favoritos: FavoritoItem[] = useMemo(() => (
    Array.from({ length: 9 }, (_, i) => ({
      id: i + 1,
      title: `Curso / Convocatoria ${i + 1}`,
      description: "Descripción breve de la convocatoria o curso. Compatible con 'ver más'.",
      openDate: '2025-08-01',
      closeDate: '2025-08-30',
      imageUrl: imagenesEje[i % imagenesEje.length],
      lineId: (i % 3) + 1, // 👈 simula que cada favorito pertenece a una categoría diferente
    }))
  ), []);

  // === Filtrado por categoría ===
  const favoritosFiltrados = useMemo(() => {
    if (!categoriaSeleccionada) return favoritos;
    return favoritos.filter((f) => f.lineId === categoriaSeleccionada);
  }, [favoritos, categoriaSeleccionada]);

  // === Paginación ===
  const [paginaActual, setPaginaActual] = useState(1);
  const porPagina = 9;
  const totalPaginas = Math.max(1, Math.ceil(favoritosFiltrados.length / porPagina));
  const indiceInicio = (paginaActual - 1) * porPagina;
  const indiceFin = indiceInicio + porPagina;
  const listaPagina = favoritosFiltrados.slice(indiceInicio, indiceFin);

  // === UI ===
  const [vista, setVista] = useState<'tarjeta'|'lista'>('tarjeta');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [destacado, setDestacado] = useState(true);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [itemSeleccionado, setItemSeleccionado] = useState<FavoritoItem | null>(null);

  // Tema
  const { modoOscuro, toggleModoOscuro } = useTheme();
  const styles = getThemeStyles(modoOscuro);

  // === Cargar categorías desde API ===
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('http://localhost:4000/api/v1/lines');
        const json = await res.json();
        setCategorias(json.data || []);
      } catch (err) {
        console.error('Error cargando categorías:', err);
      }
    })();
  }, []);

  // === Acciones ===
  const handleEliminar = (idx: number) => {
    Swal.fire({
      toast: true,
      position: "bottom-end",
      icon: "success",
      title: "Eliminada de favoritos ✅",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      background: modoOscuro ? '#0e1626' : '#fff',
      color: modoOscuro ? '#e5e7eb' : '#111827',
    });
  };

  const clampOrFull = (text?: string, isExpanded?: boolean) => {
    const cls = isExpanded ? '' : 'line-clamp-3';
    return <span className={`text-sm ${cls}`}>{text}</span>;
  };

  function cambiarVista(arg0: string): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div className={`min-h-[100vh] transition-colors duration-500 ${styles.fondo}`}>
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 rounded-2xl ${styles.card}`}>
        {/* HEADER */}
        <header className="p-4">
          <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-6">
            {/* Logo + buscador */}
            <div className="flex flex-col gap-6 w-full">
              <div className="flex justify-start -mt-2">
                <img src="/img/sena.png" alt="Logo Izquierdo" className="h-16 w-auto object-contain" />
              </div>
              <div className="relative w-full max-w-xl">
                <input
                  type="text"
                  placeholder="Buscar en favoritos..."
                  className={`pl-12 pr-6 py-2 rounded-full w-full focus:outline-none focus:ring-2 ${styles.input}`}
                />
                <FaSearch className={`absolute left-4 top-3.5 ${styles.textMuted}`} />
              </div>
            </div>

            {/* Derecha: nav + modo oscuro */}
            <div className="flex flex-col items-end space-y-3">
              <div className="flex justify-end">
                <img src="/img/logo.png" alt="Logo Derecho" className="h-14 w-auto object-contain" />
              </div>

              <nav className="flex items-center space-x-6 border-t pt-3">
                <Link href="/menu" className={`flex items-center space-x-1 ${styles.nav}`}>
                  <FaTags className="text-sm" />
                  <span>Descubrir</span>
                </Link>
                <Link href="/public/explorar/" className={`flex items-center space-x-1 ${styles.nav}`}>
                  <FaSearchLocation className="text-sm" />
                  <span>Explorar</span>
                </Link>
                <Link href="/usuario/favoritos" className={`flex items-center space-x-1 ${styles.navActive}`}>
                  <FaRegBookmark className="text-sm" />
                  <span>Favoritos</span>
                </Link>
                <Link href="/usuario/perfilUser">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold shadow-md ${modoOscuro ? "bg-gray-600 text-white" : "bg-[#8f928f] text-white"}`}>
                    f
                  </div>
                </Link>
              </nav>

              <div className="fixed top-6 right-6 z-50">
                <button
                  onClick={toggleModoOscuro}
                  className={`p-4 rounded-full transition-all duration-500 hover:scale-110 shadow-lg ${modoOscuro
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

       {/* 🔹 SECTION FILTROS */}
<section
  className={`rounded-2xl p-4 mb-6 border transition-colors duration-500 ${
    modoOscuro
      ? "bg-[#121a2b] border-white/10"
      : "bg-white/80 border-gray-200/80"
  }`}
>
  <div className="flex flex-col md:flex-row flex-wrap gap-4 items-center justify-between">
    {/* Filtro Categoría */}
    <div className="flex flex-col flex-1 min-w-[220px]">
      <label className="text-sm font-medium mb-2 flex items-center gap-2">
        <LayoutGrid size={16} /> Categoría
      </label>
       <select
                value={categoriaSeleccionada}
                onChange={(e) => setCategoriaSeleccionada(Number(e.target.value) || '')}
                className={`w-full rounded-xl px-4 py-3 text-sm cursor-pointer transition-all duration-200 ${styles.input}`}
              >
                <option value="">Todas las categorías</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
    </div>

    {/* Filtro Ubicación */}
    <div className="flex flex-col flex-1 min-w-[220px]">
      <label className="text-sm font-medium mb-2 flex items-center gap-2">
        <MapPin size={16} /> Ubicación
      </label>
      <select
        className={`w-full rounded-xl px-4 py-3 text-sm cursor-pointer transition-all duration-200 ${styles.input}`}
      >
        <option>Todo el país</option>
        <option>Bogotá</option>
        <option>Medellín</option>
        <option>Cali</option>
      </select>
    </div>

    {/* Filtro Fecha */}
    <div className="flex flex-col flex-1 min-w-[220px]">
      <label className="text-sm font-medium mb-2 flex items-center gap-2">
        <Calendar size={16} /> Fecha
      </label>
      <select
        className={`w-full rounded-xl px-4 py-3 text-sm cursor-pointer transition-all duration-200 ${styles.input}`}
      >
        <option>Cualquier fecha</option>
        <option>Agosto 2025</option>
        <option>Septiembre 2025</option>
      </select>
    </div>

    {/* Botones vista */}
    <div
      className={`flex items-center gap-2 p-1 rounded-full transition-colors ${
        modoOscuro ? "bg-[#0e1626]" : "bg-gray-100"
      }`}
    >
      <button
        onClick={() => cambiarVista("tarjeta")}
        className={`p-2.5  rounded-full transition-all duration-300 ${
          vista === "tarjeta"
            ? "bg-emerald-500 text-white shadow-md"
            : "text-gray-500 hover:text-gray-800"
        }`}
      >
        <LayoutGrid size={20} className="relative top-[1px]" />
      </button>
      <button
        onClick={() => cambiarVista("lista")}
        className={`p-2.5  rounded-full transition-all duration-300 ${
          vista === "lista"
            ? "bg-emerald-500 text-white shadow-md"
            : "text-gray-500 hover:text-gray-800"
        }`}
      >
        <ListIcon size={18} className="relative top-[1px]" />
      </button>
    </div>
  </div>
</section>



       {/* VISTA TARJETA */}
{vista === 'tarjeta' && (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
    {listaPagina.map((item, idx) => {
      const key = `fav-card-${indiceInicio + idx}`;
      const isExpanded = expandedKey === key;
      return (
        <div
          key={item.id}
          className={`relative rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all hover:-translate-y-2 flex flex-col ${styles.card}`}
        >
          {/* Eliminar */}
          <button
            className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-red-100 transition-colors z-20"
            onClick={() => handleEliminar(idx)}
            title="Eliminar de favoritos"
          >
            <FaTrashAlt className="text-red-500 text-lg" />
          </button>

          {/* Imagen */}
          <div className="overflow-hidden">
            <img
              onClick={() => {
                setItemSeleccionado(item);
                setModalAbierto(true);
              }}
              src={item.imageUrl || "/img/default.jpg"}
              alt={item.title}
              className="w-full h-[220px] object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Contenido */}
          <div className="p-5 flex flex-col justify-between flex-grow">
            <div>
              {/* 🔹 Título con ícono */}
              <h4
                className={`font-bold text-lg mb-3 flex items-center gap-2 ${
                  modoOscuro ? "text-white" : "text-[#00324D]"
                }`}
              >
                <FaMobileAlt
                  className={modoOscuro ? "text-white" : "text-[#00324D]"}
                />
                {item.title}
              </h4>

              {/* 🔹 Descripción con ícono */}
              <div
                className={`mb-2 flex items-start gap-3 ${styles.textMuted}`}
              >
                <FaGraduationCap
                  className={`text-xl mt-0.5 flex-shrink-0 ${
                    modoOscuro ? "text-white" : "text-[#00324D]"
                  }`}
                />
                <div className="text-sm">
                  {clampOrFull(item.description, isExpanded)}
                  {item.description?.length > 100 && (
                    <button
                      onClick={() =>
                        setExpandedKey(isExpanded ? null : key)
                      }
                      className={`block mt-1 text-sm font-semibold hover:underline ${
                        modoOscuro
                          ? "text-white"
                          : "text-[#00324D]"
                      }`}
                    >
                      {isExpanded ? "Ver menos ▲" : "Ver más ▼"}
                    </button>
                  )}
                </div>
              </div>

              {/* 🔹 Fechas con íconos */}
              <div
                className={`flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm mb-4 ${styles.textMuted}`}
              >
                <span className="flex items-center gap-1.5">
                  <FaCalendarAlt
                    className={modoOscuro ? "text-white" : "text-[#00324D]"}
                  />
                  <strong>Apertura:</strong>{" "}
                  {item.openDate
                    ? new Date(item.openDate).toLocaleDateString()
                    : "—"}
                </span>
                <span className="flex items-center gap-1.5">
                  <FaCalendarTimes
                    className={modoOscuro ? "text-white" : "text-[#00324D]"}
                  />
                  <strong>Cierre:</strong>{" "}
                  {item.closeDate
                    ? new Date(item.closeDate).toLocaleDateString()
                    : "—"}
                </span>
              </div>
            </div>

            {/* Botones → se quedan igual */}
            <div
              className={`pt-4 mt-auto flex items-center gap-2 border-t ${styles.divider}`}
            >
              <button
                onClick={() => {
                  setItemSeleccionado(item);
                  setModalAbierto(true);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-sm ${styles.primaryButton}`}
              >
                <FaRegFileAlt /> Detalles
              </button>
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-sm ${styles.successButton}`}
              >
                <FaCheckCircle /> Inscribirse
              </button>
            </div>
          </div>
        </div>
      );
    })}
  </div>
)}


       {/* VISTA LISTA */}
{vista === 'lista' && (
  <div className="w-full">
    <div className="flex flex-col gap-6">
      {listaPagina.map((item, idx) => {
        const key = `fav-list-${indiceInicio + idx}`;
        const isExpanded = expandedKey === key;
        return (
          <div
            key={item.id}
            className={`relative flex flex-col md:flex-row rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 ${styles.card}`}
          >
            {/* Eliminar */}
            <button
              className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-red-100 transition-colors z-20"
              onClick={() => handleEliminar(idx)}
              title="Eliminar de favoritos"
            >
              <FaTrashAlt className="text-red-500 text-lg" />
            </button>

            {/* Imagen */}
            <div className="w-full md:w-[400px] h-[260px] flex-shrink-0 overflow-hidden">
              <img
                onClick={() => {
                  setItemSeleccionado(item);
                  setModalAbierto(true);
                }}
                src={item.imageUrl || "/img/default.jpg"}
                alt={item.title}
                className="w-full h-full object-cover object-[20%] cursor-pointer transition-transform duration-300 hover:scale-110"
              />
            </div>

            {/* Contenido */}
            <div className="flex flex-col flex-grow p-6">
              <div className="flex-grow">
                {/* 🔹 Título */}
                <h4
                  className={`text-xl font-bold flex items-center gap-3 ${
                    modoOscuro ? "text-white" : "text-[#00324D]"
                  }`}
                >
                  <FaMobileAlt
                    className={modoOscuro ? "text-white" : "text-[#00324D]"}
                  />
                  {item.title}
                </h4>

                <div className={`my-4 border-t ${styles.divider}`} />

                {/* 🔹 Descripción */}
                <div className="space-y-4">
                  <div
                    className={`text-sm flex items-start gap-3 ${styles.textMuted}`}
                  >
                    <FaGraduationCap
                      className={`text-xl flex-shrink-0 mt-0.5 ${
                        modoOscuro ? "text-white" : "text-[#00324D]"
                      }`}
                    />
                    <div className="text-sm">
                      {clampOrFull(item.description, isExpanded)}
                      {item.description?.length > 120 && (
                        <button
                          onClick={() =>
                            setExpandedKey(isExpanded ? null : key)
                          }
                          className={`block mt-1 text-sm font-semibold hover:underline ${
                            modoOscuro
                              ? "text-white"
                              : "text-[#00324D]"
                          }`}
                        >
                          {isExpanded ? "Ver menos ▲" : "Ver más ▼"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 🔹 Fechas */}
                  <div
                    className={`flex flex-wrap gap-x-6 gap-y-2 text-sm ${styles.textMuted}`}
                  >
                    <span className="flex items-center gap-2">
                      <FaCalendarAlt
                        className={modoOscuro ? "text-white" : "text-[#00324D]"}
                      />
                      <strong>Apertura:</strong>{" "}
                      {item.openDate
                        ? new Date(item.openDate).toLocaleDateString()
                        : "—"}
                    </span>
                    <span className="flex items-center gap-2">
                      <FaCalendarTimes
                        className={modoOscuro ? "text-white" : "text-[#00324D]"}
                      />
                      <strong>Cierre:</strong>{" "}
                      {item.closeDate
                        ? new Date(item.closeDate).toLocaleDateString()
                        : "—"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botones → se mantienen igual */}
              <div
                className={`flex flex-wrap items-center gap-3 pt-4 mt-auto border-t ${styles.divider}`}
              >
                <button
                  onClick={() => {
                    setItemSeleccionado(item);
                    setModalAbierto(true);
                  }}
                  className={`flex items-center gap-2 px-5 py-2 rounded-md font-semibold text-sm ${styles.primaryButton}`}
                >
                  <FaRegFileAlt /> Detalles
                </button>
                <button
                  className={`flex items-center gap-2 px-5 py-2 rounded-md font-semibold text-sm ${styles.successButton}`}
                >
                  <FaCheckCircle /> Inscribirse
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
)}

        {/* PAGINACIÓN */}
        <div className="flex justify-center items-center gap-3 mt-8 flex-wrap">
          <button
            className={`flex items-center justify-center gap-2 px-4 py-2 font-semibold rounded-xl shadow-sm transition-all disabled:opacity-50 ${styles.button}`}
            disabled={paginaActual === 1}
            onClick={() => setPaginaActual(paginaActual - 1)}
          >
            <ChevronLeft size={18} /> Anterior
          </button>

          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              className={`flex items-center justify-center w-11 h-11 font-bold rounded-xl transition-all ${paginaActual === num ? styles.primaryButton : styles.button}`}
              onClick={() => setPaginaActual(num)}
            >
              {num}
            </button>
          ))}

          <button
            className={`flex items-center justify-center gap-2 px-4 py-2 font-semibold rounded-xl shadow-sm transition-all disabled:opacity-50 ${styles.button}`}
            disabled={paginaActual === totalPaginas}
            onClick={() => setPaginaActual(paginaActual + 1)}
          >
            Siguiente <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <ModalConvocatoria
        modalAbierto={modalAbierto}
        cerrarModal={() => setModalAbierto(false)}
        convocatoria={itemSeleccionado as any}
      />
    </div>
  );
}
