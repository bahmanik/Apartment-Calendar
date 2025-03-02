export const ApButtons = ({ ApName, onAp, onOv, onOpenFuzzy }: { ApName: { [key: string]: string }, onAp: (arg: string) => void, onOv: () => void, onOpenFuzzy: () => void }) => {
  return (
    <div className="buttonGroup">
      <button onClick={onOpenFuzzy}>Search</button>
      {
        Object.keys(ApName).map(e => <button
          className={e}
          key={e}
          onClick={() => { onAp(e) }}>
          {ApName[e]}
        </button>
        )
      }
      <button
        onClick={onOv}
      >OverView</button>
    </div>
  )
}

