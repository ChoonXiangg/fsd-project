import { useContext, useMemo } from 'react';
import { useRouter } from 'next/router';
import GlobalContext from '../store/globalContext';
import styles from '../../styles/StandardPage.module.css';
import classes from '../../styles/Profile.module.css';

function PublicProfilePage() {
  const globalCtx = useContext(GlobalContext);
  const router = useRouter();
  const { userId } = router.query;
  const currentUser = globalCtx.theGlobalObject.user;

  // Find the profile user from the users data or from property listings
  const profileUser = useMemo(() => {
    if (!userId || !globalCtx.theGlobalObject.properties) return null;

    // Find a property created by this user to get their info
    const userProperty = globalCtx.theGlobalObject.properties.find(
      property => property.creatorId === userId
    );

    if (userProperty) {
      return {
        id: userProperty.creatorId,
        username: userProperty.creatorUsername,
        email: userProperty.creatorEmail,
        phoneNumber: userProperty.creatorPhoneNumber,
        verifiedAgent: userProperty.verifiedAgent
      };
    }

    return null;
  }, [userId, globalCtx.theGlobalObject.properties]);

  // Filter properties created by this user
  const userProperties = useMemo(() => {
    if (!userId || !globalCtx.theGlobalObject.properties) return [];
    return globalCtx.theGlobalObject.properties.filter(
      property => property.creatorId === userId
    );
  }, [userId, globalCtx.theGlobalObject.properties]);

  // Check if viewing own profile
  const isOwnProfile = currentUser && currentUser.id === userId;

  // Redirect to own profile page if viewing own profile
  if (isOwnProfile) {
    if (typeof window !== 'undefined') {
      router.push('/profile');
    }
    return null;
  }

  // Show loading or not found if user not found
  if (!profileUser) {
    return (
      <div className={classes.container}>
        <div className={classes.profileCard}>
          <div className={classes.profileDetails}>
            <h2>User not found</h2>
            <p>This user doesn't exist or hasn't listed any properties yet.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>User Profile</h1>
        </div>
      </div>

      <div className={classes.profileCard}>
        <div className={classes.profileHeader}>
          <div className={classes.profilePicture}>
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profileUser.username)}&size=150&background=000000&color=fff&bold=true`}
              alt={`${profileUser.username}'s profile`}
            />
          </div>
          <h1 className={classes.username}>{profileUser.username}</h1>
          <p className={classes.email}>{profileUser.email}</p>
        </div>

        <div className={classes.profileDetails}>
          <div className={classes.detailsHeader}>
            <h2>Contact Information</h2>
          </div>

          <div className={classes.detailRow}>
            <span className={classes.label}>Phone Number:</span>
            <span className={classes.value}>{profileUser.phoneNumber || 'Not provided'}</span>
          </div>
          {profileUser.verifiedAgent && (
            <div className={classes.badge}>
              ✓ Verified Agent
            </div>
          )}
        </div>
      </div>

      {/* User's Listed Properties Section */}
      <div className={styles.resultsSection} style={{ marginTop: '3rem' }}>
        <h2 className={styles.sectionTitle}>{profileUser.username}'s Listed Properties ({userProperties.length})</h2>
        {userProperties.length === 0 ? (
          <p className={classes.noProperties}>This user hasn't listed any properties yet.</p>
        ) : (
          <div className={styles.grid}>
            {userProperties.map((property) => (
              <div
                key={property._id}
                className={classes.propertyCard}
                onClick={() => router.push(`/${property._id}`)}
              >
                <div className={classes.propertyImage}>
                  <img src={property.image} alt={property.name} />
                  {property.verifiedAgent && (
                    <span className={classes.verifiedBadge}>Verified</span>
                  )}
                </div>
                <div className={classes.propertyInfo}>
                  <h3 className={classes.propertyName}>{property.name}</h3>
                  <p className={classes.propertyType}>
                    {property.propertyType} - {property.propertySubtype}
                  </p>
                  <p className={classes.propertyLocation}>
                    {property.city}, {property.county}
                  </p>
                  <p className={classes.propertyPrice}>
                    €{Number(property.price).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PublicProfilePage;
