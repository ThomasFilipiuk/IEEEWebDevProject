import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import RatingStars from '../RatingStars/RatingStars';
import ItemBadge from '../ItemBadge/ItemBadge';

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
      <Card.Footer className='d-flex align-items-center justify-content-between'>
        { itemData.num_reviews > 0 
            ? <RatingStars
                value={itemData.total_rating / itemData.num_reviews}
                precision={0.1}
                readOnly
              /> 
            : "No reviews yet!" 
        }
        <span>
          <ItemBadge 
            text={itemData.meal_time}
          />
          {/* <ItemBadge
            text="hey"
          /> */}
        </span>
      </Card.Footer>
    </Card>    
      
      
  );
}

export default ItemCard;