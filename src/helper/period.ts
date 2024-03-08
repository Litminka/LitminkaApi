import { logger } from "../loggerConf"
import dayjs from "dayjs"

export default class Period {
    /**
     * 
     * @param createdAt 
     * @returns Date[]
     */
    public static getPeriod(createdAt: Date[]) {
        try {
            if (createdAt.length > 2) throw new Error('Period array too big')
        }
        catch (err) {
            logger.error(err)
        }
        if (createdAt.length != 2) createdAt[1] = dayjs().toDate()
        createdAt = createdAt.map(date => dayjs(date).toDate());
        return createdAt
    }
}
