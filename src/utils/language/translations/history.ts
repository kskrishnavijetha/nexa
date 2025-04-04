
import { SupportedLanguage } from '../types';

export const historyTranslations: Record<string, Record<SupportedLanguage, string>> = {
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
  'delete_permanently': {
    en: 'Delete Permanently',
    es: 'Eliminar Permanentemente',
    fr: 'Supprimer Définitivement',
    de: 'Dauerhaft Löschen',
    zh: '永久删除',
  },
};
