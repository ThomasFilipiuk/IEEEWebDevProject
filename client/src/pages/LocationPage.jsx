import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ItemCard from '../components/ItemCard/ItemCard';
import { Link } from 'react-router-dom';

const LocationPage = ({ locationData, itemsData, reviewsData }) => {
  return (
    <div className="App">
      <Container fluid="md">
        <Row>
          <Col className='m-5'>
            <h1>
              {locationData.name}
            </h1>
            <Link to="/">Return to locations</Link>
          </Col>
        </Row>
        <Row>
          <Col>
            {itemsData.map(([key, value]) => (
              <Link key={key} to={`/${key}`} style={{"textDecoration": "none", "color": "black"}}>
                <ItemCard itemData={value} reviewsData={reviewsData}
              // reviewData={reviewData.filter(([key, value]) => (value.reviews.includes(key)))}
              // locationData={locationData}
              /></Link>))}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default LocationPage;