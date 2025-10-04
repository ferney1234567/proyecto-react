"use client";
import { useState, useEffect } from "react";
import {
  Plus, Edit, Trash2, Briefcase, Hash, MapPin, Globe, Phone,
  Users, Clock, Mail, Smartphone, FileBadge, UserCheck, Factory,
  FileText, User, Building, CirclePlay
} from "lucide-react";
import EmpresaModal from "./crearEmpresa";
import EditarEmpresa from "./editarEmpresa";
import Swal from "sweetalert2";
import {
  getEmpresas,
  createEmpresa,
  updateEmpresa,
  deleteEmpresa,
} from "../../api/empresa/route";

interface EmpresaProps {
  modoOscuro: boolean;
}

interface Empresa {
  id: string;
  nombre: string;
  nit: string;
  direccion: string;
  razonSocial: string;
  paginaWeb: string;
  telefono: string;
  empleados: string;
  sector: string;
  tiempo: number;
  descripcion: string;
  documentoLegal: string;
  nombreLegal: string;
  apellidoLegal: string;
  telefonoFijo: string;
  celular: string;
  email: string;
  cargoLegal: string;
  ciudad: string;
}

export default function Empresa({ modoOscuro }: EmpresaProps) {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [buscar, setBuscar] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [empresaActual, setEmpresaActual] = useState<Partial<Empresa>>({});

  // === ALERTAS ===
  const showSuccess = (mensaje: string) =>
    Swal.fire({
      icon: "success",
      title: "¡Éxito!",
      text: mensaje,
      confirmButtonColor: "#39A900",
      background: modoOscuro ? "#1a0526" : "#fff",
      color: modoOscuro ? "#fff" : "#333",
    });

  const showWarning = (mensaje: string) =>
    Swal.fire({
      icon: "warning",
      title: "Atención",
      text: mensaje,
      confirmButtonColor: "#39A900",
      background: modoOscuro ? "#1a0526" : "#fff",
      color: modoOscuro ? "#fff" : "#333",
    });

  // === CARGAR EMPRESAS ===
  const cargarEmpresas = async () => {
    try {
      const data = await getEmpresas();
      const items = (data.data || []).map((e: any) => ({
        id: e.id ? String(e.id) : "",
        nombre: e.name ?? "",
        nit: e.taxId ?? "",
        direccion: e.address ?? "",
        razonSocial: e.legalName ?? "",
        paginaWeb: e.website ?? "",
        telefono: e.phone ?? "",
        empleados: e.employeeCount != null ? String(e.employeeCount) : "0",
        sector: e.economicSector ?? "",
        tiempo: e.existenceYears ?? 0,
        descripcion: e.description ?? "",
        documentoLegal: e.legalDocument ?? "",
        nombreLegal: e.legalFirstName ?? "",
        apellidoLegal: e.legalLastName ?? "",
        telefonoFijo: e.landline ?? "",
        celular: e.legalMobile ?? "",
        email: e.email ?? "",
        cargoLegal: e.legalPosition ?? "",
        ciudad: e.city?.name ?? "", // 👈 ahora sí toma la ciudad como string
      }));
      setEmpresas(items);
    } catch (err: any) {
      showWarning(err.message);
    }
  };

  useEffect(() => {
    cargarEmpresas();
  }, []);

  // === CREAR / EDITAR ===
  const handleSave = async () => {
    if (!empresaActual.nombre || !empresaActual.nit) {
      showWarning("El nombre y el NIT son obligatorios");
      return;
    }

    const payload = {
      ...empresaActual,
      empleados: empresaActual.empleados || "0",
      tiempo: Number(empresaActual.tiempo) || 0,
      ciudad: empresaActual.ciudad || "", // 👈 se guarda la ciudad escrita
    };

    try {
      if (editandoId) {
        await updateEmpresa(editandoId, payload);
        showSuccess("Empresa actualizada correctamente");
      } else {
        await createEmpresa(payload);
        showSuccess("Empresa creada exitosamente");
      }
      setMostrarModal(false);
      setEditandoId(null);
      setEmpresaActual({});
      await cargarEmpresas();
    } catch (err: any) {
      showWarning(err.message || "Error al guardar empresa");
    }
  };

  // === ELIMINAR ===
  const handleEliminar = (id: string) => {
    Swal.fire({
      title: "¿Eliminar esta empresa?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: modoOscuro ? "#1a0526" : "#fff",
      color: modoOscuro ? "#fff" : "#333",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteEmpresa(id);
          showSuccess("Empresa eliminada");
          await cargarEmpresas();
        } catch (err: any) {
          showWarning(err.message);
        }
      }
    });
  };

  // === MODALES ===
  const abrirModal = (empresa?: Empresa) => {
    if (empresa) {
      setEditandoId(empresa.id);
      setEmpresaActual({ ...empresa });
    } else {
      setEditandoId(null);
      setEmpresaActual({});
    }
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setEditandoId(null);
    setEmpresaActual({});
  };

  // === FILTRO ===
  const empresasFiltradas = empresas.filter(
    (e) =>
      (e.nombre ?? "").toLowerCase().includes(buscar.toLowerCase()) ||
      (e.nit ?? "").toLowerCase().includes(buscar.toLowerCase())
  );

  // === ESTILOS ===
  const bgColor = modoOscuro ? "bg-[#1a0526]" : "bg-white";
  const textColor = modoOscuro ? "text-white" : "text-gray-900";
  const borderColor = modoOscuro ? "border-white/20" : "border-gray-200";
  const cardBg = modoOscuro ? "bg-white/10" : "bg-white";
  const secondaryText = modoOscuro ? "text-gray-300" : "text-gray-600";
  const titleColor = modoOscuro ? "text-white" : "text-gray-800";

  const iconWrapper = "p-2 rounded-full bg-green-100 text-green-600 shadow-md flex items-center justify-center";
  const iconWrapperDark = "p-2 rounded-full bg-green-900/40 text-green-400 shadow-md flex items-center justify-center";

  return (
    <>
      <div className={`rounded-3xl p-10 max-w-9xl mx-auto my-12 ${bgColor} ${textColor}`}>
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className={`text-4xl font-extrabold mb-2 ${titleColor}`}>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
              Gestión de Empresas
            </span>
          </h2>
          <p className={`text-lg ${secondaryText}`}>
            Administra las empresas registradas en el sistema
          </p>
        </div>

        {/* Buscador + botón */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="Buscar empresa..."
              className={`border rounded-2xl px-5 py-3 text-lg pl-4 focus:outline-none focus:ring-2 w-full transition-all duration-300 hover:shadow-md ${textColor}`}
              value={buscar}
              onChange={(e) => setBuscar(e.target.value)}
            />
          </div>
          <button
            onClick={() => abrirModal()}
            className="flex items-center gap-2 px-6 py-3 bg-[#39A900] text-white text-lg font-medium rounded-2xl hover:bg-[#2d8500] transition-all shadow-md hover:shadow-xl transform hover:scale-105 duration-300"
          >
            <Plus size={20} /> Agregar Empresa
          </button>
        </div>

        {/* Lista */}
        <div className="space-y-6">
          {empresasFiltradas.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border">
              <p className={`${secondaryText} text-lg`}>
                No hay empresas registradas
              </p>
            </div>
          ) : (
            empresasFiltradas.map((empresa) => (
              <div
                key={empresa.id}
                className={`p-8 rounded-2xl border shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 ${cardBg} ${borderColor}`}
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Información principal */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Columna 1 */}
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 mb-4">
                        <div className={modoOscuro ? iconWrapperDark : iconWrapper}>
                          <Briefcase size={22} />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold mb-1">{empresa.nombre}</h3>
                          {empresa.descripcion && (
                            <p className={`text-sm ${secondaryText}`}>{empresa.descripcion}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className={modoOscuro ? iconWrapperDark : iconWrapper}>
                            <Factory size={16} />
                          </div>
                          <div>
                            <p className={`text-xs font-medium ${textColor}`}>Razón Social</p>
                            <p className={`text-sm ${secondaryText}`}>{empresa.razonSocial}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className={modoOscuro ? iconWrapperDark : iconWrapper}>
                            <Hash size={16} />
                          </div>
                          <div>
                            <p className={`text-xs font-medium ${textColor}`}>NIT</p>
                            <p className={`text-sm ${secondaryText}`}>{empresa.nit}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className={modoOscuro ? iconWrapperDark : iconWrapper}>
                            <Building size={16} />
                          </div>
                          <div>
                            <p className={`text-xs font-medium ${textColor}`}>Sector Económico</p>
                            <p className={`text-sm ${secondaryText}`}>{empresa.sector}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Columna 2 */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={modoOscuro ? iconWrapperDark : iconWrapper}>
                          <MapPin size={16} />
                        </div>
                        <div>
                          <p className={`text-xs font-medium ${textColor}`}>Ubicación</p>
                          <p className={`text-sm ${secondaryText}`}>
                            {empresa.direccion}, {empresa.ciudad}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {empresa.paginaWeb && (
                          <div className="flex items-center gap-3">
                            <div className={modoOscuro ? iconWrapperDark : iconWrapper}>
                              <Globe size={16} />
                            </div>
                            <div>
                              <p className={`text-xs font-medium ${textColor}`}>Sitio Web</p>
                              <a
                                href={empresa.paginaWeb}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-500 hover:underline text-sm"
                              >
                                {empresa.paginaWeb}
                              </a>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-3">
                          <div className={modoOscuro ? iconWrapperDark : iconWrapper}>
                            <Phone size={16} />
                          </div>
                          <div>
                            <p className={`text-xs font-medium ${textColor}`}>Teléfono Fijo</p>
                            <p className={`text-sm ${secondaryText}`}>{empresa.telefono}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className={modoOscuro ? iconWrapperDark : iconWrapper}>
                            <CirclePlay size={16} />
                          </div>
                          <div>
                            <p className={`text-xs font-medium ${textColor}`}>Ciudad</p>
                            <p className={`text-sm ${secondaryText}`}>{empresa.ciudad}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className={modoOscuro ? iconWrapperDark : iconWrapper}>
                            <Smartphone size={16} />
                          </div>
                          <div>
                            <p className={`text-xs font-medium ${textColor}`}>Teléfono Móvil</p>
                            <p className={`text-sm ${secondaryText}`}>{empresa.celular}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className={modoOscuro ? iconWrapperDark : iconWrapper}>
                            <Mail size={16} />
                          </div>
                          <div>
                            <p className={`text-xs font-medium ${textColor}`}>Email</p>
                            <p className={`text-sm ${secondaryText}`}>{empresa.email}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Columna 3 */}
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className={modoOscuro ? iconWrapperDark : iconWrapper}>
                            <UserCheck size={16} />
                          </div>
                          <div>
                            <p className={`text-xs font-medium ${textColor}`}>Representante Legal</p>
                            <p className={`text-sm ${secondaryText}`}>
                              {empresa.nombreLegal} {empresa.apellidoLegal}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className={modoOscuro ? iconWrapperDark : iconWrapper}>
                            <User size={16} />
                          </div>
                          <div>
                            <p className={`text-xs font-medium ${textColor}`}>Cargo</p>
                            <p className={`text-sm ${secondaryText}`}>{empresa.cargoLegal}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className={modoOscuro ? iconWrapperDark : iconWrapper}>
                            <FileText size={16} />
                          </div>
                          <div>
                            <p className={`text-xs font-medium ${textColor}`}>Documento Legal</p>
                            <p className={`text-sm ${secondaryText}`}>{empresa.documentoLegal}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className={modoOscuro ? iconWrapperDark : iconWrapper}>
                            <Users size={16} />
                          </div>
                          <div>
                            <p className={`text-xs font-medium ${textColor}`}>N° Empleados</p>
                            <p className={`text-sm ${secondaryText}`}>{empresa.empleados}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className={modoOscuro ? iconWrapperDark : iconWrapper}>
                            <Clock size={16} />
                          </div>
                          <div>
                            <p className={`text-xs font-medium ${textColor}`}>Años de Operación</p>
                            <p className={`text-sm ${secondaryText}`}>{empresa.tiempo}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className={modoOscuro ? iconWrapperDark : iconWrapper}>
                            <FileBadge size={16} />
                          </div>
                          <div>
                            <p className={`text-xs font-medium ${textColor}`}>Teléfono Fijo Legal</p>
                            <p className={`text-sm ${secondaryText}`}>{empresa.telefonoFijo}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Botones de Acción */}
                  <div className="flex lg:flex-col items-center justify-center lg:justify-start gap-3 lg:w-20 lg:border-l lg:pl-4 lg:ml-4">
                    <button
                      onClick={() => abrirModal(empresa)}
                      className={`p-3 rounded-xl ${modoOscuro ? "bg-blue-900/30 text-blue-400" : "bg-blue-50 text-blue-600"} hover:scale-110 transition`}
                      title="Editar empresa"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleEliminar(empresa.id)}
                      className={`p-3 rounded-xl ${modoOscuro ? "bg-red-900/30 text-red-400" : "bg-red-50 text-red-600"} hover:scale-110 transition`}
                      title="Eliminar empresa"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modales */}
      {mostrarModal && !editandoId && (
        <EmpresaModal
          isOpen={mostrarModal}
          onClose={cerrarModal}
          onSave={handleSave}
          empresa={empresaActual}
          onChange={(e: any) =>
            setEmpresaActual({ ...empresaActual, [e.target.name]: e.target.value })
          }
          modoOscuro={modoOscuro}
        />
      )}

      {mostrarModal && editandoId && (
        <EditarEmpresa
          isOpen={mostrarModal}
          onClose={cerrarModal}
          onSave={handleSave}
          empresa={empresaActual}
          onChange={(e: any) =>
            setEmpresaActual({ ...empresaActual, [e.target.name]: e.target.value })
          }
          modoOscuro={modoOscuro}
        />
      )}
    </>
  );
}
