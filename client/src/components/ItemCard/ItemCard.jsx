// const ItemCard = ({ locationData, itemData }) => {
const ItemCard = ({ itemData }) => {

  // const avgRating = Object.entries(reviewsData).filter(([key, value]) => (
  //     Object.values(itemData.reviews).includes(key))
  //   ).map(([key, value]) => (value.rating)).reduce((a, b) => (a + b), 0)
  //   / (Object.entries(reviewsData).filter(([key, value]) => (
  //       Object.values(itemData.reviews).includes(key)
  //     )).length);
  return (
    // <a href={`${locationData.name}/${itemData.name}`}>
    
    <div className="m-3" style={{ "border": "black solid 1px" }}>
      <h1>{itemData.name}</h1>
      <p>{itemData.description}</p>
      {/* <p>{avgRating} stars</p> */}
    </div>
    // </a>
  );
}

export default ItemCard;