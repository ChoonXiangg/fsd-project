import { useContext, useState } from 'react';
import GlobalContext from '../../pages/store/globalContext';
import { guideCategories } from '../../data/guidesData';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../../styles/StandardPage.module.css';

function GuidesPage() {
    const globalCtx = useContext(GlobalContext);
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState('All');

    const allGuides = globalCtx.theGlobalObject.guides || [];

    // Filter "Latest" (or main list) based on category
    const filteredGuides = selectedCategory === 'All'
        ? allGuides
        : allGuides.filter(g => g.category === selectedCategory);

    // Sort by Date for Latest
    const latestSorted = [...filteredGuides].sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));

    const handleReadGuide = async (guideId) => {
        // Increment view count
        await fetch('/api/increment-guide-view', {
            method: 'POST',
            body: JSON.stringify({ guideId }),
            headers: { 'Content-Type': 'application/json' }
        });
        // Navigate to full guide page
        router.push(`/guides/${guideId}`);
    };

    if (!globalCtx.theGlobalObject.dataLoaded) {
        return <div style={{ textAlign: 'center', marginTop: '5rem' }}>Loading Guides...</div>;
    }

    return (
        <div className={styles.container}>
            {/* Header Section */}
            <div className={styles.pageHeader}>
                <div className={styles.headerContent}>
                    <div>
                        <h1 className={styles.pageTitle}>Property Guides</h1>
                        <p style={{ marginTop: '0.5rem', color: '#666', fontSize: '1.1rem' }}>Expert advice for every step of your property journey.</p>
                    </div>
                    <div className={styles.headerDescription}>
                    </div>
                </div>
            </div>

            {/* Categories and Action Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div className={styles.tabs} style={{ marginBottom: 0 }}>
                    <button
                        onClick={() => setSelectedCategory('All')}
                        className={`${styles.tab} ${selectedCategory === 'All' ? styles.activeTab : ''}`}
                    >
                        All Categories
                    </button>
                    {guideCategories.map(category => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.title)}
                            className={`${styles.tab} ${selectedCategory === category.title ? styles.activeTab : ''}`}
                        >
                            {category.title}
                        </button>
                    ))}
                </div>

                {globalCtx.theGlobalObject.user && (globalCtx.theGlobalObject.user.verifiedAgent || globalCtx.theGlobalObject.user.isVerifiedAgent) && (
                    <div style={{ marginBottom: '0.5rem' }}> {/* Slight adjustment to match button margin/padding visual */}
                        <Link href="/guides/add">
                            <a style={{
                                display: 'inline-block',
                                padding: '0.8rem 1.5rem',
                                backgroundColor: '#000000',
                                color: 'white',
                                textDecoration: 'none',
                                borderRadius: '4px',
                                fontWeight: 'bold',
                                whiteSpace: 'nowrap'
                            }}>
                                + Write New Guide
                            </a>
                        </Link>
                    </div>
                )}
            </div>

            {/* Guides Section */}
            <div className={styles.resultsSection}>
                <h2 className={styles.sectionTitle}>
                    {selectedCategory === 'All' ? 'Latest Guides' : `${selectedCategory} Guides`}
                </h2>

                {latestSorted.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#666', padding: '4rem' }}>No guides found in this category.</p>
                ) : (
                    <div className={styles.grid}>
                        {latestSorted.map(guide => (
                            <div key={guide._id} style={{
                                backgroundColor: '#ffffff',
                                borderRadius: '4px',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                                onClick={() => handleReadGuide(guide._id)}
                            >
                                <div style={{ height: '200px', overflow: 'hidden' }}>
                                    <img src={guide.image} alt={guide.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{
                                            backgroundColor: '#e8f5e9',
                                            color: '#2e7d32',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '0.8rem',
                                            fontWeight: 'bold'
                                        }}>
                                            {guide.category}
                                        </span>
                                        <span style={{ fontSize: '0.8rem', color: '#999' }}>{guide.views || 0} views</span>
                                    </div>
                                    <h3 style={{ margin: '1rem 0', fontSize: '1.2rem', color: '#000', fontWeight: 'bold' }}>{guide.title}</h3>
                                    <p style={{ color: '#666', lineHeight: '1.6', flex: 1, fontSize: '0.95rem' }}>{guide.excerpt}</p>
                                    <div style={{ marginTop: '1rem', color: '#999', fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span>{new Date(guide.dateAdded).toLocaleDateString()}</span>
                                        <span style={{
                                            color: '#000',
                                            fontWeight: 'bold',
                                            fontSize: '0.9rem'
                                        }}>
                                            Read More →
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default GuidesPage;
