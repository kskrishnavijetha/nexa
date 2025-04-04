
import { SupportedLanguage } from './types';
import { Industry } from '../types';

const translations: Record<string, Record<SupportedLanguage, string>> = {
  // Compliance headings
  'overall_compliance': {
    en: 'Overall Compliance',
    es: 'Cumplimiento General',
    fr: 'Conformité Globale',
    de: 'Gesamtkonformität',
    zh: '总体合规性',
  },
  'gdpr_compliance': {
    en: 'GDPR Compliance',
    es: 'Cumplimiento GDPR',
    fr: 'Conformité RGPD',
    de: 'DSGVO-Konformität',
    zh: 'GDPR合规性',
  },
  'hipaa_compliance': {
    en: 'HIPAA Compliance',
    es: 'Cumplimiento HIPAA',
    fr: 'Conformité HIPAA',
    de: 'HIPAA-Konformität',
    zh: 'HIPAA合规性',
  },
  'soc2_compliance': {
    en: 'SOC 2 Compliance',
    es: 'Cumplimiento SOC 2',
    fr: 'Conformité SOC 2',
    de: 'SOC 2-Konformität',
    zh: 'SOC 2合规性',
  },
  'pci_dss_compliance': {
    en: 'PCI-DSS Compliance',
    es: 'Cumplimiento PCI-DSS',
    fr: 'Conformité PCI-DSS',
    de: 'PCI-DSS-Konformität',
    zh: 'PCI-DSS合规性',
  },
  'industry_specific_compliance': {
    en: 'Industry-Specific Compliance',
    es: 'Cumplimiento Específico de la Industria',
    fr: 'Conformité Spécifique à l\'Industrie',
    de: 'Branchenspezifische Konformität',
    zh: '行业特定合规性',
  },
  
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
  
  // Industries
  'healthcare': {
    en: 'Healthcare',
    es: 'Salud',
    fr: 'Santé',
    de: 'Gesundheitswesen',
    zh: '医疗保健',
  },
  'financial_services': {
    en: 'Financial Services',
    es: 'Servicios Financieros',
    fr: 'Services Financiers',
    de: 'Finanzdienstleistungen',
    zh: '金融服务',
  },
  'technology': {
    en: 'Technology & IT',
    es: 'Tecnología y TI',
    fr: 'Technologie et Informatique',
    de: 'Technologie & IT',
    zh: '技术和IT',
  },
  
  // Score descriptions
  'strong_compliance': {
    en: 'this document demonstrates a strong compliance posture overall, with only minor issues to address.',
    es: 'este documento demuestra una postura de cumplimiento sólida en general, con solo problemas menores por resolver.',
    fr: 'ce document démontre une posture de conformité solide dans l\'ensemble, avec seulement des problèmes mineurs à résoudre.',
    de: 'dieses Dokument zeigt insgesamt eine starke Compliance-Position mit nur geringfügigen Problemen, die behoben werden müssen.',
    zh: '该文档总体上表现出良好的合规态势，只有少量问题需要解决。',
  },
  'needs_improvement': {
    en: 'this document has several compliance areas that need improvement. The most critical issues relate to',
    es: 'este documento tiene varias áreas de cumplimiento que necesitan mejoras. Los problemas más críticos están relacionados con',
    fr: 'ce document comporte plusieurs domaines de conformité qui nécessitent des améliorations. Les problèmes les plus critiques concernent',
    de: 'dieses Dokument weist mehrere Compliance-Bereiche auf, die verbessert werden müssen. Die kritischsten Probleme betreffen',
    zh: '该文档有几个需要改进的合规领域。最关键的问题涉及',
  },
  'significant_gaps': {
    en: 'this document has significant compliance gaps that require immediate attention across multiple regulatory frameworks.',
    es: 'este documento tiene importantes lagunas de cumplimiento que requieren atención inmediata en múltiples marcos regulatorios.',
    fr: 'ce document présente d\'importantes lacunes en matière de conformité qui nécessitent une attention immédiate dans plusieurs cadres réglementaires.',
    de: 'dieses Dokument weist erhebliche Compliance-Lücken auf, die in mehreren regulatorischen Rahmenwerken sofortige Aufmerksamkeit erfordern.',
    zh: '该文档存在显著的合规差距，需要在多个监管框架中立即关注。',
  },
  
  // Common phrases
  'based_on_analysis': {
    en: 'Based on our analysis of your document for',
    es: 'Basado en nuestro análisis de su documento para',
    fr: 'D\'après notre analyse de votre document pour',
    de: 'Basierend auf unserer Analyse Ihres Dokuments für',
    zh: '根据我们对您的文档的分析',
  },
  'industry_compliance': {
    en: 'industry compliance,',
    es: 'cumplimiento de la industria,',
    fr: 'conformité de l\'industrie,',
    de: 'Branchenkonformität,',
    zh: '行业合规性,',
  },
  'document': {
    en: 'Document',
    es: 'Documento',
    fr: 'Document',
    de: 'Dokument',
    zh: '文档',
  },
  'generated': {
    en: 'Generated',
    es: 'Generado',
    fr: 'Généré',
    de: 'Erstellt',
    zh: '生成',
  },
  'industry': {
    en: 'Industry',
    es: 'Industria',
    fr: 'Industrie',
    de: 'Branche',
    zh: '行业',
  },
  'applicable_regulations': {
    en: 'Applicable Regulations',
    es: 'Regulaciones Aplicables',
    fr: 'Réglementations Applicables',
    de: 'Anwendbare Vorschriften',
    zh: '适用法规',
  },
  'regulation': {
    en: 'Regulation',
    es: 'Regulación',
    fr: 'Réglementation',
    de: 'Vorschrift',
    zh: '法规',
  },
  
  // Service History translations
  'service_scan_history': {
    en: 'Service Scan History',
    es: 'Historial de Escaneo de Servicios',
    fr: 'Historique des Analyses de Services',
    de: 'Dienst-Scan-Verlauf',
    zh: '服务扫描历史',
  },
  'no_scan_history_yet': {
    en: 'No scan history yet',
    es: 'Aún no hay historial de escaneo',
    fr: 'Pas encore d\'historique d\'analyse',
    de: 'Noch keine Scan-Historie',
    zh: '暂无扫描历史',
  },
  'please_sign_in': {
    en: 'Please sign in to view your history',
    es: 'Inicie sesión para ver su historial',
    fr: 'Veuillez vous connecter pour voir votre historique',
    de: 'Bitte melden Sie sich an, um Ihren Verlauf anzuzeigen',
    zh: '请登录以查看您的历史记录',
  },
  'connect_services_text': {
    en: 'Connect services and run scans to see your history here',
    es: 'Conecte servicios y ejecute escaneos para ver su historial aquí',
    fr: 'Connectez des services et exécutez des analyses pour voir votre historique ici',
    de: 'Verbinden Sie Dienste und führen Sie Scans durch, um Ihren Verlauf hier zu sehen',
    zh: '连接服务并运行扫描以在此处查看您的历史记录',
  },
  'sign_in_to_view': {
    en: 'Sign in to view and manage your scan history',
    es: 'Inicie sesión para ver y gestionar su historial de escaneo',
    fr: 'Connectez-vous pour consulter et gérer votre historique d\'analyse',
    de: 'Melden Sie sich an, um Ihren Scan-Verlauf einzusehen und zu verwalten',
    zh: '登录以查看和管理您的扫描历史',
  },
  'delete_document_permanently': {
    en: 'Delete Document Permanently',
    es: 'Eliminar Documento Permanentemente',
    fr: 'Supprimer le Document Définitivement',
    de: 'Dokument Dauerhaft Löschen',
    zh: '永久删除文档',
  },
  'delete_confirmation': {
    en: 'Are you sure you want to permanently delete "{documentName}" from your history? This action cannot be undone.',
    es: '¿Está seguro de que desea eliminar permanentemente "{documentName}" de su historial? Esta acción no se puede deshacer.',
    fr: 'Êtes-vous sûr de vouloir supprimer définitivement "{documentName}" de votre historique ? Cette action ne peut pas être annulée.',
    de: 'Sind Sie sicher, dass Sie "{documentName}" dauerhaft aus Ihrem Verlauf löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.',
    zh: '您确定要从历史记录中永久删除"{documentName}"吗？此操作无法撤消。',
  },
  'cancel': {
    en: 'Cancel',
    es: 'Cancelar',
    fr: 'Annuler',
    de: 'Abbrechen',
    zh: '取消',
  },
  'delete_permanently': {
    en: 'Delete Permanently',
    es: 'Eliminar Permanentemente',
    fr: 'Supprimer Définitivement',
    de: 'Dauerhaft Löschen',
    zh: '永久删除',
  },
};

export const translate = (key: string, language: SupportedLanguage = 'en'): string => {
  if (!translations[key]) {
    console.warn(`Translation key not found: ${key}`);
    return key;
  }
  
  return translations[key][language] || translations[key].en;
};
