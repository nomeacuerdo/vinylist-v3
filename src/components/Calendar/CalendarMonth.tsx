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

const CalendarMonth: FC<{ month: number; data: FormattedRelease[] }> = ({ month, data }) => {
  const [modalDay, setModalDay] = useState<string | null>(null);

  const matrix = getMonthMatrix(month);
  const monthName = getMonthName(month);
  const today = new Date();
  const isCurrentMonth = today.getMonth() === month;

  // Group records by day (ignoring year)
  const recordsByDay = groupRecordsByMonthDay(data, month);

  return (
    <div className="border rounded min-w-[320px] md:min-w-[300px]">
      <div className="font-bold text-center p-2 bg-indigo-500 text-black">{monthName}</div>
      <div className="grid grid-cols-7 text-xs font-semibold text-center mb-1 p-4">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="px-4 pb-4">
        {matrix.map((week, i) => (
          <div key={i} className="grid grid-cols-7 text-center">
            {week.map((day, j) => {
              if (!day) return <div key={j} className="py-1"></div>;
              const dayStr = String(day).padStart(2, "0");
              const records = recordsByDay[dayStr] || [];
              const isToday = isCurrentMonth && today.getDate() === day;
              
              return (
                <div
                  key={j}
                  className={`py-1 cursor-pointer relative group
                    ${isToday && records.length ? "rounded-full bg-gradient-to-br from-indigo-600 to-pink-500 text-white font-bold" : ""}
                    ${isToday && !records.length ? "rounded-full bg-pink-500 text-white" : ""}
                    ${!isToday && records.length ? "text-pink-500 font-bold" : ""}
                  `}>
                  {records.length > 0
                    ? <CalendarModal
                        records={records}
                        day={day}
                        monthName={monthName}
                      />
                    : day}
                  {records.length > 0 && (
                    <span className="absolute left-1/2 -translate-x-1/2 mt-1 bg-black text-white text-xs rounded px-2 py-1 z-10 opacity-0 group-hover:opacity-100 pointer-events-none">
                      {records.length} record{records.length > 1 ? "s" : ""}
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
