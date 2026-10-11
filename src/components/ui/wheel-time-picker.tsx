"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface WheelTimePickerProps {
  /**
   * Time string in 24-hour format "HH:mm" (e.g. "09:00", "14:30")
   */
  value: string;
  /**
   * Callback when time value changes
   */
  onChange: (value: string) => void;
  /**
   * Title shown at the top (defaults to "Time" matching user screenshot)
   */
  title?: string;
  /**
   * Optional helper or subtitle
   */
  subtitle?: string;
  /**
   * Minimum hour in 24h format (0-23, default 0)
   */
  minHour?: number;
  /**
   * Maximum hour in 24h format (0-23, default 23)
   */
  maxHour?: number;
  /**
   * Minute interval step (default 1 to support any minute 00-59)
   */
  minuteStep?: number;
  /**
   * If true, displays hour with leading zero e.g. "09".
   * If false (default), displays single digit e.g. "9" matching the screenshot.
   */
  padHour?: boolean;
  className?: string;
}

const ITEM_HEIGHT = 36; // px per item
const VISIBLE_COUNT = 7; // 3 above, 1 center, 3 below
const PADDING_ITEMS = Math.floor(VISIBLE_COUNT / 2); // 3 items = 108px

export function WheelTimePicker({
  value,
  onChange,
  title = "Time",
  subtitle,
  minHour = 0,
  maxHour = 23,
  minuteStep = 1,
  padHour = false,
  className,
}: WheelTimePickerProps) {
  // Parse initial 24-hour time
  const [parsedHour, parsedMinute] = React.useMemo(() => {
    if (!value || !value.includes(":")) return [8, 0];
    const [hStr, mStr] = value.split(":");
    const h = parseInt(hStr, 10);
    const m = parseInt(mStr, 10);
    return [
      isNaN(h) ? 8 : Math.max(minHour, Math.min(maxHour, h)),
      isNaN(m) ? 0 : Math.max(0, Math.min(59, m)),
    ];
  }, [value, minHour, maxHour]);

  const [selectedHour, setSelectedHour] = React.useState(parsedHour);
  const [selectedMinute, setSelectedMinute] = React.useState(parsedMinute);

  const hoursContainerRef = React.useRef<HTMLDivElement>(null);
  const minutesContainerRef = React.useRef<HTMLDivElement>(null);
  const isScrollingRef = React.useRef<boolean>(false);
  const scrollTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Sync internal state when prop changes externally
  React.useEffect(() => {
    setSelectedHour(parsedHour);
    setSelectedMinute(parsedMinute);
  }, [parsedHour, parsedMinute]);

  // Generate hour list (minHour .. maxHour)
  const hoursList = React.useMemo(() => {
    const list: number[] = [];
    for (let h = minHour; h <= maxHour; h++) {
      list.push(h);
    }
    return list;
  }, [minHour, maxHour]);

  // Generate minute list (00 .. 59)
  const minutesList = React.useMemo(() => {
    const list: number[] = [];
    for (let m = 0; m < 60; m += minuteStep) {
      list.push(m);
    }
    return list;
  }, [minuteStep]);

  // Scroll to active indices smoothly on mount or value sync
  React.useEffect(() => {
    if (isScrollingRef.current) return;

    const hourIndex = hoursList.indexOf(selectedHour);
    if (hourIndex !== -1 && hoursContainerRef.current) {
      hoursContainerRef.current.scrollTop = hourIndex * ITEM_HEIGHT;
    }

    const minuteIndex = minutesList.indexOf(selectedMinute);
    if (minuteIndex !== -1 && minutesContainerRef.current) {
      minutesContainerRef.current.scrollTop = minuteIndex * ITEM_HEIGHT;
    }
  }, [selectedHour, selectedMinute, hoursList, minutesList]);

  // Format emitter helper
  const emitChange = React.useCallback(
    (h: number, m: number) => {
      const formattedH = String(h).padStart(2, "0");
      const formattedM = String(m).padStart(2, "0");
      onChange(`${formattedH}:${formattedM}`);
    },
    [onChange]
  );

  // Handle scroll events with snapping & debounced update
  const handleScroll = (type: "hour" | "minute") => {
    isScrollingRef.current = true;
    const container =
      type === "hour" ? hoursContainerRef.current : minutesContainerRef.current;
    if (!container) return;

    const scrollTop = container.scrollTop;
    const rawIndex = Math.round(scrollTop / ITEM_HEIGHT);

    if (type === "hour") {
      const safeIndex = Math.max(0, Math.min(hoursList.length - 1, rawIndex));
      const newHour = hoursList[safeIndex];
      setSelectedHour(newHour);

      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
        emitChange(newHour, selectedMinute);
      }, 100);
    } else {
      const safeIndex = Math.max(0, Math.min(minutesList.length - 1, rawIndex));
      const newMinute = minutesList[safeIndex];
      setSelectedMinute(newMinute);

      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
        emitChange(selectedHour, newMinute);
      }, 100);
    }
  };

  // Direct click handler for an item
  const handleSelectHour = (hour: number) => {
    setSelectedHour(hour);
    const index = hoursList.indexOf(hour);
    if (index !== -1 && hoursContainerRef.current) {
      if (typeof hoursContainerRef.current.scrollTo === "function") {
        hoursContainerRef.current.scrollTo({
          top: index * ITEM_HEIGHT,
          behavior: "smooth",
        });
      } else {
        hoursContainerRef.current.scrollTop = index * ITEM_HEIGHT;
      }
    }
    emitChange(hour, selectedMinute);
  };

  const handleSelectMinute = (minute: number) => {
    setSelectedMinute(minute);
    const index = minutesList.indexOf(minute);
    if (index !== -1 && minutesContainerRef.current) {
      if (typeof minutesContainerRef.current.scrollTo === "function") {
        minutesContainerRef.current.scrollTo({
          top: index * ITEM_HEIGHT,
          behavior: "smooth",
        });
      } else {
        minutesContainerRef.current.scrollTop = index * ITEM_HEIGHT;
      }
    }
    emitChange(selectedHour, minute);
  };

  // Keyboard navigation for accessibility
  const handleKeyDown = (
    e: React.KeyboardEvent,
    type: "hour" | "minute"
  ) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (type === "hour") {
        const idx = hoursList.indexOf(selectedHour);
        if (idx > 0) handleSelectHour(hoursList[idx - 1]);
      } else {
        const idx = minutesList.indexOf(selectedMinute);
        if (idx > 0) handleSelectMinute(minutesList[idx - 1]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (type === "hour") {
        const idx = hoursList.indexOf(selectedHour);
        if (idx < hoursList.length - 1) handleSelectHour(hoursList[idx + 1]);
      } else {
        const idx = minutesList.indexOf(selectedMinute);
        if (idx < minutesList.length - 1) handleSelectMinute(minutesList[idx + 1]);
      }
    }
  };

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center p-3 select-none",
        className
      )}
    >
      {/* Title (matches "Time" at the top of screenshot) */}
      {title && (
        <h4 className="font-bold text-foreground text-sm tracking-tight mb-2 text-center">
          {title}
        </h4>
      )}

      {subtitle && (
        <p className="text-[11px] text-muted-foreground text-center mb-1">
          {subtitle}
        </p>
      )}

      {/* Main Wheel Viewport */}
      <div
        className="relative w-full max-w-[260px] h-[252px] flex items-center justify-center overflow-hidden rounded-xl bg-card"
        style={{ height: VISIBLE_COUNT * ITEM_HEIGHT }}
      >
        {/* Center Active Highlight Capsule (rounded bar behind center active row) */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[38px] rounded-2xl bg-muted/80 dark:bg-muted/50 border border-border/60 shadow-xs z-0"
          aria-hidden="true"
        />

        {/* Top Fade Gradient */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-card via-card/80 to-transparent z-10"
          aria-hidden="true"
        />

        {/* Bottom Fade Gradient */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-card via-card/80 to-transparent z-10"
          aria-hidden="true"
        />

        {/* Content Row: Hours Wheel + Colon Separator + Minutes Wheel */}
        <div className="relative z-1 flex items-center justify-center w-full h-full">
          {/* Hours Column */}
          <div
            ref={hoursContainerRef}
            tabIndex={0}
            role="listbox"
            aria-label="Pilih Jam"
            onKeyDown={(e) => handleKeyDown(e, "hour")}
            onScroll={() => handleScroll("hour")}
            className="flex-1 h-full overflow-y-auto overscroll-contain snap-y snap-mandatory focus:outline-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            style={{
              paddingTop: PADDING_ITEMS * ITEM_HEIGHT,
              paddingBottom: PADDING_ITEMS * ITEM_HEIGHT,
            }}
          >
            {hoursList.map((hour) => {
              const isSelected = hour === selectedHour;
              const distance = Math.abs(hoursList.indexOf(hour) - hoursList.indexOf(selectedHour));
              const displayHour = padHour ? String(hour).padStart(2, "0") : String(hour);

              return (
                <div
                  key={`hour-${hour}`}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelectHour(hour)}
                  className={cn(
                    "flex items-center justify-end pr-5 cursor-pointer snap-center select-none transition-all duration-150",
                    isSelected
                      ? "text-2xl font-bold text-foreground scale-100"
                      : distance === 1
                      ? "text-lg font-medium text-muted-foreground/75 scale-95"
                      : distance === 2
                      ? "text-sm font-normal text-muted-foreground/45 scale-90"
                      : "text-xs font-normal text-muted-foreground/20 scale-85"
                  )}
                  style={{ height: ITEM_HEIGHT }}
                >
                  {displayHour}
                </div>
              );
            })}
          </div>

          {/* Center Colon Separator (Aligned exactly in center capsule) */}
          <div
            className="shrink-0 flex items-center justify-center w-6 text-2xl font-bold text-foreground select-none pointer-events-none z-10"
            aria-hidden="true"
          >
            :
          </div>

          {/* Minutes Column */}
          <div
            ref={minutesContainerRef}
            tabIndex={0}
            role="listbox"
            aria-label="Pilih Menit"
            onKeyDown={(e) => handleKeyDown(e, "minute")}
            onScroll={() => handleScroll("minute")}
            className="flex-1 h-full overflow-y-auto overscroll-contain snap-y snap-mandatory focus:outline-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            style={{
              paddingTop: PADDING_ITEMS * ITEM_HEIGHT,
              paddingBottom: PADDING_ITEMS * ITEM_HEIGHT,
            }}
          >
            {minutesList.map((minute) => {
              const isSelected = minute === selectedMinute;
              const distance = Math.abs(minutesList.indexOf(minute) - minutesList.indexOf(selectedMinute));
              const displayMinute = String(minute).padStart(2, "0");

              return (
                <div
                  key={`min-${minute}`}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelectMinute(minute)}
                  className={cn(
                    "flex items-center justify-start pl-5 cursor-pointer snap-center select-none transition-all duration-150",
                    isSelected
                      ? "text-2xl font-bold text-foreground scale-100"
                      : distance === 1
                      ? "text-lg font-medium text-muted-foreground/75 scale-95"
                      : distance === 2
                      ? "text-sm font-normal text-muted-foreground/45 scale-90"
                      : "text-xs font-normal text-muted-foreground/20 scale-85"
                  )}
                  style={{ height: ITEM_HEIGHT }}
                >
                  {displayMinute}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
