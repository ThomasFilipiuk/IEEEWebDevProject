import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const FilterField = ({ index }) => {
  const nutritionalInfoFields = [
    "Calories",
    "Protein (g)",
    "Total Carbohydrates (g)",
    "Sugar (g)",
    "Total Fat (g)",
    "Saturated Fat (g)",
    "Cholesterol (mg)",
    "Dietary Fiber (g)",
    "Sodium (mg)",
    "Potassium (mg)",
    "Calcium (mg)",
    "Iron (mg)",
    "Trans fat (g)",
    "Vitamin D (IU)",
    "Vitamin C (mg)",
    "Calories from Fat",
    "Vitamin A (RE)",
    "Saturated Fat + Trans Fat (g)"
  ];


  return (
    <div className="d-inline-block align-middle" style={{marginLeft: 25}}>
      <Form.Select className="d-inline-block" style={{width: "fit-content"}}>
        { nutritionalInfoFields.map(e => {
          return (
            <option>{e}</option>
          )
        }) }
      </Form.Select>
      <Button className="d-inline-block" style={{marginLeft: 10}}></Button>
    </div>
  );
}

export default FilterField;