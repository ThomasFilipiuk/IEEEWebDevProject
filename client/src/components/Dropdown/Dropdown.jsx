import Form from 'react-bootstrap/Form';

function Dropdown() {
  return (
    <Form.Select aria-label="Default select example">
      <option>Sort by</option>
      <option value="1">Rating</option>
      <option value="2">Distance</option>
      <option value="3">Popularity</option>
    </Form.Select>
  );
}

export default Dropdown;