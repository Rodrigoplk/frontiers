'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './ImagineCraftWorkshop.module.css';

const TYPE_OPTIONS = [
  'Elemento',
  'Energía',
  'Naturaleza',
  'Materia',
  'Fenómeno',
  'Tecnología',
  'Arte',
  'Concepto',
  'Historia',
  'Ser',
  'Idea',
  'Quimera',
];

const INITIAL_PALETTE = [
  { name: 'Agua', type: 'Elemento' },
  { name: 'Fuego', type: 'Elemento' },
  { name: 'Tierra', type: 'Elemento' },
  { name: 'Aire', type: 'Elemento' },
  { name: 'Luz', type: 'Energía' },
  { name: 'Sombra', type: 'Energía' },
  { name: 'Semilla', type: 'Naturaleza' },
  { name: 'Tiempo', type: 'Concepto' },
  { name: 'Metal', type: 'Materia' },
  { name: 'Melodía', type: 'Arte' },
];

const BASE_NAMES = new Set(INITIAL_PALETTE.map((item) => item.name));

function comboKey(a, b) {
  return [a, b]
    .map((value) => value.toLowerCase())
    .sort()
    .join('::');
}

const EXACT_COMBINATION_DATA = [
  {
    sources: ['Agua', 'Fuego'],
    result: {
      name: 'Vapor',
      type: 'Fenómeno',
      lore: 'La niebla cálida de una reacción elemental.',
    },
  },
  {
    sources: ['Agua', 'Aire'],
    result: {
      name: 'Niebla',
      type: 'Fenómeno',
      lore: 'Una nube baja se desliza sobre el taller.',
    },
  },
  {
    sources: ['Agua', 'Tierra'],
    result: {
      name: 'Barro',
      type: 'Materia',
      lore: 'Pasta maleable que guarda potencial artístico.',
    },
  },
  {
    sources: ['Fuego', 'Aire'],
    result: {
      name: 'Chispa',
      type: 'Energía',
      lore: 'Un destello fugaz listo para alimentar ideas.',
    },
  },
  {
    sources: ['Fuego', 'Tierra'],
    result: {
      name: 'Aleación viva',
      type: 'Tecnología',
      lore: 'Metal que aún palpita con el calor de la forja.',
    },
  },
  {
    sources: ['Tierra', 'Semilla'],
    result: {
      name: 'Bosque miniatura',
      type: 'Naturaleza',
      lore: 'Un ecosistema diminuto cobra vida sobre la mesa.',
    },
  },
  {
    sources: ['Agua', 'Semilla'],
    result: {
      name: 'Brote',
      type: 'Naturaleza',
      lore: 'Un tallo verde que busca la luz del taller.',
    },
  },
  {
    sources: ['Luz', 'Agua'],
    result: {
      name: 'Arcoíris de estudio',
      type: 'Fenómeno',
      lore: 'Colores suspendidos sobre el espacio de trabajo.',
    },
  },
  {
    sources: ['Luz', 'Sombra'],
    result: {
      name: 'Crepúsculo',
      type: 'Fenómeno',
      lore: 'Un equilibrio perfecto entre claridad y misterio.',
    },
  },
  {
    sources: ['Luz', 'Tiempo'],
    result: {
      name: 'Aurora detenida',
      type: 'Historia',
      lore: 'Un amanecer congelado en un instante eterno.',
    },
  },
  {
    sources: ['Sombra', 'Tiempo'],
    result: {
      name: 'Eco antiguo',
      type: 'Historia',
      lore: 'Susurros de épocas pasadas resuenan en la sala.',
    },
  },
  {
    sources: ['Metal', 'Fuego'],
    result: {
      name: 'Espada forjada',
      type: 'Arte',
      lore: 'Una hoja brillante recién templada.',
    },
  },
  {
    sources: ['Metal', 'Semilla'],
    result: {
      name: 'Jardín mecánico',
      type: 'Quimera',
      lore: 'Plantas de engranajes que florecen con precisión.',
    },
  },
  {
    sources: ['Melodía', 'Aire'],
    result: {
      name: 'Canción viajera',
      type: 'Arte',
      lore: 'Notas que flotan y recorren el taller.',
    },
  },
  {
    sources: ['Melodía', 'Tiempo'],
    result: {
      name: 'Sinfonía eterna',
      type: 'Concepto',
      lore: 'Un motivo musical que nunca se repite igual.',
    },
  },
  {
    sources: ['Agua', 'Metal'],
    result: {
      name: 'Óxido viviente',
      type: 'Materia',
      lore: 'El metal respira burbujas al ser bañado por corrientes puras.',
    },
  },
  {
    sources: ['Agua', 'Tiempo'],
    result: {
      name: 'Marea eterna',
      type: 'Historia',
      lore: 'Las olas guardan memoria de cada estación vivida.',
    },
  },
  {
    sources: ['Fuego', 'Luz'],
    result: {
      name: 'Aurora ígnea',
      type: 'Fenómeno',
      lore: 'Lenguas ardientes pintan el cielo del taller.',
    },
  },
  {
    sources: ['Fuego', 'Sombra'],
    result: {
      name: 'Pira crepuscular',
      type: 'Fenómeno',
      lore: 'Las llamas oscilan entre el resplandor y el misterio.',
    },
  },
  {
    sources: ['Tierra', 'Luz'],
    result: {
      name: 'Jardín luminoso',
      type: 'Naturaleza',
      lore: 'Raíces y destellos comparten un mismo pulso.',
    },
  },
  {
    sources: ['Tierra', 'Melodía'],
    result: {
      name: 'Tambor de arcilla',
      type: 'Arte',
      lore: 'Percusiones moldeadas con barro templado.',
    },
  },
  {
    sources: ['Aire', 'Luz'],
    result: {
      name: 'Brisa prisma',
      type: 'Fenómeno',
      lore: 'Corrientes que dispersan colores como un abanico.',
    },
  },
  {
    sources: ['Aire', 'Sombra'],
    result: {
      name: 'Susurro umbrío',
      type: 'Concepto',
      lore: 'El viento transmite secretos en penumbra.',
    },
  },
  {
    sources: ['Luz', 'Melodía'],
    result: {
      name: 'Ópera solar',
      type: 'Arte',
      lore: 'Una puesta en escena bañada por reflejos cálidos.',
    },
  },
  {
    sources: ['Sombra', 'Semilla'],
    result: {
      name: 'Orquídea nocturna',
      type: 'Naturaleza',
      lore: 'Florece al ritmo de la penumbra cómplice.',
    },
  },
  {
    sources: ['Sombra', 'Metal'],
    result: {
      name: 'Acero fantasma',
      type: 'Tecnología',
      lore: 'Una aleación que aparece y desaparece con la luz.',
    },
  },
  {
    sources: ['Semilla', 'Luz'],
    result: {
      name: 'Invernadero estelar',
      type: 'Naturaleza',
      lore: 'Brotan tallos que siguen constelaciones.',
    },
  },
  {
    sources: ['Tiempo', 'Metal'],
    result: {
      name: 'Reloj forjado',
      type: 'Tecnología',
      lore: 'Engranajes templados cuentan historias de siglos.',
    },
  },
  {
    sources: ['Metal', 'Melodía'],
    result: {
      name: 'Campana resonante',
      type: 'Arte',
      lore: 'Un instrumento forjado que canta al ser tocado.',
    },
  },
  {
    sources: ['Melodía', 'Agua'],
    result: {
      name: 'Coral cantor',
      type: 'Arte',
      lore: 'Armonías burbujean desde un arrecife improvisado.',
    },
  },
  {
    sources: ['Vapor', 'Metal'],
    result: {
      name: 'Turbina nebulosa',
      type: 'Tecnología',
      lore: 'Nubes cálidas impulsan un motor de precisión.',
    },
  },
  {
    sources: ['Niebla', 'Luz'],
    result: {
      name: 'Halo brumoso',
      type: 'Fenómeno',
      lore: 'Un resplandor suave envuelve la niebla flotante.',
    },
  },
  {
    sources: ['Barro', 'Fuego'],
    result: {
      name: 'Cerámica viva',
      type: 'Arte',
      lore: 'Arcilla ardiente que toma forma frente a tus ojos.',
    },
  },
  {
    sources: ['Chispa', 'Melodía'],
    result: {
      name: 'Ritmo eléctrico',
      type: 'Arte',
      lore: 'Un compás brillante chisporrotea sobre el aire.',
    },
  },
  {
    sources: ['Aleación viva', 'Melodía'],
    result: {
      name: 'Forja sinfónica',
      type: 'Tecnología',
      lore: 'Metal pulsante marca el ritmo de cada golpe musical.',
    },
  },
  {
    sources: ['Bosque miniatura', 'Luz'],
    result: {
      name: 'Bosque solar',
      type: 'Naturaleza',
      lore: 'Hojitas brillan como paneles diminutos.',
    },
  },
  {
    sources: ['Brote', 'Tiempo'],
    result: {
      name: 'Árbol crónico',
      type: 'Historia',
      lore: 'Los anillos del tronco marcan eras completas.',
    },
  },
  {
    sources: ['Arcoíris de estudio', 'Tierra'],
    result: {
      name: 'Prisma mineral',
      type: 'Arte',
      lore: 'Cristales terrenales refractan todos los colores.',
    },
  },
  {
    sources: ['Crepúsculo', 'Melodía'],
    result: {
      name: 'Balada crepuscular',
      type: 'Arte',
      lore: 'Canciones que aparecen al caer la tarde.',
    },
  },
  {
    sources: ['Aurora detenida', 'Agua'],
    result: {
      name: 'Aurora reflejada',
      type: 'Fenómeno',
      lore: 'La aurora se mira en espejos líquidos interminables.',
    },
  },
  {
    sources: ['Eco antiguo', 'Metal'],
    result: {
      name: 'Campana ancestral',
      type: 'Historia',
      lore: 'El bronce vibra con historias de antaño.',
    },
  },
  {
    sources: ['Espada forjada', 'Luz'],
    result: {
      name: 'Espada radiante',
      type: 'Tecnología',
      lore: 'La hoja absorbe claridad y corta las tinieblas.',
    },
  },
  {
    sources: ['Jardín mecánico', 'Agua'],
    result: {
      name: 'Invernadero mecánico',
      type: 'Tecnología',
      lore: 'Ruedas y tallos se riegan con precisión hidráulica.',
    },
  },
  {
    sources: ['Canción viajera', 'Sombra'],
    result: {
      name: 'Serenata de sombras',
      type: 'Arte',
      lore: 'Melodías que sólo se escuchan en penumbra.',
    },
  },
  {
    sources: ['Sinfonía eterna', 'Luz'],
    result: {
      name: 'Partitura lumínica',
      type: 'Arte',
      lore: 'Cada nota enciende destellos al desplegarse.',
    },
  },
];

