
import { SupportedLanguage } from '../types';

export const reportsTranslations: Record<string, Record<SupportedLanguage, string>> = {
  // Report sections
  'summary': {
    en: 'SUMMARY',
    es: 'RESUMEN',
    fr: 'RÉSUMÉ',
    de: 'ZUSAMMENFASSUNG',
    zh: '摘要',
  },
  'improvement_suggestions': {
    en: 'IMPROVEMENT SUGGESTIONS',
    es: 'SUGERENCIAS DE MEJORA',
    fr: 'SUGGESTIONS D\'AMÉLIORATION',
    de: 'VERBESSERUNGSVORSCHLÄGE',
    zh: '改进建议',
  },
  'compliance_issues': {
    en: 'COMPLIANCE ISSUES',
    es: 'PROBLEMAS DE CUMPLIMIENTO',
    fr: 'PROBLÈMES DE CONFORMITÉ',
    de: 'COMPLIANCE-PROBLEME',
    zh: '合规问题',
  },
  'compliance_report': {
    en: 'COMPLIANCE ANALYSIS REPORT',
    es: 'INFORME DE ANÁLISIS DE CUMPLIMIENTO',
    fr: 'RAPPORT D\'ANALYSE DE CONFORMITÉ',
    de: 'COMPLIANCE-ANALYSEBERICHT',
    zh: '合规分析报告',
  },
};
