import {
    Stack,
    Typography,
    Button,
    Modal,
    Box,
    TextField,
} from "@mui/material";
import { Person } from "../models/main";
import { useEffect, useState } from "react";
import { modalBoxStyle } from "../styles/main";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { addPerson } from "../hooks/billSlice";

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

    useEffect(() => {
        console.log("bill.people", bill.people);
    }, [bill.people]);

    // PERSON Actions
    const handleTempPersonNameChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setTempPerson({ ...tempPerson, name: event.target.value });
    };
    // handle add person
    const handleAddPerson = () => {
        dispatch(addPerson(tempPerson));
        setPersonModalOpen(false);
    };
    // handle delete person
    // const handleDeletePerson = (person: Person) => {

    // }

    // handle rename person
    // const handleRenamePerson = (person: Person, newName: string) => {

    // }

    // handle person paid change
    // const handlePaidChange = (person: Person) => {

    // }

    const handlePersonModalClose = () => {
        setPersonModalOpen(false);
    };
    return (
        <>
            <Stack spacing={2}>
                <Typography variant="h5">People</Typography>
                {bill.people.map((person: Person, index: number) => (
                    <div key={index}>
                        #{index + 1} : {person.name} | Pay $
                        {person.shouldPay.toFixed(2)} | Receive $
                        {person.shouldReceive.toFixed(2)}
                        {/* | Paid {person.paid ? 'Yes' : 'No'} */}
                    </div>
                ))}
                <Button
                    variant="contained"
                    onClick={() => setPersonModalOpen(true)}
                >
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
                        <Button variant="contained" onClick={handleAddPerson}>
                            Add Person
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
