import { useEffect } from "react";
import "./App.css";
import { Container, Link, Typography } from "@mui/material";
import { BillItem, Person } from "./models/main";
import ItemSection from "./components/ItemsSection";
import FinalPaymentSection from "./components/FinalPaymentSection";
import PeopleSection from "./components/PeopleSection";
import { useAppDispatch, useAppSelector } from "./hooks/hooks";
import { updateFinalPayment, updatePerson } from "./hooks/billSlice";

function App() {
    const bill = useAppSelector((state) => state.bill.value);
    const dispatch = useAppDispatch();

    // init bill from local storage
    useEffect(() => {
        const taxRate = localStorage.getItem("taxRate");
        dispatch(
            updateFinalPayment({
                ...bill.finalPayment,
                taxRate: taxRate ? parseFloat(taxRate) : 0,
            })
        );
    }, []);

    // calculate split bills (including adding tax)
    const calculateSplitBills = () => {
        // return if no bill items
        if (bill.billItems.length === 0) {
            return;
        }
        // update final payment
        const subTotal = bill.billItems
            .map((billItem: BillItem) => billItem.price)
            .reduce((a, b) => a + b);
        const tax = subTotal * bill.finalPayment.taxRate;
        const totalPrice = subTotal + tax;
        // if tip or final paid is set, update
        let tips = bill.finalPayment.tips;
        if (bill.finalPayment.finalPaid) {
            tips = bill.finalPayment.finalPaid - totalPrice;
        }

        const finalPayment = {
            ...bill.finalPayment,
            subTotal,
            tax,
            tips,
            totalPrice,
        };
        dispatch(updateFinalPayment(finalPayment));

        const avgTax = tax / bill.people.length;
        // handle tips calculation
        let avgTips = tips / bill.people.length;
        if (!finalPayment.tipsToSplit) {
            avgTips = 0;
        }
        // calculate people's shouldPay and shouldReceive
        // go through each item, calculate how much each person should pay
        // also check if tips is paid by someone
        bill.people.map((person: Person, index: number) => {
            let shdPay =
                bill.billItems
                    .map((billItem: BillItem) => {
                        if (billItem.toSplit) {
                            return billItem.price / bill.people.length;
                        } else if (billItem.shdPayByName === person.name) {
                            return billItem.price;
                        } else {
                            return 0;
                        }
                    })
                    .reduce((a, b) => a + b) +
                avgTax +
                avgTips;
            if (person.name === bill.finalPayment.tipsPaidByName) {
                shdPay += tips;
            }
            console.log(person.name, shdPay);
            let updatedPerson = { ...person, shouldPay: shdPay };
            if (person.name === bill.finalPayment.paidByName) {
                updatedPerson = {
                    ...updatedPerson,
                    // shouldPay: shdPay - finalPayment.finalPaid < 0 ? 0 : shdPay - finalPayment.finalPaid,
                    shouldReceive: finalPayment.finalPaid - shdPay,
                };
            }
            console.log(updatedPerson);
            dispatch(updatePerson({ index, person: updatedPerson }));
        });
    };

    useEffect(() => {
        calculateSplitBills();
    }, [
        bill.billItems,
        bill.people.length,
        bill.finalPayment.taxRate,
        bill.finalPayment.tips,
        bill.finalPayment.finalPaid,
    ]);

    // save the bill to local storage
    // const saveBill = () => {

    // }

    // MODAL Actions

    return (
        <Container maxWidth="sm">
            <Typography variant="h3">Split Bills</Typography>
            <hr />
            <ItemSection />
            <hr />
            <FinalPaymentSection />
            <hr />
            <PeopleSection />
            <hr />
            <Typography variant="overline">
                Provided by{" "}
                <Link href="https://vincentwcau.com/">Vincent Au</Link>
            </Typography>
        </Container>
    );
}

export default App;
