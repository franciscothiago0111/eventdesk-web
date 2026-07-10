import { StyleSheet } from '@react-pdf/renderer';

export const commonStyles = StyleSheet.create({
  page: {
    padding: 40,
    paddingBottom: 60,
    fontSize: 11,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },

  header: {
    marginBottom: 20,
    borderBottom: '2 solid #3b82f6',
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },

  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
    borderBottom: '1 solid #e5e7eb',
    paddingBottom: 5,
  },

  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  column: {
    flex: 1,
  },

  field: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 3,
    fontWeight: 'bold',
  },
  fieldValue: {
    fontSize: 11,
    color: '#1f2937',
  },

  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
    alignSelf: 'flex-start',
  },
  badgePrimary: { backgroundColor: '#dbeafe', color: '#1e40af' },
  badgeSuccess: { backgroundColor: '#d1fae5', color: '#065f46' },
  badgeWarning: { backgroundColor: '#fef3c7', color: '#92400e' },
  badgeDanger: { backgroundColor: '#fee2e2', color: '#991b1b' },
  badgeSecondary: { backgroundColor: '#f3f4f6', color: '#4b5563' },

  table: {
    width: '100%',
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottom: '2 solid #3b82f6',
    paddingBottom: 5,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #e5e7eb',
    paddingVertical: 8,
  },
  tableCell: {
    flex: 1,
    fontSize: 10,
  },

  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTop: '1 solid #e5e7eb',
    paddingTop: 10,
    fontSize: 9,
    color: '#6b7280',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  textBold: { fontWeight: 'bold' },
  textMuted: { color: '#6b7280' },
  textSmall: { fontSize: 9 },
  textCenter: { textAlign: 'center' },

  mb5: { marginBottom: 5 },
  mb10: { marginBottom: 10 },
  mb15: { marginBottom: 15 },
  mb20: { marginBottom: 20 },
  mt5: { marginTop: 5 },
  mt10: { marginTop: 10 },
  mt15: { marginTop: 15 },
  mt20: { marginTop: 20 },

  breakBefore: { break: 'before' },
  breakAfter: { break: 'after' },
  breakAvoid: { break: 'avoid' },
  breakInside: { break: 'inside' },
});
