import { SortDirections, SortAnimeFields } from '@/ts/enums';
import { SortAnimeFieldsType, SortDirectionType } from '@/ts/sorts';
import { Prisma } from '@prisma/client';

export default class Sort {
    public static getAnimeSort(query: {
        field?: SortAnimeFieldsType;
        direction?: SortDirectionType;
    }): Prisma.AnimeOrderByWithRelationInput {
        query.field = query.field ?? 'name';
        query.direction = query.direction ?? 'asc';

        const sortObject: Prisma.AnimeFindManyArgs['orderBy'] = {};
        const sortFields = [...Object.values(SortAnimeFields)] as SortAnimeFieldsType[];
        const sortDirections = [...Object.values(SortDirections)] as SortDirectionType[];

        if (sortFields.includes(query.field) && sortDirections.includes(query.direction)) {
            sortObject[query.field] = query.direction;
        }

        return sortObject;
    }
}
