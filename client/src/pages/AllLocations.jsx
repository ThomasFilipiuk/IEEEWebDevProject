import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';
import LocationCard from '../components/LocationCard/LocationCard';
import AppNav from '../components/AppNav/AppNav';
import Filter from '../components/Dropdown/Dropdown';

const AllLocations = ({ data }) => {  
  return (
    <div className="App">
      <AppNav></AppNav>
      <Filter>

      </Filter>
      <Container fluid="md">
        <Row>
          <Col>{Object.entries(data).map(([key, value]) => (
            <Link key={key} to={`/${key}`} style={{"textDecoration": "none", "color": "black"}} >
              <LocationCard locationData={value} locationName={key.charAt(0).toUpperCase() + key.slice(1)} />
            </Link>))}</Col>
        </Row>
      </Container>
    </div>
  );
}
export default AllLocations;