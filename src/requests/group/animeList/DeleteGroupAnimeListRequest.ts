import { param } from "express-validator";
import AuthRequest from "@requests/AuthRequest";
import prisma from "@/db";

export default class DeleteGroupAnimeListRequest extends AuthRequest {

    /**
     *  if authType is not None 
     *  Define prisma user request for this method
     * 
     *  @returns Prisma User Variant
     */
    protected async auth(userId: number): Promise<any> {
        return await prisma.user.findUserWithOwnedGroups(userId);
    }

    /**
     * define validation rules for this request
     * @returns ValidationChain
     */
    protected rules(): any[] {
        return [
            param("groupId").isInt().bail().toInt(),
            param("animeId").notEmpty().isInt().bail().toInt().custom(async value => {
                const anime = await prisma.anime.findFirst({
                    where: { id: value }
                });
                if (!anime) throw new Error("Anime doesn't exist");
            })
        ];
    }
}