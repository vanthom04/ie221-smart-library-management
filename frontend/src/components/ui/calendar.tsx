import * as React from "react"

import { enUS } from "date-fns/locale"
import { AnimatePresence, m, useReducedMotion } from "motion/react"
import {
  XIcon,
  CheckIcon,
  ClockIcon,
  CalendarIcon,
  ChevronLeftIcon,
  AlertCircleIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon
} from "lucide-react"
import {
  addDays,
  addMonths,
  addYears,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  getDay,
  getHours,
  getMinutes,
  getMonth,
  getYear,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isToday,
  isWeekend,
  isWithinInterval,
  setHours,
  setMinutes,
  setMonth,
  setYear,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
  subMonths,
  subYears,
  type Locale
} from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// ============================================================================
// TYPES
// ============================================================================

export type CalendarMode = "single" | "range" | "multiple"
export type CalendarView = "days" | "months" | "years" | "time"
export type CalendarSize = "sm" | "md" | "lg"
export type CalendarValue = Date | DateRange | Date[]
type InternalCalendarValue = CalendarValue | undefined

export interface DateRange {
  from: Date | undefined
  to: Date | undefined
}

export interface PresetRange {
  label: string
  getValue: () => DateRange
}

export interface CalendarLocale {
  weekdays: string[]
  weekdaysShort: string[]
  months: string[]
  monthsShort: string[]
  today: string
  clear: string
  close: string
  selectTime: string
  backToCalendar: string
  selected: string
  weekNumber: string
}

// Base props shared by all modes
interface BaseCalendarProps {
  // Display
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  className?: string
  size?: CalendarSize

  // Constraints
  minDate?: Date
  maxDate?: Date
  disabledDates?: Date[]
  disabledDaysOfWeek?: number[]
  disableWeekends?: boolean
  disablePastDates?: boolean
  disableFutureDates?: boolean

  // Validation
  error?: boolean
  errorMessage?: string

  // Features
  showTime?: boolean
  use24Hour?: boolean
  minuteStep?: number
  showWeekNumbers?: boolean
  showTodayButton?: boolean
  showClearButton?: boolean
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  monthsToShow?: 1 | 2 | 3

  // Range presets
  showPresets?: boolean
  presets?: PresetRange[]

  // Events
  highlightedDates?: { date: Date; color?: string; label?: string }[]

  // Customization
  formatStr?: string
  closeOnSelect?: boolean
  locale?: Locale
  localeStrings?: Partial<CalendarLocale>

  // Callbacks
  onMonthChange?: (date: Date) => void
  onYearChange?: (date: Date) => void
  onViewChange?: (view: CalendarView) => void
  onOpen?: () => void
  onClose?: () => void

  // Accessibility
  id?: string
  name?: string
  "aria-label"?: string
  "aria-describedby"?: string

  // Custom renderers
  renderDay?: (date: Date, defaultRender: React.ReactNode) => React.ReactNode
  renderHeader?: (date: Date, defaultRender: React.ReactNode) => React.ReactNode

  // Form integration
  onBlur?: () => void
  onFocus?: () => void
}

// Single date selection mode
interface SingleModeProps extends BaseCalendarProps {
  mode?: "single"
  value?: Date
  defaultValue?: Date
  onChange?: (value: Date | undefined) => void
}

// Range selection mode
interface RangeModeProps extends BaseCalendarProps {
  mode: "range"
  value?: DateRange
  defaultValue?: DateRange
  onChange?: (value: DateRange | undefined) => void
}

// Multiple dates selection mode
interface MultipleModeProps extends BaseCalendarProps {
  mode: "multiple"
  value?: Date[]
  defaultValue?: Date[]
  onChange?: (value: Date[]) => void
}

// Union type for all calendar props (external API)
export type AnimatedCalendarProps = SingleModeProps | RangeModeProps | MultipleModeProps

// Internal unified type for component implementation
interface InternalCalendarProps extends BaseCalendarProps {
  mode?: CalendarMode
  value?: Date | DateRange | Date[]
  defaultValue?: Date | DateRange | Date[]
  onChange?: (value: Date | DateRange | Date[] | undefined) => void
}

// ============================================================================
// CONSTANTS & DEFAULTS
// ============================================================================

const defaultLocaleStrings: CalendarLocale = {
  weekdays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  weekdaysShort: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  months: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ],
  monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  today: "Today",
  clear: "Clear",
  close: "Close",
  selectTime: "Select time",
  backToCalendar: "Back to calendar",
  selected: "selected",
  weekNumber: "Week"
}

const defaultPresets: PresetRange[] = [
  {
    label: "Today",
    getValue: () => ({
      from: startOfDay(new Date()),
      to: startOfDay(new Date())
    })
  },
  {
    label: "Yesterday",
    getValue: () => ({
      from: startOfDay(subDays(new Date(), 1)),
      to: startOfDay(subDays(new Date(), 1))
    })
  },
  {
    label: "Last 7 days",
    getValue: () => ({
      from: startOfDay(subDays(new Date(), 6)),
      to: startOfDay(new Date())
    })
  },
  {
    label: "Last 30 days",
    getValue: () => ({
      from: startOfDay(subDays(new Date(), 29)),
      to: startOfDay(new Date())
    })
  },
  {
    label: "This month",
    getValue: () => ({
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date())
    })
  },
  {
    label: "Last month",
    getValue: () => ({
      from: startOfMonth(subMonths(new Date(), 1)),
      to: endOfMonth(subMonths(new Date(), 1))
    })
  },
  {
    label: "This year",
    getValue: () => ({
      from: startOfYear(new Date()),
      to: endOfYear(new Date())
    })
  }
]

const sizeClasses = {
  sm: { cell: "size-7 text-xs", header: "text-sm", container: "p-2" },
  md: { cell: "size-9 text-sm", header: "text-base", container: "p-4" },
  lg: { cell: "size-11 text-base", header: "text-lg", container: "p-5" }
}

// Trigger button sizing — tách riêng khỏi `sizeClasses` (dùng cho grid ngày) để
// tránh trùng tên biến cục bộ trong AnimatedCalendar.
const triggerSizeClasses = {
  sm: "w-[240px] h-8 text-xs",
  md: "w-[280px] h-10 text-sm",
  lg: "w-[320px] h-12 text-base"
}

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 280 : -280, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction < 0 ? 280 : -280, opacity: 0 })
}

const fadeScale = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 }
}

// ============================================================================
// UTILITY HOOKS
// ============================================================================

