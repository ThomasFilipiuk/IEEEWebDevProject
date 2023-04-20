import Form from 'react-bootstrap/Form';

function Dropdown({setSortCriteria}) {
  const handleSortChange = (event) => {
    const selectedValue = event.target.value;
    setSortCriteria(selectedValue);
  }
  return (
    <Form.Select aria-label="Default select example" onChange={handleSortChange} >
      <option>Sort by</option>
      <option value="Rating">Rating</option>
      <option value="Alphabetical">Alphabetical</option>
      <option value="Distance">Distance</option>
    </Form.Select>
  );
}

export default Dropdown;