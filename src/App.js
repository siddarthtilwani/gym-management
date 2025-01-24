import React , {useState } from 'react';
import {Button, TextField , List, ListItem , Box} from '@mui/material'
import { useAuth , login } from './firebase';
import { makeStyles } from '@mui/styles';
import { styled } from "@mui/material/styles";
import { Routes, Route} from "react-router-dom";
import Home from './pages/Home'
import RegisterMember from './pages/RegisterMember'
import MemberList from './pages/MemberList';
import FeeReminder from './pages/FeeReminder';
import Header from "./component/Header"
import "./App.css"


const CustomButton = styled(Button)`
  color: black ;
  text-transform: none ; 
  background-color: #c46210  ;
  :hover {
    background-color: #c46210; 
    color: white ; 
  } 
`
const useStyles = makeStyles(theme => ({
  paper: {
    maxWidth: 300 ,
    margin: 'auto' 
  },
  root: {
    width: '100%' , 
    backgroundColor: "black"
  },
  link: {
    textDecoration: 'none' , 
    width: '100%'
  }, 
  imageBorderd: {
    width: '100%' ,
    borderRadius: '5px' ,  
  }

}))  

function App() {
  const classes = useStyles()
  const [email , setEmail] = useState('')
  const [password , setPassword] = useState('')
  const [loading , setLoading] = useState(false)

  const currentUser = useAuth()

  async function handleLogin(){
    setLoading(true); 
    try {
      await login(email , password) ;
    }
    catch(error) {
      alert("Error logging in") ;
      console.log(error) ;
    }
    setLoading(false); 
  }
  
  function handleKeyDown(event) {
    if(event.keyCode === 13) { 
        handleLogin()
  }
  } 

  return (
    <>
    {currentUser?.email ? 
    <div>
      <Header />
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="register_member" element={<RegisterMember />} />
        <Route path="member_list" element={<MemberList />} />
        <Route path="fee_reminder" element={<FeeReminder />} />
    </Routes>
    </div> : 
    
    <div class = "login-form">
    <Box className={classes.paper}>
       <List className={classes.root}>
          <ListItem divider>
              <img src={require('./fitnesspro.png')} className={classes.imageBorderd} alt='...' />
          </ListItem>
          <ListItem divider>
            <TextField
              InputProps={{style: {backgroundColor: 'white'}}}
              id = "email"
              placeholder ="Email"
              onChange={(e) => (setEmail(e.target.value))}
              sx={{height: '100%' , width: "100%"}} 
            />
          </ListItem>
          <ListItem divider>
            <TextField
              id = "password"
              InputProps={{style: {backgroundColor: 'white'}}}
              type="password"
              placeholder="Password"
              sx={{height: '100%' , width: "100%"}}
              onChange={(e) => (setPassword(e.target.value))}
              onKeyDown={handleKeyDown}
            />
          </ListItem>
          <ListItem divider>
            <CustomButton variant="contained" sx={{height: '100%' , width: "100%"}} onClick={handleLogin}>
              Log In
            </CustomButton>
          </ListItem>
       </List>
    </Box>
    </div>
  }
    
    
    </>
  );
}

export default App;
