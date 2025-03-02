const DeleteEventModal = ({ onDelete, onClose, eventText }: { onDelete: () => void, onClose: () => void, eventText: string }) => {
  return (
    <>
      <div className="Modal" id="deleteEventModal">
        <h2>Event</h2>
        <p id="eventText">{eventText}</p>

        <button onClick={onDelete} id="deleteButton">Delet</button>
        <button onClick={onClose} id="closeButton">Close</button>
      </div>

      <div id="modalBackDrop"></div>
    </>
  )
}

export default DeleteEventModal

