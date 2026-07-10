import { View } from '@react-pdf/renderer';
import { commonStyles } from '../styles/common.styles';

/** Forces a page break at this location. */
export function PageBreak() {
  return <View break />;
}

interface IBreakControlProps {
  children: React.ReactNode;
}

/** Prevents content inside from breaking across pages via CSS break-avoid. */
export function NoBreak({ children }: IBreakControlProps) {
  return <View style={commonStyles.breakAvoid}>{children}</View>;
}

/** Keeps content together on the same page (React-PDF's wrap={false}). */
export function KeepTogether({ children }: IBreakControlProps) {
  return <View wrap={false}>{children}</View>;
}
