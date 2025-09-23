'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  FaTags, FaSearchLocation, FaRegBookmark, FaSearch, FaStar, FaRegStar,
  FaCheckCircle, FaCalendarAlt, FaCalendarTimes, FaMobileAlt, FaGraduationCap,
  FaClock, FaRegFileAlt, FaImage, FaInfoCircle, FaCog
} from 'react-icons/fa';
import { Calendar, ChevronLeft, ChevronRight, LayoutGrid, MapPin, Moon, Sun, View } from 'lucide-react';
import Swal from 'sweetalert2';

import ModalConvocatoria from '../../../components/detalleConvo/detalleConvo'; // ajusta si tu ruta real difiere
import { getConvocatorias } from '../../api/convocatorias/routes';

// Tema
import { useTheme } from '../../ThemeContext';
import { getThemeStyles } from '../../themeStyles';

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

export default function ExplorarPage() {
  // === Estados ===
  const [categorias, setCategorias] = useState<{ id: number; name: string; description: string }[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number | ''>('');

  const [convocatorias, setConvocatorias] = useState<Convocatoria[]>([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const convocatoriasPorPagina = 12;

  // Estados UI
  const [vista, setVista] = useState<'Tarjeta' | 'Lista' | 'Tabla' | 'Mosaico'>('Tarjeta');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [destacado, setDestacado] = useState(false);
  const [convocatoriaSeleccionada, setConvocatoriaSeleccionada] = useState<Convocatoria | null>(null);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  // Tema
  const { modoOscuro, toggleModoOscuro } = useTheme();
  const styles = getThemeStyles(modoOscuro);

  // === Filtrado por categoría ===
  const convocatoriasFiltradas = useMemo(() => {
    if (!categoriaSeleccionada) return convocatorias;
    return convocatorias.filter((c) => c.lineId === categoriaSeleccionada);
  }, [convocatorias, categoriaSeleccionada]);

  // === Paginación con las filtradas ===
  const totalPaginas = useMemo(
    () => Math.max(1, Math.ceil(convocatoriasFiltradas.length / convocatoriasPorPagina)),
    [convocatoriasFiltradas.length]
  );

  const indiceInicio = (paginaActual - 1) * convocatoriasPorPagina;
  const indiceFin = indiceInicio + convocatoriasPorPagina;

  const convocatoriasPagina = useMemo(
    () => convocatoriasFiltradas.slice(indiceInicio, indiceFin),
    [convocatoriasFiltradas, indiceInicio, indiceFin]
  );

  // === Cargar categorías desde la API ===
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

  // === Cargar convocatorias desde la API ===
  useEffect(() => {
    (async () => {
      try {
        const data = await getConvocatorias();
        setConvocatorias(data?.data || []);
      } catch (e) {
        console.error('Error al cargar convocatorias', e);
      }
    })();
  }, []);

  // === Favoritos feedback ===
  const toggleFavorito = () => {
    const nuevo = !destacado;
    setDestacado(nuevo);
    Swal.fire({
      toast: true,
      icon: nuevo ? 'success' : 'warning',
      title: nuevo ? 'Agregada a favoritos' : 'Eliminada de favoritos',
      timer: 2000,
      showConfirmButton: false,
      position: 'bottom-end',
      background: modoOscuro ? '#0e1626' : '#fff',
      color: modoOscuro ? '#e5e7eb' : '#111827',
    });
  };

  const clampOrFull = (text?: string, isExpanded?: boolean) => {
    const cls = isExpanded ? '' : 'line-clamp-3';
    return <span className={`text-sm ${cls}`}>{text}</span>;
  };

  // aquí seguiría tu return con el JSX (header, filtros, tarjetas, lista, etc.)


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
                  placeholder="Buscar convocatorias, programas, becas..."
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
                <Link href="/public/explorar/" className={`flex items-center space-x-1 ${styles.navActive}`}>
                  <FaSearchLocation className="text-sm" />
                  <span>Explorar</span>
                </Link>
                <Link href="/usuario/favoritos" className={`flex items-center space-x-1 ${styles.nav}`}>
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

        {/* FILTROS */}
        <section
          className={`rounded-2xl p-4 mb-6 border transition-colors duration-500 ${modoOscuro
              ? "bg-[#121a2b] border-white/10"
              : "bg-white/80 border-gray-200/80"
            }`}>
          <div className="flex flex-wrap gap-x-6 gap-y-5 items-end">
            <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5">
              {/* Categoría */}
              <div className="flex flex-col">
                <label className={`flex items-center text-sm font-medium mb-2 gap-2 ${styles.textMuted}`}>
                  <LayoutGrid className="w-4 h-4" /> Categoría
                </label>
               <select
  value={categoriaSeleccionada}
  onChange={(e) => setCategoriaSeleccionada(Number(e.target.value) || "")}
  className={`w-full appearance-none rounded-xl px-4 py-3 text-sm cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md ${styles.input}`}
>
  <option value="">Todas las categorías</option>
  {categorias.map((cat) => (
    <option key={cat.id} value={cat.id}>
      {cat.name}
    </option>
  ))}
</select>

              </div>
              {/* Ubicación */}
              <div className="flex flex-col">
                <label className={`flex items-center text-sm font-medium mb-2 gap-2 ${styles.textMuted}`}>
                  <MapPin className="w-4 h-4" /> Ubicación
                </label>
                <select className={`w-full appearance-none rounded-xl px-4 py-3 text-sm cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md ${styles.input}`}>
                  <option>Todo el país</option>
                  <option>Bogotá</option>
                  <option>Medellín</option>
                  <option>Cali</option>
                  <option>Barranquilla</option>
                </select>
              </div>
              {/* Fecha */}
              <div className="flex flex-col">
                <label className={`flex items-center text-sm font-medium mb-2 gap-2 ${styles.textMuted}`}>
                  <Calendar className="w-4 h-4" /> Fecha de inicio
                </label>
                <select className={`w-full appearance-none rounded-xl px-4 py-3 text-sm cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md ${styles.input}`}>
                  <option>Cualquier fecha</option>
                  <option>Julio 2025</option>
                  <option>Agosto 2025</option>
                  <option>Septiembre 2025</option>
                </select>
              </div>
              {/* Visualización */}
              <div className="flex flex-col">
                <label className={`flex items-center text-sm font-medium mb-2 gap-2 ${styles.textMuted}`}>
                  <View className="w-4 h-4" /> Visualización
                </label>
                <select
                  value={vista}
                  onChange={(e) => setVista(e.target.value as any)}
                  className={`w-full appearance-none rounded-xl px-4 py-3 text-sm cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md ${styles.input}`}
                >
                  <option value="Tarjeta">Tarjeta</option>
                  <option value="Lista">Lista</option>
                  <option value="Tabla">Tabla</option>
                  <option value="Mosaico">Mosaico</option>
                </select>
              </div>
            </div>
          </div>
        </section>
        {/* VISTA TARJETA */}
        {vista === "Tarjeta" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-0 mb-8">
            {convocatoriasPagina.map((c, i) => {
              const key = `card-${indiceInicio + i}`;
              const isExpanded = expandedKey === key;
              return (
                <div
                  key={c.id ?? key}
                  className={`rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all hover:-translate-y-2 flex flex-col ${styles.card}`}
                >
                  {/* Imagen */}
                  <div className="overflow-hidden">
                    <img
                      onClick={() => {
                        setConvocatoriaSeleccionada(c);
                        setModalAbierto(true);
                      }}
                      src={c.imageUrl || "/img/default.jpg"}
                      alt={c.title}
                      className="w-full h-[200px] object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
                    />
                  </div>

                  {/* Contenido */}
                  <div className="p-5 flex flex-col justify-between flex-grow">
                    <div>
                      {/* 🔹 Título */}
                      <h4
                        className={`font-bold text-lg mb-3 flex items-center gap-2 ${modoOscuro ? "text-white" : "text-[#00324D]"
                          }`}
                      >
                        <FaMobileAlt
                          className={modoOscuro ? "text-white" : "text-[#00324D]"}
                        />
                        {c.title}
                      </h4>

                      {/* 🔹 Descripción */}
                      <div className={`mb-2 flex items-start gap-3 ${styles.textMuted}`}>
                        <FaGraduationCap
                          className={`text-xl mt-0.5 flex-shrink-0 ${modoOscuro ? "text-white" : "text-[#00324D]"
                            }`}
                        />
                        <span className="text-sm relative">
                          {isExpanded ? (
                            <>
                              {c.description}
                              <button
                                onClick={() => setExpandedKey(null)}
                                className={`ml-2 text-xs font-bold hover:scale-110 transition-transform ${modoOscuro ? "text-white" : "text-[#00324D]"
                                  }`}
                                title="Ver menos"
                              >
                                ▲
                              </button>
                            </>
                          ) : (
                            <>
                              <span className="line-clamp-3">{c.description}</span>
                              {c.description?.length > 100 && (
                                <button
                                  onClick={() => setExpandedKey(key)}
                                  className="absolute bottom-0 right-0 bg-gradient-to-l  dark:from-[#1a0526] px-1"
                                  title="Mostrar más"
                                >
                                  ...
                                </button>
                              )}
                            </>
                          )}
                        </span>
                      </div>

                      {/* 🔹 Fechas */}
                      <div
                        className={`flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm mb-4 ${styles.textMuted}`}
                      >
                        <span className="flex items-center gap-1.5">
                          <FaCalendarAlt
                            className={modoOscuro ? "text-white" : "text-[#00324D]"}
                          />
                          <strong>Apertura:</strong>{" "}
                          {c.openDate
                            ? new Date(c.openDate).toLocaleDateString()
                            : "—"}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <FaCalendarTimes
                            className={modoOscuro ? "text-white" : "text-[#00324D]"}
                          />
                          <strong>Cierre:</strong>{" "}
                          {c.closeDate
                            ? new Date(c.closeDate).toLocaleDateString()
                            : "—"}
                        </span>
                      </div>
                    </div>

                    {/* Botones */}
                    <div
                      className={`pt-4 mt-auto flex items-center gap-2 border-t ${styles.divider}`}
                    >
                      <button
                        onClick={() => {
                          setConvocatoriaSeleccionada(c);
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
                      <button
                        onClick={toggleFavorito}
                        className="group ml-auto p-2 rounded-md hover:bg-white/5 transition-colors"
                        title="Marcar como favorita"
                      >
                        {destacado ? (
                          <FaStar className="text-yellow-400 text-2xl transition-all group-hover:scale-125 group-hover:rotate-[360deg]" />
                        ) : (
                          <FaRegStar
                            className={`text-2xl transition-all group-hover:text-yellow-400 group-hover:scale-125 group-hover:rotate-[360deg] ${modoOscuro ? "text-white" : "text-[#00324D]"
                              }`}
                          />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}


        {/* VISTA LISTA */}
        {vista === "Lista" && (
          <div className="w-full">
            <div className="flex flex-col gap-6">
              {convocatoriasPagina.map((c, i) => {
                const key = `list-${indiceInicio + i}`;
                const isExpanded = expandedKey === key;
                return (
                  <div
                    key={c.id ?? key}
                    className={`relative flex flex-col md:flex-row rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 ${styles.card}`}
                  >
                    {/* Imagen */}
                    <div className="w-full md:w-[400px] h-[260px] flex-shrink-0 overflow-hidden">
                      <img
                        onClick={() => {
                          setConvocatoriaSeleccionada(c);
                          setModalAbierto(true);
                        }}
                        src={c.imageUrl || "/img/default.jpg"}
                        alt={c.title}
                        className="w-full h-full object-cover object-[20%] cursor-pointer transition-transform duration-300 hover:scale-110"
                      />
                    </div>

                    {/* Contenido */}
                    <div className="flex flex-col flex-grow p-6">
                      <div className="flex-grow">
                        {/* 🔹 Título */}
                        <h4
                          className={`text-xl font-bold flex items-center gap-3 ${modoOscuro ? "text-white" : "text-[#00324D]"
                            }`}
                        >
                          <FaMobileAlt
                            className={modoOscuro ? "text-white" : "text-[#00324D]"}
                          />
                          {c.title}
                        </h4>

                        <div className="my-4 border-t border-gray-300/60 dark:border-white/20" />

                        {/* 🔹 Descripción */}
                        <div
                          className={`text-sm flex items-start gap-3 ${styles.textMuted}`}
                        >
                          <FaGraduationCap
                            className={`text-xl flex-shrink-0 mt-0.5 ${modoOscuro ? "text-white" : "text-[#00324D]"
                              }`}
                          />
                          <span className="text-sm relative">
                            {isExpanded ? (
                              <>
                                {c.description}
                                <button
                                  onClick={() => setExpandedKey(null)}
                                  className={`ml-2 text-xs font-bold hover:scale-110 transition-transform ${modoOscuro ? "text-white" : "text-[#00324D]"
                                    }`}
                                  title="Ver menos"
                                >
                                  ▲
                                </button>
                              </>
                            ) : (
                              <>
                                <span className="line-clamp-3">{c.description}</span>
                                {c.description?.length > 120 && (
                                  <button
                                    onClick={() => setExpandedKey(key)}
                                    className="absolute bottom-0 right-0 bg-gradient-to-l  dark:from-[#1a0526] px-1"
                                    title="Mostrar más"
                                  >
                                    ...
                                  </button>
                                )}
                              </>
                            )}
                          </span>
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
                            {c.openDate
                              ? new Date(c.openDate).toLocaleDateString()
                              : "—"}
                          </span>
                          <span className="flex items-center gap-2">
                            <FaCalendarTimes
                              className={modoOscuro ? "text-white" : "text-[#00324D]"}
                            />
                            <strong>Cierre:</strong>{" "}
                            {c.closeDate
                              ? new Date(c.closeDate).toLocaleDateString()
                              : "—"}
                          </span>
                        </div>
                      </div>

                      {/* Botones */}
                      <div
                        className={`flex flex-wrap items-center gap-3 pt-4 mt-auto border-t ${styles.divider}`}
                      >
                        <button
                          onClick={() => {
                            setConvocatoriaSeleccionada(c);
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
                        <button
                          onClick={toggleFavorito}
                          className="group ml-auto p-2 rounded-md hover:bg-white/5 transition-colors"
                          title="Marcar como favorita"
                        >
                          {destacado ? (
                            <FaStar className="text-yellow-400 text-2xl transition-all group-hover:scale-125 group-hover:rotate-[360deg]" />
                          ) : (
                            <FaRegStar
                              className={`text-2xl transition-all group-hover:text-yellow-400 group-hover:scale-125 group-hover:rotate-[360deg] ${modoOscuro ? "text-white" : "text-[#00324D]"
                                }`}
                            />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {/* VISTA TABLA */}
        {vista === "Tabla" && (
          <div
            className={`rounded-2xl shadow-lg mt-6 overflow-x-auto border ${styles.divider}`}
          >
            <table className="w-full text-left border-collapse min-w-[1200px]">
              {/* 🔹 Encabezado */}
              <thead
                className={`${modoOscuro ? "bg-[#0e1626]" : "bg-[#00324D]"} text-white`}
              >
                <tr>
                  <th className="px-6 py-4 text-sm font-medium uppercase tracking-wider border w-[280px]">
                    <span className="flex items-center gap-2">
                      <FaImage /> Convocatoria
                    </span>
                  </th>
                  <th className="px-6 py-4 text-sm font-medium uppercase tracking-wider border w-[400px]">
                    <span className="flex items-center gap-2">
                      <FaInfoCircle /> Descripción
                    </span>
                  </th>
                  <th className="px-6 py-4 text-sm font-medium uppercase tracking-wider border w-[150px] text-center">
                    <span className="flex items-center justify-center gap-2">
                      <FaCalendarAlt /> Apertura
                    </span>
                  </th>
                  <th className="px-6 py-4 text-sm font-medium uppercase tracking-wider border w-[150px] text-center">
                    <span className="flex items-center justify-center gap-2">
                      <FaCalendarTimes /> Cierre
                    </span>
                  </th>
                  <th className="px-6 py-4 text-sm font-medium uppercase tracking-wider text-center border w-[220px]">
                    <span className="flex items-center justify-center gap-2">
                      <FaCog /> Acciones
                    </span>
                  </th>
                </tr>
              </thead>

              {/* 🔹 Cuerpo */}
              <tbody className={`${styles.textMuted}`}>
                {convocatoriasPagina.map((c, i) => {
                  const key = `table-${i}`;
                  const isExpanded = expandedKey === key;

                  return (
                    <tr
                      key={c.id ?? key}
                      className={`${modoOscuro ? "hover:bg-white/5" : "hover:bg-gray-50"
                        } transition-colors`}
                    >
                      {/* Convocatoria + título */}
                      <td className="px-6 py-4 align-middle border">
                        <div className="flex items-center gap-4">
                          <img
                            onClick={() => {
                              setConvocatoriaSeleccionada(c);
                              setModalAbierto(true);
                            }}
                            src={c.imageUrl || "/img/default.jpg"}
                            alt={c.title}
                            className="w-32 h-20 object-cover rounded-md flex-shrink-0 cursor-pointer"
                          />
                          <span
                            className={`font-semibold text-base ${modoOscuro ? "text-white" : "text-[#00324D]"
                              }`}
                          >
                            {c.title}
                          </span>
                        </div>
                      </td>

                      {/* Descripción */}
                      <td className="px-6 py-4 align-middle border">
                        <div className="text-sm relative">
                          {isExpanded ? (
                            <>
                              {c.description}
                              <button
                                onClick={() => setExpandedKey(null)}
                                className={`ml-2 text-xs font-bold hover:scale-110 transition-transform ${modoOscuro ? "text-white" : "text-[#00324D]"
                                  }`}
                                title="Ver menos"
                              >
                                ▲
                              </button>
                            </>
                          ) : (
                            <>
                              <span className="line-clamp-3">{c.description}</span>
                              {c.description?.length > 120 && (
                                <button
                                  onClick={() => setExpandedKey(key)}
                                  className="absolute bottom-0 right-0 bg-gradient-to-l  dark:from-[#0e1626] px-1"
                                  title="Mostrar más"
                                >
                                  ...
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>

                      {/* Apertura */}
                      <td className="px-6 py-4 align-middle border text-center">
                        <span className="flex items-center justify-center gap-2">
                          <FaCalendarAlt
                            className={modoOscuro ? "text-white" : "text-[#00324D]"}
                            size={14}
                          />
                          {c.openDate
                            ? new Date(c.openDate).toLocaleDateString()
                            : "—"}
                        </span>
                      </td>

                      {/* Cierre */}
                      <td className="px-6 py-4 align-middle border text-center">
                        <span className="flex items-center justify-center gap-2">
                          <FaCalendarTimes
                            className={modoOscuro ? "text-white" : "text-[#00324D]"}
                            size={14}
                          />
                          {c.closeDate
                            ? new Date(c.closeDate).toLocaleDateString()
                            : "—"}
                        </span>
                      </td>

                      {/* Acciones */}
                      <td className="px-6 py-4 align-middle border">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setConvocatoriaSeleccionada(c);
                              setModalAbierto(true);
                            }}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold ${styles.primaryButton}`}
                          >
                            <FaRegFileAlt /> Detalles
                          </button>
                          <button
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold ${styles.successButton}`}
                          >
                            <FaCheckCircle /> Inscribirse
                          </button>
                          <button
                            onClick={toggleFavorito}
                            className="group p-2 rounded-md hover:bg-white/5 transition-colors"
                            title="Marcar como favorita"
                          >
                            {destacado ? (
                              <FaStar className="text-yellow-400 text-xl transition-all group-hover:scale-125 group-hover:rotate-[360deg]" />
                            ) : (
                              <FaRegStar
                                className={`text-xl transition-all group-hover:text-yellow-400 group-hover:scale-125 group-hover:rotate-[360deg] ${modoOscuro ? "text-white" : "text-[#00324D]"
                                  }`}
                              />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}



        {/* VISTA MOSAICO */}
        {vista === "Mosaico" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 max-w-[2300px] mx-auto my-8 px-0">
            {convocatoriasPagina.map((c, i) => {
              const key = `mosaic-${indiceInicio + i}`;
              const isExpanded = expandedKey === key;
              return (
                <div
                  key={c.id ?? key}
                  className={`rounded-xl overflow-hidden transition-all hover:shadow-2xl hover:scale-105 flex flex-col h-full min-h-[320px] ${styles.card}`}
                >
                  {/* Imagen */}
                  <div className="w-full h-[160px] overflow-hidden">
                    <img
                      onClick={() => {
                        setConvocatoriaSeleccionada(c);
                        setModalAbierto(true);
                      }}
                      src={c.imageUrl || "/img/default.jpg"}
                      alt={c.title}
                      className="w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
                    />
                  </div>

                  {/* Contenido */}
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="flex-grow space-y-2">
                      {/* Título */}
                      <h4
                        className={`text-base font-semibold flex items-center gap-2 ${modoOscuro ? "text-white" : "text-[#00324D]"
                          }`}
                      >
                        <FaMobileAlt
                          className={modoOscuro ? "text-white" : "text-[#00324D]"}
                        />
                        {c.title}
                      </h4>

                      {/* Descripción */}
                      <div className="text-sm relative">
                        {isExpanded ? (
                          <>
                            {c.description}
                            <button
                              onClick={() => setExpandedKey(null)}
                              className={`ml-2 text-xs font-bold hover:scale-110 transition-transform ${modoOscuro ? "text-white" : "text-[#00324D]"
                                }`}
                              title="Ver menos"
                            >
                              ▲
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="line-clamp-3">{c.description}</span>
                            {c.description?.length > 120 && (
                              <button
                                onClick={() => setExpandedKey(key)}
                                className="absolute bottom-0 right-0 bg-gradient-to-l  dark:from-[#1a0526] px-1"
                                title="Mostrar más"
                              >
                                ...
                              </button>
                            )}
                          </>
                        )}
                      </div>

                      {/* Fechas */}
                      <div
                        className={`mt-3 flex items-center justify-between text-xs ${styles.textMuted} ${modoOscuro ? "bg-white/5" : "bg-gray-50"
                          } p-2 rounded`}
                      >
                        <span className="flex items-center gap-1">
                          <FaCalendarAlt
                            className={modoOscuro ? "text-white" : "text-[#00324D]"}
                          />
                          <span>
                            {c.openDate
                              ? new Date(c.openDate).toLocaleDateString()
                              : "—"}
                          </span>
                        </span>
                        <span className="flex items-center gap-1">
                          <FaClock
                            className={modoOscuro ? "text-white" : "text-[#00324D]"}
                          />
                          <span>
                            {c.closeDate
                              ? new Date(c.closeDate).toLocaleDateString()
                              : "—"}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Botones */}
                    <div
                      className={`mt-3 pt-3 flex items-center gap-2 border-t ${styles.divider}`}
                    >
                      <button
                        onClick={() => {
                          setConvocatoriaSeleccionada(c);
                          setModalAbierto(true);
                        }}
                        className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs ${styles.primaryButton}`}
                      >
                        <FaRegFileAlt size={12} /> Detalles
                      </button>

                      <button
                        className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs ${styles.successButton}`}
                      >
                        <FaCheckCircle size={12} /> Inscribirse
                      </button>

                      <button
                        onClick={toggleFavorito}
                        className="group ml-auto p-2 rounded-md hover:bg-white/5 transition-colors"
                        title="Marcar como favorita"
                      >
                        {destacado ? (
                          <FaStar className="text-yellow-400 text-2xl transition-all duration-300 transform group-hover:scale-125 group-hover:rotate-[360deg]" />
                        ) : (
                          <FaRegStar
                            className={`text-2xl transition-all group-hover:text-yellow-400 group-hover:scale-125 group-hover:rotate-[360deg] ${modoOscuro ? "text-white" : "text-[#00324D]"
                              }`}
                          />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
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
        convocatoria={convocatoriaSeleccionada}
      />
    </div>
  );
}
