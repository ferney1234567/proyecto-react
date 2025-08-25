'use client';
import { useState } from 'react';
import { Edit, Trash2, Plus, Calendar, Link, FileText, User, Bookmark, Users, Heart, Eye, FileInput } from 'lucide-react';
import { FaClipboardCheck } from 'react-icons/fa';
import ModalConvocatoriaHistorial from './crearHistorial';
import Swal from 'sweetalert2'; // 1. Importar SweetAlert2

interface ConvocatoriasHistorialProps {
  modoOscuro: boolean;
}

interface ConvocatoriaHistorial {
  id: number;
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
  idEntidad: string;
  idLinea: string;
  idPublicoObjetivo: string;
  idInteres: string;
  idUsuario: string;
  fechaRegistro: string;
  estado: string;
}

const emptyConvocatoria: Omit<ConvocatoriaHistorial, 'id'> = {
  idOriginal: 0,
  nombre: '',
  descripcion: '',
  recursos: '',
  linkConvocatoria: '',
  fechaApertura: '',
  fechaCierre: '',
  nombrePagina: '',
  pagina: '',
  objetivo: '',
  observaciones: '',
  imagen: '',
  idEntidad: '',
  idLinea: '',
  idPublicoObjetivo: '',
  idInteres: '',
  idUsuario: '',
  fechaRegistro: new Date().toISOString(),
  estado: 'Activo'
};

