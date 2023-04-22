import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const FilterField = ({ index, filter, handleRemoveIndex, handleUpdateIndex }) => {
  const [nutritionalInfoField, setNutritionalInfoField] = useState("Calories");
  const [comparisonOperator, setComparisonOperator] = useState("<");
  const [value, setValue] = useState(null);

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
    <div className="mt-3 d-flex align-items-center justify-content-center">
      <Form.Select 
        className="d-inline-block" 
        style={{width: "fit-content"}}
        onChange={(e) => {
          console.log(e.target.value)
          setNutritionalInfoField(e.target.value);
          handleUpdateIndex(index, {
            nutritionalInfoField: e.target.value,
            comparisonOperator: comparisonOperator,
            value: value
          });
        }}
        value={filter.nutritionalInfoField}
      >
        { nutritionalInfoFields.map(e => {
            return (
              <option>{e}</option>
            );
          }) 
        }
      </Form.Select>
      <Form.Select 
        className="d-inline-block" 
        style={{width: "fit-content", marginLeft: 10}}
        onChange={(e) => {
          setComparisonOperator(e.target.value)
          handleUpdateIndex(index, {
            nutritionalInfoField: nutritionalInfoField,
            comparisonOperator: e.target.value,
            value: value
          });
        }}  
        value={filter.comparisonOperator}
      >
        <option>{'<'}</option>
        <option>{'<='}</option>
        <option>{'>'}</option>
        <option>{'>='}</option>
        <option>{'=='}</option>
        <option>{'!='}</option>
      </Form.Select>
      <Form.Control 
        className="d-inline-block" 
        style={{marginLeft: 10, width: 75}}
        type="number"
        onChange={(e) => {
          setValue(parseInt(e.target.value));
          handleUpdateIndex(index, {
            nutritionalInfoField: nutritionalInfoField,
            comparisonOperator: comparisonOperator,
            value: parseInt(e.target.value)
          });
        }}
        value={filter.value === null ? "" : filter.value}
      />
      <Button 
        variant="outline-dark"
        className="d-inline-block" 
        style={{marginLeft: 10}}
        onClick={() => handleRemoveIndex(index)}
      >
        X
      </Button>
    </div>
  );
}

export default FilterField;