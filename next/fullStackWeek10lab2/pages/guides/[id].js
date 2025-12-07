import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import GlobalContext from '../store/globalContext';

function GuideDetailPage() {
    const router = useRouter();
    const { id } = router.query;
    const globalCtx = useContext(GlobalContext);
    const [guide, setGuide] = useState(null);

    useEffect(() => {
        if (id && globalCtx.theGlobalObject.dataLoaded) {
            // Find guide in global context
            const foundGuide = globalCtx.theGlobalObject.guides.find(g => g._id === id);
            setGuide(foundGuide);
        }
    }, [id, globalCtx.theGlobalObject.dataLoaded, globalCtx.theGlobalObject.guides]);

    if (!guide) {
        return <div style={{ textAlign: 'center', marginTop: '5rem' }}>Loading guide...</div>;
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
            <button
                onClick={() => router.back()}
                style={{ marginBottom: '1rem', background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}
            >
                ← Back to Guides
            </button>
            <div style={{ marginBottom: '2rem' }}>
                <span style={{ backgroundColor: '#e0f2f1', color: '#00695c', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                    {guide.category}
                </span>
                <h1 style={{ fontSize: '2.5rem', marginTop: '1rem', color: '#1a2920' }}>{guide.title}</h1>
                <div style={{ display: 'flex', gap: '1rem', color: '#666', marginTop: '0.5rem' }}>
                    <span>{new Date(guide.dateAdded).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{guide.readTime}</span>
                    <span>•</span>
                    <span>{guide.views} views</span>
                </div>
            </div>

            {guide.image && (
                <div style={{ width: '100%', height: '400px', overflow: 'hidden', borderRadius: '8px', marginBottom: '2rem' }}>
                    <img src={guide.image} alt={guide.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
            )}

            <div style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#333' }}>
                {/* Render content. If it's HTML-like, we might need dangerouslySetInnerHTML, but be safe. For now, just text with newlines. */}
                {guide.content.split('\n').map((paragraph, idx) => (
                    <p key={idx} style={{ marginBottom: '1rem' }}>{paragraph}</p>
                ))}
            </div>
        </div>
    );
}

export default GuideDetailPage;
