import Card from '../ui/Card';
import classes from './PropertyItem.module.css';
import { useRouter } from 'next/router';

function PropertyItem(props) {
  const router = useRouter();

  function showDetailsHandler() {
    router.push('/' + props.id);
  }

  return (
    <li className={classes.item}>
      <Card>
        <div className={classes.image}>
          <img src={props.image} alt={props.name} />
          {props.verifiedAgent && (
            <span className={classes.verifiedBadge}>✓ Verified Agent</span>
          )}
        </div>
        <div className={classes.content}>
          <h3>{props.name}</h3>
          <p className={classes.type}>{props.propertyType} - {props.propertySubtype}</p>
          <address>{props.city}, {props.county}</address>
          <p className={classes.price}>€{Number(props.price).toLocaleString()}</p>
          {props.bedrooms && <p className={classes.bedrooms}>{props.bedrooms} Bedrooms</p>}
          <p className={classes.floorSize}>{props.floorSize} m²</p>
        </div>
        <div className={classes.actions}>
          <button onClick={showDetailsHandler}>Show Details</button>
        </div>
      </Card>
    </li>
  );
}

export default PropertyItem;
