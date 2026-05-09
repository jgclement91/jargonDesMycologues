export type PortableTextSpan = {
  _type: 'span';
  _key: string;
  text: string;
  marks: string[];
};

export type PortableTextBlock = {
  _type: 'block';
  _key: string;
  style: string;
  markDefs: never[];
  children: PortableTextSpan[];
};

function key(): string {
  return Math.random().toString(36).slice(2, 9);
}

export function htmlToPortableText(html: string): PortableTextBlock[] {
  if (typeof document === 'undefined') return stringToPortableText(html);
  const div = document.createElement('div');
  div.innerHTML = html;
  const children: PortableTextSpan[] = [];

  function walk(node: Node, marks: string[]) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent ?? '';
      if (text) children.push({ _type: 'span', _key: key(), text, marks: [...marks] });
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      const next = [...marks];
      const tag = el.tagName.toUpperCase();
      if (tag === 'STRONG' || tag === 'B') next.push('strong');
      if (tag === 'EM' || tag === 'I') next.push('em');
      Array.from(node.childNodes).forEach(child => walk(child, next));
    }
  }

  Array.from(div.childNodes).forEach(node => walk(node, []));

  if (children.length === 0) children.push({ _type: 'span', _key: key(), text: '', marks: [] });

  return [{ _type: 'block', _key: key(), style: 'normal', markDefs: [], children }];
}

export function portableTextToHtml(blocks: PortableTextBlock[] | null | undefined): string {
  if (!blocks?.length) return '';
  return blocks.map(block => {
    if (block._type !== 'block') return '';
    return block.children.map(span => {
      let text = (span.text ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      if (span.marks?.includes('strong')) text = `<strong>${text}</strong>`;
      if (span.marks?.includes('em')) text = `<em>${text}</em>`;
      return text;
    }).join('');
  }).join('<br>');
}

export function stringToPortableText(text: string): PortableTextBlock[] {
  return [{
    _type: 'block',
    _key: key(),
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: key(), text: text ?? '', marks: [] }],
  }];
}

export function isPortableTextEmpty(blocks: PortableTextBlock[] | string | null | undefined): boolean {
  if (!blocks) return true;
  if (typeof blocks === 'string') return !blocks.trim();
  if (!Array.isArray(blocks)) return true;
  return blocks.every(b => !b.children?.some(s => s.text?.trim()));
}
