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
  onChange
}: ModalConvocatoriaHistorialProps) {

  const [mostrarEntidades, setMostrarEntidades] = useState(false);
  const [mostrarLineas, setMostrarLineas] = useState(false);
  const [mostrarPublicos, setMostrarPublicos] = useState(false);
  const [mostrarIntereses, setMostrarIntereses] = useState(false);
  const [mostrarPreviewImagen, setMostrarPreviewImagen] = useState(false);

  if (!abierto) return null;

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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden transform transition-all duration-300 scale-95 hover:scale-100 max-h-[90vh] flex flex-col">
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
                <label className="block text-lg font-medium text-gray-700">Nombre*</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" size={20} />
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md  text-gray-800"
                    value={convocatoria.nombre}
                    onChange={(e) => onChange('nombre', e.target.value)}
                    placeholder="Nombre de la convocatoria"
                  />
                </div>
              </div>

              {/* Descripción */}
              <div className="space-y-2">
                <label className="block text-lg font-medium text-gray-700">Descripción*</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-4 text-[#39A900]" size={20} />
                  <textarea
                    className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 h-40 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md  text-gray-800"
                    value={convocatoria.descripcion}
                    onChange={(e) => onChange('descripcion', e.target.value)}
                    placeholder="Descripción detallada"
                  />
                </div>
              </div>

              {/* Recursos */}
              <div className="space-y-2">
                <label className="block text-lg font-medium text-gray-700">Recursos</label>
                <div className="relative">
                  <Bookmark className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" size={20} />
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md  text-gray-800"
                    value={convocatoria.recursos}
                    onChange={(e) => onChange('recursos', e.target.value)}
                    placeholder="Recursos disponibles"
                  />
                </div>
              </div>

              {/* Link Convocatoria */}
              <div className="space-y-2">
                <label className="block text-lg font-medium text-gray-700">Enlace Convocatoria</label>
                <div className="relative">
                  <Link className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" size={20} />
                  <input
                    type="url"
                    className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md  text-gray-800"
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
                  <label className="block text-lg font-medium text-gray-700">Fecha Apertura</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" size={20} />
                    <input
                      type="datetime-local"
                      className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md  text-gray-800"
                      value={convocatoria.fechaApertura}
                      onChange={(e) => onChange('fechaApertura', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-lg font-medium text-gray-700">Fecha Cierre</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" size={20} />
                    <input
                      type="datetime-local"
                      className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md  text-gray-800"
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
                  <label className="block text-lg font-medium text-gray-700">Entidad</label>
                  <div 
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md flex justify-between items-center cursor-pointer  text-gray-800"
                    onClick={() => setMostrarEntidades(!mostrarEntidades)}
                  >
                    <div className="flex items-center">
                      <User className="text-[#39A900] mr-3" size={20} />
                      <span>{entidadSeleccionada?.nombre || 'Seleccione una entidad'}</span>
                    </div>
                    <ChevronDown size={20} className={`transition-transform ${mostrarEntidades ? 'rotate-180' : ''}`} />
                  </div>
                  
                  {mostrarEntidades && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto">
                      {entidades.map(entidad => (
                        <div 
                          key={entidad.id}
                          className={`px-4 py-3 pl-12 hover:bg-gray-100 cursor-pointer flex items-center ${convocatoria.idEntidad === entidad.id ? 'bg-[#39A900]/10 text-[#39A900]' : ''}`}
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
                  <label className="block text-lg font-medium text-gray-700">Línea</label>
                  <div 
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md flex justify-between items-center cursor-pointer  text-gray-800"
                    onClick={() => setMostrarLineas(!mostrarLineas)}
                  >
                    <div className="flex items-center">
                      <Bookmark className="text-[#39A900] mr-3" size={20} />
                      <span>{lineaSeleccionada?.nombre || 'Seleccione una línea'}</span>
                    </div>
                    <ChevronDown size={20} className={`transition-transform ${mostrarLineas ? 'rotate-180' : ''}`} />
                  </div>
                  
                  {mostrarLineas && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto">
                      {lineas.map(linea => (
                        <div 
                          key={linea.id}
                          className={`px-4 py-3 pl-12 hover:bg-gray-100 cursor-pointer flex items-center ${convocatoria.idLinea === linea.id ? 'bg-[#39A900]/10 text-[#39A900]' : ''}`}
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
                  <label className="block text-lg font-medium text-gray-700">Público Objetivo</label>
                  <div 
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md flex justify-between items-center cursor-pointer  text-gray-800"
                    onClick={() => setMostrarPublicos(!mostrarPublicos)}
                  >
                    <div className="flex items-center">
                      <Users className="text-[#39A900] mr-3" size={20} />
                      <span>{publicoSeleccionado?.nombre || 'Seleccione público'}</span>
                    </div>
                    <ChevronDown size={20} className={`transition-transform ${mostrarPublicos ? 'rotate-180' : ''}`} />
                  </div>
                  
                  {mostrarPublicos && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto">
                      {publicos.map(publico => (
                        <div 
                          key={publico.id}
                          className={`px-4 py-3 pl-12 hover:bg-gray-100 cursor-pointer flex items-center ${convocatoria.idPublicoObjetivo === publico.id ? 'bg-[#39A900]/10 text-[#39A900]' : ''}`}
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
                  <label className="block text-lg font-medium text-gray-700">Área de Interés</label>
                  <div 
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md flex justify-between items-center cursor-pointer  text-gray-800"
                    onClick={() => setMostrarIntereses(!mostrarIntereses)}
                  >
                    <div className="flex items-center">
                      <Heart className="text-[#39A900] mr-3" size={20} />
                      <span>{interesSeleccionado?.nombre || 'Seleccione área'}</span>
                    </div>
                    <ChevronDown size={20} className={`transition-transform ${mostrarIntereses ? 'rotate-180' : ''}`} />
                  </div>
                  
                  {mostrarIntereses && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto">
                      {intereses.map(interes => (
                        <div 
                          key={interes.id}
                          className={`px-4 py-3 pl-12 hover:bg-gray-100 cursor-pointer flex items-center ${convocatoria.idInteres === interes.id ? 'bg-[#39A900]/10 text-[#39A900]' : ''}`}
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
                <label className="block text-lg font-medium text-gray-700">Nombre Página</label>
                <div className="relative">
                  <FileInput className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" size={20} />
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md  text-gray-800"
                    value={convocatoria.nombrePagina}
                    onChange={(e) => onChange('nombrePagina', e.target.value)}
                    placeholder="Nombre de la página"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-lg font-medium text-gray-700">URL Página</label>
                <div className="relative">
                  <FileInput className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" size={20} />
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md  text-gray-800"
                    value={convocatoria.pagina}
                    onChange={(e) => onChange('pagina', e.target.value)}
                    placeholder="URL de la página"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-lg font-medium text-gray-700">Objetivo</label>
                <div className="relative">
                  <Target className="absolute left-3 top-4 text-[#39A900]" size={20} />
                  <textarea
                    className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 h-32 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md  text-gray-800"
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
                <label className="block text-lg font-medium text-gray-700">Imagen</label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" size={20} />
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md  text-gray-800"
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
                      <div className="mt-2 border rounded-xl p-2">
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
                <label className="block text-lg font-medium text-gray-700">Estado</label>
                <select
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md  text-gray-800"
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
                <label className="block text-lg font-medium text-gray-700">Observaciones</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-4 text-[#39A900]" size={20} />
                  <textarea
                    className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 h-32 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md  text-gray-800"
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
        <div className="bg-gray-50 px-8 py-6 flex justify-between items-center border-t border-gray-200">
          <button
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors hover:shadow-md  text-gray-800"
            onClick={onCerrar}
          >
            <X size={18} />
            <span>Cancelar</span>
          </button>
          <button
            className="flex items-center gap-2 px-6 py-3 bg-[#39A900] text-white rounded-xl hover:bg-[#2d8500] transition-colors shadow-md hover:shadow-lg transform hover:scale-105 duration-200  text-gray-800"
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