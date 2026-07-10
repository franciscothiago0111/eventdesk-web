import { Text, View } from '@react-pdf/renderer';
import { commonStyles } from '../styles/common.styles';

interface IFieldProps {
  label: string;
  value: string | number | null | undefined;
  minPresenceAhead?: number;
}

export function Field({ label, value, minPresenceAhead = 30 }: IFieldProps) {
  return (
    <View style={commonStyles.field} wrap={false} minPresenceAhead={minPresenceAhead}>
      <Text style={commonStyles.fieldLabel}>{label}</Text>
      <Text style={commonStyles.fieldValue}>{value ?? 'N/A'}</Text>
    </View>
  );
}

type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'secondary';

interface IBadgeProps {
  text: string;
  variant?: BadgeVariant;
}

export function Badge({ text, variant = 'primary' }: IBadgeProps) {
  const badgeStyle = {
    primary: commonStyles.badgePrimary,
    success: commonStyles.badgeSuccess,
    warning: commonStyles.badgeWarning,
    danger: commonStyles.badgeDanger,
    secondary: commonStyles.badgeSecondary,
  }[variant];

  return (
    <View style={[commonStyles.badge, badgeStyle]}>
      <Text>{text}</Text>
    </View>
  );
}

interface ISectionProps {
  title: string;
  children: React.ReactNode;
  wrap?: boolean;
  minPresenceAhead?: number;
}

export function Section({ title, children, wrap = true, minPresenceAhead = 80 }: ISectionProps) {
  return (
    <View wrap={wrap} style={commonStyles.section} minPresenceAhead={minPresenceAhead}>
      <Text style={commonStyles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

interface IHeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: IHeaderProps) {
  return (
    <View style={commonStyles.header}>
      <Text style={commonStyles.headerTitle}>{title}</Text>
      {subtitle && <Text style={commonStyles.headerSubtitle}>{subtitle}</Text>}
    </View>
  );
}

interface IFooterProps {
  leftText?: string;
  rightText?: string;
}

export function Footer({ leftText, rightText }: IFooterProps) {
  return (
    <View style={commonStyles.footer} fixed>
      <Text>{leftText}</Text>
      <Text
        render={({ pageNumber, totalPages }) =>
          rightText
            ? `${rightText} | Page ${pageNumber} of ${totalPages}`
            : `Page ${pageNumber} of ${totalPages}`
        }
      />
    </View>
  );
}
