'use client';

import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import { FaClipboardCheck } from 'react-icons/fa';
import Swal from 'sweetalert2';

import ModalChequeo from './crearChequeo';
import ModalEditarChequeo from './editarCheckeo';

import {
  getRequirementChecks,
  createRequirementCheck,
  updateRequirementCheck,
  deleteRequirementCheck,
} from '../../api/requirementChecks/route';

interface ChequeosProps {
  modoOscuro: boolean;
}

interface Chequeo {
  id: number;
  is_checked: boolean; // ✅ ahora boolean
  empresa: string;
  requisito: string;
  companyId: number;
  requirementId: number;
}

interface Empresa {
  id: number;
  name: string;
}

interface Requisito {
  id: number;
  name: string;
}

export default function Chequeos({ modoOscuro }: ChequeosProps) {
  const [chequeos, setChequeos] = useState<Chequeo[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [requisitos, setRequisitos] = useState<Requisito[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const [nuevoChequeo, setNuevoChequeo] = useState<Chequeo>({
    id: 0,
    is_checked: false, // ✅ inicia en false
    empresa: '',
    requisito: '',
    companyId: 0,
    requirementId: 0,
  });

  // === ALERTAS ===
  const showSuccess = (mensaje: string) =>
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: mensaje,
      confirmButtonColor: '#39A900',
      background: modoOscuro ? '#1a0526' : '#fff',
      color: modoOscuro ? '#fff' : '#333',
    });

  const showWarning = (mensaje: string) =>
    Swal.fire({
      icon: 'warning',
      title: 'Atención',
      text: mensaje,
      confirmButtonColor: '#39A900',
      background: modoOscuro ? '#1a0526' : '#fff',
      color: modoOscuro ? '#fff' : '#333',
    });

  // === CARGAR DATOS DESDE API ===
  const cargarChequeos = async () => {
    try {
      const data = await getRequirementChecks();
      // 🔹 Normalizar a boolean
      const normalizados = data.map((c: any) => ({
        ...c,
        is_checked: Boolean(c.is_checked),
      }));
      setChequeos(normalizados);
    } catch (error: any) {
      showWarning(error.message);
    }
  };

  const cargarEmpresasYRequisitos = async () => {
    try {
      const resEmp = await fetch("http://localhost:4000/api/v1/companies");
      const jsonEmp = await resEmp.json();
      setEmpresas(jsonEmp.data || []);

      const resReq = await fetch("http://localhost:4000/api/v1/requirements");
      const jsonReq = await resReq.json();
      setRequisitos(jsonReq.data || []);
    } catch (error: any) {
      showWarning("Error cargando empresas/requisitos");
    }
  };

  useEffect(() => {
    cargarChequeos();
    cargarEmpresasYRequisitos();
  }, []);

  // === CREAR / EDITAR ===
  const handleGuardar = async () => {
    if (!nuevoChequeo.companyId || !nuevoChequeo.requirementId) {
      showWarning('Debes seleccionar Empresa y Requisito');
      return;
    }
    try {
      if (editandoId) {
        await updateRequirementCheck(
          editandoId,
          nuevoChequeo.is_checked,
          nuevoChequeo.companyId,
          nuevoChequeo.requirementId
        );
        showSuccess('Chequeo actualizado correctamente');
        setMostrarModalEditar(false);
      } else {
        await createRequirementCheck(
          nuevoChequeo.is_checked,
          nuevoChequeo.companyId,
          nuevoChequeo.requirementId
        );
        showSuccess('Chequeo agregado correctamente');
        setMostrarModal(false);
      }
      setEditandoId(null);
      await cargarChequeos();
    } catch (error: any) {
      showWarning(error.message);
    }
  };

  // === ELIMINAR ===
  const handleDeleteChequeo = (id: number) => {
    Swal.fire({
      title: '¿Eliminar este chequeo?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      background: modoOscuro ? '#1a0526' : '#fff',
      color: modoOscuro ? '#fff' : '#333',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteRequirementCheck(id);
          await cargarChequeos();
          showSuccess('Chequeo eliminado correctamente');
        } catch (error: any) {
          showWarning(error.message);
        }
      }
    });
  };

  // === EDITAR ===
  const handleEditChequeo = (chequeo: Chequeo) => {
    setEditandoId(chequeo.id);
    setNuevoChequeo({
      ...chequeo,
      is_checked: Boolean(chequeo.is_checked), // ✅ asegurar boolean
    });
    setMostrarModalEditar(true);
  };

  // === NUEVO ===
  const handleAddChequeo = () => {
    setEditandoId(null);
    setNuevoChequeo({
      id: 0,
      is_checked: false,
      empresa: '',
      requisito: '',
      companyId: 0,
      requirementId: 0,
    });
    setMostrarModal(true);
  };

  // === FILTRO ===
  const filteredChequeos = chequeos.filter(
    (c) =>
      c.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.requisito.toLowerCase().includes(searchTerm.toLowerCase())
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
      <div className={`rounded-3xl p-10 max-w-9xl mx-auto my-12 ${bgColor} ${textColor}`}>
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className={`text-4xl font-extrabold mb-2 ${titleColor}`}>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
              Gestión de Chequeos
            </span>
          </h2>
          <p className={`text-lg ${secondaryText}`}>
            Administra los chequeos de requisitos y empresas
          </p>
        </div>

        {/* Buscador + botón */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="Buscar chequeos..."
              className={`border rounded-2xl px-5 py-3 text-lg pl-12 focus:outline-none focus:ring-2 w-full transition-all duration-300 hover:shadow-md ${searchBg} ${textColor} ${searchBorder} ${searchFocus} ${placeholderColor}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <button
            onClick={handleAddChequeo}
            className="flex items-center gap-2 px-6 py-3 bg-[#39A900] text-white text-lg font-medium rounded-2xl hover:bg-[#2d8500] transition-all shadow-md hover:shadow-xl transform hover:scale-105 duration-300 w-full sm:w-auto justify-center"
          >
            <Plus size={20} />
            Nuevo Chequeo
          </button>
        </div>

        {/* Lista */}
        <div className="space-y-5">
          {filteredChequeos.length === 0 ? (
            <div className={`text-center py-16 rounded-2xl border ${emptyStateBg}`}>
              <p className={`${secondaryText} text-lg`}>No se encontraron chequeos</p>
            </div>
          ) : (
            filteredChequeos.map((chequeo) => (
              <div
                key={chequeo.id}
                className={`p-6 rounded-2xl border shadow-md hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row justify-between items-center gap-5 transform hover:-translate-y-1 ${cardBg} ${borderColor}`}
              >
                <div className="flex items-center gap-2 w-full">
                  <div
                    className={`p-4 rounded-xl transition-colors ${iconBg} ${
                      chequeo.is_checked ? 'text-[#39A900]' : 'text-red-500'
                    }`}
                  >
                    <FaClipboardCheck />
                  </div>
                  <div>
                    <h3 className={`text-xl font-semibold ${titleColor}`}>{chequeo.empresa}</h3>
                    <p className={`text-sm ${secondaryText}`}>Requisito: {chequeo.requisito}</p>
                    <p
                      className={`text-sm font-bold ${
                        chequeo.is_checked ? 'text-[#39A900]' : 'text-red-500'
                      }`}
                    >
                      {chequeo.is_checked ? 'Aprobado' : 'Pendiente'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEditChequeo(chequeo)}
                    className={`p-3 rounded-xl ${
                      modoOscuro ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'
                    } hover:scale-110 transition`}
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteChequeo(chequeo.id)}
                    className={`p-3 rounded-xl ${
                      modoOscuro ? 'bg-red-900/30 text-red-400' : 'bg-red-50 text-red-600'
                    } hover:scale-110 transition`}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modales */}
      {mostrarModal && (
        <ModalChequeo
          abierto={mostrarModal}
          editando={false}
          chequeo={nuevoChequeo}
          empresas={empresas}
          requisitos={requisitos}
          onCerrar={() => setMostrarModal(false)}
          onGuardar={handleGuardar}
          onChange={(field, value) =>
            setNuevoChequeo((prev) => ({ ...prev, [field]: value }))
          }
          modoOscuro={modoOscuro}
        />
      )}

      {mostrarModalEditar && (
        <ModalEditarChequeo
          abierto={mostrarModalEditar}
          editando={true}
          chequeo={nuevoChequeo}
          empresas={empresas}
          requisitos={requisitos}
          onCerrar={() => setMostrarModalEditar(false)}
          onGuardar={handleGuardar}
          onChange={(field, value) =>
            setNuevoChequeo((prev) => ({ ...prev, [field]: value }))
          }
          modoOscuro={modoOscuro}
        />
      )}
    </>
  );
}
