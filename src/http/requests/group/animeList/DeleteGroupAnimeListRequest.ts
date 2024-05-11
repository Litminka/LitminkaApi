import { ValidationChain } from 'express-validator';
import prisma from '@/db';
import GroupRequest from '@requests/group/GroupRequest';
import { paramIntValidator } from '@/validators/ParamBaseValidator';

export default class DeleteGroupAnimeListRequest extends GroupRequest {
    public params!: {
        animeId: number;
        groupId: number;
    };
    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [
            paramIntValidator('groupId'),
            paramIntValidator('animeId').custom(async (value) => {
                const anime = await prisma.anime.findFirst({
                    where: { id: value }
                });
                if (!anime) throw new Error("Anime doesn't exist");
            })
        ];
    }
}

export const deleteGroupAnimeListReq = new DeleteGroupAnimeListRequest().send();
