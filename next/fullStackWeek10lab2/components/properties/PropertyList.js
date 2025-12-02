import PropertyItem from './PropertyItem';
import classes from './PropertyList.module.css';

function PropertyList(props) {
  return (
    <ul className={classes.list}>
      {props.properties.map((property) => (
        <PropertyItem
          key={property._id}
          id={property._id}
          image={property.image}
          title={property.title}
          address={property.address}
          price={property.price}
        />
      ))}
    </ul>
  );
}

export default PropertyList;
