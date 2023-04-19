import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
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
  const groupedItems = data ? data.reduce((result, item) => {
    const category = item.category;
    if (!result[category]) {
      result[category] = [];
    }
    result[category].push(item);
    return result;
  }, {}) : null;
  console.log(data);
  console.log('groupeditems', groupedItems);
  
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
        {data ? Object.keys(groupedItems).map(category => (
          <Row>
            <Col>
              <h2>{category}</h2>
              <hr />
              <div className='d-flex flex-wrap'>
                {groupedItems[category].map(item => (
                  <Link key={item._id} to={`/items/${locationName.toLowerCase()}/${item._id}`} style={{"textDecoration": "none", "color": "black"}} >
                    <ItemCard itemData={item}/>
                  </Link>
                ))}
              </div>
            </Col>
          </Row>
        )) : ''}        
      </Container>
    </div>
  );
}

export default LocationPage;