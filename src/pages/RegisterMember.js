import React , {useState} from 'react';
import './RegisterMember.css'
import {Paper, Stack, Button, TextField, Grid , MenuItem ,Snackbar , Alert} from '@mui/material'
import { styled } from "@mui/material/styles";
import { makeStyles } from '@mui/styles';
import moment from "moment";
import { upload } from '../firebase';
import axios from 'axios';

import resources from "./resources";

const useStyles = makeStyles(theme => ({ 
  form: {
    color: "white" , 
    marginLeft: 4
  } , 
  imageBorderd: {
    height: "30vh", 
    borderRadius: '5px'  
  }
}))

const CustomButton = styled(Button)`
  color: black ;
  text-transform: none ; 
  background-color: #c46210  ;
  :hover {
    background-color: #c46210; 
    color: white ; 
  } 
`
const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  backgroundColor: "black"
}));

const Input = styled('input')({
  display: 'none',
});

const memberships = ['Standard (Rs 700)' , 'Personal Training (Rs 3000)']
function RegisterMember() {

  const classes = useStyles()

  const [name, setName] = useState(null)
  const [age , setAge] = useState(null)
  const [address , setAddress] = useState(null)
  const [phone , setPhone] = useState(null)
  const [membership, setMembership] = useState('Standard (Rs 700)');
  const [date , setDate] = useState(moment(new Date()).format("YYYY-MM-DD"))
  const [photo , setPhoto] = useState(null)
  const [alert , setAlert] = useState(false)
  const [status , setStatus] = useState('')

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setAlert(false);
  };
  
  function handlePhotoChange(e){
    if (e.target.files[0]){
      setPhoto(e.target.files[0])
    }
  }
 
  const registerCusomter = () => {
   if(photo){
      console.log("Photo Uploaded")
      upload(photo)
    }
    
  const generate_image_URL = (name) => {
    return 'https://firebasestorage.googleapis.com/v0/b/fitnessprogym-2fb41.appspot.com/o/' + name + '?alt=media&token=a98d8377-659c-4b99-8952-b6ab02239f02'
  }

    const request = axios.post("https://fitnessprogym.hasura.app/v1/graphql", 
    {
      query: `mutation RegisterUser{
          insert_customers(objects: {address: "${address}", admission_date: "${date}", age: ${age}, cell_no: "${phone}", fee_structure: ${membership === "Standard (Rs 700)" ? 700 : 3000}, image_url: "${photo ? generate_image_URL(photo.name) :
          'https://firebasestorage.googleapis.com/v0/b/fitnessprogym-2fb41.appspot.com/o/anonymous.jpeg?alt=media&token=a98d8377-659c-4b99-8952-b6ab02239f02'}", membership_type: ${membership === "Standard (Rs 700)" ? 0 : 1 }, name: "${name}"}) {
            returning {
              address
              admission_date
              age
              cell_no
              fee_structure
              id
              image_url
              membership_type
              name
            }
    }
    }`
    } , 
    {headers: {"x-hasura-admin-secret": resources.password}})
    
    
    setName('')
    setAge('')
    setAddress('')
    setPhone('')
    setMembership('Standard (Rs 700)')
    setPhoto(null)
    setAlert(true)
    setStatus(true)
    }
  

  return (
    <div class = "main">
      <Snackbar open={alert} autoHideDuration={3000} onClose={handleClose}>
        {status ?
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Customer Registered Successfully
        </Alert> : 
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          Incomplete Information
        </Alert> 
        }
        
      </Snackbar>
      <Stack >
        <Item><img src={photo ? URL.createObjectURL(photo) : require('../anonymous.jpeg')} className={classes.imageBorderd} alt='...' /></Item>
        <Item>
          <div class="form">
  
          <Grid container spacing={1} justifyContent="center" >
          
          <Grid item xs={4}>
            {/* <FormLabel className={classes.form}>Name</FormLabel> */}
            <TextField
              required
              id="name"
              value={name}
              placeholder='Name *'
              fullWidth
              onChange={(e) => (setName(e.target.value))} 
              variant="outlined"
              InputProps={{style: {backgroundColor: 'white'}}}
            />
          </Grid>
          <Grid item xs={4}>
            {/* <FormLabel className={classes.form}>Age</FormLabel> */}
            <TextField
              required
              id="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Age *"
              fullWidth
              type="number"
              InputProps={{style: {backgroundColor: 'white'}}}  
            />
          </Grid>
              
            <Grid item xs={4}>
              <TextField
                required
                id="address"
                value = {address}
                onChange= {(e) => setAddress(e.target.value)}
                placeholder="Address *"
                fullWidth
                InputProps={{style: {backgroundColor: 'white'}}} 
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                required
                id="cell-no"
                value = {phone}
                onChange= {(e) => setPhone(e.target.value)}
                placeholder="Cell No *"
                fullWidth
                InputProps={{style: {backgroundColor: 'white'}}} 
              />
            </Grid>
             
            <Grid item xs={4}>
              <TextField
                select
                id="membership"
                value={membership}
                InputProps={{style: {backgroundColor: 'white' ,}}}
                onChange={(e) => setMembership(e.target.value)}
                fullWidth 
              >
                {memberships.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={4}>
             <TextField
                type="date"
                id="date-of-admission"
                value={date}
                InputProps={{style: {backgroundColor: 'white' ,}}}
                onChange={(e) => setDate(e.target.value)}
                fullWidth 
              ></TextField>
            </Grid>
            <Grid item xs={4}>
              <label htmlFor="contained-button-file">
                <Input accept="image/*" id="contained-button-file" multiple type="file"
                  onChange={handlePhotoChange} 
                />
                <CustomButton variant="contained" component="span" fullWidth sx={{height: '100%'}}>
                  Upload
                </CustomButton>
              </label>
            </Grid>
            <Grid item xs={4}>
              <CustomButton
                disabled={(! (name && age ))}
                variant="contained" 
                fullWidth sx={{height: '100%'}}
                onClick = {registerCusomter} 
                >
                  Register
              </CustomButton>
            </Grid>
          </Grid>
        </div>

        </Item>
      </Stack>
          </div>
  ) 
  
}

export default RegisterMember;
