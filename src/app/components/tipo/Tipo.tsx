'use client';
import { useState } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import { FaClipboardCheck } from 'react-icons/fa';
import Swal from 'sweetalert2';
import ModalTipo from './crearTipo';

interface TipoProps {
  modoOscuro: boolean;
}

interface Tipo {
  id: string;
  nombre: string;
}

export default function Tipo({ modoOscuro }: TipoProps) {
  const [tipos, setTipos] = useState<Tipo[]>([
    { id: '1', nombre: 'Tipo Académico' },
    { id: '2', nombre: 'Tipo Experiencia' },
  ]);
  const [tipoSearchTerm, setTipoSearchTerm] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoTipo, setNuevoTipo] = useState('');
  const [editandoId, setEditandoId] = useState<string | null>(null);

  // === ALERTAS SWEETALERT2 ===
  const showSuccess = (mensaje: string) => {
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: mensaje,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#39A900',
      background: modoOscuro ? '#1a0526' : '#fff',
      color: modoOscuro ? '#fff' : '#333'
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
      color: modoOscuro ? '#fff' : '#333'
    });
  };

  // === ABRIR Y CERRAR MODAL ===
  const handleAddTipo = () => {
    setEditandoId(null);
    setNuevoTipo('');
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setNuevoTipo('');
    setEditandoId(null);
  };

  // === GUARDAR ===
  const handleSaveTipo = () => {
    if (nuevoTipo.trim() === '') {
      showWarning('El nombre del tipo es obligatorio');
      return;
    }

    if (editandoId) {
      setTipos(tipos.map(tipo =>
        tipo.id === editandoId ? { ...tipo, nombre: nuevoTipo } : tipo
      ));
      showSuccess('El tipo fue actualizado correctamente');
      setEditandoId(null);
    } else {
      const nuevo: Tipo = { id: Date.now().toString(), nombre: nuevoTipo };
      setTipos([...tipos, nuevo]);
      showSuccess('El tipo fue agregado correctamente');
    }
    cerrarModal();
  };

  // === EDITAR ===
  const handleEditTipo = (id: string) => {
    const tipo = tipos.find(t => t.id === id);
    if (tipo) {
      setNuevoTipo(tipo.nombre);
      setEditandoId(id);
      setMostrarModal(true);
    }
  };

  // === ELIMINAR ===
  const handleDeleteTipo = (id: string) => {
    Swal.fire({
      title: '¿Eliminar este tipo?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: modoOscuro ? '#1a0526' : '#fff',
      color: modoOscuro ? '#fff' : '#333'
    }).then((result) => {
      if (result.isConfirmed) {
        setTipos(tipos.filter(t => t.id !== id));
        showSuccess('El tipo fue eliminado correctamente');
      }
    });
  };

  // === FILTRO ===
  const filteredTipos = tipos.filter(tipo =>
    tipo.nombre.toLowerCase().includes(tipoSearchTerm.toLowerCase())
  );

  // Estilos condicionales
  const bgColor = modoOscuro ? 'bg-[#1a0526]' : 'bg-white';
  const textColor = modoOscuro ? 'text-white' : 'text-gray-900';
  const borderColor = modoOscuro ? 'border-white/20' : 'border-gray-200';
  const cardBg = modoOscuro ? 'bg-white/10' : 'bg-white';
  const placeholderColor = modoOscuro ? 'placeholder-gray-400' : 'placeholder-gray-500';
  const searchBg = modoOscuro ? 'bg-white/10' : 'bg-white';
  const searchBorder = modoOscuro ? 'border-white/20' : 'border-gray-300';
  const searchFocus = 'focus:ring-[#39A900] focus:border-[#39A900]';
  const emptyStateBg = modoOscuro ? 'bg-gray-800/30' : 'bg-gray-50';
  const iconBg = modoOscuro ? 'bg-[#39A900]/20' : 'bg-[#39A900]/10';
  const secondaryText = modoOscuro ? 'text-gray-300' : 'text-gray-600';
  const titleColor = modoOscuro ? 'text-white' : 'text-gray-800';
