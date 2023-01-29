import { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AllLocations from './pages/AllLocations';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LocationPage from './pages/LocationPage';
import Container from 'react-bootstrap/esm/Container';
import ItemPage from './pages/ItemPage';


const App = () => {
  const data = {
    "locations": {
      "Sarge": {
        "name": "Sarge",
        "averageRating": 4.5,
        "topItem": "Tenders",
        "imageLink": "placeholderurl"
      },
      "Elder": {
        "name": "Elder",
        "averageRating": 3.6,
        "topItem": "Burders",
        "imageLink": "placeholderurl2"
      }
    },
    "items": {
      "2b8-9-4206-9fdf-00208769e96ab826c0": {
        "name": "Tenders",
        "description": "Chicken tenders",
        "location": "Sarge",
        "reviews": {
          "0": "",
          "1": "9fdf-00208769e96ab8b8-9-4206-9",          
        }
      },
      "e96ab8b89fdf-00208769-9-4206-9": {
        "name": "Ravioli",
        "description": "Beef ravioli with cheese",
        "location": "Sarge",
        "reviews": {
          "0": "",
          "1": "fbdf-00208769e96ab8b8-9-4206-9",
          "2": "e96abfbdf-002087698b8-9-4206-9"
        }
      }
    },
    "reviews": {
      "9fdf-00208769e96ab8b8-9-4206-9": {
        "author": "f-0020879fd69e96ab8b8-9-4206-9",
        "text": "I love tenders",
        "rating": 5,
        "imageLink": "placeholderurl", 
        "likes": 0
      }, 
      "fbdf-00208769e96ab8b8-9-4206-9": {
        "author": "f-0020879fd69e96ab8b8-9-4206-9",
        "text": "I love pasta pasta",
        "rating": 5,
        "imageLink": "placeholderurl", 
        "likes": 0
      },
      "e96abfbdf-002087698b8-9-4206-9": {
        "author": "f-0020879fd69e96ab8b8-9-4206-9",
        "text": "I love pasta pasta even more but this pasta was terrible",
        "rating": 2,
        "imageLink": "placeholderurl", 
        "likes": 0
      }
    },
    "users": {
      "f-0020879fd69e96ab8b8-9-4206-9": {
        "name": "test user",
        "posts": {
          "0": "",
          "1": "9fdf-00208769e96ab8b8-9-4206-9",
          "2": "fbdf-00208769e96ab8b8-9-4206-9",
          "3": "e96abfbdf-002087698b8-9-4206-9"
        }, 
        "likedPosts": {
          "0": "",
          "1": "9fdf-00208769e96ab8b8-9-4206-9"
        }
      }
    }
  }
  console.log(Object.entries(data.locations));
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AllLocations data={data} />} />
        {Object.entries(data.locations).map(([key, value]) => (
          <Route 
            path={`${value.name}`} 
            key={`${value.name}`} 
            element={
              <LocationPage 
                locationData={value} 
                itemsData={Object.entries(data.items).filter(([k, v]) => (
                  v.location === value.name
                ))}
                reviewsData={data.reviews}
              />} 
          />))
        }    
        {Object.entries(data.items).map(([key, value]) => (
          <Route 
            path={`${key}`} 
            key={`${key}`} 
            element={
              <ItemPage 
                itemData={value} 
                reviewsData={Object.entries(data.reviews).filter(([k, v]) => {
                  return (         
                    Object.values(value.reviews).includes(k)
                  );
              })} />}
          />))
        }       
      </Routes>
    </BrowserRouter>    
  );
};

export default App;
