import classes from './MainNavigation.module.css'
import Link from 'next/link'
import HamMenu from "../generic/HamMenu"
import HamMenuFAB from "../generic/HamMenuFAB"
import { useContext, useState } from 'react'
import GlobalContext from "../../pages/store/globalContext"
import HamMenuContent from "./HamMenuContent"
import { useRouter } from 'next/router'
import { counties, cities } from '../../data/irelandLocations'

function MainNavigation() {
  const globalCtx = useContext(GlobalContext)
  const router = useRouter()
  const [showDropdown, setShowDropdown] = useState(false)

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
    <header className={`${classes.header} ${classes.transparent}`}>
      <HamMenuContent contents={contents} />
      <HamMenu toggleMenuHide={() => toggleMenuHide()} />
      <nav>
        <ul>
          <li>
            <Link href='/'>Home</Link>
          </li>
          <li
            className={classes.dropdownContainer}
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <Link href='/properties'>All Properties</Link>
            {showDropdown && (
              <div className={classes.dropdownMenu}>
                <div className={classes.dropdownColumn}>
                  <h3>Locations</h3>
                  <ul>
                    {cities.slice(0, 5).map((city) => (
                      <li key={city}>
                        <Link href={`/properties?city=${city}`}>{city}</Link>
                      </li>
                    ))}
                  </ul>
                  <Link href='/properties' className={classes.viewAll}>
                    View All Locations →
                  </Link>
                </div>

                <div className={classes.dropdownColumn}>
                  <h3>Property Type</h3>
                  <ul>
                    <li><Link href='/properties?type=Residential&subtype=Apartment'>Apartments</Link></li>
                    <li><Link href='/properties?type=Residential&subtype=Bungalow'>Bungalows</Link></li>
                    <li><Link href='/properties?type=Residential&subtype=Semi-Detached House'>Semi-Detached Houses</Link></li>
                    <li><Link href='/properties?type=Residential&subtype=Terrace'>Terraced Houses</Link></li>
                    <li><Link href='/properties?type=Commercial'>Commercial</Link></li>
                  </ul>
                </div>

                <div className={classes.dropdownColumn}>
                  <h3>Counties</h3>
                  <ul>
                    {counties.slice(0, 5).map((county) => (
                      <li key={county}>
                        <Link href={`/properties?county=${county}`}>{county}</Link>
                      </li>
                    ))}
                  </ul>
                  <Link href='/properties' className={classes.viewAll}>
                    View All Counties →
                  </Link>
                </div>
              </div>
            )}
          </li>
          <li>
            <Link href='/new-property'>Add New Property</Link>
          </li>
        </ul>
      </nav>
      {globalCtx.theGlobalObject.user && (
        <div className={classes.userGreeting} onClick={() => router.push('/profile')}>
          <span className={classes.userName}>Hi, {globalCtx.theGlobalObject.user.username}!</span>
          <div className={classes.userAvatar}>
            {globalCtx.theGlobalObject.user.profilePicture ? (
              <img src={globalCtx.theGlobalObject.user.profilePicture} alt={globalCtx.theGlobalObject.user.username} />
            ) : (
              <span className={classes.userInitials}>
                {globalCtx.theGlobalObject.user.username.substring(0, 2).toUpperCase()}
              </span>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default MainNavigation
