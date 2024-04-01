import AuthRequest from "@requests/AuthRequest";
import prisma from "@/db";
import { paramIntValidator } from "@/validators/ParamBaseValidator";
import { baseMsg } from "@/ts/messages";
import { ValidationChain } from "express-validator";

export default class DeleteFromWatchListRequest extends AuthRequest {

    /**
     *  if authType is not None 
     *  Define prisma user request for this method
     * 
     *  @returns Prisma User Variant
     */
    protected async auth(userId: number): Promise<any> {
        return await prisma.user.findUserByIdWithIntegration(userId);
    }

    /**
     * append ValidationChain to class context
     * @returns ValidationChain
     */
    protected rules(): ValidationChain[] {

        return [
            paramIntValidator("animeId", {
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