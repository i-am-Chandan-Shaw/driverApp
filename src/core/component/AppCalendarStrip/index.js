import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import style from './style';
import imagePath from '../../../constants/imagePath';

const AppCalendarStrip = () => {

    const [dateObj, setDateObj] = useState({
        minDate: '',
        maxDate: '',
        startingDate: ''
    })
    const currentDate = new Date();
    useEffect(() => {
        // Get the current date
        

        // Find the previous Monday
        let previousMonday = new Date(currentDate);
        previousMonday.setDate(currentDate.getDate() - (currentDate.getDay() + 6) % 7);

        // Iterate and print the dates until the last two Mondays
        let count = 0;
        while (count < 2) {

            previousMonday.setDate(previousMonday.getDate() - 7);
            count++;
        }

        setDateObj({
            minDate: previousMonday,
            maxDate: currentDate,
        })

    }, [])

    return (
        <View style={{marginTop:5}}>
            <CalendarStrip calendarAnimation={{ type: 'sequence', duration: 30 }}
                daySelectionAnimation={{ type: 'background', backgroundColor: '#fff', }}
                style={style.mainContainer}
                innerStyle={style.innerStyle}
                calendarColor={'#fff'}
                dateNumberStyle={{ color: '#000', fontSize: 10 }}
                dateNameStyle={{ color: '#000', fontSize: 10 }}
                highlightDateNumberStyle={{color:'#fff'}}
                highlightDateNameStyle={{color:'#fff'}}
                highlightDateContainerStyle={style.highlightedDate}
                showMonth={false}
                scrollable={true}
                startingDate={currentDate}
                selectedDate={currentDate}
                minDate={dateObj.minDate}
                maxDate={dateObj.maxDate}
                iconLeft={imagePath.arrowRight}
                iconRight={imagePath.arrowLeft}
                maxDayComponentSize={200}
                dayComponentHeight={50}
                iconContainer={style.iconContainer}
                iconStyle={{
                    flex: 1,
                    width: 40,
                    height: 40,
                    resizeMode: 'contain'
                }}
                numDaysInWeek={5}
                dayContainerStyle={style.dayContainer}
                onDateSelected={(e) => { console.log(e) }}
            />
        </View>
    )
}

export default AppCalendarStrip;