import { Stack, Typography, Button, Modal, Box, TextField } from "@mui/material";
import { useState } from "react";
import { modalBoxStyle } from "../styles/main";
import { Bill } from "../models/main";
import { useAppSelector } from "../hooks/hooks";

const FinalPaymentSection = (props: { taxRate: number }) => {
    const { taxRate } = props
    const bill = useAppSelector((state) => state.bill.value)

    const [finalPaymedntModalOpen, setFinalPaymentModalOpen] = useState<boolean>(false);
    const [tempFinalPrice, setTempFinalPrice] = useState<number>(0);

    // FINAL PAYMENT Actions
    // handle final price change
    const handleUpdateFinalPrice = () => {
    }

    const handleFinalPaymentModalClose = () => {
        setFinalPaymentModalOpen(false);
    }

    return (
        <>
            <Stack spacing={2}>
                <Typography variant="h5">Final Payment</Typography>
                <div>Tax: {bill.finalPayment.tax.toFixed(2)} ({taxRate * 100}%)</div>
                <div>Tips: ${bill.finalPayment.tips.toFixed(2)}</div>
                <div>Total Price: ${bill.finalPayment.totalPrice.toFixed(2)}</div>
                <div>Final Price: ${bill.finalPayment.finalPrice.toFixed(2)}</div>
                <div>Paid by: {bill.finalPayment.paidByName}</div>
                <Button variant="contained" onClick={() => setFinalPaymentModalOpen(true)}>Edit Final Payment</Button>
            </Stack>
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
        </>
    )
}

export default FinalPaymentSection;