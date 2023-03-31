import Card from 'react-bootstrap/Card';

const LocationCard = ({locationData}) => {
  return(        
    
    <Card className='m-3'>
      <Card.Img 
        variant="top" 
        src="https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=" 
        style={{"height": "180px", "objectFit": "cover"}}
        />
      <Card.Body>
        <Card.Title>{locationData.name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">Rating: {locationData.averageRating}</Card.Subtitle>
        <Card.Text>
          Top item: {locationData.topItem}
        </Card.Text>        
      </Card.Body>
    </Card>
  );
}

export default LocationCard;