import type { ReactElement } from 'react';
import type { DocumentProps } from '@react-pdf/renderer';

export interface IPDFGenerationOptions {
  filename?: string;
  author?: string;
  title?: string;
  subject?: string;
}

export interface IPDFTemplate<T = unknown> {
  name: string;
  Document: (props: { data: T; options?: IPDFGenerationOptions }) => ReactElement<DocumentProps>;
}

export type IPDFTemplateRegistry = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: IPDFTemplate<any>;
};
