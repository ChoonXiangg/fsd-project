import PropertyDetail from '../../components/properties/PropertyDetail'
import { useRouter } from 'next/router'
import GlobalContext from "../../pages/store/globalContext"
import { useContext } from 'react'

export default function () {
    const globalCtx = useContext(GlobalContext)
    const router = useRouter();

    // Back to basics, a simple for loop. Also trim() comes into play as it usually does!
    let returnVal = null
    for (let ii = 0; ii < globalCtx.theGlobalObject.properties.length; ii++) {
        let temp = globalCtx.theGlobalObject.properties[ii]
        if (temp._id && router.query.propertyId && temp._id.trim() == router.query.propertyId.trim()) {
            returnVal = <PropertyDetail
                image={temp.image}
                title={temp.title}
                description={temp.description}
                address={temp.address}
                price={temp.price}
                bedrooms={temp.bedrooms}
                bathrooms={temp.bathrooms}
            />
        }
    }
    // In the real world, we'd put the code above in the store context module. 
    return returnVal
}
