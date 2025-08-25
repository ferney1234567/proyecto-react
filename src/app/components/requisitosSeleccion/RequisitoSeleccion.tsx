'use client';

import { useState } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import { FaClipboardCheck } from 'react-icons/fa';
import Swal from 'sweetalert2';
import RequisitosModal from './crearRequisitosSeleccion';

interface RequisitosSeleccionProps {
  modoOscuro: boolean;
}

interface Requisito {
  id: string;
  nombre: string;
  requisito: string;
  tipo: string;
}

export default function RequisitosSeleccion({ modoOscuro }: RequisitosSeleccionProps) {
  const [requisitos, setRequisitos] = useState<Requisito[]>([
    { id: '1', nombre: 'Convocatoria TIC', requisito: 'Ser mayor de edad', tipo: 'General' },
    { id: '2', nombre: 'Beca Universitaria', requisito: 'Promedio mínimo de 3.5', tipo: 'Educativo' },
  ]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [nuevoRequisito, setNuevoRequisito] = useState<Requisito>({
    id: '',
    nombre: '',
    requisito: '',
    tipo: '',
  });
  const [searchTerm, setSearchTerm] = useState('');

  // === ALERTAS SWEETALERT2 ===
  const showSuccess = (mensaje: string) => {
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: mensaje,
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
      confirmButtonColor: '#39A900',
      background: modoOscuro ? '#1a0526' : '#fff',
      color: modoOscuro ? '#fff' : '#333'
    });
  };

  // === LÓGICA DE REQUISITOS ===
  const requisitosFiltrados = requisitos.filter(r =>
    r.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.requisito.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddRequisito = () => {
    setNuevoRequisito({ id: '', nombre: '', requisito: '', tipo: '' });
    setEditandoId(null);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setNuevoRequisito({ id: '', nombre: '', requisito: '', tipo: '' });
    setEditandoId(null);
  };

  const handleGuardar = () => {
    const { nombre, requisito, tipo } = nuevoRequisito;
    if (nombre.trim() === '' || requisito.trim() === '' || tipo.trim() === '') {
      showWarning('Por favor, completa todos los campos.');
      return;
    }

    if (editandoId) {
      setRequisitos(requisitos.map(r => (r.id === editandoId ? { ...nuevoRequisito, id: editandoId } : r)));
      showSuccess('El requisito fue actualizado correctamente');
    } else {
      setRequisitos([...requisitos, { ...nuevoRequisito, id: Date.now().toString() }]);
      showSuccess('El requisito fue agregado correctamente');
    }

    cerrarModal();
  };

  const handleEditRequisito = (id: string) => {
    const requisito = requisitos.find(r => r.id === id);
    if (requisito) {
      setNuevoRequisito(requisito);
      setEditandoId(id);
      setMostrarModal(true);
    }
  };

  const handleDelete = (id: string) => {
    Swal.fire({
      title: '¿Eliminar este requisito?',
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
        setRequisitos(requisitos.filter((r) => r.id !== id));
        showSuccess('El requisito fue eliminado correctamente');
      }
    });
  };

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
  const detailText = modoOscuro ? 'text-gray-400' : 'text-gray-600';
return (
  <>
    {/* Contenedor principal */}
    <div className={`rounded-3xl p-10 max-w-9xl mx-auto my-12 ${bgColor} ${textColor}`}>
      {/* Cabecera */}
      <div className="text-center mb-10">
        <h2 className={`text-4xl font-extrabold mb-2 ${titleColor}`}>
          Requisitos de Selección
        </h2>
        <p className={`text-lg ${secondaryText}`}>
          Administra los requisitos del sistema
        </p>
      </div>

      {/* Buscador + botón */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
        <input
          type="text"
          placeholder="Buscar requisito o nombre..."
          className={`border rounded-2xl px-5 py-3 text-lg focus:outline-none focus:ring-2 w-full sm:w-96 transition-all duration-300 hover:shadow-md ${searchBg} ${textColor} ${searchBorder} ${searchFocus} ${placeholderColor}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={handleAddRequisito}
          className="flex items-center gap-2 px-6 py-3 bg-[#39A900] text-white text-lg font-medium rounded-2xl hover:bg-[#2d8500] transition-all shadow-md hover:shadow-xl transform hover:scale-105 duration-300 w-full sm:w-auto justify-center"
        >
          <Plus size={20} />
          Agregar Requisito
        </button>
      </div>

      {/* Lista */}
      <div className="space-y-5">
        {requisitosFiltrados.length === 0 ? (
          <div className={`text-center py-16 rounded-2xl border ${emptyStateBg}`}>
            <p className={`${secondaryText} text-lg`}>No se encontraron requisitos</p>
          </div>
        ) : (
          requisitosFiltrados.map((r) => (
            <div 
              key={r.id} 
              className={`p-6 rounded-2xl border shadow-md hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 transform hover:-translate-y-1 ${cardBg} ${borderColor} ${
                modoOscuro ? 'hover:border-[#39A900]/50' : 'hover:border-[#39A900]'
              }`}
            >
              <div className="flex items-start gap-4 w-full">
                <div className={`p-4 rounded-xl flex items-center justify-center h-12 w-12 transition-colors ${iconBg}`}>
                  <FaClipboardCheck size={24} className="flex-shrink-0 text-[#39A900]" />
                </div>
                <div className="flex-1">
                  <h3 className={`text-xl font-semibold transition-colors ${
                    modoOscuro ? 'hover:text-[#39A900] text-white' : 'hover:text-[#39A900] text-gray-800'
                  }`}>
                    {r.nombre}
                  </h3>
                  <p className={`text-md ${detailText} mt-2`}>
                    <span className="font-medium">Tipo:</span> {r.tipo}
                  </p>
                  <p className={`text-md ${detailText} mt-1`}>
                    <span className="font-medium">Requisito:</span> {r.requisito}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 self-end sm:self-auto">
                <button
                  onClick={() => handleEditRequisito(r.id)}
                  title="Editar requisito"
                  className={`p-3 rounded-xl transition-all transform hover:scale-110 flex items-center justify-center h-12 w-12 ${
                    modoOscuro
                      ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50'
                      : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                  }`}
                >
                  <Edit size={20} className="flex-shrink-0" />
                </button>
                <button
                  onClick={() => handleDelete(r.id)}
                  title="Eliminar requisito"
                  className={`p-3 rounded-xl transition-all transform hover:scale-110 flex items-center justify-center h-12 w-12 ${
                    modoOscuro
                      ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                      : 'bg-red-50 text-red-600 hover:bg-red-100'
                  }`}
                >
                  <Trash2 size={20} className="flex-shrink-0" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>

    {/* Modal */}
    <RequisitosModal
      mostrar={mostrarModal}
      editandoId={editandoId}
      nuevoRequisito={nuevoRequisito}
      setNuevoRequisito={setNuevoRequisito}
      onCerrar={cerrarModal}
      onGuardar={handleGuardar}
      modoOscuro={modoOscuro}
    />
  </>
);
}
