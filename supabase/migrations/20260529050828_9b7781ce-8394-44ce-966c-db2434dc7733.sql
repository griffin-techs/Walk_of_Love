CREATE TABLE public.sheila_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mood TEXT NOT NULL,
  word TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.sheila_replies TO anon, authenticated;
GRANT ALL ON public.sheila_replies TO service_role;

ALTER TABLE public.sheila_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can insert reply"
  ON public.sheila_replies FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(mood) <= 16
    AND char_length(word) > 0
    AND char_length(word) <= 60
  );

CREATE POLICY "anyone can read replies"
  ON public.sheila_replies FOR SELECT
  TO anon, authenticated
  USING (true);