import Card from 'react-bootstrap/Card';

const LocationCard = ({locationData, locationName}) => {
  return(        
    
    <Card className='m-3'>
      <Card.Img 
        variant="top" 
        src={locationData.image_link}
        style={{"height": "180px", "objectFit": "cover"}}
        />
      <Card.Body>
        <Card.Title>{locationName}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">Rating: {locationData.avg_rating}</Card.Subtitle>
        <Card.Text>
          Top item: {locationData.topItem}
        </Card.Text>        
      </Card.Body>
    </Card>
  );
}

export default LocationCard;