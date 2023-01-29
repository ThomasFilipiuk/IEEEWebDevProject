import { Link } from 'react-router-dom';

const ItemPage = ({itemData, reviewsData}) => {
  return (
    <div className="m-5">
      <h1>{itemData.name}</h1>
      <p>{itemData.description}</p>
      <Link to={`/${itemData.location}`}>Go back to {itemData.location}</Link>
      {reviewsData.map(([key, value]) => (
        <div key={key} className="m-5 p-3" style={{border: "1px solid black"}}>
          <h2>Review written by {value.author}</h2>
          <p>{value.rating} stars</p>
          <p>{value.text}</p>
        </div>
      ))}
    </div>
  )
}

export default ItemPage;