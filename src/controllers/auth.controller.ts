import {Request, Response} from 'express';
import { PrismaClient } from "@prisma/client";
import {hashSync, compareSync} from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
const userClient = new PrismaClient().user;

const JWT_SECRET = process.env.JWT_SECRET
export const signUp = async (req: Request, res: Response) => {
    const { email, password, name } = req.body;

    let user = await userClient.findFirst({ where: { email } });

    if(user) {
        throw Error('User already exists!');
    }
    user = await userClient.create({
        data: {
            email,
            password: hashSync(password, 10),
            name
        }
    });
    res.json(user);
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    let userResponse = await userClient.findFirst({ where: { email } });

    if(!userResponse) {
        throw Error('User already not found!');
    }
    // Compare the password
    if(!compareSync(password, userResponse.password)) {
        throw Error('Invalid password!');
    }
    const user: userJWT = {
        id: userResponse.id,
        name: userResponse.name,
        email: userResponse.email
    };

    const token = jwt.sign(user, JWT_SECRET);

    res.json({user, token});
}

export type userJWT = {
    id: string,
    name: string,
    email: string
}