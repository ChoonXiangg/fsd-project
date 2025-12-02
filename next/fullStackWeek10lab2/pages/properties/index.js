import PropertyList from '../../components/properties/PropertyList'
import { useContext, useEffect, useState } from "react";
import GlobalContext from "../store/globalContext"
import { useRouter } from 'next/router';
import { propertyTypes, bedroomOptions } from '../../data/irelandLocations';

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

    // Initialize filters from URL query params
    useEffect(() => {
        if (router.query.type) setFilterType(router.query.type);
        if (router.query.maxPrice) setFilterMaxPrice(router.query.maxPrice);
    }, [router.query]);

    useEffect(() => {
        if (globalCtx.theGlobalObject.dataLoaded) {
            let props = globalCtx.theGlobalObject.properties;

            if (filterType) {
                props = props.filter(p => p.propertyType === filterType);
            }
            if (filterSubtype) {
                props = props.filter(p => p.propertySubtype === filterSubtype);
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

            setFilteredProperties(props);
        }
    }, [globalCtx.theGlobalObject.dataLoaded, globalCtx.theGlobalObject.properties, filterType, filterSubtype, filterMinPrice, filterMaxPrice, filterBedrooms]);

    if (!globalCtx.theGlobalObject.dataLoaded) {
        return <div>Loading data from database, please wait . . . </div>
    }

    return (
        <div>
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

                {filterType === 'Residential' && (
                    <select value={filterBedrooms} onChange={(e) => setFilterBedrooms(e.target.value)} style={{ padding: '0.5rem' }}>
                        <option value="">Any Bedrooms</option>
                        {bedroomOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                )}

                <button onClick={() => {
                    setFilterType('');
                    setFilterSubtype('');
                    setFilterMinPrice('');
                    setFilterMaxPrice('');
                    setFilterBedrooms('');
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
