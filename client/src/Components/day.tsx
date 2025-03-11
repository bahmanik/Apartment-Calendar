import { getObjectDepth } from "../Utils/fetch";

type day = { value: number | "padding", isCurrentDay: boolean; date: string }

export const Day = ({ apartment, day, onClick, event, vMode }: { apartment: string, vMode: boolean, event: eventT[] | EventGroup, day: day, onClick: () => void }) => {

  const className = `day ${day.value === 'padding' ? 'padding' : ''} ${day.isCurrentDay ? 'currentDay' : ''}`;

  if (vMode && getObjectDepth(event) === 4) {

    const eventDivs = event.map(Element => {
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

    const foundEvent = event.find((e: eventT) => e.date === day.date);

    return (

      <div onClick={onClick}
        className={`${className} ${day.value === 'padding' ? apartment : ""}`}
      >
        {day.value === 'padding' ? '' : day.value}

        < div className="event">
          {foundEvent && <div className={`${apartment} event`} key={"asd"}>{foundEvent.Fname}</div>}
        </div>
      </div >
    )
  }
}
