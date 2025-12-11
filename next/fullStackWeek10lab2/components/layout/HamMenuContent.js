import classes from './HamMenuContent.module.css'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import GlobalContext from "../../pages/store/globalContext"

export default function HamMenuContent(props) {
    const globalCtx = useContext(GlobalContext)
    const router = useRouter()
    let [popupToggle, setPopupToggle] = useState(false)

    if (globalCtx.theGlobalObject.hideHamMenu) {
        return null
    }

    function clicked(webAddress) {
        globalCtx.updateGlobals({ cmd: 'hideHamMenu', newVal: true })
        router.push(webAddress)
    }

    function handleLogout() {
        globalCtx.updateGlobals({ cmd: 'hideHamMenu', newVal: true })
        globalCtx.updateGlobals({ cmd: 'logout' })
        // Clear session storage so the startup popup shows again
        sessionStorage.removeItem('hasSeenStartupPopup')
        router.push('/')
    }

    function closeMe() {
        globalCtx.updateGlobals({ cmd: 'hideHamMenu', newVal: true })
        if (popupToggle == true) {
            setPopupToggle(false)
        } else {
            setPopupToggle(true)
        }
    }

    // Filter content
    const menuItems = props.contents.filter(item => item.action !== 'logout');
    const logoutItem = props.contents.find(item => item.action === 'logout');

    return (
        <div className={classes.background} onClick={() => closeMe()} >
            <div className={classes.mainContent} onClick={(e) => e.stopPropagation()}>
                <div className={classes.menuList}>
                    {menuItems.map((item, index) => (
                        <div className={classes.menuItem} key={index} onClick={() => clicked(item.webAddress)}>
                            {item.title}
                        </div>
                    ))}
                </div>

                {logoutItem && (
                    <div className={classes.logoutItem} onClick={handleLogout}>
                        {logoutItem.title}
                    </div>
                )}
            </div>
        </div>
    );
}
