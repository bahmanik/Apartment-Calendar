import jalaali from "jalaali-js";

export function FLDAYS(jy: number, jm: number): { F: string; L: number } {
	const weekDays = ["د", "س", "چ", "پ", "ج", "ش", "ی"];
	const monthLength = jalaali.jalaaliMonthLength(jy, jm);
	const lastDateObj = jalaali.jalaaliToDateObject(jy, jm, monthLength);
	return { F: weekDays[lastDateObj.getDay()], L: monthLength };
}

export function JDATE(): { y: number; m: number; d: number } {
	const currentDate = new Date();
	const jDateParts = new Intl.DateTimeFormat("fa-IR-u-nu-latn")
		.format(currentDate)
		.split("/");
	return { y: Number(jDateParts[0]), m: Number(jDateParts[1]) - 1, d: Number(jDateParts[2]) };
}

export const getObjectDepth = (obj: unknown): number => {
	if (typeof obj !== "object" || obj === null) {
		return 0; // Base case: not an object
	}

	let maxDepth = 0;
	for (const key in obj as Record<string, unknown>) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			maxDepth = Math.max(maxDepth, getObjectDepth((obj as Record<string, unknown>)[key]));
		}
	}
	return maxDepth + 1; // Add 1 for the current level
};

// Format the month based on the current navigation offset.
// Adjusts the year and month when month is out of the 0–11 range.
export function formatMonth(year: number, month: number): [number, number] {
	if (month > 11) {
		year += Math.floor(month / 12);
		month %= 12;
	} else if (month < 0) {
		year += Math.floor(month / 12);
		month = month % 12;
		month += 12;
		month %= 12;
	}
	return [year, month];
}

function formatDay(date: string, num: number): string {
	let result = date;
	while (num > 0) {
		const [yearStr, monthStr, dayStr] = result.split("/");
		let Y = Number(yearStr);
		let M = Number(monthStr);
		const D = Number(dayStr);
		const monthLength = jalaali.jalaaliMonthLength(Y, M);

		if (D + 1 > monthLength) {
			[Y, M] = formatMonth(Y, M + 1);
			result = `${Y}/${M}/1`;
		} else {
			result = `${Y}/${M}/${D + 1}`;
		}
		num--;
	}
	return result;
}

export function formatDayString(date: string, num: number): string[] {
	return Array.from({ length: num }, (_, index) => formatDay(date, index));
}

