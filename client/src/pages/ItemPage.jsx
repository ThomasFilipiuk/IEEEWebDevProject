import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import AddReviewForm from '../components/AddReviewForm/AddReviewForm';
import { getData } from '../../utilities/apiUtilities';
import Modal from 'react-bootstrap/Modal';

const ItemPage = () => {
  const [show, setShow] = useState(false);
  const [itemData, setItemData] = useState(null);
  const [reviewsData, setReviewsData] = useState(null);
  const { locationName, id } = useParams();
  console.log(id);
  useEffect(() => {
    getData(`reviews?item_id=${id}`).then(response => {
      setReviewsData(response);
      console.log('review data', response);
    });
    getData(`dining-hall/${locationName}?_id=${id}`).then(response => {
      setItemData(response[0]);
      console.log('item data', response);
    });    
  }, []);


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <div>
    {itemData && reviewsData && (

      <div className="m-5">
        <h1>{itemData.name}</h1>
        <p>{itemData.description}</p>
        <div>
          <Link to={`/${itemData.location}`}>
            Go back to {itemData.location}
          </Link>
        </div>
        {reviewsData.map((review) => (
          <div
            key={review._id}
            className="m-5 p-3"
            style={{ border: "1px solid black" }}
          >
            <h2>{review.review_title}</h2>
            <p>{review.rating} stars</p>
            <p>{review.review_body}</p>
            { review.image_urls.map((e) => <img src={e}/>) }
          </div>
        ))}
      </div>
    )} 
      
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
          />
        </Modal.Body>        
      </Modal>
    </div>
  )
}

export default ItemPage;