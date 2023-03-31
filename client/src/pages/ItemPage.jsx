import { Link } from 'react-router-dom';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import AddReviewForm from '../components/AddReviewForm/AddReviewForm';

import Modal from 'react-bootstrap/Modal';

const ItemPage = ({itemData, reviewsData}) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <div className="m-5">
      <h1>{itemData.name}</h1>
      <p>{itemData.description}</p>
      <div><Link to={`/${itemData.location}`}>Go back to {itemData.location}</Link></div>
      {reviewsData.map(([key, value]) => (
        <div key={key} className="m-5 p-3" style={{border: "1px solid black"}}>
          <h2>Review written by {value.author}</h2>
          <p>{value.rating} stars</p>
          <p>{value.text}</p>
        </div>
      ))}
      <Button variant="primary" onClick={handleShow}>
        Add a review
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add a review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddReviewForm></AddReviewForm>
        </Modal.Body>        
      </Modal>
    </div>
  )
}

export default ItemPage;