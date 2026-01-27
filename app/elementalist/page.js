"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const timeline = [
  {
    id: "week-1",
    title: "Semana 1: Curso Sky System Secciones 2-4",
    period: { start: "2024-10-06", end: "2024-10-12" },
    summary: "Curso Sky System y aplicación del cielo básico al mapa.",
    tasks: [
      "Completar secciones de curso",
      "Aplicar cielo básico en mapa",
    ],
    completedSubtasks: 1,
  },
  {
    id: "week-2",
    title: "Semana 2: Curso Sky System Secciones 5-7 + Preparar producción de mapas",
    period: { start: "2024-10-13", end: "2024-10-19" },
    summary: "Cierre del curso y primeros preparativos de producción.",
    tasks: ["Completar curso", "Investigar uso Nanite/Lumen"],
    completedSubtasks: 0,
  },
  {
    id: "week-3",
    title: "Semana 3: Mapa Páramos",
    period: { start: "2024-10-20", end: "2024-10-26" },
    summary: "Producción inicial del mapa de Páramos.",
    tasks: ["Terminar mapa páramos", "Navegación básica", "Landmarks"],
    completedSubtasks: 0,
  },
  {
    id: "week-4",
    title: "Semana 4: Pulir mapa Páramos",
    period: { start: "2024-10-27", end: "2024-11-02" },
    summary: "Iteración en iluminación, niebla y rendimiento de Páramos.",
    tasks: ["Iluminacion variable", "Niebla", "Optimización fps"],
    completedSubtasks: 0,
  },
  {
    id: "week-5",
    title: "Semana 5: Mapa nieve",
    period: { start: "2024-11-03", end: "2024-11-09" },
    summary: "Construcción del bioma nevado.",
    tasks: ["Creación mapa nieve", "Navegación básica", "Landmarks"],
    completedSubtasks: 0,
  },
  {
    id: "week-6",
    title: "Semana 6: Pulir mapa nieve",
    period: { start: "2024-11-10", end: "2024-11-16" },
    summary: "Puesta a punto de iluminación, niebla y optimización del bioma de nieve.",
    tasks: ["Iluminacion variable", "Niebla", "Optimizacion"],
    completedSubtasks: 0,
  },
  {
    id: "week-7",
    title: "Semana 7: Pulir movimiento",
    period: { start: "2024-11-17", end: "2024-11-23" },
    summary: "Refinamiento de locomoción, stamina y cámara.",
    tasks: [
      "Aceleración movimiento segun peso",
      "Sistema stamina",
      "Animaciones movimiento (dodge, saltos)",
      "Camara seguimiento",
    ],
    completedSubtasks: 0,
  },
  {
    id: "week-8",
    title: "Semana 8: Mejorar sistema combate + Sistema de Imbuir Armas",
    period: { start: "2024-11-24", end: "2024-11-30" },
    summary: "Extensión del combate elemental.",
    tasks: [
      "Mejorar ataques basicos",
      "Introducir nuevos ataques",
      "Imbuir elementos a armas",
    ],
    completedSubtasks: 0,
  },
  {
    id: "week-9",
    title: "Semana 9: Últimos VFX y estados perjuicios/beneficios",
    period: { start: "2024-12-01", end: "2024-12-07" },
    summary: "Últimos efectos visuales y sonoros del combate.",
    tasks: [
      "VFX Tornado",
      "VFX elementos básicos",
      "Estados quemado, mojado y ralentizado",
      "SFX basicos de impacto",
    ],
    completedSubtasks: 0,
  },
  {
    id: "week-10",
    title: "Semana 10: Comportamiento enemigos mejorado y sistema quest",
    period: { start: "2024-12-08", end: "2024-12-14" },
    summary: "IA y progresión.",
    tasks: ["Bahavior tree", "Habilidad enemigo", "Sistema quest con UI", "Savegame"],
    completedSubtasks: 0,
  },
  {
    id: "week-11",
    title: "Semana 11: Misiones + OST",
    period: { start: "2024-12-15", end: "2024-12-21" },
    summary: "Diseño de misiones y ambientación musical.",
    tasks: ["Misiones tutorial", "Boss battle", "OST exploración"],
    completedSubtasks: 0,
  },
  {
    id: "week-12",
    title: "Semana 12: Pulido misiones + SFX",
    period: { start: "2024-12-22", end: "2024-12-28" },
    summary: "Afinación de misiones, jefes y sonido.",
    tasks: [
      "Ultimas misiones",
      "Ajustes finales boss",
      "OST boss",
      "Ultimos SFX",
      "Pruebas rendimiento",
    ],
    completedSubtasks: 0,
  },
  {
    id: "week-13",
    title: "Semana 13: Build y packaging",
    period: { start: "2024-12-29", end: "2025-01-04" },
    summary: "Cierre del proyecto, build y documentación.",
    tasks: [
      "Hacer build",
      "Código freeze",
      "Readme con controles y guia",
      "Pruebas en PCs distintos",
    ],
    completedSubtasks: 0,
  },
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const sessionLogs = [
  { id: "session-1", minutes: 90 },
  { id: "session-2", minutes: 30 },
  { id: "session-3", minutes: 60 },
  { id: "session-4", minutes: 90 },
  { id: "session-5", minutes: 30 },
  { id: "session-5", minutes: 60 },
];

