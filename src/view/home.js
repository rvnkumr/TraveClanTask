
import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Card,
    CardHeader,
    Divider,
    IconButton,
    SvgIcon,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
    makeStyles,
    TableContainer,
    Paper
} from '@material-ui/core';
import '../App.css';

const useStyles = makeStyles({
    table: {
      minWidth: 650
    }
  });

const HomePage = (props) => {
    const classes = useStyles();
const [flag,setFlag]=useState(true)
const [toggle,settoggle]=useState(false)
 const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [merchantDetail,setMerchantDetails]=useState([])


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  

    useEffect(() => {
        axios.get('https://intense-tor-76305.herokuapp.com/merchants').then((res)=>{

        for(var i in res.data){
            if(res.data[i].bids&&res.data[i].bids.length){
                res.data[i].maxAmount= Math.max.apply(Math, res.data[i].bids.map(function(o) { return o.amount; }))
                res.data[i].minAmount= Math.min.apply(Math, res.data[i].bids.map(function(o) { return o.amount; }))
            }
             else{
            res.data[i].maxAmount=0 ;
            res.data[i].minAmount=0 ;

                  }
        }
        let sortedData=res.data.sort((a, b) => {
            return b.maxAmount-a.maxAmount;
        });
        

            setMerchantDetails(sortedData)
            
        }).catch((error)=>{
           console.log(error)
        })
    }, [])


    const toggleSort =()=>{
         setFlag(!flag)
         settoggle(!toggle)      
    }
    

    return (
        <TableContainer component={Paper} style={{ margin: "20px" }}>
            <Card >
                <CardHeader  title="Merchants Details"/>
                <Divider />
                <Box>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell >Name</TableCell>
                            <TableCell >Email</TableCell>
                            <TableCell >Phone</TableCell>
                            <TableCell >Primium</TableCell>
                            <TableCell ><div style={{cursor:"pointer"}}onClick={toggleSort}>{flag ?"Max bid":"Min bids"} <span> ({toggle ?" Click here for Max bid ":"Click here for Min bid"})</span></div></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    
                        {merchantDetail?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index)=>{
                        return (
                            <TableRow key={item.id} >
                                <TableCell>{item.firstname+ ' '+ item.lastname}</TableCell>
                                <TableCell>{item.email}</TableCell>
                                <TableCell>{item.phone}</TableCell>
                                <TableCell>{item.hasPremium?"YES":"NO"}</TableCell>
                                <TableCell>{flag?item.maxAmount:item.minAmount}</TableCell>
                            </TableRow>
                        );
                    })}
                    </TableBody>
                    </Table>
                </Box>
                <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={merchantDetail.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />

            </Card>
            </TableContainer>

    )
}
export default HomePage;