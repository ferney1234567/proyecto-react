'use client';
import { useState } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import { FaCity } from 'react-icons/fa';
import CiudadModal from './CiudadModal';
import Swal from 'sweetalert2'; // 1. Importar SweetAlert2

interface CiudadProps {
  modoOscuro: boolean;
}

interface Ciudad {
  id: string;
  nombreCiudad: string;
  nombreDepartamento: string;
}

export default function Ciudad({ modoOscuro }: CiudadProps) {
  const [ciudades, setCiudades] = useState<Ciudad[]>([
    { id: '1', nombreCiudad: 'Medellín', nombreDepartamento: 'Antioquia' },
    { id: '2', nombreCiudad: 'Cali', nombreDepartamento: 'Valle del Cauca' },
  ]);
  const [nombreCiudad, setNombreCiudad] = useState('');
  const [nombreDepartamento, setNombreDepartamento] = useState('');
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);

  const abrirModal = () => {
    setNombreCiudad('');
    setNombreDepartamento('');
    setEditandoId(null);
    setMostrarModal(true);
  };

  const cerrarModal = () => setMostrarModal(false);

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
      color: modoOscuro ? '#fff' : '#333'
    });
  };

  // 2. Lógica de guardado con alertas
  const handleGuardar = () => {
    if (!nombreCiudad || !nombreDepartamento) {
      showWarning('Debes ingresar el nombre de la ciudad y el departamento.');
      return;
    }
    if (editandoId) {
      setCiudades(ciudades.map(c =>
        c.id === editandoId
          ? { ...c, nombreCiudad, nombreDepartamento }
          : c
      ));
      showSuccess('Ciudad actualizada correctamente.');
    } else {
      setCiudades([...ciudades, { id: Date.now().toString(), nombreCiudad, nombreDepartamento }]);
      showSuccess('Ciudad agregada exitosamente.');
    }
    cerrarModal();
  };

  const handleEditar = (id: string) => {
    const ciudad = ciudades.find(c => c.id === id);
    if (ciudad) {
      setNombreCiudad(ciudad.nombreCiudad);
      setNombreDepartamento(ciudad.nombreDepartamento);
      setEditandoId(id);
      setMostrarModal(true);
    }
  };

  // 3. Lógica de eliminación con alerta de confirmación
  const handleEliminar = (id: string) => {
    Swal.fire({
      title: '¿Estás seguro de eliminar esta ciudad?',
      text: "Esta acción no se puede deshacer.",
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
        setCiudades(ciudades.filter(c => c.id !== id));
        showSuccess('La ciudad ha sido eliminada.');
      }
    });
  };

  const ciudadesFiltradas = ciudades.filter(c =>
    c.nombreCiudad.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.nombreDepartamento.toLowerCase().includes(busqueda.toLowerCase())
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
  const iconBg = modoOscuro ? 'bg-[#39A900]/20' : 'bg-[#39A900]/10';
  const secondaryText = modoOscuro ? 'text-gray-300' : 'text-gray-600';
  const titleColor = modoOscuro ? 'text-white' : 'text-gray-800';
  const detailText = modoOscuro ? 'text-gray-400' : 'text-gray-600';

  return (
    <>
      <div className={`rounded-3xl shadow-2xl p-10 max-w-6xl mx-auto my-12 border transition-colors duration-500 ${bgColor} ${textColor} ${borderColor}`}>
        {/* ... (resto del JSX, no necesita cambios) ... */}
        <div className="text-center mb-10">
          <h2 className={`text-4xl font-extrabold mb-2 ${titleColor}`}>
            Gestión de Ciudades
          </h2>
          <p className={`text-lg ${secondaryText}`}>
            Administra las ciudades y departamentos
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <input
            type="text"
            placeholder="Buscar ciudad o departamento..."
            className={`border rounded-2xl px-5 py-3 text-lg focus:outline-none focus:ring-2 w-full sm:w-96 transition-all duration-300 hover:shadow-md ${searchBg} ${textColor} ${searchBorder} ${searchFocus} ${placeholderColor}`}
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button
            onClick={abrirModal}
            className="flex items-center gap-2 px-6 py-3 bg-[#39A900] text-white text-lg font-medium rounded-2xl hover:bg-[#2d8500] transition-all shadow-md hover:shadow-xl transform hover:scale-105 duration-300 w-full sm:w-auto justify-center"
          >
            <Plus size={20} />
            Agregar Ciudad
          </button>
        </div>

        <div className="space-y-5">
          {ciudadesFiltradas.length === 0 ? (
            <div className={`text-center py-16 rounded-2xl ${emptyStateBg}`}>
              <p className={`${secondaryText} text-lg`}>No se encontraron ciudades</p>
            </div>
          ) : (
            ciudadesFiltradas.map((c) => (
              <div 
                key={c.id} 
                className={`p-6 rounded-2xl border shadow-md hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 transform hover:-translate-y-1 ${cardBg} ${borderColor} ${modoOscuro ? 'hover:border-[#39A900]/50' : 'hover:border-[#39A900]'}`}
              >
                <div className="flex items-start gap-4 w-full">
                  <div className={`p-4 rounded-xl flex items-center justify-center h-12 w-12 transition-colors ${iconBg} ${modoOscuro ? 'text-[#39A900] hover:bg-[#39A900]/30' : 'text-[#39A900] hover:bg-[#39A900]/20'}`}>
                    <FaCity size={24} className="flex-shrink-0" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-xl font-semibold transition-colors ${modoOscuro ? 'hover:text-[#39A900] text-white' : 'hover:text-[#39A900] text-gray-800'}`}>
                      {c.nombreCiudad}
                    </h3>
                    <p className={`text-md ${detailText} mt-2`}>
                      <span className={`font-medium ${modoOscuro ? 'text-gray-300' : 'text-gray-700'}`}>Departamento:</span> {c.nombreDepartamento}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 self-end sm:self-auto">
                  <button
                    onClick={() => handleEditar(c.id)}
                    title="Editar ciudad"
                    className={`p-3 rounded-xl transition-all transform hover:scale-110 flex items-center justify-center h-12 w-12 ${modoOscuro ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => handleEliminar(c.id)}
                    title="Eliminar ciudad"
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

      <CiudadModal
        mostrar={mostrarModal}
        onClose={cerrarModal}
        onSave={handleGuardar}
        editandoId={editandoId}
        nombreCiudad={nombreCiudad}
        setNombreCiudad={setNombreCiudad}
        nombreDepartamento={nombreDepartamento}
        setNombreDepartamento={setNombreDepartamento}
        modoOscuro={modoOscuro}
      />
    </>
  );
}