function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours <= 0) return `${remainingMinutes} min`;
  return `${hours}h ${remainingMinutes.toString().padStart(2, "0")} min`;
}

function getNuggetSize(minutes) {
  if (minutes < 60) return "small";
  if (minutes <= 180) return "medium";
  return "large";
}

function getWeekStatus({ completionRatio, expectedRatio, isFuture, isPast }) {
  if (isFuture) return { label: "Programado", tone: "neutral" };
  if (isPast && completionRatio >= 0.999) {
    return { label: "Completado", tone: "success" };
  }
  if (isPast && completionRatio < 0.999) {
    return { label: "Pendiente", tone: "alert" };
  }

  const delta = completionRatio - expectedRatio;
  if (delta >= 0.15) return { label: "Adelantado", tone: "success" };
  if (delta <= -0.15) return { label: "Atrasado", tone: "alert" };
  return { label: "En curso", tone: "info" };
}

function formatDateRange({ start, end }) {
  const formatter = new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
  });
  return `${formatter.format(start)} – ${formatter.format(end)}`;
}

function ProgressBar({ value }) {
  return (
    <div className="progress-track">
      <div className="progress-fill" style={{ width: `${value * 100}%` }} />
    </div>
  );
}

export default function ElementalistPage() {
  const today = new Date();
  const [expandedWeeks, setExpandedWeeks] = useState(() =>
    new Set(timeline.slice(0, 2).map((week) => week.id))
  );

  const summary = useMemo(() => {
    return timeline.reduce(
      (acc, week) => {
        const totalTasks = week.tasks.length;
        const completed = Math.min(week.completedSubtasks, totalTasks);
        acc.completed += completed;
        acc.total += totalTasks;
        return acc;
      },
      { completed: 0, total: 0 }
    );
  }, []);

  const timelineWithStatus = useMemo(() => {
    return timeline.map((week) => {
      const totalTasks = week.tasks.length;
      const completed = Math.min(week.completedSubtasks, totalTasks);
      const start = new Date(week.period.start);
      const end = new Date(week.period.end);
      const isFuture = today < start;
      const isPast = today > end;
      const completionRatio = totalTasks ? completed / totalTasks : 0;
      let expectedRatio = 0;

      if (isFuture) {
        expectedRatio = 0;
      } else if (isPast) {
        expectedRatio = 1;
      } else {
        const elapsed = today.getTime() - start.getTime();
        const duration = end.getTime() - start.getTime();
        expectedRatio = duration > 0 ? clamp(elapsed / duration, 0, 1) : 0;
      }

      return {
        ...week,
        totalTasks,
        completed,
        completionRatio,
        expectedRatio,
        status: getWeekStatus({
          completionRatio,
          expectedRatio,
          isFuture,
          isPast,
        }),
        periodLabel: formatDateRange({ start, end }),
        isFuture,
        isCurrent: !isFuture && !isPast,
      };
    });
  }, [today]);

  const toggleWeek = (weekId) => {
    setExpandedWeeks((prev) => {
      const next = new Set(prev);
      if (next.has(weekId)) {
        next.delete(weekId);
      } else {
        next.add(weekId);
      }
      return next;
    });
  };

  const overallProgress = summary.total
    ? summary.completed / summary.total
    : 0;

  const currentWeek = timelineWithStatus.find((week) => week.isCurrent);

  return (
    <main className="elementalist-page">
      <div className="elementalist-backdrop" />
      <div className="elementalist-shell">
        <div className="elementalist-header-layout">
          <header className="elementalist-hero">
            <Link className="elementalist-hero__return" href="/">
              ← Volver al playground
            </Link>
            <p className="elementalist-hero__eyebrow">Proyecto Elementalist</p>
            <h1 className="elementalist-hero__title">Panel de progreso semanal</h1>
            <p className="elementalist-hero__lead">
              Un vistazo condensado al roadmap de 13 semanas del juego de mundo
              abierto creado en Unreal Engine. Supervisa el avance, detecta si
              vas a tiempo y mantén claras las prioridades de cada sprint.
            </p>
          </header>

          <aside className="elementalist-nugget-board" aria-label="Sesiones de progreso">
            <div className="nugget-board__grid" role="list">
              {sessionLogs.map((session) => {
                const size = getNuggetSize(session.minutes);
                const durationLabel = formatDuration(session.minutes);
                return (
                  <div
                    key={session.id}
                    className={`nugget nugget--${size}`}
                    title={durationLabel}
                    role="listitem"
                    aria-label={`Sesión de ${durationLabel}`}
                  />
                );
              })}
            </div>
          </aside>
        </div>

        <section className="elementalist-overview">
          <article className="overview-card overview-card--wide">
            <h2>Progreso general</h2>
            <ProgressBar value={overallProgress} />
            <div className="overview-card__stats">
              <div>
                <span className="overview-card__metric">
                  {Math.round(overallProgress * 100)}%
                </span>
                <span className="overview-card__label">Roadmap completado</span>
              </div>
              <div>
                <span className="overview-card__metric">
                  {summary.completed}/{summary.total}
                </span>
                <span className="overview-card__label">Subtareas realizadas</span>
              </div>
            </div>
          </article>

          {currentWeek ? (
            <article className="overview-card">
              <h2>Semana en curso</h2>
              <p className="overview-card__period">{currentWeek.periodLabel}</p>
              <p className="overview-card__title">{currentWeek.title}</p>
              <ProgressBar value={currentWeek.completionRatio} />
              <div className="overview-card__status">
                <span className={`status-chip status-chip--${currentWeek.status.tone}`}>
                  {currentWeek.status.label}
                </span>
                <span className="overview-card__hint">
                  {Math.round(currentWeek.completionRatio * 100)}% completado ·
                  Esperado {Math.round(currentWeek.expectedRatio * 100)}%
                </span>
              </div>
            </article>
          ) : (
            <article className="overview-card">
              <h2>Semana en curso</h2>
              <p className="overview-card__placeholder">
                Aún no comienza el roadmap o ya finalizó.
              </p>
            </article>
          )}
        </section>

        <section className="elementalist-timeline">
          <header className="timeline-header">
            <h2>Detalle semanal</h2>
            <p>
              Toca cada semana para desplegar sus subtareas. La barra lateral
              refleja cuánto has avanzado y el indicador compara tu progreso con
              lo esperado en el calendario.
            </p>
          </header>

          <div className="timeline-grid">
            {timelineWithStatus.map((week) => {
              const isExpanded = expandedWeeks.has(week.id);
              return (
                <article
                  key={week.id}
                  className={`timeline-card${week.isCurrent ? " timeline-card--current" : ""}`}
                >
                  <button
                    type="button"
                    className="timeline-card__toggle"
                    onClick={() => toggleWeek(week.id)}
                  >
                    <div className="timeline-card__header">
                      <div className="timeline-card__headline">
                        <span className="timeline-card__week">{week.title}</span>
                        <span className="timeline-card__period">{week.periodLabel}</span>
                      </div>
                      <span
                        className={`status-chip status-chip--${week.status.tone}`}
                      >
                        {week.status.label}
                      </span>
                    </div>
                    <div className="timeline-card__progress">
                      <ProgressBar value={week.completionRatio} />
                      <span>
                        {week.completed}/{week.totalTasks} subtareas
                      </span>
                    </div>
                    <span className="timeline-card__chevron" aria-hidden>
                      {isExpanded ? "−" : "+"}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="timeline-card__body">
                      <p className="timeline-card__summary">{week.summary}</p>
                      <ul className="timeline-card__tasks">
                        {week.tasks.map((task) => (
                          <li key={task}>{task}</li>
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
