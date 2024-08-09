import { SortDirections, SortAnimeFields } from '@/ts/enums';
import { SortAnimeFieldsType, SortDirectionType } from '@/ts/sorts';
import { Prisma } from '@prisma/client';

export default class Sort {
    public static getAnimeSort(query: {
        field?: SortAnimeFieldsType;
        direction?: SortDirectionType;
    }): Prisma.AnimeOrderByWithRelationInput {
        const sortObject: Prisma.AnimeFindManyArgs['orderBy'] = {};

        for (const sort in SortAnimeFields) {
            if (query.field === sort)
                for (const direction in SortDirections) {
                    if (query.direction === direction) sortObject[sort] = direction;
                }
        }

        return sortObject;
    }
}
