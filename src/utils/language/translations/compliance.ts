
import { SupportedLanguage } from '../types';

export const complianceTranslations: Record<string, Record<SupportedLanguage, string>> = {
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
};
