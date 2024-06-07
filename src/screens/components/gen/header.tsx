import React,{useState, useEffect, useContext} from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from 'auth';
import '../styles/components.css'
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebase/index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faLocationDot, faUser } from '@fortawesome/free-solid-svg-icons';
import NavBarItems from './navigator/navbaritems';
import { educationdata, personaldata } from 'types/interfaces';
import { CustomButton } from '../global/buttons';
import { Button, ButtonBase, IconButton } from '@mui/material';
import TouchRipple from '@mui/material/ButtonBase/TouchRipple';
type Props = {
  menu: any,
}

export const Header: React.FC<Props> = ({menu}) => {
  const [active, setActive] = useState(1);
  const navigate = useNavigate()
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const {currentUser} = useContext(AuthContext)

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };
  const __navigate = (id: number) => {
    setActive(id);
  }

  const signOutUser = async () => {
		try {
				await signOut(auth);
				navigate('/')
				console.log("User signed out successfully.");
			} catch (error) {
				// Handle any errors here
				console.error("Error signing out:", error);
			}
		};
  

  return (
    <div className="header">
     <img width={120}  src='https://i.imgur.com/HZdBITp.png' />
     <h3>VIQUMO ADMIN</h3>
     <p>System</p>
      <div className="right">
        {menu.map((item: any, index: number) =>(
          <div key={index}  onClick={() => __navigate(item.id)}>
              <NavBarItems
              
                  onClick={() => setDropdownVisible(false)}
                  active={item.id === active}
                  item={item} />
          </div>
        ))}
      </div>
      <button onClick={signOutUser}>Logout</button>  
    </div>
  );
}