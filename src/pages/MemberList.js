import React, { useState, useEffect } from 'react';
import { Table, Paper, TableHead, TableContainer, TableRow, TableBody, TextField, Button } from "@mui/material";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { upload } from '../firebase';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { FaUserPlus, FaTrash, FaEdit, FaMoneyBill } from 'react-icons/fa'
import { makeStyles } from '@mui/styles';
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
import axios from "axios";

import resources from "./resources";
import "./MemberList.css"

const useStyles = makeStyles(theme => ({
  paper: {
    maxWidth: "98%",
    minWidth: "80%",
    margin: 'auto',
    maxHeight: "70vh",

  },
  link: {
    textDecoration: 'none',
    width: '100%',
    color: 'black',
    '&:hover': {
      color: "#c46210"
    }
  },
  icons: {
    color: 'black',
    '&:hover': {
      color: "#800000"
    }
  },
  imageBorderd: {
    height: 280,
    width: 280,
    borderRadius: '5px',
  },
  cameraButton: {
    color: 'black',
    '&:hover': {
      color: "#c46210"
    }
  }


}))

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#c46210",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,

  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const Input = styled('input')({
  display: 'none',
});

const CustomButton = styled(Button)`
  color: black ;
  text-transform: none ; 
  background-color: #c46210  ;
  :hover {
    background-color: #c46210; 
    color: white ; 
  } 
`

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "80%",
  color: "white",
  bgcolor: 'black',
  border: '2px solid #000',
  boxShadow: 24,
  textAlign: 'center',
  p: 4,
};


