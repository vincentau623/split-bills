import { useEffect, useState } from 'react'
import './App.css'
import { Container, Typography } from '@mui/material';
import { Bill, BillItem, Person } from './models/main';
import ItemSection from './components/ItemsSection';
import FinalPaymentSection from './components/FinalPaymentSection';
import PeopleSection from './components/PeopleSection';
import { useAppDispatch, useAppSelector } from './hooks/hooks';
import { updateFinalPayment, updatePerson } from './hooks/billSlice';


function App() {
  const [taxRate, setTaxRate] = useState<number>(0.13);

  const bill = useAppSelector((state) => state.bill.value)
  const dispatch = useAppDispatch()

  // calculate split bills (including adding tax)
  const calculateSplitBills = () => {
    if (bill.billItems.length === 0) {
      return
    }
    const total = bill.billItems.map((billItem: BillItem) => billItem.price).reduce((a, b) => a + b)
    const tax = total * taxRate
    const tips = bill.finalPayment.tips
    const finalPrice = total + tax + tips
    // update final payment
    const finalPayment = { ...bill.finalPayment, tax: tax, totalPrice: total, finalPrice: finalPrice }
    dispatch(updateFinalPayment(finalPayment))

    const avgTax = tax / bill.people.length
    const avgTips = tips / bill.people.length
    // calculate people's shouldPay and shouldReceive
    // go through each item, calculate how much each person should pay
    bill.people.map((person: Person, index: number) => {
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
      let updatedPerson = { ...person, shouldPay: shdPay }
      if (person.name === bill.finalPayment.paidByName) {
        updatedPerson = { ...person, shouldPay: shdPay - finalPrice < 0 ? 0 : shdPay - finalPrice, shouldReceive: finalPrice - shdPay }
      }
      dispatch(updatePerson({ index, person: updatedPerson }))
    })
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
      <ItemSection />
      <hr />
      <FinalPaymentSection taxRate={taxRate} />
      <hr />
      <PeopleSection />



    </Container>
  )
}

export default App