function useControllableState<T>(
  controlledValue: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void
): [T, (value: T) => void] {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : uncontrolledValue

  const setValue = (newValue: T) => {
    if (!isControlled) {
      setUncontrolledValue(newValue)
    }
    onChange?.(newValue)
  }

  return [value, setValue]
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

// Time Picker
function TimePicker({
  value,
  onChange,
  use24Hour = true,
  minuteStep = 5,
  size = "md",
  localeStrings,
  disabled
}: {
  value: Date
  onChange: (date: Date) => void
  use24Hour?: boolean
  minuteStep?: number
  size?: CalendarSize
  localeStrings: CalendarLocale
  disabled?: boolean
}) {
  const hours = getHours(value)
  const minutes = getMinutes(value)
  const isPM = hours >= 12
  const displayHours = use24Hour ? hours : hours % 12 || 12
  const sizes = sizeClasses[size]

  const updateTime = (newHours: number, newMinutes: number) => {
    let updated = setHours(value, Math.max(0, Math.min(23, newHours)))
    updated = setMinutes(updated, Math.max(0, Math.min(59, newMinutes)))
    onChange(updated)
  }

  const incrementHour = () => updateTime((hours + 1) % 24, minutes)
  const decrementHour = () => updateTime((hours - 1 + 24) % 24, minutes)
  const incrementMinute = () => updateTime(hours, (minutes + minuteStep) % 60)
  const decrementMinute = () => updateTime(hours, (minutes - minuteStep + 60) % 60)
  const toggleAMPM = () => updateTime(isPM ? hours - 12 : hours + 12, minutes)

  return (
    <div
      role="group"
      className="pointer-events-auto flex items-center justify-center gap-3 px-2 py-4"
      aria-label={localeStrings.selectTime}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Hours */}
      <div className="flex flex-col items-center gap-1">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            incrementHour()
          }}
          disabled={disabled}
          className="pointer-events-auto rounded-lg p-1.5 transition-colors hover:bg-accent disabled:opacity-50"
          aria-label="Increase hours"
        >
          <ChevronLeftIcon className="size-4 rotate-90" />
        </button>
        <input
          type="text"
          inputMode="numeric"
          value={displayHours.toString().padStart(2, "0")}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10) || 0
            if (use24Hour) {
              updateTime(Math.min(23, Math.max(0, val)), minutes)
            } else {
              const newHours = Math.min(12, Math.max(1, val))
              updateTime(
                isPM ? (newHours === 12 ? 12 : newHours + 12) : newHours === 12 ? 0 : newHours,
                minutes
              )
            }
          }}
          disabled={disabled}
          className={cn(
            "pointer-events-auto w-12 rounded border-none bg-transparent text-center font-mono font-bold focus:ring-2 focus:ring-primary focus:outline-none",
            sizes.header
          )}
          aria-label="Hours"
          maxLength={2}
        />
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            decrementHour()
          }}
          disabled={disabled}
          className="pointer-events-auto rounded-lg p-1.5 transition-colors hover:bg-accent disabled:opacity-50"
          aria-label="Decrease hours"
        >
          <ChevronRightIcon className="size-4 rotate-90" />
        </button>
      </div>

      <span className={cn("font-bold text-muted-foreground", sizes.header)}>:</span>

      {/* Minutes */}
      <div className="flex flex-col items-center gap-1">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            incrementMinute()
          }}
          disabled={disabled}
          className="pointer-events-auto rounded-lg p-1.5 transition-colors hover:bg-accent disabled:opacity-50"
          aria-label="Increase minutes"
        >
          <ChevronLeftIcon className="size-4 rotate-90" />
        </button>
        <input
          type="text"
          inputMode="numeric"
          value={minutes.toString().padStart(2, "0")}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10) || 0
            updateTime(hours, Math.min(59, Math.max(0, val)))
          }}
          disabled={disabled}
          className={cn(
            "pointer-events-auto w-12 rounded border-none bg-transparent text-center font-mono font-bold focus:ring-2 focus:ring-primary focus:outline-none",
            sizes.header
          )}
          aria-label="Minutes"
          maxLength={2}
        />
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            decrementMinute()
          }}
          disabled={disabled}
          className="pointer-events-auto rounded-lg p-1.5 transition-colors hover:bg-accent disabled:opacity-50"
          aria-label="Decrease minutes"
        >
          <ChevronRightIcon className="size-4 rotate-90" />
        </button>
      </div>

      {/* AM/PM */}
      {!use24Hour && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            toggleAMPM()
          }}
          disabled={disabled}
          className="pointer-events-auto ml-2 rounded-lg bg-accent px-3 py-2 text-sm font-semibold transition-colors hover:bg-accent/80 disabled:opacity-50"
          aria-label={`Switch to ${isPM ? "AM" : "PM"}`}
        >
          {isPM ? "PM" : "AM"}
        </button>
      )}
    </div>
  )
}

// Month Picker
function MonthPicker({
  currentMonth,
  onSelect,
  minDate,
  maxDate,
  localeStrings,
  disabled,
  prefersReducedMotion
}: {
  currentMonth: Date
  onSelect: (month: number) => void
  minDate?: Date
  maxDate?: Date
  localeStrings: CalendarLocale
  disabled?: boolean
  prefersReducedMotion: boolean
}) {
  const currentYear = getYear(currentMonth)
  const currentMonthIndex = getMonth(currentMonth)

  const isMonthDisabled = (month: number) => {
    if (disabled) return true
    const date = new Date(currentYear, month, 1)
    if (minDate && isBefore(endOfMonth(date), startOfDay(minDate))) return true
    if (maxDate && isAfter(startOfMonth(date), startOfDay(maxDate))) return true
    return false
  }

  return (
    <div className="grid grid-cols-3 gap-2 p-2" role="listbox" aria-label="Select month">
      {localeStrings.monthsShort.map((month, index) => {
        const isDisabled = isMonthDisabled(index)
        const isSelected = index === currentMonthIndex
        return (
          <m.button
            key={month}
            type="button"
            role="option"
            aria-selected={isSelected}
            aria-disabled={isDisabled}
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: prefersReducedMotion ? 0 : index * 0.02 }}
            whileHover={!isDisabled && !prefersReducedMotion ? { scale: 1.05 } : undefined}
            whileTap={!isDisabled && !prefersReducedMotion ? { scale: 0.95 } : undefined}
            onClick={() => !isDisabled && onSelect(index)}
            disabled={isDisabled}
            className={cn(
              "rounded-lg px-2 py-3 text-sm font-medium transition-all focus:ring-2 focus:ring-primary focus:outline-none",
              isSelected
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-foreground hover:bg-accent",
              isDisabled && "cursor-not-allowed opacity-30"
            )}
          >
            {month}
          </m.button>
        )
      })}
    </div>
  )
}

// Year Picker
function YearPicker({
  currentYear,
  onSelect,
  minDate,
  maxDate,
  disabled,
  prefersReducedMotion
}: {
  currentYear: number
  onSelect: (year: number) => void
  minDate?: Date
  maxDate?: Date
  disabled?: boolean
  prefersReducedMotion: boolean
}) {
  const [startYear, setStartYear] = React.useState(currentYear - 6)
  const years = Array.from({ length: 12 }, (_, i) => startYear + i)

  const isYearDisabled = (year: number) => {
    if (disabled) return true
    if (minDate && year < getYear(minDate)) return true
    if (maxDate && year > getYear(maxDate)) return true
    return false
  }

  return (
    <div className="space-y-2 p-2" role="listbox" aria-label="Select year">
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStartYear((s) => s - 12)}
          className="rounded-lg p-1.5 transition-colors hover:bg-accent"
          aria-label="Previous 12 years"
        >
          <ChevronsLeftIcon className="size-4" />
        </button>
        <span className="text-sm font-medium text-muted-foreground">
          {years[0]} - {years[years.length - 1]}
        </span>
        <button
          type="button"
          onClick={() => setStartYear((s) => s + 12)}
          className="rounded-lg p-1.5 transition-colors hover:bg-accent"
          aria-label="Next 12 years"
        >
          <ChevronsRightIcon className="size-4" />
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {years.map((year, index) => {
          const isDisabled = isYearDisabled(year)
          const isSelected = year === currentYear
          return (
            <m.button
              key={year}
              type="button"
              role="option"
              aria-selected={isSelected}
              aria-disabled={isDisabled}
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: prefersReducedMotion ? 0 : index * 0.02 }}
              whileHover={!isDisabled && !prefersReducedMotion ? { scale: 1.05 } : undefined}
              whileTap={!isDisabled && !prefersReducedMotion ? { scale: 0.95 } : undefined}
              onClick={() => !isDisabled && onSelect(year)}
              disabled={isDisabled}
              className={cn(
                "rounded-lg px-2 py-3 text-sm font-medium transition-all focus:ring-2 focus:ring-primary focus:outline-none",
                isSelected
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-foreground hover:bg-accent",
                isDisabled && "cursor-not-allowed opacity-30"
              )}
            >
              {year}
            </m.button>
          )
        })}
      </div>
    </div>
  )
}

