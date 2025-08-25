'use client';
import { useState } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import { FaBookOpen } from 'react-icons/fa';
import ModalInteres from './crearInteres';
import Swal from 'sweetalert2'; // 1. Importar SweetAlert2

interface InteresesProps {
  modoOscuro: boolean;
}

interface Interes {
  id: string;
  nombre: string;
  descripcion: string;
}

export default function Intereses({ modoOscuro }: InteresesProps) {
  const [intereses, setIntereses] = useState<Interes[]>([
    { id: '1', nombre: 'Educación', descripcion: 'Cursos y formación' },
    { id: '2', nombre: 'Tecnología', descripcion: 'TIC y dispositivos' },
  ]);
  const [busqueda, setBusqueda] = useState('');
  const [modoEdicion, setModoEdicion] = useState(false);
  const [interesActual, setInteresActual] = useState<Interes>({ id: '', nombre: '', descripcion: '' });
  const [mostrarModal, setMostrarModal] = useState(false);

  const abrirModal = () => {
    setInteresActual({ id: '', nombre: '', descripcion: '' });
    setModoEdicion(false);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setInteresActual({ id: '', nombre: '', descripcion: '' });
    setModoEdicion(false);
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
  const handleGuardar = () => {
    if (!interesActual.nombre || !interesActual.descripcion) {
      showWarning('Por favor, completa los campos de nombre y descripción.');
      return;
    }

    if (modoEdicion) {
      setIntereses(prev =>
        prev.map(i => (i.id === interesActual.id ? interesActual : i))
      );
      showSuccess('Interés actualizado correctamente.');
    } else {
      setIntereses(prev => [
        ...prev,
        { ...interesActual, id: Date.now().toString() },
      ]);
      showSuccess('Interés agregado exitosamente.');
    }
    cerrarModal();
  };

  const handleEditar = (id: string) => {
    const interes = intereses.find(i => i.id === id);
    if (interes) {
      setInteresActual(interes);
      setModoEdicion(true);
      setMostrarModal(true);
    }
  };

  // 3. Lógica de eliminación con alerta de confirmación
  const handleEliminar = (id: string) => {
    Swal.fire({
      title: '¿Estás seguro de eliminar este interés?',
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
        setIntereses(prev => prev.filter(i => i.id !== id));
        showSuccess('El interés ha sido eliminado.');
      }
    });
  };

  const interesesFiltrados = intereses.filter(i =>
    i.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Estilos condicionales
  const bgColor = modoOscuro ? 'bg-[#1a0526]' : 'bg-white';
  const textColor = modoOscuro ? 'text-white' : 'text-gray-900';
  const borderColor = modoOscuro ? 'border-white/20' : 'border-gray-200';
  const cardBg = modoOscuro ? 'bg-white/10' : 'bg-white';
  const placeholderColor = modoOscuro ? 'placeholder-gray-400' : 'placeholder-gray-500';
  const searchBg = modoOscuro ? 'bg-white/10' : 'bg-white';
  const searchBorder = modoOscuro ? 'border-white/20' : 'border-gray-300';
  const searchFocus = modoOscuro ? 'focus:ring-[#39A900] focus:border-[#39A900]' : 'focus:ring-[#39A900] focus:border-[#39A900]';
  const iconBg = modoOscuro ? 'bg-[#39A900]/20' : 'bg-[#39A900]/10';
  const secondaryText = modoOscuro ? 'text-gray-300' : 'text-gray-600';
  const titleColor = modoOscuro ? 'text-white' : 'text-gray-800';
  const detailText = modoOscuro ? 'text-gray-400' : 'text-gray-600';

  return (
    <>
      <div className={`rounded-3xl p-10 max-w-9xl mx-auto my-12 ${bgColor} ${textColor} ${borderColor}`}>
        {/* ... (resto del JSX, no necesita cambios) ... */}
        <div className="text-center mb-10">
          <h2 className={`text-4xl font-extrabold mb-2 ${titleColor}`}>
            Gestión de Intereses
          </h2>
          <p className={`text-lg ${secondaryText}`}>
            Administra los intereses disponibles
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <input
            type="text"
            placeholder="Buscar interés..."
            className={`border rounded-2xl px-5 py-3 text-lg focus:outline-none focus:ring-2 w-full sm:w-96 transition-all duration-300 hover:shadow-md ${searchBg} ${textColor} ${searchBorder} ${searchFocus} ${placeholderColor}`}
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button
            onClick={abrirModal}
            className="flex items-center gap-2 px-6 py-3 bg-[#39A900] text-white text-lg font-medium rounded-2xl hover:bg-[#2d8500] transition-all shadow-md hover:shadow-xl transform hover:scale-105 duration-300 w-full sm:w-auto justify-center"
          >
            <Plus size={20} />
            Agregar Interés
          </button>
        </div>

        <div className="space-y-5">
          {interesesFiltrados.length === 0 ? (
            <div className={`text-center py-16 rounded-2xl ${modoOscuro ? 'bg-gray-800/30' : 'bg-gray-50'}`}>
              <p className={`${secondaryText} text-lg`}>
                {busqueda ? `No se encontraron intereses que coincidan con "${busqueda}"` : 'No hay intereses registrados'}
              </p>
            </div>
          ) : (
            interesesFiltrados.map((interes) => (
              <div 
                key={interes.id} 
                className={`p-6 rounded-2xl border shadow-md hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 transform hover:-translate-y-1 ${cardBg} ${borderColor} ${modoOscuro ? 'hover:border-[#39A900]/50' : 'hover:border-[#39A900]'}`}
              >
                <div className="flex items-start gap-4 w-full">
                  <div className={`p-4 rounded-xl transition-colors ${iconBg} ${modoOscuro ? 'text-[#39A900] hover:bg-[#39A900]/30' : 'text-[#39A900] hover:bg-[#39A900]/20'}`}>
                    <FaBookOpen size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-xl font-semibold transition-colors ${modoOscuro ? 'hover:text-[#39A900] text-white' : 'hover:text-[#39A900] text-gray-800'}`}>
                      {interes.nombre}
                    </h3>
                    <p className={`text-md ${detailText} mt-2`}>
                      {interes.descripcion}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 self-end sm:self-auto">
                  <button
                    onClick={() => handleEditar(interes.id)}
                    title="Editar interés"
                    className={`p-3 rounded-xl transition-all transform hover:scale-110 ${modoOscuro ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => handleEliminar(interes.id)}
                    title="Eliminar interés"
                    className={`p-3 rounded-xl transition-all transform hover:scale-110 ${modoOscuro ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <ModalInteres
        mostrar={mostrarModal}
        modoEdicion={modoEdicion}
        interes={interesActual}
        onClose={cerrarModal}
        onChange={(campo, valor) => setInteresActual(prev => ({ ...prev, [campo]: valor }))}
        onGuardar={handleGuardar}
        modoOscuro={modoOscuro}
      />
    </>
  );
}