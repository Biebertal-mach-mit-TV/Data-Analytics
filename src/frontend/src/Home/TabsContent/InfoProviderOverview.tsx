import React from "react";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import {Grid, IconButton, Typography} from "@material-ui/core";
import {ComponentContext} from "../../ComponentProvider";
import {hintContents} from "../../util/hintContents";
import {StepFrame} from "../../CreateInfoProvider/StepFrame";
import {useStyles} from "../style";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import {JobList} from "../../JobList";

interface InfoProviderOverviewProps {
    test: string;
}

export const InfoProviderOverview: React.FC<InfoProviderOverviewProps> = (props) => {

    const classes = useStyles();

    const components = React.useContext(ComponentContext);

    return(
        <StepFrame
            heading="Willkommen bei VisuAnalytics!"
            hintContent={hintContents.infoProviderOverview}
        >
            <Grid container justify="space-evenly" className={classes.elementLargeMargin}>
                <Grid item container xs={12}>
                    <Grid item xs={6}>
                        <Typography variant={"h5"}>
                            Übersicht definierter Info-Provider
                        </Typography>
                    </Grid>
                    <Grid item container xs={6} justify={"flex-end"}>
                        <Grid item>
                            <Button variant={"contained"} size={"large"} color={"secondary"}
                                    startIcon={<AddCircleIcon fontSize="small"/>}
                                    onClick={() => components?.setCurrent("createInfoProvider")}>
                                Neuer Info-Provider
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Box borderColor="primary.main" border={4} borderRadius={5}
                             className={classes.listFrame}>
                            Liste
                        </Box>
                    </Grid>
                    <Grid item container xs={12} justify={"space-evenly"}>
                        <Grid item>
                            <Button variant={"contained"} size={"large"} color={"primary"}>
                                Historisierungs-Datenbank
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant={"contained"} size={"large"} color={"primary"}>
                                Exportieren
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant={"contained"} size={"large"} color={"primary"}>
                                Bearbeiten
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </StepFrame>
    );

}
