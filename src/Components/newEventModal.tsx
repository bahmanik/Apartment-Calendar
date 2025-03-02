import { useState } from 'react';

const NewEventModal = ({ onSave, onClose }: { onSave: (arg: string) => void, onClose: () => void }) => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState(false);

  return (
    <>
      <div className="Modal" id="newEventModal">
        <h2>New Event</h2>

        <input
          className={error ? 'error' : ''}
          value={title}
          onChange={e => setTitle(e.target.value)}
          id="eventTitleInput"
          placeholder="Event Title"
        />

        <button
          onClick={() => {
            if (title) {
              setError(false);
              onSave(title);
            } else {
              setError(true);
            }
          }}
          id="saveButton">Save</button>


        <button
          onClick={onClose}
          id="cancelButton">Cancel</button>
      </div>

      <div id="modalBackDrop"></div>
    </>
  )
}

export default NewEventModal
