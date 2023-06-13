import React from "react";
import { Provider as PaperProvider, BottomNavigation } from 'react-native-paper';
import Dashboard from "../Dashboard";
import Account from "../Account";
import Incentive from "../Incentive";
import Earnings from "../Earnings";


const AccountRoute = () => <Account/>;
const Recents = () => <Earnings/>;
const Notification = () => <Incentive/>;



const Home=()=>{
    const [index, setIndex] = React.useState(2);
    
    const [routes] = React.useState([
        { key: 'dashboard', title: 'Home', focusedIcon: 'home', unfocusedIcon: 'home'},
        { key: 'incentives', title: 'Incentives', focusedIcon: 'gift', unfocusedIcon: 'gift-outline' },
        { key: 'earnings', title: 'Earnings', focusedIcon: 'cash' },
        { key: 'accounts', title: 'Account', focusedIcon: 'account' },
    ]);

    const renderScene = BottomNavigation.SceneMap({
        dashboard: Dashboard,
        accounts: AccountRoute,
        earnings: Recents,
        incentives: Notification,
        
  });
    return(
        <PaperProvider>
            <BottomNavigation
                navigationState={{ index, routes }}
                onIndexChange={setIndex}
                renderScene={renderScene}
                />
        </PaperProvider>
    )
}

export default Home