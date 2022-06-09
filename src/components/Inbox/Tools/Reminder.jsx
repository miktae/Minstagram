import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import DateTimePicker from "react-datetime-picker/dist/entry.nostyle";
import styles from './Tools.module.css';
import  "./DateTime.css"

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function Reminder() {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [value, setValue] = useState('');
    const [val, onPick] = useState(new Date());

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    return (
        <div>
            <i className="fa-solid fa-user-clock"
                onClick={handleOpen}></i>
            <Modal

                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className={styles.reminderModal}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Create Reminder
                    </Typography>
                    <TextField
                        id="filled-multiline-flexible"
                        label="Enter content"
                        fullWidth
                        value={value}
                        onChange={handleChange}
                        placeholder="Enter your message here"
                    />
                    <Typography id="modal-modal-description" variant="body2" component="p">
                        Choose date of reminder
                    </Typography>
                    <DateTimePicker onChange={onPick} value={val} />
                    <Typography id="modal-modal-description" variant="body2" component="p">
                        Choose repeat type
                    </Typography>
                    <select name="repeat" id="repeat" className={styles.select}>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                    <div className={styles.buttonView}>
                        <Button variant="contained">Create Reminder</Button>
                        <Button onClick={handleClose}>Cancel</Button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}
