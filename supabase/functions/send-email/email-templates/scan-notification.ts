
/**
 * Scan notification email template
 */
export interface ScanDetails {
  documentName: string;
  scanTime: string;
  scheduledBy: string;
  itemsScanned: number;
  violationsFound: number;
  industry?: string;
  region?: string;
}

export const createScanNotificationEmail = (email: string, name: string | undefined, scanDetails: ScanDetails) => {
  // Generate severity color based on violations found
  const severityColor = 
    scanDetails.violationsFound === 0 ? "#22c55e" : 
    scanDetails.violationsFound <= 3 ? "#f59e0b" : "#ef4444";
  
  // Get user's display name or use their email
  const displayName = name ? name.includes('@') ? name.split('@')[0] : name : '';
  
  return {
    from: "Nexabloom <scans@resend.dev>",
    to: [email],
    subject: `Automated Scan Completed: ${scanDetails.documentName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #4F46E5;">Automated Scan Completed</h1>
        <p>Hello${displayName ? ` ${displayName}` : ""},</p>
        <p>Your scheduled automated scan for <strong>${scanDetails.documentName}</strong> has completed.</p>
        
        <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h2 style="margin-top: 0; color: #0f172a;">Scan Summary</h2>
          <p><strong>Document:</strong> ${scanDetails.documentName}</p>
          <p><strong>Scan Time:</strong> ${scanDetails.scanTime}</p>
          <p><strong>Scheduled By:</strong> ${scanDetails.scheduledBy}</p>
          ${scanDetails.industry ? `<p><strong>Industry:</strong> ${scanDetails.industry}</p>` : ''}
          ${scanDetails.region ? `<p><strong>Region:</strong> ${scanDetails.region}</p>` : ''}
          <p><strong>Items Scanned:</strong> ${scanDetails.itemsScanned}</p>
          <p><strong>Violations Found:</strong> <span style="font-weight: bold; color: ${severityColor};">${scanDetails.violationsFound}</span></p>
        </div>
        
        <p>Login to your Nexabloom account to view the full scan results and take action on any compliance issues.</p>
        
        <p>Best regards,<br>The Nexabloom Team</p>
      </div>
    `,
  };
};
