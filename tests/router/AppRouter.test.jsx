import { render, screen } from "@testing-library/react";
import { useAuthStore } from "../../src/hooks/useAuthStore"
import { AppRouter } from "../../src/router/AppRouter";
import { CalendarPage } from "../../src/calendar";

jest.mock('../../src/hooks/useAuthStore');
jest.mock('../../src/calendar', () => ({
    CalendarPage: () => <h1>CalendarPage</h1>
}))

describe('Pruebas en <AppRouter/>', () => {
    const mockCheckAuthToken = jest.fn();
    beforeEach(() => jest.clearAllMocks());
    test('should show loading screen and call checkAuthToken', () => { 
        jest.fn().mockReturnValue
        useAuthStore.mockReturnValue({
            status: 'checking',
            checkAuthToken: mockCheckAuthToken
        })

        render(<AppRouter/>);

        expect(screen.getByText('Cargando...')).toBeTruthy();
        expect(mockCheckAuthToken).toHaveBeenCalled();
    })

    test('should show login if not authenticated', () => { 
        jest.fn().mockReturnValue
        useAuthStore.mockReturnValue({
            status: 'not-authenticated',
            checkAuthToken: mockCheckAuthToken
        })

        const { container } = render(<AppRouter/>);
        expect( container ).toMatchSnapshot();
    })

    test('should show calendar if authenticated', () => { 
        jest.fn().mockReturnValue
        useAuthStore.mockReturnValue({
            status: 'authenticated',
            checkAuthToken: mockCheckAuthToken
        })

        const { container } = render(<AppRouter/>);
        expect( container ).toMatchSnapshot();
        expect( screen.getByText('CalendarPage') ).toBeTruthy();
    })    
})