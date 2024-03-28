import AuthRequest from "@requests/AuthRequest";
import prisma from "@/db";
import { paramIdValidator } from "@/validators/ParamBaseValidator";
import { baseMsg } from "@/ts/messages";

export default class DeleteFromWatchListRequest extends AuthRequest {

    /**
     * define validation rules for this request
     * @returns ValidationChain
     */
    protected rules(): any[] {
        return [
            paramIdValidator({
                fieldName: "animeId",
                message: baseMsg.valueNotInRange
            }).custom(async value => {
                // TODO: this will die, if it doesnt find an anime
                const anime = await prisma.anime.findFirst({
                    where: { id: value }
                });
                if (!anime) throw new Error("Anime doesn't exist");
            }),
        ]
    }
}