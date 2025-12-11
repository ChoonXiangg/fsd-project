import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import GlobalContext from '../../pages/store/globalContext';
import classes from './PropertyDetail.module.css'

function PropertyDetail(props) {
    const router = useRouter();
    const globalCtx = useContext(GlobalContext);
    const user = globalCtx.theGlobalObject.user;

    const [isStarred, setIsStarred] = useState(
        props.starredBy && user ? props.starredBy.includes(user.id) : false
    );
    const [loading, setLoading] = useState(false);

    const handleUsernameClick = () => {
        if (props.creatorId) {
            router.push(`/user/${props.creatorId}`);
        }
    };

    const handleStarClick = async () => {
        if (!user) {
            alert('Please log in to star properties');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/toggle-star', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    propertyId: props.propertyId
                })
            });

            if (response.ok) {
                const data = await response.json();
                setIsStarred(data.isStarred);
                // Refresh properties data
                await globalCtx.updateGlobals({ cmd: 'fetchPropertiesFromDB' });
                // Small delay to ensure state propagates through context
                await new Promise(resolve => setTimeout(resolve, 100));
            } else {
                const data = await response.json();
                alert(data.message || 'Failed to toggle star');
            }
        } catch (error) {
            console.error('Error toggling star:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className={classes.detail}>
            <img src={props.image} alt={props.name} className={classes.mainImage} />
            <div className={classes.detailsContainer}>
                <div className={classes.titleRow}>
                    <h1>{props.name}</h1>
                    {user && (
                        <button
                            className={`${classes.starButton} ${isStarred ? classes.starred : ''}`}
                            onClick={handleStarClick}
                            disabled={loading}
                            aria-label={isStarred ? 'Unstar property' : 'Star property'}
                        >
                            {isStarred ? '★' : '☆'}
                        </button>
                    )}
                </div>
                {props.verifiedAgent && (
                    <p className={classes.verifiedBadge}>Verified Agent Listing</p>
                )}
                {props.listingType && (
                    <p className={`${classes.listingTypeBadge} ${props.listingType === 'Buy' ? classes.forSale : classes.forRent}`}>
                        {props.listingType === 'Buy' ? 'For Sale' : 'For Rent'}
                    </p>
                )}
                <p className={classes.type}>{props.propertyType} - {props.propertySubtype}</p>
                <address className={classes.addressText}>{props.address}, {props.city}, {props.county}</address>
                <p className={classes.price}>€{Number(props.price).toLocaleString()}</p>
                <div className={classes.attributesGrid}>
                    {props.bedrooms && (
                        <div className={classes.attributeItem}>
                            <span className={classes.attributeLabel}>Bedrooms:</span> {props.bedrooms}
                        </div>
                    )}
                    <div className={classes.attributeItem}>
                        <span className={classes.attributeLabel}>Floor Size:</span> {props.floorSize} m²
                    </div>
                    {props.dateAdded && (
                        <div className={classes.attributeItem}>
                            <span className={classes.attributeLabel}>Listed on:</span> {new Date(props.dateAdded).toLocaleDateString()}
                        </div>
                    )}
                </div>

                <div className={classes.creatorInfo}>
                    <h3>Contact Information</h3>
                    <p className={classes.listedBy}>
                        Listed by: <span className={classes.usernameLink} onClick={handleUsernameClick}>{props.creatorUsername}</span>
                    </p>
                    <p>Email: <a href={`mailto:${props.creatorEmail}`}>{props.creatorEmail}</a></p>
                    <p>Phone: <a href={`tel:${props.creatorPhoneNumber}`}>{props.creatorPhoneNumber}</a></p>
                </div>
            </div>
        </section>
    )
}

export default PropertyDetail