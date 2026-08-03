// src/components/feed/DateSelector.jsx
// Segmented pill control: Yesterday | TODAY | Tomorrow
// + calendar icon that opens a month-grid date picker popover.

import { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import './DateSelector.css';

const OPTIONS = [
  { label: 'Yesterday', value: 'yesterday' },
  { label: 'TODAY',     value: 'today' },
  { label: 'Tomorrow',  value: 'tomorrow' },
];

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

// Returns a Date at midnight local time for a given y/m/d
function localDate(y, m, d) {
  return new Date(y, m, d);
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth()    === b.getMonth()    &&
         a.getDate()     === b.getDate();
}

// Convert a calendar-picked Date to the tab value (yesterday/today/tomorrow)
// or null if it doesn't match any shortcut.
function dateToTabValue(date) {
  const today    = new Date(); today.setHours(0,0,0,0);
  const yest     = new Date(today); yest.setDate(today.getDate() - 1);
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  if (isSameDay(date, today))    return 'today';
  if (isSameDay(date, yest))     return 'yesterday';
  if (isSameDay(date, tomorrow)) return 'tomorrow';
  return null;
}

// Build the grid of day cells for a given year/month.
// Returns array of {day, date} or null (empty cell) with length % 7 === 0.
function buildCalendarGrid(year, month) {
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(localDate(year, month, d));
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function CalendarPopover({ onSelectDate, selectedDate, onClose }) {
  const today   = new Date(); today.setHours(0,0,0,0);
  const [viewYear,  setViewYear]  = useState(selectedDate ? selectedDate.getFullYear()  : today.getFullYear());
  const [viewMonth, setViewMonth] = useState(selectedDate ? selectedDate.getMonth()     : today.getMonth());

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const cells = buildCalendarGrid(viewYear, viewMonth);

  return (
    <div className="date-selector__popover" role="dialog" aria-label="Date picker">
      {/* Month navigation */}
      <div className="cal__nav">
        <button className="cal__nav-btn" onClick={prevMonth} aria-label="Previous month">
          <ChevronLeft size={14} strokeWidth={2} />
        </button>
        <span className="cal__month-label">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button className="cal__nav-btn" onClick={nextMonth} aria-label="Next month">
          <ChevronRight size={14} strokeWidth={2} />
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="cal__dow-row">
        {DAYS_OF_WEEK.map(d => (
          <div key={d} className="cal__dow">{d}</div>
        ))}
      </div>

      {/* Day grid */}
      <div className="cal__grid">
        {cells.map((date, i) => {
          if (!date) return <div key={`e-${i}`} className="cal__day cal__day--empty" />;
          const isToday    = isSameDay(date, today);
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          let cls = 'cal__day';
          if (isSelected) cls += ' cal__day--selected';
          else if (isToday) cls += ' cal__day--today';
          return (
            <button
              key={date.toISOString()}
              className={cls}
              onClick={() => { onSelectDate(date); onClose(); }}
              aria-label={date.toLocaleDateString()}
              aria-pressed={!!isSelected}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function DateSelector({ selected = 'today', onChange }) {
  const [calOpen,      setCalOpen]      = useState(false);
  // calDate: the actual Date object when user picks from calendar
  // null means they're using a shortcut tab (yesterday/today/tomorrow)
  const [calDate,      setCalDate]      = useState(null);
  const wrapperRef = useRef(null);

  // Close popover on outside click
  useEffect(() => {
    if (!calOpen) return;
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setCalOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [calOpen]);

  // Close on Escape
  useEffect(() => {
    if (!calOpen) return;
    const handler = (e) => { if (e.key === 'Escape') setCalOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [calOpen]);

  function handleTabChange(value) {
    setCalDate(null);      // clear custom calendar selection
    onChange?.(value);
  }

  function handleCalendarSelect(date) {
    setCalDate(date);
    const tabValue = dateToTabValue(date);
    if (tabValue) {
      // Matches a shortcut — activate that tab
      onChange?.(tabValue);
    } else {
      // Custom date — pass the ISO date string to parent
      onChange?.(date.toISOString().slice(0, 10));
    }
  }

  // Determine the selected Date for the popover highlight
  const selectedDateObj = (() => {
    if (calDate) return calDate;
    const today = new Date(); today.setHours(0,0,0,0);
    if (selected === 'today')     return today;
    if (selected === 'yesterday') { const d = new Date(today); d.setDate(today.getDate()-1); return d; }
    if (selected === 'tomorrow')  { const d = new Date(today); d.setDate(today.getDate()+1); return d; }
    // ISO date string from custom pick
    if (selected && selected.length === 10) return new Date(selected + 'T00:00:00');
    return today;
  })();

  return (
    <div className="date-selector" ref={wrapperRef}>
      {/* Segmented pill */}
      <div
        className="date-selector__group"
        role="group"
        aria-label="Date selection"
      >
        {OPTIONS.map((opt) => {
          const isActive = !calDate && selected === opt.value;
          return (
            <button
              key={opt.value}
              id={`date-selector-${opt.value}`}
              onClick={() => handleTabChange(opt.value)}
              className={`date-selector__btn${isActive ? ' date-selector__btn--active' : ''}`}
              aria-pressed={isActive}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Calendar icon button */}
      <button
        id="date-calendar-btn"
        className={`date-selector__calendar-btn${calOpen ? ' date-selector__calendar-btn--open' : ''}`}
        aria-label="Open date picker"
        aria-expanded={calOpen}
        onClick={() => setCalOpen(o => !o)}
      >
        <Calendar size={14} strokeWidth={1.75} />
      </button>

      {/* Calendar popover */}
      {calOpen && (
        <CalendarPopover
          selectedDate={selectedDateObj}
          onSelectDate={handleCalendarSelect}
          onClose={() => setCalOpen(false)}
        />
      )}
    </div>
  );
}
