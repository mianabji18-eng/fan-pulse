-- ============================================================
-- 02_group_standings_view.sql
-- Description: Creates a VIEW to calculate group standings
-- dynamically from the matches table, replacing the trigger-based approach.
-- ============================================================

-- First, drop the old trigger and function if they exist to clean up
DROP TRIGGER IF EXISTS trigger_update_standings ON public.matches;
DROP FUNCTION IF EXISTS public.update_group_standings();

-- You might also want to drop or backup the old 'grupo_posiciones' table
-- DROP TABLE IF EXISTS public.grupo_posiciones CASCADE;

-- Create the dynamic view
CREATE OR REPLACE VIEW public.vw_group_standings AS
SELECT 
  grupo,
  country_id,
  -- Matches Played (Partidos Jugados)
  COUNT(match_id)::int AS pj,
  -- Wins (Ganados)
  SUM(CASE WHEN points = 3 THEN 1 ELSE 0 END)::int AS g,
  -- Draws (Empatados)
  SUM(CASE WHEN points = 1 THEN 1 ELSE 0 END)::int AS e,
  -- Losses (Perdidos)
  SUM(CASE WHEN points = 0 THEN 1 ELSE 0 END)::int AS p,
  -- Goals For (Goles a Favor)
  SUM(gf)::int AS gf,
  -- Goals Against (Goles en Contra)
  SUM(gc)::int AS gc,
  -- Goal Difference (Diferencia de Goles)
  SUM(gf - gc)::int AS dg,
  -- Points (Puntos)
  SUM(points)::int AS pts
FROM (
  -- 1. Home matches for each team
  SELECT 
    id AS match_id,
    phase AS grupo,
    home_country_id AS country_id,
    home_score AS gf,
    away_score AS gc,
    CASE 
      WHEN home_score > away_score THEN 3
      WHEN home_score = away_score THEN 1
      ELSE 0
    END AS points
  FROM public.matches
  WHERE status = 'finished' AND phase LIKE 'Grupo%'

  UNION ALL

  -- 2. Away matches for each team
  SELECT 
    id AS match_id,
    phase AS grupo,
    away_country_id AS country_id,
    away_score AS gf,
    home_score AS gc,
    CASE 
      WHEN away_score > home_score THEN 3
      WHEN away_score = home_score THEN 1
      ELSE 0
    END AS points
  FROM public.matches
  WHERE status = 'finished' AND phase LIKE 'Grupo%'
) AS team_results
GROUP BY grupo, country_id
ORDER BY 
  grupo ASC, 
  pts DESC, 
  dg DESC, 
  gf DESC;

-- Note: In Supabase, if you need to query this view securely using RLS, 
-- views automatically use the RLS policies of the underlying tables.
-- Since the `matches` table should have read access, the view will be readable.
