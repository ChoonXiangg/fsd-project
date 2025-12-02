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


  const contents = [
    { title: 'Home', webAddress: '/' },
    { title: 'All Properties', webAddress: '/properties' },
    { title: 'Add New Property', webAddress: '/new-property' },
  ]
  return (
    <header className={classes.header}>
      <HamMenuContent contents={contents} />
      <HamMenu toggleMenuHide={() => toggleMenuHide()} />
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