const TYPE_ANCHORS = new Map([
  ['Elemento', 'Agua'],
  ['Energía', 'Luz'],
  ['Naturaleza', 'Semilla'],
  ['Materia', 'Tierra'],
  ['Fenómeno', 'Aire'],
  ['Tecnología', 'Metal'],
  ['Arte', 'Melodía'],
  ['Concepto', 'Tiempo'],
  ['Historia', 'Tiempo'],
  ['Ser', 'Tierra'],
  ['Idea', 'Tiempo'],
  ['Quimera', 'Sombra'],
]);

function buildExactCombinationMap() {
  const map = new Map();
  const catalog = new Map(INITIAL_PALETTE.map(({ name, type }) => [name, type]));

  const addCombination = (sources, result) => {
    map.set(comboKey(sources[0], sources[1]), result);
    if (!catalog.has(result.name)) {
      catalog.set(result.name, result.type);
    }
  };

  EXACT_COMBINATION_DATA.forEach(({ sources, result }) => addCombination(sources, result));

  catalog.forEach((type, name) => {
    const selfKey = comboKey(name, name);
    if (!map.has(selfKey)) {
      addCombination(
        [name, name],
        {
          name,
          type,
          lore: `La esencia de ${name} se intensifica al reflejarse en sí misma.`,
        }
      );
    }

    if (BASE_NAMES.has(name)) {
      return;
    }

    const preferredBase = TYPE_ANCHORS.get(type) || INITIAL_PALETTE[0].name;
    const baseName = BASE_NAMES.has(preferredBase) ? preferredBase : INITIAL_PALETTE[0].name;
    const baseKey = comboKey(name, baseName);

    if (!map.has(baseKey)) {
      addCombination(
        [name, baseName],
        {
          name,
          type,
          lore: `${name} absorbe matices de ${baseName.toLowerCase()} y conserva su forma original.`,
        }
      );
    }
  });

  return map;
}

