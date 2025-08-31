'use client';

import { useState } from 'react';
import {
  FaUsers, FaFileAlt, FaMoneyBill, FaCheckCircle, FaTimes, FaSearch, FaFilter
} from 'react-icons/fa';

const requisitosIniciales = {
  Miniciencias: {
    Administrativos: [
      { texto: 'Registro en la base de datos de investigadores', completo: false },
      { texto: 'Certificado de vinculación institucional', completo: false },
    ],
    Documentacion: [
      { texto: 'Carta de aval institucional', completo: false },
      { texto: 'Copia del proyecto aprobado', completo: false },
      { texto: 'Presupuesto aprobado por el ente financiador', completo: false },
    ],
    Financieros: [
      { texto: 'Presupuesto aprobado por el ente financiador', completo: false },
      { texto: 'Garantías financieras', completo: false },
      { texto: 'Certificación de recursos propios', completo: false },
    ],
  },
  Ecopetrol: {
    Administrativos: [
      { texto: 'Registro como proveedor en Ecopetrol', completo: false },
      { texto: 'Certificación de experiencia mínima de 3 años', completo: false },
    ],
    Documentacion: [
      { texto: 'RUT actualizado', completo: false },
      { texto: 'Certificados de calidad ISO', completo: false },
      { texto: 'Estados financieros del último año', completo: false },
      { texto: 'Certificación de antecedentes disciplinarios', completo: false },
    ],
    Financieros: [
      { texto: 'Estados financieros del último año', completo: false },
      { texto: 'Certificación de capacidad financiera', completo: false },
    ],
  },
  MinAmbiente: {
    Administrativos: [
      { texto: 'Registro en el sistema de licencias ambientales', completo: false },
      { texto: 'Acreditación como consultor ambiental', completo: false },
    ],
    Documentacion: [
      { texto: 'Estudio de impacto ambiental', completo: false },
      { texto: 'Plan de manejo ambiental', completo: false },
    ],
    Financieros: [
      { texto: 'Póliza de cumplimiento ambiental', completo: false },
    ],
  },
  SENA: {
    Administrativos: [
      { texto: 'Registro en el sistema Sofía Plus', completo: false },
      { texto: 'Certificación de idoneidad técnica', completo: false },
    ],
    Documentacion: [
      { texto: 'Acta de compromiso firmada', completo: false },
      { texto: 'Copia del documento de identidad', completo: false },
    ],
    Financieros: [
      { texto: 'Soporte de pago de inscripción', completo: false },
    ],
  },
};

