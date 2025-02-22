import { useState } from 'react'
import './App.css'
import { CalendarHeader } from './CalendarHeader/calendarHeader'
import { Day } from './Components/day'
import NewEventModal from './Components/newEventModal'
import DeleteEventModal from './Components/deleteEventModal'
import { InitEffects, ApartmentEffect } from './Utils/effencts'
import { OverViewModal } from './Components/overViewModal'
import { ApButtons } from './Components/apButtons'
import FuzzyModal from './Components/fuzzyModal'

type eventT = {
  title: string,
  date: string
}
type apName = string
const ApName = { mofateh: "بازارچه", bazarche: "بازارچه" }

function App() {

  const [nav, setNav] = useState(0)
  const [clicked, setClicked] = useState("")
  const [apartment, setApartment] = useState("")
  const [events, setEvents] = useState<eventT[]>(JSON.parse(localStorage.getItem(``)) ?? [])
  const [vMode, setMode] = useState<boolean>(true)
  const [openFuzzy, setOpenFuzzy] = useState(false)
  const [openOV, setOpenOV] = useState<boolean>(true)

  const eventForDate = (date: string) => events.find((e: eventT) => e.date === date)
  const onClose = () => { setClicked(""); setOpenOV(true) }

  const [days, dateDisplay] = InitEffects(nav, events)
  ApartmentEffect(apartment, events, setEvents)

  return <>
    <div id="container">
      <CalendarHeader
        dateDisplay={dateDisplay}
        onNext={() => { setNav(nav + 1) }}
        onBack={() => { setNav(nav - 1) }}
      />

      <div id="calendar">
        {days.map((d, index) => <Day
          vMode={vMode}
          ApName={ApName}
          apartment={apartment}
          key={index}
          day={d}
          onClick={() => { if (d.value !== "padding") { setClicked(d.date) } }} />
        )}
      </div>

      {openFuzzy && <FuzzyModal />}

      <button onClick={() => setOpenFuzzy(true)}></button>
      {
        !openOV && clicked && !eventForDate(clicked) &&
        <NewEventModal
          onClose={onClose}
          onSave={(title: string) => {
            setEvents([...events, { title, date: clicked }])
            setClicked("")
            setOpenOV(true)
          }}
        />
      }


      {
        !openOV && clicked && eventForDate(clicked) &&
        <DeleteEventModal
          eventText={eventForDate(clicked).title}
          onClose={onClose}
          onDelete={() => {
            setEvents(events.filter(e => e.date !== clicked));
            setOpenOV(true)
            setClicked("");
          }}
        />
      }

      {
        clicked && vMode && openOV &&
        <OverViewModal
          setApartment={(name: string) => { setApartment(name); setOpenOV(false) }}
          apartment={ApName}
          onClose={onClose}
        />
      }

      <ApButtons ApName={ApName} onAp={(e: string) => { setMode(false); setApartment(e) }} onOv={() => { setMode(true) }} />

    </div>
  </>
}

export default App
