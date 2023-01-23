import { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AllLocations from './pages/AllLocations';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LocationPage from './pages/LocationPage';
import Container from 'react-bootstrap/esm/Container';


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
      }
    },
    "reviews": {
      "9fdf-00208769e96ab8b8-9-4206-9": {
        "author": "user",
        "text": "I love tenders",
        "rating": 5,
        "imageLink": "placeholderurl", 
        "likes": 0
      }
    },
    "users": {
      "f-0020879fd69e96ab8b8-9-4206-9": {
        "name": "test user",
        "posts": {
          "0": "",
          "1": "9fdf-00208769e96ab8b8-9-4206-9"
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
            element={<LocationPage 
              locationData={value} 
              itemsData={Object.entries(data.items).filter(([k, v]) => (
                v.location === value.name
              ))} />} 
              reivewData={Object.entries(data.reviews)}
          />))
        }        
      </Routes>
    </BrowserRouter>    
  );
};

export default App;
