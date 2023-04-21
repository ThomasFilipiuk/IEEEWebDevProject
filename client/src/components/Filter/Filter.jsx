import { useState } from 'react';
import Button from 'react-bootstrap/Button';

// https://dribbble.com/shots/15005862-Table-Filters


const Filter = ({ open, setOpen }) => {
  return (
    <Button
      onClick={() => setOpen(!open)}
    >
      Filter
    </Button>
  )
}

export default Filter;