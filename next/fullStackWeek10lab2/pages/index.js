import Link from 'next/link';
import classes from '../styles/Home.module.css'; // Assuming we might want some styles, but for now inline or basic

function HomePage() {
    return (
        <div style={{ textAlign: 'center', marginTop: '5rem' }}>
            <h1>Welcome to Real Estate App</h1>
            <p>Find your dream home today.</p>

            <div style={{ marginTop: '2rem' }}>
                <Link href="/properties?type=Residential&maxPrice=500000">
                    <a style={{
                        display: 'inline-block',
                        padding: '1rem 2rem',
                        backgroundColor: '#1a2920',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '4px',
                        fontWeight: 'bold'
                    }}>
                        Find affordable homes under €500k
                    </a>
                </Link>
            </div>

            <div style={{ marginTop: '1rem' }}>
                <Link href="/properties">
                    <a style={{ color: '#1a2920' }}>View All Properties</a>
                </Link>
            </div>
        </div>
    );
}

export default HomePage;