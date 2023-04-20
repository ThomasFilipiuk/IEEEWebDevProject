import { useState } from 'react';
import Collapse from 'react-bootstrap/Collapse';
import Button from 'react-bootstrap/Button';
import FilterBadge from './FilterBadge';

// https://dribbble.com/shots/15005862-Table-Filters


const Filter = () => {
  const [open, setOpen] = useState(false);
  
  return (
    <div>
      <Button
        onClick={() => setOpen(!open)}
      >
        Filter
      </Button>
      <Collapse in={open} className="m-3">
        <div>
          <FilterBadge />
        </div>
      </Collapse>
    </div>
  )
}

export default Filter;