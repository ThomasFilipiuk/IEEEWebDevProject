import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Rating from '@mui/material/Rating';
import { useFormData } from '../../../utilities/useFormData';
import { getData, postData } from '../../../utilities/apiUtilities';
// import { executeCreateReviewDocument } from '../../../utilities/mongoUtilities';

function AddReviewForm({ id, diningHall, setShowModal, setShowAlert, reviewsData, setReviewsData, user }) {
  const [state, change] = useFormData();
  const [rating, setRating] = useState(null);
  const [images, setImages] = useState([]);

  const submit = (evt) => {
    evt.preventDefault();
    if (!state.errors) {
      // update(state.values); // from usedbupdate
      // executeCreateReviewDocument(state.values, {name: 'billyjean'})
      // console.log(state.values);
      const formData = new FormData();

      formData.append("item_id", id);
      formData.append("review_title", state.values.formReviewTitle);
      formData.append("review_body", state.values.formReviewBody);
      formData.append("rating", rating); // replace later with state.values.rating
      formData.append("dining_hall", diningHall);

      // have to add user later
      // implement rating

      for (const image of images){
        formData.append("images", image);
      }
      
      // console.log(images)
      // return;

      postData("reviews", formData)
        .then((response) => {
          if (response.error) {
            return;
          }

          setShowAlert(true);
          setShowModal(false);

          const imageURLs = [];
          for (const image of images) {
            imageURLs.push(URL.createObjectURL(image));
          }

          setReviewsData([...reviewsData, {
            item_id: id,
            review_title: state.values.formReviewTitle,
            review_body: state.values.formReviewBody,
            rating: rating,
            dining_hall: diningHall,
            image_urls: imageURLs
          }]);
        });
    }
  };

  const handleFileInputChange = (event) => {
    setImages(event.target.files);
  }

  return (
    <Form onSubmit={submit} noValidate encType="multipart/form-data">
      <Rating
        size="large"
        onChange={(event, newValue) => {
          console.log(newValue)
          setRating(newValue);
        }}
      />
      <Form.Group className="mb-3" controlId="formReviewTitle">
        <Form.Label>Review title</Form.Label>
        <Form.Control type="text" placeholder="Enter title" onChange={change} />
        <Form.Text className="text-muted">
          Keep it under 50 characters
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formReviewBody">
        <Form.Label>Review body</Form.Label>
        <Form.Control as='textarea' type="text" placeholder="Enter text" onChange={change} />
      </Form.Group>
      <Form.Group controlId="formFileMultiple" className="mb-3">
        <Form.Label>Upload photos</Form.Label>
        <Form.Control type="file" accept="image/*" multiple onChange={handleFileInputChange} />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}

export default AddReviewForm;