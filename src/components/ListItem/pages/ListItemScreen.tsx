import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Button, Divider, Text } from "@rneui/themed";
import { useSelector, useDispatch } from "react-redux";
import * as Yup from "yup";

import createListing from "../../../helper/listing/createListing";

import ListItemCondition from "../template/ListItemCondition";
import ListItemDetails from "../template/ListItemDetails";
import ListItemRedistribution from "../template/ListItemRedistribution";
import ListItemDealPref from "../template/ListItemDealPref";
import ListItemPhotos from "../template/ListItemPhotos";
import ListItemCategories from "../template/ListItemCategories";
import ListItemBidding from "../template/ListItemBidding";
import showToast from "../../Home/molecules/showToast";

const validationSchema = Yup.object().shape({
  imageUris: Yup.array()
    .required("At least one image is required")
    .min(1, "At least one image is required"),
  itemName: Yup.string().required("Item name is required"),
  itemCategory: Yup.string().required("Item category is required"),
  itemCondition: Yup.string().required("Item condition is required"),
  itemPrice: Yup.string().required("Item price is required"),
  isBid: Yup.boolean(),
  biddingDeadline: Yup.string().when("isBid", {
    is: true,
    then: (schema) =>
      schema.required("Bidding deadline is required when bidding is enabled"),
  }),
});

const initialState = {
  imageUris: [],
  itemCategory: "",
  itemName: "",
  itemDescription: "",
  itemCondition: "",
  itemConditionNote: "",
  itemRedistributionMethod: "Sell",
  itemPrice: "",
  itemRentingMinDays: "",
  itemRentingMaxDays: "",
  itemDeposit: "",
  isBid: false,
  biddingDeadline: "",
  autoRelist: false,
  paymentMethod: "",
  isOnlinePaymentEnabled: false,
  meetingAndCollection: "",
  itemLister: "",
  listTime: {},
};

export default function ListItemScreen({ navigation }: any) {
  const [formState, setFormState] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const user = useSelector<any, any>((state) => state.user.user);

  useEffect(() => {
    const dateString = new Date().toISOString();
    setFormState((prevState) => ({
      ...prevState,
      itemLister: user.id,
      listTime: dateString,
    }));
  }, []);

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const handleSetItems = (value: any, action: any) => {
    setFormState((prevState) => ({
      ...prevState,
      [action]: value,
    }));
    console.log(`${action}: `, value);
  };

  const validateForm = async () => {
    try {
      await validationSchema.validate(formState, { abortEarly: false });
      setValidationErrors({});
      return true;
    } catch (errors: any) {
      const validationErrors: Record<string, string> = {};
      errors.inner.forEach((error: any) => {
        validationErrors[error.path] = error.message;
      });
      setValidationErrors(validationErrors);
      return false;
    }
  };

  const onSubmit = async () => {
    const isValid = await validateForm();
    if (isValid) {
      try {
        setLoading(true);
        await createListing(formState);
        setLoading(false);
        showToast("Item listed successfully", "Green");
        navigation.navigate("Profile Tab");
      } catch (error) {
        showToast("Error listing item", "Red");
      }
    } else {
      console.log(validationSchema);
    }
  };

  const onCancel = () => {
    navigation.goBack();
  };

  const renderError = (field: string) => {
    return (
      validationErrors[field] && (
        <Text style={styles.errorText}>{validationErrors[field]}</Text>
      )
    );
  };

  return (
    <>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <ScrollView style={styles.scrollContainer} nestedScrollEnabled={true}>
          {/* PHOTOS */}
          <Text style={styles.text}>Photos</Text>
          <ListItemPhotos
            imageUris={formState.imageUris}
            handleSetItems={(value: any) => handleSetItems(value, "imageUris")}
          />
          {renderError("imageUris")}
          <Divider style={styles.dividerStyle} />
          {/* CATEGORY */}
          <Text style={styles.text}>Category</Text>
          <ListItemCategories
            category={formState.itemCategory}
            handleSetItems={(value: any) =>
              handleSetItems(value, "itemCategory")
            }
          />
          {renderError("itemCategory")}
          <Divider style={styles.dividerStyle} />
          {/* DETAILS */}
          <Text style={styles.text}>Details</Text>
          <ListItemDetails
            itemName={formState.itemName}
            itemDescription={formState.itemDescription}
            handleSetItems={(value: any, property: any) =>
              handleSetItems(value, property)
            }
          />
          {renderError("itemName")}
          <Divider style={styles.dividerStyle} />
          {/* CONDITION */}
          <Text style={styles.text}>Condition</Text>
          <ListItemCondition
            itemCondition={formState.itemCondition}
            itemConditionNote={formState.itemConditionNote}
            handleSetItems={(value: any, property: any) =>
              handleSetItems(value, property)
            }
          />
          {renderError("itemCondition")}
          {/* REDISTRIBUTION METHOD  */}
          <Divider style={styles.dividerStyle} />
          <Text style={styles.text}>
            Redistribution Method (Choose 1 method)
          </Text>
          <ListItemRedistribution
            itemRedistributionMethod={formState.itemRedistributionMethod}
            itemPrice={formState.itemPrice}
            itemRentingMinDays={formState.itemRentingMinDays}
            itemRentingMaxDays={formState.itemRentingMaxDays}
            itemDeposit={formState.itemDeposit}
            handleSetItems={(value: any, property: any) =>
              handleSetItems(value, property)
            }
          />
          {renderError("itemPrice")}
          <Divider style={styles.dividerStyle} />
          {/* BIDDING  */}
          <Text style={styles.text}>Bidding</Text>
          <ListItemBidding
            isBid={formState.isBid}
            biddingDeadline={formState.biddingDeadline}
            autoRelist={formState.autoRelist}
            handleSetItems={(value: any, action: any) =>
              handleSetItems(value, action)
            }
            redistributionMethod={formState.itemRedistributionMethod}
          />
          {renderError("biddingDeadline")}
          <Divider style={styles.dividerStyle} />
          {/* DEAL PREFERENCE  */}
          <Text style={styles.text}>Deal Preference</Text>
          <ListItemDealPref
            paymentMethod={formState.paymentMethod}
            meetingAndCollection={formState.meetingAndCollection}
            isOnlinePaymentEnabled={formState.isOnlinePaymentEnabled}
            handleSetItems={(value: any, action: any) =>
              handleSetItems(value, action)
            }
            redistributionMethod={formState.itemRedistributionMethod}
          />
          <View
            style={{ marginBottom: 10, marginTop: 50, marginHorizontal: 30 }}
          >
            <Button
              onPress={() => {
                onSubmit();
              }}
            >
              Add Listing
            </Button>
          </View>
          <View
            style={{ marginBottom: 100, marginTop: 20, marginHorizontal: 30 }}
          >
            <Button onPress={onCancel}>Cancel</Button>
          </View>
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: "#F8F9FB",
    flex: 1,
  },
  text: {
    fontWeight: "700",
    fontSize: 18,
    marginVertical: 5,
    marginHorizontal: 30,
    marginTop: 10,
    color: "#1C1C1C",
  },
  button: {
    marginVertical: 20,
    marginBottom: 150,
  },
  dividerStyle: {
    marginVertical: 20,
  },
  errorText: {
    color: "red",
    marginLeft: 30,
    marginVertical: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FB",
  },
});
