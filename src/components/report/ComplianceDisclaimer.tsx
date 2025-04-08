
import React from 'react';
import { SupportedLanguage } from '@/utils/language';

interface ComplianceDisclaimerProps {
  language?: SupportedLanguage;
  className?: string;
  compact?: boolean;
}

const ComplianceDisclaimer: React.FC<ComplianceDisclaimerProps> = ({ 
  language = 'en',
  className = '',
  compact = false
}) => {
  const getDisclaimerText = () => {
    if (compact) {
      // Shorter version for limited space areas
      switch (language) {
        case 'es': return "Aviso: Esta herramienta no sustituye el asesoramiento legal profesional.";
        case 'fr': return "Avis: Cet outil ne remplace pas les conseils juridiques professionnels.";
        case 'de': return "Hinweis: Dieses Tool ersetzt keine professionelle Rechtsberatung.";
        case 'zh': return "声明：该工具不能替代专业的法律建议。";
        default: return "Disclaimer: This tool does not replace professional legal advice.";
      }
    }
    
    // Full disclaimer text
    switch (language) {
      case 'es':
        return "AVISO LEGAL: Este informe de cumplimiento y las herramientas asociadas son solo para fines informativos. No constituye asesoramiento legal, y no debe considerarse como un sustituto de la consulta con un profesional legal calificado. Las regulaciones de cumplimiento varían según la jurisdicción y están sujetas a cambios. Es responsabilidad del usuario verificar la información y buscar asesoramiento legal adecuado para su situación específica.";
      case 'fr':
        return "AVIS JURIDIQUE: Ce rapport de conformité et les outils associés sont fournis à titre informatif uniquement. Il ne constitue pas un avis juridique et ne doit pas être considéré comme un substitut à la consultation d'un professionnel du droit qualifié. Les réglementations de conformité varient selon les juridictions et sont sujettes à modification. Il est de la responsabilité de l'utilisateur de vérifier les informations et de rechercher des conseils juridiques appropriés pour sa situation spécifique.";
      case 'de':
        return "RECHTLICHER HINWEIS: Dieser Compliance-Bericht und die zugehörigen Tools dienen nur zu Informationszwecken. Er stellt keine Rechtsberatung dar und sollte nicht als Ersatz für die Konsultation eines qualifizierten Rechtsexperten betrachtet werden. Compliance-Vorschriften variieren je nach Rechtsordnung und können sich ändern. Es liegt in der Verantwortung des Benutzers, die Informationen zu überprüfen und angemessene rechtliche Beratung für seine spezifische Situation einzuholen.";
      case 'zh':
        return "法律免责声明：本合规报告和相关工具仅供参考。它不构成法律建议，不应被视为替代咨询合格法律专业人士。合规法规因司法管辖区而异，并可能发生变化。用户有责任验证信息并为其特定情况寻求适当的法律建议。";
      default:
        return "LEGAL DISCLAIMER: This compliance report and associated tools are for informational purposes only. It does not constitute legal advice and should not be considered a substitute for consulting with a qualified legal professional. Compliance regulations vary by jurisdiction and are subject to change. It is the responsibility of the user to verify the information and seek appropriate legal counsel for their specific situation.";
    }
  };

  return (
    <div className={`text-xs text-muted-foreground mt-4 border-t pt-3 ${className}`}>
      <p>{getDisclaimerText()}</p>
    </div>
  );
};

export default ComplianceDisclaimer;
