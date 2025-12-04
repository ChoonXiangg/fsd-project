import PropertyDetail from '../../components/properties/PropertyDetail'
import { useRouter } from 'next/router'
import GlobalContext from "../../pages/store/globalContext"
import { useContext } from 'react'

export default function () {
    const globalCtx = useContext(GlobalContext)
    const router = useRouter();

    let returnVal = null
    for (let ii = 0; ii < globalCtx.theGlobalObject.properties.length; ii++) {
        let temp = globalCtx.theGlobalObject.properties[ii]
        if (temp._id && router.query.propertyId && temp._id.trim() == router.query.propertyId.trim()) {
            returnVal = <PropertyDetail
                propertyId={temp._id}
                name={temp.name}
                image={temp.image}
                address={temp.address}
                city={temp.city}
                county={temp.county}
                price={temp.price}
                propertyType={temp.propertyType}
                propertySubtype={temp.propertySubtype}
                bedrooms={temp.bedrooms}
                floorSize={temp.floorSize}
                verifiedAgent={temp.verifiedAgent}
                creatorId={temp.creatorId}
                creatorUsername={temp.creatorUsername}
                creatorEmail={temp.creatorEmail}
                creatorPhoneNumber={temp.creatorPhoneNumber}
                starredBy={temp.starredBy || []}
            />
        }
    }
    return returnVal
}
