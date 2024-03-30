import AuthRequest from "@requests/AuthRequest";
import prisma from "@/db";
import { paramIntValidator } from "@/validators/ParamBaseValidator";
import { baseMsg } from "@/ts/messages";

export default class DeleteFromWatchListRequest extends AuthRequest {

    /**
     * append ValidationChain to class context
     */
    protected rulesExtend(): void {
        super.rulesExtend()
        this.rulesArr.push([
            paramIntValidator({
                fieldName: "animeId",
                ifNotTypeParamsMessage: baseMsg.valueNotInRange
            }).custom(async value => {
                // TODO: this will die, if it doesnt find an anime
                const anime = await prisma.anime.findFirst({
                    where: { id: value }
                });
                if (!anime) throw new Error("Anime doesn't exist");
            }),
        ])
    }
}