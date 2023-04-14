import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AllLocations from './pages/AllLocations';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LocationPage from './pages/LocationPage';
import ItemPage from './pages/ItemPage';
import { getData } from '../utilities/apiUtilities';
import { useEffect, useState } from 'react';


const App = () => {
  let [data, setData] = useState(null);
  useEffect(() => {getData('dining-hall/allison').then(response => {
    console.log(response);
    setData(response);
  }
  );}, [])
  console.log(data);
  // const data = {"locations": {
  //   "Sarge": {
  //     "name": "Sarge",
  //     "averageRating": 4.5,
  //     "topItem": "Tenders",
  //     "imageLink": "placeholderurl"
  //   },
  //   "Elder": {
  //     "name": "Elder",
  //     "averageRating": 3.6,
  //     "topItem": "Burders",
  //     "imageLink": "placeholderurl2"
  //   }
  // }};
  // console.log(Object.entries(data.locations));
  // return (
  //   <BrowserRouter>
  //     <Routes>
  //       <Route path="/" element={<AllLocations data={data} />} />
  //       {Object.entries(data.locations).map(([key, value]) => (
  //         <Route 
  //           path={`${value.name}`} 
  //           key={`${value.name}`} 
  //           element={
  //             <LocationPage 
  //               locationData={value}                 
  //               itemsData={getData(`dining-halls/${value.name}`)}
  //               // itemsData={Object.entries(data.items).filter(([k, v]) => (
  //               //   v.location === value.name
  //               // ))}
  //               reviewsData={data.reviews}
  //             />} 
  //         />))
  //       }    
  //       {/* {Object.entries(data.items).map(([key, value]) => (
  //         <Route 
  //           path={`${key}`} 
  //           key={`${key}`} 
  //           element={
  //             <ItemPage 
  //               itemData={value} 
  //               reviewsData={Object.entries(data.reviews).filter(([k, v]) => {
  //                 return (         
  //                   Object.values(value.reviews).includes(k)
  //                 );
  //             })} />}
  //         />))
  //       }        */}
  //     </Routes>
  //   </BrowserRouter>    
  // );
};

export default App;
