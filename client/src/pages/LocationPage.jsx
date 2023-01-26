import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ItemCard from '../components/ItemCard/ItemCard';

const LocationPage = ({ locationData, itemsData, reviewData }) => {
  return (
    <div className="App">
      <Container fluid="md">
        <Row>
          <Col>
            <h1>
              {locationData.name}
            </h1>
          </Col>
        </Row>
        <Row>
          <Col>
            {itemsData.map(([key, value]) => (<ItemCard key={key} 
              itemData={value} 
              // reviewData={reviewData.filter(([key, value]) => (value.reviews.includes(key)))}
              // locationData={locationData} 
              />))}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default LocationPage;