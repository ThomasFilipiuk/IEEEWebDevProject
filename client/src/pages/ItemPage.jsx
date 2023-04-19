import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';
import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import AddReviewForm from '../components/AddReviewForm/AddReviewForm';
import ReviewCard from '../components/ReviewCard/ReviewCard';
import { getData } from '../../utilities/apiUtilities';
import Modal from 'react-bootstrap/Modal';

const ItemPage = () => {
  const [show, setShow] = useState(false);
  const [itemData, setItemData] = useState(null);
  const [reviewsData, setReviewsData] = useState(null);
  const [image, setImage] = useState(null);
  const { locationName, id } = useParams();
  useEffect(() => {
    getData(`reviews?item_id=${id}`).then(response => {
      setReviewsData(response);
      // console.log('review data', response);
    });
    getData(`dining-hall/${locationName}?_id=${id}`).then(response => {
      setItemData(response[0]);
      console.log('item data', response);
      // console.log('query', response[0].name.split(' ')[1]);
      const words = response[0].name.split(' ');
      const result = (words.length === 1) ? words[0] : (words.length === 2) ? words[1] : words[1] + ' ' + words[2];
      console.log(result);
      fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=7e48771a451a460d98113489c491604d&query=${result}&number=1`).then(response => response.json()).then(data => {
        console.log(data);
        // console.log('image url', data.results[0].image);
        setImage(data.results[0].image);
      })
    });    
  }, []);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <div>
    {itemData && reviewsData && (
      <div className="App">
        <Container fluid="md">
          <Row>
            <Col className='m-5'>
              <Image src={image} rounded />
              <h1>{itemData.name}</h1>
              <p>{itemData.description}</p>
              <Link to={`/${itemData.dining_hall}`}>
                Go back to {itemData.dining_hall}
              </Link>
            </Col>
          </Row>
          <Row>
            <Col className='d-flex flex-wrap'>
              {reviewsData.map((review) => (                
                <ReviewCard key={review._id} review={review} />                          
              ))}  
            </Col>
            </Row>          
        </Container>
        <Button variant="primary" onClick={handleShow}>
          Add a review
        </Button>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add a review</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <AddReviewForm
              id={id}
              diningHall={locationName}
            />
          </Modal.Body>        
        </Modal>
      </div>      
    )}                 
    </div>
  )
}

export default ItemPage;