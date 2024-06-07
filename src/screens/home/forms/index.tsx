import { Alert, AlertColor, Button, ButtonBase, Card, CardContent, CardMedia, Divider, FormHelperText, Icon, MenuItem, Modal, Select, Stack, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import FormHeader from 'screens/components/FormHeader'
import { flightrules, survival } from './arrays'
import { keyboardOptions } from '@testing-library/user-event/dist/keyboard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose } from '@fortawesome/free-solid-svg-icons'
import { disabledform, flightdata } from 'types/interfaces'
import { fetchDisabledForm, generateRandomKey } from '../../../firebase/function'
import {addDoc, doc, setDoc,getDocs, collection} from '@firebase/firestore'
import {db} from '../../../firebase/index'
import { AlertProps } from 'react-bootstrap'
import currentUser from 'global/redux/reducers/userReducer'
import { AuthContext } from 'auth'
import { control } from 'leaflet'
import { Link, useNavigate } from 'react-router-dom'
import emailjs from '@emailjs/browser';

type Props = {}

interface status {
	approved: string,
	approvaldate: string,
	id: string,
}

export default function Form({}: Props) {

	const  {currentUser} = React.useContext(AuthContext);
	const [disableText, setDisableText] = useState<string>('');
	const [disableDate, setDisableDate] = useState<string>('');

	const [isDisable, setIsDisable] = useState<boolean>(false)
	const [success, setsuccess] = useState<boolean>(false)
	const [openmodal, setopenmodal] = useState<boolean>(false)
	const [opensuccess, setopensuccess] = useState(false)
	const [variant, setvariant] = useState<AlertColor | undefined>('success')
	const [alertmessage, setalertmessage] = useState('')
	const [submitted, setsubmitted] = useState<boolean>(false)
	const [id, setid] = useState<string>('')
	const [idcheck, setidcheck] = useState<string>('')
	const [form, setform] = useState<flightdata[]>([{
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
	const [ipAddress, setIpAddress] = React.useState('');
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
      const fetchIpAddress = async () => {
        try {
          const response = await fetch('https://api.ipify.org?format=json');
          const data = await response.json();
          setIpAddress(data.ip);
        } catch (error) {
          console.error('Error fetching IP address:', error);
        }
      };

      fetchIpAddress();
    }, []);

	const fetchDisable = async() => {
		const result: disabledform[] = await fetchDisabledForm() || [];
		const objectResult = result[0];
		console.log(objectResult)
		if(result.length > 0){
		setIsDisable(objectResult.disabled)
		setDisableText(objectResult.text)
		setDisableDate(objectResult.date)
		return objectResult.disabled
		} else {
			setIsDisable(objectResult.disabled)
			return false
		}

	}

	const submit = async() => {
		setsubmitted(true)
		
		const disabled =  await fetchDisable()
		console.log('ey')
		if(!disabled){
			const {

				fullname,email,date,time,origin,
				aircraftid,numberofaircraft,aircraftype,aircraftcolor,
				flightrule,flighttype,flighttime,flightlevel,timelapse,	departureaerodrome,	destinationaerodrome,
				alternateaerodrome,alternateaerodrome2,cruising,route,piolotincommand,endurance,	turbulencecat,
				equipments,survival,emergencyradio,	personsCollection,remarks,active,other, approved, addresses
			
			} = form[0]
			console.log(form[0])
			if (
				fullname.length === 0 ||
				email.length === 0 ||
				origin.length === 0 ||
				aircraftid.length === 0 ||
				numberofaircraft === 0 ||
				aircraftype.length === 0 ||
				aircraftcolor.length === 0 ||
				flightrule.length === 0 ||
				flighttype.length === 0 ||
				flighttime.length === 0 ||
				flightlevel.length === 0 ||
				timelapse.length === 0 ||
				departureaerodrome.length === 0 ||
				destinationaerodrome.length === 0 ||
				alternateaerodrome.length === 0 ||
				alternateaerodrome2.length === 0 ||
				cruising.length === 0 ||
				route.length === 0 ||
				piolotincommand.length === 0 ||
				endurance.length === 0 ||
				turbulencecat.length === 0 ||
				equipments.length === 0 ||
				survival.length === 0 ||
				emergencyradio.length === 0 ||
				personsCollection.length === 0 || 
				addresses.length === 0
			) {
						setsuccess(true)
						setvariant('warning')
						setalertmessage('NOTE: Please note that all fields are required and must not be empty')
						window.scrollTo({
							top: 0,
							behavior: 'smooth' 
						});
				return;
			}
			try {
				const id = generateRandomKey(10)
				setid(id)
				const collectionRef = doc(db, 'submission',id)
				const formData = {
					fullname:fullname,
					email:email,
					date:date,
					time: time,
					origin:origin,
					//aircraft
					aircraftid:aircraftid,
					numberofaircraft:numberofaircraft,
					aircraftype:aircraftype,
					aircraftcolor:aircraftcolor,
					//flight
					flightrule:flightrule,
					flighttype:flighttype,
					flighttime:flighttime,
					flightlevel:flightlevel,
					timelapse:timelapse,
					departureaerodrome:departureaerodrome,
					destinationaerodrome:destinationaerodrome,
					alternateaerodrome:alternateaerodrome,
					alternateaerodrome2:alternateaerodrome2,
					cruising:cruising,
					route:route,
					piolotincommand:piolotincommand,
					endurance:endurance,
					turbulencecat:turbulencecat,
					equipments:equipments,
					survival: survival,
					emergencyradio: emergencyradio,
					personsCollection: personsCollection,
					remarks: remarks,
					active: active,
					other: other,
					id: id,
					approved: false,
					approvaldate: 'for review',
					ipAddress: ipAddress,
					addresses: addresses,
				}
				await setDoc(collectionRef, formData).then(() => {
					setsuccess(true)
					setopensuccess(true)
					setvariant('success')
					sendNotification();
					setalertmessage('SUCCESS: Form submitted Successfully')
					window.scrollTo({
						top: 0,
						behavior: 'smooth'
					});
					setsubmitted(false)
					setform([{
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
						approvaldate: 'for review',
						addresses: [],
						address: '',
						
					}])
				})
			} catch (error) {
				  setsuccess(true)
					setvariant('warning')
					setalertmessage('WARNING: Something went wrong, please contact your administrator if warning persist')
					window.scrollTo({
						top: 0,
						behavior: 'smooth'
					});
			}
		} else {
			setIsDisable(true)
			return
		}
	}

	React.useEffect(() => {
		fetchDisable()
	},[])


	const handleAddClick = (e: any) => {
		e.preventDefault()
        if (form[0].persons.length > 0) {
            setform(prevForm => [{
                ...prevForm[0],
                personsCollection: [...prevForm[0].personsCollection, prevForm[0].persons]
            }]);
            setform(prevForm => [{ ...prevForm[0], persons: '' }]);
        }
    };
	const handleAddClickAddress = (e: any) => {
		e.preventDefault()
		if(form[0].addresses.length > 	4) {
		 alert('Limit is 5 Address')
		 return
		} else {
		 	if (form[0].address.length > 0) {
				setform(prevForm => [{
						...prevForm[0],
						addresses: [...prevForm[0].addresses, prevForm[0].address]
				}]);
				setform(prevForm => [{ ...prevForm[0], address: '' }]);
		 	}
	 	}
		};

		const [idstatus, setidstatus] = React.useState<string>('')
		const [submitstatus, setsubmittstatus] = React.useState<boolean>(false)
		const [data, setdata] = React.useState<status[]>([{
			id: '',
			approvaldate: 'for review',
			approved: '',
		}])
		const [openstatus, setopenstatus] = React.useState<boolean>(false)
		const navigate = useNavigate()
	
		const submitCheck = async() => {
			console.log('wtf')
			try {
				setsubmittstatus(true)
				if(idstatus.length === 0){
					console.log('luh')
					return
				}
				const collectionRef = await getDocs(collection(db, 'submission'))
				const thisdata: status[] = []
				collectionRef.forEach((doc) => {
					const data = doc.data()
					if(data.id == idstatus){
					thisdata.push({
						id: data.id,
						approved: data.approved,
						approvaldate: data.approvaldate,
					})
						console.log(thisdata)
						setdata(thisdata)
					}
	
					console.log(thisdata)
				})
	
			} catch(error) {
				console.log(error)
			}
	
		}

		const [statuscheck,setstatuscheck] = useState<flightdata | null>()

		const submitDataCheck = async() => {
	
			try {
				setsubmittstatus(true)
				if(idcheck.length === 0){
					return
				}
				const collectionRef = await getDocs(collection(db, 'submission'))
				const thisdata: flightdata[] = []
				collectionRef.forEach((doc) => {
					const data = doc.data() as flightdata
					if(data.id == idcheck){
					thisdata.push(data)
						setstatuscheck(thisdata[0])
						navigate(`/checkstatus/${idcheck}`)
					} else {
						setstatuscheck(null)
						return
					}
	
					console.log(thisdata)
				})
	
			} catch(error) {
				console.log(error)
			}
	
		}

	const sendNotification = async() => {
			emailjs.send('service_f53fyqh', 'template_8867uek', {
				to_email: form[0].email,
				to_name: form[0].fullname,
				message: `We have received your submission and is now under review. Here is your Reference ID: ${form[0].id} \nYou may check details of your submission through here: \n https://viqumo.online/submissions/${form[0].id}.`,
			}, '8p8UGI53tyVQkAYK2')
				.then((result) => {
				console.log(result.text);
				}, (error) => {
				console.log(error.text);
				});
		}
		
	

  return (
    <div className='container'>
				<div style = {{position: 'absolute', top: 20,  marginLeft: currentUser === null ? 0: 230}}>
				{isDisable && 
					<Alert severity='error' variant='standard'>NOTE: {disableDate} || {disableText}</Alert>
				}
				{success && (		
					<Alert severity={variant} variant='standard'>{alertmessage}</Alert>)
				}
				</div>
        {opensuccess ? (
					<div style = {{display: 'flex',width: currentUser === null ? '90%' : '50%', marginLeft: currentUser === null ? 0: 150, height: '100vh', justifyContent: 'center', alignItems: 'center',}}>
					<Card sx={{margin: 1, height: '75%', width: '100%', flexDirection: 'column', display: 'flex',}}>
					<CardContent sx={{ height: '100%', textAlign: 'center',width: '95%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
						<CardMedia 
							draggable = {false}
							sx={{ height: 130, width: 175, alignSelf: 'center', marginTop: 3}}
							title="green iguana"
							component="img"
							image={require('../../../assets/icons8-checkmark-500.png')}
						/>
							<h1>
								Successfully Submitted
							</h1>
							<h4 style = {{marginBlockStart: 0, marginBlockEnd: 0}}>Reference Number</h4>
							<h3>{id}</h3>
							<Stack justifyContent={'center'}  alignItems={'center'} direction="column" spacing={2} marginTop={2}>
							<Button sx={{backgroundColor: '#73c2fb', fontWeight: 'bold'}} onClick={() => setopensuccess(false)} disabled = {isDisable} variant='contained'>GO BACK</Button>
						</Stack>
						<p>Vidarsson Online</p>
						</CardContent>
					</Card>
					</div>
					) 
					: 
					(
					<>
					<Card sx={{margin: 1, width: 800, flexDirection: 'column', display: 'flex',  marginLeft: currentUser?.email == null ? 1 : 30 }}>
					<br/>
					<CardMedia 
						draggable = {false}
						sx={{ height: 200, width: 250, alignSelf: 'center'}}
						title="green iguana"
						component="img"
						image={'https://i.imgur.com/HZdBITp.png'}
					/>
					
					<CardContent sx = {{display: 'flex', flexDirection: 'column'}}>
						{currentUser == null && <Stack sx={{display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
							<Button 
							onClick={() => setopenmodal(true)}
							style = {{fontFamily: 'Montserrat', textDecoration: 'none', cursor: 'pointer',  justifyContent: 'flex-start'}} 
							>Check submission details
							</Button>
								<Button 
								onClick={() => setopenstatus(true)}
								style = {{fontFamily: 'Montserrat', textDecoration: 'none', cursor: 'pointer', justifyContent: 'flex-start'}} 
								>Check submission status
								</Button>
								</Stack>
						}
						<h1>International Flight Plan</h1>
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
								<FormHeader inputLabel = 'Addresses (5) (Click Add to include)' />
								<Stack direction="row" sx={{justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
								<TextField
										sx={{width: '100%'}}
										type='text'
										variant='standard'
										value = {form[0].address}
										placeholder='Enter Address'
										onChange={(e) => setform((prev) => [
											{
												...prev[0],
												address: e.target.value,
											},
										])}
										
										disabled = {isDisable}
										error = {submitted && form[0].addresses.length === 0}
										helperText = {submitted && form[0].addresses.length === 0 && 'Field must not be empty'}
								/>
								{form[0].address.length > 0 && <Button onClick={handleAddClickAddress} sx={{width: '20%', marginLeft: 2}}>Add</Button>}
								</Stack>
						</Stack>
						<br/>	
						{form[0].addresses.length > 0 && 
							<Card>
								<CardContent>
									{form[0].addresses && form[0].addresses.map((item, index) =>(
										<>
										<h4 style = {{marginTop: 0}}>Addresses</h4>
										<Stack direction={'row'} sx={{alignItems: 'center', width: '100%', justifyContent:'space-between'}}>
										
										<Typography key={index}>
										{`${index + 1} -	${item}`}
										</Typography>
										<FontAwesomeIcon 
											onClick={() => {
												setform(prevForm => {
													const updatedPersonsCollection = prevForm[0].addresses.filter((_, i) => i !== index);
													return [{ ...prevForm[0], addresses: updatedPersonsCollection }];
												});
											}}
											color='red'
											icon={faClose} 
										/>
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
										disabled = {isDisable}
										error = {submitted && form[0].origin.length === 0}
										helperText = {submitted && form[0].origin.length === 0 && 'Field must not be empty'}
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
											disabled = {isDisable}
											error = {submitted && form[0].aircraftid.length === 0}
											helperText = {submitted && form[0].aircraftid.length === 0 && 'Field must not be empty'}
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
										disabled={isDisable}
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
										disabled = {isDisable}
										style={{ maxWidth: 200, maxHeight: 55 }}
										error = {submitted && form[0].flighttype.length === 0}
											helperText = {submitted && form[0].flighttype.length === 0 && 'Field must not be empty'}
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
												disabled = {isDisable}
												error = {submitted && form[0].numberofaircraft === 0}
												helperText = {submitted && form[0].numberofaircraft === 0 && 'Field must not be empty'}
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
											disabled = {isDisable}
											error = {submitted && form[0].aircraftype.length === 0}
											helperText = {submitted && form[0].aircraftype.length === 0 && 'Field must not be empty'}
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
											disabled = {isDisable}
											error = {submitted && form[0].turbulencecat.length === 0}
											helperText = {submitted && form[0].turbulencecat.length === 0 && 'Field must not be empty'}
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
										disabled = {isDisable}
										error = {submitted && form[0].equipments.length === 0}
											helperText = {submitted && form[0].equipments.length === 0 && 'Field must not be empty'}
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
										disabled = {isDisable}
										error = {submitted && form[0].departureaerodrome.length === 0}
										helperText = {submitted && form[0].departureaerodrome.length === 0 && 'Field must not be empty'}
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
										disabled = {isDisable}
										error = {submitted && form[0].flighttime.length === 0}
										helperText = {submitted && form[0].flighttime.length === 0 && 'Field must not be empty'}
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
											disabled = {isDisable}
											value={form[0].cruising}
											placeholder='Enter Cruising Speed'
											onChange = {(e) => setform((prev) => [{
												...prev[0],
												cruising: e.target.value
											}])}
											error = {submitted && form[0].cruising.length === 0}
											helperText = {submitted && form[0].cruising.length === 0 && 'Field must not be empty'}
									/>
							</Stack>
							<Stack direction="column" spacing={2} marginTop={2}>
									<FormHeader inputLabel = 'Level of Flight' />
									<TextField
											sx={{width: '100%'}}
											type='text'
										variant='standard'
											disabled = {isDisable}
											value={form[0].flightlevel}
											placeholder='Enter Level of Flight'
											onChange = {(e) => setform((prev) => [{
												...prev[0],
												flightlevel: e.target.value
											}])}
											error = {submitted && form[0].flightlevel.length === 0}
											helperText = {submitted && form[0].flightlevel.length === 0 && 'Field must not be empty'}
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
											disabled = {isDisable}
											error = {submitted && form[0].route.length === 0}
											helperText = {submitted && form[0].route.length === 0 && 'Field must not be empty'}
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
											disabled = {isDisable}
											error = {submitted && form[0].destinationaerodrome.length === 0}
												helperText = {submitted && form[0].destinationaerodrome.length === 0 && 'Field must not be empty'}
									/>
							</Stack>
							<Stack direction="column" spacing={2} marginTop={2}>
								<FormHeader inputLabel = 'Estimated Elapse Time' />
								<TextField
										sx={{width: '100%'}}
										variant='standard'
										disabled = {isDisable}
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
										error = {submitted && form[0].timelapse.length === 0}
											helperText = {submitted && form[0].timelapse.length === 0 && 'Field must not be empty'}
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
										disabled = {isDisable}
										error = {submitted && form[0].alternateaerodrome.length === 0}
										helperText = {submitted && form[0].alternateaerodrome.length === 0 && 'Field must not be empty'}
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
										disabled = {isDisable}
										error = {submitted && form[0].alternateaerodrome2.length === 0}
										helperText = {submitted && form[0].alternateaerodrome2.length === 0 && 'Field must not be empty'}
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
										disabled = {isDisable}
										error = {submitted && form[0].other.length === 0}
										helperText = {submitted && form[0].other.length === 0 && 'Field must not be empty'}
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
										disabled = {isDisable}
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
										error = {submitted && form[0].endurance.length === 0}
											helperText = {submitted && form[0].endurance.length === 0 && 'Field must not be empty'}
								/>
							</Stack>
							<Stack direction="column" spacing={2} marginTop={2}>
									<FormHeader inputLabel = 'Persons Onboard (Click Add to include)' />
									<Stack direction="row">
									<TextField
											sx={{width: '100%'}}
											type='text'
										variant='standard'
											value={form[0].persons}
											placeholder='Enter Persons Onboard'
											onChange = {(e) => setform((prev) => [{
												...prev[0],
												persons: e.target.value
											}])}
											inputMode='text'
											disabled = {isDisable}
											inputRef={inputRef}
											error = {submitted && form[0].personsCollection.length === 0}
											helperText = {submitted && form[0].personsCollection.length === 0 && 'Field must not be empty'}
									/>
									{form[0].persons.length > 0 && <Button onClick={handleAddClick} sx={{width: '20%'}}>Add</Button>}
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
										disabled = {isDisable}
										error = {submitted && form[0].emergencyradio.length === 0}
											helperText = {submitted && form[0].emergencyradio.length === 0 && 'Field must not be empty'}
								/>
							</Stack>
						</Stack>
						{form[0].personsCollection.length > 0 && 
								<Card>
									<CardContent>
										<h5 style = {{marginTop: 0}}>Persons On Board</h5>
										{form[0].personsCollection && form[0].personsCollection.map((item, index) =>(
											<Stack direction={'row'} sx={{alignItems: 'center', width: '100%', justifyContent:'space-between'}}>
											<Typography key={index}>
											{`${index + 1} -	${item}`}
											</Typography>
											<FontAwesomeIcon 
												onClick={() => {
													setform(prevForm => {
														const updatedPersonsCollection = prevForm[0].personsCollection.filter((_, i) => i !== index);
														return [{ ...prevForm[0], personsCollection: updatedPersonsCollection }];
													});
												}}
												color='red'
												icon={faClose} 
											/>
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
											disabled = {isDisable}
											error = {submitted && form[0].aircraftcolor.length === 0}
											helperText = {submitted && form[0].aircraftcolor.length === 0 && 'Field must not be empty'}
									/>
							</Stack>
							<Stack direction="column" spacing={2} marginTop={2}>
								<FormHeader inputLabel = 'Survival Equipment' />
								<Select
										disabled = {isDisable}
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
										disabled = {isDisable}
										error = {submitted && form[0].remarks.length === 0}
											helperText = {submitted && form[0].remarks.length === 0 && 'Field must not be empty'}
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
										disabled = {isDisable}
										error = {submitted && form[0].piolotincommand.length === 0}
											helperText = {submitted && form[0].piolotincommand.length === 0 && 'Field must not be empty'}
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
											disabled = {isDisable}
											error = {submitted && form[0].fullname.length === 0}
											helperText = {submitted && form[0].fullname.length === 0 && 'Field must not be empty'}
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
											disabled = {isDisable}
											onChange={(e) => setform((prev) => [
												{
													...prev[0],
													email: e.target.value,
												},
											])}
											error = {submitted && form[0].email.length === 0}
											helperText = {submitted && form[0].email.length === 0 && 'Field must not be empty'}
									/>
							</Stack>
						</Stack>
						<br/>
						<Divider />
						<br/>
						<Stack justifyContent={'center'}  alignItems={'center'} direction="column" spacing={2} marginTop={2}>
							<Button sx={{backgroundColor: '#73c2fb', fontWeight: 'bold'}} onClick={submit} disabled = {isDisable} fullWidth variant='contained'>SUBMIT</Button>
						</Stack>
					</CardContent>
        </Card>
				</>
		)}
		<Modal
			open={openmodal}
			onClose={() => setopenmodal(false)}
			sx={{ width: '100%', display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}
		>
			<div style = {{display: 'flex',width: '100%', marginLeft: 0, height: '100vh', justifyContent: 'center', alignItems: 'center',}}>
    		<Card sx={{margin: 3, width: 700, flexDirection: 'column', display: 'flex',}}>
					<CardContent>
						<Stack sx={{width: '100%', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}} direction="column" spacing={2} marginTop={2}>
								<h1>Check Submission Details</h1>
								<p>Please enter your Reference ID to check your submission details</p>
								<br/>
								<TextField
										sx={{width: '100%'}}
										type='text'
										label = 'Reference ID'
										value = {idcheck}
										variant='outlined'
										onChange={(e) => setidcheck(e.target.value)}
										error = {submitstatus && idcheck.length === 0}
										helperText = {submitstatus && idcheck.length === 0 && 'Field must not be empty'}
								/>
								<Button disabled = {!idcheck} onClick={submitDataCheck} variant='contained' >Check Submission</Button>
								{submitstatus && statuscheck ==  null && <Alert severity='warning'>Reference ID not found</Alert>}
						</Stack>
					</CardContent>
				</Card>
				<FontAwesomeIcon onClick={() => setopenmodal(false)} icon={faClose} style={{color: '#fff', position: 'absolute', top: 20, right: 20, cursor: 'pointer', width: 25, height: 25}} />

			</div>
		</Modal>
		<Modal
			open={openstatus}
			onClose={() => setopenstatus(false)}
			sx={{ width: '100%', display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}
				>
		<div style = {{display: 'flex',width: '100%', marginLeft: 0, height: '100vh', justifyContent: 'center', alignItems: 'center',}}>
    		<Card sx={{margin: 3, width: 700, flexDirection: 'column', display: 'flex',}}>
					<CardContent>
						<Stack sx={{width: '100%', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}} direction="column" spacing={2} marginTop={2}>
								<h1>Check Submission Status</h1>
								<p>Please enter your Reference ID to check your submission status</p>
								<br/>
								<TextField
										sx={{width: '100%'}}
										type='text'
										label = 'Reference ID'
										value = {idstatus}
										variant='outlined'
										onChange={(e) => setidstatus(e.target.value)}
										error = {submitstatus && idstatus.length === 0}
										helperText = {submitstatus && idstatus.length === 0 && 'Field must not be empty'}
								/>
								<Button disabled = {!idstatus} onClick={submitCheck} variant='contained' >Check Status</Button>
							{submitstatus && data.length === 0 && data[0].approved === '' && <Alert severity='warning'>Reference ID not found</Alert>}
							{submitstatus && data[0].approved === 'Approved' && <Alert severity='success'>Submission Approved</Alert>}
							{submitstatus && data[0].approved === 'Approved landing' && <Alert severity='success'>Submission Approved Landing</Alert>}
							{submitstatus && data[0].approved === 'Approved departure' && <Alert severity='success'>Submission Approved Departure</Alert>}
							{submitstatus && data[0].approved === 'For Review' && <Alert severity='info'>Submission under Review</Alert>}
							{submitstatus && data[0].approved === 'Denied' && <Alert severity='error'>Submission Denied</Alert>}
							{submitstatus && data[0].approved === 'Cancelled' && <Alert severity='warning'>Submission Cancelled</Alert>}

							{submitstatus && data[0].approved !== 'For Review' && <p>Reviewed on {data[0].approvaldate}</p>}
						</Stack>
					</CardContent>
				</Card>
				<FontAwesomeIcon onClick={() => setopenstatus(false)} icon={faClose} style={{color: '#fff', position: 'absolute', top: 20, right: 20, cursor: 'pointer', width: 25, height: 25}} />
    	</div>
			</Modal>
    </div>
  )
}