// Presets Panel
function PresetsPanel({
  presets,
  onSelect,
  disabled
}: {
  presets: PresetRange[]
  onSelect: (range: DateRange) => void
  disabled?: boolean
}) {
  return (
    <div
      className="mr-3 min-w-35 space-y-1 border-r border-border pr-3"
      role="group"
      aria-label="Quick date presets"
    >
      <span className="mb-2 block text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        Quick Select
      </span>
      {presets.map((preset, index) => (
        <m.button
          key={preset.label}
          type="button"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.03 }}
          whileHover={{ x: 4 }}
          onClick={() => !disabled && onSelect(preset.getValue())}
          disabled={disabled}
          className="w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-accent focus:ring-2 focus:ring-primary focus:outline-none disabled:opacity-50"
        >
          {preset.label}
        </m.button>
      ))}
    </div>
  )
}

// ============================================================================
// MAIN CALENDAR CONTENT
// ============================================================================

interface CalendarHeaderProps {
  currentMonth: Date
  view: CalendarView
  sizes: (typeof sizeClasses)[keyof typeof sizeClasses]
  locale: Locale
  disabled?: boolean
  onNavigate: (delta: number, type: "month" | "year") => void
  onViewChange: (view: CalendarView) => void
}

function CalendarHeader({
  currentMonth,
  view,
  sizes,
  locale,
  disabled,
  onNavigate,
  onViewChange
}: CalendarHeaderProps) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onClick={() => onNavigate(-1, "year")}
          disabled={disabled}
          className="rounded-lg p-1.5 transition-colors hover:bg-accent disabled:opacity-50"
          aria-label="Previous year"
        >
          <ChevronsLeftIcon className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => onNavigate(-1, "month")}
          disabled={disabled}
          className="rounded-lg p-1.5 transition-colors hover:bg-accent disabled:opacity-50"
          aria-label="Previous month"
        >
          <ChevronLeftIcon className="size-4" />
        </button>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onViewChange(view === "months" ? "days" : "months")}
          disabled={disabled}
          className={cn(
            "rounded-lg px-2 py-1 font-bold transition-colors hover:bg-accent",
            sizes.header
          )}
          aria-label={`Select month, currently ${format(currentMonth, "MMMM", { locale })}`}
        >
          {format(currentMonth, "MMMM", { locale })}
        </button>
        <button
          type="button"
          onClick={() => onViewChange(view === "years" ? "days" : "years")}
          disabled={disabled}
          className={cn(
            "rounded-lg px-2 py-1 font-bold transition-colors hover:bg-accent",
            sizes.header
          )}
          aria-label={`Select year, currently ${format(currentMonth, "yyyy")}`}
        >
          {format(currentMonth, "yyyy")}
        </button>
      </div>

      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onClick={() => onNavigate(1, "month")}
          disabled={disabled}
          className="rounded-lg p-1.5 transition-colors hover:bg-accent disabled:opacity-50"
          aria-label="Next month"
        >
          <ChevronRightIcon className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => onNavigate(1, "year")}
          disabled={disabled}
          className="rounded-lg p-1.5 transition-colors hover:bg-accent disabled:opacity-50"
          aria-label="Next year"
        >
          <ChevronsRightIcon className="size-4" />
        </button>
      </div>
    </div>
  )
}

interface DayCellFlags {
  isSelected: boolean
  isTodayDate: boolean
  isDisabled: boolean
  inRange: boolean
  isFocused: boolean
  prefersReducedMotion: boolean
}

interface CalendarDayCellProps {
  day: Date
  monthDate: Date
  index: number
  mode: CalendarMode
  sizes: (typeof sizeClasses)[keyof typeof sizeClasses]
  locale: Locale
  flags: DayCellFlags
  highlight?: { date: Date; label?: string; color?: string }
  rangeStart?: Date
  onSelectDate: (day: Date) => void
  onRangeHover: (day: Date | null) => void
  onFocusDate: (day: Date) => void
  renderDay?: (day: Date, defaultContent: React.ReactNode) => React.ReactNode
}

interface DayCellClassNameOptions extends DayCellFlags {
  sizes: (typeof sizeClasses)[keyof typeof sizeClasses]
  isCurrentMonth: boolean
}

function getDayCellAriaLabel({
  day,
  locale,
  isSelected,
  isTodayDate,
  highlight
}: {
  day: Date
  locale: Locale
  isSelected: boolean
  isTodayDate: boolean
  highlight?: { label?: string }
}) {
  const selectedLabel = isSelected ? ", selected" : ""
  const todayLabel = isTodayDate ? ", today" : ""
  const highlightLabel = highlight?.label ? `, ${highlight.label}` : ""

  return `${format(day, "EEEE, MMMM d, yyyy", { locale })}${selectedLabel}${todayLabel}${highlightLabel}`
}

function getDayCellClassName({
  sizes,
  isCurrentMonth,
  isDisabled,
  isSelected,
  isTodayDate,
  inRange,
  isFocused
}: DayCellClassNameOptions) {
  return cn(
    sizes.cell,
    "relative flex items-center justify-center rounded-lg font-medium transition-all outline-none",
    !isCurrentMonth && "text-muted-foreground/40",
    isDisabled && "cursor-not-allowed opacity-25",
    !isSelected && isCurrentMonth && !inRange && "text-foreground hover:bg-accent",
    isSelected && "bg-primary text-primary-foreground shadow-sm",
    isTodayDate && !isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
    inRange && "rounded-none bg-primary/15",
    isFocused && "ring-2 ring-ring ring-offset-1"
  )
}

function getDayCellInitialMotion(prefersReducedMotion: boolean) {
  return prefersReducedMotion ? false : { opacity: 0, scale: 0.8 }
}

function getDayCellHoverMotion(isDisabled: boolean, prefersReducedMotion: boolean) {
  return !isDisabled && !prefersReducedMotion ? { scale: 1.1 } : undefined
}

function getDayCellTapMotion(isDisabled: boolean, prefersReducedMotion: boolean) {
  return !isDisabled && !prefersReducedMotion ? { scale: 0.95 } : undefined
}

function CalendarTodayIndicator({ visible }: { visible: boolean }) {
  return visible ? (
    <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
  ) : null
}

function CalendarHighlightIndicator({
  highlight
}: {
  highlight?: { date: Date; label?: string; color?: string }
}) {
  return highlight ? (
    <span
      className="absolute top-0.5 right-0.5 h-1.5 w-1.5 rounded-full"
      style={{
        backgroundColor: highlight.color || "hsl(var(--primary))"
      }}
      title={highlight.label}
    />
  ) : null
}

function getRenderedCalendarDay(
  renderDay: CalendarDayCellProps["renderDay"],
  day: Date,
  dayContent: React.ReactNode
) {
  return renderDay ? renderDay(day, dayContent) : dayContent
}

