import { calendarSlice, onAddNewEvent, onDeleteEvent, onLoadEvents, onLogoutCalendar, onSetActiveEvent, onUpdateEvent } from "../../../src/store/calendar/calendarSlice"
import { calendarInitialState, calendarWithActiveEvent, calendarWithEvents, events } from "../../fixtures/calendarFixtures";

describe('Pruebas en el calendarSlice', () => { 
    test('should return default state', () => { 
        let state = calendarSlice.getInitialState();
        expect( state ).toEqual( calendarInitialState ); 
    }); 

    test('onSetActiveEvent should active the event', () => { 
        let state = calendarSlice.reducer( calendarWithEvents, onSetActiveEvent( events[0] ) );
        expect( state.activeEvent ).toEqual( events[0] ); 
    });

    test('onAddNewEvent should add the event', () => {
        const newEvent = {
            id: '3',
            start: new Date('2024-12-21 13:00:00'),
            end: new Date('2024-12-21 15:00:00'),
            title: 'Cumpleaños de Leonardo!!',
            notes: 'Alguna nota!!',
        } 
        let state = calendarSlice.reducer( calendarWithEvents, onAddNewEvent( newEvent ) );
        expect( state.events ).toEqual( [...events, newEvent] );
    });

    test('onUpdateEvent should update the event', () => {
        const updatedEvent = {
            id: '1',
            start: new Date('2024-12-21 13:00:00'),
            end: new Date('2024-12-21 15:00:00'),
            title: 'Cumpleaños de Leonardo actualizado',
            notes: 'Alguna nota actualizada',
        } 
        let state = calendarSlice.reducer( calendarWithEvents, onUpdateEvent( updatedEvent ) );
        expect( state.events ).toContain(updatedEvent)
    });

    test('onDeleteEvent should delete the event', () => {
        let state = calendarSlice.reducer( calendarWithActiveEvent, onDeleteEvent() );
        expect( state.activeEvent ).toBe(null)
        expect( state.events.length ).toBe(events.length - 1)
        expect( state.events ).not.toContain(events[0])
    });

    test('onLoadEvents should set the events', () => {
        let state = calendarSlice.reducer( calendarInitialState, onLoadEvents( events ) );
        expect( state.isLoadingEvents ).toBeFalsy()
        expect( state.events.length ).toBeGreaterThan(0)
        expect( state.events ).toEqual(events)
    });

    test('onLogoutCalendar should clear the state', () => {
        let state = calendarSlice.reducer( calendarWithActiveEvent, onLogoutCalendar() );
        expect( state ).toEqual(calendarInitialState)
    });
})