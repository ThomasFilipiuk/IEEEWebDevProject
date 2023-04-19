import Card from 'react-bootstrap/Card';

const ReviewCard = ({ review }) => {
  console.log(review);
  return (

    <Card className='m-3 text-start d-flex flex-column' style={{ width: '18rem', height: '200px' }}>
      <Card.Body className='overflow-auto'>
        <Card.Title>{review.review_title}</Card.Title>
        <Card.Text >
          {review.review_body}
        </Card.Text>
        {review.image_urls.map((imglink) => (
          <Card.Img src={imglink} />
        ))}        
      </Card.Body>
      <Card.Footer>
        Rating: {review.rating}
      </Card.Footer>
    </Card>        

  );
}

export default ReviewCard;