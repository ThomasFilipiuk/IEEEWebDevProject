import Badge from 'react-bootstrap/Badge';
import "./ItemBadge.css"

const ItemBadge = ({ href, text }) => {
  return (
    <Badge 
      // href={ href }
      pill
      bg="secondary"
      className={text.toLowerCase()}
    >
      { text }
    </Badge>
  )
}

export default ItemBadge;