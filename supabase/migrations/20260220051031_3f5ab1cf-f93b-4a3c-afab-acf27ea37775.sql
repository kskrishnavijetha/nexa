-- Enable realtime for subscriptions table so scan count updates instantly
ALTER PUBLICATION supabase_realtime ADD TABLE public.subscriptions;