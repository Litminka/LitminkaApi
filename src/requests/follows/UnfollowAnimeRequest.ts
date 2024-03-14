import { param, body } from "express-validator";
import prisma from "../../db";
import { RequestAuthTypes } from "../../ts/enums";
import Request from "../Request";
import { UnFollowValidation } from "../../validators/FollowValidator";

export default class UnFollowAnimeRequest extends Request {

    /**
     * Define auth type for this request
     */
    protected authType = RequestAuthTypes.Auth;

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
        return UnFollowValidation()
    }
}