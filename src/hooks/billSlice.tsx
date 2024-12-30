import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Bill, BillItem, FinalPayment, Person } from "../models/main";

export interface BillState {
    value: Bill;
}

const initialState: BillState = {
    value: {
        billItems: [],
        people: [{ name: "A", shouldPay: 0, shouldReceive: 0, paid: false }],
        finalPayment: {
            subTotal: 0,
            discount: 0,
            taxRate: 0,
            tax: 0,
            tips: 0,
            tipsToSplit: true,
            tipsPaidByName: "",
            totalPrice: 0,
            finalPaid: 0,
            paidByName: "A",
        },
        resolved: false,
    },
};

export const billSlice = createSlice({
    name: "bill",
    initialState,
    reducers: {
        addBillItem: (state, action: PayloadAction<BillItem>) => {
            state.value.billItems.push(action.payload);
        },
        removeBillItem: (state, action: PayloadAction<number>) => {
            state.value.billItems.splice(action.payload, 1);
        },
        updateBillItem: (
            state,
            action: PayloadAction<{ index: number; billItem: BillItem }>
        ) => {
            state.value.billItems[action.payload.index] =
                action.payload.billItem;
        },
        addPerson: (state, action: PayloadAction<Person>) => {
            state.value.people.push(action.payload);
        },
        removePerson: (state, action: PayloadAction<number>) => {
            state.value.people.splice(action.payload, 1);
        },
        updatePerson: (
            state,
            action: PayloadAction<{ index: number; person: Person }>
        ) => {
            state.value.people[action.payload.index] = action.payload.person;
        },
        updateFinalPayment: (state, action: PayloadAction<FinalPayment>) => {
            state.value.finalPayment = action.payload;
        },
        clearBill: (state) => {
            state.value = initialState.value;
        },
    },
});

export const {
    addBillItem,
    removeBillItem,
    updateBillItem,
    addPerson,
    removePerson,
    updatePerson,
    updateFinalPayment,
    clearBill,
} = billSlice.actions;

export const selectBill = (state: { bill: BillState }) => state.bill.value;

export default billSlice.reducer;
