import { onCloseDateModal, onOpenDateModal, uiSlice } from "../../../src/store/ui/uiSlice";
import { uiInitialState, uiOpenModal } from "../../fixtures/uiFixture";

describe('Pruebas en el uiSlice', () => { 
    test('should return default state', () => { 
        expect(uiSlice.getInitialState()).toEqual(uiInitialState);
    });
    test('should change isDateModelOpen correctly', () => {
        let state = uiSlice.getInitialState();
        state = uiSlice.reducer( state, onOpenDateModal() ); 
        expect(state).toEqual(uiOpenModal);
        state = uiSlice.reducer( state, onCloseDateModal() );
        expect(state).toEqual(uiInitialState); 
    });
});