import { Permissions } from "@/ts/enums";
import { paramIntValidator } from "@validators/ParamBaseValidator";
import { baseMsg } from "@/ts/messages"
import { ValidationChain } from "express-validator";
import WithPermissionsRequest from "@requests/WithPermissionsRequest";

export default class BanAnimeRequest extends WithPermissionsRequest {

    protected permissions: string[] = [Permissions.ManageAnime];

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {

        return [
            paramIntValidator("animeId", {
                message: baseMsg.valueNotInRange
            })
        ]
    }
}