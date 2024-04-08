import dayjs from "dayjs";

export default class Period {
    /**
     * 
     * @param period 
     * @returns Date[]
     */
    public static getPeriod(period?: Date[] | string[] | []) {
        if (period === undefined || period.length == 0) period = [dayjs().toDate(), dayjs().toDate()];
        if (period.length != 2) period[1] = dayjs().toDate();
        return period.map(date => dayjs(date).toDate());
    }
}
