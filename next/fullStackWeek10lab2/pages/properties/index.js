import PropertyList from '../../components/properties/PropertyList'
import { useContext, useEffect, useState } from "react";
import GlobalContext from "../store/globalContext"
import { useRouter } from 'next/router';
import { propertyTypes, bedroomOptions, cities, counties, citiesByCounty } from '../../data/irelandLocations';

function AllPropertiesPage() {
    const globalCtx = useContext(GlobalContext)
    const router = useRouter();
    const [filteredProperties, setFilteredProperties] = useState([]);

    // Filter states
    const [filterType, setFilterType] = useState('');
    const [filterSubtype, setFilterSubtype] = useState('');
    const [filterMinPrice, setFilterMinPrice] = useState('');
    const [filterMaxPrice, setFilterMaxPrice] = useState('');
    const [filterBedrooms, setFilterBedrooms] = useState('');
    const [filterCity, setFilterCity] = useState('');
    const [filterCounty, setFilterCounty] = useState('');
    const [filterTimeAdded, setFilterTimeAdded] = useState('');
    const [filterListingType, setFilterListingType] = useState('Buy');
    const [filterSearch, setFilterSearch] = useState('');

    // Initialize filters from URL query params
    useEffect(() => {
        if (router.query.listingType) {
            setFilterListingType(router.query.listingType);
        } else if (router.pathname === '/rent') {
            // Keep this check just in case, though we deleted rent.js
            setFilterListingType('Rent');
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
            let props = [];
            if (filterListingType === 'Buy') {
                props = globalCtx.theGlobalObject.buys;
            } else if (filterListingType === 'Rent') {
                props = globalCtx.theGlobalObject.rents;
            } else {
                // Fallback or 'All' if we wanted that
                props = [...globalCtx.theGlobalObject.buys, ...globalCtx.theGlobalObject.rents];
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
    }, [globalCtx.theGlobalObject.dataLoaded, globalCtx.theGlobalObject.buys, globalCtx.theGlobalObject.rents, filterType, filterSubtype, filterCity, filterCounty, filterMinPrice, filterMaxPrice, filterBedrooms, filterTimeAdded, filterListingType, filterSearch]);

    if (!globalCtx.theGlobalObject.dataLoaded) {
        return <div>Loading data from database, please wait . . . </div>
    }

    return (
        <div style={{ width: '100%', maxWidth: '100%' }}>
            <div style={{
                backgroundColor: '#f4f4f4',
                padding: '1rem',
                marginBottom: '1rem',
                borderRadius: '8px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                alignItems: 'center'
            }}>
                <select value={filterListingType} onChange={(e) => setFilterListingType(e.target.value)} style={{ padding: '0.5rem', fontWeight: 'bold' }}>
                    <option value="Buy">For Sale</option>
                    <option value="Rent">For Rent</option>
                </select>

                <input
                    type="text"
                    placeholder="Search name/address..."
                    value={filterSearch}
                    onChange={(e) => setFilterSearch(e.target.value)}
                    style={{ padding: '0.5rem', width: '200px' }}
                />

                <select value={filterType} onChange={(e) => {
                    setFilterType(e.target.value);
                    setFilterSubtype(''); // Reset subtype when type changes
                }} style={{ padding: '0.5rem' }}>
                    <option value="">All Types</option>
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                </select>

                {filterType && (
                    <select value={filterSubtype} onChange={(e) => setFilterSubtype(e.target.value)} style={{ padding: '0.5rem' }}>
                        <option value="">All Subtypes</option>
                        {propertyTypes[filterType].map(st => (
                            <option key={st} value={st}>{st}</option>
                        ))}
                    </select>
                )}

                <input
                    type="number"
                    placeholder="Min Price"
                    value={filterMinPrice}
                    onChange={(e) => setFilterMinPrice(e.target.value)}
                    style={{ padding: '0.5rem', width: '120px' }}
                />

                <input
                    type="number"
                    placeholder="Max Price"
                    value={filterMaxPrice}
                    onChange={(e) => setFilterMaxPrice(e.target.value)}
                    style={{ padding: '0.5rem', width: '120px' }}
                />

                <select value={filterCounty} onChange={(e) => {
                    setFilterCounty(e.target.value);
                    setFilterCity('');
                }} style={{ padding: '0.5rem' }}>
                    <option value="">All Counties</option>
                    {counties.map(county => (
                        <option key={county} value={county}>{county}</option>
                    ))}
                </select>

                <select value={filterCity} onChange={(e) => setFilterCity(e.target.value)} style={{ padding: '0.5rem' }}>
                    <option value="">All Cities</option>
                    {(filterCounty ? (citiesByCounty[filterCounty] || []) : cities).map(city => (
                        <option key={city} value={city}>{city}</option>
                    ))}
                </select>

                {filterType === 'Residential' && (
                    <select value={filterBedrooms} onChange={(e) => setFilterBedrooms(e.target.value)} style={{ padding: '0.5rem' }}>
                        <option value="">Any Bedrooms</option>
                        {bedroomOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.9rem', color: '#666' }}>Added after:</label>
                    <input
                        type="date"
                        value={filterTimeAdded}
                        onChange={(e) => setFilterTimeAdded(e.target.value)}
                        style={{ padding: '0.5rem' }}
                    />
                </div>

                <button onClick={() => {
                    setFilterListingType('Buy'); // Optionally reset listing type too? Maybe better to keep it. Let's keep it.
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
                }} style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#77002e',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}>
                    Clear Filters
                </button>
            </div>

            <PropertyList properties={filteredProperties} />
        </div>
    );
}

export default AllPropertiesPage;
