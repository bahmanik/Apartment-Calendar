import jalaali from "jalaali-js";

export function FLDAYS(jy: number, jm: number): { F: string, L: number } {
	const wN = ["د", "س", "چ", "پ", "ج", "ش", "ی"]
	const L = jalaali.jalaaliMonthLength(jy, jm)
	const F = jalaali.jalaaliToDateObject(jy, jm, L)
	return { F: wN[F.getDay()], L: L }
}

export function JDATE(): { y: number, m: number, d: number } {
	const currentDate = new Date()
	const { jy, jm, jd } = jalaali.toJalaali(
		currentDate.getFullYear(),
		currentDate.getMonth(),
		currentDate.getDate() + 1
	)
	return { y: jy, m: jm, d: jd }
}


//the date we use is combination of month and nav.
//so we must format it for our use
export function formatDate(year: number, month: number): Array<number> {
	if (month > 11) {
		year += month / 12
		month %= 12
	}
	else if (month < 0) {
		year += month / 12
		month = month % 12
		month += 12
		month %= 12
	}
	return [Math.floor(year), month]
}