function CalendarDayCell({
  day,
  monthDate,
  index,
  mode,
  sizes,
  locale,
  flags,
  highlight,
  rangeStart,
  onSelectDate,
  onRangeHover,
  onFocusDate,
  renderDay
}: CalendarDayCellProps) {
  const { isSelected, isTodayDate, isDisabled, isFocused, prefersReducedMotion } = flags
  const isCurrentMonth = isSameMonth(day, monthDate)
  const ariaLabel = getDayCellAriaLabel({ day, locale, isSelected, isTodayDate, highlight })
  const className = getDayCellClassName({ sizes, isCurrentMonth, ...flags })

  const dayContent = (
    <m.button
      key={day.toISOString()}
      type="button"
      role="gridcell"
      aria-selected={isSelected}
      aria-disabled={isDisabled}
      aria-current={isTodayDate ? "date" : undefined}
      aria-label={ariaLabel}
      tabIndex={isFocused ? 0 : -1}
      initial={getDayCellInitialMotion(prefersReducedMotion)}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.1,
        delay: prefersReducedMotion ? 0 : index * 0.003
      }}
      whileHover={getDayCellHoverMotion(isDisabled, prefersReducedMotion)}
      whileTap={getDayCellTapMotion(isDisabled, prefersReducedMotion)}
      onClick={() => onSelectDate(day)}
      onMouseEnter={() => {
        if (mode === "range" && rangeStart && !isDisabled) onRangeHover(day)
      }}
      onMouseLeave={() => onRangeHover(null)}
      onFocus={() => onFocusDate(day)}
      disabled={isDisabled}
      className={className}
    >
      <span className="relative z-10">{format(day, "d")}</span>
      <CalendarTodayIndicator visible={isTodayDate && !isSelected} />
      <CalendarHighlightIndicator highlight={highlight} />
    </m.button>
  )

  return getRenderedCalendarDay(renderDay, day, dayContent)
}

interface CalendarMonthGridProps {
  monthDate: Date
  isSecondary?: boolean
  direction: number
  sizes: (typeof sizeClasses)[keyof typeof sizeClasses]
  locale: Locale
  localeStrings: CalendarLocale
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6
  showWeekNumbers?: boolean
  prefersReducedMotion: boolean
  mode: CalendarMode
  focusedDate: Date | null
  rangeStart?: Date
  isDayDisabled: (day: Date) => boolean
  isDaySelected: (day: Date) => boolean
  isDayInRange: (day: Date) => boolean
  getHighlight: (day: Date) => { date: Date; label?: string; color?: string } | undefined
  onSelectDate: (day: Date) => void
  onRangeHover: (day: Date | null) => void
  onFocusDate: (day: Date) => void
  renderDay?: (day: Date, defaultContent: React.ReactNode) => React.ReactNode
}

function CalendarMonthGrid({
  monthDate,
  isSecondary = false,
  direction,
  sizes,
  locale,
  localeStrings,
  weekStartsOn,
  showWeekNumbers,
  prefersReducedMotion,
  mode,
  focusedDate,
  rangeStart,
  isDayDisabled,
  isDaySelected,
  isDayInRange,
  getHighlight,
  onSelectDate,
  onRangeHover,
  onFocusDate,
  renderDay
}: CalendarMonthGridProps) {
  const monthStart = startOfMonth(monthDate)
  const monthEnd = endOfMonth(monthDate)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn })
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const weekdaysShort = [...localeStrings.weekdaysShort]
  const weekDays = [...weekdaysShort.slice(weekStartsOn), ...weekdaysShort.slice(0, weekStartsOn)]

  return (
    <div className="space-y-1" role="grid" aria-label={format(monthDate, "MMMM yyyy", { locale })}>
      {isSecondary && (
        <div className="mb-2 flex h-8 items-center justify-center">
          <span className={cn("font-semibold text-foreground", sizes.header)}>
            {format(monthDate, "MMMM yyyy", { locale })}
          </span>
        </div>
      )}

      {/* Week days header */}
      <div
        className={cn("grid gap-0.5", showWeekNumbers ? "grid-cols-8" : "grid-cols-7")}
        role="row"
        tabIndex={-1}
      >
        {showWeekNumbers && (
          <div
            className={cn(
              sizes.cell,
              "flex items-center justify-center text-xs font-medium text-muted-foreground"
            )}
            role="columnheader"
            aria-label="Số tuần"
            tabIndex={-1}
          >
            #
          </div>
        )}
        {weekDays.map((day, i) => (
          <div
            key={day}
            role="columnheader"
            aria-label={localeStrings.weekdays[(weekStartsOn + i) % 7]}
            className={cn(
              sizes.cell,
              "flex items-center justify-center text-xs font-semibold text-muted-foreground"
            )}
            tabIndex={-1}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <AnimatePresence mode="wait" custom={direction}>
        <m.div
          key={format(monthDate, "yyyy-MM")}
          custom={direction}
          variants={prefersReducedMotion ? undefined : slideVariants}
          initial={isSecondary || prefersReducedMotion ? false : "enter"}
          animate="center"
          exit={isSecondary || prefersReducedMotion ? undefined : "exit"}
          transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
          className={cn("grid gap-0.5", showWeekNumbers ? "grid-cols-8" : "grid-cols-7")}
          role="rowgroup"
        >
          {days.map((day, index) => {
            const showWeekNumber = showWeekNumbers && index % 7 === 0
            const isSelected = isDaySelected(day)
            const isTodayDate = isToday(day)
            const isDisabled = isDayDisabled(day)
            const inRange = isDayInRange(day)
            const highlight = getHighlight(day)
            const isFocused = focusedDate ? isSameDay(day, focusedDate) : false

            return (
              <React.Fragment key={day.toISOString()}>
                {showWeekNumber && (
                  <div
                    className={cn(
                      sizes.cell,
                      "flex items-center justify-center text-xs text-muted-foreground"
                    )}
                    role="rowheader"
                    tabIndex={-1}
                  >
                    {format(day, "w")}
                  </div>
                )}
                <CalendarDayCell
                  day={day}
                  monthDate={monthDate}
                  index={index}
                  mode={mode}
                  sizes={sizes}
                  locale={locale}
                  flags={{
                    isSelected,
                    isTodayDate,
                    isDisabled,
                    inRange,
                    isFocused,
                    prefersReducedMotion
                  }}
                  highlight={highlight}
                  rangeStart={rangeStart}
                  onSelectDate={onSelectDate}
                  onRangeHover={onRangeHover}
                  onFocusDate={onFocusDate}
                  renderDay={renderDay}
                />
              </React.Fragment>
            )
          })}
        </m.div>
      </AnimatePresence>
    </div>
  )
}

interface CalendarFooterProps {
  showTodayButton: boolean
  showClearButton: boolean
  mode: CalendarMode
  value?: CalendarValue
  localeStrings: CalendarLocale
  disabled?: boolean
  onGoToToday: () => void
  onClear: () => void
}

function CalendarFooter({
  showTodayButton,
  showClearButton,
  mode,
  value,
  localeStrings,
  disabled,
  onGoToToday,
  onClear
}: CalendarFooterProps) {
  if (!showTodayButton && !showClearButton && !(mode === "multiple" && value)) {
    return null
  }

  return (
    <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3">
      <div className="flex items-center gap-2">
        {showTodayButton && (
          <button
            type="button"
            onClick={onGoToToday}
            disabled={disabled}
            className="flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-accent disabled:opacity-50"
          >
            <CheckIcon className="size-3" />
            {localeStrings.today}
          </button>
        )}
        {mode === "multiple" && Array.isArray(value) && value.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {value.length} {localeStrings.selected}
          </span>
        )}
      </div>
      {showClearButton && value && (
        <button
          type="button"
          onClick={onClear}
          disabled={disabled}
          className="flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent disabled:opacity-50"
        >
          <XIcon className="size-3" />
          {localeStrings.clear}
        </button>
      )}
    </div>
  )
}

interface CalendarDaysViewProps {
  currentMonth: Date
  monthsToShow: number
  commonGridProps: Omit<CalendarMonthGridProps, "monthDate" | "isSecondary">
  prefersReducedMotion: boolean
}

function CalendarDaysView({
  currentMonth,
  monthsToShow,
  commonGridProps,
  prefersReducedMotion
}: CalendarDaysViewProps) {
  return (
    <m.div key="days" {...(prefersReducedMotion ? {} : fadeScale)} className="flex gap-4">
      <CalendarMonthGrid monthDate={currentMonth} {...commonGridProps} />
      {monthsToShow >= 2 && (
        <>
          <div className="w-px bg-border" />
          <CalendarMonthGrid
            monthDate={addMonths(currentMonth, 1)}
            isSecondary
            {...commonGridProps}
          />
        </>
      )}
      {monthsToShow === 3 && (
        <>
          <div className="w-px bg-border" />
          <CalendarMonthGrid
            monthDate={addMonths(currentMonth, 2)}
            isSecondary
            {...commonGridProps}
          />
        </>
      )}
    </m.div>
  )
}

interface CalendarMainViewsProps {
  view: CalendarView
  currentMonth: Date
  monthsToShow: number
  commonGridProps: Omit<CalendarMonthGridProps, "monthDate" | "isSecondary">
  prefersReducedMotion: boolean
  minDate?: Date
  maxDate?: Date
  localeStrings: CalendarLocale
  disabled?: boolean
  mode: CalendarMode
  value?: CalendarValue
  use24Hour: boolean
  minuteStep: number
  size: "sm" | "md" | "lg"
  onMonthSelect: (month: number) => void
  onYearSelect: (year: number) => void
  onTimeChange: (newDate: Date) => void
}

function CalendarMainViews({
  view,
  currentMonth,
  monthsToShow,
  commonGridProps,
  prefersReducedMotion,
  minDate,
  maxDate,
  localeStrings,
  disabled,
  mode,
  value,
  use24Hour,
  minuteStep,
  size,
  onMonthSelect,
  onYearSelect,
  onTimeChange
}: CalendarMainViewsProps) {
  return (
    <AnimatePresence mode="wait">
      {view === "days" && (
        <CalendarDaysView
          currentMonth={currentMonth}
          monthsToShow={monthsToShow}
          commonGridProps={commonGridProps}
          prefersReducedMotion={prefersReducedMotion}
        />
      )}
      {view === "months" && (
        <MonthPicker
          key="months"
          currentMonth={currentMonth}
          onSelect={onMonthSelect}
          minDate={minDate}
          maxDate={maxDate}
          localeStrings={localeStrings}
          disabled={disabled}
          prefersReducedMotion={prefersReducedMotion}
        />
      )}
      {view === "years" && (
        <YearPicker
          key="years"
          currentYear={getYear(currentMonth)}
          onSelect={onYearSelect}
          minDate={minDate}
          maxDate={maxDate}
          disabled={disabled}
          prefersReducedMotion={prefersReducedMotion}
        />
      )}
      {view === "time" && mode === "single" && (
        <TimePicker
          key="time"
          value={value instanceof Date ? value : new Date()}
          onChange={onTimeChange}
          use24Hour={use24Hour}
          minuteStep={minuteStep}
          size={size}
          localeStrings={localeStrings}
          disabled={disabled}
        />
      )}
    </AnimatePresence>
  )
}

interface CalendarTimeToggleButtonsProps {
  view: CalendarView
  showTime: boolean
  mode: CalendarMode
  value?: CalendarValue
  use24Hour: boolean
  localeStrings: CalendarLocale
  disabled?: boolean
  onChange?: (date: CalendarValue | undefined) => void
  onViewChange: (view: CalendarView) => void
}

function CalendarTimeToggleButtons({
  view,
  showTime,
  mode,
  value,
  use24Hour,
  localeStrings,
  disabled,
  onChange,
  onViewChange
}: CalendarTimeToggleButtonsProps) {
  if (showTime && mode === "single" && view === "days") {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          if (!(value instanceof Date)) {
            onChange?.(new Date())
          }
          onViewChange("time")
        }}
        disabled={disabled}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-accent/50 py-2 text-sm font-medium transition-colors hover:bg-accent disabled:opacity-50"
      >
        <ClockIcon className="size-4" />
        {value instanceof Date
          ? format(value, use24Hour ? "HH:mm" : "hh:mm a")
          : localeStrings.selectTime}
      </button>
    )
  }

  if (view === "time") {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onViewChange("days")
        }}
        disabled={disabled}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-accent/50 py-2 text-sm font-medium transition-colors hover:bg-accent disabled:opacity-50"
      >
        <CalendarIcon className="size-4" />
        {localeStrings.backToCalendar}
      </button>
    )
  }

  return null
}

