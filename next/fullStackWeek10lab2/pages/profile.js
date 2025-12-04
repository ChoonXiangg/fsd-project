import { useContext, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import GlobalContext from './store/globalContext';
import classes from '../styles/Profile.module.css';
import { counties, cities } from '../data/irelandLocations';

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

  // Property edit/delete states
  const [editingProperty, setEditingProperty] = useState(null);
  const [editPropertyData, setEditPropertyData] = useState({});
  const [deleteConfirmProperty, setDeleteConfirmProperty] = useState(null);
  const [propertyLoading, setPropertyLoading] = useState(false);
  const [propertyError, setPropertyError] = useState('');

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

  // Property management handlers
  const handleEditProperty = (property, e) => {
    e.stopPropagation();
    setEditingProperty(property._id);
    setEditPropertyData({
      name: property.name,
      image: property.image,
      address: property.address,
      city: property.city,
      county: property.county,
      price: property.price,
      propertyType: property.propertyType,
      propertySubtype: property.propertySubtype,
      bedrooms: property.bedrooms || '',
      floorSize: property.floorSize
    });
    setPropertyError('');
  };

  const handleCancelEditProperty = () => {
    setEditingProperty(null);
    setEditPropertyData({});
    setPropertyError('');
  };

  const handleSaveProperty = async () => {
    setPropertyLoading(true);
    setPropertyError('');

    try {
      const response = await fetch('/api/update-property', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: editingProperty,
          userId: user.id,
          ...editPropertyData
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Refresh properties from database
        await globalCtx.updateGlobals({ cmd: 'fetchPropertiesFromDB' });
        setEditingProperty(null);
        setEditPropertyData({});
      } else {
        setPropertyError(data.message || 'Failed to update property');
      }
    } catch (err) {
      setPropertyError('An error occurred. Please try again.');
    } finally {
      setPropertyLoading(false);
    }
  };

  const handleDeleteClick = (property, e) => {
    e.stopPropagation();
    setDeleteConfirmProperty(property);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmProperty(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmProperty) return;

    setPropertyLoading(true);
    setPropertyError('');

    try {
      const response = await fetch('/api/delete-property', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: deleteConfirmProperty._id,
          userId: user.id
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Refresh properties from database
        await globalCtx.updateGlobals({ cmd: 'fetchPropertiesFromDB' });
        setDeleteConfirmProperty(null);
      } else {
        setPropertyError(data.message || 'Failed to delete property');
      }
    } catch (err) {
      setPropertyError('An error occurred. Please try again.');
    } finally {
      setPropertyLoading(false);
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
        <h2 className={classes.propertiesTitle}>My Listed Properties ({userProperties.length})</h2>
        {userProperties.length === 0 ? (
          <p className={classes.noProperties}>You haven't listed any properties yet.</p>
        ) : (
          <div className={classes.propertiesGrid}>
            {userProperties.map((property) => (
              <div
                key={property._id}
                className={classes.propertyCard}
              >
                <div className={classes.propertyImage} onClick={() => router.push(`/${property._id}`)}>
                  <img src={property.image} alt={property.name} />
                  {property.verifiedAgent && (
                    <span className={classes.verifiedBadge}>✓ Verified</span>
                  )}
                </div>
                <div className={classes.propertyInfo} onClick={() => router.push(`/${property._id}`)}>
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
                <div className={classes.propertyActions}>
                  <button
                    className={classes.editPropertyButton}
                    onClick={(e) => handleEditProperty(property, e)}
                  >
                    Edit
                  </button>
                  <button
                    className={classes.deletePropertyButton}
                    onClick={(e) => handleDeleteClick(property, e)}
                  >
                    Delete
                  </button>
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

      {/* Edit Property Modal */}
      {editingProperty && (
        <div className={classes.modal} onClick={handleCancelEditProperty}>
          <div className={classes.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>Edit Property</h2>
            {propertyError && <div className={classes.error}>{propertyError}</div>}

            <div className={classes.formGroup}>
              <label>Property Name</label>
              <input
                type="text"
                value={editPropertyData.name || ''}
                onChange={(e) => setEditPropertyData({ ...editPropertyData, name: e.target.value })}
              />
            </div>

            <div className={classes.formGroup}>
              <label>Image URL</label>
              <input
                type="text"
                value={editPropertyData.image || ''}
                onChange={(e) => setEditPropertyData({ ...editPropertyData, image: e.target.value })}
              />
            </div>

            <div className={classes.formGroup}>
              <label>Address</label>
              <input
                type="text"
                value={editPropertyData.address || ''}
                onChange={(e) => setEditPropertyData({ ...editPropertyData, address: e.target.value })}
              />
            </div>

            <div className={classes.formRow}>
              <div className={classes.formGroup}>
                <label>City</label>
                <select
                  value={editPropertyData.city || ''}
                  onChange={(e) => setEditPropertyData({ ...editPropertyData, city: e.target.value })}
                >
                  <option value="">Select City</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className={classes.formGroup}>
                <label>County</label>
                <select
                  value={editPropertyData.county || ''}
                  onChange={(e) => setEditPropertyData({ ...editPropertyData, county: e.target.value })}
                >
                  <option value="">Select County</option>
                  {counties.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={classes.formRow}>
              <div className={classes.formGroup}>
                <label>Price (€)</label>
                <input
                  type="number"
                  value={editPropertyData.price || ''}
                  onChange={(e) => setEditPropertyData({ ...editPropertyData, price: Number(e.target.value) })}
                />
              </div>
              <div className={classes.formGroup}>
                <label>Floor Size (m²)</label>
                <input
                  type="number"
                  value={editPropertyData.floorSize || ''}
                  onChange={(e) => setEditPropertyData({ ...editPropertyData, floorSize: Number(e.target.value) })}
                />
              </div>
            </div>

            {editPropertyData.propertyType === 'Residential' && (
              <div className={classes.formGroup}>
                <label>Bedrooms</label>
                <select
                  value={editPropertyData.bedrooms || ''}
                  onChange={(e) => setEditPropertyData({ ...editPropertyData, bedrooms: e.target.value })}
                >
                  <option value="">Select...</option>
                  <option value="Studio">Studio</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5+">5+</option>
                </select>
              </div>
            )}

            <div className={classes.modalActions}>
              <button
                className={classes.cancelButton}
                onClick={handleCancelEditProperty}
                disabled={propertyLoading}
              >
                Cancel
              </button>
              <button
                className={classes.saveButton}
                onClick={handleSaveProperty}
                disabled={propertyLoading}
              >
                {propertyLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmProperty && (
        <div className={classes.modal} onClick={handleCancelDelete}>
          <div className={classes.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>Delete Property</h2>
            {propertyError && <div className={classes.error}>{propertyError}</div>}
            <p>Are you sure you want to delete <strong>{deleteConfirmProperty.name}</strong>?</p>
            <p className={classes.warning}>This action cannot be undone.</p>

            <div className={classes.modalActions}>
              <button
                className={classes.cancelButton}
                onClick={handleCancelDelete}
                disabled={propertyLoading}
              >
                Cancel
              </button>
              <button
                className={classes.deleteButton}
                onClick={handleConfirmDelete}
                disabled={propertyLoading}
              >
                {propertyLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
