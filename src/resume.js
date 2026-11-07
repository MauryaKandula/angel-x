// Extracts plain text from a resume/job-description/reference file (PDF, DOCX, TXT, MD, JSON, CSV)
// so it can be dropped into the Settings textareas. No OCR — text layer only.
const fs = require('fs');
const path = require('path');

const PLAIN_TEXT_EXTS = new Set(['.txt', '.md', '.markdown', '.json', '.csv', '.log']);

async function parseDocumentFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const buf = fs.readFileSync(filePath);
  if (ext === '.pdf') {
    const pdfParse = require('pdf-parse');
    const res = await pdfParse(buf);
    return (res.text || '').trim();
  }
  if (ext === '.docx') {
    const mammoth = require('mammoth');
    const res = await mammoth.extractRawText({ buffer: buf });
    return (res.value || '').trim();
  }
  if (PLAIN_TEXT_EXTS.has(ext)) {
    return buf.toString('utf8').trim();
  }
  throw new Error('Unsupported file type: ' + (ext || '(none)') + '. Use a PDF, DOCX, TXT, or MD file.');
}

module.exports = { parseDocumentFile };
