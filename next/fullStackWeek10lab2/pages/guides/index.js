import { useContext, useState, useEffect } from 'react';
import GlobalContext from '../../pages/store/globalContext';
import { guideCategories } from '../../data/guidesData'; // Keep categories static for UI consistency
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../../styles/PageWrapper.module.css';

function GuidesPage() {
    const globalCtx = useContext(GlobalContext);
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState('All');

    // No more automatic seeding

    const allGuides = globalCtx.theGlobalObject.guides || [];

    // Filter "Latest" (or main list) based on category
    const filteredGuides = selectedCategory === 'All'
        ? allGuides
        : allGuides.filter(g => g.category === selectedCategory);

    // Sort by Date for Latest
    const latestSorted = [...filteredGuides].sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));

    // Popular (Top 5 by views)
    const popularGuides = [...allGuides]
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 5);

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
        <div className={styles.guidesWrapper}>
            <div className={styles.guidesContent}>
            <div style={{ textAlign: 'center', marginBottom: '3rem', position: 'relative' }}>
                <h1 style={{ fontSize: '2.5rem', color: 'white', marginBottom: '1rem', textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)' }}>Property Guides</h1>
                <p style={{ fontSize: '1.2rem', color: 'white', textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)' }}>Expert advice for every step of your property journey.</p>
                <div style={{ marginTop: '1rem' }}>
                    <Link href="/guides/add">
                        <a style={{
                            display: 'inline-block',
                            padding: '0.8rem 1.5rem',
                            backgroundColor: '#2e7d32',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '4px',
                            fontWeight: 'bold',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                        }}>
                            + Write New Guide
                        </a>
                    </Link>
                </div>
            </div>

            {/* Categories Section - Now Buttons */}
            <section style={{ marginBottom: '4rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.8rem', color: 'white', marginBottom: '1.5rem', borderBottom: '2px solid #77002e', paddingBottom: '0.5rem', display: 'inline-block', textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)' }}>
                    Browse by Category
                </h2>
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '1rem'
                }}>
                    <button
                        onClick={() => setSelectedCategory('All')}
                        style={{
                            padding: '0.8rem 1.5rem',
                            borderRadius: '30px',
                            border: '1px solid #77002e',
                            backgroundColor: selectedCategory === 'All' ? '#77002e' : 'white',
                            color: selectedCategory === 'All' ? 'white' : '#77002e',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            transition: 'all 0.2s'
                        }}
                    >
                        All Categories
                    </button>
                    {guideCategories.map(category => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.title)} // Filter by Title matching backend category
                            style={{
                                padding: '0.8rem 1.5rem',
                                borderRadius: '30px',
                                border: '1px solid #77002e',
                                backgroundColor: selectedCategory === category.title ? '#77002e' : 'white',
                                color: selectedCategory === category.title ? 'white' : '#77002e',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            <span>{category.icon}</span>
                            {category.title}
                        </button>
                    ))}
                </div>
            </section>

            {/* Latest Guides Section */}
            <section style={{ marginBottom: '4rem' }}>
                <h2 style={{ fontSize: '1.8rem', color: 'white', marginBottom: '1.5rem', borderBottom: '2px solid #77002e', paddingBottom: '0.5rem', display: 'inline-block', textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)' }}>
                    {selectedCategory === 'All' ? 'Latest Guides' : `${selectedCategory} Guides`}
                </h2>
                {latestSorted.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#666' }}>No guides found in this category.</p>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '2rem'
                    }}>
                        {latestSorted.map(guide => (
                            <div key={guide._id} style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <div style={{ height: '200px', overflow: 'hidden' }}>
                                    <img src={guide.image} alt={guide.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{
                                            backgroundColor: '#e0f2f1',
                                            color: '#00695c',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '0.8rem',
                                            fontWeight: 'bold'
                                        }}>
                                            {guide.category}
                                        </span>
                                        <span style={{ fontSize: '0.8rem', color: '#999' }}>👀 {guide.views || 0}</span>
                                    </div>
                                    <h3 style={{ margin: '1rem 0', fontSize: '1.3rem', color: '#1a2920' }}>{guide.title}</h3>
                                    <p style={{ color: '#666', lineHeight: '1.6', flex: 1 }}>{guide.excerpt}</p>
                                    <div style={{ marginTop: '1rem', color: '#999', fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span>{new Date(guide.dateAdded).toLocaleDateString()}</span>
                                        <button
                                            onClick={() => handleReadGuide(guide._id)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#77002e',
                                                fontWeight: 'bold',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Read More →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Popular Reading Section */}
            <section>
                <h2 style={{ fontSize: '1.8rem', color: 'white', marginBottom: '1.5rem', borderBottom: '2px solid #77002e', paddingBottom: '0.5rem', display: 'inline-block', textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)' }}>
                    Popular Reading
                </h2>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                }}>
                    {popularGuides.map((guide, index) => (
                        <div key={guide._id} style={{
                            display: 'flex',
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '8px',
                            padding: '1rem',
                            alignItems: 'center',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                        }}>
                            <div style={{
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                                color: '#ccc',
                                marginRight: '1.5rem',
                                minWidth: '30px'
                            }}>
                                {index + 1}
                            </div>
                            <div style={{ width: '80px', height: '60px', borderRadius: '4px', overflow: 'hidden', marginRight: '1.5rem', flexShrink: 0 }}>
                                <img src={guide.image} alt={guide.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: '#333' }}>{guide.title}</h4>
                                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: '#777' }}>
                                    <span>{guide.category}</span>
                                    <span>•</span>
                                    <span>{guide.views || 0} views</span>
                                </div>
                            </div>
                            <button
                                onClick={() => handleReadGuide(guide._id)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    border: '1px solid #77002e',
                                    color: '#77002e',
                                    backgroundColor: 'transparent',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold'
                                }}
                            >
                                Read
                            </button>
                        </div>
                    ))}
                </div>
            </section>
            </div>
        </div>
    );
}

export default GuidesPage;
