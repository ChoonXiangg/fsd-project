import PropertyList from '../../components/properties/PropertyList'
import { useContext, useEffect, useState } from "react";
import GlobalContext from "../store/globalContext"
import { useRouter } from 'next/router';
import { propertyTypes, bedroomOptions, cities, counties, citiesByCounty } from '../../data/irelandLocations';
import styles from '../../styles/PropertiesPage.module.css';

function AllPropertiesPage() {
    const globalCtx = useContext(GlobalContext)
    const router = useRouter();
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

    // Filter states
    const [filterType, setFilterType] = useState('');
    const [filterSubtype, setFilterSubtype] = useState('');
    const [filterMinPrice, setFilterMinPrice] = useState('');
    const [filterMaxPrice, setFilterMaxPrice] = useState('');
    const [filterBedrooms, setFilterBedrooms] = useState('');
    const [filterCity, setFilterCity] = useState('');
    const [filterCounty, setFilterCounty] = useState('');
    const [filterTimeAdded, setFilterTimeAdded] = useState('');
    const [filterListingType, setFilterListingType] = useState('');
    const [filterSearch, setFilterSearch] = useState('');

    // Initialize filters from URL query params
    useEffect(() => {
        if (router.query.listingType) {
            setFilterListingType(router.query.listingType);
        }
        if (router.query.type) setFilterType(router.query.type);
        if (router.query.subtype) setFilterSubtype(router.query.subtype);
        if (router.query.maxPrice) setFilterMaxPrice(router.query.maxPrice);
        if (router.query.city) setFilterCity(router.query.city);
        if (router.query.county) setFilterCounty(router.query.county);
        if (router.query.timeAdded) {
            if (router.query.timeAdded === 'lastMonth') {
                const d = new Date();
                d.setMonth(d.getMonth() - 1);
                setFilterTimeAdded(d.toISOString().split('T')[0]);
            } else {
                setFilterTimeAdded(router.query.timeAdded);
            }
        }
        if (router.query.search) setFilterSearch(router.query.search);
    }, [router.query]);

    useEffect(() => {
        if (globalCtx.theGlobalObject.dataLoaded) {
            let props = globalCtx.theGlobalObject.properties;

            // Filter by listing type (Buy/Rent)
            if (filterListingType) {
                props = props.filter(p => p.listingType === filterListingType);
            }

            if (filterType) {
                props = props.filter(p => p.propertyType === filterType);
            }
            if (filterSubtype) {
                props = props.filter(p => p.propertySubtype === filterSubtype);
            }
            if (filterCity) {
                props = props.filter(p => p.city === filterCity);
            }
            if (filterCounty) {
                props = props.filter(p => p.county === filterCounty);
            }
            if (filterMinPrice) {
                props = props.filter(p => Number(p.price) >= Number(filterMinPrice));
            }
            if (filterMaxPrice) {
                props = props.filter(p => Number(p.price) <= Number(filterMaxPrice));
            }
            if (filterBedrooms) {
                if (filterBedrooms === '5+') {
                    props = props.filter(p => p.bedrooms === '5+');
                } else {
                    props = props.filter(p => p.bedrooms === filterBedrooms);
                }
            }
            if (filterTimeAdded) {
                const selectedDate = new Date(filterTimeAdded);
                props = props.filter(p => new Date(p.dateAdded) >= selectedDate);
            }
            if (filterSearch) {
                const searchLower = filterSearch.toLowerCase();
                props = props.filter(p =>
                    (p.name && p.name.toLowerCase().includes(searchLower)) ||
                    (p.address && p.address.toLowerCase().includes(searchLower)) ||
                    (p.city && p.city.toLowerCase().includes(searchLower)) ||
                    (p.county && p.county.toLowerCase().includes(searchLower))
                );
            }

            setFilteredProperties(props);
        }
    }, [globalCtx.theGlobalObject.dataLoaded, globalCtx.theGlobalObject.properties, filterType, filterSubtype, filterCity, filterCounty, filterMinPrice, filterMaxPrice, filterBedrooms, filterTimeAdded, filterListingType, filterSearch]);

    const clearFilters = () => {
        setFilterListingType('');
        setFilterType('');
        setFilterSubtype('');
        setFilterMinPrice('');
        setFilterMaxPrice('');
        setFilterBedrooms('');
        setFilterCity('');
        setFilterCounty('');
        setFilterTimeAdded('');
        setFilterSearch('');
        router.push('/properties', undefined, { shallow: true });
    };

    if (!globalCtx.theGlobalObject.dataLoaded) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading properties...</div>
    }

    return (
        <div className={styles.container}>
            {/* Left Sidebar - Filters */}
            <aside className={styles.sidebar}>
                <h2>Filters</h2>

                {/* Search */}
                <div className={styles.filterSection}>
                    <h3>Search</h3>
                    <input
                        type="text"
                        placeholder="Search by name, address..."
                        value={filterSearch}
                        onChange={(e) => setFilterSearch(e.target.value)}
                    />
                </div>

                {/* Listing Type */}
                <div className={styles.filterSection}>
                    <h3>Listing Type</h3>
                    <select value={filterListingType} onChange={(e) => setFilterListingType(e.target.value)}>
                        <option value="">All Properties</option>
                        <option value="Buy">For Sale</option>
                        <option value="Rent">For Rent</option>
                    </select>
                </div>

                {/* Property Type */}
                <div className={styles.filterSection}>
                    <h3>Property Type</h3>
                    <select value={filterType} onChange={(e) => {
                        setFilterType(e.target.value);
                        setFilterSubtype('');
                    }}>
                        <option value="">All Types</option>
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                    </select>

                    {filterType && (
                        <select value={filterSubtype} onChange={(e) => setFilterSubtype(e.target.value)}>
                            <option value="">All Subtypes</option>
                            {propertyTypes[filterType].map(st => (
                                <option key={st} value={st}>{st}</option>
                            ))}
                        </select>
                    )}
                </div>

                {/* Price Range */}
                <div className={styles.filterSection}>
                    <h3>Price Range</h3>
                    <div className={styles.priceInputs}>
                        <input
                            type="number"
                            placeholder="Min"
                            value={filterMinPrice}
                            onChange={(e) => setFilterMinPrice(e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            value={filterMaxPrice}
                            onChange={(e) => setFilterMaxPrice(e.target.value)}
                        />
                    </div>
                </div>

                {/* Location */}
                <div className={styles.filterSection}>
                    <h3>Location</h3>
                    <select value={filterCounty} onChange={(e) => {
                        setFilterCounty(e.target.value);
                        setFilterCity('');
                    }}>
                        <option value="">All Counties</option>
                        {counties.map(county => (
                            <option key={county} value={county}>{county}</option>
                        ))}
                    </select>

                    <select value={filterCity} onChange={(e) => setFilterCity(e.target.value)}>
                        <option value="">All Cities</option>
                        {(filterCounty ? (citiesByCounty[filterCounty] || []) : cities).map(city => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </select>
                </div>

                {/* Bedrooms (only for Residential) */}
                {filterType === 'Residential' && (
                    <div className={styles.filterSection}>
                        <h3>Bedrooms</h3>
                        <select value={filterBedrooms} onChange={(e) => setFilterBedrooms(e.target.value)}>
                            <option value="">Any</option>
                            {bedroomOptions.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Date Added */}
                <div className={styles.filterSection}>
                    <h3>Added After</h3>
                    <input
                        type="date"
                        value={filterTimeAdded}
                        onChange={(e) => setFilterTimeAdded(e.target.value)}
                    />
                </div>

                <button className={styles.clearButton} onClick={clearFilters}>
                    Clear All Filters
                </button>
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
                {/* Header with count and view toggles */}
                <div className={styles.header}>
                    <div className={styles.resultCount}>
                        {filteredProperties.length} {filteredProperties.length === 1 ? 'Property' : 'Properties'}
                    </div>
                    <div className={styles.viewToggles}>
                        <button
                            className={`${styles.viewButton} ${viewMode === 'grid' ? styles.active : ''}`}
                            onClick={() => setViewMode('grid')}
                        >
                            Grid View
                        </button>
                        <button
                            className={`${styles.viewButton} ${viewMode === 'list' ? styles.active : ''}`}
                            onClick={() => setViewMode('list')}
                        >
                            List View
                        </button>
                    </div>
                </div>

                {/* Properties Display */}
                {filteredProperties.length === 0 ? (
                    <div className={styles.noResults}>
                        No properties found matching your criteria.
                    </div>
                ) : (
                    <div className={viewMode === 'grid' ? styles.propertiesGrid : styles.propertiesList}>
                        <PropertyList properties={filteredProperties} viewMode={viewMode} />
                    </div>
                )}
            </main>
        </div>
    );
}

export default AllPropertiesPage;
