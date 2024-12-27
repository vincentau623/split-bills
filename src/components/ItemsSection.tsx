import {
    Stack,
    Typography,
    Button,
    Modal,
    Box,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    SelectChangeEvent,
    FormControlLabel,
    Checkbox,
    IconButton,
} from "@mui/material";
import { BillItem, BillItemError, Person } from "../models/main";
import React, { useState } from "react";
import { modalBoxStyle } from "../styles/main";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import {
    addBillItem,
    removeBillItem,
    updateBillItem,
} from "../hooks/billSlice";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const ItemSection = () => {
    const bill = useAppSelector((state) => state.bill.value);
    const dispatch = useAppDispatch();

    const initialBillItem: BillItem = {
        name: `Item ${bill.billItems.length + 1}`,
        price: 0,
        toSplit: true,
        shdPayByName: "",
    };
    const inititalBillItemError: BillItemError = {
        name: "",
        price: "",
        shdPayByName: "",
    };

    const [tempBillItem, setTempBillItem] = useState<BillItem>(initialBillItem);
    const [tempBillItemError, setTempBillItemError] = useState<BillItemError>(
        inititalBillItemError
    );
    const [billItemModalOpen, setBillItemModalOpen] = useState<boolean>(false);
    const [modalMode, setModalMode] = useState<"add" | "edit">("add");
    const [updatingBillItemIndex, setUpdatingBillItemIndex] =
        useState<number>(-1);

    // BILL ITEMS ACTIONS
    // handle add bill item
    const handleAddBillItem = () => {
        setTempBillItem(initialBillItem);
        setModalMode("add");
        setBillItemModalOpen(true);
    };

    // handle edit Bill Item
    const handleEditBillItem = (billItem: BillItem, index: number) => {
        // set tempBillItem
        setTempBillItem(billItem);
        setModalMode("edit");
        setUpdatingBillItemIndex(index);
        setBillItemModalOpen(true);
    };

    // handle delete bill item
    const handleDeleteBillItem = (index: number) => {
        dispatch(removeBillItem(index));
    };

    const handleBillItemModalSubmit = () => {
        // validate tempBillItem
        let tempBillItemError = { name: "", price: "", shdPayByName: "" };
        if (!tempBillItem.name || tempBillItem.name === "") {
            tempBillItemError = {
                ...tempBillItemError,
                name: "Name should not be empty",
            };
        }
        if (!tempBillItem.price || tempBillItem.price <= 0) {
            tempBillItemError = {
                ...tempBillItemError,
                price: "Price should be greater than 0",
            };
        }
        if (tempBillItem.shdPayByName === undefined) {
            tempBillItemError = {
                ...tempBillItemError,
                shdPayByName: "Paid by should not be empty",
            };
        }
        if (
            tempBillItemError.name !== "" ||
            tempBillItemError.price !== "" ||
            tempBillItemError.shdPayByName !== ""
        ) {
            setTempBillItemError(tempBillItemError);
        } else {
            if (modalMode === "add") {
                dispatch(addBillItem(tempBillItem));
            } else if (modalMode === "edit") {
                dispatch(
                    updateBillItem({
                        billItem: tempBillItem,
                        index: updatingBillItemIndex,
                    })
                );
            }
            // setBillItems([...billItems, tempBillItem])
            handleBillItemModalClose();
        }
    };

    const handleToSplitCheckbox = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setTempBillItem({
            ...tempBillItem,
            toSplit: event.target.checked,
            shdPayByName: event.target.checked ? "" : bill.people[0].name,
        });
    };

    const handleBillItemshdPayByNameChange = (event: SelectChangeEvent) => {
        setTempBillItem({ ...tempBillItem, shdPayByName: event.target.value });
    };

    const handleBillItemModalClose = () => {
        setTempBillItem(initialBillItem);
        setTempBillItemError(inititalBillItemError);
        setBillItemModalOpen(false);
    };

    return (
        <>
            <Stack spacing={2}>
                <Typography variant="h5">Bill Items</Typography>
                {bill.billItems.length == 0 && (
                    <div>No Items. Click the below button to add items</div>
                )}
                {bill.billItems.length > 0 &&
                    bill.billItems.map((billItem: BillItem, index: number) => (
                        <div key={index}>
                            #{index + 1} : {billItem.name} | $
                            {billItem.price.toFixed(2)} |{" "}
                            {billItem.toSplit || !billItem.shdPayByName
                                ? `Will be splitted`
                                : `Pay by ${billItem.shdPayByName}`}{" "}
                            |
                            <IconButton
                                color="primary"
                                aria-label="edit item"
                                size="small"
                                onClick={() =>
                                    handleEditBillItem(billItem, index)
                                }
                            >
                                <EditIcon fontSize="inherit" />
                            </IconButton>
                            |
                            <IconButton
                                color="error"
                                aria-label="delete item"
                                size="small"
                                onClick={() => handleDeleteBillItem(index)}
                            >
                                <DeleteIcon fontSize="inherit" />
                            </IconButton>
                        </div>
                    ))}
                <Button variant="contained" onClick={handleAddBillItem}>
                    Add New Item
                </Button>
            </Stack>
            {/* Bill Item Modal */}
            <Modal
                open={billItemModalOpen}
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
                            label="Item name"
                            variant="filled"
                            error={tempBillItemError.name !== ""}
                            helperText={tempBillItemError.name}
                            value={tempBillItem.name}
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                setTempBillItem({
                                    ...tempBillItem,
                                    name: event.target.value,
                                });
                            }}
                        />
                        <TextField
                            id="billItem-price"
                            label="Price"
                            variant="filled"
                            type="number"
                            error={tempBillItemError.price !== ""}
                            helperText={tempBillItemError.price}
                            value={tempBillItem.price}
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                setTempBillItem({
                                    ...tempBillItem,
                                    price: parseFloat(event.target.value),
                                });
                            }}
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
                                        checked={tempBillItem.toSplit}
                                        onChange={handleToSplitCheckbox}
                                    />
                                }
                                label="To split"
                            />
                            {!tempBillItem.toSplit && (
                                <FormControl
                                    sx={{ minWidth: "150px" }}
                                    variant="filled"
                                    error={
                                        tempBillItemError.shdPayByName !== ""
                                    }
                                >
                                    <InputLabel id="demo-simple-select-filled-label">
                                        Pay By
                                    </InputLabel>
                                    <Select
                                        variant="filled"
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={tempBillItem.shdPayByName}
                                        label="Paid By"
                                        onChange={
                                            handleBillItemshdPayByNameChange
                                        }
                                        disabled={tempBillItem.toSplit}
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
                                    {tempBillItemError.shdPayByName !== "" && (
                                        <FormHelperText id="component-error-text">
                                            {tempBillItemError.shdPayByName}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            )}
                        </Stack>
                        <Button
                            variant="contained"
                            onClick={handleBillItemModalSubmit}
                        >
                            Add
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleBillItemModalClose}
                        >
                            Close
                        </Button>
                    </Stack>
                </Box>
            </Modal>
        </>
    );
};

export default ItemSection;
