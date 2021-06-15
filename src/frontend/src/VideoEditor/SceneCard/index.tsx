import React from 'react'
import {Card, CardActions, CardContent, Input, Slider} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import IconButton from "@material-ui/core/IconButton";
import {useStyles} from "../style";
import DeleteIcon from "@material-ui/icons/Delete";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import Collapse from "@material-ui/core/Collapse";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import FormControl from "@material-ui/core/FormControl";
import {DurationType} from "../types";



export interface SceneCardProps {
    entryId: string;
    sceneName: string;
    moveLeft: () => void;
    moveRight: () => void;
    durationType: DurationType
    setDurationType: (newDurationType: DurationType) => void;
    fixedDisplayDuration: number;
    setFixedDisplayDuration: (newFixedDisplayDuration: number) => void;
    exceedDisplayDuration: number;
    setExceedDisplayDuration: (newExceedDisplayDuration: number) => void;
    spokenText: string;
    setSpokenText: (newSpokenText: string) => void;
    leftDisabled: boolean;
    rightDisabled: boolean;
    removeScene: () => void;
}

/**
 * Component for a draggable scene used in the interface of the videoEditor.
 */
export const SceneCard: React.FC<SceneCardProps> = (props) => {

    const classes = useStyles();

    //local copy of the displayDuration: sliding edits this while letting of the slider will edit the props value
    //avoids too many rerenders - for fixed duration
    const [localFixedDisplayDuration, setLocalFixedDisplayDuration] = React.useState(props.fixedDisplayDuration);
    //avoids too many rerenders - for exceed duration
    const [localExceedDisplayDuration, setLocalExceedDisplayDuration] = React.useState(props.exceedDisplayDuration);
    //timeout for setting the props value of fixedDisplayDuration shortly after the user has stopped input
    const [timeoutFixedDisplayDuration, setTimeoutFixedDisplayDuration] = React.useState(0);
    //timeout for setting the props value of exceedDisplayDuration shortly after the user has stopped input
    const [timeoutExceedDisplayDuration, setTimeoutExceedDisplayDuration] = React.useState(0);

    const handleFixedDurationSliderChange = (event: object, newDuration: number | number[]) => {
        setLocalFixedDisplayDuration(Number(newDuration));
        changePropsFixedDisplayDuration();
    }

    const handleFixedDurationInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLocalFixedDisplayDuration(Number(event.target.value))
        changePropsFixedDisplayDuration();
    }

    const handleExceedDurationSliderChange = (event: object, newDuration: number | number[]) => {
        setLocalExceedDisplayDuration(Number(newDuration));
        changePropsExceedDisplayDuration();
    }

    const handleExceedDurationInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLocalExceedDisplayDuration(Number(event.target.value))
        changePropsExceedDisplayDuration();
    }

    /**
     * Method that changes the fixedDisplayDuration state value of the higher component 200ms after the user has made a change.
     * Copies the local value into the higher components state. This avoids too many rerenders of the whole view.
     * When triggered again, it resets the timeout so there is a need for 200ms without an input.
     */
    const changePropsFixedDisplayDuration = () => {
        window.clearTimeout(timeoutFixedDisplayDuration);
        setTimeoutFixedDisplayDuration(window.setTimeout(() => {
            props.setFixedDisplayDuration(localFixedDisplayDuration);
        }, 200));
    }

    /**
     * Method that changes the exceedDisplayDuration state value of the higher component 200ms after the user has made a change.
     * Copies the local value into the higher components state. This avoids too many rerenders of the whole view.
     * When triggered again, it resets the timeout so there is a need for 200ms without an input.
     */
    const changePropsExceedDisplayDuration = () => {
        window.clearTimeout(timeoutExceedDisplayDuration);
        setTimeoutExceedDisplayDuration(window.setTimeout(() => {
            props.setExceedDisplayDuration(localExceedDisplayDuration);
        }, 200));
    }

    /* INFORMATION:
     * There is the known issue that the Material UI slider causes a violation in the Dev Console since.
     * According to the GitHub issue regarding this, it is okay to leave it: https://github.com/mui-org/material-ui/issues/26456
     */

    return (
        <Card variant="outlined" color="primary" style={{width: "300px"}}>
            <CardContent>
                <Grid item container>
                    <Grid item xs={10}>
                        <Typography>
                            {props.sceneName}
                        </Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <IconButton onClick={() => props.removeScene()} className={classes.redDeleteIcon}>
                            <DeleteIcon />
                        </IconButton>
                    </Grid>
                    <FormControl fullWidth>
                        <RadioGroup value={props.durationType} onChange={(e) => props.setDurationType(e.target.value as DurationType)}>
                            <Grid item xs={12}>
                                <FormControlLabel value="fixed" control={
                                    <Radio
                                    />
                                } label={"Feste Anzeigedauer"}
                                />
                                <Collapse in={props.durationType === "fixed"}>
                                    <Grid item container xs={12} className={classes.elementLargeMargin}>
                                        <Grid item xs={3}>
                                            <Typography variant="body1" id={props.sceneName + "-durationFixed-input"}>
                                                Dauer:
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={9}>
                                            <Slider
                                                value={localFixedDisplayDuration}
                                                getAriaValueText={() => props.fixedDisplayDuration + " Sekunden"}
                                                onChange={handleFixedDurationSliderChange}
                                                aria-labelledby={props.sceneName + "-durationFixed-input"}
                                                step={1}
                                                min={0}
                                                max={300}
                                                valueLabelDisplay="auto"

                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid item container xs={12}>
                                        <Grid item xs={3}>
                                            <Input
                                                value={localFixedDisplayDuration}
                                                margin="dense"
                                                onChange={handleFixedDurationInputChange}
                                                inputProps={{
                                                    step: 1,
                                                    min: 0,
                                                    max: 300,
                                                    type: 'number',
                                                    "aria-labelledby": props.sceneName + "-durationFixed-input",
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={9}>
                                            <Typography variant="body1">
                                                Sekunden
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Collapse>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel value="exceed" control={
                                    <Radio
                                    />
                                } label={"Zeit über Vorlesen hinaus"}
                                />
                                <Collapse in={props.durationType === "exceed"}>
                                    <Grid item container xs={12} className={classes.elementLargeMargin}>
                                        <Grid item xs={3}>
                                            <Typography variant="body1" id={props.sceneName + "-durationExceed-input"}>
                                                Dauer:
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={9}>
                                            <Slider
                                                value={localExceedDisplayDuration}
                                                getAriaValueText={() => props.exceedDisplayDuration + " Sekunden"}
                                                onChange={handleExceedDurationSliderChange}
                                                aria-labelledby={props.sceneName + "-durationExceed-input"}
                                                step={1}
                                                min={0}
                                                max={300}
                                                valueLabelDisplay="auto"

                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid item container xs={12}>
                                        <Grid item xs={3}>
                                            <Input
                                                value={localExceedDisplayDuration}
                                                margin="dense"
                                                onChange={handleExceedDurationInputChange}
                                                inputProps={{
                                                    step: 1,
                                                    min: 0,
                                                    max: 300,
                                                    type: 'number',
                                                    "aria-labelledby": props.sceneName + "-durationExceed-input",
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={9}>
                                            <Typography variant="body1">
                                                Sekunden
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Collapse>
                            </Grid>
                        </RadioGroup>
                    </FormControl>
                    <Grid item xs={12} className={classes.elementLargeMargin}>
                        <Typography>
                            Gesprochener Text: {props.spokenText}
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
            <CardActions>
                <Grid container justify="space-between">
                    <Grid item>
                        <IconButton disabled={props.leftDisabled} onClick={props.moveLeft}>
                            <ArrowBackIcon
                                fontSize="large"
                            />
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <IconButton disabled={props.rightDisabled} onClick={props.moveRight}>
                            <ArrowForwardIcon
                                fontSize="large"
                            />
                        </IconButton>
                    </Grid>
                </Grid>
            </CardActions>
        </Card>
    )

}
