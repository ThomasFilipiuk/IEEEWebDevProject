import Button from 'react-bootstrap/Button';
import ExpandIcon from '../ExpandIcon/ExpandIcon';
import CollapseIcon from '../CollapseIcon/CollapseIcon';

const SortBy = ({ open, setOpen }) => {
  return (
    <Button
      onClick={() => setOpen(!open)}
    >
      Sort by
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

export default SortBy;