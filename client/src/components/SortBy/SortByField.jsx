import Form from 'react-bootstrap/Form';

const SortByField = ({ setNutritionalInfoField }) => {
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
    <Form.Select 
      className="d-inline-block" 
      style={{width: "fit-content", marginLeft: 25}}
      onChange={(e) => {
        console.log(e.target.value)
        setNutritionalInfoField(e.target.value);
      }}
    >
      { nutritionalInfoFields.map(e => {
          return (
            <option>{e}</option>
          );
        }) 
      }
    </Form.Select>
  )
}

export default SortByField;