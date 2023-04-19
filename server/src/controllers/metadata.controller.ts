import { findAverageRating, findTopRating } from "../database/utils";

const getMetadata = async(req, res) => {
  try {
    const response = {};
    const diningHalls = ["allison", "elder", "plex-east", "plex-west", "sargent"];
    const imageURLs = [
      "https://www.nvironmentdesign.com/wp-content/uploads/2020/02/Allison-12-e1661282136690.jpg",
      "https://wbo.com/wp-content/uploads/2019/10/Elder-Dining-Hall-food-service-1-1500x1000.png",
      "https://sites.northwestern.edu/southwestarea/files/2019/09/FWWestDining-550x310.jpeg",
      "https://sites.northwestern.edu/southwestarea/files/2019/09/FWWestDining-550x310.jpeg",
      "https://dailynorthwestern.com/wp-content/uploads/2018/11/COMPASS-Evan-Robinson-Johnson-WEB-900x600.jpg",
    ];

    let i = 0;
    for (const diningHall of diningHalls) {
      // response.diningHall 
      const topItem = await findTopRating("reviews", diningHall);
      const avgRating = await findAverageRating("reviews", diningHall);

      const imageLink = imageURLs[i];

      response[diningHall] = {
        top_item: topItem,
        avg_rating: avgRating,
        image_link: imageLink
      };

      i++;
    }

    res.json(response);

  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export { getMetadata }