export default function GestionRequisitos() {
  const categorias = Object.keys(requisitosIniciales);
  const [categoriaActiva, setCategoriaActiva] = useState(categorias[0]);
  const [acordeonesAbiertos, setAcordeonesAbiertos] = useState({});
  const [requisitos, setRequisitos] = useState(requisitosIniciales);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState('todos');

  const totalRequisitos = Object.values(requisitos[categoriaActiva]).flat();
  const completados = totalRequisitos.filter((r) => r.completo).length;
  const progreso = totalRequisitos.length
    ? Math.round((completados / totalRequisitos.length) * 100)
    : 0;

  const toggleAcordeon = (seccion) => {
    setAcordeonesAbiertos((prev) => ({
      ...prev,
      [seccion]: !prev[seccion],
    }));
  };

  const toggleCheck = (seccion, index) => {
    const nuevos = { ...requisitos };
    nuevos[categoriaActiva][seccion][index].completo =
      !nuevos[categoriaActiva][seccion][index].completo;
    setRequisitos(nuevos);
  };

  const filtrarRequisitos = (items) =>
    items.filter((item) => {
      const coincideBusqueda = item.texto.toLowerCase().includes(busqueda.toLowerCase());
      const coincideEstado =
        filtroEstado === 'todos' ||
        (filtroEstado === 'completados' && item.completo) ||
        (filtroEstado === 'pendientes' && !item.completo);
      return coincideBusqueda && coincideEstado;
    });

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white rounded-xl shadow-2xl space-y-8">
      {/* Encabezado (full-width azul) */}
      <div className="relative -mx-8 -mt-8 px-8 py-6 bg-gradient-to-r from-[#00324D] to-[#005b8c] text-white rounded-t-xl overflow-hidden">
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
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full"></div>
        <div className="absolute -top-5 -left-5 w-24 h-24 bg-white/5 rounded-full"></div>
      </div>

      {/* Tabs dinámicos */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoriaActiva(cat)}
            className={`px-6 py-3 text-sm font-semibold rounded-md transition-all flex-1 text-center ${
              categoriaActiva === cat
                ? 'bg-white shadow-md text-[#00324D]'
                : 'text-gray-500 hover:bg-white/50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
        <div className="flex items-center border border-gray-200 rounded-lg px-4 py-2 w-full md:w-1/2 bg-gray-50 focus-within:border-[#00324D] focus-within:ring-2 focus-within:ring-[#00324D]/20 transition-all">
          <FaSearch className="text-gray-400 mr-3" size={18} />
          <input
            type="text"
            placeholder="Buscar requisitos..."
            className="w-full outline-none bg-transparent placeholder-gray-400"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <button
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
          className={`flex items-center gap-2 text-sm px-5 py-2.5 rounded-lg transition-all ${
            mostrarFiltros
              ? 'bg-[#00324D] text-white'
              : 'text-[#00324D] border border-[#00324D] hover:bg-[#00324D] hover:text-white'
          }`}
        >
          <FaFilter size={14} />
          Filtros
        </button>
      </div>

      {/* Filtros */}
      {mostrarFiltros && (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200/70 p-5 rounded-2xl space-y-4 shadow-sm">
          <h4 className="font-semibold text-gray-700 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#00324D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Estado del requisito
          </h4>
          <div className="flex flex-wrap gap-4">
            {[
              { value: 'todos', label: 'Todos', icon: '✓' },
              { value: 'completados', label: 'Completados', icon: '✓' },
              { value: 'pendientes', label: 'Pendientes', icon: '…' }
            ].map((estado) => (
              <label 
                key={estado.value} 
                className={`relative flex items-center gap-3 cursor-pointer px-4 py-3 rounded-xl border transition-all duration-200 ${
                  filtroEstado === estado.value 
                    ? 'bg-[#00324D] text-white border-[#00324D] shadow-md' 
                    : 'bg-white text-gray-700 border-gray-200 hover:border-[#00324D]/40 hover:shadow-sm'
                }`}
              >
                <input
                  type="radio"
                  name="estado"
                  value={estado.value}
                  checked={filtroEstado === estado.value}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                  className="absolute opacity-0 h-0 w-0"
                />
                <span className={`flex items-center justify-center w-6 h-6 rounded-full border-2 ${
                  filtroEstado === estado.value 
                    ? 'bg-white text-[#00324D] border-white' 
                    : 'border-gray-300 text-transparent'
                }`}>
                  {estado.icon}
                </span>
                <span className="font-medium capitalize">{estado.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Requisitos */}
      <div className="space-y-4">
        {Object.entries(requisitos[categoriaActiva]).map(([seccion, items]) => {
          const icono =
            seccion === 'Administrativos' ? (
              <FaUsers className="text-[#00324D]" />
            ) : seccion === 'Documentacion' ? (
              <FaFileAlt className="text-[#00324D]" />
            ) : (
              <FaMoneyBill className="text-[#00324D]" />
            );

          const itemsFiltrados = filtrarRequisitos(items);

          return (
            <div key={seccion} className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleAcordeon(seccion)}
                className="w-full px-5 py-4 bg-gray-50 hover:bg-gray-100 flex justify-between items-center font-semibold transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#00324D]/10 rounded-lg">{icono}</div>
                  <span className="text-gray-800">{seccion}</span>
                  {itemsFiltrados.length > 0 && (
                    <span className="text-xs bg-[#00324D] text-white px-2 py-1 rounded-full">
                      {itemsFiltrados.length}
                    </span>
                  )}
                </div>
                <span className="text-gray-500 transform transition-transform">
                  {acordeonesAbiertos[seccion] ? '▲' : '▼'}
                </span>
              </button>

              {acordeonesAbiertos[seccion] && (
                <div className="bg-white divide-y divide-gray-100">
                  {itemsFiltrados.length === 0 ? (
                    <div className="px-5 py-4 text-center text-gray-500">
                      No se encontraron requisitos
                    </div>
                  ) : (
                    itemsFiltrados.map((item, idx) => (
                      <div
                        key={idx}
                        className="px-5 py-3 flex items-center hover:bg-gray-50 transition-colors"
                      >
                        <label className="flex items-center gap-3 w-full cursor-pointer">
                          <div
                            className={`relative w-5 h-5 rounded border-2 ${
                              item.completo
                                ? 'bg-[#00324D] border-[#00324D]'
                                : 'border-gray-300'
                            }`}
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
                          <span
                            className={`${
                              item.completo
                                ? 'line-through text-gray-400'
                                : 'text-gray-700'
                            }`}
                          >
                            {item.texto}
                          </span>
                          <input
                            type="checkbox"
                            checked={item.completo}
                            onChange={() => toggleCheck(seccion, idx)}
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

      {/* Botones */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
        <a
          href="/perfilUser"
          className="flex items-center justify-center gap-2 text-gray-600 border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <FaTimes /> Cancelar
        </a>
        <button className="flex items-center justify-center gap-2 bg-[#00324D] hover:bg-[#004267] text-white px-6 py-3 rounded-lg transition-colors shadow-md">
          <FaCheckCircle /> Guardar Cambios
        </button>
      </div>
    </div>
  );
}