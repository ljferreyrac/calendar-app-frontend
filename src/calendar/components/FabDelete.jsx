import { useCalendarStore, useUiStore } from "../../hooks";

export const FabDelete = () => {
    const { isDateModalOpen } = useUiStore();
    const { startDeletingEvent, hasEventSelected } = useCalendarStore();

    const onClickDelete = () => {
        startDeletingEvent();
    }

    return (
        <button
            aria-label="btn-delete"
            className="btn btn-danger fab-danger"
            onClick={ onClickDelete }
            style={{
                display: hasEventSelected && !isDateModalOpen? '': 'none'
            }}>
                <i className="fa fa-trash-alt"></i>
        </button>
    )
}