import prisma from "@/db";
import { Permissions, RequestAuthTypes } from "@/ts/enums";
import Request from "@requests/Request";
import { body, param } from "express-validator";

export default class FollowAnimeRequest extends Request {

    /**
     * Define auth type for this request
     */
    protected authType = RequestAuthTypes.Auth;

    protected permissions: string[] = [Permissions.ManageAnime];

    /**
     *  if authType is not None 
     *  Define prisma user request for this method
     * 
     *  @returns Prisma User Variant
     */
    protected async auth(userId: number): Promise<any> {
        return await prisma.user.findUserById(userId);
    }

    /**
     * define validation rules for this request
     * @returns ValidationChain
     */
    protected rules(): any[] {
        return [
            param("animeId").bail().isInt().bail().toInt(),
            body("type").notEmpty().bail().isString().bail().isIn(["announcement", "follow"]).bail(),
            body("groupName").if(body("type").exists().bail().equals('follow')).notEmpty().bail().isString().bail()
        ];
    }
}