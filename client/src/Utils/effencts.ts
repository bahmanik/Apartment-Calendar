import { useEffect, useState, SetStateAction, Dispatch } from "react"
import { JDATE, formatMonth, FLDAYS } from '../Utils/fetch'

type dayT = { value: number | "padding", isCurrentDay: boolean; date: string }
type effectsT = (nav: number, events: eventWithCallback) => [days: dayT[], dateDisplay: string]

export const ApartmentEffect = (ApName: Record<string, string>, apartment: string, events: eventWithCallback, setEvents: eventWithCallback, vMode: boolean) => {
	useEffect(() => {
		if (!vMode && apartment && apartment !== "overView") {
			fetch("http://localhost:5000/write", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ [apartment]: events }),
			})
				.then((res) => res.json())
				.catch((err) => alert(`Error: ${err}`))
		}
	}, [events])
	useEffect(() => {
		let isMounted = true; // Track if the component is still mounted
		const classList = Object.keys(ApName)

		const fetchData = async () => {
			try {
				const response = await fetch(`http://localhost:5000/read?name=${vMode ? "overView" : apartment}`);
				const data = await response.json();
				if (isMounted) {
					setEvents(data); // Only set state if the component is still mounted
				}
			} catch (error) {
				console.error("Fetch error:", error);
			}
		};

		// Only fetch if apartment is truthy or meets certain conditions
		if (apartment) {
			fetchData();
			document.body.classList.remove(...classList);
			document.body.classList.add(apartment);
		}

		return () => {
			isMounted = false; // Cleanup function to set isMounted to false
		};
	}, [apartment]);
	return
}

function EnToFa(Text: number) {
	let A = ""
	const T = String(Text)
	const FaNum = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹",]
	for (let i = 0; i < T.length; i++) { A += FaNum[T[i]] }
	return A
}

export const InitEffects: effectsT = (nav, events) => {
	const [dateDisplay, setDateDisplay] = useState("");
	const [days, setDays] = useState<dayT[]>([]);

	useEffect(() => {
		const week = ["ش", "ی", "د", "س", "چ", "پ", "ج"]
		const monthName = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"]

		const fetchDate = () => {
			const jdate = JDATE()
			const [year, month] = formatMonth(jdate.y, jdate.m + nav)
			const FLday = FLDAYS(year, month)

			const paddingDays = week.indexOf(FLday.F)
			setDateDisplay(` ${monthName[month]} ${EnToFa(year)}`)
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
