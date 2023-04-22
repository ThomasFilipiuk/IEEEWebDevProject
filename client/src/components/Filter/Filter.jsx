import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import ExpandIcon from '../ExpandIcon/ExpandIcon';
import CollapseIcon from '../CollapseIcon/CollapseIcon';

// https://dribbble.com/shots/15005862-Table-Filters


const Filter = ({ open, setOpen }) => {
  return (
    <Button
      onClick={() => setOpen(!open)}
    >
      Filter
      <span style={{marginLeft: 5}}>
        { 
          open
            ? <CollapseIcon />
            : <ExpandIcon />
        }
      </span>
    </Button>
  )
}

export default Filter;