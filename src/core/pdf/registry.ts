import type { IPDFTemplate, IPDFTemplateRegistry } from './types';

class PDFRegistry {
  private templates: IPDFTemplateRegistry = {};

  register<T = unknown>(template: IPDFTemplate<T>): void {
    this.templates[template.name] = template;
  }

  getTemplate<T = unknown>(name: string): IPDFTemplate<T> | undefined {
    return this.templates[name] as IPDFTemplate<T> | undefined;
  }

  getTemplateNames(): string[] {
    return Object.keys(this.templates);
  }
}

export const pdfRegistry = new PDFRegistry();
