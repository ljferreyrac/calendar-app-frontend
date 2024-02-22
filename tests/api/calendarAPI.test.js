import calendarAPI from "../../src/api/calendarAPI";

describe('Pruebas en el CalendarAPI', () => { 
    test('should have default configuration', () => { 

        const { VITE_API_URL } = process.env
        expect( calendarAPI.defaults.baseURL ).toBe(VITE_API_URL);
        
    });    
    
    test('should have x-token on request', async () => { 

        const token = 'ABC-123-XYZ'
        localStorage.setItem('token', token)
        const resp = await calendarAPI.get('/auth');

        expect(resp.config.headers['x-token']).toBe(token)
        
    });    
})