import fuze from "fuse.js"
import { useState } from "react"

type eventT = {
  title: string,
  date: string
}
const FuzzyModal = () => {
  const event: { [key: string]: Array<eventT> } = {}
  const ApName = { mofateh: "بازارچه", bazarche: "بازارچه" }
  Object.keys(ApName).map((Ap) => {
    event[Ap] = JSON.parse(localStorage.getItem(Ap)) ?? []
  })
  const fuzz = new fuze(event["mofateh"], { keys: ["title"] })
  const [names, setNames] = useState(fuzz.search(""))

  return (<>
    <div id="fuzzyModal" >
      <div id="query">
        <input
          onChange={e => { setNames(fuzz.search(e.target.value)) }}
          id="eventTitleInput"
          placeholder="Event Title"
        />
      </div>
      {names.map(name => {
        console.log(name)
        return <div >{name.item.title}</div>
      })
      }
      <div id="result">

      </div>
    </div>
  </>)
}

export default FuzzyModal
