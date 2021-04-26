import React, {useCallback} from "react";
import {
    Container,
    List,
    ListItem,
    ListItemIcon,
    ListItemText, Paper,
    Typography,
} from "@material-ui/core";
import { JobList } from "../JobList";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { ComponentContext } from "../ComponentProvider";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { ExpandMore } from "@material-ui/icons";
import { PageTemplate } from "../PageTemplate";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { BasicSettings } from "./BasicSettings";
import {useStyles} from "../Home/style";
import JobCreate from "../JobCreate";
import { useCallFetch } from "../Hooks/useCallFetch";
import { TypeSelection } from "./TypeSelection";
import { HistoryScheduleSelection } from "./HistoryScheduleSelection";
import {DataSelection} from "./DataSelection";
import {CreateCustomData} from "./CreateCustomData";
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';


/*
Wrapper component for the creation of a new info-provider.
This component manages which step is active and displays the corresponding content.
 */
export const CreateInfoProvider = () => {
    //const classes = useStyles();
    const steps = [
        "Datenquellen-Typ",
        "API-Einstellungen",
        "Datenauswahl",
        "Historisierung",
        "Gesamtübersicht"
    ];
    //the current step of the creation process, numbered by 0 to 4
    const [step, setStep] = React.useState(1);
    //holds the data delivered from the currently created API
    const [apiData, setApiData] = React.useState({});
    //selected Data from DataSelection
    const [selectedData, setSelectedData] = React.useState(new Set<string>());


    /**
     * Method that checks if the given name is already in use for a data source in this info-provider
     * @param name Name that should be checked.
     * Return true if the name is already in use for this Info-Provider
     */
    const checkNameDuplicate = (name: string) => {
        //if(name is contained) return true
        //else return false
        return false //TODO: to be removed when the check is implemented
    }


    const handleContinue = () => {
        setStep(step+1);
    }

    const handleBack = () => {
        //TODO: if step==0, return to dashboard context
        setStep(step-1)
    }


    const selectContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <div>
                        <TypeSelection
                            continueHandler={handleContinue}
                            backHandler={handleBack}
                        />
                    </div>
                );
            case 1:
                return (
                    <BasicSettings
                        continueHandler={handleContinue}
                        backHandler={handleBack}
                        setApiData={setApiData}
                        checkNameDuplicate={checkNameDuplicate}
                    />
                );
            case 2:
                return (
                    <div>
                        <DataSelection
                            continueHandler={handleContinue}
                            backHandler={handleBack}
                            selectedData={selectedData}
                            setSelectedData={(set: Set<string>) => setSelectedData(set)}
                        />
                    </div>
                );
            case 3:
                return (
                    <div>
                        <CreateCustomData
                            continueHandler={handleContinue}
                            backHandler={handleBack}
                            selectedData={selectedData}
                            setSelectedData={(set: Set<string>) => setSelectedData(set)}
                        />
                    </div>
                )
            case 4:
                return (
                    <div>
                        <HistoryScheduleSelection
                        />
                    </div>
                )
        }
    }
    return (
        <React.Fragment>
            <Container maxWidth={"md"}>
                <Stepper activeStep={step}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Container>
            {selectContent(step)}
        </React.Fragment>
    );
}
