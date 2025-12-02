import classes from './PropertyDetail.module.css'

function PropertyDetail(props) {
    return (
        <section className={classes.detail}>
            <img src={props.image} alt={props.title} />
            <h1>{props.title}</h1>
            <address>{props.address}</address>
            <p>Price: ${props.price}</p>
            <p>{props.bedrooms} Bedrooms, {props.bathrooms} Bathrooms</p>
            <p>{props.description}</p>
        </section>
    )
}

export default PropertyDetail