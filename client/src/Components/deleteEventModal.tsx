const DeleteEventModal = ({ onDelete, onClose, event }: { onDelete: () => void, onClose: () => void, event: eventT | undefined }) => {
  return (
    <>
      <div className="Modal" id="deleteEventModal">
        <h2>Delete Reservation</h2>
        <h2 className="eventText">{`${event?.Fname} ${event?.Lname}`}</h2>
        <h4 className="eventText"> {`${event?.date} : تاریخ رزرو`} </h4>
        <h4 className="eventText"> {`${event?.date} : بیعانه برداختی`} </h4>
        <h4 className="eventText"> {`${event?.date} : مبلغ کل`} </h4>
        <h4 className="eventText">{`${event?.exitTime} : ساعت ورود : ${event?.entryTime}  ساعت خروج`}</h4>

        <button onClick={onDelete} id="deleteButton">Delet</button>
        <button onClick={onClose} id="closeButton">Close</button>
      </div>

      <div id="modalBackDrop"></div>
    </>
  )
}

export default DeleteEventModal

