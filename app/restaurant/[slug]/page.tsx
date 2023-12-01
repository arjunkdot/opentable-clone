import { PrismaClient, Review } from "@prisma/client";
import RestaurantNavbar from "./components/RestaurantNavbar";
import Title from "./components/Title";
import Rating from "./components/Rating";
import Description from "./components/Description";
import Images from "./components/Images";
import Reviews from "./components/Reviews";
import ReservationCard from "./components/ReservationCard";
import { notFound } from "next/navigation";


const prisma = new PrismaClient();
interface RestaurantType {
  id: number;
  name: string;
  images: string[];
  description: string;
  slug: string;
  open_time: string,
  close_time: string,
  reviews: Review[];
}
const fetchRestaurantBySlug = async (slug: string): Promise<RestaurantType> => {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      images: true,
      description: true,
      slug: true,
      open_time: true,
      close_time: true,
      reviews: true,
    },
  });

  if (!restaurant) {
    // throw new Error("No restaurants found!");
    notFound();
  }
  return restaurant;
};
export default async function RestaurantDetails({
  params,
}: {
  params: { slug: string };
}) {
  const restaurant = await fetchRestaurantBySlug(params.slug);

  return (
    <>
      <div className="bg-white w-[70%] rounded p-3 shadow">
        <RestaurantNavbar slug={restaurant.slug} />
        <Title name={restaurant.name} />
        <Rating reviews={restaurant.reviews} />
        <Description description={restaurant.description} />
        <Images images={restaurant.images} name={restaurant.name} />
        <Reviews reviews={restaurant.reviews} />
      </div>
      <div className="w-[27%] relative text-reg">
        <ReservationCard openTime={restaurant.open_time} closeTime={restaurant.close_time} slug={restaurant.slug} />
      </div>
    </>
  );
}
