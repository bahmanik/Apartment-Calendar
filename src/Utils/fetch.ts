export const JDATE = fetch("https://api.keybit.ir/time/")
	.then(res => !res.ok ? {} : res.json())
	.then((j: { [key: string]: any }) => {
		return {
			"year": Number(j.date.year.number.en),
			"month": Number(j.date.month.number.en) - 1,
			"day": Number(j.date.day.number.en)
		}
	})
	.catch(() => { throw new Error("cant fetch FLday") })

export const FLDAYS = async (year: number, month: number) => {
	return fetch(`https://pnldev.com/api/calender?year=${year}&month=${month + 1}`)
		.then(a => a.json())
		.then(b => b.result)
		.then(c => {
			return {
				F: c[1].solar.dayWeek,
				L: Number(Object.keys(c)[Object.keys(c).length - 1])
			}
		})
		.catch(() => { throw new Error("cant fetch FLday") })
}

//the date we use is combination of month and nav.
//so we must format it for our use
export const formatDate = (year: number, month: number) => {
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