function MemberList() {
  const classes = useStyles()

  const [memberSearch, setMemberSearch] = useState("");
  const [members, setMembers] = useState([])
  const [id, setID] = useState([])
  const [transactions, setTransactions] = useState([])

  const [open, setOpen] = useState(false);
  async function openModal(id) {
    setOpen(true)
    setID(id)
    const transactionsRequest = await axios.get(("https://fitnessprogym.hasura.app/api/rest/get-transactions/" + id), { headers: { "x-hasura-admin-secret": resources.password } })
    setTransactions(transactionsRequest.data.transactions)
  }
  const handleClose = () => setOpen(false);



  useEffect(() => {
    async function fetchValues() {
      const membersRequest = await axios.get("https://fitnessprogym.hasura.app/api/rest/get-customers", { headers: { "x-hasura-admin-secret": resources.password } })
      setMembers(membersRequest.data.customers)
    }

    fetchValues()
  }, [])

  const generate_image_URL = (name) => {
    return 'https://firebasestorage.googleapis.com/v0/b/fitnessprogym-2fb41.appspot.com/o/' + name + '?alt=media&token=a98d8377-659c-4b99-8952-b6ab02239f02'
  }

  function TransactionModal() {
    const submitFee = (id) => {
      const submitFeeRequest = axios.post("https://fitnessprogym.hasura.app/api/rest/update-fee-reminder/" + id + "/" + true, {}, { headers: { "x-hasura-admin-secret": resources.password } })
      setTransactions(transactions.filter(transaction => transaction.transaction_id !== id))
      alert("Fee Submitted")
    }
    const FeeRow = ({ transaction }) => {
      return (
        <StyledTableRow key={transaction.transaction_id}>
          <TableCell align="center"><img src={transaction.image_url} className={classes.imageBorderd} alt='...' /></TableCell>
          <TableCell align="center">{transaction.customer_name}</TableCell>
          <TableCell align="center">{transaction.due_date}</TableCell>
          <TableCell align="center">{transaction.fee}</TableCell>
          <TableCell align="center">
            {transaction.fee_status ? "Fee Submitted" : <CustomButton onClick={() => submitFee(transaction.transaction_id)}>Submit Fee</CustomButton>}
          </TableCell>
        </StyledTableRow>
      )
    }
    console.log(transactions)
    return (
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Transaction History
            </Typography>
            <TableContainer component={Paper} className={classes.paper}>
              <Table aria-label="customized table" stickyHeader>
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">Picture</StyledTableCell>
                    <StyledTableCell align="center">Name</StyledTableCell>
                    <StyledTableCell align="center">Due Date</StyledTableCell>
                    <StyledTableCell align="center">Fee</StyledTableCell>
                    <StyledTableCell align="center">Fee Status</StyledTableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {transactions.map((transaction) => (
                    <FeeRow transaction={transaction} />
                  ))}

                </TableBody>


              </Table>
            </TableContainer>
          </Box>
        </Modal>
      </div>
    );
  }


  const MemberRow = ({ member }) => {
    const [photo, setPhoto] = useState(null)

    function handlePhotoChange(e) {
      if (e.target.files[0]) {
        setPhoto(e.target.files[0])
      }

    }

    function updatePhoto() {
      if (photo) {
        console.log("Photo Updated")
        upload(photo)
        const request = axios.post("https://fitnessprogym.hasura.app/v1/graphql",
          {
            query: `mutation update_image_url {
        update_customers_by_pk(pk_columns: {id: ${member.id}}, _set: {image_url: "${generate_image_URL(photo.name)}"}) {
        image_url
      }
      }
    `
          },
          { headers: { "x-hasura-admin-secret": resources.password } })
      }
    }

    const style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper',
      border: '2px solid #000',
      boxShadow: 24,
      p: 4,
    };

    return (
      <StyledTableRow key={member.id}>
        <TableCell align="center">
          <img src={photo ? URL.createObjectURL(photo) : member.image_url} className={classes.imageBorderd} alt='...' />
          <label htmlFor="icon-button-file">
            <Input accept="image/*" id="icon-button-file" type="file" onChange={handlePhotoChange} />
            <IconButton color="primary" aria-label="upload picture" component="span" >
              <PhotoCamera className={classes.cameraButton} />
            </IconButton>
          </label>
          {photo ? <IconButton color="primary" aria-label="upload picture" component="span" onClick={updatePhoto}>
            <FileUploadIcon className={classes.cameraButton} />
          </IconButton> : ""}
        </TableCell>
        <TableCell align="center">{member.name}</TableCell>
        <TableCell align="center">{member.age}</TableCell>
        <TableCell align="center">{member.cell_no}</TableCell>
        <TableCell align="center">{member.address}</TableCell>
        <TableCell align="center">{member.membership_type == 0 ? "Standard" : "Personal Training"}</TableCell>
        <TableCell align="center">{member.membership_type == 0 ? "700/-" : "3000/-"}</TableCell>
        <TableCell align="center">{member.admission_date}</TableCell>
        <TableCell align="center">
          <FaMoneyBill onClick={() => openModal(member.id)} className={classes.icons} />
        </TableCell>
        <TableCell align="center">
          <FaEdit className={classes.icons} />
        </TableCell>
        <TableCell align="center">
          <FaTrash
            className={classes.icons}
            onClick={() => {
              setMembers(members.filter(x => x.id !== member.id))
              axios.post("https://fitnessprogym.hasura.app/api/rest/delete-user/" + member.id,
                {}, { headers: { "x-hasura-admin-secret": resources.password } })
            }
            }
          />
        </TableCell>

      </StyledTableRow>

    )
  }

  return (
    <div class="main-div">

      <TableContainer component={Paper} className={classes.paper}>
        <Table aria-label="customized table" >
          <TableHead>
            <TableRow sx={{ backgroundColor: "#c46210" }}>
              <StyledTableCell align="center">Picture</StyledTableCell>
              <StyledTableCell align="center">Name</StyledTableCell>
              <StyledTableCell align="center">Age</StyledTableCell>
              <StyledTableCell align="center">Cell No.</StyledTableCell>
              <StyledTableCell align="center">Address</StyledTableCell>
              <StyledTableCell align="center">Membership Type</StyledTableCell>
              <StyledTableCell align="center">Fee</StyledTableCell>
              <StyledTableCell align="center">Date of Admission</StyledTableCell>
              <StyledTableCell align="center">Fee History</StyledTableCell>
              <StyledTableCell align="center">Edit</StyledTableCell>
              <StyledTableCell align="center">Delete</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody >
            <StyledTableRow>
              <TableCell align="left" colSpan={10}>
                <TextField
                  required
                  id="name"
                  value={memberSearch}
                  placeholder='Search Customer'
                  fullWidth
                  onChange={(e) => (setMemberSearch(e.target.value))}
                  variant="outlined"
                  InputProps={{ style: { backgroundColor: 'white' } }}
                /></TableCell>
              <TableCell align="center">
                <div class="total">{members.length}</div>
              </TableCell>
            </StyledTableRow>

            {members.filter(member => member.name.includes(memberSearch)).map((member) => {
              return (
                <MemberRow member={member} />
              )
            })}
            <TableRow className={classes.registerUserCell} >
              <TableCell colSpan={11} align="center">
                <Link to="/register_member" className={classes.link}><FaUserPlus /></Link>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Table>
        <TableHead>

        </TableHead>
      </Table>
      <TransactionModal />
    </div>
  );
}

export default MemberList;