const EXACT_COMBINATIONS = buildExactCombinationMap();

const TYPE_COMBINATIONS = new Map([
  [
    comboKey('Elemento', 'Naturaleza'),
    {
      name: 'Clima viviente',
      type: 'Fenómeno',
      lore: 'Los elementos moldean la vida y la vida guía a los elementos.',
    },
  ],
  [
    comboKey('Elemento', 'Energía'),
    {
      name: 'Tormenta resonante',
      type: 'Fenómeno',
      lore: 'Relámpagos que laten al ritmo de una idea.',
    },
  ],
  [
    comboKey('Naturaleza', 'Tecnología'),
    {
      name: 'Bioingeniería',
      type: 'Tecnología',
      lore: 'Circuitos que crecen como raíces entrelazadas.',
    },
  ],
  [
    comboKey('Concepto', 'Naturaleza'),
    {
      name: 'Leyenda viva',
      type: 'Historia',
      lore: 'Los mitos caminan con patas y hojas.',
    },
  ],
  [
    comboKey('Arte', 'Tecnología'),
    {
      name: 'Holograma lírico',
      type: 'Arte',
      lore: 'Esculturas de luz que bailan con la música.',
    },
  ],
  [
    comboKey('Materia', 'Energía'),
    {
      name: 'Reactor improvisado',
      type: 'Tecnología',
      lore: 'Materias primas vibran convertidas en energía utilizable.',
    },
  ],
  [
    comboKey('Concepto', 'Concepto'),
    {
      name: 'Filosofía portátil',
      type: 'Idea',
      lore: 'Un pensamiento listo para acompañarte a todas partes.',
    },
  ],
  [
    comboKey('Fenómeno', 'Tecnología'),
    {
      name: 'Sensor climático',
      type: 'Tecnología',
      lore: 'Una máquina que traduce eventos naturales en datos musicales.',
    },
  ],
  [
    comboKey('Historia', 'Concepto'),
    {
      name: 'Crónica visionaria',
      type: 'Historia',
      lore: 'Relatos que predicen futuros posibles.',
    },
  ],
  [
    comboKey('Arte', 'Naturaleza'),
    {
      name: 'Galería botánica',
      type: 'Arte',
      lore: 'Un museo vivo que florece frente a tus ojos.',
    },
  ],
]);

