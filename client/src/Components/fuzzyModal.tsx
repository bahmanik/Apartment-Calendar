import Fuse from "fuse.js";
import React, { useState } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";

// Make sure eventT is defined somewhere in your codebase.
interface eventT {
  id: string; // Ensure each event has a unique id.
  date: string;
  Fname: string;
  Lname: string;
  number: string;
  deposit: string;
  totalAmount: string;
  entryTime: string;
  exitTime: string;
}

interface EventWithApartment extends eventT {
  parentKey: string;
}

interface FuzzyModalProps {
  onClose: () => void;
  event: eventT[]; // The nested events passed into the component.
}

const FuzzyModal: React.FC<FuzzyModalProps> = ({ onClose, event }) => {
  const [vMode] = useState<boolean>(true);
  const [resault, setResault] = useState<EventWithApartment[]>([]);

  // Flatten the nested data structure and attach the parent key to each event.
  // (Assuming that each item in `event` is an object with a single key pointing to an array.)
  const flattenedRecords: EventWithApartment[] = event.flatMap((item) => {
    const key = Object.keys(item)[0];
    return item[key].map((ev: eventT) => ({
      ...ev,
      parentKey: key,
    }));
  });

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
  };

  const fuse = new Fuse(flattenedRecords, options);

  /**
   * searchEvents runs a Fuse search and returns up to 10 unique results
   * (ensuring no duplicates by number) even if some items remain from the previous state.
   */
  function searchEvents(query: string): EventWithApartment[] {
    const results = fuse.search(query);
    const uniqueResults: EventWithApartment[] = [];
    const seenNumbers = new Set<string>();

    for (const result of results) {
      const ev = result.item;
      if (!seenNumbers.has(ev.number)) {
        seenNumbers.add(ev.number);
        uniqueResults.push(ev);
        if (uniqueResults.length >= 10) break;
      }
    }
    return uniqueResults;
  }

  return (
    <div className={`Modal ${vMode ? "none" : ""}`} id="fuzzyModal">
      <div id="query">
        <input
          onChange={(e) => setResault(searchEvents(e.target.value))}
          className="eventInput"
          placeholder="Event Title or Number"
        />
        <button onClick={onClose} id="cancelButton">
          Cancel
        </button>
      </div>
      <TransitionGroup>
        {resault.map((result) => (
          <CSSTransition key={result.id} timeout={300} classNames="result">
            <button className="result-item">
              {result.Fname}
              <span className="parentKey">({result.parentKey})</span>
            </button>
          </CSSTransition>
        ))}
      </TransitionGroup>
    </div>
  );
};

export default FuzzyModal;

