import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import GlobalContext from './store/globalContext';
import classes from '../styles/Profile.module.css';

function ProfilePage() {
  const globalCtx = useContext(GlobalContext);
  const router = useRouter();
  const user = globalCtx.theGlobalObject.user;

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
    </div>
  );
}

export default ProfilePage;
