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
import FilterField from '../components/FilterField/FilterField';
import { Link } from 'react-router-dom';
import { getData } from '../../utilities/apiUtilities';
import { useEffect, useState } from 'react';
import RatingStars from '../components/RatingStars/RatingStars';
import SearchIcon from '../components/SearchIcon/SearchIcon';
import ItemBadge from '../components/ItemBadge/ItemBadge';
import Button from 'react-bootstrap/Button';
import PlusIcon from '../components/PlusIcon/PlusIcon';
import SortBy from '../components/SortBy/SortBy';
import SortByField from '../components/SortBy/SortByField';

// const LocationPage = ({ locationData, itemsData, reviewsData, locationName }) => {
const LocationPage = ({ locationName, averageRating }) => {
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [searchedData, setSearchedData] = useState([]);
  
  const [searchQuery, setSearchQuery] = useState("");

  const [open, setOpen] = useState(false);
  const [sortByOpen, setSortByOpen] = useState(false);
  const [mealTimesFilter, setMealTimesFilter] = useState({
    "Breakfast": false,
    "Lunch": false,
    "Dinner": false,
    "Every Day": false
  });
  const [sortBy, setSortBy] = useState(null);
  const [sortByField, setSortByField] = useState("Calories")

  const allMealTimesFilter = {
    "Breakfast": true,
    "Lunch": true,
    "Dinner": true,
    "Every Day": true
  };

  const [nutritionalInfoFilter, setNutritionalInfoFilter] = useState([]);

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
    // console.log(item)

    if (sortBy === "Highest rated") {
      result[category].sort((item1, item2) => ((item2.total_rating / item2.num_reviews) - (item1.total_rating / item1.num_reviews)));
    }
    else if (sortBy === "Lowest rated") {
      result[category].sort((item1, item2) => ((item1.total_rating / item1.num_reviews) - (item2.total_rating / item2.num_reviews)));
    }
    else if (sortBy === "Highest field") {
      result[category].sort((item1, item2) => {
        if (item1.nutritional_info && item2.nutritional_info) {
          let item1Val;
          let item2Val;
          for (const nutrient of item1.nutritional_info.nutrients) {
            if (nutrient.name === sortByField) {
              item1Val = parseInt(nutrient.value);
              break;
            }
          }
          for (const nutrient of item2.nutritional_info.nutrients) {
            if (nutrient.name === sortByField) {
              item2Val = parseInt(nutrient.value);
              break;
            }
          }
          return item2Val - item1Val;
        }
        return 1;
      });
    }
    else if (sortBy === "Lowest field") {
      result[category].sort((item1, item2) => {
        if (item1.nutritional_info && item2.nutritional_info) {
          let item1Val;
          let item2Val;
          for (const nutrient of item1.nutritional_info.nutrients) {
            if (nutrient.name === sortByField) {
              item1Val = parseInt(nutrient.value);
              break;
            }
          }
          for (const nutrient of item2.nutritional_info.nutrients) {
            if (nutrient.name === sortByField) {
              item2Val = parseInt(nutrient.value);
              break;
            }
          }
          return item1Val - item2Val;
        }
        return 1;
      });
    }

    return result;
  }, {}) : null;  
  
  const mealGroupedItems = allData ? allData.reduce((result, item) => {
    if (!result[item.meal_time]) {
      result[item.meal_time] = [];
    }
    result[item.meal_time].push(item);
    return result;
  }, {}) : null;

  // console.log(data);
  // console.log('groupeditems', groupedItems);

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    getData(`dining-hall/${locationName}?name=${e.target.value}`)
      .then(response => {
        setSearchedData(response);

        updateData(mealTimesFilter, nutritionalInfoFilter, response, e.target.value !== "");
      });
  }

  const handleMealTimesFilterChange = (checked, mealTime) => {
    const newMealTimesFilter = {... mealTimesFilter};
    newMealTimesFilter[mealTime] = checked;
    setMealTimesFilter(newMealTimesFilter);

    updateData(newMealTimesFilter, nutritionalInfoFilter, searchedData, searchQuery !== "");
  }

  const handleAddFilterClick = () => {
    const newNutritionalInfoFilter = [...nutritionalInfoFilter];
    newNutritionalInfoFilter.push({
      nutritionalInfoField: "Calories",
      comparisonOperator: "<",
      value: null
    });

    setNutritionalInfoFilter(newNutritionalInfoFilter);
    console.log(newNutritionalInfoFilter);
  }

  const filterItem = (nutrient, info) => {
    nutrient.value = parseInt(nutrient.value)
    if (info.comparisonOperator === "<" && nutrient.value < info.value) {
      return true;
    }
    else if (info.comparisonOperator === "<=" && nutrient.value <= info.value) {
      return true;
    }
    else if (info.comparisonOperator === ">" && nutrient.value > info.value) {
      return true;
    }
    else if (info.comparisonOperator === ">=" && nutrient.value >= info.value) {
      return true;
    }
    else if (info.comparisonOperator === "==" && nutrient.value === info.value) {
      return true;
    }
    else if (info.comparisonOperator === "!=" && nutrient.value !== info.value) {
      return true;
    }
    return false;
  }

  const updateData = (newMealTimesFilter, newNutritionalInfoFilter, searchedData, useSearch) => {
    if (Object.values(newMealTimesFilter).every(e => e === false)) {
      newMealTimesFilter = allMealTimesFilter;
    }
    
    const newData = [];
    // console.log(useSearch)

    let currData;
    if (useSearch) {
      currData = searchedData;
    }
    else {
      currData = allData;
    }

    for (const item of currData) {
      if (item.nutritional_info === null) {
        continue;
      }
      
      let isCorrectMealTime = false;
      for (const [mealTime, checked] of Object.entries(newMealTimesFilter)) {
        if (item.meal_time === mealTime) {
          if (checked) {
            isCorrectMealTime = true;
          }
          break;
        }
      }

      if (!isCorrectMealTime) {
        continue;
      }

      let filtered = true;
      for (const filter of newNutritionalInfoFilter) {
        if (filter.value === null) {
          continue;
        }
        for (const nutrient of item.nutritional_info.nutrients) {
          if (nutrient.name === filter.nutritionalInfoField) {
            if (!filterItem(nutrient, filter)) {
              filtered = false;
            }
            break;
          }
        }
      }
      if (filtered) {
        newData.push(item);
      }
    }

    setData(newData);
  }

  const handleRemoveIndex = (index) => {
    const newNutritionalInfoFilter = [...nutritionalInfoFilter];
    console.log(newNutritionalInfoFilter, index);
    newNutritionalInfoFilter.splice(index, 1);
    console.log(newNutritionalInfoFilter);
    setNutritionalInfoFilter(newNutritionalInfoFilter);

    if (newNutritionalInfoFilter.length === 0) {
      setData(allData);
      return;
    }

    updateData(mealTimesFilter, newNutritionalInfoFilter, searchedData, searchQuery !== "");
  }

  const handleUpdateIndex = (index, info) => {
    const newNutritionalInfoFilter = [...nutritionalInfoFilter];
    newNutritionalInfoFilter[index] = info;
    setNutritionalInfoFilter(newNutritionalInfoFilter);

    if (info.value === null) {
      return;
    }

    updateData(mealTimesFilter, newNutritionalInfoFilter, searchedData, searchQuery != "");
  }

  const handleSortByFieldChange = (value) => {
    setSortByField(value);
  }

  const handleSortByChange = (e, option) => {
    setSortBy(option);
  }

  const mealTimes = ["Breakfast", "Lunch", "Dinner", "Every Day"];

  const filterFields = [];

  for (let i = 0; i < nutritionalInfoFilter.length; i++) {
    filterFields.push(
      <FilterField 
        index={i}
        filter={nutritionalInfoFilter[i]}
        handleRemoveIndex={handleRemoveIndex}
        handleUpdateIndex={handleUpdateIndex}
      />
    );
  }

  // console.log(mealGroupedItems);

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
                precision={0.1}
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
            {mealGroupedItems && mealGroupedItems["Breakfast"] ? mealGroupedItems['Breakfast'].sort((item1, item2) => (item1.rating - item2.rating)).slice(0,3).map(item => (<p>{item.name}</p>)) : ''}
          </Col>
          <Col>
            <h3><span className='badge text-secondary' style={{backgroundColor:'#e4e8ec'}}>Lunch</span></h3>
            {mealGroupedItems && mealGroupedItems["Lunch"] ? mealGroupedItems['Lunch'].sort((item1, item2) => (item1.rating - item2.rating)).slice(0,3).map(item => (<p>{item.name}</p>)) : ''}
          </Col>
          <Col>
            <h3><span className='badge text-secondary' style={{backgroundColor:'#e4e8ec'}}>Dinner</span></h3>
            {mealGroupedItems && mealGroupedItems["Dinner"] ? mealGroupedItems['Dinner'].sort((item1, item2) => (item1.rating - item2.rating)).slice(0,3).map(item => (<p>{item.name}</p>)) : ''}
          </Col>
        </Row>
        <Row>
          <Col className="d-flex justify-content-between mt-4">
            <InputGroup  onChange={handleInputChange} style={{width: "83%"}}>
              <InputGroup.Text><SearchIcon /></InputGroup.Text>
              <Form.Control
                placeholder="Search by menu item name..."
                
              />
              
            </InputGroup>
            <Filter 
              open={open}
              setOpen={setOpen}
            />
            <SortBy
              open={sortByOpen}
              setOpen={setSortByOpen}
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
                      key={`checkbox-${e}`}
                      onChange={(event) => handleMealTimesFilterChange(event.target.checked, e)}
                      type="checkbox"
                      label={<ItemBadge text={e}/>}
                      className="d-inline-block align-middle"
                      style={{
                        marginLeft: 25
                      }}
                    />
                  );
                }) }

                { filterFields }
                <div />
                <Button
                  variant="outline-dark"
                  className="align-middle mt-3"
                  style={{
                    marginLeft: 25,
                    width: 30,
                    height: 30,
                    padding: 0,
                  }}
                  onClick={handleAddFilterClick}
                >
                  <PlusIcon />
                </Button>
              </Form>
            </Collapse>
            <Collapse in={sortByOpen} className="m-3">
              <Form>
                <Form.Check
                  type="radio"
                  label="None"
                  className="d-inline-block"
                  onChange={(e) => handleSortByChange(e, "")}
                  name="group1"
                />
                <Form.Check
                  type="radio"
                  label="Highest rated"
                  className="d-inline-block"
                  style={{marginLeft: 25}}
                  onChange={(e) => handleSortByChange(e, "Highest rated")}
                  name="group1"
                />
                <Form.Check
                  type="radio"
                  label="Lowest rated"
                  className="d-inline-block"
                  onChange={(e) => handleSortByChange(e, "Lowest rated")}
                  style={{marginLeft: 25}}
                  name="group1"
                />
                <Form.Check
                  type="radio"
                  label="Highest"
                  className="d-inline-block"
                  onChange={(e) => handleSortByChange(e, `Highest field`)}
                  style={{marginLeft: 25}}
                  name="group1"
                />
                <Form.Check
                  type="radio"
                  label="Lowest"
                  className="d-inline-block"
                  onChange={(e) => handleSortByChange(e, `Lowest field`)}
                  style={{marginLeft: 25}}
                  name="group1"
                />
                <SortByField
                  setNutritionalInfoField={handleSortByFieldChange}
                />
              </Form>
            </Collapse>
          </Col>
        </Row>
        {data ? Object.keys(groupedItems).map(category => (
          <Row key={category} className="mt-4 mb-4">
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