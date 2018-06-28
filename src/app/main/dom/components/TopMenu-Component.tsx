import * as React from "react";
import {Waiting, Bouncing} from "dom/view/TopMenu-View";
import {RootContext} from "dom/context/Root-Context";
import {WorkerCommands} from "types/Worker-Types";
interface State {
    phase: PHASE;
}

enum PHASE {
    WAITING,
    BOUNCING
}
export class TopMenu extends React.Component<{}, State> {
    readonly state:State = {phase: PHASE.WAITING}

    render() {

        return (
            <RootContext.Consumer>
            {worker => {
                switch(this.state.phase) {
                    case PHASE.WAITING:
                        return <Waiting 
                            onClick={() => {
                                this.setState({phase: PHASE.BOUNCING});
                                worker.postMessage({
                                    cmd: WorkerCommands.BALL_START,
                                });
                            }}
                        />;
                    case PHASE.BOUNCING:
                        return <Bouncing 
                            onClick={() => {
                                this.setState({phase: PHASE.WAITING});
                                worker.postMessage({
                                    cmd: WorkerCommands.BALL_STOP
                                });
                            }}
                        />;
                }
            }}
            
            </RootContext.Consumer>
        )
    }
}
