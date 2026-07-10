import { pdf } from '@react-pdf/renderer';
import { pdfRegistry } from '../registry';
import type { IPDFGenerationOptions } from '../types';

interface IRenderPDFParams<T> {
  template: string;
  data: T;
  options?: IPDFGenerationOptions;
}

async function renderToBlob<T>({ template, data, options }: IRenderPDFParams<T>): Promise<Blob> {
  const pdfTemplate = pdfRegistry.getTemplate<T>(template);
  if (!pdfTemplate) {
    throw new Error(`PDF template "${template}" is not registered`);
  }

  const instance = pdf(pdfTemplate.Document({ data, options }));
  return instance.toBlob();
}

export async function downloadPDF<T>(params: IRenderPDFParams<T>): Promise<void> {
  const blob = await renderToBlob(params);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = params.options?.filename || `${params.template}-${Date.now()}.pdf`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function previewPDF<T>(params: IRenderPDFParams<T>): Promise<void> {
  const blob = await renderToBlob(params);
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
  setTimeout(() => URL.revokeObjectURL(url), 100);
}
