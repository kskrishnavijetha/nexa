
import React from 'react';
import { BrandGoogle, BrandSlack, BrandMicrosoft, Video } from 'lucide-react';

const Integrations: React.FC = () => {
  const integrations = [
    {
      icon: <BrandGoogle className="h-10 w-10" />,
      title: 'Google Workspace',
      description: 'Connect to Google Docs, Drive, and other Google services to automatically scan documents for compliance issues.'
    },
    {
      icon: <BrandSlack className="h-10 w-10" />,
      title: 'Slack',
      description: 'Monitor your Slack communications and ensure they remain compliant with regulations and internal policies.'
    },
    {
      icon: <BrandMicrosoft className="h-10 w-10" />,
      title: 'Microsoft 365',
      description: 'Integrate with Microsoft services to scan documents, emails, and other content for compliance risks.'
    },
    {
      icon: <Video className="h-10 w-10" />,
      title: 'Zoom',
      description: 'Analyze Zoom meeting transcripts and recordings to identify potential compliance issues in communications.'
    }
  ];

  return (
    <section id="integrations" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Integrations</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect Nexabloom with your existing tools and platforms to seamlessly monitor compliance across all your digital assets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {integrations.map((integration, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border flex flex-col items-center text-center transition-all hover:shadow-md hover:-translate-y-1">
              <div className="mb-4 p-3 rounded-full bg-blue-50 text-blue-500">
                {integration.icon}
              </div>
              <h3 className="text-xl font-medium mb-2">{integration.title}</h3>
              <p className="text-muted-foreground">{integration.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Integrations;
