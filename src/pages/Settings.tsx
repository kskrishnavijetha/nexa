
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Loader2, User, CreditCard, Calendar, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BrandingSettings from '@/components/settings/BrandingSettings';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { subscription, scansRemaining, loading: subLoading } = useSubscription();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  // Load profile data
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return;
      setProfileLoading(true);
      const { data } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        setFullName(data.full_name || '');
        setEmail(data.email || user.email || '');
      } else {
        setEmail(user.email || '');
        setFullName(user.user_metadata?.full_name || user.user_metadata?.name || '');
      }
      setProfileLoading(false);
    };
    loadProfile();
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user?.id) return;
    setSavingProfile(true);
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName })
      .eq('user_id', user.id);

    if (error) {
      toast.error('Failed to save profile.');
    } else {
      toast.success('Profile updated successfully!');
    }
    setSavingProfile(false);
  };

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const planColor = (plan: string) => {
    if (plan === 'enterprise' || plan === 'lifetime') return 'bg-purple-100 text-purple-800';
    if (plan === 'pro') return 'bg-blue-100 text-blue-800';
    if (plan === 'starter') return 'bg-green-100 text-green-800';
    return 'bg-muted text-muted-foreground';
  };

  const scansPercent = subscription
    ? subscription.isLifetime
      ? 100
      : Math.min(100, Math.round((subscription.scansUsed / subscription.scansLimit) * 100))
    : 0;

  return (
    <div className="container max-w-3xl py-10 space-y-8">
      <h1 className="text-3xl font-bold">Settings</h1>

      {/* ── Profile ─────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" /> Profile
          </CardTitle>
          <CardDescription>Manage your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {profileLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading profile…
            </div>
          ) : (
            <>
              <div className="space-y-1">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={email} disabled className="bg-muted cursor-not-allowed" />
                <p className="text-xs text-muted-foreground">Email cannot be changed here.</p>
              </div>
              <Button onClick={handleSaveProfile} disabled={savingProfile}>
                {savingProfile ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…</>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* ── Subscription ────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" /> Subscription
          </CardTitle>
          <CardDescription>Your current plan and usage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {subLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading subscription…
            </div>
          ) : subscription ? (
            <>
              <div className="flex flex-wrap items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${planColor(subscription.plan)}`}>
                  {subscription.plan} Plan
                </span>
                <Badge variant={subscription.active ? 'default' : 'destructive'}>
                  {subscription.active ? 'Active' : 'Inactive'}
                </Badge>
                {subscription.isLifetime && (
                  <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                    <Zap className="h-3 w-3 mr-1" /> Lifetime
                  </Badge>
                )}
              </div>

              <Separator />

              {/* Scan usage */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Zap className="h-4 w-4" /> Scan Usage
                  </span>
                  <span className="font-medium">
                    {subscription.isLifetime
                      ? 'Unlimited'
                      : `${subscription.scansUsed} / ${subscription.scansLimit} used`}
                  </span>
                </div>
                <Progress value={scansPercent} className="h-2" />
                {!subscription.isLifetime && (
                  <p className="text-xs text-muted-foreground">
                    {scansRemaining} scan{scansRemaining !== 1 ? 's' : ''} remaining this period
                  </p>
                )}
              </div>

              {/* Expiry */}
              {!subscription.isLifetime && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Renews / expires on{' '}
                  <span className="font-medium text-foreground">
                    {formatDate(subscription.expirationDate)}
                  </span>
                </div>
              )}

              <Button variant="outline" onClick={() => navigate('/pricing')}>
                {subscription.plan === 'free' ? 'Upgrade Plan' : 'Manage Plan'}
              </Button>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No subscription found.</p>
          )}
        </CardContent>
      </Card>

      {/* ── Branding ────────────────────────────────────── */}
      <BrandingSettings />
    </div>
  );
};

export default Settings;
