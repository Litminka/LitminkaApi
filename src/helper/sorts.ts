import { SortDirections, SortList } from '@/ts/enums';
import { SortListType, SortDirectionType } from '@/ts/sorts';

export default class Sort {
    public static getSort(query: { field?: SortListType; direction?: SortDirectionType }) {
        const sort = Object();

        for (const sortKey in SortList) {
            if (query.field === sortKey) {
                for (const dirKey in SortDirections) {
                    if (query.direction === dirKey) {
                        sort[SortList[sortKey]] = SortDirections[dirKey];
                        return sort;
                    }
                }
            }
        }

        return sort;
    }
}