export default function ConvocatoriasHistorial({ modoOscuro }: ConvocatoriasHistorialProps) {
  const [convocatorias, setConvocatorias] = useState<ConvocatoriaHistorial[]>([
    {
      id: 1,
      idOriginal: 101,
      nombre: "Convocatoria Innovación 2023",
      descripcion: "Descripción de la convocatoria de innovación",
      recursos: "Recursos necesarios",
      linkConvocatoria: "https://ejemplo.com/convocatoria",
      fechaApertura: "2023-01-15T00:00:00",
      fechaCierre: "2023-03-15",
      nombrePagina: "Página de convocatoria",
      pagina: "https://ejemplo.com",
      objetivo: "Fomentar la innovación tecnológica",
      observaciones: "Observaciones importantes",
      imagen: "/img/zarca1.jpeg",
      idEntidad: "sena",
      idLinea: "linea de sofware",
      idPublicoObjetivo: "instituciones",
      idInteres: "saber java",
      idUsuario: "administrador",
      fechaRegistro: "2023-01-01T10:00:00",
      estado: "Activo"
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [nuevaConvocatoria, setNuevaConvocatoria] = useState<Omit<ConvocatoriaHistorial, 'id'>>(emptyConvocatoria);

  const handleAddConvocatoria = () => {
    setEditandoId(null);
    setNuevaConvocatoria(emptyConvocatoria);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setEditandoId(null);
    setMostrarModal(false);
  };

  // === FUNCIONES DE ALERTAS SWEETALERT2 ===
  const showSuccess = (mensaje: string) => {
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: mensaje,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#39A900',
      background: modoOscuro ? '#1a0526' : '#fff',
      color: modoOscuro ? '#fff' : '#333',
      timer: 2000,
      timerProgressBar: true,
    });
  };

  const showWarning = (mensaje: string) => {
    Swal.fire({
      icon: 'warning',
      title: 'Atención',
      text: mensaje,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#39A900',
      background: modoOscuro ? '#1a0526' : '#fff',
      color: modoOscuro ? '#fff' : '#333',
    });
  };
  
  // 2. Lógica de guardado con alertas
  const handleSaveConvocatoria = () => {
    if (!nuevaConvocatoria.nombre || !nuevaConvocatoria.descripcion) {
      showWarning('El nombre y la descripción de la convocatoria son obligatorios.');
      return;
    }

    if (editandoId) {
      setConvocatorias(convocatorias.map(c => 
        c.id === editandoId ? { ...nuevaConvocatoria, id: editandoId } : c
      ));
      showSuccess('Registro actualizado correctamente.');
    } else {
      const nuevo: ConvocatoriaHistorial = { 
        id: Date.now(), 
        ...nuevaConvocatoria 
      };
      setConvocatorias([...convocatorias, nuevo]);
      showSuccess('Nuevo registro creado en el historial.');
    }
    cerrarModal();
  };

  const handleEditConvocatoria = (id: number) => {
    const convocatoria = convocatorias.find(c => c.id === id);
    if (convocatoria) {
      setEditandoId(id);
      setNuevaConvocatoria(convocatoria);
      setMostrarModal(true);
    }
  };

  // 3. Lógica de eliminación con alerta de confirmación
  const handleDeleteConvocatoria = (id: number) => {
    Swal.fire({
      title: '¿Estás seguro de eliminar este registro?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: modoOscuro ? '#1a0526' : '#fff',
      color: modoOscuro ? '#fff' : '#333',
    }).then((result) => {
      if (result.isConfirmed) {
        setConvocatorias(convocatorias.filter(c => c.id !== id));
        showSuccess('El registro ha sido eliminado del historial.');
      }
    });
  };

  const filteredConvocatorias = convocatorias.filter(convocatoria =>
    convocatoria.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    convocatoria.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    convocatoria.estado.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Estilos condicionales
  const bgColor = modoOscuro ? 'bg-[#1a0526]' : 'bg-white';
  const textColor = modoOscuro ? 'text-white' : 'text-gray-900';
  const borderColor = modoOscuro ? 'border-white/20' : 'border-gray-200';
  const cardBg = modoOscuro ? 'bg-white/10' : 'bg-white';
  const placeholderColor = modoOscuro ? 'placeholder-gray-400' : 'placeholder-gray-500';
  const searchBg = modoOscuro ? 'bg-white/10' : 'bg-white';
  const searchBorder = modoOscuro ? 'border-white/20' : 'border-gray-300';
  const searchFocus = modoOscuro ? 'focus:ring-[#39A900] focus:border-[#39A900]' : 'focus:ring-[#39A900] focus:border-[#39A900]';
  const emptyStateBg = modoOscuro ? 'bg-gray-800/30' : 'bg-gray-50';
  const iconBg = modoOscuro ? 'bg-[#39A900]/20' : 'bg-[#39A900]/10';
  const secondaryText = modoOscuro ? 'text-gray-300' : 'text-gray-600';
  const titleColor = modoOscuro ? 'text-white' : 'text-gray-800';
  const detailText = modoOscuro ? 'text-gray-400' : 'text-gray-600';
  const borderLight = modoOscuro ? 'border-gray-700' : 'border-gray-200';
  const iconColor = modoOscuro ? 'text-gray-400' : 'text-gray-500';
  const linkColor = modoOscuro ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800';
  return (
    <>
      <div className={`rounded-3xl  p-10 max-w-9xl mx-auto my-12  ${bgColor} ${textColor} ${borderColor}`}>
        {/* Cabecera */}
        <div className="text-center mb-10">
          <h2 className={`text-4xl font-extrabold mb-2 ${titleColor}`}>
            Historial de Convocatorias
          </h2>
          <p className={`text-lg ${secondaryText}`}>
            Registro histórico de convocatorias
          </p>
        </div>

        {/* Buscador + botón */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <input
            type="text"
            placeholder="Buscar en historial..."
            className={`border rounded-2xl px-5 py-3 text-lg focus:outline-none focus:ring-2 w-full sm:w-96 transition-all duration-300 hover:shadow-md ${searchBg} ${textColor} ${searchBorder} ${searchFocus} ${placeholderColor}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={handleAddConvocatoria}
            className="flex items-center gap-2 px-6 py-3 bg-[#39A900] text-white text-lg font-medium rounded-2xl hover:bg-[#2d8500] transition-all shadow-md hover:shadow-xl transform hover:scale-105 duration-300 w-full sm:w-auto justify-center"
          >
            <Plus size={20} />
            Agregar Registro
          </button>
        </div>

        {/* Lista */}
        <div className="space-y-5">
          {filteredConvocatorias.length === 0 ? (
            <div className={`text-center py-16 rounded-2xl ${emptyStateBg}`}>
              <p className={`${secondaryText} text-lg`}>No se encontraron registros</p>
            </div>
          ) : (
            filteredConvocatorias.map((convocatoria) => (
              <div
                key={convocatoria.id}
                className={`p-6 rounded-2xl border shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${cardBg} ${borderColor} ${modoOscuro ? 'hover:border-[#39A900]/50' : 'hover:border-[#39A900]'}`}
              >
                <div className="flex flex-col gap-6">
                  {/* Primera fila - Información principal */}
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className={`p-4 rounded-xl flex items-center justify-center h-12 w-12 transition-colors ${iconBg} ${modoOscuro ? 'text-[#39A900] hover:bg-[#39A900]/30' : 'text-[#39A900] hover:bg-[#39A900]/20'}`}>
                      <FileText size={24} className="flex-shrink-0" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
                      <div className="space-y-2">
                        <p className={`text-sm ${secondaryText}`}>Nombre</p>
                        <h3 className={`text-lg font-semibold transition-colors ${modoOscuro ? 'hover:text-[#39A900] text-white' : 'hover:text-[#39A900] text-gray-800'}`}>
                          {convocatoria.nombre}
                        </h3>
                      </div>
                      
                      <div className="space-y-2">
                        <p className={`text-sm ${secondaryText}`}>Estado</p>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          convocatoria.estado === 'Activo' ? 
                            modoOscuro ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800' : 
                          convocatoria.estado === 'Cerrado' ? 
                            modoOscuro ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-800' : 
                            modoOscuro ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {convocatoria.estado}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <p className={`text-sm ${secondaryText}`}>Fechas</p>
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className={iconColor} />
                          <span>{formatDate(convocatoria.fechaApertura)} - {formatDate(convocatoria.fechaCierre)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 self-start md:self-center">
                      <button
                        onClick={() => handleEditConvocatoria(convocatoria.id)}
                        title="Editar registro"
                        className={`p-3 rounded-xl transition-all transform hover:scale-110 flex items-center justify-center h-12 w-12 ${modoOscuro ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteConvocatoria(convocatoria.id)}
                        title="Eliminar registro"
                        className={`p-3 rounded-xl transition-all transform hover:scale-110 flex items-center justify-center h-12 w-12 ${modoOscuro ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Segunda fila - Detalles expandidos */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 border-t pt-6 border-gray-700">
                    <div className="space-y-2">
                      <p className={`text-sm ${secondaryText}`}>Descripción</p>
                      <p className={`${detailText} line-clamp-3`}>{convocatoria.descripcion}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <p className={`text-sm ${secondaryText}`}>Recursos</p>
                      <p className={detailText}>{convocatoria.recursos || 'No especificado'}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <p className={`text-sm ${secondaryText}`}>Enlace</p>
                      <div className="flex items-center gap-2">
                        <Link size={16} className={iconColor} />
                        <a href={convocatoria.linkConvocatoria} target="_blank" rel="noopener noreferrer" className={`${linkColor} truncate`}>
                          {convocatoria.linkConvocatoria || 'No especificado'}
                        </a>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className={`text-sm ${secondaryText}`}>Página</p>
                      <div className="flex items-center gap-2">
                        <FileInput size={16} className={iconColor} />
                        <span className={detailText}>{convocatoria.nombrePagina || 'No especificado'}</span>
                      </div>
                      {convocatoria.pagina && (
                        <a href={convocatoria.pagina} target="_blank" rel="noopener noreferrer" className={`${linkColor} text-sm truncate`}>
                          {convocatoria.pagina}
                        </a>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <p className={`text-sm ${secondaryText}`}>Objetivo</p>
                      <p className={`${detailText} line-clamp-2`}>{convocatoria.objetivo || 'No especificado'}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <p className={`text-sm ${secondaryText}`}>Observaciones</p>
                      <p className={`${detailText} line-clamp-2`}>{convocatoria.observaciones || 'No especificado'}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <p className={`text-sm ${secondaryText}`}>Entidad</p>
                      <div className="flex items-center gap-2">
                        <User size={16} className={iconColor} />
                        <span className={detailText}>Entidad #{convocatoria.idEntidad}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className={`text-sm ${secondaryText}`}>Línea</p>
                      <div className="flex items-center gap-2">
                        <Bookmark size={16} className={iconColor} />
                        <span className={detailText}>Línea #{convocatoria.idLinea}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className={`text-sm ${secondaryText}`}>Público Objetivo</p>
                      <div className="flex items-center gap-2">
                        <Users size={16} className={iconColor} />
                        <span className={detailText}>Público #{convocatoria.idPublicoObjetivo}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className={`text-sm ${secondaryText}`}>Área de Interés</p>
                      <div className="flex items-center gap-2">
                        <Heart size={16} className={iconColor} />
                        <span className={detailText}>Área #{convocatoria.idInteres}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className={`text-sm ${secondaryText}`}>Registrado por</p>
                      <div className="flex items-center gap-2">
                        <User size={16} className={iconColor} />
                        <span className={detailText}>Usuario #{convocatoria.idUsuario}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className={`text-sm ${secondaryText}`}>Fecha Registro</p>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className={iconColor} />
                        <span className={detailText}>{formatDate(convocatoria.fechaRegistro)}</span>
                      </div>
                    </div>
                    
                    {convocatoria.imagen && (
                      <div className="space-y-2">
                        <p className={`text-sm ${secondaryText}`}>Imagen</p>
                        <div className="relative group">
                          <img 
                            src={convocatoria.imagen} 
                            alt="Miniatura" 
                            className="h-20 w-20 object-cover rounded-lg border cursor-pointer transition-colors border-gray-700"
                            onClick={() => window.open(convocatoria.imagen, '_blank')}
                          />
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                            <Eye size={20} className="text-white" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {mostrarModal && (
        <ModalConvocatoriaHistorial
          abierto={mostrarModal}
          onCerrar={cerrarModal}
          onGuardar={handleSaveConvocatoria}
          convocatoria={nuevaConvocatoria}
          setConvocatoria={setNuevaConvocatoria}
          editando={!!editandoId}
          modoOscuro={modoOscuro}
        />
      )}
      </>
  );
}