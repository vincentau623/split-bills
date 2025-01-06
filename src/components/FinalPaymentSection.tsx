import {
    Stack,
    Typography,
    Button,
    Modal,
    Box,
    TextField,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    FormControlLabel,
    Checkbox,
    InputAdornment,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import { useState } from "react";
import { modalBoxStyle } from "../styles/main";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { FinalPayment, Person } from "../models/main";
import { updateFinalPayment } from "../hooks/billSlice";

const FinalPaymentSection = () => {
    const bill = useAppSelector((state) => state.bill.value);
    const dispatch = useAppDispatch();

    const [tempFinalPayment, setTempFinalPayment] = useState<FinalPayment>(
        bill.finalPayment
    );

    const initialTaxRate = bill.finalPayment.taxRate * 100;
    const [tempTaxRate, setTempTaxRate] = useState<number>(initialTaxRate);
    // const [tempDiscount, setTempDiscount] = useState<number>(
    //     bill.finalPayment.discount
    // );

    const [finalPaymedntModalOpen, setFinalPaymentModalOpen] =
        useState<boolean>(false);
    const [billModalOpen, setBillModalOpen] = useState<boolean>(false);

    // Edit Bill Actions
    const handleBillModalOpen = () => {
        setTempFinalPayment(bill.finalPayment);
        setTempTaxRate(initialTaxRate);
        setBillModalOpen(true);
    };

    const handleDiscountChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setTempFinalPayment({
            ...tempFinalPayment,
            discount: parseFloat(event.target.value),
        });
    };

    const updateTempDiscount = (discount: number) => {
        setTempFinalPayment({
            ...tempFinalPayment,
            discount: discount,
        });
    };

    const handleTaxRateChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setTempTaxRate(parseFloat(event.target.value));
    };

    const handleTaxsSplitModeChange = (event: SelectChangeEvent) => {
        setTempFinalPayment({
            ...tempFinalPayment,
            taxSplitMode: event.target.value,
        });
    };

    const handleUpdateBill = () => {
        dispatch(
            updateFinalPayment({
                ...bill.finalPayment,
                discount: tempFinalPayment.discount,
                taxRate: tempTaxRate / 100,
                taxSplitMode: tempFinalPayment.taxSplitMode,
            })
        );
        // also save to local storage
        localStorage.setItem("taxRate", JSON.stringify(tempTaxRate / 100));
        setBillModalOpen(false);
    };

    const handleBillModalClose = () => {
        setBillModalOpen(false);
    };

    // FINAL PAYMENT Actions
    const handleFinalPaymentModalOpen = () => {
        setTempFinalPayment(bill.finalPayment);
        setFinalPaymentModalOpen(true);
    };

    // handle final price change
    const handleUpdateFinalPrice = () => {
        dispatch(updateFinalPayment(tempFinalPayment));
        setFinalPaymentModalOpen(false);
    };

    const handleTipsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // if tips change update final paid
        setTempFinalPayment({
            ...tempFinalPayment,
            tips: parseFloat(event.target.value),
            finalPaid: parseFloat(event.target.value)
                ? tempFinalPayment.totalPrice + parseFloat(event.target.value)
                : 0,
        });
    };

    const quickTipsChange = (percent: number) => {
        const calculatedTips = tempFinalPayment.totalPrice * percent;
        // if tips change update final paid
        setTempFinalPayment({
            ...tempFinalPayment,
            tips: calculatedTips,
            finalPaid: calculatedTips
                ? tempFinalPayment.totalPrice + calculatedTips
                : 0,
        });
    };

    const hanldeTipsToSplitChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setTempFinalPayment({
            ...tempFinalPayment,
            tipsToSplit: event.target.checked,
            tipsPaidByName: event.target.checked
                ? ""
                : tempFinalPayment.tipsPaidByName,
        });
    };

    const handleTipsSplitModeChange = (event: SelectChangeEvent) => {
        setTempFinalPayment({
            ...tempFinalPayment,
            tipsSplitMode: event.target.value,
        });
    };

    const handleTipsPaidByChange = (event: SelectChangeEvent) => {
        setTempFinalPayment({
            ...tempFinalPayment,
            tipsPaidByName: event.target.value,
        });
    };

    const handleFinalPaidChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        // if final price change update tips
        setTempFinalPayment({
            ...tempFinalPayment,
            tips: parseFloat(event.target.value)
                ? parseFloat(event.target.value) -
                  parseFloat(tempFinalPayment.totalPrice.toFixed(2))
                : 0,
            finalPaid: parseFloat(event.target.value),
        });
    };

    const handlePaidByChange = (event: SelectChangeEvent) => {
        setTempFinalPayment({
            ...tempFinalPayment,
            paidByName: event.target.value,
        });
    };

    const handleFinalPaymentModalClose = () => {
        setFinalPaymentModalOpen(false);
    };

    return (
        <>
            <Stack spacing={1}>
                <div>Subtotal: ${bill.finalPayment.subTotal.toFixed(2)}</div>
                <div>Discount: ${bill.finalPayment.discount.toFixed(2)}</div>
                <div>
                    Tax: ${bill.finalPayment.tax.toFixed(2)} (
                    {bill.finalPayment.taxRate * 100}%)
                    {bill.finalPayment.tax > 0 &&
                        ` (Will be splitted 
                    ${
                        bill.finalPayment.taxSplitMode === "byItem"
                            ? "by item price"
                            : "evenly"
                    })`}
                </div>
                <div>
                    Total Price: ${bill.finalPayment.totalPrice.toFixed(2)}
                </div>
                <Button variant="contained" onClick={handleBillModalOpen}>
                    Edit Bill
                </Button>
                <hr />
                <Typography variant="h5">Final Payment</Typography>
                <div>
                    Tips: ${bill.finalPayment.tips.toFixed(2)} (
                    {bill.finalPayment.tipsToSplit
                        ? `Will be splitted ${
                              bill.finalPayment.tipsSplitMode === "byItem"
                                  ? "by item price"
                                  : "evenly"
                          }`
                        : `Pay by ${bill.finalPayment.tipsPaidByName}`}
                    )
                </div>
                <div>Final Paid: ${bill.finalPayment.finalPaid.toFixed(2)}</div>
                <div>Paid by: {bill.finalPayment.paidByName}</div>
                <Button
                    variant="contained"
                    onClick={handleFinalPaymentModalOpen}
                >
                    Edit Final Payment
                </Button>
            </Stack>

            {/* Bill Modal */}
            <Modal open={billModalOpen} onClose={handleBillModalClose}>
                <Box sx={modalBoxStyle}>
                    <Stack spacing={2}>
                        <Typography id="bill-modal-title" variant="h5">
                            Bill
                        </Typography>
                        <TextField
                            id="discount-rate"
                            label="Discount"
                            variant="filled"
                            type="number"
                            value={tempFinalPayment.discount}
                            onChange={handleDiscountChange}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            $
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />
                        <Stack direction="row" spacing={1}>
                            <Button
                                size="small"
                                variant="contained"
                                onClick={() => updateTempDiscount(0)}
                            >
                                0%
                            </Button>
                            <Button
                                size="small"
                                variant="contained"
                                onClick={() =>
                                    updateTempDiscount(
                                        bill.finalPayment.subTotal * 0.05
                                    )
                                }
                            >
                                5%
                            </Button>
                            <Button
                                size="small"
                                variant="contained"
                                onClick={() =>
                                    updateTempDiscount(
                                        bill.finalPayment.subTotal * 0.1
                                    )
                                }
                            >
                                10%
                            </Button>
                        </Stack>
                        <TextField
                            id="tax-rate"
                            label="Tax Rate"
                            variant="filled"
                            type="number"
                            value={tempTaxRate}
                            onChange={handleTaxRateChange}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            %
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />
                        <Stack direction="row" spacing={1}>
                            <Button
                                size="small"
                                variant="contained"
                                onClick={() => setTempTaxRate(0)}
                            >
                                0%
                            </Button>
                            <Button
                                size="small"
                                variant="contained"
                                onClick={() => setTempTaxRate(12)}
                            >
                                12% (BC)
                            </Button>
                            <Button
                                size="small"
                                variant="contained"
                                onClick={() => setTempTaxRate(13)}
                            >
                                13% (ON)
                            </Button>
                        </Stack>
                        <FormControl
                            sx={{ minWidth: "150px" }}
                            variant="filled"
                        >
                            <InputLabel id="taxs-split-mode-label">
                                How to split taxs
                            </InputLabel>
                            <Select
                                variant="filled"
                                labelId="taxs-split-mode-label"
                                id="taxs-split-mode-select"
                                value={tempFinalPayment.taxSplitMode}
                                label="How to split taxs"
                                onChange={handleTaxsSplitModeChange}
                            >
                                <MenuItem key="byItem" value="byItem">
                                    By Item Price
                                </MenuItem>
                                <MenuItem key="evenly" value="evenly">
                                    Evenly
                                </MenuItem>
                            </Select>
                        </FormControl>

                        <Button variant="contained" onClick={handleUpdateBill}>
                            Update
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleBillModalClose}
                        >
                            Close
                        </Button>
                    </Stack>
                </Box>
            </Modal>

            {/* Final Payment Modal */}
            <Modal
                open={finalPaymedntModalOpen}
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
                        <TextField
                            id="finalPayment-tips"
                            label="Tips"
                            variant="filled"
                            type="number"
                            value={tempFinalPayment.tips}
                            onChange={handleTipsChange}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            $
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />
                        <Grid container direction="row" spacing={2}>
                            <Grid size={3}>
                                <Button
                                    size="small"
                                    variant="contained"
                                    onClick={() => quickTipsChange(0)}
                                >
                                    0%
                                </Button>
                            </Grid>
                            <Grid size={3}>
                                <Button
                                    size="small"
                                    variant="contained"
                                    onClick={() => quickTipsChange(0.1)}
                                >
                                    10%
                                </Button>
                            </Grid>

                            <Grid size={3}>
                                <Button
                                    size="small"
                                    variant="contained"
                                    onClick={() => quickTipsChange(0.12)}
                                >
                                    12%
                                </Button>
                            </Grid>
                            <Grid size={3}>
                                <Button
                                    size="small"
                                    variant="contained"
                                    onClick={() => quickTipsChange(0.15)}
                                >
                                    15%
                                </Button>
                            </Grid>
                            <Grid size={3}>
                                <Button
                                    size="small"
                                    variant="contained"
                                    onClick={() => quickTipsChange(0.18)}
                                >
                                    18%
                                </Button>
                            </Grid>
                            <Grid size={3}>
                                <Button
                                    size="small"
                                    variant="contained"
                                    onClick={() => quickTipsChange(0.2)}
                                >
                                    20%
                                </Button>
                            </Grid>
                        </Grid>
                        <Stack
                            direction="row"
                            sx={{
                                justifyContent: "flex-start",
                                alignItems: "center",
                            }}
                        >
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={tempFinalPayment.tipsToSplit}
                                        onChange={hanldeTipsToSplitChange}
                                    />
                                }
                                label="To split"
                            />
                            {tempFinalPayment.tipsToSplit && (
                                <FormControl
                                    sx={{ minWidth: "150px" }}
                                    variant="filled"
                                >
                                    <InputLabel id="tips-split-mode-label">
                                        How to split
                                    </InputLabel>
                                    <Select
                                        variant="filled"
                                        labelId="tips-split-mode-label"
                                        id="tips-split-mode-select"
                                        value={tempFinalPayment.tipsSplitMode}
                                        label="How to split"
                                        onChange={handleTipsSplitModeChange}
                                    >
                                        <MenuItem key="byItem" value="byItem">
                                            By Item Price
                                        </MenuItem>
                                        <MenuItem key="evenly" value="evenly">
                                            Evenly
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            )}
                            {!tempFinalPayment.tipsToSplit && (
                                <FormControl
                                    sx={{ minWidth: "150px" }}
                                    variant="filled"
                                >
                                    <InputLabel id="pay-by-label">
                                        Pay By
                                    </InputLabel>
                                    <Select
                                        variant="filled"
                                        labelId="pay-by-label"
                                        id="pay-by-select"
                                        value={tempFinalPayment.tipsPaidByName}
                                        label="Paid By"
                                        onChange={handleTipsPaidByChange}
                                        disabled={tempFinalPayment.tipsToSplit}
                                    >
                                        {bill.people.map(
                                            (person: Person, index: number) => (
                                                <MenuItem
                                                    key={index}
                                                    value={person.name}
                                                >
                                                    {person.name}
                                                </MenuItem>
                                            )
                                        )}
                                    </Select>
                                </FormControl>
                            )}
                        </Stack>

                        <TextField
                            id="finalPayment-finalPrice"
                            label="Final Paid"
                            variant="filled"
                            type="number"
                            value={tempFinalPayment.finalPaid}
                            onChange={handleFinalPaidChange}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            $
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />
                        <FormControl
                            sx={{ minWidth: "150px" }}
                            variant="filled"
                        >
                            <InputLabel id="demo-simple-select-filled-label">
                                Paid By
                            </InputLabel>
                            <Select
                                variant="filled"
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={tempFinalPayment.paidByName}
                                label="Paid By"
                                onChange={handlePaidByChange}
                            >
                                {bill.people.map(
                                    (person: Person, index: number) => (
                                        <MenuItem
                                            key={index}
                                            value={person.name}
                                        >
                                            {person.name}
                                        </MenuItem>
                                    )
                                )}
                            </Select>
                        </FormControl>

                        <Button
                            variant="contained"
                            onClick={handleUpdateFinalPrice}
                        >
                            Update
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleFinalPaymentModalClose}
                        >
                            Close
                        </Button>
                    </Stack>
                </Box>
            </Modal>
        </>
    );
};

export default FinalPaymentSection;
