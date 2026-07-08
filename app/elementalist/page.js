"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const roadmapStart = "2026-07-08";
const roadmapEnd = "2026-12-31";
const dailyFocusHours = 3.25;

const roadmapItems = [
  {
    id: "sky-system",
    phase: "Base visual",
    title: "Curso Sky System completo",
    period: { start: "2026-07-08", end: "2026-07-08" },
    estimateHours: 0,
    priority: "Cerrado",
    type: "Aprendizaje",
    status: "done",
    summary: "Curso liquidado y listo para convertirlo en criterio visual del resto del proyecto.",
    tasks: [
      { label: "Secciones 2-7 completadas", done: true },
      { label: "Notas aplicables a atmósfera, nubes y lighting", done: true },
      { label: "Decidir preset base para mapas principales", done: true },
    ],
  },
  {
    id: "paramos-map",
    phase: "Mundo",
    title: "Mapa de Páramos resuelto",
    period: { start: "2026-07-08", end: "2026-07-08" },
    estimateHours: 0,
    priority: "Cerrado",
    type: "Mapa",
    status: "done",
    summary: "Se marca como terminado para no arrastrar deuda falsa en el roadmap.",
    tasks: [
      { label: "Layout jugable", done: true },
      { label: "Navegación básica", done: true },
      { label: "Landmarks principales", done: true },
    ],
  },
  {
    id: "movement-polish",
    phase: "Gameplay core",
    title: "Pulir movimiento y sensación del personaje",
    period: { start: "2026-07-08", end: "2026-07-26" },
    estimateHours: 48,
    priority: "Crítico",
    type: "Gameplay",
    status: "active",
    summary: "Primero la base jugable: input, peso, cámara, stamina y animaciones deben sentirse bien antes de producir más contenido.",
    tasks: [
      { label: "Curvas de aceleración por peso/equipo", done: false },
      { label: "Stamina, agotamiento y recuperación legibles", done: false },
      { label: "Dodge, salto y aterrizaje con ventanas consistentes", done: false },
      { label: "Cámara con seguimiento, colisión y suavizado", done: false },
      { label: "Checklist de feel en mando y teclado", done: false },
    ],
  },
  {
    id: "combat-imbue",
    phase: "Combate",
    title: "Combate mejorado + imbuir armas",
    period: { start: "2026-07-27", end: "2026-08-23" },
    estimateHours: 72,
    priority: "Crítico",
    type: "Sistema",
    status: "planned",
    summary: "Crear un loop de combate expresivo que justifique los elementos y conecte con progresión.",
    tasks: [
      { label: "Ataques básicos con cancelaciones controladas", done: false },
      { label: "Nuevos ataques por estilo/arma", done: false },
      { label: "Imbuir fuego, agua, viento y tierra", done: false },
      { label: "Feedback de impacto: hitstop, cámara, SFX y VFX", done: false },
      { label: "Tabla de daño y coste elemental", done: false },
    ],
  },
  {
    id: "vfx-status",
    phase: "Combate",
    title: "VFX finales y estados alterados",
    period: { start: "2026-08-24", end: "2026-09-13" },
    estimateHours: 54,
    priority: "Alta",
    type: "VFX/SFX",
    status: "planned",
    summary: "Hacer que cada estado sea reconocible incluso en combate caótico.",
    tasks: [
      { label: "VFX Tornado listo para gameplay", done: false },
      { label: "VFX elementos básicos normalizados", done: false },
      { label: "Quemado, mojado, ralentizado y vulnerable", done: false },
      { label: "SFX de impacto por elemento", done: false },
    ],
  },
  {
    id: "enemy-quests",
    phase: "Progresión",
    title: "IA enemiga + sistema de quests",
    period: { start: "2026-09-14", end: "2026-10-18" },
    estimateHours: 92,
    priority: "Crítico",
    type: "Sistema",
    status: "planned",
    summary: "Un bloque grande: behavior trees, habilidades, objetivos, UI y guardado deben cerrar juntos.",
    tasks: [
      { label: "Behavior tree con patrulla, persecución y retirada", done: false },
      { label: "Habilidad enemiga prototipo + cooldown", done: false },
      { label: "Quest log con estados y recompensas", done: false },
      { label: "UI de seguimiento en HUD", done: false },
      { label: "Savegame de progreso, inventario y quests", done: false },
    ],
  },
  {
    id: "missions-ost",
    phase: "Contenido",
    title: "Misiones jugables + OST",
    period: { start: "2026-10-19", end: "2026-11-15" },
    estimateHours: 74,
    priority: "Alta",
    type: "Contenido",
    status: "planned",
    summary: "Convertir sistemas en experiencia: tutorial, misión principal, boss y música de exploración.",
    tasks: [
      { label: "Misiones tutorial sin texto excesivo", done: false },
      { label: "Cadena de objetivos principal", done: false },
      { label: "Boss battle con fases", done: false },
      { label: "OST exploración en loop limpio", done: false },
    ],
  },
  {
    id: "qa-polish",
    phase: "Cierre",
    title: "Pulido final, rendimiento y SFX",
    period: { start: "2026-11-16", end: "2026-12-13" },
    estimateHours: 70,
    priority: "Crítico",
    type: "QA",
    status: "planned",
    summary: "Reservar casi un mes para estabilizar: bugs, balance, rendimiento, sonido y claridad visual.",
    tasks: [
      { label: "Bug bash semanal con lista priorizada", done: false },
      { label: "Ajustes finales del boss", done: false },
      { label: "OST boss + últimos SFX", done: false },
      { label: "Pruebas de rendimiento por mapa", done: false },
      { label: "Pases de UX: controles, prompts y legibilidad", done: false },
    ],
  },
  {
    id: "build-packaging",
    phase: "Entrega",
    title: "Build, packaging y documentación",
    period: { start: "2026-12-14", end: "2026-12-31" },
    estimateHours: 44,
    priority: "Crítico",
    type: "Release",
    status: "planned",
    summary: "Congelar alcance, generar builds repetibles y dejar una guía clara para probar el proyecto.",
    tasks: [
      { label: "Código freeze y rama candidata", done: false },
      { label: "Build empaquetada", done: false },
      { label: "README con controles y guía", done: false },
      { label: "Pruebas en PCs distintos", done: false },
    ],
  },
  {
    id: "snow-map",
    phase: "Aplazado",
    title: "Mapa de nieve",
    period: { start: "2027-01-12", end: "2027-02-08" },
    estimateHours: 76,
    priority: "Backlog",
    type: "Mapa",
    status: "deferred",
    summary: "Aplazado conscientemente para proteger el core loop y no abrir otro bioma antes del cierre.",
    tasks: [
      { label: "Blockout del bioma nevado", done: false },
      { label: "Navegación y landmarks", done: false },
      { label: "Iluminación, niebla y optimización", done: false },
    ],
  },
  {
    id: "map-polish-pass",
    phase: "Aplazado",
    title: "Pulido extra de mapas",
    period: { start: "2027-02-09", end: "2027-03-01" },
    estimateHours: 52,
    priority: "Backlog",
    type: "Mapa",
    status: "deferred",
    summary: "Pase cosmético posterior: solo entrará si el juego ya está completo y estable.",
    tasks: [
      { label: "Decoración secundaria", done: false },
      { label: "Variantes de iluminación por zona", done: false },
      { label: "Optimización fina no bloqueante", done: false },
    ],
  },
];

