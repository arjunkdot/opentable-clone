import React from "react";
import RestaurantNavbar from "../components/RestaurantNavbar";
import Menu from "../components/Menu";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const fetchItems = async (slug: string) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug: slug },
    select: { items: true },
  });

  if (!restaurant) {
    throw new Error("Failed to fetch restaurants");
  }

  return restaurant.items;
};
export default async function RestaurantMenu({
  params,
}: {
  params: { slug: string };
}) {
  const menu = await fetchItems(params.slug);
  return (
    <>
      <div className="bg-white w-[100%] rounded p-3 shadow">
        <RestaurantNavbar slug={params.slug} />
        <Menu menu={menu} />
      </div>
    </>
  );
}
