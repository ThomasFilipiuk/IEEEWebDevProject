import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';
import LocationCard from '../components/LocationCard/LocationCard';
import AppNav from '../components/AppNav/AppNav';
import Dropdown from '../components/Dropdown/Dropdown';
import { useState } from 'react';

const AllLocations = ({ data }) => {  
  const [sortCriteria, setSortCriteria] = useState('Alphabetical');
  console.log('sortCriteria', sortCriteria) ;
  const sortByRating = Object.entries(data).sort((a, b) => (b[1].avg_rating - a[1].avg_rating));
  const sortByAlpha = Object.entries(data).sort((a, b) => (a[1].name - b[1].name));
  const sortedData = sortCriteria === 'Alphabetical' ? sortByAlpha : sortByRating;

  // console.log('object entry data:',Object.entries(data));
  // console.log('sorted data:',sortedData);
  return (
    <div className="App bg-light">
      <AppNav></AppNav>      
      
      <Container fluid="md">
        <Dropdown setSortCriteria={setSortCriteria} className='m-3' />
        <Row>
          <Col>{sortedData.map(([key, value]) => {
            // console.log('value', value);
            return (
            <Link key={key} to={`/${key}`} style={{"textDecoration": "none", "color": "black"}} >
              <LocationCard locationData={value} locationName={key.charAt(0).toUpperCase() + key.slice(1)} />
            </Link>)})}</Col>
        </Row>
      </Container>
    </div>
  );
}
export default AllLocations;