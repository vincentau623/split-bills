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
    IconButton,
    InputAdornment,
} from "@mui/material";
import { useState } from "react";
import { modalBoxStyle } from "../styles/main";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { FinalPayment, Person } from "../models/main";
import { updateFinalPayment } from "../hooks/billSlice";
import EditIcon from "@mui/icons-material/Edit";

const FinalPaymentSection = () => {
    const bill = useAppSelector((state) => state.bill.value);
    const dispatch = useAppDispatch();

    const [tempFinalPayment, setTempFinalPayment] = useState<FinalPayment>(
        bill.finalPayment
    );

    const initialTaxRate = bill.finalPayment.taxRate * 100;
    const [tempTaxRate, setTempTaxRate] = useState<number>(initialTaxRate);
    const [finalPaymedntModalOpen, setFinalPaymentModalOpen] =
        useState<boolean>(false);

    const [taxModalOpen, setTaxModalOpen] = useState<boolean>(false);

    const handleFinalPaymentModalOpen = () => {
        setTempFinalPayment(bill.finalPayment);
        setFinalPaymentModalOpen(true);
    };

    // TAX Actions

    const handleTaxRateChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setTempTaxRate(parseFloat(event.target.value));
    };

    const handleUpdateTaxRate = () => {
        dispatch(
            updateFinalPayment({
                ...bill.finalPayment,
                taxRate: tempTaxRate / 100,
            })
        );
        // also save to local storage
        localStorage.setItem("taxRate", JSON.stringify(tempTaxRate / 100));
        setTaxModalOpen(false);
    };

    const handleTaxModalClose = () => {
        setTaxModalOpen(false);
    };

    // FINAL PAYMENT Actions
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
                <div>
                    Tax: ${bill.finalPayment.tax.toFixed(2)} (
                    {bill.finalPayment.taxRate * 100}%)
                    <IconButton
                        color="primary"
                        aria-label="edit item"
                        size="small"
                        onClick={() => setTaxModalOpen(true)}
                    >
                        <EditIcon fontSize="inherit" />
                    </IconButton>
                </div>
                <div>
                    Total Price: ${bill.finalPayment.totalPrice.toFixed(2)}
                </div>
                <hr />
                <Typography variant="h5">Final Payment</Typography>
                <div>
                    Tips: ${bill.finalPayment.tips.toFixed(2)} (
                    {bill.finalPayment.tipsToSplit
                        ? `Will be splitted`
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
            {/* Tax Modal */}
            <Modal open={taxModalOpen} onClose={handleTaxModalClose}>
                <Box sx={modalBoxStyle}>
                    <Stack spacing={2}>
                        <Typography id="tax-modal-title" variant="h5">
                            Tax
                        </Typography>
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
                        <Button
                            variant="contained"
                            onClick={handleUpdateTaxRate}
                        >
                            Update
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleTaxModalClose}
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
                        />
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
                            {!tempFinalPayment.tipsToSplit && (
                                <FormControl
                                    sx={{ minWidth: "150px" }}
                                    variant="filled"
                                >
                                    <InputLabel id="demo-simple-select-filled-label">
                                        Pay By
                                    </InputLabel>
                                    <Select
                                        variant="filled"
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
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
