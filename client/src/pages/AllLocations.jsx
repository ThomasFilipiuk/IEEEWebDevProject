import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';
import LocationCard from '../components/LocationCard/LocationCard';

const AllLocations = ({ data }) => {
  return (
    <div className="App">
      <Container fluid="md">
        <Row>
          <Col>{Object.entries(data.locations).map(([key, value]) => (
            <Link key={value.name} to={`/${value.name}`} style={{"textDecoration": "none", "color": "black"}} >
              <LocationCard locationData={value} />
            </Link>))}</Col>
        </Row>
      </Container>
    </div>
  );
}
export default AllLocations;