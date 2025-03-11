interface eventT { date: string, Fname: string, Lname: string, number: string, deposit: string, totalAmount: string, entryTime: string, exitTime: string }
type eventWithCallback = (newValue: eventT[], callback?: ((state: eventT[]) => void) | undefined) => void
interface overViewT { Ivana1: eventT, Ivana2: eventT, Ivana3: eventT, Ivana4: eventT, sarv: eventT, negar: eventT }
interface EventGroup {
	[key: string]: eventT[];
}

