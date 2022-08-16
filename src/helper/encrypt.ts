import * as bcrypt from 'bcrypt';

export const Encrypt = {

    cryptPassword: (password: string) =>
        bcrypt.genSalt(10)
            .then((salt => bcrypt.hash(password, salt)))
            .then(hash => hash),

    comparePassword: (password: string, hashPassword: string) =>
        bcrypt.compare(password, hashPassword)
            .then(resp => resp)

}