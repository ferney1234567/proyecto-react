'use client';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XCircle, Edit, Check, X, Trash2,
  Building2, MapPin, Phone, Globe, Users,
  FileText, User, Mail, Calendar, IdCard, ClipboardSignature,
  ArrowLeft, ArrowRight, Layers, ChevronRight, ChevronLeft
} from 'lucide-react';
import { useTheme } from '../../ThemeContext';
import Swal from 'sweetalert2';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const COMPANIES_URL = `${BASE_URL}/companies`;
const CITIES_URL = `${BASE_URL}/cities`;

interface Ciudad {
  id: number;
  name: string;
  department?: { id: number; name: string };
  departmentId?: number;
}

interface Empresa {
  city?: any;
  id?: number;
  name: string;
  taxId?: string;
  legalName?: string;
  address?: string;
  phone?: string;
  website?: string;
  employeeCount?: number;
  economicSector?: string;
  description?: string;
  existenceYears?: number;
  legalDocument?: string;
  legalFirstName?: string;
  legalLastName?: string;
  legalRepresentativeRole?: string;
  legalRepresentativePhone?: string;
  legalRepresentativeEmail?: string;
  email?: string;
  cityId?: number | null;
  cityName?: string;
  departmentName?: string;
}

export default function DatosEmpresaModal({
  cerrarModal,
  onEmpresaActualizada,
}: {
  cerrarModal: () => void;
  onEmpresaActualizada?: (empresaActualizada: Empresa) => void;
}) {
  const { modoOscuro } = useTheme();
  const modalRef = useRef<HTMLDivElement>(null);

  // ✅ Ref para inputs y textareas (corrige error de tipo)
  const inputRefs = useRef<Record<string, HTMLInputElement | HTMLTextAreaElement | null>>({});

  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [departamento, setDepartamento] = useState<string>('');
  const [editingField, setEditingField] = useState<string | null>(null);
  const [newValue, setNewValue] = useState<string>('');
  const [savingField, setSavingField] = useState<string | null>(null);

  // === Cerrar modal al hacer clic fuera ===
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) cerrarModal();
  };

  // === Cargar empresa y ciudades ===
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('usuario');
        if (!userData || !token) throw new Error('Usuario no autenticado');
        const user = JSON.parse(userData);

        const resEmp = await fetch(COMPANIES_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataEmp = await resEmp.json();
        if (!resEmp.ok) throw new Error(dataEmp.message || 'Error al obtener empresas');



        const empresaUsuario = dataEmp.data.find((e: Empresa) => e.email === user.email);
        setEmpresa(empresaUsuario || { name: '', email: user.email });

        const resCities = await fetch(CITIES_URL);
        const dataCities = await resCities.json();
        setCiudades(dataCities.data || []);
      } catch (err: any) {
        Swal.fire('Error', err.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // === Guardar campo individual ===
  const handleFieldSave = async (campo: keyof Empresa) => {
    if (!empresa) return;

    setSavingField(campo as string);
    try {
      const payload = { ...empresa, [campo]: newValue };
      const url = empresa.id ? `${COMPANIES_URL}/${empresa.id}` : COMPANIES_URL;
      const method = empresa.id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al guardar el campo');

      setEmpresa(data.data || payload);
      setEditingField(null);

      Swal.fire({
        icon: 'success',
        title: 'Campo guardado correctamente',
        timer: 1500,
        showConfirmButton: false,
      });

      if (onEmpresaActualizada && data.data) {
        onEmpresaActualizada(data.data);
      }
    } catch (err: any) {
      Swal.fire('Error', err.message, 'error');
    } finally {
      setSavingField(null);
    }
  };

  // === Eliminar campo ===
  const handleFieldDelete = async (campo: keyof Empresa) => {
    if (!empresa?.id) return;
    Swal.fire({
      title: '¿Vaciar este campo?',
      text: 'El valor actual se eliminará.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          const payload = { [campo]: '' };
          await fetch(`${COMPANIES_URL}/${empresa.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(payload),
          });
          setEmpresa((prev) => (prev ? { ...prev, [campo]: '' } : prev));
          Swal.fire('🗑️ Campo eliminado', '', 'success');
        } catch (err: any) {
          Swal.fire('Error', err.message, 'error');
        }
      }
    });
  };

  const handleCitySelect = async (cityId: number) => {
    if (!empresa) return;

    // Busca la ciudad seleccionada
    const ciudad = ciudades.find((c) => c.id === cityId);
    if (!ciudad) return;

    // Obtén el nombre del departamento
    const depto = ciudad.department?.name || `Dept. ID: ${ciudad.departmentId}`;
    setDepartamento(depto);

    // Actualiza el estado local (para que se muestre al instante)
    const updatedEmpresa = {
      ...empresa,
      cityId,
      cityName: ciudad.name,
      departmentName: depto,
    };
    setEmpresa(updatedEmpresa);

    // Guarda en el backend
    try {
      const method = empresa.id ? 'PUT' : 'POST';
      const url = empresa.id ? `${COMPANIES_URL}/${empresa.id}` : COMPANIES_URL;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updatedEmpresa),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al guardar ciudad');

      // Actualiza con los datos devueltos por el backend
      setEmpresa(data.data || updatedEmpresa);

      Swal.fire('✅ Ciudad y departamento guardados', '', 'success');
    } catch (err: any) {
      Swal.fire('Error', err.message, 'error');
    }
  };


  // === Calcular progreso ===
  useEffect(() => {
    if (!empresa) return;
    const totalCampos = [
      'name', 'taxId', 'legalName', 'employeeCount', 'existenceYears', 'economicSector', 'description',
      'address', 'phone', 'email', 'website', 'cityId', 'departmentName'
    ];
    const completados = totalCampos.filter(
      (campo) => empresa[campo as keyof Empresa] && empresa[campo as keyof Empresa] !== ''
    ).length;
    setProgress(Math.round((completados / totalCampos.length) * 100));
  }, [empresa]);

  // === Focus en input al editar ===
  useEffect(() => {
    if (editingField && inputRefs.current[editingField]) {
      inputRefs.current[editingField]?.focus();
    }
  }, [editingField]);

  const secciones = [
    {
      titulo: 'Información General',
      icon: <Building2 size={24} />,
      campos: [
        { icon: <Building2 size={18} />, label: 'Nombre de la Empresa', field: 'name', type: 'text' },
        { icon: <IdCard size={18} />, label: 'NIT', field: 'taxId', type: 'text' },
        { icon: <FileText size={18} />, label: 'Razón Social', field: 'legalName', type: 'text' },
        { icon: <Users size={18} />, label: 'Número de Empleados', field: 'employeeCount', type: 'number' },
        { icon: <Calendar size={18} />, label: 'Años de Existencia', field: 'existenceYears', type: 'number' },
        { icon: <Globe size={18} />, label: 'Sector Económico', field: 'economicSector', type: 'text' },
        { icon: <Layers size={18} />, label: 'Descripción', field: 'description', type: 'textarea' },
      ],
    },
    {
      titulo: 'Ubicación y Contacto',
      icon: <MapPin size={24} />,
      campos: [
        { icon: <MapPin size={18} />, label: 'Dirección', field: 'address', type: 'text' },
        { icon: <Phone size={18} />, label: 'Teléfono', field: 'phone', type: 'text' },
        { icon: <Mail size={18} />, label: 'Correo', field: 'email', type: 'email' },
        { icon: <Globe size={18} />, label: 'Sitio Web', field: 'website', type: 'text' },
        { icon: <MapPin size={18} />, label: 'Ciudad', field: 'cityName', type: 'select' },
        { icon: <Globe size={18} />, label: 'Departamento', field: 'departmentName', type: 'text' },
      ],
    },
    {
      titulo: 'Representante Legal',
      icon: <User size={24} />,
      campos: [
        { icon: <IdCard size={18} />, label: 'Documento', field: 'legalDocument', type: 'text' },
        { icon: <User size={18} />, label: 'Nombre', field: 'legalFirstName', type: 'text' },
        { icon: <ClipboardSignature size={18} />, label: 'Apellido', field: 'legalLastName', type: 'text' },
        { icon: <Users size={18} />, label: 'Cargo', field: 'legalRepresentativeRole', type: 'text' },
        { icon: <Phone size={18} />, label: 'Teléfono', field: 'legalRepresentativePhone', type: 'text' },
        { icon: <Mail size={18} />, label: 'Correo', field: 'legalRepresentativeEmail', type: 'email' },
      ],
    },
  ];

  const seccion = secciones[page];
  const bgHeader = modoOscuro
    ? 'bg-gradient-to-r from-[#0b1220] to-[#0a0f1a]'
    : 'bg-gradient-to-r from-[#004973] to-[#0074a8]';
  const bgCard = modoOscuro ? 'bg-[#1a2234]' : 'bg-white';
  const textColor = modoOscuro ? 'text-white' : 'text-gray-800';
  const borderColor = modoOscuro ? 'border-gray-700' : 'border-gray-200';

  if (loading)
    return <div className="fixed inset-0 flex items-center justify-center bg-black/70 text-white z-50">Cargando...</div>;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={handleOutsideClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          ref={modalRef}
          className={`rounded-3xl shadow-2xl w-[90%] max-w-5xl max-h-[90vh] overflow-y-auto no-scrollbar ${bgCard} p-6 relative`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          {/* Botón cerrar */}
          <button
            onClick={cerrarModal}
            className={`absolute top-6 right-6 p-2 rounded-full ${modoOscuro ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-all z-10`}
          >
            <XCircle size={28} className="text-gray-500 hover:text-red-500 transition-colors" />
          </button>

          {/* Encabezado */}
          <div className={`${bgHeader} text-white p-6 rounded-2xl mb-8 flex justify-between items-center`}>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                {seccion.icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{seccion.titulo}</h2>
                <p className="text-blue-100 mt-1">Complete toda la información de su empresa</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-blue-100 text-sm">Progreso de completado</p>
                <p className="font-bold text-lg">{progress}%</p>
              </div>
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="absolute w-full h-full -rotate-90">
                  <circle cx="40" cy="40" r="36" stroke="#ffffff44" strokeWidth="6" fill="none" />
                  <motion.circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="#fff"
                    strokeWidth="6"
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray="226"
                    strokeDashoffset={226 - (226 * progress) / 100}
                    initial={{ strokeDashoffset: 226 }}
                    animate={{ strokeDashoffset: 226 - (226 * progress) / 100 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </svg>
                <span className="absolute text-white font-bold text-sm">{progress}%</span>
              </div>
            </div>
          </div>

          {/* Indicador de páginas */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-3">
              {secciones.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setPage(index)}
                  className={`w-3 h-3 rounded-full transition-all ${page === index
                      ? 'bg-blue-600 scale-125'
                      : modoOscuro ? 'bg-gray-600' : 'bg-gray-300'
                    }`}
                />
              ))}
            </div>
          </div>

          {/* Campos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {seccion.campos.map((campo) => (
              <motion.div
                key={campo.field}
                whileHover={{ y: -3 }}
                className={`p-5 rounded-2xl border ${borderColor} shadow-lg transition-all ${bgCard} group relative`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${modoOscuro ? 'bg-blue-900/30' : 'bg-blue-100'} text-blue-500`}>
                      {campo.icon}
                    </div>
                    <label className={`font-semibold ${textColor}`}>{campo.label}</label>
                  </div>

                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {editingField === campo.field ? (
                      <>
                        <button
                          onClick={() => handleFieldSave(campo.field as keyof Empresa)}
                          disabled={savingField === campo.field}
                          className={`p-1.5 rounded-lg ${savingField === campo.field ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'} text-white transition-colors`}
                        >
                          {savingField === campo.field ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Check size={16} />
                          )}
                        </button>
                        <button
                          onClick={() => setEditingField(null)}
                          className="p-1.5 rounded-lg bg-gray-500 hover:bg-gray-600 text-white transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingField(campo.field);
                            setNewValue(String(empresa?.[campo.field as keyof Empresa] || ''));
                          }}
                          className="p-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleFieldDelete(campo.field as keyof Empresa)}
                          className="p-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-2">
                  {campo.field === 'cityName' ? (
                    <select
                      value={empresa?.cityId || ''}
                      onChange={(e) => handleCitySelect(Number(e.target.value))}
                      className={`w-full rounded-xl p-3 ${modoOscuro ? 'bg-[#0f172a] text-white border-gray-700' : 'bg-gray-50 text-gray-800 border-gray-200'} border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                    >
                      <option value="">Selecciona una ciudad</option>
                      {ciudades.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  ) : campo.field === 'departmentName' ? (
                    <input
                      type="text"
                      value={empresa?.departmentName ?? departamento ?? ''}
                      readOnly
                      className={`w-full rounded-xl p-3 ${modoOscuro ? 'bg-[#0f172a] text-gray-400 border-gray-700' : 'bg-gray-100 text-gray-500 border-gray-200'} border cursor-not-allowed`}
                    />


                  ) : editingField === campo.field ? (
                    campo.type === 'textarea' ? (
                      <textarea
                        ref={el => inputRefs.current[campo.field] = el}
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        rows={4}
                        className={`w-full rounded-xl p-3 ${modoOscuro ? 'bg-[#0f172a] text-white border-gray-700' : 'bg-white text-gray-800 border-gray-200'} border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                      />
                    ) : (
                      <input
                        ref={el => inputRefs.current[campo.field] = el}
                        type={campo.type}
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        className={`w-full rounded-xl p-3 ${modoOscuro ? 'bg-[#0f172a] text-white border-gray-700' : 'bg-white text-gray-800 border-gray-200'} border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                      />
                    )
                  ) : (
                    <div
                      className={`p-3 rounded-xl min-h-[48px] flex items-center ${modoOscuro ? 'bg-[#0f172a]' : 'bg-gray-50'} ${textColor} cursor-text`}
                      onClick={() => {
                        setEditingField(campo.field);
                        setNewValue(String(empresa?.[campo.field as keyof Empresa] || ''));
                      }}
                    >
                      {empresa?.[campo.field as keyof Empresa] || (
                        <span className={`${modoOscuro ? 'text-gray-500' : 'text-gray-400'}`}>No especificado</span>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Navegación */}
          <div className="flex justify-between items-center mt-10">
            <button
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${page === 0
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                }`}
            >
              <ChevronLeft size={20} /> Anterior
            </button>

            <div className="flex items-center gap-4">
              {secciones.map((secc, index) => (
                <button
                  key={index}
                  onClick={() => setPage(index)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${page === index
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : modoOscuro
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {secc.titulo.split(' ')[0]}
                </button>
              ))}
            </div>

            <button
              disabled={page === secciones.length - 1}
              onClick={() => setPage(page + 1)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${page === secciones.length - 1
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                }`}
            >
              Siguiente <ChevronRight size={20} />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}