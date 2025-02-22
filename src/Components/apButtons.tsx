export const ApButtons = ({ ApName, onAp, onOv }: { ApName: { [key: string]: string }, onAp: (arg: string) => void, onOv: () => void }) => {
  return (
    <>
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

    </>
  )
}