const sessionLogs = Array.from({ length: 10 }, (_, index) => ({
  id: `gold-nugget-${index + 1}`,
  minutes: 90,
  label: `Pepita ${index + 1}`,
}));

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function parseDate(date) {
  return new Date(`${date}T12:00:00Z`);
}

function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours <= 0) return `${remainingMinutes} min`;
  if (remainingMinutes === 0) return `${hours}h`;
  return `${hours}h ${remainingMinutes.toString().padStart(2, "0")} min`;
}

function formatDateRange({ start, end }) {
  const formatter = new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return `${formatter.format(start)} – ${formatter.format(end)}`;
}

function getItemStatus(item, today) {
  if (item.status === "done") return { label: "Resuelto", tone: "success" };
  if (item.status === "deferred") return { label: "Aplazado", tone: "deferred" };

  const start = parseDate(item.period.start);
  const end = parseDate(item.period.end);
  if (today < start) return { label: "Programado", tone: "neutral" };
  if (today > end) return { label: "Revisar", tone: "alert" };
  return { label: "En foco", tone: "info" };
}

function ProgressBar({ value, variant = "default" }) {
  return (
    <div className={`progress-track progress-track--${variant}`}>
      <div className="progress-fill" style={{ width: `${clamp(value, 0, 1) * 100}%` }} />
    </div>
  );
}

