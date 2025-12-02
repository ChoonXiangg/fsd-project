// our-dimain.com/new-property
import NewPropertyForm from '../../components/properties/NewPropertyForm'
import { useRouter } from 'next/router';
import GlobalContext from "../../pages/store/globalContext"
import { useContext } from 'react'

function NewPropertyPage() {
    const router = useRouter()
    const globalCtx = useContext(GlobalContext)

    async function addPropertyHandler(enteredPropertyData) {
        await globalCtx.updateGlobals({ cmd: 'addProperty', newVal: enteredPropertyData })
        router.push('/');
    }

    return <NewPropertyForm onAddProperty={addPropertyHandler} />
}

export default NewPropertyPage