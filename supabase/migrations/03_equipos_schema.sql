-- ============================================================
-- 03_equipos_schema.sql
-- Description: Creates the `equipos` table and enforces
-- referential integrity on the `matches` table.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.equipos (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  codigo_iso TEXT,
  grupo TEXT NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.equipos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on equipos" 
ON public.equipos FOR SELECT 
USING (true);

-- Insertar los equipos iniciales (Anfitriones y clasificados)
INSERT INTO public.equipos (id, nombre, codigo_iso, grupo) VALUES
-- GRUPO A
('mex', 'México', 'MEX', 'Grupo A'),
('rsa', 'Sudáfrica', 'RSA', 'Grupo A'),
('kor', 'Corea', 'KOR', 'Grupo A'),
('cze', 'Chequia', 'CZE', 'Grupo A'),

-- GRUPO B
('can', 'Canadá', 'CAN', 'Grupo B'),
('bih', 'Bosnia', 'BIH', 'Grupo B'),
('qat', 'Qatar', 'QAT', 'Grupo B'),
('sui', 'Suiza', 'SUI', 'Grupo B'),

-- GRUPO C
('bra', 'Brasil', 'BRA', 'Grupo C'),
('mar', 'Marruecos', 'MAR', 'Grupo C'),
('hai', 'Haití', 'HAI', 'Grupo C'),
('sco', 'Escocia', 'SCO', 'Grupo C'),

-- GRUPO D
('usa', 'EE.UU.', 'USA', 'Grupo D'),
('par', 'Paraguay', 'PAR', 'Grupo D'),
('aus', 'Australia', 'AUS', 'Grupo D'),
('tur', 'Turquía', 'TUR', 'Grupo D'),

-- GRUPO E
('ger', 'Alemania', 'GER', 'Grupo E'),
('cuw', 'Curazao', 'CUW', 'Grupo E'),
('civ', 'C. de Marfil', 'CIV', 'Grupo E'),
('ecu', 'Ecuador', 'ECU', 'Grupo E'),

-- GRUPO F
('ned', 'Países Bajos', 'NED', 'Grupo F'),
('jpn', 'Japón', 'JPN', 'Grupo F'),
('swe', 'Suecia', 'SWE', 'Grupo F'),
('tun', 'Túnez', 'TUN', 'Grupo F'),

-- GRUPO G
('bel', 'Bélgica', 'BEL', 'Grupo G'),
('egy', 'Egipto', 'EGY', 'Grupo G'),
('irn', 'Irán', 'IRN', 'Grupo G'),
('nzl', 'N. Zelanda', 'NZL', 'Grupo G'),

-- GRUPO H
('esp', 'España', 'ESP', 'Grupo H'),
('cpv', 'Cabo Verde', 'CPV', 'Grupo H'),
('sau', 'Arabia S.', 'SAU', 'Grupo H'),
('uru', 'Uruguay', 'URU', 'Grupo H'),

-- GRUPO I
('fra', 'Francia', 'FRA', 'Grupo I'),
('sen', 'Senegal', 'SEN', 'Grupo I'),
('irq', 'Irak', 'IRQ', 'Grupo I'),
('nor', 'Noruega', 'NOR', 'Grupo I'),

-- GRUPO J
('arg', 'Argentina', 'ARG', 'Grupo J'),
('alg', 'Argelia', 'ALG', 'Grupo J'),
('aut', 'Austria', 'AUT', 'Grupo J'),
('jor', 'Jordania', 'JOR', 'Grupo J'),

-- GRUPO K
('por', 'Portugal', 'POR', 'Grupo K'),
('cod', 'RD Congo', 'COD', 'Grupo K'),
('uzb', 'Uzbekistán', 'UZB', 'Grupo K'),
('col', 'Colombia', 'COL', 'Grupo K'),

-- GRUPO L
('eng', 'Inglaterra', 'ENG', 'Grupo L'),
('cro', 'Croacia', 'CRO', 'Grupo L'),
('gha', 'Ghana', 'GHA', 'Grupo L'),
('pan', 'Panamá', 'PAN', 'Grupo L')
ON CONFLICT (id) DO UPDATE SET 
  nombre = EXCLUDED.nombre,
  codigo_iso = EXCLUDED.codigo_iso,
  grupo = EXCLUDED.grupo;

-- Agregar constraints de llaves foráneas a la tabla de partidos
ALTER TABLE public.matches
  ADD CONSTRAINT fk_matches_home_team FOREIGN KEY (home_country_id) REFERENCES public.equipos(id),
  ADD CONSTRAINT fk_matches_away_team FOREIGN KEY (away_country_id) REFERENCES public.equipos(id);
