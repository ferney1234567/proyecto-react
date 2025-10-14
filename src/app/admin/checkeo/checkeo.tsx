'use client';

import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Search, Building2, Calendar } from 'lucide-react';
import Swal from 'sweetalert2';

import ModalChequeo from './crearChequeo';
import ModalEditarChequeo from './editarCheckeo';

import {
  createRequirementCheck,
  updateRequirementCheck,
  deleteRequirementCheck,
} from '../../api/requirementChecks/route';

// === Interfaces ===
interface ChequeosProps {
  modoOscuro: boolean;
}

interface Company {
  id: number;
  name: string;
  taxId: string;
  legalName: string;
  address: string;
  phone: string;
  email: string;
  legalRepresentativeName: string;
}

interface Requirement {
  id: number;
  name: string;
  notes: string;
  institutionId: number;
  groupId: number;
}

interface Chequeo {
  id: number;
  isChecked: boolean;
  companyId: number;
  requirementId: number;
  idUser: number | null;
  createdAt: string;
  updatedAt: string;
  company: Company | null;
  requirement: Requirement | null;
  user: any | null;
}

interface Empresa {
  id: number;
  name: string;
}

interface Requisito {
  id: number;
  name: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export default function Chequeos({ modoOscuro }: ChequeosProps) {
  const [token, setToken] = useState<string | null>(null);
  const [chequeos, setChequeos] = useState<Chequeo[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [requisitos, setRequisitos] = useState<Requisito[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const [nuevoChequeo, setNuevoChequeo] = useState({
    id: 0,
    is_checked: false,
    empresa: '',
    requisito: '',
    companyId: null as number | null,
    requirementId: null as number | null,
  });

  // === Obtener token JWT desde localStorage ===
  useEffect(() => {
    const t = localStorage.getItem('token');
    if (t) setToken(t);
  }, []);

  // === Alertas ===
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

  // === Cargar chequeos ===
  const cargarChequeos = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/requirementChecks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data.data)) setChequeos(data.data);
      else setChequeos([]);
    } catch (error: any) {
      showWarning(error.message || 'Error al cargar los chequeos');
    }
  };

  // === Cargar empresas y requisitos ===
  const cargarEmpresasRequisitos = async () => {
    if (!token) return;
    try {
      const [resEmp, resReq] = await Promise.all([
        fetch(`${API_URL}/companies`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then((r) => r.json()),
        fetch(`${API_URL}/requirements`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then((r) => r.json()),
      ]);
      setEmpresas(resEmp.data || []);
      setRequisitos(resReq.data || []);
    } catch {
      showWarning('Error cargando empresas o requisitos');
    }
  };

  useEffect(() => {
    if (token) {
      cargarChequeos();
      cargarEmpresasRequisitos();
    }
  }, [token]);

  // === Crear o editar chequeo ===
  const handleGuardar = async () => {
    try {
      if (!nuevoChequeo.companyId || !nuevoChequeo.requirementId) {
        showWarning('Debes seleccionar una empresa y un requisito');
        return;
      }

      if (editandoId) {
        await updateRequirementCheck(
          editandoId,
          nuevoChequeo.is_checked,
          nuevoChequeo.companyId,
          nuevoChequeo.requirementId,
          null
        );
        showSuccess('Chequeo actualizado correctamente');
        setMostrarModalEditar(false);
      } else {
        await createRequirementCheck(
          nuevoChequeo.is_checked,
          nuevoChequeo.companyId,
          nuevoChequeo.requirementId,
          null
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

  // === Eliminar chequeo ===
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

  // === Editar ===
  const handleEditChequeo = (chequeo: Chequeo) => {
    setEditandoId(chequeo.id);
    setNuevoChequeo({
      id: chequeo.id,
      is_checked: chequeo.isChecked,
      empresa: chequeo.company?.name || '',
      requisito: chequeo.requirement?.name || '',
      companyId: chequeo.companyId,
      requirementId: chequeo.requirementId,
    });
    setMostrarModalEditar(true);
  };

  const handleAddChequeo = () => {
    setEditandoId(null);
    setNuevoChequeo({
      id: 0,
      is_checked: false,
      empresa: '',
      requisito: '',
      companyId: null,
      requirementId: null,
    });
    setMostrarModal(true);
  };

  // === Filtros seguros ===
  const filteredChequeos = chequeos.filter((c) => {
    const companyName = c.company?.name?.toLowerCase() || '';
    const requirementName = c.requirement?.name?.toLowerCase() || '';
    const representativeName = c.company?.legalRepresentativeName?.toLowerCase() || '';
    return (
      companyName.includes(searchTerm.toLowerCase()) ||
      requirementName.includes(searchTerm.toLowerCase()) ||
      representativeName.includes(searchTerm.toLowerCase())
    );
  });

  const aprobados = filteredChequeos.filter((c) => c.isChecked);
  const noAprobados = filteredChequeos.filter((c) => !c.isChecked);

  const formatFecha = (fecha: string) =>
    new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  // === Estilos dinámicos ===
  const bgColor = modoOscuro ? 'bg-[#1a0526]' : 'bg-white';
  const textColor = modoOscuro ? 'text-white' : 'text-gray-900';
  const cardBg = modoOscuro ? 'bg-white/10' : 'bg-white';
  const secondaryText = modoOscuro ? 'text-gray-300' : 'text-gray-600';
  const titleColor = modoOscuro ? 'text-white' : 'text-gray-800';

  return (
    <>
      <div className={`rounded-3xl p-10 max-w-9xl mx-auto my-12 ${bgColor} ${textColor}`}>
        <div className="text-center mb-10">
          <h2 className={`text-4xl font-extrabold mb-2 ${titleColor}`}>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
              Chequeos de Empresas
            </span>
          </h2>
          <p className={`text-lg ${secondaryText}`}>
            Gestión de chequeos realizados exclusivamente por empresas
          </p>
        </div>

        {/* === BUSCADOR === */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="Buscar por empresa, requisito o representante..."
              className="border rounded-2xl px-5 py-3 text-lg pl-12 focus:outline-none w-full"
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

        {/* === SECCIÓN: APROBADOS === */}
        <h3 className={`text-2xl font-bold mb-4 mt-8 ${titleColor}`}>✅ Chequeos Aprobados</h3>
        <div className="space-y-5">
          {aprobados.length === 0 ? (
            <div className="text-center py-6 rounded-2xl border bg-gray-50 dark:bg-gray-800/30">
              <p className={`${secondaryText}`}>No hay chequeos aprobados</p>
            </div>
          ) : (
            aprobados.map((chequeo) => (
              <div key={chequeo.id} className={`p-6 rounded-2xl border shadow-md ${cardBg}`}>
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <h3 className={`text-xl font-semibold flex items-center gap-2 ${titleColor} mb-2`}>
                      <Building2 size={20} />
                      {chequeo.company?.name || 'Sin empresa'}
                    </h3>
                    <p className={`${secondaryText}`}>{chequeo.requirement?.name || 'Sin requisito'}</p>
                    <p className="text-sm">{chequeo.requirement?.notes || ''}</p>
                    <p className="text-xs mt-2">
                      <Calendar size={14} className="inline mr-1" />
                      Creado: {formatFecha(chequeo.createdAt)}
                    </p>
                  </div>
                  <div className="flex lg:flex-col gap-2 justify-center lg:justify-start">
                    <button
                      onClick={() => handleEditChequeo(chequeo)}
                      className="p-3 rounded-xl bg-blue-50 text-blue-600 hover:scale-110 transition"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteChequeo(chequeo.id)}
                      className="p-3 rounded-xl bg-red-50 text-red-600 hover:scale-110 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* === SECCIÓN: NO APROBADOS === */}
        <h3 className={`text-2xl font-bold mb-4 mt-10 ${titleColor}`}>⏳ Chequeos No Aprobados</h3>
        <div className="space-y-5">
          {noAprobados.length === 0 ? (
            <div className="text-center py-6 rounded-2xl border bg-gray-50 dark:bg-gray-800/30">
              <p className={`${secondaryText}`}>No hay chequeos pendientes o no aprobados</p>
            </div>
          ) : (
            noAprobados.map((chequeo) => (
              <div key={chequeo.id} className={`p-6 rounded-2xl border shadow-md ${cardBg}`}>
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <h3 className={`text-xl font-semibold flex items-center gap-2 ${titleColor} mb-2`}>
                      <Building2 size={20} />
                      {chequeo.company?.name || 'Sin empresa'}
                    </h3>
                    <p className={`${secondaryText}`}>{chequeo.requirement?.name || 'Sin requisito'}</p>
                    <p className="text-sm">{chequeo.requirement?.notes || ''}</p>
                    <p className="text-xs mt-2">
                      <Calendar size={14} className="inline mr-1" />
                      Creado: {formatFecha(chequeo.createdAt)}
                    </p>
                  </div>
                  <div className="flex lg:flex-col gap-2 justify-center lg:justify-start">
                    <button
                      onClick={() => handleEditChequeo(chequeo)}
                      className="p-3 rounded-xl bg-blue-50 text-blue-600 hover:scale-110 transition"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteChequeo(chequeo.id)}
                      className="p-3 rounded-xl bg-red-50 text-red-600 hover:scale-110 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* === MODALES === */}
      {mostrarModal && (
        <ModalChequeo
          abierto={mostrarModal}
          editando={false}
          chequeo={nuevoChequeo}
          empresas={empresas}
          requisitos={requisitos}
          usuarios={[]}
          onCerrar={() => setMostrarModal(false)}
          onGuardar={handleGuardar}
          onChange={(field, value) => setNuevoChequeo((prev) => ({ ...prev, [field]: value }))}
          modoOscuro={modoOscuro}
        />
      )}

      {mostrarModalEditar && (
        <ModalEditarChequeo
          abierto={mostrarModalEditar}
          editando
          chequeo={nuevoChequeo}
          empresas={empresas}
          requisitos={requisitos}
          usuarios={[]}
          onCerrar={() => setMostrarModalEditar(false)}
          onGuardar={handleGuardar}
          onChange={(field, value) => setNuevoChequeo((prev) => ({ ...prev, [field]: value }))}
          modoOscuro={modoOscuro}
        />
      )}
    </>
  );
}
