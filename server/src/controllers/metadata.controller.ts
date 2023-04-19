import { findAverageRating, findTopRating } from "../database/utils";

const getMetadata = async(req, res) => {
  try {
    const response = {};
    const diningHalls = ["allison", "elder", "plex-east", "plex-west", "sargent"];

    for (const diningHall of diningHalls) {
      // response.diningHall 
      const topItem = await findTopRating("reviews", diningHall);
      const avgRating = await findAverageRating("reviews", diningHall);

      const imageLink = "image link";

      response[diningHall] = {
        top_item: topItem,
        avg_rating: avgRating,
        image_link: imageLink
      };
    }

    res.json(response);

  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export { getMetadata }