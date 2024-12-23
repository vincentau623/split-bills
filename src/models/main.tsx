export interface Person {
    name: string; // default should be A,B,C
    shouldPay: number;
    shouldReceive: number;
    paid: boolean;
}

export interface BillItem {
    name: string; // default should be item1, item2, item3
    price: number;
    toSplit: boolean; // the bill is splited or pay by one person
    shdPayByName: string; // default should be A // TODO: multiple people
}

export interface BillItemError {
    name: string;
    price: string;
    shdPayByName: string;
}

export interface FinalPayment {
    subTotal: number;
    tax: number;
    tips: number;
    tipsToSplit: boolean;
    tipsPaidByName: string; // TODO: multiple people
    totalPrice: number;
    finalPaid: number;
    paidByName: string; // TODO: multiple people
}

export interface Bill {
    billItems: BillItem[];
    people: Person[];
    finalPayment: FinalPayment;
    resolved: boolean;
}
