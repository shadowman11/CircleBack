import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        display: "flex",
        justifyContent: 'center',
        alignItems: 'center',
        color: "white",
        backgroundColor: "#202020",
        height: "100%",
        width: "100%"
    },
    title: {
        margin: 10,
        marginBottom: 0,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: "white"
    },
    text: {
        margin: 10,
        fontSize: 16,
        color: "gray"
    },
    buttonText: {
        fontSize: 18,
        color: "#ffffff",
        fontWeight: "bold"
    },
    largeText: {
        fontSize: 30,
        color: "#ffffff",
        fontWeight: "bold"
    },
    textInput: {
        height: 35,
        borderColor: 'gray',
        borderWidth: 1,
        padding: 4,
        color: 'white',
        borderRadius: 5,
        minWidth: 35
    },
    activeButton: {
        width: 270,
        aspectRatio: "1",
        borderWidth: 5,
        borderColor: "#55aa33",
        backgroundColor: "#55aa3310",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "100%"
    },
    inactiveButton: {
        width: 270,
        aspectRatio: "1",
        borderWidth: 5,
        borderColor: "#ff9500",
        backgroundColor: "#ff950010",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "100%"
    },
    actionButton: {
        width: 100,
        height: 45,
        margin: 10,
        marginTop: 20,
        borderWidth: 1,
        borderColor: "#55aa33", 
        backgroundColor: "#55aa3310",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5,
    }
});

export { styles };