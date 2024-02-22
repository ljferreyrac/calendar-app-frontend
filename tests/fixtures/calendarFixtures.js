export const events = [
    {
        id: '1',
        start: new Date('2024-10-21 13:00:00'),
        end: new Date('2024-10-21 15:00:00'),
        title: 'Cumpleaños de Leonardo',
        notes: 'Alguna nota',
    },
    {
        id: '2',
        start: new Date('2024-11-09 13:00:00'),
        end: new Date('2024-11-09 15:00:00'),
        title: 'Cumpleaños de Andrea',
        notes: 'Alguna nota de Andrea',
    },
]

export const calendarInitialState = {
    isLoadingEvents: true,
    events: [],
    activeEvent: null
}

export const calendarWithEvents = {
    isLoadingEvents: false,
    events: [ ...events ],
    activeEvent: null
}

export const calendarWithActiveEvent = {
    isLoadingEvents: false,
    events: [ ...events ],
    activeEvent: { ...events[0] }
}