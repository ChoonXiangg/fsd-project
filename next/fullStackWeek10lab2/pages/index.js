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
                    <h1 className={classes.heroTitle}>Find a place you will call home</h1>
                    <p className={classes.heroSubtitle}>
                        With us you will find not just accommodation, but a place where your new life begins,
                        full of coziness and possibilities.
                    </p>

                    <div className={classes.searchBar}>
                        <select
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value)}
                            className={classes.searchSelect}
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
                            className={classes.searchInput}
                        />

                        <select
                            value={searchPropertyType}
                            onChange={(e) => setSearchPropertyType(e.target.value)}
                            className={classes.searchSelect}
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
                            className={classes.searchPriceInput}
                        />

                        <input
                            type="number"
                            placeholder="Max Price"
                            value={searchMaxPrice}
                            onChange={(e) => setSearchMaxPrice(e.target.value)}
                            className={classes.searchPriceInput}
                        />

                        <select
                            value={searchBedrooms}
                            onChange={(e) => setSearchBedrooms(e.target.value)}
                            className={classes.searchSelect}
                        >
                            <option value="">Bedrooms</option>
                            {bedroomOptions.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>

                        <button
                            onClick={handleSearch}
                            className={classes.searchButton}
                        >
                            Search
                        </button>
                    </div>

                    <div className={classes.quickLinks}>
                        <button onClick={() => router.push('/properties?type=Residential&maxPrice=500000')} className={classes.quickLink}>
                            Find affordable homes under €500k
                        </button>
                        <button onClick={() => router.push('/properties?timeAdded=lastMonth')} className={classes.quickLink}>
                            Explore new launches
                        </button>
                    </div>

                    <div className={classes.actionButtons}>
                        <button onClick={() => router.push('/properties?listingType=Buy')} className={classes.actionButton}>
                            Buy Properties
                        </button>
                        <button onClick={() => router.push('/properties?listingType=Rent')} className={classes.actionButton}>
                            Rent Properties
                        </button>
                        <button onClick={() => router.push('/guides')} className={classes.actionButtonSecondary}>
                            Property Guides
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;