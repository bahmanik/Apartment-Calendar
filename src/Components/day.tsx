type Event = {
  title: string,
  date: string
}
type day = { value: number | "padding", event: Event | undefined, isCurrentDay: boolean; date: string }

export const Day = ({ day, onClick }: { day: day, onClick: () => void }) => {
  const className = `day ${day.value === 'padding' ? 'padding' : ''} ${day.isCurrentDay ? 'currentDay' : ''}`;
  return (
    <div onClick={onClick} className={className}>
      {day.value === 'padding' ? '' : day.value}

      {day.event && <div className='event'>{day.event.title}</div>}
    </div>
  );
};
