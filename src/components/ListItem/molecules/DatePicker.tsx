import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { useEffect, useState } from "react";
import DatePickerComponent from "react-native-modern-datepicker";
import { Input } from "@rneui/themed";

export default function DatePicker({ biddingDeadlineLocal, onClick }: any) {
  const [openModal, setOpenModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<null | any>(
    biddingDeadlineLocal
  );

  const handleChangeDate = (propDate: any) => {
    setSelectedDate(propDate);
  };

  const handleOnPressDate = () => {
    setOpenModal(!openModal);

    if (selectedDate !== biddingDeadlineLocal) {
      onClick(selectedDate);
    }
  };

  useEffect(() => {
    setSelectedDate(biddingDeadlineLocal);
  }, [biddingDeadlineLocal]);

  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <View style={{ width: "100%" }}>
        <Pressable onPress={() => setOpenModal(!openModal)}>
          <Input
            style={styles.text}
            labelStyle={styles.label}
            label="Bid Deadline"
            placeholder={
              biddingDeadlineLocal === ""
                ? "Set your bid deadline"
                : biddingDeadlineLocal
            }
            editable={false}
            onPressIn={handleOnPressDate}
          />
        </Pressable>
      </View>

      <Modal animationType="slide" transparent={true} visible={openModal}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <DatePickerComponent
              mode="calendar"
              selected={selectedDate}
              onDateChange={(date: any) => handleChangeDate(date)}
              onSelectedChange={(date: any) => handleChangeDate(date)}
              options={{
                backgroundColor: "#FFFFFF",
                textHeaderColor: "#469ab6",
                textDefaultColor: "#000000",
                selectedTextColor: "#000000",
                mainColor: "#469ab6",
                textSecondaryColor: "#000000",
                borderColor: "#FFFFFF",
              }}
            />

            <TouchableOpacity
              onPress={handleOnPressDate}
              style={{ paddingBottom: 20 }}
            >
              <Text style={{ color: "#469ab6" }}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  textHeader: {
    fontSize: 36,
    marginVertical: 60,
    color: "#111",
  },
  textSubHeader: {
    fontSize: 25,
    color: "#111",
  },
  inputBtn: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#222",
    height: 50,
    paddingLeft: 8,
    fontSize: 18,
    justifyContent: "center",
    marginTop: 14,
  },
  submitBtn: {
    backgroundColor: "#342342",
    paddingVertical: 22,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginVertical: 16,
  },
  centeredView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalView: {
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    padding: 15,
    width: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  label: {
    color: "#5A5A5A",
    fontWeight: "600",
  },
  text: {
    fontSize: 14,
  },
  picker: {
    height: 120,
    marginTop: -10,
  },
  button: {
    width: "90%",
  },
  iosButton: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
});
