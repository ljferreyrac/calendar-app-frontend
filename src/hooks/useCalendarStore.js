import { useDispatch, useSelector } from "react-redux"
import { onAddNewEvent, onDeleteEvent, onLoadEvents, onSetActiveEvent, onUpdateEvent } from "./../store/calendar/calendarSlice";
import { calendarAPI } from "../api";
import { convertEventsToDateEvents } from "../helpers";
import Swal from "sweetalert2";

export const useCalendarStore = () => {

    const dispatch = useDispatch();
    const { events, activeEvent } = useSelector( state => state.calendar ) 
    const { user } = useSelector( state => state.auth );

    const setActiveEvent = ( calendarEvent ) => {
        dispatch( onSetActiveEvent( calendarEvent ) );
    }
    
    const startSavingEvent = async( calendarEvent ) => {

        try {
            if( calendarEvent.id ) {
                //Actualizando
                await calendarAPI.put(`/events/${calendarEvent.id}`, calendarEvent)
                dispatch( onUpdateEvent( {...calendarEvent, user} ))
                return;
            }
    
            //Creando
            const { data } = await calendarAPI.post('/events', calendarEvent);
            dispatch( onAddNewEvent( {...calendarEvent, id: data.event.id, user} ) );
        } catch (error) {
            console.log(error);
            Swal.fire('Error while saving', error.response.data.msg, 'error');
        }

    }

    const startDeletingEvent = async () => {
        try {
            await calendarAPI.delete(`/events/${activeEvent.id}`)
            dispatch( onDeleteEvent() );
        } catch (error) {
            console.log(error);
            Swal.fire('Error while deleting', error.response.data.msg, 'error');
        }
    }

    const startLoadingEvents = async () => {
        try {
            const { data } = await calendarAPI.get('/events');
            const events = convertEventsToDateEvents( data.events )
            dispatch( onLoadEvents( events ) );
        } catch (error) {
            console.log(error);
        }
    }

    return {
        //* Propiedades
        events,
        activeEvent,
        hasEventSelected: !!activeEvent,
        
        //* Métodos
        setActiveEvent,
        startSavingEvent,
        startDeletingEvent,
        startLoadingEvents
    }
}