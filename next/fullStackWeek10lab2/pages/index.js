import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { propertyTypes, bedroomOptions } from '../data/irelandLocations';
import classes from '../styles/Home.module.css';

function HomePage() {
    const router = useRouter();
    const [searchType, setSearchType] = useState('Buy'); // Listing type: Buy/Rent
    const [searchText, setSearchText] = useState('');
    const [searchPropertyType, setSearchPropertyType] = useState('');
    const [searchMinPrice, setSearchMinPrice] = useState('');
    const [searchMaxPrice, setSearchMaxPrice] = useState('');
    const [searchBedrooms, setSearchBedrooms] = useState('');

    const handleSearch = () => {
        const query = {
            listingType: searchType,
        };
        if (searchText) query.searchTerm = searchText;
        if (searchPropertyType) query.type = searchPropertyType;
        if (searchMinPrice) query.minPrice = searchMinPrice;
        if (searchMaxPrice) query.maxPrice = searchMaxPrice;
        if (searchBedrooms) query.bedrooms = searchBedrooms;

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
                maxWidth: '900px',
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
                    style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc', minWidth: '200px', flex: 1 }}
                />

                <select
                    value={searchPropertyType}
                    onChange={(e) => setSearchPropertyType(e.target.value)}
                    style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                    <option value="">All Types</option>
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                </select>

                <input
                    type="number"
                    placeholder="Min Price"
                    value={searchMinPrice}
                    onChange={(e) => setSearchMinPrice(e.target.value)}
                    style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc', width: '120px' }}
                />

                <input
                    type="number"
                    placeholder="Max Price"
                    value={searchMaxPrice}
                    onChange={(e) => setSearchMaxPrice(e.target.value)}
                    style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc', width: '120px' }}
                />

                <select
                    value={searchBedrooms}
                    onChange={(e) => setSearchBedrooms(e.target.value)}
                    style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                    <option value="">Bedrooms</option>
                    {bedroomOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
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
                        fontWeight: 'bold',
                        marginRight: '1rem'
                    }}>
                        Rent Properties
                    </a>
                </Link>

                <Link href="/guides">
                    <a style={{
                        display: 'inline-block',
                        padding: '1rem 2rem',
                        backgroundColor: '#77002e',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '4px',
                        fontWeight: 'bold'
                    }}>
                        Property Guides
                    </a>
                </Link>
            </div>
        </div>
    );
}

export default HomePage;