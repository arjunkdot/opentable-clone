// import { useSearchParams } from "next/navigation";
import RestaurantCard from "./components/RestaurantCard";
import Header from "./components/Header";
import SearchSidebar from "./components/SearchSidebar";
import { PrismaClient, Cuisine, PRICE, Location } from "@prisma/client";

export interface RestaurantType {
  id: number;
  name: string;
  slug: string;
  main_image: string;
  cuisine: Cuisine;
  location: Location;
  price: PRICE;
}

interface SearchParamsType {
  city?: string;
  cuisine?: string;
  price?: PRICE;
}
const prisma = new PrismaClient();

const fetchRestaurants = (searchParams: SearchParamsType) => {
  const select = {
    id: true,
    name: true,
    main_image: true,
    cuisine: true,
    slug: true,
    location: true,
    price: true,
    reviews: true,
  };

  const where: any = {};

  if (searchParams.city) {
    const location = {
      name: {
        equals: searchParams.city.toLowerCase(),
      },
    };
    where.location = location;
  }
  if (searchParams.cuisine) {
    const cuisine = {
      name: {
        equals: searchParams.cuisine.toLowerCase(),
      },
    };
    where.cuisine = cuisine;
  }

  if (searchParams.price) {
    const price = {
      equals: searchParams.price,
    };
    where.price = price;
  }

  return prisma.restaurant.findMany({
    where,
    select,
  });
};

const fetchLocations = async () => {
  return prisma.location.findMany();
};

const fetchCuisines = async () => {
  return prisma.cuisine.findMany();
};

export default async function Search({
  searchParams,
}: {
  searchParams: SearchParamsType;
}) {
  const restaurants = await fetchRestaurants(searchParams);

  const locations = await fetchLocations();
  const cuisines = await fetchCuisines();

  return (
    <>
      <Header />
      <div className="flex py-4 m-auto w-2/3 justify-between items-start">
        <SearchSidebar
          locations={locations}
          cuisines={cuisines}
          searchParams={searchParams}
        />
        <div className="w-5/6">
          {restaurants.length ? (
            restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} details={restaurant} />
            ))
          ) : (
            <span>Sorry, we found no restaurants in this area.</span>
          )}
        </div>
      </div>
    </>
  );
}
