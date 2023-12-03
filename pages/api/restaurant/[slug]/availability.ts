import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { times } from "../../../../data";
import { findAvailableTables } from "../../../../services/restaurant/findAvailableTable";

const prisma = new PrismaClient();
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const { slug, day, time, partySize } = req.query as {
            slug: string,
            day: string,
            time: string,
            partySize: string
        };

        if (!day || !time || !partySize) {
            return res.status(400).json({ errorMessage: "Invalid data provided." })
        }

        const restaurant = await prisma.restaurant.findUnique({
            where: {
                slug
            },
            select: {
                tables: true,
                open_time: true,
                close_time: true,
            }
        })

        if (!restaurant) {
            return res.status(400).json({ errorMessage: "Invalid data provided." });
        }

        const searchTimesWithTables = await findAvailableTables({
            day,
            time,
            res,
            restaurant
        });

        if (!searchTimesWithTables) return res.status(400).json({ errorMessage: "Invalid data provided." })

        const availabilties = searchTimesWithTables.map(t => {
            const sumSeats = t.tables.reduce((sum, table) => {
                return sum + table.seats
            }, 0);

            return {
                time: t.time,
                available: sumSeats >= parseInt(partySize)
            }
        }).filter(availability => {
            const timeIsAfterOpeningHours = new Date(`${day}T${availability.time}`) >= new Date(`${day}T${restaurant.open_time}`)
            const timeIsbeforeClosingHours = new Date(`${day}T${availability.time}`) <= new Date(`${day}T${restaurant.close_time}`)

            return timeIsAfterOpeningHours && timeIsbeforeClosingHours;
        })

        return res.json(availabilties);
    }
}