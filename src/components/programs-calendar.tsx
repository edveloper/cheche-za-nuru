"use client";

import { useMemo, useState } from "react";

type ProgramEvent = {
  title: string;
  program: "education" | "healthcare" | "sports";
  date: string;
  location: string;
  summary: string;
};

type ProgramsCalendarProps = {
  events: ProgramEvent[];
};

const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

const dayFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
});

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function sameDay(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function parseEventDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function ProgramsCalendar({ events }: ProgramsCalendarProps) {
  const datedEvents = useMemo(
    () =>
      events
        .map((event) => ({
          ...event,
          parsedDate: parseEventDate(event.date),
        }))
        .sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime()),
    [events],
  );

  const initialDate = datedEvents[0]?.parsedDate ?? new Date();
  const [activeMonth, setActiveMonth] = useState(startOfMonth(initialDate));
  const [selectedDate, setSelectedDate] = useState(initialDate);

  const monthDays = useMemo(() => {
    const firstDay = startOfMonth(activeMonth);
    const leadingOffset = (firstDay.getDay() + 6) % 7;
    const calendarStart = new Date(firstDay);
    calendarStart.setDate(firstDay.getDate() - leadingOffset);

    return Array.from({ length: 35 }, (_, index) => {
      const date = new Date(calendarStart);
      date.setDate(calendarStart.getDate() + index);
      return date;
    });
  }, [activeMonth]);

  const selectedEvents = datedEvents.filter((event) => sameDay(event.parsedDate, selectedDate));

  return (
    <div className="calendar-layout">
      <div className="calendar-shell">
        <div className="calendar-toolbar">
          <button
            type="button"
            className="calendar-nav"
            onClick={() =>
              setActiveMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))
            }
          >
            Prev
          </button>
          <strong>{monthFormatter.format(activeMonth)}</strong>
          <button
            type="button"
            className="calendar-nav"
            onClick={() =>
              setActiveMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))
            }
          >
            Next
          </button>
        </div>

        <div className="calendar-weekdays">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>

        <div className="calendar-grid">
          {monthDays.map((date) => {
            const isCurrentMonth = date.getMonth() === activeMonth.getMonth();
            const isSelected = sameDay(date, selectedDate);
            const eventsForDay = datedEvents.filter((event) => sameDay(event.parsedDate, date));

            return (
              <button
                key={date.toISOString()}
                type="button"
                className={
                  isSelected
                    ? "calendar-day calendar-day-selected"
                    : isCurrentMonth
                      ? "calendar-day"
                      : "calendar-day calendar-day-muted"
                }
                onClick={() => setSelectedDate(date)}
              >
                <span>{date.getDate()}</span>
                {eventsForDay.length ? (
                  <small className={`calendar-dot calendar-dot-${eventsForDay[0].program}`} />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <aside className="calendar-agenda">
        <p className="card-label">Selected date</p>
        <h3>{dayFormatter.format(selectedDate)}</h3>
        {selectedEvents.length ? (
          <div className="calendar-events">
            {selectedEvents.map((event) => (
              <article key={`${event.title}-${event.date}`} className="calendar-event-card">
                <p className={`calendar-pill calendar-pill-${event.program}`}>{event.program}</p>
                <h4>{event.title}</h4>
                <p>{event.summary}</p>
                <span className="meta-line">{event.location}</span>
              </article>
            ))}
          </div>
        ) : (
          <div className="calendar-empty">
            <p>
              No public event is currently listed for this date. Select another day to explore
              upcoming foundation activities.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
