import { useEffect, useState } from "react"
import { JDATE, formatDate, FLDAYS } from '../Utils/fetch'

type eventT = { title: string, date: string }
type dayT = { value: number | "padding", event: eventT | undefined, isCurrentDay: boolean; date: string }
type effectsT = (nav: number, events: eventT[]) => [days: dayT[], dateDisplay: string]

export const InitEffects: effectsT = (nav, events) => {
	const [dateDisplay, setDateDisplay] = useState("");
	const [days, setDays] = useState<dayT[]>([]);

	const eventForDate = (date: string) => events.find((e: eventT) => e.date === date)

	useEffect(() => {
		localStorage.setItem("event", JSON.stringify(events))
	}, [events])

	useEffect(() => {
		const week = ["ش", "ی", "د", "س", "چ", "پ", "ج"]
		const monthName = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"]

		const fetchDate = async () => {
			const jdate = await JDATE
			const [year, month] = formatDate(jdate.year, jdate.month + nav)
			const FLday = await FLDAYS(year, month)

			const paddingDays = week.indexOf(FLday.F)
			setDateDisplay(` ${monthName[month]} ${year}`)
			const daysArr: dayT[] = []
			for (let i = 1; i <= paddingDays + FLday.L; i++) {

				if (i > paddingDays) {
					const dayString = `${year}/${month + 1}/${i - paddingDays}`
					daysArr.push({
						value: i - paddingDays,
						event: eventForDate(dayString),
						isCurrentDay: nav === 0 && i - paddingDays === jdate.day,
						date: dayString
					})
				}
				else {
					daysArr.push({
						value: "padding",
						event: undefined,
						isCurrentDay: false,
						date: ""
					})
				}
			}

			setDays(daysArr)
		}
		fetchDate()
	}, [events, nav])
	return [days, dateDisplay]
}
