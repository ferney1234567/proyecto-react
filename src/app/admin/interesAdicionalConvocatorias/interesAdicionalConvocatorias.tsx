"use client";

import { useState, useEffect } from "react";
import { Edit, Trash2, Plus, Search, Loader2, FileText, Heart } from "lucide-react";
import Swal from "sweetalert2";

import {
  getCallAdditionalInterests,
  createCallAdditionalInterest,
  updateCallAdditionalInterest,
  deleteCallAdditionalInterest,
} from "../../api/interesAdicionalConvocatorias/route";

import ModalCrearCallAdditionalInterest from "./crearInteresAdicionalConvocatorias";
import ModalEditarCallAdditionalInterest from "./editarInteresAdicionalConvocatorias";

interface CallAdditionalInterest {
  callId: number;
  interestId: number;
  callName?: string;
  interestName?: string;
  interestDescription?: string;
}

interface Props {
  modoOscuro: boolean;
}

export default function CallAdditionalInterests({ modoOscuro }: Props) {
  const [data, setData] = useState<CallAdditionalInterest[]>([]);
  const [buscar, setBuscar] = useState("");
  const [loading, setLoading] = useState(true);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const [seleccionado, setSeleccionado] = useState<CallAdditionalInterest | null>(null);

  // === CARGAR DATOS ===
  const cargarDatos = async () => {
    try {
      setLoading(true);
      const res = await getCallAdditionalInterests();
      const arr = res?.data || [];

      const mapped = arr.map((item: any) => ({
        callId: item.callId,
        interestId: item.interestId,
        callName: item.call?.title || `Convocatoria ${item.callId}`,
        interestName: item.interest?.name || `Interés ${item.interestId}`,
        interestDescription: item.interest?.description || "",
      }));

      setData(mapped);
    } catch {
      Swal.fire("Error", "No se pudieron cargar los datos", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // === CREAR ===
  const guardarNuevo = async (nuevo: any) => {
    try {
      await createCallAdditionalInterest(nuevo);
      setMostrarModal(false);
      Swal.fire("Éxito", "Relación creada correctamente", "success");
      cargarDatos();
    } catch {
      Swal.fire("Error", "No se pudo crear", "error");
    }
  };

  // === EDITAR ===
  const guardarCambios = async (editado: any) => {
    try {
      await updateCallAdditionalInterest(editado.callId, editado.interestId, editado);
      setMostrarEditar(false);
      setSeleccionado(null);
      Swal.fire("Éxito", "Actualizado correctamente", "success");
      cargarDatos();
    } catch {
      Swal.fire("Error", "No se pudo actualizar", "error");
    }
  };

  // === ELIMINAR ===
  const eliminar = async (callId: number, interestId: number) => {
    Swal.fire({
      title: "¿Eliminar relación?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Eliminar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteCallAdditionalInterest(callId, interestId);
          Swal.fire("Éxito", "Eliminado correctamente", "success");
          cargarDatos();
        } catch {
          Swal.fire("Error", "No se pudo eliminar", "error");
        }
      }
    });
  };

  // === FILTRO ===
  const filtrados = data.filter(
    (d) =>
      d.callName?.toLowerCase().includes(buscar.toLowerCase()) ||
      d.interestName?.toLowerCase().includes(buscar.toLowerCase())
  );

  // === ESTILOS ===
  const bgColor = modoOscuro ? "bg-[#1a0526]" : "bg-white";
  const textColor = modoOscuro ? "text-white" : "text-gray-900";
  const borderColor = modoOscuro ? "border-white/20" : "border-gray-200";
  const cardBg = modoOscuro ? "bg-white/10" : "bg-white";
  const placeholderColor = modoOscuro ? "placeholder-gray-400" : "placeholder-gray-500";
  const searchBg = modoOscuro ? "bg-white/10" : "bg-white";
  const searchBorder = modoOscuro ? "border-white/20" : "border-gray-300";
  const searchFocus = "focus:ring-[#39A900] focus:border-[#39A900]";
  const emptyStateBg = modoOscuro ? "bg-gray-800/30" : "bg-gray-50";
  const iconBg = modoOscuro ? "bg-[#39A900]/20" : "bg-[#39A900]/10";
  const secondaryText = modoOscuro ? "text-gray-300" : "text-gray-600";
  const titleColor = modoOscuro ? "text-white" : "text-gray-800";

  return (
    <div className={`rounded-3xl p-10 max-w-9xl mx-auto my-12 ${bgColor} ${textColor}`}>
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className={`text-4xl font-extrabold mb-2 ${titleColor}`}>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
            Gestión de Intereses Adicionales en Convocatorias
          </span>
        </h2>
        <p className={`text-lg ${secondaryText}`}>Relaciones Convocatoria ↔ Intereses</p>
      </div>

      {/* Buscar + Botón */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="Buscar por Convocatoria o Interés..."
            className={`border rounded-2xl px-5 py-3 text-lg pl-12 focus:outline-none focus:ring-2 w-full transition-all duration-300 hover:shadow-md ${searchBg} ${textColor} ${searchBorder} ${searchFocus} ${placeholderColor}`}
            value={buscar}
            onChange={(e) => setBuscar(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <button
          onClick={() => setMostrarModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#39A900] text-white text-lg font-medium rounded-2xl hover:bg-[#2d8500] transition-all shadow-md hover:shadow-xl transform hover:scale-105 duration-300 w-full sm:w-auto justify-center"
        >
          <Plus size={20} />
          Nuevo
        </button>
      </div>

      {/* Loader */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin h-10 w-10 text-green-600" />
        </div>
      ) : (
        <div className="space-y-5">
          {filtrados.length === 0 ? (
            <div className={`text-center py-16 rounded-2xl border ${emptyStateBg}`}>
              <p className={`${secondaryText} text-lg`}>No se encontraron datos</p>
            </div>
          ) : (
            filtrados.map((item) => (
              <div
                key={`${item.callId}-${item.interestId}`}
                className={`p-6 rounded-2xl border shadow-md hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row justify-between items-center gap-5 transform hover:-translate-y-1 ${cardBg} ${borderColor}`}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className={`p-4 rounded-xl transition-colors ${iconBg} text-[#39A900]`}>
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className={`text-xl font-semibold ${titleColor}`}>{item.callName}</h3>
                    <p className={`text-sm ${secondaryText} flex items-center gap-1`}>
                      <Heart size={14} className="text-pink-500" /> {item.interestName}
                    </p>
                    {item.interestDescription && (
                      <p className={`text-xs ${secondaryText}`}>{item.interestDescription}</p>
                    )}
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setSeleccionado(item);
                      setMostrarEditar(true);
                    }}
                    className={`p-3 rounded-xl ${modoOscuro ? "bg-blue-900/30 text-blue-400" : "bg-blue-50 text-blue-600"} hover:scale-110 transition`}
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => eliminar(item.callId, item.interestId)}
                    className={`p-3 rounded-xl ${modoOscuro ? "bg-red-900/30 text-red-400" : "bg-red-50 text-red-600"} hover:scale-110 transition`}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modales */}
      {mostrarModal && (
        <ModalCrearCallAdditionalInterest
          onClose={() => setMostrarModal(false)}
          onSave={guardarNuevo}
          modoOscuro={modoOscuro}
        />
      )}

      {mostrarEditar && seleccionado && (
        <ModalEditarCallAdditionalInterest
          visible={mostrarEditar}
          onClose={() => setMostrarEditar(false)}
          onSave={guardarCambios}
          item={seleccionado}
          setItem={setSeleccionado}
          modoOscuro={modoOscuro}
        />
      )}
    </div>
  );
}
