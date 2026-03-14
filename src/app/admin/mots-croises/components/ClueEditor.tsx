'use client';

import { useEffect, useRef } from 'react';
import { Bold, Italic } from 'lucide-react';
import type { PortableTextBlock } from '../utils/portableText';
import { htmlToPortableText, portableTextToHtml } from '../utils/portableText';

type Props = {
  value: PortableTextBlock[];
  onChange: (value: PortableTextBlock[]) => void;
  placeholder?: string;
};

export default function ClueEditor({ value, onChange, placeholder }: Props) {
  const editableRef = useRef<HTMLDivElement>(null);
  const isComposingRef = useRef(false);
  const lastHtmlRef = useRef('');

  useEffect(() => {
    const el = editableRef.current;
    if (!el || el === document.activeElement) return;
    const html = portableTextToHtml(value);
    if (html !== lastHtmlRef.current) {
      lastHtmlRef.current = html;
      el.innerHTML = html;
    }
  }, [value]);

  const handleInput = () => {
    if (isComposingRef.current) return;
    const el = editableRef.current;
    if (!el) return;
    const html = el.innerHTML;
    lastHtmlRef.current = html;
    onChange(htmlToPortableText(html));
  };

  const handleFormat = (e: React.MouseEvent, command: 'bold' | 'italic') => {
    e.preventDefault();
    editableRef.current?.focus();
    document.execCommand(command === 'bold' ? 'bold' : 'italic', false);
    handleInput();
  };

  return (
    <div className="rounded-md border border-slate-200 focus-within:ring-2 focus-within:ring-emerald-500 overflow-hidden">
      <div className="flex gap-1 border-b border-slate-200 px-2 py-1 bg-slate-50">
        <button
          type="button"
          onMouseDown={e => handleFormat(e, 'bold')}
          className="p-1 rounded hover:bg-slate-200 text-slate-600"
          title="Gras"
        >
          <Bold className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onMouseDown={e => handleFormat(e, 'italic')}
          className="p-1 rounded hover:bg-slate-200 text-slate-600"
          title="Italique"
        >
          <Italic className="h-3.5 w-3.5" />
        </button>
      </div>
      <div
        ref={editableRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onCompositionStart={() => { isComposingRef.current = true; }}
        onCompositionEnd={() => { isComposingRef.current = false; handleInput(); }}
        data-placeholder={placeholder}
        className="px-3 py-2 text-sm min-h-[4rem] outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400"
      />
    </div>
  );
}
