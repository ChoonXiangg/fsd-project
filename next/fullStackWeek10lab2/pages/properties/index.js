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
    const [showMoreOptions, setShowMoreOptions] = useState(false); // For expandable filters

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
        setActiveTab('All'); // Reset tab to All
        router.push('/properties', undefined, { shallow: true });
    };

    const [activeTab, setActiveTab] = useState('All');

    // Update filters based on active tab
    useEffect(() => {
        if (activeTab === 'Buy') {
            setFilterListingType('Buy');
            setFilterType('');
        } else if (activeTab === 'Rent') {
            setFilterListingType('Rent');
            setFilterType('');
        } else if (activeTab === 'Commercial properties') {
            setFilterType('Commercial');
            setFilterListingType('');
        } else if (activeTab === 'All') {
            setFilterListingType('');
            setFilterType('');
        } else {
            // New developments or other
            setFilterListingType('');
            setFilterType('');
        }
    }, [activeTab]);

    if (!globalCtx.theGlobalObject.dataLoaded) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading properties...</div>
    }

    return (
        <div className={styles.container}>
            {/* Header Section */}
            <div className={styles.pageHeader}>
                <div className={styles.headerContent}>
                    <h1 className={styles.pageTitle}>We help you find the<br />home that will be yours</h1>
                    <div className={styles.headerDescription}>
                        <p>Our projects are about harmony, style and<br />care that everyone lives in what is really<br />important to them.</p>
                    </div>
                </div>
            </div>

            {/* Filter Section */}
            <div className={styles.filterContainer}>
                {/* Tabs */}
                <div className={styles.tabs}>
                    {['All', 'Buy', 'Rent', 'New developments', 'Commercial properties'].map(tab => (
                        <button
                            key={tab}
                            className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Filter Row - Always Visible */}
                <div className={styles.filterRow}>
                    <div className={styles.filterGroup}>
                        <select
                            value={filterCounty}
                            onChange={(e) => setFilterCounty(e.target.value)}
                            className={styles.filterSelect}
                        >
                            <option value="">All countries</option>
                            {counties.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div className={styles.filterGroup}>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className={styles.filterSelect}
                        >
                            <option value="">New property</option>
                            <option value="Residential">Residential</option>
                            <option value="Commercial">Commercial</option>
                        </select>
                    </div>

                    <div className={styles.filterGroup}>
                        <select
                            value={`${filterMinPrice}-${filterMaxPrice}`}
                            onChange={(e) => {
                                const [min, max] = e.target.value.split('-');
                                setFilterMinPrice(min);
                                setFilterMaxPrice(max);
                            }}
                            className={styles.filterSelect}
                        >
                            <option value="-">$280,000-$500,000</option>
                            <option value="0-100000">$0-$100,000</option>
                            <option value="100000-250000">$100,000-$250,000</option>
                            <option value="250000-500000">$250,000-$500,000</option>
                            <option value="500000-1000000">$500,000-$1,000,000</option>
                            <option value="1000000-">$1,000,000+</option>
                        </select>
                    </div>

                    {filterType !== 'Commercial' && (
                        <div className={styles.filterGroup}>
                            <select
                                value={filterBedrooms}
                                onChange={(e) => setFilterBedrooms(e.target.value)}
                                className={styles.filterSelect}
                            >
                                <option value="">Rooms</option>
                                {bedroomOptions.map(opt => <option key={opt} value={opt}>{opt} Beds</option>)}
                            </select>
                        </div>
                    )}
                </div>

                {/* Expandable More Options Section */}
                {showMoreOptions && (
                    <div className={styles.moreOptionsSection}>
                        <div className={styles.filterRow}>
                            <div className={styles.filterGroup}>
                                <select
                                    value={filterCity}
                                    onChange={(e) => setFilterCity(e.target.value)}
                                    className={styles.filterSelect}
                                >
                                    <option value="">All Cities</option>
                                    {(filterCounty ? (citiesByCounty[filterCounty] || []) : cities).map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.filterGroup}>
                                <select className={styles.filterSelect}>
                                    <option value="">Additional filters...</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Row */}
                <div className={styles.actionRow}>
                    <div className={styles.leftActions}>
                        <button
                            className={styles.moreOptionsButton}
                            onClick={() => setShowMoreOptions(!showMoreOptions)}
                        >
                            + More options
                        </button>
                    </div>
                    <div className={styles.rightActions}>
                        <button className={styles.textButton} onClick={clearFilters}>
                            <span className={styles.icon}>🗑</span> Clear filters
                        </button>
                        <button className={styles.showPropertiesButton}>
                            Show properties
                        </button>
                    </div>
                </div>
            </div>

            {/* Properties Grid Section */}
            <div className={styles.resultsSection}>
                <h2 className={styles.sectionTitle}>New properties</h2>

                {filteredProperties.length === 0 ? (
                    <div className={styles.noResults}>
                        No properties found matching your criteria.
                    </div>
                ) : (
                    <PropertyList properties={filteredProperties} viewMode="grid" />
                )}
            </div>
        </div>
    );
}

export default AllPropertiesPage;
