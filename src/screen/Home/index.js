import React from "react";
import { Provider as PaperProvider, BottomNavigation } from 'react-native-paper';
import Account from "../Account";
import Incentive from "../Incentive";
import Earnings from "../Earnings";
import Duty from "../Duty";


const Home = () => {
    const [index, setIndex] = React.useState(0);

    const [routes] = React.useState([
        { key: 'dashboard', title: 'Home', focusedIcon: 'home', unfocusedIcon: 'home' },
        { key: 'incentives', title: 'Incentives', focusedIcon: 'gift', unfocusedIcon: 'gift-outline' },
        { key: 'earnings', title: 'Earnings', focusedIcon: 'cash' },
        { key: 'accounts', title: 'Account', data: { id: 23 }, focusedIcon: 'account' },
    ]);

    return (
        <PaperProvider>
            <BottomNavigation
                navigationState={{ index, routes }}
                onIndexChange={setIndex}
                renderScene={({ route }) => {
                    switch (route.key) {
                        case 'dashboard':
                            return <Duty/>;
                        case 'incentives':
                            return <Incentive/>;
                        case 'earnings':
                            return <Earnings/>;
                        case 'accounts':
                            return <Account/>;
                        default:
                            return null;
                    }
                }}
            />
        </PaperProvider>
    )
}

export default Home