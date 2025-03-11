const DeleteEventModal = ({ onDelete, onClose, event }: { onDelete: () => void, onClose: () => void, event: eventT | undefined }) => {
  return (
    <>
      <div className="Modal" id="deleteEventModal">
        <h2>Delete Reservation</h2>
        <h1 id="eventText">{`${event?.Fname} ${event?.Lname}`}</h1>
        <h3 id="eventText"> {`${event?.date} : تاریخ رزرو`} </h3>
        <h3 id="eventText">{`${event?.exitTime} : ساعت ورود : ${event?.entryTime}  ساعت خروج`}</h3>

        <button onClick={onDelete} id="deleteButton">Delet</button>
        <button onClick={onClose} id="closeButton">Close</button>
      </div>

      <div id="modalBackDrop"></div>
    </>
  )
}

export default DeleteEventModal