function titleCase(text) {
  return text
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}

function resolveCombination(entityA, entityB) {
  const exact = EXACT_COMBINATIONS.get(comboKey(entityA.name, entityB.name));
  if (exact) {
    return exact;
  }

  const typed = TYPE_COMBINATIONS.get(comboKey(entityA.type, entityB.type));
  if (typed) {
    return typed;
  }

  const typeKey = `${entityA.type} + ${entityB.type}`;
  return {
    name: `Quimera de ${entityA.type} y ${entityB.type}`,
    type: 'Quimera',
    lore: `Una creación inesperada nacida de combinar ${typeKey.toLowerCase()}.`,
  };
}

function ImagineCraftWorkshop() {
  const workspaceRef = useRef(null);
  const paletteCounterRef = useRef(0);
  const boardCounterRef = useRef(0);
  const paletteMapRef = useRef(new Map());

  const [palette, setPalette] = useState(() => {
    paletteCounterRef.current = INITIAL_PALETTE.length;
    return INITIAL_PALETTE.map((item, index) => {
      const key = item.name.toLowerCase();
      const element = {
        ...item,
        id: `palette-${index}`,
        key,
        origin: 'seed',
      };
      paletteMapRef.current.set(key, element);
      return element;
    });
  });

  const [boardElements, setBoardElements] = useState([]);
  const [nameInput, setNameInput] = useState('');
  const [typeInput, setTypeInput] = useState(TYPE_OPTIONS[0]);
  const [log, setLog] = useState([
    'Arrastra cuadros desde la barra inferior para poblar el espacio creativo.',
  ]);
  const [statusMessage, setStatusMessage] = useState('Listo para crear nuevas combinaciones.');
  const [draggingId, setDraggingId] = useState(null);
  const [selectedFusion, setSelectedFusion] = useState(null);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [touchDrag, setTouchDrag] = useState(null);

  const paletteById = useMemo(() => {
    const map = new Map();
    palette.forEach((item) => {
      map.set(item.id, item);
    });
    return map;
  }, [palette]);

  const boardById = useMemo(() => {
    const map = new Map();
    boardElements.forEach((item) => {
      map.set(item.id, item);
    });
    return map;
  }, [boardElements]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const updateLayout = () => {
      setIsDesktop(window.innerWidth >= 960);
    };
    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => {
      window.removeEventListener('resize', updateLayout);
    };
  }, []);

  useEffect(() => {
    setIsLogOpen(isDesktop);
  }, [isDesktop]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const query = window.matchMedia('(pointer: coarse)');
    const update = () => setIsTouchDevice(query.matches);
    update();
    if (typeof query.addEventListener === 'function') {
      query.addEventListener('change', update);
      return () => {
        query.removeEventListener('change', update);
      };
    }
    query.addListener(update);
    return () => {
      query.removeListener(update);
    };
  }, []);

  useEffect(() => {
    if (!isTouchDevice) {
      setTouchDrag(null);
    }
  }, [isTouchDevice]);

  useEffect(() => {
    if (!selectedFusion) return;
    const latest = boardById.get(selectedFusion.result.id);
    if (!latest) {
      setSelectedFusion(null);
    } else if (latest !== selectedFusion.result) {
      setSelectedFusion({ result: latest, components: latest.components });
    }
  }, [boardById, selectedFusion]);

  const registerPaletteElement = (name, type, origin = 'custom') => {
    const trimmed = name.trim();
    if (!trimmed) {
      return { added: false };
    }
    const formattedName = titleCase(trimmed);
    const key = formattedName.toLowerCase();
    if (paletteMapRef.current.has(key)) {
      return { added: false, element: paletteMapRef.current.get(key) };
    }

    const normalizedType = type || 'Idea';
    const element = {
      id: `palette-${paletteCounterRef.current}`,
      name: formattedName,
      type: normalizedType,
      key,
      origin,
    };
    paletteCounterRef.current += 1;
    paletteMapRef.current.set(key, element);
    setPalette((prev) => [...prev, element]);
    return { added: true, element };
  };

  const appendLog = (entry) => {
    setLog((prev) => {
      const next = [...prev, entry];
      return next.slice(-8);
    });
  };

  const handleAddElement = (event) => {
    event.preventDefault();
    if (!nameInput.trim()) {
      setStatusMessage('Necesitas escribir un nombre para crear un nuevo cuadro.');
      return;
    }
    const { added, element } = registerPaletteElement(nameInput, typeInput, 'manual');
    if (added) {
      setStatusMessage(`Nuevo cuadro disponible: ${element.name} (${element.type}).`);
      appendLog(`Has preparado ${element.name} y lo has guardado en la barra creativa.`);
    } else {
      setStatusMessage(`El cuadro ${titleCase(nameInput)} ya existe en tu biblioteca.`);
    }
    setNameInput('');
  };

  const handlePaletteDragStart = (event, element) => {
    event.dataTransfer.setData(
      'application/json',
      JSON.stringify({ source: 'palette', paletteId: element.id })
    );
    event.dataTransfer.effectAllowed = 'copy';
    setDraggingId(element.id);
  };

  const handleBoardDragStart = (event, element) => {
    event.dataTransfer.setData(
      'application/json',
      JSON.stringify({ source: 'board', boardId: element.id })
    );
    event.dataTransfer.effectAllowed = 'move';
    setDraggingId(element.id);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
  };

  const getWorkspaceCoordinates = (event) => {
    const workspace = workspaceRef.current;
    if (!workspace) {
      return { x: 0, y: 0 };
    }
    const rect = workspace.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return { x, y };
  };

  const createBoardElement = (element, coords, metadata = {}) => {
    const newElement = {
      id: `board-${boardCounterRef.current}`,
      name: element.name,
      type: element.type,
      x: coords.x,
      y: coords.y,
      ...metadata,
    };
    boardCounterRef.current += 1;
    return newElement;
  };

  const placeOnWorkspace = (element, coords, metadata) => {
    const newElement = createBoardElement(element, coords, metadata);
    setBoardElements((prev) => [...prev, newElement]);
    return newElement;
  };

  const placeElementAtCenter = (element) => {
    const workspace = workspaceRef.current;
    if (!workspace) return;
    const rect = workspace.getBoundingClientRect();
    const coords = {
      x: rect.width / 2,
      y: rect.height / 2,
    };
    placeOnWorkspace(element, coords);
    setStatusMessage(`Has colocado ${element.name} en el espacio creativo.`);
    setSelectedFusion(null);
  };

  const placePaletteElementInWorkspace = (paletteElement, coords) => {
    placeOnWorkspace(paletteElement, coords);
    setStatusMessage(`Has colocado ${paletteElement.name} en el espacio creativo.`);
    setSelectedFusion(null);
  };

  const moveBoardElementInWorkspace = (moving, coords) => {
    setBoardElements((prev) =>
      prev.map((item) =>
        item.id === moving.id
          ? {
              ...item,
              x: coords.x,
              y: coords.y,
            }
          : item
      )
    );
  };

  const combinePaletteWithBoard = (paletteElement, target, coords) => {
    const result = resolveCombination(paletteElement, target);
    const merged = createBoardElement(
      result,
      {
        x: coords.x + 24,
        y: coords.y + 24,
      },
      {
        components: [
          {
            id: paletteElement.id,
            name: paletteElement.name,
            type: paletteElement.type,
            origin: 'palette',
          },
          {
            id: target.id,
            name: target.name,
            type: target.type,
            origin: 'board',
          },
        ],
      }
    );
    setBoardElements((prev) =>
      prev.filter((item) => item.id !== target.id).concat(merged)
    );
    setSelectedFusion((prev) => {
      if (!prev) return prev;
      return prev.result?.id === target.id ? null : prev;
    });
    const { added } = registerPaletteElement(result.name, result.type, 'discovered');
    setStatusMessage(
      `✨ ${paletteElement.name} y ${target.name} dieron lugar a ${result.name}. ${
        added ? 'Se añadió a tu barra creativa.' : 'Ya formaba parte de tu biblioteca.'
      }`
    );
    appendLog(
      `${paletteElement.name} + ${target.name} → ${result.name}. ${result.lore}`
    );
  };

  const combineBoardWithBoard = (other, target, coords) => {
    const result = resolveCombination(other, target);
    const merged = createBoardElement(
      result,
      {
        x: coords.x,
        y: coords.y,
      },
      {
        components: [
          {
            id: other.id,
            name: other.name,
            type: other.type,
            origin: 'board',
          },
          {
            id: target.id,
            name: target.name,
            type: target.type,
            origin: 'board',
          },
        ],
      }
    );
    setBoardElements((prev) =>
      prev
        .filter((item) => item.id !== target.id && item.id !== other.id)
        .concat(merged)
    );
    setSelectedFusion((prev) => {
      if (!prev) return prev;
      return prev.result && (prev.result.id === target.id || prev.result.id === other.id)
        ? null
        : prev;
    });
    const { added } = registerPaletteElement(result.name, result.type, 'discovered');
    setStatusMessage(
      `✨ ${other.name} y ${target.name} se fusionaron en ${result.name}. ${
        added ? 'Nuevo cuadro desbloqueado.' : 'Lo recuperaste de tu biblioteca.'
      }`
    );
    appendLog(`${other.name} + ${target.name} → ${result.name}. ${result.lore}`);
  };

  const handleWorkspaceDrop = (event) => {
    event.preventDefault();
    const raw = event.dataTransfer.getData('application/json');
    if (!raw) return;
    let data;
    try {
      data = JSON.parse(raw);
    } catch (error) {
      return;
    }

    const coords = getWorkspaceCoordinates(event);

    if (data.source === 'palette') {
      const paletteElement = paletteById.get(data.paletteId);
      if (!paletteElement) return;
      placePaletteElementInWorkspace(paletteElement, coords);
    } else if (data.source === 'board') {
      const moving = boardById.get(data.boardId);
      if (!moving) return;
      moveBoardElementInWorkspace(moving, coords);
    }
  };

  const handleWorkspaceDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  };

  const handleElementDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'link';
  };

  const handleElementDrop = (event, targetId) => {
    event.preventDefault();
    event.stopPropagation();
    const raw = event.dataTransfer.getData('application/json');
    if (!raw) return;
    let data;
    try {
      data = JSON.parse(raw);
    } catch (error) {
      return;
    }

    const target = boardById.get(targetId);
    if (!target) return;

    const coords = getWorkspaceCoordinates(event);

    if (data.source === 'palette') {
      const paletteElement = paletteById.get(data.paletteId);
      if (!paletteElement) return;
      combinePaletteWithBoard(paletteElement, target, coords);
    } else if (data.source === 'board') {
      const other = boardById.get(data.boardId);
      if (!other || other.id === target.id) return;
      combineBoardWithBoard(other, target, coords);
    }
  };

  const finalizeTouchDrop = (drag, clientX, clientY) => {
    if (!drag.isActive) {
      return;
    }
    const workspace = workspaceRef.current;
    if (!workspace) return;
    const rect = workspace.getBoundingClientRect();
    const coords = {
      x: Math.max(0, Math.min(clientX - rect.left, rect.width)),
      y: Math.max(0, Math.min(clientY - rect.top, rect.height)),
    };

    const hitElement = document.elementFromPoint(clientX, clientY);
    const targetNode = hitElement ? hitElement.closest('[data-board-id]') : null;
    const targetId = targetNode?.getAttribute('data-board-id');

    if (targetId && targetId !== drag.element.id) {
      const target = boardById.get(targetId);
      if (!target) return;
      if (drag.origin === 'palette') {
        const paletteElement = paletteById.get(drag.element.id) || drag.element;
        if (!paletteElement) return;
        combinePaletteWithBoard(paletteElement, target, coords);
      } else if (drag.origin === 'board') {
        const moving = boardById.get(drag.element.id);
        if (!moving || moving.id === target.id) return;
        combineBoardWithBoard(moving, target, coords);
      }
      return;
    }

    const insideWorkspace =
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom;

    if (!insideWorkspace) {
      return;
    }

    if (drag.origin === 'palette') {
      const paletteElement = paletteById.get(drag.element.id) || drag.element;
      if (!paletteElement) return;
      placePaletteElementInWorkspace(paletteElement, coords);
    } else if (drag.origin === 'board') {
      const moving = boardById.get(drag.element.id);
      if (!moving) return;
      moveBoardElementInWorkspace(moving, coords);
    }
  };

  const cancelTouchDrag = () => {
    setTouchDrag(null);
  };

  const handlePalettePointerDown = (event, element) => {
    if (!isTouchDevice || event.pointerType === 'mouse') {
      return;
    }
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    setTouchDrag({
      pointerId: event.pointerId,
      origin: 'palette',
      element,
      position: { x: event.clientX, y: event.clientY },
      start: { x: event.clientX, y: event.clientY },
      isActive: false,
    });
  };

  const handleBoardPointerDown = (event, element) => {
    if (!isTouchDevice || event.pointerType === 'mouse') {
      return;
    }
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    setTouchDrag({
      pointerId: event.pointerId,
      origin: 'board',
      element,
      position: { x: event.clientX, y: event.clientY },
      start: { x: event.clientX, y: event.clientY },
      isActive: false,
    });
  };

  const handlePointerMove = (event) => {
    if (!isTouchDevice || event.pointerType === 'mouse') {
      return;
    }
    const position = { x: event.clientX, y: event.clientY };
    let shouldPrevent = false;
    setTouchDrag((prev) => {
      if (!prev || prev.pointerId !== event.pointerId) {
        return prev;
      }
      const distance = Math.hypot(position.x - prev.start.x, position.y - prev.start.y);
      const isActive = prev.isActive || distance > 16;
      if (isActive) {
        shouldPrevent = true;
      }
      return {
        ...prev,
        position,
        isActive,
      };
    });
    if (shouldPrevent) {
      event.preventDefault();
    }
  };

  const releasePointer = (event) => {
    if (typeof event.currentTarget.hasPointerCapture === 'function' &&
        event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handlePointerUp = (event) => {
    if (!isTouchDevice || event.pointerType === 'mouse') {
      return;
    }
    const drag = touchDrag;
    releasePointer(event);
    if (drag && drag.pointerId === event.pointerId) {
      finalizeTouchDrop(drag, event.clientX, event.clientY);
      cancelTouchDrag();
    }
  };

  const handlePointerCancel = (event) => {
    if (!isTouchDevice || event.pointerType === 'mouse') {
      return;
    }
    releasePointer(event);
    cancelTouchDrag();
  };

  const handlePaletteQuickPlace = (event, element) => {
    if (!isTouchDevice) return;
    if (draggingId) return;
    event.preventDefault();
    placeElementAtCenter(element);
  };

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.breadcrumb}>Widget creativo</p>
          <h1 className={styles.title}>Imagine Craft</h1>
          <p className={styles.subtitle}>
            Diseña combinaciones al estilo de un taller infinito: crea tus propios cuadros, arrástralos y
            descubre resultados sorprendentes.
          </p>
        </div>
        <div className={styles.headerActions}>
          <Link href="/" className={styles.backButton}>
            Volver a la base
          </Link>
          <div className={styles.status}>{statusMessage}</div>
        </div>
      </header>

      <form className={styles.creator} onSubmit={handleAddElement}>
        <label className={styles.creatorLabel} htmlFor="element-name">
          Crea un nuevo cuadro
        </label>
        <div className={styles.creatorRow}>
          <input
            id="element-name"
            type="text"
            placeholder="Escribe un concepto, elemento o idea"
            value={nameInput}
            onChange={(event) => setNameInput(event.target.value)}
            className={styles.input}
          />
          <select
            value={typeInput}
            onChange={(event) => setTypeInput(event.target.value)}
            className={styles.select}
          >
            {TYPE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <button type="submit" className={styles.button}>
            Añadir cuadro
          </button>
        </div>
      </form>

      {!isDesktop && (
        <button
          type="button"
          className={`${styles.logToggle} ${isLogOpen ? styles.logToggleActive : ''}`}
          onClick={() => setIsLogOpen((prev) => !prev)}
          aria-expanded={isLogOpen}
          aria-controls="workshop-log"
        >
          Bitácora de mezclas
        </button>
      )}

      <div className={styles.mainArea}>
        <div className={styles.workspaceWrapper}>
          <div
            ref={workspaceRef}
            className={styles.workspace}
            onDragOver={handleWorkspaceDragOver}
            onDrop={handleWorkspaceDrop}
          >
            {boardElements.length === 0 && (
              <p className={styles.workspaceHint}>
                Arrastra elementos desde la barra inferior o combina directamente sobre otros cuadros.
              </p>
            )}
            {boardElements.map((element) => (
              <div
                key={element.id}
                className={`${styles.token} ${
                  draggingId === element.id ? styles.tokenDragging : ''
                }`}
                style={{ left: `${element.x}px`, top: `${element.y}px` }}
                data-board-id={element.id}
                draggable
                onDragStart={(event) => handleBoardDragStart(event, element)}
                onDragEnd={handleDragEnd}
                onDrop={(event) => handleElementDrop(event, element.id)}
                onDragOver={handleElementDragOver}
                onPointerDown={(event) => handleBoardPointerDown(event, element)}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerCancel}
                onClick={() =>
                  element.components
                    ? setSelectedFusion({ result: element, components: element.components })
                    : setSelectedFusion(null)
                }
              >
                <span className={styles.tokenName}>{element.name}</span>
                <span className={styles.tokenType}>{element.type}</span>
              </div>
            ))}
          </div>
        </div>
        <aside
          id="workshop-log"
          aria-hidden={!isDesktop && !isLogOpen}
          className={`${styles.sidePanel} ${
            isDesktop
              ? ''
              : isLogOpen
              ? styles.sidePanelOverlayVisible
              : styles.sidePanelOverlayHidden
          } ${!isDesktop ? styles.sidePanelOverlay : ''}`}
        >
          <h2 className={styles.panelTitle}>Bitácora de mezclas</h2>
          {selectedFusion && (
            <div className={styles.fusionPanel}>
              <div className={styles.fusionHeader}>
                <h3 className={styles.fusionTitle}>{selectedFusion.result.name}</h3>
                <p className={styles.fusionType}>{selectedFusion.result.type}</p>
              </div>
              <p className={styles.fusionHint}>Combinación formada por:</p>
              <ul className={styles.fusionList}>
                {selectedFusion.components.map((component) => (
                  <li key={`${selectedFusion.result.id}-${component.id}`} className={styles.fusionItem}>
                    <span className={styles.fusionItemName}>{component.name}</span>
                    <span className={styles.fusionItemType}>{component.type}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <ul className={styles.logList}>
            {log.map((entry, index) => (
              <li key={`${entry}-${index}`} className={styles.logEntry}>
                {entry}
              </li>
            ))}
          </ul>
          <div className={styles.paletteSummary}>
            <p>
              Biblioteca activa: <strong>{palette.length}</strong> cuadros disponibles.
            </p>
            <p className={styles.summaryHint}>
              Cada descubrimiento exitoso se añadirá automáticamente a tu barra creativa.
            </p>
          </div>
        </aside>
      </div>

      <footer className={styles.paletteBar}>
        <div className={styles.paletteHeader}>
          <h2>Barra creativa</h2>
          <p>Arrastra cualquier cuadro para clonarlo en el espacio de trabajo.</p>
        </div>
        <div className={styles.paletteScroller}>
          {palette.map((element) => (
            <div
              key={element.id}
              className={`${styles.paletteItem} ${
                draggingId === element.id ? styles.tokenDragging : ''
              }`}
              draggable
              onDragStart={(event) => handlePaletteDragStart(event, element)}
              onDragEnd={handleDragEnd}
              onClick={(event) => handlePaletteQuickPlace(event, element)}
              onPointerDown={(event) => handlePalettePointerDown(event, element)}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerCancel}
            >
              <span className={styles.paletteName}>{element.name}</span>
              <span className={styles.paletteType}>{element.type}</span>
            </div>
          ))}
        </div>
      </footer>
      {touchDrag?.isActive && (
        <div
          className={styles.touchDragPreview}
          style={{
            left: `${touchDrag.position.x}px`,
            top: `${touchDrag.position.y}px`,
          }}
        >
          <span className={styles.touchDragName}>{touchDrag.element.name}</span>
          <span className={styles.touchDragType}>{touchDrag.element.type}</span>
        </div>
      )}
    </section>
  );
}

export default ImagineCraftWorkshop;
