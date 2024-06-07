import React from 'react'
import '../admin.css'
import '../../../../index.css'
import { collection, onSnapshot } from '@firebase/firestore';
import {db} from '../../../../firebase/index'
import { Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, TextField, makeStyles } from '@mui/material'
import { flightdata } from 'types/interfaces';
import Form from './form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faEye } from '@fortawesome/free-solid-svg-icons';
type Props = {}

interface Row {
    id: string;
    date: string;
    fullname: string,
    email: string,
    approved: boolean,
    approvaldate: string
  }
 

export default function Submissions({}: Props) {

    
    const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
    const [modalData, setModalData] = React.useState<flightdata | null | undefined>()

    const [searchQuery, setSearchQuery] = React.useState('');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5); // You can adjust the number of rows per page here
    const [orderBy, setOrderBy] = React.useState<keyof Row>('id');
    const [order, setOrder] = React.useState<'asc' | 'desc'>('asc');
    const [rows, setrow] = React.useState<flightdata[]>([])

    React.useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'submission'), (snapshot) => {
          const newData: flightdata[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data()
            newData.push({
                fullname: data.fullname,
                email: data.email,
                date: data.date,
                time: data.time,
                origin: data.origin,
                //aircraft
                aircraftid: data.aircraftid,
                numberofaircraft: data.numberofaircraft,
                aircraftype: data.aircraftype,
                aircraftcolor: data.aircraftcolor,
                //flight
                flightrule: data.flightrule,
                flighttype: data.flighttype,
                flighttime: data.flighttime,
                flightlevel: data.flightlevel,
                timelapse: data.timelapse,
                departureaerodrome: data.departureaerodrome,
                destinationaerodrome: data.destinationaerodrome,
                alternateaerodrome: data.alternateaerodrome,
                alternateaerodrome2: data.alternateaerodrome2,
                cruising: data.cruising,
                route: data.route,
                piolotincommand: data.piolotincommand,
            
                endurance: data.endurance,
            
                turbulencecat: data.turbulencecat,
                equipments: data.equipments,
                survival: data.survival,
                emergencyradio: data.emergencyradio,
            
                persons: data.persons,
                personsCollection: data.personsCollection,
                remarks: data.remarks,
                id: data.id,
                active: data.active,
                other: data.other,
                approved: data.approved,
                approvaldate: data.approvaldate,
                addresses: data.addresses,
                address: data.address,
            })
          });
          setrow(newData);
        });
    
        return () => unsubscribe();
      }, []);
    const handleRequestSort = (property: keyof Row) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrderBy(property);
      setOrder(isAsc ? 'desc' : 'asc');
    };
  
    const handleChangePage = (event: unknown, newPage: number) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };
  
    const filteredRows = rows.filter(row =>
      row.date?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.id?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    const sortedRows = filteredRows.sort((a, b) => {
      const isAsc = order === 'asc';
      if (a[orderBy] < b[orderBy]) return isAsc ? -1 : 1;
      if (a[orderBy] > b[orderBy]) return isAsc ? 1 : -1;
      return 0;
    });

    const handleView = (item: flightdata) => {
        setIsModalOpen(true)
        setModalData(item)
    }

  return (
    <div className='container'>
        <div style = {{flexDirection: 'column', marginLeft: 300, display: 'flex',width: '100%', height: '100vh', justifyContent: 'center', alignItems: 'flex-start'}}>
        <h1>Submission List</h1>
        <TextField
          label="Search"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginBottom: 20, width: '30%', backgroundColor: '#fff', borderRadius: 5 }}
          placeholder='Search Table'
        />
        <TableContainer component={Paper} elevation={3} sx={{width: '96%'}}>
        <Table>
            <TableHead sx={{backgroundColor: '#1560BD'}}>
              <TableRow>
              <TableCell>
                  <TableSortLabel
                    className='headerCell'
                     style={{
                      color: orderBy === 'date' ? 'skyblue' : '#fff'
                    }}
                    active={orderBy === 'date'}
                    direction={orderBy === 'date' ? order : 'asc'}
                    onClick={() => handleRequestSort('date')}
                  >
                    Date
                  </TableSortLabel>
            </TableCell>
              <TableCell>
                  <TableSortLabel
                    className='headerCell'
                     style={{
                      color: orderBy === 'fullname' ? 'skyblue' : '#fff'
                    }}
                    active={orderBy === 'fullname'}
                    direction={orderBy === 'fullname' ? order : 'asc'}
                    onClick={() => handleRequestSort('fullname')}
                    
                  >
                    Full Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    className='headerCell'
                    style={{
                      color: orderBy === 'email' ? 'skyblue' : '#fff'
                    }}
                    active={orderBy === 'email'}
                    direction={orderBy === 'email' ? order : 'asc'}
                    onClick={() => handleRequestSort('email')}
                  >
                    Email
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                   className='headerCell'
                    style={{
                      color: orderBy === 'id' ? 'skyblue' : '#fff'
                    }}
                    active={orderBy === 'id'}
                    direction={orderBy === 'id' ? order : 'asc'}
                    onClick={() => handleRequestSort('id')}
                  >
                    Reference ID.
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                   className='headerCell'
                    style={{
                    color: orderBy === 'approved' ? 'skyblue' : '#fff'
                    }}
                    active={orderBy === 'approved'}
                    direction={orderBy === 'approved' ? order : 'asc'}
                    onClick={() => handleRequestSort('approved')}
                  >
                    Review
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    className='headerCell'
                    active={orderBy === 'approvaldate'}
                    direction={orderBy === 'approvaldate' ? order : 'asc'}
                    onClick={() => handleRequestSort('approvaldate')}
                    style={{
                      color: orderBy === 'approvaldate' ? 'skyblue' : '#fff'
                    }}
                  >
                    Review Date
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                <TableSortLabel 
                  disabled  
                  className='headerCell'
                >
                  Action
                </TableSortLabel>
                 
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : sortedRows
              ).map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.fullname}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.id}</TableCell>
                  <TableCell className={row.approved ? 'approvedCell' : 'deniedCell'}>{row.approved || 'For Review'}</TableCell>
                  <TableCell>{row.approvaldate ? row.approvaldate : 'For Review'}</TableCell>
                  <TableCell sx={{cursor: 'pointer'}} onClick={() => handleView(row)}>
                  <FontAwesomeIcon icon={faEye} width={50} height={50} />
                  </TableCell> 
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div style={{justifyContent: 'flex-start', alignItems: 'flex-start', display: 'flex' }}> {/* Adjust margin as needed */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]} // You can adjust the options here
              component="div"
              count={sortedRows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>
        </TableContainer>
        </div>
        <Modal
            component={'feDropShadow'}
            open = {isModalOpen}
            onClose={() => setModalData(null)}
            sx={{overflowY: 'scroll'}}
            
        >
            <div>
                <Form onClick={() => setIsModalOpen(false)} data={modalData}/>
            <FontAwesomeIcon onClick={() => setIsModalOpen(false)} icon={faClose} style={{color: '#fff', position: 'absolute', top: 20, right: 20, cursor: 'pointer', width: 25, height: 25}} />
            </div>
        </Modal>
    </div>
  )
}