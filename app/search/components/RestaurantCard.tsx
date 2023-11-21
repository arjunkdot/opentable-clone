import React from "react";
import Link from "next/link";
import { PRICE, Cuisine, Location, Review } from "@prisma/client";
import Price from "../../components/Price";
import { calculateReviewRatingAverage } from "../../../utils/calculateReviewRatingAverage";
import Stars from "../../components/Stars";
interface RestaurantCardType {
  id: number;
  name: string;
  main_image: string;
  cuisine: Cuisine;
  slug: string;
  location: Location;
  price: PRICE;
  reviews: Review[]
}
function RestaurantCard({ details }: { details: RestaurantCardType }) {

  const renderRatingText = () => {
    const rating = calculateReviewRatingAverage(details.reviews);

    if(rating > 4) return "Awesome"
    else if(rating <= 4 && rating > 3) return "Good"
    else if(rating <= 3 && rating > 0) return "Average"
    else return ""
  }
  return (
    <div className="border-b flex pb-5 ml-6 py-2">
      <img src={details.main_image} alt="" className="w-44 h-36 rounded" />
      <div className="pl-5">
        <h2 className="text-3xl">{details.name}</h2>
        <div className="flex items-start">
          <Stars reviews={details.reviews} />
          <p className="ml-2 text-sm">{renderRatingText()}</p>
        </div>
        <div className="mb-9">
          <div className="font-light flex text-reg">
            <p className="mr-4">
              <Price price={details.price} />
            </p>
            <p className="mr-4 capitalize">{details.cuisine.name}</p>
            <p className="mr-4 capitalize">{details.location.name}</p>
          </div>
        </div>
        <div className="text-red-600">
          <Link href={`restaurant/${details.slug}`}>View more information</Link>
        </div>
      </div>
    </div>
  );
}

export default RestaurantCard;
