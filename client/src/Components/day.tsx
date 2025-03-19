import { getObjectDepth } from "../Utils/fetch";

type day = { value: number | "padding", isCurrentDay: boolean; date: string }

export const Day = ({ apartment, day, onClick, event, vMode }: { apartment: string, vMode: boolean, event: eventT[] | EventGroup[], day: day, onClick: () => void }) => {

  const className = `day ${day.value === 'padding' ? 'padding' : ''} ${day.isCurrentDay ? 'currentDay' : ''}`;

  if (vMode && getObjectDepth(event) === 4) {
    // event is an array of EventGroup objects
    const eventDivs = (event as EventGroup[]).map(Element => {
      // Each groupItem should be an object with a single key
      const apartm = Object.keys(Element)[0]
      return Element[apartm].map((eventObj: eventT) => {
        return eventObj.date === day.date && <div className={`${apartm} event`} key={apartm}></div>
      })
    })
    return (
      <div onClick={onClick} className={className}>
        {day.value === 'padding' ? '' : day.value}

        <div className="event">
          {
            eventDivs
          }
        </div>
      </div>
    )
  }
  else {
    // In non-grouped mode, event is assumed to be an array of eventT
    const eventsArray = event as eventT[]
    const foundEvent = eventsArray.find((e: eventT) => e.date === day.date)

    return (
      <div onClick={onClick} className={`${className} ${day.value === 'padding' ? apartment : ""}`}>
        {day.value === 'padding' ? '' : day.value}
        <div className="event">
          {foundEvent && (
            <div className={`${apartment} event`} key={foundEvent.date}>
              {foundEvent.Lname}
            </div>
          )}
        </div>
      </div>
    )
  }
}

