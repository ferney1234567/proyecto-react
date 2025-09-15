import { FaTimes, FaSave, FaListUl } from 'react-icons/fa';

interface Category {
  id: number;
  name: string;
}

interface ModalEditarGrupoProps {
  abierto: boolean;
  valor: string;              // Nombre actual
  categoriaId: number | null; // Categoría actual
  categorias: Category[];     // Lista de categorías
  onCerrar: () => void;
  onGuardar: () => void;
  onCambioNombre: (value: string) => void;
  onCambioCategoria: (id: number) => void;
  modoOscuro: boolean;
}

export default function ModalEditarGrupo({
  abierto,
  valor,
  categoriaId,
  categorias,
  onCerrar,
  onGuardar,
  onCambioNombre,
  onCambioCategoria,
  modoOscuro,
}: ModalEditarGrupoProps) {
  if (!abierto) return null;

  const modalBg = modoOscuro ? 'bg-[#1a0526] text-white' : 'bg-white text-gray-900';
  const inputBg = modoOscuro
    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
    : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500';
  const footerBg = modoOscuro ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200';
  const cancelBtn = modoOscuro
    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
    : 'border-gray-300 text-gray-700 hover:bg-gray-100';
  const labelColor = modoOscuro ? 'text-gray-300' : 'text-gray-700';

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className={`${modalBg} rounded-2xl shadow-2xl w-full max-w-lg`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full">
              <FaListUl className="text-white text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-white">Editar Grupo</h2>
          </div>
          <button onClick={onCerrar} className="text-white hover:text-gray-200 p-1 rounded-full hover:bg-white/10">
            <FaTimes size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          {/* Nombre */}
          <div>
            <label className={`block text-sm font-medium ${labelColor}`}>Nombre del Grupo</label>
            <input
              type="text"
              className={`w-full border rounded-xl px-4 py-3 ${inputBg}`}
              value={valor}
              onChange={(e) => onCambioNombre(e.target.value)}
            />
          </div>

          {/* Categoría */}
          <div>
            <label className={`block text-sm font-medium ${labelColor}`}>Categoría</label>
            <select
              className={`w-full border rounded-xl px-4 py-3 ${inputBg}`}
              value={categoriaId ?? ''}
              onChange={(e) => onCambioCategoria(Number(e.target.value))}
            >
              <option value="">Seleccione una categoría</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className={`${footerBg} px-8 py-6 flex justify-between items-center border-t`}>
          <button className={`px-6 py-3 border rounded-xl ${cancelBtn}`} onClick={onCerrar}>
            <FaTimes size={18} /> Cancelar
          </button>
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            onClick={onGuardar}
          >
            <FaSave size={18} /> Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}
