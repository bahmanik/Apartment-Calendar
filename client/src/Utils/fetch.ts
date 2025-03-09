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

export const getObjectDepth = (obj) => {
	if (typeof obj !== "object" || obj === null) {
		return 0; // Base case: not an object
	}

	let maxDepth = 0;

	for (const key in obj) {
		if (obj.hasOwnProperty(key)) {
			maxDepth = Math.max(maxDepth, getObjectDepth(obj[key]));
		}
	}

	return maxDepth + 1; // Add 1 for the current level
}


//the date we use is combination of month and nav.
//so we must format it for our use
export function formatMonth(year: number, month: number): Array<number> {
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
function formatDay(date: string, num: number): string {
	let result = date;

	while (num > 0) {
		const [year, month, day] = result.split("/");
		let Y = Number(year);
		let M = Number(month);
		const D = Number(day);
		const L = jalaali.jalaaliMonthLength(year, month);

		if (D + 1 > L) {
			[Y, M] = formatMonth(Y, M + 1);
			result = `${Y}/${M}/1`;
		} else {
			result = `${Y}/${M}/${D + 1}`;
		}
		num--;
	}

	return result;
}

export function formatDayString(date: string, num: number) {
	let dayList: Array<string> = []
	for (let index = 0; index < num; index++) {
		const temp = formatDay(date, index)
		dayList = [...dayList, temp]
	}
	return dayList
}
