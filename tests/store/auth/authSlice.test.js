import { authSlice, clearErrorMessage, onChecking, onLogin, onLogout } from "../../../src/store/auth/authSlice";
import { authInitialState, authenticatedState, notAuthenticatedState } from "../../fixtures/authFixture";
import { testUserCredentials } from "../../fixtures/testUser";

describe('Pruebas en authSlice', () => { 
    test('should return initial state', () => { 
        expect( authSlice.getInitialState() ).toEqual(authInitialState);
    });

    test('should login a user', () => { 
        let state = authSlice.reducer( authInitialState, onLogin( testUserCredentials ) );
        expect( state ).toEqual(authenticatedState( testUserCredentials ));
    });

    test('should logout a user', () => { 
        let state = authSlice.reducer( authenticatedState( testUserCredentials ), onLogout() );
        expect( state ).toEqual(notAuthenticatedState());
    });

    test('should logout a user with a message', () => {
        const errorMessage = 'Credentials not valids' 
        let state = authSlice.reducer( authenticatedState( testUserCredentials ), onLogout(errorMessage) );
        expect( state ).toEqual(notAuthenticatedState(errorMessage));
    });

    test('should clear the errorMessage', () => {
        const errorMessage = 'Credentials not valids' 
        let state = authSlice.reducer( authenticatedState( testUserCredentials ), onLogout(errorMessage) );
        let newState = authSlice.reducer( state, clearErrorMessage() );
        expect( newState.errorMessage ).toBeFalsy();
    });

    test('should do check', () => {
        let state = authSlice.reducer( authInitialState, onLogin( testUserCredentials ) );
        let newState = authSlice.reducer( state, onChecking() );
        expect( newState ).toEqual( authInitialState );
    });
})