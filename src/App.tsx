import { useState, useEffect } from 'react'
import './App.css'
import { CalendarHeader } from './CalendarHeader/calendarHeader'
import { Day } from './Components/day'
import NewEventModal from './Components/newEventModal'
import DeleteEventModal from './Components/deleteEventModal'
import { InitEffects } from './Utils/effencts'

type eventT = {
  title: string,
  date: string
}
function App() {
  const [nav, setNav] = useState(0)
  const [clicked, setClicked] = useState("")
  const [events, setEvents] = useState<eventT[]>(JSON.parse(localStorage.getItem("event")) ?? [])

  const eventForDate = (date: string) => events.find((e: eventT) => e.date === date)

  const [days, dateDisplay] = InitEffects(nav, events)

  return <>
    <div id="container">
      <CalendarHeader
        dateDisplay={dateDisplay}
        onNext={() => { setNav(nav + 1) }}
        onBack={() => { setNav(nav + 1) }}
      />


      <div id="calendar">
        {days.map((d, index) => <Day
          key={index}
          day={d}
          onClick={() => { if (d.value !== "padding") { setClicked(d.date) } }} />
        )}
      </div>

      {
        clicked && !eventForDate(clicked) &&
        <NewEventModal
          onClose={() => setClicked("")}
          onSave={(title: string) => {
            setEvents([...events, { title, date: clicked }]);
            setClicked("");
          }}
        />
      }

      {
        clicked && eventForDate(clicked) &&
        <DeleteEventModal
          eventText={eventForDate(clicked).title}
          onClose={() => setClicked("")}
          onDelete={() => {
            setEvents(events.filter(e => e.date !== clicked));
            setClicked("");
          }}
        />
      }

    </div>
  </>
}

export default App
