import Card from '../ui/Card';
import classes from './PropertyItem.module.css';
import { useRouter } from 'next/router';

function PropertyItem(props) {
  const router = useRouter();
  const viewMode = props.viewMode || 'grid';

  function showDetailsHandler() {
    router.push('/' + props.id);
  }

  if (viewMode === 'list') {
    return (
      <li className={classes.itemList}>
        <Card>
          <div className={classes.listLayout}>
            <div className={classes.imageList}>
              <img src={props.image} alt={props.name} />
              {props.verifiedAgent && (
                <span className={classes.verifiedBadge}>✓ Verified</span>
              )}
              {props.listingType && (
                <span className={`${classes.listingTypeBadge} ${props.listingType === 'Buy' ? classes.forSale : classes.forRent}`}>
                  {props.listingType === 'Buy' ? 'For Sale' : 'For Rent'}
                </span>
              )}
            </div>
            <div className={classes.contentList}>
              <div className={classes.listHeader}>
                <h3>{props.name}</h3>
                <p className={classes.priceList}>€{Number(props.price).toLocaleString()}</p>
              </div>
              <p className={classes.type}>{props.propertyType} - {props.propertySubtype}</p>
              <address>{props.city}, {props.county}</address>
              <div className={classes.detailsGrid}>
                {props.bedrooms && <p className={classes.bedrooms}>🛏️ {props.bedrooms} Bedrooms</p>}
                <p className={classes.floorSize}>📐 {props.floorSize} m²</p>
              </div>
              <button className={classes.detailsButton} onClick={showDetailsHandler}>View Full Details</button>
            </div>
          </div>
        </Card>
      </li>
    );
  }

  return (
    <li className={classes.item} onClick={showDetailsHandler}>
      <div className={classes.image}>
        <img src={props.image} alt={props.name} />
        {props.listingType && (
          <span className={`${classes.listingTypeBadge} ${props.listingType === 'Buy' ? classes.forSale : classes.forRent}`}>
            {props.listingType === 'Buy' ? 'For Sale' : 'For Rent'}
          </span>
        )}
      </div>
      <div className={classes.content}>
        <div className={classes.titleRow}>
          <h3>{props.name}</h3>
          <p className={classes.price}>${Number(props.price).toLocaleString()}</p>
        </div>
        <address>{props.address}, {props.county}</address>
        <div className={classes.details}>
          <span className={classes.detailItem}>
            {props.floorSize} m²
          </span>
          {props.bedrooms && (
            <span className={classes.detailItem}>
              {props.bedrooms} rooms
            </span>
          )}
        </div>
      </div>
    </li>
  );
}

export default PropertyItem;
