import { fireEvent, render, screen } from "@testing-library/react"
import { FabDelete } from "../../../src/calendar/components/FabDelete"
import { useCalendarStore } from "../../../src/hooks/useCalendarStore";
import { useUiStore } from "../../../src/hooks/useUiStore";

jest.mock('../../../src/hooks/useCalendarStore');
jest.mock('../../../src/hooks/useUiStore');

describe('Pruebas en <FabDelete/>', () => {
    
    const mockStarDeletingEvent = jest.fn();

    beforeAll(() => jest.clearAllMocks());

    test('should show the component correctly', () => {
        useUiStore.mockReturnValue({
            isDateModalOpen: false
        })
        useCalendarStore.mockReturnValue({
            hasEventSelected: false
        })
        render(
            <FabDelete/>
        );
        const btn = screen.getByLabelText('btn-delete');
        expect(btn.classList).toContain('btn');
        expect(btn.classList).toContain('btn-danger');
        expect(btn.classList).toContain('fab-danger');
        expect(btn.style.display).toBe('none');
    });

    test('should show button if there is an active event and modal is not open', () => {
        useUiStore.mockReturnValue({
            isDateModalOpen: false
        })
        useCalendarStore.mockReturnValue({
            hasEventSelected: true
        })
        render(
            <FabDelete/>
        );
        const btn = screen.getByLabelText('btn-delete');

        expect(btn.style.display).toBe('');
    });

    test('should not show button if there is an active event and modal is open', () => {
        useUiStore.mockReturnValue({
            isDateModalOpen: true
        })
        useCalendarStore.mockReturnValue({
            hasEventSelected: true
        })
        render(
            <FabDelete/>
        );
        const btn = screen.getByLabelText('btn-delete');

        expect(btn.style.display).toBe('none');
    });

    test('should call startDeletingEvent on click', () => {
        useUiStore.mockReturnValue({
            isDateModalOpen: false
        })
        useCalendarStore.mockReturnValue({
            hasEventSelected: true,
            startDeletingEvent: mockStarDeletingEvent
        })
        render(
            <FabDelete/>
        );
        const btn = screen.getByLabelText('btn-delete');

        fireEvent.click(btn);

        expect(mockStarDeletingEvent).toHaveBeenCalled();
    });  
})