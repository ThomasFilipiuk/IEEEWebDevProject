import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

const ItemCard = ({ itemData }) => {

  // const avgRating = Object.entries(reviewsData).filter(([key, value]) => (
  //     Object.values(itemData.reviews).includes(key))
  //   ).map(([key, value]) => (value.rating)).reduce((a, b) => (a + b), 0)
  //   / (Object.entries(reviewsData).filter(([key, value]) => (
  //       Object.values(itemData.reviews).includes(key)
  //     )).length);
  return (
    // <a href={`${locationData.name}/${itemData.name}`}>
    
    <Card className='m-3 text-start d-flex flex-column' style={{ width: '18rem', height: '200px' }}>
      <Card.Body className='overflow-auto'>
        <Card.Title>{itemData.name}</Card.Title>
        <Card.Text >
          {itemData.description}
        </Card.Text>  
      </Card.Body>
      <Card.Footer>
        Rating: 4.5{itemData.rating}
      </Card.Footer>
    </Card>    
      
      
  );
}

export default ItemCard;