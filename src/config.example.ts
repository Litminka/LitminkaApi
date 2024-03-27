interface config {
    ignoreLicensors: string[]
    ratingMinVotes: number
    createTestData: boolean
    updateRatingSchedule: object
    updateShikimoriSchedule: object
    autocheckSchedule: object
}

export const config: config = {

    /**
     * ignore these licensors for geoban when parsing shikimori anime
     */
    ignoreLicensors: ["Wakanim", "Crunchyroll", "Netflix", "Dentsu", "Русский Репортаж", "2x2", "1C", "1С", "FAN", "Синема Галэкси", "Мега-Аниме", "Экспонента", "All Media Company"],
    ratingMinVotes: 5,
    createTestData: true,
    updateRatingSchedule: { pattern: "*/30 * * * *" },
    updateShikimoriSchedule: { pattern: "* * */1 * *" },
    autocheckSchedule: { pattern: "* */1 * * *" }
}