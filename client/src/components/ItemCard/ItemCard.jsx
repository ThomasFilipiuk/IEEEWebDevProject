import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Rating from '@mui/material/Rating';

const ItemCard = ({ itemData }) => {
  // console.log(itemData.total_rating / itemData.num_reviews);

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
        { itemData.num_reviews > 0 
            ? <Rating 
                value={itemData.total_rating / itemData.num_reviews}
                precision={0.1}
                readOnly
                style={{
                  verticalAlign: "middle"
                }}
              /> 
            : "No reviews yet!" 
        }
      </Card.Footer>
    </Card>    
      
      
  );
}

export default ItemCard;