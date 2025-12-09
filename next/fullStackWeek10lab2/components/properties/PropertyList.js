import PropertyItem from './PropertyItem';
import classes from './PropertyList.module.css';

function PropertyList(props) {
  return (
    <ul className={classes.list}>
      {props.properties.map((property) => (
        <PropertyItem
          key={property._id}
          id={property._id}
          name={property.name}
          image={property.image}
          city={property.city}
          county={property.county}
          price={property.price}
          propertyType={property.propertyType}
          propertySubtype={property.propertySubtype}
          bedrooms={property.bedrooms}
          floorSize={property.floorSize}
          verifiedAgent={property.verifiedAgent}
          listingType={property.listingType}
        />
      ))}
    </ul>
  );
}

export default PropertyList;
