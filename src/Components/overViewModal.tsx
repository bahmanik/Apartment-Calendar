import React from 'react'
type overViewT = { apartment: { [key: string]: string }, onClose: () => void, setApartment: (arg1: string) => void }
export const OverViewModal = ({ apartment, onClose, setApartment }: overViewT) => {
  return (
    <>
      <div id="overViewModal">
        {Object.keys(apartment).map((e: string) => <button
          onClick={() => { setApartment(e) }}
          className={e} key={e}>
          {e}
        </button>)}
        <button
          onClick={onClose}
          id="cancelButton">Cancel</button>
      </div>
      <div id="modalBackDrop"></div>
    </>
  )
}

