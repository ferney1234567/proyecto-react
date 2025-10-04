'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  FaTags, FaSearchLocation, FaRegBookmark, FaSearch,
  FaCheckCircle, FaCalendarAlt, FaCalendarTimes, FaMobileAlt,
  FaGraduationCap, FaRegFileAlt,
  FaUserShield
} from 'react-icons/fa';
import {
  Calendar, ChevronLeft, ChevronRight, LayoutGrid, ListIcon,
  MapPin, Moon, RefreshCcw, Sun,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { FaTrash } from "react-icons/fa";

import Swal from "sweetalert2";

import ModalConvocatoria from '../../../components/detalleConvo/detalleConvo';
import { useTheme } from '../../ThemeContext';
import { getThemeStyles } from '../../themeStyles';

/* ============================
   Tipos de datos
============================ */
interface Convocatoria {
  favId: number;
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

interface Categoria {
  id: number;
  name: string;
  description?: string;
}

/* ============================
   Componente principal
============================ */
export default function FavoritosPage() {
  /* ----------------------------
     Estado base
  ---------------------------- */
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number | ''>('');
  const [convocatorias, setConvocatorias] = useState<Convocatoria[]>([]);
  const [usuario, setUsuario] = useState<any>(null);

  /* ----------------------------
     Estado de UI
  ---------------------------- */
  const [busqueda, setBusqueda] = useState('');
  const [vista, setVista] = useState<'tarjeta' | 'lista'>('tarjeta');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [itemSeleccionado, setItemSeleccionado] = useState<Convocatoria | null>(null);



  const [mostrarZoom, setMostrarZoom] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  const toggleZoomMenu = () => setMostrarZoom(!mostrarZoom);

  const aumentarTexto = () => setFontSize((prev) => prev + 2);
  const disminuirTexto = () => setFontSize((prev) => Math.max(10, prev - 2));
  const resetTexto = () => setFontSize(16);
  // Datos
  /* ----------------------------
     Paginación
  ---------------------------- */
  const [paginaActual, setPaginaActual] = useState(1);
  const porPagina = 9;

  /* ----------------------------
     Tema
  ---------------------------- */
  const { modoOscuro, toggleModoOscuro } = useTheme();
  const styles = getThemeStyles(modoOscuro);

  /* ============================
     Efectos: cargar datos
  ============================ */
  // Cargar convocatorias
  // En tu useEffect de favoritos
  const getUserId = (u: any) => {
    if (!u) return null;
    return u.id ?? u.uId ?? u.uid ?? u.userId ?? null;
  };

  useEffect(() => {
    (async () => {
      const uid = getUserId(usuario);
      if (!uid) return;
      try {
        const res = await fetch('http://localhost:4000/api/v1/favorites');
        const json = await res.json();

        // Filtrar por usuario
        const favs = (json.data || []).filter((f: any) =>
          Number(f.userId ?? f.user?.id) === Number(uid)
        );

        // Mapear para tener convocatoria + id de favorito
        const calls = favs.map((f: any) => ({
          ...f.call,         // datos de la convocatoria
          favId: f.id        // id del favorito en BD
        }));

        setConvocatorias(calls);
      } catch (err) {
        console.error('❌ Error cargando favoritos', err);
      }
    })();
  }, [usuario]);



  // Cargar categorías
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('http://localhost:4000/api/v1/lines');
        const json = await res.json();
        setCategorias(json.data || []);
      } catch (err) {
        console.error('Error cargando categorías', err);
      }
    })();
  }, []);

  // Cargar usuario desde localStorage
  useEffect(() => {
    const u = localStorage.getItem('usuario');
    if (u) setUsuario(JSON.parse(u));
  }, []);

  /* ============================
     Derivados: filtros y listas
  ============================ */


  const convocatoriasUsuario = convocatorias;





  // Estado extra para filtro de fecha
  const [filtroFecha, setFiltroFecha] = useState("todas");

  // 1. Filtrar por categoría
  const filtradasPorCategoria = useMemo(() => {
    if (!categoriaSeleccionada) return convocatoriasUsuario;
    return convocatoriasUsuario.filter((c) => c.lineId === categoriaSeleccionada);
  }, [convocatoriasUsuario, categoriaSeleccionada]);

  // 2. Filtrar por búsqueda
  const filtradasPorBusqueda = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return filtradasPorCategoria;
    return filtradasPorCategoria.filter((c) => {
      const t = (c.title || '').toLowerCase();
      const d = (c.description || '').toLowerCase();
      return t.includes(q) || d.includes(q);
    });
  }, [filtradasPorCategoria, busqueda]);

  // 3. Filtrar por fecha
  const filtradasPorFecha = useMemo(() => {
    const hoy = new Date();
    switch (filtroFecha) {
      case "abiertas":
        return filtradasPorBusqueda.filter(c =>
          new Date(c.openDate) <= hoy && new Date(c.closeDate) >= hoy
        );
      case "proximas":
        return filtradasPorBusqueda.filter(c => new Date(c.openDate) > hoy);
      case "cerradas":
        return filtradasPorBusqueda.filter(c => new Date(c.closeDate) < hoy);
      default:
        return filtradasPorBusqueda;
    }
  }, [filtradasPorBusqueda, filtroFecha]);

  // 4. Ordenar
  const [orden, setOrden] = useState("recientes");

  const ordenadas = useMemo(() => {
    const lista = [...filtradasPorFecha];
    switch (orden) {
      case "recientes":
        return lista.sort((a, b) => new Date(b.openDate).getTime() - new Date(a.openDate).getTime());
      case "antiguos":
        return lista.sort((a, b) => new Date(a.openDate).getTime() - new Date(b.openDate).getTime());
      case "cierreProximo":
        return lista.sort((a, b) => new Date(a.closeDate).getTime() - new Date(b.closeDate).getTime());
      case "cierreLejano":
        return lista.sort((a, b) => new Date(b.closeDate).getTime() - new Date(a.closeDate).getTime());
      case "tituloAZ":
        return lista.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
      case "tituloZA":
        return lista.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
      default:
        return lista;
    }
  }, [filtradasPorFecha, orden]);

  // 5. Paginación
  const indiceInicio = (paginaActual - 1) * porPagina;
  const indiceFin = indiceInicio + porPagina;
  const totalPaginas = Math.max(1, Math.ceil(ordenadas.length / porPagina));
  const convocatoriasPagina = ordenadas.slice(indiceInicio, indiceFin);


  // Reset de página si cambian filtros/búsqueda
  useEffect(() => {
    setPaginaActual(1);
  }, [categoriaSeleccionada, busqueda]);

  /* ============================
     Helpers
  ============================ */
  const clampOrFull = (text?: string, isExpanded?: boolean) => {
    if (!text) return <span className="text-sm">—</span>;
    const cls = isExpanded ? '' : 'line-clamp-3';
    return <span className={`text-sm ${cls}`}>{text}</span>;
  };

  const cambiarVista = (v: 'tarjeta' | 'lista') => setVista(v);

  const obtenerInicial = (nombre: string) => (nombre ? nombre.charAt(0).toUpperCase() : '?');

  const fmt = (dt?: string) => {
    if (!dt) return '—';
    try {
      return new Date(dt).toLocaleDateString();
    } catch {
      return '—';
    }
  };

  const handleEliminarFavorito = async (favId: number) => {
    try {
      await fetch(`http://localhost:4000/api/v1/favorites/${favId}`, {
        method: "DELETE",
      });

      // Quitar del estado local
      setConvocatorias((prev) => prev.filter((c) => c.favId !== favId));

      Swal.fire({
        title: "✅ Eliminado",
        text: "El favorito se eliminó correctamente.",
        icon: "success",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#ef4444",
        background: "#fff",
      });
    } catch (err) {
      console.error("❌ Error eliminando favorito", err);
      Swal.fire({
        title: "Error",
        text: "No se pudo eliminar el favorito. Inténtalo de nuevo.",
        icon: "error",
        confirmButtonText: "Cerrar",
        confirmButtonColor: "#ef4444",
      });
    }
  };



  /* ============================
     Render
  ============================ */
  return (
    <div
      className={`min-h-[100vh] transition-colors duration-500 ${styles.fondo}`}
      style={{ fontSize: `${fontSize}px` }}
    >
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 rounded-2xl ${styles.card}`}>
        {/* ========================
            HEADER
        ======================== */}
        <header className="p-4">
          <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-6">
            {/* Izquierda: logo + búsqueda */}
            <div className="flex flex-col gap-6 w-full">
              <div className="flex justify-start -mt-2">
                <img src="/img/sena.png" alt="Logo Izquierdo" className="h-16 w-auto object-contain" />
              </div>

              {/* Buscador */}
              <div className="relative w-full max-w-xl">
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar en mis convocatorias..."
                  className={`pl-12 pr-6 py-2 rounded-full w-full focus:outline-none focus:ring-2 ${styles.input}`}
                />
                <FaSearch className={`absolute left-4 top-3.5 ${styles.textMuted}`} />
              </div>
            </div>

            {/* Derecha: nav + avatar + modo oscuro */}
            <div className="flex flex-col items-end space-y-3 min-w-[240px]">
              <div className="flex justify-end">
                <img src="/img/logo.png" alt="Logo Derecho" className="h-14 w-auto object-contain" />
              </div>

              <nav className="flex items-center space-x-6 border-t pt-3">
                <Link href="/menu" className={`flex items-center space-x-1 ${styles.nav}`}>
                  <FaTags className="text-sm" />
                  <span>Descubrir</span>
                </Link>

                <Link href="/public/explorar" className={`flex items-center space-x-1 ${styles.nav}`}>
                  <FaSearchLocation className="text-sm" />
                  <span>Explorar</span>
                </Link>

                <Link href="/usuario/favoritos" className={`flex items-center space-x-1 ${styles.navActive}`}>
                  <FaRegBookmark className="text-sm" />
                  <span>Favoritos</span>


                </Link>

                 {/* 👇 Botón solo para administradores */}
  {typeof window !== "undefined" &&
    (localStorage.getItem("rol") === "admin" ||
      localStorage.getItem("rol") === "administrador" ||
      localStorage.getItem("rol") === "2") && (
      <Link href="/admin/menuadmin" className={`flex items-center space-x-1 ${styles.nav}`}>
        <FaUserShield className="text-sm" />
        <span>Admin</span>
      </Link>
    )}


                {/* Avatar */}
                <Link href="/usuario/perfilUser">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center font-bold shadow-md ${modoOscuro ? 'bg-gray-600 text-white' : 'bg-[#8f928f] text-white'
                      }`}
                    title={usuario?.name || 'Usuario'}
                  >
                    {obtenerInicial(usuario?.name)}
                  </div>
                </Link>
              </nav>

              {/* Modo oscuro */}
              {/* Controles de UI: modo oscuro + zoom */}
              <div className="fixed top-6 right-6 z-50 flex flex-col space-y-3">
                {/* Botón modo oscuro */}
                <button
                  onClick={toggleModoOscuro}
                  className={`p-4 rounded-full transition-all duration-500 hover:scale-110 shadow-lg ${modoOscuro
                      ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600'
                      : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                    }`}
                  title="Cambiar modo"
                >
                  {modoOscuro ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
                </button>

                {/* Botón principal menú de zoom */}
                <button
                  onClick={toggleZoomMenu}
                  className={`p-4 rounded-full transition-all duration-500 hover:scale-110 shadow-lg ${modoOscuro
                      ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600'
                      : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                    }`}
                  title="Opciones de texto"
                >
                  <ZoomIn className="h-6 w-6" />
                </button>

                {/* Botones secundarios (se muestran solo si mostrarZoom = true) */}
                {mostrarZoom && (
                  <div className="flex flex-col space-y-3 mt-2 animate-fade-in">
                    <button
                      onClick={aumentarTexto}
                      className={`p-4 rounded-full transition-all duration-500 hover:scale-110 shadow-lg ${modoOscuro
                          ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600'
                          : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                        }`}
                      title="Aumentar texto"
                    >
                      <ZoomIn className="h-6 w-6" />
                    </button>

                    <button
                      onClick={resetTexto}
                      className={`p-4 rounded-full transition-all duration-500 hover:scale-110 shadow-lg ${modoOscuro
                          ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600'
                          : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                        }`}
                      title="Restablecer tamaño"
                    >
                      <RefreshCcw className="h-6 w-6" />
                    </button>

                    <button
                      onClick={disminuirTexto}
                      className={`p-4 rounded-full transition-all duration-500 hover:scale-110 shadow-lg ${modoOscuro
                          ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600'
                          : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                        }`}
                      title="Disminuir texto"
                    >
                      <ZoomOut className="h-6 w-6" />
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        </header>

      <section
  className={`rounded-2xl p-4 mb-6 border transition-colors duration-500 ${
    modoOscuro ? "bg-[#121a2b] border-white/10" : "bg-white/80 border-gray-200/80"
  }`}
  style={{ fontSize: `${fontSize}px` }} // 🔹 Escala global
>
  <div className="flex flex-wrap gap-4 items-end justify-between">
    {/* Filtro Categoría */}
    <div className="flex flex-col flex-1 min-w-[220px]">
      <label
        className={`mb-2 flex items-center gap-2 font-medium ${styles.textMuted}`}
        style={{ fontSize: "0.95em" }}
      >
        <LayoutGrid style={{ fontSize: "1em" }} /> Categoría
      </label>
      <select
        value={categoriaSeleccionada}
        onChange={(e) => setCategoriaSeleccionada(Number(e.target.value) || "")}
        className={`appearance-none w-full rounded-xl px-4 py-2.5 cursor-pointer transition-all duration-200 ${styles.input}`}
        style={{ fontSize: "0.9em" }}
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
      <label
        className={`mb-2 flex items-center gap-2 font-medium ${styles.textMuted}`}
        style={{ fontSize: "0.95em" }}
      >
        <MapPin style={{ fontSize: "1em" }} /> Ubicación
      </label>
      <select
        className={`appearance-none w-full rounded-xl px-4 py-2.5 cursor-pointer ${styles.input}`}
        style={{ fontSize: "0.9em" }}
      >
        <option>Todo el país</option>
        <option>Bogotá</option>
        <option>Medellín</option>
        <option>Cali</option>
      </select>
    </div>

    {/* Filtro Fecha */}
    <div className="flex flex-col flex-1 min-w-[220px]">
      <label
        className={`mb-2 flex items-center gap-2 font-medium ${styles.textMuted}`}
        style={{ fontSize: "0.95em" }}
      >
        <Calendar style={{ fontSize: "1em" }} /> Fecha
      </label>
      <select
        value={filtroFecha}
        onChange={(e) => setFiltroFecha(e.target.value)}
        className={`appearance-none w-full rounded-xl px-4 py-2.5 cursor-pointer transition-all duration-200 ${styles.input}`}
        style={{ fontSize: "0.9em" }}
      >
        <option value="todas">Todas las fechas</option>
        <option value="abiertas">Abiertas ahora</option>
        <option value="proximas">Próximas</option>
        <option value="cerradas">Cerradas</option>
      </select>
    </div>

    {/* Filtro Ordenar por */}
    <div className="flex flex-col flex-1 min-w-[220px]">
      <label
        className={`mb-2 flex items-center gap-2 font-medium ${styles.textMuted}`}
        style={{ fontSize: "0.95em" }}
      >
        <FaRegBookmark style={{ fontSize: "1em" }} /> Ordenar por
      </label>
      <select
        value={orden}
        onChange={(e) => setOrden(e.target.value)}
        className={`appearance-none w-full rounded-xl px-4 py-2.5 cursor-pointer transition-all duration-200 ${styles.input}`}
        style={{ fontSize: "0.9em" }}
      >
        <option value="recientes">Más recientes (apertura)</option>
        <option value="antiguos">Más antiguos (apertura)</option>
        <option value="cierreProximo">Cierre más próximo</option>
        <option value="cierreLejano">Cierre más lejano</option>
        <option value="tituloAZ">Título A–Z</option>
        <option value="tituloZA">Título Z–A</option>
      </select>
    </div>

    {/* Botones vista */}
    <div
      className={`flex items-center gap-2 p-1 rounded-full transition-colors ${
        modoOscuro ? "bg-[#0e1626]" : "bg-gray-100"
      }`}
      style={{ fontSize: "1em" }}
    >
      <button
        onClick={() => cambiarVista("tarjeta")}
        className={`p-2.5 rounded-full transition-all duration-300 ${
          vista === "tarjeta"
            ? "bg-emerald-500 text-white shadow-md"
            : "text-gray-500 hover:text-gray-800"
        }`}
        title="Vista en tarjetas"
      >
        <LayoutGrid style={{ fontSize: "1.1em" }} />
      </button>
      <button
        onClick={() => cambiarVista("lista")}
        className={`p-2.5 rounded-full transition-all duration-300 ${
          vista === "lista"
            ? "bg-emerald-500 text-white shadow-md"
            : "text-gray-500 hover:text-gray-800"
        }`}
        title="Vista en lista"
      >
        <ListIcon style={{ fontSize: "1.1em" }} />
      </button>
    </div>
  </div>
</section>




      {/* ========================
    CONTENIDO: TARJETAS
======================== */}
{vista === "tarjeta" && (
  <div
    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8"
    style={{ fontSize: `${fontSize}px` }} // 🔹 Escala global
  >
    {convocatoriasPagina.map((c, idx) => {
      const key = `conv-card-${indiceInicio + idx}`;
      return (
        <div
          key={c.id ?? key}
          className={`relative rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all hover:-translate-y-2 flex flex-col ${styles.card}`}
        >
          {/* Botón eliminar favorito */}
          <button
            onClick={() => handleEliminarFavorito(c.favId)}
            className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:scale-110 transition-transform z-10"
            title="Eliminar de favoritos"
            style={{ fontSize: "1em" }}
          >
            <FaTrash className="text-red-600" style={{ fontSize: "1em" }} />
          </button>

          {/* Imagen */}
          <div className="overflow-hidden">
            <img
              onClick={() => {
                setItemSeleccionado(c);
                setModalAbierto(true);
              }}
              src={c.imageUrl || "/img/default.jpg"}
              alt={c.title}
              className="w-full h-[220px] object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Contenido */}
          <div className="p-5 flex flex-col justify-between flex-grow">
            {/* Título */}
            <h4
              className={`font-bold mb-3 flex items-center gap-2 ${
                modoOscuro ? "text-white" : "text-[#00324D]"
              }`}
              style={{ fontSize: "1.05em" }}
            >
              <FaMobileAlt
                className={modoOscuro ? "text-white" : "text-[#00324D]"}
                style={{ fontSize: "1em" }}
              />
              {c.title || "—"}
            </h4>

            {/* Descripción */}
            <div
              className={`mb-2 flex items-start gap-3 ${styles.textMuted}`}
              style={{ fontSize: "0.95em" }}
            >
              <FaGraduationCap
                className={`mt-0.5 flex-shrink-0 ${
                  modoOscuro ? "text-white" : "text-[#00324D]"
                }`}
                style={{ fontSize: "1em" }}
              />
              <div>
                {c.description && c.description.length > 140
                  ? `${c.description.slice(0, 140)}...`
                  : c.description || "—"}
              </div>
            </div>

            {/* Fechas */}
            <div
              className={`flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 ${styles.textMuted}`}
              style={{ fontSize: "0.9em" }}
            >
              <span className="flex items-center gap-1.5">
                <FaCalendarAlt
                  className={modoOscuro ? "text-white" : "text-[#00324D]"}
                  style={{ fontSize: "1em" }}
                />
                <strong>Apertura:</strong> {fmt(c.openDate)}
              </span>
              <span className="flex items-center gap-1.5">
                <FaCalendarTimes
                  className={modoOscuro ? "text-white" : "text-[#00324D]"}
                  style={{ fontSize: "1em" }}
                />
                <strong>Cierre:</strong> {fmt(c.closeDate)}
              </span>
            </div>

            {/* Botones */}
            <div
              className={`pt-4 mt-auto flex items-center gap-2 border-t ${styles.divider}`}
              style={{ fontSize: "0.9em" }}
            >
              <button
                onClick={() => {
                  setItemSeleccionado(c);
                  setModalAbierto(true);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold ${styles.primaryButton}`}
                style={{ fontSize: "0.95em" }}
              >
                <FaRegFileAlt style={{ fontSize: "1em" }} /> Detalles
              </button>
              <a
                href={c.callLink || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold ${styles.successButton}`}
                style={{ fontSize: "0.95em" }}
              >
                <FaCheckCircle style={{ fontSize: "1em" }} /> Inscribirse
              </a>
            </div>
          </div>
        </div>
      );
    })}
  </div>
)}


      {/* ========================
    CONTENIDO: LISTA
======================== */}
{vista === "lista" && (
  <div className="w-full" style={{ fontSize: `${fontSize}px` }}> 
    <div className="flex flex-col gap-6">
      {convocatoriasPagina.map((c, idx) => {
        const key = `conv-list-${indiceInicio + idx}`;
        return (
          <div
            key={c.id ?? key}
            className={`relative flex flex-col md:flex-row rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 ${styles.card}`}
          >
            {/* Botón eliminar */}
            <button
              onClick={() => handleEliminarFavorito(c.favId)}
              className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:scale-110 transition-transform z-10"
              title="Eliminar de favoritos"
              style={{ fontSize: "1em" }}
            >
              <FaTrash className="text-red-600" style={{ fontSize: "1em" }} />
            </button>

            {/* Imagen */}
            <div className="w-full md:w-[400px] h-[260px] flex-shrink-0 overflow-hidden">
              <img
                onClick={() => {
                  setItemSeleccionado(c);
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
                {/* Título */}
                <h4
                  className={`font-bold flex items-center gap-3 ${
                    modoOscuro ? "text-white" : "text-[#00324D]"
                  }`}
                  style={{ fontSize: "1.2em" }}
                >
                  <FaMobileAlt
                    className={modoOscuro ? "text-white" : "text-[#00324D]"}
                    style={{ fontSize: "1em" }}
                  />
                  {c.title || "—"}
                </h4>

                <div className={`my-4 border-t ${styles.divider}`} />

                {/* Descripción */}
                <div className="space-y-4">
                  <div
                    className={`flex items-start gap-3 ${styles.textMuted}`}
                    style={{ fontSize: "0.95em" }}
                  >
                    <FaGraduationCap
                      className={`flex-shrink-0 mt-0.5 ${
                        modoOscuro ? "text-white" : "text-[#00324D]"
                      }`}
                      style={{ fontSize: "1.1em" }}
                    />
                    <div>
                      {c.description && c.description.length > 200
                        ? `${c.description.slice(0, 200)}...`
                        : c.description || "—"}
                    </div>
                  </div>

                  {/* Fechas */}
                  <div
                    className={`flex flex-wrap gap-x-6 gap-y-2 ${styles.textMuted}`}
                    style={{ fontSize: "0.9em" }}
                  >
                    <span className="flex items-center gap-2">
                      <FaCalendarAlt
                        className={modoOscuro ? "text-white" : "text-[#00324D]"}
                        style={{ fontSize: "1em" }}
                      />
                      <strong>Apertura:</strong> {fmt(c.openDate)}
                    </span>
                    <span className="flex items-center gap-2">
                      <FaCalendarTimes
                        className={modoOscuro ? "text-white" : "text-[#00324D]"}
                        style={{ fontSize: "1em" }}
                      />
                      <strong>Cierre:</strong> {fmt(c.closeDate)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div
                className={`flex flex-wrap items-center gap-3 pt-4 mt-auto border-t ${styles.divider}`}
                style={{ fontSize: "0.95em" }}
              >
                <button
                  onClick={() => {
                    setItemSeleccionado(c);
                    setModalAbierto(true);
                  }}
                  className={`flex items-center gap-2 px-5 py-2 rounded-md font-semibold ${styles.primaryButton}`}
                >
                  <FaRegFileAlt style={{ fontSize: "1em" }} /> Detalles
                </button>
                <a
                  href={c.callLink || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 px-5 py-2 rounded-md font-semibold ${styles.successButton}`}
                >
                  <FaCheckCircle style={{ fontSize: "1em" }} /> Inscribirse
                </a>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
)}


       {/* ========================
    PAGINACIÓN
======================== */}
<div
  className="flex justify-center items-center gap-3 mt-8 flex-wrap"
  style={{ fontSize: `${fontSize}px` }} // 🔹 Escala global
>
  {/* Botón Anterior */}
  <button
    className={`flex items-center justify-center gap-2 px-4 py-2 font-semibold rounded-xl shadow-sm transition-all disabled:opacity-50 ${styles.button}`}
    disabled={paginaActual === 1}
    onClick={() => setPaginaActual(paginaActual - 1)}
    style={{ fontSize: "0.95em" }}
  >
    <ChevronLeft style={{ fontSize: "1em" }} /> Anterior
  </button>

  {/* Números de página */}
  {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
    <button
      key={num}
      className={`flex items-center justify-center font-bold rounded-xl transition-all ${
        paginaActual === num ? styles.primaryButton : styles.button
      }`}
      onClick={() => setPaginaActual(num)}
      style={{
        width: "2.6em",
        height: "2.6em",
        fontSize: "1em",
      }}
    >
      {num}
    </button>
  ))}

  {/* Botón Siguiente */}
  <button
    className={`flex items-center justify-center gap-2 px-4 py-2 font-semibold rounded-xl shadow-sm transition-all disabled:opacity-50 ${styles.button}`}
    disabled={paginaActual === totalPaginas}
    onClick={() => setPaginaActual(paginaActual + 1)}
    style={{ fontSize: "0.95em" }}
  >
    Siguiente <ChevronRight style={{ fontSize: "1em" }} />
  </button>
</div>

      </div>

      {/* ========================
          MODAL
      ======================== */}
      <ModalConvocatoria
        modalAbierto={modalAbierto}
        cerrarModal={() => setModalAbierto(false)}
        convocatoria={itemSeleccionado as any}
      />
    </div>
  );
}
