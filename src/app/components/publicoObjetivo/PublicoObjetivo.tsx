'use client';
import { useState } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import { FaUsers } from 'react-icons/fa';
import ModalPublico from './modalpublico';
import Swal from 'sweetalert2';

interface PublicoObjetivoProps {
  modoOscuro: boolean;
}

interface Publico {
  id: string;
  nombre: string;
}

export default function PublicoObjetivo({ modoOscuro }: PublicoObjetivoProps) {
  const [publicos, setPublicos] = useState<Publico[]>([
    { id: '1', nombre: 'Estudiantes' },
    { id: '2', nombre: 'Profesores' },
  ]);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [editandoId, setEditandoId] = useState<string | null>(null);

  // === ALERTAS SWEETALERT2 (ahora dentro del componente) ===
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

  const abrirModal = () => {
    setEditandoId(null);
    setNuevoNombre('');
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setNuevoNombre('');
    setEditandoId(null);
  };

  const guardarPublico = () => {
    if (nuevoNombre.trim() === '') {
      showWarning('El nombre del público es obligatorio');
      return;
    }

    if (editandoId) {
      setPublicos(publicos.map(p => p.id === editandoId ? { ...p, nombre: nuevoNombre } : p));
      showSuccess('El público fue actualizado correctamente');
    } else {
      const nuevo: Publico = { id: Date.now().toString(), nombre: nuevoNombre };
      setPublicos([...publicos, nuevo]);
      showSuccess('El público fue agregado correctamente');
    }
    cerrarModal();
  };

  const editarPublico = (id: string, nombre: string) => {
    setEditandoId(id);
    setNuevoNombre(nombre);
    setMostrarModal(true);
  };

  const eliminarPublico = (id: string) => {
    Swal.fire({
      title: '¿Eliminar este público?',
      text: 'Esta acción no se puede deshacer',
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
        setPublicos(publicos.filter(p => p.id !== id));
        showSuccess('El público fue eliminado correctamente');
      }
    });
  };

  const filtrados = publicos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // === Estilos condicionales ===
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
      <div className={`rounded-3xl shadow-2xl p-10 max-w-9xl mx-auto my-12  ${bgColor} ${textColor} ${borderColor}`}>
        {/* Fondo decorativo - solo en modo claro */}
        {!modoOscuro && (
          <>
            <div className="absolute top-0 left-0 w-40 h-40 bg-[#39A900]/10 rounded-full -z-10"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#39A900]/10 rounded-full -z-10"></div>
          </>
        )}

        {/* Cabecera */}
        <div className="text-center mb-10">
          <h2 className={`text-4xl font-extrabold mb-2 ${titleColor}`}>
            Gestionar Público Objetivo
          </h2>
          <p className={`text-lg ${secondaryText}`}>
            Administra el público objetivo disponible en el sistema
          </p>
        </div>

        {/* Buscador y botón */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <input
            type="text"
            placeholder="Buscar público..."
            className={`border rounded-2xl px-5 py-3 text-lg focus:outline-none focus:ring-2 w-full sm:w-96 transition-all duration-300 hover:shadow-md ${searchBg} ${textColor} ${searchBorder} ${searchFocus} ${placeholderColor}`}
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button
            onClick={abrirModal}
            className="flex items-center gap-2 px-6 py-3 bg-[#39A900] text-white text-lg font-medium rounded-2xl hover:bg-[#2d8500] transition-all shadow-md hover:shadow-xl transform hover:scale-105 duration-300 w-full sm:w-auto justify-center"
          >
            <Plus size={20} /> Agregar Nuevo Público
          </button>
        </div>

        {/* Lista */}
        <div className="space-y-5">
          {filtrados.length === 0 ? (
            <div className={`text-center py-16 rounded-2xl ${emptyStateBg}`}>
              <p className={`${secondaryText} text-lg`}>No se encontró ningún público</p>
            </div>
          ) : (
            filtrados.map((p) => (
              <div
                key={p.id}
                className={`p-6 rounded-2xl border shadow-md hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 transform hover:-translate-y-1 ${cardBg} ${borderColor} ${modoOscuro ? 'hover:border-[#39A900]/50' : 'hover:border-[#39A900]'}`}
              >
                <div className="flex items-center gap-4 w-full">
                  <div className={`p-4 rounded-xl mt-1 transition-colors ${iconBg} ${modoOscuro ? 'text-[#39A900]' : 'text-[#39A900]'}`}>
                    <FaUsers size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-xl font-semibold transition-colors ${modoOscuro ? 'hover:text-[#39A900] text-white' : 'hover:text-[#39A900] text-gray-800'}`}>
                      {p.nombre}
                    </h3>
                  </div>
                </div>
                <div className="flex gap-3 self-end sm:self-auto">
                  <button
                    onClick={() => editarPublico(p.id, p.nombre)}
                    title="Editar público"
                    className={`p-3 rounded-xl transition-all transform hover:scale-110 ${modoOscuro ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => eliminarPublico(p.id)}
                    title="Eliminar público"
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

      <ModalPublico
        mostrar={mostrarModal}
        cerrar={cerrarModal}
        nombre={nuevoNombre}
        setNombre={setNuevoNombre}
        onGuardar={guardarPublico}
        editandoId={editandoId}
        modoOscuro={modoOscuro}
      />
    </>
  );
}