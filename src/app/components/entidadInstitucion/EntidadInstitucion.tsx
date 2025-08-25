'use client';
import { useState } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import { FaBuilding } from 'react-icons/fa';
import Swal from 'sweetalert2';
import EntidadModal from './crearEntidad';

interface EntidadInstitucionProps {
  modoOscuro: boolean;
}

interface Entidad {
  id: string;
  name: string;
}

export default function EntidadInstitucion({ modoOscuro }: EntidadInstitucionProps) {
  const [entidades, setEntidades] = useState<Entidad[]>([
    { id: '1', name: 'Universidad Nacional' },
    { id: '2', name: 'Ministerio de Educación' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevaEntidad, setNuevaEntidad] = useState('');

  // === ALERTAS SWEETALERT2 ===
  const showSuccess = (mensaje: string) => {
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: mensaje,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#39A900',
      background: modoOscuro ? '#1a0526' : '#fff',
      color: modoOscuro ? '#fff' : '#333',
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

  // === MANEJADORES ===
  const handleAddEntidad = () => setMostrarModal(true);

  const cerrarModal = () => {
    setMostrarModal(false);
    setNuevaEntidad('');
  };

  const handleSaveEntidad = () => {
    if (nuevaEntidad.trim() === '') {
      showWarning('El nombre de la entidad es obligatorio');
      return;
    }
    const nueva: Entidad = { id: Date.now().toString(), name: nuevaEntidad };
    setEntidades([...entidades, nueva]);
    showSuccess('La entidad fue agregada correctamente');
    cerrarModal();
  };

  const handleEditEntidad = (id: string) => {
    const entidad = entidades.find((ent) => ent.id === id);
    if (!entidad) return;

    Swal.fire({
      title: 'Editar entidad',
      input: 'text',
      inputValue: entidad.name,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#39A900',
      background: modoOscuro ? '#1a0526' : '#fff',
      color: modoOscuro ? '#fff' : '#333',
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        setEntidades(entidades.map((ent) =>
          ent.id === id ? { ...ent, name: result.value } : ent
        ));
        showSuccess('La entidad fue actualizada correctamente');
      }
    });
  };

  const handleDeleteEntidad = (id: string) => {
    Swal.fire({
      title: '¿Eliminar esta entidad?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      background: modoOscuro ? '#1a0526' : '#fff',
      color: modoOscuro ? '#fff' : '#333',
    }).then((result) => {
      if (result.isConfirmed) {
        setEntidades(entidades.filter((ent) => ent.id !== id));
        showSuccess('La entidad fue eliminada correctamente');
      }
    });
  };

  const filteredEntidades = entidades.filter((ent) =>
    ent.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // === ESTILOS ===
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
    <div
      className={`rounded-3xl p-10 max-w-9xl mx-auto my-12 ${bgColor} ${textColor}`}
    >
      {/* Cabecera */}
      <div className="text-center mb-10">
        <h2 className={`text-4xl font-extrabold mb-2 ${titleColor}`}>
          Entidad Institución
        </h2>
        <p className={`text-lg ${secondaryText}`}>
          Administra las entidades disponibles
        </p>
      </div>

      {/* Buscador + botón */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
        <input
          type="text"
          placeholder="Buscar entidad..."
          className={`border rounded-2xl px-5 py-3 text-lg focus:outline-none focus:ring-2 w-full sm:w-96 transition-all duration-300 hover:shadow-md ${searchBg} ${textColor} ${searchBorder} ${searchFocus} ${placeholderColor}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={handleAddEntidad}
          className="flex items-center gap-2 px-6 py-3 bg-[#39A900] text-white text-lg font-medium rounded-2xl hover:bg-[#2d8500] transition-all shadow-md hover:shadow-xl transform hover:scale-105 duration-300 w-full sm:w-auto justify-center"
        >
          <Plus size={20} />
          Agregar Nueva Entidad
        </button>
      </div>

      {/* Lista de entidades */}
      <div className="space-y-5">
        {filteredEntidades.length === 0 ? (
          <div className={`text-center py-16 rounded-2xl border ${emptyStateBg}`}>
            <p className={`${secondaryText} text-lg`}>
              No se encontraron entidades
            </p>
          </div>
        ) : (
          filteredEntidades.map((ent) => (
            <div
              key={ent.id}
              className={`p-6 rounded-2xl border shadow-md hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 transform hover:-translate-y-1 ${cardBg} ${borderColor} ${
                modoOscuro
                  ? 'hover:border-[#39A900]/50'
                  : 'hover:border-[#39A900]'
              }`}
            >
              <div className="flex items-center gap-4 w-full">
                <div
                  className={`p-4 rounded-xl mt-1 transition-colors ${iconBg} text-[#39A900]`}
                >
                  <FaBuilding size={24} />
                </div>
                <div className="flex-1">
                  <h3
                    className={`text-xl font-semibold transition-colors ${
                      modoOscuro
                        ? 'hover:text-[#39A900] text-white'
                        : 'hover:text-[#39A900] text-gray-800'
                    }`}
                  >
                    {ent.name}
                  </h3>
                </div>
              </div>
              <div className="flex gap-3 self-end sm:self-auto">
                <button
                  onClick={() => handleEditEntidad(ent.id)}
                  title="Editar entidad"
                  className={`p-3 rounded-xl transition-all transform hover:scale-110 ${
                    modoOscuro
                      ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50'
                      : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                  }`}
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={() => handleDeleteEntidad(ent.id)}
                  title="Eliminar entidad"
                  className={`p-3 rounded-xl transition-all transform hover:scale-110 ${
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
    <EntidadModal
      visible={mostrarModal}
      onClose={cerrarModal}
      onSave={handleSaveEntidad}
      nuevaEntidad={nuevaEntidad}
      setNuevaEntidad={setNuevaEntidad}
      modoOscuro={modoOscuro}
    />
  </>
);
}
