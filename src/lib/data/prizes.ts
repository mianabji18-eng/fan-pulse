export interface Prize {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  image: string;
  type: 'digital' | 'physical' | 'ticket';
  stock: number;
}

export const PRIZES: Prize[] = [
  {
    id: 'p1',
    name: 'Fondo de Pantalla Exclusivo',
    description: 'Descarga un fondo de pantalla oficial del Mundial 2026 para tu teléfono.',
    pointsCost: 50,
    image: '📱',
    type: 'digital',
    stock: 9999,
  },
  {
    id: 'p2',
    name: 'Insignia de "Súper Fan"',
    description: 'Destaca en la tabla de posiciones con un marco especial en tu avatar.',
    pointsCost: 150,
    image: '✨',
    type: 'digital',
    stock: 9999,
  },
  {
    id: 'p3',
    name: 'Bufanda Oficial FIFA 2026',
    description: 'Bufanda conmemorativa del Mundial. Envío internacional incluido.',
    pointsCost: 500,
    image: '🧣',
    type: 'physical',
    stock: 50,
  },
  {
    id: 'p4',
    name: 'Camiseta de tu Selección',
    description: 'Camiseta oficial de la selección que elegiste al registrarte.',
    pointsCost: 1200,
    image: '👕',
    type: 'physical',
    stock: 20,
  },
  {
    id: 'p5',
    name: 'Entrada: Partido Fase de Grupos',
    description: 'Entrada doble para un partido de la fase de grupos.',
    pointsCost: 3500,
    image: '🎫',
    type: 'ticket',
    stock: 5,
  },
  {
    id: 'p6',
    name: 'VIP Experience: La Gran Final',
    description: 'Entrada VIP a la final en el MetLife Stadium con acceso a hospitalidad.',
    pointsCost: 10000,
    image: '🏆',
    type: 'ticket',
    stock: 1,
  }
];
