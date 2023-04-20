import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

const ItemCard = ({ itemData }) => {
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
        { itemData.num_reviews > 0 ? `Rating: ${itemData.total_rating / itemData.num_reviews}` : "No reviews yet!" }
      </Card.Footer>
    </Card>    
      
      
  );
}

export default ItemCard;