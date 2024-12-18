import { useCallback, useEffect, useMemo, useState } from 'react'
import './App.css'
import { Container, Button, Box, Modal, TextField, Typography, Stack, Select, MenuItem, SelectChangeEvent, FormControl, InputLabel, FormHelperText } from '@mui/material';

interface Person {
  name: string // default should be A,B,C
  shouldPay: number
  shouldReceive: number
  paid: boolean
}

interface BillItem {
  name: string // default should be item1, item2, item3
  price: number
  toSplit: boolean // the bill is splited or pay by one person 
  shdPayByName: string // default should be A // TODO: multiple people
}

interface BillItemError {
  name: string
  price: string
  shdPayByName: string
}

interface Bill {
  billItems: BillItem[]
  people: Person[]
  tax: number
  tips: number
  totalPrice: number
  finalPrice: number
  paidBy: Person // TODO: multiple people
  resolved: boolean
}

const modalBoxStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '75%',
  bgcolor: 'background.paper',
  border: '2px solid #555',
  boxShadow: 24,
  p: 4,
};

function App() {
  const [billItems, setBillItems] = useState<BillItem[]>([
    //dummy
    {
      name: 'Item 1',
      price: 10,
      shdPayByName: 'A',
      toSplit: false
    },
  ])
  const [people, setPeople] = useState<Person[]>([
    //dummy
    { name: 'A', shouldPay: 0, shouldReceive: 0, paid: false },
    { name: 'B', shouldPay: 0, shouldReceive: 0, paid: false },
  ])
  const [taxRate, setTaxRate] = useState<number>(0.13);
  const [discount, setDiscount] = useState<number>(0);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [bill, setBill] = useState<Bill>({ billItems: [], people: [], tax: 0, tips: 0, totalPrice: 0, finalPrice: 0, paidBy: people[0], resolved: false, })

  // Modal
  const [billItemModalOpen, setBillItemModalOpen] = useState<boolean>(false);
  const [tempBillItem, setTempBillItem] = useState<BillItem>({ name: `Item ${billItems.length + 1}`, price: 0, toSplit: false, shdPayByName: people[0].name });
  const [tempBillItemError, setTempBillItemError] = useState<BillItemError>({ name: '', price: '', shdPayByName: '' });
  const [finalPaymedntModalOpen, setFinalPaymentModalOpen] = useState<boolean>(false);
  const [tempFinalPrice, setTempFinalPrice] = useState<number>(0);
  const [personModalOpen, setPersonModalOpen] = useState<boolean>(false);
  const [tempPerson, setTempPerson] = useState<Person>({ name: '', shouldPay: 0, shouldReceive: 0, paid: false });

  // BILL ITEMS ACTIONS
  // handle add bill item
  const handleAddBillItem = () => {
    // validate tempBillItem
    let tempBillItemError = { name: '', price: '', shdPayByName: '' }
    if (!tempBillItem.name || tempBillItem.name === '') {
      tempBillItemError = { ...tempBillItemError, name: 'Name should not be empty' }
    }
    if (!tempBillItem.price || tempBillItem.price <= 0) {
      tempBillItemError = { ...tempBillItemError, price: 'Price should be greater than 0' }
    }
    if (tempBillItem.shdPayByName === undefined) {
      tempBillItemError = { ...tempBillItemError, shdPayByName: 'Paid by should not be empty' }
    }
    if (tempBillItemError.name !== '' || tempBillItemError.price !== '' || tempBillItemError.shdPayByName !== '') {
      setTempBillItemError(tempBillItemError)
    } else {
      setBillItems([...billItems, tempBillItem])
      setBillItemModalOpen(false)
    }
  }

  // handle delete bill item
  const handleDeleteBillItem = (billItem: BillItem) => {

  }
  // mark paid by person
  const handleMarkPaidPerson = (person: Person) => {

  }

  // FINAL PAYMENT Actions
  // handle final price change
  const handleUpdateFinalPrice = () => {
  }


  // PERSON Actions
  // handle add person
  const handleAddPerson = () => {
    const autogenName = String.fromCharCode(65 + people.length); // auto generate name A, B, C, D, ...
    const newPerson = { name: `${autogenName}`, shouldPay: 0, shouldReceive: 0, paid: false }
    setPeople([...people, newPerson])
  }
  // handle delete person
  const handleDeletePerson = (person: Person) => {

  }

  // handle rename person
  const handleRenamePerson = (person: Person, newName: string) => {

  }
  // handle person paid change
  const handlePaidChange = (person: Person) => {

  }

  // calculate split bills (including adding tax)
  const calculateSplitBills = () => {
    if (billItems.length === 0) {
      return
    }
    const total = billItems.map((billItem: BillItem) => billItem.price).reduce((a, b) => a + b)
    const tax = total * taxRate
    const tips = bill.tips
    const finalPrice = total + tax + tips
    setBill({ ...bill, tax: tax, totalPrice: total, finalPrice: finalPrice })

    const avgTax = tax / people.length
    const avgTips = tips / people.length
    // calculate people's shouldPay and shouldReceive
    // go through each item, calculate how much each person should pay
    const updatedPeople = people.map((person: Person) => {
      const shdPay = billItems.map((billItem: BillItem) => {
        console.log(billItem.shdPayByName === person.name)
        if (billItem.toSplit) {
          return billItem.price / people.length
        } else if (billItem.shdPayByName === person.name) {
          return billItem.price
        } else {
          return 0
        }
      }).reduce((a, b) => a + b) + avgTax + avgTips
      console.log(person.name, shdPay)
      if (person === bill.paidBy) {
        return { ...person, shouldPay: shdPay - finalPrice < 0 ? 0 : shdPay - finalPrice, shouldReceive: finalPrice - shdPay }
      } else {
        return { ...person, shouldPay: shdPay }
      }
    })
    console.log(updatedPeople)
    setPeople(updatedPeople)
  }

  useEffect(() => {
    calculateSplitBills()
  }, [billItems])

  // save the bill to local storage
  const saveBill = () => {

  }

  // MODAL Actions

  const handleBillItemModalOpen = () => {
    //reset tempBillItem
    setTempBillItem({ name: `Item ${billItems.length + 1}`, price: 0, toSplit: false, shdPayByName: people[0].name })
    setTempBillItemError({ name: '', price: '', shdPayByName: '' })
    setBillItemModalOpen(true)
  }

  const handleBillItemshdPayByNameChange = (event: SelectChangeEvent) => {
    // const selectedPerson = people.find((person: Person) => person.name === event.target.value as string)
    // if (selectedPerson) {
    // }
    setTempBillItem({ ...tempBillItem, shdPayByName: event.target.value as string })
  }

  const handleBillItemModalClose = () => {
    setBillItemModalOpen(false);
  }
  const handleFinalPaymentModalClose = () => {
    setFinalPaymentModalOpen(false);
  }
  const handlePersonModalClose = () => {
    setPersonModalOpen(false);
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h3">Split Bills</Typography>
      <hr />
      <Stack spacing={2}>
        <Typography variant="h5">Bill Items</Typography>
        {billItems.length == 0 && <div>No Items. Click the below button to add items</div>}
        {billItems.length > 0 && billItems.map((billItem: BillItem, index: number) => (
          <div key={index}>
            #{index + 1} : {billItem.name} | ${billItem.price} | {billItem.toSplit || !billItem.shdPayByName ? `Will be splitted` : `Should pay by ${billItem.shdPayByName}`}
          </div>
        ))}
        <Button variant="contained" onClick={handleBillItemModalOpen}>Add New Item</Button>
      </Stack>
      <hr />
      <Stack spacing={2}>
        <Typography variant="h5">Final Payment</Typography>
        <div>Tax: {bill.tax.toFixed(2)} ({taxRate * 100}%)</div>
        <div>Tips: ${bill.tips.toFixed(2)}</div>
        <div>Total Price: ${bill.totalPrice.toFixed(2)}</div>
        <div>Final Price: ${bill.finalPrice.toFixed(2)}</div>
        <div>Paid by: {bill.paidBy.name}</div>
        <Button variant="contained" onClick={() => setFinalPaymentModalOpen(true)}>Edit Final Payment</Button>
      </Stack>
      <hr />
      <Stack spacing={2}>
        <Typography variant="h5">People</Typography>
        {people.map((person: Person, index: number) => (
          <div key={index}>#{index + 1} : {person.name} | Pay ${person.shouldPay.toFixed(2)} | Receive ${person.shouldReceive.toFixed(2)} | Paid {person.paid ? 'Yes' : 'No'}</div>
        ))}
        <Button variant="contained" onClick={() => setPersonModalOpen(true)}>Add New Person</Button>
      </Stack>

      {/* Bill Item Modal */}
      <Modal open={billItemModalOpen}
        onClose={handleBillItemModalClose}
        aria-labelledby="billItem-modal-title"
        aria-describedby="billItem-modal-description"
      >
        <Box sx={modalBoxStyle}>
          <Stack spacing={2}>
            <Typography id="billItem-modal-title" variant="h5">
              Bill Item
            </Typography>
            <TextField
              id="billItem-name"
              label="Name"
              variant="filled"
              error={tempBillItemError.name !== ''}
              helperText={tempBillItemError.name}
              value={tempBillItem.name}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setTempBillItem({ ...tempBillItem, name: event.target.value })
              }} />
            <TextField
              id="billItem-price"
              label="Price"
              variant="filled"
              type="number"
              error={tempBillItemError.price !== ''}
              helperText={tempBillItemError.price}
              value={tempBillItem.price}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setTempBillItem({ ...tempBillItem, price: parseFloat(event.target.value) })
              }} />
            <FormControl variant="filled" error={tempBillItemError.shdPayByName !== ''}>
              <InputLabel id="demo-simple-select-filled-label">Paid By</InputLabel>
              <Select
                variant="filled"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={tempBillItem.shdPayByName}
                label="Paid By"
                onChange={handleBillItemshdPayByNameChange}
              >
                {people.map((person: Person, index: number) => (
                  <MenuItem key={index} value={person.name}>{person.name}</MenuItem>
                ))}
              </Select>
              {tempBillItemError.shdPayByName !== '' && <FormHelperText id="component-error-text">{tempBillItemError.shdPayByName}</FormHelperText>}
            </FormControl>
            <Button variant="contained" onClick={handleAddBillItem}>Add</Button>
            <Button variant="contained" onClick={handleBillItemModalClose}>Close</Button>
          </Stack>
        </Box>
      </Modal>


      {/* Final Payment Modal */}
      <Modal open={finalPaymedntModalOpen}
        onClose={handleFinalPaymentModalClose}
        aria-labelledby="finalPayment-modal-title"
        aria-describedby="finalPayment-modal-description"
      >
        <Box sx={modalBoxStyle}>
          <Stack spacing={2}>
            <Typography id="finalPayment-modal-title" variant="h5">
              Final Payment
            </Typography>
            {/* if update tips, auto calculate final price, vice versa */}
            <TextField id="finalPayment-tips" label="Tips" variant="filled" />
            <TextField id="finalPayment-finalPrice" label="Final Price" variant="filled" />
            <Button variant="contained" onClick={handleUpdateFinalPrice}>Update</Button>
            <Button variant="contained" onClick={handleFinalPaymentModalClose}>Close</Button>
          </Stack>
        </Box>
      </Modal>

      {/* Person Modal */}
      <Modal open={personModalOpen}
        onClose={handlePersonModalClose}
        aria-labelledby="people-modal-title"
        aria-describedby="people-modal-description"
      >
        <Box sx={modalBoxStyle}>
          <Stack spacing={2}>
            <Typography id="people-modal-title" variant="h5">
              Person
            </Typography>
            <TextField id="people-name" label="Name" variant="filled" />
            <Button variant="contained" onClick={handleAddPerson}>Add Person</Button>
            <Button variant="contained" onClick={handlePersonModalClose}>Close</Button>
          </Stack>
        </Box>
      </Modal>

    </Container>
  )
}

export default App
