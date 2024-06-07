import { Alert, Button, Card, CardContent, CardMedia, Divider, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import { AuthContext } from 'auth'
import {collection, onSnapshot } from '@firebase/firestore'
import { db } from '../../../firebase/index'
import currentUser from 'global/redux/reducers/userReducer'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import FormHeader from 'screens/components/FormHeader'
import { flightdata } from 'types/interfaces'
import { flightrules, survival } from '../forms/arrays'
import { fetchFlightStatusData } from '../../../firebase/function'



interface Params {
  userReferenceNumber?: string;
}

export default function Status() {
  
  const { userReferenceNumber } = useParams() as Params;
  const [referenceNumber, setReferenceNumber] = React.useState<string>('');
  const [nodata, setnodata] = React.useState<boolean>(false)
  const navigate = useNavigate()
    React.useEffect(() => {
      const fetchnow = async() => {
        
      if(userReferenceNumber){
        console.log(userReferenceNumber)
        const result: flightdata[] = await fetchFlightStatusData(userReferenceNumber) || []
        console.log(result)
        if(result.length > 0){
          setform(result)
        } else {
          navigate(`/error-status-check-id-does-not-exists/${userReferenceNumber}`)
        }
      }
      }
    fetchnow()
    }, [userReferenceNumber]);

    const [form, setform] = React.useState<flightdata[]>([{
      fullname: '',
      email: '',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
      origin: '',
      //aircraft
      aircraftid: '',
      numberofaircraft: 0,
      aircraftype: '',
      aircraftcolor: '',
      //flight
      flightrule: 'Visual Flight Rules',
      flighttype: '',
      flighttime: '',
      flightlevel: '',
      timelapse: '',
      departureaerodrome: '',
      destinationaerodrome: '',
      alternateaerodrome: '',
      alternateaerodrome2: '',
      cruising: '',
      route: '',
      piolotincommand: '',
  
      endurance: '',
  
      turbulencecat: '',
      equipments: '',
      survival: 'Polar',
      emergencyradio: '',
  
      persons: '',
      personsCollection: [],
      remarks: '',
      id: '',
      active: true,
      other: '',
      approved: '',
      approvaldate: '',
  
      address: '',
      addresses: [],
  
    }])

  
    return (
      <div className='container'>
        <Card sx={{margin: 1, width: 800, flexDirection: 'column', display: 'flex',}}>
        <CardContent sx = {{display: 'flex', flexDirection: 'column'}}>
        <br/>
					<CardMedia 
						draggable = {false}
						sx={{ height: 200, width: 250, alignSelf: 'center'}}
						title="green iguana"
						component="img"
						image={'https://i.imgur.com/HZdBITp.png'}
					/>
          <h1>International Flight Plan</h1>
          
							{form && form[0].approved === 'Approved' && <Alert severity='success'>Submission Approved</Alert>}
							{form && form[0].approved === 'Approved landing' && <Alert  severity='success'>Submission Approved Landing</Alert>}
							{form && form[0].approved === 'Approved departure' && <Alert  severity='success'>Submission Approved Departure</Alert>}
							{form && form[0].approved === 'For Review' && <Alert severity='info'>Submission under Review</Alert>}
							{form && form[0].approved === 'Denied' && <Alert severity='error'>Submission Denied, for more info please contact admin@viqumo.online</Alert>}
							{form && form[0].approved === 'Cancelled' && <Alert severity='warning'>Submission Cancelled</Alert>}
          <h4>Reference ID: {form[0].id}</h4>

						<Stack direction="column" spacing={2} marginTop={2}>
								<Stack direction="column" spacing={2} marginTop={2}>
								<FormHeader inputLabel = 'Time and Date of Filing' />
									<Stack direction="row" spacing={2} marginTop={2}>
										<TextField
												sx={{width: '100%'}}
												type='date'
												value = {form[0].date}
												disabled
												variant='standard'
												
										/>
										<TextField
												sx={{width: '100%'}}
												type='text'
												variant='standard'
												value={form[0].time}
												disabled
										/>
									</Stack>
								</Stack>
						</Stack>
						<br/>	
						{form[0].addresses?.length > 0 && 
							<Card>
								<CardContent>
									{form[0].addresses && form[0].addresses.map((item, index) =>(
										<>
										<h4 style = {{marginTop: 0}}>Addresses</h4>
										<Stack direction={'row'} sx={{alignItems: 'center', width: '100%', justifyContent:'space-between'}}>
										
										<Typography key={index}>
										{`${index + 1} -	${item}`}
										</Typography>
										</Stack>
										</>
									))}
									</CardContent>
								</Card>
						}
						<Stack direction="column" spacing={2} marginTop={2}>
								<FormHeader inputLabel = 'Originator' />
								<TextField
										sx={{width: '100%'}}
										type='text'
										variant='standard'
										placeholder='Enter Originator'
										value={form[0].origin}
										onChange={(e) => setform((prev) => [
											{
												...prev[0],
												origin: e.target.value,
											},
										])}
										disabled = {true}
								/>
						</Stack>
						<Divider />
						<br/>
						<Stack direction="row" spacing={2} marginTop={2}>
							<Stack sx={{width: '50%'}}	 direction="column" spacing={2} marginTop={2}>
									<FormHeader inputLabel = 'Aircraft Identification' />
									<TextField
											sx={{width: '100%'}}
											type='text'
										variant='standard'
											placeholder='Enter Aircraft Identification'
											value={form[0].aircraftid}
											onChange={(e) => setform((prev) => [
												{
													...prev[0],
													aircraftid: e.target.value,
												},
											])}
											disabled = {true}
									/>
							</Stack>
							<Stack direction="column" spacing={2} marginTop={2}>
								<FormHeader inputLabel='Flight Rules' />
								<Select
										onChange={(e) =>
												setform((prev) => [
														{
																...prev[0],
																flightrule: e.target.value,
														},
												])
										}
										value={form[0].flightrule}
										sx={{ width: '100%' }}
										type="text"
										variant='standard'
										disabled={true}
										// Add the following style to set a fixed width for the Select component
										style={{ maxWidth: 150, maxHeight: 55 }}
								>
										{flightrules.map((item, index) => (
												<MenuItem value={item} key={index}>
														{item}
												</MenuItem>
										))}
								</Select>
							</Stack>
							<Stack direction="column" spacing={2} marginTop={2}>
								<FormHeader inputLabel = 'Type of Flight' />
								<TextField
										sx={{width: '100%'}}
										type='text'
										variant='standard'
										placeholder='Enter Type of Flight'
										onChange={(e) => setform((prev) => [
											{
												...prev[0],
												flighttype: e.target.value,
											},
										])} 
										value={form[0].flighttype}
										disabled = {true}
										style={{ maxWidth: 200, maxHeight: 55 }}
								/>
							</Stack>
						</Stack>
						<Stack direction="row" spacing={2} marginTop={2}>
							<Stack sx ={{width: '50%'}} direction="column" spacing={2} marginTop={2}>
										<FormHeader inputLabel = 'Number of Aircraft' />
										<TextField
												sx={{width: '100%'}}
												type='number'
												placeholder='Number of Aircraft'
												onChange={(e) => setform((prev) => [
													{
														...prev[0],
														numberofaircraft: parseInt(e.target.value, 10),
													},
												])}
												variant='standard'
												value={form[0].numberofaircraft}
												disabled = {true}
												
										/>
								</Stack>
							<Stack sx={{width: '50%'}} direction="column" spacing={2} marginTop={2}>
									<FormHeader inputLabel = 'Type of Aircraft' />
									<TextField
											sx={{width: '100%'}}
											type='text'
										variant='standard'
											placeholder='Enter Type of Aircraft'
											onChange={(e) => setform((prev) => [
												{
													...prev[0],
													aircraftype: e.target.value,
												},
											])} 
											value={form[0].aircraftype}
											disabled = {true}
									/>
							</Stack>
							<Stack direction="column" spacing={2} marginTop={2}>
									<FormHeader inputLabel = 'Wake Turbulence Category' />
									<TextField
											sx={{width: '100%'}}
											type='text'
										variant='standard'
											value={form[0].turbulencecat}
											placeholder='Enter Wake Turbulence Category'
											onChange = {(e) => setform((prev) => [{
												...prev[0],
												turbulencecat: e.target.value
											}])}
											disabled = {true}
									/>
							</Stack>
							<Stack direction="column" spacing={2} marginTop={2}>
								<FormHeader inputLabel = 'Equipment' />
								<TextField
										sx={{width: '100%'}}
										type='text'
										variant='standard'
										value={form[0].equipments}
										placeholder='Enter Equipment'
										onChange = {(e) => setform((prev) => [{
											...prev[0],
											equipments: e.target.value
										}])}
										disabled = {true}
								/>
							</Stack>
						</Stack>
						<Stack  direction="row" spacing={2} marginTop={2}>
							<Stack  sx={{width: '50%'}} direction="column" spacing={2} marginTop={2}>
								<FormHeader inputLabel = 'Departure Aerodrome' />
								<TextField
										sx={{width: '100%'}}
										type='text'
										variant='standard'
										value={form[0].departureaerodrome}
										placeholder='Enter Departure Aerodrome'
										onChange = {(e) => setform((prev) => [{
											...prev[0],
											departureaerodrome: e.target.value
										}])}
										disabled = {true}
								/>
							</Stack>
							<Stack direction="column" spacing={2} marginTop={2}>
								<FormHeader inputLabel = 'Time of Flight' />
								<TextField
										sx={{width: '100%'}}
										type='time'
										placeholder='Enter Time of Flight'
										value={form[0].flighttime}
										onChange = {(e) => setform((prev) => [{
											...prev[0],
											flighttime: e.target.value
										}])}
										variant='standard'
										disabled = {true}
								/>
							</Stack>
						</Stack>
						<Stack  direction="row" spacing={2} marginTop={2}>
							<Stack direction="column" spacing={2} marginTop={2}>
									<FormHeader inputLabel = 'Cruising Speed' />
									<TextField
											sx={{width: '100%'}}
											type='text'
										variant='standard'
											disabled = {true}
											value={form[0].cruising}
											placeholder='Enter Cruising Speed'
											onChange = {(e) => setform((prev) => [{
												...prev[0],
												cruising: e.target.value
											}])}
									/>
							</Stack>
							<Stack direction="column" spacing={2} marginTop={2}>
									<FormHeader inputLabel = 'Level of Flight' />
									<TextField
											sx={{width: '100%'}}
											type='text'
										variant='standard'
											disabled = {true}
											value={form[0].flightlevel}
											placeholder='Enter Level of Flight'
											onChange = {(e) => setform((prev) => [{
												...prev[0],
												flightlevel: e.target.value
											}])}
									/>
							</Stack>
							<Stack direction="column" spacing={2} marginTop={2}>
									<FormHeader inputLabel = 'Route' />
									<TextField
											sx={{width: '100%'}}
											type='text'
										variant='standard'
											value={form[0].route}
											placeholder='Enter Route'
											onChange = {(e) => setform((prev) => [{
												...prev[0],
												route: e.target.value
											}])}
											disabled = {true}
									/>
							</Stack>
							
						</Stack>
						<Stack direction="row" spacing={2} marginTop={2}>
							<Stack  sx={{width: '50%'}} direction="column" spacing={2} marginTop={2}>
									<FormHeader inputLabel = 'Destination Aerodrome' />
									<TextField
											sx={{width: '100%'}}
											type='text'
										variant='standard'
											value={form[0].destinationaerodrome}
											placeholder='Enter Destination Aerodrome'
											onChange = {(e) => setform((prev) => [{
												...prev[0],
												destinationaerodrome: e.target.value
											}])}
											disabled = {true}
									/>
							</Stack>
							<Stack direction="column" spacing={2} marginTop={2}>
								<FormHeader inputLabel = 'Estimated Elapse Time' />
								<TextField
										sx={{width: '100%'}}
										variant='standard'
										disabled = {true}
										value={form[0].timelapse}
										placeholder='Enter Elapse Time'
										onChange = {((e) => {
											const input = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
											const formattedInput = input
													.slice(0, 6) // Ensure maximum length is 6 characters
													.replace(/^(\d{2})(\d{2})?(\d{0,2})?/, '$1:$2:$3'); // Add colons
							
											setform((prevForm) => [{
													...prevForm[0],
													timelapse: formattedInput
											}]);
									})}
										inputProps={{
											maxLength: 8, // to limit the input length
											pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$', // to enforce the hh:mm:ss format
											title: 'Please enter time in hh:mm:ss format' // tooltip message for invalid input
										}}
								/>
						</Stack>
							<Stack  sx={{width: '50%'}} direction="column" spacing={2} marginTop={2}>
								<FormHeader inputLabel = 'Alternate Aerodrome' />
								<TextField
										sx={{width: '100%'}}
										type='text'
										variant='standard'
										value={form[0].alternateaerodrome}
										placeholder='Enter Alternate Aerodrome'
										onChange = {(e) => setform((prev) => [{
											...prev[0],
											alternateaerodrome: e.target.value
										}])}
										disabled = {true}
								/>
							</Stack>
							<Stack  sx={{width: '50%'}} direction="column" spacing={2} marginTop={2}>
								<FormHeader inputLabel = '2nd Alternate Aerodrome' />
								<TextField
										sx={{width: '100%'}}
										type='text'
										variant='standard'
										value={form[0].alternateaerodrome2}
										placeholder='Enter 2nd Alternate Aerodrome'
										onChange = {(e) => setform((prev) => [{
											...prev[0],
											alternateaerodrome2: e.target.value
										}])}
										disabled = {true}
								/>
							</Stack>
						</Stack>
						<Stack direction="column" spacing={2} marginTop={2}>
								<FormHeader inputLabel = 'Other Information( Date of Filing, Destination, Departure, and Remarks)' />
								<TextField
										sx={{width: '100%'}}
										type='text'
										variant='standard'
										value={form[0].other}
										placeholder='Enter Alternate Aerodrome'
										onChange = {(e) => setform((prev) => [{
											...prev[0],
											other: e.target.value
										}])}
										disabled = {true}
								/>
						</Stack>
						<br/>
						<Divider/>
						<h3>SUPPLEMENTARY INFORMATION(NOT TO BE TRANSMITTED IN FPL MESSAGES)</h3>
						<Stack sx ={{width: '100%'}} direction="row" spacing={2} marginTop={2}>
							<Stack direction="column" spacing={2} marginTop={2}>
								<FormHeader inputLabel = 'Endurance' />
								<TextField
										sx={{width: '100%'}}
										disabled = {true}
										value={form[0].endurance}
										placeholder='Enter Endurance'
										variant='standard'
										onChange = {((e) => {
											const input = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
											const formattedInput = input
													.slice(0, 6) // Ensure maximum length is 6 characters
													.replace(/^(\d{2})(\d{2})?(\d{0,2})?/, '$1:$2:$3'); // Add colons
							
											setform((prevForm) => [{
													...prevForm[0],
													endurance: formattedInput
											}]);
									})}
										inputProps={{
											maxLength: 8, // to limit the input length
											pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$', // to enforce the hh:mm:ss format
											title: 'Please enter time in hh:mm:ss format' // tooltip message for invalid input
										}}
								/>
							</Stack>
							</Stack>
							<Stack direction="column" spacing={2} marginTop={2}>
								<FormHeader inputLabel = 'Emergency Radio' />
								<TextField
										sx={{width: '100%'}}
										type='text'
										variant='standard'
										value={form[0].emergencyradio}
										placeholder='Enter Emergency Radio'
										onChange = {(e) => setform((prev) => [{
											...prev[0],
											emergencyradio: e.target.value
										}])}
										disabled = {true}
								/>
							</Stack>
              <br/>
						{form[0].personsCollection?.length > 0 && 
								<Card>
									<CardContent>
										<h5 style = {{marginTop: 0}}>Persons On Board</h5>
										{form[0].personsCollection && form[0].personsCollection.map((item, index) =>(
											<Stack direction={'row'} sx={{alignItems: 'center', width: '100%', justifyContent:'space-between'}}>
											<Typography key={index}>
											{`${index + 1} -	${item}`}
											</Typography>
											</Stack>
										))}
									</CardContent>
								</Card>
							}
						<Stack sx ={{width: '100%'}} direction="column" spacing={2} marginTop={2}>
									<FormHeader inputLabel = 'Aircraft Color and Markings' />
									<TextField
											sx={{width: '100%'}}
											type='text'
										variant='standard'
											value={form[0].aircraftcolor}
											placeholder='Enter Aircraft Color and Markings'
											onChange = {(e) => setform((prev) => [{
												...prev[0],
												aircraftcolor: e.target.value
											}])}
											disabled = {true}
									/>
							</Stack>
							<Stack direction="column" spacing={2} marginTop={2}>
								<FormHeader inputLabel = 'Survival Equipment' />
								<Select
										disabled = {true}
										onChange={(e) => setform((prev) => [
											{
												...prev[0],
												survival: e.target.value,
											},
										])} 
										value={form[0].survival}
										sx={{width: '100%'}}
										type='text'
										variant='standard'
										>
							
										{survival.map((item, index) => (
											<MenuItem value={item}>{item}</MenuItem>
										))}
								</Select>
							</Stack>
							<Stack direction="column" spacing={2} marginTop={2}>
								<FormHeader inputLabel = 'Remarks' />
								<TextField
										sx={{width: '100%'}}
										type='text'
										variant='standard'
										value={form[0].remarks}
										placeholder='Enter Remarks'
										onChange = {(e) => setform((prev) => [{
											...prev[0],
											remarks: e.target.value
										}])}
										disabled = {true}
								/>
						</Stack>
						<Stack direction="column" spacing={2} marginTop={2}>
								<FormHeader inputLabel = 'Pilot in Command' />
								<TextField
										sx={{width: '100%'}}
										type='text'
										variant='standard'
										value={form[0].piolotincommand}
										placeholder='Enter Pilot in Command'
										onChange = {(e) => setform((prev) => [{
											...prev[0],
											piolotincommand: e.target.value
										}])}
										disabled = {true}
								/>
						</Stack>
						<br/>
						<Divider />
						<Stack direction="row" spacing={2} marginTop={2}>
						<Stack sx={{width: '50%'}} direction="column" spacing={2} marginTop={2}>
							<FormHeader inputLabel = 'Full Name' required />
									<TextField
											sx={{width: '100%'}}
											type='text'
										variant='standard'
											value = {form[0].fullname}
											placeholder='Enter Full Name'
											onChange={(e) => setform((prev) => [
												{
													...prev[0],
													fullname: e.target.value,
												},
											])}
											disabled = {true}
									/>
							</Stack>
							<Stack sx={{width: '50%'}}  direction="column" spacing={2} marginTop={2}>
									<FormHeader inputLabel = 'Email' />
									<TextField
											sx={{width: '100%'}}
											type='text'
										variant='standard'
											placeholder='Enter Email'
											value={form[0].email}
											disabled = {true}
											onChange={(e) => setform((prev) => [
												{
													...prev[0],
													email: e.target.value,
												},
											])}
									/>
							</Stack>
						</Stack>
            <br/>
					</CardContent>
        </Card>
      </div>
    );
}