import { useEffect, useState } from 'react'
import './App.css'
import { Container, Typography } from '@mui/material';
import { Bill, BillItem, Person } from './models/main';
import ItemSection from './components/ItemsSection';
import FinalPaymentSection from './components/FinalPaymentSection';
import PeopleSection from './components/PeopleSection';


function App() {
  const [taxRate, setTaxRate] = useState<number>(0.13);

  const [bill, setBill] = useState<Bill>({ billItems: [], people: [{ name: 'A', shouldPay: 0, shouldReceive: 0, paid: false }], tax: 0, tips: 0, totalPrice: 0, finalPrice: 0, paidByName: 'A', resolved: false, })

  // Modal

  // calculate split bills (including adding tax)
  const calculateSplitBills = () => {
    if (bill.billItems.length === 0) {
      return
    }
    const total = bill.billItems.map((billItem: BillItem) => billItem.price).reduce((a, b) => a + b)
    const tax = total * taxRate
    const tips = bill.tips
    const finalPrice = total + tax + tips
    setBill({ ...bill, tax: tax, totalPrice: total, finalPrice: finalPrice })

    const avgTax = tax / bill.people.length
    const avgTips = tips / bill.people.length
    // calculate people's shouldPay and shouldReceive
    // go through each item, calculate how much each person should pay
    const updatedPeople = bill.people.map((person: Person) => {
      const shdPay = bill.billItems.map((billItem: BillItem) => {
        console.log(billItem.shdPayByName === person.name)
        if (billItem.toSplit) {
          return billItem.price / bill.people.length
        } else if (billItem.shdPayByName === person.name) {
          return billItem.price
        } else {
          return 0
        }
      }).reduce((a, b) => a + b) + avgTax + avgTips
      console.log(person.name, shdPay)
      if (person.name === bill.paidByName) {
        return { ...person, shouldPay: shdPay - finalPrice < 0 ? 0 : shdPay - finalPrice, shouldReceive: finalPrice - shdPay }
      } else {
        return { ...person, shouldPay: shdPay }
      }
    })
    console.log(updatedPeople)
    setBill({ ...bill, people: updatedPeople })
  }

  useEffect(() => {
    calculateSplitBills()
  }, [bill.billItems])

  // save the bill to local storage
  const saveBill = () => {

  }

  // MODAL Actions

  return (
    <Container maxWidth="sm">
      <Typography variant="h3">Split Bills</Typography>
      <hr />
      <ItemSection bill={bill} />
      <hr />
      <FinalPaymentSection bill={bill} taxRate={taxRate} />
      <hr />
      <PeopleSection bill={bill} />



    </Container>
  )
}

export default App
