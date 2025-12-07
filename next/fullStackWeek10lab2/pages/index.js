import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { counties, citiesByCounty } from '../data/irelandLocations';
import classes from '../styles/Home.module.css';

function HomePage() {
    const router = useRouter();
    const [searchType, setSearchType] = useState('Buy');
    const [searchText, setSearchText] = useState('');
    const [searchCounty, setSearchCounty] = useState('');
    const [searchCity, setSearchCity] = useState('');

    const handleSearch = () => {
        const query = {
            listingType: searchType,
        };
        if (searchText) query.searchTerm = searchText;
        if (searchCounty) query.county = searchCounty;
        if (searchCity) query.city = searchCity;

        router.push({
            pathname: '/properties',
            query: query
        });
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '5rem' }}>
            <h1>Welcome to Real Estate App</h1>
            <p>Find your dream home today.</p>

            <div style={{
                margin: '2rem auto',
                padding: '1.5rem',
                backgroundColor: 'white',
                borderRadius: '8px',
                maxWidth: '800px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                    <option value="Buy">Buy</option>
                    <option value="Rent">Rent</option>
                </select>

                <input
                    type="text"
                    placeholder="Search by name, address..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc', minWidth: '200px' }}
                />

                <select
                    value={searchCounty}
                    onChange={(e) => {
                        setSearchCounty(e.target.value);
                        setSearchCity('');
                    }}
                    style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc', minWidth: '150px' }}
                >
                    <option value="">Select County</option>
                    {counties.map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                <select
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc', minWidth: '150px' }}
                    disabled={!searchCounty}
                >
                    <option value="">Select City</option>
                    {searchCounty && (citiesByCounty[searchCounty] || []).map(c => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>

                <button
                    onClick={handleSearch}
                    style={{
                        padding: '0.8rem 2rem',
                        backgroundColor: '#77002e',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    Search
                </button>
            </div>

            <div style={{ marginTop: '2rem' }}>
                <Link href="/properties?type=Residential&maxPrice=500000">
                    <a style={{
                        display: 'inline-block',
                        padding: '1rem 2rem',
                        backgroundColor: '#1a2920',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        marginRight: '1rem'
                    }}>
                        Find affordable homes under €500k
                    </a>
                </Link>

                <Link href="/properties?timeAdded=lastMonth">
                    <a style={{
                        display: 'inline-block',
                        padding: '1rem 2rem',
                        backgroundColor: '#77002e',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '4px',
                        fontWeight: 'bold'
                    }}>
                        Explore new launches
                    </a>
                </Link>
            </div>

            <div style={{ marginTop: '1rem' }}>
                <Link href="/properties">
                    <a style={{
                        display: 'inline-block',
                        padding: '1rem 2rem',
                        backgroundColor: '#1a2920',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        marginRight: '1rem'
                    }}>
                        Buy Properties
                    </a>
                </Link>

                <Link href="/properties?listingType=Rent">
                    <a style={{
                        display: 'inline-block',
                        padding: '1rem 2rem',
                        backgroundColor: '#1a2920',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '4px',
                        fontWeight: 'bold'
                    }}>
                        Rent Properties
                    </a>
                </Link>
            </div>
        </div>
    );
}

export default HomePage;