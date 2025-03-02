
export const CalendarHeader = ({ dateDisplay, onNext, onBack }: { dateDisplay: string, onNext: () => void, onBack: () => void }) => {
  return <>
    <div id="header">
      <div id="monthDisplay">{dateDisplay}</div>
      <div>
        <button onClick={onBack} id="backButton">Back</button>
        <button onClick={onNext} id="nextButton">Next</button>
      </div>
    </div>
    <div id="weekdays">
      <div>جمعه</div>
      <div>پنج شنبه</div>
      <div>چهار شنبه</div>
      <div>سه شنبه</div>
      <div>دو شنبه</div>
      <div>یک شنبه</div>
      <div>شنبه</div>
    </div>
  </>
}
