import Fuse from "fuse.js"
import React, { useState, useRef, useEffect } from "react"
import { TransitionGroup, CSSTransition } from "react-transition-group"
import { getObjectDepth } from "../Utils/fetch"

interface EventWithApartment extends eventT {
  parentKey: string
}

interface FuzzyModalProps {
  onClose: () => void
  vMode: boolean
  event: eventT[] | EventGroup[]
}

const ITEM_HEIGHT = 50 // adjust this to the actual height of each item

const FuzzyModal: React.FC<FuzzyModalProps> = ({ onClose, event, vMode }) => {
  const [clicked, setClick] = useState<EventWithApartment | "">("")
  const [resault, setResault] = useState<EventWithApartment[]>([])
  const nodeRefs = useRef(new Map<string, React.RefObject<HTMLButtonElement | null>>())
  const [resultsHeight, setResultsHeight] = useState<number>(0)

  // Update height based on the number of items in resault
  useEffect(() => {
    setResultsHeight(resault.length * ITEM_HEIGHT)
  }, [resault])

  if (vMode && getObjectDepth(event) === 4) {
    const eventGroup = event as EventGroup[]
    const flattenedRecords: EventWithApartment[] = eventGroup.flatMap(item => {
      const key = Object.keys(item)[0]
      return item[key].map((ev: eventT) => ({
        ...ev,
        parentKey: key,
      }))
    })

    const options = {
      keys: [
        "number",
        {
          name: "fullName",
          getFn: (record: EventWithApartment) => `${record.Fname} ${record.Lname}`,
        },
      ],
      threshold: 0.3,
    }

    const fuse = new Fuse(flattenedRecords, options)

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
                onChange={e => setResault(searchEvents(e.target.value))}
                className="eventInput"
                placeholder="Event Title or Number"
              />
              <button onClick={onClose} id="cancelButton">
                Close
              </button>
            </div>
            {/* Animated container for resault */}
            <div
              style={{
                height: resultsHeight,
                transition: "height 0.3s ease-in-out",
                overflow: "hidden",
              }}
            >
              <TransitionGroup>
                {resault.map(result => {
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
            </div>
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

  return null
}

export default FuzzyModal

