import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { launchCamera } from "react-native-image-picker";
import { AppContext } from "../../core/helper/AppContext";
import { get, patch } from "../../core/helper/services";
import FeatherIcon from "react-native-vector-icons/Feather";
import style from "./style";
import imagePath from "../../constants/imagePath";
import commonStyles from "../../constants/commonStyle";
import { DriverEnum } from "../../constants/enums";

const VerificationPage = () => {
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { globalData, setGlobalData } = useContext(AppContext);
  const [currentDoc, setCurrentDoc] = useState({
    documentName: "Aadhar",
    frontImageKey: "aadharFront",
    backImagKey: "aadharBack",
    index: 1,
  });

  useEffect(() => {
    if (globalData?.driverData) {
      if (globalData.driverData.isVerified === "2") {
        setCurrentDoc({
          ...currentDoc,
          index: 4,
        });
      }
    }
  }, [globalData]);

  const moveToNextDocument = () => {
    console.log(currentDoc.index);

    if (currentDoc.index < 3) {
      setCurrentDoc((prev) => {
        if (prev.index == 1) {
          return {
            documentName: "Driving License",
            frontImageKey: "dlFront",
            backImagKey: "dlBack",
            index: 2,
          };
        } else {
          return {
            documentName: "Registration Certificate",
            frontImageKey: "rcFront",
            backImagKey: "rcBack",
            index: 3,
          };
        }
      });
      setFrontImage(null);
      setBackImage(null);
    } else {
      saveAndUpdateGlobalData();
    }
  };

  const saveAndUpdateGlobalData = async () => {
    const queryParameter = `?driverId=${globalData.driverData.id}`;
    try {
      const driverData = await get("getDriver", queryParameter);
      if (driverData) {
        setGlobalData(DriverEnum.DRIVER_DATA, driverData[0]);
        setCurrentDoc({
          ...currentDoc,
          index: 4,
        });
        console.log("Driver data fetched and set globally");
      } else {
        console.warn("No driver data received");
      }
    } catch (error) {
      console.error("Error fetching driver data:", error);
    }
  };

  // Capture Image function (shared for both front and back)
  const captureImage = async (side) => {
    const options = {
      mediaType: "photo",
      quality: 0.8,
      includeBase64: true,
    };

    try {
      const result = await launchCamera(options);
      if (result.didCancel) {
        console.log(`${side} image capture cancelled`);
        return; // Avoid setting state when cancelled
      }
      if (result.errorCode) {
        console.error(`Error capturing ${side} image: `, result.errorMessage);
        return;
      }

      const image = result.assets[0]; // Extract the first image from result
      side === "front" ? setFrontImage(image) : setBackImage(image);
    } catch (error) {
      console.error("Error capturing image: ", error);
    }
  };

  // Clear Image function (generic for both images)
  const clearImage = (side) => {
    side === "front" ? setFrontImage(null) : setBackImage(null);
  };

  const uploadImages = async () => {
    if (!frontImage || !backImage) {
      Alert.alert("Please capture both front and back images of the document.");
      return;
    }

    setIsLoading(true);

    let documentData = {
      id: globalData.driverData.id,
    };
    documentData[currentDoc.frontImageKey] = frontImage.base64;
    documentData[currentDoc.backImagKey] = backImage.base64;

    if (currentDoc.index === 3) {
      documentData["isVerified"] = "2";
    }

    try {
      const data = await patch(documentData, "patchDriver");
      if (data) {
        console.log(data);
        moveToNextDocument();
      } else {
        Alert.alert("Failed to upload images.");
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      Alert.alert("Error uploading images.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {currentDoc.index === 4 && (
        <View style={style.submitContainer}>
          <Image
            style={{ height: 200, width: 300 }}
            source={imagePath.docReview}
          />
          <Text style={[style.headerText, { textAlign: "center" }]}>
            Your document is under review
          </Text>
          <Text style={[style.subHeaderText, { textAlign: "center" }]}>
            Your profile has been submitted & will be reviewed by our team. You
            will be notified if any extra information is needed.
          </Text>
        </View>
      )}
      {/* Front Image Section */}
      {currentDoc.index < 4 && (
        <>
          <View style={styles.section}>
          <Text> {currentDoc.documentName} Front</Text>
            <View style={style.uploadCardContainer}>
              {!frontImage && (
                <View style={style.uploadCard}>
                  <FeatherIcon name="upload" size={20} color="#888" />
                  <View style={{ marginBottom: 15 }}></View>
                  <Text style={style.mediumText}>
                    Front side of your {currentDoc.documentName}
                  </Text>
                  <View style={{ marginBottom: 5 }}></View>
                  <Text style={style.smallText}>
                    Upload the front side of your {currentDoc.documentName}
                  </Text>
                  <Text style={style.smallText}>Supports: JPG, PNG, PDF</Text>
                  <View style={{ marginBottom: 15 }}></View>
                  <Pressable
                    onPress={() => captureImage("front")}
                    style={style.uploadBtn}
                  >
                    <Text>Capture Front Image</Text>
                  </Pressable>
                </View>
              )}
            </View>
            {frontImage && (
              <View style={styles.imageContainer}>
                <Image source={{ uri: frontImage.uri }} style={styles.image} />
                <TouchableOpacity
                  style={style.clearBtn}
                  onPress={() => clearImage("front")}
                >
                  <Text style={styles.clearText}>Clear Front Image</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <View style={style.uploadCardContainer}>
              <Text> {currentDoc.documentName} Back</Text>
              {!backImage && (
                <View style={style.uploadCard}>
                  <FeatherIcon name="upload" size={20} color="#888" />
                  <View style={{ marginBottom: 15 }}></View>
                  <Text style={style.mediumText}>
                    Back side of your {currentDoc.documentName}
                  </Text>
                  <View style={{ marginBottom: 5 }}></View>
                  <Text style={style.smallText}>
                    Upload the back side of your {currentDoc.documentName}
                  </Text>
                  <Text style={style.smallText}>Supports: JPG, PNG, PDF</Text>
                  <View style={{ marginBottom: 15 }}></View>
                  <Pressable
                    onPress={() => captureImage("back")}
                    style={style.uploadBtn}
                  >
                    <Text>Capture Back Image</Text>
                  </Pressable>
                </View>
              )}
            </View>
            {backImage && (
              <View style={styles.imageContainer}>
                <Image source={{ uri: backImage.uri }} style={styles.image} />
                <TouchableOpacity
                  style={style.clearBtn}
                  onPress={() => clearImage("back")}
                >
                  <Text style={styles.clearText}>Clear Back Image</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Next Button */}
          <TouchableOpacity
            style={commonStyles.btnPrimary}
            onPress={uploadImages}
            disabled={isLoading}
          >
            <Text
              style={[
                commonStyles.fnt16Medium,
                commonStyles.textCenter,
                commonStyles.textWhite,
              ]}
            >
              {isLoading ? "Uploading..." : "Next"}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

// Externalize styles using StyleSheet
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 300,
  },
  clearText: {
    color: "red",
  },
});

export default VerificationPage;
