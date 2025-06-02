
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { shouldUpgrade, getSubscription } from '@/utils/paymentService';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Zap, 
  Shield, 
  Plug, 
  ArrowRight, 
  CheckCircle, 
  Users, 
  BarChart3, 
  Clock,
  Star,
  Play
} from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const needsUpgrade = user ? shouldUpgrade(user.id) : false;
  const subscription = user ? getSubscription(user.id) : null;
  
  // Calculate the actual remaining scans correctly
  const scansRemaining = subscription ? 
    Math.max(0, subscription.scansLimit - subscription.scansUsed) : 0;
  
  return (
    <Layout>
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Subscription Status Banners */}
        {user && subscription && (
          <div className="bg-gray-800 border-b border-gray-700">
            <div className="container mx-auto px-4 py-3">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-3 md:mb-0">
                  <h3 className="text-lg font-semibold text-white">
                    Your {subscription.plan} plan
                  </h3>
                  <p className="text-sm text-gray-300">
                    {subscription.scansLimit === 999 ? 
                      'Unlimited scans available' : 
                      `${scansRemaining} of ${subscription.scansLimit} scans remaining this month`
                    }
                  </p>
                </div>
                {needsUpgrade && (
                  <Button 
                    onClick={() => navigate('/pricing')}
                    className="bg-violet-600 hover:bg-violet-700"
                  >
                    {subscription?.plan === 'free' ? 'Upgrade Plan' : 'Renew Subscription'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
        
        {needsUpgrade && (
          <div className="bg-amber-900/20 border-b border-amber-700/30">
            <div className="container mx-auto px-4 py-3">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-3 md:mb-0">
                  <h3 className="text-lg font-semibold text-amber-300">
                    {subscription?.plan === 'free' 
                      ? 'Your free plan is complete' 
                      : `Your ${subscription?.plan} plan limit reached`}
                  </h3>
                  <p className="text-amber-200">
                    {scansRemaining <= 0
                      ? `You've used all ${subscription?.scansLimit} scans in your ${subscription?.plan} plan.`
                      : 'Your subscription has expired.'}
                    {' '}Please upgrade to continue using NexaBloom.
                  </p>
                </div>
                <Button 
                  onClick={() => navigate('/pricing')}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  View Pricing Plans
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-green-500/10" />
          <div className="container mx-auto px-4 py-20 relative">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                AI Workspace for Engineering Teams
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Automated Sprint Insights, Compliance Reports & Jira Integration. 
                Get real-time visibility into your engineering workflow.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button 
                  size="lg" 
                  onClick={() => navigate(user ? '/dashboard' : '/sign-up')}
                  className="bg-violet-600 hover:bg-violet-700 text-lg px-8 py-6 group"
                >
                  Try Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-gray-600 text-white hover:bg-gray-800 text-lg px-8 py-6 group"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Book Demo
                </Button>
              </div>
              
              {/* Animated Dashboard Mockup */}
              <div className="relative max-w-4xl mx-auto">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-6 shadow-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4 h-64 flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-16 w-16 text-violet-500 mx-auto mb-4 animate-pulse" />
                      <p className="text-gray-400">AI-Powered Engineering Dashboard</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Benefits */}
        <section className="py-20 bg-gray-800/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Why Engineering Teams Choose NexaBloom</h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Transform your development workflow with AI-powered insights and automated compliance
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-violet-500/50 transition-all group">
                <div className="bg-gradient-to-br from-violet-600 to-violet-700 w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Real-time Sprint Health</h3>
                <p className="text-gray-300 leading-relaxed">
                  Get instant visibility into sprint progress, blocker detection, and team velocity with AI-powered analytics
                </p>
              </div>
              
              <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-green-500/50 transition-all group">
                <div className="bg-gradient-to-br from-green-600 to-green-700 w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Compliance Dashboards</h3>
                <p className="text-gray-300 leading-relaxed">
                  SOC 2, GDPR, HIPAA compliance monitoring with automated reports and audit trails
                </p>
              </div>
              
              <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-blue-500/50 transition-all group">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Plug className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Seamless Integrations</h3>
                <p className="text-gray-300 leading-relaxed">
                  Connect Jira, Slack, Notion, GitHub and more. One dashboard for your entire engineering stack
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Get Started in Minutes</h2>
              <p className="text-xl text-gray-300">Three simple steps to transform your engineering workflow</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center group">
                <div className="bg-gradient-to-br from-violet-600 to-violet-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Connect Your Tools</h3>
                <p className="text-gray-300">
                  Link Jira, Slack, GitHub and other tools in your engineering stack
                </p>
              </div>
              
              <div className="text-center group">
                <div className="bg-gradient-to-br from-green-600 to-green-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Get AI Insights</h3>
                <p className="text-gray-300">
                  Receive automated reports on sprint health, blockers, and compliance status
                </p>
              </div>
              
              <div className="text-center group">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Automate Workflows</h3>
                <p className="text-gray-300">
                  Set up automated standups, compliance checks, and team notifications
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-gray-800/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Trusted by Engineering Teams</h2>
              <p className="text-gray-300">Join hundreds of teams already using NexaBloom</p>
            </div>
            
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 text-yellow-500 fill-current" />
                ))}
              </div>
              <blockquote className="text-xl text-gray-300 mb-6">
                "NexaBloom gave us clarity on engineering health in just 1 day. Our sprint velocity improved by 40% and compliance reporting became effortless."
              </blockquote>
              <div className="text-center">
                <p className="font-semibold">Sarah Chen</p>
                <p className="text-gray-400">VP Engineering, TechCorp</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
              <p className="text-xl text-gray-300">Choose the plan that fits your team size</p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {/* Free Plan */}
              <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                <h3 className="text-xl font-semibold mb-2">Free</h3>
                <p className="text-3xl font-bold mb-4">$0<span className="text-sm text-gray-400">/month</span></p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />5 document scans</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Basic AI insights</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />GDPR compliance</li>
                </ul>
                <Button variant="outline" className="w-full" onClick={() => navigate('/sign-up')}>
                  Get Started
                </Button>
              </div>

              {/* Pro Plan */}
              <div className="bg-gray-800 rounded-2xl p-6 border border-violet-500 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-violet-600 text-white px-3 py-1 rounded-full text-sm">Most Popular</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Pro</h3>
                <p className="text-3xl font-bold mb-4">$149<span className="text-sm text-gray-400">/month</span></p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Unlimited scans</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Advanced AI insights</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />All compliance frameworks</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Slack integration</li>
                </ul>
                <Button className="w-full bg-violet-600 hover:bg-violet-700" onClick={() => navigate('/pricing')}>
                  Start Free Trial
                </Button>
              </div>

              {/* Enterprise Plan */}
              <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
                <p className="text-3xl font-bold mb-4">$599<span className="text-sm text-gray-400">/month</span></p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Everything in Pro</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Custom branding</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Priority support</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />SSO integration</li>
                </ul>
                <Button variant="outline" className="w-full" onClick={() => navigate('/pricing')}>
                  Contact Sales
                </Button>
              </div>

              {/* Lifetime Plan */}
              <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 rounded-2xl p-6 border border-yellow-500">
                <h3 className="text-xl font-semibold mb-2 text-yellow-400">Lifetime</h3>
                <p className="text-3xl font-bold mb-4">$999<span className="text-sm text-gray-400"> once</span></p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Everything in Pro</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Lifetime access</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />All future updates</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Premium support</li>
                </ul>
                <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-black" onClick={() => navigate('/pricing')}>
                  Get Lifetime Access
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-gradient-to-r from-violet-600/20 to-green-500/20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">Start your AI Engineering Workflow Today</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of engineering teams already using NexaBloom to boost productivity and ensure compliance
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate(user ? '/dashboard' : '/sign-up')}
                className="bg-violet-600 hover:bg-violet-700 text-lg px-8 py-6"
              >
                Start Free Trial
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-gray-600 text-white hover:bg-gray-800 text-lg px-8 py-6"
              >
                Schedule Demo
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