function useCalendarKeyboard({
  calendarRef,
  view,
  disabled,
  readOnly,
  focusedDate,
  value,
  currentMonth,
  isDayDisabled,
  handleSelectDate,
  setFocusedDate,
  setDirection,
  setCurrentMonth,
  announce,
  locale,
  onClose
}: {
  calendarRef: React.RefObject<HTMLDivElement | null>
  view: CalendarView
  disabled?: boolean
  readOnly?: boolean
  focusedDate: Date | null
  value?: CalendarValue
  currentMonth: Date
  isDayDisabled: (day: Date) => boolean
  handleSelectDate: (day: Date) => void
  setFocusedDate: React.Dispatch<React.SetStateAction<Date | null>>
  setDirection: React.Dispatch<React.SetStateAction<number>>
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>
  announce: (message: string) => void
  locale: Locale
  onClose?: () => void
}) {
  const onKeyDown = React.useEffectEvent((e: KeyboardEvent) => {
    if (view !== "days" || disabled || readOnly) return

    const baseDate = focusedDate || (value instanceof Date ? value : new Date())
    let newDate = baseDate
    let handled = true

    switch (e.key) {
      case "ArrowLeft":
        newDate = addDays(baseDate, -1)
        break
      case "ArrowRight":
        newDate = addDays(baseDate, 1)
        break
      case "ArrowUp":
        newDate = addDays(baseDate, -7)
        break
      case "ArrowDown":
        newDate = addDays(baseDate, 7)
        break
      case "Home":
        newDate = startOfMonth(baseDate)
        break
      case "End":
        newDate = endOfMonth(baseDate)
        break
      case "PageUp":
        newDate = e.shiftKey ? subYears(baseDate, 1) : subMonths(baseDate, 1)
        break
      case "PageDown":
        newDate = e.shiftKey ? addYears(baseDate, 1) : addMonths(baseDate, 1)
        break
      case "Enter":
      case " ":
        if (focusedDate && !isDayDisabled(focusedDate)) {
          handleSelectDate(focusedDate)
        }
        e.preventDefault()
        return
      case "Escape":
        onClose?.()
        e.preventDefault()
        return
      default:
        handled = false
    }

    if (handled) {
      e.preventDefault()
      setFocusedDate(newDate)
      if (!isSameMonth(newDate, currentMonth)) {
        setDirection(isAfter(newDate, currentMonth) ? 1 : -1)
        setCurrentMonth(startOfMonth(newDate))
      }
      announce(format(newDate, "EEEE, MMMM d, yyyy", { locale }))
    }
  })

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      onKeyDown(e)
    }

    const el = calendarRef.current
    if (el) {
      el.addEventListener("keydown", handleKeyDown)
      return () => el.removeEventListener("keydown", handleKeyDown)
    }
  }, [calendarRef])
}

