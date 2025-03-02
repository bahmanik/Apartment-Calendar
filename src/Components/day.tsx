type eventT = {
  title: string,
  date: string
}
type day = { value: number | "padding", isCurrentDay: boolean; date: string }

export const Day = ({ apartment, vMode, day, onClick, ApName }: { apartment: string, vMode: boolean, ApName: { [key: string]: string }, day: day, onClick: () => void }) => {
  if (vMode) {
    const event: { [key: string]: Array<eventT> } = {}
    Object.keys(ApName).map((Ap) => {
      event[Ap] = JSON.parse(localStorage.getItem(Ap)) ?? []
    })

    const eventForDate = (Ap: string) => event[Ap].find((e: eventT) => e.date === day.date)

    const className = `day ${day.value === 'padding' ? 'padding' : ''} ${day.isCurrentDay ? 'currentDay' : ''}`;

    return (
      <div onClick={onClick} className={className}>
        {day.value === 'padding' ? '' : day.value}

        <div className="event">
          {Object.keys(event).map((e) => {
            return eventForDate(e) && <div className={`${e} event`} key={e}></div>
          })}
        </div>
      </div>
    )
  }
  else {
    const event = JSON.parse(localStorage.getItem(apartment)) ?? []

    const eventForDate = (date: string) => event.find((e: eventT) => e.date === date)

    const className = `day ${day.value === 'padding' ? 'padding' : ''} ${day.isCurrentDay ? 'currentDay' : ''}`;
    return (
      <div onClick={onClick} className={className}>
        {day.value === 'padding' ? '' : day.value}

        {eventForDate(day.date) &&
          <div className={`${apartment} event`}>
            {eventForDate(day.date).title}
          </div>}
      </div>
    )
  }
}
