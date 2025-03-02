import { useState } from 'react'
import "./Style/Vazirmatn-font-face.css"
import './App.css'
import { CalendarHeader } from './Components/calendarHeader'
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
const ApName = { Ivana1: "ایوانا ۱", Ivana2: "ایوانا ۲", Ivana3: "ایوانا ۳", Ivana4: "ایوانا ۴", sarv: "سرو", negar: "نگار" }

function App() {

  const [nav, setNav] = useState(0)
  const [clicked, setClicked] = useState("")
  const [apartment, setApartment] = useState("")
  const [events, setEvents] = useState<eventT[]>(JSON.parse(localStorage.getItem(``)) ?? [])
  const [vMode, setMode] = useState<boolean>(true)
  const [openFuzzy, setOpenFuzzy] = useState(false)
  const [openOV, setOpenOV] = useState<boolean>(true)

  const eventForDate = (date: string) => events.find((e: eventT) => e.date === date)
  const onClose = () => { setClicked(""); setOpenOV(vMode ? true : false) }

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

      {
        !openOV && clicked && !eventForDate(clicked) &&
        <NewEventModal
          onClose={onClose}
          onSave={(title: string) => {
            setEvents([...events, { title, date: clicked }])
            setClicked("")
            setOpenOV(vMode ? true : false)
          }}
        />
      }

      {!openOV && clicked && eventForDate(clicked) &&
        <DeleteEventModal
          eventText={eventForDate(clicked).title}
          onClose={onClose}
          onDelete={() => {
            setEvents(events.filter(e => e.date !== clicked));
            setClicked("");
            setOpenOV(vMode ? true : false)
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

      {
        <ApButtons
          ApName={ApName}
          onAp={(e: string) => { setMode(false); setApartment(e); setOpenOV(false) }}
          onOpenFuzzy={() => setOpenFuzzy(true)}
          onOv={() => { setMode(true); setOpenOV(true) }} />
      }
    </div>
  </>
}

export default App
