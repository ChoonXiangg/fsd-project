import classes from './MainNavigation.module.css'
import Link from 'next/link'
import HamMenu from "../generic/HamMenu"
import HamMenuFAB from "../generic/HamMenuFAB"
import { useContext } from 'react'
import GlobalContext from "../../pages/store/globalContext"
import HamMenuContent from "./HamMenuContent"
import { useRouter } from 'next/router'

function MainNavigation() {
  const globalCtx = useContext(GlobalContext)
  const router = useRouter()

  function toggleMenuHide() {
    globalCtx.updateGlobals({ cmd: 'hideHamMenu', newVal: false })
  }

  // Build menu contents dynamically based on user login state
  const contents = [
    { title: 'Home', webAddress: '/' },
    { title: 'All Properties', webAddress: '/properties' },
    { title: 'Add New Property', webAddress: '/new-property' },
  ]

  // Add Profile and Logout only if user is logged in
  if (globalCtx.theGlobalObject.user) {
    contents.push({ title: 'Profile', webAddress: '/profile' })
    contents.push({ title: 'Logout', action: 'logout' })
  }
  return (
    <header className={classes.header}>
      <HamMenuContent contents={contents} />
      <HamMenu toggleMenuHide={() => toggleMenuHide()} />
      {globalCtx.theGlobalObject.user && (
        <div className={classes.userGreeting}>
          Hi, {globalCtx.theGlobalObject.user.username}
        </div>
      )}
      <nav>
        <ul>
          <li>
            <Link href='/'>Home</Link>
          </li>
          <li>
            <Link href='/properties'>All Properties</Link>
          </li>
          <li>
            <Link href='/new-property'>Add New Property</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation
