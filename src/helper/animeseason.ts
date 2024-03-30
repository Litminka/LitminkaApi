import dayjs from "dayjs";
const seasons = [
    "winter",
    "spring",
    "summer",
    "fall"
];
export function getSeason(date: Date) {

    const d = dayjs(date);
    const month: number = d.month();
    const index = Math.floor(month / 3);
    return seasons[index];
}

function getNextSeasonDate(date: Date) {
    const season = getSeason(date);
    const index = seasons.indexOf(season) + 1;
    const nextIndex = index > seasons.length ? 0 : index;
    let d = dayjs(date);
    if (index > seasons.length) d = d.set("year", d.year() + 1);
    return { d, nextIndex };
}

function getPreviousSeasonDate(date: Date) {
    const season = getSeason(date);
    const index = seasons.indexOf(season) - 1;
    const prevIndex = index < 0 ? 3 : index;
    let d = dayjs(date);
    if (index < 0) d = d.set("year", d.year() - 1);
    return { d, prevIndex };
}

export function getNextSeasonStart(date: Date) {
    const { d, nextIndex } = getNextSeasonDate(date);
    const nextSeasonStart = getSeasonStart(d.toDate(), seasons[nextIndex]);
    return nextSeasonStart.toDate();
}

export function getNextSeasonEnd(date: Date) {
    const season = getSeason(date);
    const index = seasons.indexOf(season) + 1;
    const nextIndex = index > seasons.length ? 0 : index;
    let d = dayjs(date);
    if (index > seasons.length) d = d.set("year", d.year() + 1);
    const nextSeasonStart = getSeasonEnd(d.toDate(), seasons[nextIndex]);
    return nextSeasonStart.toDate();
}

export function getPreviousSeasonStart(date: Date) {
    const { d, prevIndex } = getPreviousSeasonDate(date);
    const nextSeasonStart = getSeasonStart(d.toDate(), seasons[prevIndex]);
    return nextSeasonStart.toDate();
}

export function getPreviousSeasonEnd(date: Date) {
    const { d, prevIndex } = getPreviousSeasonDate(date);
    const nextSeasonStart = getSeasonEnd(d.toDate(), seasons[prevIndex]);
    return nextSeasonStart.toDate();
}

export function getPreviousSeasonName(season: string) {
    const index = seasons.indexOf(season) - 1;
    const prevIndex = index < 0 ? 0 : index;
    return seasons[prevIndex];
}

export function getNextSeasonName(season: string) {
    const index = seasons.indexOf(season) + 1;
    const nextIndex = index > seasons.length ? 0 : index;
    return seasons[nextIndex];
}

export function getCurrentSeasonStart(date: Date) {
    const nextSeasonStart = getSeasonStart(date, getSeason(date));
    return nextSeasonStart.toDate();
}

export function getCurrentSeasonEnd(date: Date) {
    const nextSeasonStart = getSeasonEnd(date, getSeason(date));
    return nextSeasonStart.toDate();
}

export function getSeasonStart(date: Date, season: string) {
    let d = dayjs(date);
    const year = d.year();
    const month = seasons.indexOf(season) * 3;
    d = d.set('year', year);
    d = d.set('month', month);
    d = d.set('date', 1);
    return d;
}

export function getSeasonEnd(date: Date, season: string) {
    let d = dayjs(date);
    const year = d.year();
    const month = seasons.indexOf(season) * 3 + 2;
    d = d.set('year', year);
    d = d.set('month', month);
    d = d.endOf("month")
    return d;
}

export function getSeasonNameByDate(date: Date) {
    const d = dayjs(date);
    const year = d.year();
    const season = getSeason(date);
    return `${season}_${year}`;
}