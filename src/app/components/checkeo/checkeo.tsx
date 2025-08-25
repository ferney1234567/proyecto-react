'use client';
import { useState } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import { FaClipboardCheck } from 'react-icons/fa';
import ModalChequeo from './crearChequeo';
import Swal from 'sweetalert2';

interface ChequeosProps {
  modoOscuro: boolean;
}

interface Chequeo {
  id: number;
  chequeo: number;
  empresa: string;  // Cambiado de idEmpresa: number a empresa: string
  requisito: string; // Cambiado de idRequisito: number a requisito: string
}

export default function Chequeos({ modoOscuro }: ChequeosProps) {
  const [chequeos, setChequeos] = useState<Chequeo[]>([
    { id: 1, chequeo: 1, empresa: "Empresa A", requisito: "Documento de identidad" },
    { id: 2, chequeo: 0, empresa: "Empresa B", requisito: "Certificado académico" },
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [nuevoChequeo, setNuevoChequeo] = useState<Omit<Chequeo, 'id'>>({
    chequeo: 0,
    empresa: "",  // Cambiado a string vacío
    requisito: "" // Cambiado a string vacío
  });

  const handleAddChequeo = () => {
    setEditandoId(null);
    setNuevoChequeo({ chequeo: 0, empresa: "", requisito: "" });
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setNuevoChequeo({ chequeo: 0, empresa: "", requisito: "" });
    setEditandoId(null);
  };

  // FUNCIONES DE ALERTAS SWEETALERT2
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
  
  // Lógica de guardado con alertas
  const handleSaveChequeo = () => {
    if (nuevoChequeo.empresa.trim() === "" || nuevoChequeo.requisito.trim() === "") {
      showWarning('Los campos Empresa y Requisito son obligatorios.');
      return;
    }

    if (editandoId) {
      setChequeos(chequeos.map(c => 
        c.id === editandoId ? { ...nuevoChequeo, id: editandoId } : c
      ));
      showSuccess('Chequeo actualizado correctamente.');
    } else {
      const nuevo: Chequeo = { 
        id: Date.now(), 
        ...nuevoChequeo 
      };
      setChequeos([...chequeos, nuevo]);
      showSuccess('Chequeo agregado exitosamente.');
    }
    cerrarModal();
  };

  const handleEditChequeo = (id: number) => {
    const chequeo = chequeos.find(c => c.id === id);
    if (chequeo) {
      setNuevoChequeo({
        chequeo: chequeo.chequeo,
        empresa: chequeo.empresa,
        requisito: chequeo.requisito
      });
      setEditandoId(id);
      setMostrarModal(true);
    }
  };

  // Lógica de eliminación con alerta de confirmación
  const handleDeleteChequeo = (id: number) => {
    Swal.fire({
      title: '¿Estás seguro de eliminar este chequeo?',
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
        setChequeos(chequeos.filter(c => c.id !== id));
        showSuccess('El chequeo ha sido eliminado.');
      }
    });
  };

  const filteredChequeos = chequeos.filter(chequeo =>
    chequeo.id.toString().includes(searchTerm.toLowerCase()) ||
    chequeo.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chequeo.requisito.toLowerCase().includes(searchTerm.toLowerCase())
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
  const emptyStateBg = modoOscuro ? 'bg-gray-800/30' : 'bg-gray-50';
  const secondaryText = modoOscuro ? 'text-gray-300' : 'text-gray-600';
  const titleColor = modoOscuro ? 'text-white' : 'text-gray-800';
  const labelText = modoOscuro ? 'text-gray-400' : 'text-gray-500';

  return (
    <>
      <div className={`rounded-3xl p-10 max-w-9xl mx-auto my-12 ${bgColor} ${textColor} ${borderColor}`}>
        <div className="text-center mb-10">
          <h2 className={`text-4xl font-extrabold mb-2 ${titleColor}`}>
            Gestión de Chequeos
          </h2>
          <p className={`text-lg ${secondaryText}`}>
            Administra los chequeos del sistema
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <input
            type="text"
            placeholder="Buscar por empresa, requisito o ID..."
            className={`border rounded-2xl px-5 py-3 text-lg focus:outline-none focus:ring-2 w-full sm:w-96 transition-all duration-300 hover:shadow-md ${searchBg} ${textColor} ${searchBorder} ${searchFocus} ${placeholderColor}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={handleAddChequeo}
            className="flex items-center gap-2 px-6 py-3 bg-[#39A900] text-white text-lg font-medium rounded-2xl hover:bg-[#2d8500] transition-all shadow-md hover:shadow-xl transform hover:scale-105 duration-300 w-full sm:w-auto justify-center"
          >
            <Plus size={20} />
            Agregar Nuevo Chequeo
          </button>
        </div>

        <div className="space-y-5">
          {filteredChequeos.length === 0 ? (
            <div className={`text-center py-16 rounded-2xl ${emptyStateBg}`}>
              <p className={`${secondaryText} text-lg`}>No se encontraron chequeos</p>
            </div>
          ) : (
            filteredChequeos.map((chequeo) => (
              <div
                key={chequeo.id}
                className={`p-6 rounded-2xl border shadow-md hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 transform hover:-translate-y-1 ${cardBg} ${borderColor} ${modoOscuro ? 'hover:border-[#39A900]/50' : 'hover:border-[#39A900]'}`}
              >
                <div className="flex items-center gap-4 w-full">
                  <div className={`p-4 rounded-xl flex items-center justify-center h-12 w-12 transition-colors ${
                    chequeo.chequeo 
                      ? modoOscuro 
                        ? 'bg-[#39A900]/20 text-[#39A900] hover:bg-[#39A900]/30' 
                        : 'bg-[#39A900]/10 text-[#39A900] hover:bg-[#39A900]/20'
                      : modoOscuro 
                        ? 'bg-red-900/20 text-red-400 hover:bg-red-900/30' 
                        : 'bg-red-100 text-red-600 hover:bg-red-200'
                  }`}>
                    <FaClipboardCheck size={24} className="flex-shrink-0" />
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className={`text-sm ${labelText}`}>Empresa</p>
                      <h3 className={`text-lg font-semibold ${modoOscuro ? 'text-white' : 'text-gray-800'}`}>
                        {chequeo.empresa}
                      </h3>
                    </div>
                    <div>
                      <p className={`text-sm ${labelText}`}>Requisito</p>
                      <h3 className={`text-lg font-semibold ${modoOscuro ? 'text-white' : 'text-gray-800'}`}>
                        {chequeo.requisito}
                      </h3>
                    </div>
                    <div>
                      <p className={`text-sm ${labelText}`}>Estado</p>
                      <h3 className={`text-lg font-semibold ${
                        chequeo.chequeo 
                          ? modoOscuro 
                            ? 'text-[#39A900]' 
                            : 'text-[#39A900]'
                          : modoOscuro 
                            ? 'text-red-400' 
                            : 'text-red-600'
                      }`}>
                        {chequeo.chequeo ? 'Aprobado' : 'Pendiente'}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 self-end sm:self-auto">
                  <button
                    onClick={() => handleEditChequeo(chequeo.id)}
                    title="Editar chequeo"
                    className={`p-3 rounded-xl transition-all transform hover:scale-110 flex items-center justify-center h-12 w-12 ${modoOscuro ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteChequeo(chequeo.id)}
                    title="Eliminar chequeo"
                    className={`p-3 rounded-xl transition-all transform hover:scale-110 flex items-center justify-center h-12 w-12 ${modoOscuro ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <ModalChequeo
        abierto={mostrarModal}
        editando={!!editandoId}
        chequeo={nuevoChequeo}
        onCerrar={cerrarModal}
        onGuardar={handleSaveChequeo}
        onChange={(field, value) => setNuevoChequeo(prev => ({ ...prev, [field]: value }))}
        modoOscuro={modoOscuro}
      />
    </>
  );
}