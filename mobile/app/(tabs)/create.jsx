import {
    View,
    Text,
    KeyboardAvoidingView,
    ScrollView,
    TextInput,
    Platform,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import styles from "../../assets/styles/create.styles";
import Ionicons from "@expo/vector-icons/Ionicons";
import COLORS from "../../constants/colors";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useBookStore } from "../../store/bookStore";

const Create = () => {
    const router = useRouter();
    const { addBook } = useBookStore();

    const [title, setTitle] = useState("");
    const [caption, setCaption] = useState("");
    const [rating, setRating] = useState(3);
    const [image, setImage] = useState(null);
    const [imageBase64, setImageBase64] = useState(null);
    const [loading, setLoading] = useState(false);

    const pickImage = async () => {
        try {
            //request permission if needed
            if (Platform.OS !== "web") {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== "granted") {
                    Alert.alert(
                        "Permission denied",
                        "Sorry, we need camera roll permissions to upload an image!"
                    );
                    return;
                }
            }

            //launch image library
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: "images",
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.5,
                base64: true,
            });

            if (!result.canceled) {
                setImage(result.assets[0].uri);
                if (result.assets[0].base64) {
                    //if base64 is available, use it
                    setImageBase64(result.assets[0].base64);
                } else {
                    const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
                        encoding: FileSystem.EncodingType.Base64,
                    });
                    setImageBase64(base64);
                }
            }
            if (result.canceled) {
                Alert.alert("Image selection cancelled", "Please select an image to upload.");
            }
        } catch (error) {
            console.log("Error picking image:", error);
            Alert.alert("Error", "An error occurred while picking the image. Please try again.");
        }
    };

    const handleSubmit = async () => {
        if (!title || !caption || !imageBase64) {
            Alert.alert("Error", "Please fill in all fields and select an image.");
            return;
        }

        try {
            setLoading(true);

            const uriParts = image.split(".");
            const imageDataUrl = uriParts[uriParts.length - 1];

            const bookData = {
                title,
                caption,
                rating,
                image: imageDataUrl,
            };

            const result = await addBook(bookData);
            if (result.success) {
                Alert.alert("Success", "Book recommendation added successfully!");
                router.push("/(tabs)");
                setTitle("");
                setCaption("");
                setImage(null);
                setImageBase64(null);
                setRating(3);
            } else {
                Alert.alert("Error", result.error || "An error occurred while adding the book.");
            }
        } catch (error) {
            console.log("Error adding book:", error);
            Alert.alert("Error", "An error occurred while adding the book. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const renderRatingPicker = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <TouchableOpacity key={i} onPress={() => setRating(i)} styles={styles.starButton}>
                    <Ionicons
                        name={i <= rating ? "star" : "star-outline"}
                        size={32}
                        color={i <= rating ? "#f4b400" : COLORS.textSecondary}
                    />
                </TouchableOpacity>
            );
        }
        return <View style={styles.ratingContainer}>{stars}</View>;
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView contentContainerStyle={styles.container} style={styles.scrollViewStyle}>
                <View style={styles.card}>
                    {/* HEADER */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Add Book Recommendation</Text>
                        <Text style={styles.subtitle}>Share your favorite reads with others</Text>
                    </View>

                    <View style={styles.form}>
                        {/* BOOK TITLE */}
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Book Title</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons
                                    name="book-outline"
                                    size={20}
                                    color={COLORS.textSecondary}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter book title"
                                    value={title}
                                    onChangeText={setTitle}
                                />
                            </View>
                        </View>

                        {/* RATING */}
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Your Rating</Text>
                            {renderRatingPicker()}
                        </View>

                        {/* IMAGE */}
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Book Image</Text>
                            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                                {image ? (
                                    <Image source={{ uri: image }} style={styles.previewImage} />
                                ) : (
                                    <View style={styles.placeholderContainer}>
                                        <Ionicons
                                            name="image-outline"
                                            size={40}
                                            color={COLORS.textSecondary}
                                        />
                                        <Text style={styles.placeholderText}>
                                            Tap to select image
                                        </Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* CAPTION */}
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Caption</Text>
                            <TextInput
                                style={styles.textArea}
                                placeholder="Write a caption..."
                                placeholderTextColor={COLORS.textSecondary}
                                value={caption}
                                onChangeText={setCaption}
                                multiline
                            />
                        </View>

                        {/* SUBMIT BUTTON */}
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color={COLORS.white} />
                            ) : (
                                <>
                                    <Ionicons
                                        name="cloud-upload-outline"
                                        size={20}
                                        color={COLORS.white}
                                        style={styles.buttonIcon}
                                    />
                                    <Text style={styles.buttonText}>Share</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default Create;
