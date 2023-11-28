import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import * as jose from "jose";
import bcrypt from "bcrypt";
import validator from "validator";
import { setCookie } from "cookies-next";

const prisma = new PrismaClient();
export default async function signin(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const errors: string[] = [];
        const { email, password } = req.body;

        const validationSchema = [
            { valid: validator.isEmail(email), errorMessage: "Invalid email" },
            { valid: validator.isLength(password, { min: 1 }), errorMessage: "Invalid passowr" }
        ]

        validationSchema.forEach(check => {
            if (!check.valid) {
                errors.push(check.errorMessage);
            }
        });

        if (errors.length) {
            return res.status(400).json({ error: errors[0] });
        }

        const user = await prisma.user.findUnique({ where: { email } })

        if (!user) {
            return res.status(401).json({ errorMessage: "Email or password is invalid." })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ errorMessage: "Email or password is invalid." })
        }

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

    return res.status(404).json({ errorMessage: "Unknown endpoint." });
}
