
import UnauthorizedError from "../errors/UnauthorizedError";
import { Encrypt } from "../helper/encrypt";
import RefreshToken from "../models/RefreshToken";
import User from "../models/User";
import { CreateUser, LoginUser } from "../ts";
import * as jwt from "jsonwebtoken";


export default class UserService {

    constructor() {

    }

    public static async create(userData: CreateUser) {
        userData.password = await Encrypt.cryptPassword(userData.password);
        return await User.createUser(userData);
    }

    public static async login(userData: LoginUser) {
        const {login, password} = userData;

        const user = await User.findUserByLogin(login);
        
        if (!user) throw new UnauthorizedError("Login or password incorrect");
        if (!await Encrypt.comparePassword(password, user.password)) throw new UnauthorizedError("Login or password incorrect");
        
        const { id } = user;

        const token = jwt.sign({ id }, process.env.tokenSecret!, { expiresIn: process.env.tokenLife })
        const refreshToken = jwt.sign({ id }, process.env.tokenRefreshSecret!, { expiresIn: process.env.tokenRefreshLife })

        RefreshToken.create(refreshToken, id);
        
        return {
            token, refreshToken
        }
    }
}