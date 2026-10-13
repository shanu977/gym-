import type { TrainerBooking, TrainerBookingSessionType, TrainerBookingStatus, TrainerSnapshot } from '../types'

export const DEMO_TRAINER_BOOKINGS_KEY = 'iron-peak-demo-trainer-bookings'
export const LAST_TRAINER_BOOKING_KEY = 'iron-peak-last-trainer-booking'
const statuses: TrainerBookingStatus[] = ['confirmed', 'completed', 'cancelled']
const sessionTypes: TrainerBookingSessionType[] = ['Personal Training', 'Strength Coaching', 'Weight Loss Coaching', 'Nutrition Guidance', 'Mobility & Recovery']

function isRecord(value: unknown): value is Record<string, unknown> { return Boolean(value && typeof value === 'object') }
function stringValue(value: unknown, fallback = ''): string { return typeof value === 'string' ? value : fallback }
function numberValue(value: unknown, fallback = 0): number { return typeof value === 'number' && Number.isFinite(value) ? value : fallback }
function validDate(value: unknown): value is string { return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(`${value}T00:00:00`).getTime()) }
function validDateTime(value: unknown): value is string { return typeof value === 'string' && !Number.isNaN(new Date(value).getTime()) }
function normalizeSnapshot(value: unknown): TrainerSnapshot | null {
  if (!isRecord(value) || typeof value.id !== 'string' || typeof value.name !== 'string' || typeof value.image !== 'string') return null
  return { id: value.id, name: value.name, image: value.image, specialization: stringValue(value.specialization, 'Iron Peak trainer') }
}

export function normalizeTrainerBooking(value: unknown): TrainerBooking | null {
  if (!isRecord(value) || typeof value.id !== 'string' || typeof value.customerId !== 'string' || !value.customerId || !validDate(value.bookingDate) || !validDateTime(value.createdAt)) return null
  const trainer = normalizeSnapshot(value.trainer)
  if (!trainer || typeof value.startTime !== 'string' || typeof value.endTime !== 'string') return null
  const sessionType = sessionTypes.includes(value.sessionType as TrainerBookingSessionType) ? value.sessionType as TrainerBookingSessionType : null
  if (!sessionType) return null
  const status = statuses.includes(value.status as TrainerBookingStatus) ? value.status as TrainerBookingStatus : 'confirmed'
  const duration = numberValue(value.duration, 60)
  if (!Number.isFinite(duration) || duration <= 0 || duration > 240) return null
  return { id: value.id, customerId: value.customerId, trainer, sessionType, bookingDate: value.bookingDate, startTime: value.startTime, endTime: value.endTime, duration, status, customerNotes: stringValue(value.customerNotes).slice(0, 1000), customerGoal: stringValue(value.customerGoal).slice(0, 120), createdAt: value.createdAt }
}

function readBookings(): TrainerBooking[] {
  if (typeof window === 'undefined') return []
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(DEMO_TRAINER_BOOKINGS_KEY) ?? '[]')
    if (!Array.isArray(parsed)) return []
    const seen = new Set<string>(); const bookings: TrainerBooking[] = []
    for (const value of parsed) { const booking = normalizeTrainerBooking(value); if (booking && !seen.has(booking.id)) { seen.add(booking.id); bookings.push(booking) } }
    return bookings
  } catch { return [] }
}

export function getAllTrainerBookings(): TrainerBooking[] { return readBookings() }
export function getTrainerBookingsForCustomer(customerId: string): TrainerBooking[] { return customerId ? readBookings().filter((booking) => booking.customerId === customerId).sort((a, b) => new Date(`${b.bookingDate}T${b.startTime}`).getTime() - new Date(`${a.bookingDate}T${a.startTime}`).getTime()) : [] }
export function getTrainerBookingById(id: string): TrainerBooking | undefined { return id ? readBookings().find((booking) => booking.id === id) : undefined }
export function isDuplicateTrainerBooking(customerId: string, trainerId: string, bookingDate: string, startTime: string): boolean { return readBookings().some((booking) => booking.customerId === customerId && booking.trainer.id === trainerId && booking.bookingDate === bookingDate && booking.startTime === startTime && booking.status !== 'cancelled') }
export function saveTrainerBooking(booking: TrainerBooking): boolean {
  const normalized = normalizeTrainerBooking(booking)
  if (!normalized || typeof window === 'undefined') return false
  try {
    const bookings = readBookings().filter((entry) => entry.id !== normalized.id)
    window.localStorage.setItem(DEMO_TRAINER_BOOKINGS_KEY, JSON.stringify([...bookings, normalized]))
    window.localStorage.setItem(LAST_TRAINER_BOOKING_KEY, normalized.id)
    return true
  } catch { return false }
}
export function getLastTrainerBooking(): TrainerBooking | undefined {
  if (typeof window === 'undefined') return undefined
  try { return getTrainerBookingById(window.localStorage.getItem(LAST_TRAINER_BOOKING_KEY) ?? '') } catch { return undefined }
}
export function createTrainerBookingId(): string { return `IPF-TRN-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${Math.random().toString(36).slice(2, 6).toUpperCase()}` }