function useCalendarSelection({
  mode,
  value,
  showTime,
  closeOnSelect,
  onChange,
  onClose,
  announce,
  locale,
  isDayDisabled
}: {
  mode: CalendarMode
  value?: CalendarValue
  showTime?: boolean
  closeOnSelect?: boolean
  onChange?: (value: CalendarValue | undefined) => void
  onClose?: () => void
  announce: (message: string) => void
  locale: Locale
  isDayDisabled: (day: Date) => boolean
}) {
  const [rangeStart, setRangeStart] = React.useState<Date | undefined>(
    mode === "range" ? (value as DateRange)?.from : undefined
  )
  const [rangeHover, setRangeHover] = React.useState<Date | null>(null)

  const handleSelectDate = (day: Date) => {
    if (isDayDisabled(day)) return

    if (mode === "single") {
      const dateToSet =
        showTime && value instanceof Date
          ? setMinutes(setHours(day, getHours(value)), getMinutes(value))
          : day
      onChange?.(dateToSet)
      announce(`Selected ${format(dateToSet, "PPPP", { locale })}`)
      if (closeOnSelect && !showTime) onClose?.()
    } else if (mode === "range") {
      if (!rangeStart) {
        setRangeStart(day)
        onChange?.({ from: day, to: undefined })
        announce(`Range start: ${format(day, "PP", { locale })}`)
      } else {
        const range = isBefore(day, rangeStart)
          ? { from: day, to: rangeStart }
          : { from: rangeStart, to: day }
        onChange?.(range)
        setRangeStart(undefined)
        announce(
          `Range: ${format(range.from, "PP", { locale })} to ${format(range.to, "PP", { locale })}`
        )
        if (closeOnSelect) onClose?.()
      }
    } else if (mode === "multiple") {
      const currentDates = (value as Date[]) || []
      const exists = currentDates.some((d) => isSameDay(d, day))
      const newDates = exists
        ? currentDates.filter((d) => !isSameDay(d, day))
        : [...currentDates, day]
      onChange?.(newDates)
      announce(
        `${exists ? "Deselected" : "Selected"} ${format(day, "PP", { locale })}. ${newDates.length} dates selected.`
      )
    }
  }

  const isDaySelected = (day: Date): boolean => {
    if (mode === "single" && value instanceof Date) return isSameDay(day, value)
    if (mode === "range" && value) {
      const range = value as DateRange
      return Boolean(
        (range.from && isSameDay(day, range.from)) || (range.to && isSameDay(day, range.to))
      )
    }
    if (mode === "multiple" && Array.isArray(value)) {
      return value.some((d) => isSameDay(d, day))
    }
    return false
  }

  const isDayInRange = (day: Date): boolean => {
    if (mode !== "range") return false
    const range = value as DateRange | undefined

    if (range?.from && range?.to) {
      return Boolean(
        isWithinInterval(day, { start: range.from, end: range.to }) &&
        !isSameDay(day, range.from) &&
        !isSameDay(day, range.to)
      )
    }

    if (rangeStart && rangeHover) {
      const start = isBefore(rangeHover, rangeStart) ? rangeHover : rangeStart
      const end = isBefore(rangeHover, rangeStart) ? rangeStart : rangeHover
      return Boolean(
        isWithinInterval(day, { start, end }) && !isSameDay(day, start) && !isSameDay(day, end)
      )
    }

    return false
  }

  return {
    rangeStart,
    setRangeStart,
    rangeHover,
    setRangeHover,
    handleSelectDate,
    isDaySelected,
    isDayInRange
  }
}

function useCalendarContent({
  value,
  mode,
  disabled,
  readOnly,
  minDate,
  maxDate,
  disabledDates,
  disabledDaysOfWeek,
  disableWeekends,
  disablePastDates,
  disableFutureDates,
  showTime,
  closeOnSelect,
  use24Hour,
  locale,
  onMonthChange,
  onYearChange,
  onViewChange,
  onChange,
  onClose,
  highlightedDates
}: {
  value?: CalendarValue
  mode: CalendarMode
  disabled?: boolean
  readOnly?: boolean
  minDate?: Date
  maxDate?: Date
  disabledDates?: Date[]
  disabledDaysOfWeek?: number[]
  disableWeekends?: boolean
  disablePastDates?: boolean
  disableFutureDates?: boolean
  showTime?: boolean
  closeOnSelect?: boolean
  use24Hour?: boolean
  locale: Locale
  onMonthChange?: (date: Date) => void
  onYearChange?: (date: Date) => void
  onViewChange?: (view: CalendarView) => void
  onChange?: (value: CalendarValue | undefined) => void
  onClose?: () => void
  highlightedDates?: { date: Date; label?: string; color?: string }[]
}) {
  const getInitialDate = () => {
    if (!value) return new Date()
    if (mode === "single" && value instanceof Date) return value
    if (mode === "range") return (value as DateRange).from || new Date()
    if (mode === "multiple" && Array.isArray(value)) return value[0] || new Date()
    return new Date()
  }

  const [currentMonth, setCurrentMonth] = React.useState(getInitialDate)
  const [direction, setDirection] = React.useState(0)
  const [view, setView] = React.useState<CalendarView>("days")
  const [focusedDate, setFocusedDate] = React.useState<Date | null>(null)
  const calendarRef = React.useRef<HTMLDivElement>(null)
  const announcerRef = React.useRef<HTMLDivElement>(null)

  const announce = (message: string) => {
    if (announcerRef.current) {
      announcerRef.current.textContent = message
    }
  }

  const handleViewChange = (newView: CalendarView) => {
    setView(newView)
    onViewChange?.(newView)
    announce(`Switched to ${newView} view`)
  }

  const navigate = (delta: number, type: "month" | "year") => {
    setDirection(delta)
    const newDate =
      type === "month"
        ? delta > 0
          ? addMonths(currentMonth, 1)
          : subMonths(currentMonth, 1)
        : delta > 0
          ? addYears(currentMonth, 1)
          : subYears(currentMonth, 1)

    setCurrentMonth(newDate)
    if (type === "month") onMonthChange?.(newDate)
    else onYearChange?.(newDate)
    announce(format(newDate, "MMMM yyyy", { locale }))
  }

  const isDayDisabled = (day: Date) => {
    if (disabled || readOnly) return true
    const dayStart = startOfDay(day)
    const today = startOfDay(new Date())

    if (minDate && isBefore(dayStart, startOfDay(minDate))) return true
    if (maxDate && isAfter(dayStart, startOfDay(maxDate))) return true
    if (disabledDates?.some((d) => isSameDay(d, day))) return true
    if (disableWeekends && isWeekend(day)) return true
    if (disabledDaysOfWeek?.includes(getDay(day))) return true
    if (disablePastDates && isBefore(dayStart, today)) return true
    if (disableFutureDates && isAfter(dayStart, today)) return true

    return false
  }

  const {
    rangeStart,
    setRangeStart,
    setRangeHover,
    handleSelectDate,
    isDaySelected,
    isDayInRange
  } = useCalendarSelection({
    mode,
    value,
    showTime,
    closeOnSelect,
    onChange,
    onClose,
    announce,
    locale,
    isDayDisabled
  })

  useCalendarKeyboard({
    calendarRef,
    view,
    disabled,
    readOnly,
    focusedDate,
    value,
    currentMonth,
    isDayDisabled,
    handleSelectDate,
    setFocusedDate,
    setDirection,
    setCurrentMonth,
    announce,
    locale,
    onClose
  })

  const handleClear = () => {
    onChange?.(undefined)
    setRangeStart(undefined)
    announce("Selection cleared")
  }

  const handlePresetSelect = (range: DateRange) => {
    onChange?.(range)
    if (range.from) setCurrentMonth(range.from)
    announce(
      `Selected: ${range.from && range.to ? `${format(range.from, "PP")} to ${format(range.to, "PP")}` : "preset"}`
    )
    if (closeOnSelect) onClose?.()
  }

  const handleMonthSelect = (month: number) => {
    const newDate = setMonth(currentMonth, month)
    setCurrentMonth(newDate)
    handleViewChange("days")
    onMonthChange?.(newDate)
  }

  const handleYearSelect = (year: number) => {
    const newDate = setYear(currentMonth, year)
    setCurrentMonth(newDate)
    handleViewChange("months")
    onYearChange?.(newDate)
  }

  const handleTimeChange = (newDate: Date) => {
    if (mode === "single") {
      const baseDate = value instanceof Date ? value : startOfDay(new Date())
      const updatedDate = setMinutes(setHours(baseDate, getHours(newDate)), getMinutes(newDate))
      onChange?.(updatedDate)
      announce(`Time set to ${format(updatedDate, use24Hour ? "HH:mm" : "hh:mm a")}`)
    }
  }

  const goToToday = () => {
    const today = new Date()
    setDirection(isAfter(today, currentMonth) ? 1 : -1)
    setCurrentMonth(today)
    if (mode === "single" && !isDayDisabled(today)) {
      handleSelectDate(today)
    }
  }

  const getHighlight = (day: Date) => highlightedDates?.find((h) => isSameDay(h.date, day))

  return {
    calendarRef,
    announcerRef,
    currentMonth,
    direction,
    view,
    focusedDate,
    rangeStart,
    navigate,
    handleViewChange,
    handleClear,
    handlePresetSelect,
    handleMonthSelect,
    handleYearSelect,
    handleTimeChange,
    goToToday,
    isDayDisabled,
    isDaySelected,
    isDayInRange,
    getHighlight,
    handleSelectDate,
    setRangeHover,
    setFocusedDate
  }
}

