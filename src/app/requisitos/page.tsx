'use client';

import { useEffect, useState } from 'react';
import {
  FaUsers, FaFileAlt, FaMoneyBill, FaCheckCircle, FaTimes, FaSearch, FaFilter, FaHourglassHalf, FaList
} from 'react-icons/fa';

// Tema
import { useTheme } from '../ThemeContext';
import { getThemeStyles } from '../themeStyles';

// Interfaces
interface Categoria {
  id: number;
  name: string;
}
interface Grupo {
  id: number;
  name: string;
  categoryId: number;
}
interface Requisito {
  id: number;
  name: string;
  groupId: number;
  completo?: boolean;
}

export default function GestionRequisitos() {
  const { modoOscuro, toggleModoOscuro } = useTheme();
  const styles = getThemeStyles(modoOscuro);

  // Estados
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [requisitos, setRequisitos] = useState<Requisito[]>([]);
  const [categoriaActiva, setCategoriaActiva] = useState<number | null>(null);
  const [acordeonesAbiertos, setAcordeonesAbiertos] = useState<Record<number, boolean>>({});
  const [busqueda, setBusqueda] = useState('');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'completados' | 'pendientes'>('todos');

  // === CARGAR DATOS DE API ===
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, groupsRes, reqsRes] = await Promise.all([
          fetch("http://localhost:4000/api/v1/requirementCategories").then(r => r.json()),
          fetch("http://localhost:4000/api/v1/requirementGroups").then(r => r.json()),
          fetch("http://localhost:4000/api/v1/requirements").then(r => r.json()),
        ]);

        setCategorias(catsRes.data || []);
        setGrupos(groupsRes.data || []);
        setRequisitos((reqsRes.data || []).map((r: Requisito) => ({ ...r, completo: false })));

        if (catsRes.data && catsRes.data.length > 0) {
          setCategoriaActiva(catsRes.data[0].id);
        }
      } catch (err) {
        console.error("❌ Error cargando datos:", err);
      }
    };
    fetchData();
  }, []);

  // Filtrar grupos y requisitos por categoría
  const gruposCategoria = grupos.filter(g => g.categoryId === categoriaActiva);
  const requisitosCategoria = requisitos.filter(r =>
    gruposCategoria.some(g => g.id === r.groupId)
  );

  const totalRequisitos = requisitosCategoria.length;
  const completados = requisitosCategoria.filter(r => r.completo).length;
  const progreso = totalRequisitos ? Math.round((completados / totalRequisitos) * 100) : 0;

  // === HANDLERS ===
  const toggleAcordeon = (groupId: number) => {
    setAcordeonesAbiertos(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const toggleCheck = (reqId: number) => {
    setRequisitos(prev =>
      prev.map(r => r.id === reqId ? { ...r, completo: !r.completo } : r)
    );
  };

  const filtrarRequisitos = (items: Requisito[]) =>
    items.filter(item => {
      const coincideBusqueda = item.name.toLowerCase().includes(busqueda.toLowerCase());
      const coincideEstado =
        filtroEstado === 'todos' ||
        (filtroEstado === 'completados' && item.completo) ||
        (filtroEstado === 'pendientes' && !item.completo);
      return coincideBusqueda && coincideEstado;
    });

  return (
    <div className={`min-h-screen ${styles.fondo} transition-colors duration-500`}>
      <div className={`max-w-6xl mx-auto p-8 rounded-xl shadow-2xl space-y-8 border ${styles.divider} ${styles.card}`}>

        {/* Toggle tema */}
        <div className="fixed top-6 right-6 z-50">
          <button
            onClick={toggleModoOscuro}
            className={`p-3 rounded-full transition-all duration-500 hover:scale-110 shadow-lg ${modoOscuro ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'}`}
            title="Cambiar modo"
          >
            {modoOscuro ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Encabezado */}
        <div className={`relative -mx-8 -mt-8 px-8 py-6 ${modoOscuro ? 'bg-gradient-to-r from-[#0b1220] to-[#0a0f1a]' : 'bg-gradient-to-r from-[#00324D] to-[#005b8c]'} text-white rounded-t-xl overflow-hidden`}>
          <div className="flex justify-between items-center relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                <FaFileAlt className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Gestión de Requisitos</h1>
                <p className="text-white/80 text-sm">Administra los requisitos necesarios</p>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="relative w-16 h-16">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#ffffff40"
                    strokeWidth="3"
                    strokeDasharray="100, 100"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeDasharray={`${progreso}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
                  {progreso}%
                </div>
              </div>
              <span className="text-white/80 text-sm mt-1">Completado</span>
            </div>
          </div>
        </div>

        {/* Tabs categorías */}
        <div className={`flex gap-1 p-1 rounded-lg ${modoOscuro ? 'bg-white/5' : 'bg-gray-100'}`}>
          {categorias.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoriaActiva(cat.id)}
              className={`px-6 py-3 text-sm font-semibold rounded-md transition-all flex-1 text-center ${
                categoriaActiva === cat.id
                  ? `${modoOscuro ? 'bg-white/10 text-white shadow-md' : 'bg-white text-[#00324D] shadow-md'}`
                  : `${modoOscuro ? 'text-white/70 hover:bg-white/5' : 'text-gray-500 hover:bg-white/50'}`
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Buscador + Filtros */}
        <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
          <div className={`flex items-center rounded-lg px-4 py-2 w-full md:w-1/2 focus-within:ring-2 transition-all ${styles.input}`}>
            <FaSearch className={`${styles.textMuted} mr-3`} size={18} />
            <input
              type="text"
              placeholder="Buscar requisitos..."
              className="w-full outline-none bg-transparent placeholder-current/50"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className={`flex items-center gap-2 text-sm px-5 py-2.5 rounded-lg transition-all ${styles.button} ${mostrarFiltros ? '!bg-emerald-600 !text-white' : ''}`}
          >
            <FaFilter size={14} />
            Filtros
          </button>
        </div>

        {/* Panel de Filtros */}
        {mostrarFiltros && (
          <div className={`p-6 rounded-2xl space-y-4 shadow-sm border ${styles.divider} ${styles.card}`}>
            <h4 className={`font-semibold flex items-center gap-2 ${styles.text}`}>
              <FaFilter /> Estado del requisito
            </h4>
            <div className="flex flex-wrap gap-4">
              {[
                { value: 'todos', label: 'Todos', icon: <FaList /> },
                { value: 'completados', label: 'Completados', icon: <FaCheckCircle /> },
                { value: 'pendientes', label: 'Pendientes', icon: <FaHourglassHalf /> },
              ].map((estado) => (
                <button
                  key={estado.value}
                  onClick={() => setFiltroEstado(estado.value as any)}
                  className={`flex items-center gap-3 px-5 py-3 rounded-xl border transition-all flex-1 ${
                    filtroEstado === estado.value
                      ? 'bg-emerald-600 text-white shadow-lg border-emerald-700'
                      : `${modoOscuro ? 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`
                  }`}
                >
                  {estado.icon}
                  <span className="font-medium">{estado.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Listado dinámico de grupos y requisitos */}
        <div className="space-y-4">
          {gruposCategoria.map((grupo) => {
            const items = filtrarRequisitos(requisitos.filter(r => r.groupId === grupo.id));
            const icono =
              grupo.name.toLowerCase().includes('admin') ? (
                <FaUsers className={styles.text} />
              ) : grupo.name.toLowerCase().includes('doc') ? (
                <FaFileAlt className={styles.text} />
              ) : (
                <FaMoneyBill className={styles.text} />
              );

            return (
              <div key={grupo.id} className={`rounded-xl overflow-hidden border ${styles.divider}`}>
                <button
                  onClick={() => toggleAcordeon(grupo.id)}
                  className={`w-full px-5 py-4 flex justify-between items-center font-semibold transition-all ${modoOscuro ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${modoOscuro ? 'bg-white/10' : 'bg-[#00324D]/10'}`}>{icono}</div>
                    <span className={`${styles.text}`}>{grupo.name}</span>
                    {items.length > 0 && (
                      <span className={`text-xs px-2 py-1 rounded-full ${modoOscuro ? 'bg-white/10 text-white' : 'bg-[#00324D] text-white'}`}>
                        {items.length}
                      </span>
                    )}
                  </div>
                  <span className={`${styles.textMuted} transform transition-transform`}>
                    {acordeonesAbiertos[grupo.id] ? '▲' : '▼'}
                  </span>
                </button>

                {acordeonesAbiertos[grupo.id] && (
                  <div className={`${styles.card} divide-y`}>
                    {items.length === 0 ? (
                      <div className="px-5 py-4 text-center opacity-70">
                        No se encontraron requisitos
                      </div>
                    ) : (
                      items.map((item) => (
                        <div
                          key={item.id}
                          className={`px-5 py-3 flex items-center transition-colors ${modoOscuro ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}
                        >
                          <label className="flex items-center gap-3 w-full cursor-pointer">
                            <div
                              className={`relative w-5 h-5 rounded border-2 ${item.completo ? (modoOscuro ? 'bg-emerald-500 border-emerald-500' : 'bg-[#00324D] border-[#00324D]') : (modoOscuro ? 'border-white/30' : 'border-gray-300')}`}
                            >
                              {item.completo && (
                                <svg
                                  className="absolute inset-0 m-auto text-white"
                                  width="12"
                                  height="12"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fill="currentColor"
                                    d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z"
                                  />
                                </svg>
                              )}
                            </div>
                            <span className={`${item.completo ? 'line-through opacity-60' : ''} ${styles.text}`}>
                              {item.name}
                            </span>
                            <input
                              type="checkbox"
                              checked={!!item.completo}
                              onChange={() => toggleCheck(item.id)}
                              className="sr-only"
                            />
                          </label>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Botones finales */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
          <a
            href="/usuario/perfilUser"
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-colors ${styles.button}`}
          >
            <FaTimes /> Cancelar
          </a>
          <button className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-colors ${styles.primaryButton}`}>
            <FaCheckCircle /> Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}
