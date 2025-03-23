import { useState } from 'react';
import "./Style/Vazirmatn-font-face.css";
import './App.css';
import { CalendarHeader } from './Components/calendarHeader';
import { Day } from './Components/day';
import NewEventModal from './Components/newEventModal';
import DeleteEventModal from './Components/deleteEventModal';
import { useDayEffects, useApartmentEffect } from './Utils/effencts';
import { OverViewModal } from './Components/overViewModal';
import { ApButtons } from './Components/apButtons';
import { formatDayString } from './Utils/fetch';
import FuzzyModal from './Components/fuzzyModal';

const ApName = {
  Ivana1: "ایوانا ۱",
  Ivana2: "ایوانا ۲",
  Ivana3: "ایوانا ۳",
  Ivana4: "ایوانا ۴",
  sarv: "سرو",
  negar: "نگار",
};

let numRender = 0

function App() {
  console.log(++numRender)
  const [nav, setNav] = useState(0);
  const [clicked, setClicked] = useState<string>("");
  const [openFuzzy, setOpenFuzzy] = useState(false);
  const [apartment, setApartment] = useState<string>("overView");
  const [vMode, setMode] = useState<boolean>(true);
  const [openOV, setOpenOV] = useState<boolean>(true);

  // Custom hooks managing events and day effects
  const [events, setEvents, loading] = useApartmentEffect(ApName, apartment, openOV);
  const [days, dateDisplay] = useDayEffects(nav, events);

  // Close handler for modals
  const handleClose = () => {
    setClicked("");
    setOpenOV(vMode ? true : false);
    setApartment(vMode ? "overView" : apartment);
  };

  // Returns event matching the given date, if any
  const getEventForDate = (date: string) =>
    events.find((e: eventT) => e.date === date);

  // Handler for when a day is clicked
  const handleDayClick = (day: dayT) => {
    if (day.value !== "padding") {
      setClicked(day.date);
    }
  };

  // Handler for saving a new event
  const handleNewEventSave = (eventObj: eventT, num: number) => {
    const daysList = formatDayString(clicked, num);
    const localEvents = daysList.map((day) => ({ ...eventObj, date: day }));

    const hasConflict = localEvents.some((newEvent) =>
      events.some((existingEvent) => existingEvent.date === newEvent.date)
    );

    if (hasConflict) {
      alert("this day is already reserved");
      setOpenOV(vMode ? true : false);
      setClicked("");
      throw new Error("saving on reserved day");
    }

    setEvents([...events, ...localEvents], () => {
      setApartment(vMode ? "overView" : apartment);
      setOpenOV(vMode ? true : false);
      setClicked("");
    });
  };

  // Handler for deleting an event
  const handleDeleteEvent = () => {
    setEvents(
      events.filter((e) => e.date !== clicked),
      () => {
        setClicked("");
        setApartment(vMode ? "overView" : apartment);
        setOpenOV(vMode ? true : false);
      }
    );
  };

  return (
    <div id="container">
      <CalendarHeader
        dateDisplay={dateDisplay}
        onNext={() => setNav(nav + 1)}
        onBack={() => setNav(nav - 1)}
      />

      <div id="calendar">
        {days.map((d, index) => (
          <Day
            key={index}
            apartment={apartment}
            vMode={vMode}
            event={events}
            day={d}
            onClick={() => handleDayClick(d)}
          />
        ))}
      </div>

      {openFuzzy && (
        <FuzzyModal
          vMode={vMode}
          onClose={() => setOpenFuzzy(false)}
          event={events}
        />
      )}

      {!loading && !openOV && clicked && !getEventForDate(clicked) && (
        <NewEventModal
          date={clicked}
          onClose={handleClose}
          onSave={handleNewEventSave}
        />
      )}

      {!loading && !openOV && clicked && getEventForDate(clicked) && (
        <DeleteEventModal
          onClose={handleClose}
          event={getEventForDate(clicked)}
          onDelete={handleDeleteEvent}
        />
      )}

      {clicked && vMode && openOV && (
        <OverViewModal
          setApartment={(name: string) => {
            setApartment(name);
            setOpenOV(false);
          }}
          apartment={ApName}
          onClose={handleClose}
        />
      )}

      <ApButtons
        ApName={ApName}
        onAp={(name: string) => {
          setMode(false);
          setApartment(name);
          setOpenOV(false);
        }}
        onOpenFuzzy={() => {
          setApartment("overView");
          setMode(true);
          setOpenFuzzy(true);
        }}
        onOv={() => {
          setApartment("overView");
          setMode(true);
          setOpenOV(true);
        }}
      />
    </div>
  );
}

export default App;

