'use client';
import { useState } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import { AiOutlineUser } from 'react-icons/ai';
import ModalRequisito from './crearRequisito';
import Swal from 'sweetalert2';

interface RequisitosProps {
  modoOscuro: boolean;
}

interface Requisito {
  id: string;
  nombre: string;
  observacion: string;
  entidad: string;
  tipo: string;
}

export default function Requisitos({ modoOscuro }: RequisitosProps) {
  const [requisitos, setRequisitos] = useState<Requisito[]>([
    {
      id: '1',
      nombre: 'Ser mayor de edad',
      observacion: 'Debe tener 18 años cumplidos al momento de postular.',
      entidad: 'Ministerio de Educación',
      tipo: 'General',
    },
    {
      id: '2',
      nombre: 'Carta de intención',
      observacion: 'Firmada por el postulante y dirigida a la autoridad competente.',
      entidad: 'Agencia Nacional de Proyectos',
      tipo: 'Educativo',
    },
  ]);

  const [buscar, setBuscar] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoRequisito, setNuevoRequisito] = useState<Requisito>({
    id: '',
    nombre: '',
    observacion: '',
    entidad: '',
    tipo: '',
  });

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

  // === ELIMINAR REQUISITO CON CONFIRMACIÓN SWEETALERT2 ===
  const eliminarRequisito = (id: string) => {
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

  // === MODAL ===
  const abrirModal = () => {
    setNuevoRequisito({ id: '', nombre: '', observacion: '', entidad: '', tipo: '' });
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setNuevoRequisito({ id: '', nombre: '', observacion: '', entidad: '', tipo: '' });
  };

  // === GUARDAR REQUISITO ===
  const guardarRequisito = () => {
    if (!nuevoRequisito.nombre.trim()) {
      showWarning('El campo "Nombre" es obligatorio');
      return;
    }
    if (!nuevoRequisito.entidad.trim()) {
      showWarning('El campo "Entidad" es obligatorio');
      return;
    }

    const requisitoNuevo = { ...nuevoRequisito, id: Date.now().toString() };
    setRequisitos([...requisitos, requisitoNuevo]);
    cerrarModal();
    showSuccess('El requisito fue agregado correctamente');
  };

  // === EDITAR REQUISITO ===
  const editarRequisito = (id: string) => {
    const seleccionado = requisitos.find((r) => r.id === id);
    if (seleccionado) {
      setNuevoRequisito(seleccionado);
      setRequisitos(requisitos.filter((r) => r.id !== id));
      setMostrarModal(true);
    }
  };

  // === FILTRO DE BÚSQUEDA ===
  const filtrados = requisitos.filter((r) =>
    r.nombre.toLowerCase().includes(buscar.toLowerCase())
  );

  // Estilos condicionales basados en modoOscuro
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
    <div
    className={`rounded-3xl p-10 max-w-9xl mx-auto my-12  
      ${modoOscuro 
        ? 'bg-[#1a0526] text-white' 
        : 'bg-white-50 text-gray-900' // Blanco más suave
      }`}
  >
    {/* Efectos de fondo decorativos */}
    {!modoOscuro && (
      <>
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </>
      )}

      {/* Cabecera */}
      <div className="text-center mb-10">
        <h2 className={`text-4xl font-extrabold mb-2 ${titleColor}`}>
          Gestión de Requisitos
        </h2>
        <p className={`text-lg ${secondaryText}`}>
          Administra los requisitos disponibles
        </p>
      </div>

      {/* Buscador y botón */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
        <input
          type="text"
          placeholder="Buscar requisitos..."
          className={`border rounded-2xl px-5 py-3 text-lg focus:outline-none focus:ring-2 w-full sm:w-96 transition-all duration-300 hover:shadow-md ${searchBg} ${textColor} ${searchBorder} ${searchFocus} ${placeholderColor}`}
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
        />
        <button
          onClick={abrirModal}
          className="flex items-center gap-2 px-6 py-3 bg-[#39A900] text-white text-lg font-medium rounded-2xl hover:bg-[#2d8500] transition-all shadow-md hover:shadow-xl transform hover:scale-105 duration-300 w-full sm:w-auto justify-center"
        >
          <Plus size={20} />
          Agregar Requisito
        </button>
      </div>

      {/* Lista */}
      <div className="space-y-5">
        {filtrados.length === 0 ? (
          <div className={`text-center py-16 rounded-2xl ${emptyStateBg}`}>
            <p className={`${secondaryText} text-lg`}>
              No se encontraron requisitos
            </p>
          </div>
        ) : (
          filtrados.map((req) => (
            <div
              key={req.id}
              className={`p-6 rounded-2xl border shadow-md hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 transform hover:-translate-y-1 ${cardBg} ${borderColor} ${
                modoOscuro ? 'hover:border-[#39A900]/50' : 'hover:border-[#39A900]'
              }`}
            >
              <div className="flex items-start gap-4 w-full">
                <div
                  className={`p-4 rounded-xl mt-1 transition-colors ${iconBg} text-[#39A900]`}
                >
                  <AiOutlineUser size={24} />
                </div>
                <div className="flex-1 space-y-3">
                  <h3
                    className={`text-xl font-semibold transition-colors ${
                      modoOscuro
                        ? 'hover:text-[#39A900] text-white'
                        : 'hover:text-[#39A900] text-gray-800'
                    }`}
                  >
                    Nombre: {req.nombre}
                  </h3>
                  <p className={`text-md ${detailText}`}>
                    <span
                      className={`font-medium ${
                        modoOscuro ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      Observaciones:
                    </span>{' '}
                    {req.observacion}
                  </p>
                  <p className={`text-md ${detailText}`}>
                    <span
                      className={`font-medium ${
                        modoOscuro ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      Entidad:
                    </span>{' '}
                    {req.entidad}
                  </p>
                  <p className={`text-md ${detailText}`}>
                    <span
                      className={`font-medium ${
                        modoOscuro ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      Requisito de Selección:
                    </span>{' '}
                    {req.tipo}
                  </p>
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-3 self-end sm:self-auto">
                <button
                  onClick={() => editarRequisito(req.id)}
                  title="Editar requisito"
                  className={`p-3 rounded-xl transition-all transform hover:scale-110 ${
                    modoOscuro
                      ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50'
                      : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                  }`}
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={() => eliminarRequisito(req.id)}
                  title="Eliminar requisito"
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

      {/* Modal */}
      {mostrarModal && (
        <ModalRequisito
          requisito={nuevoRequisito}
          setRequisito={setNuevoRequisito}
          onClose={cerrarModal}
          onSave={guardarRequisito}
          modoOscuro={modoOscuro}
        />
      )}
    </div>
  );
}