function CalendarContent(
  props: InternalCalendarProps & {
    onClose?: () => void
    localeStrings: CalendarLocale
  }
) {
  const {
    mode = "single",
    value,
    onChange,
    minDate,
    maxDate,
    disabledDates = [],
    disabledDaysOfWeek = [],
    disableWeekends = false,
    disablePastDates = false,
    disableFutureDates = false,
    showTime = false,
    use24Hour = true,
    minuteStep = 5,
    showWeekNumbers = false,
    showTodayButton = true,
    showClearButton = true,
    weekStartsOn = 0,
    monthsToShow = 1,
    showPresets = false,
    presets = defaultPresets,
    highlightedDates = [],
    closeOnSelect = true,
    size = "md",
    disabled = false,
    readOnly = false,
    localeStrings = defaultLocaleStrings,
    locale = enUS,
    onMonthChange,
    onYearChange,
    onViewChange,
    renderDay,
    onClose,
    id
  } = props

  const prefersReducedMotion = useReducedMotion() ?? false
  const sizes = sizeClasses[size]
  const calendarWidth =
    monthsToShow === 1 ? "w-auto" : monthsToShow === 2 ? "min-w-[580px]" : "min-w-[860px]"

  const {
    calendarRef,
    announcerRef,
    currentMonth,
    direction,
    view,
    focusedDate,
    rangeStart,
    navigate,
    handleViewChange,
    handleClear,
    handlePresetSelect,
    handleMonthSelect,
    handleYearSelect,
    handleTimeChange,
    goToToday,
    isDayDisabled,
    isDaySelected,
    isDayInRange,
    getHighlight,
    handleSelectDate,
    setRangeHover,
    setFocusedDate
  } = useCalendarContent({
    value,
    mode,
    disabled,
    readOnly,
    minDate,
    maxDate,
    disabledDates,
    disabledDaysOfWeek,
    disableWeekends,
    disablePastDates,
    disableFutureDates,
    showTime,
    closeOnSelect,
    use24Hour,
    locale,
    onMonthChange,
    onYearChange,
    onViewChange,
    onChange,
    onClose,
    highlightedDates
  })

  const commonGridProps = {
    direction,
    sizes,
    locale,
    localeStrings,
    weekStartsOn,
    showWeekNumbers,
    prefersReducedMotion,
    mode,
    focusedDate,
    rangeStart,
    isDayDisabled,
    isDaySelected,
    isDayInRange,
    getHighlight,
    onSelectDate: handleSelectDate,
    onRangeHover: setRangeHover,
    onFocusDate: setFocusedDate,
    renderDay
  }

  return (
    <m.div
      ref={calendarRef}
      id={id}
      tabIndex={0}
      role="application"
      aria-label="Calendar"
      initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
      className={cn(
        "pointer-events-auto overflow-hidden rounded-lg border bg-card shadow-xl shadow-black/10 focus:outline-none",
        sizes.container,
        calendarWidth,
        showPresets && mode === "range" && "flex",
        disabled && "pointer-events-none opacity-50"
      )}
    >
      <div
        ref={announcerRef}
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      />

      {showPresets && mode === "range" && (
        <PresetsPanel presets={presets} onSelect={handlePresetSelect} disabled={disabled} />
      )}

      <div className="flex-1">
        <CalendarHeader
          currentMonth={currentMonth}
          view={view}
          sizes={sizes}
          locale={locale}
          disabled={disabled}
          onNavigate={navigate}
          onViewChange={handleViewChange}
        />

        <CalendarMainViews
          view={view}
          currentMonth={currentMonth}
          monthsToShow={monthsToShow}
          commonGridProps={commonGridProps}
          prefersReducedMotion={prefersReducedMotion}
          minDate={minDate}
          maxDate={maxDate}
          localeStrings={localeStrings}
          disabled={disabled}
          mode={mode}
          value={value}
          use24Hour={use24Hour}
          minuteStep={minuteStep}
          size={size}
          onMonthSelect={handleMonthSelect}
          onYearSelect={handleYearSelect}
          onTimeChange={handleTimeChange}
        />

        <CalendarTimeToggleButtons
          view={view}
          showTime={showTime}
          mode={mode}
          value={value}
          use24Hour={use24Hour}
          localeStrings={localeStrings}
          disabled={disabled}
          onChange={onChange}
          onViewChange={handleViewChange}
        />

        {view === "days" && (
          <CalendarFooter
            showTodayButton={showTodayButton}
            showClearButton={showClearButton}
            mode={mode}
            value={value}
            localeStrings={localeStrings}
            disabled={disabled}
            onGoToToday={goToToday}
            onClear={handleClear}
          />
        )}
      </div>
    </m.div>
  )
}

// ============================================================================
// POPOVER CALENDAR
// ============================================================================

interface CalendarDisplayValueOptions {
  value: InternalCalendarValue
  mode: CalendarMode
  placeholder: string
  formatStr?: string
  showTime?: boolean
  use24Hour: boolean
  locale: Locale
}

function getSingleDisplayValue({
  value,
  placeholder,
  formatStr,
  showTime,
  use24Hour,
  locale
}: Omit<CalendarDisplayValueOptions, "mode">) {
  if (!(value instanceof Date)) return placeholder

  const fmt = formatStr || (showTime ? (use24Hour ? "PPP HH:mm" : "PPP hh:mm a") : "PPP")
  return format(value, fmt, { locale })
}

