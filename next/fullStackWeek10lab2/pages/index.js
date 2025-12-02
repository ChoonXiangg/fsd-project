import PropertyList from '../components/properties/PropertyList'
import { useContext } from "react";
import GlobalContext from "./store/globalContext"

function HomePage() {
    const globalCtx = useContext(GlobalContext)

    if (globalCtx.theGlobalObject.dataLoaded == true) {
        return <PropertyList properties={globalCtx.theGlobalObject.properties} />
    }
    return <div>Loading data from database, please wait . . . </div>
}

export default HomePage;