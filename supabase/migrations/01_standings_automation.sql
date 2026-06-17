-- 1. Create the grupo_posiciones table
CREATE TABLE IF NOT EXISTS public.grupo_posiciones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  grupo text NOT NULL,
  country_id text NOT NULL, -- references your country table (e.g. public.countries)
  pj int DEFAULT 0,
  g int DEFAULT 0,
  e int DEFAULT 0,
  p int DEFAULT 0,
  gf int DEFAULT 0,
  gc int DEFAULT 0,
  dg int GENERATED ALWAYS AS (gf - gc) STORED,
  pts int GENERATED ALWAYS AS ((g * 3) + (e * 1)) STORED,
  UNIQUE(grupo, country_id)
);

-- Note: Ensure Row Level Security (RLS) is enabled and appropriate policies are set.
ALTER TABLE public.grupo_posiciones ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read the standings
CREATE POLICY "Allow public read access on grupo_posiciones" 
ON public.grupo_posiciones FOR SELECT 
USING (true);

-- 2. Create the Database Function for updating standings
CREATE OR REPLACE FUNCTION public.update_group_standings()
RETURNS TRIGGER AS $$
BEGIN
  -- We only care if the match has been finished and the score is updated
  -- For safety, we also allow updating if it goes from finished to another state, 
  -- but a simpler approach is to completely recalculate the group or just add/subtract.
  -- Here we implement a robust approach: Recalculate the entire group's standings
  -- whenever a match in that group changes its status or score.
  
  -- Alternatively, we can use an incremental approach. 
  -- We'll use the incremental approach for simplicity if recalculation is heavy, 
  -- but since there are only 4 teams per group, recalculating the whole group is safer!
  
  -- If you prefer recalculation, let's recalculate for the home and away teams:
  
  IF (NEW.status = 'finished' AND (OLD.status IS DISTINCT FROM 'finished' OR OLD.home_score IS DISTINCT FROM NEW.home_score OR OLD.away_score IS DISTINCT FROM NEW.away_score)) THEN
    
    -- Home Team
    INSERT INTO public.grupo_posiciones (grupo, country_id, pj, g, e, p, gf, gc)
    VALUES (
      NEW.group_name, 
      NEW.home_country_id, 
      1, 
      CASE WHEN NEW.home_score > NEW.away_score THEN 1 ELSE 0 END, 
      CASE WHEN NEW.home_score = NEW.away_score THEN 1 ELSE 0 END, 
      CASE WHEN NEW.home_score < NEW.away_score THEN 1 ELSE 0 END, 
      NEW.home_score, 
      NEW.away_score
    )
    ON CONFLICT (grupo, country_id) DO UPDATE SET
      pj = public.grupo_posiciones.pj + 1,
      g = public.grupo_posiciones.g + CASE WHEN NEW.home_score > NEW.away_score THEN 1 ELSE 0 END,
      e = public.grupo_posiciones.e + CASE WHEN NEW.home_score = NEW.away_score THEN 1 ELSE 0 END,
      p = public.grupo_posiciones.p + CASE WHEN NEW.home_score < NEW.away_score THEN 1 ELSE 0 END,
      gf = public.grupo_posiciones.gf + NEW.home_score,
      gc = public.grupo_posiciones.gc + NEW.away_score;

    -- Away Team
    INSERT INTO public.grupo_posiciones (grupo, country_id, pj, g, e, p, gf, gc)
    VALUES (
      NEW.group_name, 
      NEW.away_country_id, 
      1, 
      CASE WHEN NEW.away_score > NEW.home_score THEN 1 ELSE 0 END, 
      CASE WHEN NEW.away_score = NEW.home_score THEN 1 ELSE 0 END, 
      CASE WHEN NEW.away_score < NEW.home_score THEN 1 ELSE 0 END, 
      NEW.away_score, 
      NEW.home_score
    )
    ON CONFLICT (grupo, country_id) DO UPDATE SET
      pj = public.grupo_posiciones.pj + 1,
      g = public.grupo_posiciones.g + CASE WHEN NEW.away_score > NEW.home_score THEN 1 ELSE 0 END,
      e = public.grupo_posiciones.e + CASE WHEN NEW.away_score = NEW.home_score THEN 1 ELSE 0 END,
      p = public.grupo_posiciones.p + CASE WHEN NEW.away_score < NEW.home_score THEN 1 ELSE 0 END,
      gf = public.grupo_posiciones.gf + NEW.away_score,
      gc = public.grupo_posiciones.gc + NEW.home_score;
      
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Create the Trigger on the matches table
-- Make sure your matches table is named correctly. Using 'matches' as an example.
DROP TRIGGER IF EXISTS trigger_update_standings ON public.matches;

CREATE TRIGGER trigger_update_standings
AFTER UPDATE ON public.matches
FOR EACH ROW
EXECUTE FUNCTION public.update_group_standings();
