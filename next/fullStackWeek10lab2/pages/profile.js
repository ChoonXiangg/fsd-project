import { useContext, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import GlobalContext from './store/globalContext';
import classes from '../styles/Profile.module.css';

function ProfilePage() {
  const globalCtx = useContext(GlobalContext);
  const router = useRouter();
  const user = globalCtx.theGlobalObject.user;

  // Filter properties created by this user
  const userProperties = useMemo(() => {
    if (!user || !globalCtx.theGlobalObject.properties) return [];
    return globalCtx.theGlobalObject.properties.filter(
      property => property.creatorId === user.id
    );
  }, [user, globalCtx.theGlobalObject.properties]);

  // Filter properties starred by this user
  const starredProperties = useMemo(() => {
    if (!user || !globalCtx.theGlobalObject.properties) return [];
    return globalCtx.theGlobalObject.properties.filter(
      property => property.starredBy && property.starredBy.includes(user.id)
    );
  }, [user, globalCtx.theGlobalObject.properties]);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    username: user?.username || '',
    phoneNumber: user?.phoneNumber || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Redirect to home if no user is logged in
  if (!user) {
    if (typeof window !== 'undefined') {
      router.push('/');
    }
    return null;
  }

  const handleEditClick = () => {
    setIsEditing(true);
    setEditData({
      username: user.username,
      phoneNumber: user.phoneNumber || ''
    });
    setError('');
    setSuccess('');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({
      username: user.username,
      phoneNumber: user.phoneNumber || ''
    });
    setError('');
    setSuccess('');
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          username: editData.username,
          phoneNumber: editData.phoneNumber
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Update user without token (token remains in localStorage)
        globalCtx.updateGlobals({ cmd: 'setUser', user: data.user });
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.profileCard}>
        <div className={classes.profileHeader}>
          <div className={classes.profilePicture}>
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(isEditing ? editData.username : user.username)}&size=150&background=1a2920&color=fff&bold=true`}
              alt={`${user.username}'s profile`}
            />
          </div>
          {!isEditing ? (
            <>
              <h1 className={classes.username}>{user.username}</h1>
              <p className={classes.email}>{user.email}</p>
            </>
          ) : (
            <>
              <input
                type="text"
                className={classes.editInput}
                value={editData.username}
                onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                placeholder="Username"
              />
              <p className={classes.email}>{user.email}</p>
            </>
          )}
        </div>

        <div className={classes.profileDetails}>
          <div className={classes.detailsHeader}>
            <h2>Contact Information</h2>
            {!isEditing ? (
              <button className={classes.editButton} onClick={handleEditClick}>
                Edit Profile
              </button>
            ) : (
              <div className={classes.editActions}>
                <button className={classes.cancelButton} onClick={handleCancelEdit} disabled={loading}>
                  Cancel
                </button>
                <button className={classes.saveButton} onClick={handleSave} disabled={loading}>
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            )}
          </div>

          {error && <div className={classes.error}>{error}</div>}
          {success && <div className={classes.success}>{success}</div>}

          <div className={classes.detailRow}>
            <span className={classes.label}>Phone Number:</span>
            {!isEditing ? (
              <span className={classes.value}>{user.phoneNumber || 'Not provided'}</span>
            ) : (
              <input
                type="tel"
                className={classes.editInputSmall}
                value={editData.phoneNumber}
                onChange={(e) => setEditData({ ...editData, phoneNumber: e.target.value })}
                placeholder="Phone Number"
              />
            )}
          </div>
          {user.verifiedAgent && (
            <div className={classes.badge}>
              ✓ Verified Agent
            </div>
          )}
        </div>
      </div>

      {/* User's Listed Properties Section */}
      <div className={classes.propertiesSection}>
        <h2 className={classes.propertiesTitle}>My Listed Properties</h2>
        {userProperties.length === 0 ? (
          <p className={classes.noProperties}>You haven't listed any properties yet.</p>
        ) : (
          <div className={classes.propertiesGrid}>
            {userProperties.map((property) => (
              <div
                key={property._id}
                className={classes.propertyCard}
                onClick={() => router.push(`/${property._id}`)}
              >
                <div className={classes.propertyImage}>
                  <img src={property.image} alt={property.name} />
                  {property.verifiedAgent && (
                    <span className={classes.verifiedBadge}>✓ Verified</span>
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

      {/* Starred Properties Section */}
      <div className={classes.propertiesSection}>
        <h2 className={classes.propertiesTitle}>⭐ Starred Properties</h2>
        {starredProperties.length === 0 ? (
          <p className={classes.noProperties}>You haven't starred any properties yet.</p>
        ) : (
          <div className={classes.propertiesGrid}>
            {starredProperties.map((property) => (
              <div
                key={property._id}
                className={classes.propertyCard}
                onClick={() => router.push(`/${property._id}`)}
              >
                <div className={classes.propertyImage}>
                  <img src={property.image} alt={property.name} />
                  {property.verifiedAgent && (
                    <span className={classes.verifiedBadge}>✓ Verified</span>
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

export default ProfilePage;
