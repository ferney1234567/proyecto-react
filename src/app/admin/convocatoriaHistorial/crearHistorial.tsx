'use client';
import { Calendar, Link, FileText, User, Image as ImageIcon, Check, X, Bookmark, Users, Target, Heart, FileInput, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface ModalConvocatoriaHistorialProps {
  abierto: boolean;
  editando: boolean;
  convocatoria: {
    idOriginal: number;
    nombre: string;
    descripcion: string;
    recursos: string;
    linkConvocatoria: string;
    fechaApertura: string;
    fechaCierre: string;
    nombrePagina: string;
    pagina: string;
    objetivo: string;
    observaciones: string;
    imagen: string;
    idEntidad: number;
    idLinea: number;
    idPublicoObjetivo: number;
    idInteres: number;
    idUsuario: number;
    fechaRegistro: string;
    estado: string;
  };
  entidades?: Array<{ id: number; nombre: string }>;
  lineas?: Array<{ id: number; nombre: string }>;
  publicos?: Array<{ id: number; nombre: string }>;
  intereses?: Array<{ id: number; nombre: string }>;
  onCerrar: () => void;
  onGuardar: () => void;
  onChange: (field: keyof typeof convocatoria, value: any) => void;
  modoOscuro: boolean;
}

export default function ModalConvocatoriaHistorial({
  abierto,
  editando,
  convocatoria,
  entidades = [],
  lineas = [],
  publicos = [],
  intereses = [],
  onCerrar,
  onGuardar,
  onChange,
  modoOscuro
}: ModalConvocatoriaHistorialProps) {

  const [mostrarEntidades, setMostrarEntidades] = useState(false);
  const [mostrarLineas, setMostrarLineas] = useState(false);
  const [mostrarPublicos, setMostrarPublicos] = useState(false);
  const [mostrarIntereses, setMostrarIntereses] = useState(false);
  const [mostrarPreviewImagen, setMostrarPreviewImagen] = useState(false);

  if (!abierto) return null;

  // 🔹 estilos dinámicos
  const modalBg = modoOscuro ? 'bg-[#1a0526] text-white' : 'bg-white text-gray-900';
  const inputBg = modoOscuro ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500';
  const footerBg = modoOscuro ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200';
  const cancelBtn = modoOscuro ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100';
  const dropdownBg = modoOscuro ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300';
  const dropdownItemBg = modoOscuro ? 'hover:bg-gray-700' : 'hover:bg-gray-100';
  const dropdownSelectedBg = modoOscuro ? 'bg-[#39A900]/20 text-[#39A900]' : 'bg-[#39A900]/10 text-[#39A900]';
  const labelColor = modoOscuro ? 'text-gray-200' : 'text-gray-700';
  const selectBg = modoOscuro ? 'bg-gray-800 text-white' : 'bg-white text-gray-800';

  const entidadSeleccionada = entidades.find(e => e.id === convocatoria.idEntidad);
  const lineaSeleccionada = lineas.find(l => l.id === convocatoria.idLinea);
  const publicoSeleccionado = publicos.find(p => p.id === convocatoria.idPublicoObjetivo);
  const interesSeleccionado = intereses.find(i => i.id === convocatoria.idInteres);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onChange('imagen', event.target.result.toString());
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className={`${modalBg} rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden transform transition-all duration-300 scale-95 hover:scale-100 max-h-[90vh] flex flex-col`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-[#39A900] to-[#2d8500] p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full">
              <FileText className="text-white text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              {editando ? 'Editar Registro Histórico' : 'Agregar Nuevo Registro'}
            </h2>
          </div>
          <button
            className="text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-white/10"
            onClick={onCerrar}
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Columna 1 */}
            <div className="space-y-6">
              {/* Nombre */}
              <div className="space-y-2">
                <label className={`block text-lg font-medium ${labelColor}`}>Nombre*</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" size={20} />
                  <input
                    type="text"
                    className={`w-full border rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md ${inputBg}`}
                    value={convocatoria.nombre}
                    onChange={(e) => onChange('nombre', e.target.value)}
                    placeholder="Nombre de la convocatoria"
                  />
                </div>
              </div>

              {/* Descripción */}
              <div className="space-y-2">
                <label className={`block text-lg font-medium ${labelColor}`}>Descripción*</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-4 text-[#39A900]" size={20} />
                  <textarea
                    className={`w-full border rounded-xl pl-12 pr-4 py-3 h-40 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md ${inputBg}`}
                    value={convocatoria.descripcion}
                    onChange={(e) => onChange('descripcion', e.target.value)}
                    placeholder="Descripción detallada"
                  />
                </div>
              </div>

              {/* Recursos */}
              <div className="space-y-2">
                <label className={`block text-lg font-medium ${labelColor}`}>Recursos</label>
                <div className="relative">
                  <Bookmark className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" size={20} />
                  <input
                    type="text"
                    className={`w-full border rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md ${inputBg}`}
                    value={convocatoria.recursos}
                    onChange={(e) => onChange('recursos', e.target.value)}
                    placeholder="Recursos disponibles"
                  />
                </div>
              </div>

              {/* Link Convocatoria */}
              <div className="space-y-2">
                <label className={`block text-lg font-medium ${labelColor}`}>Enlace Convocatoria</label>
                <div className="relative">
                  <Link className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" size={20} />
                  <input
                    type="url"
                    className={`w-full border rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md ${inputBg}`}
                    value={convocatoria.linkConvocatoria}
                    onChange={(e) => onChange('linkConvocatoria', e.target.value)}
                    placeholder="https://ejemplo.com/convocatoria"
                  />
                </div>
              </div>
            </div>

            {/* Columna 2 */}
            <div className="space-y-6">
              {/* Fechas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className={`block text-lg font-medium ${labelColor}`}>Fecha Apertura</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" size={20} />
                    <input
                      type="datetime-local"
                      className={`w-full border rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md ${inputBg}`}
                      value={convocatoria.fechaApertura}
                      onChange={(e) => onChange('fechaApertura', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={`block text-lg font-medium ${labelColor}`}>Fecha Cierre</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" size={20} />
                    <input
                      type="datetime-local"
                      className={`w-full border rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md ${inputBg}`}
                      value={convocatoria.fechaCierre}
                      onChange={(e) => onChange('fechaCierre', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Selectores */}
              <div className="space-y-4">
                {/* Entidad */}
                <div className="space-y-2 relative">
                  <label className={`block text-lg font-medium ${labelColor}`}>Entidad</label>
                  <div 
                    className={`w-full border rounded-xl px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md flex justify-between items-center cursor-pointer ${dropdownBg}`}
                    onClick={() => setMostrarEntidades(!mostrarEntidades)}
                  >
                    <div className="flex items-center">
                      <User className="text-[#39A900] mr-3" size={20} />
                      <span>{entidadSeleccionada?.nombre || 'Seleccione una entidad'}</span>
                    </div>
                    <ChevronDown size={20} className={`transition-transform ${mostrarEntidades ? 'rotate-180' : ''}`} />
                  </div>
                  
                  {mostrarEntidades && (
                    <div className={`absolute z-10 mt-1 w-full border rounded-xl shadow-lg max-h-60 overflow-auto ${dropdownBg}`}>
                      {entidades.map(entidad => (
                        <div 
                          key={entidad.id}
                          className={`px-4 py-3 pl-12 cursor-pointer flex items-center ${dropdownItemBg} ${convocatoria.idEntidad === entidad.id ? dropdownSelectedBg : ''}`}
                          onClick={() => {
                            onChange('idEntidad', entidad.id);
                            setMostrarEntidades(false);
                          }}
                        >
                          <User className="text-[#39A900] mr-3" size={18} />
                          {entidad.nombre}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Línea */}
                <div className="space-y-2 relative">
                  <label className={`block text-lg font-medium ${labelColor}`}>Línea</label>
                  <div 
                    className={`w-full border rounded-xl px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md flex justify-between items-center cursor-pointer ${dropdownBg}`}
                    onClick={() => setMostrarLineas(!mostrarLineas)}
                  >
                    <div className="flex items-center">
                      <Bookmark className="text-[#39A900] mr-3" size={20} />
                      <span>{lineaSeleccionada?.nombre || 'Seleccione una línea'}</span>
                    </div>
                    <ChevronDown size={20} className={`transition-transform ${mostrarLineas ? 'rotate-180' : ''}`} />
                  </div>
                  
                  {mostrarLineas && (
                    <div className={`absolute z-10 mt-1 w-full border rounded-xl shadow-lg max-h-60 overflow-auto ${dropdownBg}`}>
                      {lineas.map(linea => (
                        <div 
                          key={linea.id}
                          className={`px-4 py-3 pl-12 cursor-pointer flex items-center ${dropdownItemBg} ${convocatoria.idLinea === linea.id ? dropdownSelectedBg : ''}`}
                          onClick={() => {
                            onChange('idLinea', linea.id);
                            setMostrarLineas(false);
                          }}
                        >
                          <Bookmark className="text-[#39A900] mr-3" size={18} />
                          {linea.nombre}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Público Objetivo */}
                <div className="space-y-2 relative">
                  <label className={`block text-lg font-medium ${labelColor}`}>Público Objetivo</label>
                  <div 
                    className={`w-full border rounded-xl px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md flex justify-between items-center cursor-pointer ${dropdownBg}`}
                    onClick={() => setMostrarPublicos(!mostrarPublicos)}
                  >
                    <div className="flex items-center">
                      <Users className="text-[#39A900] mr-3" size={20} />
                      <span>{publicoSeleccionado?.nombre || 'Seleccione público'}</span>
                    </div>
                    <ChevronDown size={20} className={`transition-transform ${mostrarPublicos ? 'rotate-180' : ''}`} />
                  </div>
                  
                  {mostrarPublicos && (
                    <div className={`absolute z-10 mt-1 w-full border rounded-xl shadow-lg max-h-60 overflow-auto ${dropdownBg}`}>
                      {publicos.map(publico => (
                        <div 
                          key={publico.id}
                          className={`px-4 py-3 pl-12 cursor-pointer flex items-center ${dropdownItemBg} ${convocatoria.idPublicoObjetivo === publico.id ? dropdownSelectedBg : ''}`}
                          onClick={() => {
                            onChange('idPublicoObjetivo', publico.id);
                            setMostrarPublicos(false);
                          }}
                        >
                          <Users className="text-[#39A900] mr-3" size={18} />
                          {publico.nombre}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Interés */}
                <div className="space-y-2 relative">
                  <label className={`block text-lg font-medium ${labelColor}`}>Área de Interés</label>
                  <div 
                    className={`w-full border rounded-xl px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md flex justify-between items-center cursor-pointer ${dropdownBg}`}
                    onClick={() => setMostrarIntereses(!mostrarIntereses)}
                  >
                    <div className="flex items-center">
                      <Heart className="text-[#39A900] mr-3" size={20} />
                      <span>{interesSeleccionado?.nombre || 'Seleccione área'}</span>
                    </div>
                    <ChevronDown size={20} className={`transition-transform ${mostrarIntereses ? 'rotate-180' : ''}`} />
                  </div>
                  
                  {mostrarIntereses && (
                    <div className={`absolute z-10 mt-1 w-full border rounded-xl shadow-lg max-h-60 overflow-auto ${dropdownBg}`}>
                      {intereses.map(interes => (
                        <div 
                          key={interes.id}
                          className={`px-4 py-3 pl-12 cursor-pointer flex items-center ${dropdownItemBg} ${convocatoria.idInteres === interes.id ? dropdownSelectedBg : ''}`}
                          onClick={() => {
                            onChange('idInteres', interes.id);
                            setMostrarIntereses(false);
                          }}
                        >
                          <Heart className="text-[#39A900] mr-3" size={18} />
                          {interes.nombre}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sección inferior (full width) */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Información de página */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className={`block text-lg font-medium ${labelColor}`}>Nombre Página</label>
                <div className="relative">
                  <FileInput className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" size={20} />
                  <input
                    type="text"
                    className={`w-full border rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md ${inputBg}`}
                    value={convocatoria.nombrePagina}
                    onChange={(e) => onChange('nombrePagina', e.target.value)}
                    placeholder="Nombre de la página"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={`block text-lg font-medium ${labelColor}`}>URL Página</label>
                <div className="relative">
                  <FileInput className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" size={20} />
                  <input
                    type="text"
                    className={`w-full border rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md ${inputBg}`}
                    value={convocatoria.pagina}
                    onChange={(e) => onChange('pagina', e.target.value)}
                    placeholder="URL de la página"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={`block text-lg font-medium ${labelColor}`}>Objetivo</label>
                <div className="relative">
                  <Target className="absolute left-3 top-4 text-[#39A900]" size={20} />
                  <textarea
                    className={`w-full border rounded-xl pl-12 pr-4 py-3 h-32 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md ${inputBg}`}
                    value={convocatoria.objetivo}
                    onChange={(e) => onChange('objetivo', e.target.value)}
                    placeholder="Objetivo principal"
                  />
                </div>
              </div>
            </div>

            {/* Imagen y Observaciones */}
            <div className="space-y-6">
              {/* Selector de Imagen */}
              <div className="space-y-2">
                <label className={`block text-lg font-medium ${labelColor}`}>Imagen</label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" size={20} />
                  <input
                    type="file"
                    accept="image/*"
                    className={`w-full border rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md ${inputBg}`}
                    onChange={handleImageChange}
                  />
                </div>
                {convocatoria.imagen && (
                  <div className="mt-2">
                    <button
                      type="button"
                      className="text-sm text-[#39A900] hover:underline"
                      onClick={() => setMostrarPreviewImagen(!mostrarPreviewImagen)}
                    >
                      {mostrarPreviewImagen ? 'Ocultar previsualización' : 'Ver previsualización'}
                    </button>
                    {mostrarPreviewImagen && (
                      <div className={`mt-2 border rounded-xl p-2 ${modoOscuro ? 'border-gray-600' : 'border-gray-300'}`}>
                        <img 
                          src={convocatoria.imagen} 
                          alt="Previsualización" 
                          className="max-h-40 mx-auto rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Estado */}
              <div className="space-y-2">
                <label className={`block text-lg font-medium ${labelColor}`}>Estado</label>
                <select
                  className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md ${selectBg}`}
                  value={convocatoria.estado}
                  onChange={(e) => onChange('estado', e.target.value)}
                >
                  <option value="Activo">Activo</option>
                  <option value="Cerrado">Cerrado</option>
                  <option value="Pendiente">Pendiente</option>
                </select>
              </div>

              {/* Observaciones */}
              <div className="space-y-2">
                <label className={`block text-lg font-medium ${labelColor}`}>Observaciones</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-4 text-[#39A900]" size={20} />
                  <textarea
                    className={`w-full border rounded-xl pl-12 pr-4 py-3 h-32 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md ${inputBg}`}
                    value={convocatoria.observaciones}
                    onChange={(e) => onChange('observaciones', e.target.value)}
                    placeholder="Observaciones adicionales"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`${footerBg} px-8 py-6 flex justify-between items-center border-t`}>
          <button
            className={`flex items-center gap-2 px-6 py-3 border rounded-xl transition-colors hover:shadow-md ${cancelBtn}`}
            onClick={onCerrar}
          >
            <X size={18} />
            <span>Cancelar</span>
          </button>
          <button
            className="flex items-center gap-2 px-6 py-3 bg-[#39A900] text-white rounded-xl hover:bg-[#2d8500] transition-colors shadow-md hover:shadow-lg transform hover:scale-105 duration-200"
            onClick={onGuardar}
          >
            <Check size={18} />
            <span>{editando ? 'Actualizar Convocatoria' : 'Guardar Convocatoria'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}