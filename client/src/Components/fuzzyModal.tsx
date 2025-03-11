import Fuse from "fuse.js"
import React, { useState, useRef } from "react"
import { TransitionGroup, CSSTransition } from "react-transition-group"
import { getObjectDepth } from "../Utils/fetch"

interface EventWithApartment extends eventT {
  parentKey: string
}

interface FuzzyModalProps {
  onClose: () => void
  vMode: boolean
  event: eventT[] | EventGroup[] // The nested events passed into the component.
}

const FuzzyModal: React.FC<FuzzyModalProps> = ({ onClose, event, vMode }) => {
  const [clicked, setClick] = useState<EventWithApartment | "">("")
  const [resault, setResault] = useState<EventWithApartment[]>([])
  // update the ref type to allow null
  const nodeRefs = useRef(new Map<string, React.RefObject<HTMLButtonElement | null>>())

  if (vMode && getObjectDepth(event) === 4) {
    // event can only be type eventGroup[]
    const eventGroup = event as EventGroup[]

    // Flatten the nested data structure and attach the parent key to each event.
    // (Assuming that each item in `event` is an object with a single key pointing to an array.)
    const flattenedRecords: EventWithApartment[] = eventGroup.flatMap((item) => {
      const key = Object.keys(item)[0]
      return item[key].map((ev: eventT) => ({
        ...ev,
        parentKey: key,
      }))
    })

    // Configure Fuse.js to search by "number" and a computed "fullName" field.
    const options = {
      keys: [
        "number",
        {
          name: "fullName",
          getFn: (record: EventWithApartment) =>
            `${record.Fname} ${record.Lname}`,
        },
      ],
      threshold: 0.3, // Adjust as needed (0 = exact match, 1 = very fuzzy)
    }

    const fuse = new Fuse(flattenedRecords, options)

    /*
     * searchEvents runs a Fuse search and returns up to 7 unique results
     * (ensuring no duplicates by number) even if some items remain from the previous state.
     */
    function searchEvents(query: string): EventWithApartment[] {
      const results = fuse.search(query)
      const uniqueResults: EventWithApartment[] = []
      const seenNumbers = new Set<string>()

      for (const result of results) {
        const ev = result.item
        if (!seenNumbers.has(ev.number)) {
          seenNumbers.add(ev.number)
          uniqueResults.push(ev)
          if (uniqueResults.length >= 7) break
        }
      }
      return uniqueResults
    }

    return (
      <div className="Modal" id="fuzzyModal">
        {!clicked && (
          <>
            <div id="query">
              <input
                onChange={(e) => setResault(searchEvents(e.target.value))}
                className="eventInput"
                placeholder="Event Title or Number"
              />
              <button onClick={onClose} id="cancelButton">
                Close
              </button>
            </div>
            <TransitionGroup>
              {resault.map((result) => {
                if (!nodeRefs.current.has(result.number)) {
                  nodeRefs.current.set(result.number, React.createRef())
                }
                const nodeRef = nodeRefs.current.get(result.number)!
                return (
                  <CSSTransition
                    key={result.number}
                    nodeRef={nodeRef}
                    timeout={300}
                    classNames="result"
                  >
                    <button
                      ref={nodeRef}
                      className={`result-item ${result.parentKey}`}
                      onClick={() => setClick(result)}
                    >
                      {`${result.Fname} ${result.Lname}`}
                    </button>
                  </CSSTransition>
                )
              })}
            </TransitionGroup>
          </>
        )}
        {clicked && (
          <div>
            <p>{`Name: ${clicked.Fname} ${clicked.Lname}`}</p>
            <p>{`Phone number: ${clicked.number}`}</p>
            <p>{`Date: ${clicked.date}`}</p>
            <button onClick={onClose} id="cancelButton">
              Close
            </button>
          </div>
        )}
      </div>
    )
  }
}

export default FuzzyModal

