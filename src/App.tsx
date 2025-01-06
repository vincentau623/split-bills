import { useEffect, useState } from "react";
import "./App.css";
import { Button, Container, Link, Typography } from "@mui/material";
import { BillItem, Person } from "./models/main";
import ItemSection from "./components/ItemsSection";
import FinalPaymentSection from "./components/FinalPaymentSection";
import PeopleSection from "./components/PeopleSection";
import { useAppDispatch, useAppSelector } from "./hooks/hooks";
import { updateFinalPayment, updatePerson, clearBill } from "./hooks/billSlice";
import ConfirmDialog from "./components/ConfirmDialog";

function App() {
    const bill = useAppSelector((state) => state.bill.value);
    const dispatch = useAppDispatch();
    const [resetDialogOpen, setResetDialogOpen] = useState<boolean>(false);

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
        const discountedPrice = subTotal - bill.finalPayment.discount;
        const tax = discountedPrice * bill.finalPayment.taxRate;
        const totalPrice = discountedPrice + tax;
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

        // calculate people's shouldPay and shouldReceive
        // go through each item, calculate how much each person should pay
        // also check if tips is paid by someone

        // handle tax calculation
        const avgTax = tax / bill.people.length;
        // handle tips calculation
        let avgTips = tips / bill.people.length;
        if (!finalPayment.tipsToSplit) {
            avgTips = 0;
        }
        bill.people.map((person: Person, index: number) => {
            let shdPay = 0;
            const itemSum = bill.billItems
                .map((billItem: BillItem) => {
                    if (billItem.toSplit) {
                        return billItem.price / bill.people.length;
                    } else if (billItem.shdPayByName === person.name) {
                        return billItem.price;
                    } else {
                        return 0;
                    }
                })
                .reduce((a, b) => a + b);
            shdPay += itemSum;

            // add discount
            if (bill.finalPayment.discount !== 0) {
                const discountRatio = bill.finalPayment.discount / subTotal;
                shdPay -= itemSum * discountRatio; // use pre-tax price to calculate discount
            }
            // add tax
            if (tax != 0 && bill.finalPayment.taxSplitMode === "byItem") {
                const taxRatio = tax / subTotal;
                shdPay += itemSum * taxRatio; // use pre-tax price to calculate tax
            } else {
                shdPay += avgTax;
            }
            // add tips
            if (
                !bill.finalPayment.tipsToSplit &&
                person.name === bill.finalPayment.tipsPaidByName
            ) {
                shdPay += tips;
            }
            if (
                bill.finalPayment.tipsToSplit &&
                tips != 0 &&
                bill.finalPayment.tipsSplitMode === "byItem"
            ) {
                const tipsRatio = tips / totalPrice;
                shdPay += shdPay * tipsRatio; // use after tax price to calculate tips
            } else {
                shdPay += avgTips;
            }
            // update person
            let updatedPerson = {
                ...person,
                shouldPay: shdPay,
                shouldReceive: 0,
            };
            if (person.name === bill.finalPayment.paidByName) {
                updatedPerson = {
                    ...updatedPerson,
                    shouldReceive: finalPayment.finalPaid - shdPay,
                };
            }
            dispatch(updatePerson({ index, person: updatedPerson }));
        });
    };

    useEffect(() => {
        calculateSplitBills();
    }, [
        bill.billItems,
        bill.people.length,
        bill.finalPayment.discount,
        bill.finalPayment.taxRate,
        bill.finalPayment.taxSplitMode,
        bill.finalPayment.tips,
        bill.finalPayment.tipsToSplit,
        bill.finalPayment.tipsSplitMode,
        bill.finalPayment.finalPaid,
        bill.finalPayment.paidByName,
    ]);

    const handleResetButton = () => {
        setResetDialogOpen(true);
    };

    const resetBill = () => {
        dispatch(clearBill());
        setResetDialogOpen(false);
    };

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
            <Button
                variant="contained"
                color="primary"
                onClick={handleResetButton}
            >
                Reset
            </Button>
            <hr />
            <Typography variant="overline">
                Provided by{" "}
                <Link href="https://vincentwcau.com/">Vincent Au</Link>
            </Typography>
            <ConfirmDialog
                open={resetDialogOpen}
                setOpen={setResetDialogOpen}
                title="Reset Bill"
                content="Are you sure to reset the bill?"
                onConfirm={resetBill}
            />
        </Container>
    );
}

export default App;
