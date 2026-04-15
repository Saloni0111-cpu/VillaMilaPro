import { Component, signal, HostListener, OnInit } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {

  constructor(private fb: FormBuilder) { }

  searchForm!: FormGroup

  locationOpen = signal(false)
  dateOpen = signal(false)
  guestOpen = signal(false)

  locations = ['Karjat', 'Lonavala', 'Alibaug', 'Mahabaleshwar', 'Goa']

  days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

  startDate: Date | null = null;
  endDate: Date | null = null;

  currentMonth = new Date()

  monthOne: Date[] = []
  monthTwo: Date[] = []

  monthOneName = ''
  monthTwoName = ''

  startTime: number | null = null
  endTime: number | null = null

  ngOnInit() {

    this.searchForm = this.fb.group({
      location: [''],
      checkin: [''],
      checkout: [''],
      guests: [2],
      children: [0],
      rooms: [1]
    })

    this.generateCalendar()
  }

  generateCalendar() {

    this.monthOne = []
    this.monthTwo = []

    const start = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1)

    this.monthOneName = start.toLocaleString('default', { month: 'long', year: 'numeric' })

    let firstDay = start.getDay()

    for (let i = 0; i < firstDay; i++) {
      this.monthOne.push(null as any)
    }

    for (let i = 0; i < 31; i++) {
      const d = new Date(start)
      d.setDate(i + 1)
      if (d.getMonth() !== start.getMonth()) break
      this.monthOne.push(d)
    }

    const next = new Date(start)
    next.setMonth(next.getMonth() + 1)

    this.monthTwoName = next.toLocaleString('default', { month: 'long', year: 'numeric' })

    let firstDay2 = next.getDay()

    for (let i = 0; i < firstDay2; i++) {
      this.monthTwo.push(null as any)
    }

    for (let i = 0; i < 31; i++) {
      const d = new Date(next)
      d.setDate(i + 1)
      if (d.getMonth() !== next.getMonth()) break
      this.monthTwo.push(d)
    }
  }

  prevMonth() {
    this.currentMonth.setMonth(this.currentMonth.getMonth() - 1)
    this.generateCalendar()
  }

  nextMonth() {
    this.currentMonth.setMonth(this.currentMonth.getMonth() + 1)
    this.generateCalendar()
  }

  selectDate(date: Date) {

    if (!this.startDate || this.endDate) {
      this.startDate = date;
      this.endDate = null;

      this.startTime = date.getTime();
      this.endTime = null;
      return;
    }

    if (date > this.startDate) {
      this.endDate = date
      this.endTime = date.getTime();
    }
  }

  formatDisplayDate(date: Date): string {
    const d = String(date.getDate()).padStart(2, '0')
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const y = date.getFullYear()
    return `${d}/${m}/${y}`
  }

  isStart(date: Date) {
    return this.startTime === date.getTime()
  }

  isEnd(date: Date) {
    return this.endTime === date.getTime()
  }

  inRange(date: Date) {
    if (!this.startTime || !this.endTime) return false
    const t = date.getTime()
    return t > this.startTime && t < this.endTime
  }

  isPast(date: Date) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  isToday(date: Date) {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  clearDates() {
    this.startDate = null
    this.endDate = null
    this.startTime = null
    this.endTime = null
  }

  applyDates() {

    if (this.startDate) {
      this.searchForm.patchValue({
        checkin: this.formatDate(this.startDate)
      })
    }

    if (this.endDate) {
      this.searchForm.patchValue({
        checkout: this.formatDate(this.endDate)
      })
    }

    this.dateOpen.set(false)
  }

  formatDate(date: Date) {
    return date.toISOString().split('T')[0]
  }

  onManualDateChange(event: Event, type: 'start' | 'end') {
    const input = (event.target as HTMLInputElement).value.trim()

    const [d, m, y] = input.split('/').map(Number)
    if (!d || !m || !y) return
    const newDate = new Date(y, m - 1, d)

    newDate.setHours(0, 0, 0, 0)

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (newDate < today) return

    if (type === 'start') {
      this.startDate = newDate
      this.startTime = newDate.getTime()
      if (this.endDate && this.endDate < newDate) {
        this.endDate = null;
        this.endTime = null;
      }

    } else {
      if (!this.startDate) return

      if (newDate >= this.startDate) {
        this.endDate = newDate
        this.endTime = newDate.getTime()
      }
    }
  }

  selectLocation(city: string) {
    this.searchForm.patchValue({ location: city })
    this.locationOpen.set(false)
  }

  increaseGuest() {
    this.searchForm.patchValue({ guests: this.searchForm.value.guests + 1 })
  }

  decreaseGuest() {
    if (this.searchForm.value.guests > 1) {
      this.searchForm.patchValue({ guests: this.searchForm.value.guests - 1 })
    }
  }

  increaseChildren() {
    this.searchForm.patchValue({ children: this.searchForm.value.children + 1 })
  }

  decreaseChildren() {
    if (this.searchForm.value.children > 0) {
      this.searchForm.patchValue({ children: this.searchForm.value.children - 1 })
    }
  }

  increaseRooms() {
    this.searchForm.patchValue({ rooms: this.searchForm.value.rooms + 1 })
  }

  decreaseRooms() {
    if (this.searchForm.value.rooms > 1) {
      this.searchForm.patchValue({ rooms: this.searchForm.value.rooms - 1 })
    }
  }

  resetGuests() {
    this.searchForm.patchValue({
      guests: 2,
      children: 0,
      rooms: 1
    })
  }

  toggleLocation() {
    this.locationOpen.update(v => !v)
    this.dateOpen.set(false)
    this.guestOpen.set(false)
  }

  toggleDate() {
    this.dateOpen.update(v => !v)
    this.locationOpen.set(false)
    this.guestOpen.set(false)
  }

  toggleGuest() {
    this.guestOpen.update(v => !v)
    this.locationOpen.set(false)
    this.dateOpen.set(false)
  }

  @HostListener('document:click', ['$event'])
  closeMenus(event: Event) {
    const target = event.target as HTMLElement
    if (!target.closest('.search-bar-pill')) {
      this.locationOpen.set(false)
      this.dateOpen.set(false)
      this.guestOpen.set(false)
    }
  }
}