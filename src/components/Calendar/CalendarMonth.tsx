import React, { useState, FC } from 'react';
import { FormattedRelease } from '@/lib/types';
import CalendarModal from './CalendarModal';

function getMonthMatrix(month: number) {
  const firstDay = new Date(0, month, 1);
  const lastDay = new Date(0, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const matrix: (number | null)[][] = [];
  let week: (number | null)[] = [];

  // Fill initial empty days
  for (let i = 0; i < firstDay.getDay(); i++) {
    week.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    week.push(day);
    if (week.length === 7) {
      matrix.push(week);
      week = [];
    }
  }
  // Fill trailing empty days
  if (week.length) {
    while (week.length < 7) week.push(null);
    matrix.push(week);
  }
  return matrix;
}

function getMonthName(month: number) {
  return new Date(0, month).toLocaleString("default", { month: "long" });
}

function groupRecordsByMonthDay(data: { year: string }[], month: number) {
  const map: Record<string, any[]> = {};
  data.forEach(item => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(item.year)) {
      // YYYY-MM-DD
      const [, mm, dd] = item.year.split("-");
      if (parseInt(mm, 10) === month + 1) {
        map[dd] = map[dd] || [];
        map[dd].push(item);
      }
    } else if (/^\d{4}-\d{2}$/.test(item.year)) {
      // YYYY-MM
      const [, mm] = item.year.split("-");
      if (parseInt(mm, 10) === month + 1) {
        map["01"] = map["01"] || [];
        map["01"].push(item);
      }
    }
    // If only YYYY, do nothing
  });

  // Sort each day's array by year (older first)
  Object.keys(map).forEach(dd => {
    map[dd].sort((a, b) => {
      const ay = parseInt(a.year.slice(0, 4), 10);
      const by = parseInt(b.year.slice(0, 4), 10);
      return ay - by;
    });
  });
  return map;
}

function getMultiRecordBadgeClasses(count: number) {
  if (count >= 3) {
    return 'bg-pink-500';
  }

  if (count >= 2) {
    return 'bg-purple-500';
  }

  return 'bg-indigo-500';
}

const CalendarMonth: FC<{ month: number; data: FormattedRelease[] }> = ({ month, data }) => {
  const [modalDay, setModalDay] = useState<string | null>(null);

  const matrix = getMonthMatrix(month);
  const monthName = getMonthName(month);
  const today = new Date();
  const isCurrentMonth = today.getMonth() === month;

  // Group records by day (ignoring year)
  const recordsByDay = groupRecordsByMonthDay(data, month);

  return (
    <div className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-xl shadow-black/20 backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.07]">
      <div className="border-b border-white/10 bg-gradient-to-r from-indigo-500 to-pink-500 px-4 py-3 text-center text-sm font-semibold uppercase tracking-[0.2em] text-white">
        {monthName}
      </div>
      <div className="grid grid-cols-7 px-4 pb-3 pt-4 text-center text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-zinc-400">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="px-4 pb-4">
        {matrix.map((week, i) => (
          <div key={i} className="grid grid-cols-7 text-center text-sm">
            {week.map((day, j) => {
              if (!day) return <div key={j} className="py-1.5"></div>;
              const dayStr = String(day).padStart(2, "0");
              const records = recordsByDay[dayStr] || [];
              const isToday = isCurrentMonth && today.getDate() === day;
              
              return (
                <div
                  key={j}
                  className={`group/day relative cursor-pointer py-1.5 transition
                    ${isToday && records.length ? "text-white" : ""}
                    ${isToday && !records.length ? "text-white" : ""}
                    ${!isToday && records.length ? "text-white font-semibold" : "text-zinc-300"}
                  `}>
                  <span
                    className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full transition
                      ${isToday && records.length > 0 ? "bg-black ring-1 text-pink-500 ring-pink-500" : ""}
                      ${isToday && !records.length ? "bg-black ring-1 ring-pink-500" : ""}
                      ${!isToday && records.length > 1 ? getMultiRecordBadgeClasses(records.length) : ""}
                      ${!isToday && records.length === 1 ? "bg-indigo-500" : ""}
                    `}
                  >
                  {records.length > 0
                    ? <CalendarModal
                        records={records}
                        day={day}
                        month={month}
                        monthName={monthName}
                        today={today}
                      />
                    : day}
                  </span>
                  {records.length > 1 && (
                    <span className="pointer-events-none absolute left-1/2 bottom-full z-10 mb-2 -translate-x-1/2 rounded-full bg-black/90 px-2 py-1 text-[0.65rem] text-white opacity-0 shadow-lg transition duration-150 group-hover/day:opacity-100">
                      {records.length} records
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarMonth;
