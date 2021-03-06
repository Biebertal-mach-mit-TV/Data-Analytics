import React from "react";
import {ArrayProcessing} from "../../CreateInfoProvider/DataCustomization/ArrayProcessing";
import {
    ArrayProcessingData, DataSource,
    Diagram,
    SelectedDataItem,
    StringReplacementData
} from "../../CreateInfoProvider/types";
import {FormelObj} from "../../CreateInfoProvider/DataCustomization/CreateCustomData/CustomDataGUI/formelObjects/FormelObj";
import {StringProcessing} from "../../CreateInfoProvider/DataCustomization/StringProcessing";
import {FormelContext} from "../types";
import {EditCustomData} from "./EditCustomData/EditCustomData";



interface EditDataCustomizationProps {
    continueHandler: () => void;
    backHandler: () => void;
    dataCustomizationStep: number;
    setDataCustomizationStep: (step: number) => void;
    reportError: (message: string) => void;
    infoProvName: string;
    infoProvDataSources: Array<DataSource>;
    setInfoProvDataSources: (dataSources: Array<DataSource>) => void;
    selectedDataSource: number;
    infoProvDiagrams: Array<Diagram>;
    setInfoProvDiagrams: (array: Array<Diagram>) => void;
    setHistorizedData: (array: Array<string>) => void;
    setSelectedData: (array: Array<SelectedDataItem>) => void;
    setCustomData: (array: Array<FormelObj>) => void;
    setArrayProcessingsList: (processings: Array<ArrayProcessingData>) => void;
    setStringReplacementList: (replacements: Array<StringReplacementData>) => void;
    finishEditing: () => void;
    checkForHistorizedData: () => void;
    setFormelInformation: (formelInformation: FormelContext) => void;
}

/**
 * Wrapper component for the three steps of data customization: Array processing, formula creation, string processing.
 */
export const EditDataCustomization: React.FC<EditDataCustomizationProps> = (props) => {
    //const classes = useStyles();


    /**
     * Method that selects the contents to be displayed based on the current step.
     */
    const getContents = () => {
        switch(props.dataCustomizationStep) {
            case 0: {
                return (
                    <ArrayProcessing
                        continueHandler={() => props.setDataCustomizationStep(props.dataCustomizationStep + 1)}
                        backHandler={props.backHandler}
                        reportError={props.reportError}
                        arrayProcessingsList={props.infoProvDataSources[props.selectedDataSource].arrayProcessingsList}
                        setArrayProcessingsList={props.setArrayProcessingsList}
                        stringReplacementList={props.infoProvDataSources[props.selectedDataSource].stringReplacementList}
                        listItems={props.infoProvDataSources[props.selectedDataSource].listItems}
                        customData={props.infoProvDataSources[props.selectedDataSource].customData}
                        setCustomData={props.setCustomData}
                        diagrams={props.infoProvDiagrams}
                        setDiagrams={props.setInfoProvDiagrams}
                        historizedData={props.infoProvDataSources[props.selectedDataSource].historizedData}
                        setHistorizedData={props.setHistorizedData}
                        apiName={props.infoProvDataSources[props.selectedDataSource].apiName}
                    />
                )
            }
            case 1: {
                return (
                    <EditCustomData
                        continueHandler={() => props.setDataCustomizationStep(props.dataCustomizationStep + 1)}
                        backHandler={() => props.setDataCustomizationStep(props.dataCustomizationStep - 1)}
                        editInfoProvider={props.finishEditing}
                        infoProvDataSources={props.infoProvDataSources}
                        setInfoProvDataSources={props.setInfoProvDataSources}
                        selectedDataSource={props.selectedDataSource}
                        checkForHistorizedData={props.checkForHistorizedData}
                        setFormelInformation={props.setFormelInformation}
                        infoProvName={props.infoProvName}
                        infoProvDiagrams={props.infoProvDiagrams}
                        setInfoProvDiagrams={props.setInfoProvDiagrams}
                    />
                )
            }
            case 2: {
                return (
                    <StringProcessing
                        continueHandler={props.continueHandler}
                        backHandler={() => props.setDataCustomizationStep(props.dataCustomizationStep - 1)}
                        reportError={props.reportError}
                        stringReplacementList={props.infoProvDataSources[props.selectedDataSource].stringReplacementList}
                        setStringReplacementList={props.setStringReplacementList}
                        arrayProcessingsList={props.infoProvDataSources[props.selectedDataSource].arrayProcessingsList}
                        listItems={props.infoProvDataSources[props.selectedDataSource].listItems}
                        customData={props.infoProvDataSources[props.selectedDataSource].customData}
                        setCustomData={props.setCustomData}
                        diagrams={props.infoProvDiagrams}
                        setDiagrams={props.setInfoProvDiagrams}
                        historizedData={props.infoProvDataSources[props.selectedDataSource].historizedData}
                        setHistorizedData={props.setHistorizedData}
                        apiName={props.infoProvDataSources[props.selectedDataSource].apiName}
                    />
                )
            }
        }
    }



    return(
        <React.Fragment>
            {getContents()}
        </React.Fragment>
    );
}
