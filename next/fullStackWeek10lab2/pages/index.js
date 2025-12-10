import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { propertyTypes, bedroomOptions } from '../data/irelandLocations';
import classes from '../styles/Home.module.css';

function HomePage() {
    const router = useRouter();
    const [searchType, setSearchType] = useState('Buy');
    const [searchText, setSearchText] = useState('');
    const [searchPropertyType, setSearchPropertyType] = useState('');
    const [searchMinPrice, setSearchMinPrice] = useState('');
    const [searchMaxPrice, setSearchMaxPrice] = useState('');
    const [searchBedrooms, setSearchBedrooms] = useState('');

    const handleSearch = () => {
        const query = {
            listingType: searchType,
        };
        if (searchText) query.search = searchText;
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
        <div className={classes.container}>
            <div className={classes.hero}>
                <div className={classes.heroContent}>
                    <h1 className={classes.heroTitle}>Find a place you<br />will call home</h1>
                    <p className={classes.heroSubtitle}>
                        With us you will find not just accommodation, but a place where your new life begins,
                        full of coziness and possibilities.
                    </p>

                    <div className={classes.searchContainer}>
                        <div className={classes.tabContainer}>
                            <button
                                className={`${classes.searchTab} ${searchType === 'Buy' ? classes.activeTab : ''}`}
                                onClick={() => setSearchType('Buy')}
                            >
                                Buy
                            </button>
                            <button
                                className={`${classes.searchTab} ${searchType === 'Rent' ? classes.activeTab : ''}`}
                                onClick={() => setSearchType('Rent')}
                            >
                                Rent
                            </button>
                        </div>
                        <div className={classes.searchPill}>
                            <div className={classes.searchField}>
                                <label>Location</label>
                                <input
                                    type="text"
                                    placeholder="Search destination"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>
                            <div className={classes.divider}></div>
                            <div className={classes.searchField}>
                                <label>Type</label>
                                <select
                                    value={searchPropertyType}
                                    onChange={(e) => setSearchPropertyType(e.target.value)}
                                >
                                    <option value="">Any Type</option>
                                    <option value="Residential">Residential</option>
                                    <option value="Commercial">Commercial</option>
                                </select>
                            </div>
                            <div className={classes.divider}></div>
                            <div className={classes.searchField}>
                                <label>Price</label>
                                <input
                                    type="number"
                                    placeholder="Max Price"
                                    value={searchMaxPrice}
                                    onChange={(e) => setSearchMaxPrice(e.target.value)}
                                />
                            </div>
                            <div className={classes.divider}></div>
                            <div className={classes.searchField}>
                                <label>Bedrooms</label>
                                <select
                                    value={searchBedrooms}
                                    onChange={(e) => setSearchBedrooms(e.target.value)}
                                >
                                    <option value="">Any</option>
                                    {bedroomOptions.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>
                            <button className={classes.searchCircleButton} onClick={handleSearch}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: '1.5rem', height: '1.5rem' }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;