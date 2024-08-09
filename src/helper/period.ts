import dayjs from 'dayjs';

export default class Period {
    /**
     *
     * @param period
     * @returns Date[]
     */
    public static validatePeriod(period?: Date[] | null[]) {
        if (typeof period === 'undefined') return [dayjs(0).toDate(), dayjs().toDate()];

        if (!dayjs(period[0]).isValid()) period[0] = dayjs(0).toDate();
        if (!dayjs(period[1]).isValid()) period[1] = dayjs().toDate();

        return period.map((date) => {
            return dayjs(date).toDate();
        });
    }
}
