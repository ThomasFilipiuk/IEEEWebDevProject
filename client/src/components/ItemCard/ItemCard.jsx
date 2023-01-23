// const ItemCard = ({ locationData, itemData }) => {
const ItemCard = ({ itemData }) => {
  return (
    // <a href={`${locationData.name}/${itemData.name}`}>
      <div style={{ "border": "black solid 1px" }}>
        <h1>{itemData.name}</h1>
        <p>{itemData.description}</p>
      </div>
    // </a>
  );
}

export default ItemCard;