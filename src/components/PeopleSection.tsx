import {
    Stack,
    Typography,
    Button,
    Modal,
    Box,
    TextField,
    IconButton,
} from "@mui/material";
import { Person } from "../models/main";
import { useState } from "react";
import { modalBoxStyle } from "../styles/main";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { addPerson, removePerson, updatePerson } from "../hooks/billSlice";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const PeopleSection = () => {
    const bill = useAppSelector((state) => state.bill.value);
    const dispatch = useAppDispatch();

    const autogenName = String.fromCharCode(65 + bill.people.length); // auto generate name A, B, C, D, ...
    const inititalPerson = {
        name: `${autogenName}`,
        shouldPay: 0,
        shouldReceive: 0,
        paid: false,
    };

    const [personModalOpen, setPersonModalOpen] = useState<boolean>(false);
    const [tempPerson, setTempPerson] = useState<Person>(inititalPerson);
    const [modalMode, setModalMode] = useState<"add" | "edit">("add");
    const [updatingPersonIndex, setUpdatingPersonIndex] = useState<number>(-1);

    // PERSON Actions
    const handleTempPersonNameChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setTempPerson({ ...tempPerson, name: event.target.value });
    };

    // handle add person
    const handleAddPerson = () => {
        setTempPerson(inititalPerson);
        setModalMode("add");
        setPersonModalOpen(true);
    };

    // handle rename person
    const handleUpdatePerson = (person: Person, index: number) => {
        setTempPerson(person);
        setModalMode("edit");
        setUpdatingPersonIndex(index);
        setPersonModalOpen(true);
    };

    // handle delete person
    const handleDeletePerson = (index: number) => {
        dispatch(removePerson(index));
    };

    const handlePersonModalSubmit = () => {
        if (modalMode === "add") {
            dispatch(addPerson(tempPerson));
        } else if (modalMode === "edit") {
            dispatch(
                updatePerson({ person: tempPerson, index: updatingPersonIndex })
            );
        }
        setPersonModalOpen(false);
    };

    const handlePersonModalClose = () => {
        setPersonModalOpen(false);
    };
    return (
        <>
            <Stack spacing={1}>
                <Typography variant="h5">People</Typography>
                {bill.people.map((person: Person, index: number) => (
                    <div key={index}>
                        {person.name} | Pay ${person.shouldPay.toFixed(2)} |
                        Receive ${person.shouldReceive.toFixed(2)}{" "}
                        {/* | Paid {person.paid ? 'Yes' : 'No'} */}|
                        <IconButton
                            color="primary"
                            aria-label="edit item"
                            size="small"
                            onClick={() => handleUpdatePerson(person, index)}
                        >
                            <EditIcon fontSize="inherit" />
                        </IconButton>
                        |
                        <IconButton
                            color="error"
                            aria-label="delete item"
                            size="small"
                            onClick={() => handleDeletePerson(index)}
                        >
                            <DeleteIcon fontSize="inherit" />
                        </IconButton>
                    </div>
                ))}
                <Button variant="contained" onClick={handleAddPerson}>
                    Add New Person
                </Button>
            </Stack>
            {/* Person Modal */}
            <Modal
                open={personModalOpen}
                onClose={handlePersonModalClose}
                aria-labelledby="people-modal-title"
                aria-describedby="people-modal-description"
            >
                <Box sx={modalBoxStyle}>
                    <Stack spacing={2}>
                        <Typography id="people-modal-title" variant="h5">
                            Person
                        </Typography>
                        <TextField
                            id="people-name"
                            label="Name"
                            variant="filled"
                            value={tempPerson.name}
                            onChange={handleTempPersonNameChange}
                        />
                        <Button
                            variant="contained"
                            onClick={handlePersonModalSubmit}
                        >
                            {modalMode === "edit"
                                ? "Edit Person"
                                : "Add Person"}
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handlePersonModalClose}
                        >
                            Close
                        </Button>
                    </Stack>
                </Box>
            </Modal>
        </>
    );
};

export default PeopleSection;
