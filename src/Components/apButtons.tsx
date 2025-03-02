import search from '../Assets/search.svg';
import overView from '../Assets/overview.svg';
export const ApButtons = ({ ApName, onAp, onOv, onOpenFuzzy }: { ApName: { [key: string]: string }, onAp: (arg: string) => void, onOv: () => void, onOpenFuzzy: () => void }) => {
  return (
    <div className="buttonGroup">
      <div id="SObutton">
        <button id="search" onClick={onOpenFuzzy}>
          <img src={search} className="buttonSVG" alt="Search" />
        </button>
        <button id="overView" onClick={onOv}>
          <img src={overView} className="buttonSVG" alt="overView" />
        </button>
      </div>

      <div className="apButton">
        {
          Object.keys(ApName).map(e => <button
            className={e}
            key={e}
            style={{ width: "calc(100%/6 - 5px)" }}
            onClick={() => { onAp(e) }}>
            {ApName[e]}
          </button>)
        }
      </div>
    </div>
  )
}

