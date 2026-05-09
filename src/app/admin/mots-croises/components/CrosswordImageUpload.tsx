'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { ImagePlus, X } from 'lucide-react';

type Props = {
  currentImageUrl?: string;
  onUpload: (assetId: string, previewUrl: string) => void;
  onRemove: () => void;
};

export default function CrosswordImageUpload({ currentImageUrl, onUpload, onRemove }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload-image', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Échec du téléversement');

      const { assetId } = await res.json();
      const previewUrl = URL.createObjectURL(file);
      onUpload(assetId, previewUrl);
    } catch {
      setError('Erreur lors du téléversement. Réessayez.');
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        Photo <span className="font-normal text-slate-400">(optionnel)</span>
      </label>

      {currentImageUrl ? (
        <div className="relative w-full aspect-video rounded-md overflow-hidden border border-slate-200 bg-slate-50">
          <Image src={currentImageUrl} alt="Photo du mot croisé" fill className="object-cover" unoptimized />
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-slate-100"
            title="Supprimer la photo"
          >
            <X className="h-4 w-4 text-slate-600" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="w-full border-2 border-dashed border-slate-200 rounded-md py-6 flex flex-col items-center gap-2 text-slate-400 hover:border-emerald-400 hover:text-emerald-600 transition-colors disabled:opacity-50"
        >
          <ImagePlus className="h-6 w-6" />
          <span className="text-sm">{isUploading ? 'Téléversement…' : 'Ajouter une photo'}</span>
        </button>
      )}

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
