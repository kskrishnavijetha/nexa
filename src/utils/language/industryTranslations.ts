
import { Industry } from '../types';

// Industry translations
export const industryTranslations: Record<string, Record<string, string>> = {
  en: {
    'Finance & Banking': 'Finance & Banking',
    'Healthcare': 'Healthcare',
    'Cloud & SaaS': 'Cloud & SaaS',
    'E-Commerce': 'E-Commerce',
    'Telecom': 'Telecom',
    'Energy & Utilities': 'Energy & Utilities',
    'Retail & Consumer': 'Retail & Consumer',
    'Education': 'Education',
    'Government & Defense': 'Government & Defense',
    'Pharmaceutical & Biotech': 'Pharmaceutical & Biotech',
    'Manufacturing & Supply Chain': 'Manufacturing & Supply Chain',
    'Automotive': 'Automotive',
    'Global': 'Global'
  },
  es: {
    'Finance & Banking': 'Finanzas y Banca',
    'Healthcare': 'Salud',
    'Cloud & SaaS': 'Nube y SaaS',
    'E-Commerce': 'Comercio Electrónico',
    'Telecom': 'Telecomunicaciones',
    'Energy & Utilities': 'Energía y Servicios Públicos',
    'Retail & Consumer': 'Minorista y Consumidor',
    'Education': 'Educación',
    'Government & Defense': 'Gobierno y Defensa',
    'Pharmaceutical & Biotech': 'Farmacéutica y Biotecnología',
    'Manufacturing & Supply Chain': 'Manufactura y Cadena de Suministro',
    'Automotive': 'Automotriz',
    'Global': 'Global'
  },
  fr: {
    'Finance & Banking': 'Finance et Banque',
    'Healthcare': 'Santé',
    'Cloud & SaaS': 'Cloud et SaaS',
    'E-Commerce': 'Commerce Électronique',
    'Telecom': 'Télécommunications',
    'Energy & Utilities': 'Énergie et Services Publics',
    'Retail & Consumer': 'Commerce de Détail et Consommation',
    'Education': 'Éducation',
    'Government & Defense': 'Gouvernement et Défense',
    'Pharmaceutical & Biotech': 'Pharmaceutique et Biotechnologie',
    'Manufacturing & Supply Chain': 'Fabrication et Chaîne d\'Approvisionnement',
    'Automotive': 'Automobile',
    'Global': 'Global'
  },
  de: {
    'Finance & Banking': 'Finanzen und Bankwesen',
    'Healthcare': 'Gesundheitswesen',
    'Cloud & SaaS': 'Cloud und SaaS',
    'E-Commerce': 'E-Commerce',
    'Telecom': 'Telekommunikation',
    'Energy & Utilities': 'Energie und Versorgungsunternehmen',
    'Retail & Consumer': 'Einzelhandel und Verbraucher',
    'Education': 'Bildung',
    'Government & Defense': 'Regierung und Verteidigung',
    'Pharmaceutical & Biotech': 'Pharma und Biotechnologie',
    'Manufacturing & Supply Chain': 'Fertigung und Lieferkette',
    'Automotive': 'Automobilindustrie',
    'Global': 'Global'
  },
  zh: {
    'Finance & Banking': '金融与银行',
    'Healthcare': '医疗保健',
    'Cloud & SaaS': '云服务与SaaS',
    'E-Commerce': '电子商务',
    'Telecom': '电信',
    'Energy & Utilities': '能源与公用事业',
    'Retail & Consumer': '零售与消费者',
    'Education': '教育',
    'Government & Defense': '政府与国防',
    'Pharmaceutical & Biotech': '制药与生物技术',
    'Manufacturing & Supply Chain': '制造与供应链',
    'Automotive': '汽车',
    'Global': '全球'
  }
};

// Function to get industry name in specific language
export const getIndustryTranslation = (industry: string, language: string = 'en'): string => {
  if (!industryTranslations[language]) {
    return industryTranslations.en[industry] || industry;
  }
  
  return industryTranslations[language][industry] || 
         industryTranslations.en[industry] || 
         industry;
};
