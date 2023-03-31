import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useFormData } from '../../../utilities/useFormData';
import { executeCreateReviewDocument } from '../../../utilities/mongoUtilities';

function AddReviewForm(user) {
  const [state, change] = useFormData();
  const submit = (evt) => {
    evt.preventDefault();
    if (!state.errors) {
      // update(state.values); // from usedbupdate
      console.log(state.values)
      executeCreateReviewDocument(state.values, {name: 'billyjean'})
    }
  };

  return (
    <Form onSubmit={submit} noValidate>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Review title</Form.Label>
        <Form.Control type="text" placeholder="Enter title" onChange={change} />
        <Form.Text className="text-muted">
          Keep it under 50 characters
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Review body</Form.Label>
        <Form.Control as='textarea' type="text" placeholder="Enter text" onChange={change} />
      </Form.Group>
      <Form.Group controlId="formFileMultiple" className="mb-3">
        <Form.Label>Upload photos</Form.Label>
        <Form.Control type="file" multiple onChange={change} />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}

export default AddReviewForm;