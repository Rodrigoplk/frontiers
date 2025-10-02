'use client';

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

function comboKey(a, b) {
  return [a, b]
    .map((value) => value.toLowerCase())
    .sort()
    .join('::');
}

const EXACT_COMBINATIONS = new Map([
  [
    comboKey('Agua', 'Fuego'),
    {
      name: 'Vapor',
      type: 'Fenómeno',
      lore: 'La niebla cálida de una reacción elemental.',
    },
  ],
  [
    comboKey('Agua', 'Aire'),
    {
      name: 'Niebla',
      type: 'Fenómeno',
      lore: 'Una nube baja se desliza sobre el taller.',
    },
  ],
  [
    comboKey('Agua', 'Tierra'),
    {
      name: 'Barro',
      type: 'Materia',
      lore: 'Pasta maleable que guarda potencial artístico.',
    },
  ],
  [
    comboKey('Fuego', 'Aire'),
    {
      name: 'Chispa',
      type: 'Energía',
      lore: 'Un destello fugaz listo para alimentar ideas.',
    },
  ],
  [
    comboKey('Fuego', 'Tierra'),
    {
      name: 'Aleación viva',
      type: 'Tecnología',
      lore: 'Metal que aún palpita con el calor de la forja.',
    },
  ],
  [
    comboKey('Tierra', 'Semilla'),
    {
      name: 'Bosque miniatura',
      type: 'Naturaleza',
      lore: 'Un ecosistema diminuto cobra vida sobre la mesa.',
    },
  ],
  [
    comboKey('Agua', 'Semilla'),
    {
      name: 'Brote',
      type: 'Naturaleza',
      lore: 'Un tallo verde que busca la luz del taller.',
    },
  ],
  [
    comboKey('Luz', 'Agua'),
    {
      name: 'Arcoíris de estudio',
      type: 'Fenómeno',
      lore: 'Colores suspendidos sobre el espacio de trabajo.',
    },
  ],
  [
    comboKey('Luz', 'Sombra'),
    {
      name: 'Crepúsculo',
      type: 'Fenómeno',
      lore: 'Un equilibrio perfecto entre claridad y misterio.',
    },
  ],
  [
    comboKey('Luz', 'Tiempo'),
    {
      name: 'Aurora detenida',
      type: 'Historia',
      lore: 'Un amanecer congelado en un instante eterno.',
    },
  ],
  [
    comboKey('Sombra', 'Tiempo'),
    {
      name: 'Eco antiguo',
      type: 'Historia',
      lore: 'Susurros de épocas pasadas resuenan en la sala.',
    },
  ],
  [
    comboKey('Metal', 'Fuego'),
    {
      name: 'Espada forjada',
      type: 'Arte',
      lore: 'Una hoja brillante recién templada.',
    },
  ],
  [
    comboKey('Metal', 'Semilla'),
    {
      name: 'Jardín mecánico',
      type: 'Quimera',
      lore: 'Plantas de engranajes que florecen con precisión.',
    },
  ],
  [
    comboKey('Melodía', 'Aire'),
    {
      name: 'Canción viajera',
      type: 'Arte',
      lore: 'Notas que flotan y recorren el taller.',
    },
  ],
  [
    comboKey('Melodía', 'Tiempo'),
    {
      name: 'Sinfonía eterna',
      type: 'Concepto',
      lore: 'Un motivo musical que nunca se repite igual.',
    },
  ],
]);

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
      placeOnWorkspace(paletteElement, coords);
      setStatusMessage(`Has colocado ${paletteElement.name} en el espacio creativo.`);
    } else if (data.source === 'board') {
      const moving = boardById.get(data.boardId);
      if (!moving) return;
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
    } else if (data.source === 'board') {
      const other = boardById.get(data.boardId);
      if (!other || other.id === target.id) return;
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
    }
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
        <div className={styles.status}>{statusMessage}</div>
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
                draggable
                onDragStart={(event) => handleBoardDragStart(event, element)}
                onDragEnd={handleDragEnd}
                onDrop={(event) => handleElementDrop(event, element.id)}
                onDragOver={handleElementDragOver}
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
        <aside className={styles.sidePanel}>
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
            >
              <span className={styles.paletteName}>{element.name}</span>
              <span className={styles.paletteType}>{element.type}</span>
            </div>
          ))}
        </div>
      </footer>
    </section>
  );
}

export default ImagineCraftWorkshop;