export default function ElementalistPage() {
  const today = parseDate(new Date().toISOString().slice(0, 10));
  const [expandedItems, setExpandedItems] = useState(() =>
    new Set(["movement-polish", "combat-imbue", "snow-map"])
  );

  const enrichedItems = useMemo(() => {
    return roadmapItems.map((item) => {
      const completedTasks = item.tasks.filter((task) => task.done).length;
      const totalTasks = item.tasks.length;
      const completionRatio = totalTasks ? completedTasks / totalTasks : item.status === "done" ? 1 : 0;
      const start = parseDate(item.period.start);
      const end = parseDate(item.period.end);
      const duration = end.getTime() - start.getTime();
      const elapsed = today.getTime() - start.getTime();
      const calendarRatio = item.status === "done" ? 1 : duration > 0 ? clamp(elapsed / duration, 0, 1) : 0;

      return {
        ...item,
        completedTasks,
        totalTasks,
        completionRatio,
        calendarRatio,
        statusInfo: getItemStatus(item, today),
        periodLabel: formatDateRange({ start, end }),
      };
    });
  }, [today]);

  const activeItems = enrichedItems.filter((item) => item.status !== "deferred");
  const deferredItems = enrichedItems.filter((item) => item.status === "deferred");
  const totalEstimatedHours = activeItems.reduce((sum, item) => sum + item.estimateHours, 0);
  const doneEstimatedHours = activeItems.reduce(
    (sum, item) => sum + item.estimateHours * item.completionRatio,
    0
  );
  const totalTasks = activeItems.reduce((sum, item) => sum + item.totalTasks, 0);
  const doneTasks = activeItems.reduce((sum, item) => sum + item.completedTasks, 0);
  const nuggetMinutes = sessionLogs.reduce((sum, session) => sum + session.minutes, 0);
  const projectStart = parseDate(roadmapStart);
  const projectEnd = parseDate(roadmapEnd);
  const daysLeft = Math.max(0, Math.ceil((projectEnd.getTime() - today.getTime()) / 86400000));
  const calendarProgress = clamp((today.getTime() - projectStart.getTime()) / (projectEnd.getTime() - projectStart.getTime()), 0, 1);
  const remainingHours = Math.max(0, Math.round(totalEstimatedHours - doneEstimatedHours));
  const weeklyPace = daysLeft ? ((remainingHours / daysLeft) * 7).toFixed(1) : "0.0";
  const focusCapacity = Math.round((daysLeft * dailyFocusHours) / 5) * 5;
  const currentItem = activeItems.find((item) => item.statusInfo.tone === "info") ?? activeItems.find((item) => item.status === "planned");

  const toggleItem = (itemId) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  };

  return (
    <main className="elementalist-page">
      <div className="elementalist-backdrop" />
      <div className="elementalist-shell">
        <div className="elementalist-header-layout">
          <header className="elementalist-hero glass-panel">
            <Link className="elementalist-hero__return" href="/">
              ← Volver al playground
            </Link>
            <p className="elementalist-hero__eyebrow">Proyecto Elementalist · Roadmap vivo</p>
            <h1 className="elementalist-hero__title">Panel de progreso semanal</h1>
            <p className="elementalist-hero__lead">
              Rediseñado a ancho completo: ahora separa progreso real, presión de calendario, horas estimadas, sesiones registradas y trabajos aplazados para cerrar el proyecto antes del 31 de diciembre de 2026.
            </p>
          </header>

          <aside className="elementalist-nugget-board glass-panel" aria-label="Pepitas de oro de progreso">
            <div className="nugget-board__header">
              <span>10 pepitas de oro</span>
              <strong>{formatDuration(nuggetMinutes)} registradas</strong>
            </div>
            <div className="nugget-board__grid" role="list">
              {sessionLogs.map((session) => (
                <div
                  key={session.id}
                  className="nugget nugget--medium"
                  title={`${session.label}: ${formatDuration(session.minutes)}`}
                  role="listitem"
                  aria-label={`${session.label} de ${formatDuration(session.minutes)}`}
                />
              ))}
            </div>
          </aside>
        </div>

        <section className="elementalist-command-grid" aria-label="Indicadores principales">
          <article className="overview-card overview-card--hero glass-panel">
            <h2>Progreso general</h2>
            <span className="overview-card__metric">{Math.round((doneEstimatedHours / totalEstimatedHours) * 100)}%</span>
            <ProgressBar value={doneEstimatedHours / totalEstimatedHours} variant="glow" />
            <p className="overview-card__hint">{Math.round(doneEstimatedHours)}/{totalEstimatedHours} h estimadas completadas · {doneTasks}/{totalTasks} subtareas cerradas</p>
          </article>
          <article className="overview-card glass-panel">
            <h2>Calendario</h2>
            <span className="overview-card__metric">{daysLeft}</span>
            <span className="overview-card__label">días hasta el 31 dic 2026</span>
            <ProgressBar value={calendarProgress} />
          </article>
          <article className="overview-card glass-panel">
            <h2>Ritmo necesario</h2>
            <span className="overview-card__metric">{weeklyPace}h</span>
            <span className="overview-card__label">por semana aprox.</span>
            <p className="overview-card__hint">Capacidad opinada: ~{focusCapacity} h útiles si sostienes {dailyFocusHours} h/día laborable.</p>
          </article>
          <article className="overview-card glass-panel">
            <h2>Foco actual</h2>
            <p className="overview-card__title">{currentItem?.title}</p>
            <span className="status-chip status-chip--info">Siguiente decisión</span>
            <p className="overview-card__hint">No abrir mapa de nieve ni pulidos extra hasta estabilizar movimiento, combate y quests.</p>
          </article>
        </section>

        <section className="elementalist-lanes">
          <article className="glass-panel lane-card">
            <h2>Trackeos añadidos</h2>
            <div className="tracking-grid">
              <div><strong>{activeItems.length}</strong><span>bloques activos</span></div>
              <div><strong>{deferredItems.length}</strong><span>trabajos aplazados</span></div>
              <div><strong>{remainingHours}h</strong><span>trabajo pendiente</span></div>
              <div><strong>{sessionLogs.length}</strong><span>sesiones de 1h30</span></div>
            </div>
          </article>
          <article className="glass-panel lane-card lane-card--advice">
            <h2>Criterio de planificación</h2>
            <p>
              He comprimido el alcance hacia sistemas que desbloquean diversión y he movido contenido caro pero no esencial al backlog. El riesgo real está en IA/quests/savegame, por eso tiene más colchón que VFX o packaging.
            </p>
          </article>
        </section>

        <section className="elementalist-timeline">
          <header className="timeline-header">
            <h2>Roadmap hasta cierre</h2>
            <p>Abre cada bloque para ver tareas, estimación y presión de calendario. Los elementos aplazados quedan visibles, pero fuera del progreso principal.</p>
          </header>

          <div className="timeline-grid timeline-grid--cards">
            {enrichedItems.map((item) => {
              const isExpanded = expandedItems.has(item.id);
              return (
                <article key={item.id} className={`timeline-card timeline-card--${item.statusInfo.tone}`}>
                  <button type="button" className="timeline-card__toggle" onClick={() => toggleItem(item.id)}>
                    <div className="timeline-card__header">
                      <div className="timeline-card__headline">
                        <span className="timeline-card__phase">{item.phase} · {item.type}</span>
                        <span className="timeline-card__week">{item.title}</span>
                        <span className="timeline-card__period">{item.periodLabel}</span>
                      </div>
                      <span className={`status-chip status-chip--${item.statusInfo.tone}`}>{item.statusInfo.label}</span>
                    </div>
                    <div className="timeline-card__progress">
                      <ProgressBar value={item.completionRatio} />
                      <span>{item.completedTasks}/{item.totalTasks} tareas · {item.estimateHours}h · prioridad {item.priority}</span>
                    </div>
                    <span className="timeline-card__chevron" aria-hidden>{isExpanded ? "−" : "+"}</span>
                  </button>

                  {isExpanded && (
                    <div className="timeline-card__body">
                      <p className="timeline-card__summary">{item.summary}</p>
                      <div className="timeline-card__meta">
                        <span>Avance tareas: {Math.round(item.completionRatio * 100)}%</span>
                        <span>Calendario interno: {Math.round(item.calendarRatio * 100)}%</span>
                      </div>
                      <ul className="timeline-card__tasks">
                        {item.tasks.map((task) => (
                          <li key={task.label} className={task.done ? "task-done" : ""}>{task.done ? "✓" : "○"} {task.label}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
