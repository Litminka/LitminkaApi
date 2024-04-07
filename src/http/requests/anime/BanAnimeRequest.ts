import { Permissions } from "@/ts/enums";
import { paramIntValidator } from "@validators/ParamBaseValidator";
import { ValidationChain } from "express-validator";
import { WithPermissionsRequest } from "@requests/WithPermissionsRequest";

export interface BanAnimeReq extends WithPermissionsRequest {
    params: {
        animeId: number
    }
}

export class BanAnimeRequest extends WithPermissionsRequest {

    protected permissions: Permissions[] = [Permissions.ManageAnime];

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {

        return [
            paramIntValidator("animeId")
        ]
    }
}