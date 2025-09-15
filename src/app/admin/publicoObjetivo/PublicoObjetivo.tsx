'use client';
import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import { FaUsers } from 'react-icons/fa';
import ModalPublico from './crearPublico';
import EditarPublicoModal from './editarPublicoObjetivo';
import Swal from 'sweetalert2';
import { getPublicos, createPublico, updatePublico, deletePublico } from '../../api/publicoObjetivo/routes';

interface PublicoObjetivoProps {
  modoOscuro: boolean;
}

interface Publico {
  id: string;
  name: string; // 👈 ajustado al backend
}

export default function PublicoObjetivo({ modoOscuro }: PublicoObjetivoProps) {
  const [publicos, setPublicos] = useState<Publico[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [editandoId, setEditandoId] = useState<string | null>(null);

  // === ALERTAS ===
  const showSuccess = (mensaje: string) =>
    Swal.fire({ icon: 'success', title: '¡Éxito!', text: mensaje, confirmButtonColor: '#39A900',
      background: modoOscuro ? '#1a0526' : '#fff', color: modoOscuro ? '#fff' : '#333' });

  const showWarning = (mensaje: string) =>
    Swal.fire({ icon: 'warning', title: 'Atención', text: mensaje, confirmButtonColor: '#39A900',
      background: modoOscuro ? '#1a0526' : '#fff', color: modoOscuro ? '#fff' : '#333' });

  // === Cargar desde API ===
  const cargarPublicos = async () => {
    try {
      const data = await getPublicos();
      setPublicos(data.data || []); // 👈 depende cómo devuelva tu backend
    } catch (error: any) {
      showWarning(error.message);
    }
  };

  useEffect(() => {
    cargarPublicos();
  }, []);

  // === Guardar ===
  const guardarPublico = async () => {
    if (!nuevoNombre.trim()) {
      showWarning('El nombre es obligatorio');
      return;
    }
    try {
      if (editandoId) {
        await updatePublico(editandoId, { name: nuevoNombre });
        showSuccess('Público actualizado correctamente');
        setMostrarModalEditar(false);
      } else {
        await createPublico({ name: nuevoNombre });
        showSuccess('Público agregado correctamente');
        setMostrarModal(false);
      }
      await cargarPublicos();
    } catch (error: any) {
      showWarning(error.message);
    }
  };

  // === Eliminar ===
  const eliminarPublico = (id: string) => {
    Swal.fire({
      title: '¿Eliminar este público objetivo?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: modoOscuro ? '#1a0526' : '#fff',
      color: modoOscuro ? '#fff' : '#333',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deletePublico(id);
          await cargarPublicos();
          showSuccess('Público eliminado correctamente');
        } catch (error: any) {
          showWarning(error.message);
        }
      }
    });
  };

  // === Editar ===
  const editarPublico = (p: Publico) => {
    setEditandoId(p.id);
    setNuevoNombre(p.name);
    setMostrarModalEditar(true);
  };

  // === Crear ===
  const abrirModal = () => { setEditandoId(null); setNuevoNombre(''); setMostrarModal(true); };

  // === Filtrar ===
  const filtrados = publicos.filter(p => p.name.toLowerCase().includes(busqueda.toLowerCase()));

  // === Estilos ===
  const titleColor = modoOscuro ? 'text-white' : 'text-gray-900';
  const secondaryText = modoOscuro ? 'text-gray-300' : 'text-gray-600';
  const searchBg = modoOscuro ? 'bg-white/10' : 'bg-white';
  const searchBorder = modoOscuro ? 'border-white/20' : 'border-gray-300';
  const cardBg = modoOscuro ? 'bg-white/10' : 'bg-white';
  const borderColor = modoOscuro ? 'border-white/20' : 'border-gray-200';
  const iconBg = modoOscuro ? 'bg-[#39A900]/20' : 'bg-[#39A900]/10';

  return (
    <>
      <div className={`rounded-3xl p-10 max-w-9xl mx-auto my-12 ${modoOscuro ? 'bg-[#1a0526] text-white' : 'bg-white text-gray-900'}`}>
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className={`text-4xl font-extrabold mb-2 ${titleColor}`}>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
              Gestión de Público Objetivo
            </span>
          </h2>
          <p className={`text-lg ${secondaryText}`}>Administra los públicos objetivos del sistema</p>
        </div>

        {/* Buscador + botón */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <input
            type="text"
            placeholder="Buscar público..."
            className={`border rounded-2xl px-5 py-3 text-lg focus:outline-none focus:ring-2 w-full sm:w-96 ${searchBg} ${searchBorder}`}
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button
            onClick={abrirModal}
            className="flex items-center gap-2 px-6 py-3 bg-[#39A900] text-white text-lg font-medium rounded-2xl hover:bg-[#2d8500] transition-all shadow-md hover:shadow-xl transform hover:scale-105 duration-300 w-full sm:w-auto"
          >
            <Plus size={20} /> Nuevo Público
          </button>
        </div>

        {/* Lista */}
        <div className="space-y-5">
          {filtrados.length === 0 ? (
            <div className={`text-center py-16 rounded-2xl border ${modoOscuro ? 'bg-gray-800/30' : 'bg-gray-50'}`}>
              <p className={secondaryText}>No se encontraron públicos</p>
            </div>
          ) : (
            filtrados.map((p) => (
              <div key={p.id} className={`p-6 rounded-2xl border shadow-md flex justify-between items-center ${cardBg} ${borderColor}`}>
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-xl ${iconBg} text-[#39A900]`}>
                    <FaUsers size={24} />
                  </div>
                  <h3 className="text-xl font-semibold">{p.name}</h3>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => editarPublico(p)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:scale-110 transition"><Edit size={20} /></button>
                  <button onClick={() => eliminarPublico(p.id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:scale-110 transition"><Trash2 size={20} /></button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal Crear */}
      <ModalPublico mostrar={mostrarModal} cerrar={() => setMostrarModal(false)} nombre={nuevoNombre} setNombre={setNuevoNombre} onGuardar={guardarPublico} editandoId={editandoId} modoOscuro={modoOscuro} />

      {/* Modal Editar */}
      <EditarPublicoModal mostrar={mostrarModalEditar} cerrar={() => setMostrarModalEditar(false)} nombre={nuevoNombre} setNombre={setNuevoNombre} onGuardar={guardarPublico} modoOscuro={modoOscuro} />
    </>
  );
}
