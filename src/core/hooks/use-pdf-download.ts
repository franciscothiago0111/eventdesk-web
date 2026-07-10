import { useState } from 'react';
import { toast } from 'sonner';
import { downloadPDF, previewPDF } from '@/core/pdf/utils/generate-pdf';
import type { IPDFGenerationOptions } from '@/core/pdf/types';

interface IGeneratePDFParams<T> {
  template: string;
  data: T;
  options?: IPDFGenerationOptions;
}

export function usePDFDownload() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async <T,>(params: IGeneratePDFParams<T>) => {
    setIsGenerating(true);
    try {
      await downloadPDF(params);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  const openPDFPreview = async <T,>(params: IGeneratePDFParams<T>) => {
    setIsGenerating(true);
    try {
      await previewPDF(params);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  return { generatePDF, openPDFPreview, isGenerating };
}
