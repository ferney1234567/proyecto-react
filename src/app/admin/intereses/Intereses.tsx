'use client';
import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import { FaBookOpen } from 'react-icons/fa';
import ModalInteres from './crearInteres';
import EditarInteres from './editarIntereses';
import Swal from 'sweetalert2';
import {
  getIntereses,
  createInteres,
  updateInteres,
  deleteInteres,} from '../../api/intereses/routes';

interface InteresesProps {
  modoOscuro: boolean;
}

interface Interes {
  id: string;
  name: string;
  description: string;
}

export default function Intereses({ modoOscuro }: InteresesProps) {
  const [intereses, setIntereses] = useState<Interes[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [modoEdicion, setModoEdicion] = useState(false);
  const [interesActual, setInteresActual] = useState<Interes>({
    id: '',
    name: '',
    description: '',
  });
  const [mostrarModal, setMostrarModal] = useState(false);

  // === ALERTAS ===
  const showSuccess = (mensaje: string) =>
    Swal.fire({ icon: 'success', title: '¡Éxito!', text: mensaje, confirmButtonColor: '#39A900' });

  const showWarning = (mensaje: string) =>
    Swal.fire({ icon: 'warning', title: 'Atención', text: mensaje, confirmButtonColor: '#39A900' });

  // === CARGAR INTERESES DESDE API ===
  const cargarIntereses = async () => {
    try {
      const data = await getIntereses();
      setIntereses(data.data || []);
    } catch (e: any) {
      showWarning(e.message);
    }
  };

  useEffect(() => {
    cargarIntereses();
  }, []);

  // === CREAR / EDITAR ===
  const handleGuardar = async () => {
    if (!interesActual.name || !interesActual.description) {
      showWarning('Completa los campos de nombre y descripción.');
      return;
    }

    try {
      if (modoEdicion) {
        await updateInteres(interesActual.id, {
          name: interesActual.name,
          description: interesActual.description,
        });
        showSuccess('Interés actualizado correctamente.');
      } else {
        await createInteres({
          name: interesActual.name,
          description: interesActual.description,
        });
        showSuccess('Interés agregado exitosamente.');
      }
      cerrarModal();
      await cargarIntereses();
    } catch (e: any) {
      showWarning(e.message);
    }
  };

  const handleEditar = (interes: Interes) => {
    setInteresActual(interes);
    setModoEdicion(true);
    setMostrarModal(true);
  };

  // === ELIMINAR ===
  const handleEliminar = (id: string) => {
    Swal.fire({
      title: '¿Eliminar este interés?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await deleteInteres(id);
          showSuccess('Interés eliminado correctamente');
          await cargarIntereses();
        } catch (e: any) {
          showWarning(e.message);
        }
      }
    });
  };

  // === MODALES ===
  const abrirModal = () => {
    setInteresActual({ id: '', name: '', description: '' });
    setModoEdicion(false);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setInteresActual({ id: '', name: '', description: '' });
    setModoEdicion(false);
    setMostrarModal(false);
  };

  // === FILTRO ===
  const interesesFiltrados = intereses.filter((i) =>
    i.name.toLowerCase().includes(busqueda.toLowerCase())
  );

  // === ESTILOS ===
  const bgColor = modoOscuro ? 'bg-[#1a0526]' : 'bg-white';
  const textColor = modoOscuro ? 'text-white' : 'text-gray-900';
  const borderColor = modoOscuro ? 'border-white/20' : 'border-gray-200';
  const cardBg = modoOscuro ? 'bg-white/10' : 'bg-white';
  const secondaryText = modoOscuro ? 'text-gray-300' : 'text-gray-600';

  return (
    <>
      <div className={`rounded-3xl p-10 max-w-9xl mx-auto my-12 ${bgColor} ${textColor} ${borderColor}`}>
        {/* Cabecera */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold mb-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
              Gestión de Intereses
            </span>
          </h2>
          <p className={`text-lg ${secondaryText}`}>Administra los intereses disponibles</p>
        </div>

        {/* Buscador + botón */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <input
            type="text"
            placeholder="Buscar interés..."
            className="border rounded-2xl px-5 py-3 w-full sm:w-96"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button
            onClick={abrirModal}
            className="flex items-center gap-2 px-6 py-3 bg-[#39A900] text-white rounded-2xl hover:bg-[#2d8500]"
          >
            <Plus size={20} /> Agregar Interés
          </button>
        </div>

        {/* Lista */}
        <div className="space-y-5">
          {interesesFiltrados.map((interes) => (
            <div
              key={interes.id}
              className={`p-6 rounded-2xl border flex justify-between items-center ${cardBg} ${borderColor}`}
            >
              <div className="flex items-center gap-4">
                <FaBookOpen size={20} className="text-[#39A900]" />
                <div>
                  <h3 className="font-bold">{interes.name}</h3>
                  <p className="text-sm text-gray-600">{interes.description}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditar(interes)}
                  className="p-2 bg-blue-50 text-blue-600 rounded-xl"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleEliminar(interes.id)}
                  className="p-2 bg-red-50 text-red-600 rounded-xl"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modales */}
      {modoEdicion ? (
        <EditarInteres
          mostrar={mostrarModal}
          interes={interesActual}
          onClose={cerrarModal}
          onChange={(campo, valor) => setInteresActual((prev) => ({ ...prev, [campo]: valor }))}
          onGuardar={handleGuardar}
          modoOscuro={modoOscuro} modoEdicion={false}        />
      ) : (
        <ModalInteres
            mostrar={mostrarModal}
            interes={interesActual}
            onClose={cerrarModal}
            onChange={(campo, valor) => setInteresActual((prev) => ({ ...prev, [campo]: valor }))}
            onGuardar={handleGuardar}
            modoOscuro={modoOscuro} modoEdicion={false}        />
      )}
    </>
  );
}
