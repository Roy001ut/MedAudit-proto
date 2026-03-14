/**
 * Parse a File object into { type, content, base64, mimeType }
 *
 * type: 'image' | 'document' | 'text'
 * content: extracted text (for text/docx)
 * base64: base64 string (for image/pdf)
 * mimeType: MIME type string
 */
export async function handleFile(file) {
  const ext = file.name.split('.').pop().toLowerCase();

  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
    const base64 = await toBase64(file);
    return { type: 'image', base64, mimeType: file.type || 'image/jpeg', content: null };
  }

  if (ext === 'pdf') {
    const base64 = await toBase64(file);
    return { type: 'document', base64, mimeType: 'application/pdf', content: null };
  }

  if (ext === 'docx') {
    const mammoth = await import('mammoth');
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return { type: 'text', base64: null, mimeType: file.type, content: result.value };
  }

  // Default: plain text
  const content = await readAsText(file);
  return { type: 'text', base64: null, mimeType: 'text/plain', content };
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // Strip the data URL prefix (data:...;base64,)
      const result = reader.result;
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function readAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}
