import { View, Text, TouchableOpacity } from "react-native";
import { useAuthStore } from "../../store/authStore";

const Home = () => {
    const { logout } = useAuthStore();
    return (
        <View>
            <Text>Home</Text>
            <TouchableOpacity onPress={() => logout()}>
                <Text>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Home;
