import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, BackHandler } from 'react-native';
import style from './style';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import { Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';



const RatingScreen = (props,{headerNav}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const navigation = useNavigation();
  let amount;
  let customerName;

  useEffect(() => {
    console.log(props.route.params.tripData);
    console.log(props.route.params.userData);
    
  }, [])

  const handleStarPress = (star) => {
    setRating(star);
  };

  const handleBackPress = () => {
    console.log('dsds');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
    return true
  }

  const handleSubmit = () => {
    // Here, you can submit the feedback (rating and comment) to your backend or perform any other actions.
    // For example, you can send the data using an API call.
    console.log('Rating:', rating);
    console.log('Comment:', comment);
    // Reset the rating and comment fields after submission
    setRating(0);
    setComment('');
  };

  return (
    <View style={style.container}>
      <View style={style.topContainer}>
        <View style={style.header}>
          <Avatar.Icon size={54} icon="account" />
          <Text style={[style.mediumText, { marginTop: 10 }]}> Rajib Koley</Text>
          <Text style={[style.boldText, { marginTop: 10 }]}> ₹ 450</Text>
        </View>
        {/* Star Rating */}
        <View style={style.starContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => handleStarPress(star)}>
              <FAIcon
                name={star <= rating ? 'star' : 'star-o'}
                size={40}
                color={star <= rating ? '#f1c40f' : '#aaa'}
                style={style.star}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Comment Textarea */}
        <Text style={[style.smallText, { marginTop: 10, marginBottom: 10 }]}> Leave a feedback</Text>
        <TextInput
          placeholder="Enter your feedback"
          value={comment}
          onChangeText={(text) => setComment(text)}
          multiline
          style={style.textarea}
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={style.button} onPress={handleSubmit}>
        <Text style={style.buttonText}>Submit Feedback</Text>
      </TouchableOpacity>
    </View>
  )
}

export default RatingScreen;