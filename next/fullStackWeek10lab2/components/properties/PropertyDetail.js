import { useRouter } from 'next/router';
import classes from './PropertyDetail.module.css'

function PropertyDetail(props) {
    const router = useRouter();

    const handleUsernameClick = () => {
        if (props.creatorId) {
            router.push(`/user/${props.creatorId}`);
        }
    };

    return (
        <section className={classes.detail}>
            <img src={props.image} alt={props.name} />
            <h1>{props.name}</h1>
            {props.verifiedAgent && (
                <p className={classes.verifiedBadge}>✓ Verified Agent Listing</p>
            )}
            <p className={classes.type}>{props.propertyType} - {props.propertySubtype}</p>
            <address>{props.address}, {props.city}, {props.county}</address>
            <p className={classes.price}>€{Number(props.price).toLocaleString()}</p>
            {props.bedrooms && <p>Bedrooms: {props.bedrooms}</p>}
            <p>Floor Size: {props.floorSize} m²</p>

            <div className={classes.creatorInfo}>
                <h3>Contact Information</h3>
                <p className={classes.listedBy}>
                    Listed by: <span className={classes.usernameLink} onClick={handleUsernameClick}>{props.creatorUsername}</span>
                </p>
                <p>Email: <a href={`mailto:${props.creatorEmail}`}>{props.creatorEmail}</a></p>
                <p>Phone: <a href={`tel:${props.creatorPhoneNumber}`}>{props.creatorPhoneNumber}</a></p>
            </div>
        </section>
    )
}

export default PropertyDetail