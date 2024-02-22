import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "../../src/store";
import { authInitialState, authenticatedState, notAuthenticatedState } from "../fixtures/authFixture";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useAuthStore } from "../../src/hooks/useAuthStore";
import { Provider } from "react-redux";
import { testUserCredentials } from "../fixtures/testUser";
import { calendarAPI } from "../../src/api";

const getMockStore = ( initialState ) => {
    return configureStore({
        reducer: {
            auth: authSlice.reducer
        },
        preloadedState:{
            auth: { ...initialState }
        }
    })
}


describe('Pruebas en useAuthStore', () => {
    
    beforeEach(() => localStorage.clear());
    
    test('should return default values', () => { 
        const mockStore = getMockStore({...authInitialState})
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({children}) => 
                <Provider store={mockStore} >
                    { children }
                </Provider>
        })
        expect(result.current).toEqual(
            {
                status: 'checking',
                user: {},
                errorMessage: undefined,
                startLogin: expect.any(Function),
                startRegister: expect.any(Function),
                checkAuthToken: expect.any(Function),
                startLogout: expect.any(Function)
            }
        )
    });

    test('startLogin should login a user correctly', async () => { 
        const mockStore = getMockStore({...notAuthenticatedState()})
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({children}) => 
                <Provider store={mockStore} >
                    { children }
                </Provider>
        })

        await act( async () => {
            await result.current.startLogin(testUserCredentials);
        })

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: 'Test User', uid: '65d15e5a7a0a583b35f820be' }
        })

        expect( localStorage.getItem('token') ).toEqual( expect.any(String) );
        expect( localStorage.getItem('token-init-date') ).toEqual( expect.any(String) );
    });

    test('startLogin should fail authentication', async () => { 
        const mockStore = getMockStore({...notAuthenticatedState()})
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({children}) => 
                <Provider store={mockStore} >
                    { children }
                </Provider>
        })

        await act( async () => {
            await result.current.startLogin({email: 'something@google.com', password: '123465789'});
        });

        const { errorMessage, status, user } = result.current;

        expect( localStorage.getItem('token') ).toBe( null );
        expect( localStorage.getItem('token-init-date') ).toBe( null );
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: 'Incorrect credentials',
            status: 'not-authenticated',
            user: {}
        })

        await waitFor(
            () => expect( result.current.errorMessage ).toBe(undefined)
        );
    });

    test('startRegister should register a user', async () => {
        const newUser = {
            email: 'something@google.com', 
            password: '123465789', 
            name: 'Test User 2'
        } 
        const mockStore = getMockStore({...notAuthenticatedState()})
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({children}) => 
                <Provider store={mockStore} >
                    { children }
                </Provider>
        });

        const spy = jest.spyOn( calendarAPI, 'post' ).mockReturnValue({
            data: {
                ok: true,
                uid: "65ca41c38dadcff363434c2b",
                name: newUser.name,
                token: "TOKEN"
            }
        });

        await act( async () => {
            await result.current.startRegister(newUser);
        });

        const { errorMessage, status, user } = result.current;

        expect( localStorage.getItem('token') ).toBe( "TOKEN" );
        expect( localStorage.getItem('token-init-date') ).toEqual( expect.any(String) );
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: {name: newUser.name, uid: '65ca41c38dadcff363434c2b'}
        });

        spy.mockRestore();
    }); 

    test('startRegister should fail creation', async () => {
        const mockStore = getMockStore({...notAuthenticatedState()})
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({children}) => 
                <Provider store={mockStore} >
                    { children }
                </Provider>
        });

        await act( async () => {
            await result.current.startRegister(testUserCredentials);
        });

        const { errorMessage, status, user } = result.current;

        expect( localStorage.getItem('token') ).toBe( null );
        expect( localStorage.getItem('token-init-date') ).toBe( null );
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: 'An user already exists with same email',
            status: 'not-authenticated',
            user: {}
        });

        await waitFor(
            () => expect( result.current.errorMessage ).toBe(undefined)
        );
    });
    
    test('checkAuthToken should authenticate user', async () => {
        const { data } = await calendarAPI.post('/auth', testUserCredentials);
        localStorage.setItem('token', data.token);

        const mockStore = getMockStore({...authInitialState})
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({children}) => 
                <Provider store={mockStore} >
                    { children }
                </Provider>
        });

        await act( async () => {
            await result.current.checkAuthToken();
        });

        const { errorMessage, status, user } = result.current;

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: {name: data.name, uid: data.uid}
        });
        expect( localStorage.getItem('token') ).toEqual( expect.any(String) );
        expect( localStorage.getItem('token-init-date') ).toEqual( expect.any(String) );
    });

    test('checkAuthToken should fail if token do not exist', async () => {
        const mockStore = getMockStore({...authInitialState})
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({children}) => 
                <Provider store={mockStore} >
                    { children }
                </Provider>
        });

        await act( async () => {
            await result.current.checkAuthToken();
        });

        const { errorMessage, status, user } = result.current;

        expect({ errorMessage, status, user }).toEqual(notAuthenticatedState());
        expect( localStorage.getItem('token') ).toBe( null );
        expect( localStorage.getItem('token-init-date') ).toBe( null );
    });


    test('startLogout should clear state', async () => {
        const mockStore = getMockStore({...authenticatedState({name: 'Test User 2', uid: '65ca41c38dadcff363434c2b'})})
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({children}) => 
                <Provider store={mockStore} >
                    { children }
                </Provider>
        });

        await act( async () => {
            await result.current.startLogout();
        });

        const { errorMessage, status, user } = result.current;

        expect( localStorage.getItem('token') ).toBe( null );
        expect( localStorage.getItem('token-init-date') ).toBe( null );
        expect({ errorMessage, status, user }).toEqual(notAuthenticatedState());
    }); 
});