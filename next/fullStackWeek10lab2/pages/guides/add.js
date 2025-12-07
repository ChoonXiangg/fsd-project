import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { guideCategories } from '../../data/guidesData';
import GlobalContext from '../../pages/store/globalContext';

function AddGuidePage() {
    const router = useRouter();
    const globalCtx = useContext(GlobalContext);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState(guideCategories[0].title);
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState('');
    const [readTime, setReadTime] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const guideData = {
            title,
            category,
            excerpt,
            content,
            image,
            readTime,
            dateAdded: new Date(),
            views: 0
        };

        const response = await fetch('/api/save-guide', {
            method: 'POST',
            body: JSON.stringify(guideData),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            // Update context
            globalCtx.updateGlobals({ cmd: 'fetchPropertiesFromDB' });
            router.push('/guides');
        } else {
            alert("Failed to save guide.");
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '2rem' }}>
            <h1>Publish a New Guide</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                    style={{ padding: '0.8rem', fontSize: '1.2rem' }}
                />

                <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    style={{ padding: '0.8rem' }}
                >
                    {guideCategories.map(cat => (
                        <option key={cat.id} value={cat.title}>{cat.title}</option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="Cover Image URL"
                    value={image}
                    onChange={e => setImage(e.target.value)}
                    style={{ padding: '0.8rem' }}
                />

                <input
                    type="text"
                    placeholder="Estimated Read Time (e.g., '5 min read')"
                    value={readTime}
                    onChange={e => setReadTime(e.target.value)}
                    style={{ padding: '0.8rem' }}
                />

                <textarea
                    placeholder="Short Excerpt"
                    value={excerpt}
                    onChange={e => setExcerpt(e.target.value)}
                    rows="3"
                    style={{ padding: '0.8rem' }}
                />

                <textarea
                    placeholder="Main Content (HTML or Text)"
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    rows="15"
                    style={{ padding: '0.8rem', fontFamily: 'monospace' }}
                />

                <button type="submit" style={{ padding: '1rem', backgroundColor: '#77002e', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                    Publish Guide
                </button>
            </form>
        </div>
    );
}

export default AddGuidePage;
