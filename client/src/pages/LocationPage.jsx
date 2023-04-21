import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Collapse from 'react-bootstrap/Collapse';
import FilterBadge from "../components/Filter/FilterBadge";
import ItemCard from '../components/ItemCard/ItemCard';
import Filter from '../components/Filter/Filter';
import { Link } from 'react-router-dom';
import { getData } from '../../utilities/apiUtilities';
import { useEffect, useState } from 'react';
import RatingStars from '../components/RatingStars/RatingStars';
import SearchIcon from '../components/SearchIcon/SearchIcon';
import ItemBadge from '../components/ItemBadge/ItemBadge';

// const LocationPage = ({ locationData, itemsData, reviewsData, locationName }) => {
const LocationPage = ({ locationName, averageRating }) => {
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [open, setOpen] = useState(false);
  const [mealTimesFilter, setMealTimesFilter] = useState({
    "Breakfast": false,
    "Lunch": false,
    "Dinner": false,
    "Every Day": false
  });

  useEffect(() => {
    getData(`dining-hall/${locationName}`).then(response => {
      // console.log(response);
      setData(response);
      setAllData(response);
    });
  }, []);

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
  
  const handleInputChange = (e) => {
    getData(`dining-hall/${locationName}?name=${e.target.value}`)
      .then(response => setData(response));
  }

  const handleMealTimesFilterChange = (checked, mealTime) => {
    const newMealTimesFilter = {... mealTimesFilter};
    newMealTimesFilter[mealTime] = checked;
    console.log(newMealTimesFilter);
    setMealTimesFilter(newMealTimesFilter);

    if (Object.values(newMealTimesFilter).every(e => e === false)) {
      setData(allData);
      return;
    }

    const newData = [];
    for (const item of data) {
      if (newMealTimesFilter[item.meal_time]) {
        newData.push(item);
      }
    }

    setData(newData);
  }

  const mealTimes = ["Breakfast", "Lunch", "Dinner", "Every Day"];

  return (
    <div className="App bg-light">
      <Container fluid="md">
        <Row>
          <Col className='m-5'>
            <h1>
              {locationName}
            </h1>
            <div>
              <RatingStars
                readOnly
                value={averageRating}
                size="large"
              />
            </div>
            <Link to="/">Return to locations</Link>
          </Col>
        </Row>
        <Row>
          <Col>
            <h2>Top items</h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <h3><span className='badge text-secondary' style={{backgroundColor:'#e4e8ec'}}>Breakfast</span></h3>
            <p>hihih</p>
            pooga
          </Col>
          <Col>
            <h3><span className='badge text-secondary' style={{backgroundColor:'#e4e8ec'}}>Lunch</span></h3>
            ooga
          </Col>
          <Col>
            <h3><span className='badge text-secondary' style={{backgroundColor:'#e4e8ec'}}>Dinner</span></h3>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex justify-content-between mt-4">
            <InputGroup  onChange={handleInputChange} style={{width: "90%"}}>
              <InputGroup.Text><SearchIcon /></InputGroup.Text>
              <Form.Control
                placeholder="Search by menu item name..."
                
              />
              
            </InputGroup>
            <Filter 
              open={open}
              setOpen={setOpen}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Collapse in={open} className="m-3">
              <Form>
                { mealTimes.map(e => {
                  return (
                    <Form.Check
                      onChange={(event) => handleMealTimesFilterChange(event.target.checked, e)}
                      type="checkbox"
                      label={<ItemBadge text={e}/>}
                      className="d-inline-block"
                      style={{
                        marginLeft: 25
                      }}
                    />
                  );
                }) }
              </Form>
            </Collapse>
          </Col>
        </Row>
        {data ? Object.keys(groupedItems).map(category => (
          <Row className="mt-4 mb-4">
            <Col>
              <h2>{category}</h2>
              <hr />
              <div className='d-flex flex-wrap justify-content-center'>
                {groupedItems[category].map(item => (
                  <Link key={item._id} to={`/${locationName.toLowerCase()}/${item._id}`} style={{"textDecoration": "none", "color": "black"}} >
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