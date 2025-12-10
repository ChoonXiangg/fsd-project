import classes from "./HamMenu.module.css"
import { IoMdHome } from 'react-icons/io';

export default function HamMenu(props) {
  return (
    <div className={classes.mainDiv} onClick={() => props.toggleMenuHide()}>
      <span className={classes.mainSpan}><IoMdHome /></span>
    </div>
  )
}
