import * as bcrypt from 'bcryptjs';

export const Encrypt = {
    cryptPassword: (password: string) => {
        return bcrypt
            .genSalt(10)
            .then((salt) => {
                return bcrypt.hash(password, salt);
            })
            .then((hash) => {
                return hash;
            });
    },

    comparePassword: (password: string, hashPassword: string) => {
        return bcrypt.compare(password, hashPassword).then((resp) => {
            return resp;
        });
    }
};
