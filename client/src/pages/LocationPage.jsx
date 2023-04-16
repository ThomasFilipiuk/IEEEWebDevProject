import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ItemCard from '../components/ItemCard/ItemCard';
import { Link } from 'react-router-dom';
import { getData } from '../../utilities/apiUtilities';
import { useEffect, useState } from 'react';

// const LocationPage = ({ locationData, itemsData, reviewsData, locationName }) => {
const LocationPage = ({ locationName }) => {
  let [data, setData] = useState(null);  
  useEffect(() => {getData(`dining-hall/${locationName}`).then(response => {
    // console.log(response);
    setData(response);    
  }
  );}, [])
  console.log(data);
  return (
    <div className="App">
      <Container fluid="md">
        <Row>
          <Col className='m-5'>
            <h1>
              {locationName}
            </h1>
            <Link to="/">Return to locations</Link>
          </Col>
        </Row>
        <Row>
          <Col>
            {data ? data.map((item) => (<ItemCard itemData={item}/>)) : ''}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default LocationPage;