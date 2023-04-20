import Card from 'react-bootstrap/Card';
import { useState, useEffect } from 'react';
import { getData } from '../../../utilities/apiUtilities';
import RatingStars from '../RatingStars/RatingStars';

const LocationCard = ({locationData, locationName}) => {
  const [topItem, setTopItem] = useState(null);
  console.log('locationdata:',locationData);
  const topItemId = locationData.top_item?.item_id;
  useEffect(() => {
    if (topItemId !== undefined) { 
      getData(`dining-hall/${locationName}?_id=${topItemId}`).then(response => {
        setTopItem(response[0]);
        // console.log('top item', response[0]);
      })
    }
  }, []);

  return(
    
    <Card className='m-3'>
      <Card.Img 
        variant="top" 
        src={locationData.image_link}
        style={{"height": "180px", "objectFit": "cover"}}
        />
      <Card.Body>
        <Card.Title>{locationName}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          <RatingStars
            value={locationData.avg_rating}
            precision={0.1}
            readOnly
          />
        </Card.Subtitle>
        <Card.Text>
          Top item: {topItem ? topItem.name : 'No top item'}
        </Card.Text>        
      </Card.Body>
    </Card>
  );
}

export default LocationCard;