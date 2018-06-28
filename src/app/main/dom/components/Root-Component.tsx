import * as React from "react";
import {Loading} from "dom/view/Loading-View";
import {TopMenu} from "dom/components/TopMenu-Component";
import {sLoadingFinished} from "frp/Init-Sinks-FRP";
import {RootContext} from "dom/context/Root-Context";

interface Props {
    worker: any;
}

interface State {
    isLoading: boolean;
}

export class Root extends React.Component<Props, State> {
    private unlistener:() => void;
    
    readonly state: State = { isLoading: true };

    componentDidMount() {
        this.unlistener = sLoadingFinished.listen(() => {
            this.setState({isLoading: false}, this.unlistener)
        })
    }

    render() {
        return (
            <RootContext.Provider value={this.props.worker}>
                {this.state.isLoading 
                    ?   <Loading />
                    :   <TopMenu />
                }
            </RootContext.Provider>
        );
    }
}
