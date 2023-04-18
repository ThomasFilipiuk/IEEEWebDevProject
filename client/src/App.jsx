import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AllLocations from './pages/AllLocations';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LocationPage from './pages/LocationPage';
import ItemPage from './pages/ItemPage';
import { getData } from '../utilities/apiUtilities';
import { useEffect, useState } from 'react';


const App = () => {
  
  const locationsMetadata = {
    "Sargent": {
      "name": "Sargent",
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
  };
  // console.log(Object.entries(data.locations));
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AllLocations data={locationsMetadata} />} />
        {Object.entries(locationsMetadata).map(([key, value]) => (
          <Route 
            path={`${value.name}`} 
            key={`${value.name}`} 
            element={
              <LocationPage 
                locationName={value.name}
              />} 
          />))
        }
        <Route 
          path={`/items/:locationName/:id`}
          element={<ItemPage />}
        />
      </Routes>
    </BrowserRouter>    
  );
};

export default App;
