import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Carousel from 'react-bootstrap/Carousel';
import RatingStars from '../RatingStars/RatingStars';
import ItemBadge from '../ItemBadge/ItemBadge';

const PrevNextIcon = () => {
  return (
    <span aria-hidden="true" className="carousel-control-next-icon position-absolute"/>
  )
}

const ItemCard = ({ itemData }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  // console.log(itemData.total_rating / itemData.num_reviews);

  const handleSelect = (selectedIndex, e) => {
    setActiveIndex(selectedIndex);
  }

  return (
    // <a href={`${locationData.name}/${itemData.name}`}>

    
    <Card className='m-3 text-start d-flex flex-column' style={{ width: '18rem', height: '200px' }}>
      <Card.Body className='d-flex overflow-auto'>
        <Carousel 
          className="flex-grow-1" 
          activeIndex={activeIndex} 
          onSelect={handleSelect}
          variant='dark'
          wrap={false}
          indicators={false}
          nextIcon={<PrevNextIcon />}
          prevIcon={<PrevNextIcon />}
          interval={null}
        >
          <Carousel.Item>
            <Card.Title>{itemData.name}</Card.Title>
            <Card.Text >
              {itemData.description}
            </Card.Text>  
            </Carousel.Item>     
          <Carousel.Item>
            <Card.Title>Nutritional Info</Card.Title>
            <Card.Text>
              {itemData.nutritional_info && itemData.nutritional_info.nutrients.map((e) => {
                return (<Card.Text>
                  {e.name}: {e.value}
                </Card.Text>)
              })}
            </Card.Text>  
          </Carousel.Item>  
        </Carousel> 
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