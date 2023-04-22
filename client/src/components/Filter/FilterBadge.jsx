import Badge from 'react-bootstrap/Badge';

const FilterBadge = ({ text }) => {
  return (
    // <p>WHAT</p>
    <Badge 
      // href={ href }
      pill
      // bg="secondary"
      className={text.toLowerCase()}
      style={{
        marginLeft: 5
      }}
    >
      No
    </Badge>
  )
}

export default FilterBadge;