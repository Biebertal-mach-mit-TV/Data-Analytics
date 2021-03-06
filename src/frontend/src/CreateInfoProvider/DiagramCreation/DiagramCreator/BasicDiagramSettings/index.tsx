import React from "react";
import {useStyles} from "../../style";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Typography from "@material-ui/core/Typography";
import {InsertEmoticon, BugReport, Face, LinkedCamera, MailOutline} from "@material-ui/icons";
import TextField from "@material-ui/core/TextField";
import {Alert} from "@material-ui/lab";
import {ArrayDiagramProperties, diagramType} from "../../../types";
import {FormControlLabel} from "@material-ui/core";

interface BasicDiagramSettingsProps {
    arrayObjects?: Array<ArrayDiagramProperties>;
    diagramType: diagramType;
    setDiagramType: (type: diagramType) => void;
    amount: number;
    setAmount: (amount: number) => void;
}


/**
 * Component displaying the header section of the diagram creation.
 * Used in diagram creation with arrays as well as diagram creation with historized data.
 * Contains selection of the diagram type und amount of values to be used.
 */
export const BasicDiagramSettings: React.FC<BasicDiagramSettingsProps> = (props) => {
    const classes = useStyles();

    /**
     * Checks if the selected amount exceeds any of the array sizes.
     * Returns true if at least one does, false if none.
     */
    const evaluateAmount = () => {
        if (props.arrayObjects !== undefined) {
            for (let index = 0; index < props.arrayObjects!.length; index++) {
                if (props.amount > props.arrayObjects![index].listItem.arrayLength) return true;
            }
            return false;
        }
    }

    /**
     * Returns the diagram for the currently selected type be be displayed
     */
    const diagramIconSelector = () => {
        switch (props.diagramType) {
            case "verticalBarChart": {
                return (<InsertEmoticon style={{fontSize: 60}}/>)
            }
            case "horizontalBarChart": {
                return (<BugReport style={{fontSize: 60}}/>)
            }
            case "pieChart": {
                return (<Face style={{fontSize: 60}}/>)
            }
            case "dotDiagram": {
                return (<LinkedCamera style={{fontSize: 60}}/>)
            }
            case "lineChart": {
                return (<MailOutline style={{fontSize: 60}}/>)
            }
        }
    }

    /**
     * Handler method for changing the selected diagram type.
     * @param e The event that was caused by the change.
     */
    const diagramTypeChangeHandler = (e: React.ChangeEvent<{ value: unknown }>) => {
        props.setDiagramType(e.target.value as diagramType);
    }

    //TODO: possibly find better solution: backspace is not able to remove whole selection making it impossible to manually type a single digit without leading zero
    /**
     * Handler method for changing the selected amount.
     * @param e The event that was caused by the change.
     * Checks if the input is higher than 1 since the attributes alone cant prevent illegal keyboard inputs.
     */
    const amountHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (Number(e.target.value) >= 1) props.setAmount(Number(e.target.value))
    }

    return (
        <React.Fragment>
            <Grid item xs={12}>
                <Typography variant="body1">
                    Bitte wählen sie aus den zu erstellenden Diagrammtyp:
                </Typography>
            </Grid>
            <Grid item container xs={12} justify="space-between" className={classes.elementLargeMargin}>
                <Grid item xs={7}>
                    <FormControl fullWidth variant="outlined">
                        <Select
                            value={props.diagramType}
                            onChange={diagramTypeChangeHandler}
                        >
                            <MenuItem value={"verticalBarChart"}>Säulendiagramm</MenuItem>
                            <MenuItem value={"horizontalBarChart"}>Balkendiagramm</MenuItem>
                            <MenuItem value={"pieChart"}>Tortendiagramm</MenuItem>
                            <MenuItem value={"dotDiagram"}>Punktdiagramm</MenuItem>
                            <MenuItem value={"lineChart"}>Liniendiagramm</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={4}>
                    {diagramIconSelector()}
                </Grid>
            </Grid>
            <Grid item container xs={12} justify={props.arrayObjects !== undefined ? "flex-start" : "flex-start"}>
                <Grid item xs={4} className={classes.amountChoiceContainer}>
                    <FormControlLabel
                        className={classes.creatorFormControlLabel}
                        control={
                            <TextField type="number" variant="outlined" margin="normal" label="Anzahl"
                                       className={classes.inputFieldWithLabel} inputProps={{min: 1, max: 50}}
                                       value={props.amount} onChange={amountHandler}
                            />
                        }
                        label="Anzahl der Elemente:"
                        labelPlacement="start"
                    />
                </Grid>

                {props.arrayObjects !== undefined &&
                <Grid item xs={7} className={classes.amountWarningContainer}>
                    {evaluateAmount() &&
                    <Alert severity="warning">
                        <strong>Warnung:</strong> Die gewählte Anzahl überschreitet die Größe der Testdaten von
                        mindestens einem Array.
                    </Alert>
                    }
                </Grid>
                }
            </Grid>
        </React.Fragment>
    )
};
