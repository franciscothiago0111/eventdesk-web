import { pdfRegistry } from '../registry';
import { eventDetailsPDFTemplate } from './event-details.template';

export function registerPDFTemplates() {
  pdfRegistry.register(eventDetailsPDFTemplate);

  // Register future templates here, e.g.:
  // pdfRegistry.register(registrationsPDFTemplate);
}

registerPDFTemplates();

export { eventDetailsPDFTemplate };
