"use client";

import React, { useState, useMemo } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, addMonths, subMonths, isBefore, startOfToday } from "date-fns";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

interface SlotConfig {
  startDate: string;
  endDate: string;
  weekdays: string[];
  exceptionalDays: { date: string; reason: string }[];
}

interface BookingCalendarProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  config: SlotConfig | null;
}

export default function BookingCalendar({ selectedDate, onDateChange, config }: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = startOfToday();

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const isAvailable = (day: Date) => {
    if (!config) return false;
    if (isBefore(day, today)) return false;

    // Check date range
    const dStr = format(day, "yyyy-MM-dd");
    if (config.startDate && dStr < config.startDate) return false;
    if (config.endDate && dStr > config.endDate) return false;

    // Check weekdays
    const dayName = format(day, "EEEE").toLowerCase();
    const isWeekdayMatch = config.weekdays.map(d => d.toLowerCase()).includes(dayName);

    // Check exceptional days (unavailable days)
    const isExceptional = config.exceptionalDays?.some(ed => ed.date === dStr);

    return isWeekdayMatch && !isExceptional;
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const weekDayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-gray-50 bg-gradient-to-r from-gray-50 to-white">
        <h3 className="text-xl font-black text-gray-900 tracking-tight">
          {format(currentMonth, "MMMM yyyy")}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={prevMonth}
            className="p-2 rounded-xl hover:bg-white hover:shadow-md transition-all text-gray-400 hover:text-blue-600 border border-transparent hover:border-blue-50"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 rounded-xl hover:bg-white hover:shadow-md transition-all text-gray-400 hover:text-blue-600 border border-transparent hover:border-blue-50"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="p-6">
        <div className="grid grid-cols-7 gap-1 mb-4">
          {weekDayLabels.map((label) => (
            <div key={label} className="text-center py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              {label}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day, idx) => {
            const dateStr = format(day, "yyyy-MM-dd");
            const isSelected = selectedDate === dateStr;
            const available = isAvailable(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);

            return (
              <button
                key={idx}
                disabled={!available}
                onClick={() => onDateChange(dateStr)}
                className={`
                  relative h-12 sm:h-14 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 group
                  ${!isCurrentMonth ? "opacity-20" : "opacity-100"}
                  ${isSelected 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105 z-10" 
                    : available 
                      ? "bg-white border-2 border-red-50 hover:border-red-500 hover:shadow-md cursor-pointer" 
                      : "bg-gray-50 text-gray-300 cursor-not-allowed opacity-40"}
                `}
              >
                <span className={`text-sm font-black ${isSelected ? "text-white" : available ? "text-gray-900" : "text-gray-400"}`}>
                  {format(day, "d")}
                </span>
                
                {/* User requested red color for available dates */}
                {available && !isSelected && (
                  <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse transition-transform group-hover:scale-150"></div>
                )}
                
                {isSelected && (
                  <Check size={10} className="mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-8 flex items-center justify-center gap-6 pt-6 border-t border-gray-50">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Available</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-100 rounded-full"></div>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Closed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
