import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import * as jose from "jose";
import bcrypt from "bcrypt";
import validator from "validator";
import { setCookie } from 'cookies-next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { firstName, lastName, email, password, phone, city } = req.body;
        const errors: string[] = [];

        const validationSchema = [
            { valid: validator.isLength(firstName, { min: 1, max: 20 }), errorMessage: "Invalid first name" },
            { valid: validator.isLength(lastName, { min: 1, max: 20 }), errorMessage: "Invalid last name" },
            { valid: validator.isEmail(email), errorMessage: "Invalid email" },
            { valid: validator.isMobilePhone(phone), errorMessage: "Invalid email" },
            { valid: validator.isLength(city, { min: 1 }), errorMessage: "Invalid city" },
            { valid: validator.isStrongPassword(password), errorMessage: "Password is not strong enough" },
        ];

        validationSchema.forEach(check => {
            if (!check.valid) {
                errors.push(check.errorMessage);
            }
        })

        if (errors.length) {
            return res.status(400).json({ errorMessage: errors[0] })
        }

        const userWithEmail = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (userWithEmail) {
            return res.status(400).json({ errorMessage: "Email is associated with another account. Please login." })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                first_name: firstName,
                last_name: lastName,
                password: hashedPassword,
                email,
                phone,
                city,
            }
        })

        const alg = "HS256";
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const token = await new jose.SignJWT({ email: user.email }).setProtectedHeader({ alg }).setExpirationTime("24h").sign(secret)
        setCookie("jwt", token, { req, res, maxAge: 60 * 6 * 24 });
        res.status(200).json({
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            phone: user.phone,
            city: user.city
        })
    }
    return res.status(404).json("Unknown endpoint");
}