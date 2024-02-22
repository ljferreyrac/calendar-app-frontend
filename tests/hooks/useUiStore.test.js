import { act, renderHook } from "@testing-library/react"
import { useUiStore } from "../../src/hooks/useUiStore"
import { Provider } from "react-redux";
import { uiSlice } from "../../src/store";
import { configureStore } from "@reduxjs/toolkit";
import { uiInitialState, uiOpenModal } from "../fixtures/uiFixture";

const getMockStore = ( initialState ) => {
    return configureStore({
        reducer: {
            ui: uiSlice.reducer
        },
        preloadedState:{
            ui: { ...initialState }
        }
    })
}

describe('Pruebas en useUiStore', () => { 
    test('should return default values', () => { 
        
        const mockStore = getMockStore(uiInitialState)

        const {result} = renderHook( () => useUiStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        });
        expect(result.current).toEqual({
            isDateModalOpen: false,
            openDateModal: expect.any(Function),
            closeDateModal: expect.any(Function)
        })        
    });

    test('openDateModal should set true isDateModalOpen', () => { 
        
        const mockStore = getMockStore(uiInitialState)

        const {result} = renderHook( () => useUiStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        });

        const { openDateModal } = result.current;

        act( () => {
            openDateModal();
        });

        expect(result.current.isDateModalOpen).toBeTruthy();        
    });

    test('closeDateModal should set false isDateModalOpen', () => { 
        
        const mockStore = getMockStore(uiOpenModal)

        const {result} = renderHook( () => useUiStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        });

        const { closeDateModal } = result.current;

        act( () => {
            closeDateModal();
        });

        expect(result.current.isDateModalOpen).toBeFalsy();        
    });
})