"use client";
import { useState, useEffect } from "react";
import {
  Plus, Edit, Trash2, Briefcase, Hash, MapPin, Globe, Phone,
  Users, Clock, Mail, Smartphone, FileBadge, UserCheck, Factory
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
  cityId: string;
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
    });

  const showWarning = (mensaje: string) =>
    Swal.fire({
      icon: "warning",
      title: "Atención",
      text: mensaje,
      confirmButtonColor: "#39A900",
    });

  // === CARGAR EMPRESAS ===
  const cargarEmpresas = async () => {
    try {
      const data = await getEmpresas();
      const items = (data.data || []).map((e: any) => ({
        id: String(e.id),
        nombre: e.name,
        nit: e.taxId,
        direccion: e.address,
        razonSocial: e.legalName,
        paginaWeb: e.website,
        telefono: e.phone,
        empleados: String(e.employeeCount),
        sector: e.economicSector,
        tiempo: e.existenceYears || 0,
        descripcion: e.description,
        documentoLegal: e.legalDocument,
        nombreLegal: e.legalFirstName,
        apellidoLegal: e.legalLastName,
        telefonoFijo: e.landline,
        celular: e.legalMobile,
        email: e.email,
        cargoLegal: e.legalPosition,
        ciudad: e.city?.name || "Sin ciudad",
        cityId: e.city?.id ? String(e.city.id) : "",
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
      cityId: empresaActual.cityId ? Number(empresaActual.cityId) : null,
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

  // === ABRIR / CERRAR MODAL ===
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
      e.nombre.toLowerCase().includes(buscar.toLowerCase()) ||
      e.nit.toLowerCase().includes(buscar.toLowerCase())
  );

  // === ESTILOS ===
  const bgColor = modoOscuro ? "bg-[#1a0526]" : "bg-white";
  const textColor = modoOscuro ? "text-white" : "text-gray-900";
  const borderColor = modoOscuro ? "border-white/20" : "border-gray-200";
  const cardBg = modoOscuro ? "bg-white/10" : "bg-white";
  const secondaryText = modoOscuro ? "text-gray-300" : "text-gray-600";
  const titleColor = modoOscuro ? "text-white" : "text-gray-800";
  const detailText = modoOscuro ? "text-gray-400" : "text-gray-600";

  return (
    <>
      <div
        className={`rounded-3xl p-10 max-w-9xl mx-auto my-12 ${bgColor} ${textColor}`}
      >
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
              className={`border rounded-2xl px-5 py-3 text-lg pl-4 focus:outline-none focus:ring-2 w-full transition-all duration-300 hover:shadow-md ${textColor} ${borderColor}`}
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
        <div className="space-y-5">
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
                className={`p-6 rounded-2xl border shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col gap-4 ${cardBg} ${borderColor}`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3
                      className={`text-2xl font-semibold ${titleColor}`}
                    >
                      {empresa.nombre}
                    </h3>
                    <p className={secondaryText}>
                      <Hash className="inline mr-2 h-4 w-4" /> NIT:{" "}
                      {empresa.nit}
                    </p>
                    <p className={secondaryText}>
                      <Briefcase className="inline mr-2 h-4 w-4" /> Razón
                      Social: {empresa.razonSocial}
                    </p>
                    <p className={secondaryText}>
                      <Factory className="inline mr-2 h-4 w-4" /> Sector:{" "}
                      {empresa.sector}
                    </p>
                    <p className={secondaryText}>
                      <Clock className="inline mr-2 h-4 w-4" /> Tiempo:{" "}
                      {empresa.tiempo} años
                    </p>
                  </div>
                  <div>
                    <p className={secondaryText}>
                      <MapPin className="inline mr-2 h-4 w-4" /> Dirección:{" "}
                      {empresa.direccion}, {empresa.ciudad}
                    </p>
                    {empresa.paginaWeb && (
                      <p className="text-blue-500 flex items-center gap-2">
                        <Globe className="h-4 w-4" />{" "}
                        <a
                          href={empresa.paginaWeb}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline"
                        >
                          {empresa.paginaWeb}
                        </a>
                      </p>
                    )}
                    <p className={secondaryText}>
                      <Phone className="inline mr-2 h-4 w-4" /> Tel:{" "}
                      {empresa.telefono} |{" "}
                      <Smartphone className="inline mr-2 h-4 w-4" /> Cel:{" "}
                      {empresa.celular}
                    </p>
                    <p className={secondaryText}>
                      <Mail className="inline mr-2 h-4 w-4" /> Email:{" "}
                      {empresa.email}
                    </p>
                    <p className={secondaryText}>
                      <Users className="inline mr-2 h-4 w-4" /> Empleados:{" "}
                      {empresa.empleados}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className={secondaryText}>
                      <UserCheck className="inline mr-2 h-4 w-4" />{" "}
                      Representante: {empresa.nombreLegal}{" "}
                      {empresa.apellidoLegal} ({empresa.cargoLegal})
                    </p>
                    <p className={secondaryText}>
                      <FileBadge className="inline mr-2 h-4 w-4" /> Documento:{" "}
                      {empresa.documentoLegal}
                    </p>
                    {empresa.descripcion && (
                      <p className={detailText}>
                        <strong>Descripción:</strong> {empresa.descripcion}
                      </p>
                    )}
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => abrirModal(empresa)}
                    className={`p-3 rounded-xl ${
                      modoOscuro
                        ? "bg-blue-900/30 text-blue-400"
                        : "bg-blue-50 text-blue-600"
                    } hover:scale-110 transition`}
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => handleEliminar(empresa.id)}
                    className={`p-3 rounded-xl ${
                      modoOscuro
                        ? "bg-red-900/30 text-red-400"
                        : "bg-red-50 text-red-600"
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
      {mostrarModal && !editandoId && (
        <EmpresaModal
          isOpen={mostrarModal}
          onClose={cerrarModal}
          onSave={handleSave}
          empresa={empresaActual}
          onChange={(e: any) =>
            setEmpresaActual({
              ...empresaActual,
              [e.target.name]: e.target.value,
            })
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
            setEmpresaActual({
              ...empresaActual,
              [e.target.name]: e.target.value,
            })
          }
          modoOscuro={modoOscuro}
        />
      )}
    </>
  );
}
