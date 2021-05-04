import React, {ChangeEvent} from "react";
/*import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@material-ui/core";
import { JobList } from "../../JobList";
import { useStyles } from "./style";
import AddCircleIcon from "@material-ui/icons/AddCircle";*/
import { ComponentContext } from "../../../ComponentProvider";
/*import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { ExpandMore } from "@material-ui/icons";
import { PageTemplate } from "../../PageTemplate";*/
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CircularProgress from "@material-ui/core/CircularProgress";
import Input from '@material-ui/core/Input';
import {Web} from "@material-ui/icons";
import { MuiPickersUtilsProvider, TimePicker } from "@material-ui/pickers"
import DateFnsUtils from "@date-io/date-fns"
import { de } from "date-fns/locale"
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { KeyboardTimePicker } from "@material-ui/pickers";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import {useStyles} from "../../style";


interface HistoryDataSelectionProps {
    handleProceed: () => void;
    handleSkipProceed: () => void;
    handleBack: () => void;
    selectedData: Array<string>;
    customData: Array<any>;
    historizedData: Array<string>;
    setHistorizedData: (array: Array<string>) => void;
};

/**
 * Component displaying the second step in the creation of a new Info-Provider.
 * The state of this component handles the input made to its children.
 */
export const HistoryDataSelection: React.FC<HistoryDataSelectionProps>  = (props) => {
    const classes = useStyles();

    /**
     * Evaluates if data was selected and handle the proceed button based on it.
     * If data was selected, the time choice is presented, otherwise it is skipped.
     */
    const checkProceedMethod = () => {
        console.log(props.historizedData.length==0);
        if(props.historizedData.length==0) {
            props.handleSkipProceed();
        } else {
            props.handleProceed();
        }
    }

    /**
     * Adds an item to the set of selected list items
     * @param data The item to be added
     */
    const addToHistorySelection = (data: string) => {
        const arCopy = props.historizedData.slice();
        arCopy.push(data);
        props.setHistorizedData(arCopy);
    };

    /**
     * Removes an item from the set of selected list items
     * @param data The item to be removed
     */
    const  removeFromHistorySelection = (data: string) => {
        props.setHistorizedData(props.historizedData.filter((item) => {
            return item!== data;
        }));
    };

    /**
     * Method that handles clicking on a checkbox.
     * @param data The name of the list item key the checkbox was set for.
     */
    const checkboxHandler = (data: string) => {
        console.log(data);
        console.log(props.historizedData.includes(data));
        if (props.historizedData.includes(data)) {
            removeFromHistorySelection(data);
        } else {
            addToHistorySelection(data)
            console.log("new: " + props.historizedData.includes(data));
        }
        //console.log(props.selectedData.values().next())
    };


    /**
     * Renders an item of the list and returns the representation
     */
    const renderListItem = (item: string) => {
        return (
            <ListItem key={item} divider={true}>
                <ListItemIcon>
                    <FormControlLabel
                        control={
                            <Checkbox onClick={() => checkboxHandler(item)} checked={props.historizedData.includes(item)}/>
                        }
                        label={''}
                    />
                </ListItemIcon>
                <ListItemText
                    primary={item}
                    secondary={null}
                />
            </ListItem>
        )
    }

    //currently not containing custom data since it was not finished at that time
    return (
        <Grid container justify="space-around" className={classes.elementLargeMargin}>
            <Grid item xs={12}>
                <Typography variant="body1">
                    Bitte wählen sie die zu historisierenden Daten aus:
                </Typography>
            </Grid>
            <Grid item xs={10}>
                <Box borderColor="primary.main" border={4} borderRadius={5} className={classes.listFrame} key="listBox">
                    <List disablePadding={true} key="listRoot2">
                        {props.customData.map((item) => renderListItem(item))}
                        {props.selectedData.map((item) => renderListItem(item))}
                    </List>
                </Box>
            </Grid>
            <Grid item container xs={12} justify="space-between" className={classes.elementLargeMargin}>
                <Grid item>
                    <Button variant="contained" size="large" color="primary" onClick={props.handleBack}>
                        zurück
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" size="large" color="primary" onClick={checkProceedMethod}>
                        weiter
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    )
};