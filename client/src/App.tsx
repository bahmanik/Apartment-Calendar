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
import { formatDayString } from './Utils/fetch'
import { useStateWithCallback } from './Utils/useStateWithCallback'

const ApName = { Ivana1: "ایوانا ۱", Ivana2: "ایوانا ۲", Ivana3: "ایوانا ۳", Ivana4: "ایوانا ۴", sarv: "سرو", negar: "نگار" }

function App() {

  const [nav, setNav] = useState(0)
  const [clicked, setClicked] = useState("")
  const [events, setEvents] = useStateWithCallback<(newValue: eventT[], callback?: ((state: eventT[]) => void) | undefined) => void>([])
  const [openFuzzy, setOpenFuzzy] = useState(false)
  const [apartment, setApartment] = useState<string>("overView")
  const [vMode, setMode] = useState<boolean>(true)
  const [openOV, setOpenOV] = useState<boolean>(true)


  const eventForDate = (date: string) => events.find((e: eventT) => e.date === date)
  const onClose = () => { setClicked(""); setOpenOV(vMode ? true : false); setApartment(vMode ? "overView" : apartment) }
  const [days, dateDisplay] = InitEffects(nav, events)
  ApartmentEffect(ApName, apartment, events, setEvents, openOV)


  return <>
    <div id="container">
      <CalendarHeader
        dateDisplay={dateDisplay}
        onNext={() => { setNav(nav + 1) }}
        onBack={() => { setNav(nav - 1) }}
      />

      <div id="calendar">
        {days.map((d, index) => <Day
          apartment={apartment}
          vMode={vMode}
          event={events}
          key={index}
          day={d}
          onClick={() => { if (d.value !== "padding") { setClicked(d.date) } }} />
        )}
      </div>

      {openFuzzy &&
        <FuzzyModal
          onClose={() => {
            setOpenFuzzy(false)
          }}
          event={events}
        />}

      {
        !openOV && clicked && !eventForDate(clicked) &&
        <NewEventModal
          date={clicked}
          onClose={onClose}
          onSave={(eventObj: eventT, num: number) => {
            // Create a list of new events for each day
            const daysList = formatDayString(clicked, num);
            const localEvents = daysList.map(day => ({ ...eventObj, date: day }));

            // Check if any of the new events conflict with existing events
            const hasConflict = localEvents.some(newEvent =>
              events.some(existingEvent => existingEvent.date === newEvent.date)
            );

            if (hasConflict) {
              alert("this day is already reserved");
              setOpenOV(vMode ? true : false);
              setClicked("");
              throw "saving on reserved day";
            }

            // Append new events and update state
            setEvents([...events, ...localEvents], () => {
              setApartment("overView");
              setOpenOV(vMode ? true : false);
              setClicked("");
            });
          }}
        />
      }

      {!openOV && clicked && eventForDate(clicked) &&
        <DeleteEventModal
          eventText={eventForDate(clicked)?.Lname}
          onClose={onClose}
          onDelete={() => {
            setEvents(events.filter(e => e.date !== clicked), () => {
              setClicked("");
              setApartment(vMode ? "overView" : apartment)
              setOpenOV(vMode ? true : false)
            });
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
          onOv={() => { setApartment("overView"); setMode(true); setOpenOV(true) }} />
      }
    </div>
  </>
}

export default App
