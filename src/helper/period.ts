import { logger } from "../loggerConf"
import dayjs from "dayjs"

export default class Period {
    /**
     * 
     * @param period 
     * @returns Date[]
     */
    public static getPeriod(period: Date[] | undefined[] | undefined) {
        if (period === undefined) period = [dayjs().toDate(), dayjs().toDate()]
        try {
            if (period.length > 2) throw new Error('Period array too big')
        }
        catch (err) {
            logger.error(err)
        }
        if (period[0] === undefined) period[0] = dayjs().toDate()
        if (period.length != 2 || period[1] === undefined) period[1] = dayjs().toDate()
        return period.map(date => dayjs(date).toDate());
    }
}