return (
  <>
    {/* Contenedor principal */}
    <div className={`rounded-3xl p-10 max-w-9xl mx-auto my-12 ${bgColor} ${textColor}`}>
      {/* Cabecera */}
      <div className="text-center mb-10">
        <h2 className={`text-4xl font-extrabold mb-2 ${titleColor}`}>
          Gestión de Tipos
        </h2>
        <p className={`text-lg ${secondaryText}`}>
          Administra los tipos disponibles
        </p>
      </div>

      {/* Buscador + botón */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
        <input
          type="text"
          placeholder="Buscar tipos..."
          className={`border rounded-2xl px-5 py-3 text-lg focus:outline-none focus:ring-2 w-full sm:w-96 transition-all duration-300 hover:shadow-md ${searchBg} ${textColor} ${searchBorder} ${searchFocus} ${placeholderColor}`}
          value={tipoSearchTerm}
          onChange={(e) => setTipoSearchTerm(e.target.value)}
        />
        <button
          onClick={handleAddTipo}
          className="flex items-center gap-2 px-6 py-3 bg-[#39A900] text-white text-lg font-medium rounded-2xl hover:bg-[#2d8500] transition-all shadow-md hover:shadow-xl transform hover:scale-105 duration-300 w-full sm:w-auto justify-center"
        >
          <Plus size={20} />
          Agregar Nuevo Tipo
        </button>
      </div>

      {/* Lista */}
      <div className="space-y-5">
        {filteredTipos.length === 0 ? (
          <div className={`text-center py-16 rounded-2xl border ${emptyStateBg}`}>
            <p className={`${secondaryText} text-lg`}>No se encontraron tipos</p>
          </div>
        ) : (
          filteredTipos.map((tipo) => (
            <div
              key={tipo.id}
              className={`p-6 rounded-2xl border shadow-md hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 transform hover:-translate-y-1 ${cardBg} ${borderColor} ${
                modoOscuro ? 'hover:border-[#39A900]/50' : 'hover:border-[#39A900]'
              }`}
            >
              <div className="flex items-center gap-4 w-full">
                <div
                  className={`p-4 rounded-xl flex items-center justify-center h-12 w-12 transition-colors ${iconBg} ${
                    modoOscuro
                      ? 'text-[#39A900] hover:bg-[#39A900]/30'
                      : 'text-[#39A900] hover:bg-[#39A900]/20'
                  }`}
                >
                  <FaClipboardCheck size={24} className="flex-shrink-0" />
                </div>
                <div className="flex-1">
                  <h3
                    className={`text-xl font-semibold transition-colors ${
                      modoOscuro
                        ? 'hover:text-[#39A900] text-white'
                        : 'hover:text-[#39A900] text-gray-800'
                    }`}
                  >
                    {tipo.nombre}
                  </h3>
                </div>
              </div>

              <div className="flex gap-3 self-end sm:self-auto">
                <button
                  onClick={() => handleEditTipo(tipo.id)}
                  title="Editar tipo"
                  className={`p-3 rounded-xl transition-all transform hover:scale-110 flex items-center justify-center h-12 w-12 ${
                    modoOscuro
                      ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50'
                      : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                  }`}
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={() => handleDeleteTipo(tipo.id)}
                  title="Eliminar tipo"
                  className={`p-3 rounded-xl transition-all transform hover:scale-110 flex items-center justify-center h-12 w-12 ${
                    modoOscuro
                      ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                      : 'bg-red-50 text-red-600 hover:bg-red-100'
                  }`}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>

    {/* Modal */}
    <ModalTipo
      abierto={mostrarModal}
      editando={!!editandoId}
      valor={nuevoTipo}
      onCerrar={cerrarModal}
      onGuardar={handleSaveTipo}
      onCambio={setNuevoTipo}
      modoOscuro={modoOscuro}
    />
  </>
);
}
