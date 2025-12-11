// our-dimain.com/new-property
import NewPropertyForm from '../../components/properties/NewPropertyForm'
import { useRouter } from 'next/router';
import GlobalContext from "../../pages/store/globalContext"
import { useContext } from 'react'
import styles from '../../styles/StandardPage.module.css'

function NewPropertyPage() {
    const router = useRouter()
    const globalCtx = useContext(GlobalContext)

    async function addPropertyHandler(enteredPropertyData) {
        await globalCtx.updateGlobals({ cmd: 'addProperty', newVal: enteredPropertyData })
        router.push('/');
    }

    return (
        <div className={styles.container}>
            <div className={styles.pageHeader}>
                <div className={styles.headerContent}>
                    <h1 className={styles.pageTitle}>Add New Property</h1>
                    <div className={styles.headerDescription}>
                        <p>List your property with us and reach thousands of potential buyers.</p>
                    </div>
                </div>
            </div>

            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '4px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', maxWidth: '800px', margin: '0 auto' }}>
                <NewPropertyForm onAddProperty={addPropertyHandler} />
            </div>
        </div>
    )
}

export default NewPropertyPage