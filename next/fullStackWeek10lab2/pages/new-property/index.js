// our-dimain.com/new-property
import NewPropertyForm from '../../components/properties/NewPropertyForm'
import { useRouter } from 'next/router';
import GlobalContext from "../../pages/store/globalContext"
import { useContext } from 'react'
import styles from '../../styles/PageWrapper.module.css'

function NewPropertyPage() {
    const router = useRouter()
    const globalCtx = useContext(GlobalContext)

    async function addPropertyHandler(enteredPropertyData) {
        await globalCtx.updateGlobals({ cmd: 'addProperty', newVal: enteredPropertyData })
        router.push('/');
    }

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.contentCard}>
                <NewPropertyForm onAddProperty={addPropertyHandler} />
            </div>
        </div>
    )
}

export default NewPropertyPage