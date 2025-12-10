import PropertyItem from './PropertyItem';
import classes from './PropertyList.module.css';

function PropertyList(props) {
  const viewMode = props.viewMode || 'grid';

  return (
    <ul className={viewMode === 'grid' ? classes.list : classes.listView}>
      {props.properties.map((property) => (
        <PropertyItem
          key={property._id}
          id={property._id}
          name={property.name}
          image={property.image}
          address={property.address}
          city={property.city}
          county={property.county}
          price={property.price}
          propertyType={property.propertyType}
          propertySubtype={property.propertySubtype}
          bedrooms={property.bedrooms}
          floorSize={property.floorSize}
          verifiedAgent={property.verifiedAgent}
          listingType={property.listingType}
          viewMode={viewMode}
        />
      ))}
    </ul>
  );
}

export default PropertyList;