function getRangeDisplayValue({
  value,
  placeholder,
  locale
}: Pick<CalendarDisplayValueOptions, "value" | "placeholder" | "locale">) {
  const range = value as DateRange | undefined
  if (!range?.from) return placeholder
  if (!range.to) return `${format(range.from, "MMM d, yyyy", { locale })} – ...`

  return `${format(range.from, "MMM d", { locale })} – ${format(range.to, "MMM d, yyyy", { locale })}`
}

function getMultipleDisplayValue({
  value,
  placeholder,
  locale
}: Pick<CalendarDisplayValueOptions, "value" | "placeholder" | "locale">) {
  if (!Array.isArray(value) || value.length === 0) return placeholder

  const firstDate = value[0]
  if (value.length === 1 && firstDate) return format(firstDate, "PPP", { locale })

  return `${value.length} dates selected`
}

function getCalendarDisplayValue(options: CalendarDisplayValueOptions) {
  if (!options.value) return options.placeholder

  if (options.mode === "single") return getSingleDisplayValue(options)
  if (options.mode === "range") return getRangeDisplayValue(options)
  if (options.mode === "multiple") return getMultipleDisplayValue(options)

  return options.placeholder
}

function getDefaultCalendarValue(defaultValue: InternalCalendarValue, mode: CalendarMode) {
  return defaultValue ?? (mode === "multiple" ? [] : undefined)
}

function syncCalendarOpenChange({
  open,
  setIsOpen,
  onOpen,
  onClose,
  onFocus,
  onBlur
}: {
  open: boolean
  setIsOpen: (open: boolean) => void
  onOpen?: () => void
  onClose?: () => void
  onFocus?: () => void
  onBlur?: () => void
}) {
  setIsOpen(open)
  if (open) {
    onOpen?.()
    onFocus?.()
    return
  }

  onClose?.()
  onBlur?.()
}

function serializeCalendarFormValue(value: InternalCalendarValue) {
  if (!value) return ""
  if (value instanceof Date) return value.toISOString()

  return JSON.stringify(value)
}

interface CalendarTriggerButtonProps {
  triggerId: string
  size: CalendarSize
  disabled: boolean
  readOnly: boolean
  required: boolean
  error: boolean
  hasErrorMessage: boolean
  errorId: string
  ariaLabel?: string
  ariaDescribedBy?: string
  placeholder: string
  value: InternalCalendarValue
  displayValue: string
  isOpen: boolean
  className?: string
}

function CalendarTriggerButton({
  triggerId,
  size,
  disabled,
  readOnly,
  required,
  error,
  hasErrorMessage,
  errorId,
  ariaLabel,
  ariaDescribedBy,
  placeholder,
  value,
  displayValue,
  isOpen,
  className
}: CalendarTriggerButtonProps) {
  return (
    <Button
      id={triggerId}
      type="button"
      variant="outline"
      disabled={disabled}
      aria-label={ariaLabel || placeholder}
      aria-describedby={cn(ariaDescribedBy, error && hasErrorMessage && errorId)}
      aria-invalid={error}
      aria-required={required}
      aria-expanded={isOpen}
      aria-haspopup="dialog"
      className={cn(
        triggerSizeClasses[size],
        "justify-start gap-1! text-left font-normal",
        !value && "text-muted-foreground",
        error && "border-destructive focus:ring-destructive",
        readOnly && "pointer-events-none",
        className
      )}
    >
      <CalendarIcon className="mr-2 size-4.5 shrink-0 text-muted-foreground" />
      <span className="flex-1 truncate">{displayValue}</span>
      {required && <span className="ml-1 text-destructive">*</span>}
    </Button>
  )
}

function CalendarFormInput({ name, value }: { name?: string; value: InternalCalendarValue }) {
  return name ? <input type="hidden" name={name} value={serializeCalendarFormValue(value)} /> : null
}

function CalendarErrorMessage({
  errorId,
  error,
  errorMessage
}: {
  errorId: string
  error: boolean
  errorMessage?: string
}) {
  return error && errorMessage ? (
    <p id={errorId} className="mt-1.5 flex items-center gap-1 text-xs text-destructive">
      <AlertCircleIcon className="size-3" />
      {errorMessage}
    </p>
  ) : null
}

export function AnimatedCalendar({
  mode = "single",
  "value": controlledValue,
  defaultValue,
  onChange,
  placeholder = "Pick a date",
  disabled = false,
  readOnly = false,
  required = false,
  error = false,
  errorMessage,
  className,
  size = "md",
  formatStr,
  showTime,
  use24Hour = true,
  locale = enUS,
  "localeStrings": customLocaleStrings,
  onOpen,
  onClose,
  onBlur,
  onFocus,
  id,
  name,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
  ...props
}: AnimatedCalendarProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const generatedId = React.useId()
  const triggerId = id || generatedId
  const errorId = `${triggerId}-error`

  const localeStrings = {
    ...defaultLocaleStrings,
    ...customLocaleStrings
  }

  // Internal state uses unified type for implementation
  const [value, setValue] = useControllableState<InternalCalendarValue>(
    controlledValue as InternalCalendarValue,
    getDefaultCalendarValue(defaultValue as InternalCalendarValue, mode),
    onChange as ((value: InternalCalendarValue) => void) | undefined
  )

  const handleOpenChange = (open: boolean) => {
    syncCalendarOpenChange({ open, setIsOpen, onOpen, onClose, onFocus, onBlur })
  }

  const displayValue = getCalendarDisplayValue({
    value,
    mode,
    placeholder,
    formatStr,
    showTime,
    use24Hour,
    locale
  })

  return (
    <div className="relative">
      <Popover open={isOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger
          render={
            <CalendarTriggerButton
              triggerId={triggerId}
              size={size}
              disabled={disabled}
              readOnly={readOnly}
              required={required}
              error={error}
              hasErrorMessage={Boolean(errorMessage)}
              errorId={errorId}
              ariaLabel={ariaLabel}
              ariaDescribedBy={ariaDescribedBy}
              placeholder={placeholder}
              value={value}
              displayValue={displayValue}
              isOpen={isOpen}
              className={className}
            />
          }
        />
        <PopoverContent className="w-auto border-0 bg-transparent p-0 shadow-none" align="start">
          <CalendarContent
            {...(props as InternalCalendarProps)}
            mode={mode}
            value={value as Date | DateRange | Date[] | undefined}
            onChange={setValue as (value: Date | DateRange | Date[] | undefined) => void}
            disabled={disabled}
            readOnly={readOnly}
            showTime={showTime}
            use24Hour={use24Hour}
            size={size}
            locale={locale}
            localeStrings={localeStrings as CalendarLocale}
            onClose={() => handleOpenChange(false)}
          />
        </PopoverContent>
      </Popover>

      {/* Hidden input for form integration */}
      <CalendarFormInput name={name} value={value} />

      {/* Error message */}
      <CalendarErrorMessage errorId={errorId} error={error} errorMessage={errorMessage} />
    </div>
  )
}

// ============================================================================
// STANDALONE CALENDAR
// ============================================================================

export function AnimatedCalendarStandalone({
  localeStrings: customLocaleStrings,
  ...props
}: Omit<AnimatedCalendarProps, "placeholder" | "onOpen" | "onClose" | "onBlur" | "onFocus">) {
  const localeStrings = {
    ...defaultLocaleStrings,
    ...customLocaleStrings
  }

  return (
    <CalendarContent
      {...(props as InternalCalendarProps)}
      localeStrings={localeStrings as CalendarLocale}
    />
  )
}
