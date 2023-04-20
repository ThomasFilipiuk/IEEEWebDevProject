import Card from 'react-bootstrap/Card';
import RatingStars from '../RatingStars/RatingStars';


const ReviewCard = ({ review }) => {
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
      <Card.Footer className='d-flex align-items-center justify-content-between'>
        <RatingStars
          readOnly={true}
          value={review.rating}
        />
      </Card.Footer>
    </Card>        

  );
}

export default ReviewCard;