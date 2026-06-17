-- ============================================================
-- 02_group_standings_view.sql
-- Description: Creates a VIEW to calculate group standings
-- dynamically, doing a JOIN with the `equipos` table.
-- ============================================================

-- Drop old views/functions if they exist
DROP TRIGGER IF EXISTS trigger_update_standings ON public.matches;
DROP FUNCTION IF EXISTS public.update_group_standings();
DROP VIEW IF EXISTS public.vw_group_standings;

-- Create the dynamic view with LEFT JOIN from equipos to get ALL teams (even with 0 matches)
CREATE OR REPLACE VIEW public.vw_group_standings AS
SELECT 
  e.grupo,
  e.id AS equipo_id,
  e.nombre AS equipo_nombre,
  e.codigo_iso,
  -- Partidos Jugados (Matches Played)
  COUNT(r.match_id)::int AS pj,
  -- Ganados (Wins)
  COALESCE(SUM(CASE WHEN r.points = 3 THEN 1 ELSE 0 END), 0)::int AS g,
  -- Empatados (Draws)
  COALESCE(SUM(CASE WHEN r.points = 1 THEN 1 ELSE 0 END), 0)::int AS e,
  -- Perdidos (Losses)
  COALESCE(SUM(CASE WHEN r.points = 0 THEN 1 ELSE 0 END), 0)::int AS p,
  -- Goles a Favor (Goals For)
  COALESCE(SUM(r.gf), 0)::int AS gf,
  -- Goles en Contra (Goals Against)
  COALESCE(SUM(r.gc), 0)::int AS gc,
  -- Diferencia de Goles (Goal Difference)
  COALESCE(SUM(r.gf - r.gc), 0)::int AS dg,
  -- Puntos (Points)
  COALESCE(SUM(r.points), 0)::int AS pts
FROM public.equipos e
LEFT JOIN (
  -- 1. Partidos como Local
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

  -- 2. Partidos como Visitante
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
) AS r ON e.id = r.country_id AND e.grupo = r.grupo
GROUP BY e.grupo, e.id, e.nombre, e.codigo_iso
ORDER BY 
  e.grupo ASC, 
  pts DESC, 
  dg DESC, 
  gf DESC;
