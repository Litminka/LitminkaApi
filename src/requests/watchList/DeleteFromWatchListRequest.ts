import { param } from "express-validator";
import AuthRequest from "@requests/AuthRequest";
import prisma from "@/db";

export default class DeleteFromWatchListRequest extends AuthRequest {

    /**
     * define validation rules for this request
     * @returns ValidationChain
     */
    protected rules(): any[] {
        return [
            param("animeId").notEmpty().isInt().bail().toInt().custom(async value => {
                const anime = await prisma.anime.findFirst({
                    where: { id: value }
                });
                if (!anime) throw new Error("Anime doesn't exist");
            })]
    }
}