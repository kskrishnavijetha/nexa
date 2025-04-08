
/**
 * Compliance report email template
 */
export interface ReportDetails {
  documentName: string;
  complianceScore: number;
  risks: number;
  date: string;
  reportLink?: string;
  industry?: string;
  regulations?: string[];
}

export const createComplianceReportEmail = (email: string, name: string | undefined, reportDetails: ReportDetails) => {
  // Generate color based on compliance score
  const scoreColor = 
    reportDetails.complianceScore >= 80 ? "#22c55e" : 
    reportDetails.complianceScore >= 60 ? "#f59e0b" : "#ef4444";
  
  // Get user's display name or use their email
  const displayName = name ? name.includes('@') ? name.split('@')[0] : name : '';
  
  return {
    from: "Nexabloom <reports@resend.dev>",
    to: [email],
    subject: `Compliance Report: ${reportDetails.documentName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #4F46E5;">Compliance Report</h1>
        <p>Hello${displayName ? ` ${displayName}` : ""},</p>
        <p>Your requested compliance report for <strong>${reportDetails.documentName}</strong> is ready.</p>
        
        <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h2 style="margin-top: 0; color: #0f172a;">Report Summary</h2>
          <p><strong>Document:</strong> ${reportDetails.documentName}</p>
          <p><strong>Date Generated:</strong> ${reportDetails.date}</p>
          ${reportDetails.industry ? `<p><strong>Industry:</strong> ${reportDetails.industry}</p>` : ''}
          <p><strong>Compliance Score:</strong> <span style="font-weight: bold; color: ${scoreColor};">${reportDetails.complianceScore}%</span></p>
          <p><strong>Risks Identified:</strong> ${reportDetails.risks}</p>
          ${reportDetails.regulations ? 
            `<p><strong>Applicable Regulations:</strong> ${reportDetails.regulations.join(', ')}</p>` : 
            ''}
        </div>
        
        <p>This report contains a detailed analysis of your document's compliance status and identified risks.</p>
        
        ${reportDetails.reportLink ? 
          `<p style="margin: 20px 0;"><a href="${reportDetails.reportLink}" style="background-color: #4F46E5; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; font-weight: bold;">View Full Report</a></p>` : 
          ''}
        
        <p>For any questions regarding this report or for assistance in improving your compliance score, please contact our support team.</p>
        <p>Best regards,<br>The Nexabloom Team</p>
      </div>
    `,
  };
};
