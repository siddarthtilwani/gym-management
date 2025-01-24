import React, { useState, useEffect } from 'react';
import { Table, Paper, TableHead, TableContainer, TableRow, TableBody, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { makeStyles } from '@mui/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import resources from './resources';
import axios from 'axios';
import './FeeReminder.css'

const useStyles = makeStyles(theme => ({
  paper: {
    maxWidth: 1200,
    margin: 'auto',
    maxHeight: 400,
  },
  imageBorderd: {
    height: 200,
    width: 200,
    borderRadius: '5px',
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

const CustomButton = styled(Button)`
  color: black ;
  text-transform: none ; 
  background-color: #c46210  ;
  :hover {
    background-color: #c46210; 
    color: white ; 
  } 
`

function FeeReminder() {
  const classes = useStyles()
  const [feeReminders, setFeeReminders] = useState([])

  const submitFee = (id) => {
    const submitFeeRequest = axios.post("https://fitnessprogym.hasura.app/api/rest/update-fee-reminder/" + id + "/" + true, {}, { headers: { "x-hasura-admin-secret": resources.password } })
    setFeeReminders(feeReminders.filter(feeReminder => feeReminder.transaction_id !== id))
    alert("Fee Submitted")
  }
  const FeeRow = ({ feeReminder }) => {

    return (
      <StyledTableRow key={feeReminder.transaction_id}>
        <TableCell align="center"><img src={feeReminder.image_url} className={classes.imageBorderd} alt='...' /></TableCell>
        <TableCell align="center">{feeReminder.customer_name}</TableCell>
        <TableCell align="center">{feeReminder.due_date}</TableCell>
        <TableCell align="center">{feeReminder.fee}</TableCell>
        <TableCell align="center">
          <CustomButton onClick={() => submitFee(feeReminder.transaction_id)}>Submit Fee</CustomButton>
        </TableCell>
      </StyledTableRow>
    )
  }

  useEffect(() => {
    async function fetchValues() {
      const membersRequest = await axios.get("https://fitnessprogym.hasura.app/api/rest/fee-reminders", { headers: { "x-hasura-admin-secret": resources.password } })
      setFeeReminders(membersRequest.data.transactions)
    }

    fetchValues()
  }, [])


  return (
    <div class="main-div">
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

            {feeReminders.map((feeReminder) => (
              <FeeRow feeReminder={feeReminder} />
            ))}
          </TableBody>


        </Table>
      </TableContainer>
    </div>
  )
}

export default FeeReminder;
