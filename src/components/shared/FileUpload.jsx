import { useState, useRef } from 'react';
import { Upload, File, X } from 'lucide-react';

const ACCEPTED = '.pdf,.jpg,.jpeg,.png,.txt,.docx';

export default function FileUpload({ onFile, label = 'Upload document', accept = ACCEPTED }) {
  const [dragging, setDragging] = useState(false);
  const [selected, setSelected] = useState(null);
  const inputRef = useRef();

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) select(file);
  }

  function select(file) {
    setSelected(file);
    onFile(file);
  }

  function clear(e) {
    e.stopPropagation();
    setSelected(null);
    onFile(null);
    if (inputRef.current) inputRef.current.value = '';
  }

  const isImage = selected && selected.type.startsWith('image/');

  return (
    <div
      className={`relative border-2 border-dashed rounded-xl p-6 cursor-pointer transition-colors
        ${dragging ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50'}`}
      onClick={() => !selected && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => e.target.files[0] && select(e.target.files[0])}
      />

      {selected ? (
        <div className="flex items-center gap-3">
          {isImage ? (
            <img
              src={URL.createObjectURL(selected)}
              alt="preview"
              className="w-12 h-12 object-cover rounded-lg border border-gray-200"
            />
          ) : (
            <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-lg">
              <File size={24} className="text-blue-600" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">{selected.name}</p>
            <p className="text-xs text-gray-400">{(selected.size / 1024).toFixed(1)} KB</p>
          </div>
          <button onClick={clear} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
            <X size={16} className="text-gray-500" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 text-center">
          <Upload size={28} className="text-gray-400" />
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-xs text-gray-400">PDF, JPG, PNG, DOCX, TXT</p>
        </div>
      )}
    </div>
  );
}
