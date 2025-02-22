import { useEffect, useState, SetStateAction, Dispatch } from "react"
import { JDATE, formatDate, FLDAYS } from '../Utils/fetch'

type eventT = { title: string, date: string }
type dayT = { value: number | "padding", isCurrentDay: boolean; date: string }
type effectsT = (nav: number, events: eventT[]) => [days: dayT[], dateDisplay: string]

export const ApartmentEffect = (apartment: string, events: eventT[], setEvents: Dispatch<SetStateAction<eventT[]>>) => {
	useEffect(() => {
		localStorage.setItem(`${apartment}`, JSON.stringify(events))
	}, [events])
	useEffect(() => {
		setEvents(JSON.parse(localStorage.getItem(`${apartment}`)) ?? [])
	}, [apartment])
	return
}

export const InitEffects: effectsT = (nav, events) => {
	const [dateDisplay, setDateDisplay] = useState("");
	const [days, setDays] = useState<dayT[]>([]);

	useEffect(() => {
		const week = ["ش", "ی", "د", "س", "چ", "پ", "ج"]
		const monthName = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"]

		const fetchDate = () => {
			const jdate = JDATE()
			const [year, month] = formatDate(jdate.y, jdate.m + nav)
			const FLday = FLDAYS(year, month)

			const paddingDays = week.indexOf(FLday.F)
			setDateDisplay(` ${monthName[month]} ${year}`)
			const daysArr: dayT[] = []
			for (let i = 1; i <= paddingDays + FLday.L; i++) {

				if (i > paddingDays) {
					const dayString = `${year}/${month + 1}/${i - paddingDays}`
					daysArr.push({
						value: i - paddingDays,
						isCurrentDay: nav === 0 && i - paddingDays === jdate.d,
						date: dayString
					})
				}
				else {
					daysArr.push({
						value: "padding",
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
